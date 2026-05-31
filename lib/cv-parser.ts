import mammoth from 'mammoth';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { CVData } from './cv';
import { detectResumeLanguage, ResumeLanguage } from './cv-language';
import { normalizeParsedCv } from './cv-normalize';
import openai from './openai-client';

// pdfjs-dist types
type PDFDocumentProxy = {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
};

type PDFPageProxy = {
    getTextContent(): Promise<{ items: Array<{ str?: string }> }>;
};

type GetDocumentParams = {
    data: Uint8Array;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    useSystemFonts?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjs: any = null;

const aiParsedPersonalDefaults = {
    name: "",
    title: "",
    resumeLanguage: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    postalCode: "",
    summary: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    driversLicense: "",
    gender: "",
    maritalStatus: "",
    linkedIn: "",
    github: "",
    website: "",
    photo: "",
};

const aiParsedCvSchema = z.object({
    personal: z.object({
        name: z.string().optional().default(""),
        title: z.string().optional().default(""),
        resumeLanguage: z.string().optional().default(""),
        email: z.string().optional().default(""),
        phone: z.string().optional().default(""),
        location: z.string().optional().default(""),
        address: z.string().optional().default(""),
        postalCode: z.string().optional().default(""),
        summary: z.string().optional().default(""),
        birthDate: z.string().optional().default(""),
        birthPlace: z.string().optional().default(""),
        nationality: z.string().optional().default(""),
        driversLicense: z.string().optional().default(""),
        gender: z.string().optional().default(""),
        maritalStatus: z.string().optional().default(""),
        linkedIn: z.string().optional().default(""),
        github: z.string().optional().default(""),
        website: z.string().optional().default(""),
        photo: z.string().optional().default(""),
    }).optional().default(aiParsedPersonalDefaults),
    experience: z.array(z.object({
        role: z.string().optional().default(""),
        company: z.string().optional().default(""),
        location: z.string().optional().default(""),
        start: z.string().optional().default(""),
        end: z.string().optional().default(""),
        description: z.string().optional().default(""),
        highlights: z.array(z.string()).optional().default([]),
    })).optional().default([]),
    education: z.array(z.object({
        degree: z.string().optional().default(""),
        school: z.string().optional().default(""),
        location: z.string().optional().default(""),
        start: z.string().optional().default(""),
        end: z.string().optional().default(""),
        description: z.string().optional().default(""),
    })).optional().default([]),
    skills: z.array(z.object({
        name: z.string().optional().default(""),
        level: z.union([z.number(), z.string()]).optional().default(3),
    })).optional().default([]),
    languages: z.array(z.object({
        name: z.string().optional().default(""),
        level: z.string().optional().default("Goed"),
    })).optional().default([]),
    internships: z.array(z.object({
        role: z.string().optional().default(""),
        company: z.string().optional().default(""),
        location: z.string().optional().default(""),
        start: z.string().optional().default(""),
        end: z.string().optional().default(""),
        description: z.string().optional().default(""),
        highlights: z.array(z.string()).optional().default([]),
    })).optional().default([]),
    interests: z.array(z.string()).optional().default([]),
    properties: z.array(z.string()).optional().default([]),
    courses: z.array(z.object({
        name: z.string().optional().default(""),
        institution: z.string().optional().default(""),
        year: z.string().optional().default(""),
    })).optional().default([]),
    awards: z.array(z.string()).optional().default([]),
    references: z.array(z.object({
        name: z.string().optional().default(""),
        role: z.string().optional().default(""),
        company: z.string().optional().default(""),
        email: z.string().optional().default(""),
        phone: z.string().optional().default(""),
    })).optional().default([]),
    sideActivities: z.array(z.object({
        title: z.string().optional().default(""),
        organization: z.string().optional().default(""),
        start: z.string().optional().default(""),
        end: z.string().optional().default(""),
        description: z.string().optional().default(""),
    })).optional().default([]),
    customSections: z.array(z.object({
        title: z.string().optional().default(""),
        items: z.array(z.string()).optional().default([]),
    })).optional().default([]),
});

const CV_PARSER_MODELS = ['gpt-4o', 'gpt-4o-mini'] as const;

async function getPdfjs() {
    if (!pdfjs) {
        pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
        // Disable worker for server-side usage
        pdfjs.GlobalWorkerOptions.workerSrc = '';
    }
    return pdfjs;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    const pdfjsLib = await getPdfjs();
    const data = new Uint8Array(buffer);
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({
        data,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
    } as GetDocumentParams).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page: PDFPageProxy = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
            .map((item) => (item.str || ''))
            .join(' ');
        text += pageText + '\n';
    }

    return text;
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

export async function extractTextFromFile(buffer: Buffer, filename: string): Promise<string> {
    const ext = filename.toLowerCase().split('.').pop();

    if (ext === 'pdf') {
        return extractTextFromPDF(buffer);
    } else if (ext === 'docx' || ext === 'doc') {
        return extractTextFromDOCX(buffer);
    } else {
        throw new Error(`Unsupported file type: ${ext}`);
    }
}

export async function parseCVWithAI(
    text: string,
    options: { fallbackLanguage?: ResumeLanguage } = {}
): Promise<CVData> {
    const systemPrompt = `You are a CV parser. Extract structured data from CV text and return ONLY valid JSON.

CRITICAL: Capture ALL information from the CV. Do not summarize or truncate. Include EVERY bullet point, tech stack detail, and achievement.

The output format must exactly follow this schema:
{
  "personal": {
    "name": "full name",
    "title": "current/desired job title",
    "email": "email address",
    "phone": "phone number",
    "location": "city/town",
    "address": "full address/street",
    "postalCode": "postal code and city",
    "summary": "professional summary or profile - INCLUDE FULL TEXT",
    "birthDate": "date of birth",
    "birthPlace": "place of birth",
    "nationality": "nationality",
    "driversLicense": "driver's license type",
    "gender": "gender (Male/Female/Other)",
    "maritalStatus": "marital status",
    "linkedIn": "LinkedIn URL",
    "github": "GitHub URL",
    "website": "website URL"
  },
  "experience": [
    {
      "role": "job title",
      "company": "company name",
      "location": "location",
      "start": "start date (e.g., jun 2024)",
      "end": "end date or 'present'",
      "description": "brief description combining job context and any tech stack mentioned",
      "highlights": ["EVERY bullet point as a separate item", "Include ALL achievements", "Include tech stack details"]
    }
  ],
  "education": [
    {
      "degree": "degree/diploma",
      "school": "educational institution",
      "location": "location",
      "start": "start year",
      "end": "end year",
      "description": "description including CGPA, relevant coursework, projects"
    }
  ],
  "skills": [
    { "name": "skill name", "level": 3 }
  ],
  "languages": [
    { "name": "Language", "level": "Fluent" }
  ],
  "internships": [
    {
      "role": "internship role",
      "company": "company name",
      "location": "location",
      "start": "start date",
      "end": "end date",
      "description": "description",
      "highlights": []
    }
  ],
  "interests": ["interest1", "interest2"],
  "courses": [
    {
      "name": "course name",
      "institution": "institution",
      "year": "year"
    }
  ],
  "awards": ["award or achievement 1", "award or achievement 2"]
}

CRITICAL RULES:
- Return ONLY the JSON, no other text
- Use empty strings "" for missing fields
- Use empty arrays [] if there are no items
- Convert dates to readable format (e.g., "jun 2024", "2018")
- IMPORTANT: Preserve the ORIGINAL LANGUAGE of the CV. Do NOT translate. If CV is in English, keep English. If in Dutch, keep Dutch.
- For skills: Extract ALL skills mentioned including in "Technologies & Tools" sections. Level is 1-5 (1=basic, 3=good, 5=expert). For technical skills from experienced professionals, default to level 4-5.
- For languages: level must be "Native", "Fluent", "Good", or "Basic" (English) OR "Moedertaal", "Vloeiend", "Goed", or "Basis" (Dutch)
- For experience: capture EVERY bullet point in highlights array. Include tech stack info in description.
- For awards: Extract from "Awards", "Certificates", "Achievements", "Honors" sections
- Internships separate from work experience
- github: Extract GitHub profile URL if present`;
    const fallbackLanguage = options.fallbackLanguage || detectResumeLanguage(text, 'nl');
    let lastError: unknown = null;

    for (const model of CV_PARSER_MODELS) {
        try {
            const response = await openai.chat.completions.parse({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Parse dit CV:\n\n${text}` }
                ],
                temperature: 0.1,
                response_format: zodResponseFormat(aiParsedCvSchema, 'werkcv_cv_parser'),
            });

            const parsed = response.choices[0]?.message?.parsed;
            if (!parsed) {
                throw new Error('No structured CV data in AI response');
            }

            return normalizeParsedCv(parsed, {
                fallbackLanguage,
                sourceText: text,
            });
        } catch (error) {
            lastError = error;
            console.error(`CV AI parse failed with ${model}:`, error);
        }
    }

    throw new Error(
        lastError instanceof Error && lastError.message
            ? `Failed to parse CV structure: ${lastError.message}`
            : 'Failed to parse CV structure'
    );
}

export async function parseCV(buffer: Buffer, filename: string): Promise<CVData> {
    const text = await extractTextFromFile(buffer, filename);

    if (!text.trim()) {
        throw new Error('Could not extract text from file');
    }

    return parseCVWithAI(text, {
        fallbackLanguage: detectResumeLanguage(text, 'nl'),
    });
}

export async function parseCVText(text: string, fallbackLanguage?: ResumeLanguage): Promise<CVData> {
    if (!text.trim()) {
        throw new Error('Could not extract text from input');
    }

    return parseCVWithAI(text, {
        fallbackLanguage: fallbackLanguage || detectResumeLanguage(text, 'nl'),
    });
}
