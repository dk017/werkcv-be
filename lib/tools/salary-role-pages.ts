import { getSalaryBenchmarkById, type SalaryBenchmarkId } from "@/lib/tools/salary-benchmark";

export type SalaryRoleLink = {
  href: string;
  label: string;
  description: string;
};

export type SalaryRoleBenchmark = {
  group: string;
  label: string;
  cbsOccupationCode: string;
  cbsOccupationLabel: string;
  dataYear: number;
  dataNote: string;
  sampleSize: number;
  hourlyP25: number;
  hourlyMedian: number;
  hourlyP75: number;
};

export type SalaryRolePage = {
  slug: string;
  roleLabel: string;
  metaTitle?: string;
  metaDescription?: string;
  benchmarkId?: SalaryBenchmarkId;
  benchmarkOverride?: SalaryRoleBenchmark;
  benchmarkNote?: string;
  relatedLinks?: SalaryRoleLink[];
};

const defaultRoleLinks: SalaryRoleLink[] = [
  {
    href: "/tools/netto-bruto-calculator",
    label: "Reken dit salaris netto door",
    description: "Vertaal een bruto salarisrange direct naar een bruikbare netto indicatie.",
  },
  {
    href: "/tools/salaris-onderhandeling",
    label: "Gebruik deze range in je salarisonderhandeling",
    description: "Zet je benchmark om naar een concreet script of e-mail voor recruiter of werkgever.",
  },
  {
    href: "/tools/salaris-calculator",
    label: "Vergelijk met andere beroepen",
    description: "Open de bredere salarischeck als je meerdere rollen of profielen wilt vergelijken.",
  },
  {
    href: "/cv-maken-zonder-abonnement",
    label: "Maak een ATS-vriendelijk CV zonder abonnement",
    description: "Trek je salarisdoel direct door naar een sollicitatieklare CV-versie zonder abonnementsval.",
  },
];

