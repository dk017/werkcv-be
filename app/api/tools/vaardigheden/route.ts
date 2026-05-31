import { NextRequest, NextResponse } from 'next/server';
import { generateVaardigheden, VaardigheidInput } from '@/lib/tools/vaardigheden';
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
        const soort = body.soort === 'hard' || body.soort === 'soft' ? body.soort : 'beide';

        if (!functietitel) {
            return NextResponse.json({ error: 'Functietitel is verplicht.' }, { status: 400 });
        }

        const input: VaardigheidInput = { functietitel, sector, soort };
        const vaardigheden = await generateVaardigheden(input);

        return NextResponse.json({ vaardigheden });
    } catch (err) {
        console.error('vaardigheden error:', err);
        return NextResponse.json({ error: 'Genereren mislukt. Probeer het opnieuw.' }, { status: 500 });
    }
}
