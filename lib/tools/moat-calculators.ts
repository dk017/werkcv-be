import {
  estimateNetFromGross,
  estimateNetFromTaxableIncome,
  type TaxAgeProfile,
} from "@/lib/tools/netto-bruto";

export const WW_MAX_DAGLOON_2026 = 304.25;
export const THIRTY_PERCENT_GENERAL_THRESHOLD_2026 = 48013;
export const THIRTY_PERCENT_YOUNG_MASTER_THRESHOLD_2026 = 36497;
export const THIRTY_PERCENT_MAX_ALLOWANCE_2026 = 78600;
export const TAX_FREE_KILOMETER_RATE_2026 = 0.23;
export const TAX_FREE_HOME_OFFICE_RATE_2026 = 2.35;
const AVERAGE_WORKDAYS_PER_MONTH = 261 / 12;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const STANDARD_VACATION_DAYS = 20;
const DEFAULT_HOLIDAY_ALLOWANCE_PERCENTAGE = 8;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export type YearEndBonusInput = {
  monthlyGrossSalary: number;
  bonusPercentage: number;
  monthsWorked: number;
};

export type YearEndBonusResult = {
  annualBaseSalary: number;
  fullYearBonus: number;
  proratedBonus: number;
  decemberGrossWithBonus: number;
  bonusEquivalentMonths: number;
  monthlyBonusReserve: number;
};

export function calculateYearEndBonus(input: YearEndBonusInput): YearEndBonusResult {
  const annualBaseSalary = input.monthlyGrossSalary * 12;
  const fullYearBonus = annualBaseSalary * (input.bonusPercentage / 100);
  const proratedBonus = fullYearBonus * (input.monthsWorked / 12);

  return {
    annualBaseSalary: round2(annualBaseSalary),
    fullYearBonus: round2(fullYearBonus),
    proratedBonus: round2(proratedBonus),
    decemberGrossWithBonus: round2(input.monthlyGrossSalary + proratedBonus),
    bonusEquivalentMonths: round2(proratedBonus / input.monthlyGrossSalary),
    monthlyBonusReserve: round2(proratedBonus / Math.max(1, input.monthsWorked)),
  };
}

export type ThirtyPercentRulingInput = {
  annualTaxableSalary: number;
  monthsInScheme: number;
  under30WithMasters: boolean;
  researcherOrMedicalSpecialist: boolean;
  recruitedFromAbroad: boolean;
  livedOutside150KmZone: boolean;
  dutchPayrollEmployment: boolean;
};

export type ThirtyPercentRulingResult = {
  thresholdAnnual: number;
  proratedThresholdAnnual: number;
  meetsSalaryThreshold: boolean;
  structuralConditionsMet: boolean;
  likelyEligible: boolean;
  salaryGap: number;
  maximumUntaxedAllowanceAnnual: number;
  monthlyUntaxedAllowance: number;
  impliedTotalPackageAnnual: number;
  capApplied: boolean;
  status: "eligible" | "salary_gap" | "conditions_gap";
};

