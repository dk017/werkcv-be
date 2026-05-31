'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

type CtaVariantId = 'trust' | 'speed';

type CtaExperimentProps = {
    locale: 'nl' | 'en';
    slug: string;
    href: string;
    defaultTitle: string;
    defaultText: string;
    defaultButtonLabel: string;
};

const STORAGE_KEY = 'werkcv_cta_variant_v1';

function isVariant(value: string | null): value is CtaVariantId {
    return value === 'trust' || value === 'speed';
}

function getVariantCopy(
    locale: 'nl' | 'en',
    fallbackTitle: string,
    fallbackText: string,
    fallbackButtonLabel: string
): Record<CtaVariantId, { title: string; text: string; button: string }> {
    if (locale === 'nl') {
        return {
            trust: {
                title: 'Solliciteren met meer vertrouwen',
                text: 'Gebruik een bewezen structuur, zet je sterkste resultaten bovenaan en download direct een professioneel CV. Eenmalig betalen, geen abonnement.',
                button: 'Start met je CV',
            },
            speed: {
                title: 'Binnen 5 minuten een sterk CV',
                text: 'Kies een template, vul je gegevens in en exporteer direct als PDF. Snel, ATS-vriendelijk en klaar om te versturen.',
                button: 'Maak direct mijn CV',
            },
        };
    }

    const speedTitle = fallbackTitle || 'Create a strong CV in minutes';
    const speedText =
        fallbackText ||
        'Pick a template, fill your details, and export an ATS-friendly PDF right away. Fast setup, ready to send.';
    const speedButton = fallbackButtonLabel || 'Start in 5 minutes';

    return {
        trust: {
            title: fallbackTitle || 'Apply with more confidence',
            text:
                fallbackText ||
                'Use a proven structure, highlight your strongest outcomes, and export a clean professional CV. One-time payment, no subscription.',
            button: fallbackButtonLabel || 'Build my CV',
        },
        speed: {
            title: speedTitle,
            text: speedText,
            button: speedButton,
        },
    };
}

function resolveInitialVariant(): CtaVariantId {
    if (typeof window === 'undefined') return 'trust';

    const params = new URLSearchParams(window.location.search);
    const forced = params.get('cta');
    if (isVariant(forced)) {
        window.localStorage.setItem(STORAGE_KEY, forced);
        return forced;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isVariant(saved)) {
        return saved;
    }

    const picked: CtaVariantId = Math.random() < 0.5 ? 'trust' : 'speed';
    window.localStorage.setItem(STORAGE_KEY, picked);
    return picked;
}

function getVariantHref(baseHref: string, variant: CtaVariantId): string {
    // Keep the same canonical destination path for SEO while testing
    // a speed-focused jump target.
    if (variant === 'speed') {
        return `${baseHref}#quick-start`;
    }
    return baseHref;
}

export default function CtaExperiment({
    locale,
    slug,
    href,
    defaultTitle,
    defaultText,
    defaultButtonLabel,
}: CtaExperimentProps) {
    const [variant] = useState<CtaVariantId>(() => resolveInitialVariant());
    const trackedViewRef = useRef(false);

    useEffect(() => {
        if (trackedViewRef.current) return;
        track('cta_viewed', {
            location: 'seo_wave_guide',
            variant,
            slug,
            locale,
        });
        trackedViewRef.current = true;
    }, [locale, slug, variant]);

    const variantCopy = useMemo(
        () => getVariantCopy(locale, defaultTitle, defaultText, defaultButtonLabel)[variant],
        [defaultButtonLabel, defaultText, defaultTitle, locale, variant]
    );
    const variantHref = useMemo(() => getVariantHref(href, variant), [href, variant]);

    const backgroundClass = locale === 'nl' ? 'bg-yellow-50' : 'bg-blue-50';

    return (
        <section className={`mt-12 p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${backgroundClass}`}>
            <h2 className="text-2xl font-black mb-2 text-gray-900">{variantCopy.title}</h2>
            <p className="text-gray-700 mb-4">{variantCopy.text}</p>
            <Link
                href={variantHref}
                onClick={() =>
                    track('cta_clicked', {
                        location: 'seo_wave_guide',
                        label: `${variant}_${slug}`,
                    })
                }
                className="inline-block bg-black text-white font-bold px-6 py-3 border-3 border-black"
            >
                {variantCopy.button}
            </Link>
        </section>
    );
}
