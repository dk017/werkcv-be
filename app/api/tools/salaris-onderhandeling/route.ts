import { NextRequest, NextResponse } from 'next/server';
import { generateSalarisOnderhandeling, SalarisOnderhandelingInput } from '@/lib/tools/salaris-onderhandeling';
import { checkRateLimit, getClientIp } from '@/lib/tools/rate-limit';

const MAX_FIELD = 120;
const MAX_STERKTE = 600;

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

        const huidigeRol = typeof body.huidigeRol === 'string' ? body.huidigeRol.trim().slice(0, MAX_FIELD) : '';
        const sector = typeof body.sector === 'string' ? body.sector.trim().slice(0, MAX_FIELD) : '';
        const ervaringJaren = typeof body.ervaringJaren === 'string' ? body.ervaringJaren.trim().slice(0, 20) : '';
        const huidigSalaris = typeof body.huidigSalaris === 'string' ? body.huidigSalaris.trim().slice(0, 20) : '';
        const gewenstSalaris = typeof body.gewenstSalaris === 'string' ? body.gewenstSalaris.trim().slice(0, 20) : '';
        const sterktepunten = typeof body.sterktepunten === 'string' ? body.sterktepunten.trim().slice(0, MAX_STERKTE) : '';

        if (!huidigeRol) return NextResponse.json({ error: 'Huidige rol is verplicht.' }, { status: 400 });
        if (!gewenstSalaris) return NextResponse.json({ error: 'Gewenst salaris is verplicht.' }, { status: 400 });
        if (!sterktepunten) return NextResponse.json({ error: 'Sterktepunten zijn verplicht.' }, { status: 400 });

        const input: SalarisOnderhandelingInput = { huidigeRol, sector, ervaringJaren, huidigSalaris, gewenstSalaris, sterktepunten };
        const result = await generateSalarisOnderhandeling(input);
        return NextResponse.json(result);
    } catch (err) {
        console.error('salaris-onderhandeling error:', err);
        return NextResponse.json({ error: 'Genereren mislukt. Probeer het opnieuw.' }, { status: 500 });
    }
}
