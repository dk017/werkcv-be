import { CVData } from "./cv";
import { ResumeLanguage, detectResumeLanguage } from "./cv-language";
import { normalizeParsedCv } from "./cv-normalize";
import openai from "./openai-client";

const LINKEDIN_PARSER_SYSTEM_PROMPT = `You convert LinkedIn profile text into the WerkCV JSON schema.

The input may come from pasted profile text or a flattened LinkedIn PDF export. The text can be messy, duplicated, or missing clean section boundaries. Infer structure carefully from explicit evidence only.

Return ONLY a JSON object that matches this structure:
{
  "personal": {
    "name": "",
    "title": "",
    "resumeLanguage": "nl or en",
    "email": "",
    "phone": "",
    "location": "",
    "address": "",
    "postalCode": "",
    "summary": "",
    "birthDate": "",
    "birthPlace": "",
    "nationality": "",
    "driversLicense": "",
    "gender": "",
    "maritalStatus": "",
    "linkedIn": "",
    "github": "",
    "website": "",
    "photo": ""
  },
  "experience": [
    {
      "role": "",
      "company": "",
      "location": "",
      "start": "",
      "end": "",
      "description": "",
      "highlights": []
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "location": "",
      "start": "",
      "end": "",
      "description": ""
    }
  ],
  "skills": [{ "name": "", "level": 3 }],
  "languages": [{ "name": "", "level": "Goed" }],
  "internships": [],
  "interests": [],
  "properties": [],
  "courses": [{ "name": "", "institution": "", "year": "" }],
  "awards": [],
  "references": [],
  "sideActivities": [{ "title": "", "organization": "", "start": "", "end": "", "description": "" }],
  "customSections": [{ "title": "", "items": [] }]
}

Critical rules:
- Preserve the ORIGINAL LANGUAGE of the source. Do not translate.
- Use empty strings "" and empty arrays [] when information is missing.
- Deduplicate obvious repeated text from flattened exports.
- Do not invent dates, employers, achievements, or years of experience.
- Extract technical skills from project and stack descriptions.
- Put certifications in "courses" and volunteer/community items in "sideActivities" when clearly present.

Critical rules for personal.summary:
- personal.summary MUST be a concise top-of-CV profile summary, not copied raw LinkedIn body text.
- Write 2 to 4 sentences and keep it roughly 35 to 90 words.
- If an About/Summary section exists, compress it into recruiter-ready CV language in the same source language.
- If no About/Summary section exists, synthesize a brief summary from explicit facts only: role, domain, technologies, and strongest focus areas.
- Lead with a precise professional identity and 1 or 2 concrete differentiators from the source.
- Avoid generic filler such as "proven track record", "strong focus", "results-driven", "motivated professional", or "passionate" unless the sentence also contains specific evidence.
- Avoid generic closing lines about being driven, motivated, passionate, or eager unless that wording is explicitly supported and still adds concrete value.
- Every sentence should add recruiter-relevant information, not personality filler.
- Never put numbered projects, "Project 1", "Environment:", "Client:", raw tech-stack dumps, or long responsibility lists in personal.summary.

Critical rules for experience:
- Keep project detail out of personal.summary.
- Put project and implementation details in experience.description and experience.highlights.
- If the profile lists projects under a role, keep the role as the experience entry and move each project/result into highlights.
- If a standalone project is clearly tied to a nearby role, attach it to that role instead of creating noise in the summary.
- Highlights should be short factual bullets, not paragraphs, when possible.

Return ONLY JSON.`;

const LINKEDIN_SUMMARY_REPAIR_PROMPT = `You write the final top profile summary of a CV created from LinkedIn data.

Return ONLY JSON in this format:
{
  "summary": ""
}

Rules:
- Keep the original language exactly as requested.
- Write 2 to 4 sentences and keep it roughly 35 to 90 words.
- Use explicit facts from the provided CV data and source text only.
- Make it suitable for the top of a strong CV: clear role focus, niche/domain, strongest expertise, and concrete value.
- Make it feel recruiter-ready and shortlist-worthy, but never salesy or exaggerated.
- Lead with a precise professional identity, not a vague adjective pile.
- Include 1 or 2 specific differentiators grounded in the input, such as domain focus, core technologies, project type, or kind of problem solved.
- Prefer specificity over generic claims.
- Avoid filler like "proven track record", "strong focus", "results-driven", "motivated professional", "passionate", or similar empty phrasing unless the sentence also contains concrete evidence.
- Avoid generic closing lines about being driven, motivated, passionate, eager, or improving things unless that sentence still carries concrete recruiter-relevant information.
- Every sentence must add specific value for a recruiter.
- Do not mention years of experience unless explicitly supported by the input.
- Do not mention goals, job-seeking intent, or target role unless explicit in the source.
- Never include numbered projects, "Project 1", "Environment:", "Client:", raw tech-stack dumps, long lists, or contact details.
- Do not invent years, seniority, or achievements that are not supported by the input.
- Return JSON only.`;

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function needsLinkedInSummaryRepair(summary: string): boolean {
  const normalized = summary.trim();
  if (!normalized) return true;

  const wordCount = countWords(normalized);
  if (wordCount < 12 || wordCount > 150) return true;

  if (/project\s*\d+\s*:/i.test(normalized)) return true;
  if (/\benvironment\s*:/i.test(normalized)) return true;
  if (/\bclient\s*:/i.test(normalized)) return true;
  if (/\btech(?:nology|nologies| stack)?\s*:/i.test(normalized)) return true;
  if ((normalized.match(/:\s/g) || []).length >= 3) return true;

  return false;
}

function buildLinkedInUserPrompt(text: string, fallbackLanguage: ResumeLanguage): string {
  if (fallbackLanguage === "nl") {
    return `Zet deze LinkedIn-profieltekst om naar het WerkCV JSON-schema:\n\n${text}`;
  }

  return `Convert this LinkedIn profile text into the WerkCV JSON schema:\n\n${text}`;
}

export async function parseLinkedInProfileText(
  text: string,
  fallbackLanguage?: ResumeLanguage,
): Promise<CVData> {
  const detectedLanguage = fallbackLanguage || detectResumeLanguage(text, "nl");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: LINKEDIN_PARSER_SYSTEM_PROMPT },
      { role: "user", content: buildLinkedInUserPrompt(text, detectedLanguage) },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from LinkedIn import parser");
  }

  return normalizeParsedCv(JSON.parse(content), {
    fallbackLanguage: detectedLanguage,
    sourceText: text,
  });
}

export async function repairLinkedInSummary(rawText: string, cvData: CVData): Promise<CVData> {
  const language = cvData.personal.resumeLanguage === "en" ? "en" : "nl";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: LINKEDIN_SUMMARY_REPAIR_PROMPT },
        {
          role: "user",
          content: `Required language: ${language}

Current summary:
${cvData.personal.summary || "(empty)"}

Source LinkedIn text:
${rawText}

Current CV JSON:
${JSON.stringify(cvData)}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return cvData;
    }

    const parsed = JSON.parse(content) as { summary?: unknown };
    const repairedSummary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";

    if (!repairedSummary || needsLinkedInSummaryRepair(repairedSummary)) {
      return cvData;
    }

    return {
      ...cvData,
      personal: {
        ...cvData.personal,
        summary: repairedSummary,
      },
    };
  } catch (error) {
    console.error("LinkedIn summary repair failed:", error);
    return cvData;
  }
}
