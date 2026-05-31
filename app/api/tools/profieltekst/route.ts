import { NextRequest, NextResponse } from 'next/server';
import { generateProfieltekst, ProfieltekstInput } from '@/lib/tools/profieltekst';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const huidigeFunctie = typeof body.huidigeFunctie === 'string' ? body.huidigeFunctie.trim() : '';
        const doelrol = typeof body.doelrol === 'string' ? body.doelrol.trim() : '';
        const competenties = typeof body.competenties === 'string' ? body.competenties.trim() : '';
        const ervaringJaren = typeof body.ervaringJaren === 'string' ? body.ervaringJaren.trim() : '';
        const toon = body.toon === 'enthousiast' || body.toon === 'beknopt' ? body.toon : 'professioneel';

        if (!huidigeFunctie || !doelrol) {
            return NextResponse.json(
                { error: 'Huidige functie en doelrol zijn verplicht.' },
                { status: 400 }
            );
        }

        const input: ProfieltekstInput = { huidigeFunctie, doelrol, competenties, ervaringJaren, toon };
        const profieltekst = await generateProfieltekst(input);

        return NextResponse.json({ profieltekst });
    } catch (err) {
        console.error('profieltekst error:', err);
        return NextResponse.json(
            { error: 'Genereren mislukt. Probeer het opnieuw.' },
            { status: 500 }
        );
    }
}
