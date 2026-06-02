"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatEuro, parseDecimal } from "@/lib/tools/calculator-utils";

type EmploymentScenario = "employee-fixed" | "other";

function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("nl-BE", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export default function HolidayPayBelgiumChecker() {
  const [scenario, setScenario] = useState<EmploymentScenario>("employee-fixed");
  const [monthlyGross, setMonthlyGross] = useState("3200");
  const [earnedMonths, setEarnedMonths] = useState("12");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState("5");

  const result = useMemo(() => {
    const gross = parseDecimal(monthlyGross);
    const months = parseDecimal(earnedMonths);
    const workDays = parseDecimal(workDaysPerWeek);

    const errors: string[] = [];

    if (scenario !== "employee-fixed") {
      return {
        supported: false as const,
        errors,
      };
    }

    if (!Number.isFinite(gross) || gross <= 0) {
      errors.push("Vul een geldig bruto maandloon in.");
    }

    if (!Number.isFinite(months) || months <= 0 || months > 12) {
      errors.push("Gebruik een aantal opgebouwde maanden tussen 1 en 12.");
    }

    if (!Number.isFinite(workDays) || workDays <= 0 || workDays > 6) {
      errors.push("Kies een werkregime tussen 1 en 6 dagen per week.");
    }

    if (errors.length > 0) {
      return {
        supported: true as const,
        valid: false as const,
        errors,
      };
    }

    const prorataFactor = months / 12;
    const grossDoubleHolidayPay = gross * 0.92 * prorataFactor;
    const legalLeaveWeeks = 4 * prorataFactor;
    const legalLeaveDays = workDays * legalLeaveWeeks;

    return {
      supported: true as const,
      valid: true as const,
      gross,
      months,
      workDays,
      grossDoubleHolidayPay,
      legalLeaveWeeks,
      legalLeaveDays,
      monthlyEquivalent: gross * prorataFactor,
    };
  }, [earnedMonths, monthlyGross, scenario, workDaysPerWeek]);

  return (
    <section className="border-y-4 border-black bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
              Belgische schatting
            </p>
            <h2 className="mt-3 text-3xl font-black text-black">
              Bereken je dubbel vakantiegeld als bediende
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Deze checker is bewust beperkt tot een duidelijke situatie:
              een bediende in de privésector met een vast maandloon. Zo blijft
              de uitkomst bruikbaar en eerlijk in plaats van te doen alsof één
              formule voor iedereen in België werkt.
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
                      value="employee-fixed"
                      checked={scenario === "employee-fixed"}
                      onChange={() => setScenario("employee-fixed")}
                      className="mt-1 h-4 w-4 accent-black"
                    />
                    <span>
                      <span className="block text-sm font-black text-black">
                        Bediende in de privésector met vast maandloon
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Dit is de ondersteunde route van deze tool.
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
                        Arbeider, variabel loon, overheid, interim of andere situatie
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Daarvoor tonen we bewust geen simplistische berekening.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                  Bruto maandloon in de maand van je hoofdvakantie
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={monthlyGross}
                  onChange={(event) => setMonthlyGross(event.target.value)}
                  className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-2xl font-black text-black outline-none"
                  placeholder="bijv. 3200"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                    Opgebouwde maanden
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={earnedMonths}
                    onChange={(event) => setEarnedMonths(event.target.value)}
                    className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-xl font-black text-black outline-none"
                    placeholder="12"
                  />
                </label>

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
              </div>

              <ul className="space-y-2 text-sm leading-7 text-slate-600">
                <li>
                  De berekening volgt de officiële regel voor dubbel
                  vakantiegeld bij bedienden: <span className="font-black text-black">1/12 van 92% van het brutoloon per opgebouwde maand</span>.
                </li>
                <li>
                  Het aantal vakantiedagen hieronder is een praktische
                  schatting op basis van vier weken vakantie in je huidige
                  arbeidsstelsel.
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
                    ? formatEuro(result.grossDoubleHolidayPay, 0)
                    : "—"}
                </p>
              </div>
              <div className="border-2 border-black bg-yellow-300 px-3 py-2 text-sm font-black uppercase">
                92% regel
              </div>
            </div>

            {!result.supported ? (
              <div className="mt-6 space-y-4">
                <div className="border-2 border-black bg-white p-4">
                  <p className="text-lg font-black text-black">
                    Voor deze situatie stoppen we bewust met rekenen.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Voor arbeiders, variabel loon, interim, publieke sector,
                    vertrekvakantiegeld of complexe gelijkstellingen is een
                    simpele publieke calculator sneller misleidend dan nuttig.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <a
                    href="https://www.rjv.fgov.be/nl/heb-ik-recht-op-vakantiegeld"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-black bg-white px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Bekijk RJV-info
                  </a>
                  <a
                    href="https://www.socialsecurity.be/citizen/nl/verlof-tijdskrediet-en-loopbaanonderbreking/jaarlijkse-vakantie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-black bg-white px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Check Sociale Zekerheid
                  </a>
                </div>
              </div>
            ) : result.valid ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    Geschat dubbel vakantiegeld
                  </p>
                  <p className="mt-2 text-3xl font-black text-emerald-900">
                    {formatEuro(result.grossDoubleHolidayPay, 0)}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Op basis van een bruto maandloon van{" "}
                    <span className="font-black text-black">
                      {formatEuro(result.gross, 0)}
                    </span>{" "}
                    en{" "}
                    <span className="font-black text-black">
                      {formatNumber(result.months, 0)} opgebouwde maanden
                    </span>
                    .
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Geschatte vakantiedagen
                    </p>
                    <p className="mt-2 text-2xl font-black text-black">
                      {formatNumber(result.legalLeaveDays)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      In je huidige regime van {formatNumber(result.workDays, 0)} dagen per week.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Geschatte vakantieweken
                    </p>
                    <p className="mt-2 text-2xl font-black text-black">
                      {formatNumber(result.legalLeaveWeeks)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Maximaal vier weken per volledig opgebouwd jaar.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Normaal loon tijdens vakantie
                    </p>
                    <p className="mt-2 text-2xl font-black text-black">
                      {formatEuro(result.monthlyEquivalent, 0)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Dit is geen extra bonus, maar een praktische benadering van
                      het loon dat doorloopt tijdens je wettelijke vakantie.
                    </p>
                  </div>
                </div>

                <div className="border-2 border-black bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                    Hoe we rekenen
                  </p>
                  <p className="mt-2 text-lg font-black text-black">
                    bruto maandloon × 92% × (opgebouwde maanden / 12)
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Dit sluit aan op de officiële uitleg voor bedienden in de
                    privésector. Voor variabel loon, vertrekvakantiegeld,
                    loonwijzigingen of uitzonderlijke gelijkstellingen kan je
                    echte bedrag anders uitvallen.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Voor de vakantiedagen gebruiken we als vuistregel:
                    <span className="font-black text-black"> 4 weken × huidige werkdagen per week × opgebouwde maanden / 12</span>.
                  </p>
                </div>

                <div className="border-2 border-dashed border-black bg-white p-4">
                  <p className="text-sm font-black text-black">
                    Waarom tonen we geen netto bedrag?
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Omdat Belgische inhoudingen op vakantiegeld afhangen van je
                    fiscale situatie, loonopbouw en payrollcontext. Een ruwe
                    netto-schatter zou hier sneller schijnzekerheid geven dan
                    echte hulp.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-black bg-black p-5 text-white">
                  <p className="text-sm font-black">
                    Gebruik je looncheck als context voor een sterkere overstap
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Wie vakantiegeld opzoekt, vergelijkt vaak ook huidige
                    voorwaarden met een volgende job. Werk eerst je cv rustig
                    bij voordat je reageert.
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
