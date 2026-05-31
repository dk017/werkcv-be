import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SectionIntentLinks from "@/components/seo/SectionIntentLinks";
import { siteConfig } from "@/config/site";
import { buildDutchMetadata } from "@/lib/page-metadata";
import { templateList } from "@/lib/templates/registry";

const featuredTemplates = templateList.filter((template) =>
  ["professional", "modern", "simple", "ats"].includes(template.id),
);

const templateUseCases: Record<string, string> = {
  professional: "Ideaal voor administratie, finance en zakelijke functies waar rust en overzicht belangrijk zijn.",
  modern: "Sterke keuze voor sales, marketing en tech als je een frisse maar professionele uitstraling wilt.",
  simple: "De veiligste optie voor snelle sollicitaties, starters en functies waar inhoud belangrijker is dan design.",
  ats: "Beste keuze als je door applicant tracking systems wilt komen met een ultra-helder, scanbaar format.",
};

const faqs = [
  {
    question: "Is WerkCV echt gratis te gebruiken?",
    answer:
      "Ja. Je kunt gratis een CV aanmaken, bewerken en verschillende templates vergelijken. Je betaalt alleen als je je CV als PDF wilt downloaden.",
  },
  {
    question: "Wat is het verschil tussen een gratis cv template en een gratis download?",
    answer:
      "Bij WerkCV is het template zelf gratis te gebruiken in de editor. De betaalde stap is alleen de uiteindelijke PDF-download. Zo kun je eerst alles testen voordat je beslist.",
  },
  {
    question: "Welke gratis cv template is het beste voor ATS?",
    answer:
      "De ATS-vriendelijke template en simpele layouts werken het best voor ATS-systemen. Ze gebruiken een duidelijke structuur, weinig visuele ruis en houden belangrijke keywords leesbaar.",
  },
  {
    question: "Kan ik mijn gratis CV later aanpassen?",
    answer:
      "Ja. Je CV blijft bewerkbaar, zodat je eenvoudig meerdere versies voor verschillende vacatures kunt maken en pas downloadt wanneer je tevreden bent.",
  },
];

const freeTemplateIntentLinks = [
  {
    href: "/cv-maken-gratis",
    label: "Gratis CV maken zodra je een template hebt gekozen",
    description:
      "Gebruik de gratis template als startpunt en bouw daarna direct je eerste sollicitatieversie op.",
  },
  {
    href: "/editor",
    label: "CV aanmaken met een structuur die bij je gekozen stijl past",
    description:
      "Open meteen een basisopbouw waarin profieltekst, ervaring en vaardigheden logisch staan.",
  },
  {
    href: "/templates",
    label: "CV maken met een template-route in plaats van losse layoutkeuzes",
    description:
      "Handig als je vooral templates wilt vergelijken en daarna snel een richting wilt kiezen.",
  },
  {
    href: "/editor",
    label: "CV maken en afronden als stabiele PDF",
    description:
      "Werk gratis op in de editor en stuur pas op PDF aan wanneer je versie echt klaar is.",
  },
  {
    href: "/cv-template-vlaanderen",
    label: "ATS CV template kiezen als scanbaarheid je hoogste prioriteit is",
    description:
      "Ga hierheen wanneer je vooral zekerheid wilt op sollicitatiesoftware en rustige secties.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Gratis CV Template - Professioneel CV Maken Zonder Abonnement | WerkCV",
  description:
    "Zoek je een gratis cv template voor België? Vergelijk 13+ professionele cv-sjablonen, kies een ATS-vriendelijke layout en maak gratis je cv. Betaal alleen bij PDF-download.",
  path: "/gratis-cv-template",
  keywords: [
    "gratis cv template",
    "gratis cv sjabloon",
    "cv template gratis",
    "professioneel cv template",
    "ats cv template",
    "cv template zonder abonnement",
    "cv sjabloon gratis downloaden",
    "modern cv template",
    "cv maken gratis",
  ],
  languages: {
    "nl-BE": `${siteConfig.baseUrl}/gratis-cv-template`,
    "nl-NL": "https://werkcv.nl/gratis-cv-template",
    "x-default": `${siteConfig.baseUrl}/gratis-cv-template`,
  },
});

