import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import RelatedBlogPosts from "@/components/RelatedBlogPosts";
import ShareButtons from "@/components/ShareButtons";
import WhatsAppShareResult from "@/components/WhatsAppShareResult";
import EmbedCode from "@/components/EmbedCode";
import ToolFaq from "@/components/ToolFaq";
import TrackToolVisit from "@/components/TrackToolVisit";
import FavoriteButton from "@/components/FavoriteButton";
import DownloadPDF from "@/components/DownloadPDF";
import ToolRating from "@/components/ToolRating";
import ToolUsageCounter from "@/components/ToolUsageCounter";
import ReviewedBy from "@/components/ReviewedBy";
import type { Tool } from "@/lib/tools";
import { categories } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const cat = categories.find((c) => c.slug === tool.category);
  const content = getToolContent(tool.name, tool.description, tool.category, tool.keywords);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://sabtools.in/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    softwareVersion: "1.0",
    author: {
      "@type": "Organization",
      name: "SabTools.in",
      url: "https://sabtools.in",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    inLanguage: ["en", "hi"],
    isAccessibleForFree: true,
    featureList: tool.keywords.join(", "),
  };

  // HowTo schema — enables rich step-by-step snippets in Google search
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use ${tool.name} Online`,
    description: `Step-by-step guide to using ${tool.name} on SabTools.in — free, no signup required.`,
    step: content.howToSteps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.length > 60 ? step.substring(0, 57) + "..." : step,
      text: step,
      url: `https://sabtools.in/tools/${tool.slug}#step-${i + 1}`,
    })),
    tool: { "@type": "HowToTool", name: "Web Browser" },
    supply: { "@type": "HowToSupply", name: "Internet Connection" },
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: "0",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <TrackToolVisit slug={tool.slug} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: cat?.name || "", href: `/category/${tool.category}` },
            { label: tool.name },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-start sm:items-center gap-4 mb-3 flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl shadow-sm">
                {tool.icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{tool.name}</h1>
                <p className="text-gray-500">{tool.description}</p>
                <div className="mt-1">
                  <ToolUsageCounter slug={tool.slug} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton slug={tool.slug} />
              <DownloadPDF />
              <ShareButtons title={`${tool.name} - Free Online Tool | SabTools.in`} />
            </div>
          </div>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <WhatsAppShareResult toolName={tool.name} slug={tool.slug} />
        </div>

        <EmbedCode slug={tool.slug} />

        <AdBanner format="horizontal" className="mt-8" />

        {/* SEO Content — unique per category to avoid thin/duplicate content */}
        <div className="mt-12 prose prose-gray max-w-none">
          <h2 className="text-xl font-bold text-gray-800">About {tool.name}</h2>
          <p className="text-gray-600">{content.about}</p>

          <h3 className="text-lg font-semibold text-gray-800 mt-6">How to Use {tool.name} — Step by Step</h3>
          <ol className="text-gray-600 list-decimal list-inside space-y-2">
            {content.howToSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <h3 className="text-lg font-semibold text-gray-800 mt-6">Why Choose {tool.name} on SabTools.in?</h3>
          <ul className="text-gray-600 list-disc list-inside space-y-2">
            {content.benefits.map((benefit, i) => (
              <li key={i}>{benefit}</li>
            ))}
          </ul>

          {tool.keywords.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mt-6">Related Topics</h3>
              <p className="text-gray-600">
                {tool.name} is commonly used for: {tool.keywords.join(", ")}.
                Explore more {cat?.name || "tools"} on SabTools.in for all your calculation needs.
              </p>
            </>
          )}
        </div>

        {/* FAQ Section with Schema — unique per category */}
        <ToolFaq toolName={tool.name} description={tool.description} customFaqs={content.faqs} />

        {/* Expert Review — E-E-A-T signal for Google */}
        <ReviewedBy category={tool.category} toolName={tool.name} slug={tool.slug} />

        {/* User Rating — engagement signal */}
        <div className="mt-8">
          <ToolRating slug={tool.slug} toolName={tool.name} />
        </div>

        {/* Related Blog Guides — tool-to-blog internal links */}
        <RelatedBlogPosts toolSlug={tool.slug} category={tool.category} keywords={tool.keywords} />

        {/* Related Tools — same-category + cross-category keyword matches */}
        <RelatedTools currentSlug={tool.slug} category={tool.category} />

        {/* Browse More Categories — cross-category crawl paths */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Explore More Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== tool.category)
              .slice(0, 8)
              .map((c) => (
                <a
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full text-xs font-medium text-gray-700 hover:text-indigo-700 transition"
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </a>
              ))}
          </div>
        </div>

        <AdBanner format="rectangle" className="mt-8" />
      </div>
    </>
  );
}
