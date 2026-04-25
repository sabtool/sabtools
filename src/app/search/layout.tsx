import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tools — Find 460+ Free Online Tools | SabTools.in",
  description: "Search through 460+ free online tools on SabTools.in. Find calculators, converters, text tools, developer tools, image tools and more. Instant results, no signup.",
  alternates: { canonical: "https://sabtools.in/search" },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Search Tools — SabTools.in",
    description: "Search 460+ free online tools. Calculators, converters, and more.",
    url: "https://sabtools.in/search",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Search 460+ Free Online Tools — SabTools.in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Tools — SabTools.in",
    description: "Search 460+ free online tools on SabTools.in.",
    images: ["https://sabtools.in/og-image.png"],
    creator: "@sabtools",
    site: "@sabtools",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