export function calculateThirtyPercentRuling(input: ThirtyPercentRulingInput): ThirtyPercentRulingResult {
  const baseThreshold = input.researcherOrMedicalSpecialist
    ? 0
    : input.under30WithMasters
      ? THIRTY_PERCENT_YOUNG_MASTER_THRESHOLD_2026
      : THIRTY_PERCENT_GENERAL_THRESHOLD_2026;
  const proratedThresholdAnnual = baseThreshold * (input.monthsInScheme / 12);
  const meetsSalaryThreshold = input.annualTaxableSalary >= proratedThresholdAnnual;
  const structuralConditionsMet =
    input.recruitedFromAbroad &&
    input.livedOutside150KmZone &&
    input.dutchPayrollEmployment;
  const rawAllowance = input.annualTaxableSalary * (30 / 70);
  const maxAllowanceCap = THIRTY_PERCENT_MAX_ALLOWANCE_2026 * (input.monthsInScheme / 12);
  const maximumUntaxedAllowanceAnnual = Math.min(rawAllowance, maxAllowanceCap);
  const likelyEligible = meetsSalaryThreshold && structuralConditionsMet;
  const status: ThirtyPercentRulingResult["status"] = !structuralConditionsMet
    ? "conditions_gap"
    : meetsSalaryThreshold
      ? "eligible"
      : "salary_gap";

  return {
    thresholdAnnual: round2(baseThreshold),
    proratedThresholdAnnual: round2(proratedThresholdAnnual),
    meetsSalaryThreshold,
    structuralConditionsMet,
    likelyEligible,
    salaryGap: round2(Math.max(0, proratedThresholdAnnual - input.annualTaxableSalary)),
    maximumUntaxedAllowanceAnnual: round2(maximumUntaxedAllowanceAnnual),
    monthlyUntaxedAllowance: round2(maximumUntaxedAllowanceAnnual / Math.max(1, input.monthsInScheme)),
    impliedTotalPackageAnnual: round2(input.annualTaxableSalary + maximumUntaxedAllowanceAnnual),
    capApplied: rawAllowance > maxAllowanceCap,
    status,
  };
}

export type LeaveHoursConversionMode = "hours_to_days" | "days_to_hours";

export type LeaveHoursConversionInput = {
  weeklyHours: number;
  workDaysPerWeek: number;
  amount: number;
  mode: LeaveHoursConversionMode;
};

export type LeaveHoursConversionResult = {
  hoursPerDay: number;
  convertedHours: number;
  convertedDays: number;
  workWeeksEquivalent: number;
};

export function calculateLeaveHoursConversion(input: LeaveHoursConversionInput): LeaveHoursConversionResult {
  const hoursPerDay = input.weeklyHours / input.workDaysPerWeek;
  const convertedHours = input.mode === "days_to_hours"
    ? input.amount * hoursPerDay
    : input.amount;
  const convertedDays = input.mode === "hours_to_days"
    ? input.amount / hoursPerDay
    : input.amount;

  return {
    hoursPerDay: round2(hoursPerDay),
    convertedHours: round2(convertedHours),
    convertedDays: round2(convertedDays),
    workWeeksEquivalent: round2(convertedHours / input.weeklyHours),
  };
}

export type VacationDaysInput = {
  weeklyHours: number;
  workDaysPerWeek: number;
  accrualMonths: number;
  extraDays: number;
  takenDays: number;
};

export type VacationDaysResult = {
  hoursPerDay: number;
  statutoryHoursPerYear: number;
  accruedStatutoryHours: number;
  accruedStatutoryDays: number;
  extraHours: number;
  totalAvailableHours: number;
  totalAvailableDays: number;
  usedHours: number;
  remainingHours: number;
  remainingDays: number;
  remainingWeeks: number;
  status: "healthy" | "low" | "negative";
};

export function calculateVacationDays(input: VacationDaysInput): VacationDaysResult {
  const hoursPerDay = input.weeklyHours / input.workDaysPerWeek;
  const statutoryHoursPerYear = input.weeklyHours * 4;
  const accruedStatutoryHours = statutoryHoursPerYear * (input.accrualMonths / 12);
  const accruedStatutoryDays = accruedStatutoryHours / hoursPerDay;
  const extraHours = input.extraDays * hoursPerDay;
  const totalAvailableHours = accruedStatutoryHours + extraHours;
  const totalAvailableDays = totalAvailableHours / hoursPerDay;
  const usedHours = input.takenDays * hoursPerDay;
  const remainingHours = totalAvailableHours - usedHours;
  const remainingDays = remainingHours / hoursPerDay;
  const remainingWeeks = remainingHours / input.weeklyHours;

  let status: VacationDaysResult["status"] = "healthy";

  if (remainingHours < 0) {
    status = "negative";
  } else if (remainingHours < input.weeklyHours) {
    status = "low";
  }

  return {
    hoursPerDay: round2(hoursPerDay),
    statutoryHoursPerYear: round2(statutoryHoursPerYear),
    accruedStatutoryHours: round2(accruedStatutoryHours),
    accruedStatutoryDays: round2(accruedStatutoryDays),
    extraHours: round2(extraHours),
    totalAvailableHours: round2(totalAvailableHours),
    totalAvailableDays: round2(totalAvailableDays),
    usedHours: round2(usedHours),
    remainingHours: round2(remainingHours),
    remainingDays: round2(remainingDays),
    remainingWeeks: round2(remainingWeeks),
    status,
  };
}

