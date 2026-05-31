import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import {
    cvDownloadPrice,
    siteAggregateRating,
    siteName,
} from "@/lib/site-content";

const pageUrl = `${siteConfig.baseUrl}/faq`;

export const metadata: Metadata = {
    title: "Veelgestelde Vragen (FAQ) - CV Maken | WerkCV",
    description: "Antwoorden op veelgestelde vragen over WerkCV.be. Alles over cv maken, betaling, templates, ATS-optimalisatie en meer voor de Belgische markt.",
    keywords: [
        "cv maken vragen",
        "cv builder faq",
        "cv downloaden hulp",
        "ATS cv uitleg",
        "cv template vragen",
        "werkcv hulp",
    ],
    alternates: {
        canonical: pageUrl,
    },
};

const faqs = [
    {
        category: "Over WerkCV.be",
        questions: [
            {
                q: "Wat is WerkCV.be?",
                a: "WerkCV.be is een online cv-builder waarmee je snel en eenvoudig een professioneel cv kunt maken. Je kiest een template, vult je gegevens in en downloadt je cv als PDF. Het is bedoeld voor sollicitaties in België."
            },
            {
                q: "Is WerkCV.be gratis?",
                a: "Het aanmaken en bewerken van je cv is volledig gratis. Je betaalt eenmalig €4,99 per cv wanneer je dat cv als PDF wilt downloaden. Er zijn geen abonnementen of verborgen kosten."
            },
            {
                q: "Hoe verschilt WerkCV.be van andere CV-sites?",
                a: "Veel cv-sites werken met maandabonnementen of proefperiodes die later doorlopen. WerkCV.be vraagt een eenmalige betaling van €4,99 per cv. Daarna kun je datzelfde cv later opnieuw bewerken en downloaden zonder extra betaling."
            },
        ],
    },
    {
        category: "CV Maken",
        questions: [
            {
                q: "Hoe maak ik een CV op WerkCV.be?",
                a: "Je kunt op twee manieren beginnen: upload je bestaande cv (PDF of Word) en wij zetten het automatisch om, of begin vanaf nul met een leeg template. Daarna bewerk je alles in onze live editor met direct voorbeeld."
            },
            {
                q: "Kan ik mijn bestaande CV uploaden?",
                a: "Ja! Upload je bestaande CV in PDF- of Word-formaat. Onze AI leest je CV uit en vult alle velden automatisch in. Je kunt daarna alles bewerken en een nieuw template kiezen."
            },
            {
                q: "Hoeveel templates zijn er beschikbaar?",
                a: "We hebben 13+ professionele templates in verschillende stijlen: klassiek, modern, creatief en minimaal. Elk template is beschikbaar in 12 kleurthema's, wat meer dan 150 unieke combinaties oplevert."
            },
            {
                q: "Zijn de templates ATS-vriendelijk?",
                a: "Ja, al onze templates zijn geoptimaliseerd voor Applicant Tracking Systems (ATS). Dit betekent dat je CV correct wordt gelezen door de software die veel werkgevers gebruiken om sollicitaties te verwerken."
            },
            {
                q: "Kan ik mijn CV later nog bewerken?",
                a: "Ja, je CV blijft opgeslagen en je kunt het op elk moment gratis bewerken. Je wijzigingen worden automatisch opgeslagen terwijl je typt, ook nadat je al voor dat CV hebt betaald."
            },
        ],
    },
    {
        category: "Betaling & Download",
        questions: [
            {
                q: "Hoeveel kost het om een CV te downloaden?",
                a: "Een cv downloaden als PDF kost eenmalig €4,99 per cv. Dit is een eenmalige betaling, geen abonnement."
            },
            {
                q: "Moet ik opnieuw betalen als ik mijn CV later aanpas?",
                a: "Nee. Als je eenmaal voor een CV hebt betaald, kun je later gewoon inloggen, datzelfde CV opnieuw openen, aanpassen, van template of kleur wisselen en opnieuw downloaden zonder opnieuw te betalen."
            },
            {
                q: "Welke betaalmethoden worden geaccepteerd?",
                a: "We accepteren gangbare betaalmethoden via onze beveiligde betalingspartner. Welke opties je ziet hangt af van je land en betaalgegevens."
            },
            {
                q: "Kan ik mijn geld terugkrijgen?",
                a: "Omdat het een digitaal product betreft dat direct na betaling wordt geleverd, is terugbetaling niet mogelijk. Je kunt je CV echter wel eerst gratis bewerken en bekijken voordat je betaalt."
            },
            {
                q: "In welk formaat wordt mijn CV gedownload?",
                a: "Je cv wordt gedownload als een professioneel PDF-bestand. Dit is het meest gebruikte en geaccepteerde formaat voor sollicitaties in België."
            },
        ],
    },
    {
        category: "Privacy & Veiligheid",
        questions: [
            {
                q: "Is mijn data veilig?",
                a: "Ja, we gebruiken een beveiligde HTTPS-verbinding en slaan je gegevens veilig op. We verkopen je data nooit aan derden. Lees ons volledige privacybeleid voor meer informatie."
            },
            {
                q: "Kan ik mijn gegevens laten verwijderen?",
                a: "Ja, op grond van de AVG (GDPR) heb je het recht om je gegevens te laten verwijderen. Neem contact met ons op en we verwijderen al je gegevens."
            },
        ],
    },
];

