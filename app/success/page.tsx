import type { Metadata } from "next";
import Link from "next/link";
import { getCV } from "@/app/actions";
import { getEditorPathForLanguage } from "@/lib/editor-path";
import { prisma } from "@/lib/prisma";
import { getResumeLanguage, ResumeLanguage } from "@/lib/resume-language";
import PurchaseTracker from "./PurchaseTracker";

export const metadata: Metadata = {
    title: "Betaling Geslaagd - WerkCV",
    description: "Je betaling is geslaagd. Download nu je professionele CV als PDF.",
    robots: { index: false, follow: false },
};

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ cvId?: string; lang?: string; bundle?: string }>;
}) {
    const { cvId, lang, bundle } = await searchParams;
    let uiLanguage: ResumeLanguage | null = lang === "en" || lang === "nl" ? lang : null;

    if (!uiLanguage && cvId) {
        const cv = await getCV(cvId);
        uiLanguage = getResumeLanguage(cv);
    }

    const resolvedLanguage = uiLanguage ?? "nl";
    const tr = (dutch: string, english: string) => (resolvedLanguage === "en" ? english : dutch);
    const editorPath = cvId ? getEditorPathForLanguage(resolvedLanguage, cvId) : "/";
    const hasProfilePhotoBundle = bundle === "profile-photo";
    const profilePhotoPath = resolvedLanguage === "en"
        ? "/en/profile-photo#profielfoto-tool"
        : "/profielfoto-cv-maken#profielfoto-tool";
    const paidOrder = cvId
        ? await prisma.order.findFirst({
            where: {
                cvId,
                paidAt: { not: null },
            },
            orderBy: { paidAt: "desc" },
            select: {
                id: true,
                product: true,
                amountCents: true,
                currency: true,
            },
        })
        : null;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            <PurchaseTracker
                orderId={paidOrder?.id}
                cvId={cvId}
                product={paidOrder?.product}
                amountCents={paidOrder?.amountCents ?? undefined}
                currency={paidOrder?.currency ?? undefined}
            />
            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {tr("Betaling geslaagd!", "Payment successful!")}
                </h1>

                <p className="text-gray-600 mb-8">
                    {tr(
                        hasProfilePhotoBundle
                            ? "Je sollicitatiepakket is betaald. Download je CV direct en maak je AI-profielfoto nu of later via hetzelfde account."
                            : "Bedankt voor je aankoop. Je kunt nu je CV downloaden als PDF.",
                        hasProfilePhotoBundle
                            ? "Your application package is paid. Download your CV immediately and create your AI profile photo now or later from the same account."
                            : "Thanks for your purchase. You can now download your CV as a PDF."
                    )}
                </p>

                {hasProfilePhotoBundle ? (
                    <div className="space-y-4 text-left">
                        {cvId && (
                            <div className="rounded-2xl border-2 border-black bg-[#FFFEF9] p-4">
                                <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                                    {tr("Stap 1", "Step 1")}
                                </p>
                                <h2 className="mt-1 text-lg font-black text-gray-900">
                                    {tr("Download je CV", "Download your CV")}
                                </h2>
                                <p className="mt-1 text-sm font-medium leading-relaxed text-gray-600">
                                    {tr(
                                        "Je PDF is direct beschikbaar. Je kunt later terug naar de editor om opnieuw te downloaden.",
                                        "Your PDF is available immediately. You can return to the editor later to download it again."
                                    )}
                                </p>
                                <a
                                    href={`/api/pdf?cvId=${cvId}`}
                                    className="mt-4 block w-full rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-bold text-white shadow-md transition hover:bg-black"
                                >
                                    {tr("Download PDF", "Download PDF")}
                                </a>
                            </div>
                        )}

                        <div className="rounded-2xl border-2 border-black bg-[#E9FFFC] p-4">
                            <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                                {tr("Stap 2", "Step 2")}
                            </p>
                            <h2 className="mt-1 text-lg font-black text-gray-900">
                                {tr("Maak je AI-profielfoto", "Create your AI profile photo")}
                            </h2>
                            <p className="mt-1 text-sm font-medium leading-relaxed text-gray-600">
                                {tr(
                                    "Upload een foto, maak 4 varianten en download je favoriet. Dit zit al in je bundle; je betaalt niet opnieuw.",
                                    "Upload a photo, create 4 variants and download your favorite. This is already included in your bundle; you do not pay again."
                                )}
                            </p>
                            <Link
                                href={profilePhotoPath}
                                className="mt-4 block w-full rounded-full bg-teal-300 px-6 py-3 text-center text-sm font-bold text-gray-900 shadow-md transition hover:bg-teal-400"
                            >
                                {tr("Maak mijn AI-profielfoto", "Create my AI profile photo")}
                            </Link>
                        </div>

                        <Link
                            href={editorPath}
                            className="block w-full rounded-full bg-gray-100 px-6 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                        >
                            {tr("Terug naar editor", "Back to editor")}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cvId && (
                            <a
                                href={`/api/pdf?cvId=${cvId}`}
                                className="block w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-full font-bold text-sm shadow-md transition"
                            >
                                {tr("Download PDF", "Download PDF")}
                            </a>
                        )}

                        <Link
                            href={editorPath}
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold text-sm transition"
                        >
                            {tr("Terug naar editor", "Back to editor")}
                        </Link>
                    </div>
                )}

                <p className="text-xs text-gray-400 mt-8">
                    {tr(
                        hasProfilePhotoBundle
                            ? "Je profielfoto blijft inbegrepen zolang je hetzelfde WerkCV-account gebruikt."
                            : "Je kunt je CV altijd opnieuw downloaden door terug te gaan naar de editor.",
                        hasProfilePhotoBundle
                            ? "Your profile photo stays included as long as you use the same WerkCV account."
                            : "You can always download your CV again by going back to the editor."
                    )}
                </p>
            </div>
        </div>
    );
}
