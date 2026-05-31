import Link from "next/link";
import TrackedLandingLink from "@/components/analytics/TrackedLandingLink";
import { cvDownloadPrice } from "@/lib/site-content";

export type OptimizerFaqItem = {
  question: string;
  answer: string;
};

export type OptimizerLinkCard = {
  href: string;
  title: string;
  body: string;
};

export function CvCheckStartBlock({
  buttonHref,
  trackingLocation,
  ctaEventName,
}: {
  buttonHref: string;
  trackingLocation: string;
  ctaEventName?: "cta_cv_optimaliseren_hero" | "cta_cv_verbeteren_hero" | "cta_cv_checken_hero" | "cta_cv_nakijken_hero";
}) {
  return (
    <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
        Gratis cv-check starten
      </p>
      <h2 className="mt-2 text-3xl font-black text-black">Gratis cv-check starten</h2>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {[
          "Plak je cv-tekst",
          "Voeg eventueel een vacature toe",
          "Bekijk verbeterpunten",
          "Maak direct een betere cv-versie",
        ].map((step, index) => (
          <li
            key={step}
            className="flex items-start gap-3 border-2 border-black bg-[#E9FFFC] p-4 text-sm font-medium leading-relaxed text-slate-700"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black bg-white text-xs font-black text-black">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <TrackedLandingLink
          href={buttonHref}
          trackingLocation={trackingLocation}
          trackingLabel="Start gratis cv-check"
          ctaEventName={ctaEventName}
          className="inline-block border-4 border-black bg-[#4ECDC4] px-5 py-3 text-base font-black text-black"
        >
          Start gratis cv-check
        </TrackedLandingLink>
        <p className="text-sm font-medium leading-relaxed text-slate-700">
          Geen abonnement. Betaal alleen als je later een PDF downloadt.
        </p>
      </div>
    </section>
  );
}

const whyWerkCvBullets = {
  nl: [
    "Gebouwd voor de Nederlandse arbeidsmarkt",
    "ATS-vriendelijke templates zonder overbodige opmaak",
    "Gratis starten, pas betalen bij PDF-download",
    "Geen abonnement of automatische verlenging",
    `Eén duidelijke prijs: ${cvDownloadPrice.display}`,
  ],
  en: [
    "Built for the Dutch job market",
    "ATS-friendly templates without unnecessary design noise",
    "Start free, pay only at PDF download",
    "No subscription or auto-renewal",
    `One clear price: ${cvDownloadPrice.display}`,
  ],
} as const;

export function WhyWerkCvSection({ locale = "nl" }: { locale?: "nl" | "en" }) {
  const title = locale === "en" ? "Why WerkCV?" : "Waarom WerkCV?";
  const bullets = whyWerkCvBullets[locale];

  return (
    <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
        {title}
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-5 text-sm font-medium leading-relaxed text-slate-700 marker:text-black">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}

export function LinkCardSection({
  eyebrow,
  title,
  links,
}: {
  eyebrow: string;
  title: string;
  links: OptimizerLinkCard[];
}) {
  return (
    <section className="mb-12 border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block border-2 border-white bg-white/10 p-4 transition-colors hover:bg-white hover:text-black"
          >
            <p className="text-sm font-black">{item.title}</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-200 hover:text-slate-700">
              {item.body}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FaqCardSection({
  title,
  items,
}: {
  title: string;
  items: OptimizerFaqItem[];
}) {
  return (
    <section className="mb-12">
      <h2 className="text-center text-3xl font-black text-black">{title}</h2>
      <div className="mx-auto mt-8 max-w-4xl space-y-4">
        {items.map((item) => (
          <details
            key={item.question}
            className="group border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <summary className="flex cursor-pointer items-center justify-between p-4 text-left text-base font-black text-black">
              {item.question}
              <span className="ml-3 text-xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="border-t-2 border-black px-4 pb-4 pt-3 text-sm font-medium leading-relaxed text-slate-700">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection({
  title,
  description,
  supportLine,
  buttonLabel,
  buttonHref,
  trackingLocation,
  trackingLabel,
}: {
  title: string;
  description: string;
  supportLine: string;
  buttonLabel: string;
  buttonHref: string;
  trackingLocation: string;
  trackingLabel: string;
}) {
  return (
    <section className="border-4 border-black bg-yellow-400 px-6 py-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black text-black">{title}</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-black sm:text-base">
            {description}
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-black">
            {supportLine}
          </p>
        </div>
        <TrackedLandingLink
          href={buttonHref}
          trackingLocation={trackingLocation}
          trackingLabel={trackingLabel}
          className="inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
        >
          {buttonLabel}
        </TrackedLandingLink>
      </div>
    </section>
  );
}
