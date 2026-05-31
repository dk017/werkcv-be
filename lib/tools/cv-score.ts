import openai from "@/lib/openai-client";

export type CvScoreStatus = "good" | "improvement" | "critical";
export type CvScoreSeverity = "critical" | "improvement" | "passed";
export type CvScoreBand = "critical" | "fair" | "good" | "excellent";
export type CvScoreColor = "red" | "orange" | "yellow" | "green";

export interface CvScoreCheck {
  id: string;
  passed: boolean;
  points_earned: number;
  points_max: number;
  label: string;
  feedback: string | null;
  fix: string | null;
}

export interface CvScoreDimension {
  id: string;
  name: string;
  icon: string;
  score: number;
  max: number;
  percentage: number;
  status: CvScoreStatus;
  checks: CvScoreCheck[];
}

export interface CvScoreIssue {
  severity: CvScoreSeverity;
  dimension: string;
  label: string;
  feedback: string;
  fix: string | null;
}

export interface CvScoreResult {
  total_score: number;
  score_label: string;
  score_color: CvScoreColor;
  score_band: CvScoreBand;
  dimensions: CvScoreDimension[];
  all_issues: CvScoreIssue[];
  banner?: {
    type: "english_cv";
    message: string;
  };
  special_message?: string;
  cta: {
    headline: string;
    subtext: string;
    primary_button_text: string;
    primary_button_url: string;
    secondary_button_text: string;
    secondary_button_url: string;
  };
}

export class CvScoreInputError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "CvScoreInputError";
  }
}

type SectionKey =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "courses"
  | "interests"
  | "references"
  | "internships"
  | "other";

type SectionInfo = {
  key: SectionKey;
  header: string;
  lines: string[];
  text: string;
};

type InputSource = {
  mode: "text" | "file";
  fileName?: string;
};

type NuancedAnalysis = {
  profile_buzzword_band: "none" | "light" | "heavy";
  profile_buzzword_reason: string;
  work_experience_verb_band: "high" | "medium" | "low";
  work_experience_verb_reason: string;
  language_consistency: "dutch" | "english" | "mixed";
  language_consistency_reason: string;
};

type PreparedContext = {
  text: string;
  cleanText: string;
  rawLines: string[];
  lines: string[];
  wordCount: number;
  headerMatches: Array<{ key: SectionKey; line: string }>;
  sections: Partial<Record<SectionKey, SectionInfo>>;
  profileText: string;
  experienceText: string;
  experienceBullets: string[];
  localLanguage: "dutch" | "english" | "mixed";
};

type CheckSpec = {
  id: string;
  passed: boolean;
  pointsMax: number;
  pointsEarned?: number;
  passedLabel: string;
  failedLabel: string;
  successFeedback: string;
  failFeedback: string;
  fix?: string | null;
};

const SECTION_ALIASES: Array<{ key: SectionKey; aliases: string[] }> = [
  {
    key: "experience",
    aliases: [
      "werkervaring",
      "ervaring",
      "werkervaringen",
      "beroepservaring",
      "carriere",
      "experience",
      "work experience",
      "professional experience",
      "employment history",
      "career history",
    ],
  },
  {
    key: "education",
    aliases: [
      "opleiding",
      "opleidingen",
      "onderwijs",
      "studie",
      "education",
      "academic background",
    ],
  },
  {
    key: "skills",
    aliases: [
      "vaardigheden",
      "skills",
      "competenties",
      "kennis",
      "technische vaardigheden",
      "technical skills",
      "core skills",
      "key skills",
    ],
  },
  {
    key: "profile",
    aliases: [
      "profiel",
      "profieltekst",
      "over mij",
      "samenvatting",
      "introductie",
      "persoonlijk profiel",
      "summary",
      "professional summary",
      "career summary",
      "about me",
      "profile",
    ],
  },
  { key: "languages", aliases: ["talen", "talenkennis", "talenbekwaamheid", "languages", "language skills"] },
  { key: "courses", aliases: ["cursussen", "certificaten", "trainingen", "bijscholing", "certifications", "courses", "training"] },
  { key: "interests", aliases: ["interesses", "hobby's", "hobbys", "hobby", "hobbies", "vrije tijd", "persoonlijke interesses", "interests"] },
  { key: "internships", aliases: ["stage", "stages", "vrijwilligerswerk", "vrijwilligerservaring", "internship", "internships", "volunteer experience"] },
  { key: "references", aliases: ["prijzen", "prestaties", "referenties", "achievements", "awards", "references"] },
];

const DUTCH_BUZZWORDS = [
  "resultaatgericht",
  "teamplayer",
  "proactief",
  "gedreven",
  "enthousiast",
  "flexibel",
  "creatief",
  "hands-on",
  "dynamisch",
  "communicatief",
  "passie",
  "gepassioneerd",
  "zelfstarter",
  "leergierig",
  "out-of-the-box",
  "pragmatisch",
  "ervaren professional",
];

const ENGLISH_BUZZWORDS = [
  "results-driven",
  "results oriented",
  "team player",
  "proactive",
  "driven",
  "enthusiastic",
  "dynamic",
  "flexible",
  "creative",
  "passionate",
  "self-starter",
  "hard-working",
  "motivated",
  "detail-oriented",
  "go-getter",
  "excellent communication skills",
];

const STRONG_ACTION_VERBS = [
  "leidde",
  "ontwikkelde",
  "verhoogde",
  "verlaagde",
  "implementeerde",
  "beheerde",
  "coordineerde",
  "optimaliseerde",
  "realiseerde",
  "bouwde",
  "creeerde",
  "lanceerde",
  "verbeterde",
  "analyseerde",
  "genereerde",
  "reduceerde",
  "introduceerde",
  "trainde",
  "onderhandelde",
  "initieerde",
  "begeleidde",
  "rapporteerde",
  "adviseerde",
  "ondersteunde",
  "led",
  "developed",
  "increased",
  "decreased",
  "implemented",
  "managed",
  "coordinated",
  "optimized",
  "optimised",
  "delivered",
  "built",
  "created",
  "launched",
  "improved",
  "analyzed",
  "analysed",
  "generated",
  "reduced",
  "introduced",
  "trained",
  "negotiated",
  "initiated",
  "supported",
  "engineered",
  "architected",
  "designed",
];

const WEAK_ACTION_OPENERS = [
  "verantwoordelijk voor",
  "verantwoordelijk was voor",
  "betrokken bij",
  "werkzaam als",
  "bezig met",
  "voerde uit",
  "verzorgde",
  "responsible for",
  "was responsible for",
  "involved in",
  "worked on",
  "working on",
  "performed",
  "assisted with",
  "helped with",
];

