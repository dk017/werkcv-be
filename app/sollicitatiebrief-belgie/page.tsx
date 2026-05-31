import BelgiumSeoPage from "@/components/belgium/BelgiumSeoPage";
import { buildDutchMetadata } from "@/lib/page-metadata";

export const metadata = buildDutchMetadata({
  title: "Sollicitatiebrief Voorbeeld België | CV Maken België | WerkCV",
  description:
    "Bekijk hoe een motivatiebrief in België meestal wordt opgebouwd en koppel hem aan een professioneel cv zonder abonnement",
  path: "/sollicitatiebrief-belgie",
  keywords: ["sollicitatiebrief voorbeeld belgie", "motivatiebrief belgie"],
  languages: {
    "nl-BE": "https://werkcv.be/sollicitatiebrief-belgie",
    "nl-NL": "https://werkcv.nl/",
  },
});

export default function Page() {
  return (
    <BelgiumSeoPage
      eyebrow="Motivatiebrief"
      title="Sollicitatiebrief Voorbeeld België"
      intro="In België wordt vaak net zo goed naar je motivatiebrief gekeken als naar je cv. Veel werkgevers spreken eerder van een motivatiebrief dan van een sollicitatiebrief, maar de kern blijft hetzelfde: kort, relevant en direct afgestemd op de functie."
      sections={[
        {
          heading: "Wat een Belgische motivatiebrief sterk maakt",
          paragraphs: [
            "Een goede brief in België is persoonlijk genoeg om op te vallen, maar compact genoeg om snel te lezen. Open met de functie waarop je solliciteert en waarom net die rol bij je past. Daarna koppel je je ervaring of opleiding aan wat de werkgever nodig heeft. Sluit af met een rustige uitnodiging voor een gesprek.",
            "Vermijd lange algemene alinea’s over motivatie zonder bewijs. Recruiters willen niet alleen lezen dat je enthousiast bent, maar vooral waarom jouw profiel aansluit. Dat betekent: concrete voorbeelden, relevante ervaring en taal die past bij de vacature.",
          ],
        },
        {
          heading: "Motivatiebrief en cv moeten elkaar aanvullen",
          paragraphs: [
            "Je brief hoeft je cv niet te herhalen. Het cv toont de feiten, de brief legt uit waarom die feiten relevant zijn voor deze werkgever. In België werkt die combinatie goed: een nette, duidelijke cv-structuur plus een korte brief die net wat meer context en intentie geeft.",
            "Zeker wanneer je solliciteert op functies met klantcontact, administratie, zorg of overheid, helpt een gerichte motivatiebrief om de stap van passend profiel naar serieuze kandidaat te maken. Gebruik hem dus strategisch, niet als standaardtekst die je overal inzet.",
          ],
        },
        {
          heading: "Praktische route zonder onnodig gedoe",
          paragraphs: [
            "De meeste kandidaten lopen niet vast op motivatie, maar op tempo en structuur. Ze hebben een vacature, willen reageren en verliezen tijd aan oude documenten, opmaak of verspreide bestanden. Daarom loont het om je cv eerst goed neer te zetten en daarna je brief daarop te laten aansluiten.",
            "WerkCV richt zich op dat cv-deel: professioneel, snel en zonder abonnement. Zodra je cv duidelijk staat, wordt het ook eenvoudiger om een passende motivatiebrief te schrijven die daar logisch op voortbouwt.",
          ],
        },
      ]}
      primaryCta={{ href: "/gratis-cv-template", label: "Bekijk gratis cv-template" }}
      secondaryCta={{ href: "/editor", label: "Maak je cv online" }}
      relatedLinks={[
        { href: "/cv-maken-belgie", label: "CV maken in België" },
        { href: "/cv-voorbeeld-belgie", label: "CV voorbeeld België" },
        { href: "/cv-template-vlaanderen", label: "CV template Vlaanderen" },
      ]}
    />
  );
}
