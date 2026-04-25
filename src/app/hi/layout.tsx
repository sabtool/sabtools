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
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://sabtools.in/og-image.png"],
    creator: "@sabtools",
    site: "@sabtools",
  },
  other: {
    "content-language": "hi",
  },
};

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="hi";`,
        }}
      />
      <div lang="hi" dir="ltr">
        {children}
      </div>
    </>
  );
}
