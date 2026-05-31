import { NextRequest, NextResponse } from "next/server";
import { CvSamenvattingInput, generateCvSamenvatting } from "@/lib/tools/cv-samenvatting";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const huidigeFunctie = typeof body.huidigeFunctie === "string" ? body.huidigeFunctie.trim() : "";
        const doelrol = typeof body.doelrol === "string" ? body.doelrol.trim() : "";
        const ervaringJaren = typeof body.ervaringJaren === "string" ? body.ervaringJaren.trim() : "";
        const kernvaardigheden = typeof body.kernvaardigheden === "string" ? body.kernvaardigheden.trim() : "";
        const sterksteResultaat = typeof body.sterksteResultaat === "string" ? body.sterksteResultaat.trim() : "";
        const toon = body.toon === "enthousiast" || body.toon === "beknopt" ? body.toon : "professioneel";

        if (!huidigeFunctie || !doelrol) {
            return NextResponse.json(
                { error: "Huidige functie en doelrol zijn verplicht." },
                { status: 400 }
            );
        }

        const input: CvSamenvattingInput = {
            huidigeFunctie,
            doelrol,
            ervaringJaren,
            kernvaardigheden,
            sterksteResultaat,
            toon,
        };

        const samenvatting = await generateCvSamenvatting(input);

        return NextResponse.json({ samenvatting });
    } catch (error) {
        console.error("cv-samenvatting error:", error);
        return NextResponse.json(
            { error: "Genereren mislukt. Probeer het opnieuw." },
            { status: 500 }
        );
    }
}
