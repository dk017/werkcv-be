import Link from 'next/link';
import { CVCategory } from '@/lib/categories';

interface RelatedCVsProps {
    categories: CVCategory[];
    currentSlug: string;
    basePath: string; // e.g., '/cv-voorbeeld/ict-en-software'
}

export function RelatedCVs({ categories, currentSlug, basePath }: RelatedCVsProps) {
    if (categories.length === 0) return null;

    return (
        <section className="border-t-4 border-black bg-[#F0F0F0]">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-black mb-6">
                    Gerelateerde CV voorbeelden
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {categories.map((category) => {
                        // Build the full path for the related category
                        const href = category.parentId
                            ? `${basePath}/${category.slug}`
                            : `/cv-voorbeeld/${category.slug}`;

                        return (
                            <Link
                                key={category.id}
                                href={href}
                                className="group bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                            >
                                <h3 className="font-bold text-lg mb-2 group-hover:text-[#FF6B6B] transition-colors">
                                    CV voorbeeld {category.nameDutch}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {category.description}
                                </p>
                                <span className="inline-flex items-center text-sm font-bold text-[#4ECDC4] mt-3">
                                    Bekijk voorbeeld
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Anchor text strategy - contextual internal links */}
                <div className="mt-8 p-4 bg-white border-2 border-black">
                    <p className="text-sm text-gray-700">
                        <strong>Tip:</strong> Bekijk ook onze{' '}
                        <Link href="/cv-voorbeeld" className="text-[#FF6B6B] font-bold hover:underline">
                            complete collectie CV voorbeelden
                        </Link>{' '}
                        voor meer inspiratie, of start direct met het{' '}
                        <Link href="/templates" className="text-[#4ECDC4] font-bold hover:underline">
                            maken van je eigen CV
                        </Link>.
                    </p>
                </div>
            </div>
        </section>
    );
}