export default function GratisCvTemplatePage() {
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gratis CV Template",
        item: `${siteConfig.baseUrl}/gratis-cv-template`,
      },
    ],
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
            href="/templates"
            className="border-2 border-black bg-yellow-400 px-3 py-1 text-sm font-black text-black transition-colors hover:bg-yellow-300"
          >
            Vergelijk gratis templates
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <section className="mb-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
              Hoge intentie
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              Gratis CV template kiezen zonder in een abonnement te belanden
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              Een goed gratis CV template moet twee dingen tegelijk doen: professioneel ogen voor recruiters en praktisch genoeg zijn om snel te personaliseren voor elke vacature.
              WerkCV laat je gratis starten met {templateList.length} templates, meerdere kleurthema&apos;s en een ATS-vriendelijke editor. Je betaalt pas als je je PDF wilt downloaden.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/templates"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Bekijk gratis templates
              </Link>
              <Link
                href="/cv-maken-gratis"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Gratis CV maken
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                `${templateList.length} templates`,
                "ATS-vriendelijke optie",
                "Eenmalig €4,99 bij download",
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
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.3em] text-slate-600">
              <span className="px-3 py-1 border-2 border-black bg-white">Gehost op EU-servers (Hetzner, DE)</span>
              <span className="px-3 py-1 border-2 border-black bg-white">GDPR-compliant – gegevens blijven in de EU</span>
              <span className="px-3 py-1 border-2 border-black bg-white">Geen abonnement, eenmalig per CV</span>
            </div>
          </div>

          <div className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-black">Wat maakt een gratis cv sjabloon goed?</h2>
            <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-slate-700">
              <li>
                <strong className="text-black">Duidelijke structuur:</strong> recruiters moeten je profiel, werkervaring en vaardigheden in seconden kunnen scannen.
              </li>
              <li>
                <strong className="text-black">ATS-leesbaarheid:</strong> simpele secties en heldere koppen helpen je CV door sollicitatiesoftware.
              </li>
              <li>
                <strong className="text-black">Flexibiliteit:</strong> je wilt kunnen wisselen tussen modern, klassiek en minimal zonder opnieuw te beginnen.
              </li>
              <li>
                <strong className="text-black">Eerlijk prijsmodel:</strong> gratis bouwen en vergelijken, pas betalen wanneer je echt wilt downloaden.
              </li>
            </ul>
            <div className="mt-6 border-t-4 border-black pt-5">
              <Link
                href="/cv-template-vlaanderen"
                className="text-sm font-black text-black underline decoration-2 underline-offset-4"
              >
                Lees ook: cv template kiezen voor Vlaanderen
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                Beste opties
              </p>
              <h2 className="text-3xl font-black text-black">
                Gratis CV templates die direct bruikbaar zijn
              </h2>
            </div>
            <Link href="/templates" className="text-sm font-black text-black underline decoration-2 underline-offset-4">
              Bekijk alle templates
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex h-full flex-col border-4 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  {template.nameDutch}
                </p>
                <h3 className="mt-2 text-xl font-black text-black">{template.name}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
                  {template.description}
                </p>
                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
                  {templateUseCases[template.id]}
                </p>
                <div className="mt-auto pt-5">
                  <Link
                    href="/editor"
                    className="inline-block border-2 border-black bg-yellow-400 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black"
                  >
                    Start met deze stijl
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-3">
          <div className="border-4 border-black bg-yellow-400 p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-black">WerkCV.be</p>
            <h2 className="mt-2 text-2xl font-black text-black">Gratis starten, helder afrekenen</h2>
            <p className="mt-3 text-sm font-bold leading-relaxed text-black">
              Je maakt gratis je CV, wisselt tussen layouts en betaalt pas op het moment dat je een PDF wilt downloaden.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-6">
            <h3 className="text-lg font-black text-black">Waarom dit beter werkt dan “gratis proefperiodes”</h3>
            <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed text-slate-700">
              <li>Geen verborgen maandkosten.</li>
              <li>Geen automatische verlenging.</li>
              <li>Eerst volledig testen, daarna beslissen.</li>
              <li>Geschikt voor meerdere versies van hetzelfde CV.</li>
            </ul>
          </div>
          <div className="border-4 border-black bg-white p-6">
            <h3 className="text-lg font-black text-black">Beter dan zelf prutsen in Word</h3>
            <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed text-slate-700">
              <li>Geen opmaakstress of verschuivende tekstvakken.</li>
              <li>Direct een professionelere uitstraling.</li>
              <li>Sterkere ATS-compatibiliteit.</li>
              <li>Sneller aanpassen per vacature.</li>
            </ul>
          </div>
        </section>

        <section className="mb-14">
          <div className="border-4 border-black bg-[#FFF7E8] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Eerst tools vergelijken
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              Gebruik deze gidsen als je &quot;gratis&quot; ook op prijsmodel en tooltype wilt checken
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
              Wie zoekt op gratis CV templates vergelijkt vaak niet alleen layouts, maar ook proefperiodes, abonnementen, ATS-risico en designtools zoals Canva. Deze pagina&apos;s helpen je die keuze sneller maken.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                {
                  href: "/cv-maken-zonder-abonnement",
                  title: "CV zonder abonnement",
                  body: "Helpt je het verschil zien tussen echt eenmalig betalen, gratis handmatig werken en proefperiodemodellen.",
                },
                {
                  href: "/cv-maken-belgie",
                  title: "CV maken in België",
                  body: "Gebruik deze route als je eerst wilt zien hoe WerkCV aansluit op Belgische sollicitaties en werkgevers.",
                },
                {
                  href: "/cv-voorbeeld-belgie",
                  title: "CV voorbeeld België",
                  body: "Voor wie eerst een Belgisch cv-voorbeeld wil zien voordat de eigen inhoud wordt uitgewerkt.",
                },
                {
                  href: "/sollicitatiebrief-belgie",
                  title: "Sollicitatiebrief België",
                  body: "Nuttig als je naast je cv ook meteen een motivatiebrief voor de Belgische markt wilt voorbereiden.",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-2 border-black bg-white p-4 transition-colors hover:bg-yellow-100"
                >
                  <p className="text-sm font-black text-black">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Keuzehulp
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              Zo kies je het beste gratis cv template voor jouw situatie
            </h2>
            <div className="mt-6 space-y-5">
              {[
                {
                  title: "Kijk eerst naar de functie",
                  body: "Een administratieve of financiele rol vraagt meestal om een rustiger template. Marketing, sales en creatieve functies kunnen een modernere layout aan.",
                },
                {
                  title: "Kies een template dat je ervaring ondersteunt",
                  body: "Heb je veel werkervaring? Dan is een overzichtelijke, rustige layout belangrijk. Ben je starter, dan helpt een strakke template om je profiel en vaardigheden beter uit te lichten.",
                },
                {
                  title: "Optimaliseer daarna je inhoud",
                  body: "Een goed design helpt, maar sterke tekst bepaalt of je wordt uitgenodigd. Werk daarom direct aan je profieltekst en werkervaring zodra je layout staat.",
                },
              ].map((item, index) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border-3 border-black bg-white text-sm font-black text-black" style={{ borderWidth: "3px" }}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-black">{item.title}</h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Van gratis template naar downloadklare versie
            </p>
            <h3 className="mt-2 text-xl font-black text-black">Welke route wil je hierna openen?</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
              Gebruik gratis templates om te vergelijken, maar stuur daarna direct op de route die past bij je intentie: snel beginnen, ATS-veilig werken of als PDF afronden.
            </p>
            <SectionIntentLinks links={freeTemplateIntentLinks} locale="nl" />
            <div className="mt-6 space-y-4">
              {[
                {
                  href: "/templates",
                  title: "Professioneel CV template",
                  body: "Vergelijk met een rustige zakelijke layout voor administratie, finance, HR en operations.",
                },
                {
                  href: "/templates",
                  title: "Modern CV template",
                  body: "Kies deze route als je een eigentijdse uitstraling wilt zonder onrustige design-elementen.",
                },
                {
                  href: "/cv-template-vlaanderen",
                  title: "ATS CV template",
                  body: "Ga hierheen wanneer scanbaarheid en sollicitatiesoftware zwaarder wegen dan stijlvariatie.",
                },
                {
                  href: "/templates",
                  title: "CV template Word alternatief",
                  body: "Werk je nu nog in Word? Bekijk hoe je sneller werkt met een stabiele online template-flow.",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-2 border-black bg-[#FFFEF0] p-4 transition-colors hover:bg-yellow-100"
                >
                  <p className="text-sm font-black text-black">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-center text-3xl font-black text-black">
            Veelgestelde vragen over gratis CV templates
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
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

        <section className="border-4 border-black bg-black px-6 py-8 text-white shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                Klaar om te starten?
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Begin gratis, kies later pas of je wilt downloaden
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-200 sm:text-base">
                Vergelijk verschillende layouts, maak je inhoud sterker en kies pas aan het einde of je je CV als PDF wilt opslaan.
              </p>
            </div>
            <Link
              href="/cv-maken-gratis"
              className="inline-block border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black"
            >
              Begin gratis met je CV
            </Link>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Footer />
    </div>
  );
}
