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
import Testimonials from "@/components/Testimonials";
import NewsletterSignup from "@/components/NewsletterSignup";
import TrustBadges from "@/components/TrustBadges";
import type { Tool } from "@/lib/tools";
import { categories } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import { categoryPillars } from "@/lib/category-pillars";
import {
  SITE_URL,
  ORG_ID,
  SUPPORTED_LANGUAGES,
  webApplicationNode,
  breadcrumbNode,
  howToNode,
  buildGraph,
} from "@/lib/schema";

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const cat = categories.find((c) => c.slug === tool.category);
  const content = getToolContent(tool.name, tool.description, tool.category, tool.keywords);
  // Pillar backlink — only render when the parent category has a full pillar,
  // so a tool page never links up to a thin category landing page (Report §3.3).
  const pillar = categoryPillars[tool.category];

  // Build a single @graph with WebApplication + BreadcrumbList + HowTo.
  // FAQPage is emitted separately by ToolFaq so the schema matches its visible content.
  const toolGraph = buildGraph([
    webApplicationNode({
      slug: tool.slug,
      name: tool.name,
      description: tool.description,
      featureList: tool.keywords,
      category: cat?.name || "Online Tool",
      inLanguage: SUPPORTED_LANGUAGES,
    }),
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: cat?.name || "Tools", url: `${SITE_URL}/category/${tool.category}` },
      { name: tool.name },
    ]),
    {
      ...howToNode({
        name: `How to Use ${tool.name} Online`,
        description: `Step-by-step guide to using ${tool.name} on SabTools.in — free, no signup required.`,
        steps: content.howToSteps.map((step, i) => ({
          name: step.length > 60 ? step.substring(0, 57) + "..." : step,
          text: step,
          url: `${SITE_URL}/tools/${tool.slug}#step-${i + 1}`,
        })),
        inLanguage: SUPPORTED_LANGUAGES[0],
      }),
      tool: { "@type": "HowToTool", name: "Web Browser" },
      supply: { "@type": "HowToSupply", name: "Internet Connection" },
      totalTime: "PT1M",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: "0",
      },
      publisher: { "@id": ORG_ID },
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolGraph) }} />
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

        <TrustBadges />

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
          <p className="text-gray-600 leading-relaxed">{content.about}</p>

          {/* What Is Section */}
          {content.whatIs && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mt-8">What is {tool.name}?</h2>
              <p className="text-gray-600 leading-relaxed">{content.whatIs}</p>
            </>
          )}

          {/* Key Features */}
          {content.keyFeatures && content.keyFeatures.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mt-8">Key Features of {tool.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {content.keyFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-indigo-500 mt-0.5 shrink-0">✦</span>
                    <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mt-8">How to Use {tool.name} — Step by Step</h3>
          <ol className="text-gray-600 space-y-3 mt-3">
            {content.howToSteps.map((step, i) => (
              <li key={i} id={`step-${i + 1}`} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {/* Real-World Examples */}
          {content.realWorldExamples && content.realWorldExamples.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mt-8">Real-World Examples</h2>
              <div className="space-y-3 mt-3">
                {content.realWorldExamples.map((example, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <span className="text-blue-500 text-lg shrink-0">📌</span>
                    <p className="text-gray-600 text-sm leading-relaxed">{example}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mt-8">Why Choose {tool.name} on SabTools.in?</h3>
          <ul className="text-gray-600 space-y-2 mt-3">
            {content.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-1 shrink-0">✓</span>
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Tips & Best Practices */}
          {content.tipsAndBestPractices && content.tipsAndBestPractices.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mt-8">Tips & Best Practices</h2>
              <div className="space-y-2 mt-3">
                {content.tipsAndBestPractices.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
                    <span className="text-amber-500 shrink-0">💡</span>
                    <span className="text-gray-600 text-sm leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Indian Context Section */}
          {content.indianContext && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mt-8">{tool.name} for Indian Users</h2>
              <p className="text-gray-600 leading-relaxed">{content.indianContext}</p>
            </>
          )}

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
        <ReviewedBy category={tool.category} />

        {/* Last Updated — freshness signal */}
        <div className="mt-3 text-xs text-gray-400">
          Last updated: April 2026
        </div>

        {/* User Testimonials — social proof */}
        <Testimonials category={tool.category} toolSlug={tool.slug} />

        {/* User Rating — engagement signal */}
        <div className="mt-8">
          <ToolRating slug={tool.slug} toolName={tool.name} />
        </div>

        {/* Related Blog Guides — tool-to-blog internal links */}
        <RelatedBlogPosts toolSlug={tool.slug} category={tool.category} keywords={tool.keywords} />

        {/* Pillar backlink — tool ↗ category topic-pillar. Wires the silo from
            the leaf back to the branch (Report §3.4 internal-link graph).
            Only renders for categories we have full pillar content for — a
            link to a thin page would undermine the signal. */}
        {pillar && cat && (
          <div className="mt-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 border border-indigo-100 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-indigo-100 items-center justify-center text-2xl shadow-sm">
                {cat.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                  Part of the {cat.name} topic guide
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  New to {cat.name.toLowerCase()}? Read the complete guide.
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {pillar.whatIs}
                </p>
                <a
                  href={`/category/${tool.category}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition"
                >
                  Read the full {cat.name} guide
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Related Tools — same-category + cross-category keyword matches */}
        <RelatedTools currentSlug={tool.slug} category={tool.category} />

        {/* Newsletter Signup */}
        <div className="mt-10">
          <NewsletterSignup />
        </div>

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
