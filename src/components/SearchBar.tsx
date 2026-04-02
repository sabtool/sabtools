"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.includes(q))
      )
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto" style={{ zIndex: 9999 }}>
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tools... e.g. EMI Calculator, Word Counter"
          className="search-bar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
      </div>
      {focused && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ zIndex: 9999 }}>
          {results.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-indigo-50 transition"
            >
              <span className="text-xl">{tool.icon}</span>
              <div>
                <div className="text-sm font-semibold text-gray-800">{tool.name}</div>
                <div className="text-xs text-gray-500">{tool.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