export type ParttimeSalaryMode = "monthly" | "annual";

export type ParttimeSalaryInput = {
  mode: ParttimeSalaryMode;
  fullTimeSalary: number;
  fullTimeHours: number;
  targetHours: number;
  holidayPercentage: number;
};

export type ParttimeSalaryScenario = {
  hours: number;
  ratio: number;
  monthlyGross: number;
  annualGross: number;
};

export type ParttimeSalaryResult = {
  fullTimeMonthlyGross: number;
  fullTimeAnnualGross: number;
  targetMonthlyGross: number;
  targetAnnualGross: number;
  targetHolidayAllowance: number;
  targetFtePercentage: number;
  hourlyGross: number;
  monthlyDifference: number;
  annualDifference: number;
  scenarios: ParttimeSalaryScenario[];
};

const DEFAULT_PARTTIME_SCENARIOS = [24, 28, 32, 36];

export function calculateParttimeSalary(input: ParttimeSalaryInput): ParttimeSalaryResult {
  const fullTimeAnnualGross = input.mode === "monthly" ? input.fullTimeSalary * 12 : input.fullTimeSalary;
  const fullTimeMonthlyGross = fullTimeAnnualGross / 12;
  const ratio = input.targetHours / input.fullTimeHours;
  const targetAnnualGross = fullTimeAnnualGross * ratio;
  const targetMonthlyGross = targetAnnualGross / 12;
  const targetHolidayAllowance = targetAnnualGross * (input.holidayPercentage / 100);
  const hourlyGross = fullTimeAnnualGross / (input.fullTimeHours * 52);

  const scenarioHours = Array.from(new Set(
    [...DEFAULT_PARTTIME_SCENARIOS, input.targetHours]
      .filter((hours) => hours > 0 && hours <= input.fullTimeHours)
      .map((hours) => round2(hours)),
  )).sort((left, right) => left - right);

  return {
    fullTimeMonthlyGross: round2(fullTimeMonthlyGross),
    fullTimeAnnualGross: round2(fullTimeAnnualGross),
    targetMonthlyGross: round2(targetMonthlyGross),
    targetAnnualGross: round2(targetAnnualGross),
    targetHolidayAllowance: round2(targetHolidayAllowance),
    targetFtePercentage: round2(ratio * 100),
    hourlyGross: round2(hourlyGross),
    monthlyDifference: round2(fullTimeMonthlyGross - targetMonthlyGross),
    annualDifference: round2(fullTimeAnnualGross - targetAnnualGross),
    scenarios: scenarioHours.map((hours) => {
      const scenarioRatio = hours / input.fullTimeHours;
      const annualGross = fullTimeAnnualGross * scenarioRatio;

      return {
        hours,
        ratio: round2(scenarioRatio * 100),
        monthlyGross: round2(annualGross / 12),
        annualGross: round2(annualGross),
      };
    }),
  };
}

function getWeeksInSelectedPeriod(monthsPerYear: number): number {
  return WEEKS_PER_YEAR * (monthsPerYear / MONTHS_PER_YEAR);
}

function getMonthlyOccurrences(perWeek: number): number {
  return perWeek * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
}

export type KilometervergoedingInput = {
  oneWayKilometers: number;
  workDaysPerWeek: number;
  monthsPerYear: number;
  employerRatePerKilometer: number;
  calculationMethod?: "actual-days" | "fixed-214-days";
};

