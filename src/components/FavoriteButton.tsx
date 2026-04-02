"use client";
import { useEffect, useState } from "react";

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

export default function FavoriteButton({ slug }: { slug: string }) {
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    const favs = getFavorites();
    setIsFav(favs.includes(slug));
  }, [slug]);

  const toggle = () => {
    const favs = getFavorites();
    let next: string[];
    if (favs.includes(slug)) {
      next = favs.filter((s) => s !== slug);
      setIsFav(false);
    } else {
      next = [slug, ...favs];
      setIsFav(true);
    }
    setFavorites(next);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
      className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
    >
      <svg
        className={`w-5 h-5 transition-transform ${animating ? "scale-125" : "scale-100"}`}
        style={{ transitionDuration: "300ms" }}
        fill={isFav ? "#f59e0b" : "none"}
        stroke={isFav ? "#f59e0b" : "currentColor"}
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );
}
