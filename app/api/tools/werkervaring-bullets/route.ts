import { NextRequest, NextResponse } from 'next/server';
import { generateWerkervaringBullets } from '@/lib/tools/werkervaring-bullets';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const functietitel = typeof body.functietitel === 'string' ? body.functietitel.trim() : '';
        const bedrijf = typeof body.bedrijf === 'string' ? body.bedrijf.trim() : '';
        const werkzaamheden = typeof body.werkzaamheden === 'string' ? body.werkzaamheden.trim() : '';

        if (!functietitel || !werkzaamheden || werkzaamheden.length < 20) {
            return NextResponse.json(
                { error: 'Functietitel en een beschrijving van je werkzaamheden zijn verplicht.' },
                { status: 400 }
            );
        }

        const bullets = await generateWerkervaringBullets({ functietitel, bedrijf, werkzaamheden });

        return NextResponse.json({ bullets });
    } catch (err) {
        console.error('werkervaring-bullets error:', err);
        return NextResponse.json(
            { error: 'Genereren mislukt. Probeer het opnieuw.' },
            { status: 500 }
        );
    }
}
