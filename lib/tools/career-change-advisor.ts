import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CareerChangeInput {
    huidigeRol: string;
    huidigeSector: string;
    doelRol: string;
    doelSector: string;
    ervaringJaren: string;
    motivatie: string;
}

export interface CareerChangeResult {
    haalbaarheid: 'Goed haalbaar' | 'Haalbaar met inspanning' | 'Uitdagend maar mogelijk' | 'Grote stap';
    haalbaarheidsScore: number;
    samenvatting: string;
    overdraagbareVaardigheden: string[];
    kennisHiaten: string[];
    actieplan: { stap: string; tijdlijn: string; actie: string }[];
    aanbevolenOpleidingen: string[];
    realistischeTimeline: string;
}

export async function generateCareerChangeAdvice(input: CareerChangeInput): Promise<CareerChangeResult> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 1400,
        messages: [
            {
                role: 'system',
                content: `Je bent een Nederlandse loopbaancoach gespecialiseerd in carrièreswitch begeleiding.
Analyseer de gewenste carrièreswitch en geef concreet advies.

Geef het resultaat als JSON met dit exacte formaat:
{
  "haalbaarheid": <"Goed haalbaar" | "Haalbaar met inspanning" | "Uitdagend maar mogelijk" | "Grote stap">,
  "haalbaarheidsScore": <getal 0-100>,
  "samenvatting": "<2-3 zinnen over de switch en haalbaarheid>",
  "overdraagbareVaardigheden": ["<vaardigheid 1>", "<vaardigheid 2>", ...],
  "kennisHiaten": ["<hiaat 1>", "<hiaat 2>", ...],
  "actieplan": [
    { "stap": "Stap 1", "tijdlijn": "<bijv. Maand 1-2>", "actie": "<concrete actie>" },
    { "stap": "Stap 2", "tijdlijn": "<bijv. Maand 3-6>", "actie": "<concrete actie>" },
    { "stap": "Stap 3", "tijdlijn": "<bijv. Maand 6-12>", "actie": "<concrete actie>" },
    { "stap": "Stap 4", "tijdlijn": "<bijv. Maand 12+>", "actie": "<concrete actie>" }
  ],
  "aanbevolenOpleidingen": ["<opleiding/cursus 1>", "<opleiding/cursus 2>", "<opleiding/cursus 3>"],
  "realistischeTimeline": "<inschatting hoe lang de switch realistisch duurt>"
}

Regels:
- haalbaarheidsScore: 80-100 = Goed haalbaar, 60-79 = Haalbaar met inspanning, 40-59 = Uitdagend maar mogelijk, 0-39 = Grote stap
- overdraagbareVaardigheden: 4-6 concrete vaardigheden die meegaan naar de nieuwe rol
- kennisHiaten: 3-5 concrete dingen die nog geleerd/ontwikkeld moeten worden
- actieplan: 4 concrete stappen met realistische tijdlijn
- aanbevolenOpleidingen: specifieke cursussen, certificeringen of opleidingen relevant voor de doelrol in Nederland
- Schrijf alles in het Nederlands
- Geef ALLEEN de JSON, niets anders`,
            },
            {
                role: 'user',
                content: `Huidige rol: ${input.huidigeRol}
Huidige sector: ${input.huidigeSector}
Doelrol: ${input.doelRol}
Doelsector: ${input.doelSector}
Jaren ervaring: ${input.ervaringJaren}
Motivatie: ${input.motivatie}`,
            },
        ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '{}';
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        const parsed = JSON.parse(clean) as CareerChangeResult;
        parsed.haalbaarheidsScore = Math.max(0, Math.min(100, Math.round(parsed.haalbaarheidsScore)));
        return parsed;
    } catch {
        throw new Error('Advies kon niet worden gegenereerd. Probeer het opnieuw.');
    }
}
