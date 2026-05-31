import { NextRequest, NextResponse } from 'next/server';
import { generateOpzeggingsbrief } from '@/lib/tools/opzeggingsbrief';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const naam = typeof body.naam === 'string' ? body.naam.trim() : '';
        const adres = typeof body.adres === 'string' ? body.adres.trim() : '';
        const werkgever = typeof body.werkgever === 'string' ? body.werkgever.trim() : '';
        const functie = typeof body.functie === 'string' ? body.functie.trim() : '';
        const datumBrief = typeof body.datumBrief === 'string' ? body.datumBrief.trim() : '';
        const datumEinde = typeof body.datumEinde === 'string' ? body.datumEinde.trim() : '';

        if (!naam || !werkgever || !functie || !datumEinde) {
            return NextResponse.json(
                { error: 'Naam, werkgever, functie en einddatum zijn verplicht.' },
                { status: 400 }
            );
        }

        const brief = generateOpzeggingsbrief({ naam, adres, werkgever, functie, datumBrief, datumEinde });

        return NextResponse.json({ brief });
    } catch (err) {
        console.error('opzeggingsbrief error:', err);
        return NextResponse.json(
            { error: 'Genereren mislukt. Probeer het opnieuw.' },
            { status: 500 }
        );
    }
}
