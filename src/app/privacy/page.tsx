import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy — SabTools.in Free Online Tools",
  description: "SabTools.in privacy policy. All tools run in your browser — we never collect, store, or transmit your data. Learn about our analytics, cookies, and data practices.",
  alternates: { canonical: "https://sabtools.in/privacy" },
  openGraph: {
    title: "Privacy Policy — SabTools.in",
    description: "Learn how SabTools.in protects your privacy. All tools run locally in your browser.",
    url: "https://sabtools.in/privacy",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — SabTools.in",
    description: "Learn how SabTools.in protects your privacy. All tools run locally in your browser.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p><strong>Last updated:</strong> March 2026</p>
        <p>At SabTools.in, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information.</p>
        <h2 className="text-xl font-bold">Data Collection</h2>
        <p>All tools on SabTools.in run entirely in your browser. We do NOT collect, store, or transmit any data you input into our tools. Your calculations, text, and files stay on your device.</p>
        <h2 className="text-xl font-bold">Analytics</h2>
        <p>We may use Google Analytics to understand website traffic and usage patterns. This collects anonymous data like page views, device type, and location (country level).</p>
        <h2 className="text-xl font-bold">Advertising</h2>
        <p>We display ads through Google AdSense. Google may use cookies to serve ads based on your browsing history. You can manage your ad preferences through Google Ad Settings.</p>
        <h2 className="text-xl font-bold">Cookies</h2>
        <p>We use minimal cookies for analytics and advertising purposes only. No personal data is stored in cookies.</p>
        <h2 className="text-xl font-bold">Third-Party Links</h2>
        <p>Our website may contain links to external websites. We are not responsible for the privacy practices of these sites.</p>
        <h2 className="text-xl font-bold">Contact</h2>
        <p>For privacy-related concerns, please contact us at <a href="/contact" className="text-indigo-600">our contact page</a>.</p>
      </div>
    </div>
  );
}
