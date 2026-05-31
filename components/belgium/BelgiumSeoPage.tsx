import Link from "next/link";
import Footer from "@/components/Footer";

type CtaLink = {
  href: string;
  label: string;
};

type BelgiumSeoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  relatedLinks: Array<CtaLink>;
};

export default function BelgiumSeoPage({
  eyebrow,
  title,
  intro,
  sections,
  primaryCta,
  secondaryCta,
  relatedLinks,
}: BelgiumSeoPageProps) {
  return (
    <main className="min-h-screen bg-[#fffef4] text-black">
      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-slate-600">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-700">
            {intro}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="border-4 border-black bg-yellow-400 px-6 py-4 text-center text-base font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="border-4 border-black bg-white px-6 py-4 text-center text-base font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#fffef4]">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-2xl font-black">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
              Volgende stap
            </p>
            <p className="mt-4 text-lg font-black">
              Werk je cv online uit en betaal pas als je de PDF wilt downloaden.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Geen abonnement, geen automatische verlenging en geen gedoe met losse Word-opmaak.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={secondaryCta.href}
                className="border-4 border-black bg-yellow-400 px-4 py-3 text-center text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {secondaryCta.label}
              </Link>
              <Link
                href={primaryCta.href}
                className="border-4 border-black bg-white px-4 py-3 text-center text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {primaryCta.label}
              </Link>
            </div>
            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                Gerelateerde pagina&apos;s
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="font-bold underline decoration-2 underline-offset-4">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
