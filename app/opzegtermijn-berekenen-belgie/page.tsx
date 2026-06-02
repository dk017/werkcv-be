import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import NoticePeriodBelgiumChecker from "@/components/belgium/NoticePeriodBelgiumChecker";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { buildDutchMetadata } from "@/lib/page-metadata";

const faqItems = [
  {
    question: "Voor welke Belgische situaties werkt deze opzegtermijn checker wel?",
    answer:
      "Voor contracten van onbepaalde duur waarbij een werknemer zelf opzegt, en voor ontslag door de werkgever bij vaste contracten die op of na 1 januari 2014 zijn gestart.",
  },
  {
    question: "Waarom berekent deze pagina geen pre-2014 ontslag door de werkgever?",
    answer:
      "Omdat daar legacy-regels, mogelijke bedingclausules en historische verschillen tussen regimes meespelen. Een simpele publieke berekening zou daar te snel fout of te stellig worden.",
  },
  {
    question: "Berekenen jullie ook de exacte einddatum van mijn contract?",
    answer:
      "Nee. Deze tool schat de duur van de opzegtermijn in weken. De exacte einddatum hangt ook af van de kennisgeving, posttermijnen en het moment waarop de termijn begint te lopen.",
  },
  {
    question: "Waarom ondersteunen jullie vaste contracten van bepaalde duur niet?",
    answer:
      "Omdat tussentijdse opzeg bij bepaalde-duurcontracten en de eerste helft van het contract aparte Belgische regels volgen. Daarvoor is een versimpelde publieke checker te grof.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Opzegtermijn Berekenen België | Voorzichtige Checker | WerkCV",
  description:
    "Bereken je opzegtermijn in België voor de routes die publiek en zorgvuldig te ondersteunen zijn: werknemer die zelf opzegt en werkgever die ontslaat bij vaste contracten vanaf 2014.",
  path: "/opzegtermijn-berekenen-belgie",
  keywords: [
    "opzegtermijn berekenen belgie",
    "ontslag opzegtermijn belgie",
    "opzegging werknemer belgie",
    "opzegging werkgever belgie",
    "opzegtermijn contract onbepaalde duur belgie",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/opzegtermijn-berekenen-belgie",
    "x-default": "https://werkcv.be/opzegtermijn-berekenen-belgie",
  },
});

