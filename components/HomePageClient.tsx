"use client";
/* eslint-disable react-hooks/static-components */

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import NavUserMenu from "@/components/NavUserMenu";
import { templateList } from "@/lib/templates/registry";
import { CVData, sampleCV } from "@/lib/cv";
import { getTemplateComponent, getTheme } from "@/app/editor/templates";
import { LinkTextProvider } from "@/app/editor/templates/link-utils";
import { getStoredAttribution, track } from "@/lib/analytics";
import { applicationBundlePrice, cvDownloadPrice, homepageFaqItems, profilePhotoPrice } from "@/lib/site-content";

const templateCount = templateList.length;
const belgiumRouteCount = 6;
const showcaseTemplates = ["professional", "modern", "elegant", "ats"]
  .map((id) => templateList.find((template) => template.id === id))
  .filter(Boolean);

const HERO_SCALE = 220 / 794;
const heroSlides = [
  { templateId: "professional", themeId: "classic-blue", label: "Professioneel" },
  { templateId: "modern", themeId: "ocean-blue", label: "Modern" },
  { templateId: "elegant", themeId: "elegant-navy", label: "Elegant" },
  { templateId: "dynamic", themeId: "purple-royal", label: "Dynamisch" },
  { templateId: "remarkable", themeId: "rose-gold", label: "Opvallend" },
  { templateId: "formal", themeId: "elegant-navy", label: "Formeel" },
  { templateId: "sepia", themeId: "warm-earth", label: "Sepia" },
  { templateId: "jobboss", themeId: "modern-teal", label: "Sollicitatie" },
];

const homepageTemplatePreviewData: CVData = {
  ...sampleCV,
  personal: {
    ...sampleCV.personal,
    name: "Anouk Peeters",
    title: "Marketing & Communicatie Specialist",
    email: "anouk.peeters@gmail.com",
    phone: "+32 470 12 34 56",
    location: "Antwerpen",
    linkedIn: "linkedin.com/in/anouk-peeters",
    website: "anoukpeeters.be",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    summary:
      "Resultaatgerichte marketeer met ervaring in contentstrategie, campagne-optimalisatie en merkpositionering. Sterk in heldere cv-structuur, data-gedreven keuzes en sollicitaties voor de Belgische arbeidsmarkt.",
  },
  experience: [
    {
      role: "Senior Marketing Specialist",
      company: "BrightWave Digital",
      location: "Antwerpen",
      start: "jan 2022",
      end: "heden",
      description: "",
      highlights: [
        "Verhoogde organisch verkeer met 48% via SEO-contentclusters.",
        "Leidde omnichannel campagnes met gemiddeld +32% leadgroei.",
      ],
    },
    {
      role: "Content Marketeer",
      company: "ScaleUp Partners",
      location: "Gent",
      start: "mrt 2019",
      end: "dec 2021",
      description: "",
      highlights: [
        "Ontwikkelde employer-branding strategie voor internationale hiring.",
        "Verbeterde nieuwsbrief-CTR van 3,8% naar 7,1% binnen 5 maanden.",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor Communicatiemanagement",
      school: "AP Hogeschool",
      location: "Antwerpen",
      start: "2014",
      end: "2018",
      description: "",
    },
  ],
  skills: [
    { name: "SEO & Contentstrategie", level: 5 },
    { name: "Campagne Management", level: 5 },
    { name: "GA4 & Looker Studio", level: 4 },
    { name: "Copywriting", level: 4 },
    { name: "Stakeholdermanagement", level: 4 },
  ],
  languages: [
    { name: "Nederlands", level: "Moedertaal" },
    { name: "Engels", level: "Vloeiend" },
    { name: "Frans", level: "Goed" },
  ],
  interests: ["Hardlopen", "Design", "Reizen", "Podcasting"],
  awards: ["Best Campaign Award (2023)"],
};

function TemplatePreviewPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-full overflow-hidden border-2 border-black bg-white ${
        compact ? "min-h-[208px]" : "min-h-[312px]"
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc_0%,#fefce8_48%,#dbeafe_100%)]" />
      <div className="relative flex h-full flex-col gap-3 p-4">
        <div className="h-4 w-28 border-2 border-black bg-yellow-300" />
        <div className="h-3 w-24 border-2 border-black bg-blue-200" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full border border-black/70 bg-white/80" />
          <div className="h-3 w-5/6 border border-black/70 bg-white/80" />
          <div className="h-3 w-4/6 border border-black/70 bg-white/80" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <div className="h-10 border-2 border-black bg-pink-100" />
          <div className="h-10 border-2 border-black bg-green-100" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/95 to-transparent" />
    </div>
  );
}

