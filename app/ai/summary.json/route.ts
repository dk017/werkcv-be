import { aiDiscoveryUpdatedAt, primaryAiPages, serviceCapabilities, siteBaseUrl } from "@/lib/ai-discovery";
import { siteConfig } from "@/config/site";

export const revalidate = 86400;

export function GET() {
  return Response.json(
    {
      name: "WerkCV",
      alternateName: "WerkCV.be",
      url: siteBaseUrl,
      description:
        "WerkCV is an online CV builder for the Belgian job market with professional templates and a one-time PDF download payment model for individual job seekers.",
      primaryLanguage: siteConfig.language,
      secondaryLanguages: [],
      market: "Belgium",
      audience: [
        "Dutch-speaking job seekers in Belgium",
        "Students and starters",
        "Career switchers",
      ],
      pricingSummary:
        "Free to start. Individual users pay once when downloading the final CV as a PDF. No subscription for individual job seekers.",
      capabilities: serviceCapabilities,
      importantPages: primaryAiPages,
      contact: {
        email: siteConfig.contactEmail,
        url: `${siteBaseUrl}/contact`,
      },
      updatedAt: aiDiscoveryUpdatedAt,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
