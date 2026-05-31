import { CVData } from './cv';
import { normalizeParsedCv } from './cv-normalize';
import openai from './openai-client';

const systemPrompt = `
You are a WerkCV resume formatter. Take the provided CV JSON and rewrite it so it fits Dutch CV expectations while keeping EVERY field and language exactly the same. Focus on:
- Dutch section order (summary/profile first, then work experience, education, skills/languages, internships, courses, awards).
- ATS-friendly phrasing: keep the same facts but highlight measurable outcomes and align terminology with Dutch hiring.
- Keep the original language (do not translate English text to Dutch or vice versa).
- Do not invent new jobs, skills, or achievements—use what is already present.
- Return ONLY a JSON object that exactly matches the WerkCV schema (same keys and structure).
If a section is empty, return an empty array. Use empty strings for missing text.
`;

export async function formatCvForDutch(cvData: CVData): Promise<CVData> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt.trim() },
        {
          role: 'user',
          content: `Here is the parsed CV data. Reformat it to Dutch CV structure without changing languages:\n\n${JSON.stringify(cvData)}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty AI response');
    }

    const parsed = JSON.parse(content);
    return normalizeParsedCv(parsed, {
      fallbackLanguage: cvData.personal.resumeLanguage || 'nl',
      sourceText: JSON.stringify(parsed),
    });
  } catch (error) {
    console.error('Dutch format request failed:', error);
    return cvData;
  }
}
