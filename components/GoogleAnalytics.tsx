import Script from "next/script";

/**
 * Google Analytics 4 loader.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env to enable.
 * When not set, nothing renders — zero overhead.
 */
export default function GoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!gaId) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                        page_path: window.location.pathname,
                        send_page_view: false,
                    });
                `}
            </Script>
        </>
    );
}
