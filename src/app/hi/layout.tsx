import { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    locale: "hi_IN",
    siteName: "SabTools.in",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "SabTools.in — मुफ्त ऑनलाइन टूल्स हिंदी में",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        alt: "SabTools.in — मुफ्त ऑनलाइन टूल्स हिंदी में",
      },
    ],
    creator: "@Sabtoolsin",
    site: "@Sabtoolsin",
  },
  other: {
    "content-language": "hi",
  },
};

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  // <html lang="hi-IN"> for /hi/* routes is set by the pre-paint script
  // in the root layout (src/app/layout.tsx) — that script reads
  // location.pathname and overrides lang BEFORE the first paint, so
  // crawlers and assistive tech see "hi-IN" on every Hindi route.
  // We do NOT add a duplicate script here (would clobber the root
  // value if the value strings ever drift).
  //
  // The wrapping <div lang="hi-IN" dir="ltr"> scopes the language
  // attribute at the section level too — useful for translation tools
  // and screen readers that respect both nested and root lang values.
  return (
    <div lang="hi-IN" dir="ltr">
      {children}
    </div>
  );
}
