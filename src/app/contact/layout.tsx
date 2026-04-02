import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — SabTools.in | Free Online Tools for India",
  description: "Get in touch with the SabTools.in team. Report bugs, request new tools, share feedback, or explore business partnerships. We typically respond within 24-48 hours.",
  alternates: { canonical: "https://sabtools.in/contact" },
  openGraph: {
    title: "Contact Us — SabTools.in",
    description: "Get in touch with the SabTools.in team. Report bugs, request tools, or share feedback.",
    url: "https://sabtools.in/contact",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
  },
  twitter: {
    card: "summary",
    title: "Contact Us — SabTools.in",
    description: "Get in touch with the SabTools.in team. Report bugs, request tools, or share feedback.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
