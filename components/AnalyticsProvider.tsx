"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, trackLanding, trackPageView } from "@/lib/analytics";

/**
 * Client component that tracks page views on route changes.
 * Include once in the root layout.
 */
export default function AnalyticsProvider() {
    const pathname = usePathname();

    useEffect(() => {
        const search = typeof window !== 'undefined' ? window.location.search : '';
        trackLanding(pathname, search);
        trackPageView(pathname);
    }, [pathname]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
            if (!anchor) return;
            if (anchor.dataset.trackCta === 'manual') return;

            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (pathname === '/editor' || pathname.startsWith('/editor/')) return;

            let url: URL;
            try {
                url = new URL(href, window.location.origin);
            } catch {
                return;
            }

            if (url.origin !== window.location.origin) return;

            const toPath = url.pathname;
            const isFunnelCtaTarget =
                toPath.startsWith('/editor') ||
                toPath.startsWith('/templates') ||
                toPath.startsWith('/prijzen') ||
                toPath.startsWith('/cv-maken-zonder-abonnement') ||
                toPath.startsWith('/cv-maken-eenmalig-betalen') ||
                toPath.startsWith('/cv-optimaliseren') ||
                toPath.startsWith('/cv-verbeteren') ||
                toPath.startsWith('/cv-checken') ||
                toPath.startsWith('/cv-nakijken') ||
                toPath.startsWith('/en/resume-optimizer-netherlands') ||
                toPath.startsWith('/tools/sollicitatiebrief-generator');
            if (!isFunnelCtaTarget) return;

            const label =
                anchor.getAttribute('aria-label') ||
                anchor.textContent?.trim() ||
                toPath;

            track('landing_cta_click', {
                fromPath: pathname,
                toPath,
                label: label.slice(0, 120),
            });
        };

        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [pathname]);

    return null;
}
