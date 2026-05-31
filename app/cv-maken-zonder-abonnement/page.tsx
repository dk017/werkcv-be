import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import TrackedLandingLink from "@/components/analytics/TrackedLandingLink";
import MobileStickyCta from "@/components/landing/MobileStickyCta";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { cvDownloadPrice } from "@/lib/site-content";
import { comparisonRows, faqs } from "./content";

const pageUrl = "https://werkcv.be/cv-maken-zonder-abonnement";
const supportLine =
  "Geen proefperiode. Geen automatische verlenging. Geen abonnement om op te zeggen.";

const heroBadges = [
  `Eenmalig ${cvDownloadPrice.display}`,
  "Geen abonnement",
  "Geen automatische verlenging",
  "Later opnieuw downloaden",
  "ATS-vriendelijk",
];

const subscriptionChecks = [
  {
    question: "Moet ik een proefabonnement starten?",
    answer: "Nee",
  },
  {
    question: "Wordt er maandelijks geld afgeschreven?",
    answer: "Nee",
  },
  {
    question: "Moet ik later iets opzeggen?",
    answer: "Nee",
  },
  {
    question: "Kan ik eerst gratis bouwen?",
    answer: "Ja",
  },
  {
    question: "Wanneer betaal ik?",
    answer: "Alleen bij PDF-download",
  },
  {
    question: "Wat kost het?",
    answer: `Eénmalig ${cvDownloadPrice.display}`,
  },
];

const whyWerkCvBullets = [
  "Gebouwd voor de Belgische arbeidsmarkt",
  "ATS-vriendelijke templates zonder overbodige opmaak",
  "Gratis starten, pas betalen bij PDF-download",
  "Geen abonnement of automatische verlenging",
  `Eén duidelijke prijs: ${cvDownloadPrice.display}`,
];

const explanationCards = [
  {
    title: "Betaal alleen als je cv echt klaar is",
    body: "Schrijf, herschrijf en vergelijk templates eerst gratis. De betaling zit alleen op de PDF-download van het document dat je echt wilt versturen.",
  },
  {
    title: "Geen opzegstress of verborgen verlenging",
    body: "Je hoeft nergens een maandplan stop te zetten. Voor hetzelfde betaalde cv kun je later terugkomen, bewerken en opnieuw downloaden zonder extra kosten.",
  },
  {
    title: "Zelfde doel, zonder maandstress",
    body: "Het eindresultaat hangt af van templates, ATS-veiligheid en gebruiksgemak. WerkCV koppelt die kwaliteit aan een model zonder abonnement, zodat tijdelijk solliciteren geen doorlopende kosten oplevert.",
  },
];

const intentCards = [
  {
    title: "Zonder abonnement past bij tijdelijk gebruik",
    body: "Voor de meeste sollicitanten is een cv-builder iets voor een sollicitatieronde, niet voor een doorlopend maandabonnement. Je gebruikt hem intensief, downloadt je PDF en bent klaar.",
  },
  {
    title: "Geen abonnement betekent vooral prijsrust",
    body: "Deze zoekterm gaat meestal niet over gratis. Hij gaat over eerst bouwen, daarna pas beslissen, en geen maandbedrag hoeven onthouden dat later automatisch doorloopt.",
  },
  {
    title: "Geen proefperiode betekent minder abonnementsstress",
    body: "Wie zoekt op een cv-maker zonder proefperiode zoekt meestal dezelfde uitkomst: geen proefperiode die omslaat in een abonnement, maar een rustige route waarbij je pas betaalt op de uiteindelijke download.",
  },
];

