export type SalaryBenchmarkId =
  | "software-developer"
  | "system-network-specialist"
  | "accountant-controller"
  | "financial-specialist"
  | "hr-specialist"
  | "marketing-sales-advisor"
  | "buyer-accountmanager"
  | "office-manager"
  | "administrative-assistant"
  | "reception-customer-service"
  | "payroll-bookkeeping"
  | "logistics-planner"
  | "legal-counsel"
  | "higher-education-teacher"
  | "secondary-school-teacher"
  | "primary-school-teacher"
  | "specialist-nurse"
  | "mbo-nurse"
  | "social-worker"
  | "retail-sales-assistant"
  | "electrician"
  | "truck-driver"
  | "operations-manager";

export type SalaryComparisonStatus =
  | "below_p25"
  | "below_median"
  | "around_median"
  | "above_median"
  | "above_p75";

export type SalaryExperienceLevel = "starter" | "medior" | "senior" | "lead";
export type SalaryEducationLevel = "mbo" | "hbo" | "wo";
export type SalaryRegionBand = "gemiddeld" | "randstad" | "brabant" | "noord_oost" | "remote";

type SalaryModifierOption<T extends string> = {
  id: T;
  label: string;
  description: string;
  multiplier: number;
};

export type SalaryBenchmark = {
  id: SalaryBenchmarkId;
  group: string;
  label: string;
  shortLabel: string;
  description: string;
  cbsOccupationCode: string;
  cbsOccupationLabel: string;
  dataYear: number;
  dataNote: string;
  sampleSize: number;
  hourlyP25: number;
  hourlyMedian: number;
  hourlyP75: number;
};

export type SalaryBenchmarkCalculationInput = {
  benchmarkId: SalaryBenchmarkId;
  weeklyHours: number;
  experienceLevel: SalaryExperienceLevel;
  educationLevel: SalaryEducationLevel;
  regionBand: SalaryRegionBand;
  currentMonthlyGross?: number | null;
};

export type SalaryBenchmarkCalculationResult = {
  benchmark: SalaryBenchmark;
  weeklyHours: number;
  experienceLevel: SalaryExperienceLevel;
  educationLevel: SalaryEducationLevel;
  regionBand: SalaryRegionBand;
  monthlyP25: number;
  monthlyMedian: number;
  monthlyP75: number;
  annualP25: number;
  annualMedian: number;
  annualP75: number;
  baseMonthlyP25: number;
  baseMonthlyMedian: number;
  baseMonthlyP75: number;
  baseAnnualP25: number;
  baseAnnualMedian: number;
  baseAnnualP75: number;
  currentMonthlyGross: number | null;
  currentHourlyGross: number | null;
  monthlyDifferenceFromMedian: number | null;
  hourlyDifferenceFromMedian: number | null;
  percentDifferenceFromMedian: number | null;
  totalAdjustmentMultiplier: number;
  totalAdjustmentPercentage: number;
  status: SalaryComparisonStatus | null;
};

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function annualFromHourly(hourly: number, weeklyHours: number): number {
  return roundMoney(hourly * weeklyHours * 52);
}

function monthlyFromHourly(hourly: number, weeklyHours: number): number {
  return roundMoney(annualFromHourly(hourly, weeklyHours) / 12);
}