const DUTCH_CITY_NAMES = [
  "amsterdam",
  "rotterdam",
  "den haag",
  "utrecht",
  "eindhoven",
  "groningen",
  "tilburg",
  "almere",
  "breda",
  "nijmegen",
  "enschede",
  "haarlem",
  "arnhem",
  "zaanstad",
  "amersfoort",
  "apeldoorn",
  "'s-hertogenbosch",
  "hoofddorp",
  "zoetermeer",
  "leiden",
  "maastricht",
  "dordrecht",
  "zwolle",
  "deventer",
  "delft",
  "alkmaar",
  "venlo",
  "leeuwarden",
  "roosendaal",
];

const DUTCH_MONTHS = [
  "jan", "januari", "feb", "februari", "mrt", "maart", "apr", "april",
  "mei", "jun", "juni", "jul", "juli", "aug", "augustus", "sep", "sept",
  "september", "okt", "oktober", "nov", "november", "dec", "december",
  "present", "heden", "nu",
];

const ENGLISH_MONTHS = [
  "jan", "january", "feb", "february", "mar", "march", "apr", "april",
  "may", "jun", "june", "jul", "july", "aug", "august", "sep", "sept",
  "september", "oct", "october", "nov", "november", "dec", "december",
  "present", "current",
];

const DUTCH_FUNCTION_WORDS = [
  "de", "het", "een", "en", "van", "met", "voor", "op", "in", "ervaring",
  "werkervaring", "opleiding", "vaardigheden", "profiel", "talen", "ik", "mijn", "jaren",
];

const ENGLISH_FUNCTION_WORDS = [
  "the", "and", "with", "for", "in", "of", "experience", "education",
  "skills", "summary", "profile", "languages", "i", "my", "years",
];

const CTA = {
  headline: "Verbeter je score met een WerkCV template",
  subtext: "ATS-vriendelijk, geoptimaliseerd voor de Nederlandse markt. Eenmalig €4,99.",
  primary_button_text: "Begin in de editor →",
  primary_button_url: "/editor",
  secondary_button_text: "Vergelijk templates",
  secondary_button_url: "/templates",
};

export async function scoreCv(text: string, source: InputSource): Promise<CvScoreResult> {
  const context = prepareContext(text, source);
  const nuanced = await getNuancedAnalysis(context);

  const dimensions = [
    scoreStructure(context),
    scorePersonalDetails(context),
    scoreProfile(context, nuanced),
    scoreWorkExperience(context, nuanced),
    scoreLanguageAndStyle(context, nuanced),
    scoreCompleteness(context),
  ];

  const totalScore = Math.round(dimensions.reduce((sum, dimension) => sum + dimension.score, 0));

  const result: CvScoreResult = {
    total_score: totalScore,
    score_label: getScoreLabel(totalScore),
    score_color: getScoreColor(totalScore),
    score_band: getScoreBand(totalScore),
    dimensions,
    all_issues: collectIssues(dimensions),
    cta: CTA,
  };

  if ((nuanced?.language_consistency ?? context.localLanguage) === "english") {
    result.banner = {
      type: "english_cv",
      message:
        "Je CV is in het Engels. Voor Nederlandse vacatures adviseren we een Nederlands CV, tenzij de vacature Engelstalig is. De analyse is aangepast voor Engelstalige CVs.",
    };
  }

  if (totalScore >= 90) {
    result.special_message =
      "Indrukwekkend! Je CV scoort in de top 10% op onze Nederlandse criteria. Kleine details kunnen het verschil maken bij de laatste selectieronde.";
  }

  return result;
}

function prepareContext(text: string, source: InputSource): PreparedContext {
  const normalizedText = text.replace(/\r\n/g, "\n").trim();
  const rawLines = normalizedText.split("\n").map((line) => line.trim());
  const lines = rawLines.filter(Boolean);
  const wordCount = countWords(normalizedText);

  if (wordCount < 100) {
    if (source.mode === "file" && source.fileName?.toLowerCase().endsWith(".pdf")) {
      throw new CvScoreInputError(
        "Je CV is een gescande afbeelding en kan niet worden gelezen door ATS-systemen - dit is zelf al een kritiek probleem. Upload een tekstgebaseerde PDF."
      );
    }

    throw new CvScoreInputError(
      "Je CV lijkt incompleet of de tekst is te kort om te analyseren. Probeer de volledige tekst te plakken."
    );
  }

  const lineParsed = parseSections(lines);
  const textParsed =
    lineParsed.headerMatches.length < 2 ? parseSectionsFromText(normalizedText) : null;
  const headerMatches = mergeHeaderMatches(
    lineParsed.headerMatches,
    textParsed?.headerMatches ?? []
  );
  const sections = mergeSections(
    lineParsed.sections,
    textParsed?.sections ?? {}
  );

  if (new Set(headerMatches.map((match) => match.key)).size < 2 && wordCount < 250) {
    throw new CvScoreInputError(
      "Het lijkt alsof je maar een deel van je CV hebt geplakt. Plak het volledige CV voor een nauwkeurige analyse."
    );
  }

  return {
    text: normalizedText,
    cleanText: normalizeForMatching(normalizedText),
    rawLines,
    lines,
    wordCount,
    headerMatches,
    sections,
    profileText: sections.profile?.text ?? "",
    experienceText: sections.experience?.text ?? "",
    experienceBullets: extractExperienceBullets(sections.experience),
    localLanguage: detectDominantLanguage(normalizedText),
  };
}

function parseSections(lines: string[]): {
  headerMatches: Array<{ key: SectionKey; line: string }>;
  sections: Partial<Record<SectionKey, SectionInfo>>;
} {
  const sections: Partial<Record<SectionKey, SectionInfo>> = {};
  const headerMatches: Array<{ key: SectionKey; line: string }> = [];
  let currentKey: SectionKey | null = null;

  for (const line of lines) {
    const sectionKey = detectSectionKey(line);
    if (sectionKey) {
      currentKey = sectionKey;
      headerMatches.push({ key: sectionKey, line });
      if (!sections[sectionKey]) {
        sections[sectionKey] = {
          key: sectionKey,
          header: line,
          lines: [],
          text: "",
        };
      }
      continue;
    }

    if (currentKey) {
      sections[currentKey]!.lines.push(line);
    }
  }

  for (const key of Object.keys(sections) as SectionKey[]) {
    sections[key]!.text = sections[key]!.lines.join("\n");
  }

  return { headerMatches, sections };
}

