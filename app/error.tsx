"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#FFFEF0] flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
                <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-16 h-16 bg-red-400 border-4 border-black flex items-center justify-center mx-auto mb-6 rotate-3">
                        <span className="text-3xl font-black text-black">!</span>
                    </div>
                    <h1 className="text-2xl font-black text-black text-center mb-3">
                        Er is iets misgegaan
                    </h1>
                    <p className="text-black font-medium text-center mb-6">
                        Er is een onverwachte fout opgetreden. Probeer het opnieuw of ga terug naar de homepage.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 py-3 font-black text-sm border-3 border-black bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            style={{ borderWidth: "3px" }}
                        >
                            Probeer opnieuw
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-3 font-black text-sm border-3 border-black bg-blue-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                            style={{ borderWidth: "3px" }}
                        >
                            Naar homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
