import Link from "next/link";
import { buildEnglishMetadata } from "../metadata";

export const metadata = buildEnglishMetadata({
  title: "English CV Template for Belgium",
  description:
    "Use an English CV template for Belgium with simple structure, clear language signals, and recruiter-safe formatting for Flanders, Brussels, and international employers.",
  path: "/en/cv-template-belgium",
  nlPath: "/templates",
  keywords: [
    "english cv template belgium",
    "cv template belgium english",
    "resume template belgium",
    "belgium cv format english",
    "expat cv template belgium",
  ],
});

const quickAnswerCards = [
  {
    title: "Simple one-column structure",
    body:
      "A Belgium-friendly CV template usually works best when it is easy to scan, ATS-safe, and not overloaded with design blocks.",
  },
  {
    title: "Clear language and region logic",
    body:
      "The same English CV does not fit every role. In Flanders, Dutch can still be expected. In Brussels or international companies, English can be the right choice.",
  },
  {
    title: "Practical over decorative",
    body:
      "A clean template is safer than a highly designed international resume if you want clarity, recruiter trust, and stable PDF export.",
  },
];

const belgiumExpectations = [
  "A clear job title directly under your name.",
  "A short profile summary, not a long personal statement.",
  "Recent experience first with concrete outcomes.",
  "Visible language levels when they matter for the role.",
  "A simple PDF layout that remains readable after export.",
];

const languageMatrix = [
  {
    title: "Flanders",
    body: "If the vacancy is in Dutch, a Dutch CV is often stronger. Use English only when the role or employer clearly supports it.",
  },
  {
    title: "Brussels",
    body: "English is often more acceptable, especially in international, EU-facing, or multinational environments. Still check the vacancy language first.",
  },
  {
    title: "French-speaking employers",
    body: "If the employer clearly works in French, an English CV may not be your best version unless the vacancy itself is in English.",
  },
];

const routeChoices = [
  {
    href: "/en/guides/adapt-resume-for-belgium",
    title: "Already have a resume?",
    body: "Use the adaptation guide if your current document was written for another country and needs Belgian positioning.",
  },
  {
    href: "/templates",
    title: "Need the actual layout?",
    body: "Compare the Belgian templates and keep the one that stays calm, readable, and easy to tailor.",
  },
  {
    href: "/sollicitatiebrief-in-engels",
    title: "Need the matching cover letter too?",
    body: "Check when an English cover letter is appropriate in Belgium before you send a mixed-language application package.",
  },
];

const packagePoints = [
  "English wording with Belgian application logic.",
  "ATS-friendly PDF layout that stays stable after export.",
  "One-time PDF download instead of a subscription workflow.",
];

const faqs = [
  {
    question: "Can I apply in English in Belgium?",
    answer:
      "Yes, but only when the vacancy or employer context supports it. In Brussels and international companies this is common. In many Dutch-speaking or French-speaking roles, the vacancy language is still the safer choice.",
  },
  {
    question: "What should an English CV for Belgium include?",
    answer:
      "Use a clear title, short profile summary, reverse-chronological work history, language levels, and a simple recruiter-safe layout. Keep the document practical rather than decorative.",
  },
  {
    question: "Should I add Dutch and French levels on the CV?",
    answer:
      "Yes, when languages matter for the role. Belgium is multilingual, so clear language levels can help recruiters assess fit much faster.",
  },
  {
    question: "How long should the CV be?",
    answer:
      "Most applicants should stay within one to two pages, focused on relevant experience, results, and skills that match the vacancy.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to choose an English CV template for Belgium",
  description:
    "Choose a Belgium-friendly English CV template with the right structure, language logic, and ATS-safe formatting.",
  inLanguage: "en-BE",
  step: [
    "Check the vacancy language before deciding to apply in English.",
    "Choose a simple template that keeps sections easy to scan.",
    "Add clear language levels when they matter for the role.",
    "Export as PDF and review whether the document still looks calm and readable.",
  ].map((text, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: `Step ${index + 1}`,
    text,
  })),
};

export default function EnglishCvTemplateBelgiumPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <section className="border-b-4 border-black bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
            English CV for Belgium
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            English CV template for Belgium
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Use this route if you want an English CV that still feels right for Belgium.
            The goal is not to send a generic international resume, but a clear application document that matches local recruiter logic and multilingual hiring reality.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/templates" className="bg-black text-white font-bold px-5 py-3 border-4 border-black">
              Compare Belgian templates
            </Link>
            <Link href="/editor" className="bg-[#4ECDC4] text-black font-bold px-5 py-3 border-4 border-black">
              Open the editor
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">What makes an English CV template fit Belgium?</h2>
          <p className="text-gray-700 max-w-3xl">
            A Belgium-friendly template is clear, stable, and easy to tailor. It should help a recruiter understand your role, background, and language fit quickly. The writing can stay in English, but the structure should reflect how employers in Belgium scan applications: direct title, concise summary, recent experience first, and visible language signals when relevant.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {quickAnswerCards.map((card) => (
              <article key={card.title} className="border-2 border-black bg-[#FFFEF0] p-4">
                <h3 className="text-base font-black text-black">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{card.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">What employers in Belgium usually expect</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {belgiumExpectations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[#E9FFFC] border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">Choose English only when the context supports it</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {languageMatrix.map((item) => (
              <article key={item.title} className="border-2 border-black bg-white p-4">
                <h3 className="text-base font-black text-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">What you are actually building</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {packagePoints.map((point) => (
              <div key={point} className="border-2 border-black bg-[#FFFEF0] p-4 text-sm font-bold text-black">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFF7E8] border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">Best next route</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {routeChoices.map((choice) => (
              <Link key={choice.href} href={choice.href} className="block border-2 border-black bg-white p-4 transition-colors hover:bg-yellow-100">
                <h3 className="text-base font-black text-black">{choice.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{choice.body}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="border-2 border-black bg-[#FFFEF0] p-4">
                <summary className="cursor-pointer text-base font-black text-black">{faq.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
