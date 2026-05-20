import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, categories } from "@/lib/tools";
import { hindiToolSlugs } from "@/lib/hindi";
import { slugSeoOverrides } from "@/lib/tool-seo-overrides";
import { getAuthorByCategory } from "@/lib/authors";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolRenderer from "./ToolRenderer";
import ToolTracker from "@/components/ToolTracker";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  const cat = categories.find((c) => c.slug === tool.category);
  const catName = cat?.name || "Online Tools";

  // Hand-written long-tail SEO override for high-value tools (Phase 6 R4
  // Push B). When a slug is present in slugSeoOverrides, its title +
  // description target a specific long-tail query the 8-week-old domain
  // can realistically rank for, instead of an unwinnable head term.
  // Tools NOT in the map fall through to the template below.
  const seo = slugSeoOverrides[slug];

  // Title budget: Google truncates display titles near 60 chars, and the
  // root layout template appends " | SabTools.in" (14 chars). So the
  // TEMPLATE value must stay ≤ ~46 chars. The previous template —
  //   `Free ${tool.name} Online — ${descriptionFragment}`
  // — produced 73-91 char strings (e.g. the EMI page was 87 chars) that
  // ALWAYS truncated in search results, burying the brand and wasting the
  // most valuable on-SERP real estate. tool.name already carries the
  // primary keyword (most names end in "Calculator"/"Converter"/
  // "Generator"), so a short value-prop suffix is all that's needed.
  // Override titles use title.absolute (below) to bypass the layout
  // template and own the full 60-char budget.
  const titleCore = `${tool.name} — Free Online Tool`;
  const fallbackTitle =
    titleCore.length > 46 ? `${tool.name} — Free Tool` : titleCore;

  // Build rich description with India focus (under 160 chars)
  const desc =
    seo?.description ??
    `${tool.description}. Free online ${tool.name.toLowerCase()} — no signup, instant results. Works on mobile & desktop.`;

  // Expanded keywords with long-tail variants
  const keywords = [
    ...(tool.keywords || []),
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    `${tool.name.toLowerCase()} free`,
    `${tool.name.toLowerCase()} india`,
    "free online tool",
    "sabtools",
    "no signup",
  ];

  // Resolve the tool's category reviewer for the Twitter card byline.
  // Same author the WebApplication.author @id resolves to in Batch 23 —
  // when an expert claims the category and has a public Twitter handle,
  // surface them on the share preview; otherwise fall back to the brand.
  const expert = getAuthorByCategory(tool.category);
  const twitterCreator = expert?.socialLinks?.twitter
    ? `@${expert.socialLinks.twitter}`
    : "@Sabtoolsin";

  return {
    // Override tools use title.absolute to bypass the "%s | SabTools.in"
    // layout template and own the full 60-char SERP budget for the
    // long-tail keyword. Non-override tools use the plain string, which
    // the template wraps with the brand suffix.
    title: seo ? { absolute: seo.title } : fallbackTitle,
    description: desc,
    keywords,
    alternates: {
      canonical: `https://sabtools.in/tools/${slug}`,
      // Only declare a Hindi alternate when an actual `/hi/tools/{slug}`
      // exists (hindiTools is a subset — 424 of 428 tools). Without this
      // gate, hreflang for the 4-5 English-only tools points at a 404,
      // which makes Google drop the entire language cluster (per the
      // hreflang spec's bidirectional-resolution requirement).
      languages: hindiToolSlugs.includes(slug)
        ? {
            "en-IN": `https://sabtools.in/tools/${slug}`,
            "hi-IN": `https://sabtools.in/hi/tools/${slug}`,
            "x-default": `https://sabtools.in/tools/${slug}`,
          }
        : {
            "en-IN": `https://sabtools.in/tools/${slug}`,
            "x-default": `https://sabtools.in/tools/${slug}`,
          },
    },
    openGraph: {
      title: seo?.title ?? `${tool.name} - Free ${catName} | SabTools.in`,
      description:
        seo?.description ??
        `Use ${tool.name} online for free. ${tool.description}. Instant results, 100% private, no signup. Trusted by millions of Indians.`,
      url: `https://sabtools.in/tools/${slug}`,
      type: "website",
      locale: "en_IN",
      // og:locale:alternate gated on the same hindiToolSlugs check as
      // the hreflang declaration above — only declare the Hindi alternate
      // when /hi/tools/{slug} actually exists, otherwise OG consumers
      // (Facebook share crawler, etc.) hit a 404.
      ...(hindiToolSlugs.includes(slug) ? { alternateLocale: ["hi_IN"] } : {}),
      siteName: "SabTools.in",
      images: [
        {
          url: "https://sabtools.in/og-image.png",
          width: 1200,
          height: 630,
          alt: `${tool.name} — Free Online Tool on SabTools.in`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title ?? `${tool.name} — Free Online ${catName} | SabTools.in`,
      description:
        seo?.description ??
        `Try ${tool.name} free — ${tool.description.toLowerCase()}. No signup, instant results, works on mobile. Built for India.`,
      images: [
        {
          url: "https://sabtools.in/og-image.png",
          alt: `${tool.name} — Free Online Tool on SabTools.in`,
        },
      ],
      creator: twitterCreator,
      site: "@Sabtoolsin",
    },
    other: {
      "rating": "general",
      "revisit-after": "7 days",
      "distribution": "global",
      "target": "all",
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <ToolTracker toolSlug={tool.slug} toolName={tool.name} />
      <ToolRenderer slug={slug} />
    </ToolPageLayout>
  );
}
