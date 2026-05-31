import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getUserCVs } from '@/app/actions';
import { CVData } from '@/lib/cv';
import CvGrid from './CvGrid';
import LogoutButton from './LogoutButton';

export const metadata = {
    title: 'Mijn CV\'s | WerkCV',
};

export default async function MijnCvsPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login?next=/mijn-cvs');
    }

    const cvs = await getUserCVs();

    return (
        <main className="min-h-screen bg-[#f1f5f4]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
                    <Link href="/" className="font-semibold text-xl tracking-tight text-slate-900">
                        Werk<span className="bg-emerald-200 px-1 rounded-sm">CV</span>.nl
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 hidden sm:block">{user.email}</span>
                        <LogoutButton />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-5 py-8">
                {/* Page title + new CV button */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Mijn CV&apos;s</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {cvs.length === 0
                                ? 'Je hebt nog geen CV\'s aangemaakt.'
                                : `${cvs.length} CV${cvs.length > 1 ? '\'s' : ''} opgeslagen`}
                        </p>
                    </div>
                    <Link
                        href="/templates"
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold text-sm border border-emerald-700 hover:bg-emerald-700 transition-colors"
                    >
                        + Nieuw CV
                    </Link>
                </div>

                {cvs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-400 text-4xl mb-4">📄</p>
                        <p className="text-slate-600 font-semibold mb-1">Nog geen CV&apos;s</p>
                        <p className="text-slate-400 text-sm mb-6">Start met een template om je eerste CV te maken.</p>
                        <Link
                            href="/templates"
                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-md font-semibold text-sm border border-emerald-700 hover:bg-emerald-700 transition-colors"
                        >
                            Kies een template
                        </Link>
                    </div>
                ) : (
                    <CvGrid
                        cvs={cvs.map((cv) => ({
                            id: cv.id,
                            title: cv.title,
                            templateId: cv.templateId,
                            colorThemeId: cv.colorThemeId ?? 'classic-blue',
                            data: cv.data as unknown as CVData,
                            updatedAt: cv.updatedAt.toISOString(),
                            isPaid: cv.isPaid,
                        }))}
                    />
                )}
            </div>
        </main>
    );
}
