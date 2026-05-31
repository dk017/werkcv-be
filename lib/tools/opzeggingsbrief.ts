export interface OpzeggingsbriefInput {
    naam: string;
    adres: string;
    werkgever: string;
    functie: string;
    datumBrief: string;  // e.g. "27 februari 2026"
    datumEinde: string;  // e.g. "31 maart 2026"
}

export function generateOpzeggingsbrief(input: OpzeggingsbriefInput): string {
    const { naam, adres, werkgever, functie, datumBrief, datumEinde } = input;

    return `${naam}
${adres ? adres + '\n' : ''}
${datumBrief}

Betreft: Opzegging arbeidsovereenkomst

Geachte heer/mevrouw,

Middels deze brief deel ik u mee dat ik mijn arbeidsovereenkomst als ${functie} bij ${werkgever} hierbij formeel opzeg per ${datumEinde}.

Mijn laatste werkdag zal ${datumEinde} zijn, conform de geldende opzegtermijn zoals vastgelegd in mijn arbeidsovereenkomst en de toepasselijke wet- en regelgeving.

Gedurende mijn opzegtermijn zal ik mijn werkzaamheden naar behoren uitvoeren en zorgen voor een zorgvuldige overdracht van mijn taken en verantwoordelijkheden. Ik sta uiteraard open voor overleg over de wijze waarop de overdracht het beste kan worden georganiseerd.

Ik wil u en mijn collega's oprecht bedanken voor de prettige samenwerking en de mogelijkheden die mij zijn geboden tijdens mijn dienstverband bij ${werkgever}.

Ik verzoek u de ontvangst van deze brief schriftelijk te bevestigen.

Met vriendelijke groet,

${naam}`.trim();
}
