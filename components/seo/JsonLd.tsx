import { CVCategory } from '@/lib/categories';
import { siteConfig } from "@/config/site";

const ORGANIZATION_ID = `${siteConfig.baseUrl}/#organization`;
const WEBSITE_ID = `${siteConfig.baseUrl}/#website`;
const CONTACT_EMAIL = siteConfig.contactEmail;
const X_PROFILE_URL = 'https://x.com/dk_r017';

interface ArticleJsonLdProps {
    category: CVCategory;
    url: string;
}

export function ArticleJsonLd({ category, url }: ArticleJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: category.heroTitle || `CV Voorbeeld ${category.nameDutch}`,
        description: category.metaDesc,
        author: {
            '@type': 'Organization',
            name: siteConfig.siteName,
            url: siteConfig.baseUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: siteConfig.siteName,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.baseUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        keywords: category.keywords.join(', '),
        inLanguage: siteConfig.language,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface FAQJsonLdProps {
    questions: Array<{ question: string; answer: string }>;
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface HowToJsonLdProps {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string }>;
}

export function HowToJsonLd({ name, description, steps }: HowToJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function OrganizationJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: siteConfig.siteName,
        alternateName: siteConfig.domain,
        url: siteConfig.baseUrl,
        logo: `${siteConfig.baseUrl}/logo.png`,
        email: CONTACT_EMAIL,
        description: 'Professionele CV builder voor de Belgische arbeidsmarkt',
        sameAs: [X_PROFILE_URL],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: CONTACT_EMAIL,
            url: `${siteConfig.baseUrl}/contact`,
            availableLanguage: ['Dutch', 'English'],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function WebsiteJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: siteConfig.siteName,
        alternateName: siteConfig.domain,
        url: siteConfig.baseUrl,
        description: 'Maak binnen 5 minuten een professioneel CV',
        inLanguage: siteConfig.language,
        publisher: {
            '@id': ORGANIZATION_ID,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteConfig.baseUrl}/cv-voorbeeld-belgie?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function SharedSiteJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': ORGANIZATION_ID,
                name: siteConfig.siteName,
                alternateName: siteConfig.domain,
                url: siteConfig.baseUrl,
                logo: `${siteConfig.baseUrl}/logo.png`,
                email: CONTACT_EMAIL,
                sameAs: [X_PROFILE_URL],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    email: CONTACT_EMAIL,
                    url: `${siteConfig.baseUrl}/contact`,
                    availableLanguage: ['Dutch', 'English'],
                },
            },
            {
                '@type': 'WebSite',
                '@id': WEBSITE_ID,
                url: siteConfig.baseUrl,
                name: siteConfig.siteName,
                alternateName: siteConfig.domain,
                inLanguage: siteConfig.language,
                publisher: {
                    '@id': ORGANIZATION_ID,
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${siteConfig.baseUrl}/cv-voorbeeld-belgie?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}