function parseSectionsFromText(text: string): {
  headerMatches: Array<{ key: SectionKey; line: string }>;
  sections: Partial<Record<SectionKey, SectionInfo>>;
} {
  const matches: Array<{ key: SectionKey; alias: string; index: number; end: number }> = [];

  for (const entry of SECTION_ALIASES) {
    for (const alias of entry.aliases) {
      const regex = new RegExp(`\\b${escapeRegex(alias).replace(/\s+/g, "\\s+")}\\b:?`, "gi");
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        if (!isPlausibleTextSectionMatch(text, match.index, match[0], alias)) {
          continue;
        }

        matches.push({
          key: entry.key,
          alias,
          index: match.index,
          end: match.index + match[0].length,
        });
      }
    }
  }

  const dedupedMatches = matches
    .sort((a, b) => (a.index === b.index ? b.alias.length - a.alias.length : a.index - b.index))
    .filter((match, index, all) => {
      if (index === 0) {
        return true;
      }

      const previous = all[index - 1];
      return !(match.index <= previous.end && match.key === previous.key);
    });

  const sections: Partial<Record<SectionKey, SectionInfo>> = {};
  const headerMatches: Array<{ key: SectionKey; line: string }> = [];

  for (let index = 0; index < dedupedMatches.length; index += 1) {
    const match = dedupedMatches[index];
    const next = dedupedMatches[index + 1];
    const sectionText = text.slice(match.end, next?.index).trim();
    const lines = sectionText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const candidate: SectionInfo = {
      key: match.key,
      header: match.alias,
      lines,
      text: sectionText,
    };

    headerMatches.push({ key: match.key, line: match.alias });

    if (!sections[match.key] || sectionText.length > sections[match.key]!.text.length) {
      sections[match.key] = candidate;
    }
  }

  return { headerMatches, sections };
}

function mergeSections(
  primary: Partial<Record<SectionKey, SectionInfo>>,
  fallback: Partial<Record<SectionKey, SectionInfo>>
): Partial<Record<SectionKey, SectionInfo>> {
  const merged: Partial<Record<SectionKey, SectionInfo>> = { ...primary };

  for (const key of Object.keys(fallback) as SectionKey[]) {
    if (!merged[key] || (fallback[key]?.text.length ?? 0) > (merged[key]?.text.length ?? 0)) {
      merged[key] = fallback[key];
    }
  }

  return merged;
}

function mergeHeaderMatches(
  primary: Array<{ key: SectionKey; line: string }>,
  fallback: Array<{ key: SectionKey; line: string }>
): Array<{ key: SectionKey; line: string }> {
  const seen = new Set<string>();
  const merged: Array<{ key: SectionKey; line: string }> = [];

  for (const match of [...primary, ...fallback]) {
    const token = `${match.key}:${normalizeHeader(match.line)}`;
    if (seen.has(token)) {
      continue;
    }

    seen.add(token);
    merged.push(match);
  }

  return merged;
}

function detectSectionKey(line: string): SectionKey | null {
  const normalized = normalizeHeader(line);
  if (!normalized || normalized.length > 40) {
    return null;
  }

  for (const entry of SECTION_ALIASES) {
    if (entry.aliases.some((alias) => normalizeHeader(alias) === normalized)) {
      return entry.key;
    }
  }

  return null;
}

function normalizeHeader(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[|:;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForMatching(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s/%+.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(value: string): number {
  return value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
}

function detectPhoneNumber(text: string, rawLines: string[]): boolean {
  const topRegion = rawLines.slice(0, 12).join("\n");
  const candidates = [topRegion, text];

  for (const candidate of candidates) {
    const matches = candidate.match(/(?:\+?\d[\d\s()./-]{7,}\d)/g) ?? [];

    for (const match of matches) {
      const digits = match.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) {
        continue;
      }

      if (/^\d{4}(?:\d{2})?$/.test(digits)) {
        continue;
      }

      return true;
    }
  }

  return false;
}

function detectLocation(context: PreparedContext): boolean {
  const topLines = context.rawLines.slice(0, 12);
  const topText = topLines.join("\n");

  if (
    DUTCH_CITY_NAMES.some((city) => context.cleanText.includes(normalizeForMatching(city))) ||
    /\b\d{4}\s?[A-Z]{2}\b/.test(context.text) ||
    /\bwoonplaats\b|\bwoonachtig\b|\blocation\b|\bbased in\b|\bliving in\b|\baddress\b/i.test(context.text)
  ) {
    return true;
  }

  return topLines.some((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 60) {
      return false;
    }

    if (/@|https?:\/\/|linkedin\.com|github\.com|\d{4}/i.test(trimmed)) {
      return false;
    }

    if (/\b(remote|hybrid|onsite)\b/i.test(trimmed)) {
      return true;
    }

    if (/^[A-Z][A-Za-z'.-]+(?:[\s-][A-Z][A-Za-z'.-]+)*(?:,\s*[A-Z][A-Za-z'.-]+(?:[\s-][A-Z][A-Za-z'.-]+)*)+$/.test(trimmed)) {
      return true;
    }

    return /\b(location|based in|living in)\b/i.test(trimmed);
  }) || /\b[A-Z][A-Za-z'.-]+(?:[\s-][A-Z][A-Za-z'.-]+)*,\s*[A-Z][A-Za-z'.-]+/.test(topText);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPlausibleTextSectionMatch(
  text: string,
  index: number,
  matchedValue: string,
  alias: string
): boolean {
  const genericAliases = new Set([
    "ervaring",
    "experience",
    "education",
    "profile",
    "summary",
    "skills",
    "languages",
    "kennis",
    "studie",
  ]);

  const normalizedAlias = normalizeHeader(alias);
  const rawMatch = text.slice(index, index + matchedValue.length);
  const prevChars = text.slice(Math.max(0, index - 3), index);
  const nextChars = text.slice(index + matchedValue.length, index + matchedValue.length + 30);
  const startsLikeHeader =
    index === 0 ||
    /[\n\r|:•\-–]/.test(prevChars) ||
    /\s{2,}$/.test(prevChars);
  const hasHeaderCasing = rawMatch !== rawMatch.toLowerCase();
  const nextLooksLikeContent = /\s|:|-|–|[A-Z0-9]/.test(nextChars.charAt(0) || " ");

  if (!nextLooksLikeContent) {
    return false;
  }

  if (genericAliases.has(normalizedAlias)) {
    return startsLikeHeader && hasHeaderCasing;
  }

  return startsLikeHeader || hasHeaderCasing;
}

function extractExperienceBullets(section?: SectionInfo): string[] {
  if (!section) {
    return [];
  }

  const inlineBullets = [section.text, ...section.lines]
    .flatMap((value) => value.split(/(?=[•◦▪●])/))
    .map((value) => value.trim())
    .filter((value) => /^[•◦▪●]/.test(value))
    .map((value) => value.replace(/^[•◦▪●]\s*/, "").trim())
    .filter((value) => value.length > 20)
    .filter((value) => !/^(tech stack|stack)\b/i.test(value));

  if (inlineBullets.length > 0) {
    return inlineBullets.slice(0, 12);
  }

  const bullets = section.lines
    .filter((line) => /^[-*•]\s+/.test(line) || /^\d+[.)]\s+/.test(line))
    .map((line) => line.replace(/^[-*•]\s+/, "").replace(/^\d+[.)]\s+/, "").trim())
    .filter(Boolean);

  if (bullets.length > 0) {
    return bullets.slice(0, 12);
  }

  return section.text
    .split(/[.!?]\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 25)
    .slice(0, 10);
}