export type KilometervergoedingResult = {
  calculationMethod: "actual-days" | "fixed-214-days";
  returnKilometersPerDay: number;
  workDaysPerMonth: number;
  workDaysInPeriod: number;
  fixedFullTimeDays: number;
  fixedCorrectedDays: number;
  reimbursementPerDay: number;
  reimbursementPerMonth: number;
  reimbursementPerYear: number;
  taxFreePerMonth: number;
  taxFreePerYear: number;
  taxablePerMonth: number;
  taxablePerYear: number;
  annualKilometers: number;
  withinTaxFreeLimit: boolean;
};

export function calculateKilometervergoeding(
  input: KilometervergoedingInput,
): KilometervergoedingResult {
  const calculationMethod = input.calculationMethod || "actual-days";
  const returnKilometersPerDay = input.oneWayKilometers * 2;
  const fixedFullTimeDays = 214;
  const fixedCorrectedDays = fixedFullTimeDays * (input.workDaysPerWeek / 5);
  const workDaysInPeriod =
    calculationMethod === "fixed-214-days"
      ? fixedCorrectedDays * (input.monthsPerYear / MONTHS_PER_YEAR)
      : input.workDaysPerWeek * getWeeksInSelectedPeriod(input.monthsPerYear);
  const workDaysPerMonth = workDaysInPeriod / input.monthsPerYear;
  const annualKilometers = returnKilometersPerDay * workDaysInPeriod;
  const reimbursementPerDay = returnKilometersPerDay * input.employerRatePerKilometer;
  const reimbursementPerMonth = reimbursementPerDay * workDaysPerMonth;
  const reimbursementPerYear = reimbursementPerDay * workDaysInPeriod;
  const taxFreeRate = Math.min(input.employerRatePerKilometer, TAX_FREE_KILOMETER_RATE_2026);
  const taxableRate = Math.max(0, input.employerRatePerKilometer - TAX_FREE_KILOMETER_RATE_2026);

  return {
    calculationMethod,
    returnKilometersPerDay: round2(returnKilometersPerDay),
    workDaysPerMonth: round2(workDaysPerMonth),
    workDaysInPeriod: round2(workDaysInPeriod),
    fixedFullTimeDays,
    fixedCorrectedDays: round2(fixedCorrectedDays),
    reimbursementPerDay: round2(reimbursementPerDay),
    reimbursementPerMonth: round2(reimbursementPerMonth),
    reimbursementPerYear: round2(reimbursementPerYear),
    taxFreePerMonth: round2(workDaysPerMonth * returnKilometersPerDay * taxFreeRate),
    taxFreePerYear: round2(annualKilometers * taxFreeRate),
    taxablePerMonth: round2(workDaysPerMonth * returnKilometersPerDay * taxableRate),
    taxablePerYear: round2(annualKilometers * taxableRate),
    annualKilometers: round2(annualKilometers),
    withinTaxFreeLimit: input.employerRatePerKilometer <= TAX_FREE_KILOMETER_RATE_2026,
  };
}

export type ZiekengeldInput = {
  monthlyGrossSalary: number;
  illnessYear: 1 | 2;
  employerCoveragePercentage: number;
};

export type ZiekengeldResult = {
  legalMinimumPercentage: number;
  selectedCoveragePercentage: number;
  expectedGrossPerMonth: number;
  legalMinimumGrossPerMonth: number;
  differenceWithCurrentSalary: number;
  differenceVsLegalMinimum: number;
  annualizedGross: number;
};

export function calculateZiekengeld(input: ZiekengeldInput): ZiekengeldResult {
  const legalMinimumPercentage = 70;
  const expectedGrossPerMonth = input.monthlyGrossSalary * (input.employerCoveragePercentage / 100);
  const legalMinimumGrossPerMonth = input.monthlyGrossSalary * (legalMinimumPercentage / 100);

  return {
    legalMinimumPercentage,
    selectedCoveragePercentage: round2(input.employerCoveragePercentage),
    expectedGrossPerMonth: round2(expectedGrossPerMonth),
    legalMinimumGrossPerMonth: round2(legalMinimumGrossPerMonth),
    differenceWithCurrentSalary: round2(input.monthlyGrossSalary - expectedGrossPerMonth),
    differenceVsLegalMinimum: round2(expectedGrossPerMonth - legalMinimumGrossPerMonth),
    annualizedGross: round2(expectedGrossPerMonth * 12),
  };
}

