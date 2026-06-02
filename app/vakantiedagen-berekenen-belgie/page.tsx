import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import VacationDaysBelgiumChecker from "@/components/belgium/VacationDaysBelgiumChecker";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { buildDutchMetadata } from "@/lib/page-metadata";

const faqItems = [
  {
    question: "Voor wie is deze Belgische vakantiedagen checker bedoeld?",
    answer:
      "Voor bedienden in de Belgische privésector die hun gewone wettelijke vakantie willen inschatten en eventueel willen zien of aanvullende vakantie dit jaar relevant kan zijn.",
  },
  {
    question: "Waarom rekenen jullie met het huidige arbeidsstelsel?",
    answer:
      "Omdat Belgische vakantie maximaal vier weken bedraagt in het arbeidsstelsel dat geldt op het moment dat je je vakantiedagen opneemt. Daarom vraagt deze pagina naar je huidige aantal werkdagen per week.",
  },
  {
    question: "Wanneer komt aanvullende vakantie in beeld?",
    answer:
      "Aanvullende vakantie kan relevant worden als je dit jaar een activiteit start, hervat of je arbeidsregime verhoogt. Er geldt eerst een aanloopperiode van 3 maanden of 90 kalenderdagen en je gewone vakantiedagen moeten opgebruikt zijn.",
  },
  {
    question: "Zitten sectorale extra verlofdagen in deze tool?",
    answer:
      "Nee. Deze tool focust op gewone wettelijke vakantie en een voorzichtige planning van aanvullende vakantie. Extra sectorale of ondernemingsgebonden verlofdagen kunnen apart gelden.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: "Vakantiedagen Berekenen België | Gewone en Aanvullende Vakantie | WerkCV",
  description:
    "Bereken je gewone vakantiedagen in België en zie of aanvullende vakantie dit jaar relevant kan zijn. Duidelijke scope voor bedienden in de privésector.",
  path: "/vakantiedagen-berekenen-belgie",
  keywords: [
    "vakantiedagen berekenen belgie",
    "gewone vakantie bediende belgie",
    "aanvullende vakantie berekenen belgie",
    "hoeveel vakantiedagen belgie",
    "4 weken vakantie belgie",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/vakantiedagen-berekenen-belgie",
    "x-default": "https://werkcv.be/vakantiedagen-berekenen-belgie",
  },
});

export default function VakantiedagenBerekenenBelgiePage() {
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
                Vakantiedagen berekenen in België, met gewone en aanvullende vakantie uit elkaar gehouden
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
                In België is “hoeveel vakantiedagen heb ik?” zelden een simpele teller.
                Je gewone vakantie hangt af van je prestaties in het vorige jaar,
                terwijl aanvullende vakantie pas speelt als je dit jaar startte,
                hervatte of je regime verhoogde. Daarom toont deze pagina beide
                lagen apart in plaats van alles op één hoop te gooien.
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
                  <span className="font-black text-black">Wel:</span> gewone wettelijke vakantie ramen en aanvullende vakantie zorgvuldig signaleren.
                </p>
                <p>
                  <span className="font-black text-black">Niet:</span> sectorale extra dagen, ambtenarenregimes of een volledige loonbrief simuleren.
                </p>
                <p>
                  <span className="font-black text-black">Bronbasis:</span>{" "}
                  actuele uitleg van Sociale Zekerheid, Belgium.be en RJV,
                  geraadpleegd op 2 juni 2026.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <VacationDaysBelgiumChecker />

      <section className="border-b-4 border-black bg-[#fffef4]">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-black">
                Waarom deze Belgische versie niet op de Nederlandse tool lijkt
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  De Nederlandse route draait vaak om vakantie-uren op basis van
                  contracturen. In België werkt de logica anders: gewone vakantie
                  vertrekt uit het vakantiedienstjaar en aanvullende vakantie komt
                  pas later in beeld als apart recht. Daarom zou een simpele kopie
                  van de NL-tool hier inhoudelijk fout zijn.
                </p>
                <p>
                  Deze BE-pagina kiest daarom voor twee duidelijke vragen: wat levert
                  vorig jaar je aan gewone vakantie op, en geeft dit jaar eventueel
                  ruimte voor aanvullende vakantie? Die structuur is trager om te
                  bouwen, maar veel eerlijker voor de bezoeker.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                De gewone regel: maximaal 4 weken in je huidige regime
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Volgens het Belgische socialezekerheidsportaal heeft een bediende
                  recht op maximaal 4 weken vakantie per jaar in het arbeidsstelsel
                  dat geldt op het moment waarop de vakantiedagen worden opgenomen.
                  Daarom kan dezelfde werknemer in een ander regime op een ander
                  aantal dagen uitkomen, terwijl de logica van 4 weken gelijk blijft.
                </p>
                <p>
                  Voor gewone vakantie kijkt de werkgever naar de prestaties van het
                  vakantiedienstjaar, dus het kalenderjaar dat voorafgaat aan het
                  jaar waarin je je vakantie neemt. Dat is precies waarom deze
                  checker naar vorig jaar vraagt in plaats van alleen naar je huidige
                  contract.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                De aanvullende regel: eerst 90 dagen, daarna pas extra ruimte
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Aanvullende vakantie is geen algemene bonus. Ze is bedoeld voor
                  wie dit jaar een activiteit start, hervat of zijn arbeidsregime
                  verhoogt en daardoor nog geen volledige gewone vakantie heeft.
                  Daarvoor geldt eerst een aanloopperiode van 3 maanden of 90
                  kalenderdagen.
                </p>
                <p>
                  De aanvullende vakantie blijft bovendien een recht en geen
                  verplichting. Ze kan pas worden opgenomen nadat de gewone
                  vakantiedagen opgebruikt zijn. Daarom toont de checker de
                  aanvullende teller apart en niet als automatisch vrij saldo.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Wanneer je beter naar de officiële route gaat
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Gebruik deze pagina niet als je arbeider bent, in de publieke
                  sector werkt of vooral sectorale extra verlofdagen wilt kennen.
                  Daarvoor spelen vakantiefondsen, cao&apos;s of werkgever-specifieke
                  regels mee die deze publieke checker bewust niet probeert te
                  raden.
                </p>
                <p>
                  Voor de echte berekening of bevestiging zijn{" "}
                  <a
                    href="https://www.socialsecurity.be/citizen/nl/verlof-tijdskrediet-en-loopbaanonderbreking/jaarlijkse-vakantie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-black underline decoration-2 underline-offset-4"
                  >
                    Sociale Zekerheid
                  </a>{" "}
                  en{" "}
                  <a
                    href="https://www.rjv.fgov.be/nl/herbeginnen-of-aanvullende-vakantie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-black underline decoration-2 underline-offset-4"
                  >
                    de RJV
                  </a>{" "}
                  de juiste eindpunten.
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
                href="https://www.rjv.fgov.be/nl/herbeginnen-of-aanvullende-vakantie"
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-black bg-white px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                RJV aanvullende vakantie
              </a>
            </div>

            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                Gerelateerde pagina&apos;s
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/vakantiegeld-berekenen-belgie"
                  className="font-bold underline decoration-2 underline-offset-4"
                >
                  Vakantiegeld berekenen België
                </Link>
                <Link
                  href="/cv-maken-belgie"
                  className="font-bold underline decoration-2 underline-offset-4"
                >
                  CV maken in België
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
