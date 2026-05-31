import Link from "next/link";
import Footer from "@/components/Footer";
import StudentHoursChecker from "@/components/belgium/StudentHoursChecker";
import { buildDutchMetadata } from "@/lib/page-metadata";

export const metadata = buildDutchMetadata({
  title: "Studentenjob 650 Uren in België — Uitleg + Checker | WerkCV",
  description:
    "Ontdek hoe de 650 uren voor jobstudenten in België werken en check snel hoeveel uren je nog over hebt voor je studentenjob",
  path: "/studentenjob-650-uren",
  keywords: [
    "studentenjob 650 uren",
    "jobstudent uren belgië",
    "student at work 650 uren",
    "studentenjob belgië",
  ],
  languages: {
    "nl-BE": "https://werkcv.be/studentenjob-650-uren",
    "nl-NL": "https://werkcv.nl/",
  },
});

const faqItems = [
  {
    question: "Wat betekent de 650 uren-regel voor jobstudenten?",
    answer:
      "Voor jobstudenten in België geldt een jaarlijkse grens van 650 uren binnen het voordelige studentenstelsel. Daardoor is het belangrijk om je gewerkte uren op te volgen wanneer je verschillende studentenjobs combineert.",
  },
  {
    question: "Is deze checker een officiële teller?",
    answer:
      "Nee. Dit is een snelle indicatie voor planning en sollicitaties. Je officiële stand controleer je via Student at Work.",
  },
  {
    question: "Voor wie is deze pagina vooral nuttig?",
    answer:
      "Voor studenten die een eerste job zoeken, tijdens het jaar bijverdienen of willen inschatten hoeveel ruimte ze nog hebben om op extra studentenjobs te reageren.",
  },
  {
    question: "Waarom past dit bij WerkCV?",
    answer:
      "Wie op zoek is naar een studentenjob heeft meestal meteen ook een cv nodig. Daarom is dit een logische Belgische route naar de cv-builder.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fffef4] text-black">
      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-slate-600">
            Jobstudent België
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            Studentenjob in België: de 650 uren duidelijk uitgelegd
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
            Zoek je een studentenjob in België, dan krijg je vroeg of laat met de 650 uren-grens te maken. Deze pagina helpt je om dat systeem snel te begrijpen, je resterende uren in te schatten en daarna meteen je cv klaar te zetten voor een studentenjob.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/templates"
              className="border-4 border-black bg-yellow-400 px-6 py-4 text-center text-base font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Maak je jobstudent-cv
            </Link>
            <Link
              href="/cv-voorbeeld-belgie"
              className="border-4 border-black bg-white px-6 py-4 text-center text-base font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Bekijk een Belgisch cv-voorbeeld
            </Link>
          </div>
        </div>
      </section>

      <StudentHoursChecker />

      <section className="border-b-4 border-black bg-[#fffef4]">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-black">Wat je als jobstudent echt moet weten</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  In België is de 650 uren-grens relevant omdat veel studenten meerdere korte jobs combineren doorheen het jaar. Daardoor wil je niet alleen weten hoeveel uren je al gewerkt hebt, maar ook of je nog genoeg ruimte hebt om op extra vacatures te reageren.
                </p>
                <p>
                  Voor WerkCV is dat precies de juiste context: je bent niet alleen aan het rekenen, je bent meestal ook actief op zoek naar een volgende studentenjob. Daarom is deze pagina bewust gekoppeld aan een praktische cv-route in plaats van aan abstracte regelgeving alleen.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">Wanneer deze checker het meest nuttig is</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Deze eenvoudige checker is vooral handig wanneer je snel wilt inschatten of je nog ruimte hebt voor vakantiewerk, weekendwerk of een extra job tijdens het academiejaar. Je hoeft daarvoor niet meteen in detail te plannen; een snelle indicatie helpt al om slimmer te solliciteren.
                </p>
                <p>
                  Zit je dicht bij de limiet, dan is het verstandig om je officiële teller na te kijken. Maar als je nog ruim onder de grens zit, kun je meteen verder met het praktische deel: een kort, rustig en duidelijk cv voor je studentenjob.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">Van urencheck naar sollicitatie</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                <p>
                  Studenten lopen zelden vast op motivatie alleen. Meestal ontbreekt vooral een cv dat snel genoeg af is om op een vacature te reageren. Met WerkCV kun je dat oplossen zonder een uitgebreid traject: kies een template, vul school, studentenjobs, projecten en vaardigheden in en download pas wanneer je tevreden bent.
                </p>
                <p>
                  Solliciteer je voor retail, horeca, administratie of een eerste studentenjob zonder veel ervaring, dan is een helder cv vaak belangrijker dan een druk design. Daarom past deze route goed bij de Belgische jobstudentenmarkt.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black">Veelgestelde vragen</h2>
              <div className="mt-4 space-y-4">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group border-4 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-left text-base font-black text-black">
                      <span className="pr-4">{item.question}</span>
                      <span className="text-xl transition-transform group-open:rotate-45">+</span>
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
              Volgende stap
            </p>
            <p className="mt-4 text-lg font-black">
              Heb je nog uren over? Zet dan meteen je jobstudent-cv klaar.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Werk online aan je cv, vergelijk templates en betaal pas als je de pdf wilt downloaden.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/templates"
                className="border-4 border-black bg-yellow-400 px-4 py-3 text-center text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Start je cv
              </Link>
              <Link
                href="/cv-maken-gratis"
                className="border-4 border-black bg-white px-4 py-3 text-center text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Hoe gratis starten werkt
              </Link>
            </div>
            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                Gerelateerde pagina&apos;s
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/cv-maken-belgie" className="font-bold underline decoration-2 underline-offset-4">
                  CV maken in België
                </Link>
                <Link href="/cv-voorbeeld-belgie" className="font-bold underline decoration-2 underline-offset-4">
                  CV voorbeeld België
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
