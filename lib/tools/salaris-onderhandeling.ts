import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface SalarisOnderhandelingInput {
    huidigeRol: string;
    sector: string;
    ervaringJaren: string;
    huidigSalaris?: string;
    gewenstSalaris: string;
    sterktepunten: string;
}

export interface SalarisOnderhandelingResult {
    strategie: string;
    openingszin: string;
    argumenten: string[];
    emailScript: string;
    tegenargumenten: { bezwaar: string; reactie: string }[];
    doTips: string[];
    dontTips: string[];
}

export async function generateSalarisOnderhandeling(input: SalarisOnderhandelingInput): Promise<SalarisOnderhandelingResult> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 1200,
        messages: [
            {
                role: 'system',
                content: `Je bent een Nederlandse carrièrecoach gespecialiseerd in salarisonderhandeling.
Genereer een persoonlijk onderhandelingsscript op basis van de gegeven informatie.

Geef het resultaat als JSON met dit exacte formaat:
{
  "strategie": "<2-3 zinnen over de beste aanpak voor deze situatie>",
  "openingszin": "<de ideale eerste zin om het gesprek te openen>",
  "argumenten": ["<argument 1>", "<argument 2>", "<argument 3>", "<argument 4>"],
  "emailScript": "<volledig e-mailscript voor salarisverhoging, klaar om te versturen>",
  "tegenargumenten": [
    { "bezwaar": "<veelvoorkomend bezwaar>", "reactie": "<hoe hierop te reageren>" },
    { "bezwaar": "<veelvoorkomend bezwaar>", "reactie": "<hoe hierop te reageren>" },
    { "bezwaar": "<veelvoorkomend bezwaar>", "reactie": "<hoe hierop te reageren>" }
  ],
  "doTips": ["<do 1>", "<do 2>", "<do 3>"],
  "dontTips": ["<dont 1>", "<dont 2>", "<dont 3>"]
}

Regels:
- Schrijf alles in het Nederlands
- emailScript: professioneel maar persoonlijk, inclusief aanhef en afsluiting
- argumenten: gebaseerd op de opgegeven sterktepunten en ervaring
- tegenargumenten: realistische bezwaren die werkgevers geven
- Geef ALLEEN de JSON, niets anders`,
            },
            {
                role: 'user',
                content: `Rol: ${input.huidigeRol}
Sector: ${input.sector}
Jaren ervaring: ${input.ervaringJaren}
Huidig salaris: ${input.huidigSalaris || 'niet opgegeven'}
Gewenst salaris: ${input.gewenstSalaris}
Sterktepunten/argumenten: ${input.sterktepunten}`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '{}';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        return JSON.parse(clean) as SalarisOnderhandelingResult;
    } catch {
        throw new Error('Script kon niet worden gegenereerd. Probeer het opnieuw.');
    }
}
