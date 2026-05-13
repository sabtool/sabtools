/**
 * SabTools.in — canonical brand constants.
 *
 * Single source of truth for the site's name, tagline, descriptions,
 * tool counts, founder, and social handles. Per AI_VISIBILITY_ACTION_PLAN.md
 * (Step 1.2 in /Volumes/KUSH/Claude/sabtools/SEO reports/), every page that
 * builds a `<title>`, `<meta name="description">`, OpenGraph tag, or
 * JSON-LD schema MUST derive its values from this object — never inline
 * a hand-written description that could drift.
 *
 * Why this matters for AI visibility:
 *   AI assistants (ChatGPT, Claude, Gemini, Perplexity) build a "brand
 *   identity" from the descriptions they see across crawls. If two pages
 *   on sabtools.in describe the site differently, the assistant cannot
 *   cite a stable, factual identity — and tends to omit the brand from
 *   recommendations entirely. Centralising the description here ensures
 *   every page reinforces the same factual identity.
 *
 * NUMBERS: published as a FLOOR ("450+", "38", "424+"), never the exact
 * runtime count. This is intentional — the marketing claim is honest
 * regardless of catalog drift, and we don't have to bump every "450+"
 * string in the codebase every time a tool is added.
 *
 *   - totalTools = 450        : floor; actual tools[].length is verified
 *                               by the build-time assert at the bottom
 *                               of this file (the build fails if the
 *                               catalog ever shrinks below this floor).
 *                               A previous header comment claimed "497"
 *                               but the grep that produced it counted
 *                               the 38 category objects together with
 *                               the 459 actual tools — both literal
 *                               `{ name: "..." }` blocks. The honest
 *                               count is `tools.length` only.
 *   - totalCategories = 38    : counted in `categories[]` in src/lib/tools.ts
 *   - hindiTools = 424        : floor (actual hindiTools[].length is 424
 *                               at time of writing; rounded down to a
 *                               clean published value if the array grows).
 *
 * To raise the published claim (e.g. to "500+"): bump `totalTools` here
 * and re-run `next build`. The assert at the bottom of this file fails
 * the build if `tools[].length < BRAND.totalTools`, so an over-claim
 * never ships.
 */

import { tools as _tools } from "./tools";

export const BRAND = {
  /** Display name. Used in titles, OG, footers, schema. */
  name: "SabTools.in",
  /** Legal name for schema.org/Organization.legalName. */
  legalName: "SabTools",
  /** One-line tagline. Shown after the name in hero metadata. */
  tagline: "Free Online Tools for India",
  /**
   * Concise, factual one-paragraph description (≤ 160 chars-ish for SERP
   * snippets). Used in <meta name="description">.
   * Rules: declarative; no marketing fluff; cites totals; mentions Hindi
   * support; reinforces "free tools platform" identity (NOT "store").
   */
  shortDescription:
    "Free online tools platform with 450+ calculators, converters, PDF tools, image editors, and AI writing utilities — built for Indian users with Hindi support.",
  /**
   * Long description for OpenGraph, About page, Organization schema. Used
   * by AI crawlers to build the canonical "what is X" answer for the brand.
   * Rules: factual; third-person; cites concrete counts; explains the
   * privacy posture; flags Hindi capability; no first-person marketing.
   */
  longDescription:
    "SabTools.in is a free online tools platform offering 450+ tools across 38 categories including GST, EMI, income tax calculators, PDF and image tools, AI writing utilities, sports calculators, and developer resources. All tools run client-side in the browser with zero data collection. 424+ tools are also available in Hindi at /hi. No signup required.",
  /** Year the site was founded. Used in Organization schema + about page. */
  founded: "2025",
  /** Founder's full name. Used in Organization.founder, about page, articles. */
  founder: "Rakesh Seervi",
  /** Canonical site URL with no trailing slash. */
  url: "https://sabtools.in",
  /** Logo URL for schema.org/Organization.logo (must be PNG/JPG, ≥ 60×60). */
  logo: "https://sabtools.in/og-image.png",
  /**
   * Published-floor tool count (NOT the exact runtime length).
   * The build fails if `tools[].length < totalTools` — see assert at
   * the bottom of this file. Bump in increments of 50 only when the
   * catalog has grown well past the floor; every visible "450+" string
   * across the site reads from this constant.
   */
  totalTools: 450,
  /** Verified category count (38 includes "Sports & Cricket" added in IPL Phase 1). */
  totalCategories: 38,
  /** Hindi-localized tool count (subset of totalTools). */
  hindiTools: 424,
  /** Primary audience (used in schema.org Audience nodes). */
  audience: "Indian users",
  /** Site languages — used for hreflang + schema.inLanguage. */
  languages: ["en", "hi"] as const,
  /**
   * Verified social profiles. Per the action plan (Step 1.2): "Fill in
   * actual handles once verified". Twitter is verified via the founder's
   * authors.ts entry. Other platforms are intentionally OMITTED until a
   * human verifies the official handles — better to ship no link than a
   * dead/wrong link in schema.org/Organization.sameAs.
   */
  social: {
    twitter: "https://x.com/Sabtoolsin",
    // facebook: HUMAN-TODO — verify official handle, then add
    // instagram: HUMAN-TODO — verify official handle, then add
    // linkedin: HUMAN-TODO — verify official handle, then add
  },
} as const;

/**
 * Convenience export for places that want the URL with no trailing slash.
 * Already provided by `BRAND.url` but exported separately to match the
 * existing `SITE_URL` import pattern used across schema helpers.
 */
export const BRAND_URL = BRAND.url;

/**
 * Convenience: the social profile URLs as an array, suitable for direct
 * use in schema.org/Organization.sameAs and Person.sameAs nodes.
 * Filters out any undefined values so the array stays clean.
 */
export const BRAND_SOCIAL_URLS: string[] = (
  Object.values(BRAND.social) as readonly string[]
).filter((v) => typeof v === "string" && v.length > 0);

// ────────────────────────────────────────────────────────────────────────────
// Build-time invariant guard.
//
// The marketing claim "450+ tools" must be true. This top-level check runs
// once when the module is first evaluated — during `next build`, that's
// before any HTML is rendered, so a mismatch fails the build instead of
// shipping a false claim. In the production client bundle, the same check
// is a no-op (it can never fire because tools[] is the same statically
// imported array that was just verified at build time).
//
// If this throws on `next build`:
//   - tools[] shrunk below the floor → either restore the deleted tools,
//     OR lower BRAND.totalTools to the largest 50-multiple that's ≤
//     the new tools.length (e.g. drop "450+" → "400+").
//
// If you want to RAISE the claim (e.g. publish "500+"):
//   - bump BRAND.totalTools above. This assert verifies the new floor
//     holds before the build allows the change to ship.
// ────────────────────────────────────────────────────────────────────────────
if (_tools.length < BRAND.totalTools) {
  throw new Error(
    `[BRAND invariant] tools[].length = ${_tools.length} but BRAND.totalTools = ${BRAND.totalTools}. ` +
      `The published claim "${BRAND.totalTools}+" is no longer honest. ` +
      `Either lower BRAND.totalTools to ≤ ${_tools.length}, ` +
      `or add ${BRAND.totalTools - _tools.length} more tools to src/lib/tools.ts.`
  );
}
