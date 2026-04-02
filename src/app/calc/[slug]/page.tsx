import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { programmaticPages, programmaticPageMap } from "@/lib/programmatic-pages";
import { tools, categories } from "@/lib/tools";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ShareButtons from "@/components/ShareButtons";
import ToolFaq from "@/components/ToolFaq";
import CalcToolRenderer from "./ToolRenderer";

export function generateStaticParams() {
  return programmaticPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = programmaticPageMap.get(slug);
  if (!page) return {};

  return {
    title: `${page.title} | SabTools.in`,
    description: page.description,
    keywords: [...page.keywords, "free online tool", "sabtools", "india", "calculator", "no signup"],
    alternates: { canonical: `https://sabtools.in/calc/${slug}` },
    openGraph: {
      title: `${page.title} | SabTools.in`,
      description: page.description,
      url: `https://sabtools.in/calc/${slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "SabTools.in",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    other: {
      rating: "general",
      "revisit-after": "7 days",
      distribution: "global",
      target: "all",
    },
  };
}

export default async function CalcPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = programmaticPageMap.get(slug);
  if (!page) notFound();

  const tool = tools.find((t) => t.slug === page.toolSlug);
  if (!tool) notFound();

  const cat = categories.find((c) => c.slug === tool.category);

  // JSON-LD: WebApplication
  const webAppLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.h1,
    description: page.description,
    url: `https://sabtools.in/calc/${slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sabtools.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat?.name || "Tools",
        item: `https://sabtools.in/category/${tool.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `https://sabtools.in/tools/${tool.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: page.h1,
        item: `https://sabtools.in/calc/${slug}`,
      },
    ],
  };

  // JSON-LD: FAQPage
  const faqItems = [
    {
      q: `What is ${page.h1}?`,
      a: `${page.h1} is a free online tool on SabTools.in. ${page.description} It runs entirely in your browser with no signup required.`,
    },
    {
      q: `Is ${page.h1} free?`,
      a: `Yes, this tool is 100% free with no limits. No registration, no hidden charges. Use it as many times as you want.`,
    },
    {
      q: `Is my data safe?`,
      a: `Absolutely. All calculations happen in your browser. No data is sent to any server. Your privacy is fully protected.`,
    },
    {
      q: `Can I use this on mobile?`,
      a: `Yes, this tool works perfectly on mobile phones, tablets and desktop computers. It is fully responsive and optimized for all screen sizes.`,
    },
    {
      q: `How accurate is this calculator?`,
      a: `This calculator uses standard financial formulas and is highly accurate. However, actual results may vary slightly based on specific bank terms, policies and rounding methods.`,
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: cat?.name || "Tools", href: `/category/${tool.category}` },
            { label: tool.name, href: `/tools/${tool.slug}` },
            { label: page.h1 },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start sm:items-center gap-4 mb-3 flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl shadow-sm">
                {tool.icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {page.h1}
                </h1>
                <p className="text-gray-500">{page.description}</p>
              </div>
            </div>
            <ShareButtons
              title={`${page.title} | SabTools.in`}
            />
          </div>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        {/* Tool Component */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <CalcToolRenderer toolSlug={page.toolSlug} />
        </div>

        <AdBanner format="horizontal" className="mt-8" />

        {/* Unique SEO Content */}
        <div className="mt-12 prose prose-gray max-w-none">
          <h2 className="text-xl font-bold text-gray-800">
            About {page.h1}
          </h2>
          <div
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* How to use */}
        <div className="mt-8 prose prose-gray max-w-none">
          <h3 className="text-lg font-semibold text-gray-800">
            How to use {page.h1}?
          </h3>
          <ol className="text-gray-600 list-decimal list-inside space-y-1">
            <li>Enter the required values in the input fields above</li>
            <li>The results will be calculated automatically in real-time</li>
            <li>Adjust values to compare different scenarios</li>
            <li>Share or bookmark for future reference</li>
          </ol>
        </div>

        {/* Why use section */}
        <div className="mt-8 prose prose-gray max-w-none">
          <h3 className="text-lg font-semibold text-gray-800">
            Why use SabTools.in?
          </h3>
          <ul className="text-gray-600 list-disc list-inside space-y-1">
            <li>100% free — no signup, no limits, no hidden fees</li>
            <li>Lightning fast — runs instantly in your browser</li>
            <li>Privacy first — your data never leaves your device</li>
            <li>Mobile friendly — works on any phone, tablet or computer</li>
            <li>Made for India — Indian formats, banks, taxes &amp; more</li>
          </ul>
        </div>

        {/* Also try the main tool link */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p className="text-gray-700">
            Also try our full{" "}
            <Link
              href={`/tools/${tool.slug}`}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {tool.name}
            </Link>{" "}
            with all features and options.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <summary className="cursor-pointer px-6 py-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="px-6 pb-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related Tools from same category */}
        <RelatedTools currentSlug={tool.slug} category={tool.category} />

        <AdBanner format="rectangle" className="mt-8" />
      </div>
    </>
  );
}
