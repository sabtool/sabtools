import Link from "next/link";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="tool-card group block">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition shrink-0">
          {tool.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition text-base">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
