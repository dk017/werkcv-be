"use client";
/* eslint-disable react-hooks/static-components */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TemplateConfig, ColorTheme } from "@/lib/templates";
import { CVData, defaultCV, sampleCV } from "@/lib/cv";
import { getTemplateComponent, getTheme } from "@/app/editor/templates";
import Footer from "@/components/Footer";
import NavUserMenu from "@/components/NavUserMenu";
import { getStoredAttribution, track } from "@/lib/analytics";
import { UiLanguage } from "@/lib/ui-language";

interface TemplateGalleryProps {
  templates: TemplateConfig[];
  uiLanguage?: UiLanguage;
}

const categoryLabels: Record<UiLanguage, Record<string, string>> = {
  nl: {
    all: "Alle",
    classic: "Klassiek",
    modern: "Modern",
    creative: "Creatief",
    minimal: "Minimaal",
  },
  en: {
    all: "All",
    classic: "Classic",
    modern: "Modern",
    creative: "Creative",
    minimal: "Minimal",
  },
};

const templatePreviewData: CVData = {
  ...sampleCV,
  personal: {
    ...sampleCV.personal,
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    linkedIn: "linkedin.com/in/simone-van-roodenburg",
    github: "github.com/simoneroodenburg",
    website: "simoneroodenburg.dev",
    summary:
      "Gemotiveerde en enthousiaste lerares basisonderwijs met een passie voor het inspireren en begeleiden van jonge leerlingen. Ik vertaal leerdoelen naar praktische lessen, werk datagedreven aan leerresultaten en bouw sterke ouder- en teamcommunicatie.",
  },
  experience: [
    ...sampleCV.experience,
    {
      role: "Onderwijsassistent",
      company: "OBS De Horizon",
      location: "Utrecht",
      start: "augustus 2016",
      end: "juli 2018",
      description:
        "Ondersteunde leerkrachten in groep 3 en 5 bij taal- en rekendidactiek.",
      highlights: [
        "Differentiatieplannen opgesteld voor leerlingen met taalachterstand",
        "Projectweek georganiseerd met lokale bibliotheek en ouders",
      ],
    },
  ],
  courses: [
    ...sampleCV.courses,
    {
      name: "Didactisch Coachen",
      institution: "Onderwijsacademie NL",
      year: "2023",
    },
  ],
  awards: [
    "Docent van het Jaar nominatie (2022)",
    "Schoolinnovatie Award (team, 2021)",
  ],
  interests: [
    "Schilderen",
    "Kinderliteratuur",
    "Natuurwandelingen",
    "Onderwijsinnovatie",
  ],
};

const englishTemplatePreviewData: CVData = {
  ...templatePreviewData,
  personal: {
    ...templatePreviewData.personal,
    title: "Primary School Teacher",
    resumeLanguage: "en",
    summary:
      "Motivated and energetic primary school teacher with a strong focus on practical lessons, measurable learning progress, and clear communication with parents and colleagues.",
  },
  experience: templatePreviewData.experience.map((item, index) =>
    index === 0
      ? {
          ...item,
          role: "Primary School Teacher",
          start: "August 2020",
          end: "Present",
          description:
            "Develops engaging lessons and tracks learning progress across core subjects.",
        }
      : {
          ...item,
          role: "Teaching Assistant",
          start: "August 2016",
          end: "July 2018",
          description:
            "Supported teachers in language and math classes for mixed-ability groups.",
        },
  ),
  education: templatePreviewData.education.map((item) => ({
    ...item,
    degree: "Bachelor of Primary Education",
    start: "September 2012",
    end: "June 2016",
    description:
      "Focused on lesson planning, child development, and practical classroom management.",
  })),
  skills: [
    { name: "Differentiated teaching", level: 5 },
    { name: "Classroom management", level: 5 },
    { name: "Parent communication", level: 4 },
    { name: "Curriculum planning", level: 4 },
    { name: "Educational technology", level: 4 },
  ],
  languages: [
    { name: "English", level: "Moedertaal" },
    { name: "Dutch", level: "Goed" },
    { name: "German", level: "Basis" },
  ],
  courses: [
    {
      name: "Instructional Coaching",
      institution: "Education Academy NL",
      year: "2023",
    },
  ],
  awards: [
    "Teacher of the Year nomination (2022)",
    "School Innovation Award (team, 2021)",
  ],
  interests: [
    "Painting",
    "Children's literature",
    "Nature walks",
    "Education innovation",
  ],
};

