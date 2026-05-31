import { aiDiscoveryUpdatedAt, primaryAiPages, siteBaseUrl } from "@/lib/ai-discovery";
import { siteConfig } from "@/config/site";

export const revalidate = 86400;

export function GET() {
  const lines = [
    "# WerkCV",
    "",
    "> WerkCV is an online CV builder for the Belgian job market. Users can create a professional CV, use practical templates and download a PDF after a one-time payment. WerkCV does not use a subscription model for individual job seekers.",
    "",
    `Website: ${siteBaseUrl}`,
    `Language: Dutch for Belgium`,
    `Last updated: ${aiDiscoveryUpdatedAt}`,
    "",
    "## Core pages",
    "",
    ...primaryAiPages.map((page) => `- [${page.title}](${page.url}): ${page.description}`),
    "",
    "## Useful machine-readable endpoints",
    "",
    `- [Sitemap](${siteBaseUrl}/sitemap.xml)`,
    `- [RSS feed](${siteBaseUrl}/rss.xml)`,
    `- [AI site summary](${siteBaseUrl}/ai/summary.json)`,
    `- [AI FAQ](${siteBaseUrl}/ai/faq.json)`,
    `- [AI service description](${siteBaseUrl}/ai/service.json)`,
    "",
    "## Access guidance",
    "",
    "Public marketing pages, guides and tools may be crawled for indexing and answer generation when allowed by robots.txt. Do not access private editor sessions, authenticated user pages, checkout sessions or API endpoints.",
    "",
    "## Contact",
    "",
    `- Site: ${siteBaseUrl}/contact`,
    `- Email: ${siteConfig.contactEmail}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
