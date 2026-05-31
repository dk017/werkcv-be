import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ProfieltekstInput {
    huidigeFunctie: string;
    doelrol: string;
    competenties: string;
    ervaringJaren: string;
    toon: 'professioneel' | 'enthousiast' | 'beknopt';
}

export async function generateProfieltekst(input: ProfieltekstInput): Promise<string> {
    const toonInstructies = {
        professioneel: 'formele, professionele toon',
        enthousiast: 'enthousiaste, motiverende toon',
        beknopt: 'beknopte, krachtige toon',
    };

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 300,
        messages: [
            {
                role: 'system',
                content: `Je bent een expert CV-schrijver voor de Nederlandse arbeidsmarkt.
Schrijf een sterke profieltekst (persoonlijk profiel) voor een CV.

Regels:
- Maximaal 4-5 zinnen (60-80 woorden)
- Begin NIET met "Ik"
- Gebruik actieve, concrete taal
- Noem relevante competenties en ervaring
- Sluit af met wat de kandidaat zoekt of biedt
- Schrijf in de derde persoon enkelvoud of als verklarende introductie
- Toon: ${toonInstructies[input.toon]}
- Geef ALLEEN de profieltekst terug, geen uitleg of aanhalingstekens`,
            },
            {
                role: 'user',
                content: `Maak een profieltekst voor:
Huidige/laatste functie: ${input.huidigeFunctie}
Doelrol: ${input.doelrol}
Kerncompetenties: ${input.competenties || 'niet opgegeven'}
Jaren ervaring: ${input.ervaringJaren || 'niet opgegeven'}`,
            },
        ],
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
}