const relatedLinks = [
  {
    href: "/prijzen",
    title: "Bekijk precies hoe het prijsmodel werkt",
    body: `Ga naar prijzen als je wilt zien wat je krijgt voor ${cvDownloadPrice.display} en wanneer je precies betaalt.`,
  },
  {
    href: "/templates",
    title: "Vergelijk ATS-vriendelijke templates",
    body: "Gebruik eerst de template-overzichtspagina als je wilt zien welke layout het best past bij jouw vacaturetype.",
  },
  {
    href: "/cv-maken-gratis",
    title: "Gratis starten en later beslissen",
    body: "Goede vervolgstap als je eerst zonder drempel wilt bouwen en pas later over de PDF beslist.",
  },
  {
    href: "/cv-maken-gratis",
    title: "Vergelijk gratis starten en éénmalig betalen",
    body: "Gebruik deze route als je vooral wilt begrijpen waarom eerst bouwen en later één keer betalen beter voelt dan een abonnement.",
  },
  {
    href: "/prijzen",
    title: "CV maken zonder verborgen kosten",
    body: "Ga hierheen als je vooral wilt weten wanneer je betaalt en wat er niet stilletjes doorloopt.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute: "CV maken zonder abonnement | Eenmalig €4,99 | WerkCV",
  },
  description:
    "Maak gratis je cv voor België en betaal pas éénmalig €4,99 bij PDF-download. Geen proefperiode, geen automatische verlenging en niets om op te zeggen.",
  keywords: [
    "cv maken zonder abonnement",
    "cv maken eenmalig betalen",
    "cv maken geen abonnement",
    "cv eenmalig betalen",
    "cv maker eenmalig",
    "cv builder zonder abonnement",
    "geen abonnement cv maker",
  ],
  alternates: {
    canonical: pageUrl,
    languages: {
      "nl-BE": pageUrl,
      "nl-NL": "https://werkcv.nl/cv-maken-zonder-abonnement",
      "x-default": pageUrl,
    },
  },
  openGraph: {
    title: "CV maken zonder abonnement | Eenmalig €4,99 | WerkCV",
    description:
      "Maak gratis je cv voor België en betaal pas éénmalig €4,99 bij PDF-download. Geen proefperiode, geen automatische verlenging en niets om op te zeggen.",
    url: pageUrl,
    siteName: "WerkCV",
    locale: "nl_BE",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WerkCV - cv maken zonder abonnement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV maken zonder abonnement | Eenmalig €4,99 | WerkCV",
    description:
      "Maak gratis je cv voor België en betaal pas éénmalig €4,99 bij PDF-download. Geen proefperiode, geen automatische verlenging en niets om op te zeggen.",
    images: ["/opengraph-image"],
  },
};

