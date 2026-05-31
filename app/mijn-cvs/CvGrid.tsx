'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CVData } from '@/lib/cv';
import { SampleCVPreview } from '@/components/seo/SampleCVPreview';
import { deleteCV } from '@/app/actions';
import { getTemplateConfig } from '@/lib/templates/registry';
import { getEditorPathForCv } from '@/lib/editor-path';

interface CvItem {
    id: string;
    title: string;
    templateId: string;
    colorThemeId: string;
    data: CVData;
    updatedAt: string;
    isPaid: boolean;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function CvCard({ cv }: { cv: CvItem }) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const templateConfig = getTemplateConfig(cv.templateId);
    const displayName = cv.data.personal.name || cv.title || 'Naamloos CV';
    const editorPath = getEditorPathForCv(cv.data, cv.id);

    const handleDelete = async () => {
        setDeleting(true);
        await deleteCV(cv.id);
        router.refresh();
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {/* Mini CV preview */}
            <Link href={editorPath} className="block h-[220px] overflow-hidden bg-slate-50 border-b border-slate-200">
                <SampleCVPreview
                    data={cv.data}
                    templateId={cv.templateId}
                    colorThemeId={cv.colorThemeId}
                    scale={0.32}
                    maxHeight={220}
                />
            </Link>

            {/* Card info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{displayName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{templateConfig.nameDutch} · {formatDate(cv.updatedAt)}</p>
                    </div>
                    {cv.isPaid && (
                        <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✓ Gedownload
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    <Link
                        href={editorPath}
                        className="flex-1 text-center bg-emerald-600 text-white text-xs font-semibold py-2 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                    >
                        Bewerken
                    </Link>

                    {!confirming ? (
                        <button
                            onClick={() => setConfirming(true)}
                            className="text-xs font-semibold text-slate-400 hover:text-rose-600 px-2 py-2 rounded-md hover:bg-rose-50 transition-colors"
                            title="Verwijderen"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    ) : (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-2 py-1.5 rounded-md transition-colors disabled:opacity-60"
                            >
                                {deleting ? '...' : 'Ja, verwijder'}
                            </button>
                            <button
                                onClick={() => setConfirming(false)}
                                className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-md transition-colors"
                            >
                                Annuleer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CvGrid({ cvs }: { cvs: CvItem[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((cv) => (
                <CvCard key={cv.id} cv={cv} />
            ))}
        </div>
    );
}
