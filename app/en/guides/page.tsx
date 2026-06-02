import Link from "next/link";
import { buildEnglishMetadata } from "../metadata";

export const metadata = buildEnglishMetadata({
  title: "Belgium Resume Guides in English",
  description:
    "English guides for adapting your resume and CV for jobs in Belgium, with practical language and market-fit advice.",
  path: "/en/guides",
  keywords: [
    "belgium resume guide",
    "english cv guide belgium",
    "adapt resume for belgium",
    "expat cv belgium guide",
  ],
});

const guides = [
  {
    href: "/en/guides/adapt-resume-for-belgium",
    title: "Adapt Your Resume for Belgium",
    description: "Convert an international resume into a Belgium-ready CV without keeping the wrong market assumptions.",
  },
  {
    href: "/en/cv-template-belgium",
    title: "English CV Template for Belgium",
    description: "Start here if your main blocker is structure, layout, and how to present the document on the page.",
  },
];

export default function EnglishGuidesHubPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF9]">
      <section className="border-b-4 border-black bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
            English Belgium guides
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            English guides for CVs and resumes in Belgium
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            These pages are for applicants who are writing in English but still need to adapt to Belgium rather than the Netherlands, the UK, or the US.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <Link key={guide.href} href={guide.href} className="block border-4 border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-colors hover:bg-yellow-100">
              <h2 className="text-xl font-black text-gray-900">{guide.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