export type ThuiswerkvergoedingInput = {
  homeDaysPerWeek: number;
  monthsPerYear: number;
  employerRatePerDay: number;
};

export type ThuiswerkvergoedingResult = {
  homeDaysPerMonth: number;
  homeDaysInPeriod: number;
  maximumTaxFreePerMonth: number;
  maximumTaxFreePerYear: number;
  actualPerMonth: number;
  actualPerYear: number;
  taxablePerMonth: number;
  taxablePerYear: number;
  withinTaxFreeLimit: boolean;
};

export function calculateThuiswerkvergoeding(
  input: ThuiswerkvergoedingInput,
): ThuiswerkvergoedingResult {
  const homeDaysPerMonth = getMonthlyOccurrences(input.homeDaysPerWeek);
  const homeDaysInPeriod = input.homeDaysPerWeek * getWeeksInSelectedPeriod(input.monthsPerYear);
  const taxableRate = Math.max(0, input.employerRatePerDay - TAX_FREE_HOME_OFFICE_RATE_2026);

  return {
    homeDaysPerMonth: round2(homeDaysPerMonth),
    homeDaysInPeriod: round2(homeDaysInPeriod),
    maximumTaxFreePerMonth: round2(homeDaysPerMonth * TAX_FREE_HOME_OFFICE_RATE_2026),
    maximumTaxFreePerYear: round2(homeDaysInPeriod * TAX_FREE_HOME_OFFICE_RATE_2026),
    actualPerMonth: round2(homeDaysPerMonth * input.employerRatePerDay),
    actualPerYear: round2(homeDaysInPeriod * input.employerRatePerDay),
    taxablePerMonth: round2(homeDaysPerMonth * taxableRate),
    taxablePerYear: round2(homeDaysInPeriod * taxableRate),
    withinTaxFreeLimit: input.employerRatePerDay <= TAX_FREE_HOME_OFFICE_RATE_2026,
  };
}

export type OvertimeInput = {
  monthlyGrossSalary: number;
  contractHoursPerWeek: number;
  extraHoursThisMonth: number;
  overtimePremiumPercentage: number;
};

export type OvertimeResult = {
  contractualHoursPerMonth: number;
  hourlyRate: number;
  grossOvertimeValue: number;
  grossOvertimeWithPremium: number;
  premiumValue: number;
  recurringAnnualValue: number;
};

export function calculateOveruren(input: OvertimeInput): OvertimeResult {
  const contractualHoursPerMonth = input.contractHoursPerWeek * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
  const hourlyRate = input.monthlyGrossSalary / contractualHoursPerMonth;
  const grossOvertimeValue = hourlyRate * input.extraHoursThisMonth;
  const grossOvertimeWithPremium = grossOvertimeValue * (1 + (input.overtimePremiumPercentage / 100));

  return {
    contractualHoursPerMonth: round2(contractualHoursPerMonth),
    hourlyRate: round2(hourlyRate),
    grossOvertimeValue: round2(grossOvertimeValue),
    grossOvertimeWithPremium: round2(grossOvertimeWithPremium),
    premiumValue: round2(grossOvertimeWithPremium - grossOvertimeValue),
    recurringAnnualValue: round2(grossOvertimeWithPremium * 12),
  };
}

export type SalaryOfferInput = {
  monthlyGrossSalary: number;
  holidayAllowanceOnTop: boolean;
  holidayAllowancePercentage?: number;
  travelReimbursementMonthly: number;
  homeOfficeDaysPerWeek: number;
  annualBonusGross: number;
  vacationDaysPerYear: number;
  applyTaxCredits?: boolean;
  ageProfile?: TaxAgeProfile;
};