async function getNuancedAnalysis(context: PreparedContext): Promise<NuancedAnalysis | null> {
  const hasProfile = context.profileText.length >= 30;
  const hasExperience = context.experienceBullets.length > 0 || context.experienceText.length > 50;
  const languageSample = context.text.slice(0, 1800);

  if (!hasProfile && !hasExperience && languageSample.length < 200) {
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Je bent een Nederlandse CV-expert die CV's beoordeelt op kwaliteit voor de Nederlandse arbeidsmarkt. " +
            "Beoordeel alleen de aangeleverde snippets op basis van Nederlandse sollicitatiepraktijk 2025-2026. " +
            "Gebruik language_sample alleen voor taalconsistentie. Gebruik work_experience_bullets alleen voor werkervaring-werkwoorden. " +
            "Behandel actiegerichte werkwoorden zoals engineered, architected, developed, delivered, built, managed, led en designed nooit als buzzwords. " +
            "Behandel 'experienced' of functieniveau-termen niet automatisch als buzzword zonder lege context eromheen. " +
            "Gebruik 'light' voor 1 of 2 losse algemene termen. Gebruik 'heavy' alleen als de profieltekst vooral uit vage containerwoorden bestaat of 3 of meer duidelijke buzzwords bevat. " +
            "Geef altijd geldige JSON terug met exact deze velden: " +
            "{\"profile_buzzword_band\":\"none|light|heavy\",\"profile_buzzword_reason\":\"...\",\"work_experience_verb_band\":\"high|medium|low\",\"work_experience_verb_reason\":\"...\",\"language_consistency\":\"dutch|english|mixed\",\"language_consistency_reason\":\"...\"}. " +
            "Wees streng, concreet en kort. Gebruik geen markdown.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Beoordeel de profieltekst, werkervaring-bullets en taalconsistentie van dit CV.",
            hints: {
              hollowBuzzwordsDutch: DUTCH_BUZZWORDS,
              hollowBuzzwordsEnglish: ENGLISH_BUZZWORDS,
              strongActionVerbs: STRONG_ACTION_VERBS,
              weakOpeners: WEAK_ACTION_OPENERS,
              doNotTreatAsBuzzwords: [
                "engineered",
                "architected",
                "developed",
                "delivered",
                "built",
                "managed",
                "led",
                "designed",
                "experienced",
              ],
              localLanguageGuess: context.localLanguage,
            },
            snippets: {
              profile_text: context.profileText.slice(0, 900),
              work_experience_bullets: context.experienceBullets.slice(0, 10),
              language_sample: languageSample,
            },
          }),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "{}";
    const parsed = JSON.parse(raw) as Partial<NuancedAnalysis>;

    if (
      !parsed.profile_buzzword_band ||
      !parsed.work_experience_verb_band ||
      !parsed.language_consistency
    ) {
      return null;
    }

    return {
      profile_buzzword_band: parsed.profile_buzzword_band,
      profile_buzzword_reason: parsed.profile_buzzword_reason ?? "",
      work_experience_verb_band: parsed.work_experience_verb_band,
      work_experience_verb_reason: parsed.work_experience_verb_reason ?? "",
      language_consistency: parsed.language_consistency,
      language_consistency_reason: parsed.language_consistency_reason ?? "",
    };
  } catch (error) {
    console.error("cv-score nuanced analysis error:", error);
    return null;
  }
}

function scoreStructure(context: PreparedContext): CvScoreDimension {
  const standardHeaderKeys = new Set(
    context.headerMatches
      .map((match) => match.key)
      .filter((key) =>
        ["experience", "education", "skills", "profile", "languages", "courses"].includes(key)
      )
  );
  const dateFormats = detectDateFormats(context.lines);
  const tableLikeLineCount = context.rawLines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return false;
    }

    const hasPipeColumns = (trimmed.match(/\|/g) ?? []).length >= 2;
    const hasTabs = /\t/.test(trimmed);
    const hasWideSpacing = (trimmed.match(/\s{3,}/g) ?? []).length >= 2;
    return hasPipeColumns || hasTabs || hasWideSpacing;
  }).length;

  const checks = [
    buildCheck({
      id: "cv_length",
      passed: context.wordCount >= 300 && context.wordCount <= 1600,
      pointsMax: 5,
      passedLabel: "CV-lengte is correct",
      failedLabel: "CV-lengte wijkt af van de norm",
      successFeedback:
        "Je CV valt binnen de gebruikelijke lengte voor Nederlandse recruiters.",
      failFeedback:
        "Je CV lijkt te lang of te kort. Nederlandse CVs zijn maximaal 2 A4-pagina's.",
      fix: "Houd je CV bij voorkeur tussen ongeveer 300 en 1600 woorden.",
    }),
    buildCheck({
      id: "section_headers",
      passed: standardHeaderKeys.size >= 3,
      pointsMax: 5,
      passedLabel: "Standaard sectiekoppen gevonden",
      failedLabel: "Sectienamen zijn ongebruikelijk",
      successFeedback:
        "Je gebruikt herkenbare sectiekoppen die recruiters en ATS-systemen snel begrijpen.",
      failFeedback:
        "Sectienamen zijn ongebruikelijk of ontbreken. Gebruik standaard koppen zoals 'Werkervaring' en 'Opleiding' zodat ATS de secties herkent.",
      fix: "Hernoem je secties naar standaard Nederlandse termen.",
    }),
    buildCheck({
      id: "no_columns",
      passed: tableLikeLineCount < 2,
      pointsMax: 5,
      passedLabel: "Geen kolommen of tabellen gedetecteerd",
      failedLabel: "Mogelijke tabellen of kolommen gedetecteerd",
      successFeedback:
        "Je CV lijkt lineair opgebouwd, wat beter leesbaar is voor ATS-systemen.",
      failFeedback:
        "Je CV bevat mogelijk tabellen of kolommen. ATS-systemen lezen dit door elkaar.",
      fix: "Gebruik een eenvoudige enkele kolom zonder tabellen of tekstvakken.",
    }),
    buildCheck({
      id: "date_format_consistency",
      passed: dateFormats.size <= 1,
      pointsMax: 5,
      passedLabel: "Datumnotatie is consistent",
      failedLabel: "Datumnotatie is inconsistent",
      successFeedback:
        "Je datums lijken consequent in hetzelfde formaat te staan.",
      failFeedback:
        "Datumnotaties zijn inconsistent. Gebruik één formaat door je hele CV, bij voorkeur 'jan 2022 - dec 2023'.",
      fix: "Kies één datumstijl en gebruik die overal op je CV.",
    }),
  ];

  return buildDimension("structuur", "Structuur & Opmaak", "layout", 20, checks);
}

