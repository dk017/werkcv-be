import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CvSamenvattingInput {
    huidigeFunctie: string;
    doelrol: string;
    ervaringJaren: string;
    kernvaardigheden: string;
    sterksteResultaat: string;
    toon: "professioneel" | "enthousiast" | "beknopt";
}

export async function generateCvSamenvatting(input: CvSamenvattingInput): Promise<string> {
    const toneInstructions = {
        professioneel: "professionele, recruiter-vriendelijke toon",
        enthousiast: "actieve, energieke toon zonder overdreven marketingtaal",
        beknopt: "korte, krachtige toon",
    };

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 320,
        messages: [
            {
                role: "system",
                content: `Je bent een Nederlandse CV-expert.
Schrijf een sterke cv-samenvatting voor de Nederlandse arbeidsmarkt.

Regels:
- 3 tot 5 zinnen
- 55 tot 85 woorden
- Begin niet met "Ik"
- Koppel ervaring, kernvaardigheden en 1 concreet resultaat aan de doelrol
- Schrijf menselijk, specifiek en geloofwaardig
- Vermijd lege woorden zoals "gedreven teamplayer" zonder context
- Toon: ${toneInstructions[input.toon]}
- Geef alleen de samenvatting terug, zonder inleiding of aanhalingstekens`,
            },
            {
                role: "user",
                content: `Maak een cv-samenvatting voor:
Huidige of laatste functie: ${input.huidigeFunctie}
Doelrol: ${input.doelrol}
Jaren ervaring: ${input.ervaringJaren || "niet opgegeven"}
Kernvaardigheden: ${input.kernvaardigheden || "niet opgegeven"}
Sterkste resultaat of prestatie: ${input.sterksteResultaat || "niet opgegeven"}`,
            },
        ],
    });

    return response.choices[0]?.message?.content?.trim() ?? "";
}