export default function CvMakenZonderAbonnementPage() {
  return (
    <div className="min-h-screen bg-[#FFFEF0]">
      <FAQJsonLd questions={[...faqs]} />

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
              trackingLocation="cv-maken-zonder-abonnement:header_primary"
              trackingLabel="Maak gratis je cv, betaal pas bij downloaden"
              className="border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-black text-black"
            >
              Maak gratis je cv
            </TrackedLandingLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 pb-28 md:pb-10">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "CV maken zonder abonnement", href: "/cv-maken-zonder-abonnement" },
            ]}
          />
        </div>

        <section className="mb-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-black"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-black md:text-5xl">
              CV maken zonder abonnement
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              Maak gratis je cv voor België, bekijk je voorbeeld en betaal pas éénmalig {cvDownloadPrice.display} als je de PDF wilt downloaden. Geen proefperiode, geen automatische verlenging en niets om later op te zeggen.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLandingLink
                href="/editor"
                trackingLocation="cv-maken-zonder-abonnement:hero_primary"
                trackingLabel="Maak gratis je cv, betaal pas bij downloaden"
                ctaEventName="cta_no_subscription_hero"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Maak gratis je cv, betaal pas bij downloaden
              </TrackedLandingLink>
              <Link
                href="/prijzen"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Bekijk prijsmodel
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              Je kunt eerst alles invullen en aanpassen. De betaling komt alleen bij de definitieve PDF-download.
            </p>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Zo werkt WerkCV
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Eerst bouwen, daarna pas betalen
            </h2>
            <div className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-slate-700">
              <p>Maak gratis je cv, kies een template en bekijk rustig je voorbeeld zonder eerst een betaalstap te moeten starten.</p>
              <p>Betaal pas als je jouw definitieve cv als PDF wilt downloaden. Daar zit het hele prijsmodel op.</p>
              <p>Open datzelfde cv later opnieuw, werk het bij en download opnieuw zonder maandabonnement of opzegmoment.</p>
            </div>
            <p className="mt-5 border-t-4 border-black pt-4 text-sm font-black leading-relaxed text-black">
              {supportLine}
            </p>
          </aside>
        </section>

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-600">
            CV maker eenmalig
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">
            CV maker eenmalig betalen, zonder maandabonnement
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
            Zoek je een cv maker waarbij je niet vastzit aan een proefperiode of maandbedrag?
            Bij WerkCV bouw je eerst gratis. Pas als je je cv als PDF downloadt betaal je eenmalig {cvDownloadPrice.display}.
          </p>
        </section>

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Geen abonnementsstress
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">
            Geen abonnement betekent bij WerkCV:
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {subscriptionChecks.map((item) => (
              <article
                key={item.question}
                className="border-3 border-black bg-[#FFF9D9] p-4"
                style={{ borderWidth: "3px" }}
              >
                <p className="text-sm font-black text-black">{item.question}</p>
                <p className="mt-2 text-base font-black text-slate-900">{item.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <TrackedLandingLink
              href="/editor"
              trackingLocation="cv-maken-zonder-abonnement:trust_primary"
              trackingLabel="Start zonder abonnement"
              className="inline-block border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Start zonder abonnement
            </TrackedLandingLink>
            <p className="text-sm font-medium text-slate-700">{supportLine}</p>
          </div>
        </section>

        <section className="mb-12 overflow-x-auto border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-black bg-[#FFF4D6] px-4 py-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">
              Direct vergelijken
            </p>
            <h2 className="mt-1 text-2xl font-black text-black">
              WerkCV vs CVmaker vs CV.nl vs CVster
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
              Als je al weet dat je geen abonnement wilt, gaat de keuze meestal over prijsmodel, automatische verlenging en hoeveel gedoe je later nog hebt.
            </p>
          </div>
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-black text-white">
                {["", "WerkCV", "CVmaker", "CV.nl", "CVster"].map((heading) => (
                  <th
                    key={heading || "feature"}
                    className="border-b-2 border-white/20 px-4 py-3 text-left font-black"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row[0]} className="odd:bg-[#FFF9D9]">
                  {row.map((cell, index) => (
                    <td
                      key={`${row[0]}-${cell}`}
                      className={`border-t-2 border-black px-4 py-3 align-top ${
                        index === 0 ? "font-black text-black" : "font-medium text-slate-700"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t-2 border-black bg-[#FFF4D6] px-4 py-5">
            <h3 className="text-2xl font-black text-black">
              Kies de cv-maker zonder abonnement
            </h3>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
              Wil je gewoon een nette cv-PDF zonder maandkosten? Start gratis, maak je cv af en betaal pas éénmalig {cvDownloadPrice.display} wanneer je wilt downloaden.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <TrackedLandingLink
                href="/editor"
                trackingLocation="cv-maken-zonder-abonnement:comparison_primary"
                trackingLabel="Maak gratis je cv, betaal pas bij downloaden"
                ctaEventName="cta_no_subscription_comparison"
                className="inline-block border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Maak gratis je cv, betaal pas bij downloaden
              </TrackedLandingLink>
              <p className="text-sm font-medium text-slate-700">
                Geen proefperiode. Geen automatische verlenging. Geen opzegstress.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 grid gap-5 md:grid-cols-3">
          {explanationCards.map((card) => (
            <article
              key={card.title}
              className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
            >
              <h2 className="text-xl font-black text-black">{card.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <article className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Download-intentie
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              CV downloaden zonder abonnement
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
              Als je zoekt op cv downloaden zonder abonnement, wil je meestal weten of je na betaling ergens aan vastzit. Bij WerkCV betaal je alleen voor de definitieve PDF-download. Er start geen maandplan en er is niets om later op te zeggen.
            </p>
            <TrackedLandingLink
              href="/editor"
              trackingLocation="cv-maken-zonder-abonnement:download_section_primary"
              trackingLabel="Download je cv zonder maandkosten"
              className="mt-5 inline-block border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Download je cv zonder maandkosten
            </TrackedLandingLink>
          </article>

          <article className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Alternatieve zoekterm
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              CV maken geen abonnement
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
              Geen abonnement betekent bij WerkCV dat je gratis kunt bouwen, pas betaalt bij PDF-download en daarna geen automatische verlenging krijgt. Dat maakt de kosten vooraf duidelijker dan een proefperiode of maandmodel.
            </p>
            <Link
              href="/prijzen"
              className="mt-5 inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
            >
              Bekijk verborgen-kosten uitleg
            </Link>
          </article>
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-3">
          {intentCards.map((card) => (
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
            Handige vervolgroutes
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {relatedLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-2 border-white bg-white/10 p-4 transition-colors hover:bg-white hover:text-black"
              >
                <p className="text-sm font-black">{item.title}</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-200 hover:text-slate-700">
                  {item.body}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-center text-3xl font-black text-black">
            Veelgestelde vragen over cv maken zonder abonnement
          </h2>
          <div className="mx-auto mt-8 max-w-4xl space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <summary className="flex cursor-pointer items-center justify-between p-4 text-left text-base font-black text-black">
                  {faq.question}
                  <span className="ml-3 text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t-2 border-black px-4 pb-4 pt-3 text-sm font-medium leading-relaxed text-slate-700">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Waarom WerkCV?
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm font-medium leading-relaxed text-slate-700 marker:text-black">
            {whyWerkCvBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <section className="border-4 border-black bg-yellow-400 px-6 py-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black text-black">
                Klaar om zonder abonnement te starten?
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-black sm:text-base">
                Bouw je cv gratis, betaal later éénmalig bij download en houd toegang tot hetzelfde cv.
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-black sm:text-base">
                {supportLine}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TrackedLandingLink
                href="/editor"
                trackingLocation="cv-maken-zonder-abonnement:bottom_primary"
                trackingLabel="Maak gratis je cv"
                ctaEventName="cta_no_subscription_bottom"
                className="inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Maak gratis je cv
              </TrackedLandingLink>
              <Link
                href="/templates"
                className="inline-block border-4 border-black bg-black px-5 py-3 text-base font-black text-white"
              >
                Bekijk templates
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <MobileStickyCta
        text="CV maken zonder abonnement"
        buttonLabel="Start gratis"
        href="/editor"
        trackingLocation="cv-maken-zonder-abonnement:sticky_primary"
        trackingLabel="Start gratis"
        ctaEventName="cta_no_subscription_sticky"
      />
    </div>
  );
}
