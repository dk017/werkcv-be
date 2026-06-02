"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { parseDecimal } from "@/lib/tools/calculator-utils";

type NoticeActor = "employee" | "employer";
type ContractType = "indefinite" | "fixed";
type StartEra = "from2014" | "before2014";

function formatWeeks(value: number) {
  return `${value} ${value === 1 ? "week" : "weken"}`;
}

function formatTenure(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? "maand" : "maanden"}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? "jaar" : "jaar"}`;
  }

  return `${years} ${years === 1 ? "jaar" : "jaar"} en ${months} ${months === 1 ? "maand" : "maanden"}`;
}

function getEmployeeNoticeWeeks(totalMonths: number) {
  if (totalMonths < 3) return 1;
  if (totalMonths < 6) return 2;
  if (totalMonths < 12) return 3;
  if (totalMonths < 18) return 4;
  if (totalMonths < 24) return 5;
  if (totalMonths < 48) return 6;
  if (totalMonths < 60) return 7;
  if (totalMonths < 72) return 9;
  if (totalMonths < 84) return 10;
  if (totalMonths < 96) return 12;
  return 13;
}

function getEmployerNoticeWeeks(totalMonths: number) {
  if (totalMonths < 3) return 1;
  if (totalMonths < 4) return 3;
  if (totalMonths < 5) return 4;
  if (totalMonths < 6) return 5;
  if (totalMonths < 9) return 6;
  if (totalMonths < 12) return 7;
  if (totalMonths < 15) return 8;
  if (totalMonths < 18) return 9;
  if (totalMonths < 21) return 10;
  if (totalMonths < 24) return 11;
  if (totalMonths < 36) return 12;
  if (totalMonths < 48) return 13;
  if (totalMonths < 60) return 15;
  if (totalMonths < 72) return 18;
  if (totalMonths < 84) return 21;
  if (totalMonths < 96) return 24;
  if (totalMonths < 108) return 27;
  if (totalMonths < 120) return 30;
  if (totalMonths < 132) return 33;
  if (totalMonths < 144) return 36;
  if (totalMonths < 156) return 39;
  if (totalMonths < 168) return 42;
  if (totalMonths < 180) return 45;
  if (totalMonths < 192) return 48;
  if (totalMonths < 204) return 51;
  if (totalMonths < 216) return 54;
  if (totalMonths < 228) return 57;
  if (totalMonths < 240) return 60;

  const fullYears = Math.floor(totalMonths / 12);
  return 62 + Math.max(0, fullYears - 20);
}

export default function NoticePeriodBelgiumChecker() {
  const [actor, setActor] = useState<NoticeActor>("employee");
  const [contractType, setContractType] = useState<ContractType>("indefinite");
  const [startEra, setStartEra] = useState<StartEra>("from2014");
  const [yearsOfService, setYearsOfService] = useState("2");
  const [extraMonths, setExtraMonths] = useState("0");

  const result = useMemo(() => {
    const years = parseDecimal(yearsOfService);
    const months = parseDecimal(extraMonths);
    const errors: string[] = [];

    if (contractType === "fixed") {
      return {
        supported: false as const,
        reason: "fixed" as const,
      };
    }

    if (actor === "employer" && startEra === "before2014") {
      return {
        supported: false as const,
        reason: "legacy" as const,
      };
    }

    if (!Number.isFinite(years) || years < 0 || years > 50) {
      errors.push("Gebruik voor anciënniteit een aantal jaren tussen 0 en 50.");
    }

    if (!Number.isFinite(months) || months < 0 || months >= 12) {
      errors.push("Gebruik voor extra maanden een waarde tussen 0 en 11.");
    }

    if (errors.length > 0) {
      return {
        supported: true as const,
        valid: false as const,
        errors,
      };
    }

    const totalMonths = Math.floor(years * 12) + Math.floor(months);
    const weeks =
      actor === "employee"
        ? getEmployeeNoticeWeeks(totalMonths)
        : getEmployerNoticeWeeks(totalMonths);

    return {
      supported: true as const,
      valid: true as const,
      totalMonths,
      weeks,
      actor,
      startEra,
    };
  }, [actor, contractType, extraMonths, startEra, yearsOfService]);

  return (
    <section className="border-y-4 border-black bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
              Belgische schatting
            </p>
            <h2 className="mt-3 text-3xl font-black text-black">
              Bereken je opzegtermijn zonder Nederlandse aannames
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Belgische opzegtermijnen hangen niet alleen af van anciënniteit,
              maar ook van wie opzegt en of je vaste contract onder het
              uniforme regime vanaf 1 januari 2014 valt. Daarom ondersteunt
              deze checker alleen de takken die we publiek en zorgvuldig kunnen
              berekenen.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                  Wie geeft de opzeg?
                </label>
                <div className="grid gap-3">
                  <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-[#fffef4] p-4">
                    <input
                      type="radio"
                      name="actor"
                      value="employee"
                      checked={actor === "employee"}
                      onChange={() => setActor("employee")}
                      className="mt-1 h-4 w-4 accent-black"
                    />
                    <span>
                      <span className="block text-sm font-black text-black">
                        Ik neem zelf ontslag
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Ondersteund voor contracten van onbepaalde duur met de
                        uniforme werknemerstabel sinds 28 oktober 2023.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-white p-4">
                    <input
                      type="radio"
                      name="actor"
                      value="employer"
                      checked={actor === "employer"}
                      onChange={() => setActor("employer")}
                      className="mt-1 h-4 w-4 accent-black"
                    />
                    <span>
                      <span className="block text-sm font-black text-black">
                        Mijn werkgever ontslaat mij met opzeg
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Ondersteund voor vaste contracten die vanaf 1 januari
                        2014 zijn gestart.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                  Welk contract wil je checken?
                </label>
                <div className="grid gap-3">
                  <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-[#fffef4] p-4">
                    <input
                      type="radio"
                      name="contractType"
                      value="indefinite"
                      checked={contractType === "indefinite"}
                      onChange={() => setContractType("indefinite")}
                      className="mt-1 h-4 w-4 accent-black"
                    />
                    <span>
                      <span className="block text-sm font-black text-black">
                        Contract van onbepaalde duur
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Dit is de veilige route voor deze publieke checker.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-white p-4">
                    <input
                      type="radio"
                      name="contractType"
                      value="fixed"
                      checked={contractType === "fixed"}
                      onChange={() => setContractType("fixed")}
                      className="mt-1 h-4 w-4 accent-black"
                    />
                    <span>
                      <span className="block text-sm font-black text-black">
                        Contract van bepaalde duur
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-700">
                        Niet ondersteund, omdat tussentijdse opzeg en de eerste
                        helft van het contract aparte regels volgen.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {actor === "employer" ? (
                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                    Wanneer startte dit vaste contract?
                  </label>
                  <div className="grid gap-3">
                    <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-[#fffef4] p-4">
                      <input
                        type="radio"
                        name="startEra"
                        value="from2014"
                        checked={startEra === "from2014"}
                        onChange={() => setStartEra("from2014")}
                        className="mt-1 h-4 w-4 accent-black"
                      />
                      <span>
                        <span className="block text-sm font-black text-black">
                          Op of na 1 januari 2014
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">
                          Dit valt onder de uniforme tabel die deze checker kan berekenen.
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 border-4 border-black bg-white p-4">
                      <input
                        type="radio"
                        name="startEra"
                        value="before2014"
                        checked={startEra === "before2014"}
                        onChange={() => setStartEra("before2014")}
                        className="mt-1 h-4 w-4 accent-black"
                      />
                      <span>
                        <span className="block text-sm font-black text-black">
                          Voor 1 januari 2014
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">
                          Niet publiek berekend wegens legacy-regels, mogelijke bedingclausules en verschillende regimes.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                    Volledige dienstjaren
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={yearsOfService}
                    onChange={(event) => setYearsOfService(event.target.value)}
                    className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-xl font-black text-black outline-none"
                    placeholder="bijv. 2"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                    Extra maanden
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={extraMonths}
                    onChange={(event) => setExtraMonths(event.target.value)}
                    className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-xl font-black text-black outline-none"
                    placeholder="0"
                  />
                </label>
              </div>

              <ul className="space-y-2 text-sm leading-7 text-slate-600">
                <li>
                  Deze checker toont de <span className="font-black text-black">duur van de opzegtermijn in weken</span>, niet automatisch je exacte einddatum.
                </li>
                <li>
                  De exacte kalenderdatum hangt ook af van <span className="font-black text-black">hoe en wanneer de opzeg wordt betekend</span>.
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
                    ? formatWeeks(result.weeks)
                    : "—"}
                </p>
              </div>
              <div className="border-2 border-black bg-yellow-300 px-3 py-2 text-sm font-black uppercase">
                België
              </div>
            </div>

            {!result.supported ? (
              <div className="mt-6 space-y-4">
                <div className="border-2 border-black bg-white p-4">
                  <p className="text-lg font-black text-black">
                    Voor deze situatie stoppen we bewust met rekenen.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {result.reason === "fixed"
                      ? "Bij contracten van bepaalde duur spelen tussentijdse opzeg, de eerste helft van het contract en contractspecifieke afspraken mee. Daarvoor is een versimpelde publieke checker te grof."
                      : "Voor ontslag door de werkgever bij contracten van voor 1 januari 2014 spelen legacy-regels, mogelijke clausules en verschillende historische regimes mee. Dat raden we hier bewust niet."}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <a
                    href="https://www.belgium.be/nl/werk/arbeidscontract/opzegging_en_ontslag/ontslag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-black bg-white px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Bekijk Belgium.be
                  </a>
                  <a
                    href="https://werk.belgie.be/nl/news/regels-inzake-vaststelling-van-de-opzeggingstermijn-vanaf-28-oktober-2023"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-black bg-white px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Bekijk FOD Werk
                  </a>
                </div>
                <div className="border-2 border-black bg-yellow-100 p-4">
                  <p className="text-sm font-medium leading-7 text-slate-700">
                    Zit je in een jobwissel? Je kunt wel al je volgende stap voorbereiden en je cv rustig klaarzetten, los van deze juridische detailvraag.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/templates"
                      className="border-4 border-black bg-yellow-400 px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Bekijk cv-templates
                    </Link>
                    <Link
                      href="/cv-maken-zonder-abonnement"
                      className="border-4 border-black bg-white px-4 py-3 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Werking zonder abonnement
                    </Link>
                  </div>
                </div>
              </div>
            ) : result.valid ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    Ingeschatte opzegtermijn
                  </p>
                  <p className="mt-2 text-3xl font-black text-emerald-900">
                    {formatWeeks(result.weeks)}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Op basis van een anciënniteit van <span className="font-black text-black">{formatTenure(result.totalMonths)}</span> en de gekozen Belgische route.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Situatie
                    </p>
                    <p className="mt-2 text-lg font-black text-black">
                      {result.actor === "employee" ? "Werknemer zegt op" : "Werkgever ontslaat"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {result.actor === "employee"
                        ? "Uniforme werknemerstabel sinds 28 oktober 2023."
                        : "Vast contract vanaf 1 januari 2014."}
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Meegetelde anciënniteit
                    </p>
                    <p className="mt-2 text-lg font-black text-black">
                      {formatTenure(result.totalMonths)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Deze checker rekent in maanden zodat ook kortere anciënniteit juist in de tabel valt.
                    </p>
                  </div>

                  <div className="border-2 border-black bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Niet inbegrepen
                    </p>
                    <p className="mt-2 text-lg font-black text-black">
                      Exacte einddatum
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Voor de kalenderdatum tellen kennisgeving, posttermijnen en de start op maandag mee.
                    </p>
                  </div>
                </div>

                <div className="border-2 border-black bg-yellow-100 p-4">
                  <p className="text-sm font-medium leading-7 text-slate-700">
                    {result.actor === "employee"
                      ? "Sinds 28 oktober 2023 geldt voor werknemers een uniforme tabel. Vanaf 8 jaar anciënniteit blijft de werknemerstermijn plafonneren op 13 weken."
                      : "Voor ontslag door de werkgever bij vaste contracten vanaf 1 januari 2014 loopt de opzegtermijn stapsgewijs op volgens de officiële Belgische tabel."}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Link
                    href="/templates"
                    className="border-4 border-black bg-yellow-400 px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Zet je volgende cv klaar
                  </Link>
                  <Link
                    href="/cv-maken-eenmalig-betalen"
                    className="border-4 border-black bg-white px-4 py-4 text-center text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Bekijk éénmalig betalen
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 border-2 border-red-300 bg-red-50 p-4">
                <p className="text-sm font-black text-red-800">
                  Controleer je invoer
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-red-700">
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
