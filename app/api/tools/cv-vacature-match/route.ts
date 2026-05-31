import { NextRequest, NextResponse } from 'next/server';
import { matchCvVacature } from '@/lib/tools/cv-vacature-match';
import { checkRateLimit, getClientIp } from '@/lib/tools/rate-limit';
import { extractTextFromFile } from '@/lib/cv-parser';

const MAX_TEXT_LENGTH = 5000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
];

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
        return NextResponse.json(
            { error: 'Te veel aanvragen. Probeer het over een uur opnieuw.' },
            { status: 429 }
        );
    }

    try {
        const contentType = request.headers.get('content-type') || '';
        let cvText = '';
        let vacatureText = '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const cvFile = formData.get('cvFile');
            vacatureText = typeof formData.get('vacatureText') === 'string'
                ? String(formData.get('vacatureText')).trim().slice(0, MAX_TEXT_LENGTH)
                : '';

            if (!(cvFile instanceof File)) {
                return NextResponse.json({ error: 'Upload een PDF of Word-bestand van je CV.' }, { status: 400 });
            }

            if (!ALLOWED_FILE_TYPES.includes(cvFile.type)) {
                return NextResponse.json({ error: 'Ongeldig bestandstype. Upload een PDF of Word document.' }, { status: 400 });
            }

            if (cvFile.size > MAX_FILE_SIZE) {
                return NextResponse.json({ error: 'Bestand is te groot. Maximale grootte is 10MB.' }, { status: 400 });
            }

            const bytes = await cvFile.arrayBuffer();
            const extractedText = await extractTextFromFile(Buffer.from(bytes), cvFile.name);
            cvText = extractedText.trim().slice(0, MAX_TEXT_LENGTH);
        } else {
            const body = await request.json();
            cvText = typeof body.cvText === 'string'
                ? body.cvText.trim().slice(0, MAX_TEXT_LENGTH)
                : '';
            vacatureText = typeof body.vacatureText === 'string'
                ? body.vacatureText.trim().slice(0, MAX_TEXT_LENGTH)
                : '';
        }

        if (!cvText || cvText.length < 50) {
            return NextResponse.json({ error: 'CV-tekst is te kort (minimaal 50 tekens).' }, { status: 400 });
        }
        if (!vacatureText || vacatureText.length < 50) {
            return NextResponse.json({ error: 'Vacaturetekst is te kort (minimaal 50 tekens).' }, { status: 400 });
        }

        const result = await matchCvVacature(cvText, vacatureText);
        return NextResponse.json(result);
    } catch (err) {
        console.error('cv-vacature-match error:', err);
        return NextResponse.json({ error: 'Analyse mislukt. Probeer het opnieuw.' }, { status: 500 });
    }
}
