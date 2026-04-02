import Link from "next/link";
import { tools, type Tool } from "@/lib/tools";

export default function RelatedTools({ currentSlug, category }: { currentSlug: string; category: string }) {
  const related = tools
    .filter((t) => t.category === category && t.slug !== currentSlug)
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🔧 Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((tool: Tool) => (
          <Link
            key={tool.slug}
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
        ))}
      </div>
    </div>
  );
}