function HeroCarouselPlaceholder() {
  return (
    <div className="hidden md:flex flex-col items-center gap-5 flex-shrink-0">
      <div className="relative w-[220px] h-[312px]">
        <div
          className="absolute inset-0 bg-blue-300 border-4 border-black"
          style={{ transform: "rotate(6deg) translate(10px, 4px)", zIndex: 0 }}
        />
        <div
          className="absolute inset-0 bg-yellow-300 border-4 border-black"
          style={{ transform: "rotate(-4deg) translate(-8px, -2px)", zIndex: 1 }}
        />
        <div
          className="absolute inset-0 border-4 border-black overflow-hidden bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
          style={{ zIndex: 2 }}
        >
          <TemplatePreviewPlaceholder />
        </div>
      </div>
      <div className="bg-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[11px] font-black tracking-widest uppercase text-black">
        {templateCount}+ templates
      </div>
      <div className="flex gap-1.5 items-center">
        <span className="h-2 w-5 border-2 border-black bg-black" />
        <span className="h-2 w-2 border-2 border-black bg-gray-300" />
        <span className="h-2 w-2 border-2 border-black bg-gray-300" />
      </div>
    </div>
  );
}

function HomeTemplatePreviewInner({ templateId, colorThemeId }: { templateId: string; colorThemeId: string }) {
  const TemplateComponent = getTemplateComponent(templateId);
  const theme = getTheme(templateId, colorThemeId);

  return (
    <div className="relative h-full overflow-hidden border-2 border-black bg-white">
      <div
        className="origin-top-left pointer-events-none"
        style={{
          transform: "scale(0.24)",
          width: `${100 / 0.24}%`,
        }}
      >
        <LinkTextProvider disableAnchors>
          <TemplateComponent data={homepageTemplatePreviewData} theme={theme} />
        </LinkTextProvider>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
    </div>
  );
}

const HomeTemplatePreview = dynamic(() => Promise.resolve(HomeTemplatePreviewInner), {
  ssr: false,
  loading: () => <TemplatePreviewPlaceholder compact />,
});

