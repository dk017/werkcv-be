import { NextRequest, NextResponse } from 'next/server';
import { scanKeywords, cvDataToText } from '@/lib/keyword-scan';
import { CVData } from '@/lib/cv';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const jobDescription = typeof body.jobDescription === 'string' ? body.jobDescription.trim() : '';
        const cvData: CVData | null = body.cvData ?? null;

        if (!jobDescription || jobDescription.length < 20) {
            return NextResponse.json(
                { error: 'Vacaturetekst is te kort. Plak de volledige vacature.' },
                { status: 400 }
            );
        }

        const cvText = cvData ? cvDataToText(cvData) : '';
        const result = await scanKeywords(jobDescription, cvText);

        return NextResponse.json(result);
    } catch (err) {
        console.error('keyword-scan error:', err);
        return NextResponse.json(
            { error: 'Analyse mislukt. Probeer het opnieuw.' },
            { status: 500 }
        );
    }
}
