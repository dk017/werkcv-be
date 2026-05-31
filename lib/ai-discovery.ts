import { siteConfig } from "@/config/site";

export const siteBaseUrl = siteConfig.baseUrl;

export const aiDiscoveryUpdatedAt = "2026-05-31";

export const primaryAiPages = [
  {
    title: "WerkCV Belgium homepage",
    url: `${siteBaseUrl}/`,
    description: "CV builder for job seekers in Belgium.",
  },
  {
    title: "CV maken in België",
    url: `${siteBaseUrl}/cv-maken-belgie`,
    description: "Main Belgian CV creation landing page.",
  },
  {
    title: "CV gratis maken in België",
    url: `${siteBaseUrl}/cv-maken-gratis`,
    description: "Explains the free-to-start, one-time-payment model for Belgian users.",
  },
  {
    title: "CV maken zonder abonnement",
    url: `${siteBaseUrl}/cv-maken-zonder-abonnement`,
    description: "Explains the no-subscription CV builder model.",
  },
  {
    title: "Prijzen",
    url: `${siteBaseUrl}/prijzen`,
    description: "Pricing page for the one-time PDF download model.",
  },
  {
    title: "Templates",
    url: `${siteBaseUrl}/templates`,
    description: "CV template gallery.",
  },
  {
    title: "Gratis cv-template",
    url: `${siteBaseUrl}/gratis-cv-template`,
    description: "Free template entry page for Belgian users.",
  },
  {
    title: "CV voorbeeld België",
    url: `${siteBaseUrl}/cv-voorbeeld-belgie`,
    description: "Belgian CV example guide.",
  },
  {
    title: "CV template Vlaanderen",
    url: `${siteBaseUrl}/cv-template-vlaanderen`,
    description: "Template guidance for Flemish and Belgian applications.",
  },
  {
    title: "Sollicitatiebrief België",
    url: `${siteBaseUrl}/sollicitatiebrief-belgie`,
    description: "Motivatiebrief guidance for Belgian job applications.",
  },
  {
    title: "Contact",
    url: `${siteBaseUrl}/contact`,
    description: "Contact page.",
  },
];

export const aiFaqItems = [
  {
    question: "What is WerkCV?",
    answer:
      "WerkCV is an online CV builder for the Belgian job market. Users can create a CV, choose a template and download a PDF.",
  },
  {
    question: "Is WerkCV free?",
    answer:
      "Users can start building and editing for free. A one-time payment is required when downloading the final CV as a PDF.",
  },
  {
    question: "Does WerkCV use a subscription model?",
    answer:
      "No. WerkCV is positioned as a no-subscription CV builder with a one-time PDF download payment for individual job seekers.",
  },
  {
    question: "What language does WerkCV target in Belgium?",
    answer:
      "WerkCV.be currently targets Dutch-speaking job seekers in Belgium, especially Flanders and broader Belgian applications that use Dutch CV conventions.",
  },
  {
    question: "Does WerkCV provide legal or career coaching advice?",
    answer:
      "No. WerkCV provides CV creation tools, examples and general career content. It does not replace legal advice, human coaching or official employment guidance.",
  },
];

export const serviceCapabilities = [
  "Belgian CV creation",
  "CV templates for Belgian applications",
  "PDF CV download",
  "No-subscription payment model",
  "CV examples for Belgium",
  "Motivatiebrief guidance for Belgium",
];