export type SalaryOfferResult = {
  regularMonthlyNet: number;
  netAnnualSalaryIncludingHoliday: number;
  netAnnualSalaryIncludingBonus: number;
  holidayAllowanceNet: number;
  annualBonusNet: number;
  monthlyTravelReimbursement: number;
  annualTravelReimbursement: number;
  monthlyHomeOfficeAllowance: number;
  annualHomeOfficeAllowance: number;
  extraVacationDays: number;
  dailyNetValue: number;
  vacationDaysValueNet: number;
  totalNetEquivalentMonthly: number;
  totalNetEquivalentAnnual: number;
  effectiveNetRatio: number;
};

export type SalaryComparisonResult = {
  offerA: SalaryOfferResult;
  offerB: SalaryOfferResult;
  winner: "offer_a" | "offer_b" | "tie";
  monthlyDifference: number;
};

function calculateSalaryOffer(input: SalaryOfferInput): SalaryOfferResult {
  const holidayAllowancePercentage =
    input.holidayAllowancePercentage ?? DEFAULT_HOLIDAY_ALLOWANCE_PERCENTAGE;
  const applyTaxCredits = input.applyTaxCredits ?? true;
  const ageProfile = input.ageProfile ?? "under_aow";
  const salaryEstimate = estimateNetFromGross({
    monthlyGross: input.monthlyGrossSalary,
    holidayAllowancePercentage,
    includeHolidayAllowance: input.holidayAllowanceOnTop,
    applyTaxCredits,
    ageProfile,
  });
  const packageEstimate = estimateNetFromTaxableIncome({
    taxableAnnualIncome: salaryEstimate.taxableAnnualIncome + input.annualBonusGross,
    applyTaxCredits,
    ageProfile,
  });
  const homeOfficeAllowance = calculateThuiswerkvergoeding({
    homeDaysPerWeek: input.homeOfficeDaysPerWeek,
    monthsPerYear: 12,
    employerRatePerDay: TAX_FREE_HOME_OFFICE_RATE_2026,
  });
  const dailyNetValue = salaryEstimate.netAnnualIncome / 261;
  const extraVacationDays = input.vacationDaysPerYear - STANDARD_VACATION_DAYS;
  const vacationDaysValueNet = dailyNetValue * extraVacationDays;
  const annualTravelReimbursement = input.travelReimbursementMonthly * 12;
  const totalNetEquivalentAnnual =
    packageEstimate.netAnnualIncome +
    annualTravelReimbursement +
    homeOfficeAllowance.maximumTaxFreePerYear +
    vacationDaysValueNet;

  return {
    regularMonthlyNet: round2(salaryEstimate.regularMonthlyNet),
    netAnnualSalaryIncludingHoliday: round2(salaryEstimate.netAnnualIncome),
    netAnnualSalaryIncludingBonus: round2(packageEstimate.netAnnualIncome),
    holidayAllowanceNet: round2(salaryEstimate.holidayAllowanceNet),
    annualBonusNet: round2(packageEstimate.netAnnualIncome - salaryEstimate.netAnnualIncome),
    monthlyTravelReimbursement: round2(input.travelReimbursementMonthly),
    annualTravelReimbursement: round2(annualTravelReimbursement),
    monthlyHomeOfficeAllowance: round2(homeOfficeAllowance.maximumTaxFreePerMonth),
    annualHomeOfficeAllowance: round2(homeOfficeAllowance.maximumTaxFreePerYear),
    extraVacationDays,
    dailyNetValue: round2(dailyNetValue),
    vacationDaysValueNet: round2(vacationDaysValueNet),
    totalNetEquivalentMonthly: round2(totalNetEquivalentAnnual / 12),
    totalNetEquivalentAnnual: round2(totalNetEquivalentAnnual),
    effectiveNetRatio: round2(packageEstimate.effectiveNetRatio),
  };
}

