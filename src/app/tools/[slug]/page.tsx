import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, categories } from "@/lib/tools";
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

  // Build unique, descriptive title (under 60 chars when possible)
  const title = `${tool.name} Online Free - ${catName} | SabTools.in`;

  // Build rich description with India focus (under 160 chars)
  const desc = `${tool.description}. Free online ${tool.name.toLowerCase()} — no signup, instant results. Works on mobile & desktop. Made for India.`;

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

  return {
    title,
    description: desc,
    keywords,
    alternates: {
      canonical: `https://sabtools.in/tools/${slug}`,
      languages: {
        en: `https://sabtools.in/tools/${slug}`,
        hi: `https://sabtools.in/hi/tools/${slug}`,
      },
    },
    openGraph: {
      title: `${tool.name} - Free ${catName} | SabTools.in`,
      description: `${tool.description}. 100% free, no signup required. Made for India.`,
      url: `https://sabtools.in/tools/${slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "SabTools.in",
      images: [
        {
          url: "https://sabtools.in/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${tool.name} - SabTools.in`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - Free Online Tool | SabTools.in`,
      description: `${tool.description}. Free, instant results, no signup.`,
      images: ["https://sabtools.in/og-image.svg"],
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
