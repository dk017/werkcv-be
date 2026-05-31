import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CvVacatureMatchResult {
    matchScore: number;
    label: string;
    labelKleur: 'rood' | 'oranje' | 'geel' | 'groen';
    samenvatting: string;
    sterkePunten: string[];
    ontbrekendeKeywords: string[];
    verbeterpunten: string[];
    aanbeveling: string;
}

export async function matchCvVacature(cvText: string, vacatureText: string): Promise<CvVacatureMatchResult> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 1000,
        messages: [
            {
                role: 'system',
                content: `Je bent een Nederlandse recruiter die CV's vergelijkt met vacatures.
Analyseer hoe goed het CV aansluit bij de vacature en geef concrete feedback.

Geef het resultaat als JSON met dit exacte formaat:
{
  "matchScore": <getal 0-100>,
  "label": <"Zwakke match" | "Redelijke match" | "Goede match" | "Uitstekende match">,
  "labelKleur": <"rood" | "oranje" | "geel" | "groen">,
  "samenvatting": "<2-3 zinnen over de match>",
  "sterkePunten": ["<punt 1>", "<punt 2>", "<punt 3>"],
  "ontbrekendeKeywords": ["<keyword 1>", "<keyword 2>", ...],
  "verbeterpunten": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "aanbeveling": "<1-2 zinnen concrete aanbeveling>"
}

Regels:
- matchScore: hoe goed het CV aansluit bij de vacature (0-100)
- label: Zwakke match (0-40), Redelijke match (41-60), Goede match (61-80), Uitstekende match (81-100)
- labelKleur: rood (Zwak), oranje (Redelijk), geel (Goed), groen (Uitstekend)
- sterkePunten: 3-5 dingen waarop het CV goed aansluit
- ontbrekendeKeywords: specifieke woorden/vaardigheden uit de vacature die ontbreken in het CV
- verbeterpunten: 3-4 concrete tips om het CV beter aan te laten sluiten
- Geef ALLEEN de JSON, niets anders`,
            },
            {
                role: 'user',
                content: `CV:\n${cvText.slice(0, 3000)}\n\nVACATURE:\n${vacatureText.slice(0, 3000)}`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '{}';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        const parsed = JSON.parse(clean) as CvVacatureMatchResult;
        parsed.matchScore = Math.max(0, Math.min(100, Math.round(parsed.matchScore)));
        return parsed;
    } catch {
        throw new Error('Match analyse kon niet worden verwerkt. Probeer het opnieuw.');
    }
}
