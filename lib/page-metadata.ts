import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.baseUrl;
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph-image`;

type BuildDutchMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords?: string[];
  type?: "website" | "article";
  languages?: Record<string, string>;
};

export function buildDutchMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  languages,
}: BuildDutchMetadataInput): Metadata {
  const canonical = path === "/" ? BASE_URL : `${BASE_URL}${path}`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterSite,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
