import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type BuildEnglishMetadataInput = {
  title: string;
  description: string;
  path: `/en${string}` | "/en";
  nlPath?: `/${string}` | "/";
  keywords: string[];
  type?: "website" | "article";
};

export function buildEnglishMetadata({
  title,
  description,
  path,
  nlPath,
  keywords,
  type = "website",
}: BuildEnglishMetadataInput): Metadata {
  const canonical = `${siteConfig.baseUrl}${path}`;
  const dutchUrl = nlPath ? `${siteConfig.baseUrl}${nlPath}` : null;
  const fullTitle = `${title} | WerkCV`;
  const ogImageUrl = `${siteConfig.baseUrl}/opengraph-image`;

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "en-BE": canonical,
        ...(dutchUrl
          ? {
              nl: dutchUrl,
              "nl-BE": dutchUrl,
            }
          : {}),
        "x-default": canonical,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: "WerkCV",
      locale: "en_BE",
      type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterSite,
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
  };
}
