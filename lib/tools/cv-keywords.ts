import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CvKeywordsInput {
    functietitel: string;
    sector: string;
    ervaringsniveau: 'junior' | 'medior' | 'senior';
}

export interface KeywordCategory {
    categorie: string;
    keywords: string[];
}

export async function generateCvKeywords(input: CvKeywordsInput): Promise<KeywordCategory[]> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        max_tokens: 600,
        messages: [
            {
                role: 'system',
                content: `Je bent een ATS-expert en CV-specialist voor de Nederlandse arbeidsmarkt.
Genereer de belangrijkste keywords die een ${input.ervaringsniveau} ${input.functietitel} in zijn/haar CV moet hebben om door ATS-systemen en recruiters gevonden te worden.

Geef de keywords terug als JSON met de volgende structuur:
[
  { "categorie": "Must-have keywords", "keywords": ["...", "..."] },
  { "categorie": "Technische vaardigheden", "keywords": ["...", "..."] },
  { "categorie": "Soft skills", "keywords": ["...", "..."] },
  { "categorie": "Certificaten & opleidingen", "keywords": ["...", "..."] }
]

Regels:
- Elke categorie bevat 4-7 keywords
- Keywords zijn concreet en gangbaar op de Nederlandse arbeidsmarkt
- Gebruik Nederlandse en Engelse vakterm door elkaar zoals gebruikelijk
- Geef ALLEEN de JSON array, niets anders`,
            },
            {
                role: 'user',
                content: `Functietitel: ${input.functietitel}${input.sector ? `\nSector: ${input.sector}` : ''}\nErvaringsniveau: ${input.ervaringsniveau}`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '[]';
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as KeywordCategory[];
    } catch {
        // ignore parse error, return empty
    }
    return [];
}
