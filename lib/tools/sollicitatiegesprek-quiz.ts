import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface QuizVraag {
    id: string;
    categorie: string;
    vraag: string;
    waaromGevraagd: string;
    antwoordTips: string[];
    voorbeeldAntwoord: string;
}

export interface SollicitatieQuizResult {
    functietitel: string;
    vragen: QuizVraag[];
}

export async function generateSollicitatieQuiz(
    functietitel: string,
    sector: string,
    ervaringsniveau: 'junior' | 'medior' | 'senior'
): Promise<SollicitatieQuizResult> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 2000,
        messages: [
            {
                role: 'system',
                content: `Je bent een Nederlandse HR-expert die sollicitatiegesprekken voorbereidt.
Genereer 8 realistische sollicitatievragen voor de opgegeven functie.

Geef het resultaat als JSON met dit exacte formaat:
{
  "functietitel": "<de functietitel>",
  "vragen": [
    {
      "id": "v1",
      "categorie": "<Motivatie | Ervaring | Gedrag | Situationeel | Vaktechnisch | Persoonlijkheid>",
      "vraag": "<de sollicitatievraag>",
      "waaromGevraagd": "<waarom recruiters deze vraag stellen — 1 zin>",
      "antwoordTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
      "voorbeeldAntwoord": "<een sterk voorbeeldantwoord van 3-4 zinnen>"
    }
  ]
}

Gebruik deze verdeling van 8 vragen:
- 1 Motivatievraag (Waarom deze functie/bedrijf?)
- 2 Ervaringsvragen (Vertel over je ervaring met X)
- 2 Gedragsvragen (STAR-methode: Vertel een situatie waarbij...)
- 1 Situationele vraag (Wat zou jij doen als...)
- 1 Vaktechnische vraag (specifiek voor de functie)
- 1 Persoonlijkheidsvraag (Wat zijn je sterke/zwakke punten?)

Pas de moeilijkheidsgraad aan op het ervaringsniveau: ${ervaringsniveau}.
Schrijf alles in het Nederlands.
Geef ALLEEN de JSON, niets anders.`,
            },
            {
                role: 'user',
                content: `Functie: ${functietitel}\nSector: ${sector || 'algemeen'}\nNiveau: ${ervaringsniveau}`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '{}';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        return JSON.parse(clean) as SollicitatieQuizResult;
    } catch {
        throw new Error('Quiz kon niet worden gegenereerd. Probeer het opnieuw.');
    }
}
