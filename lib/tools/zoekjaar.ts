import { addMonths, createUtcDate, diffDays } from "@/lib/tools/calculator-utils";

export type ZoekjaarBasis =
    | "dutch_bachelor_or_master"
    | "dutch_post_master"
    | "cultural_policy"
    | "development_cooperation"
    | "scientific_research"
    | "erasmus_mundus"
    | "designated_foreign_institution";

export const zoekjaarBasisOptions: { value: ZoekjaarBasis; label: string }[] = [
    {
        value: "dutch_bachelor_or_master",
        label: "Accredited Dutch bachelor's or master's degree",
    },
    {
        value: "dutch_post_master",
        label: "Dutch post-master programme of at least 10 months",
    },
    {
        value: "cultural_policy",
        label: "Dutch study route under the Cultural Policy Act",
    },
    {
        value: "development_cooperation",
        label: "Dutch study route under development cooperation policy",
    },
    {
        value: "scientific_research",
        label: "Scientific research in the Netherlands",
    },
    {
        value: "erasmus_mundus",
        label: "Erasmus Mundus Joint Master",
    },
    {
        value: "designated_foreign_institution",
        label: "Foreign master's, post-master or PhD from a designated university",
    },
];

type ZoekjaarInput = {
    basis: ZoekjaarBasis;
    completionDate: string;
    hadPreviousOrientationYear: boolean;
    newQualificationAfterPreviousOrientationYear: boolean;
    researchPermitEligible: boolean;
    foreignInstitutionTop200Eligible: boolean;
    hasNufficEvaluation: boolean;
    hasAcceptedLanguageProof: boolean;
};

export type ZoekjaarStatus = "eligible" | "needs_evidence" | "not_eligible";

export type ZoekjaarCheckResult = {
    basis: ZoekjaarBasis;
    basisLabel: string;
    completionDate: Date;
    applicationDeadline: Date;
    daysUntilDeadline: number;
    withinWindow: boolean;
    hadPreviousOrientationYear: boolean;
    repeatRuleEligible: boolean;
    researchPermitEligible: boolean;
    foreignInstitutionTop200Eligible: boolean;
    hasNufficEvaluation: boolean;
    hasAcceptedLanguageProof: boolean;
    status: ZoekjaarStatus;
    eligible: boolean;
    missingChecks: string[];
    actionItems: string[];
};

function getTodayUtcDate(referenceDate: Date): Date {
    return new Date(Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth(),
        referenceDate.getUTCDate(),
    ));
}

export function checkZoekjaarEligibility(
    input: ZoekjaarInput,
    referenceDate = new Date(),
): ZoekjaarCheckResult {
    const completionDate = createUtcDate(input.completionDate);

    if (!completionDate) {
        throw new Error("Enter a valid completion, doctorate or research end date.");
    }

    const today = getTodayUtcDate(referenceDate);
    const applicationDeadline = addMonths(completionDate, 36);
    const withinWindow = today.getTime() <= applicationDeadline.getTime();
    const repeatRuleEligible = !input.hadPreviousOrientationYear || input.newQualificationAfterPreviousOrientationYear;
    const foreignRoute = input.basis === "designated_foreign_institution";
    const researchRoute = input.basis === "scientific_research";
    const basisLabel = zoekjaarBasisOptions.find((option) => option.value === input.basis)?.label ?? input.basis;
    const missingChecks: string[] = [];
    const actionItems: string[] = [];

    if (!withinWindow) {
        missingChecks.push("The IND 3-year application window appears to have expired.");
    }

    if (!repeatRuleEligible) {
        missingChecks.push("The same study, doctorate or research basis cannot be reused after a previous orientation year.");
    }

    if (researchRoute && !input.researchPermitEligible) {
        missingChecks.push("The research basis needs the specific IND research permit or a qualifying research HSM appointment with UFO code starting with 01.");
        actionItems.push("Confirm that your Dutch research was under Directive (EU) 2016/801 or a qualifying research HSM appointment.");
    }

    if (foreignRoute && !input.foreignInstitutionTop200Eligible) {
        missingChecks.push("The foreign university must meet the IND top-200 rule on your graduation or promotion date in at least 2 of the 3 accepted rankings.");
        actionItems.push("Verify the university ranking on your graduation or promotion date before you rely on the foreign-degree route.");
    }

    if (foreignRoute && !input.hasNufficEvaluation) {
        missingChecks.push("The foreign diploma still needs a Nuffic credential evaluation unless the accredited degree is from Flanders.");
        actionItems.push("Request a Nuffic credential evaluation through IDW before filing the application.");
    }

    if (foreignRoute && !input.hasAcceptedLanguageProof) {
        missingChecks.push("The foreign-degree route also needs accepted English or Dutch language proof.");
        actionItems.push("Prepare one accepted language-proof route such as IELTS 6.0+, another accepted test, civic integration evidence, or proof the programme was taught in English or Dutch.");
    }

    if (withinWindow && repeatRuleEligible) {
        actionItems.push("If you want a salaried route instead, also check the reduced salary criterion in the highly skilled migrant route.");
    }

    const eligible = missingChecks.length === 0;
    const status: ZoekjaarStatus = eligible
        ? "eligible"
        : (!withinWindow || !repeatRuleEligible ? "not_eligible" : "needs_evidence");

    return {
        basis: input.basis,
        basisLabel,
        completionDate,
        applicationDeadline,
        daysUntilDeadline: diffDays(today, applicationDeadline),
        withinWindow,
        hadPreviousOrientationYear: input.hadPreviousOrientationYear,
        repeatRuleEligible,
        researchPermitEligible: researchRoute ? input.researchPermitEligible : true,
        foreignInstitutionTop200Eligible: foreignRoute ? input.foreignInstitutionTop200Eligible : true,
        hasNufficEvaluation: foreignRoute ? input.hasNufficEvaluation : true,
        hasAcceptedLanguageProof: foreignRoute ? input.hasAcceptedLanguageProof : true,
        status,
        eligible,
        missingChecks,
        actionItems,
    };
}
