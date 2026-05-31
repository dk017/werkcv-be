import OpenAI from 'openai';
import { CVData } from './cv';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Flatten all meaningful text from a CVData object into a single
 * lowercase string for keyword matching.
 */
export function cvDataToText(data: CVData): string {
    const parts: string[] = [];

    const p = data.personal;
    if (p.title) parts.push(p.title);
    if (p.summary) parts.push(p.summary);
    if (p.driversLicense) parts.push(p.driversLicense);

    for (const exp of data.experience) {
        if (exp.role) parts.push(exp.role);
        if (exp.company) parts.push(exp.company);
        if (exp.description) parts.push(exp.description);
        for (const h of exp.highlights ?? []) parts.push(h);
    }

    for (const edu of data.education) {
        if (edu.degree) parts.push(edu.degree);
        if (edu.school) parts.push(edu.school);
        if (edu.description) parts.push(edu.description);
    }

    for (const skill of data.skills) {
        if (skill.name) parts.push(skill.name);
    }

    for (const lang of data.languages) {
        if (lang.name) parts.push(lang.name);
    }

    for (const course of data.courses ?? []) {
        if (course.name) parts.push(course.name);
        if (course.institution) parts.push(course.institution);
    }

    for (const internship of data.internships ?? []) {
        if (internship.role) parts.push(internship.role);
        if (internship.description) parts.push(internship.description);
        for (const h of internship.highlights ?? []) parts.push(h);
    }

    for (const prop of data.properties ?? []) parts.push(prop);
    for (const award of data.awards ?? []) parts.push(award);

    return parts.join(' ').toLowerCase();
}

export interface KeywordScanResult {
    keywords: Array<{
        keyword: string;
        found: boolean;
    }>;
}

/**
 * Extract the most important ATS keywords from a Dutch job posting,
 * then match them against the candidate's CV text.
 */
export async function scanKeywords(
    jobDescription: string,
    cvText: string
): Promise<KeywordScanResult> {
    const trimmed = jobDescription.trim().slice(0, 4000); // cap input size

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 400,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `Je bent een ATS-expert voor de Nederlandse arbeidsmarkt.
Analyseer de vacaturetekst en extraheer de 12-18 belangrijkste sleutelwoorden die een ATS-systeem zal zoeken.

Focus op:
- Concrete vaardigheden en tools (bijv. "Excel", "Python", "SAP", "Salesforce")
- Vereiste diploma's en niveaus (bijv. "HBO", "MBO", "WO", "bachelor")
- Certificaten (bijv. "VCA", "BIG-registratie", "PRINCE2", "rijbewijs B")
- Sector-specifieke termen en methodieken
- Talen (bijv. "Engels", "Duits")
- Sleutelvereisten uit de functieomschrijving

Geef uitsluitend een JSON-object terug in dit formaat:
{"keywords": ["keyword1", "keyword2", ...]}

Keywords moeten kort en concreet zijn (1-3 woorden). Geen volledige zinnen.`,
            },
            {
                role: 'user',
                content: `Vacaturetekst:\n${trimmed}`,
            },
        ],
    });

    const content = response.choices[0]?.message?.content ?? '{"keywords":[]}';
    let keywords: string[] = [];

    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.keywords)) {
            keywords = parsed.keywords
                .filter((k: unknown): k is string => typeof k === 'string' && k.trim().length > 0)
                .map((k: string) => k.trim())
                .slice(0, 20);
        }
    } catch {
        keywords = [];
    }

    // Match each keyword against the CV text (case-insensitive)
    const cvLower = cvText.toLowerCase();
    return {
        keywords: keywords.map(keyword => ({
            keyword,
            found: cvLower.includes(keyword.toLowerCase()),
        })),
    };
}
