import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import HolidayPayBelgiumChecker from "@/components/belgium/HolidayPayBelgiumChecker";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { buildDutchMetadata } from "@/lib/page-metadata";

const faqItems = [
  {
    question: "Voor wie is deze vakantiegeld checker bedoeld?",
    answer:
      "Voor bedienden in de Belgische privésector met een vast maandloon. Voor arbeiders, variabel loon, interim, vertrekvakantiegeld of publieke sector is deze vereenvoudigde berekening niet geschikt.",
  },
  {
    question: "Wat is het verschil tussen enkel en dubbel vakantiegeld?",
    answer:
      "Enkel vakantiegeld is je gewone loon tijdens je wettelijke vakantiedagen. Dubbel vakantiegeld is de extra toeslag boven op dat normale loon.",
  },
  {
    question: "Waarom tonen jullie geen netto vakantiegeld?",
    answer:
      "Omdat fiscale en sociale inhoudingen op vakantiegeld in België te sterk afhangen van je persoonlijke en payrollsituatie. Een ruwe netto-indicatie zou hier sneller misleiden dan helpen.",
  },
  {
    question: "Hoe wordt dubbel vakantiegeld voor bedienden berekend?",
    answer:
      "Voor bedienden in de privésector komt het dubbel vakantiegeld neer op 1/12 van 92% van het brutoloon van de maand waarin de hoofdvakantie wordt genomen, per opgebouwde of gelijkgestelde maand in het vakantiedienstjaar.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Vakantiegeld Berekenen België | Bedienden in de Privésector | WerkCV",
  description:
    "Bereken je dubbel vakantiegeld in België als bediende met een vast maandloon. Duidelijke scope, officiële context en zonder misleidende netto-schatting.",
  path: "/vakantiegeld-berekenen-belgie",
  keywords: [
    "vakantiegeld berekenen belgie",
    "dubbel vakantiegeld bediende berekenen",
    "vakantiegeld bediende belgie",
    "hoeveel vakantiegeld belgie",
    "vakantiedagen berekenen belgie bediende",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/vakantiegeld-berekenen-belgie",
    "x-default": "https://werkcv.be/vakantiegeld-berekenen-belgie",
  },
});

export default function VakantiegeldBerekenenBelgiePage() {
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
                  Privésector
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl">
                Vakantiegeld berekenen in België, zonder te doen alsof één formule voor iedereen klopt
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
                Belgische zoekers krijgen vaak een snelle rekensom zonder
                onderscheid tussen bedienden, arbeiders, variabel loon,
                aanvullende vakantie of vertrekvakantiegeld. Deze pagina kiest
                bewust voor een smallere maar betrouwbaardere route:{" "}
                <span className="font-black text-black">
                  dubbel vakantiegeld voor bedienden in de privésector met een
                  vast maandloon
                </span>
                .
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/editor"
                  className="border-4 border-black bg-yellow-400 px-6 py-4 text-center text-base font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Start je cv
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
                  <span className="font-black text-black">Wel:</span> een
                  duidelijke schatting voor bedienden met een vast maandloon.
                </p>
                <p>
                  <span className="font-black text-black">Niet:</span> een
                  generieke “Belgische” calculator voor alle statuten.
                </p>
                <p>
                  <span className="font-black text-black">Bronbasis:</span>{" "}
                  actuele officiële uitleg van Sociale Zekerheid en RJV,
                  geraadpleegd op 2 juni 2026.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <HolidayPayBelgiumChecker />

      <section className="border-b-4 border-black bg-[#fffef4]">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-black">
                Waarom deze Belgische versie niet op de Nederlandse tool lijkt
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  In Nederland werkt een brede vakantiegeldcalculator vaak met
                  één basisregel rond 8 procent. In België is dat te grof. De
                  berekening hangt onder meer af van je statuut, je loonvorm,
                  het vakantiedienstjaar en situaties zoals aanvullende
                  vakantie, uitdiensttreding of een wijziging van arbeidsduur.
                </p>
                <p>
                  Daarom houdt WerkCV.be deze pagina bewust kleiner en
                  specifieker. Niet omdat we minder willen tonen, maar omdat
                  vertrouwen belangrijker is dan een brede tool met twijfelachtige
                  uitkomsten.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                De regel waarop deze berekening steunt
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Voor bedienden in de privésector maakt de officiële uitleg een
                  onderscheid tussen enkel en dubbel vakantiegeld. Het{" "}
                  <span className="font-black text-black">enkel vakantiegeld</span>{" "}
                  is het normale loon dat doorloopt tijdens je wettelijke
                  vakantiedagen. Het{" "}
                  <span className="font-black text-black">dubbel vakantiegeld</span>{" "}
                  is de extra toeslag.
                </p>
                <p>
                  Volgens de portaalsite van de Sociale Zekerheid komt dat
                  dubbel vakantiegeld overeen met{" "}
                  <span className="font-black text-black">
                    1/12 van 92% van het brutoloon van de maand waarin je je
                    hoofdvakantie neemt
                  </span>
                  , per opgebouwde of gelijkgestelde maand in het
                  vakantiedienstjaar.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Wanneer je beter naar officiële kanalen gaat
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Gebruik deze pagina niet als je arbeider bent, vooral met
                  variabel loon werkt, in de publieke sector zit, via interim
                  werkt of met vertrekvakantiegeld te maken hebt. In die
                  gevallen is de berekening te contextafhankelijk.
                </p>
                <p>
                  Voor arbeiders en andere sectorale situaties is{" "}
                  <a
                    href="https://www.rjv.fgov.be/nl/heb-ik-recht-op-vakantiegeld"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-black underline decoration-2 underline-offset-4"
                  >
                    de RJV
                  </a>{" "}
                  het juiste vertrekpunt. Voor bedienden met uitzonderingen of
                  complexe dossiers is je werkgever of payrollpartner meestal
                  leidend.
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
                href="https://www.socialsecurity.be/citizen/nl/verlof-tijdskrediet-en-loopbaanonderbreking/jaarlijkse-vakantie"
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-black bg-yellow-400 px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Sociale Zekerheid
              </a>
              <a
                href="https://www.rjv.fgov.be/nl/heb-ik-recht-op-vakantiegeld"
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-black bg-white px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                RJV vakantiegeld
              </a>
            </div>

            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                Gerelateerde pagina&apos;s
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/cv-maken-belgie"
                  className="font-bold underline decoration-2 underline-offset-4"
                >
                  CV maken in België
                </Link>
                <Link
                  href="/vakbonden-en-cv-belgie"
                  className="font-bold underline decoration-2 underline-offset-4"
                >
                  Werkzoekenden België
                </Link>
                <Link
                  href="/cv-maken-zonder-abonnement"
                  className="font-bold underline decoration-2 underline-offset-4"
                >
                  CV zonder abonnement
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