export const salaryRolePages: SalaryRolePage[] = [
  {
    slug: "tandarts",
    roleLabel: "tandarts",
    metaTitle: "Salaris Tandarts 2026 - Bruto per Maand + Marktband | WerkCV",
    metaDescription:
      "Wat verdient een tandarts? Bekijk de brede CBS-benchmark Artsen voor 32, 36 en 40 uur, inclusief mediaan, marktband en duidelijke bronnuance.",
    benchmarkOverride: {
      group: "Zorg",
      label: "Artsen",
      cbsOccupationCode: "A000289",
      cbsOccupationLabel: "1011 Artsen",
      dataYear: 2024,
      dataNote: "CBS voorlopige cijfers",
      sampleSize: 102,
      hourlyP25: 31.5,
      hourlyMedian: 40.1,
      hourlyP75: 59.3,
    },
    benchmarkNote:
      "CBS publiceert in deze dataset geen losse tandartsregel. WerkCV gebruikt daarom de officiele beroepsgroep Artsen, waarin tandartsen zijn opgenomen. Zie dit als een brede marktindicatie, niet als een tandarts-specifiek loonrecord.",
    relatedLinks: [
      {
        href: "/templates",
        label: "Bekijk CV templates voor zorg- en specialistische functies",
        description: "Handig als je na je salarischeck ook je positionering op papier wilt aanscherpen.",
      },
      {
        href: "/salaris/verpleegkundige",
        label: "Bekijk ook salaris verpleegkundige",
        description: "Vergelijk met een andere zorgfunctie waarvoor CBS een directe beroepsregel publiceert.",
      },
    ],
  },
  {
    slug: "software-ontwikkelaar",
    roleLabel: "software developer",
    benchmarkId: "software-developer",
    relatedLinks: [
      {
        href: "/cv-template-software-ontwikkelaar",
        label: "CV template software developer",
        description: "Koppel je salarisdoel direct aan een CV dat past bij Nederlandse tech-vacatures.",
      },
      {
        href: "/cv-voorbeelden/technologie-en-ict/software-ontwikkelaar",
        label: "CV voorbeeld software developer",
        description: "Bekijk hoe een sterke tech-profieltekst en impact-bullets eruitzien.",
      },
      {
        href: "/sollicitatiebrief-voorbeeld-software-ontwikkelaar",
        label: "Sollicitatiebrief software developer",
        description: "Gebruik je benchmark ook in de manier waarop je je overstap of groeistap verkoopt.",
      },
      {
        href: "/salaris/systeembeheerder",
        label: "Vergelijk met salaris systeembeheerder",
        description: "Bekijk ook het marktloon voor infrastructuur- en beheerrollen.",
      },
    ],
  },
  {
    slug: "systeembeheerder",
    roleLabel: "systeembeheerder",
    benchmarkId: "system-network-specialist",
    benchmarkNote:
      "Voor deze pagina gebruikt WerkCV de officiele CBS-regel Databank- en netwerkspecialisten. Die groep omvat systeembeheerders en verwante infrastructuurrollen. Zie de bedragen als marktindicatie voor het bredere vakgebied.",
    metaTitle: "Salaris Systeembeheerder 2026 - Bruto per Maand | WerkCV",
    metaDescription:
      "Bekijk het salaris van een systeembeheerder in 2026 met CBS-data, bruto maandbedragen bij 32, 36 en 40 uur en uitleg over ervaring en specialisatie.",
    relatedLinks: [
      {
        href: "/cv-voorbeelden/technologie-en-ict/systeembeheerder",
        label: "CV voorbeeld systeembeheerder",
        description: "Maak je beheerervaring en technische specialisaties zichtbaar.",
      },
      {
        href: "/salaris/software-ontwikkelaar",
        label: "Vergelijk met salaris software developer",
        description: "Vergelijk het marktloon met een verwante ICT-functie.",
      },
    ],
  },
  {
    slug: "accountant",
    roleLabel: "accountant",
    benchmarkId: "accountant-controller",
    relatedLinks: [
      {
        href: "/cv-voorbeelden/zakelijk-en-financieel/accountant",
        label: "CV voorbeeld accountant",
        description: "Gebruik je salarisdoel samen met een finance-CV dat sterk inzet op nauwkeurigheid en advies.",
      },
    ],
  },
  {
    slug: "hr-adviseur",
    roleLabel: "hr-adviseur",
    benchmarkId: "hr-specialist",
  },
  {
    slug: "office-manager",
    roleLabel: "office manager",
    benchmarkId: "office-manager",
    relatedLinks: [
      {
        href: "/cv-template-office-manager",
        label: "CV template office manager",
        description: "Handig als je een hoger salaris wilt koppelen aan sterkere positionering op coordinatie en overzicht.",
      },
      {
        href: "/sollicitatiebrief-voorbeeld-office-manager",
        label: "Sollicitatiebrief office manager",
        description: "Gebruik een voorbeeldbrief die aansluit op verantwoordelijkheid, tempo en organisatieniveau.",
      },
    ],
  },
  {
    slug: "administratief-medewerker",
    roleLabel: "administratief medewerker",
    benchmarkId: "administrative-assistant",
    relatedLinks: [
      {
        href: "/cv-template-administratief-medewerker",
        label: "CV template administratief medewerker",
        description: "Maak een CV dat nauwkeurigheid, systeemkennis en betrouwbaarheid direct zichtbaar maakt.",
      },
      {
        href: "/sollicitatiebrief-voorbeeld-administratief-medewerker",
        label: "Sollicitatiebrief administratief medewerker",
        description: "Koppel je salarischeck aan een nette sollicitatiebrief voor office- en supportfuncties.",
      },
      {
        href: "/salaris/salarisadministrateur",
        label: "Vergelijk met salaris salarisadministrateur",
        description: "Bekijk het marktloon voor een gespecialiseerde administratieve rol.",
      },
    ],
  },
  {
    slug: "salarisadministrateur",
    roleLabel: "salarisadministrateur",
    benchmarkId: "payroll-bookkeeping",
    benchmarkNote:
      "CBS publiceert in deze dataset geen losse regel voor salarisadministrateurs. Daarom gebruikt WerkCV de bredere officiele groep Boekhoudkundig medewerkers. Zie de bedragen als marktindicatie voor salarisadministratie en verwante werkzaamheden.",
    metaTitle: "Salaris Salarisadministrateur 2026 - Bruto per Maand | WerkCV",
    metaDescription:
      "Bekijk het salaris van een salarisadministrateur in 2026 met CBS-data, bruto maandbedragen bij 32, 36 en 40 uur en uitleg over ervaring en specialisatie.",
    relatedLinks: [
      {
        href: "/cv-template-administratief-medewerker",
        label: "CV template administratief medewerker",
        description: "Gebruik een heldere basis voor administratieve ervaring en resultaten.",
      },
      {
        href: "/salaris/administratief-medewerker",
        label: "Vergelijk met salaris administratief medewerker",
        description: "Vergelijk het marktloon met een bredere administratieve functie.",
      },
    ],
  },
  {
    slug: "klantenservice-medewerker",
    roleLabel: "klantenservice medewerker",
    benchmarkId: "reception-customer-service",
    relatedLinks: [
      {
        href: "/cv-template-klantenservice-medewerker",
        label: "CV template klantenservice medewerker",
        description: "Laat klantcontact, tempo en servicekwaliteit beter terugkomen in je sollicitatieprofiel.",
      },
      {
        href: "/sollicitatiebrief-voorbeeld-klantenservice",
        label: "Sollicitatiebrief klantenservice",
        description: "Gebruik een voorbeeldbrief die past bij service, escalaties en communicatieskills.",
      },
      {
        href: "/salaris/administratief-medewerker",
        label: "Vergelijk met salaris administratief medewerker",
        description: "Bekijk ook een veelvoorkomende office- en supportfunctie.",
      },
    ],
  },
  {
    slug: "jurist",
    roleLabel: "jurist",
    benchmarkId: "legal-counsel",
  },
  {
    slug: "docent-voortgezet-onderwijs",
    roleLabel: "docent voortgezet onderwijs",
    benchmarkId: "secondary-school-teacher",
    relatedLinks: [
      {
        href: "/cv-voorbeelden/onderwijs/docent-voortgezet-onderwijs",
        label: "CV voorbeeld docent voortgezet onderwijs",
        description: "Bekijk hoe je bevoegdheid, vakinhoud en lesimpact sterk presenteert.",
      },
    ],
  },
  {
    slug: "leerkracht-basisonderwijs",
    roleLabel: "leerkracht basisonderwijs",
    benchmarkId: "primary-school-teacher",
    relatedLinks: [
      {
        href: "/cv-voorbeelden/onderwijs/basisschool-docent",
        label: "CV voorbeeld leerkracht basisonderwijs",
        description: "Gebruik een onderwijs-CV dat pedagogiek, klasverantwoordelijkheid en teamfit direct laat zien.",
      },
      {
        href: "/salaris/docent-voortgezet-onderwijs",
        label: "Vergelijk met salaris docent voortgezet onderwijs",
        description: "Bekijk de marktband voor een verwante onderwijsfunctie.",
      },
    ],
  },
  {
    slug: "gespecialiseerd-verpleegkundige",
    roleLabel: "gespecialiseerd verpleegkundige",
    benchmarkId: "specialist-nurse",
    relatedLinks: [
      {
        href: "/cv-template-verpleegkundige",
        label: "CV template verpleegkundige",
        description: "Gebruik een zorgtemplate die registratie, kwaliteit en verantwoordelijkheid snel zichtbaar maakt.",
      },
      {
        href: "/cv-voorbeelden/zorg-en-welzijn/verpleegkundige",
        label: "CV voorbeeld verpleegkundige",
        description: "Bekijk hoe je BIG-registratie, klinische ervaring en teamwerk overtuigend presenteert.",
      },
      {
        href: "/sollicitatiebrief-voorbeeld-verpleegkundige",
        label: "Sollicitatiebrief verpleegkundige",
        description: "Koppel je salarisdoel aan een zorgbrief die direct vertrouwen opbouwt.",
      },
    ],
  },
  {
    slug: "verpleegkundige",
    roleLabel: "verpleegkundige",
    metaTitle: "Salaris Verpleegkundige 2026 - Bruto per Maand | WerkCV",
    metaDescription:
      "Wat verdient een verpleegkundige? Bekijk de CBS-mediaan en salarisband voor 32, 36 en 40 uur. Vergelijk bruto maandloon en reken daarna netto door.",
    benchmarkId: "mbo-nurse",
    benchmarkNote:
      "Voor deze pagina gebruikt WerkCV de officiele CBS-regel Verpleegkundigen (mbo). Voor specialistische verpleegkundige rollen ligt de benchmark vaak hoger; bekijk daarvoor ook de aparte pagina voor gespecialiseerd verpleegkundigen.",
    relatedLinks: [
      {
        href: "/cv-template-verpleegkundige",
        label: "CV template verpleegkundige",
        description: "Maak je zorg-CV direct concreter zodra je weet welke salarisrange je wilt targeten.",
      },
      {
        href: "/cv-voorbeelden/zorg-en-welzijn/verpleegkundige",
        label: "CV voorbeeld verpleegkundige",
        description: "Gebruik een voorbeeld dat past bij ziekenhuiszorg, BIG-registratie en multidisciplinair werken.",
      },
      {
        href: "/sollicitatiebrief-voorbeeld-verpleegkundige",
        label: "Sollicitatiebrief verpleegkundige",
        description: "Handig als je overstapt en je gewenste niveau ook in je brief wilt laten terugkomen.",
      },
      {
        href: "/salaris/gespecialiseerd-verpleegkundige",
        label: "Vergelijk met salaris gespecialiseerd verpleegkundige",
        description: "Bekijk ook de hogere CBS-benchmark voor specialistische verpleegkundige rollen.",
      },
    ],
  },
  {
    slug: "verkoopmedewerker",
    roleLabel: "verkoopmedewerker",
    benchmarkId: "retail-sales-assistant",
    relatedLinks: [
      {
        href: "/cv-template-verkoopmedewerker",
        label: "CV template verkoopmedewerker",
        description: "Gebruik een retail-CV dat service, omzetgevoel en betrouwbaarheid snel laat zien.",
      },
      {
        href: "/sollicitatiebrief-voorbeeld-verkoopmedewerker",
        label: "Sollicitatiebrief verkoopmedewerker",
        description: "Koppel je salarisvergelijking aan een sollicitatiebrief die direct commercieel overkomt.",
      },
      {
        href: "/salaris/klantenservice-medewerker",
        label: "Vergelijk met salaris klantenservice medewerker",
        description: "Bekijk ook een klantgerichte functie buiten de winkelvloer.",
      },
    ],
  },
  {
    slug: "vrachtwagenchauffeur",
    roleLabel: "vrachtwagenchauffeur",
    benchmarkId: "truck-driver",
    relatedLinks: [
      {
        href: "/cv-voorbeelden/vakmanschap-en-logistiek/chauffeur",
        label: "CV voorbeeld vrachtwagenchauffeur",
        description: "Gebruik een logistiek CV dat rijbewijzen, certificaten en betrouwbaarheid meteen duidelijk maakt.",
      },
      {
        href: "/salaris/magazijnmedewerker",
        label: "Vergelijk met salaris magazijnmedewerker",
        description: "Bekijk ook het marktloon voor een logistieke functie op locatie.",
      },
    ],
  },
  {
    slug: "magazijnmedewerker",
    roleLabel: "magazijnmedewerker",
    benchmarkId: "logistics-planner",
    benchmarkNote:
      "CBS publiceert in deze dataset geen losse regel voor magazijnmedewerkers. Daarom gebruikt WerkCV de bredere officiele groep Transportplanners en logistiek medewerkers. Zie de bedragen als marktindicatie voor logistieke functies.",
    metaTitle: "Salaris Magazijnmedewerker 2026 - Bruto per Maand | WerkCV",
    metaDescription:
      "Bekijk het salaris van een magazijnmedewerker in 2026 met CBS-data, bruto maandbedragen bij 32, 36 en 40 uur en uitleg over toeslagen en ervaring.",
    relatedLinks: [
      {
        href: "/cv-voorbeelden/vakmanschap-en-logistiek/magazijnmedewerker",
        label: "CV voorbeeld magazijnmedewerker",
        description: "Laat je logistieke ervaring en certificaten helder terugkomen.",
      },
      {
        href: "/salaris/vrachtwagenchauffeur",
        label: "Vergelijk met salaris vrachtwagenchauffeur",
        description: "Bekijk ook een verwante functie binnen transport en logistiek.",
      },
    ],
  },
  {
    slug: "elektricien",
    roleLabel: "elektricien",
    benchmarkId: "electrician",
    benchmarkNote:
      "Voor deze pagina gebruikt WerkCV de officiele CBS-regel Elektriciens en elektronicamonteurs. De bedragen geven een marktindicatie voor monteurs met elektrotechnische werkzaamheden.",
    metaTitle: "Salaris Elektricien 2026 - Bruto per Maand | WerkCV",
    metaDescription:
      "Bekijk het salaris van een elektricien in 2026 met CBS-data, bruto maandbedragen bij 32, 36 en 40 uur en uitleg over ervaring en vakgebied.",
    relatedLinks: [
      {
        href: "/cv-voorbeelden/vakmanschap-en-logistiek/elektricien",
        label: "CV voorbeeld elektricien",
        description: "Zet je elektrotechnische kennis en certificaten duidelijk op je cv.",
      },
      {
        href: "/tools/uurloon-calculator",
        label: "Reken je uurloon om",
        description: "Vergelijk een bruto uurloon met een maandbedrag.",
      },
    ],
  },
];

