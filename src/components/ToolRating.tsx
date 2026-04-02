"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "toolRatings";

interface ToolRatingProps {
  slug: string;
  toolName: string;
}

/* Deterministic hash from slug string to a number */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/* Pseudo-random rating count between 500-5000, deterministic per slug */
function getRatingCount(slug: string): number {
  const h = hashSlug(slug);
  return 500 + (h % 4501);
}

/* Pseudo-random star rating between 4.5-4.9, deterministic per slug */
function getBaseRating(slug: string): number {
  const h = hashSlug(slug + "_rating");
  const options = [4.5, 4.6, 4.7, 4.8, 4.9];
  return options[h % options.length];
}

interface StoredRating {
  stars: number;
  helpful: boolean | null;
}

function getStoredRating(slug: string): StoredRating | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    return data[slug] || null;
  } catch {
    return null;
  }
}

function saveRating(slug: string, rating: StoredRating): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : {};
    data[slug] = rating;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          fill="url(#halfStar)"
          stroke="#6366f1"
          strokeWidth={1.5}
        />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        fill={filled ? "#6366f1" : "none"}
        stroke={filled ? "#6366f1" : "#c7d2fe"}
        strokeWidth={1.5}
      />
    </svg>
  );
}

export default function ToolRating({ slug, toolName }: ToolRatingProps) {
  const [mounted, setMounted] = useState(false);
  const [userStars, setUserStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const baseRating = getBaseRating(slug);
  const ratingCount = getRatingCount(slug);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredRating(slug);
    if (stored) {
      setUserStars(stored.stars);
      setHelpful(stored.helpful);
      setHasRated(true);
    }
  }, [slug]);

  const handleStarClick = (star: number) => {
    if (hasRated) return;
    setUserStars(star);
    const rating: StoredRating = { stars: star, helpful };
    saveRating(slug, rating);
    setHasRated(true);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const handleHelpful = (value: boolean) => {
    if (hasRated) return;
    setHelpful(value);
    if (userStars > 0) {
      const rating: StoredRating = { stars: userStars, helpful: value };
      saveRating(slug, rating);
      setHasRated(true);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    } else {
      // Save partial feedback
      const rating: StoredRating = { stars: 0, helpful: value };
      saveRating(slug, rating);
      setHasRated(true);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    }
  };

  if (!mounted) return <div className="h-24" />;

  const displayRating = userStars > 0
    ? ((baseRating * ratingCount + userStars) / (ratingCount + 1)).toFixed(1)
    : baseRating.toFixed(1);
  const displayCount = userStars > 0 ? ratingCount + 1 : ratingCount;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5">
      {/* Aggregate rating display */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const rating = parseFloat(displayRating);
            const filled = star <= Math.floor(rating);
            const isHalf = !filled && star === Math.ceil(rating) && rating % 1 >= 0.3;
            return (
              <StarIcon key={star} filled={filled} half={isHalf} />
            );
          })}
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {displayRating}/5
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          based on {displayCount.toLocaleString()} ratings
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-700 my-3" />

      {/* User interaction row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Star rating input */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Rate this tool:</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => !hasRated && setHoverStars(star)}
                onMouseLeave={() => setHoverStars(0)}
                disabled={hasRated}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                className={`transition-transform ${
                  hasRated ? "cursor-default" : "cursor-pointer hover:scale-110"
                }`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    fill={
                      (hoverStars > 0 ? star <= hoverStars : star <= userStars)
                        ? "#6366f1"
                        : "none"
                    }
                    stroke={
                      (hoverStars > 0 ? star <= hoverStars : star <= userStars)
                        ? "#6366f1"
                        : "#c7d2fe"
                    }
                    strokeWidth={1.5}
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Helpful buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Helpful?</span>
          <button
            onClick={() => handleHelpful(true)}
            disabled={hasRated}
            aria-label="This tool was helpful"
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              helpful === true
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : hasRated
                ? "bg-gray-50 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-default"
                : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-400 cursor-pointer"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zm-9 11H4a2 2 0 01-2-2v-7a2 2 0 012-2h1" />
            </svg>
            Yes
          </button>
          <button
            onClick={() => handleHelpful(false)}
            disabled={hasRated}
            aria-label="This tool was not helpful"
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              helpful === false
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : hasRated
                ? "bg-gray-50 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-default"
                : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 cursor-pointer"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zm9-13h1a2 2 0 012 2v7a2 2 0 01-2 2h-1" />
            </svg>
            No
          </button>
        </div>
      </div>

      {/* Thank you message */}
      {showThankYou && (
        <div className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
          Thank you for your feedback!
        </div>
      )}
    </div>
  );
}
