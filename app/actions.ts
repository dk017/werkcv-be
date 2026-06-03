'use server'

import { prisma } from '@/lib/prisma'
import { cvSchema, CVData, defaultCV } from '@/lib/cv'
import { buildCheckoutURL, CheckoutAddon, CheckoutProduct, parseCheckoutAddons, parseCheckoutProduct } from '@/lib/polar'
import { buildDodoCheckoutURL, isDodoEnabledForCheckout } from '@/lib/dodo'
import { getCurrentUser } from '@/lib/auth'
import { reportOpsIncident } from '@/lib/ops-alerts'
import { getResumeLanguage } from '@/lib/resume-language'

const userCVListSelect = {
    id: true,
    title: true,
    templateId: true,
    colorThemeId: true,
    data: true,
    updatedAt: true,
};

const paidOrderSelect = {
    cvId: true,
};

type UserCVListItem = {
    id: string;
    title: string;
    templateId: string;
    colorThemeId: string | null;
    data: unknown;
    updatedAt: Date;
};

type PaidOrderItem = {
    cvId: string | null;
};

export type CheckoutUrlResult =
    | { ok: true; url: string }
    | {
        ok: false;
        code: 'AUTH_REQUIRED' | 'NOT_FOUND' | 'CHECKOUT_FAILED';
        reason?: string;
        supportNotified?: boolean;
    };

export async function createCV(templateId: string = 'professional', colorThemeId: string = 'classic-blue', initialData?: CVData) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('AUTH_REQUIRED');
    }

    // Validate initial data if provided, otherwise use blank default
    let cvData = defaultCV;
    if (initialData) {
        const parsed = cvSchema.safeParse(initialData);
        if (parsed.success) {
            cvData = parsed.data;
        }
    }

    const cv = await prisma.cVDocument.create({
        data: {
            title: 'Mijn CV',
            data: cvData,
            templateId,
            colorThemeId,
            userId: user.id,
        }
    })
    return cv.id
}

export async function getCV(id: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    const cv = await prisma.cVDocument.findFirst({ where: { id, userId: user.id } })
    if (!cv) return null
    return cv.data as unknown as CVData
}

export async function getCVWithSettings(id: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    const cv = await prisma.cVDocument.findFirst({ where: { id, userId: user.id } })
    if (!cv) return null
    return {
        data: cv.data as unknown as CVData,
        templateId: cv.templateId,
        colorThemeId: cv.colorThemeId ?? 'classic-blue',
    }
}

export async function updateCV(id: string, data: CVData) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'AUTH_REQUIRED' };

    const parsed = cvSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error }

    const updated = await prisma.cVDocument.updateMany({
        where: { id, userId: user.id },
        data: { data: parsed.data }
    })
    if (updated.count === 0) return { success: false, error: 'NOT_FOUND' };
    return { success: true }
}

export async function updateCVTemplate(id: string, templateId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'AUTH_REQUIRED' };

    const updated = await prisma.cVDocument.updateMany({
        where: { id, userId: user.id },
        data: { templateId }
    })
    if (updated.count === 0) return { success: false, error: 'NOT_FOUND' };
    return { success: true }
}

export async function updateCVColorTheme(id: string, colorThemeId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'AUTH_REQUIRED' };

    const updated = await prisma.cVDocument.updateMany({
        where: { id, userId: user.id },
        data: { colorThemeId }
    })
    if (updated.count === 0) return { success: false, error: 'NOT_FOUND' };
    return { success: true }
}

export async function checkPaymentStatus(cvId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    const owned = await prisma.cVDocument.findFirst({
        where: { id: cvId, userId: user.id },
        select: { id: true },
    });
    if (!owned) return false;

    const order = await prisma.order.findFirst({
        where: {
            cvId: cvId,
            paidAt: { not: null },
        },
    })
    return !!order
}

export async function getUserCVs() {
    const user = await getCurrentUser();
    if (!user) return [];

    const cvs = await prisma.cVDocument.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        select: userCVListSelect,
    });

    const cvIds = cvs.map((cv: UserCVListItem) => cv.id);
    const paidOrders = await prisma.order.findMany({
        where: { cvId: { in: cvIds }, paidAt: { not: null } },
        select: paidOrderSelect,
    });
    const paidCvIds = new Set(
        paidOrders.flatMap((order: PaidOrderItem) => (order.cvId ? [order.cvId] : []))
    );

    return cvs.map((cv: UserCVListItem) => ({
        ...cv,
        isPaid: paidCvIds.has(cv.id),
    }));
}

export async function deleteCV(id: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false };

    await prisma.cVDocument.deleteMany({ where: { id, userId: user.id } });
    return { success: true };
}

export async function getCheckoutURL(
    cvId: string,
    email?: string,
    addons: CheckoutAddon[] = [],
    checkoutProduct: CheckoutProduct = 'cv-download'
): Promise<CheckoutUrlResult> {
    const user = await getCurrentUser();
    if (!user) {
        return { ok: false, code: 'AUTH_REQUIRED' };
    }
    const owned = await prisma.cVDocument.findFirst({
        where: { id: cvId, userId: user.id },
        select: {
            id: true,
            data: true,
            sourceCluster: true,
            sourceLocale: true,
            startSource: true,
        },
    });
    if (!owned) {
        return { ok: false, code: 'NOT_FOUND' };
    }

    const safeAddons = parseCheckoutAddons(addons);
    const safeProduct = parseCheckoutProduct(checkoutProduct);
    const resumeLanguage = getResumeLanguage(owned.data as CVData);
    const paymentProvider = isDodoEnabledForCheckout(safeProduct, safeAddons) ? 'dodo' : 'polar';
    try {
        let url: string;
        if (paymentProvider === 'dodo') {
            const checkout = await buildDodoCheckoutURL(cvId, email || user.email, resumeLanguage);
            url = checkout.checkoutUrl;

            if (checkout.sessionId) {
                try {
                    await prisma.paymentCheckout.upsert({
                        where: { externalCheckoutId: checkout.sessionId },
                        update: {
                            cvId,
                            email: email || user.email,
                            siteHost: checkout.siteHost,
                            product: safeProduct,
                        },
                        create: {
                            provider: 'dodo',
                            externalCheckoutId: checkout.sessionId,
                            cvId,
                            email: email || user.email,
                            siteHost: checkout.siteHost,
                            product: safeProduct,
                        },
                    });
                } catch (persistError) {
                    console.error('dodo_checkout_session_persist_failed', persistError);
                }
            }
        } else {
            url = await buildCheckoutURL(cvId, email || user.email, safeAddons, resumeLanguage, safeProduct);
        }
        return { ok: true, url };
    } catch (error) {
        const { supportNotified } = await reportOpsIncident({
            event: 'ops_checkout_create_failed',
            route: '/app/actions#getCheckoutURL',
            stage: `${paymentProvider}_checkout_create`,
            error,
            cvId,
            userId: user.id,
            userEmail: user.email,
            cluster: owned.sourceCluster,
            startSource: owned.startSource,
            locale: owned.sourceLocale === 'en' ? 'en' : 'nl',
            notifyUser: true,
            context: {
                addons: safeAddons,
                product: safeProduct,
                paymentProvider,
            },
        });

        return {
            ok: false,
            code: 'CHECKOUT_FAILED',
            reason: error instanceof Error ? error.message.slice(0, 160) : 'unknown',
            supportNotified,
        };
    }
}
