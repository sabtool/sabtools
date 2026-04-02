import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for SabTools.in",
  alternates: { canonical: "https://sabtools.in/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p><strong>Last updated:</strong> March 2026</p>
        <p>By using SabTools.in, you agree to the following terms:</p>
        <h2 className="text-xl font-bold">Use of Tools</h2>
        <p>All tools are provided free of charge for personal and commercial use. Results are for informational purposes only and should not be used as professional financial, legal, or medical advice.</p>
        <h2 className="text-xl font-bold">Accuracy</h2>
        <p>While we strive for accuracy, we do not guarantee that all calculations and conversions are 100% error-free. Always verify critical results independently.</p>
        <h2 className="text-xl font-bold">Intellectual Property</h2>
        <p>The content, design, and code of SabTools.in are owned by us. You may not copy, reproduce, or redistribute our tools or content without permission.</p>
        <h2 className="text-xl font-bold">Limitation of Liability</h2>
        <p>SabTools.in is not liable for any damages arising from the use of our tools. Use them at your own risk.</p>
        <h2 className="text-xl font-bold">Changes</h2>
        <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>
      </div>
    </div>
  );
}
