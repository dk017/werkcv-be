import { aiDiscoveryUpdatedAt, siteBaseUrl } from "@/lib/ai-discovery";
import { siteConfig } from "@/config/site";

export const revalidate = 86400;

export function GET() {
  const body = [
    "# WerkCV AI crawler guidance",
    "",
    `Site: ${siteBaseUrl}`,
    `Updated: ${aiDiscoveryUpdatedAt}`,
    `Contact: ${siteConfig.contactEmail}`,
    "",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /editor",
    "Disallow: /en/editor",
    "Disallow: /mijn-cvs",
    "Disallow: /login",
    "Disallow: /success",
    "",
    "Public pages may be used for indexing, retrieval and answer generation when the crawler also respects robots.txt. Private user data, generated CV documents, checkout flows and API endpoints must not be accessed.",
    "",
    `LLMS-TXT: ${siteBaseUrl}/llms.txt`,
    `Sitemap: ${siteBaseUrl}/sitemap.xml`,
    `RSS: ${siteBaseUrl}/rss.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
