import Link from "next/link";
import Footer from "@/components/Footer";
import TrackedLandingLink from "@/components/analytics/TrackedLandingLink";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { cvDownloadPrice } from "@/lib/site-content";

type CityCvLandingPageProps = {
  city: string;
  path: string;
  h1: string;
  intro: string;
  angleTitle: string;
  angleBody: string;
  sectors: string[];
  examples: string[];
  proofPoints?: string[];
  profileExamples?: Array<{
    title: string;
    text: string;
  }>;
  bulletExamples?: Array<{
    sector: string;
    weak: string;
    strong: string;
  }>;
  checklist?: string[];
  englishNote?: string;
};

export default function CityCvLandingPage({
  city,
  path,
  h1,
  intro,
  angleTitle,
  angleBody,
  sectors,
  examples,
  proofPoints = [],
  profileExamples = [],
  bulletExamples = [],
  checklist = [],
  englishNote,
}: CityCvLandingPageProps) {
  const faqItems = [
    {
      question: `Kan ik online een cv maken voor banen in ${city}?`,
      answer:
        `Ja. Met WerkCV maak je online een Nederlandse cv die je kunt aanpassen op vacatures in ${city}. Je start gratis en betaalt pas ${cvDownloadPrice.display} bij PDF-download.`,
    },
    {
      question: "Is WerkCV een abonnement?",
      answer:
        "Nee. WerkCV werkt zonder abonnement, proefperiode of automatische verlenging. Je betaalt alleen wanneer je een definitieve PDF downloadt.",
    },
    {
      question: "Kan ik mijn cv per vacature aanpassen?",
      answer:
        "Ja. Je kunt je profieltekst, werkervaring, vaardigheden en template later opnieuw aanpassen voor verschillende sollicitaties.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFEF0]">
      <FAQJsonLd questions={faqItems} />

      <header className="border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-black">
              Werk<span className="bg-yellow-400 px-1">CV</span>.nl
            </span>
          </Link>
          <TrackedLandingLink
            href="/editor"
            trackingLocation={`${path}:header_primary`}
            trackingLabel="Maak mijn cv"
            className="border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-black text-black"
          >
            Maak mijn cv
          </TrackedLandingLink>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: h1, href: path },
            ]}
          />
        </div>

        <section className="mb-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-slate-700">
              Lokale cv-route
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-black md:text-5xl">
              {h1}
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              {intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLandingLink
                href="/editor"
                trackingLocation={`${path}:hero_primary`}
                trackingLabel="Maak mijn cv"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Maak mijn cv
              </TrackedLandingLink>
              <Link
                href="/cv-maken-zonder-abonnement"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                CV zonder abonnement
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              Gratis starten. Eénmalig {cvDownloadPrice.display} bij PDF-download. Geen abonnement.
            </p>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black text-black">
              Populaire richtingen in {city}
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-relaxed text-slate-700">
              {sectors.map((sector) => (
                <li key={sector}>&bull; {sector}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black text-black">{angleTitle}</h2>
          <p className="mt-4 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
            {angleBody}
          </p>
          {englishNote ? (
            <p className="mt-4 border-2 border-black bg-[#FFF9D9] p-4 text-sm font-medium leading-relaxed text-slate-700">
              {englishNote}
            </p>
          ) : null}
        </section>

        {proofPoints.length > 0 ? (
          <section className="mb-12 border-4 border-black bg-[#FFF9D9] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Lokale context
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              Wat betekent dit voor je cv?
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {proofPoints.map((point) => (
                <p
                  key={point}
                  className="border-2 border-black bg-white p-4 text-sm font-medium leading-relaxed text-slate-700"
                >
                  {point}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {profileExamples.length > 0 ? (
          <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Copy-ready voorbeelden
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              Voorbeeld profieltekst voor {city}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {profileExamples.map((example) => (
                <article key={example.title} className="border-2 border-black bg-[#FFFEF0] p-5">
                  <h3 className="text-lg font-black text-black">{example.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
                    “{example.text}”
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {bulletExamples.length > 0 ? (
          <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Werkervaring verbeteren
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              Zwakke vs sterke cv-bullets
            </h2>
            <div className="mt-6 space-y-4">
              {bulletExamples.map((example) => (
                <article key={example.sector} className="border-2 border-black bg-[#FFFEF0] p-5">
                  <h3 className="text-lg font-black text-black">{example.sector}</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <p className="border-2 border-red-300 bg-white p-3 text-sm font-medium leading-relaxed text-slate-700">
                      <span className="font-black text-black">Zwak:</span> {example.weak}
                    </p>
                    <p className="border-2 border-green-400 bg-white p-3 text-sm font-medium leading-relaxed text-slate-700">
                      <span className="font-black text-black">Sterker:</span> {example.strong}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-12 grid gap-6 md:grid-cols-3">
          {examples.map((example) => (
            <article
              key={example}
              className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="text-lg font-black text-black">{example}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
                Maak een rustige, scanbare cv-versie met een korte profieltekst, concrete werkervaring en vaardigheden die passen bij dit type vacature.
              </p>
            </article>
          ))}
        </section>

        {checklist.length > 0 ? (
          <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Checklist
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              Controleer dit voordat je solliciteert in {city}
            </h2>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="border-2 border-black bg-[#FFF9D9] p-4 text-sm font-bold leading-relaxed text-black"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black text-black">
            Handige vervolgstappen
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { href: "/cv-checken", label: "Check je cv" },
              { href: "/cv-optimaliseren", label: "Optimaliseer voor vacature" },
              { href: "/templates", label: "Bekijk templates" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-3 border-black bg-[#FFFEF0] p-4 text-sm font-black text-black underline decoration-2 underline-offset-4"
                style={{ borderWidth: "3px" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="border-4 border-black bg-yellow-400 px-6 py-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black text-black">
                Klaar om je cv voor {city} te maken?
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-black sm:text-base">
                Start gratis, kies een Nederlandse template en betaal pas wanneer je jouw PDF wilt downloaden.
              </p>
            </div>
            <TrackedLandingLink
              href="/editor"
              trackingLocation={`${path}:bottom_primary`}
              trackingLabel="Start gratis"
              className="inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
            >
              Start gratis
            </TrackedLandingLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
