import OpenAI from 'openai';
import { z } from 'zod';
import { CVData } from './cv';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const atsRewriteResultSchema = z.object({
    summary: z.string().default(''),
    experience: z.array(
        z.object({
            description: z.string().default(''),
            highlights: z.array(z.string()).default([]),
        })
    ).default([]),
});

type AtsRewriteOptions = {
    targetRole?: string;
    jobDescription?: string;
    preferredLanguage?: 'nl' | 'en';
};

const DUTCH_MARKERS = [' de ', ' het ', ' een ', ' en ', ' van ', ' voor ', ' met ', ' op ', ' ik ', ' je '];
const ENGLISH_MARKERS = [' the ', ' and ', ' a ', ' an ', ' of ', ' for ', ' with ', ' to ', ' in ', ' you '];

function countMarkers(source: string, markers: string[]): number {
    return markers.reduce((acc, marker) => acc + (source.split(marker).length - 1), 0);
}

function detectLanguageFromText(text: string): 'nl' | 'en' | 'unknown' {
    const normalized = ` ${text.toLowerCase()} `;
    const dutchScore = countMarkers(normalized, DUTCH_MARKERS);
    const englishScore = countMarkers(normalized, ENGLISH_MARKERS);

    if (dutchScore === 0 && englishScore === 0) return 'unknown';
    return dutchScore >= englishScore ? 'nl' : 'en';
}

function detectCVLanguage(cvData: CVData): 'nl' | 'en' {
    const joined = [
        cvData.personal.title,
        cvData.personal.summary,
        ...cvData.experience.flatMap((exp) => [exp.role, exp.description, ...exp.highlights]),
        ...cvData.education.flatMap((edu) => [edu.degree, edu.description]),
        ...cvData.skills.map((skill) => skill.name),
    ]
        .filter(Boolean)
        .join(' ');

    const detected = detectLanguageFromText(joined);
    return detected === 'unknown' ? 'nl' : detected;
}

function buildLanguageLabel(language: 'nl' | 'en'): string {
    return language === 'nl' ? 'Dutch' : 'English';
}

async function requestATSRewrite(
    cvData: CVData,
    targetRole: string,
    jobDescription: string,
    language: 'nl' | 'en',
    strictRetry: boolean
) {
    const languageLabel = buildLanguageLabel(language);

    const systemPrompt = `You optimize CV copy for ATS without changing facts.

Rules:
- Output language MUST be ${languageLabel}. Any other language is invalid.
- Do not translate to another language.
- Do not invent companies, dates, technologies, responsibilities, or achievements.
- Rewrite only for clarity, keyword alignment, and impact.
- Keep writing concise and concrete.
- Output strict JSON only.
${strictRetry ? '- Previous output used the wrong language. This retry must be strictly in the required language.' : ''}

Return this JSON structure exactly:
{
  "summary": "rewritten profile summary",
  "experience": [
    {
      "description": "rewritten description",
      "highlights": ["bullet 1", "bullet 2"]
    }
  ]
}

For "experience", return one entry per original experience in the same order.
If a field is missing, return an empty string/array.`;

    const userPrompt = `Target role: ${targetRole || 'Not provided'}
Job description (optional): ${jobDescription || 'Not provided'}
Required output language: ${languageLabel}

Original CV JSON:
${JSON.stringify(cvData)}`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No ATS rewrite response from AI');
    }

    return atsRewriteResultSchema.parse(JSON.parse(content));
}

export async function rewriteCVForATS(
    cvData: CVData,
    options: AtsRewriteOptions = {}
): Promise<CVData> {
    const targetRole = options.targetRole || cvData.personal.title || '';
    const jobDescription = options.jobDescription || '';
    const expectedLanguage = options.preferredLanguage || detectCVLanguage(cvData);

    let parsed = await requestATSRewrite(cvData, targetRole, jobDescription, expectedLanguage, false);
    const firstPassLang = detectLanguageFromText(
        `${parsed.summary}\n${parsed.experience.map((exp) => `${exp.description} ${exp.highlights.join(' ')}`).join('\n')}`
    );

    if (firstPassLang !== 'unknown' && firstPassLang !== expectedLanguage) {
        parsed = await requestATSRewrite(cvData, targetRole, jobDescription, expectedLanguage, true);
        const retryLang = detectLanguageFromText(
            `${parsed.summary}\n${parsed.experience.map((exp) => `${exp.description} ${exp.highlights.join(' ')}`).join('\n')}`
        );
        if (retryLang !== 'unknown' && retryLang !== expectedLanguage) {
            throw new Error('ATS_REWRITE_LANGUAGE_MISMATCH');
        }
    }

    const mergedExperience = cvData.experience.map((exp, index) => {
        const rewritten = parsed.experience[index];
        if (!rewritten) return exp;

        const cleanHighlights = rewritten.highlights
            .map((line) => line.trim())
            .filter(Boolean);

        return {
            ...exp,
            description: rewritten.description?.trim() || exp.description,
            highlights: cleanHighlights.length > 0 ? cleanHighlights : exp.highlights,
        };
    });

    return {
        ...cvData,
        personal: {
            ...cvData.personal,
            summary: parsed.summary?.trim() || cvData.personal.summary,
        },
        experience: mergedExperience,
    };
}
