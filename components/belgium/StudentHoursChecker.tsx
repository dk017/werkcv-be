"use client";

import { useMemo, useState } from "react";

const STUDENT_HOURS_LIMIT = 650;

function formatHours(value: number) {
  return new Intl.NumberFormat("nl-BE").format(value);
}

export default function StudentHoursChecker() {
  const [workedHours, setWorkedHours] = useState("0");

  const parsedHours = Number.parseInt(workedHours || "0", 10);
  const safeHours = Number.isFinite(parsedHours) ? Math.max(0, parsedHours) : 0;

  const result = useMemo(() => {
    const remaining = Math.max(0, STUDENT_HOURS_LIMIT - safeHours);
    const overLimit = Math.max(0, safeHours - STUDENT_HOURS_LIMIT);
    const progress = Math.min(100, Math.round((safeHours / STUDENT_HOURS_LIMIT) * 100));

    return {
      remaining,
      overLimit,
      progress,
    };
  }, [safeHours]);

  return (
    <section className="border-b-4 border-black bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
              Snelle checker
            </p>
            <h2 className="mt-3 text-3xl font-black text-black">
              Hoeveel van je 650 uren heb je al gebruikt?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Vul in hoeveel uren je als jobstudent al gewerkt hebt. Je ziet meteen hoeveel uren er nog overblijven binnen het Belgische studentenstelsel.
            </p>
            <label className="mt-8 block">
              <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-black">
                Reeds gewerkte uren
              </span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={workedHours}
                onChange={(event) => setWorkedHours(event.target.value)}
                className="w-full border-4 border-black bg-[#fffef4] px-4 py-4 text-2xl font-black text-black outline-none"
              />
            </label>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Dit is een eenvoudige indicatie op basis van de officiële grens van 650 uren. Controleer je actuele teller altijd via Student at Work.
            </p>
          </div>

          <div className="border-4 border-black bg-[#fffef4] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
                  Resultaat
                </p>
                <p className="mt-3 text-4xl font-black text-black">
                  {formatHours(result.remaining)} uur over
                </p>
              </div>
              <div className="border-2 border-black bg-yellow-300 px-3 py-2 text-sm font-black uppercase">
                650 uur max
              </div>
            </div>

            <div className="mt-6 h-5 overflow-hidden border-4 border-black bg-white">
              <div
                className={`h-full ${result.overLimit > 0 ? "bg-red-400" : "bg-[#4ECDC4]"}`}
                style={{ width: `${result.progress}%` }}
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="border-2 border-black bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                  Gebruikt
                </p>
                <p className="mt-2 text-2xl font-black text-black">
                  {formatHours(Math.min(safeHours, STUDENT_HOURS_LIMIT))} uur
                </p>
              </div>
              <div className="border-2 border-black bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                  Status
                </p>
                <p className="mt-2 text-lg font-black text-black">
                  {result.overLimit > 0 ? `Je zit ${formatHours(result.overLimit)} uur boven de grens` : "Je zit nog binnen de grens"}
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
              <li>
                <span className="font-black text-black">Officiële grens:</span> 650 uren per kalenderjaar.
              </li>
              <li>
                <span className="font-black text-black">Belangrijk:</span> zodra je dichter bij de grens komt, is het slim om je planning en je Student at Work-teller te controleren.
              </li>
              <li>
                <span className="font-black text-black">Praktisch:</span> gebruik dit vooral als snelle check voor je sollicitatieplanning en beschikbaarheid.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
