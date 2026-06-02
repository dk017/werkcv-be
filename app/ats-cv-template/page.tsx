import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { buildDutchMetadata } from "@/lib/page-metadata";
import { getTemplateConfig } from "@/lib/templates/registry";

const atsTemplate = getTemplateConfig("ats");

const atsChecklist = [
  "Gebruik standaardkoppen zoals Profiel, Werkervaring, Opleiding en Vaardigheden.",
  "Kies een enkel-koloms layout zonder tabellen, tekstvakken, zijbalken of decoratieve blokken.",
  "Zet contactgegevens in de hoofdtekst en verwerk vacature-keywords letterlijk in je ervaring en vaardigheden.",
  "Exporteer als nette PDF en controleer daarna of de structuur logisch en scanbaar blijft.",
];

const atsMakeFlow = [
  {
    title: "1. Kies eerst een scanbare layout",
    body:
      "Start niet met een creatieve template als je via een corporate portal solliciteert. Gebruik eerst een rustige enkel-koloms opmaak waarin naam, contactgegevens, werkervaring en opleiding gewone tekst blijven.",
  },
  {
    title: "2. Schrijf naar de vacaturetaal",
    body:
      "Een ATS-vriendelijk cv maken draait niet alleen om design. Neem relevante functietitels, tools, certificaten en vaardigheden letterlijk over uit de vacature als ze echt bij je ervaring passen.",
  },
  {
    title: "3. Test op leesbaarheid, niet alleen op uitzicht",
    body:
      "Controleer of je PDF rustig blijft, of je koppen duidelijk zijn en of recruiters de belangrijkste termen snel terugvinden. Een nette template helpt, maar de inhoud moet ook scherp zijn.",
  },
];

const commonMistakes = [
  "Te veel design-elementen, kolommen of zijbalken die scanners verwarren.",
  "Vage functietitels zonder herkenbare zoekwoorden.",
  "Tekstvakken, tabellen of contactgegevens in kop- en voetteksten.",
  "Een cv dat mooi oogt, maar niet aansluit op de taal van de vacature.",
];

const faqs = [
  {
    question: "Wat is een ATS cv template?",
    answer:
      "Een ATS cv template is een layout die goed leesbaar blijft voor applicant tracking systems. Het ontwerp gebruikt duidelijke secties, voorspelbare koppen en weinig visuele ruis, zodat software je gegevens correct kan uitlezen.",
  },
  {
    question: "Waarom is een ATS-vriendelijk cv belangrijk?",
    answer:
      "Veel werkgevers gebruiken sollicitatiesoftware om cv's te scannen op structuur en relevante keywords. Als je layout rommelig is of je tekst slecht uitleesbaar, verlies je soms al terrein voordat een recruiter je cv ziet.",
  },
  {
    question: "Is de ATS template van WerkCV.be gratis te gebruiken?",
    answer:
      "Ja. Je kunt de ATS template gratis kiezen, invullen en vergelijken in de editor. Je betaalt pas wanneer je je definitieve PDF wilt downloaden.",
  },
  {
    question: "Werkt een ATS template ook voor Belgische sollicitaties?",
    answer:
      "Ja. De basisregels zijn hetzelfde: rustige opmaak, duidelijke secties, herkenbare functietitels en weinig parsing-risico. Dat werkt ook voor Belgische sollicitaties via bedrijfsportals en internationale recruiters.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "ATS CV template België | Scanbaar cv maken | WerkCV",
  description:
    "Maak een ATS-vriendelijk cv voor Belgische sollicitaties. Kies een rustige template, verwerk vacature-keywords en houd je PDF scanbaar voor recruiters en software.",
  path: "/ats-cv-template",
  keywords: [
    "ats cv template",
    "ats cv template belgie",
    "ats vriendelijk cv belgie",
    "ats cv maken",
    "cv template voor ats",
    "scanbaar cv template",
    "ats proof cv belgie",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/ats-cv-template",
    "nl-NL": "https://werkcv.nl/ats-cv-template",
    "x-default": "https://werkcv.be/ats-cv-template",
  },
});

