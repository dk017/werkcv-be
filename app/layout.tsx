import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SharedSiteJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: "CV Maken in België | Professioneel CV Opstellen | WerkCV",
    template: "%s",
  },
  description: "Maak eenvoudig een professioneel cv in België. Eenmalige betaling van €4,99. Geen abonnement, geen verborgen kosten. Direct downloaden als PDF.",
  keywords: [
    "cv maken",
    "cv builder",
    "cv online maken",
    "professioneel cv",
    "cv template",
    "cv voorbeeld",
    "curriculum vitae maken",
    "cv schrijven",
    "cv downloaden",
    "ATS-vriendelijk cv",
    "gratis cv maker",
    "cv pdf downloaden",
    "sollicitatie cv",
    "cv belgië",
  ],
  openGraph: {
    title: "CV Maken in België | WerkCV",
    description: "Professioneel cv opstellen voor de Belgische arbeidsmarkt. Eénmalig €4,99. Geen abonnement.",
    url: siteConfig.baseUrl,
    siteName: siteConfig.siteName,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WerkCV - Professioneel cv maken in België",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterSite,
    title: "CV Maken in België | WerkCV",
    description: "Professioneel cv opstellen voor de Belgische arbeidsmarkt. Eénmalig €4,99. Geen abonnement.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: siteConfig.baseUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#4ECDC4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="alternate" hrefLang="nl-BE" href="https://werkcv.be/" />
        <link rel="alternate" hrefLang="nl-NL" href="https://werkcv.nl/" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="WerkCV updates"
          href={siteConfig.rssUrl}
        />
        <SharedSiteJsonLd />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wpik4m2kyh");`,
          }}
        />
        {/* Google Analytics — inline so Google's detector finds it in page source */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PCC26F3HBJ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PCC26F3HBJ');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased notranslate`}
      >
        <GoogleAnalytics />
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}

