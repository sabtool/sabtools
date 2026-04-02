import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, categories } from "@/lib/tools";
import { hindiTools, getHindiTool } from "@/lib/hindi";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";
import RelatedTools from "@/components/RelatedTools";
import ToolRenderer from "@/app/tools/[slug]/ToolRenderer";

export function generateStaticParams() {
  return hindiTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ht = getHindiTool(slug);
  const tool = tools.find((t) => t.slug === slug);
  if (!ht || !tool) return {};
  return {
    title: `${ht.name} — मुफ्त ऑनलाइन ${ht.name}`,
    description: `${ht.description}। मुफ्त ऑनलाइन ${ht.name} — बिना साइनअप, तुरंत परिणाम। SabTools.in पर।`,
    alternates: {
      canonical: `https://sabtools.in/hi/tools/${slug}`,
      languages: { en: `https://sabtools.in/tools/${slug}`, hi: `https://sabtools.in/hi/tools/${slug}` },
    },
  };
}

export default async function HindiToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ht = getHindiTool(slug);
  const tool = tools.find((t) => t.slug === slug);
  if (!ht || !tool) notFound();

  const cat = categories.find((c) => c.slug === tool.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: ht.name,
    description: ht.description,
    url: `https://sabtools.in/hi/tools/${slug}`,
    inLanguage: "hi",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "होम", href: "/hi" },
            { label: cat?.name || "", href: `/category/${tool.category}` },
            { label: ht.name },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-start sm:items-center gap-4 mb-3 flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl shadow-sm">
                {tool.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{ht.name}</h1>
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">हिंदी</span>
                </div>
                <p className="text-gray-500">{ht.description}</p>
              </div>
            </div>
            <ShareButtons title={`${ht.name} — मुफ्त ऑनलाइन टूल | SabTools.in`} />
          </div>
          <a href={`/tools/${slug}`} className="text-sm text-indigo-600 hover:underline">🌐 View in English</a>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {/* Same tool component — works in any language since UI inputs are universal */}
          <ToolRenderer slug={slug} />
        </div>

        <AdBanner format="horizontal" className="mt-8" />

        {/* Hindi SEO Content */}
        <div className="mt-12 prose prose-gray max-w-none">
          <h2 className="text-xl font-bold text-gray-800">{ht.aboutTitle}</h2>
          <p className="text-gray-600">{ht.aboutText}</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-6">{ht.howToTitle}</h3>
          <ol className="text-gray-600 list-decimal list-inside space-y-1">
            {ht.howToSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <h3 className="text-lg font-semibold text-gray-800 mt-6">SabTools.in क्यों चुनें?</h3>
          <ul className="text-gray-600 list-disc list-inside space-y-1">
            <li>100% मुफ्त — कोई साइनअप नहीं, कोई सीमा नहीं</li>
            <li>तेज — आपके ब्राउज़र में तुरंत काम करता है</li>
            <li>गोपनीय — आपका डेटा आपके डिवाइस पर ही रहता है</li>
            <li>मोबाइल फ्रेंडली — किसी भी फोन पर काम करता है</li>
            <li>भारत के लिए बना — भारतीय नंबर फॉर्मेट, GST, EMI और भी बहुत कुछ</li>
          </ul>
        </div>

        <RelatedTools currentSlug={slug} category={tool.category} />
        <AdBanner format="rectangle" className="mt-8" />
      </div>
    </>
  );
}
