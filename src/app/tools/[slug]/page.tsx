import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, categories } from "@/lib/tools";
import { hindiToolSlugs } from "@/lib/hindi";
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

  // Build unique, descriptive title (under 60 chars)
  const title = `Free ${tool.name} Online — ${tool.description.split(".")[0].split(",")[0]}`;

  // Build rich description with India focus (under 160 chars)
  const desc = `${tool.description}. Free online ${tool.name.toLowerCase()} — no signup, instant results. Works on mobile & desktop.`;

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
    : "@sabtools";

  return {
    title,
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
      title: `${tool.name} - Free ${catName} | SabTools.in`,
      description: `Use ${tool.name} online for free. ${tool.description}. Instant results, 100% private, no signup. Trusted by millions of Indians.`,
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
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} — Free Online ${catName} | SabTools.in`,
      description: `Try ${tool.name} free — ${tool.description.toLowerCase()}. No signup, instant results, works on mobile. Built for India.`,
      images: ["https://sabtools.in/og-image.png"],
      creator: twitterCreator,
      site: "@sabtools",
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
