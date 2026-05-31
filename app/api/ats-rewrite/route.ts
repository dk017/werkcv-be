import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CVData } from '@/lib/cv';
import { rewriteCVForATS } from '@/lib/ats-rewrite';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required', code: 'AUTH_REQUIRED' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const cvId = typeof body.cvId === 'string' ? body.cvId : '';
        const targetRole = typeof body.targetRole === 'string' ? body.targetRole : '';
        const jobDescription = typeof body.jobDescription === 'string' ? body.jobDescription : '';
        const preferredLanguage =
            body.preferredLanguage === 'nl' || body.preferredLanguage === 'en'
                ? body.preferredLanguage
                : undefined;

        if (!cvId) {
            return NextResponse.json({ error: 'cvId is required' }, { status: 400 });
        }

        const cv = await prisma.cVDocument.findFirst({
            where: { id: cvId, userId: user.id },
        });

        if (!cv) {
            return NextResponse.json({ error: 'CV not found' }, { status: 404 });
        }

        const rewritten = await rewriteCVForATS(cv.data as CVData, {
            targetRole,
            jobDescription,
            preferredLanguage,
        });

        await prisma.cVDocument.update({
            where: { id: cv.id },
            data: {
                data: rewritten,
            },
        });

        return NextResponse.json({
            success: true,
            data: rewritten,
        });
    } catch (error) {
        console.error('ATS rewrite failed', error);
        if (error instanceof Error && error.message === 'ATS_REWRITE_LANGUAGE_MISMATCH') {
            return NextResponse.json(
                {
                    error: 'ATS rewrite output did not match the requested language',
                    code: 'ATS_LANGUAGE_MISMATCH',
                },
                { status: 422 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to rewrite CV for ATS', code: 'ATS_REWRITE_ERROR' },
            { status: 500 }
        );
    }
}
