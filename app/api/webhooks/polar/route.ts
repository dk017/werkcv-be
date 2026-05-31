import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { reportOpsIncident } from '@/lib/ops-alerts';
import { CV_DOWNLOAD_PRODUCT, CV_PROFILE_PHOTO_BUNDLE_PRODUCT } from '@/lib/polar';

const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET;
const SUPPORTED_ADDONS = new Set(['ats-rewrite', 'cover-letter', 'localization-polish']);

type PrismaWithAttributionExtensions = typeof prisma & {
    cVDocument: {
        findUnique: (args: { where: { id: string }; select: Record<string, boolean> }) => Promise<{
            attribution?: unknown;
            sourceCluster?: string | null;
        } | null>;
    };
    order: {
        create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
    };
    analyticsEvent?: {
        create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    };
};

function toHeaderRecord(headers: Headers): Record<string, string> {
    const entries = Array.from(headers.entries()).map(([key, value]) => [key.toLowerCase(), value] as const);
    return Object.fromEntries(entries);
}

function readCvId(metadata: Record<string, string | number | boolean>): string | null {
    const raw = metadata.cv_id;
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'number') return String(raw);
    return null;
}

function readMetadataString(metadata: Record<string, string | number | boolean>, key: string): string | null {
    const raw = metadata[key];
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'number') return String(raw);
    return null;
}

function readAddons(metadata: Record<string, string | number | boolean>): string[] {
    const raw = metadata.addons_csv;
    if (typeof raw !== 'string' || !raw.trim()) return [];
    return raw
        .split(',')
        .map((value) => value.trim())
        .filter((value) => SUPPORTED_ADDONS.has(value));
}

