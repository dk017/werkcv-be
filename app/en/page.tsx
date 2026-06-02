import Link from "next/link";
import { buildEnglishMetadata } from "./metadata";

export const metadata = buildEnglishMetadata({
  title: "English CV for Belgium",
  description:
    "Build an English CV for Belgium with the right structure, language logic, and template choices for Flanders, Brussels, and international employers.",
  path: "/en",
  nlPath: "/cv-maken-belgie",
  keywords: [
    "english cv belgium",
    "cv belgium in english",
    "resume belgium english",
    "belgium cv template english",
    "expat cv belgium",
  ],
});

const routes = [
  {
    href: "/en/cv-template-belgium",
    title: "CV Template for Belgium",
    description: "Use an English CV template that still matches how employers in Belgium scan structure, languages, and role fit.",
  },
  {
    href: "/en/guides/adapt-resume-for-belgium",
    title: "Adapt Your Resume for Belgium",
    description: "Turn an international resume into a Belgium-ready application document instead of sending a generic export.",
  },
  {
    href: "/sollicitatiebrief-in-engels",
    title: "English Cover Letter in the Belgian Context",
    description: "Check when English is the right application language and when Dutch or French is stronger.",
  },
];

const proofPoints = [
  {
    title: "English wording, Belgian context",
    description:
      "Keep your CV in English when the vacancy supports it, but adapt the structure and signals to what employers in Belgium expect.",
  },
  {
    title: "Region and language matter",
    description:
      "Belgium is not one single hiring context. Flanders, Brussels and French-speaking settings can require different application language choices.",
  },
  {
    title: "Keep the document simple",
    description:
      "A clear, ATS-safe layout usually works better than a decorative international resume with too many columns or design blocks.",
  },
];

export default function EnglishBelgiumHubPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF9]">
      <section className="border-b-4 border-black bg-gradient-to-br from-sky-50 via-cyan-50 to-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="mb-3 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
            English route for Belgium
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Build an English CV for jobs in Belgium without using a generic international resume
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl leading-relaxed">
            Use this route if you are applying in English but still need a CV that fits Belgium.
            The right document depends on region, vacancy language, and employer type. These pages
            help you choose the right template and adapt your resume instead of sending a copy-paste export.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/en/cv-template-belgium"
              className="inline-block bg-black text-white font-black px-5 py-3 border-4 border-black"
            >
              Start with the template route
            </Link>
            <Link
              href="/en/guides/adapt-resume-for-belgium"
              className="inline-block bg-[#4ECDC4] text-black font-black px-5 py-3 border-4 border-black"
            >
              Adapt my resume for Belgium
            </Link>
            <Link
              href="/templates"
              className="inline-block bg-white text-black font-black px-5 py-3 border-4 border-black"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 grid gap-5 md:grid-cols-3">
          {proofPoints.map((point) => (
            <div key={point.title} className="border-4 border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black text-gray-900">{point.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="border-4 border-black bg-[#FFF7E8] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Choose the route that matches your real blocker</h2>
          <p className="text-lg text-gray-700 max-w-3xl">
            Some applicants need the right template first. Others already have a resume and need to localize it for Belgium. Start from the problem you actually have.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} className="block border-2 border-black bg-white p-4 transition-colors hover:bg-yellow-100">
                <h3 className="text-base font-black text-black">{route.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{route.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
