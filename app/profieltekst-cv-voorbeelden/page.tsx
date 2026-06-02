import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SectionIntentLinks from "@/components/seo/SectionIntentLinks";
import { buildDutchMetadata } from "@/lib/page-metadata";

const frameworkSteps = [
  "Open met je functie, ervaringsniveau en domein in 1 zin.",
  "Noem 2 of 3 sterktes die rechtstreeks aansluiten op de vacature.",
  "Voeg 1 concreet resultaat of bewijs toe.",
  "Sluit af met het type rol of context waarin je nu wilt bijdragen.",
];

const roleExamples = [
  {
    title: "Administratief medewerker in Vlaanderen",
    text: "Nauwkeurige administratief medewerker met 6 jaar ervaring in dossierbeheer, planning en klantencontact. Ik verkortte de verwerkingstijd van facturen met 22% door een strakkere opvolging tussen administratie en finance. Ik zoek een rol waarin ik structuur, discretie en service combineer.",
    why: "Sterk voor Belgische kantoorfuncties: rustig, concreet en geloofwaardig.",
  },
  {
    title: "Customer support in Brussel",
    text: "Klantgerichte supportmedewerker met 4 jaar ervaring in e-mail, telefoon en ticketing in een meertalige omgeving. Ik combineer Nederlands en Engels vlot in klantcontact en hielp de first-response score verbeteren door een duidelijkere triageflow. Ik zoek een rol waarin servicekwaliteit en tempo samen belangrijk zijn.",
    why: "Past beter bij Brussel dan een puur eentalige opening.",
  },
  {
    title: "Verkoper retail",
    text: "Commercieel ingestelde verkoper met 5 jaar ervaring in advies, winkelpresentatie en klantenbinding. Ik haalde gedurende drie kwartalen op rij mijn omzetdoelen en droeg bij aan een hogere gemiddelde bestelwaarde door gerichte productaanbevelingen. Ik werk graag in teams waar service en resultaat hand in hand gaan.",
    why: "Geeft meteen commerciele relevantie zonder overdreven taal.",
  },
  {
    title: "Verpleegkundige",
    text: "Verpleegkundige met 8 jaar ervaring in acute zorg, patientcommunicatie en samenwerking met multidisciplinaire teams. Ik ben sterk in triage, overdracht en rust bewaren in drukke situaties, en hielp de overdrachtskwaliteit verbeteren via een strakkere rapportage-aanpak. Ik zoek een omgeving waar zorgkwaliteit en teamafstemming centraal staan.",
    why: "Werkt goed voor zorgfuncties waar betrouwbaarheid en communicatie tellen.",
  },
  {
    title: "Starter na bacheloropleiding",
    text: "Gemotiveerde starter met stage-ervaring in administratie, rapportage en klantenopvolging. Tijdens mijn stage nam ik zelfstandig plannings- en opvolgtaken op en kreeg ik positieve feedback op mijn nauwkeurigheid en communicatie. Ik zoek een eerste functie waarin ik snel verantwoordelijkheid kan opnemen en blijven bijleren.",
    why: "Geschikt voor starters die nog geen lange werkervaring hebben.",
  },
  {
    title: "Carriereswitch naar data of analyse",
    text: "Resultaatgerichte operations professional met 7 jaar ervaring in procesverbetering en rapportage, in transitie naar data-analyse. Ik bouwde interne dashboards die wekelijks rapportagetijd bespaarden en volgde bijkomende opleiding in Excel, SQL en Power BI. Ik wil mijn domeinkennis nu inzetten in een junior analytische rol.",
    why: "Maakt de overstap geloofwaardig door oude en nieuwe waarde te verbinden.",
  },
];

const belgiumSignals = [
  {
    title: "Houd het compact",
    body: "Belgische recruiters scannen snel. Een profieltekst van 60 tot 90 woorden werkt meestal beter dan een lang introblok.",
  },
  {
    title: "Noem talen alleen als ze relevant zijn",
    body: "In Vlaanderen, Brussel en klantgerichte functies kan talenkennis belangrijk zijn. Vermeld ze in je profiel alleen als ze echt iets toevoegen aan je geschiktheid.",
  },
  {
    title: "Laat functie en richting meteen landen",
    body: "Een recruiter moet in de eerste regel begrijpen wat voor profiel je bent en voor welk type rol je in aanmerking komt.",
  },
];

const sentenceStarters = {
  openings: [
    "Resultaatgerichte [functie] met [x] jaar ervaring in [domein].",
    "Praktisch ingestelde [functie] met focus op [klant/proces/resultaat].",
    "Ervaren [functie] gespecialiseerd in [vaardigheid] en [vaardigheid].",
  ],
  evidence: [
    "Ik verbeterde [KPI] met [x]% door [actie].",
    "Ik verkortte [doorlooptijd] via [aanpak].",
    "Ik ondersteunde [team/proces] en verhoogde [resultaat].",
  ],
  closings: [
    "Ik zoek een rol waarin ik [sterkte] en [sterkte] verder inzet.",
    "Mijn focus ligt op [rol/type organisatie].",
    "Ik wil bijdragen in een context waar [waarde] belangrijk is.",
  ],
};

const mistakes = [
  "Te algemeen: woorden als gemotiveerd of flexibel zonder bewijs.",
  "Te lang: een profieltekst die bijna een brief wordt.",
  "Geen richting: niet duidelijk maken welke rol je zoekt.",
  "Talen opsommen zonder context: noem ze alleen als ze relevant zijn voor de job.",
];

