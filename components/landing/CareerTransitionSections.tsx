import Link from "next/link";
import TrackedCareerLink from "@/components/analytics/TrackedCareerLink";
import type { CareerTransitionCtaEvent } from "@/lib/analytics";

export type CareerFaqItem = {
  question: string;
  answer: string;
};

export function CareerToCvCTA({
  title = "Werk je cv direct bij",
  text = "Met WerkCV maak je gratis een nette, ATS-vriendelijke Nederlandse cv. Je betaalt alleen eenmalig EUR 4,99 wanneer je jouw cv als PDF downloadt.",
  buttonLabel = "Werk mijn cv bij",
  buttonHref = "/cv-maken-zonder-abonnement",
  supportLine = "Geen abonnement. Geen proefperiode. Geen automatische verlenging.",
  eventName,
  ctaLocation,
}: {
  title?: string;
  text?: string;
  buttonLabel?: string;
  buttonHref?: string;
  supportLine?: string;
  eventName: CareerTransitionCtaEvent;
  ctaLocation: string;
}) {
  return (
    <section className="border-4 border-black bg-yellow-400 px-6 py-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black text-black">{title}</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-black sm:text-base">
            {text}
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-black">{supportLine}</p>
        </div>
        <TrackedCareerLink
          href={buttonHref}
          eventName={eventName}
          ctaLocation={ctaLocation}
          ctaText={buttonLabel}
          className="inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
        >
          {buttonLabel}
        </TrackedCareerLink>
      </div>
    </section>
  );
}

export function ToolCTA({
  title = "Gebruik de gratis generator",
  text,
  buttonLabel = "Open tool",
  buttonHref,
  eventName,
  ctaLocation,
}: {
  title?: string;
  text: string;
  buttonLabel?: string;
  buttonHref: string;
  eventName: CareerTransitionCtaEvent;
  ctaLocation: string;
}) {
  return (
    <section className="mb-12 border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
            Tool
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-200 sm:text-base">
            {text}
          </p>
        </div>
        <TrackedCareerLink
          href={buttonHref}
          eventName={eventName}
          ctaLocation={ctaLocation}
          ctaText={buttonLabel}
          className="inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
        >
          {buttonLabel}
        </TrackedCareerLink>
      </div>
    </section>
  );
}

export function CareerHubLinks({
  title,
  items,
}: {
  title: string;
  items: Array<{ href: string; title: string; body: string }>;
}) {
  return (
    <section className="mb-12 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black text-black">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block border-2 border-black bg-[#FFFEF9] p-4 transition-colors hover:bg-yellow-100"
          >
            <p className="text-sm font-black text-black">{item.title}</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
