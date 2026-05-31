import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface SollicitatiebriefInput {
    naam: string;
    doelrol: string;
    bedrijfsnaam: string;
    motivatie: string;
    toon: 'professioneel' | 'enthousiast' | 'beknopt';
}

export async function generateSollicitatiebrief(input: SollicitatiebriefInput): Promise<string> {
    const toonInstructies = {
        professioneel: 'formeel en professioneel',
        enthousiast: 'enthousiast en warm',
        beknopt: 'to-the-point en beknopt',
    };

    const bedrijf = input.bedrijfsnaam.trim() || 'het bedrijf';

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 700,
        messages: [
            {
                role: 'system',
                content: `Je bent een expert in het schrijven van Nederlandse sollicitatiebrieven.
Schrijf een professionele sollicitatiebrief.

Structuur:
1. Aanhef: "Geachte heer/mevrouw," of "Beste ${bedrijf} team,"
2. Opening: waarom je solliciteert (1 paragraaf, ~40 woorden)
3. Wat je te bieden hebt: relevante ervaring en vaardigheden (1-2 paragrafen, ~100 woorden)
4. Waarom dit bedrijf: motivatie voor specifiek dit bedrijf (1 paragraaf, ~40 woorden)
5. Afsluiting met call-to-action: gesprek aanvragen (1 paragraaf, ~30 woorden)
6. "Met vriendelijke groet," + naam

Toon: ${toonInstructies[input.toon]}
Totale lengte: 250-320 woorden
Geef ALLEEN de brief terug, geen extra uitleg.`,
            },
            {
                role: 'user',
                content: `Naam sollicitant: ${input.naam || 'de sollicitant'}
Solliciteert naar: ${input.doelrol}
Bij bedrijf: ${bedrijf}
Achtergrond/motivatie: ${input.motivatie}`,
            },
        ],
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
}
