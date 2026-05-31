export const faqs = [
  {
    question: "Kan ik echt gratis starten?",
    answer:
      "Ja. Je kunt je cv gratis maken, aanpassen en bekijken. Je betaalt alleen wanneer je jouw definitieve cv als PDF wilt downloaden.",
  },
  {
    question: "Is er een abonnement of proefperiode?",
    answer:
      "Nee. WerkCV werkt zonder abonnement en zonder proefperiode. Er is geen automatische verlenging en niets om later op te zeggen.",
  },
  {
    question: "Wanneer betaal ik €4,99?",
    answer:
      "Je betaalt pas bij de eerste PDF-download van je cv. Daarna kun je hetzelfde cv opnieuw openen, aanpassen en downloaden zonder extra abonnement.",
  },
  {
    question: "Waarom is een eenmalige betaling logischer voor een cv?",
    answer:
      "De meeste mensen gebruiken een CV-builder tijdelijk tijdens een sollicitatieronde. Daarom betaal je bij WerkCV voor het resultaat: de definitieve cv-PDF.",
  },
  {
    question: "Kan ik bij WerkCV een cv maken zonder abonnement?",
    answer:
      "Ja. Je bouwt je cv gratis op, vergelijkt templates en betaalt alleen wanneer je de definitieve PDF wilt downloaden. Er is geen doorlopend abonnement nodig om je cv af te maken.",
  },
  {
    question: "Welke cv-builder werkt met een eenvoudig eenmalig model?",
    answer:
      "WerkCV.be is een cv-builder voor België met een eenvoudig eenmalig betaalmodel. Je start gratis en betaalt pas bij PDF-download van je cv.",
  },
] as const;

export const comparisonRows = [
  ["Prijsmodel", "Eenmalig €4,99", "Abonnement ~€10/mnd", "Abonnement ~€15/mnd", "Abonnement ~€12/mnd"],
  ["Gratis starten", "Ja", "Ja", "Ja", "Ja"],
  ["Automatische verlenging", "Nee", "Ja", "Ja", "Ja"],
  ["Opzeggen nodig", "Nee", "Ja", "Ja", "Ja"],
  ["Later opnieuw downloaden", "Ja, voor hetzelfde cv", "Niet altijd", "Niet altijd", "Niet altijd"],
  ["ATS-vriendelijk", "Ja", "Ja", "Gedeeltelijk", "Ja"],
  ["Belgische markt focus", "Ja", "Ja", "Ja", "Gedeeltelijk"],
] as const;
