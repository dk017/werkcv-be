import { NextRequest, NextResponse } from 'next/server';
import { generateSollicitatiebrief } from '@/lib/tools/sollicitatiebrief';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const naam = typeof body.naam === 'string' ? body.naam.trim() : '';
        const doelrol = typeof body.doelrol === 'string' ? body.doelrol.trim() : '';
        const bedrijfsnaam = typeof body.bedrijfsnaam === 'string' ? body.bedrijfsnaam.trim() : '';
        const motivatie = typeof body.motivatie === 'string' ? body.motivatie.trim() : '';
        const toon = body.toon === 'enthousiast' || body.toon === 'beknopt' ? body.toon : 'professioneel';

        if (!doelrol || !motivatie || motivatie.length < 20) {
            return NextResponse.json(
                { error: 'Doelrol en een korte motivatie zijn verplicht.' },
                { status: 400 }
            );
        }

        const brief = await generateSollicitatiebrief({ naam, doelrol, bedrijfsnaam, motivatie, toon });

        return NextResponse.json({ brief });
    } catch (err) {
        console.error('sollicitatiebrief error:', err);
        return NextResponse.json(
            { error: 'Genereren mislukt. Probeer het opnieuw.' },
            { status: 500 }
        );
    }
}
