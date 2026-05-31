import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface VaardigheidInput {
    functietitel: string;
    sector: string;
    soort: 'hard' | 'soft' | 'beide';
}

export async function generateVaardigheden(input: VaardigheidInput): Promise<string[]> {
    const soortInstructie =
        input.soort === 'hard'
            ? 'Geef ALLEEN hard skills (technische vaardigheden, tools, methoden, certificaten).'
            : input.soort === 'soft'
            ? 'Geef ALLEEN soft skills (interpersoonlijke vaardigheden, karaktereigenschappen).'
            : 'Geef een mix van hard skills én soft skills.';

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        max_tokens: 400,
        messages: [
            {
                role: 'system',
                content: `Je bent een expert in de Nederlandse arbeidsmarkt.
Genereer een lijst van relevante CV-vaardigheden voor de opgegeven functie.

Regels:
- Geef 10-14 vaardigheden
- ${soortInstructie}
- Elke vaardigheid is 1-4 woorden, concreet en specifiek
- Gebruik gangbare Nederlandse of Engelse vakterm (zoals op CV's wordt gebruikt)
- Geen uitleg, geen opsommingstekens, geen nummering
- Geef de vaardigheden terug als JSON array van strings, bijv: ["Projectmanagement","Agile/Scrum","..."]
- Geef ALLEEN de JSON array, niets anders`,
            },
            {
                role: 'user',
                content: `Functietitel: ${input.functietitel}${input.sector ? `\nSector: ${input.sector}` : ''}`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '[]';
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === 'string');
    } catch {
        // fallback: split by newline or comma
        return raw.replace(/[\[\]"]/g, '').split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    }
    return [];
}