function hourlyFromMonthly(monthly: number, weeklyHours: number): number {
  return roundMoney((monthly * 12) / (weeklyHours * 52));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const salaryExperienceOptions: SalaryModifierOption<SalaryExperienceLevel>[] = [
  {
    id: "starter",
    label: "Starter (0-2 jaar)",
    description: "Je zit nog dicht bij de onderkant van de marktband en groeit vaak nog snel door.",
    multiplier: 0.9,
  },
  {
    id: "medior",
    label: "Medior (3-5 jaar)",
    description: "Je profiel ligt rond de standaard CBS-benchmark voor deze beroepsgroep.",
    multiplier: 1,
  },
  {
    id: "senior",
    label: "Senior (6-9 jaar)",
    description: "Je neemt meer verantwoordelijkheid en hoort meestal duidelijk boven de basisbenchmark te zitten.",
    multiplier: 1.12,
  },
  {
    id: "lead",
    label: "Lead / expert (10+ jaar)",
    description: "Je combineert ervaring met domeinkennis, ownership of aansturing.",
    multiplier: 1.22,
  },
];

export const salaryEducationOptions: SalaryModifierOption<SalaryEducationLevel>[] = [
  {
    id: "mbo",
    label: "MBO / praktijkgericht",
    description: "Goede basis voor veel operationele en vakinhoudelijke rollen.",
    multiplier: 0.98,
  },
  {
    id: "hbo",
    label: "HBO",
    description: "Neutrale middenwaarde voor veel zakelijke en specialistische beroepen.",
    multiplier: 1,
  },
  {
    id: "wo",
    label: "WO / specialistisch",
    description: "Voor functies waar academische vorming of theoretische diepgang vaker doorwerkt in het loon.",
    multiplier: 1.04,
  },
];

export const salaryRegionOptions: SalaryModifierOption<SalaryRegionBand>[] = [
  {
    id: "gemiddeld",
    label: "Gemiddelde regio NL",
    description: "Gebruik dit als neutrale middenwaarde wanneer locatie geen groot thema is.",
    multiplier: 1,
  },
  {
    id: "randstad",
    label: "Randstad",
    description: "Amsterdam, Utrecht, Rotterdam en Den Haag liggen vaak boven het nationale midden.",
    multiplier: 1.06,
  },
  {
    id: "brabant",
    label: "Eindhoven / Brabant",
    description: "Tech, industrie en high-end supply chain trekken de benchmark iets omhoog.",
    multiplier: 1.03,
  },
  {
    id: "noord_oost",
    label: "Noord / Oost / buitenstedelijk",
    description: "In veel regio's buiten de grote stedelijke gebieden ligt het loon iets lager.",
    multiplier: 0.97,
  },
  {
    id: "remote",
    label: "Remote / landelijk zoekgebied",
    description: "Handig als je bewust meerdere regio's of remote-first werkgevers vergelijkt.",
    multiplier: 1,
  },
];

export const salaryBenchmarks: SalaryBenchmark[] = [
  {
    id: "software-developer",
    group: "ICT",
    label: "Software developer / applicatieontwikkelaar",
    shortLabel: "Software developer",
    description: "Softwareontwikkelaars, webdevelopers, applicatieprogrammeurs en testers van ICT-systemen.",
    cbsOccupationCode: "A000275",
    cbsOccupationLabel: "0811 Software- en applicatieontwikkelaars",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 316,
    hourlyP25: 27,
    hourlyMedian: 34.8,
    hourlyP75: 43.4,
  },
  {
    id: "system-network-specialist",
    group: "ICT",
    label: "Systeembeheerder / databank- en netwerkspecialist",
    shortLabel: "Systeembeheerder",
    description: "Databasebeheerders, systeembeheerders, netwerkspecialisten en security-adviseurs.",
    cbsOccupationCode: "A000276",
    cbsOccupationLabel: "0812 Databank- en netwerkspecialisten",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 92,
    hourlyP25: 27.9,
    hourlyMedian: 34.1,
    hourlyP75: 40.3,
  },
  {
    id: "accountant-controller",
    group: "Finance",
    label: "Accountant / controller / fiscalist",
    shortLabel: "Accountant / controller",
    description: "Accountants, controllers, fiscalisten, auditors en vergelijkbare finance-specialisten.",
    cbsOccupationCode: "A000194",
    cbsOccupationLabel: "0411 Accountants",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 101,
    hourlyP25: 28.4,
    hourlyMedian: 36.4,
    hourlyP75: 45.8,
  },
  {
    id: "financial-specialist",
    group: "Finance",
    label: "Financieel specialist / econoom / analist",
    shortLabel: "Financieel specialist",
    description: "Financieel adviseurs, economen, beleggingsanalisten, risicomanagers en vergelijkbare rollen.",
    cbsOccupationCode: "A000195",
    cbsOccupationLabel: "0412 Financieel specialisten en economen",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 80,
    hourlyP25: 25.7,
    hourlyMedian: 34.1,
    hourlyP75: 46.3,
  },
  {
    id: "hr-specialist",
    group: "Business",
    label: "HR-adviseur / P&O specialist",
    shortLabel: "HR-adviseur",
    description: "HR-adviseurs, personeelsadviseurs, loopbaanadviseurs en opleidingsfunctionarissen.",
    cbsOccupationCode: "A000198",
    cbsOccupationLabel: "0415 Specialisten personeels- en loopbaanontwikkeling",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 104,
    hourlyP25: 24,
    hourlyMedian: 31.3,
    hourlyP75: 38,
  },
  {
    id: "marketing-sales-advisor",
    group: "Commercieel",
    label: "Marketing / PR / sales specialist",
    shortLabel: "Marketing / sales specialist",
    description: "Marketing-, PR- en sales-specialisten, inclusief accountmanagers industrie en ICT.",
    cbsOccupationCode: "A000184",
    cbsOccupationLabel: "0311 Adviseurs marketing, public relations en sales",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 217,
    hourlyP25: 22.8,
    hourlyMedian: 30.4,
    hourlyP75: 40.1,
  },
  {
    id: "buyer-accountmanager",
    group: "Commercieel",
    label: "Inkoper / vertegenwoordiger / accountmanager",
    shortLabel: "Inkoper / accountmanager",
    description: "Inkopers, vertegenwoordigers, retail-accountmanagers en exportmanagers.",
    cbsOccupationCode: "A000186",
    cbsOccupationLabel: "0321 Vertegenwoordigers en inkopers",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 157,
    hourlyP25: 24,
    hourlyMedian: 30.9,
    hourlyP75: 40.6,
  },
  {
    id: "office-manager",
    group: "Business",
    label: "Office manager / directiesecretaresse",
    shortLabel: "Office manager",
    description: "Office managers, directiesecretaresses en project- of juridisch secretaresses.",
    cbsOccupationCode: "A000202",
    cbsOccupationLabel: "0423 Directiesecretaresses",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 128,
    hourlyP25: 22.9,
    hourlyMedian: 26.4,
    hourlyP75: 30.8,
  },
  {
    id: "administrative-assistant",
    group: "Business",
    label: "Administratief medewerker",
    shortLabel: "Administratief medewerker",
    description: "Administratief assistenten, kantoorassistenten, dossierbeheerders en archiefmedewerkers.",
    cbsOccupationCode: "A000204",
    cbsOccupationLabel: "0431 Administratief medewerkers",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 209,
    hourlyP25: 17.7,
    hourlyMedian: 22,
    hourlyP75: 26.4,
  },
  {
    id: "reception-customer-service",
    group: "Business",
    label: "Receptionist / klantenservice medewerker",
    shortLabel: "Receptionist / klantenservice",
    description: "Receptionisten, inbound callcentermedewerkers, hotelreceptionisten en publieksbalies.",
    cbsOccupationCode: "A000206",
    cbsOccupationLabel: "0433 Receptionisten en telefonisten",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 177,
    hourlyP25: 17.7,
    hourlyMedian: 20.7,
    hourlyP75: 25.6,
  },
  {
    id: "payroll-bookkeeping",
    group: "Finance",
    label: "Boekhoudkundig medewerker / salarisadministratie",
    shortLabel: "Boekhoudkundig medewerker",
    description: "Crediteuren- en debiteurenmedewerkers, salarisadministrateurs en finance support.",
    cbsOccupationCode: "A000207",
    cbsOccupationLabel: "0434 Boekhoudkundig medewerkers",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 131,
    hourlyP25: 20.3,
    hourlyMedian: 24.3,
    hourlyP75: 28.9,
  },
  {
    id: "logistics-planner",
    group: "Logistiek",
    label: "Logistiek medewerker / transportplanner",
    shortLabel: "Logistiek planner",
    description: "Logistiek medewerkers, planners transport, orderbegeleiders en voorraadplanners.",
    cbsOccupationCode: "A000208",
    cbsOccupationLabel: "0435 Transportplanners en logistiek medewerkers",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 225,
    hourlyP25: 19.4,
    hourlyMedian: 24,
    hourlyP75: 29.9,
  },
  {
    id: "legal-counsel",
    group: "Juridisch",
    label: "Jurist / juridisch adviseur",
    shortLabel: "Jurist",
    description: "Advocaten, bedrijfsjuristen, juridisch adviseurs, griffiers en notarissen.",
    cbsOccupationCode: "A000233",
    cbsOccupationLabel: "0621 Juristen",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 62,
    hourlyP25: 28.2,
    hourlyMedian: 38.4,
    hourlyP75: 48.1,
  },
  {
    id: "higher-education-teacher",
    group: "Onderwijs",
    label: "Docent hoger onderwijs / hoogleraar",
    shortLabel: "Docent hoger onderwijs",
    description: "Hbo-docenten, universitair docenten en hoogleraren.",
    cbsOccupationCode: "A000163",
    cbsOccupationLabel: "0111 Docenten hoger onderwijs en hoogleraren",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 73,
    hourlyP25: 27.2,
    hourlyMedian: 40.1,
    hourlyP75: 47.7,
  },
  {
    id: "secondary-school-teacher",
    group: "Onderwijs",
    label: "Docent voortgezet onderwijs",
    shortLabel: "Docent VO",
    description: "Docenten algemene vakken in het voortgezet onderwijs.",
    cbsOccupationCode: "A000165",
    cbsOccupationLabel: "0113 Docenten algemene vakken secundair onderwijs",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 104,
    hourlyP25: 27.5,
    hourlyMedian: 35.4,
    hourlyP75: 41.5,
  },
  {
    id: "primary-school-teacher",
    group: "Onderwijs",
    label: "Leerkracht basisonderwijs",
    shortLabel: "Leerkracht basisonderwijs",
    description: "Leerkrachten basisonderwijs, speciaal onderwijs en praktijkonderwijs.",
    cbsOccupationCode: "A000166",
    cbsOccupationLabel: "0114 Leerkrachten basisonderwijs",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 142,
    hourlyP25: 26,
    hourlyMedian: 33,
    hourlyP75: 37.2,
  },
  {
    id: "specialist-nurse",
    group: "Zorg",
    label: "Gespecialiseerd verpleegkundige",
    shortLabel: "Gespecialiseerd verpleegkundige",
    description: "Gespecialiseerd verpleegkundigen, verpleegkundig coördinatoren en verloskundigen.",
    cbsOccupationCode: "A000290",
    cbsOccupationLabel: "1012 Gespecialiseerd verpleegkundigen",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 141,
    hourlyP25: 29.2,
    hourlyMedian: 33,
    hourlyP75: 37.6,
  },
  {
    id: "mbo-nurse",
    group: "Zorg",
    label: "Verpleegkundige mbo",
    shortLabel: "Verpleegkundige mbo",
    description: "Verpleegkundigen niveau 4 zonder specialistische of coördinerende taken.",
    cbsOccupationCode: "A000298",
    cbsOccupationLabel: "1033 Verpleegkundigen (mbo)",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 67,
    hourlyP25: 24.4,
    hourlyMedian: 28.5,
    hourlyP75: 32.4,
  },
  {
    id: "social-worker",
    group: "Zorg",
    label: "Maatschappelijk werker / ambulant begeleider",
    shortLabel: "Maatschappelijk werker",
    description: "Maatschappelijk werkers, ambulant begeleiders, jeugdbeschermers en schuldhulpverleners.",
    cbsOccupationCode: "A000293",
    cbsOccupationLabel: "1021 Maatschappelijk werkers",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 84,
    hourlyP25: 25.4,
    hourlyMedian: 29.1,
    hourlyP75: 33.8,
  },
  {
    id: "retail-sales-assistant",
    group: "Retail",
    label: "Verkoopmedewerker detailhandel",
    shortLabel: "Verkoopmedewerker",
    description: "Verkoopmedewerkers in winkels en detailhandel.",
    cbsOccupationCode: "A000189",
    cbsOccupationLabel: "0332 Verkoopmedewerkers detailhandel",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 275,
    hourlyP25: 13.4,
    hourlyMedian: 16.2,
    hourlyP75: 18.2,
  },
  {
    id: "electrician",
    group: "Techniek",
    label: "Elektricien / elektronicamonteur",
    shortLabel: "Elektricien",
    description: "Installateurs en reparateurs van elektrische, elektronische en telecomapparatuur.",
    cbsOccupationCode: "A000267",
    cbsOccupationLabel: "0761 Elektriciens en elektronicamonteurs",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 77,
    hourlyP25: 17.9,
    hourlyMedian: 23,
    hourlyP75: 27.8,
  },
  {
    id: "truck-driver",
    group: "Logistiek",
    label: "Vrachtwagenchauffeur",
    shortLabel: "Vrachtwagenchauffeur",
    description: "Vrachtwagenchauffeurs in transport en logistiek.",
    cbsOccupationCode: "A000321",
    cbsOccupationLabel: "1214 Vrachtwagenchauffeurs",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 81,
    hourlyP25: 20,
    hourlyMedian: 21.3,
    hourlyP75: 23.2,
  },
  {
    id: "operations-manager",
    group: "Management",
    label: "Operationeel / finance / HR manager",
    shortLabel: "Operations manager",
    description: "Managers zakelijke en administratieve dienstverlening, finance, HR en facilitaire teams.",
    cbsOccupationCode: "A000213",
    cbsOccupationLabel: "0521 Managers zakelijke en administratieve dienstverlening",
    dataYear: 2024,
    dataNote: "CBS voorlopige cijfers",
    sampleSize: 76,
    hourlyP25: 34.8,
    hourlyMedian: 47,
    hourlyP75: 61.2,
  },
];

export const salaryBenchmarkGroups = Array.from(
  salaryBenchmarks.reduce((map, benchmark) => {
    const current = map.get(benchmark.group) ?? [];
    current.push(benchmark);
    map.set(benchmark.group, current);
    return map;
  }, new Map<string, SalaryBenchmark[]>()),
)
  .sort(([left], [right]) => left.localeCompare(right, "nl-NL"))
  .map(([label, benchmarks]) => ({
    label,
    benchmarks: benchmarks.sort((left, right) => left.label.localeCompare(right.label, "nl-NL")),
  }));

export function getSalaryBenchmarkById(id: SalaryBenchmarkId): SalaryBenchmark {
  const benchmark = salaryBenchmarks.find((item) => item.id === id);

  if (!benchmark) {
    throw new Error(`Unknown salary benchmark id: ${id}`);
  }

  return benchmark;
}

function getExperienceOption(level: SalaryExperienceLevel) {
  return salaryExperienceOptions.find((option) => option.id === level) ?? salaryExperienceOptions[1];
}

function getEducationOption(level: SalaryEducationLevel) {
  return salaryEducationOptions.find((option) => option.id === level) ?? salaryEducationOptions[1];
}

function getRegionOption(regionBand: SalaryRegionBand) {
  return salaryRegionOptions.find((option) => option.id === regionBand) ?? salaryRegionOptions[0];
}

export function calculateSalaryBenchmark(
  input: SalaryBenchmarkCalculationInput,
): SalaryBenchmarkCalculationResult {
  const benchmark = getSalaryBenchmarkById(input.benchmarkId);
  const weeklyHours = roundMoney(input.weeklyHours);
  const experienceOption = getExperienceOption(input.experienceLevel);
  const educationOption = getEducationOption(input.educationLevel);
  const regionOption = getRegionOption(input.regionBand);
  const totalAdjustmentMultiplier = clamp(
    experienceOption.multiplier * educationOption.multiplier * regionOption.multiplier,
    0.82,
    1.35,
  );
  const currentMonthlyGross = typeof input.currentMonthlyGross === "number"
    ? roundMoney(input.currentMonthlyGross)
    : null;

  const baseMonthlyP25 = monthlyFromHourly(benchmark.hourlyP25, weeklyHours);
  const baseMonthlyMedian = monthlyFromHourly(benchmark.hourlyMedian, weeklyHours);
  const baseMonthlyP75 = monthlyFromHourly(benchmark.hourlyP75, weeklyHours);
  const baseAnnualP25 = annualFromHourly(benchmark.hourlyP25, weeklyHours);
  const baseAnnualMedian = annualFromHourly(benchmark.hourlyMedian, weeklyHours);
  const baseAnnualP75 = annualFromHourly(benchmark.hourlyP75, weeklyHours);

  const adjustedHourlyP25 = roundMoney(benchmark.hourlyP25 * totalAdjustmentMultiplier);
  const adjustedHourlyMedian = roundMoney(benchmark.hourlyMedian * totalAdjustmentMultiplier);
  const adjustedHourlyP75 = roundMoney(benchmark.hourlyP75 * totalAdjustmentMultiplier);
  const monthlyP25 = monthlyFromHourly(adjustedHourlyP25, weeklyHours);
  const monthlyMedian = monthlyFromHourly(adjustedHourlyMedian, weeklyHours);
  const monthlyP75 = monthlyFromHourly(adjustedHourlyP75, weeklyHours);
  const annualP25 = annualFromHourly(adjustedHourlyP25, weeklyHours);
  const annualMedian = annualFromHourly(adjustedHourlyMedian, weeklyHours);
  const annualP75 = annualFromHourly(adjustedHourlyP75, weeklyHours);

  if (currentMonthlyGross === null) {
    return {
      benchmark,
      weeklyHours,
      experienceLevel: input.experienceLevel,
      educationLevel: input.educationLevel,
      regionBand: input.regionBand,
      monthlyP25,
      monthlyMedian,
      monthlyP75,
      annualP25,
      annualMedian,
      annualP75,
      baseMonthlyP25,
      baseMonthlyMedian,
      baseMonthlyP75,
      baseAnnualP25,
      baseAnnualMedian,
      baseAnnualP75,
      currentMonthlyGross: null,
      currentHourlyGross: null,
      monthlyDifferenceFromMedian: null,
      hourlyDifferenceFromMedian: null,
      percentDifferenceFromMedian: null,
      totalAdjustmentMultiplier: roundMoney(totalAdjustmentMultiplier),
      totalAdjustmentPercentage: roundMoney((totalAdjustmentMultiplier - 1) * 100),
      status: null,
    };
  }

  const currentHourlyGross = hourlyFromMonthly(currentMonthlyGross, weeklyHours);
  const hourlyDifferenceFromMedian = roundMoney(currentHourlyGross - adjustedHourlyMedian);
  const monthlyDifferenceFromMedian = roundMoney(currentMonthlyGross - monthlyMedian);
  const percentDifferenceFromMedian = adjustedHourlyMedian > 0
    ? roundMoney((hourlyDifferenceFromMedian / adjustedHourlyMedian) * 100)
    : null;

  const aroundMedianThreshold = adjustedHourlyMedian * 0.05;
  let status: SalaryComparisonStatus;

  if (currentHourlyGross < adjustedHourlyP25) {
    status = "below_p25";
  } else if (currentHourlyGross < adjustedHourlyMedian - aroundMedianThreshold) {
    status = "below_median";
  } else if (currentHourlyGross <= adjustedHourlyMedian + aroundMedianThreshold) {
    status = "around_median";
  } else if (currentHourlyGross <= adjustedHourlyP75) {
    status = "above_median";
  } else {
    status = "above_p75";
  }

  return {
    benchmark,
    weeklyHours,
    experienceLevel: input.experienceLevel,
    educationLevel: input.educationLevel,
    regionBand: input.regionBand,
    monthlyP25,
    monthlyMedian,
    monthlyP75,
    annualP25,
    annualMedian,
    annualP75,
    baseMonthlyP25,
    baseMonthlyMedian,
    baseMonthlyP75,
    baseAnnualP25,
    baseAnnualMedian,
    baseAnnualP75,
    currentMonthlyGross,
    currentHourlyGross,
    monthlyDifferenceFromMedian,
    hourlyDifferenceFromMedian,
    percentDifferenceFromMedian,
    totalAdjustmentMultiplier: roundMoney(totalAdjustmentMultiplier),
    totalAdjustmentPercentage: roundMoney((totalAdjustmentMultiplier - 1) * 100),
    status,
  };
}
