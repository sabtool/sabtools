"use client";

import { Suspense, useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tools, categories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import { trackSearch } from "@/lib/analytics";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.slug.includes(q) ||
        (t.keywords && t.keywords.some((k: string) => k.toLowerCase().includes(q)))
    );
  }, [query]);

  // Track search events (debounced — fires after user stops typing for 500ms)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!query.trim()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      trackSearch(query.trim(), results.length);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, results.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Search Tools</h1>

      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 280+ free tools..."
          className="w-full max-w-xl px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
          autoFocus
        />
      </div>

      {query.trim() && (
        <p className="text-gray-500 mb-6">
          {results.length} {results.length === 1 ? "tool" : "tools"} found for &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : query.trim() ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 mb-4">No tools found for &ldquo;{query}&rdquo;</p>
          <Link href="/" className="text-indigo-600 hover:underline">
            Browse all tools
          </Link>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛠️</div>
          <p className="text-gray-500 mb-4">Start typing to search our 280+ free tools</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-100 transition"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
