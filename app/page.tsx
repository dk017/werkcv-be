import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { FAQJsonLd, HowToJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import {
  cvDownloadPrice,
  homepageFaqItems,
  siteAggregateRating,
  siteName,
  siteUrl,
} from "@/lib/site-content";

const homepageHowToSteps = [
  {
    name: "Kies een template",
    text: "Selecteer een rustige, professionele cv-template die past bij Belgische werkgevers en recruiters.",
  },
  {
    name: "Vul je gegevens in",
    text: "Werk je profiel, werkervaring, opleiding en vaardigheden uit in de editor met live preview.",
  },
  {
    name: "Download als PDF",
    text: `Start gratis en betaal eenmalig ${cvDownloadPrice.display} wanneer je je CV als PDF wilt downloaden.`,
  },
];

const homepageWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "CV Maken in België | Professioneel CV Opstellen | WerkCV",
  url: siteUrl,
  description:
    "Maak eenvoudig een professioneel cv in België. Eénmalig €4,99, geen abonnement en direct downloaden als PDF.",
  inLanguage: siteConfig.language,
  isPartOf: {
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  },
};

const homepageSoftwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteName,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "Online cv-bouwer voor de Belgische arbeidsmarkt. Start gratis, werk je cv af en betaal éénmalig bij download.",
  inLanguage: siteConfig.language,
  areaServed: {
    "@type": "Country",
    name: "Belgium",
  },
  offers: {
    "@type": "Offer",
    price: cvDownloadPrice.value,
    priceCurrency: cvDownloadPrice.currency,
    availability: "https://schema.org/InStock",
    url: `${siteUrl}/prijzen`,
  },
  featureList: [
    "Professionele cv-templates voor België",
    "Gratis starten zonder abonnement",
    "Eenmalige PDF-download",
    "Belgische arbeidsmarkt focus",
    "Later opnieuw downloaden",
  ],
  provider: {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  },
  ...(siteAggregateRating
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: siteAggregateRating.ratingValue,
          reviewCount: siteAggregateRating.reviewCount,
          bestRating: siteAggregateRating.bestRating ?? 5,
          worstRating: siteAggregateRating.worstRating ?? 1,
        },
      }
    : {}),
};

export const metadata: Metadata = {
  title: {
    absolute: "CV Maken in België | Professioneel CV Opstellen | WerkCV",
  },
  description:
    "Maak eenvoudig een professioneel cv in België. Eénmalig €4,99, geen abonnement, geen verborgen kosten en direct downloaden als PDF",
  keywords: [
    "cv maken belgië",
    "cv opstellen belgië",
    "professioneel cv belgie",
    "cv builder belgië",
    "cv gratis maken belgie",
    "cv template vlaanderen",
    "sollicitatiebrief belgie",
  ],
  alternates: {
    canonical: siteConfig.baseUrl,
    languages: {
      "nl-BE": "https://werkcv.be/",
      "nl-NL": "https://werkcv.nl/",
      "x-default": "https://werkcv.be/",
    },
  },
  openGraph: {
    title: "CV Maken in België | WerkCV",
    description:
      "Professioneel cv opstellen voor de Belgische arbeidsmarkt. Eénmalig €4,99. Geen abonnement.",
    url: siteConfig.baseUrl,
    siteName: siteConfig.siteName,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WerkCV - CV maken in België",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterSite,
    title: "CV Maken in België | WerkCV",
    description:
      "Professioneel cv opstellen voor de Belgische arbeidsmarkt. Eénmalig €4,99. Geen abonnement.",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageWebPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSoftwareApplicationJsonLd) }}
      />
      <FAQJsonLd questions={homepageFaqItems} />
      <HowToJsonLd
        name="Hoe maak je een professioneel cv voor de Belgische arbeidsmarkt"
        description="Gebruik WerkCV om gratis te starten, een rustige template te kiezen en later als PDF te downloaden."
        steps={homepageHowToSteps}
      />
      <HomePageClient />
    </>
  );
}