function scorePersonalDetails(context: PreparedContext): CvScoreDimension {
  const emailMatch = context.text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/i);
  const email = emailMatch?.[0] ?? "";
  const hasEmail = Boolean(email);
  const hasPhone = detectPhoneNumber(context.text, context.rawLines);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(context.text);
  const hasLocation = detectLocation(context);

  const checks = [
    buildCheck({
      id: "email_present",
      passed: hasEmail,
      pointsMax: 2,
      passedLabel: "E-mailadres gevonden",
      failedLabel: "Geen e-mailadres gevonden",
      successFeedback:
        "Je e-mailadres staat duidelijk op het CV.",
      failFeedback:
        "Geen e-mailadres gevonden. Zorg dat je contactgegevens bovenaan staan.",
      fix: "Zet een professioneel e-mailadres direct bovenaan je CV.",
    }),
    buildCheck({
      id: "phone_present",
      passed: hasPhone,
      pointsMax: 2,
      passedLabel: "Telefoonnummer gevonden",
      failedLabel: "Geen telefoonnummer gevonden",
      successFeedback:
        "Je telefoonnummer lijkt aanwezig en direct bereikbaar.",
      failFeedback:
        "Geen telefoonnummer gevonden. Recruiters nemen direct contact op - zorg dat dit duidelijk staat.",
      fix: "Voeg een mobiel nummer toe in Nederlands of internationaal formaat.",
    }),
    buildCheck({
      id: "linkedin_present",
      passed: hasLinkedIn,
      pointsMax: 3,
      passedLabel: "LinkedIn-profiel gevonden",
      failedLabel: "Geen LinkedIn-profiel gevonden",
      successFeedback:
        "Je LinkedIn-link ondersteunt je CV met extra context voor recruiters.",
      failFeedback:
        "Geen LinkedIn-profiel gevonden. In Nederland verwachten recruiters een LinkedIn-link op je CV.",
      fix: "Voeg je volledige LinkedIn-profiel-URL toe bovenaan je CV.",
    }),
    buildCheck({
      id: "location_present",
      passed: hasLocation,
      pointsMax: 3,
      passedLabel: "Woonplaats of regio gevonden",
      failedLabel: "Geen woonplaats gevonden",
      successFeedback:
        "Je CV geeft aan waar je woont of in welke regio je beschikbaar bent.",
      failFeedback:
        "Geen woonplaats gevonden. Nederlandse recruiters willen weten of je in de buurt van de functie woont of bereid bent te reizen.",
      fix: "Vermeld je woonplaats of regio bij je contactgegevens.",
    }),
  ];

  return buildDimension("personalia", "Persoonlijke Gegevens", "contact", 10, checks);
}

function scoreProfile(
  context: PreparedContext,
  nuancedAnalysis: NuancedAnalysis | null
): CvScoreDimension {
  const hasProfile = Boolean(context.sections.profile);
  const profileWordCount = countWords(context.profileText);
  const profileLengthPoints = hasProfile ? getProfileLengthPoints(profileWordCount) : 0;
  const yearsOfExperience =
    /\b\d+[+]?\s*(jaar|jaren|year|years)\b/i.test(context.profileText);
  const localBuzzwordBand = getLocalBuzzwordBand(context.profileText, context.localLanguage);
  const buzzwordBand = resolveBuzzwordBand(localBuzzwordBand, nuancedAnalysis?.profile_buzzword_band);
  const buzzwordReason =
    nuancedAnalysis?.profile_buzzword_reason ||
    (buzzwordBand === "none"
      ? "Je profieltekst leunt niet op lege containerbegrippen."
      : "Je profieltekst bevat formuleringen die algemeen klinken in plaats van concreet te overtuigen.");

  const checks = [
    buildCheck({
      id: "profile_exists",
      passed: hasProfile,
      pointsMax: 6,
      passedLabel: "Profieltekst aanwezig",
      failedLabel: "Geen profieltekst gevonden",
      successFeedback:
        "Je CV opent met een profieltekst, precies waar recruiters als eerste naar kijken.",
      failFeedback:
        "Geen profieltekst gevonden. Dit is de eerste sectie die een recruiter leest - zonder profieltekst mis je de kans om direct een indruk te maken.",
      fix: "Voeg bovenaan een korte profieltekst toe van 3 tot 6 zinnen.",
    }),
    buildCheck({
      id: "profile_length",
      passed: profileLengthPoints === 5,
      pointsMax: 5,
      pointsEarned: profileLengthPoints,
      passedLabel: "Profieltekst heeft een sterke lengte",
      failedLabel: "Profieltekst lengte kan scherper",
      successFeedback:
        "Je profieltekst is bondig genoeg om snel te scannen en lang genoeg om richting te geven.",
      failFeedback:
        "Je profieltekst is te kort of te lang. Nederlandse profielteksten zijn 3 tot 6 zinnen - bondig en vacaturegericht.",
      fix: "Stuur op 50 tot 120 woorden, verdeeld over enkele korte zinnen.",
    }),
    buildCheck({
      id: "profile_years_experience",
      passed: yearsOfExperience,
      pointsMax: 4,
      passedLabel: "Jaren ervaring benoemd",
      failedLabel: "Jaren ervaring ontbreken",
      successFeedback:
        "Je profieltekst maakt direct duidelijk hoeveel ervaring je meebrengt.",
      failFeedback:
        "Noem kort hoeveel jaar ervaring je hebt, zodat een recruiter direct je niveau kan plaatsen.",
      fix: "Voeg een formulering toe zoals '5 jaar ervaring in...' of '3+ jaar ervaring met...'.",
    }),
    buildCheck({
      id: "profile_buzzwords",
      passed: hasProfile && buzzwordBand === "none",
      pointsMax: 5,
      pointsEarned: !hasProfile ? 0 : buzzwordBand === "none" ? 5 : buzzwordBand === "light" ? 3 : 0,
      passedLabel: "Profieltekst blijft concreet",
      failedLabel: "Profieltekst bevat holle buzzwords",
      successFeedback:
        "Je profieltekst klinkt concreet en geloofwaardig zonder lege containerwoorden.",
      failFeedback:
        "Je profieltekst bevat holle buzzwords zoals 'resultaatgericht' of 'teamplayer'. Vervang deze door concrete voorbeelden - dat overtuigt wel.",
      fix: "Schrap algemene buzzwords en vervang ze door meetbare of specifieke voorbeelden.",
    }),
  ];

  const dimension = buildDimension("profieltekst", "Profieltekst", "profile", 20, checks);
  if (dimension.checks.find((check) => check.id === "profile_buzzwords")?.passed) {
    attachReasonToCheck(dimension, "profile_buzzwords", buzzwordReason);
  }
  return dimension;
}

