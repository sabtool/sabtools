"use client";

import { useEffect, useState } from "react";

interface ToolUsageCounterProps {
  slug: string;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export default function ToolUsageCounter({ slug }: ToolUsageCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);

  useEffect(() => {
    // Track real visits in localStorage only
    let visits = 0;
    try {
      const key = `usage_${slug}`;
      const stored = localStorage.getItem(key);
      visits = stored ? parseInt(stored, 10) : 0;
      visits += 1;
      localStorage.setItem(key, String(visits));
    } catch {
      // localStorage unavailable
    }

    setTargetCount(visits);

    // Animated count-up over ~1 second
    const duration = 1000;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      const progress = current / steps;
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * visits);
      setDisplayCount(value);

      if (current >= steps) {
        setDisplayCount(visits);
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [slug]);

  if (targetCount === 0) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "9999px",
        backgroundColor: "#f3f4f6",
        color: "#4b5563",
        fontSize: "13px",
        fontWeight: 500,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      <span role="img" aria-label="fire">
        🔥
      </span>
      You&apos;ve used this {formatNumber(displayCount)} {displayCount === 1 ? "time" : "times"}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    </span>
  );
}
