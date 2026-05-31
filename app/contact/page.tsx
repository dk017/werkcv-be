import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact | WerkCV",
  description: "Neem contact op met WerkCV.be. Heb je een vraag, feedback of een probleem? Stuur direct een bericht via het contactformulier.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFFEF9]">
      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="mb-4 text-5xl font-black">Contact</h1>
          <p className="max-w-2xl text-xl text-gray-600">
            Heb je een vraag over WerkCV in België, feedback op de builder of een probleem met je cv?
            Stuur een bericht en we reageren doorgaans binnen 1 tot 2 werkdagen.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <ContactForm />

        <div className="space-y-6">
          <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start gap-5">
              <div className="h-12 w-12 flex-shrink-0 border-2 border-black bg-[#4ECDC4] flex items-center justify-center">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="mb-1 text-xl font-black">E-mail</h2>
                <p className="mb-3 text-sm text-gray-600">Voor vragen, feedback en support.</p>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="inline-block border-b-2 border-black text-lg font-bold transition-colors hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start gap-5">
              <div className="h-12 w-12 flex-shrink-0 border-2 border-black bg-black flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div>
                <h2 className="mb-1 text-xl font-black">X (Twitter)</h2>
                <p className="mb-3 text-sm text-gray-600">Volg ons voor updates en CV tips.</p>
                <a
                  href="https://x.com/dk_r017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-b-2 border-black text-lg font-bold transition-colors hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
                >
                  @dk_r017
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-3 text-xl font-black">Eerst even zelf kijken?</h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              Voor veel algemene vragen hebben we al een duidelijk antwoord op onze FAQ-pagina.
            </p>
            <Link
              href="/faq"
              className="inline-block bg-[#4ECDC4] px-6 py-3 font-bold text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              Bekijk ook onze FAQ →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
