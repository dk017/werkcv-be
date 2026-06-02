import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SectionIntentLinks from "@/components/seo/SectionIntentLinks";
import { buildDutchMetadata } from "@/lib/page-metadata";

const quickChecklist = [
  "Gebruik Engels alleen als de vacature of context dat logisch maakt.",
  "Schrijf direct en natuurlijk, niet als letterlijke vertaling uit het Nederlands.",
  "Koppel je fit aan concrete resultaten of context.",
  "Zorg dat je cv dezelfde taal en terminologie gebruikt als je brief.",
];

const languageDecisions = [
  {
    situation: "Nederlandstalige vacature in Vlaanderen",
    advice: "Schrijf meestal in het Nederlands. Een Engelse brief voelt dan sneller minder lokaal of minder precies.",
  },
  {
    situation: "Franstalige vacature in Wallonie of Franstalige Brusselse context",
    advice: "Schrijf in het Frans als de functie dat duidelijk vraagt. Engels is dan meestal niet de sterkste keuze.",
  },
  {
    situation: "Internationale werkgever of vacature in het Engels",
    advice: "Een Engelse cover letter is logisch, vooral in Brussel, bij Europese instellingen of internationale bedrijven.",
  },
  {
    situation: "Meertalige klanten- of supportrol",
    advice: "Volg de hoofdtaal van de vacature, maar benoem je talenkennis helder en geloofwaardig.",
  },
];

const structureBlocks = [
  {
    title: "1) Opening",
    body: "State the role immediately and make the first line sound natural in English. Skip literal Dutch openings.",
  },
  {
    title: "2) Why you fit",
    body: "Connect your experience to the job requirements. Mention one or two concrete outcomes, not broad claims.",
  },
  {
    title: "3) Why this company",
    body: "Keep this short and specific. Mention the team, mission, sector or context that genuinely matches your profile.",
  },
  {
    title: "4) Closing",
    body: "End with a confident, professional call to action and thank the reader for their consideration.",
  },
];

const copyReadyExamples = [
  {
    title: "Opening example",
    text: "I am writing to apply for the Administrative Coordinator position at [Company]. With five years of experience in planning, document control and stakeholder support, I have built a strong track record in keeping complex processes clear and reliable.",
  },
  {
    title: "Body example",
    text: "In my current role, I coordinate internal follow-up across operations and customer support while maintaining a high level of accuracy under time pressure. I also helped reduce response times by improving the handover process between teams.",
  },
  {
    title: "Closing example",
    text: "I would welcome the opportunity to discuss how my organisational skills and multilingual communication can support your team in Brussels. Thank you for your time and consideration. I look forward to hearing from you.",
  },
];

const commonMistakes = [
  {
    title: "Literal translation",
    wrong: "With this letter I apply for the function of...",
    better: "I am writing to apply for the [Job Title] position at [Company].",
  },
  {
    title: "Generic motivation",
    wrong: "I am motivated, flexible and eager to learn.",
    better: "I improved internal follow-up by creating a clearer planning flow and communication routine.",
  },
  {
    title: "Weak company fit",
    wrong: "Your company seems interesting to me.",
    better: "I am particularly interested in your Brussels-based team because the role combines coordination with international stakeholder contact.",
  },
  {
    title: "Flat closing",
    wrong: "I hope my letter is good enough.",
    better: "I would welcome the opportunity to discuss how I can contribute to your team.",
  },
];

const faqs = [
  {
    question: "Wanneer schrijf ik een sollicitatiebrief in het Engels in Belgie?",
    answer:
      "Vooral wanneer de vacature in het Engels staat of wanneer je solliciteert bij een internationale werkgever, Europese instelling of meertalige Brusselse context. In lokale Vlaamse of Franstalige vacatures werkt de vacaturetaal meestal sterker.",
  },
  {
    question: "Kan ik mijn Nederlandse motivatiebrief gewoon vertalen?",
    answer:
      "Beter niet. Letterlijke vertalingen klinken vaak onnatuurlijk. Herschrijf je brief in helder Engels en pas voorbeelden en zinsbouw aan.",
  },
  {
    question: "Moet mijn cv ook in het Engels staan?",
    answer:
      "Ja, meestal wel. Een Engelse brief met een Nederlands cv voelt inconsistent. Hou taal, functietitels en kernbegrippen op elkaar afgestemd.",
  },
  {
    question: "Is Engels in Brussel altijd veilig?",
    answer:
      "Niet altijd. Brussel is tweetalig en veel internationale werkgevers gebruiken Engels, maar lokale vacatures kunnen nog steeds duidelijk Nederlands of Frans verwachten. Volg dus eerst de taal van de vacature.",
  },
];

