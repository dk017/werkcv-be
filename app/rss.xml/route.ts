import { primaryAiPages, siteBaseUrl } from "@/lib/ai-discovery";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = primaryAiPages
    .slice(0, 24)
    .map((page) => ({
      title: page.title,
      link: page.url,
      description: page.description,
      pubDate: new Date().toUTCString(),
    }))
    .map((item) => [
      "    <item>",
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${escapeXml(item.link)}</link>`,
      `      <guid>${escapeXml(item.link)}</guid>`,
      `      <description>${escapeXml(item.description)}</description>`,
      `      <pubDate>${item.pubDate}</pubDate>`,
      "    </item>",
    ].join("\n"))
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>WerkCV België updates</title>",
    `    <link>${siteBaseUrl}</link>`,
    "    <description>Belgische CV-builder pagina's, templates en uitleg over het prijsmodel van WerkCV.</description>",
    "    <language>nl-BE</language>",
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    "    <ttl>60</ttl>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
