"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="nl">
            <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#FFFEF0" }}>
                <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                    <div style={{ maxWidth: "480px", width: "100%", backgroundColor: "white", border: "4px solid black", padding: "32px", boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" }}>
                        <h1 style={{ fontSize: "24px", fontWeight: 900, textAlign: "center", marginBottom: "12px", color: "black" }}>
                            Er is iets misgegaan
                        </h1>
                        <p style={{ textAlign: "center", marginBottom: "24px", color: "black", fontWeight: 500 }}>
                            Er is een kritieke fout opgetreden. Probeer de pagina te herladen.
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                            <button
                                onClick={reset}
                                style={{
                                    padding: "12px 24px",
                                    fontWeight: 900,
                                    fontSize: "14px",
                                    border: "3px solid black",
                                    backgroundColor: "#facc15",
                                    color: "black",
                                    cursor: "pointer",
                                    boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                                }}
                            >
                                Herladen
                            </button>
                            <button
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                                style={{
                                    padding: "12px 24px",
                                    fontWeight: 900,
                                    fontSize: "14px",
                                    border: "3px solid black",
                                    backgroundColor: "#60a5fa",
                                    color: "black",
                                    boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                                    cursor: "pointer",
                                }}
                            >
                                Homepage
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
