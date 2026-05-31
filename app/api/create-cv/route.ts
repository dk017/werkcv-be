import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultCV, cvSchema } from '@/lib/cv';
import { sanitizeAttribution } from '@/lib/attribution';
import { Prisma } from '@prisma/client';
import { getCurrentUserFromRequest } from '@/lib/auth';

function getCreateCvErrorMessage(error: unknown): string {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'ECONNREFUSED') {
        return 'Database connection refused. Start PostgreSQL and try again.';
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return 'Database is unavailable. Check DATABASE_URL and PostgreSQL status.';
    }
    return 'Failed to create CV document';
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
        return NextResponse.json(
            { error: 'Authentication required', code: 'AUTH_REQUIRED' },
            { status: 401 }
        );
    }

    let templateId = 'professional';
    let colorThemeId = 'classic-blue';
    let cvData = defaultCV;
    let attribution: ReturnType<typeof sanitizeAttribution> = null;
    let startSource = '';

    try {
        const body = await request.json();
        if (body.templateId) templateId = body.templateId;
        if (body.colorThemeId) colorThemeId = body.colorThemeId;
        if (body.startSource) startSource = body.startSource;
        attribution = sanitizeAttribution(body.attribution);

        // Support pre-populating with example CV data
        if (body.initialData) {
            const parsed = cvSchema.safeParse(body.initialData);
            if (parsed.success) {
                cvData = parsed.data;
            }
        }
    } catch {
        // No body or invalid JSON, use defaults
    }

    const baseData = {
        title: 'Mijn CV',
        data: cvData,
        templateId,
        colorThemeId,
    };

    try {
        const cv = await prisma.cVDocument.create({
            data: {
                ...baseData,
                attribution: attribution as unknown as Prisma.InputJsonValue | undefined,
                sourceCluster: attribution?.firstTouchCluster || null,
                sourceLocale: attribution?.locale || null,
                startSource: startSource || null,
                userId: user.id,
            } as unknown as Prisma.CVDocumentCreateInput,
        });
        return NextResponse.json({ cvId: cv.id });
    } catch {
        try {
            // Backward-compatible fallback if DB migration has not been applied yet
            const cv = await prisma.cVDocument.create({
                data: {
                    ...baseData,
                    userId: user.id,
                },
            });
            return NextResponse.json({ cvId: cv.id });
        } catch (error) {
            console.error('Failed to create CV document:', error);
            const message = getCreateCvErrorMessage(error);
            return NextResponse.json(
                { error: message },
                { status: 500 }
            );
        }
    }
}
