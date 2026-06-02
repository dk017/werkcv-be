import Link from "next/link";
import { buildEnglishMetadata } from "../../metadata";

export const metadata = buildEnglishMetadata({
  title: "How to Adapt Your Resume for Belgium",
  description:
    "Adapt your resume for jobs in Belgium with the right language choice, section order, education wording, and recruiter-safe formatting.",
  path: "/en/guides/adapt-resume-for-belgium",
  keywords: [
    "adapt resume for belgium",
    "resume belgium format",
    "how to write cv for belgium",
    "english resume belgium",
    "expat resume belgium",
  ],
  type: "article",
});

const steps = [
  {
    title: "1) Choose the right application language first",
    body:
      "Do not start by translating blindly. In Belgium, the right language depends on the vacancy, region, and employer. Flanders often expects Dutch. Brussels may accept English more often. French-speaking employers may prefer French unless the role is clearly international.",
  },
  {
    title: "2) Rewrite the summary for Belgium, not your home market",
    body:
      "Many US or UK resumes open with broad positioning statements. For Belgium, a shorter summary with job focus, relevant strengths, and practical fit usually lands better than a long branding paragraph.",
  },
  {
    title: "3) Keep the structure calm and recent-first",
    body:
      "Use reverse-chronological experience, a clear job title, readable headings, and measurable bullets. Avoid heavy design or sidebars that distract from content.",
  },
  {
    title: "4) Clarify languages and education in a way recruiters can scan quickly",
    body:
      "If languages matter, list them clearly with realistic levels. Present your degree and institution in a way that is understandable for Belgian recruiters instead of assuming your local education labels explain themselves.",
  },
  {
    title: "5) Export as PDF and review the final version as an employer would",
    body:
      "Check whether the document still looks stable, balanced, and easy to scan after export. A calm PDF is usually safer than a visually complex resume.",
  },
];

const translationMistakes = [
  {
    wrong: "Keeping a long US-style objective statement.",
    better: "Use a shorter summary focused on role fit and concrete strengths.",
  },
  {
    wrong: "Listing language names without level or context.",
    better: "Show Dutch, French, or English levels clearly when the role depends on them.",
  },
  {
    wrong: "Using a decorative multi-column resume with too much visual noise.",
    better: "Choose a simple layout that stays readable in PDF and ATS flows.",
  },
  {
    wrong: "Sending the same English resume to every Belgian employer.",
    better: "Adjust language, summary, and keywords to the vacancy and region.",
  },
];

const marketSignals = [
  {
    title: "Belgium is multilingual",
    body:
      "Belgium has three official languages, and hiring context can shift between Dutch, French, and English depending on region and employer type.",
  },
  {
    title: "Brussels is not the whole market",
    body:
      "English can work in Brussels and international firms, but that does not automatically make it the right language for every vacancy in Belgium.",
  },
  {
    title: "Cover letter expectations still matter",
    body:
      "Actiris and other Belgian employment guidance still treat the cover letter as a normal part of the application package, so your resume should not be built in isolation.",
  },
];

const routeChoices = [
  {
    href: "/en/cv-template-belgium",
    title: "Need the actual CV structure?",
    body: "Use the template page if your main blocker is layout and section order rather than wording.",
  },
  {
    href: "/sollicitatiebrief-in-engels",
    title: "Need the English cover letter too?",
    body: "Check the Belgian language logic first so you do not pair the wrong letter language with your CV.",
  },
  {
    href: "/editor",
    title: "Ready to build?",
    body: "Use the editor once you know which language and structure fit the vacancy you are targeting.",
  },
];

const faqs = [
  {
    question: "Should I use CV or resume in Belgium?",
    answer:
      "In practice, CV is the safer term in Belgium. Many international applicants still say resume, but the document itself should be structured like a CV rather than a decorative one-page US resume.",
  },
  {
    question: "Can I apply in English in Belgium?",
    answer:
      "Yes, but only when the vacancy or employer context supports it. Always check the language of the job post first instead of assuming English is fine everywhere.",
  },
  {
    question: "Do I need to mention work authorization?",
    answer:
      "Only if it helps remove recruiter uncertainty. If your right to work is relevant to the application, mention it briefly and clearly rather than hiding it or overexplaining it.",
  },
  {
    question: "What is the biggest mistake when adapting a resume for Belgium?",
    answer:
      "Treating Belgium like a generic English-speaking market. The biggest mistake is keeping the original market logic instead of adapting language choice, structure, and hiring signals to Belgium.",
  },
];

export default function AdaptResumeForBelgiumPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF9]">
      <section className="border-b-4 border-black bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
            Resume adaptation for Belgium
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            How to adapt your resume for jobs in Belgium
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            A resume written for the US, UK, or another international market usually needs more than translation. The right Belgium version depends on language choice, region, employer type, and whether your current document feels too generic, too decorative, or too foreign for the vacancy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/en/cv-template-belgium" className="bg-black text-white font-bold px-5 py-3 border-4 border-black">
              See the Belgium CV template route
            </Link>
            <Link href="/editor" className="bg-[#4ECDC4] text-black font-bold px-5 py-3 border-4 border-black">
              Open the editor
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">The adaptation process</h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <article key={step.title} className="border-2 border-black bg-[#FFFEF0] p-4">
                <h3 className="text-base font-black text-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{step.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-[#E9FFFC] border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">Belgium-specific market signals</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {marketSignals.map((signal) => (
              <article key={signal.title} className="border-2 border-black bg-white p-4">
                <h3 className="text-base font-black text-black">{signal.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{signal.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6">
          <h2 className="text-2xl font-black mb-3">Common adaptation mistakes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {translationMistakes.map((item) => (
              <article key={item.wrong} className="border-2 border-black bg-[#FFFEF0] p-4">
                <p className="text-sm font-black text-black">Do not keep</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{item.wrong}</p>
                <p className="mt-3 text-sm font-black text-black">Better</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{item.better}</p>
              </article>
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