function dedupeLinks(links: SalaryRoleLink[]): SalaryRoleLink[] {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
}

export function resolveSalaryRoleBenchmark(page: SalaryRolePage): SalaryRoleBenchmark {
  if (page.benchmarkOverride) {
    return page.benchmarkOverride;
  }

  if (!page.benchmarkId) {
    throw new Error(`Salary role page ${page.slug} is missing benchmark data.`);
  }

  const benchmark = getSalaryBenchmarkById(page.benchmarkId);

  return {
    group: benchmark.group,
    label: benchmark.shortLabel,
    cbsOccupationCode: benchmark.cbsOccupationCode,
    cbsOccupationLabel: benchmark.cbsOccupationLabel,
    dataYear: benchmark.dataYear,
    dataNote: benchmark.dataNote,
    sampleSize: benchmark.sampleSize,
    hourlyP25: benchmark.hourlyP25,
    hourlyMedian: benchmark.hourlyMedian,
    hourlyP75: benchmark.hourlyP75,
  };
}

export function getSalaryRolePageBySlug(slug: string): SalaryRolePage | null {
  return salaryRolePages.find((page) => page.slug === slug) ?? null;
}

export function getSalaryRolePageLinks(page: SalaryRolePage): SalaryRoleLink[] {
  return dedupeLinks([...(page.relatedLinks ?? []), ...defaultRoleLinks]);
}

export function getSalaryRolePageGroups() {
  return Array.from(
    salaryRolePages.reduce((map, page) => {
      const benchmark = resolveSalaryRoleBenchmark(page);
      const current = map.get(benchmark.group) ?? [];
      current.push(page);
      map.set(benchmark.group, current);
      return map;
    }, new Map<string, SalaryRolePage[]>()),
  )
    .sort(([left], [right]) => left.localeCompare(right, "nl-NL"))
    .map(([label, pages]) => ({
      label,
      pages: pages.sort((left, right) => left.roleLabel.localeCompare(right.roleLabel, "nl-NL")),
    }));
}
