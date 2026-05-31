import { NextRequest, NextResponse } from 'next/server';
import { generateCvKeywords, CvKeywordsInput } from '@/lib/tools/cv-keywords';
import { checkRateLimit, getClientIp } from '@/lib/tools/rate-limit';

const MAX_FIELD_LENGTH = 120;

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
        const body = await request.json();

        const functietitel = typeof body.functietitel === 'string'
            ? body.functietitel.trim().slice(0, MAX_FIELD_LENGTH)
            : '';
        const sector = typeof body.sector === 'string'
            ? body.sector.trim().slice(0, MAX_FIELD_LENGTH)
            : '';
        const ervaringsniveau =
            body.ervaringsniveau === 'junior' || body.ervaringsniveau === 'senior'
                ? body.ervaringsniveau
                : 'medior';

        if (!functietitel) {
            return NextResponse.json({ error: 'Functietitel is verplicht.' }, { status: 400 });
        }

        const input: CvKeywordsInput = { functietitel, sector, ervaringsniveau };
        const categories = await generateCvKeywords(input);

        return NextResponse.json({ categories });
    } catch (err) {
        console.error('cv-keywords error:', err);
        return NextResponse.json({ error: 'Genereren mislukt. Probeer het opnieuw.' }, { status: 500 });
    }
}
