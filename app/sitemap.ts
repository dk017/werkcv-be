import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const baseUrl = siteConfig.baseUrl;

const routes = [
  "/",
  "/templates",
  "/gratis-cv-template",
  "/prijzen",
  "/faq",
  "/contact",
  "/privacy",
  "/voorwaarden",
  "/cv-maken-zonder-abonnement",
  "/cv-maken-belgie",
  "/cv-voorbeeld-belgie",
  "/cv-template-vlaanderen",
  "/sollicitatiebrief-belgie",
  "/cv-maken-gratis",
  "/vakbonden-en-cv-belgie",
  "/studentenjob-650-uren",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: route === "/" ? baseUrl : `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: index < 6 ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/cv-maken-gratis" ? 0.92 : 0.78,
  }));
}