function HeroCarouselInner() {
  const [current, setCurrent] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent((value) => (value + 1) % heroSlides.length);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden md:flex flex-col items-center gap-5 flex-shrink-0">
      <div className="relative w-[220px] h-[312px]">
        <div className="absolute inset-0 bg-blue-300 border-4 border-black" style={{ transform: "rotate(6deg) translate(10px, 4px)", zIndex: 0 }} />
        <div className="absolute inset-0 bg-yellow-300 border-4 border-black" style={{ transform: "rotate(-4deg) translate(-8px, -2px)", zIndex: 1 }} />
        <div
          className="absolute inset-0 border-4 border-black overflow-hidden bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          style={{ zIndex: 2 }}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          {heroSlides.map((slide, index) => {
            const TemplateComponent = getTemplateComponent(slide.templateId);
            const theme = getTheme(slide.templateId, slide.themeId);
            return (
              <div
                key={slide.templateId}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
              >
                <div
                  className="origin-top-left pointer-events-none"
                  style={{ transform: `scale(${HERO_SCALE})`, width: `${100 / HERO_SCALE}%` }}
                >
                  <LinkTextProvider disableAnchors>
                    <TemplateComponent data={homepageTemplatePreviewData} theme={theme} />
                  </LinkTextProvider>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[11px] font-black tracking-widest uppercase text-black">
        {heroSlides[current].label}
      </div>

      <div className="flex gap-1.5 items-center">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 border-2 border-black transition-all duration-300 ${
              index === current ? "w-5 bg-black" : "w-2 bg-gray-300 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const HeroCarousel = dynamic(() => Promise.resolve(HeroCarouselInner), {
  ssr: false,
  loading: () => <HeroCarouselPlaceholder />,
});

export default function HomePageClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackHomepageTemplatesClick = (location: string, label: string) => {
    track("cta_clicked", { location, label });
    track("landing_cta_click", { fromPath: "/", toPath: "/templates", label });
  };

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const attribution = getStoredAttribution();
      if (attribution) {
        formData.append("attribution", JSON.stringify(attribution));
      }

      const response = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/login?next=${encodeURIComponent("/")}`);
          return;
        }
        throw new Error(data.error || "Upload failed");
      }

      track("start_cv", { entryPoint: "home_upload", cvId: data.cvId });
      router.push(`/editor?id=${data.cvId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const features = [
    { title: "ATS-vriendelijke templates", desc: "Rustige layouts die recruiter-proof blijven en goed door cv-software gelezen worden.", color: "bg-yellow-400", icon: "✓" },
    { title: "Direct PDF downloaden", desc: "Werk je cv online af en download meteen een nette PDF zodra je klaar bent.", color: "bg-blue-400", icon: "↓" },
    { title: "Geen abonnement", desc: `Je betaalt ${cvDownloadPrice.display} per cv-download. Geen maandelijkse kosten en geen opzeggedoe.`, color: "bg-green-400", icon: "€" },
    { title: "Optionele profielfoto", desc: `Voeg een foto toe wanneer dat voor een Belgische sollicitatie logisch is. Extra: ${profilePhotoPrice.display}.`, color: "bg-pink-400", icon: "📷" },
    { title: "Live preview", desc: "Je ziet direct hoe je cv eruitziet terwijl je invult en herschrijft.", color: "bg-purple-400", icon: "👁" },
    { title: "Snel starten", desc: "Begin met een template of upload je bestaande cv om sneller naar een bruikbare versie te gaan.", color: "bg-[#4ECDC4]", icon: "⚡" },
  ];

  const steps = [
    { num: "1", title: "Kies een template", desc: `Selecteer uit ${templateCount}+ professionele templates die geschikt zijn voor Belgische sollicitaties.`, color: "bg-yellow-400" },
    { num: "2", title: "Vul of upload je cv", desc: "Start leeg of upload je bestaande cv zodat de editor meteen met je inhoud kan werken.", color: "bg-blue-400" },
    { num: "3", title: "Download als PDF", desc: `Rond je cv af en download als PDF voor ${cvDownloadPrice.display}, zonder abonnement.`, color: "bg-pink-400" },
  ];

  const belgiumRoutes = [
    {
      href: "/cv-maken-belgie",
      title: "CV maken in België",
      body: "Start hier als je eerst wilt weten hoe een Belgisch cv hoort opgebouwd te zijn.",
    },
    {
      href: "/cv-voorbeeld-belgie",
      title: "CV voorbeeld België",
      body: "Bekijk een voorbeeldopbouw voor profiel, werkervaring en lay-out voordat je begint.",
    },
    {
      href: "/cv-template-vlaanderen",
      title: "CV template Vlaanderen",
      body: "Voor wie snel een Vlaamse cv-structuur en een rustige template wil kiezen.",
    },
    {
      href: "/sollicitatiebrief-belgie",
      title: "Sollicitatiebrief België",
      body: "Gebruik deze route als je naast je cv ook je motivatiebrief wilt voorbereiden.",
    },
    {
      href: "/cv-maken-gratis",
      title: "CV gratis starten",
      body: "Legt het gratis-starten en het eenmalige downloadmodel helder uit voordat je de editor opent.",
    },
    {
      href: "/cv-maken-zonder-abonnement",
      title: "Zonder abonnement",
      body: "Voor bezoekers die vooral willen checken hoe WerkCV prijs en download aanpakt.",
    },
  ];

  const nextSteps = [
    {
      href: "/templates",
      title: "Templates vergelijken",
      desc: "Bekijk de layouts en kleurthema's die je straks in de editor kunt gebruiken.",
      badge: "Start",
    },
    {
      href: "/prijzen",
      title: "Prijsmodel",
      desc: "Zie exact wanneer je betaalt, wat inbegrepen is en hoe de bundel werkt.",
      badge: "Prijs",
    },
    {
      href: "/faq",
      title: "Veelgestelde vragen",
      desc: "Krijg duidelijkheid over foto, download, privacy en de Belgische cv-conventies.",
      badge: "FAQ",
    },
    {
      href: "/contact",
      title: "Contact",
      desc: "Stel een concrete vraag over het gebruik van WerkCV of de juiste route voor jouw situatie.",
      badge: "Support",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFEF0]" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-400/20">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black text-black">Sleep je cv hier om te uploaden</p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
            <p className="font-black text-black">CV wordt verwerkt...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed right-4 top-4 z-50 max-w-sm border-4 border-black bg-red-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-bold text-black">{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-xs font-black underline">
            Sluiten
          </button>
        </div>
      )}

      <header className="sticky top-0 z-10 border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-black sm:text-3xl">
            Werk<span className="bg-yellow-400 px-1">CV</span>.be
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-black md:flex">
            <Link href="/templates" className="transition-colors hover:text-yellow-600">Templates</Link>
            <Link href="/cv-maken-belgie" className="transition-colors hover:text-yellow-600">CV maken België</Link>
            <Link href="/cv-voorbeeld-belgie" className="transition-colors hover:text-yellow-600">CV voorbeeld</Link>
            <Link href="/prijzen" className="transition-colors hover:text-yellow-600">Prijzen</Link>
          </nav>
          <div className="flex items-center gap-4">
            <NavUserMenu />
            <Link
              href="/templates"
              onClick={() => trackHomepageTemplatesClick("header", "CV maken")}
              className="bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "black" }}
            >
              CV maken
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 overflow-hidden border-b-4 border-black bg-gradient-to-br from-[#FFFEF0] via-yellow-50 to-blue-50">
        <div className="absolute left-8 top-16 h-24 w-24 rounded-full bg-yellow-300 opacity-30" />
        <div className="absolute bottom-16 right-12 h-32 w-32 rounded-full bg-blue-300 opacity-20" />
        <div className="absolute left-1/3 top-1/2 h-20 w-20 rounded-full bg-pink-300 opacity-20" />

        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                CV builder voor België
              </div>
              <h1 className="mb-6 text-4xl font-black leading-tight text-black sm:text-5xl md:text-6xl">
                Maak je cv in{" "}
                <span className="inline-block -rotate-1 border-4 border-black bg-yellow-400 px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  10 minuten
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-xl text-lg font-medium text-gray-700 md:text-xl lg:mx-0">
                Professioneel cv opstellen voor de Belgische arbeidsmarkt. WerkCV helpt je starten met een rustige template, een live editor en een duidelijke downloadstap. <span className="bg-blue-200 px-1">Eénmalige betaling van {cvDownloadPrice.display} zonder abonnement of verrassingen.</span>
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/templates"
                  onClick={() => trackHomepageTemplatesClick("hero", "Vergelijk templates")}
                  className="border-4 border-black bg-yellow-400 px-8 py-4 text-center text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Vergelijk templates
                </Link>
                <button
                  onClick={() => {
                    track("cta_clicked", { location: "hero", label: "Upload bestaand CV" });
                    fileInputRef.current?.click();
                  }}
                  className="cursor-pointer border-4 border-black bg-white px-8 py-4 text-center text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Upload bestaand cv
                </button>
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-black lg:justify-start">
                <span className="border-2 border-black bg-white px-3 py-1">Gebruikt door werkzoekenden in heel België</span>
                <span className="border-2 border-black bg-white px-3 py-1">Geschikt voor Jobat, Stepstone en LinkedIn België</span>
                <span className="border-2 border-black bg-white px-3 py-1">ATS-vriendelijke templates</span>
                <span className="border-2 border-black bg-white px-3 py-1">Eénmalige betaling</span>
              </div>
            </div>
            <HeroCarousel />
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 text-center md:grid-cols-4">
          {[
            { number: `${templateCount}+`, label: "Templates", color: "bg-yellow-400" },
            { number: `${belgiumRouteCount}`, label: "BE pagina's", color: "bg-blue-400" },
            { number: "PDF", label: "Download klaar", color: "bg-pink-400" },
            { number: cvDownloadPrice.display, label: "Eenmalig", color: "bg-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className={`${stat.color} mb-2 px-4 py-2 text-2xl font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:text-3xl`} style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "black" }}>
                {stat.number}
              </div>
              <span className="text-sm font-bold text-black">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-[#FFFEF0]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-12 text-center text-3xl font-black text-black md:text-4xl">Hoe het werkt</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className={`${step.color} mx-auto mb-4 flex h-16 w-16 -rotate-3 items-center justify-center border-4 border-black text-3xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  {step.num}
                </div>
                <h3 className="mb-2 text-xl font-black text-black">{step.title}</h3>
                <p className="font-medium text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-black text-black md:text-4xl">Onze templates</h2>
            <Link href="/templates" className="hidden items-center gap-1 text-sm font-bold text-[#FF6B6B] hover:underline sm:flex">
              Bekijk alle {templateCount}+
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {showcaseTemplates.map((template) => {
              if (!template) return null;
              const theme = template.colorThemes.find((item) => item.id === template.defaultThemeId) || template.colorThemes[0];
              const categoryLabel = template.category === "classic" ? "Klassiek" : template.category === "modern" ? "Modern" : template.category === "creative" ? "Creatief" : "Minimaal";
              return (
                <Link
                  key={template.id}
                  href="/templates"
                  className="group overflow-hidden border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="h-4" style={{ backgroundColor: theme.primary }} />
                  <div className="p-4">
                    <div className="mb-3 h-52 overflow-hidden md:h-56">
                      <HomeTemplatePreview templateId={template.id} colorThemeId={theme.id} />
                    </div>
                    <h3 className="text-sm font-black text-black transition-colors group-hover:text-[#FF6B6B]">{template.nameDutch}</h3>
                    <p className="mt-0.5 text-xs font-medium text-gray-500">{categoryLabel}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-[#FFFEF0]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-12 text-center text-3xl font-black text-black md:text-4xl">Waarom WerkCV?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className={`${feature.color} mb-4 flex h-12 w-12 -rotate-3 items-center justify-center text-xl font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`} style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "black" }}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-black text-black">{feature.title}</h3>
                <p className="text-sm font-medium text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-4 border-black bg-[#FFFEF9] p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">Belgische routes</p>
              <h2 className="mt-3 text-3xl font-black text-black md:text-4xl">Kies eerst de route die bij je situatie past</h2>
              <p className="mt-4 text-base font-medium leading-relaxed text-gray-700 md:text-lg">
                Niet elke bezoeker wil meteen de editor in. Sommigen willen eerst een Belgisch voorbeeld zien, anderen willen vooral het prijsmodel of een templatecheck begrijpen.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {belgiumRoutes.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block border-4 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <h3 className="text-lg font-black text-black transition-colors group-hover:text-[#FF6B6B]">{item.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-gray-700">{item.body}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-4 border-black bg-yellow-300 p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-700">Prijs en download</p>
              <h2 className="mt-3 text-3xl font-black text-black">Duidelijk prijsmodel</h2>
              <p className="mt-4 text-base font-medium leading-relaxed text-black/80">
                Gratis starten, daarna zelf beslissen wanneer je downloadt. Voor kandidaten die meteen meer nodig hebben, is er ook een bundel met cv, brief en optionele profielfoto.
              </p>
              <div className="mt-6 space-y-3 text-sm font-black text-black">
                <div className="border-2 border-black bg-white px-4 py-3">CV-download: {cvDownloadPrice.display} eenmalig</div>
                <div className="border-2 border-black bg-white px-4 py-3">Bundel: {applicationBundlePrice.display}</div>
                <div className="border-2 border-black bg-white px-4 py-3">Geen maandelijkse kosten</div>
              </div>
              <Link
                href="/prijzen"
                onClick={() => trackHomepageTemplatesClick("pricing", "Bekijk prijsmodel")}
                className="mt-6 block w-full border-4 border-black bg-white py-4 text-center text-lg font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Bekijk prijsmodel
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-[#FFFEF0]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">Veelgestelde vragen</p>
            <h2 className="mt-3 text-3xl font-black text-black md:text-4xl">Eerst de basis helder, daarna je cv bouwen</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-gray-700 md:text-lg">
              Dit zijn de vragen die het vaakst terugkomen bij bezoekers die willen weten hoe gratis starten, ATS-vriendelijke templates en downloaden precies werken.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {homepageFaqItems.map((item) => (
              <details key={item.question} className="group border-4 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <summary className="flex cursor-pointer items-center justify-between p-5 text-left text-base font-black text-black">
                  <span className="pr-4">{item.question}</span>
                  <span className="text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t-2 border-black px-5 pb-5 pt-4 text-sm font-medium leading-relaxed text-slate-700">{item.answer}</div>
              </details>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/faq"
              className="inline-flex border-4 border-black bg-white px-5 py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              Bekijk alle veelgestelde vragen
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-black text-black md:text-4xl">Belangrijkste vervolgstappen</h2>
          <p className="mt-2 font-medium text-gray-600">Gebouwd voor Belgische sollicitaties en een helder prijsmodel.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {nextSteps.map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className="group block border-2 border-black bg-[#FFFEF9] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-black leading-tight text-slate-900 transition-colors group-hover:text-teal-700">{step.title}</h3>
                  <span className="rounded-full bg-[#4ECDC4]/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-teal-700">{step.badge}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">{step.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b-4 border-black bg-[#4ECDC4]">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-black text-black md:text-5xl">Klaar om je Belgische cv op te bouwen?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-black/80 md:text-lg">
            Start gratis in de editor, kies later pas of je je cv als PDF wilt downloaden. Voor een sollicitatiebundel kun je cv, brief en profielfoto combineren zonder vast abonnement.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/templates"
              onClick={() => trackHomepageTemplatesClick("final", "Start met template")}
              className="border-4 border-black bg-yellow-400 px-8 py-4 text-center text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Start met template
            </Link>
            <Link
              href="/cv-maken-zonder-abonnement"
              className="border-4 border-black bg-white px-8 py-4 text-center text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Eerst het prijsmodel zien
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