export default function OpzegtermijnBerekenenBelgiePage() {
  return (
    <main className="min-h-screen bg-[#fffef4] text-black">
      <FAQJsonLd questions={faqItems} />

      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="border-2 border-black bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-black">
                  België
                </span>
                <span className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
                  Bijgewerkt 2 juni 2026
                </span>
                <span className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
                  Arbeidsovereenkomst
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl">
                Opzegtermijn berekenen in België, met duidelijke grenzen in plaats van vaag gokwerk
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
                Belgische opzegtermijnen zijn snel complex als je oude contracten,
                bepaalde duur of historische uitzonderingen op één hoop gooit.
                Daarom rekent deze pagina alleen de routes uit die we publiek,
                eerlijk en actueel kunnen ondersteunen.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/templates"
                  className="border-4 border-black bg-yellow-400 px-6 py-4 text-center text-base font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Start je volgende cv
                </Link>
                <Link
                  href="/cv-maken-zonder-abonnement"
                  className="border-4 border-black bg-white px-6 py-4 text-center text-base font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Bekijk de cv-builder
                </Link>
              </div>
            </div>

            <aside className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
                Wat deze pagina doet
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                <p>
                  <span className="font-black text-black">Wel:</span> werknemer die zelf opzegt en werkgever die ontslaat bij vaste contracten vanaf 1 januari 2014.
                </p>
                <p>
                  <span className="font-black text-black">Niet:</span> bepaalde duur, legacy-contracten voor werkgeversontslag, sectorclausules of exacte kalenderdata.
                </p>
                <p>
                  <span className="font-black text-black">Bronbasis:</span>{" "}
                  actuele uitleg van Belgium.be en FOD Werk, geraadpleegd op 2 juni 2026.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <NoticePeriodBelgiumChecker />

      <section className="border-b-4 border-black bg-[#fffef4]">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-black">
                Waarom deze Belgische versie bewust smaller is dan een standaard NL-tool
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Een Nederlandse opzegtermijn-tool kan vaak met een paar simpele
                  dienstjaren-trappen werken. In België hangt de uitkomst veel
                  sneller af van wie de opzeg geeft, van welk contract je vertrekt
                  en of je in een legacy-situatie zit.
                </p>
                <p>
                  Daarom is deze pagina geen kopie van de NL-route. We rekenen
                  niet breed en vaag, maar smal en verdedigbaar. Dat is beter
                  voor vertrouwen, ook als het betekent dat sommige gevallen
                  bewust worden doorverwezen.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Wat deze checker vandaag wel ondersteunt
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Voor werknemers die zelf ontslag nemen, gebruikt de checker de
                  uniforme Belgische tabel die sinds 28 oktober 2023 geldt. Daar
                  bouwt de termijn op tot maximaal 13 weken.
                </p>
                <p>
                  Voor ontslag door de werkgever ondersteunt de checker vaste
                  contracten die op of na 1 januari 2014 zijn gestart. Daar volgt
                  de tool de officiële opbouw in weken op basis van je anciënniteit.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Waarom we bij sommige Belgische gevallen bewust stoppen
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Pre-2014 ontslag door de werkgever kan legacy-regels,
                  mogelijke bedingclausules en historische verschillen tussen
                  regimes bevatten. Een publieke calculator die daar toch een
                  hard antwoord op plakt, voelt misschien handig maar is te vaak
                  te stellig.
                </p>
                <p>
                  Hetzelfde geldt voor contracten van bepaalde duur. Daar spelen
                  regels rond tussentijdse opzeg en de eerste helft van het
                  contract mee. Die nuance hoort niet verstopt te worden achter
                  één simplistische outputkaart.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Duur in weken is niet hetzelfde als je exacte einddatum
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Deze tool rekent de duur van de opzegtermijn. De exacte
                  kalenderdatum blijft apart, omdat ook de kennisgeving telt:
                  wanneer de opzeg wordt meegedeeld, via welke route dat gebeurt
                  en vanaf wanneer de termijn begint te lopen.
                </p>
                <p>
                  Voor veel bezoekers is dat onderscheid belangrijk. Je wilt eerst
                  weten of je over 3 weken of 30 weken spreekt. Pas daarna is het
                  zinvol om de precieze einddatum juridisch te bevestigen.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Veelgestelde vragen
              </h2>
              <div className="mt-4 space-y-4">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group border-4 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-left text-base font-black text-black">
                      <span className="pr-4">{item.question}</span>
                      <span className="text-xl transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t-2 border-black px-5 pb-5 pt-4 text-sm font-medium leading-relaxed text-slate-700">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
              Officiële routes
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="https://www.belgium.be/nl/werk/arbeidscontract/opzegging_en_ontslag/ontslag"
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-black bg-yellow-400 px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Belgium.be over ontslag
              </a>
              <a
                href="https://werk.belgie.be/nl/news/regels-inzake-vaststelling-van-de-opzeggingstermijn-vanaf-28-oktober-2023"
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-black bg-white px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                FOD Werk: opzegtermijnregels
              </a>
            </div>

            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                Volgende stap
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Als je een jobwissel plant, wil je meestal niet alleen je opzegtermijn kennen. Je wilt ook je cv klaarzetten voor de volgende sollicitatie.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/templates"
                  className="border-4 border-black bg-yellow-400 px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Start je cv
                </Link>
                <Link
                  href="/cv-maken-eenmalig-betalen"
                  className="border-4 border-black bg-white px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Bekijk éénmalig betalen
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                Gerelateerde pagina&apos;s
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/vakantiegeld-berekenen-belgie" className="font-bold underline decoration-2 underline-offset-4">
                  Vakantiegeld België
                </Link>
                <Link href="/vakantiedagen-berekenen-belgie" className="font-bold underline decoration-2 underline-offset-4">
                  Vakantiedagen België
                </Link>
                <Link href="/sollicitatiebrief-belgie" className="font-bold underline decoration-2 underline-offset-4">
                  Sollicitatiebrief België
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}

