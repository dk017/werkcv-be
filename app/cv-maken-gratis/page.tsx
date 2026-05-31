import BelgiumSeoPage from "@/components/belgium/BelgiumSeoPage";
import { buildDutchMetadata } from "@/lib/page-metadata";

export const metadata = buildDutchMetadata({
  title: "CV Gratis Maken in België | CV Maken België | WerkCV",
  description:
    "Start gratis met je cv in België en betaal éénmalig €4,99 wanneer je de pdf wilt downloaden. Geen abonnement",
  path: "/cv-maken-gratis",
  keywords: ["cv gratis maken belgie", "cv gratis opstellen"],
  languages: {
    "nl-BE": "https://werkcv.be/cv-maken-gratis",
    "nl-NL": "https://werkcv.nl/",
  },
});

export default function Page() {
  return (
    <BelgiumSeoPage
      eyebrow="Zonder abonnement"
      title="CV Gratis Maken in België — Zonder Abonnement"
      intro="Veel mensen zoeken een gratis cv-maker, maar bedoelen eigenlijk iets anders: ze willen eerst bouwen en pas betalen als het resultaat goed is. Dat is precies hoe WerkCV werkt. Je start gratis en betaalt alleen wanneer je de pdf echt wilt downloaden."
      sections={[
        {
          heading: "Gratis starten is niet hetzelfde als gratis vastzitten",
          paragraphs: [
            "Een cv-tool voelt pas eerlijk als je zonder druk kunt beginnen. Vergelijken, invullen, templates wisselen en je profiel aanscherpen moet kunnen voordat er een betaalmoment komt. In België zoeken veel kandidaten vooral naar een route zonder verborgen kosten of onverwachte verlenging.",
            "Daarom draait WerkCV niet op een maandabonnement. Je bouwt je cv eerst op, bekijkt het resultaat en beslist daarna pas of je wilt downloaden. Dat maakt de prijs logisch en voorspelbaar: éénmalig €4,99 per download, zonder doorlopende kosten.",
          ],
        },
        {
          heading: "Waarom dit beter past bij Belgische sollicitanten",
          paragraphs: [
            "Voor veel sollicitaties heb je vooral snelheid nodig. Je wilt vandaag nog reageren op een vacature via Jobat, Stepstone of VDAB, zonder eerst uit te zoeken welk abonnement achter de schermen meeloopt. Een eenvoudige prijsstructuur verlaagt die twijfel en maakt het makkelijker om direct aan je cv te beginnen.",
            "De templates in WerkCV zijn gericht op rust en duidelijkheid. Daardoor hoef je niet te kiezen tussen een professioneel resultaat en een begrijpelijke betaalflow. Je krijgt beide: een nette cv-builder en een helder moment waarop je betaalt als je klaar bent.",
          ],
        },
        {
          heading: "Wat je concreet krijgt",
          paragraphs: [
            "Je kunt gratis starten, je gegevens invullen, je werkervaring aanscherpen en zien hoe je cv eruitziet. Pas bij het downloaden betaal je. Geen maandelijkse kosten, geen automatische verlenging en geen ingewikkelde pakketten voor iets wat je vaak maar af en toe nodig hebt.",
            "Dat is ook de reden waarom deze pagina commercieel belangrijk is: veel mensen willen niet per se het goedkoopste hulpmiddel, maar vooral een logische en eerlijke route. WerkCV positioneert zich precies daar.",
          ],
        },
      ]}
      primaryCta={{ href: "/cv-maken-zonder-abonnement", label: "Bekijk prijsmodel" }}
      secondaryCta={{ href: "/editor", label: "Start gratis met je cv" }}
      relatedLinks={[
        { href: "/cv-maken-belgie", label: "CV maken in België" },
        { href: "/cv-voorbeeld-belgie", label: "CV voorbeeld België" },
        { href: "/sollicitatiebrief-belgie", label: "Sollicitatiebrief België" },
      ]}
    />
  );
}
