import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AtsCheck {
    id: string;
    categorie: string;
    label: string;
    passed: boolean;
    tip: string | null;
    punten: number;
}

export interface AtsCheckerResult {
    score: number;
    label: string;
    labelKleur: 'rood' | 'oranje' | 'geel' | 'groen';
    samenvatting: string;
    checks: AtsCheck[];
}

export async function analyzeAts(cvText: string): Promise<AtsCheckerResult> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 1200,
        messages: [
            {
                role: 'system',
                content: `Je bent een ATS-expert die CV's beoordeelt voor de Nederlandse arbeidsmarkt.
Analyseer het CV en beoordeel het op ATS-compatibiliteit en inhoudskwaliteit.

Geef de beoordeling terug als JSON met dit exacte formaat:
{
  "score": <getal 0-100>,
  "label": <"Zwak" | "Matig" | "Goed" | "Sterk">,
  "labelKleur": <"rood" | "oranje" | "geel" | "groen">,
  "samenvatting": "<2-3 zinnen over de grootste sterke en zwakke punten>",
  "checks": [
    {
      "id": "<unieke id>",
      "categorie": "<categorienaam>",
      "label": "<wat wordt gecontroleerd>",
      "passed": <true|false>,
      "tip": "<null als passed=true, anders korte verbetertip>",
      "punten": <waarde van dit check 5-15>
    }
  ]
}

Gebruik deze 16 checks (categorie → checks):

Categorie "Contactgegevens" (4 checks):
- "email": E-mailadres aanwezig (8 punten)
- "telefoon": Telefoonnummer aanwezig (5 punten)
- "locatie": Stad/woonplaats aanwezig (5 punten)
- "linkedin": LinkedIn-profiel aanwezig (7 punten)

Categorie "Structuur & Opmaak" (4 checks):
- "profieltekst": Persoonlijk profiel of samenvatting aanwezig (10 punten)
- "werkervaring_sectie": Werkervaringsectie aanwezig en gevuld (10 punten)
- "opleiding_sectie": Opleidingssectie aanwezig (7 punten)
- "vaardigheden_sectie": Vaardigheidensectie aanwezig (8 punten)

Categorie "Inhoudskwaliteit" (4 checks):
- "actieve_werkwoorden": Gebruik van actieve werkwoorden (Leidde, Ontwikkelde, Realiseerde, etc.) (8 punten)
- "meetbare_resultaten": Meetbare resultaten of cijfers aanwezig (bijv. %, €, aantallen) (10 punten)
- "lengte": CV-lengte geschikt (niet te kort <200 woorden, niet te lang >800 woorden) (7 punten)
- "buzzwords": Geen overdaad aan holle buzzwords (Resultaatgericht, Teamplayer, Proactief) zonder bewijs (5 punten)

Categorie "ATS-compatibiliteit" (4 checks):
- "datumformaat": Datums in consistent en leesbaar formaat (jan 2023 – heden) (5 punten)
- "sectikoppen": Herkenbare, standaard sectikoppen gebruikt (5 punten)
- "geen_tabellen": Geen complexe tabelstructuren die ATS verwarren (5 punten — schat op basis van tekstflow)
- "email_professioneel": E-mailadres ziet er professioneel uit (geen 'coolguy1987@...') (5 punten)

Regels:
- score = som van punten van alle passed checks (max 103 → normaliseer naar 100)
- label: Zwak (0-40), Matig (41-60), Goed (61-80), Sterk (81-100)
- labelKleur: rood (Zwak), oranje (Matig), geel (Goed), groen (Sterk)
- tip: null als passed=true, anders max 1 zin met concrete verbetertip in het Nederlands
- Geef ALLEEN de JSON, niets anders`,
            },
            {
                role: 'user',
                content: `Analyseer dit CV:\n\n${cvText.slice(0, 6000)}`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '{}';

    // Strip markdown code fences if present
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        const parsed = JSON.parse(clean) as AtsCheckerResult;
        // Clamp score
        parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
        return parsed;
    } catch {
        throw new Error('ATS analyse kon niet worden verwerkt. Probeer het opnieuw.');
    }
}
