import { notFound } from "next/navigation";
import { tools } from "@/lib/tools";
import ToolRenderer from "./ToolRenderer";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{tool.icon}</span>
        <h1 className="text-xl font-bold text-gray-900">{tool.name}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <ToolRenderer slug={slug} />
      </div>

      <div className="text-center pt-2 pb-1">
        <a
          href={`https://sabtools.in/tools/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-500 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Powered by SabTools.in
        </a>
      </div>
    </div>
  );
}
