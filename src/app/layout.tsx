import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import InstallPrompt from "@/components/InstallPrompt";
import SuggestTool from "@/components/SuggestTool";
import AskSabTools from "@/components/AskSabTools";
import RecentCalculations from "@/components/RecentCalculations";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import BackToTop from "@/components/BackToTop";
import ReadingProgress from "@/components/ReadingProgress";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4f46e5",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sabtools.in"),
  title: {
    default: "SabTools.in - 460+ Free Online Tools | Calculators, Converters, AI Tools & More",
    template: "%s | SabTools.in",
  },
  description:
    "India's #1 free online tools website. 460+ tools including EMI Calculator, SIP Calculator, GST Calculator, AI Writing Tools, PDF Tools, Image Tools & more. 100% free, no signup required. Made for India.",
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
    url: "https://sabtools.in",
    siteName: "SabTools.in",
    title: "SabTools.in - 460+ Free Online Tools for India",
    description: "India's #1 free online tools website. Calculators, Converters, AI Tools, PDF Tools, Developer Tools & more. 100% free.",
    images: [
      {
        url: "https://sabtools.in/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SabTools.in - 460+ Free Online Tools for India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SabTools.in - 460+ Free Online Tools",
    description: "India's #1 free online tools website. 460+ tools — 100% free, no signup.",
    images: ["https://sabtools.in/og-image.svg"],
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
      en: "https://sabtools.in",
      hi: "https://sabtools.in/hi",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SabTools" />
        {/* AdSense: uncomment and replace with real publisher ID after approval */}
        {/* <meta name="google-adsense-account" content="ca-pub-YOURPUBID" /> */}
        <meta name="p:domain_verify" content="2979c659d48751bc3545b2d2d9df6662" />
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
        <RecentCalculations />
        <KeyboardShortcuts />
        <BackToTop />
        <ReadingProgress />
      </body>
    </html>
  );
}
