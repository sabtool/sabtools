import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import InstallPrompt from "@/components/InstallPrompt";
import SuggestTool from "@/components/SuggestTool";
import AskSabTools from "@/components/AskSabTools";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import BackToTop from "@/components/BackToTop";
import ReadingProgress from "@/components/ReadingProgress";
import CookieConsent from "@/components/CookieConsent";

export const viewport: Viewport = {
  // Restore default unrestricted user zoom — `maximumScale` was previously
  // capped at 5×, an accessibility regression that low-vision users hit and
  // a Google quality signal we don't want to fail. Browsers default to no
  // limit, which is the correct behaviour. (Fix from technical-SEO audit.)
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sabtools.in"),
  title: {
    default: "SabTools.in — 460+ Free Online Tools for India",
    template: "%s | SabTools.in",
  },
  description:
    "460+ free online tools — EMI, SIP, GST calculators, AI tools, PDF tools & more. 100% free, no signup. Trusted by Indians.",
  keywords: [
    "free online tools",
    "free online calculator",
    "emi calculator",
    "sip calculator",
    "gst calculator",
    "age calculator",
    "percentage calculator",
    "word counter",
    "json formatter",
    "image compressor",
    "pdf tools",
    "ai writing tools",
    "unit converter",
    "online tools india",
    "sabtools",
    "free tools no signup",
    "online calculator india",
    "developer tools",
    "seo tools free",
    "text tools online",
    "finance calculator india",
    "income tax calculator",
    "loan calculator",
    "bmi calculator",
    "currency converter",
  ],
  authors: [{ name: "SabTools.in" }],
  creator: "SabTools.in",
  publisher: "SabTools.in",
  category: "Utility Tools",
  openGraph: {
    type: "website",
    locale: "en_IN",
    // og:locale:alternate mirrors hreflang — tells Facebook / LinkedIn /
    // other Open Graph consumers that a Hindi-locale version of this URL
    // exists at /hi. Pages with both locales surfaced get a richer share
    // preview on Indian social platforms (Strategy §2.6 / Batch 27).
    alternateLocale: ["hi_IN"],
    url: "https://sabtools.in",
    siteName: "SabTools.in",
    title: "SabTools.in — 460+ Free Online Tools for India",
    description: "460+ free online tools — calculators, converters, AI tools, PDF tools, developer tools & more. 100% free, no signup.",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "SabTools.in - 460+ Free Online Tools for India",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SabTools.in - 460+ Free Online Tools",
    description: "460+ free online tools for India — calculators, converters, AI & more. 100% free, no signup.",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        alt: "SabTools.in - 460+ Free Online Tools for India",
      },
    ],
    creator: "@sabtools",
    site: "@sabtools",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://sabtools.in",
    languages: {
      "en-IN": "https://sabtools.in",
      "hi-IN": "https://sabtools.in/hi",
      "x-default": "https://sabtools.in",
    },
  },
  verification: {
    google: "oNXrmRov9xzAcfS5YekN-KrUPjNlOSkL1KmgvDvgVYE",
  },
  other: {
    "rating": "general",
    "revisit-after": "3 days",
    "distribution": "global",
    "target": "all",
    "HandheldFriendly": "True",
    "MobileOptimized": "320",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Pre-paint inline script. Does two things synchronously before any
          content is rendered:
            1. Theme detection — apply `dark` class if user previously
               selected dark mode, so the page paints the correct theme
               from the very first frame (no flash-of-light).
            2. Hindi `lang` attribute — App Router with output:"export"
               renders `<html lang="en">` at build time for every route.
               For /hi and /hi/* we override to `lang="hi"` here. Googlebot
               executes JS, so it sees the corrected lang on Hindi pages,
               which strengthens the hi-IN hreflang signal.
          Keep the body of this script ASCII-only and synchronous.
          (Both behaviours from the technical-SEO audit fix report.)
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}try{var p=location.pathname;if(p==="/hi"||p.indexOf("/hi/")===0){document.documentElement.lang="hi"}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SabTools" />
        {/* Chrome / Edge "Add to home screen" + general OS app-list
            integration. Mirrors apple-mobile-web-app-title for non-Apple
            platforms. */}
        <meta name="application-name" content="SabTools" />
        {/* Windows / Edge tile customisation — pinned shortcut renders
            with the brand indigo (#4f46e5) instead of OS default. */}
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        {/* AdSense: uncomment and replace with real publisher ID after approval */}
        {/* <meta name="google-adsense-account" content="ca-pub-YOURPUBID" /> */}
        <meta name="p:domain_verify" content="2979c659d48751bc3545b2d2d9df6662" />
        <link rel="alternate" type="application/rss+xml" title="SabTools.in Blog" href="/feed.xml" />
        {/* OpenSearch description — browsers (Chrome/Edge/Firefox) detect
            this and offer to add SabTools as an address-bar search engine.
            Once added, users hit Tab in the URL bar and search the site
            directly. The XML at /opensearch.xml points the search action
            at /search?q={searchTerms}, matching the WebSite SearchAction
            already declared in the homepage JSON-LD. */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="SabTools.in"
          href="/opensearch.xml"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5KPJ4LPT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <InstallPrompt />
        <SuggestTool />
        <AskSabTools />
        <KeyboardShortcuts />
        <BackToTop />
        <ReadingProgress />
        <CookieConsent />
      </body>
    </html>
  );
}
