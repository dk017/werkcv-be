import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Privacybeleid - WerkCV",
    description: "Hoe WerkCV.nl omgaat met je persoonsgegevens. Lees ons privacybeleid over gegevensverzameling, AVG-rechten en beveiliging.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FFFEF0]">
            {/* Header */}
            <header className="relative z-10 border-b-4 border-black bg-white">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-black text-2xl tracking-tight text-black">
                            Werk<span className="bg-yellow-400 px-1">CV</span>.nl
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-bold text-black bg-yellow-400 px-3 py-1 border-2 border-black hover:bg-yellow-300 transition-colors"
                    >
                        CV Maken
                    </Link>
                </div>
            </header>

            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white border-4 border-black p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-3xl font-black text-black mb-2">Privacybeleid</h1>
                    <p className="text-sm font-medium text-gray-500 mb-8">Laatst bijgewerkt: februari 2025</p>

                    <div className="prose prose-sm max-w-none space-y-6 text-black">
                        <section>
                            <h2 className="text-lg font-black text-black mb-2">1. Wie zijn wij</h2>
                            <p className="font-medium leading-relaxed">
                                WerkCV.nl is een online CV-builder waarmee je eenvoudig een professioneel CV kunt maken en downloaden als PDF.
                                Je kunt contact met ons opnemen via het e-mailadres op onze website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">2. Welke gegevens verzamelen wij</h2>
                            <p className="font-medium leading-relaxed mb-2">
                                Wij verzamelen en verwerken de volgende persoonsgegevens die je zelf invoert bij het maken van je CV:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 font-medium">
                                <li>Naam, adres, postcode en woonplaats</li>
                                <li>E-mailadres en telefoonnummer</li>
                                <li>Geboortedatum, geboorteplaats, nationaliteit</li>
                                <li>Werkervaring, opleiding, stages, vaardigheden en cursussen</li>
                                <li>Overige informatie die je in je CV invult</li>
                            </ul>
                            <p className="font-medium leading-relaxed mt-2">
                                Bij betaling worden betalingsgegevens verwerkt door onze betalingsprovider (Polar). Wij slaan geen creditcardnummers of bankgegevens op.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">3. Waarvoor gebruiken wij je gegevens</h2>
                            <ul className="list-disc pl-6 space-y-1 font-medium">
                                <li>Het aanmaken en opslaan van je CV</li>
                                <li>Het genereren en leveren van je PDF-download</li>
                                <li>Het verwerken van betalingen</li>
                                <li>Het verbeteren van onze dienstverlening</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">4. Rechtsgrond</h2>
                            <p className="font-medium leading-relaxed">
                                Wij verwerken je persoonsgegevens op basis van de uitvoering van een overeenkomst (Art. 6(1)(b) AVG):
                                je gegevens zijn nodig om de dienst te leveren die je bij ons afneemt (het maken en downloaden van een CV).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">5. Cookies</h2>
                            <p className="font-medium leading-relaxed">
                                WerkCV.nl gebruikt alleen functionele cookies die noodzakelijk zijn voor de werking van de website.
                                Wij gebruiken geen tracking cookies of cookies van derden voor advertentiedoeleinden.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">6. Bewaartermijn</h2>
                            <p className="font-medium leading-relaxed">
                                Je CV-gegevens worden bewaard zolang je account actief is. Je kunt op elk moment verzoeken om verwijdering
                                van je gegevens door contact met ons op te nemen.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">7. Delen met derden</h2>
                            <p className="font-medium leading-relaxed mb-2">
                                Wij delen je gegevens alleen met de volgende partijen, uitsluitend voor zover nodig voor onze dienstverlening:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 font-medium">
                                <li><strong>Polar</strong> - voor het verwerken van betalingen</li>
                                <li><strong>Hostingprovider</strong> - voor het opslaan van je CV-gegevens</li>
                            </ul>
                            <p className="font-medium leading-relaxed mt-2">
                                Wij verkopen je gegevens nooit aan derden.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">8. Jouw rechten (AVG)</h2>
                            <p className="font-medium leading-relaxed mb-2">
                                Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb je de volgende rechten:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 font-medium">
                                <li><strong>Recht op inzage</strong> - Je mag opvragen welke gegevens wij van je hebben</li>
                                <li><strong>Recht op rectificatie</strong> - Je mag je gegevens laten corrigeren</li>
                                <li><strong>Recht op wissing</strong> - Je mag je gegevens laten verwijderen</li>
                                <li><strong>Recht op dataportabiliteit</strong> - Je mag je gegevens in een gangbaar formaat ontvangen</li>
                                <li><strong>Recht op bezwaar</strong> - Je mag bezwaar maken tegen de verwerking van je gegevens</li>
                            </ul>
                            <p className="font-medium leading-relaxed mt-2">
                                Om gebruik te maken van deze rechten kun je contact met ons opnemen via e-mail.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">9. Beveiliging</h2>
                            <p className="font-medium leading-relaxed">
                                Wij nemen passende technische en organisatorische maatregelen om je persoonsgegevens te beschermen tegen
                                verlies, misbruik of ongeautoriseerde toegang. Onze website maakt gebruik van een beveiligde HTTPS-verbinding.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">10. Contact</h2>
                            <p className="font-medium leading-relaxed">
                                Heb je vragen over dit privacybeleid of wil je gebruik maken van je rechten?
                                Neem dan contact met ons op via het e-mailadres op onze website.
                                Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
