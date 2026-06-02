import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SectionIntentLinks from "@/components/seo/SectionIntentLinks";
import { buildDutchMetadata } from "@/lib/page-metadata";

const examples = [
  {
    title: "Administratief medewerker",
    text: "Met veel interesse solliciteer ik naar de functie van administratief medewerker bij [Bedrijf]. In mijn huidige rol ondersteun ik planning, dossieropvolging en klantencontact, waarbij nauwkeurigheid en discretie centraal staan. Door een strakkere opvolging van openstaande dossiers hielp ik de doorlooptijd merkbaar verkorten. Net die combinatie van structuur, service en betrouwbaarheid wil ik ook in uw team inzetten.",
  },
  {
    title: "Starter na bachelor",
    text: "Tijdens mijn stage ontdekte ik hoe sterk mijn organisatievermogen en communicatie samenkomen in een ondersteunende functie. Ik nam zelfstandig plannings- en opvolgtaken op en kreeg positieve feedback op mijn nauwkeurigheid. Ik ben gemotiveerd om die basis verder uit te bouwen in een eerste vaste functie waarin ik snel kan bijleren en verantwoordelijkheid opnemen.",
  },
  {
    title: "Verkoper of klantgerichte functie",
    text: "Wat mij aanspreekt in deze functie is de combinatie van commercieel inzicht en echt klantencontact. In mijn huidige job werk ik dagelijks met advies, winkelpresentatie en service, en slaagde ik erin mijn doelstellingen consequent te halen. Ik wil die ervaring nu inzetten in een omgeving waar resultaat en klantbeleving even belangrijk zijn.",
  },
  {
    title: "Brussel of internationale context",
    text: "I am drawn to this role because it combines structured coordination with communication in an international environment. In my current position, I support cross-team workflows and client follow-up in English and Dutch, while maintaining high accuracy under time pressure. I would welcome the opportunity to bring that mix of reliability and adaptability to your Brussels team.",
  },
];

const checklist = [
  "Leg uit waarom net deze functie en werkgever je aanspreken.",
  "Koppel je motivatie aan 1 of 2 concrete voorbeelden uit ervaring, stage of opleiding.",
  "Hou je toon persoonlijk maar zakelijk.",
  "Laat je brief je cv aanvullen in plaats van herhalen.",
];

const belgiumGuidance = [
  {
    title: "Schrijf op maat van de vacature",
    body: "VDAB en Le Forem benadrukken allebei dat een motivatiebrief een aanvulling is op je cv en specifiek op de vacature moet worden afgestemd.",
  },
  {
    title: "Hou het kort en geloofwaardig",
    body: "Een goede brief in Belgie is meestal persoonlijk genoeg om op te vallen, maar compact genoeg om snel te lezen.",
  },
  {
    title: "Kies de taal van de vacature",
    body: "Voor Vlaamse vacatures werkt Nederlands meestal het best. In Brussel of internationale bedrijven kan Engels logisch zijn, maar alleen als de context dat ondersteunt.",
  },
];

const faqs = [
  {
    question: "Wat is een goed motivatiebrief voorbeeld voor Belgie?",
    answer:
      "Een goed voorbeeld laat zien waarom jij voor deze functie kiest en waarom jouw ervaring relevant is. Het blijft kort, concreet en past bij de taal en toon van de vacature.",
  },
  {
    question: "Mag ik een voorbeeldtekst letterlijk overnemen?",
    answer:
      "Gebruik voorbeelden als structuur, niet als eindversie. Recruiters merken snel wanneer een brief te generiek voelt of niet aansluit op de vacature.",
  },
  {
    question: "Moet mijn motivatiebrief andere info bevatten dan mijn cv?",
    answer:
      "Ja. Je cv toont de feiten, je brief legt uit waarom die feiten relevant zijn voor deze werkgever. De twee documenten moeten elkaar aanvullen.",
  },
  {
    question: "Wanneer kies ik voor een Engelse motivatiebrief in Belgie?",
    answer:
      "Vooral wanneer de vacature in het Engels staat of de werkgever duidelijk internationaal werkt. In lokale Vlaamse of Franstalige contexten is de vacaturetaal meestal sterker.",
  },
];

