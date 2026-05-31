export type LocaleCode = 'nl' | 'en';

export interface AttributionSnapshot {
    version: 1;
    firstTouchAt: string;
    firstTouchPath: string;
    firstTouchCluster: string;
    firstTouchReferrer: string;
    lastTouchAt: string;
    lastTouchPath: string;
    lastTouchCluster: string;
    locale: LocaleCode;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    utmContent: string;
    gclid: string;
    fbclid: string;
    msclkid: string;
}

const emptyAttributionFields = {
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    gclid: '',
    fbclid: '',
    msclkid: '',
};

function cleanPath(path: string): string {
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
}

export function getPathCluster(pathname: string): string {
    const path = cleanPath(pathname);
    if (path === '/') return 'home';
    if (path === '/en/resume-optimizer-netherlands') return 'resume-optimizer-en';
    if (path.startsWith('/en')) return 'en-guides';
    if (
        path === '/cv-optimaliseren' ||
        path === '/cv-verbeteren' ||
        path === '/cv-checken' ||
        path === '/cv-nakijken'
    ) {
        return 'cv-improvement';
    }
    if (path === '/cvster-opzeggen' || path === '/cv-nl-opzeggen' || path === '/cvmaker-opzeggen') {
        return 'opzeggen';
    }
    if (path === '/gratis-cv-template') return 'free-template';
    if (path.startsWith('/cv-voorbeelden')) return 'nl-cv-voorbeelden';
    if (path.startsWith('/cv-gids')) return 'nl-cv-gids';
    if (path.startsWith('/cv-tips')) return 'nl-cv-tips';
    if (path.startsWith('/tools')) return 'tools';
    if (path.startsWith('/templates')) return 'templates';
    if (path.startsWith('/editor')) return 'editor';
    if (path.startsWith('/prijzen')) return 'pricing';
    return 'other';
}

export function getLocaleFromPath(pathname: string): LocaleCode {
    return cleanPath(pathname).startsWith('/en') ? 'en' : 'nl';
}

export function sanitizeAttribution(input: unknown): AttributionSnapshot | null {
    if (!input || typeof input !== 'object') return null;
    const value = input as Partial<AttributionSnapshot>;
    const firstTouchPath = cleanPath(value.firstTouchPath || '');
    const firstTouchAt = value.firstTouchAt || '';
    if (!firstTouchPath || !firstTouchAt) return null;

    const fallbackCluster = getPathCluster(firstTouchPath);
    const locale = value.locale === 'en' ? 'en' : 'nl';

    return {
        version: 1,
        firstTouchAt,
        firstTouchPath,
        firstTouchCluster: value.firstTouchCluster || fallbackCluster,
        firstTouchReferrer: value.firstTouchReferrer || '',
        lastTouchAt: value.lastTouchAt || firstTouchAt,
        lastTouchPath: cleanPath(value.lastTouchPath || firstTouchPath),
        lastTouchCluster: value.lastTouchCluster || fallbackCluster,
        locale,
        utmSource: value.utmSource || '',
        utmMedium: value.utmMedium || '',
        utmCampaign: value.utmCampaign || '',
        utmTerm: value.utmTerm || '',
        utmContent: value.utmContent || '',
        gclid: value.gclid || '',
        fbclid: value.fbclid || '',
        msclkid: value.msclkid || '',
    };
}

export function buildInitialAttribution(
    pathname: string,
    referrer: string,
    searchParams: URLSearchParams,
    nowIso: string
): AttributionSnapshot {
    const safePath = cleanPath(pathname);
    const cluster = getPathCluster(safePath);

    return {
        version: 1,
        firstTouchAt: nowIso,
        firstTouchPath: safePath,
        firstTouchCluster: cluster,
        firstTouchReferrer: referrer || '',
        lastTouchAt: nowIso,
        lastTouchPath: safePath,
        lastTouchCluster: cluster,
        locale: getLocaleFromPath(safePath),
        utmSource: searchParams.get('utm_source') || '',
        utmMedium: searchParams.get('utm_medium') || '',
        utmCampaign: searchParams.get('utm_campaign') || '',
        utmTerm: searchParams.get('utm_term') || '',
        utmContent: searchParams.get('utm_content') || '',
        gclid: searchParams.get('gclid') || '',
        fbclid: searchParams.get('fbclid') || '',
        msclkid: searchParams.get('msclkid') || '',
    };
}

export function mergeAttributionTouch(
    existing: AttributionSnapshot,
    pathname: string,
    searchParams: URLSearchParams,
    nowIso: string
): AttributionSnapshot {
    const safePath = cleanPath(pathname);
    const next = {
        ...existing,
        ...emptyAttributionFields,
        ...existing,
    };

    next.lastTouchAt = nowIso;
    next.lastTouchPath = safePath;
    next.lastTouchCluster = getPathCluster(safePath);
    next.locale = getLocaleFromPath(safePath);

    if (!next.utmSource) next.utmSource = searchParams.get('utm_source') || '';
    if (!next.utmMedium) next.utmMedium = searchParams.get('utm_medium') || '';
    if (!next.utmCampaign) next.utmCampaign = searchParams.get('utm_campaign') || '';
    if (!next.utmTerm) next.utmTerm = searchParams.get('utm_term') || '';
    if (!next.utmContent) next.utmContent = searchParams.get('utm_content') || '';
    if (!next.gclid) next.gclid = searchParams.get('gclid') || '';
    if (!next.fbclid) next.fbclid = searchParams.get('fbclid') || '';
    if (!next.msclkid) next.msclkid = searchParams.get('msclkid') || '';

    return next;
}



