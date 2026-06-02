import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { applicationBundlePrice, cvDownloadPrice, profilePhotoPrice } from "@/lib/site-content";

export const metadata: Metadata = {
    title: `CV Maken België Prijs | ${cvDownloadPrice.display} Eenmalig | WerkCV`,
    description: `Maak gratis je cv in België en download voor ${cvDownloadPrice.display} per cv. Geen abonnement of automatische verlenging.`,
    keywords: [
        "cv maken kosten",
        "cv maker prijs",
        "cv downloaden prijs",
        "cv maken betaald",
        "cv betalen per download",
        "cv maken belgie prijs",
        "goedkoop cv maken belgie",
        "cv builder kosten",
        "professioneel cv prijs",
        "cv pdf kosten",
        "cv zonder abonnement",
        "eenmalig betalen cv",
    ],
    alternates: {
        canonical: `${siteConfig.baseUrl}/prijzen`,
        languages: {
            "nl-BE": `${siteConfig.baseUrl}/prijzen`,
            "nl-NL": "https://werkcv.nl/prijzen",
            "x-default": `${siteConfig.baseUrl}/prijzen`,
        },
    },
};

const priceBadges = [
    `Eenmalig ${cvDownloadPrice.display}`,
    `CV + profielfoto ${applicationBundlePrice.display}`,
    "Geen abonnement",
    "Later opnieuw downloaden",
] as const;

const pricingIntentCards = [
    {
        title: "CV maken betaald zonder maandabonnement",
        body: "Deze zoekterm gaat meestal niet over duur, maar over duidelijk. Mensen willen weten wat een CV kost, wanneer ze betalen en of er daarna nog maandkosten of verlengingen volgen.",
        href: "/cv-maken-gratis",
        label: "Bekijk de Belgische gratis-start route",
    },
    {
        title: "CV betalen per download in plaats van per maand",
        body: "Bij WerkCV zit de betaling op de definitieve PDF-download van het CV dat je wilt versturen. Je start gratis, bouwt je inhoud op, vergelijkt templates en betaalt pas wanneer je die versie echt wilt downloaden.",
        href: "/cv-maken-zonder-abonnement",
        label: "Lees hoe eenmalig betalen werkt",
    },
    {
        title: "CV maken en éénmalig betalen",
        body: "Deze zoekintentie gaat expliciet over een cv-builder zonder maandkost. Gebruik deze pagina als je het betaalmoment en de Belgische context duidelijk wilt zien.",
        href: "/cv-maken-eenmalig-betalen",
        label: "Bekijk éénmalig betalen",
    },
] as const;

const pricingFaqs = [
    { q: "Wat kost WerkCV precies?", a: `WerkCV kost ${cvDownloadPrice.display} per CV-download. Je start gratis, bouwt je CV op en betaalt pas wanneer je die definitieve PDF wilt downloaden.` },
    { q: "Wat kost de CV + profielfoto bundle?", a: `De bundle kost ${applicationBundlePrice.display}. Je krijgt de CV-download plus de AI-profielfoto add-on die los ${profilePhotoPrice.display} kost.` },
    { q: "Moet ik betalen om mijn CV te maken?", a: "Nee, het aanmaken en bewerken van je CV is volledig gratis. Je betaalt pas als je dat CV als PDF wilt downloaden." },
    { q: "Wat betekent cv maken betaald meestal?", a: "Meestal zoekt iemand een betaalde CV-tool met duidelijke kosten en zonder verrassingen achteraf. Voor WerkCV betekent dat: gratis starten en pas betalen wanneer je jouw definitieve PDF wilt downloaden." },
    { q: "Kan ik mijn CV per download betalen?", a: "Ja. Bij WerkCV betaal je eenmalig per CV wanneer je die definitieve PDF-download wilt doen. Voor datzelfde betaalde CV kun je later terugkomen, bewerken en opnieuw downloaden zonder opnieuw te betalen." },
    { q: "Is het een abonnement?", a: `Nee. Het is een eenmalige betaling van ${cvDownloadPrice.display} per CV. Geen automatische verlengingen en geen verborgen kosten.` },
    { q: "Kan ik mijn CV later nog bewerken?", a: "Ja. Na betaling blijft dat CV in je account staan en kun je het later opnieuw openen, bewerken, van template of kleur wisselen en opnieuw downloaden zonder opnieuw te betalen." },
    { q: "Wanneer betaal ik opnieuw?", a: "Alleen als je een nieuw CV als apart document aanmaakt. Voor een CV waarvoor je al hebt betaald, hoef je niet opnieuw te betalen om later nog een PDF te downloaden." },
    { q: "Welke betaalmethoden accepteren jullie?", a: "We accepteren gangbare betaalmethoden via onze beveiligde betalingspartner. Welke opties je ziet kan afhangen van je land en betaalgegevens." },
] as const;