const templateDescriptionsEn: Record<string, string> = {
  professional:
    "Clean, credible, and modern. A safe choice for business-focused roles.",
  classical: "Timeless and mature. Strong fit for experienced professionals.",
  formal: "Structured and polished. Useful for management and consulting roles.",
  modern:
    "Fresh without losing recruiter safety. Good for contemporary office roles.",
  dynamic:
    "Sharper visual energy while staying ATS-aware and easy to scan.",
  jobboss:
    "Friendly and lively. Strong option for starters and creative applicants.",
  elegant: "Refined and balanced. Works well across many professional sectors.",
  remarkable:
    "Confident and distinctive without becoming noisy for recruiters.",
  sepia:
    "Warm, organized, and stylish. Useful when you want personality with structure.",
  simple: "Minimal and direct. Lets your experience do the talking.",
  robust: "Clear and information-dense. Good when you have more to show.",
  monochrome:
    "Typographic and focused. Strong if you want a calm, high-contrast layout.",
  ats: "Built for ATS readability first. Plain, structured, and keyword-friendly.",
};

function RichTemplatePreview({
  templateId,
  colorThemeId,
  data,
}: {
  templateId: string;
  colorThemeId: string;
  data: CVData;
}) {
  const TemplateComponent = getTemplateComponent(templateId);
  const theme = getTheme(templateId, colorThemeId);

  return (
    <div className="relative h-full w-full overflow-hidden border-2 border-black bg-white">
      <div
        className="origin-top-left pointer-events-none"
        style={{
          transform: "scale(0.24)",
          width: `${100 / 0.24}%`,
        }}
      >
        <TemplateComponent data={data} theme={theme} nameTag="div" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/95 to-transparent" />
    </div>
  );
}

const recommendedTemplateIds = new Set(["classical", "ats", "modern"]);

const templatePriority: Record<string, number> = {
  classical: 0,
  professional: 1,
  ats: 2,
  modern: 3,
  formal: 4,
};

const quickStartTemplates = [
  {
    templateId: "classical",
    themeId: "charcoal",
  },
  {
    templateId: "ats",
    themeId: "charcoal",
  },
  {
    templateId: "modern",
    themeId: "ocean-blue",
  },
];

function getQuickStartCopy(templateId: string, uiLanguage: UiLanguage) {
  if (uiLanguage === "en") {
    if (templateId === "classical") {
      return {
        eyebrow: "Safest choice for most jobs",
        body: "Best starting point if you want a calm, credible application format for Dutch employers.",
      };
    }
    if (templateId === "ats") {
      return {
        eyebrow: "Strict ATS focus",
        body: "Pick this when scanability, standard headings, and keyword structure matter most for the vacancy.",
      };
    }
    return {
      eyebrow: "Modern but recruiter-safe",
      body: "More personality without becoming risky for recruiters or applicant tracking systems.",
    };
  }

  if (templateId === "classical") {
    return {
      eyebrow: "Veilige keuze voor de meeste vacatures",
      body: "Beste startpunt als je snel een rustige, geloofwaardige sollicitatieversie wilt voor Nederlandse werkgevers.",
    };
  }
  if (templateId === "ats") {
    return {
      eyebrow: "Strikte ATS-focus",
      body: "Kies deze als scanbaarheid, standaardkoppen en keyword-structuur het zwaarst meewegen voor de vacature.",
    };
  }
  return {
    eyebrow: "Modern maar veilig",
    body: "Meer uitstraling zonder onrustig te worden voor recruiters of sollicitatiesoftware.",
  };
}

