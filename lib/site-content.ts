import { siteConfig } from "@/config/site";

export const siteUrl = siteConfig.baseUrl;
export const siteName = "WerkCV";

export const cvDownloadPrice = {
  display: "€4,99",
  value: "4.99",
  amountCents: 499,
  currency: "EUR",
};

export const profilePhotoPrice = {
  display: "€9,99",
  value: "9.99",
  amountCents: 999,
  currency: "EUR",
};

export const applicationBundlePrice = {
  display: "€14,99",
  value: "14.99",
  amountCents: 1499,
  savingsDisplay: "",
  currency: "EUR",
};

export const homepageFaqItems = [
  {
    question: "Werkt WerkCV voor de Belgische arbeidsmarkt?",
    answer:
      "Ja. WerkCV is afgestemd op de Belgische arbeidsmarkt. Of je nu solliciteert via Jobat, Stepstone of rechtstreeks bij een Belgische werkgever, je cv blijft rustig, professioneel en recruiter-proof.",
  },
  {
    question: "Moet ik een foto op mijn cv zetten in België?",
    answer:
      "In België is een professionele foto op je cv gebruikelijker dan in Nederland. Het is niet verplicht, maar veel Belgische werkgevers vinden het normaal. WerkCV ondersteunt zowel cv's met foto als zonder foto.",
  },
  {
    question: "Wat kost WerkCV?",
    answer:
      "Je betaalt eenmalig €4,99 per cv-download. Geen abonnement, geen automatische verlenging en geen verborgen maandelijkse kosten.",
  },
  {
    question: "Verschilt een Belgisch cv van een Nederlands cv?",
    answer:
      "Licht. Belgische werkgevers verwachten iets vaker een foto en soms extra persoonlijke context. De opbouw en lengte blijven meestal vergelijkbaar: helder, relevant en meestal één tot twee pagina's.",
  },
];

export type SiteAggregateRating = {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
};

// Keep this null until WerkCV has a real, publicly visible rating source with a
// defensible review count. Do not invent aggregate-review data for schema.
export const siteAggregateRating: SiteAggregateRating | null = null;
