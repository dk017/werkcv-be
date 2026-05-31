"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function EditorError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Editor error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#FFFEF0] flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
                <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-16 h-16 bg-orange-400 border-4 border-black flex items-center justify-center mx-auto mb-6 -rotate-2">
                        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-black text-center mb-3">
                        Er ging iets mis in de editor
                    </h1>
                    <p className="text-black font-medium text-center mb-2">
                        Je werk is automatisch opgeslagen. Probeer de editor opnieuw te laden.
                    </p>
                    <p className="text-sm text-gray-600 text-center mb-6">
                        Als het probleem aanhoudt, probeer dan een ander template of neem contact met ons op.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 py-3 font-black text-sm border-3 border-black bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            style={{ borderWidth: "3px" }}
                        >
                            Opnieuw proberen
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-3 font-black text-sm border-3 border-black bg-blue-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                            style={{ borderWidth: "3px" }}
                        >
                            Naar homepage
                        </Link>
                    </div>

                    {/* Collapsible error details for debugging */}
                    <details className="mt-6 text-left">
                        <summary className="text-xs font-bold text-gray-500 cursor-pointer hover:text-black transition-colors">
                            Technische details
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 border-2 border-black p-3 overflow-x-auto whitespace-pre-wrap break-all text-gray-700">
                            {error.message}
                            {error.digest && `\nDigest: ${error.digest}`}
                        </pre>
                    </details>
                </div>
            </div>
        </div>
    );
}
