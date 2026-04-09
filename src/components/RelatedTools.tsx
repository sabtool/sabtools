import Link from "next/link";
import { tools, categories, type Tool } from "@/lib/tools";

const POPULAR_SLUGS = [
  "emi-calculator",
  "sip-calculator",
  "gst-calculator",
  "word-counter",
  "json-formatter",
  "image-compressor",
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition group"
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl group-hover:bg-indigo-100 transition shrink-0">
        {tool.icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition truncate">
          {tool.name}
        </div>
        <div className="text-xs text-gray-500 truncate">{tool.description}</div>
      </div>
    </Link>
  );
}

/**
 * Enhanced RelatedTools — shows same-category, cross-category keyword matches,
 * and a popular tools row for maximum internal linking SEO.
 */
export default function RelatedTools({ currentSlug, category }: { currentSlug: string; category: string }) {
  const current = tools.find((t) => t.slug === currentSlug);
  const currentKeywords = new Set(
    (current?.keywords || []).map((k) => k.toLowerCase())
  );

  const categoryInfo = categories.find((c) => c.slug === category);
  const categoryName = categoryInfo?.name || "Similar";

  // Same-category tools (excluding current) — up to 6
  const sameCategory = tools
    .filter((t) => t.category === category && t.slug !== currentSlug)
    .slice(0, 6);

  // Cross-category tools matched by keyword overlap — up to 4
  const crossCategory = currentKeywords.size > 0
    ? tools
        .filter((t) => t.category !== category && t.slug !== currentSlug)
        .map((t) => {
          const overlap = (t.keywords || []).filter((k) =>
            currentKeywords.has(k.toLowerCase())
          ).length;
          return { tool: t, overlap };
        })
        .filter((item) => item.overlap > 0)
        .sort((a, b) => b.overlap - a.overlap)
        .slice(0, 4)
        .map((item) => item.tool)
    : [];

  // Collect slugs already shown so popular row doesn't duplicate
  const shownSlugs = new Set([
    currentSlug,
    ...sameCategory.map((t) => t.slug),
    ...crossCategory.map((t) => t.slug),
  ]);

  // Popular tools — pick 4 that aren't already displayed
  const popularTools = POPULAR_SLUGS
    .filter((slug) => !shownSlugs.has(slug))
    .slice(0, 4)
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  const hasAnything = sameCategory.length > 0 || crossCategory.length > 0 || popularTools.length > 0;
  if (!hasAnything) return null;

  return (
    <div className="mt-12 space-y-8">
      {/* Same-category section */}
      {sameCategory.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            {categoryInfo?.icon && <span>{categoryInfo.icon}</span>}
            More {categoryName} Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sameCategory.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Cross-category keyword matches */}
      {crossCategory.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔗</span> You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crossCategory.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Popular tools */}
      {popularTools.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔥</span> Most Popular on SabTools.in
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
