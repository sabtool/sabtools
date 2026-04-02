import Link from "next/link";
import { Metadata } from "next";
import { hindiTools } from "@/lib/hindi";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "SabTools.in - 290+ मुफ्त ऑनलाइन टूल्स हिंदी में",
  description: "मुफ्त ऑनलाइन टूल्स — EMI कैलकुलेटर, SIP कैलकुलेटर, GST कैलकुलेटर, शब्द गणक और 290+ टूल्स। बिना साइनअप, 100% मुफ्त।",
  alternates: { canonical: "https://sabtools.in/hi" },
};

export default function HindiHomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-1.5 text-sm font-medium text-orange-600 border border-orange-100 mb-6">
          🇮🇳 हिंदी में उपलब्ध
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="text-gray-900">सभी </span>
          <span className="gradient-text">मुफ्त ऑनलाइन टूल्स</span>
          <br />
          <span className="text-gray-900">हिंदी में</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          EMI कैलकुलेटर, SIP कैलकुलेटर, GST कैलकुलेटर, इनकम टैक्स कैलकुलेटर और 290+ टूल्स। बिल्कुल मुफ्त, बिना साइनअप।
        </p>
      </div>

      {/* Hindi Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hindiTools.map((ht) => {
          const tool = tools.find((t) => t.slug === ht.slug);
          return (
            <Link
              key={ht.slug}
              href={`/hi/tools/${ht.slug}`}
              className="tool-card group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:bg-orange-100 transition shrink-0">
                  {tool?.icon || "🔧"}
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition text-base">
                    {ht.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {ht.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/" className="btn-secondary inline-block">
          View All Tools in English →
        </Link>
      </div>
    </div>
  );
}
