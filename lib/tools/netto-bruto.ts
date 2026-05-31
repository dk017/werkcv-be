export type TaxAgeProfile = "under_aow" | "aow_full_year";

export interface SalaryEstimateInput {
    monthlyGross: number;
    holidayAllowancePercentage: number;
    includeHolidayAllowance: boolean;
    applyTaxCredits: boolean;
    ageProfile: TaxAgeProfile;
}

export interface SalaryEstimateResult {
    monthlyGross: number;
    baseAnnualGross: number;
    holidayAllowanceGross: number;
    taxableAnnualIncome: number;
    grossTax: number;
    generalTaxCredit: number;
    labourTaxCredit: number;
    taxCreditsApplied: number;
    taxDue: number;
    netAnnualIncome: number;
    regularMonthlyNet: number;
    holidayAllowanceNet: number;
    effectiveTaxRate: number;
}

export interface AnnualTaxEstimateInput {
    taxableAnnualIncome: number;
    applyTaxCredits: boolean;
    ageProfile: TaxAgeProfile;
}

export interface AnnualTaxEstimateResult {
    taxableAnnualIncome: number;
    grossTax: number;
    generalTaxCredit: number;
    labourTaxCredit: number;
    taxCreditsApplied: number;
    taxDue: number;
    netAnnualIncome: number;
    effectiveTaxRate: number;
    effectiveNetRatio: number;
}

const BOX_ONE_BRACKETS = {
    under_aow: [
        { limit: 38883, rate: 0.3575 },
        { limit: 78426, rate: 0.3756 },
        { limit: Infinity, rate: 0.495 },
    ],
    aow_full_year: [
        { limit: 38883, rate: 0.1785 },
        { limit: 78426, rate: 0.3756 },
        { limit: Infinity, rate: 0.495 },
    ],
} as const;

function roundCurrency(value: number): number {
    return Math.round(value * 100) / 100;
}

function clampZero(value: number): number {
    return value < 0 ? 0 : value;
}

function calculateBoxOneTax(taxableIncome: number, ageProfile: TaxAgeProfile): number {
    let remaining = taxableIncome;
    let previousLimit = 0;
    let tax = 0;

    for (const bracket of BOX_ONE_BRACKETS[ageProfile]) {
        if (remaining <= 0) {
            break;
        }

        const bracketWidth = bracket.limit === Infinity ? remaining : bracket.limit - previousLimit;
        const amountInBracket = Math.min(remaining, bracketWidth);
        tax += amountInBracket * bracket.rate;
        remaining -= amountInBracket;
        previousLimit = bracket.limit;
    }

    return roundCurrency(tax);
}

function calculateGeneralTaxCredit(income: number, ageProfile: TaxAgeProfile): number {
    if (ageProfile === "aow_full_year") {
        if (income <= 29736) {
            return 1556;
        }

        if (income <= 78426) {
            return roundCurrency(1556 - (0.03195 * (income - 29736)));
        }

        return 0;
    }

    if (income <= 29736) {
        return 3115;
    }

    if (income <= 78426) {
        return roundCurrency(3115 - (0.06398 * (income - 29736)));
    }

    return 0;
}

function calculateLabourTaxCredit(income: number, ageProfile: TaxAgeProfile): number {
    if (ageProfile === "aow_full_year") {
        if (income <= 11965) {
            return roundCurrency(0.04156 * income);
        }

        if (income <= 25845) {
            return roundCurrency(498 + (0.15483 * (income - 11965)));
        }

        if (income <= 45592) {
            return roundCurrency(2647 + (0.00974 * (income - 25845)));
        }

        if (income <= 132920) {
            return roundCurrency(2840 - (0.0325 * (income - 45592)));
        }

        return 0;
    }

    if (income <= 11965) {
        return roundCurrency(0.08324 * income);
    }

    if (income <= 25845) {
        return roundCurrency(996 + (0.31009 * (income - 11965)));
    }

    if (income <= 45592) {
        return roundCurrency(5300 + (0.0195 * (income - 25845)));
    }

    if (income <= 132920) {
        return roundCurrency(5685 - (0.0651 * (income - 45592)));
    }

    return 0;
}

