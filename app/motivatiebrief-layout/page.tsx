import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SectionIntentLinks from "@/components/seo/SectionIntentLinks";
import { buildDutchMetadata } from "@/lib/page-metadata";

const layoutRules = [
  {
    title: "1) Hou je brief op 1 A4",
    body: "Ook in Belgie werkt een korte motivatiebrief beter dan een lange tekstmuur. Een compacte brief leest sneller en dwingt je tot relevantie.",
  },
  {
    title: "2) Gebruik een rustig lettertype",
    body: "Arial, Calibri of Verdana blijven veilige keuzes. Ze lezen goed op scherm en in pdf, en sluiten aan op de nuchtere toon die veel Belgische recruiters verwachten.",
  },
  {
    title: "3) Werk met korte alineas en witruimte",
    body: "Hou alineas beperkt tot enkele regels. VDAB benadrukt ook overzicht en witruimte, zodat je brief makkelijk scanbaar blijft.",
  },
  {
    title: "4) Zorg voor een duidelijke onderwerpregel en aanspreking",
    body: "Maak meteen duidelijk voor welke functie je solliciteert. Staat er een contactpersoon in de vacature, spreek die dan rechtstreeks aan.",
  },
  {
    title: "5) Verstuur cv en brief als pdf",
    body: "VDAB raadt aan geen Word-bestanden te sturen omdat opmaak kan verschuiven. Een pdf houdt je brief stabiel.",
  },
];

const structureBlocks = [
  {
    title: "Kop en contactgegevens",
    body: "Zet bovenaan je naam, telefoonnummer en e-mailadres. Voeg de gegevens van het bedrijf toe als dat past bij de sollicitatieflow of de formele toon van de werkgever.",
  },
  {
    title: "Onderwerp en aanspreking",
    body: "Noem de functie in het onderwerp. Bij een gekende contactpersoon werkt een rechtstreekse aanspreking beter. Is er geen naam, dan is een neutrale opening zoals Beste of Geachte een veilige keuze, afhankelijk van de toon van de vacature.",
  },
  {
    title: "Inleiding",
    body: "Open met de functie, waarom die rol je aanspreekt en waarom jouw profiel relevant is. Vermijd een algemene openingszin die op elke vacature past.",
  },
  {
    title: "Motivatie en troeven",
    body: "Leg uit waarom je bij dit bedrijf wilt werken en waarom ze jou moeten uitnodigen. Gebruik 1 of 2 concrete voorbeelden, geen losse adjectieven.",
  },
  {
    title: "Afsluiting",
    body: "Sluit zakelijk en vriendelijk af. Bedank voor de tijd, toon beschikbaarheid voor gesprek en hou de laatste alinea kort.",
  },
];

const belgiumNotes = [
  {
    title: "Vlaanderen",
    body: "Voor veel functies blijft een motivatiebrief een normale aanvulling op je cv, zeker in administratie, zorg, onderwijs en publieke of semipublieke contexten.",
  },
  {
    title: "Brussel",
    body: "Controleer altijd de taal van de vacature. In internationale of Europese omgevingen is Engels soms logisch, maar in lokale Nederlandstalige of Franstalige vacatures werkt de vacaturetaal meestal beter.",
  },
  {
    title: "Opmaak",
    body: "Belgische recruiters waarderen meestal rust en duidelijkheid boven creatieve layout. Laat je brief dus professioneel aansluiten op je cv in plaats van er visueel van af te wijken.",
  },
];

const wrongVsRight = [
  {
    wrong: "Een brief zonder witruimte of duidelijke blokken.",
    right: "Vier korte alineas met een logische opbouw en genoeg ademruimte.",
  },
  {
    wrong: "Te veel verschillende stijlen of kleuraccenten.",
    right: "Een rustige layout met subtiele nadruk en een duidelijk lettertype.",
  },
  {
    wrong: "Je cv en brief apart vormgeven alsof ze niet bij elkaar horen.",
    right: "Laat typografie, toon en netheid op elkaar aansluiten.",
  },
  {
    wrong: "Word-bestanden meesturen met risico op verschoven opmaak.",
    right: "Pdf versturen zodat je layout blijft zoals jij ze bedoeld hebt.",
  },
];

const intentLinks = [
  {
    href: "/sollicitatiebrief-belgie",
    label: "Lees eerst hoe motivatiebrieven in Belgie meestal worden beoordeeld",
    description: "Gebruik daarna deze layoutregels om die inhoud netjes en geloofwaardig te presenteren.",
  },
  {
    href: "/motivatiebrief-voorbeeld",
    label: "Bekijk Belgische voorbeeldblokken voor je motivatiebrief",
    description: "Handig als je naast opmaak ook voorbeeldzinnen en structuur zoekt.",
  },
  {
    href: "/sollicitatiebrief-in-engels",
    label: "Controleer wanneer een Engelse brief in Belgie logisch is",
    description: "Voor Brussel en internationale werkgevers kan taalkeuze een even groot verschil maken als layout.",
  },
  {
    href: "/cv-maken-belgie",
    label: "Zorg dat je cv en motivatiebrief als een geheel werken",
    description: "Een goede brief wint aan kracht wanneer je cv dezelfde rust, structuur en relevantie uitstraalt.",
  },
];

