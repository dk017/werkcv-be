import BelgiumSeoPage from "@/components/belgium/BelgiumSeoPage";
import { buildDutchMetadata } from "@/lib/page-metadata";

export const metadata = buildDutchMetadata({
  title: "CV Opstellen voor Belgische Werkzoekenden | CV Maken België | WerkCV",
  description:
    "Praktische cv-hulp voor Belgische werkzoekenden met aandacht voor VDAB, vakbonden en sollicitaties in Vlaanderen en Brussel",
  path: "/vakbonden-en-cv-belgie",
  keywords: ["cv opstellen belgische werkzoekenden", "vdab cv", "vakbonden cv belgie"],
  languages: {
    "nl-BE": "https://werkcv.be/vakbonden-en-cv-belgie",
    "nl-NL": "https://werkcv.nl/",
  },
});

export default function Page() {
  return (
    <BelgiumSeoPage
      eyebrow="Werkzoekenden"
      title="CV Opstellen voor Belgische Werkzoekenden"
      intro="Wie in België werk zoekt, gebruikt vaak meerdere kanalen tegelijk: VDAB, Jobat, Stepstone, eigen netwerk en soms begeleiding via vakbond of loopbaancoach. Dan helpt het als je cv niet alleen netjes oogt, maar ook snel aangepast kan worden per vacature."
      sections={[
        {
          heading: "VDAB, begeleiding en praktische inzetbaarheid",
          paragraphs: [
            "Voor veel werkzoekenden is VDAB een logisch vertrekpunt. Daar begint de zoektocht vaak met vacatures, begeleiding of advies over sollicitaties. In die context moet een cv vooral functioneel zijn: duidelijk, actueel en snel inzetbaar. Werkgevers willen in één scan zien welke ervaring je hebt, welke talen je spreekt en hoe recent je profiel is bijgewerkt.",
            "WerkCV sluit daar goed op aan omdat je snel wijzigingen kunt doorvoeren zonder de hele opmaak opnieuw te doen. Dat is vooral nuttig wanneer je verschillende functies test of je cv op meerdere sectoren wilt afstemmen.",
          ],
        },
        {
          heading: "Ook bruikbaar naast ACV of ABVV-begeleiding",
          paragraphs: [
            "Sommige kandidaten krijgen hulp via ACV, ABVV of een externe begeleider. Dan blijft de inhoud vaak het belangrijkste onderwerp, maar loopt het praktische deel vast op documenten, versies en lay-out. Een cv-builder lost dat niet inhoudelijk voor je op, maar maakt de uitvoering wel eenvoudiger.",
            "Voor coaches, begeleiders en werkzoekenden betekent dat minder Word-werk en minder tijdverlies op details die niets toevoegen aan de sollicitatie. De inhoud blijft leidend, maar de afwerking wordt rustiger en sneller.",
          ],
        },
        {
          heading: "Voor privé, overheid en gemengde profielen",
          paragraphs: [
            "Belgische sollicitaties verschillen per sector. Bij privébedrijven ligt de nadruk vaak op snelheid en duidelijke functiematch. Bij overheid of semipublieke organisaties kan extra structuur, taalduidelijkheid en volledigheid zwaarder wegen. In beide gevallen helpt een cv dat overzichtelijk blijft en niet te creatief is vormgegeven.",
            "Daarom werkt een eenvoudige opbouw meestal het best: profiel, werkervaring, opleiding, vaardigheden en talen. WerkCV biedt precies die basis, zodat je minder tijd kwijt bent aan opmaak en meer tijd overhoudt om de inhoud goed te krijgen.",
          ],
        },
      ]}
      primaryCta={{ href: "/gratis-cv-template", label: "Bekijk gratis cv-template" }}
      secondaryCta={{ href: "/editor", label: "Start je cv online" }}
      relatedLinks={[
        { href: "/cv-maken-belgie", label: "CV maken in België" },
        { href: "/cv-template-vlaanderen", label: "CV template Vlaanderen" },
        { href: "/cv-maken-gratis", label: "CV gratis maken in België" },
        { href: "/vakantiegeld-berekenen-belgie", label: "Vakantiegeld berekenen België" },
      ]}
    />
  );
}
