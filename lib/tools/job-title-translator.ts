import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface JobTitleTranslatorResult {
    vertaling: string;
    alternatieven: string[];
    uitleg: string;
    linkedinTip: string;
}

export async function translateJobTitle(
    titel: string,
    richting: 'nl-en' | 'en-nl'
): Promise<JobTitleTranslatorResult> {
    const van = richting === 'nl-en' ? 'Nederlands' : 'Engels';
    const naar = richting === 'nl-en' ? 'Engels' : 'Nederlands';

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 400,
        messages: [
            {
                role: 'system',
                content: `Je bent een expert in Nederlandse en internationale arbeidsmarktterminologie.
Vertaal functietitels van ${van} naar ${naar} voor gebruik op LinkedIn en CV.

Geef het resultaat als JSON met dit exacte formaat:
{
  "vertaling": "<de beste/meest gebruikte vertaling>",
  "alternatieven": ["<alternatief 1>", "<alternatief 2>", "<alternatief 3>"],
  "uitleg": "<korte uitleg van nuances of context — 1-2 zinnen in het Nederlands>",
  "linkedinTip": "<tip voor LinkedIn-gebruik — 1 zin in het Nederlands>"
}

Regels:
- vertaling: de meest gangbare vertaling op de arbeidsmarkt
- alternatieven: 2-4 veelgebruikte alternatieven (van meest naar minst gangbaar)
- uitleg: context over wanneer welke titel te gebruiken
- linkedinTip: advies over welke titel beter scoort op LinkedIn
- Geef ALLEEN de JSON, niets anders`,
            },
            {
                role: 'user',
                content: `Vertaal deze functietitel van ${van} naar ${naar}: "${titel}"`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '{}';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        return JSON.parse(clean) as JobTitleTranslatorResult;
    } catch {
        throw new Error('Vertaling kon niet worden gemaakt. Probeer het opnieuw.');
    }
}
