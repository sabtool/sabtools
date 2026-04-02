"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentTools } from "@/hooks/useRecentTools";
import { tools } from "@/lib/tools";
import type { Tool } from "@/lib/tools";

export default function RecentlyUsed() {
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    const slugs = getRecentTools();
    const resolved = slugs
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter(Boolean) as Tool[];
    setRecentTools(resolved);
  }, []);

  if (recentTools.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          <span className="mr-2">🕐</span>Recently Used
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Pick up where you left off</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {recentTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="flex-shrink-0 w-44 tool-card group block p-4 text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition mb-3">
              {tool.icon}
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition text-sm leading-tight line-clamp-2">
              {tool.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
