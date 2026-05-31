"use client";
import { useState } from "react";
import { CVData } from "@/lib/cv";
import { UiLanguage } from "@/lib/ui-language";

interface KeywordResult {
    keyword: string;
    found: boolean;
}

interface KeywordScannerWidgetProps {
    data: CVData;
    uiLanguage?: UiLanguage;
}

export default function KeywordScannerWidget({ data, uiLanguage = "nl" }: KeywordScannerWidgetProps) {
    const isEnglish = uiLanguage === "en";
    const [expanded, setExpanded] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [results, setResults] = useState<KeywordResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const missing = results?.filter(r => !r.found) ?? [];
    const found = results?.filter(r => r.found) ?? [];

    async function handleScan() {
        if (!jobDescription.trim() || jobDescription.trim().length < 20) {
            setError(isEnglish ? 'Paste the full vacancy text (at least 20 characters).' : 'Plak de volledige vacaturetekst (minimaal 20 tekens).');
            return;
        }
        setError('');
        setIsLoading(true);
        setResults(null);

        try {
            const res = await fetch('/api/keyword-scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription, cvData: data }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body.error ?? (isEnglish ? 'Analysis failed. Please try again.' : 'Analyse mislukt. Probeer het opnieuw.'));
                return;
            }

            const json = await res.json();
            setResults(json.keywords ?? []);
        } catch {
            setError(isEnglish ? 'Connection error. Check your internet and try again.' : 'Verbindingsfout. Controleer je internet en probeer opnieuw.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCopyMissing() {
        if (missing.length === 0) return;
        const text = missing.map(r => r.keyword).join(', ');
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleReset() {
        setResults(null);
        setJobDescription('');
        setError('');
    }

    const missingScore = results
        ? Math.round((found.length / results.length) * 100)
        : null;

    return (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
            >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4ECDC4]/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{isEnglish ? "Job Scanner" : "Vacature Scanner"}</span>
                        <span className="text-[10px] font-bold bg-[#4ECDC4]/20 text-teal-700 px-1.5 py-0.5 rounded-full">{isEnglish ? "NEW" : "NIEUW"}</span>
                    </div>
                    {results ? (
                        <p className="text-sm font-semibold text-slate-800">
                            {missing.length === 0
                                ? (isEnglish ? "All keywords found." : '🎉 Alle keywords aanwezig!')
                                : <><span className="text-red-600">{isEnglish ? `${missing.length} keywords missing` : `${missing.length} keywords ontbreken`}</span> · {isEnglish ? `${found.length} found` : `${found.length} gevonden`}</>
                            }
                        </p>
                    ) : (
                        <p className="text-sm text-slate-500">{isEnglish ? "Paste a vacancy and see which keywords are missing." : "Plak een vacature en zie welke keywords ontbreken"}</p>
                    )}
                </div>

                {/* Match % badge when results available */}
                {missingScore !== null && (
                    <span className={`flex-shrink-0 text-sm font-black px-2 py-1 rounded-lg ${
                        missingScore >= 80 ? 'bg-emerald-100 text-emerald-700'
                        : missingScore >= 50 ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                        {missingScore}%
                    </span>
                )}

                <svg
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Body */}
            {expanded && (
                <div className="border-t border-slate-100 px-5 py-4 space-y-4">

                    {/* Input area — hide once results are shown */}
                    {!results && (
                        <>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                                    {isEnglish ? "Job description" : "Vacaturetekst"}
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={e => { setJobDescription(e.target.value); setError(''); }}
                                    placeholder={isEnglish ? "Paste the full job description here..." : "Plak hier de volledige vacaturetekst..."}
                                    rows={6}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none font-medium"
                                />
                                {error && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
                                )}
                            </div>

                            <button
                                onClick={handleScan}
                                disabled={isLoading || jobDescription.trim().length < 20}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#4ECDC4] hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 text-sm font-bold rounded-lg transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        {isEnglish ? "Analyzing..." : "Analyseren..."}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        {isEnglish ? "Analyze job description" : "Analyseer vacature"}
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    {/* Results */}
                    {results && (
                        <div className="space-y-4">

                            {/* Missing keywords */}
                            {missing.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wide text-red-600">
                                            {isEnglish ? `Missing from your CV (${missing.length})` : `❌ Ontbreekt in je CV (${missing.length})`}
                                        </span>
                                        <button
                                            onClick={handleCopyMissing}
                                            className="text-[11px] font-bold text-teal-600 hover:text-teal-800 transition-colors"
                                        >
                                            {copied ? (isEnglish ? "Copied." : '✓ Gekopieerd!') : (isEnglish ? "Copy all" : 'Kopieer alles')}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {missing.map(r => (
                                            <span
                                                key={r.keyword}
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"
                                            >
                                                {r.keyword}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2 leading-snug">
                                        {isEnglish ? (
                                            <>
                                                Add these keywords to your experience, skills, or profile summary. Or use{" "}
                                                <span className="font-bold text-sky-700">ATS Rewrite</span> to process them automatically.
                                            </>
                                        ) : (
                                            <>
                                                Voeg deze keywords toe aan je werkervaring, vaardigheden of profieltekst. Of gebruik{" "}
                                                <span className="font-bold text-sky-700">ATS Rewrite</span> om ze automatisch te verwerken.
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Found keywords */}
                            {found.length > 0 && (
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 block mb-2">
                                        {isEnglish ? `Found in your CV (${found.length})` : `✅ Aanwezig in je CV (${found.length})`}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {found.map(r => (
                                            <span
                                                key={r.keyword}
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            >
                                                {r.keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All found */}
                            {missing.length === 0 && (
                                <p className="text-sm font-semibold text-emerald-700 text-center py-2">
                                    {isEnglish ? "Your CV contains all keywords from this vacancy." : "🎉 Je CV bevat alle keywords uit deze vacature!"}
                                </p>
                            )}

                            {/* Reset */}
                            <button
                                onClick={handleReset}
                                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                {isEnglish ? "Analyze another vacancy" : "Nieuwe vacature analyseren"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
