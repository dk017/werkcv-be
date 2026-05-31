import { NextRequest, NextResponse } from 'next/server';
import { translateJobTitle } from '@/lib/tools/job-title-translator';
import { checkRateLimit, getClientIp } from '@/lib/tools/rate-limit';

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

        const titel = typeof body.titel === 'string' ? body.titel.trim().slice(0, 120) : '';
        const richting = body.richting === 'en-nl' ? 'en-nl' : 'nl-en';

        if (!titel) return NextResponse.json({ error: 'Functietitel is verplicht.' }, { status: 400 });

        const result = await translateJobTitle(titel, richting);
        return NextResponse.json(result);
    } catch (err) {
        console.error('job-title-translator error:', err);
        return NextResponse.json({ error: 'Vertaling mislukt. Probeer het opnieuw.' }, { status: 500 });
    }
}
