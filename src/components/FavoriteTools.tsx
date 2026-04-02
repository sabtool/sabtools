"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools";
import type { Tool } from "@/lib/tools";

const STORAGE_KEY = "favoriteTools";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setFavorites(favs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  } catch {
    // Ignore storage errors
  }
}

export default function FavoriteTools() {
  const [favTools, setFavTools] = useState<Tool[]>([]);

  useEffect(() => {
    const slugs = getFavorites();
    const resolved = slugs
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter(Boolean) as Tool[];
    setFavTools(resolved);
  }, []);

  const removeFavorite = (slug: string) => {
    const favs = getFavorites().filter((s) => s !== slug);
    setFavorites(favs);
    setFavTools((prev) => prev.filter((t) => t.slug !== slug));
  };

  if (favTools.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          <span className="mr-2">&#11088;</span>Your Favorites
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Tools you have saved for quick access</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favTools.map((tool) => (
          <div key={tool.slug} className="tool-card group relative block p-4">
            <Link href={`/tools/${tool.slug}`} className="flex items-start gap-4">
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
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(tool.slug);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Remove from favorites"
              title="Remove from favorites"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
