"use client";
import { useMemo, useState } from "react";
import { CVData } from "@/lib/cv";
import { computeCvScore } from "@/lib/cv-score";
import { UiLanguage } from "@/lib/ui-language";

interface CvScoreWidgetProps {
    data: CVData;
    uiLanguage?: UiLanguage;
}

const RADIUS = 28;
const CIRC = 2 * Math.PI * RADIUS;

export default function CvScoreWidget({ data, uiLanguage = "nl" }: CvScoreWidgetProps) {
    const isEnglish = uiLanguage === "en";
    const [checked, setChecked] = useState(false);
    const [expanded, setExpanded] = useState(true);

    // Only compute once user triggers the check
    const result = useMemo(
        () => (checked ? computeCvScore(data, uiLanguage) : null),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [checked, checked ? data : null, uiLanguage]
    );

    const passedCount = result?.checks.filter(c => c.passed).length ?? 0;
    const totalCount = result?.checks.length ?? 0;
    const dashOffset = result ? CIRC * (1 - result.score / 100) : CIRC;
    const failedChecks = result?.checks.filter(c => !c.passed) ?? [];
    const passedChecks = result?.checks.filter(c => c.passed) ?? [];

    // ── Pre-check state ────────────────────────────────────────────────────────
    if (!checked) {
        return (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4ECDC4]/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-0.5">CV Score</p>
                    <p className="text-xs text-slate-500">{isEnglish ? "Check how strong your CV is and what to improve." : "Controleer hoe sterk je CV is en wat je kunt verbeteren."}</p>
                </div>
                <button
                    onClick={() => setChecked(true)}
                    className="flex-shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                >
                    {isEnglish ? "Check CV" : "Controleer CV"}
                </button>
            </section>
        );
    }

    // ── Post-check state ───────────────────────────────────────────────────────
    return (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
            >
                {/* Score Ring */}
                <div className="relative flex-shrink-0 w-16 h-16">
                    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                        <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="6" />
                        <circle
                            cx="32" cy="32" r={RADIUS}
                            fill="none"
                            stroke={result?.ringColor ?? '#e2e8f0'}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={CIRC}
                            strokeDashoffset={dashOffset}
                            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.4s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-black text-slate-800">{result?.score ?? 0}</span>
                    </div>
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-0.5">CV Score</p>
                    <p className={`text-sm font-bold ${result?.color ?? ''} leading-tight`}>{result?.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {isEnglish ? `${passedCount} of ${totalCount} checks passed` : `${passedCount} van ${totalCount} checks geslaagd`}
                    </p>
                </div>

                {/* Re-check link + chevron */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={e => { e.stopPropagation(); setChecked(false); }}
                        className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {isEnglish ? "Reset" : "Opnieuw"}
                    </button>
                    <svg
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Check list */}
            {expanded && (
                <div className="border-t border-slate-100 px-5 pb-4 pt-3 space-y-1">
                    {failedChecks.map(check => (
                        <div key={check.id} className="flex items-start gap-2.5 py-1.5">
                            <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-700 leading-snug">{check.label}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{check.tip}</p>
                            </div>
                            <span className="flex-shrink-0 text-[10px] font-bold text-slate-400 mt-0.5">+{check.points}</span>
                        </div>
                    ))}

                    {passedChecks.length > 0 && failedChecks.length > 0 && (
                        <div className="border-t border-slate-100 pt-1 mt-1" />
                    )}

                    {passedChecks.map(check => (
                        <div key={check.id} className="flex items-center gap-2.5 py-1">
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <p className="text-xs text-slate-400 line-through leading-snug">{check.label}</p>
                        </div>
                    ))}

                    {result?.score === 100 && (
                        <p className="text-xs text-emerald-700 font-semibold text-center py-2">
                            {isEnglish ? "Your CV is fully optimized." : "🎉 Je CV is volledig geoptimaliseerd!"}
                        </p>
                    )}

                    {/* Re-check button at bottom */}
                    <div className="pt-2">
                        <button
                            onClick={() => { setChecked(false); setTimeout(() => setChecked(true), 50); }}
                            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            {isEnglish ? "Recalculate score" : "Score opnieuw berekenen"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
