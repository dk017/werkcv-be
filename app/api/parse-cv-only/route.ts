import { NextRequest, NextResponse } from 'next/server';
import { parseCV } from '@/lib/cv-parser';
import { getCvParsePublicMessage, recordCvParseFailure } from '@/lib/cv-upload-observability';
import { getCurrentUserFromRequest } from '@/lib/auth';

/**
 * API endpoint that parses a CV file and returns the structured data
 * WITHOUT saving to the database. Used by the editor upload feature.
 */
export async function POST(request: NextRequest) {
    let file: File | null = null;
    let userId: string | null = null;
    let stage = 'auth';

    try {
        const user = await getCurrentUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required', code: 'AUTH_REQUIRED' },
                { status: 401 }
            );
        }
        userId = user.id;

        stage = 'read_form_data';
        const formData = await request.formData();
        file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'Geen bestand geüpload' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Ongeldig bestandstype. Upload een PDF of Word document.' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'Bestand is te groot. Maximale grootte is 10MB.' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Parse CV with OpenAI
        stage = 'parse_cv';
        const cvData = await parseCV(buffer, file.name);

        return NextResponse.json({
            success: true,
            data: cvData,
            message: 'CV succesvol verwerkt',
        });

    } catch (error) {
        console.error('CV parse error:', { stage, userId, fileName: file?.name, error });
        await recordCvParseFailure({
            route: '/api/parse-cv-only',
            stage,
            userId,
            file,
            error,
        });

        const locale = request.headers.get('referer')?.includes('/en/') ? 'en' : 'nl';
        const message = getCvParsePublicMessage(error, locale);

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
