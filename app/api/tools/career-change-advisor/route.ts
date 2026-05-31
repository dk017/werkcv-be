import { NextRequest, NextResponse } from 'next/server';
import { generateCareerChangeAdvice, CareerChangeInput } from '@/lib/tools/career-change-advisor';
import { checkRateLimit, getClientIp } from '@/lib/tools/rate-limit';

const MAX_FIELD = 120;
const MAX_MOTIVATIE = 600;

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
        const huidigeSector = typeof body.huidigeSector === 'string' ? body.huidigeSector.trim().slice(0, MAX_FIELD) : '';
        const doelRol = typeof body.doelRol === 'string' ? body.doelRol.trim().slice(0, MAX_FIELD) : '';
        const doelSector = typeof body.doelSector === 'string' ? body.doelSector.trim().slice(0, MAX_FIELD) : '';
        const ervaringJaren = typeof body.ervaringJaren === 'string' ? body.ervaringJaren.trim().slice(0, 20) : '';
        const motivatie = typeof body.motivatie === 'string' ? body.motivatie.trim().slice(0, MAX_MOTIVATIE) : '';

        if (!huidigeRol) return NextResponse.json({ error: 'Huidige rol is verplicht.' }, { status: 400 });
        if (!doelRol) return NextResponse.json({ error: 'Doelrol is verplicht.' }, { status: 400 });

        const input: CareerChangeInput = { huidigeRol, huidigeSector, doelRol, doelSector, ervaringJaren, motivatie };
        const result = await generateCareerChangeAdvice(input);
        return NextResponse.json(result);
    } catch (err) {
        console.error('career-change-advisor error:', err);
        return NextResponse.json({ error: 'Advies genereren mislukt. Probeer het opnieuw.' }, { status: 500 });
    }
}
