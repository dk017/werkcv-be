import { aiDiscoveryUpdatedAt, aiFaqItems, siteBaseUrl } from "@/lib/ai-discovery";

export const revalidate = 86400;

export function GET() {
  return Response.json(
    {
      site: "WerkCV",
      url: siteBaseUrl,
      updatedAt: aiDiscoveryUpdatedAt,
      faq: aiFaqItems,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