export async function POST(request: NextRequest) {
    const prismaWithAttributionExtensions = prisma as unknown as PrismaWithAttributionExtensions;

    if (!WEBHOOK_SECRET) {
        console.error('POLAR_WEBHOOK_SECRET is not configured');
        await reportOpsIncident({
            event: 'ops_payment_webhook_failed',
            route: '/api/webhooks/polar',
            stage: 'missing_webhook_secret',
            error: new Error('POLAR_WEBHOOK_SECRET is not configured'),
            notifyUser: false,
        });
        return NextResponse.json(
            { error: 'Webhook not configured' },
            { status: 500 }
        );
    }

    const rawBody = await request.text();

    let event;
    try {
        event = validateEvent(rawBody, toHeaderRecord(request.headers), WEBHOOK_SECRET);
    } catch (error) {
        if (error instanceof WebhookVerificationError) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        console.error('Failed to validate Polar webhook event', error);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (event.type !== 'order.paid') {
        return NextResponse.json({ status: 'ignored' });
    }

    const externalOrderId = event.data.id;
    const metadata = event.data.metadata || {};
    const product = readMetadataString(metadata, 'product');
    const projectId = readMetadataString(metadata, 'project_id');
    const cvId = readCvId(metadata);
    const addons = readAddons(metadata);
    const email = event.data.customer.email;
    const amountCents = event.data.totalAmount;
    const currency = event.data.currency || 'EUR';

    const existingOrder = await prisma.order.findUnique({
        where: { lemonId: externalOrderId },
    });

    if (existingOrder) {
        return NextResponse.json({ status: 'already_processed' });
    }

    if (product === 'profile-photo' || projectId) {
        if (!projectId) {
            console.error('No project_id found in Polar profile photo metadata');
            await reportOpsIncident({
                event: 'ops_payment_webhook_failed',
                route: '/api/webhooks/polar',
                stage: 'missing_profile_photo_project_id_metadata',
                error: new Error('Missing project_id metadata'),
                userEmail: email,
                notifyUser: false,
                context: {
                    polarOrderId: externalOrderId,
                    metadata,
                },
            });
            return NextResponse.json({ error: 'Missing project_id metadata' }, { status: 400 });
        }

        const project = await prisma.profilePhotoProject.findUnique({
            where: { id: projectId },
            include: { user: true },
        });

        if (!project) {
            await reportOpsIncident({
                event: 'ops_payment_webhook_failed',
                route: '/api/webhooks/polar',
                stage: 'profile_photo_project_not_found',
                error: new Error('Profile photo project not found'),
                userEmail: email,
                notifyUser: false,
                context: {
                    polarOrderId: externalOrderId,
                    projectId,
                    metadata,
                },
            });
            return NextResponse.json({ error: 'Profile photo project not found' }, { status: 404 });
        }

        const order = await prisma.order.create({
            data: {
                email,
                product: 'profile-photo',
                amountCents,
                currency,
                attribution: (project.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
                sourceCluster: project.user.sourceCluster || null,
                lemonId: externalOrderId,
                paidAt: new Date(),
            },
        });

        await prisma.profilePhotoProject.update({
            where: { id: project.id },
            data: {
                status: 'paid',
                orderId: order.id,
            },
        });

        const paidProperties = {
            projectId: project.id,
            orderId: order.id,
            amountCents,
            currency,
            polarOrderId: externalOrderId,
            product: 'profile-photo',
        };

        try {
            await prisma.analyticsEvent.create({
                data: {
                    event: 'profile_photo_paid',
                    orderId: order.id,
                    path: '/profielfoto-cv-maken',
                    cluster: project.user.sourceCluster || null,
                    properties: paidProperties as unknown as Prisma.InputJsonValue,
                    attribution: (project.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
                },
            });
            await prisma.analyticsEvent.create({
                data: {
                    event: 'checkout_completed',
                    orderId: order.id,
                    path: '/profielfoto-cv-maken',
                    cluster: project.user.sourceCluster || null,
                    properties: paidProperties as unknown as Prisma.InputJsonValue,
                    attribution: (project.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
                },
            });
        } catch (error) {
            console.error('profile_photo_paid_event_persist_failed', error);
        }

        return NextResponse.json({ status: 'ok' });
    }

    if (!cvId) {
        console.error('No cv_id found in Polar order metadata');
        await reportOpsIncident({
            event: 'ops_payment_webhook_failed',
            route: '/api/webhooks/polar',
            stage: 'missing_cv_id_metadata',
            error: new Error('Missing cv_id metadata'),
            userEmail: email,
            notifyUser: false,
            context: {
                polarOrderId: externalOrderId,
                metadata,
            },
        });
        return NextResponse.json({ error: 'Missing cv_id metadata' }, { status: 400 });
    }

    const cvDocument = await prismaWithAttributionExtensions.cVDocument.findUnique({
        where: { id: cvId },
        select: {
            attribution: true,
            sourceCluster: true,
        },
    });

    const orderProduct = product === CV_PROFILE_PHOTO_BUNDLE_PRODUCT
        ? CV_PROFILE_PHOTO_BUNDLE_PRODUCT
        : CV_DOWNLOAD_PRODUCT;

    let order;
    try {
        order = await prismaWithAttributionExtensions.order.create({
            data: {
                email,
                cvId,
                product: orderProduct,
                amountCents,
                currency,
                addons,
                attribution: (cvDocument?.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
                sourceCluster: cvDocument?.sourceCluster || null,
                lemonId: externalOrderId,
                paidAt: new Date(),
            },
        });
    } catch (error) {
        await reportOpsIncident({
            event: 'ops_payment_webhook_failed',
            route: '/api/webhooks/polar',
            stage: 'order_create_fallback',
            error,
            cvId,
            userEmail: email,
            cluster: cvDocument?.sourceCluster || null,
            notifyUser: false,
            context: {
                polarOrderId: externalOrderId,
                amountCents,
                currency,
                addons,
                product: orderProduct,
            },
        });
        order = await prisma.order.create({
            data: {
                email,
                cvId,
                product: orderProduct,
                lemonId: externalOrderId,
                paidAt: new Date(),
            },
        });
    }

    const paidProperties = {
        cvId,
        orderId: order.id,
        amountCents,
        currency,
        addons,
        product: orderProduct,
        polarOrderId: externalOrderId,
    };

    try {
        await prismaWithAttributionExtensions.analyticsEvent?.create({
            data: {
                event: 'paid',
                cvId,
                orderId: order.id,
                cluster: cvDocument?.sourceCluster || null,
                properties: paidProperties as unknown as Prisma.InputJsonValue,
                attribution: (cvDocument?.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
            },
        });
    } catch (error) {
        console.error('paid_event_persist_failed', error);
        await reportOpsIncident({
            event: 'ops_payment_webhook_failed',
            route: '/api/webhooks/polar',
            stage: 'paid_event_persist_failed',
            error,
            cvId,
            orderId: order.id,
            userEmail: email,
            cluster: cvDocument?.sourceCluster || null,
            notifyUser: false,
            context: {
                polarOrderId: externalOrderId,
            },
        });
    }

    try {
        await prismaWithAttributionExtensions.analyticsEvent?.create({
            data: {
                event: 'checkout_completed',
                cvId,
                orderId: order.id,
                cluster: cvDocument?.sourceCluster || null,
                properties: paidProperties as unknown as Prisma.InputJsonValue,
                attribution: (cvDocument?.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
            },
        });
    } catch (error) {
        console.error('checkout_completed_event_persist_failed', error);
        await reportOpsIncident({
            event: 'ops_payment_webhook_failed',
            route: '/api/webhooks/polar',
            stage: 'checkout_completed_event_persist_failed',
            error,
            cvId,
            orderId: order.id,
            userEmail: email,
            cluster: cvDocument?.sourceCluster || null,
            notifyUser: false,
            context: {
                polarOrderId: externalOrderId,
            },
        });
    }

    console.log(
        JSON.stringify({
            type: 'analytics',
            event: 'paid',
            properties: paidProperties,
            cluster: cvDocument?.sourceCluster || null,
        })
    );

    return NextResponse.json({ status: 'ok' });
}
