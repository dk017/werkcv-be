import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/cv-parser';
import { analyzeAts } from '@/lib/tools/ats-checker';
import { checkRateLimit, getClientIp } from '@/lib/tools/rate-limit';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TEXT_LENGTH = 50_000;         // 50k chars — well above any real CV
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
];
const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx']);

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
        const contentType = request.headers.get('content-type') ?? '';
        let cvText = '';

        if (contentType.includes('multipart/form-data')) {
            // ── File upload mode ────────────────────────────────────────────
            const formData = await request.formData();
            const file = formData.get('file') as File | null;

            if (!file) {
                return NextResponse.json({ error: 'Geen bestand geüpload.' }, { status: 400 });
            }

            // Validate MIME type (client-supplied but provides first filter)
            if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                return NextResponse.json(
                    { error: 'Alleen PDF of Word-bestanden zijn toegestaan.' },
                    { status: 400 }
                );
            }

            // Validate file extension (secondary check — not client-controlled)
            const ext = file.name.toLowerCase().split('.').pop() ?? '';
            if (!ALLOWED_EXTENSIONS.has(ext)) {
                return NextResponse.json(
                    { error: 'Alleen bestanden met extensie .pdf, .doc of .docx zijn toegestaan.' },
                    { status: 400 }
                );
            }

            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json({ error: 'Bestand is te groot. Maximaal 5 MB.' }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            cvText = await extractTextFromFile(buffer, file.name);

        } else {
            // ── JSON text paste mode ────────────────────────────────────────
            const body = await request.json();
            const raw = typeof body.cvText === 'string' ? body.cvText : '';
            cvText = raw.trim().slice(0, MAX_TEXT_LENGTH);
        }

        if (!cvText || cvText.length < 50) {
            return NextResponse.json(
                { error: 'CV-tekst is te kort om te analyseren (minimaal 50 tekens).' },
                { status: 400 }
            );
        }

        const result = await analyzeAts(cvText);
        return NextResponse.json(result);

    } catch (err) {
        console.error('ats-checker error:', err);
        // Return generic message — never expose internal error details
        return NextResponse.json(
            { error: 'Analyse mislukt. Probeer het opnieuw.' },
            { status: 500 }
        );
    }
}
