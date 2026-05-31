import Link from "next/link";
import { cvDownloadPrice } from "@/lib/site-content";

type MoneyPageTrustBlockProps = {
  title?: string;
  intro?: string;
};

const trustItems = [
  {
    title: "Gratis bouwen",
    body: "Vul je cv eerst volledig in, vergelijk templates en betaal pas als je de PDF wilt downloaden.",
  },
  {
    title: `Eenmalig ${cvDownloadPrice.display}`,
    body: "Geen proefperiode, automatische verlenging of maandelijkse kosten voor individuele cv-downloads.",
  },
  {
    title: "Recruiter-proof output",
    body: "Rustige Nederlandse templates, duidelijke secties en ATS-vriendelijke PDF-export.",
  },
];

export default function MoneyPageTrustBlock({
  title = "Waarom mensen voor WerkCV kiezen",
  intro = "De meeste bezoekers willen niet meer uitleg, maar zekerheid: kan ik eerst serieus bouwen, wanneer betaal ik, en krijg ik een nette PDF zonder abonnement?",
}: MoneyPageTrustBlockProps) {
  return (
    <section className="mb-14 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
        Vertrouwen voor je start
      </p>
      <h2 className="mt-2 text-3xl font-black text-black">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
        {intro}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {trustItems.map((item) => (
          <article key={item.title} className="border-2 border-black bg-[#FFFEF0] p-5">
            <h3 className="text-lg font-black text-black">{item.title}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
              {item.body}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/editor"
          className="inline-flex border-4 border-black bg-yellow-400 px-5 py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Maak gratis je cv
        </Link>
        <Link
          href="/prijzen"
          className="inline-flex border-4 border-black bg-white px-5 py-3 text-sm font-black text-black"
        >
          Bekijk prijsmodel
        </Link>
      </div>
    </section>
  );
}
