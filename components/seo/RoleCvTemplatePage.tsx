import Link from "next/link";
import Footer from "@/components/Footer";
import { FAQJsonLd } from "@/components/seo/JsonLd";

type RoleFaq = {
  question: string;
  answer: string;
};

type RelatedLink = {
  href: string;
  label: string;
};

type RoleCvTemplatePageProps = {
  roleLabel: string;
  pageTitle: string;
  intro: string;
  profileText: string;
  recruiterSignals: string[];
  bulletExamples: string[];
  checklist: string[];
  faqs: RoleFaq[];
  relatedLinks: RelatedLink[];
};

export default function RoleCvTemplatePage({
  roleLabel,
  pageTitle,
  intro,
  profileText,
  recruiterSignals,
  bulletExamples,
  checklist,
  faqs,
  relatedLinks,
}: RoleCvTemplatePageProps) {
  return (
    <div className="min-h-screen bg-[#FFFEF0]">
      <FAQJsonLd questions={faqs} />

      <header className="relative z-10 border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-black">
              Werk<span className="bg-yellow-400 px-1">CV</span>.nl
            </span>
          </Link>
          <Link
            href="/editor"
            className="border-2 border-black bg-yellow-400 px-3 py-1 text-sm font-black text-black transition-colors hover:bg-yellow-300"
          >
            Start in editor
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <section className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-slate-700">
              CV-template intent: {roleLabel}
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              {pageTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              {intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/editor"
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Start dit CV in de editor
              </Link>
              <Link
                href="/templates"
                className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Vergelijk templates
              </Link>
            </div>
          </div>

          <div className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-black">Wat recruiters in dit CV direct zoeken</h2>
            <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-slate-700">
              {recruiterSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Voorbeeld profieltekst
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Copy-ready profieltekst voor {roleLabel}
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">{profileText}</p>
          </article>

          <article className="border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
              Checklist
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">Wat in dit CV moet terugkomen</h2>
            <ul className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-slate-200">
              {checklist.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center border-2 border-white bg-black text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Werkervaring bullets
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">
            Voorbeeld bullets die je direct kunt aanpassen
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bulletExamples.map((example) => (
              <article
                key={example}
                className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <p className="text-sm font-medium leading-relaxed text-slate-700">{example}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Handige vervolgroutes
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-2 border-black bg-[#FFFEF0] px-4 py-3 text-sm font-black text-black transition-colors hover:bg-yellow-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-center text-3xl font-black text-black">Veelgestelde vragen</h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <summary className="flex cursor-pointer items-center justify-between p-4 text-left text-base font-black text-black">
                  {faq.question}
                  <span className="ml-3 text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t-2 border-black px-4 pb-4 pt-3 text-sm font-medium leading-relaxed text-slate-700">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="border-4 border-black bg-yellow-400 px-6 py-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black">
                Klaar om je versie te bouwen?
              </p>
              <h2 className="mt-2 text-3xl font-black text-black">
                Zet deze voorbeeldstructuur direct om naar je eigen CV
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-black sm:text-base">
                Gebruik de editor om profieltekst, werkervaring en layout meteen netjes af te ronden.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/editor"
                className="inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                Open CV editor
              </Link>
              <Link
                href="/templates"
                className="inline-block border-4 border-black bg-black px-5 py-3 text-base font-black text-white"
              >
                Bekijk templates
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
