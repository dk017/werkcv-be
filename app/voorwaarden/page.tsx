import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Algemene Voorwaarden - WerkCV",
    description: "Lees de algemene voorwaarden van WerkCV.nl. Informatie over onze dienst, prijzen, betaling en aansprakelijkheid.",
};

export default function VoorwaardenPage() {
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
                    <h1 className="text-3xl font-black text-black mb-2">Algemene Voorwaarden</h1>
                    <p className="text-sm font-medium text-gray-500 mb-8">Laatst bijgewerkt: februari 2025</p>

                    <div className="prose prose-sm max-w-none space-y-6 text-black">
                        <section>
                            <h2 className="text-lg font-black text-black mb-2">1. Definities</h2>
                            <ul className="list-disc pl-6 space-y-1 font-medium">
                                <li><strong>Dienst</strong>: de online CV-builder beschikbaar op WerkCV.nl</li>
                                <li><strong>Gebruiker</strong>: iedere persoon die gebruik maakt van de Dienst</li>
                                <li><strong>CV</strong>: het curriculum vitae dat de Gebruiker aanmaakt via de Dienst</li>
                                <li><strong>PDF-download</strong>: het downloaden van het CV als PDF-bestand</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">2. Toepasselijkheid</h2>
                            <p className="font-medium leading-relaxed">
                                Deze algemene voorwaarden zijn van toepassing op elk gebruik van de Dienst. Door gebruik te maken
                                van WerkCV.nl ga je akkoord met deze voorwaarden.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">3. De Dienst</h2>
                            <p className="font-medium leading-relaxed">
                                WerkCV.nl biedt een online CV-builder waarmee Gebruikers een professioneel CV kunnen aanmaken.
                                Het aanmaken en bewerken van een CV is gratis. Voor het downloaden van het CV als PDF-bestand
                                wordt een eenmalige betaling gevraagd.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">4. Prijzen en betaling</h2>
                            <ul className="list-disc pl-6 space-y-1 font-medium">
                                <li>Het downloaden van een CV als PDF kost een eenmalig bedrag (zie de actuele prijs op de website)</li>
                                <li>Er zijn geen abonnementen of terugkerende kosten</li>
                                <li>Betaling verloopt via onze betalingsprovider Polar</li>
                                <li>Na betaling kun je je CV direct downloaden</li>
                                <li>Alle genoemde prijzen zijn inclusief BTW</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">5. Herroepingsrecht</h2>
                            <p className="font-medium leading-relaxed">
                                Omdat de Dienst digitale inhoud levert die direct na betaling beschikbaar wordt gesteld,
                                geldt er geen herroepingsrecht nadat de PDF-download beschikbaar is gemaakt. Door te betalen
                                stem je ermee in dat de levering direct begint en dat je afziet van je herroepingsrecht
                                conform artikel 6:230p lid 1 sub d van het Burgerlijk Wetboek.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">6. Intellectueel eigendom</h2>
                            <p className="font-medium leading-relaxed">
                                De inhoud van je CV blijft jouw eigendom. De CV-templates, het ontwerp en de software
                                van WerkCV.nl zijn en blijven eigendom van WerkCV.nl. Je krijgt een persoonlijk,
                                niet-overdraagbaar gebruiksrecht op het gedownloade PDF-bestand.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">7. Aansprakelijkheid</h2>
                            <p className="font-medium leading-relaxed">
                                WerkCV.nl is niet aansprakelijk voor de inhoud van het CV dat de Gebruiker aanmaakt.
                                De Gebruiker is zelf verantwoordelijk voor de juistheid en volledigheid van de
                                ingevoerde gegevens. WerkCV.nl garandeert niet dat het gebruik van onze templates
                                leidt tot het verkrijgen van een baan of sollicitatiegesprek.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">8. Beschikbaarheid</h2>
                            <p className="font-medium leading-relaxed">
                                Wij streven naar een zo hoog mogelijke beschikbaarheid van de Dienst, maar kunnen
                                geen ononderbroken toegang garanderen. Wij zijn niet aansprakelijk voor schade als
                                gevolg van (tijdelijke) onbeschikbaarheid van de website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">9. Wijzigingen</h2>
                            <p className="font-medium leading-relaxed">
                                WerkCV.nl behoudt zich het recht voor om deze algemene voorwaarden te wijzigen.
                                Wijzigingen worden op de website gepubliceerd. Door na een wijziging gebruik te
                                blijven maken van de Dienst, ga je akkoord met de gewijzigde voorwaarden.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-black mb-2">10. Toepasselijk recht</h2>
                            <p className="font-medium leading-relaxed">
                                Op deze algemene voorwaarden en het gebruik van de Dienst is Nederlands recht van
                                toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