function scoreWorkExperience(
  context: PreparedContext,
  nuancedAnalysis: NuancedAnalysis | null
): CvScoreDimension {
  const hasExperience = Boolean(context.sections.experience);
  const quantifiedAchievement = detectQuantifiedAchievement(context.experienceBullets, context.experienceText);
  const localVerbBand = detectVerbBand(context.experienceBullets);
  const verbBand = resolveVerbBand(localVerbBand, nuancedAnalysis?.work_experience_verb_band);
  const verbPoints = !hasExperience ? 0 : verbBand === "high" ? 7 : verbBand === "medium" ? 4 : 1;
  const hasDates = hasExperienceDates(context.sections.experience);
  const verbReason =
    nuancedAnalysis?.work_experience_verb_reason ||
    (verbBand === "high"
      ? "Je bullets openen meestal met actieve werkwoorden."
      : "Veel bullets starten niet met krachtige werkwoorden of beschrijven vooral taken.");

  const checks = [
    buildCheck({
      id: "experience_exists",
      passed: hasExperience,
      pointsMax: 5,
      passedLabel: "Werkervaringsectie gevonden",
      failedLabel: "Geen werkervaringsectie gevonden",
      successFeedback:
        "De kern van je CV is duidelijk als aparte sectie aanwezig.",
      failFeedback:
        "Geen werkervaring sectie gevonden. Dit is de kern van je CV.",
      fix: "Maak een aparte sectie 'Werkervaring' of 'Ervaring' met functies in omgekeerd chronologische volgorde.",
    }),
    buildCheck({
      id: "quantified_achievement",
      passed: quantifiedAchievement,
      pointsMax: 8,
      passedLabel: "Meetbare resultaten gevonden",
      failedLabel: "Geen meetbare resultaten gevonden",
      successFeedback:
        "Je werkervaring bevat al concrete cijfers of resultaten die impact laten zien.",
      failFeedback:
        "Geen meetbare resultaten gevonden in je werkervaring. Bullets zoals 'verhoogde omzet met 32%' of 'leidde team van 8 mensen' maken je CV veel sterker dan taakbeschrijvingen.",
      fix: "Voeg per functie minstens één bullet toe met een cijfer, percentage of concrete uitkomst.",
    }),
    buildCheck({
      id: "active_verbs",
      passed: hasExperience && verbBand === "high",
      pointsMax: 7,
      pointsEarned: verbPoints,
      passedLabel: "Bullets openen sterk",
      failedLabel: "Werkervaring kan actiever geformuleerd worden",
      successFeedback:
        "Je bullets starten grotendeels met actieve werkwoorden die direct impact tonen.",
      failFeedback:
        "'Verantwoordelijk voor' is een van de zwakste bullet-openers. Begin bullets met een actief werkwoord zoals 'Leidde', 'Ontwikkelde' of 'Verhoogde' om impact direct duidelijk te maken.",
      fix: "Herschrijf taakzinnen naar actieve resultaatzinnen die met een sterk werkwoord beginnen.",
    }),
    buildCheck({
      id: "experience_dates",
      passed: hasDates,
      pointsMax: 5,
      passedLabel: "Datums bij functies gevonden",
      failedLabel: "Datums bij functies ontbreken",
      successFeedback:
        "Je werkervaring bevat datumverwijzingen die de tijdlijn verduidelijken.",
      failFeedback:
        "Sommige functies missen een datum. Recruiters en ATS-systemen verwachten begin- en einddatum bij elke functie.",
      fix: "Voeg per functie een begin- en einddatum toe in een consistent formaat.",
    }),
  ];

  const dimension = buildDimension("werkervaring", "Werkervaring", "experience", 25, checks);
  if (dimension.checks.find((check) => check.id === "active_verbs")?.passed) {
    attachReasonToCheck(dimension, "active_verbs", verbReason);
  }
  return dimension;
}

function scoreLanguageAndStyle(
  context: PreparedContext,
  nuancedAnalysis: NuancedAnalysis | null
): CvScoreDimension {
  const language = resolveLanguage(context.localLanguage, nuancedAnalysis?.language_consistency);
  const languageReason =
    nuancedAnalysis?.language_consistency_reason ||
    (language === "mixed"
      ? "Je CV schakelt tussen Nederlands en Engels."
      : "De taal van je CV oogt grotendeels consistent.");
  const personalText = [context.profileText, context.experienceText].filter(Boolean).join("\n");
  const hasFirstPerson = /\b(ik|mijn|me|mij)\b/i.test(personalText);
  const hasAllCapsHeaders = context.headerMatches.some(({ line }) => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    return (
      words.length > 3 &&
      /[A-Z]/.test(line) &&
      line === line.toUpperCase()
    );
  });
  const emailMatch = context.text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/i);
  const placeholderEmail =
    emailMatch?.[0] ? /(example|test|sample|placeholder|noreply)/i.test(emailMatch[0]) : false;

  const checks = [
    buildCheck({
      id: "language_consistency",
      passed: language !== "mixed",
      pointsMax: 5,
      passedLabel: "Taalgebruik is consistent",
      failedLabel: "Taalgebruik wisselt tussen Nederlands en Engels",
      successFeedback:
        "Je CV houdt één hoofdtaal aan, wat rustiger leest voor recruiters.",
      failFeedback:
        "Je CV wisselt tussen Nederlands en Engels. Kies één taal door je hele CV. Voor Nederlandse vacatures is Nederlands de standaard, tenzij de vacature Engels is.",
      fix: "Kies één taal voor je volledige CV en vertaal sectiekoppen en bullets consequent mee.",
    }),
    buildCheck({
      id: "no_first_person",
      passed: !hasFirstPerson,
      pointsMax: 5,
      passedLabel: "Geen ik-vorm gevonden",
      failedLabel: "Ik-vorm gevonden in profiel of bullets",
      successFeedback:
        "Je CV blijft zakelijk en direct zonder eerste-persoonsvorm.",
      failFeedback:
        "'Ik' heb je CV-bullets niet nodig. Nederlandse CVs worden geschreven zonder 'ik'. Verander 'Ik was verantwoordelijk voor' naar 'Verantwoordelijk voor' of beter: 'Leidde de implementatie van...'",
      fix: "Schrap 'ik', 'mijn', 'me' en 'mij' uit profieltekst en werkervaring.",
    }),
    buildCheck({
      id: "no_all_caps_headers",
      passed: !hasAllCapsHeaders,
      pointsMax: 3,
      passedLabel: "Sectiekoppen zijn goed leesbaar",
      failedLabel: "Sectiekoppen staan volledig in hoofdletters",
      successFeedback:
        "Je sectiekoppen blijven goed scanbaar en professioneel.",
      failFeedback:
        "Vermijd volledig hoofdlettergebruik in koppen - dit is moeilijker leesbaar en oogt minder professioneel.",
      fix: "Gebruik normale hoofdlettergebruikregels voor je sectiekoppen.",
    }),
    buildCheck({
      id: "no_placeholder_email",
      passed: !placeholderEmail,
      pointsMax: 2,
      passedLabel: "Contactgegevens ogen echt",
      failedLabel: "Voorbeeld-e-mailadres gedetecteerd",
      successFeedback:
        "Je contactgegevens lijken geen placeholder of testdata te bevatten.",
      failFeedback:
        "Het lijkt alsof er een voorbeeld-e-mailadres staat. Zorg dat je eigen contactgegevens kloppen.",
      fix: "Vervang voorbeeld- of testdata door je echte contactgegevens.",
    }),
  ];

  const dimension = buildDimension("taalgebruik", "Taalgebruik & Stijl", "language", 15, checks);
  attachReasonToCheck(dimension, "language_consistency", languageReason);
  return dimension;
}

