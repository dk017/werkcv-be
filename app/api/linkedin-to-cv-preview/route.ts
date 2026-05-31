import { NextRequest, NextResponse } from "next/server";
import { repairLinkedInSummary, parseLinkedInProfileText } from "@/lib/linkedin-import";
import type { CVData } from "@/lib/cv";

const MAX_TEXT_LENGTH = 50000;

type ToolLanguage = "nl" | "en";

type PreviewSection = {
  key: string;
  title: string;
  lines: string[];
};

function joinParts(parts: Array<string | undefined | null>): string {
  return parts.map((part) => part?.trim()).filter(Boolean).join(" | ");
}

function compactText(value: string | undefined | null): string {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function extractExperience(cvData: CVData): string[] {
  return cvData.experience
    .map((item) => {
      const header = joinParts([
        joinParts([item.role, item.company]),
        joinParts([item.start, item.end]),
        item.location,
      ]);
      const description = compactText(item.description);
      const highlights = item.highlights
        .map((highlight) => compactText(highlight))
        .filter(Boolean);

      return [header, description, ...highlights].filter(Boolean).join("\n");
    })
    .filter(Boolean);
}

function extractEducation(cvData: CVData): string[] {
  return cvData.education
    .map((item) => {
      const header = joinParts([
        joinParts([item.degree, item.school]),
        joinParts([item.start, item.end]),
        item.location,
      ]);
      const description = compactText(item.description);
      return [header, description].filter(Boolean).join("\n");
    })
    .filter(Boolean);
}

function extractSkills(cvData: CVData): string[] {
  return cvData.skills
    .map((skill) => compactText(skill.name))
    .filter(Boolean);
}

function extractLanguages(cvData: CVData): string[] {
  return cvData.languages
    .map((item) => joinParts([item.name, item.level]))
    .filter(Boolean);
}

function extractCertificates(cvData: CVData): string[] {
  return cvData.courses
    .map((item) => joinParts([item.name, item.institution, item.year]))
    .filter(Boolean);
}

function buildImprovementPoints(cvData: CVData, language: ToolLanguage): string[] {
  const improvements: string[] = [];
  const summaryWords = compactText(cvData.personal.summary).split(/\s+/).filter(Boolean).length;
  const experienceCount = cvData.experience.length;
  const skillCount = cvData.skills.length;

  if (summaryWords < 20) {
    improvements.push("Maak je profieltekst kort, concreet en duidelijk gericht op de functie waarop je solliciteert.");
  }

  if (experienceCount > 0 && cvData.experience.every((item) => item.highlights.length === 0)) {
    improvements.push("Zet werkervaring om naar concrete bullets met actie, context en resultaat in plaats van alleen taakomschrijvingen.");
  }

  if (skillCount < 6) {
    improvements.push("Voeg meer relevante vaardigheden toe die passen bij je doelrol en die je in je werkervaring kunt onderbouwen.");
  }

  improvements.push("Verwijder brede of informele LinkedIn-zinnen die niet direct helpen bij een sollicitatie.");
  improvements.push("Controleer of je cv keywords uit de vacature bevat in je profiel, werkervaring en vaardigheden.");

  if (language === "nl" && cvData.personal.resumeLanguage === "en") {
    improvements.push("Vertaal kernonderdelen naar Nederlands als je solliciteert op een Nederlandstalige vacature.");
  }

  return Array.from(new Set(improvements));
}

function buildSections(cvData: CVData, language: ToolLanguage): PreviewSection[] {
  const sections: PreviewSection[] = [];
  const summary = compactText(cvData.personal.summary);
  const experience = extractExperience(cvData);
  const education = extractEducation(cvData);
  const skills = extractSkills(cvData);
  const languages = extractLanguages(cvData);
  const certificates = extractCertificates(cvData);
  const improvements = buildImprovementPoints(cvData, language);

  sections.push({
    key: "profile",
    title: "Profieltekst",
    lines: summary ? [summary] : ["Nog geen duidelijke profieltekst gevonden. Gebruik de output als startpunt en maak deze functiegerichter."],
  });

  sections.push({
    key: "experience",
    title: "Werkervaring",
    lines: experience.length > 0 ? experience : ["Nog geen duidelijke werkervaring gevonden. Plak ook je LinkedIn-werkervaring mee voor een betere omzetting."],
  });

  sections.push({
    key: "education",
    title: "Opleiding",
    lines: education.length > 0 ? education : ["Nog geen opleiding gevonden in de geplakte tekst."],
  });

  sections.push({
    key: "skills",
    title: "Vaardigheden",
    lines: skills.length > 0 ? skills : ["Nog geen duidelijke vaardigheden gevonden. Voeg ook je skills-sectie uit LinkedIn toe."],
  });

  if (languages.length > 0) {
    sections.push({
      key: "languages",
      title: "Talen",
      lines: languages,
    });
  }

  if (certificates.length > 0) {
    sections.push({
      key: "certificates",
      title: "Certificaten",
      lines: certificates,
    });
  }

  sections.push({
    key: "improvements",
    title: "Verbeterpunten",
    lines: improvements,
  });

  return sections;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profileText = typeof body?.profileText === "string" ? body.profileText.trim() : "";
    const language: ToolLanguage = body?.language === "en" ? "en" : "nl";

    if (!profileText) {
      return NextResponse.json(
        { error: "Plak eerst de tekst van je LinkedIn-profiel." },
        { status: 400 },
      );
    }

    if (profileText.length < 180) {
      return NextResponse.json(
        { error: "De tekst lijkt te kort. Plak bijvoorbeeld ook je info-sectie, werkervaring en vaardigheden." },
        { status: 400 },
      );
    }

    if (profileText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "De tekst is te lang. Plak alleen de relevante onderdelen van je LinkedIn-profiel." },
        { status: 400 },
      );
    }

    const parsedCv = await parseLinkedInProfileText(profileText, language);
    const repairedCv = await repairLinkedInSummary(profileText, parsedCv);
    const sections = buildSections(repairedCv, language);

    return NextResponse.json({
      sections,
      detectedLanguage: repairedCv.personal.resumeLanguage === "en" ? "en" : "nl",
      suggestedTitle: compactText(repairedCv.personal.title),
      suggestedName: compactText(repairedCv.personal.name),
    });
  } catch (error) {
    console.error("linkedin_to_cv_preview_failed", error);
    return NextResponse.json(
      { error: "Omzetten mislukt. Probeer het opnieuw met meer LinkedIn-tekst." },
      { status: 500 },
    );
  }
}