export function estimateNetFromTaxableIncome(input: AnnualTaxEstimateInput): AnnualTaxEstimateResult {
    const taxableAnnualIncome = roundCurrency(Math.max(0, input.taxableAnnualIncome));
    const grossTax = calculateBoxOneTax(taxableAnnualIncome, input.ageProfile);

    const generalTaxCredit = input.applyTaxCredits
        ? calculateGeneralTaxCredit(taxableAnnualIncome, input.ageProfile)
        : 0;
    const labourTaxCredit = input.applyTaxCredits
        ? calculateLabourTaxCredit(taxableAnnualIncome, input.ageProfile)
        : 0;

    const taxCreditsApplied = roundCurrency(generalTaxCredit + labourTaxCredit);
    const taxDue = roundCurrency(clampZero(grossTax - taxCreditsApplied));
    const netAnnualIncome = roundCurrency(clampZero(taxableAnnualIncome - taxDue));
    const effectiveNetRatio = taxableAnnualIncome > 0
        ? netAnnualIncome / taxableAnnualIncome
        : 0;
    const effectiveTaxRate = taxableAnnualIncome > 0
        ? roundCurrency((taxDue / taxableAnnualIncome) * 100)
        : 0;

    return {
        taxableAnnualIncome,
        grossTax,
        generalTaxCredit,
        labourTaxCredit,
        taxCreditsApplied,
        taxDue,
        netAnnualIncome,
        effectiveTaxRate,
        effectiveNetRatio,
    };
}

export function estimateNetFromGross(input: SalaryEstimateInput): SalaryEstimateResult {
    const baseAnnualGross = roundCurrency(input.monthlyGross * 12);
    const holidayAllowanceGross = input.includeHolidayAllowance
        ? roundCurrency(baseAnnualGross * (input.holidayAllowancePercentage / 100))
        : 0;
    const annualTaxEstimate = estimateNetFromTaxableIncome({
        taxableAnnualIncome: baseAnnualGross + holidayAllowanceGross,
        applyTaxCredits: input.applyTaxCredits,
        ageProfile: input.ageProfile,
    });
    const regularMonthlyNet = roundCurrency(input.monthlyGross * annualTaxEstimate.effectiveNetRatio);
    const holidayAllowanceNet = roundCurrency(holidayAllowanceGross * annualTaxEstimate.effectiveNetRatio);

    return {
        monthlyGross: roundCurrency(input.monthlyGross),
        baseAnnualGross,
        holidayAllowanceGross,
        taxableAnnualIncome: annualTaxEstimate.taxableAnnualIncome,
        grossTax: annualTaxEstimate.grossTax,
        generalTaxCredit: annualTaxEstimate.generalTaxCredit,
        labourTaxCredit: annualTaxEstimate.labourTaxCredit,
        taxCreditsApplied: annualTaxEstimate.taxCreditsApplied,
        taxDue: annualTaxEstimate.taxDue,
        netAnnualIncome: annualTaxEstimate.netAnnualIncome,
        regularMonthlyNet,
        holidayAllowanceNet,
        effectiveTaxRate: annualTaxEstimate.effectiveTaxRate,
    };
}

export function estimateGrossFromTargetNet(
    targetRegularMonthlyNet: number,
    input: Omit<SalaryEstimateInput, "monthlyGross">,
): SalaryEstimateResult {
    let low = 0;
    let high = Math.max(targetRegularMonthlyNet * 3, 10000);
    let estimate = estimateNetFromGross({ ...input, monthlyGross: high });

    while (estimate.regularMonthlyNet < targetRegularMonthlyNet && high < 100000) {
        high *= 1.5;
        estimate = estimateNetFromGross({ ...input, monthlyGross: high });
    }

    for (let index = 0; index < 40; index += 1) {
        const mid = (low + high) / 2;
        const midEstimate = estimateNetFromGross({ ...input, monthlyGross: mid });

        if (midEstimate.regularMonthlyNet < targetRegularMonthlyNet) {
            low = mid;
        } else {
            high = mid;
            estimate = midEstimate;
        }
    }

    return estimate;
}
