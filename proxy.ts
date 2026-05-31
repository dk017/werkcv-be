import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const PRIMARY_HOST = siteConfig.domain;
const WWW_HOST = `www.${siteConfig.domain}`;
const INDEXABLE_EXACT_PATHS = new Set([
  "/",
  "/templates",
  "/editor",
  "/login",
  "/mijn-cvs",
  "/success",
  "/prijzen",
  "/faq",
  "/contact",
  "/privacy",
  "/voorwaarden",
  "/gratis-cv-template",
  "/cv-maken-zonder-abonnement",
  "/cv-maken-belgie",
  "/cv-voorbeeld-belgie",
  "/cv-template-vlaanderen",
  "/sollicitatiebrief-belgie",
  "/cv-maken-gratis",
  "/vakbonden-en-cv-belgie",
  "/studentenjob-650-uren",
  "/rss.xml",
  "/llms.txt",
  "/.well-known/ai.txt",
  "/ai/service.json",
  "/ai/summary.json",
  "/opengraph-image",
]);
const INDEXABLE_PREFIXES = ["/api/", "/_next/"];
const PUBLIC_FILE_PATTERN = /\.(?:txt|xml|png|jpg|jpeg|gif|webp|svg|ico|css|js|map|pdf)$/i;

function shouldNoindex(pathname: string) {
  if (INDEXABLE_EXACT_PATHS.has(pathname)) return false;
  if (INDEXABLE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false;
  if (PUBLIC_FILE_PATTERN.test(pathname)) return false;
  return true;
}

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const rawHost = forwardedHost ?? request.headers.get("host") ?? "";
  const hostname = rawHost.toLowerCase().split(":")[0];

  if (hostname === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = PRIMARY_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  if (shouldNoindex(request.nextUrl.pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};