function scoreCompleteness(context: PreparedContext): CvScoreDimension {
  const checks = [
    buildCheck({
      id: "education_present",
      passed: Boolean(context.sections.education),
      pointsMax: 3,
      passedLabel: "Opleiding aanwezig",
      failedLabel: "Geen opleidingssectie gevonden",
      successFeedback:
        "Je CV bevat een aparte opleidingssectie.",
      failFeedback:
        "Geen opleidingssectie gevonden. Zelfs met veel werkervaring vermelden Nederlandse CVs altijd opleiding.",
      fix: "Voeg een sectie 'Opleiding' toe met diploma, school en jaartallen.",
    }),
    buildCheck({
      id: "skills_present",
      passed: Boolean(context.sections.skills),
      pointsMax: 3,
      passedLabel: "Vaardighedensectie aanwezig",
      failedLabel: "Geen vaardighedensectie gevonden",
      successFeedback:
        "Je vaardigheden staan los benoemd, wat recruiters en ATS-systemen helpt.",
      failFeedback:
        "Geen vaardighedensectie gevonden. ATS-systemen zoeken specifiek naar skills - een losse sectie helpt enorm.",
      fix: "Voeg een aparte vaardighedensectie toe met relevante hard en soft skills.",
    }),
    buildCheck({
      id: "languages_present",
      passed: Boolean(context.sections.languages),
      pointsMax: 2,
      passedLabel: "Talensectie aanwezig",
      failedLabel: "Geen talensectie gevonden",
      successFeedback:
        "Je taalvaardigheid is als aparte sectie zichtbaar.",
      failFeedback:
        "Geen talensectie gevonden. In Nederland is taalvaardigheid een standaard onderdeel van een CV - ook als je alleen Nederlands spreekt.",
      fix: "Voeg een sectie 'Talen' toe met je niveaus, bijvoorbeeld Nederlands en Engels.",
    }),
    buildCheck({
      id: "interests_present",
      passed: Boolean(context.sections.interests),
      pointsMax: 2,
      passedLabel: "Interessesectie aanwezig",
      failedLabel: "Geen interessesectie gevonden",
      successFeedback:
        "Je CV bevat ook een persoonlijker onderdeel met interesses.",
      failFeedback:
        "Geen interessesectie. In Nederland vermelden veel CV's persoonlijke interesses - dit maakt je menselijker voor recruiters. Niet verplicht, maar aanbevolen.",
      fix: "Voeg eventueel 2 tot 4 relevante interesses of hobby's toe.",
    }),
  ];

  return buildDimension("volledigheid", "Volledigheid", "checklist", 10, checks);
}

function buildDimension(
  id: string,
  name: string,
  icon: string,
  max: number,
  checks: CvScoreCheck[]
): CvScoreDimension {
  const score = checks.reduce((sum, check) => sum + check.points_earned, 0);
  const percentage = Math.round((score / max) * 100);
  const status: CvScoreStatus =
    percentage >= 80 ? "good" : percentage >= 50 ? "improvement" : "critical";

  return {
    id,
    name,
    icon,
    score,
    max,
    percentage,
    status,
    checks,
  };
}

function buildCheck(spec: CheckSpec): CvScoreCheck {
  const pointsEarned = spec.pointsEarned ?? (spec.passed ? spec.pointsMax : 0);

  return {
    id: spec.id,
    passed: spec.passed,
    points_earned: pointsEarned,
    points_max: spec.pointsMax,
    label: spec.passed ? spec.passedLabel : spec.failedLabel,
    feedback: spec.passed ? spec.successFeedback : spec.failFeedback,
    fix: spec.passed ? null : spec.fix ?? null,
  };
}

function attachReasonToCheck(
  dimension: CvScoreDimension,
  checkId: string,
  reason: string
): void {
  const check = dimension.checks.find((item) => item.id === checkId);
  if (!check || !reason) {
    return;
  }

  if (check.passed) {
    check.feedback = reason;
    return;
  }

  check.feedback = `${check.feedback} ${reason}`.trim();
}

