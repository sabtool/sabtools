/**
 * Auto-link tool mentions inside long-form pillar text (Advanced SEO
 * Strategy, Section 3.4 — internal link graph).
 *
 * The pillar content strings in `category-pillars.ts` mention dozens of
 * specific tools by name ("EMI Calculator", "Stamp Duty Calculator",
 * "Image Compressor"). Rendering them as plain text leaves a lot of
 * internal-link equity on the table. This module converts those name
 * mentions into real <Link> hops without us having to hand-author
 * anchor tags inside the content itself.
 *
 * Design notes:
 *   • Longest tool name first — otherwise "Stamp Duty Calculator" would
 *     be swallowed by a shorter "Duty Calculator" entry if such existed.
 *   • Case-insensitive word-boundary match so "the Stamp Duty Calculator"
 *     and "use stamp duty calculator" both link, but "calculatorish" does
 *     not.
 *   • First occurrence only per paragraph — linking the same tool five
 *     times in one paragraph looks spammy and is a classic over-optimisation
 *     signal (Section 3.4).
 *   • Returns a React.Fragment with a mix of strings and <Link> elements.
 *     Callers render it with `{autoLink(text, currentCategorySlug)}`.
 *   • Same-category tools are NOT skipped — in-body anchor text is more
 *     descriptive than the grid below and Google values the topical
 *     relevance signal. A tool mentioned in the "What is?" paragraph and
 *     also in the grid is fine; both count but neither is duplicative
 *     because their anchor contexts differ.
 */

import Link from "next/link";
import React from "react";
import { tools } from "@/lib/tools";

interface MatchRange {
  start: number;
  end: number;
  slug: string;
  name: string;
}

/** Build a tool-name → slug lookup, sorted longest-first. */
function buildToolNameIndex() {
  return [...tools]
    .sort((a, b) => b.name.length - a.name.length)
    .map((t) => ({
      name: t.name,
      slug: t.slug,
      category: t.category,
      // Escape regex-special chars in tool names ("C# Formatter", "Ohm's Law")
      pattern: new RegExp(
        `\\b${t.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      ),
    }));
}

let toolNameIndex: ReturnType<typeof buildToolNameIndex> | null = null;
function getToolNameIndex() {
  if (!toolNameIndex) toolNameIndex = buildToolNameIndex();
  return toolNameIndex;
}

/**
 * Scan `text` for tool-name mentions and return an array of alternating
 * plain-text strings and React <Link> elements. Each tool is linked at
 * most once per paragraph.
 *
 * `_skipCategory` is accepted for signature compatibility with earlier
 * callers but intentionally ignored — see the module doc comment.
 */
export function autoLink(
  text: string,
  _skipCategory?: string
): React.ReactNode[] {
  if (!text) return [text];
  void _skipCategory;
  const index = getToolNameIndex();
  const usedSlugs = new Set<string>();
  const matches: MatchRange[] = [];

  // First pass: find all candidate matches, longest-first, non-overlapping.
  for (const entry of index) {
    if (usedSlugs.has(entry.slug)) continue;

    const m = entry.pattern.exec(text);
    if (!m) continue;
    const start = m.index;
    const end = m.index + m[0].length;

    // Skip if this match overlaps an already-accepted match (protects the
    // longest-first invariant on successive scans).
    const overlaps = matches.some(
      (r) => !(end <= r.start || start >= r.end)
    );
    if (overlaps) continue;

    matches.push({ start, end, slug: entry.slug, name: m[0] });
    usedSlugs.add(entry.slug);
  }

  if (matches.length === 0) return [text];

  // Sort by start offset so we can walk the string left-to-right.
  matches.sort((a, b) => a.start - b.start);

  const out: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) out.push(text.slice(cursor, m.start));
    out.push(
      <Link
        key={`${m.slug}-${i}`}
        href={`/tools/${m.slug}`}
        className="text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-500 transition-colors"
      >
        {m.name}
      </Link>
    );
    cursor = m.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

/**
 * Related-pillar suggestions for cross-category linking. Each category
 * maps to 2-3 thematically adjacent pillars — e.g. finance and tax are
 * natural neighbours, so a reader on finance should see tax & health
 * (insurance overlap).
 *
 * Only destination categories that actually have pillar content get
 * suggested — the page itself filters unknown slugs at render time.
 */
export const relatedPillars: Record<string, string[]> = {
  finance: ["tax", "business", "indiaguide"],
  tax: ["finance", "business", "indiaguide"],
  image: ["pdf", "converters", "seo"],
  pdf: ["image", "indiaguide", "security"],
  ai: ["text", "seo", "developer"],
  text: ["ai", "seo", "developer"],
  seo: ["text", "ai", "developer"],
  developer: ["security", "charts", "text"],
  security: ["developer", "utility", "pdf"],
  health: ["finance", "datetime", "fun"],
  fun: ["datetime", "health", "charts"],
  converters: ["math", "datetime", "indiaguide"],
  math: ["science", "converters", "finance"],
  datetime: ["math", "converters", "career"],
  indiaguide: ["utility", "tax", "business"],
  // New in Batch 8
  science: ["math", "developer", "exam"],
  construction: ["business", "math", "converters"],
  exam: ["career", "science", "indiaguide"],
  business: ["finance", "tax", "career"],
  utility: ["indiaguide", "security", "business"],
  charts: ["developer", "seo", "text"],
  career: ["business", "finance", "exam"],
};
