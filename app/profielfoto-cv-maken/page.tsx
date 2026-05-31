import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import NavUserMenu from "@/components/NavUserMenu";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { buildDutchMetadata } from "@/lib/page-metadata";
import { applicationBundlePrice, profilePhotoPrice } from "@/lib/site-content";
import ProfilePhotoGenerator from "./ProfilePhotoGenerator";
import ProfilePhotoSamples, { type ProfilePhotoSample } from "./ProfilePhotoSamples";

const faqItems = [
  {
    question: "Is een foto verplicht op mijn cv in België?",
    answer:
      "Nee. Een foto is niet verplicht, maar in België is het wel gebruikelijker dan in sommige andere markten. Gebruik alleen een foto als die professioneel, rustig en passend is voor de functie.",
  },
  {
    question: "Kan ik dezelfde foto gebruiken voor cv en LinkedIn?",
    answer:
      "Ja. Dat is vaak juist handig. Een consistente profielfoto op je cv en LinkedIn maakt je herkenbaar voor recruiters die beide bekijken.",
  },
  {
    question: "Wat kost de profielfoto-tool?",
    answer:
      `De AI-profielfoto is een eenmalige add-on van ${profilePhotoPrice.display}. Je krijgt 4 startvarianten en 2 inbegrepen verfijningen. Combineer je hem met je cv, dan is de bundle ${applicationBundlePrice.display}.`,
  },
];

const profilePhotoSamples: ProfilePhotoSample[] = [
  {
    src: "/profile-photo-samples/dutch-consultant-man.jpg",
    alt: "AI-gegenereerde voorbeeldprofielfoto van een consultant",
    role: "Consultant",
    style: "Corporate executive",
    note: "Zakelijke uitstraling voor consultants, finance, sales en kantoorfuncties waar vertrouwen belangrijk is.",
  },
  {
    src: "/profile-photo-samples/dutch-tech-professional-man.jpg",
    alt: "AI-gegenereerde voorbeeldprofielfoto van een tech professional",
    role: "Tech professional",
    style: "Clean LinkedIn",
    note: "Professioneel zonder pak. Geschikt voor software, product en moderne bedrijfsomgevingen.",
  },
  {
    src: "/profile-photo-samples/dutch-hr-manager-woman.jpg",
    alt: "AI-gegenereerde voorbeeldprofielfoto van een HR manager",
    role: "HR manager",
    style: "Zakelijk warm",
    note: "Warm en betrouwbaar, zonder te informeel te worden. Past goed bij HR, coaching en klantgerichte rollen.",
  },
];

export const metadata: Metadata = buildDutchMetadata({
  title: `AI profielfoto maken België | CV & LinkedIn | WerkCV`,
  description: `Maak van een gewone foto een professionele profielfoto voor je cv en LinkedIn in België. Preview eerst, download voor ${profilePhotoPrice.display}.`,
  path: "/profielfoto-cv-maken",
  keywords: [
    "profielfoto cv belgie",
    "ai profielfoto linkedin belgie",
    "professionele profielfoto maken belgie",
    "cv foto maken belgie",
  ],
});

export default function ProfilePhotoPage() {
  return (
    <div className="min-h-screen bg-[#FFFEF9]">
      <FAQJsonLd questions={faqItems} />

      <header className="border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-black">
              Werk<span className="bg-[#4ECDC4] px-1">CV</span>.be
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-bold text-slate-600 sm:flex">
            <Link href="/cv-maken-belgie" className="hover:text-slate-900">
              CV maken
            </Link>
            <Link href="/templates" className="hover:text-slate-900">
              Templates
            </Link>
            <Link href="/prijzen" className="hover:text-slate-900">
              Prijzen
            </Link>
            <NavUserMenu />
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b-4 border-black bg-[radial-gradient(circle_at_top_left,#E9FFFC_0,#FFFEF9_42%,#FFF4D8_100%)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-900">
                AI profielfoto België
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                Professionele profielfoto voor je cv en LinkedIn
              </h1>
              <p className="mt-5 text-lg font-medium leading-relaxed text-slate-700">
                Upload een bestaande foto of selfie en maak er een realistische, herkenbare AI-profielfoto van die past
                bij je sollicitatie in België. Handig als laatste stap nadat je cv klaar is.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#profielfoto-tool"
                  className="inline-flex items-center justify-center border-4 border-black bg-[#4ECDC4] px-5 py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Maak mijn profielfoto
                </Link>
                <Link
                  href="/cv-maken-gratis"
                  className="inline-flex items-center justify-center border-4 border-black bg-white px-5 py-3 text-sm font-black text-black"
                >
                  Eerst mijn cv maken
                </Link>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-700">
                Eénmalig {profilePhotoPrice.display}. Of samen met je cv voor {applicationBundlePrice.display}. Geen abonnement.
              </p>
            </div>

            <ProfilePhotoSamples samples={profilePhotoSamples.slice(0, 1)} mode="hero" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Bekijk de stijlen</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950">
                Kies een foto die past bij je sollicitatie
              </h2>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-700">
              Voor starters, consultants, tech en klantgerichte functies werkt vaak een andere uitstraling. Klik op een voorbeeld om de stijl groter te bekijken.
            </p>
          </div>
          <ProfilePhotoSamples samples={profilePhotoSamples.slice(1)} mode="gallery" />
        </section>

        <section id="profielfoto-tool" className="mx-auto max-w-6xl px-6 py-12">
          <ProfilePhotoGenerator />
        </section>
      </main>

      <Footer />
    </div>
  );
}