function collectIssues(dimensions: CvScoreDimension[]): CvScoreIssue[] {
  const severityOrder: Record<CvScoreSeverity, number> = {
    critical: 0,
    improvement: 1,
    passed: 2,
  };

  return dimensions
    .flatMap((dimension) =>
      dimension.checks.map((check) => ({
        severity: getIssueSeverity(dimension.id, check),
        dimension: dimension.id,
        label: check.label,
        feedback: check.feedback ?? "",
        fix: check.fix,
      }))
    )
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

function getIssueSeverity(dimensionId: string, check: CvScoreCheck): CvScoreSeverity {
  if (check.passed) {
    return "passed";
  }

  const criticalCheckIds = new Set([
    "experience_exists",
    "language_consistency",
    "email_present",
    "phone_present",
    "education_present",
    "skills_present",
  ]);

  if (criticalCheckIds.has(check.id)) {
    return "critical";
  }

  if (dimensionId === "personalia" && check.id === "location_present") {
    return "improvement";
  }

  return "improvement";
}

function detectDateFormats(lines: string[]): Set<string> {
  const formats = new Set<string>();

  for (const line of lines) {
    const normalized = normalizeForMatching(line);

    if (new RegExp(`\\b(?:${[...DUTCH_MONTHS, ...ENGLISH_MONTHS].join("|")})\\s+\\d{4}\\b`, "i").test(normalized)) {
      formats.add("month_name");
      continue;
    }

    if (/\b\d{4}[-/]\d{1,2}\b/.test(normalized)) {
      formats.add("year_month");
      continue;
    }

    if (/\b\d{1,2}[-/]\d{4}\b/.test(normalized)) {
      formats.add("month_year_numeric");
      continue;
    }

    if (/\b\d{4}\b(?:\s*[-–]\s*(?:\d{4}|heden|nu|present|current))?/.test(normalized)) {
      formats.add("year_only");
    }
  }

  return formats;
}

function countBuzzwords(
  text: string,
  language: "dutch" | "english" | "mixed"
): number {
  const normalized = normalizeForMatching(text);
  const targetBuzzwords =
    language === "english"
      ? ENGLISH_BUZZWORDS
      : language === "mixed"
        ? [...DUTCH_BUZZWORDS, ...ENGLISH_BUZZWORDS]
        : DUTCH_BUZZWORDS;

  return targetBuzzwords.filter((buzzword) =>
    normalized.includes(normalizeForMatching(buzzword))
  ).length;
}

function getLocalBuzzwordBand(
  text: string,
  language: "dutch" | "english" | "mixed"
): "none" | "light" | "heavy" {
  const count = countBuzzwords(text, language);
  if (count === 0) {
    return "none";
  }

  return count <= 2 ? "light" : "heavy";
}

function resolveBuzzwordBand(
  localBand: "none" | "light" | "heavy",
  aiBand?: NuancedAnalysis["profile_buzzword_band"]
): "none" | "light" | "heavy" {
  if (!aiBand) {
    return localBand;
  }

  if (localBand === "heavy") {
    return "heavy";
  }

  if (localBand === "light") {
    return "light";
  }

  if (aiBand === "heavy") {
    return "light";
  }

  return aiBand;
}

function getProfileLengthPoints(wordCount: number): number {
  if (wordCount >= 50 && wordCount <= 120) {
    return 5;
  }

  if (wordCount >= 30 && wordCount < 50) {
    return 2;
  }

  if (wordCount > 120 && wordCount <= 150) {
    return 3;
  }

  if (wordCount > 150) {
    return 2;
  }

  return 0;
}

function detectQuantifiedAchievement(bullets: string[], experienceText: string): boolean {
  const candidates = bullets.length > 0
    ? bullets
    : experienceText
        .split(/[.!?]\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

  return candidates.some((candidate) => {
    const normalized = normalizeForMatching(candidate);

    if (!/\d/.test(normalized)) {
      return false;
    }

    return (
      /€\s?\d|\d+\s?%|\d+\s?(?:procent|euro|eur|klanten|medewerkers|mensen|projecten|teams?|uur|uren|dagen|maanden|jaar|jaren|x|keer|fte)\b/i.test(
        candidate
      ) ||
      /\b\d+\s?(?:k|m)\b/i.test(normalized)
    );
  });
}

function detectVerbBand(bullets: string[]): "high" | "medium" | "low" {
  if (bullets.length === 0) {
    return "low";
  }

  let strongCount = 0;

  for (const bullet of bullets) {
    const normalized = normalizeForMatching(bullet);
    const opener = normalized.split(/\s+/).slice(0, 3).join(" ");

    if (WEAK_ACTION_OPENERS.some((weak) => opener.startsWith(normalizeForMatching(weak)))) {
      continue;
    }

    if (STRONG_ACTION_VERBS.some((verb) => opener.startsWith(verb))) {
      strongCount += 1;
    }
  }

  const ratio = strongCount / bullets.length;
  if (ratio > 0.5) {
    return "high";
  }

  if (ratio >= 0.25) {
    return "medium";
  }

  return "low";
}

function resolveVerbBand(
  localBand: "high" | "medium" | "low",
  aiBand?: NuancedAnalysis["work_experience_verb_band"]
): "high" | "medium" | "low" {
  if (!aiBand) {
    return localBand;
  }

  if (localBand === "high") {
    return "high";
  }

  if (localBand === "medium") {
    return aiBand === "high" ? "high" : "medium";
  }

  if (aiBand === "high") {
    return "medium";
  }

  return aiBand;
}

function hasExperienceDates(section?: SectionInfo): boolean {
  if (!section) {
    return false;
  }

  const dateLineCount = section.lines.filter((line) => detectDateFormats([line]).size > 0).length;
  const dateMatchCount =
    section.text.match(
      /\b(?:\d{4}|\d{1,2}[-/]\d{4}|\d{4}[-/]\d{1,2}|(?:jan|januari|feb|februari|mrt|maart|apr|april|mei|jun|juni|jul|juli|aug|augustus|sep|sept|september|okt|oktober|nov|november|dec|december)\s+\d{4})\b/gi
    )?.length ?? 0;

  return dateLineCount > 0 || dateMatchCount >= 2;
}

function detectDominantLanguage(text: string): "dutch" | "english" | "mixed" {
  const tokens = normalizeForMatching(text).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return "mixed";
  }

  const dutchHits = tokens.filter((token) => DUTCH_FUNCTION_WORDS.includes(token)).length;
  const englishHits = tokens.filter((token) => ENGLISH_FUNCTION_WORDS.includes(token)).length;
  const totalHits = dutchHits + englishHits;

  if (totalHits < 8) {
    return "mixed";
  }

  const dutchRatio = dutchHits / totalHits;
  const englishRatio = englishHits / totalHits;

  if (dutchRatio >= 0.8) {
    return "dutch";
  }

  if (englishRatio >= 0.8) {
    return "english";
  }

  return "mixed";
}

function resolveLanguage(
  localLanguage: "dutch" | "english" | "mixed",
  aiLanguage?: NuancedAnalysis["language_consistency"]
): "dutch" | "english" | "mixed" {
  if (localLanguage !== "mixed") {
    return localLanguage;
  }

  return aiLanguage ?? localLanguage;
}

function getScoreBand(totalScore: number): CvScoreBand {
  if (totalScore < 50) {
    return "critical";
  }

  if (totalScore < 70) {
    return "fair";
  }

  if (totalScore < 85) {
    return "good";
  }

  return "excellent";
}

function getScoreColor(totalScore: number): CvScoreColor {
  if (totalScore < 50) {
    return "red";
  }

  if (totalScore < 70) {
    return "orange";
  }

  if (totalScore < 85) {
    return "yellow";
  }

  return "green";
}

function getScoreLabel(totalScore: number): string {
  if (totalScore < 50) {
    return "Je CV heeft kritieke verbeterpunten";
  }

  if (totalScore < 70) {
    return "Goed begin, maar recruiters missen nog iets";
  }

  if (totalScore < 85) {
    return "Sterke basis - nu de details fijnzetten";
  }

  return "Uitstekend CV - klaar voor de arbeidsmarkt";
}
