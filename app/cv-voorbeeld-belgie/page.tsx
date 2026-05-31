import BelgiumSeoPage from "@/components/belgium/BelgiumSeoPage";
import { buildDutchMetadata } from "@/lib/page-metadata";

export const metadata = buildDutchMetadata({
  title: "CV Voorbeeld België | CV Maken België | WerkCV",
  description:
    "Bekijk een sterk cv voorbeeld voor België en zie hoe je werkervaring, profiel en talen rustig opbouwt voor Vlaamse recruiters",
  path: "/cv-voorbeeld-belgie",
  keywords: ["cv voorbeeld belgië", "cv voorbeeld gratis belgie"],
  languages: {
    "nl-BE": "https://werkcv.be/cv-voorbeeld-belgie",
    "nl-NL": "https://werkcv.nl/",
  },
});

export default function Page() {
  return (
    <BelgiumSeoPage
      eyebrow="Voorbeeld"
      title="CV Voorbeeld België — Praktisch en Duidelijk"
      intro="Een goed Belgisch cv laat in één oogopslag zien wie je bent, wat je hebt gedaan en voor welke rollen je geschikt bent. Met een duidelijk voorbeeld voorkom je dat je blijft hangen in volgorde, opmaak of wat je wel en niet moet vermelden."
      sections={[
        {
          heading: "Hoe een sterk Belgisch cv meestal is opgebouwd",
          paragraphs: [
            "Bovenaan staan je naam, contactgegevens, woonplaats en eventueel LinkedIn. In België kiezen veel kandidaten ook voor een professionele foto, al is dat geen harde verplichting. Daarna volgt een korte profieltekst: twee tot vier regels waarin je richting, ervaring en toegevoegde waarde meteen duidelijk worden.",
            "Daaronder zet je werkervaring in omgekeerd chronologische volgorde, gevolgd door opleiding, vaardigheden en talen. Zeker in België is een heldere taalvermelding nuttig. Recruiters zoeken vaak snel naar Nederlands, Frans en Engels, afhankelijk van de regio en functie. Maak dat dus concreet en scanbaar.",
          ],
        },
        {
          heading: "Wat je beter vermijdt",
          paragraphs: [
            "Veel cv’s verliezen kwaliteit door te veel decoratie, te weinig focus of een te algemeen profiel. Vermijd lange blokken tekst zonder resultaat, generieke omschrijvingen zoals 'gemotiveerd teamspeler' en rommelige opmaak die afleidt van de inhoud. Een recruiter wil snel zien waar jij hebt gewerkt, welke resultaten je hebt behaald en voor welke volgende stap je geschikt bent.",
            "Het helpt ook om je cv aan te passen aan de functie. Een administratief profiel vraagt om andere accenten dan een commerciële of technische rol. Met een goed voorbeeld als basis kun je die verschillen snel verwerken zonder telkens opnieuw te beginnen.",
          ],
        },
        {
          heading: "Van voorbeeld naar eigen cv",
          paragraphs: [
            "Een voorbeeld is vooral waardevol als je het direct kunt vertalen naar je eigen profiel. Gebruik daarom een voorbeeld om de structuur over te nemen, niet om zinnen letterlijk te kopiëren. Vervang de profieltekst, benoem je eigen resultaten en kies alleen vaardigheden die echt bij je werk passen.",
            "WerkCV is daar praktisch voor ingericht: je ziet meteen hoe je cv eruitziet, je kunt snel herschrijven en je houdt de opmaak rustig. Zo kom je sneller van een los voorbeeld naar een cv dat echt klaar is om te versturen in België.",
          ],
        },
      ]}
      primaryCta={{ href: "/gratis-cv-template", label: "Bekijk gratis cv-voorbeeld" }}
      secondaryCta={{ href: "/editor", label: "Online cv maken" }}
      relatedLinks={[
        { href: "/cv-maken-belgie", label: "CV maken in België" },
        { href: "/cv-template-vlaanderen", label: "CV template Vlaanderen" },
        { href: "/sollicitatiebrief-belgie", label: "Sollicitatiebrief België" },
      ]}
    />
  );
}
