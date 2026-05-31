import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CVData } from '@/lib/cv';
import { generateCoverLetter } from '@/lib/cover-letter';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
        return NextResponse.json(
            { error: 'Authentication required', code: 'AUTH_REQUIRED' },
            { status: 401 }
        );
    }

    const cvId = request.nextUrl.searchParams.get('cvId');
    if (!cvId) {
        return NextResponse.json({ error: 'cvId is required' }, { status: 400 });
    }

    const cv = await prisma.cVDocument.findFirst({
        where: { id: cvId, userId: user.id },
        select: {
            id: true,
            coverLetter: true,
            coverLetterUpdatedAt: true,
        },
    });

    if (!cv) {
        return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        coverLetter: cv.coverLetter || '',
        updatedAt: cv.coverLetterUpdatedAt,
    });
}

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
        const companyName = typeof body.companyName === 'string' ? body.companyName : '';
        const jobDescription = typeof body.jobDescription === 'string' ? body.jobDescription : '';
        const tone =
            body.tone === 'enthusiastic' || body.tone === 'concise' ? body.tone : 'professional';

        if (!cvId) {
            return NextResponse.json({ error: 'cvId is required' }, { status: 400 });
        }

        const cv = await prisma.cVDocument.findFirst({
            where: { id: cvId, userId: user.id },
        });

        if (!cv) {
            return NextResponse.json({ error: 'CV not found' }, { status: 404 });
        }

        const coverLetter = await generateCoverLetter(cv.data as CVData, {
            targetRole,
            companyName,
            jobDescription,
            tone,
        });

        const updated = await prisma.cVDocument.update({
            where: { id: cvId },
            data: {
                coverLetter,
                coverLetterUpdatedAt: new Date(),
            },
            select: {
                coverLetter: true,
                coverLetterUpdatedAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            coverLetter: updated.coverLetter || '',
            updatedAt: updated.coverLetterUpdatedAt,
        });
    } catch (error) {
        console.error('Cover letter generation failed', error);
        return NextResponse.json(
            { error: 'Failed to generate cover letter', code: 'COVER_LETTER_ERROR' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
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
        const coverLetter = typeof body.coverLetter === 'string' ? body.coverLetter : '';

        if (!cvId) {
            return NextResponse.json({ error: 'cvId is required' }, { status: 400 });
        }

        const cv = await prisma.cVDocument.findFirst({
            where: { id: cvId, userId: user.id },
            select: { id: true },
        });

        if (!cv) {
            return NextResponse.json({ error: 'CV not found' }, { status: 404 });
        }

        const updated = await prisma.cVDocument.update({
            where: { id: cvId },
            data: {
                coverLetter,
                coverLetterUpdatedAt: new Date(),
            },
            select: {
                coverLetter: true,
                coverLetterUpdatedAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            coverLetter: updated.coverLetter || '',
            updatedAt: updated.coverLetterUpdatedAt,
        });
    } catch (error) {
        console.error('Cover letter save failed', error);
        return NextResponse.json(
            { error: 'Failed to save cover letter', code: 'COVER_LETTER_SAVE_ERROR' },
            { status: 500 }
        );
    }
}
