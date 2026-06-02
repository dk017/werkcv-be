"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { parseDecimal } from "@/lib/tools/calculator-utils";

type EmploymentScenario = "employee" | "other";

function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("nl-BE", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export default function VacationDaysBelgiumChecker() {
  const [scenario, setScenario] = useState<EmploymentScenario>("employee");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState("5");
  const [monthsWorkedPreviousYear, setMonthsWorkedPreviousYear] = useState("12");
  const [monthsWorkedCurrentYear, setMonthsWorkedCurrentYear] = useState("0");
  const [startedOrIncreasedThisYear, setStartedOrIncreasedThisYear] = useState(false);
  const [ordinaryDaysUsedUp, setOrdinaryDaysUsedUp] = useState(false);

  const result = useMemo(() => {
    const workDays = parseDecimal(workDaysPerWeek);
    const previousYearMonths = parseDecimal(monthsWorkedPreviousYear);
    const currentYearMonths = parseDecimal(monthsWorkedCurrentYear);

    const errors: string[] = [];

    if (scenario !== "employee") {
      return {
        supported: false as const,
        errors,
      };
    }

    if (!Number.isFinite(workDays) || workDays <= 0 || workDays > 6) {
      errors.push("Kies een huidig arbeidsstelsel tussen 1 en 6 dagen per week.");
    }

    if (!Number.isFinite(previousYearMonths) || previousYearMonths < 0 || previousYearMonths > 12) {
      errors.push("Gebruik voor vorig jaar een aantal maanden tussen 0 en 12.");
    }

    if (!Number.isFinite(currentYearMonths) || currentYearMonths < 0 || currentYearMonths > 12) {
      errors.push("Gebruik voor dit jaar een aantal maanden tussen 0 en 12.");
    }

    if (errors.length > 0) {
      return {
        supported: true as const,
        valid: false as const,
        errors,
      };
    }

    const fullEntitlementDays = workDays * 4;
    const ordinaryDays = fullEntitlementDays * (previousYearMonths / 12);
    const ordinaryWeeks = 4 * (previousYearMonths / 12);
    const additionalPotentialDays = Math.max(0, (fullEntitlementDays * (currentYearMonths / 12)) - ordinaryDays);
    const additionalEligibilityReached = startedOrIncreasedThisYear && currentYearMonths >= 3;
    const additionalOneWeekThresholdDays = startedOrIncreasedThisYear ? workDays : 0;

    return {
      supported: true as const,
      valid: true as const,
      workDays,
      previousYearMonths,
      currentYearMonths,
      fullEntitlementDays,
      ordinaryDays,
      ordinaryWeeks,
      additionalPotentialDays,
      additionalEligibilityReached,
      additionalOneWeekThresholdDays,
      ordinaryDaysUsedUp,
      startedOrIncreasedThisYear,
    };
  }, [monthsWorkedCurrentYear, monthsWorkedPreviousYear, ordinaryDaysUsedUp, scenario, startedOrIncreasedThisYear, workDaysPerWeek]);

  return (
    <section className="border-y-4 border-black bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
              Belgische schatting
            </p>
            <h2 className="mt-3 text-3xl font-black text-black">
              Bereken je gewone en aanvullende vakantiedagen
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Deze checker splitst bewust de twee Belgische logica&apos;s uit elkaar:
              gewone vakantie op basis van het vakantiedienstjaar en aanvullende
              vakantie voor wie dit jaar start, hervat of zijn arbeidsregime verhoogt.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                  Welke situatie past bij jou?
                </label>
                <div className="grid gap-3">
                  <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-[#fffef4] p-4">
                    <input
                      type="radio"
                      name="scenario"
                      value="employee"
                      checked={scenario === "employee"}
                      onChange={() => setScenario("employee")}
                      className="mt-1 h-4 w-4 accent-black"
                    />
                    <span>
                      <span className="block text-sm font-black text-black">
                        Bediende in de privésector
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Ondersteund voor gewone vakantie en een voorzichtige schatting van aanvullende vakantie.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-white p-4">
                    <input
                      type="radio"
                      name="scenario"
                      value="other"
                      checked={scenario === "other"}
                      onChange={() => setScenario("other")}
                      className="mt-1 h-4 w-4 accent-black"
                    />
                    <span>
                      <span className="block text-sm font-black text-black">
                        Arbeider, overheid of andere complexe situatie
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Daarvoor verwijzen we door naar de officiële berekening via Mijn vakantierekening of RJV.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                    Werkdagen per week nu
                  </span>
                  <select
                    value={workDaysPerWeek}
                    onChange={(event) => setWorkDaysPerWeek(event.target.value)}
                    className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-xl font-black text-black outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((value) => (
                      <option key={value} value={String(value)}>
                        {value} dag{value > 1 ? "en" : ""} per week
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                    Maanden gewerkt vorig jaar
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthsWorkedPreviousYear}
                    onChange={(event) => setMonthsWorkedPreviousYear(event.target.value)}
                    className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-xl font-black text-black outline-none"
                    placeholder="12"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                    Maanden gewerkt dit jaar
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthsWorkedCurrentYear}
                    onChange={(event) => setMonthsWorkedCurrentYear(event.target.value)}
                    className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-xl font-black text-black outline-none"
                    placeholder="bijv. 3 of 6"
                  />
                </label>
              </div>

              <div className="grid gap-3">
                <label className="flex items-start gap-3 border-4 border-black bg-white p-4">
                  <input
                    type="checkbox"
                    checked={startedOrIncreasedThisYear}
                    onChange={(event) => setStartedOrIncreasedThisYear(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                  />
                  <span>
                    <span className="block text-sm font-black text-black">
                      Ik ben dit jaar gestart, hervat of mijn arbeidsregime verhoogd
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-700">
                      Dit is de route waarin aanvullende vakantie relevant kan zijn.
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-3 border-4 border-black bg-white p-4">
                  <input
                    type="checkbox"
                    checked={ordinaryDaysUsedUp}
                    onChange={(event) => setOrdinaryDaysUsedUp(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                  />
                  <span>
                    <span className="block text-sm font-black text-black">
                      Mijn gewone vakantiedagen zijn al opgebruikt of ik had er geen
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-700">
                      Aanvullende vakantie kan pas nadat de gewone vakantiedagen op zijn.
                    </span>
                  </span>
                </label>
              </div>

              <ul className="space-y-2 text-sm leading-7 text-slate-600">
                <li>
                  Gewone vakantie blijft beperkt tot <span className="font-black text-black">maximaal 4 weken in je huidige arbeidsstelsel</span>.
                </li>
                <li>
                  Aanvullende vakantie begint pas na een <span className="font-black text-black">aanloopperiode van 3 maanden of 90 kalenderdagen</span> en blijft een recht, geen verplichting.
                </li>
              </ul>
            </div>
          </div>

          <div className="border-4 border-black bg-[#fffef4] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
                  Resultaat
                </p>
                <p className="mt-3 text-4xl font-black text-black">
                  {result.supported && result.valid
                    ? `${formatNumber(result.ordinaryDays)} dagen`
                    : "—"}
                </p>
              </div>
              <div className="border-2 border-black bg-yellow-300 px-3 py-2 text-sm font-black uppercase">
                4 weken max
              </div>
            </div>

            {!result.supported ? (
              <div className="mt-6 space-y-4">
                <div className="border-2 border-black bg-white p-4">
                  <p className="text-lg font-black text-black">
                    Voor deze situatie stoppen we bewust met rekenen.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Voor arbeiders, ambtenaren, sectorale extra verlofdagen of complexe gelijkstellingen is een vereenvoudigde publieke checker te grof.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <a
                    href="https://www.socialsecurity.be/citizen/nl/verlof-tijdskrediet-en-loopbaanonderbreking/jaarlijkse-vakantie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-black bg-white px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Check Sociale Zekerheid
                  </a>
                  <a
                    href="https://www.rjv.fgov.be/nl/herbeginnen-of-aanvullende-vakantie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-black bg-white px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Bekijk RJV-info
                  </a>
                </div>
              </div>
            ) : result.valid ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    Gewone wettelijke vakantie
                  </p>
                  <p className="mt-2 text-3xl font-black text-emerald-900">
                    {formatNumber(result.ordinaryDays)} dagen
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Op basis van <span className="font-black text-black">{formatNumber(result.previousYearMonths, 0)} maanden</span> in het vakantiedienstjaar en je huidige regime van <span className="font-black text-black">{formatNumber(result.workDays, 0)} dagen per week</span>.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Maximum per volledig jaar
                    </p>
                    <p className="mt-2 text-2xl font-black text-black">
                      {formatNumber(result.fullEntitlementDays)} dagen
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Dat zijn 4 weken in je huidige arbeidsstelsel.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Gewone vakantie in weken
                    </p>
                    <p className="mt-2 text-2xl font-black text-black">
                      {formatNumber(result.ordinaryWeeks)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Pro rata van vorig jaar, niet automatisch 4 weken.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Mogelijke aanvullende vakantie
                    </p>
                    <p className="mt-2 text-2xl font-black text-black">
                      {result.additionalEligibilityReached ? `${formatNumber(result.additionalPotentialDays)} dagen` : "Nog niet vrij"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Alleen relevant als je dit jaar startte, hervatte of je regime verhoogde.
                    </p>
                  </div>
                </div>

                {!result.startedOrIncreasedThisYear ? (
                  <div className="border-2 border-dashed border-black bg-white p-4">
                    <p className="text-sm font-black text-black">
                      Aanvullende vakantie is hier niet actief.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      Laat de gewone berekening staan als je gewoon wilt weten hoeveel wettelijke vakantie uit vorig jaar in je huidige arbeidsstelsel terechtkomt.
                    </p>
                  </div>
                ) : !result.additionalEligibilityReached ? (
                  <div className="border-2 border-dashed border-black bg-white p-4">
                    <p className="text-sm font-black text-black">
                      Je zit nog voor de aanloopperiode van 3 maanden.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      Volgens de officiële regels ontstaat aanvullende vakantie pas na minimaal 3 maanden of 90 kalenderdagen activiteit in hetzelfde kalenderjaar.
                    </p>
                  </div>
                ) : !result.ordinaryDaysUsedUp && result.ordinaryDays > 0 ? (
                  <div className="border-2 border-dashed border-black bg-white p-4">
                    <p className="text-sm font-black text-black">
                      Je aanvullende vakantie lijkt mogelijk, maar nog niet opneembaar.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      De aanvullende dagen komen pas in beeld nadat je gewone vakantiedagen opgebruikt zijn. Zodra dat gebeurd is, kan je werkgever de aanvullende vakantie verder beoordelen.
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Extra nuance voor aanvullende vakantie
                    </p>
                    <p className="mt-2 text-lg font-black text-black">
                      Na 3 maanden ontstaat eerst minstens {formatNumber(result.additionalOneWeekThresholdDays)} dag{result.additionalOneWeekThresholdDays > 1 ? "en" : ""} extra ruimte.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      Daarna groeit de aanvullende vakantie verder mee met je prestaties in het vakantiejaar. De teller hierboven is een planningstool, geen loonbrief of bindende HR-beslissing.
                    </p>
                  </div>
                )}

                <div className="border-2 border-black bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                    Hoe we rekenen
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    <span className="font-black text-black">Gewone vakantie:</span> 4 weken × huidige werkdagen per week × maanden gewerkt vorig jaar / 12.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    <span className="font-black text-black">Aanvullende vakantie:</span> pas na 3 maanden activiteit en alleen als je dit jaar start, hervat of je arbeidsregime verhoogde. We schatten de mogelijke extra ruimte als het verschil tussen 4 weken op basis van je prestaties dit jaar en je gewone vakantie uit vorig jaar.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-black bg-black p-5 text-white">
                  <p className="text-sm font-black">
                    Gebruik je pakketcheck als voorbereiding op een betere jobwissel
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Vakantiedagen en vakantiegeld zijn vaak precies de punten waarop kandidaten hun huidige voorwaarden vergelijken met een volgende stap. Werk daarna je cv bij voordat je reageert.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/editor"
                      className="border-4 border-black bg-yellow-400 px-4 py-3 text-center text-sm font-black text-black"
                    >
                      Start je cv
                    </Link>
                    <Link
                      href="/cv-maken-zonder-abonnement"
                      className="border-4 border-white bg-transparent px-4 py-3 text-center text-sm font-black text-white"
                    >
                      Hoe WerkCV werkt
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 border-2 border-red-300 bg-red-50 p-4">
                <p className="text-sm font-black text-red-900">
                  Vul eerst een geldige basis in.
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-red-800">
                  {result.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
