import BelgiumSeoPage from "@/components/belgium/BelgiumSeoPage";
import { buildDutchMetadata } from "@/lib/page-metadata";

export const metadata = buildDutchMetadata({
  title: "CV Maken in België | CV Maken België | WerkCV",
  description:
    "Maak snel een professioneel cv voor België. Afgestemd op Vlaamse recruiters, éénmalig €4,99 en geen abonnement",
  path: "/cv-maken-belgie",
  keywords: ["cv maken belgië", "cv opstellen belgië", "professioneel cv belgie"],
  languages: {
    "nl-BE": "https://werkcv.be/cv-maken-belgie",
    "nl-NL": "https://werkcv.nl/",
  },
});

export default function Page() {
  return (
    <BelgiumSeoPage
      eyebrow="België"
      title="CV Maken in België — Snel en Professioneel"
      intro="Een sterk Belgisch cv is helder, compact en direct relevant voor de functie. WerkCV helpt je om dat zonder abonnement op te bouwen: start gratis, werk je cv online uit en betaal pas wanneer je de PDF wilt downloaden."
      sections={[
        {
          heading: "Wat recruiters in België meestal verwachten",
          paragraphs: [
            "In België ligt de basis dicht bij Nederland: een overzichtelijke opbouw, duidelijke functietitels en concrete werkervaring. Toch zijn er kleine verschillen. Een foto is in België gebruikelijker, zeker in Vlaanderen. Ook waarderen veel recruiters een rustige, zakelijke lay-out zonder onnodige grafische elementen.",
            "Solliciteer je via Jobat, Stepstone of VDAB, dan wil je cv vooral snel scanbaar zijn. Je profiel bovenaan moet direct duidelijk maken wat voor werk je zoekt, welke ervaring je meebrengt en waarom je relevant bent. Daarna volgen werkervaring, opleiding, vaardigheden en talen in een logische volgorde.",
          ],
        },
        {
          heading: "Vlaanderen, Brussel en Franstalige context",
          paragraphs: [
            "Voor Vlaanderen is Nederlands vanzelfsprekend, maar in Brussel en in internationale omgevingen telt ook hoe duidelijk je talenkennis wordt vermeld. Zet niet alleen neer dat je Nederlands of Engels spreekt, maar geef zo nodig ook een concreet niveau. Dat helpt recruiters sneller beoordelen of je profiel past bij klantcontact, administratie of meertalige teams.",
            "Wie in heel België solliciteert, doet er goed aan een cv te gebruiken dat professioneel oogt zonder te lokaal aan te voelen. WerkCV houdt de opmaak bewust rustig, zodat je cv bruikbaar blijft voor zowel Vlaamse werkgevers als internationale organisaties met een Belgische vestiging.",
          ],
        },
        {
          heading: "Waarom WerkCV voor België werkt",
          paragraphs: [
            "Veel cv-tools lokken gebruikers eerst gratis binnen en sturen daarna op abonnementen of terugkerende kosten. WerkCV draait juist om een eenvoudige prijslogica: je bouwt eerst, bekijkt het resultaat en betaalt alleen wanneer je wilt downloaden. Dat maakt het geschikter voor mensen die snel een nette pdf nodig hebben zonder maandelijkse verplichtingen.",
            "Gebruik WerkCV als praktische cv-builder: vergelijk templates, vul je ervaring in, pas je profiel aan voor de vacature en download je cv zodra hij klaar is. Daarmee heb je een route die goed aansluit op de Belgische arbeidsmarkt zonder dat je eerst met Word-opmaak of losse bestanden hoeft te worstelen.",
          ],
        },
      ]}
      primaryCta={{ href: "/gratis-cv-template", label: "Bekijk gratis cv-template" }}
      secondaryCta={{ href: "/editor", label: "Start je cv nu" }}
      relatedLinks={[
        { href: "/cv-voorbeeld-belgie", label: "CV voorbeeld België" },
        { href: "/cv-maken-gratis", label: "CV gratis maken in België" },
        { href: "/cv-template-vlaanderen", label: "CV template Vlaanderen" },
        { href: "/profieltekst-cv-voorbeelden", label: "Profieltekst cv voorbeelden" },
        { href: "/sollicitatiebrief-belgie", label: "Sollicitatiebrief België" },
        { href: "/en", label: "English CV for Belgium" },
      ]}
    />
  );
}