export function compareSalaryOffers(
  offerA: SalaryOfferInput,
  offerB: SalaryOfferInput,
): SalaryComparisonResult {
  const calculatedOfferA = calculateSalaryOffer(offerA);
  const calculatedOfferB = calculateSalaryOffer(offerB);
  const monthlyDifference = round2(
    Math.abs(calculatedOfferA.totalNetEquivalentMonthly - calculatedOfferB.totalNetEquivalentMonthly),
  );
  const winner: SalaryComparisonResult["winner"] =
    monthlyDifference < 0.01
      ? "tie"
      : calculatedOfferA.totalNetEquivalentMonthly > calculatedOfferB.totalNetEquivalentMonthly
        ? "offer_a"
        : "offer_b";

  return {
    offerA: calculatedOfferA,
    offerB: calculatedOfferB,
    winner,
    monthlyDifference,
  };
}

export type WwDagloonResult = {
  mode: "quick" | "advanced";
  referenceIncome: number;
  dayCount: number;
  rawDagloon: number;
  dagloon: number;
  maxDagloon: number;
  capped: boolean;
  capReduction: number;
  dailyBenefitFirstTwoMonths: number;
  dailyBenefitAfterTwoMonths: number;
  monthlyBenefitFirstTwoMonths: number;
  monthlyBenefitAfterTwoMonths: number;
};

function buildWwDagloonResult(
  mode: "quick" | "advanced",
  referenceIncome: number,
  dayCount: number,
): WwDagloonResult {
  const rawDagloon = referenceIncome / dayCount;
  const dagloon = Math.min(rawDagloon, WW_MAX_DAGLOON_2026);
  const dailyBenefitFirstTwoMonths = dagloon * 0.75;
  const dailyBenefitAfterTwoMonths = dagloon * 0.7;

  return {
    mode,
    referenceIncome: round2(referenceIncome),
    dayCount: round2(dayCount),
    rawDagloon: round2(rawDagloon),
    dagloon: round2(dagloon),
    maxDagloon: WW_MAX_DAGLOON_2026,
    capped: rawDagloon > WW_MAX_DAGLOON_2026,
    capReduction: round2(Math.max(0, rawDagloon - WW_MAX_DAGLOON_2026)),
    dailyBenefitFirstTwoMonths: round2(dailyBenefitFirstTwoMonths),
    dailyBenefitAfterTwoMonths: round2(dailyBenefitAfterTwoMonths),
    monthlyBenefitFirstTwoMonths: round2(dailyBenefitFirstTwoMonths * AVERAGE_WORKDAYS_PER_MONTH),
    monthlyBenefitAfterTwoMonths: round2(dailyBenefitAfterTwoMonths * AVERAGE_WORKDAYS_PER_MONTH),
  };
}

export type QuickWwDagloonInput = {
  monthlyGrossSalary: number;
  monthsWithSalary: number;
  holidayPercentage: number;
  annualReserve: number;
};

export function calculateQuickWwDagloon(input: QuickWwDagloonInput): WwDagloonResult {
  const grossReferenceIncome = input.monthlyGrossSalary * input.monthsWithSalary;
  const reservedHoliday = grossReferenceIncome * (input.holidayPercentage / 100);
  const referenceIncome = grossReferenceIncome + reservedHoliday + input.annualReserve;
  const dayCount = input.monthsWithSalary === 12
    ? 261
    : input.monthsWithSalary * AVERAGE_WORKDAYS_PER_MONTH;

  return buildWwDagloonResult("quick", referenceIncome, dayCount);
}

export type AdvancedWwDagloonInput = {
  svLoon: number;
  paidHolidayAndAvwb: number;
  reservedHolidayAndAvwb: number;
  dayCount: number;
};

export function calculateAdvancedWwDagloon(input: AdvancedWwDagloonInput): WwDagloonResult {
  const referenceIncome = Math.max(0, input.svLoon - input.paidHolidayAndAvwb + input.reservedHolidayAndAvwb);
  return buildWwDagloonResult("advanced", referenceIncome, input.dayCount);
}
