import { aiDiscoveryUpdatedAt, serviceCapabilities, siteBaseUrl } from "@/lib/ai-discovery";
import { siteConfig } from "@/config/site";

export const revalidate = 86400;

export function GET() {
  return Response.json(
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "WerkCV CV builder",
      provider: {
        "@type": "Organization",
        name: "WerkCV",
        url: siteBaseUrl,
      },
      areaServed: "BE",
      availableLanguage: [siteConfig.language],
      serviceType: "Online CV builder for Belgian job seekers",
      description:
        "WerkCV helps users create and improve CVs for the Belgian job market. The individual job seeker model is free to start and uses a one-time payment at PDF download.",
      offers: {
        "@type": "Offer",
        price: "4.99",
        priceCurrency: "EUR",
        description: "One-time payment for individual CV PDF download. No individual job seeker subscription.",
        url: `${siteBaseUrl}/prijzen`,
      },
      capabilities: serviceCapabilities,
      mainEntryPoint: `${siteBaseUrl}/cv-maken-belgie`,
      toolsEntryPoint: `${siteBaseUrl}/templates`,
      updatedAt: aiDiscoveryUpdatedAt,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