const faqs = [
  {
    question: "Hoe lang mag een motivatiebrief in Belgie zijn?",
    answer:
      "Voor de meeste sollicitaties volstaat 1 A4. Een korte, duidelijke brief werkt beter dan een lange tekst vol algemene motivatie.",
  },
  {
    question: "Welk lettertype gebruik je best?",
    answer:
      "Rustige lettertypes zoals Arial, Calibri of Verdana zijn veilige keuzes. Het belangrijkste is leesbaarheid, geen opvallende vormgeving.",
  },
  {
    question: "Moet ik mijn motivatiebrief als pdf versturen?",
    answer:
      "Ja. Dat houdt je opmaak stabiel. VDAB raadt ook aan om geen Word-bestanden te versturen omdat die kunnen vervormen bij de ontvanger.",
  },
  {
    question: "Moet mijn motivatiebrief dezelfde stijl hebben als mijn cv?",
    answer:
      "Ja. Ze hoeven niet identiek te zijn, maar een vergelijkbare typografie en rustige opmaak maken je sollicitatie professioneler.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Motivatiebrief Layout Belgie | Opmaak en Structuur | WerkCV",
  description:
    "Zoek je een goede motivatiebrief layout voor Belgie? Bekijk opmaakregels, structuur per briefblok, pdf-tips en Belgische aandachtspunten.",
  path: "/motivatiebrief-layout",
  keywords: [
    "motivatiebrief layout belgie",
    "motivatiebrief opmaak belgie",
    "sollicitatiebrief opmaak belgie",
    "motivatiebrief structuur",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/motivatiebrief-layout",
    "nl-NL": "https://werkcv.nl/motivatiebrief-layout",
    "x-default": "https://werkcv.be/motivatiebrief-layout",
  },
});

export default function MotivatiebriefLayoutPage() {
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
            Maak eerst je cv
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
              Belgische briefopmaak
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              Motivatiebrief layout die in Belgie professioneel en rustig overkomt
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              Een goede motivatiebrief layout draait niet om design, maar om leesbaarheid. In Belgie werken een heldere opbouw, korte alineas, een zakelijke onderwerpregel en een stabiele pdf meestal beter dan creatieve vormgeving.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/motivatiebrief-voorbeeld"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Bekijk voorbeeldbrief
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
            <h2 className="text-xl font-black text-black">Snelle layout-check</h2>
            <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-slate-700">
              <li><strong className="text-black">Lengte:</strong> maximaal 1 A4.</li>
              <li><strong className="text-black">Lettertype:</strong> Arial, Calibri of Verdana.</li>
              <li><strong className="text-black">Structuur:</strong> duidelijke onderwerpregel, aanspreking en korte alineas.</li>
              <li><strong className="text-black">Bestand:</strong> verstuur je brief als pdf.</li>
            </ul>
          </aside>
        </section>

        <section className="mb-14 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Basisregels</p>
          <h2 className="mt-2 text-3xl font-black text-black">Wat een goede briefopmaak in de praktijk betekent</h2>
          <div className="mt-6 space-y-4">
            {layoutRules.map((rule) => (
              <article key={rule.title} className="border-2 border-black bg-[#FFF9D9] p-4">
                <h3 className="text-base font-black text-black">{rule.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{rule.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="border-4 border-black bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Opbouw</p>
            <h2 className="mt-2 text-2xl font-black text-black">Welke blokken moeten op de pagina staan?</h2>
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
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Belgische context</p>
            <h2 className="mt-2 text-2xl font-black">Waar je rekening mee houdt per regio of werkgever</h2>
            <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-slate-200">
              {belgiumNotes.map((note) => (
                <div key={note.title}>
                  <p className="font-black text-white">{note.title}</p>
                  <p className="mt-1">{note.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14 border-4 border-black bg-white p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Fout versus goed</p>
          <h2 className="mt-2 text-3xl font-black text-black">Zo voorkom je een rommelige indruk</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {wrongVsRight.map((item) => (
              <article key={item.wrong} className="border-2 border-black bg-[#FFFEF0] p-4">
                <p className="text-sm font-black text-black">Niet doen</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.wrong}</p>
                <p className="mt-3 text-sm font-black text-black">Beter</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.right}</p>
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
