import { CVData } from "@/lib/cv";

export type ResumeLanguage = "nl" | "en";

type ResumeTextKey =
  | "nameFallback"
  | "profilePhotoAlt"
  | "profile"
  | "personalDetails"
  | "experience"
  | "internships"
  | "education"
  | "educationSingle"
  | "skills"
  | "languages"
  | "interests"
  | "courses"
  | "coursesShort"
  | "awards"
  | "awardsShort"
  | "birthDate"
  | "birthDateAndPlace"
  | "nationality"
  | "driversLicense"
  | "gender"
  | "maritalStatus"
  | "links"
  | "linkedIn";

const resumeCopy: Record<ResumeLanguage, Record<ResumeTextKey, string>> = {
  nl: {
    nameFallback: "Naam",
    profilePhotoAlt: "Profielfoto",
    profile: "Profiel",
    personalDetails: "Personalia",
    experience: "Werkervaring",
    internships: "Stages",
    education: "Opleidingen",
    educationSingle: "Opleiding",
    skills: "Vaardigheden",
    languages: "Talen",
    interests: "Interesses",
    courses: "Cursussen & Certificaten",
    coursesShort: "Cursussen",
    awards: "Prijzen & Prestaties",
    awardsShort: "Prijzen",
    birthDate: "Geboortedatum",
    birthDateAndPlace: "Geboortedatum & -plaats",
    nationality: "Nationaliteit",
    driversLicense: "Rijbewijs",
    gender: "Geslacht",
    maritalStatus: "Burgerlijke staat",
    links: "Links",
    linkedIn: "LinkedIn",
  },
  en: {
    nameFallback: "Name",
    profilePhotoAlt: "Profile photo",
    profile: "Profile",
    personalDetails: "Personal Details",
    experience: "Experience",
    internships: "Internships",
    education: "Education",
    educationSingle: "Education",
    skills: "Skills",
    languages: "Languages",
    interests: "Interests",
    courses: "Courses & Certifications",
    coursesShort: "Courses",
    awards: "Awards & Achievements",
    awardsShort: "Awards",
    birthDate: "Date of Birth",
    birthDateAndPlace: "Date and Place of Birth",
    nationality: "Nationality",
    driversLicense: "Driver's License",
    gender: "Gender",
    maritalStatus: "Marital Status",
    links: "Links",
    linkedIn: "LinkedIn",
  },
};

const languageLevelMap: Record<ResumeLanguage, Record<string, string>> = {
  nl: {
    Moedertaal: "Moedertaal",
    Vloeiend: "Vloeiend",
    Goed: "Goed",
    Basis: "Basis",
    Native: "Moedertaal",
    Fluent: "Vloeiend",
    Good: "Goed",
    Basic: "Basis",
  },
  en: {
    Moedertaal: "Native",
    Vloeiend: "Fluent",
    Goed: "Good",
    Basis: "Basic",
    Native: "Native",
    Fluent: "Fluent",
    Good: "Good",
    Basic: "Basic",
  },
};

const genderMap: Record<ResumeLanguage, Record<string, string>> = {
  nl: {
    Man: "Man",
    Vrouw: "Vrouw",
    Anders: "Anders",
    Male: "Man",
    Female: "Vrouw",
    Other: "Anders",
  },
  en: {
    Man: "Male",
    Vrouw: "Female",
    Anders: "Other",
    Male: "Male",
    Female: "Female",
    Other: "Other",
  },
};

const maritalStatusMap: Record<ResumeLanguage, Record<string, string>> = {
  nl: {
    Ongehuwd: "Ongehuwd",
    Gehuwd: "Gehuwd",
    Samenwonend: "Samenwonend",
    Gescheiden: "Gescheiden",
    Single: "Ongehuwd",
    Married: "Gehuwd",
    Cohabiting: "Samenwonend",
    Divorced: "Gescheiden",
  },
  en: {
    Ongehuwd: "Single",
    Gehuwd: "Married",
    Samenwonend: "Cohabiting",
    Gescheiden: "Divorced",
    Single: "Single",
    Married: "Married",
    Cohabiting: "Cohabiting",
    Divorced: "Divorced",
  },
};

const skillLevelMap: Record<ResumeLanguage, string[]> = {
  nl: ["Basis", "Gemiddeld", "Goed", "Zeer goed", "Uitstekend"],
  en: ["Basic", "Intermediate", "Good", "Very good", "Excellent"],
};

export function getResumeLanguage(dataOrLanguage?: CVData | ResumeLanguage | null): ResumeLanguage {
  if (dataOrLanguage === "en" || dataOrLanguage === "nl") {
    return dataOrLanguage;
  }
  return dataOrLanguage?.personal?.resumeLanguage === "en" ? "en" : "nl";
}

export function resumeText(dataOrLanguage: CVData | ResumeLanguage | null | undefined, key: ResumeTextKey): string {
  return resumeCopy[getResumeLanguage(dataOrLanguage)][key];
}

export function formatLanguageLevel(level: string | undefined, dataOrLanguage?: CVData | ResumeLanguage | null): string {
  if (!level) return "";
  const language = getResumeLanguage(dataOrLanguage);
  return languageLevelMap[language][level] ?? level;
}

export function formatGender(value: string | undefined, dataOrLanguage?: CVData | ResumeLanguage | null): string {
  if (!value) return "";
  const language = getResumeLanguage(dataOrLanguage);
  return genderMap[language][value] ?? value;
}

export function formatMaritalStatus(value: string | undefined, dataOrLanguage?: CVData | ResumeLanguage | null): string {
  if (!value) return "";
  const language = getResumeLanguage(dataOrLanguage);
  return maritalStatusMap[language][value] ?? value;
}

export function formatSkillLevel(level: number | undefined, dataOrLanguage?: CVData | ResumeLanguage | null): string {
  if (!level || level < 1 || level > 5) {
    return getResumeLanguage(dataOrLanguage) === "en" ? "Good" : "Goed";
  }
  return skillLevelMap[getResumeLanguage(dataOrLanguage)][level - 1];
}