export default function AtsCvTemplatePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FFFEF0]">
      <header className="relative z-10 border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-black">
              Werk<span className="bg-yellow-400 px-1">CV</span>.be
            </span>
          </Link>
          <Link
            href="/editor"
            className="border-2 border-black bg-yellow-400 px-3 py-1 text-sm font-black text-black transition-colors hover:bg-yellow-300"
          >
            Start in editor
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <section className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
              ATS cv template
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              ATS-vriendelijk cv maken voor Belgische sollicitaties
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              Een ATS-vriendelijk cv maken betekent drie dingen tegelijk goed doen: een rustige template kiezen,
              vacature-keywords natuurlijk verwerken en je PDF scanbaar houden. Met de{" "}
              {atsTemplate.nameDutch.toLowerCase()}e template van WerkCV.be start je met een enkel-koloms layout
              zonder tabellen, tekstvakken of zijbalken die parsing kunnen verstoren.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/editor"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Start met ATS template
              </Link>
              <Link
                href="/templates"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Vergelijk templates
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Enkel-koloms ATS-layout",
                "Standaardkoppen, geen text boxes",
                "Gratis starten, later downloaden",
              ].map((item) => (
                <div
                  key={item}
                  className="border-3 border-black bg-white px-4 py-3 text-sm font-black text-black"
                  style={{ borderWidth: "3px" }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-black">Waarom recruiters en software rustige templates verkiezen</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
              Veel gratis cv-sjablonen zien er mooi uit, maar verliezen punten zodra ze door een parser worden gelezen.
              Onnodige grafische elementen, creatieve kolommen, headers, footers en slecht geplaatste tekstvakken maken je cv minder betrouwbaar voor software.
            </p>
            <div className="mt-5 border-t-4 border-black pt-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Snelle definitie
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                ATS staat voor Applicant Tracking System: software die cv&apos;s scant op structuur, relevante termen en leesbaarheid voordat een recruiter alles handmatig beoordeelt.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                Template + keywords
              </p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-black">
                De fout is denken dat “ATS-proof” alleen een template is
              </h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
                Een goede template voorkomt technische ruis, maar hij schrijft je cv niet automatisch sterker.
                De beste route is: rustige opmaak kiezen, inhoud aanpassen aan de vacature en daarna controleren of je cv nog steeds logisch leesbaar is.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/editor"
                  className="border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-black text-black"
                >
                  Maak ATS cv
                </Link>
                <Link
                  href="/cv-template-vlaanderen"
                  className="border-2 border-black bg-white px-4 py-2 text-sm font-black text-black"
                >
                  CV template Vlaanderen
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              {atsMakeFlow.map((item) => (
                <article key={item.title} className="border-2 border-black bg-[#FFFEF0] p-4">
                  <h3 className="text-sm font-black text-black">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Checklist
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Snelle ATS-check voor je cv
            </h2>
            <ul className="mt-5 space-y-3">
              {atsChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-slate-700">
                  <span className="mt-0.5 border-2 border-black bg-yellow-400 px-2 py-0.5 text-xs font-black text-black">
                    OK
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-4 border-black bg-black p-6 text-white shadow-[5px_5px_0px_0px_rgba(250,204,21,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
              Veelgemaakte fouten
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Wat je beter vermijdt
            </h2>
            <ul className="mt-5 space-y-3">
              {commonMistakes.map((item) => (
                <li key={item} className="text-sm font-medium leading-relaxed text-slate-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 border-4 border-black bg-[#FFF7E8] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Belgische context
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">
            ATS-vriendelijk werkt ook voor Belgische cv&apos;s
          </h2>
          <p className="mt-4 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
            Ook in België gaat het vaker mis door documentstructuur dan door taal. Een rustige template is daarom meestal belangrijker dan extra design. Zeker als je solliciteert via internationale portals of grotere werkgevers in Vlaanderen en Brussel.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-black text-black"
            >
              Start met ATS template
            </Link>
            <Link
              href="/cv-maken-belgie"
              className="border-2 border-black bg-white px-4 py-2 text-sm font-black text-black"
            >
              CV maken in België
            </Link>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-center text-3xl font-black text-black">
            Veelgestelde vragen over ATS cv templates
          </h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <summary className="cursor-pointer text-lg font-black text-black">{faq.question}</summary>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
