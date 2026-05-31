import BelgiumSeoPage from "@/components/belgium/BelgiumSeoPage";
import { buildDutchMetadata } from "@/lib/page-metadata";

export const metadata = buildDutchMetadata({
  title: "CV Template Vlaanderen | CV Maken België | WerkCV",
  description:
    "Gebruik een rustige cv-template voor Vlaanderen en bouw sneller een professioneel cv voor Belgische sollicitaties",
  path: "/cv-template-vlaanderen",
  keywords: ["cv template vlaanderen", "cv sjabloon belgie", "cv maken vlaanderen"],
  languages: {
    "nl-BE": "https://werkcv.be/cv-template-vlaanderen",
    "nl-NL": "https://werkcv.nl/",
  },
});

export default function Page() {
  return (
    <BelgiumSeoPage
      eyebrow="Vlaanderen"
      title="CV Template Vlaanderen | Gratis CV Sjabloon"
      intro="Een goede cv-template voor Vlaanderen helpt je sneller solliciteren zonder dat je tijd verliest aan opmaak. WerkCV geeft je een rustige basis waarmee je professioneel overkomt bij Vlaamse werkgevers en recruiters."
      sections={[
        {
          heading: "Waarom een rustige template beter werkt",
          paragraphs: [
            "In Vlaanderen werkt een cv meestal het best als het direct leesbaar is: duidelijke koppen, genoeg witruimte en een logische volgorde. Een druk design lijkt soms creatiever, maar maakt het voor recruiters moeilijker om snel te zien wat je hebt gedaan en waar je geschikt voor bent.",
            "Daarom is een goed cv-sjabloon vooral een praktisch hulpmiddel. Het moet je helpen structuur aan te brengen, niet afleiden van je ervaring. WerkCV houdt de layout bewust kalm, zodat de focus blijft liggen op je profiel, werkervaring, opleiding en talen.",
          ],
        },
        {
          heading: "Waar Vlaamse werkgevers vaak op letten",
          paragraphs: [
            "Werkgevers in Vlaanderen willen snel zien of je ervaring relevant is voor de functie en of je taalniveau past bij de rol. Zeker bij klantcontact, administratie en commerciële functies is het slim om Nederlands, Frans en Engels netjes te ordenen. Ook een professionele foto komt in Vlaanderen vaker voor dan in Nederland, al blijft dat een keuze.",
            "Solliciteer je via VDAB, Jobat of rechtstreeks bij een werkgever, dan is de eerste halve pagina vaak beslissend. Die moet meteen duidelijk maken wat jouw richting is. Een goed template helpt je om die opening scherp te houden.",
          ],
        },
        {
          heading: "Gebruik een sjabloon als start, niet als eindstation",
          paragraphs: [
            "Een cv-template bespaart tijd, maar je cv wordt pas sterk als je de inhoud per vacature aanscherpt. Pas je profieltekst aan, benoem je resultaten concreet en laat overbodige details weg. Zo voorkom je dat je cv netjes oogt, maar inhoudelijk te algemeen blijft.",
            "Met WerkCV kun je dat sneller doen dan in losse documenten. Je kiest een template, vult je ervaring in, herschrijft wat nodig is en downloadt de pdf wanneer je tevreden bent. Dat is precies de pragmatische route die voor veel werkzoekenden in Vlaanderen werkt.",
          ],
        },
      ]}
      primaryCta={{ href: "/gratis-cv-template", label: "Bekijk gratis cv-sjabloon" }}
      secondaryCta={{ href: "/editor", label: "Start online met je cv" }}
      relatedLinks={[
        { href: "/cv-voorbeeld-belgie", label: "CV voorbeeld België" },
        { href: "/cv-maken-belgie", label: "CV maken in België" },
        { href: "/cv-maken-gratis", label: "CV gratis maken zonder abonnement" },
      ]}
    />
  );
}
