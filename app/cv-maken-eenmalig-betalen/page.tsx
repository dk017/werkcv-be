import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import TrackedLandingLink from "@/components/analytics/TrackedLandingLink";
import MobileStickyCta from "@/components/landing/MobileStickyCta";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { buildDutchMetadata } from "@/lib/page-metadata";
import { cvDownloadPrice } from "@/lib/site-content";

const priceSteps = [
  {
    title: "Maak gratis je cv",
    body: "Vul je gegevens in, kies een template en bekijk je voorbeeld zonder vooraf te betalen.",
  },
  {
    title: "Betaal pas bij PDF-download",
    body: `Je betaalt éénmalig ${cvDownloadPrice.display} wanneer je cv klaar is om te downloaden.`,
  },
  {
    title: "Blijf toegang houden",
    body: "Open hetzelfde cv later opnieuw, pas het aan en download opnieuw zonder maandkost of abonnement.",
  },
];

const valueCards = [
  {
    title: "Je betaalt voor het eindresultaat",
    body: "Een cv-builder gebruik je meestal tijdelijk. Daarom betaal je bij WerkCV.be voor de definitieve PDF, niet voor een maand waarin je de tool misschien al niet meer nodig hebt.",
  },
  {
    title: "Geen proefperiode of automatische verlenging",
    body: "Er is geen maandplan dat je later nog moet stopzetten. Je ziet vooraf exact wanneer je betaalt en waarvoor.",
  },
  {
    title: "Hetzelfde cv later opnieuw gebruiken",
    body: "Werk je cv later bij voor een nieuwe vacature, dan open je gewoon hetzelfde document opnieuw en download je opnieuw zonder extra abonnement.",
  },
];

const whyWerkCvBullets = [
  "Gebouwd voor Belgische sollicitaties",
  "ATS-vriendelijke templates zonder overbodige opmaak",
  "Gratis starten, pas betalen bij PDF-download",
  "Geen abonnement of automatische verlenging",
  `Eén duidelijke prijs: ${cvDownloadPrice.display}`,
];

const faqs = [
  {
    question: "Kan ik eerst gratis beginnen?",
    answer:
      "Ja. Je bouwt je cv gratis op, kiest een template en bekijkt je voorbeeld voordat je iets betaalt.",
  },
  {
    question: `Wanneer betaal ik ${cvDownloadPrice.display}?`,
    answer:
      "Je betaalt pas wanneer je jouw cv als PDF wilt downloaden. Daar zit de volledige betaalstap.",
  },
  {
    question: "Is dit een abonnement of proefperiode?",
    answer:
      "Nee. WerkCV.be werkt zonder maandabonnement, zonder proefperiode en zonder automatische verlenging.",
  },
  {
    question: "Kan ik hetzelfde cv later opnieuw openen?",
    answer:
      "Ja. Je kunt hetzelfde cv later opnieuw openen, aanpassen en opnieuw downloaden zonder opnieuw te betalen voor dat document.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "CV maken en eenmalig betalen | België | WerkCV",
  description:
    "Bouw gratis je cv voor België en betaal pas €4,99 bij PDF-download. Geen maandabonnement, geen proefperiode en geen automatische verlenging.",
  path: "/cv-maken-eenmalig-betalen",
  keywords: [
    "cv maken eenmalig betalen",
    "cv eenmalig betalen belgie",
    "cv maken zonder maandkosten",
    "cv builder eenmalig betalen",
    "cv maken geen abonnement belgie",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/cv-maken-eenmalig-betalen",
    "nl-NL": "https://werkcv.nl/cv-maken-eenmalig-betalen",
    "x-default": "https://werkcv.be/cv-maken-eenmalig-betalen",
  },
});

