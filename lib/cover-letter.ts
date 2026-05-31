import OpenAI from 'openai';
import { z } from 'zod';
import { CVData } from './cv';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const coverLetterResultSchema = z.object({
    coverLetter: z.string().default(''),
});

type CoverLetterOptions = {
    targetRole?: string;
    companyName?: string;
    jobDescription?: string;
    tone?: 'professional' | 'enthusiastic' | 'concise';
};

export async function generateCoverLetter(
    cvData: CVData,
    options: CoverLetterOptions = {}
): Promise<string> {
    const targetRole = options.targetRole || cvData.personal.title || '';
    const companyName = options.companyName || '';
    const jobDescription = options.jobDescription || '';
    const tone = options.tone || 'professional';

    const systemPrompt = `You write high-quality job application cover letters based on CV data.

Rules:
- Preserve original language of the CV (Dutch remains Dutch, English remains English).
- Do not invent facts, employers, dates, or achievements not present in the CV input.
- Keep tone ${tone}, concrete, and recruiter-friendly.
- Keep length between 180 and 320 words.
- Use 3-5 short paragraphs.
- Output strict JSON only.

Return this exact JSON shape:
{
  "coverLetter": "full cover letter text"
}`;

    const userPrompt = `Target role: ${targetRole || 'Not provided'}
Company name: ${companyName || 'Not provided'}
Job description (optional): ${jobDescription || 'Not provided'}

CV JSON:
${JSON.stringify(cvData)}`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No cover letter response from AI');
    }

    const parsed = coverLetterResultSchema.parse(JSON.parse(content));
    return parsed.coverLetter.trim();
}

