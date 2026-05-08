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
 * Markdown-style external-link syntax used inside category-pillars prose:
 *   [Anchor text](https://gov.in/path)
 *
 * Phase 4 Task A — every category hub adds 2-4 inline links to
 * authoritative gov.in / international-org sources (RBI, IT Dept,
 * GST Council, ICMR, WHO, etc.) within the existing whatIs /
 * howToChoose / indianContext prose. We embed them in the data-file
 * strings using markdown syntax so the data layer stays serializable
 * (no JSX in category-pillars.ts), and this autoLink module renders
 * them as proper external anchors with rel="nofollow noopener" and
 * target="_blank" — non-fabricated outbound authority signal that
 * Google's helpful-content system rewards on India-focused tool sites.
 *
 * Restricted to https:// to avoid any chance of plain-text URLs being
 * matched as links accidentally. The regex is non-greedy on both anchor
 * and URL components so back-to-back links in one paragraph parse cleanly.
 */
const EXTERNAL_LINK_RE = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;

/**
 * Scan `text` for both external markdown-style links and internal tool-name
 * mentions, and return an array of plain-text strings interleaved with
 * React <Link> (internal) and <a> (external) elements.
 *
 * Order of operations:
 *   1. Split text on external [anchor](url) matches — these are
 *      explicitly authored; the prose string itself decides which
 *      phrase becomes the anchor.
 *   2. Run internal tool-name auto-linking on every remaining plain-text
 *      segment between external-link spans.
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

  // Pass 1 — external markdown-style links (Phase 4 Task A).
  // Build an array of segments: { type: "text" | "external", value | href, anchor }.
  type Segment =
    | { type: "text"; value: string }
    | { type: "external"; href: string; anchor: string };
  const segments: Segment[] = [];
  let lastIndex = 0;
  EXTERNAL_LINK_RE.lastIndex = 0;
  for (
    let m = EXTERNAL_LINK_RE.exec(text);
    m !== null;
    m = EXTERNAL_LINK_RE.exec(text)
  ) {
    if (m.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, m.index) });
    }
    segments.push({ type: "external", anchor: m[1], href: m[2] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  if (segments.length === 0) {
    segments.push({ type: "text", value: text });
  }

  // Pass 2 — for each text segment, run internal tool-name auto-linking.
  // External-link spans pass through unchanged. usedSlugs is shared across
  // all text segments so each tool links at most once per paragraph
  // (preserves the original anti-spam invariant).
  const out: React.ReactNode[] = [];
  const usedSlugs = new Set<string>();
  segments.forEach((seg, segIdx) => {
    if (seg.type === "external") {
      out.push(
        <a
          key={`ext-${segIdx}`}
          href={seg.href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="text-indigo-600 underline decoration-indigo-300 hover:decoration-indigo-600 transition-colors"
        >
          {seg.anchor}
        </a>
      );
      return;
    }
    out.push(...autoLinkPlainText(seg.value, segIdx, usedSlugs));
  });
  return out;
}

/**
 * Internal tool-name auto-linking on a single plain-text segment.
 * Mutates `usedSlugs` so the "first occurrence per paragraph" rule
 * spans across all text segments produced by the external-link splitter.
 */
function autoLinkPlainText(
  text: string,
  segmentKey: number,
  usedSlugs: Set<string>
): React.ReactNode[] {
  if (!text) return [text];
  const index = getToolNameIndex();
  const matches: MatchRange[] = [];

  for (const entry of index) {
    if (usedSlugs.has(entry.slug)) continue;
    const m = entry.pattern.exec(text);
    if (!m) continue;
    const start = m.index;
    const end = m.index + m[0].length;

    const overlaps = matches.some(
      (r) => !(end <= r.start || start >= r.end)
    );
    if (overlaps) continue;

    matches.push({ start, end, slug: entry.slug, name: m[0] });
    usedSlugs.add(entry.slug);
  }

  if (matches.length === 0) return [text];

  matches.sort((a, b) => a.start - b.start);

  const out: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) out.push(text.slice(cursor, m.start));
    out.push(
      <Link
        key={`${m.slug}-s${segmentKey}-${i}`}
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
  construction: ["realestate", "electrical", "math"],
  exam: ["career", "education", "science"],
  business: ["finance", "tax", "career"],
  utility: ["indiaguide", "vehicle", "legal"],
  charts: ["developer", "seo", "text"],
  career: ["business", "finance", "exam"],
  // New in Batch 9
  realestate: ["construction", "tax", "finance"],
  legal: ["indiaguide", "tax", "utility"],
  astrology: ["indiaguide", "health", "fun"],
  vehicle: ["indiaguide", "utility", "finance"],
  education: ["exam", "career", "science"],
  agriculture: ["indiaguide", "converters", "business"],
  electrical: ["construction", "math", "converters"],
  // New in Batch 10
  cooking: ["health", "shopping", "indiaguide"],
  wedding: ["shopping", "fun", "indiaguide"],
  shopping: ["finance", "cooking", "fun"],
  whatsapp: ["social", "text", "fun"],
  css: ["developer", "charts", "image"],
  data: ["developer", "charts", "converters"],
  social: ["whatsapp", "seo", "fun"],
  student: ["education", "exam", "career"],
};