export default function CvMakenEenmaligBetalenPage() {
  return (
    <div className="min-h-screen bg-[#FFFEF0]">
      <FAQJsonLd questions={faqs} />

      <header className="border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-black">
              Werk<span className="bg-yellow-400 px-1">CV</span>.be
            </span>
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/prijzen"
              className="border-2 border-black bg-white px-4 py-2 text-sm font-black text-black"
            >
              Bekijk prijsmodel
            </Link>
            <TrackedLandingLink
              href="/editor"
              trackingLocation="cv-maken-eenmalig-betalen:header_primary"
              trackingLabel={`Maak je cv voor eenmalig ${cvDownloadPrice.display}`}
              className="border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-black text-black"
            >
              Maak je cv
            </TrackedLandingLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 pb-28 md:pb-10">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "CV maken en eenmalig betalen", href: "/cv-maken-eenmalig-betalen" },
            ]}
          />
        </div>

        <section className="mb-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                `Eénmalig ${cvDownloadPrice.display}`,
                "Geen maandkosten",
                "Geen proefperiode",
                "Geen automatische verlenging",
              ].map((badge) => (
                <span
                  key={badge}
                  className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-black"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-black md:text-5xl">
              CV maken en eenmalig betalen
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              Bouw je cv gratis en betaal pas {cvDownloadPrice.display} wanneer je jouw professionele PDF wilt downloaden.
              Daarna kun je hetzelfde cv opnieuw openen, aanpassen en downloaden zonder extra maandkost.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLandingLink
                href="/editor"
                trackingLocation="cv-maken-eenmalig-betalen:hero_primary"
                trackingLabel={`Maak je cv voor eenmalig ${cvDownloadPrice.display}`}
                ctaEventName="cta_one_time_payment_hero"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Maak je cv voor eenmalig {cvDownloadPrice.display}
              </TrackedLandingLink>
              <Link
                href="/templates"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Eerst gratis proberen
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              Geen maandbedrag. Geen proefperiode. Geen automatische verlenging.
            </p>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Direct duidelijk
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Eén prijs, pas op het einde
            </h2>
            <div className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-slate-700">
              <p>Je begint gratis in de editor en gebruikt de templates zonder vooraf te betalen.</p>
              <p>De betaalstap zit pas op de definitieve PDF-download van je cv.</p>
              <p>Daarna houd je toegang tot hetzelfde cv zonder abonnement of opzegmoment.</p>
            </div>
          </aside>
        </section>

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Prijsduidelijkheid
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">
            Hoe werkt éénmalig betalen?
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {priceSteps.map((step) => (
              <article
                key={step.title}
                className="border-3 border-black bg-[#FFF9D9] p-5"
                style={{ borderWidth: "3px" }}
              >
                <h3 className="text-lg font-black text-black">{step.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-5 md:grid-cols-3">
          {valueCards.map((card) => (
            <article
              key={card.title}
              className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
            >
              <h2 className="text-xl font-black text-black">{card.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="mb-12 border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
            Waarom dit model past
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            Betaal voor je cv, niet voor een maandplan
          </h2>
          <p className="mt-4 max-w-3xl text-sm font-medium leading-relaxed text-slate-200">
            Een cv-builder gebruik je meestal tijdelijk. Daarom betaal je bij WerkCV.be alleen voor de definitieve PDF-download.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <TrackedLandingLink
              href="/editor"
              trackingLocation="cv-maken-eenmalig-betalen:mid_primary"
              trackingLabel={`Maak mijn cv voor eenmalig ${cvDownloadPrice.display}`}
              ctaEventName="cta_one_time_payment_mid"
              className="inline-block border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black"
            >
              Maak mijn cv voor eenmalig {cvDownloadPrice.display}
            </TrackedLandingLink>
            <p className="text-sm font-medium text-slate-200">
              Geen automatische verlenging. Geen opzegging nodig.
            </p>
          </div>
        </section>

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Belgische context
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">
            Waarom dit goed werkt voor Belgische sollicitaties
          </h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {whyWerkCvBullets.map((bullet) => (
              <li
                key={bullet}
                className="border-2 border-black bg-[#FFFEF0] px-4 py-3 text-sm font-black text-black"
              >
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cv-maken-zonder-abonnement"
              className="border-2 border-black bg-white px-4 py-2 text-sm font-black text-black"
            >
              CV maken zonder abonnement
            </Link>
            <Link
              href="/prijzen"
              className="border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-black text-black"
            >
              Bekijk prijsmodel
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-center text-3xl font-black text-black">
            Veelgestelde vragen over éénmalig betalen
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
      <MobileStickyCta
        text="CV maken en eenmalig betalen"
        buttonLabel={`Start voor ${cvDownloadPrice.display}`}
        href="/editor"
        trackingLocation="cv-maken-eenmalig-betalen:sticky_mobile"
        trackingLabel={`Start voor ${cvDownloadPrice.display}`}
        ctaEventName="cta_one_time_payment_hero"
      />
    </div>
  );
}
