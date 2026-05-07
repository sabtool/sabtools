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
 * NUMBERS: every count below was verified directly against the codebase
 * on 2026-05-07, NOT taken from the plan (which had stale numbers):
 *   - totalTools = 497    : `grep -cE '^\s*\{ name: "' src/lib/tools.ts`
 *   - totalCategories = 38 : counted in `categories[]` in src/lib/tools.ts
 *   - hindiTools = 424    : counted in `hindiTools[]` in src/lib/hindi.ts
 *
 * If the catalog grows, update these and re-deploy — every page picks up
 * the new numbers from the next build.
 */

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
    "Free online tools platform with 497+ calculators, converters, PDF tools, image editors, and AI writing utilities — built for Indian users with Hindi support.",
  /**
   * Long description for OpenGraph, About page, Organization schema. Used
   * by AI crawlers to build the canonical "what is X" answer for the brand.
   * Rules: factual; third-person; cites concrete counts; explains the
   * privacy posture; flags Hindi capability; no first-person marketing.
   */
  longDescription:
    "SabTools.in is a free online tools platform offering 497+ tools across 38 categories including GST, EMI, income tax calculators, PDF and image tools, AI writing utilities, sports calculators, and developer resources. All tools run client-side in the browser with zero data collection. 424+ tools are also available in Hindi at /hi. No signup required.",
  /** Year the site was founded. Used in Organization schema + about page. */
  founded: "2025",
  /** Founder's full name. Used in Organization.founder, about page, articles. */
  founder: "Rakesh Seervi",
  /** Canonical site URL with no trailing slash. */
  url: "https://sabtools.in",
  /** Logo URL for schema.org/Organization.logo (must be PNG/JPG, ≥ 60×60). */
  logo: "https://sabtools.in/og-image.png",
  /** Verified tool count. See header comment for source of truth. */
  totalTools: 497,
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
    twitter: "https://twitter.com/sabtools",
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