export default function TemplateGallery({
  templates,
  uiLanguage = "nl",
}: TemplateGalleryProps) {
  const router = useRouter();
  const isEnglish = uiLanguage === "en";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [hoveredColors, setHoveredColors] = useState<Record<string, string>>({});

  const previewData = isEnglish ? englishTemplatePreviewData : templatePreviewData;

  const getTemplateName = (template: TemplateConfig) =>
    isEnglish ? template.name : template.nameDutch;
  const getTemplateDescription = (template: TemplateConfig) =>
    isEnglish ? templateDescriptionsEn[template.id] || template.description : template.description;

  const filteredTemplates = templates
    .filter((template) => {
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        template.nameDutch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getTemplateDescription(template)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((left, right) => {
      const leftPriority = templatePriority[left.id] ?? 999;
      const rightPriority = templatePriority[right.id] ?? 999;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      return getTemplateName(left).localeCompare(
        getTemplateName(right),
        isEnglish ? "en" : "nl",
      );
    });

  const categoryCounts: Record<string, number> = {
    all: templates.length,
    classic: templates.filter((template) => template.category === "classic").length,
    modern: templates.filter((template) => template.category === "modern").length,
    creative: templates.filter((template) => template.category === "creative").length,
    minimal: templates.filter((template) => template.category === "minimal").length,
  };

  const handleSelectTemplate = async (
    templateId: string,
    defaultThemeId: string,
    entryPoint = "template_gallery",
  ) => {
    setIsCreating(templateId);
    try {
      track("cta_clicked", { location: entryPoint, label: templateId });
      track("start_cv", { entryPoint, templateId });
      const attribution = getStoredAttribution();
      const initialData: CVData = {
        ...defaultCV,
        personal: {
          ...defaultCV.personal,
          resumeLanguage: isEnglish ? "en" : "nl",
        },
      };

      const response = await fetch("/api/create-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          colorThemeId: defaultThemeId,
          attribution,
          startSource: entryPoint,
          initialData,
        }),
      });
      const raw = await response.text();
      let data: { cvId?: string; error?: string } | null = null;
      if (raw) {
        try {
          data = JSON.parse(raw) as { cvId?: string; error?: string };
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/login?next=${encodeURIComponent(isEnglish ? "/en/templates" : "/templates")}`);
          return;
        }
        const message = data?.error || `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      if (!data?.cvId || typeof data.cvId !== "string") {
        throw new Error("Missing cvId in create-cv response");
      }

      router.push(`${isEnglish ? "/en/editor" : "/editor"}?id=${data.cvId}`);
    } catch (error) {
      console.error("Error creating CV:", error);
    } finally {
      setIsCreating(null);
    }
  };

  const getActiveTheme = (template: TemplateConfig): ColorTheme => {
    const hoveredThemeId = hoveredColors[template.id];
    if (hoveredThemeId) {
      return (
        template.colorThemes.find((theme) => theme.id === hoveredThemeId) ||
        template.colorThemes[0]
      );
    }
    return (
      template.colorThemes.find((theme) => theme.id === template.defaultThemeId) ||
      template.colorThemes[0]
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFEF0]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-20 h-40 w-40 rounded-full bg-purple-300 opacity-30" />
        <div className="absolute top-60 right-32 h-32 w-32 rounded-full bg-yellow-300 opacity-30" />
        <div className="absolute bottom-60 left-1/3 h-28 w-28 rounded-full bg-blue-300 opacity-30" />
        <div className="absolute bottom-32 right-1/4 h-36 w-36 rounded-full bg-green-300 opacity-30" />
      </div>

      <header className="sticky top-0 z-10 border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={isEnglish ? "/en" : "/"} className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tight text-black">
              Werk<span className="bg-yellow-400 px-1">CV</span>.nl
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <NavUserMenu />
            <div className="border-2 border-black bg-blue-400 px-3 py-1 text-sm font-bold text-black">
              {isEnglish ? "Choose your template" : "Kies je template"}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-slate-600">
            {isEnglish ? "Jobs in the Netherlands" : "Nederlandse sollicitaties"}
          </p>
          <h1 className="mb-4 text-4xl font-black text-black md:text-5xl">
            {isEnglish ? "Choose your " : "Kies je "}
            <span className="inline-block -rotate-1 border-4 border-black bg-purple-400 px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {isEnglish ? "ATS-friendly" : "ATS-vriendelijke"}
            </span>
            {isEnglish ? " CV template" : " CV template"}
          </h1>
          <p className="mx-auto max-w-3xl text-xl font-medium text-black">
            {isEnglish
              ? "Compare ATS-friendly layouts for jobs in the Netherlands, choose the style that fits your target role, and switch template or color later if your content changes."
              : "Vergelijk ATS-vriendelijke layouts voor Nederlandse vacatures, kies de stijl die bij je rol past en wissel later nog van template of kleur als je inhoud verandert."}
            <br />
            <span className="bg-green-200 px-1">
              {isEnglish
                ? "Start free and pay once per CV when you want to download the PDF."
                : "Start gratis, betaal eenmalig per CV wanneer je wilt downloaden."}
            </span>
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-black">
            <span className="border-2 border-black bg-white px-3 py-1">
              {isEnglish ? "ATS-friendly" : "ATS-vriendelijk"}
            </span>
            <span className="border-2 border-black bg-white px-3 py-1">
              {isEnglish ? "For Dutch-market jobs" : "Voor NL vacatures"}
            </span>
            <span className="border-2 border-black bg-white px-3 py-1">
              {isEnglish ? "Download again later" : "Later opnieuw downloaden"}
            </span>
            <span className="border-2 border-black bg-white px-3 py-1">
              {isEnglish ? "No subscription" : "Geen abonnement"}
            </span>
          </div>
        </div>

        <div className="mb-5 text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-600">
            {isEnglish ? "Which one should I pick?" : "Welke moet ik kiezen?"}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {isEnglish ? (
              <>
                If you are unsure, start with{" "}
                <span className="bg-yellow-200 px-1 font-black text-black">
                  Classical
                </span>
                . We highlight it first because it feels safest for broad
                applications in the Netherlands.
              </>
            ) : (
              <>
                Als je twijfelt, begin met{" "}
                <span className="bg-yellow-200 px-1 font-black text-black">
                  Klassiek
                </span>
                . Die route geven we nu bewust voorrang omdat hij het veiligst
                voelt voor brede Nederlandse sollicitaties.
              </>
            )}
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {quickStartTemplates.map((item) => {
            const template = templates.find((entry) => entry.id === item.templateId);
            if (!template) return null;

            const quickStart = getQuickStartCopy(item.templateId, uiLanguage);

            return (
              <div
                key={item.templateId}
                className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-600">
                  {quickStart.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  {getTemplateName(template)}
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
                  {quickStart.body}
                </p>
                <button
                  onClick={() =>
                    handleSelectTemplate(
                      item.templateId,
                      item.themeId,
                      "template_quick_pick",
                    )
                  }
                  disabled={isCreating !== null}
                  className="mt-5 w-full border-3 border-black bg-yellow-400 px-4 py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:cursor-wait disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
                  style={{ borderWidth: "3px" }}
                >
                  {isCreating === item.templateId
                    ? isEnglish
                      ? "Creating..."
                      : "Bezig..."
                    : isEnglish
                      ? `Start with ${getTemplateName(template)}`
                      : `Start met ${getTemplateName(template)}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mb-6 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={isEnglish ? "Search by name or style..." : "Zoek op naam of stijl..."}
            className="w-full border-4 border-black bg-white px-4 py-3 text-sm font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none placeholder:text-gray-400 focus:ring-0"
          />
        </div>

        <div className="mb-10 -mx-6 flex justify-center gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:px-0">
          {Object.entries(categoryLabels[uiLanguage]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-2 whitespace-nowrap border-3 border-black px-5 py-2 text-sm font-bold transition-all ${
                selectedCategory === key
                  ? "translate-x-[2px] translate-y-[2px] bg-black text-white shadow-none"
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
              style={{ borderWidth: "3px" }}
            >
              {label}
              <span
                className={`border-2 border-current px-1.5 py-0.5 text-xs font-black ${
                  selectedCategory === key ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                {categoryCounts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-8 border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-600">
                {isEnglish ? "Classical" : "Klassiek"}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {isEnglish
                  ? "Best choice if you want clarity, calm structure, and broad usability."
                  : "Beste keuze als je vooral rust, duidelijkheid en brede inzetbaarheid zoekt."}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-600">
                ATS
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {isEnglish
                  ? "Use this when the vacancy feels corporate, strict, or heavily keyword-driven."
                  : "Gebruik dit als de vacature corporate, streng of sterk keyword-gedreven aanvoelt."}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-600">
                Modern
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {isEnglish
                  ? "Choose this if you want more visual personality without losing recruiter safety."
                  : "Kies deze als je iets meer uitstraling wilt zonder recruiter-veiligheid op te geven."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const activeTheme = getActiveTheme(template);

            return (
              <div
                key={template.id}
                className="group relative overflow-hidden border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                {recommendedTemplateIds.has(template.id) && (
                  <div
                    className="absolute right-2 top-2 z-20 rotate-3 border-3 border-black bg-yellow-400 px-2 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ borderWidth: "3px" }}
                  >
                    {isEnglish ? "Recommended" : "Aanbevolen"}
                  </div>
                )}

                <div
                  className="relative h-56 overflow-hidden p-4 md:h-72"
                  style={{ backgroundColor: "#f5f5f5" }}
                >
                  <div className="relative z-10 h-full transition-transform duration-200 group-hover:scale-[1.01]">
                    <RichTemplatePreview
                      templateId={template.id}
                      colorThemeId={activeTheme.id}
                      data={previewData}
                    />
                  </div>
                </div>

                <div className="border-t-4 border-black bg-white p-5">
                  <h3 className="mb-1 text-xl font-black text-black">
                    {getTemplateName(template)}
                  </h3>
                  <p className="mb-4 text-sm font-medium text-black">
                    {getTemplateDescription(template)}
                  </p>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-black">
                      {isEnglish ? "Colors:" : "Kleuren:"}
                    </span>
                    <div className="flex gap-1">
                      {template.colorThemes.slice(0, 6).map((theme) => (
                        <button
                          key={theme.id}
                          className={`h-7 w-7 border-2 border-black transition-all ${
                            activeTheme.id === theme.id
                              ? "scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: theme.primary }}
                          title={theme.name}
                          onMouseEnter={() =>
                            setHoveredColors((prev) => ({ ...prev, [template.id]: theme.id }))
                          }
                          onMouseLeave={() =>
                            setHoveredColors((prev) => ({ ...prev, [template.id]: "" }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleSelectTemplate(template.id, template.defaultThemeId)
                    }
                    disabled={isCreating !== null}
                    className={`w-full border-3 border-black py-3 text-sm font-black transition-all ${
                      isCreating === template.id
                        ? "cursor-wait bg-gray-300 text-gray-600 shadow-none"
                        : "bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                    }`}
                    style={{ borderWidth: "3px" }}
                  >
                    {isCreating === template.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-3 border-black border-t-transparent" />
                        {isEnglish ? "Creating..." : "Bezig..."}
                      </span>
                    ) : isEnglish ? (
                      `Start with ${getTemplateName(template)}`
                    ) : (
                      `Start met ${getTemplateName(template)}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="py-16 text-center">
            <div className="inline-block border-4 border-black bg-yellow-400 px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold text-black">
                {searchQuery
                  ? isEnglish
                    ? `No templates found for "${searchQuery}". Try a different search.`
                    : `Geen templates gevonden voor "${searchQuery}". Probeer een andere zoekterm.`
                  : isEnglish
                    ? "No templates found in this category."
                    : "Geen templates gevonden in deze categorie."}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
