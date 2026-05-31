import { NextRequest, NextResponse } from 'next/server';
import { generateSollicitatieQuiz } from '@/lib/tools/sollicitatiegesprek-quiz';
import { checkRateLimit, getClientIp } from '@/lib/tools/rate-limit';

const MAX_FIELD = 120;

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

        const functietitel = typeof body.functietitel === 'string' ? body.functietitel.trim().slice(0, MAX_FIELD) : '';
        const sector = typeof body.sector === 'string' ? body.sector.trim().slice(0, MAX_FIELD) : '';
        const ervaringsniveau =
            body.ervaringsniveau === 'junior' || body.ervaringsniveau === 'senior'
                ? body.ervaringsniveau
                : 'medior';

        if (!functietitel) return NextResponse.json({ error: 'Functietitel is verplicht.' }, { status: 400 });

        const result = await generateSollicitatieQuiz(functietitel, sector, ervaringsniveau);
        return NextResponse.json(result);
    } catch (err) {
        console.error('sollicitatiegesprek-quiz error:', err);
        return NextResponse.json({ error: 'Genereren mislukt. Probeer het opnieuw.' }, { status: 500 });
    }
}
