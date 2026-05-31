import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface WerkervaringInput {
    functietitel: string;
    bedrijf: string;
    werkzaamheden: string;
}

export async function generateWerkervaringBullets(input: WerkervaringInput): Promise<string[]> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        max_tokens: 500,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `Je bent een expert CV-schrijver voor de Nederlandse arbeidsmarkt.
Schrijf sterke werkervaring bullet points voor een CV.

Regels:
- 5-6 bullet points
- Begin elke bullet met een sterk werkwoord in verleden tijd (bijv. Ontwikkelde, Beheerde, Optimaliseerde, Leidde, Realiseerde, Coördineerde, Implementeerde)
- Gebruik het STAR/CAR-model: actie + resultaat
- Voeg waar mogelijk meetbare resultaten toe (%, €, tijdsbesparing, aantallen)
- Houd elke bullet onder de 20 woorden
- Schrijf in het Nederlands
- Geef een JSON object terug: {"bullets": ["bullet1", "bullet2", ...]}`,
            },
            {
                role: 'user',
                content: `Functietitel: ${input.functietitel}
Bedrijf: ${input.bedrijf}
Werkzaamheden/taken: ${input.werkzaamheden}`,
            },
        ],
    });

    const content = response.choices[0]?.message?.content ?? '{"bullets":[]}';
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.bullets)) {
            return parsed.bullets
                .filter((b: unknown): b is string => typeof b === 'string' && b.trim().length > 0)
                .map((b: string) => b.trim())
                .slice(0, 6);
        }
    } catch {
        // fall through
    }
    return [];
}
