import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for SabTools.in online tools.",
  alternates: { canonical: "https://sabtools.in/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Disclaimer</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p>The tools and calculators on SabTools.in are provided for informational and educational purposes only.</p>
        <h2 className="text-xl font-bold">Financial Tools</h2>
        <p>Our financial calculators (EMI, SIP, FD, RD, PPF, Income Tax, etc.) provide approximate results based on the inputs you provide. Actual amounts may vary based on bank policies, market conditions, and other factors. Please consult a qualified financial advisor before making investment decisions.</p>
        <h2 className="text-xl font-bold">Health Tools</h2>
        <p>Our BMI calculator and other health-related tools are for general information only and should not be considered medical advice. Consult a healthcare professional for accurate health assessments.</p>
        <h2 className="text-xl font-bold">No Guarantee</h2>
        <p>While we strive for accuracy, we make no guarantees regarding the correctness of results from any of our tools. Users should verify important calculations independently.</p>
      </div>
    </div>
  );
}