const faqs = [
  {
    question: "Hoe lang moet een profieltekst op een cv in Belgie zijn?",
    answer:
      "Voor de meeste sollicitaties werkt 60 tot 90 woorden het best. Kort genoeg om snel te scannen, maar lang genoeg om functie, sterktes en bewijs te tonen.",
  },
  {
    question: "Moet ik in Belgie talen in mijn profieltekst zetten?",
    answer:
      "Alleen als talenkennis relevant is voor de functie. In Brussel, meertalige klantrollen of internationale omgevingen kan dat sterk helpen. In andere gevallen volstaat het vaak om talen in een aparte sectie te zetten.",
  },
  {
    question: "Wat is het verschil tussen profieltekst en samenvatting?",
    answer:
      "In de praktijk bedoelen mensen meestal hetzelfde: de korte introductie bovenaan je cv die uitlegt wie je bent, wat je meebrengt en welke rol bij je past.",
  },
  {
    question: "Moet ik mijn profieltekst per vacature aanpassen?",
    answer:
      "Ja. Pas functietitel, kernvaardigheden en voorbeelden aan op de vacaturetaal. Dat maakt je cv relevanter voor recruiters en duidelijker voor sollicitatiesoftware.",
  },
];

const profileIntentLinks = [
  {
    href: "/cv-maken-belgie",
    label: "CV maken in Belgie met een profieltekst die bovenaan meteen richting geeft",
    description: "Gebruik je profieltekst als opening van een volledig cv dat rustig en recruiter-safe is opgebouwd.",
  },
  {
    href: "/templates",
    label: "Vergelijk Belgische templates zodra je profieltekst inhoudelijk staat",
    description: "Kies pas daarna de layout die je verhaal ondersteunt in plaats van overschreeuwt.",
  },
  {
    href: "/sollicitatiebrief-belgie",
    label: "Laat je motivatiebrief logisch aansluiten op dezelfde kernboodschap",
    description: "Gebruik dezelfde rolrichting en troeven in brief en cv, zonder ze letterlijk te herhalen.",
  },
  {
    href: "/cv-maken-zonder-abonnement",
    label: "Start gratis en verfijn je profieltekst later per vacature",
    description: "Handig als je eerst een basisversie wilt en daarna vacaturegericht wilt aanscherpen.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Profieltekst CV Voorbeelden Belgie | Voorbeelden per Functie | WerkCV",
  description:
    "Zoek je profieltekst cv voorbeelden voor Belgie? Bekijk sterke voorbeeldteksten per functie, Belgische schrijftips, zinsstarters en veelgemaakte fouten.",
  path: "/profieltekst-cv-voorbeelden",
  keywords: [
    "profieltekst cv voorbeelden belgie",
    "persoonlijk profiel cv voorbeeld belgie",
    "profielschets cv voorbeeld",
    "cv samenvatting voorbeeld belgie",
    "profieltekst cv schrijven",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/profieltekst-cv-voorbeelden",
    "nl-NL": "https://werkcv.nl/profieltekst-cv-voorbeelden",
    "x-default": "https://werkcv.be/profieltekst-cv-voorbeelden",
  },
});

export default function ProfieltekstCvVoorbeeldenPage() {
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
            Open de editor
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
              Belgische cv-intentie
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              Profieltekst cv voorbeelden voor Belgie die echt richting geven
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              Een goede profieltekst op je cv moet in enkele seconden duidelijk maken wie je bent, waar je sterk in bent en voor welk type rol je relevant bent. In Belgie werkt dat het best wanneer je kort schrijft, bewijs geeft en alleen talen of context noemt die echt iets toevoegen.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/editor"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Schrijf je profieltekst in de editor
              </Link>
              <Link
                href="/templates"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Eerst templates bekijken
              </Link>
            </div>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-black">Snelle profielcheck</h2>
            <div className="mt-5 space-y-4">
              {belgiumSignals.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-black text-black">{item.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mb-14 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Schrijfkader</p>
          <h2 className="mt-2 text-3xl font-black text-black">Een profieltekst opbouwen in 4 stappen</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {frameworkSteps.map((step, index) => (
              <div key={step} className="border-2 border-black bg-[#FFF9D9] p-4">
                <p className="text-sm font-black text-black">{index + 1}. {step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Voorbeelden per context</p>
          <h2 className="mt-2 text-3xl font-black text-black">Profieltekst voorbeelden voor Belgische sollicitaties</h2>
          <div className="mt-6 space-y-5">
            {roleExamples.map((example) => (
              <article
                key={example.title}
                className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
              >
                <h3 className="text-lg font-black text-black">{example.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{example.text}</p>
                <p className="mt-3 text-sm font-black text-black">{example.why}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Zinsstarters</p>
            <h2 className="mt-2 text-2xl font-black">Snel bouwen zonder generiek te klinken</h2>
            <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-slate-200">
              <div>
                <p className="font-black text-white">Openingen</p>
                <ul className="mt-2 list-disc pl-5">
                  {sentenceStarters.openings.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-black text-white">Bewijszinnen</p>
                <ul className="mt-2 list-disc pl-5">
                  {sentenceStarters.evidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-black text-white">Afsluitingen</p>
                <ul className="mt-2 list-disc pl-5">
                  {sentenceStarters.closings.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Vermijden</p>
            <h2 className="mt-2 text-2xl font-black text-black">Veelgemaakte fouten</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm font-medium leading-relaxed text-slate-700">
              {mistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
          <SectionIntentLinks links={profileIntentLinks} locale="nl" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
