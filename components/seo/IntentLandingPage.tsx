import Link from "next/link";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQJsonLd } from "@/components/seo/JsonLd";

type IntentPageLink = {
  href: string;
  label: string;
};

type IntentPageCard = {
  title: string;
  body: string;
};

type IntentPageFaq = {
  question: string;
  answer: string;
};

type IntentLandingPageProps = {
  breadcrumbItems: Array<{ label: string; href: string }>;
  eyebrow: string;
  title: string;
  description: string;
  badges?: string[];
  primaryCta: IntentPageLink;
  secondaryCta?: IntentPageLink;
  sidebarTitle: string;
  sidebarItems: string[];
  cardsTitle: string;
  cards: IntentPageCard[];
  relatedTitle: string;
  relatedDescription: string;
  relatedLinks: Array<IntentPageLink & { body: string }>;
  faqs: IntentPageFaq[];
  footerTitle: string;
  footerBody: string;
  footerPrimaryCta: IntentPageLink;
  footerSecondaryCta?: IntentPageLink;
};

export default function IntentLandingPage({
  breadcrumbItems,
  eyebrow,
  title,
  description,
  badges = [],
  primaryCta,
  secondaryCta,
  sidebarTitle,
  sidebarItems,
  cardsTitle,
  cards,
  relatedTitle,
  relatedDescription,
  relatedLinks,
  faqs,
  footerTitle,
  footerBody,
  footerPrimaryCta,
  footerSecondaryCta,
}: IntentLandingPageProps) {
  return (
    <div className="min-h-screen bg-[#FFFEF0]">
      <FAQJsonLd questions={faqs} />

      <header className="border-b-4 border-black bg-white">
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

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <section className="mb-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-slate-700">
              {eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-black md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-700">
              {description}
            </p>

            {badges.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-black">
                {badges.map((badge) => (
                  <span key={badge} className="border-2 border-black bg-white px-3 py-1">
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={primaryCta.href}
                className="border-4 border-black bg-yellow-400 px-5 py-3 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>

          <aside className="h-fit border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-black">{sidebarTitle}</h2>
            <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-slate-700">
              {sidebarItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mb-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Waar deze pagina je mee helpt
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">{cardsTitle}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {cards.map((card) => (
              <article
                key={card.title}
                className="border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
              >
                <h3 className="text-xl font-black text-black">{card.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
            Vervolgstappen
          </p>
          <h2 className="mt-2 text-3xl font-black text-black">{relatedTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
            {relatedDescription}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-2 border-black bg-[#FFFEF0] p-4 transition-colors hover:bg-yellow-100"
              >
                <p className="text-sm font-black text-black">{link.label}</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                  {link.body}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
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
                Klaar voor de volgende stap?
              </p>
              <h2 className="mt-2 text-3xl font-black text-black">{footerTitle}</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-black sm:text-base">
                {footerBody}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={footerPrimaryCta.href}
                className="inline-block border-4 border-black bg-white px-5 py-3 text-base font-black text-black"
              >
                {footerPrimaryCta.label}
              </Link>
              {footerSecondaryCta ? (
                <Link
                  href={footerSecondaryCta.href}
                  className="inline-block border-4 border-black bg-black px-5 py-3 text-base font-black text-white"
                >
                  {footerSecondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