const intentLinks = [
  {
    href: "/motivatiebrief-voorbeeld",
    label: "Bekijk eerst Nederlandse of Belgische voorbeeldbrieven als je nog twijfelt over structuur",
    description: "Gebruik daarna deze pagina om naar een natuurlijke Engelse versie over te schakelen.",
  },
  {
    href: "/motivatiebrief-layout",
    label: "Controleer de layout van je brief voordat je hem verstuurt",
    description: "Ook een Engelse brief moet rustig, scanbaar en pdf-stabiel blijven.",
  },
  {
    href: "/sollicitatiebrief-belgie",
    label: "Lees hoe taalkeuze binnen de Belgische context werkt",
    description: "Handig wanneer je tussen Nederlands, Frans en Engels moet kiezen.",
  },
  {
    href: "/cv-maken-belgie",
    label: "Zorg voor een cv dat taal en positionering van je brief ondersteunt",
    description: "Dat voorkomt een Engelse brief naast een cv dat nog te lokaal of inconsistent voelt.",
  },
  {
    href: "/en/cv-template-belgium",
    label: "Gebruik de English CV route voor Belgium als je ook je cv nog moet lokaliseren",
    description: "Handig wanneer je sollicitatiebrief al in het Engels moet, maar je cv nog te generiek internationaal aanvoelt.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Sollicitatiebrief in Engels voor Belgie | Voorbeelden en Taalkeuze | WerkCV",
  description:
    "Schrijf een sterke sollicitatiebrief in Engels voor Belgie. Bekijk taalkeuze per context, natuurlijke Engelse voorbeelden en veelgemaakte vertaalfouten.",
  path: "/sollicitatiebrief-in-engels",
  keywords: [
    "sollicitatiebrief in engels belgie",
    "engelse motivatiebrief belgie",
    "english cover letter belgium",
    "brussel sollicitatiebrief engels",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/sollicitatiebrief-in-engels",
    "nl-NL": "https://werkcv.nl/sollicitatiebrief-in-engels",
    "x-default": "https://werkcv.be/sollicitatiebrief-in-engels",
  },
});

export default function SollicitatiebriefInEngelsPage() {
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
            href="/cv-maken-belgie"
            className="border-2 border-black bg-yellow-400 px-3 py-1 text-sm font-black text-black transition-colors hover:bg-yellow-300"
          >
            Match met je cv
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
              Engelse brief in Belgische context
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              Sollicitatiebrief in Engels schrijven voor Belgie zonder onnatuurlijke vertaaltaal
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              In Belgie is Engels soms de juiste keuze, maar zeker niet altijd. De taal van je brief moet passen bij de vacature, de regio en het type werkgever. Op deze pagina zie je wanneer Engels logisch is, hoe je natuurlijk schrijft en welke vertaalfouten je beter vermijdt.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/motivatiebrief-voorbeeld"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Eerst Belgische voorbeelden
              </Link>
              <Link
                href="/sollicitatiebrief-belgie"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Belgische sollicitatiecontext
              </Link>
            </div>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-black">Quick checklist</h2>
            <div className="mt-5 space-y-4">
              {quickChecklist.map((item, index) => (
                <div key={item} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center border-2 border-black bg-yellow-300 text-xs font-black">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mb-14 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Taalkeuze</p>
          <h2 className="mt-2 text-3xl font-black text-black">Wanneer Engels wel en niet logisch is</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {languageDecisions.map((item) => (
              <article key={item.situation} className="border-2 border-black bg-[#FFF9D9] p-4">
                <h3 className="text-sm font-black text-black">{item.situation}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{item.advice}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="border-4 border-black bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Structuur</p>
            <h2 className="mt-2 text-2xl font-black text-black">Een korte English cover letter opbouwen</h2>
            <div className="mt-4 space-y-4">
              {structureBlocks.map((block) => (
                <div key={block.title}>
                  <p className="text-sm font-black text-black">{block.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{block.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Copy-ready voorbeelden</p>
            <h2 className="mt-2 text-2xl font-black">Schrijf natuurlijker in het Engels</h2>
            <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-slate-200">
              {copyReadyExamples.map((example) => (
                <div key={example.title}>
                  <p className="font-black text-white">{example.title}</p>
                  <p className="mt-1">{example.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Fouten corrigeren</p>
          <h2 className="mt-2 text-3xl font-black text-black">Van letterlijke vertaling naar professioneel Engels</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {commonMistakes.map((item) => (
              <article key={item.title} className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-base font-black text-black">{item.title}</h3>
                <p className="mt-3 text-sm font-black text-black">Niet doen</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.wrong}</p>
                <p className="mt-3 text-sm font-black text-black">Beter</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.better}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black text-black">Veelgestelde vragen</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="border-2 border-black bg-[#FFFEF0] p-4">
                <summary className="cursor-pointer text-base font-black text-black">{faq.question}</summary>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{faq.answer}</p>
              </details>
            ))}
          </div>
          <SectionIntentLinks links={intentLinks} locale="nl" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