const comparisonGuides = [
    {
        href: "/cv-maken-belgie",
        title: "CV maken in België",
        body: "Gebruik deze pagina als je eerst wilt zien hoe WerkCV.be aansluit op sollicitaties in België.",
    },
    {
        href: "/cv-maken-zonder-abonnement",
        title: "CV zonder abonnement",
        body: "Handig als je vooral prijsmodel, eenmalig betalen en abonnementsverschillen wilt afwegen.",
    },
    {
        href: "/gratis-cv-template",
        title: "Gratis cv template",
        body: "Voor als je eerst templates wilt vergelijken en daarna pas beslist of je wilt downloaden.",
    },
    {
        href: "/cv-voorbeeld-belgie",
        title: "CV voorbeeld België",
        body: "Gebruik deze pagina als je eerst een Belgisch cv-voorbeeld wilt bekijken voor je start.",
    },
    {
        href: "/cv-template-vlaanderen",
        title: "CV template Vlaanderen",
        body: "Nuttig als je specifiek op Vlaamse sollicitatiecontext en cv-templates wilt sturen.",
    },
    {
        href: "/sollicitatiebrief-belgie",
        title: "Sollicitatiebrief België",
        body: "Gebruik deze pagina als je naast je cv ook een Belgische motivatiebrief of sollicitatiebrief wilt voorbereiden.",
    },
];

export default function FAQPage() {
    const softwareApplicationJsonLd = siteAggregateRating
        ? {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: siteName,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: siteConfig.baseUrl,
            inLanguage: siteConfig.language,
            offers: {
                "@type": "Offer",
                price: cvDownloadPrice.value,
                priceCurrency: cvDownloadPrice.currency,
                availability: "https://schema.org/InStock",
                url: `${siteConfig.baseUrl}/prijzen`,
            },
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: siteAggregateRating.ratingValue,
                reviewCount: siteAggregateRating.reviewCount,
                bestRating: siteAggregateRating.bestRating ?? 5,
                worstRating: siteAggregateRating.worstRating ?? 1,
            },
        }
        : null;

    return (
        <div className="min-h-screen bg-[#FFFEF0]">
            {/* Header */}
            <header className="relative z-10 border-b-4 border-black bg-white">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-black text-2xl tracking-tight text-black">
                            Werk<span className="bg-yellow-400 px-1">CV</span>.be
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-bold text-black bg-yellow-400 px-3 py-1 border-2 border-black hover:bg-yellow-300 transition-colors"
                    >
                        CV Maken
                    </Link>
                </div>
            </header>

            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-black mb-4">Veelgestelde Vragen</h1>
                    <p className="text-lg font-medium text-black">
                        Alles wat je wilt weten over WerkCV.be
                    </p>
                </div>

                <div className="space-y-10">
                    {faqs.map((section, si) => (
                        <section key={si}>
                            <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                                <span className="bg-yellow-400 px-2 py-1 border-2 border-black -rotate-1">
                                    {section.category}
                                </span>
                            </h2>
                            <div className="space-y-3">
                                {section.questions.map((faq, qi) => (
                                    <details key={qi} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group">
                                        <summary className="p-4 font-black text-black cursor-pointer flex items-center justify-between text-sm sm:text-base">
                                            <span className="pr-4">{faq.q}</span>
                                            <span className="text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                                        </summary>
                                        <div className="px-4 pb-4 font-medium text-gray-700 border-t-2 border-black pt-3 text-sm leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <section className="mt-14">
                    <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                        <span className="bg-yellow-400 px-2 py-1 border-2 border-black -rotate-1">
                            Vergelijkingsgidsen
                        </span>
                    </h2>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed mb-5">
                        Nog aan het twijfelen tussen WerkCV en andere routes? Gebruik deze pagina&apos;s als je keuze eerder gaat over tooltype, prijsmodel of ATS-aanpak dan over een losse productvraag.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                        {comparisonGuides.map((guide) => (
                            <Link
                                key={guide.href}
                                href={guide.href}
                                className="block bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 transition-colors"
                            >
                                <p className="text-sm font-black text-black">{guide.title}</p>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-700">{guide.body}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-yellow-400 border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black text-black mb-3">Nog vragen?</h2>
                        <p className="font-medium text-black mb-6">
                            Heb je een vraag die hier niet beantwoord wordt? Neem gerust contact met ons op.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-black text-white px-8 py-3 font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-gray-800 transition-colors"
                        >
                            Begin je CV
                        </Link>
                    </div>
                </div>
            </main>

            {/* JSON-LD FAQPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.flatMap(section =>
                            section.questions.map(faq => ({
                                "@type": "Question",
                                "name": faq.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.a,
                                },
                            }))
                        ),
                    }),
                }}
            />
            {softwareApplicationJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
                />
            )}

            <Footer />
        </div>
    );
}

