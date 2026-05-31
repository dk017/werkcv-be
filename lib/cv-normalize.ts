import { CVData, cvSchema } from "./cv";
import { ResumeLanguage, detectResumeLanguage } from "./cv-language";

const languageLevelAliases: Record<string, "Moedertaal" | "Vloeiend" | "Goed" | "Basis"> = {
  moedertaal: "Moedertaal",
  native: "Moedertaal",
  fluent: "Vloeiend",
  vloeiend: "Vloeiend",
  c2: "Vloeiend",
  c1: "Vloeiend",
  good: "Goed",
  goed: "Goed",
  intermediate: "Goed",
  gemiddeld: "Goed",
  b2: "Goed",
  b1: "Goed",
  basic: "Basis",
  basis: "Basis",
  beginner: "Basis",
  a2: "Basis",
  a1: "Basis",
};

const genderAliases: Record<string, string> = {
  man: "Man",
  male: "Man",
  m: "Man",
  vrouw: "Vrouw",
  female: "Vrouw",
  f: "Vrouw",
  anders: "Anders",
  other: "Anders",
  nonbinary: "Anders",
  "non-binary": "Anders",
};

const maritalStatusAliases: Record<string, string> = {
  ongehuwd: "Ongehuwd",
  single: "Ongehuwd",
  unmarried: "Ongehuwd",
  gehuwd: "Gehuwd",
  getrouwd: "Gehuwd",
  married: "Gehuwd",
  samenwonend: "Samenwonend",
  cohabiting: "Samenwonend",
  "living together": "Samenwonend",
  gescheiden: "Gescheiden",
  divorced: "Gescheiden",
};

const resumeLanguageAliases: Record<string, ResumeLanguage> = {
  nl: "nl",
  dutch: "nl",
  nederlands: "nl",
  dutchlanguage: "nl",
  en: "en",
  english: "en",
  engels: "en",
  englishlanguage: "en",
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => normalizeString(entry))
    .filter(Boolean);
}

function normalizeNumber(value: unknown, fallback = 3): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(5, Math.round(parsed)));
}

function normalizeAlias(value: unknown, aliases: Record<string, string>): string {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return aliases[normalized.toLowerCase().replace(/\s+/g, " ")] ?? normalized;
}

function normalizeResumeLanguageValue(value: unknown, fallback: ResumeLanguage): ResumeLanguage {
  const normalized = normalizeString(value).toLowerCase().replace(/\s+/g, "");
  return resumeLanguageAliases[normalized] ?? fallback;
}

function normalizeLanguageLevel(value: unknown): "Moedertaal" | "Vloeiend" | "Goed" | "Basis" {
  const normalized = normalizeString(value).toLowerCase();
  return languageLevelAliases[normalized] ?? "Goed";
}

export function normalizeParsedCv(
  input: unknown,
  options: { fallbackLanguage?: ResumeLanguage; sourceText?: string } = {},
): CVData {
  const root = asObject(input);
  const personal = asObject(root.personal);
  const fallbackLanguage = options.fallbackLanguage || detectResumeLanguage(options.sourceText || "", "nl");

  const normalized = {
    personal: {
      name: normalizeString(personal.name),
      title: normalizeString(personal.title),
      resumeLanguage: normalizeResumeLanguageValue(personal.resumeLanguage, fallbackLanguage),
      email: normalizeString(personal.email),
      phone: normalizeString(personal.phone),
      location: normalizeString(personal.location),
      address: normalizeString(personal.address),
      postalCode: normalizeString(personal.postalCode),
      summary: normalizeString(personal.summary),
      birthDate: normalizeString(personal.birthDate),
      birthPlace: normalizeString(personal.birthPlace),
      nationality: normalizeString(personal.nationality),
      driversLicense: normalizeString(personal.driversLicense),
      gender: normalizeAlias(personal.gender, genderAliases),
      maritalStatus: normalizeAlias(personal.maritalStatus, maritalStatusAliases),
      linkedIn: normalizeString(personal.linkedIn),
      github: normalizeString(personal.github),
      website: normalizeString(personal.website),
      photo: normalizeString(personal.photo),
    },
    experience: Array.isArray(root.experience)
      ? root.experience.map((entry) => {
          const item = asObject(entry);
          return {
            role: normalizeString(item.role),
            company: normalizeString(item.company),
            location: normalizeString(item.location),
            start: normalizeString(item.start),
            end: normalizeString(item.end),
            description: normalizeString(item.description),
            highlights: normalizeStringArray(item.highlights),
          };
        })
      : [],
    education: Array.isArray(root.education)
      ? root.education.map((entry) => {
          const item = asObject(entry);
          return {
            degree: normalizeString(item.degree),
            school: normalizeString(item.school),
            location: normalizeString(item.location),
            start: normalizeString(item.start),
            end: normalizeString(item.end),
            description: normalizeString(item.description),
          };
        })
      : [],
    skills: Array.isArray(root.skills)
      ? root.skills.map((entry) => {
          const item = asObject(entry);
          return {
            name: normalizeString(item.name),
            level: normalizeNumber(item.level, 3),
          };
        })
      : [],
    languages: Array.isArray(root.languages)
      ? root.languages.map((entry) => {
          const item = asObject(entry);
          return {
            name: normalizeString(item.name),
            level: normalizeLanguageLevel(item.level),
          };
        })
      : [],
    internships: Array.isArray(root.internships)
      ? root.internships.map((entry) => {
          const item = asObject(entry);
          return {
            role: normalizeString(item.role),
            company: normalizeString(item.company),
            location: normalizeString(item.location),
            start: normalizeString(item.start),
            end: normalizeString(item.end),
            description: normalizeString(item.description),
            highlights: normalizeStringArray(item.highlights),
          };
        })
      : [],
    interests: normalizeStringArray(root.interests),
    properties: normalizeStringArray(root.properties),
    courses: Array.isArray(root.courses)
      ? root.courses.map((entry) => {
          const item = asObject(entry);
          return {
            name: normalizeString(item.name),
            institution: normalizeString(item.institution),
            year: normalizeString(item.year),
          };
        })
      : [],
    awards: normalizeStringArray(root.awards),
    references: Array.isArray(root.references)
      ? root.references.map((entry) => {
          const item = asObject(entry);
          return {
            name: normalizeString(item.name),
            role: normalizeString(item.role),
            company: normalizeString(item.company),
            email: normalizeString(item.email),
            phone: normalizeString(item.phone),
          };
        })
      : [],
    sideActivities: Array.isArray(root.sideActivities)
      ? root.sideActivities.map((entry) => {
          const item = asObject(entry);
          return {
            title: normalizeString(item.title),
            organization: normalizeString(item.organization),
            start: normalizeString(item.start),
            end: normalizeString(item.end),
            description: normalizeString(item.description),
          };
        })
      : [],
    customSections: Array.isArray(root.customSections)
      ? root.customSections.map((entry) => {
          const item = asObject(entry);
          return {
            title: normalizeString(item.title),
            items: normalizeStringArray(item.items),
          };
        })
      : [],
  };

  return cvSchema.parse(normalized);
}