// Keep this date in sync with the currently advertised price period.
const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "WerkCV - Professioneel CV Downloaden",
    "description": "Maak een professioneel, ATS-vriendelijk CV en download als PDF. Na betaling kun je hetzelfde CV later opnieuw downloaden.",
    "url": `${siteConfig.baseUrl}/prijzen`,
    "image": [
        `${siteConfig.baseUrl}/opengraph-image`,
    ],
    "brand": {
        "@type": "Brand",
        "name": "WerkCV.be",
    },
    "sku": "cv-download",
    "offers": {
        "@type": "Offer",
        "url": `${siteConfig.baseUrl}/prijzen`,
        "price": cvDownloadPrice.value,
        "priceCurrency": cvDownloadPrice.currency,
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
            "@type": "Organization",
            "name": "WerkCV.be",
            "url": siteConfig.baseUrl,
        },
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "doesNotShip": true,
        },
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "BE",
            "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
            "merchantReturnLink": `${siteConfig.baseUrl}/voorwaarden`,
        },
    },
};

export default function PrijzenPage() {
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
                        href="/editor"
                        className="text-sm font-bold text-black bg-yellow-400 px-3 py-1 border-2 border-black hover:bg-yellow-300 transition-colors"
                    >
                        Maak gratis je cv
                    </Link>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {priceBadges.map((badge) => (
                            <span
                                key={badge}
                                className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-black"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
                        CV maken kosten: eenmalig {cvDownloadPrice.display} per CV, geen abonnement
                    </h1>
                    <p className="text-lg font-medium text-black max-w-2xl mx-auto">
                        WerkCV kost {cvDownloadPrice.display} per CV-download. Wil je meteen je CV en LinkedIn-presentatie netjes maken, dan is er een CV + AI-profielfoto bundle voor {applicationBundlePrice.display}.
                    </p>
                    <p className="text-sm font-black text-black max-w-2xl mx-auto mt-3">
                        Je betaalt alleen voor je definitieve PDF-download. Geen proefperiode, geen automatische verlenging en niets om later op te zeggen.
                    </p>
                    <p className="text-sm font-medium text-gray-700 max-w-2xl mx-auto mt-3">
                        Wil je eerst precies zien hoe{" "}
                        <Link
                            href="/cv-maken-zonder-abonnement"
                            className="font-black text-black underline decoration-2 underline-offset-4"
                        >
                            eenmalig betalen
                        </Link>{" "}
                        zich verhoudt tot abonnementen? Bekijk dan eerst de vergelijking.
                    </p>
                    <p className="text-sm font-medium text-gray-700 max-w-2xl mx-auto mt-2">
                        Zoek je vooral op <span className="font-black text-black">cv maken betaald</span> of <span className="font-black text-black">cv betalen per download</span>? Dan is dit precies de pagina waar het prijsmodel wordt uitgelegd.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="mx-auto mb-16 grid max-w-4xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="bg-yellow-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 px-4 py-1 border-3 border-black font-black text-sm" style={{ borderWidth: '3px' }}>
                            MEEST GEKOZEN
                        </div>

                        <div className="text-center pt-4">
                            <div className="text-5xl font-black text-black mb-2">{cvDownloadPrice.display}</div>
                            <p className="text-lg font-bold text-gray-700 mb-2">Alleen je CV als PDF</p>
                            <p className="mb-6 text-sm font-bold text-gray-700">
                                Dit is de standaardroute: gratis bouwen, pas betalen wanneer je jouw definitieve CV wilt downloaden.
                            </p>

                            <ul className="text-left space-y-3 mb-8">
                                {[
                                    'Onbeperkt je CV bewerken',
                                    '13+ professionele templates',
                                    '12 kleurthema\'s per template',
                                    'ATS-vriendelijk PDF formaat',
                                    'Direct downloaden na betaling',
                                    'Later opnieuw downloaden zonder extra betaling',
                                    'Template en kleur later nog aanpassen',
                                    'Geen abonnement of verborgen kosten',
                                    'CV blijft opgeslagen voor later',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="bg-green-400 border-2 border-black w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="font-medium text-black">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/editor"
                                className="block w-full bg-yellow-400 text-black py-4 font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                            >
                                Maak gratis je CV
                            </Link>
                            <p className="mt-3 text-xs font-bold text-gray-700">
                                Afrekenen gebeurt pas wanneer je jouw PDF wilt downloaden.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 border-3 border-black font-black text-sm" style={{ borderWidth: '3px' }}>
                            OPTIONELE UPSELL
                        </div>

                        <div className="text-center pt-4">
                            <div className="text-5xl font-black text-black mb-2">{applicationBundlePrice.display}</div>
                            <p className="text-lg font-bold text-gray-600 mb-2">CV + AI-profielfoto</p>
                            <p className="mb-6 text-sm font-bold text-gray-700">
                                Voor wie direct ook een nette profielfoto voor CV of LinkedIn wil. Los samen {cvDownloadPrice.display} + {profilePhotoPrice.display}.
                            </p>

                            <ul className="text-left space-y-3 mb-8">
                                {[
                                    'Alles van de CV-download',
                                    '4 AI-profielfoto startvarianten',
                                    '2 inbegrepen verfijningen',
                                    'Geschikt voor CV en LinkedIn',
                                    'Geen abonnement of verborgen kosten',
                                    applicationBundlePrice.savingsDisplay
                                        ? `Bundelvoordeel: ${applicationBundlePrice.savingsDisplay}`
                                        : 'CV en profielfoto in één checkout',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="bg-green-400 border-2 border-black w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="font-medium text-black">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/editor"
                                className="block w-full bg-white text-black py-4 font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                            >
                                Start en kies later
                            </Link>
                            <p className="mt-3 text-xs font-bold text-gray-700">
                                Je hoeft de bundle niet vooraf te kiezen. De optie verschijnt pas bij downloaden.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="mb-16 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-600">
                        Prijsmodel
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-black">
                        Eerst bouwen, pas betalen als je wilt downloaden
                    </h2>
                    <p className="mt-3 text-sm md:text-base font-medium leading-relaxed text-gray-700">
                        WerkCV.be is bedoeld voor mensen die vooraf duidelijk willen weten waar ze aan toe zijn. Je start gratis, werkt je cv volledig af en betaalt pas bij de definitieve PDF-download.
                    </p>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="border-4 border-black bg-[#FFF4D6] p-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-600">
                                Typische abonnementsroute
                            </p>
                            <ul className="mt-3 space-y-2 text-sm font-medium text-gray-700">
                                <li>&bull; Gratis of goedkope instap</li>
                                <li>&bull; Daarna maandkosten of proefperiode</li>
                                <li>&bull; Later opzeggen als je niet oplet</li>
                            </ul>
                        </div>
                        <div className="border-4 border-black bg-yellow-300 p-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-black">
                                WerkCV.be
                            </p>
                            <ul className="mt-3 space-y-2 text-sm font-black text-black">
                                <li>&bull; Gratis starten</li>
                                <li>&bull; {cvDownloadPrice.display} per CV-download</li>
                                <li>&bull; Geen abonnement of automatische verlenging</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/cv-maken-zonder-abonnement"
                            className="border-2 border-black bg-yellow-200 px-3 py-2 text-sm font-black text-black hover:bg-yellow-300 transition-colors"
                        >
                            Bekijk hoe eenmalig betalen werkt
                        </Link>
                        <Link
                            href="/cv-maken-gratis"
                            className="border-2 border-black bg-white px-3 py-2 text-sm font-black text-black hover:bg-gray-100 transition-colors"
                        >
                            Bekijk de gratis-start route
                        </Link>
                    </div>
                </section>

                <div className="mb-16 grid gap-6 md:grid-cols-2">
                    {pricingIntentCards.map((card) => (
                        <article key={card.title} className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-2xl font-black text-black">{card.title}</h2>
                            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700">
                                {card.body}
                            </p>
                            <Link
                                href={card.href}
                                className="mt-5 inline-block border-2 border-black bg-yellow-200 px-3 py-2 text-sm font-black text-black hover:bg-yellow-300 transition-colors"
                            >
                                {card.label}
                            </Link>
                        </article>
                    ))}
                </div>

                {/* Comparison */}
                <div className="mb-16">
                    <h2 className="text-2xl font-black text-black text-center mb-8">Waarom WerkCV.be?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-12 h-12 bg-red-400 border-3 border-black flex items-center justify-center mb-4 rotate-2" style={{ borderWidth: '3px' }}>
                                <span className="text-xl font-black">X</span>
                            </div>
                            <h3 className="font-black text-black mb-2">Andere CV-sites</h3>
                            <ul className="space-y-2 text-sm font-medium text-gray-700">
                                <li>&bull; Abonnement van &euro;10-25 per maand</li>
                                <li>&bull; Automatische verlenging</li>
                                <li>&bull; Gratis proefperiode als lokmiddel</li>
                                <li>&bull; Opzeggen is lastig</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                            <div className="absolute -top-3 -right-3 bg-green-400 border-3 border-black px-2 py-0.5 text-xs font-black rotate-3" style={{ borderWidth: '3px' }}>
                                WerkCV.be
                            </div>
                            <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center mb-4 -rotate-2" style={{ borderWidth: '3px' }}>
                                <span className="text-xl font-black">&hearts;</span>
                            </div>
                            <h3 className="font-black text-black mb-2">WerkCV.be</h3>
                            <ul className="space-y-2 text-sm font-black text-black">
                                <li>&bull; Eenmalig {cvDownloadPrice.display} per CV</li>
                                <li>&bull; Geen abonnement</li>
                                <li>&bull; Later opnieuw bewerken en downloaden</li>
                                <li>&bull; Eerlijk en transparant</li>
                            </ul>
                        </div>
                        <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-12 h-12 bg-gray-300 border-3 border-black flex items-center justify-center mb-4 -rotate-1" style={{ borderWidth: '3px' }}>
                                <span className="text-xl font-black">?</span>
                            </div>
                            <h3 className="font-black text-black mb-2">Zelf doen in Word</h3>
                            <ul className="space-y-2 text-sm font-medium text-gray-700">
                                <li>&bull; Uren bezig met opmaak</li>
                                <li>&bull; Niet ATS-geoptimaliseerd</li>
                                <li>&bull; Moeilijk professioneel te krijgen</li>
                                <li>&bull; Geen templates beschikbaar</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-600 mb-2">
                            Vergelijking
                        </p>
                        <p className="text-sm md:text-base font-medium text-gray-700">
                            Twijfel je tussen een eenmalige cv-builder en andere routes? Bekijk dan deze Belgische instappagina&apos;s:
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Link href="/cv-maken-zonder-abonnement" className="border-2 border-black bg-yellow-200 px-3 py-2 text-sm font-black text-black hover:bg-yellow-300 transition-colors">
                                CV zonder abonnement
                            </Link>
                            <Link href="/cv-maken-eenmalig-betalen" className="border-2 border-black bg-yellow-200 px-3 py-2 text-sm font-black text-black hover:bg-yellow-300 transition-colors">
                                CV éénmalig betalen
                            </Link>
                            <Link href="/cv-maken-belgie" className="border-2 border-black bg-blue-200 px-3 py-2 text-sm font-black text-black hover:bg-blue-300 transition-colors">
                                CV maken in België
                            </Link>
                            <Link href="/cv-maken-gratis" className="border-2 border-black bg-yellow-200 px-3 py-2 text-sm font-black text-black hover:bg-yellow-300 transition-colors">
                                Gratis cv maken
                            </Link>
                            <Link href="/ats-cv-template" className="border-2 border-black bg-[#FFFEF9] px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                                ATS cv template
                            </Link>
                            <Link href="/gratis-cv-template" className="border-2 border-black bg-[#FFFEF9] px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                                Gratis cv template
                            </Link>
                            <Link href="/cv-voorbeeld-belgie" className="border-2 border-black bg-[#FFFEF9] px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                                CV voorbeeld België
                            </Link>
                            <Link href="/cv-template-vlaanderen" className="border-2 border-black bg-[#FFFEF9] px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                                CV template Vlaanderen
                            </Link>
                            <Link href="/sollicitatiebrief-belgie" className="border-2 border-black bg-[#FFFEF9] px-3 py-2 text-sm font-black text-black hover:bg-yellow-100 transition-colors">
                                Sollicitatiebrief België
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div>
                    <h2 className="text-2xl font-black text-black text-center mb-8">Veelgestelde vragen over prijzen</h2>
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {pricingFaqs.map((faq, i) => (
                            <details key={i} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group">
                                <summary className="p-4 font-black text-black cursor-pointer flex items-center justify-between">
                                    {faq.q}
                                    <span className="text-xl ml-2 group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <div className="px-4 pb-4 font-medium text-gray-700 border-t-2 border-black pt-3">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </main>

            {/* JSON-LD Product Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productJsonLd),
                }}
            />

            <Footer />
        </div>
    );
}