const intentLinks = [
  {
    href: "/motivatiebrief-layout",
    label: "Controleer eerst of je motivatiebrief ook visueel rustig staat",
    description: "Een sterke inhoud verliest impact als je opmaak onduidelijk of rommelig oogt.",
  },
  {
    href: "/sollicitatiebrief-in-engels",
    label: "Kijk hier als je een Engelse brief nodig hebt voor Brussel of een internationale werkgever",
    description: "Je hoeft dan niet letterlijk uit het Nederlands te vertalen.",
  },
  {
    href: "/cv-maken-belgie",
    label: "Werk eerst je cv uit zodat je brief op echte inhoud kan steunen",
    description: "Dat maakt het veel makkelijker om concrete troeven en resultaten te benoemen.",
  },
  {
    href: "/sollicitatiebrief-belgie",
    label: "Lees hoe motivatiebrieven en cv's elkaar in Belgie versterken",
    description: "Gebruik de voorbeelden op deze pagina daarna als praktische invulling.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Motivatiebrief Voorbeeld Belgie | Voorbeelden en Structuur | WerkCV",
  description:
    "Zoek je een motivatiebrief voorbeeld voor Belgie? Bekijk voorbeeldalinea's, Belgische schrijftips en een checklist voor een overtuigende brief.",
  path: "/motivatiebrief-voorbeeld",
  keywords: [
    "motivatiebrief voorbeeld belgie",
    "voorbeeld motivatiebrief",
    "motivatiebrief schrijven belgie",
    "sollicitatiebrief voorbeeld belgie",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/motivatiebrief-voorbeeld",
    "nl-NL": "https://werkcv.nl/motivatiebrief-voorbeeld",
    "x-default": "https://werkcv.be/motivatiebrief-voorbeeld",
  },
});

export default function MotivatiebriefVoorbeeldPage() {
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
            Maak eerst je cv
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
              Voorbeeldbrieven voor Belgie
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              Motivatiebrief voorbeelden die passen bij de Belgische sollicitatiepraktijk
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              Een goede motivatiebrief in Belgie is geen standaardtekst vol enthousiasme, maar een korte brief die uitlegt waarom jij bij deze functie en werkgever past. Gebruik de voorbeelden hieronder als vertrekpunt en pas ze daarna aan op jouw rol, taal en ervaring.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/motivatiebrief-layout"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Controleer eerst je layout
              </Link>
              <Link
                href="/sollicitatiebrief-belgie"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Lees de Belgische context
              </Link>
            </div>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-black">Checklist</h2>
            <div className="mt-5 space-y-4">
              {checklist.map((item, index) => (
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

        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Copy-ready alinea&apos;s</p>
          <h2 className="mt-2 text-3xl font-black text-black">Motivatiebrief voorbeelden per situatie</h2>
          <div className="mt-6 space-y-5">
            {examples.map((example) => (
              <article
                key={example.title}
                className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
              >
                <h3 className="text-lg font-black text-black">{example.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{example.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Belgische aandachtspunten</p>
            <h2 className="mt-2 text-2xl font-black">Wat een brief hier geloofwaardig maakt</h2>
            <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-slate-200">
              {belgiumGuidance.map((item) => (
                <div key={item.title}>
                  <p className="font-black text-white">{item.title}</p>
                  <p className="mt-1">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Belangrijk onderscheid</p>
            <h2 className="mt-2 text-2xl font-black text-black">Je brief mag je cv niet kopieren</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
              Je cv geeft het overzicht van ervaring, opleiding en vaardigheden. Je motivatiebrief verklaart waarom dat profiel relevant is voor deze vacature. Die rolverdeling maakt je sollicitatie sterker en voorkomt dat beide documenten hetzelfde verhaal twee keer vertellen.
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
              Werk daarom vanuit concrete voorbeelden uit je cv, maar herschrijf ze als motivatie en keuze voor het bedrijf. Zo blijft je brief persoonlijk, gericht en geloofwaardig.
            </p>
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
