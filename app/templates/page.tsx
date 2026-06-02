import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { templateList } from "@/lib/templates/registry";
import TemplateGallery from "./gallery";

const pageUrl = `${siteConfig.baseUrl}/templates`;

export const metadata: Metadata = {
  title: {
    absolute: "CV Templates voor België | WerkCV",
  },
  description:
    "Vergelijk cv templates voor België, kies een rustige of moderne layout en start gratis in de editor. Geen abonnement, éénmalig betalen bij PDF-download.",
  keywords: [
    "cv template belgie",
    "cv sjabloon belgie",
    "cv templates vlaanderen",
    "gratis cv template belgie",
    "ats cv template belgie",
  ],
  alternates: {
    canonical: pageUrl,
    languages: {
      "nl-BE": pageUrl,
      "nl-NL": "https://werkcv.nl/templates",
      "x-default": pageUrl,
    },
  },
  openGraph: {
    title: "CV Templates voor België | WerkCV",
    description:
      "Vergelijk cv templates voor België, kies een rustige of moderne layout en start gratis in de editor.",
    url: pageUrl,
    siteName: "WerkCV",
    locale: "nl_BE",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WerkCV templates voor België",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Templates voor België | WerkCV",
    description:
      "Vergelijk cv templates voor België, kies een rustige of moderne layout en start gratis in de editor.",
    images: ["/opengraph-image"],
  },
};

export default function TemplatesPage() {
  return (
    <main id="quick-start">
      <section className="border-b-4 border-black bg-[#FFFEF0]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-slate-600">
              Voor Belgische sollicitaties
            </p>
            <h1 className="text-2xl font-black text-black sm:text-3xl">
              Vergelijk templates en kies de stijl die past bij jouw cv
            </h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
              WerkCV.be laat je gratis templates vergelijken, later nog van kleur of layout wisselen
              en pas betalen wanneer je jouw PDF echt wilt downloaden.
            </p>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-700">
              Wil je vooral weten hoe{" "}
              <Link
                href="/cv-maken-zonder-abonnement"
                className="font-black text-black underline decoration-2 underline-offset-4"
              >
                eenmalig betalen
              </Link>{" "}
              werkt? Gebruik dan eerst die prijsuitlegpagina.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-black">
              <span className="border-2 border-black bg-white px-3 py-1">ATS-vriendelijk</span>
              <span className="border-2 border-black bg-white px-3 py-1">Eenmalig per cv</span>
              <span className="border-2 border-black bg-white px-3 py-1">Later opnieuw downloaden</span>
              <span className="border-2 border-black bg-white px-3 py-1">{templateList.length}+ templates</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/cv-maken-belgie" className="border-2 border-black bg-white px-4 py-2 text-sm font-black text-black">
              CV maken in België
            </Link>
            <Link href="/cv-template-vlaanderen" className="border-2 border-black bg-white px-4 py-2 text-sm font-black text-black">
              CV template Vlaanderen
            </Link>
            <Link href="/cv-maken-zonder-abonnement" className="border-2 border-black bg-white px-4 py-2 text-sm font-black text-black">
              Zonder abonnement
            </Link>
            <Link
              href="/gratis-cv-template"
              className="border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Gratis template opties
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="border-4 border-black bg-[#FFF7E8] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Eerst de route kiezen?
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Gebruik deze instappagina&apos;s als je nog twijfelt
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-700">
              Niet iedereen wil meteen een layout kiezen. Soms wil je eerst weten hoe de Belgische
              cv-markt werkt, welke gratis route logisch is, of hoe een motivatiebrief aansluit op je cv.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/cv-maken-belgie" className="border-2 border-black bg-white px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                CV maken in België
              </Link>
              <Link href="/cv-maken-eenmalig-betalen" className="border-2 border-black bg-white px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                Eénmalig betalen
              </Link>
              <Link href="/cv-voorbeeld-belgie" className="border-2 border-black bg-white px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                CV voorbeeld België
              </Link>
              <Link href="/cv-template-vlaanderen" className="border-2 border-black bg-white px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                CV template Vlaanderen
              </Link>
              <Link href="/ats-cv-template" className="border-2 border-black bg-white px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                ATS cv template
              </Link>
              <Link href="/sollicitatiebrief-belgie" className="border-2 border-black bg-white px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                Sollicitatiebrief België
              </Link>
              <Link href="/prijzen" className="border-2 border-black bg-yellow-200 px-3 py-2 text-sm font-black text-black hover:bg-yellow-300 transition-colors">
                Prijsmodel bekijken
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#FFFEF0]">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-8 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
              Layout + inhoud
            </p>
            <h2 className="mt-2 text-3xl font-black text-black">
              Kies een template en werk daarna je inhoud af in de editor
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
              Een template helpt met rust, scanbaarheid en visuele structuur. Daarna werk je je profiel,
              ervaring en vaardigheden verder uit in dezelfde editorflow.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/cv-voorbeeld-belgie",
                title: "CV voorbeeld België",
                body: "Gebruik voorbeeldstructuren als je eerst wilt zien hoe een Belgisch cv opgebouwd is.",
              },
              {
                href: "/cv-maken-zonder-abonnement",
                title: "Zonder abonnement",
                body: "Bekijk hoe gratis bouwen en eenmalig downloaden werkt voordat je begint.",
              },
              {
                href: "/cv-maken-eenmalig-betalen",
                title: "Eénmalig betalen",
                body: "Gebruik deze route als je specifiek zoekt naar een cv-builder zonder maandkost of proefperiode.",
              },
              {
                href: "/prijzen",
                title: "Prijsmodel",
                body: "Controleer wat je betaalt bij PDF-download en wat later opnieuw downloaden betekent.",
              },
              {
                href: "/ats-cv-template",
                title: "ATS cv template",
                body: "Handig als scanbaarheid en sollicitatiesoftware je hoogste prioriteit zijn.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-2 border-black bg-white p-4 transition-colors hover:bg-yellow-100"
              >
                <p className="text-sm font-black text-black">{item.title}</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TemplateGallery templates={templateList} />
    </main>
  );
}
