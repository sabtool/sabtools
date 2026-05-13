import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Free Online Tools Platform",
  description: "Get in touch with the SabTools.in team. Report bugs, request new tools, share feedback, or explore business partnerships. We typically respond within 24-48 hours.",
  alternates: { canonical: "https://sabtools.in/contact" },
  openGraph: {
    title: "Contact Us — SabTools.in",
    description: "Get in touch with the SabTools.in team. Report bugs, request tools, or share feedback.",
    url: "https://sabtools.in/contact",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [{ url: "https://sabtools.in/og-image.png", width: 1200, height: 630, alt: "Contact SabTools.in" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — SabTools.in",
    description: "Get in touch with the SabTools.in team. Report bugs, request tools, or share feedback.",
    images: ["https://sabtools.in/og-image.png"],
    creator: "@Sabtoolsin",
    site: "@Sabtoolsin",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
