/**
 * Centralized JSON-LD schema builders for SabTools.in.
 *
 * Follows the entity-linking pattern recommended in the Advanced SEO Strategy
 * report (Section 2.4, Appendix A): every page declares only what it needs
 * and references the shared Organization entity via @id, so the Knowledge
 * Graph sees a single coherent publisher rather than duplicate copies.
 *
 * Usage pattern per page:
 *
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(buildGraph([
 *       organizationNode(),
 *       webApplicationNode({ ... }),
 *       breadcrumbNode([ ... ]),
 *     ])) }} />
 */

import { authors } from "./authors";

export const SITE_URL = "https://sabtools.in";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Reusable Audience node — every primary entity on the site targets
 * Indian users explicitly. Declaring this on WebApplication, Article,
 * and CollectionPage strengthens the geo-signal Google's Knowledge
 * Graph already gets from Organization.areaServed at the brand level.
 *
 * Using `geographicArea: Country("India")` is the schema.org-blessed
 * way to declare a country target — Google Search Console docs cite
 * this exact pattern as a signal for region-restricted rich-results.
 */
export const INDIA_AUDIENCE = {
  "@type": "Audience",
  audienceType: "Indian users seeking free online tools",
  geographicArea: { "@type": "Country", name: "India" },
};
export const FOUNDER_ID = `${SITE_URL}/author/rakesh-seervi#person`;

// Keep inLanguage consistent across every schema we emit.
export const SUPPORTED_LANGUAGES = ["en-IN", "hi-IN"] as const;

/**
 * Build-time freshness signal.
 *
 * Resolves at module-evaluation time which, for our static export, is the
 * build moment on Vercel. Every static page rendered in a given deployment
 * therefore reports the same `dateModified`, and that date advances on
 * each subsequent deploy — giving Google a real freshness signal instead
 * of the previously hardcoded literal that became stale the moment we
 * shipped a new version.
 *
 * ISO 8601 (YYYY-MM-DD), UTC. Schema.org accepts both date and dateTime;
 * we use the date form because the time component would imply minute-level
 * granularity that we don't actually maintain.
 */
export const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * Human-friendly build-date label, e.g. "April 2026".
 *
 * Used in user-facing "Last updated: …" surfaces (ReviewedBy byline,
 * tool-page footer) so the visible freshness label and the schema
 * `dateModified` are derived from the same source — no more drift
 * between what Google sees and what visitors read.
 */
export const BUILD_MONTH_YEAR = new Date().toLocaleString("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * The Organization entity — the "anchor" every other schema should reference
 * via { "@id": ORG_ID }. Emit this on the homepage and the About page only;
 * other pages should reference the @id instead of redeclaring it.
 */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "SabTools",
    alternateName: ["Sabtools.in", "SabTools.in"],
    url: `${SITE_URL}/`,
    // Organization.logo points at icon-512.png (a real 512×512 PNG in
    // /public). Earlier this referenced /logo.png which was never
    // committed — Google's Knowledge Graph crawler hit a 404 on every
    // org-logo lookup, weakening the brand-card eligibility signal.
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    // Generic brand image — og-image.png is the 1200×630 share card
    // that already ships in /public, used everywhere else as the
    // sitewide OG fallback.
    image: `${SITE_URL}/og-image.png`,
    description:
      "SabTools.in is a free online tools platform for Indian users, offering 460+ calculators, converters, and utilities in English and Hindi. Every tool runs in the browser with zero data sent to any server.",
    foundingDate: "2025",
    founder: { "@id": FOUNDER_ID },
    knowsLanguage: ["en", "hi"],
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@sabtools.in",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://twitter.com/sabtools",
      "https://www.youtube.com/@sabtools",
      "https://www.linkedin.com/company/sabtools",
      "https://github.com/sabtool",
    ],
    // Member references — Person @ids of every named expert on the
    // editorial team. Auto-derived from `authors[]` so the member
    // array can never drift out of sync with the actual Person
    // declarations. Earlier this was hardcoded and one slug was
    // wrong (`dr-rajesh-kumar` vs the correct `rajesh-kumar`),
    // creating a dangling @id reference for ~6 weeks until Batch 47.
    // Pulling from authors[] makes that bug class impossible.
    member: authors.map((a) => ({ "@id": personIdFor(a.slug) })),
  };
}

/**
 * WebSite entity with SearchAction (for Google sitelinks search box).
 * Emit on homepage only.
 */
export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "SabTools",
    alternateName: ["Sabtools.in", "SabTools.in"],
    description:
      "Free online tools platform for India — calculators, converters, AI tools, PDF tools, and more. 100% free, no signup, available in English and Hindi.",
    publisher: { "@id": ORG_ID },
    copyrightHolder: { "@id": ORG_ID },
    // copyrightYear is the founding year — bumps automatically each
    // calendar year via getFullYear() so the displayed range stays
    // current without manual edits.
    copyrightYear: new Date().getFullYear(),
    inLanguage: SUPPORTED_LANGUAGES,
    audience: INDIA_AUDIENCE,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Stable @id helper for an author Person node — used when other nodes
 * (Article, WebApplication, ProfilePage) need to cross-reference the
 * author by @id without duplicating the full Person declaration.
 */
export const personIdFor = (authorSlug: string) =>
  `${SITE_URL}/author/${authorSlug}#person`;

export interface PersonNodeInput {
  /** Author slug — also used to derive the canonical URL and @id. */
  slug: string;
  /** Full display name, including any honorific (e.g. "Dr. Rajesh Kumar"). */
  name: string;
  /** Job title at SabTools (e.g. "Founder & Lead Developer"). */
  jobTitle: string;
  /** One-paragraph bio shown in the schema's `description`. */
  description: string;
  /** Topics/skills the person is known to be expert in — populates `knowsAbout`. */
  knowsAbout: readonly string[];
  /** Public profile URLs (Twitter, LinkedIn, etc.) — populates `sameAs`. */
  sameAs?: readonly string[];
  /** Optional override of the Person image URL. Defaults to a per-
   *  author SVG initial-avatar at `/authors/{slug}.svg` (Batch 47) —
   *  visually matches the round avatar shown in the page UI, with
   *  the author's color background and white initials. Real
   *  photographs can be added later by setting this field. */
  image?: string;
  /** Languages the person can converse / write in — defaults to en + hi. */
  knowsLanguage?: readonly string[];
  /** `@id` of the ProfilePage that hosts this Person — bidirectional link
   *  back to the page entity, mirroring the WebApplication ↔ WebPage pattern.
   *  Pass on the author profile page only; other emissions (homepage,
   *  inline byline references) leave this off because they aren't *the*
   *  authoritative page for the Person. */
  mainEntityOfPage?: string;
}

/**
 * Person — the canonical entity for a named human author / reviewer
 * (E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness).
 * Emit the rich version of this node anywhere the person is the primary
 * entity (homepage where they're the founder, ProfilePage). Other pages
 * (Article, WebApplication) reference by @id only via `personIdFor()`.
 */
export function personNode(input: PersonNodeInput) {
  const url = `${SITE_URL}/author/${input.slug}`;
  const nameParts = input.name.replace(/^(Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "").split(" ");
  const honorificMatch = input.name.match(/^(Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i);
  return {
    "@type": "Person",
    "@id": personIdFor(input.slug),
    name: input.name,
    ...(honorificMatch ? { honorificPrefix: honorificMatch[1].replace(/\.$/, "") } : {}),
    givenName: nameParts[0],
    ...(nameParts.length > 1 ? { familyName: nameParts.slice(1).join(" ") } : {}),
    jobTitle: input.jobTitle,
    description: input.description,
    url,
    image: input.image ?? `${SITE_URL}/authors/${input.slug}.svg`,
    worksFor: { "@id": ORG_ID },
    knowsAbout: [...input.knowsAbout],
    knowsLanguage: input.knowsLanguage ? [...input.knowsLanguage] : ["en", "hi"],
    nationality: { "@type": "Country", name: "India" },
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: [...input.sameAs] } : {}),
    ...(input.mainEntityOfPage ? { mainEntityOfPage: { "@id": input.mainEntityOfPage } } : {}),
  };
}

export interface WebApplicationNodeInput {
  slug: string;
  name: string;
  description: string;
  featureList?: string[];
  /** Human-readable category name (used for applicationSubCategory). */
  category?: string;
  /**
   * Category slug from src/lib/tools.ts (e.g., "finance", "health", "pdf").
   * Used to derive the schema.org applicationCategory value via
   * applicationCategoryForToolCategory(). Phase 2 Step 2.3 — finance
   * tools should declare FinanceApplication, etc. If omitted, falls back
   * to the generic UtilityApplication.
   */
  categorySlug?: string;
  inLanguage?: readonly string[] | string;
  /** If the tool has a named human reviewer/author (for E-E-A-T), pass their person @id */
  authorId?: string;
  /** `@id` of the WebPage that hosts this WebApplication — bidirectional link to keep
   *  the entity graph internally consistent. */
  mainEntityOfPage?: string;
}

/**
 * Map a SabTools tool category slug to the schema.org applicationCategory
 * value Google's rich-results parser expects. Per AI_VISIBILITY_ACTION_PLAN.md
 * Step 2.3, finance tools should declare `FinanceApplication` (not the
 * generic `UtilityApplication`) because Google's rich-result rendering
 * treats the more specific value as a stronger relevance signal for
 * money-related searches. Same logic for other domain-specific categories.
 *
 * Returns "UtilityApplication" as the fallback for any category not
 * listed below — this is a safe default per schema.org.
 */
function applicationCategoryForToolCategory(category?: string): string {
  switch (category) {
    case "finance":
    case "tax":
    case "business":
    case "realestate":
    case "shopping":
      return "FinanceApplication";
    case "health":
      return "HealthApplication";
    case "education":
    case "exam":
    case "career":
    case "student":
      return "EducationalApplication";
    case "developer":
    case "ai":
    case "css":
    case "data":
    case "seo":
    case "security":
      return "DeveloperApplication";
    case "image":
    case "pdf":
    case "charts":
      return "DesignApplication";
    case "fun":
    case "wedding":
    case "social":
    case "whatsapp":
    case "astrology":
      return "MultimediaApplication";
    case "sports":
      return "GameApplication";
    case "math":
    case "science":
    case "converters":
    case "datetime":
    case "text":
    case "utility":
    case "indiaguide":
    case "vehicle":
    case "construction":
    case "agriculture":
    case "electrical":
    case "legal":
    case "cooking":
    default:
      return "UtilityApplication";
  }
}

/**
 * WebApplication for a tool page. Language defaults to bilingual — pass a
 * single string if the specific surface is English-only or Hindi-only.
 *
 * applicationCategory is now derived from `input.category` so finance
 * tools emit `FinanceApplication`, health tools emit `HealthApplication`,
 * etc. — see applicationCategoryForToolCategory() above. (Phase 2 Step 2.3.)
 */
export function webApplicationNode(input: WebApplicationNodeInput) {
  const lang = input.inLanguage ?? SUPPORTED_LANGUAGES;
  return {
    "@type": "WebApplication",
    "@id": `${SITE_URL}/tools/${input.slug}#application`,
    name: input.name,
    url: `${SITE_URL}/tools/${input.slug}`,
    description: input.description,
    applicationCategory: applicationCategoryForToolCategory(input.categorySlug),
    applicationSubCategory: input.category || "OnlineTool",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: lang,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    audience: INDIA_AUDIENCE,
    featureList: input.featureList,
    publisher: { "@id": ORG_ID },
    ...(input.authorId ? { author: { "@id": input.authorId } } : {}),
    ...(input.mainEntityOfPage ? { mainEntityOfPage: { "@id": input.mainEntityOfPage } } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

/**
 * Stable @id helper for the BreadcrumbList that anchors a given page URL —
 * lets WebPage / WebApplication nodes reference the breadcrumb via @id.
 */
export const breadcrumbIdFor = (pageUrl: string) => `${pageUrl}#breadcrumb`;

/**
 * BreadcrumbList — emit on every non-homepage URL.
 * The last item should not have a url (it is the current page).
 *
 * Pass `id` to give the node a stable `@id` that other nodes (e.g. WebPage)
 * can cross-reference. Without it the node is anonymous, which is fine for
 * isolated pages but loses entity-graph cohesion on tool pages.
 */
export function breadcrumbNode(items: BreadcrumbItem[], id?: string) {
  return {
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export interface WebPageNodeInput {
  /** Full canonical URL of the page, e.g. https://sabtools.in/tools/emi-calculator */
  url: string;
  name: string;
  description: string;
  inLanguage?: readonly string[] | string;
  /** Optional `@id` of the page's primary entity (WebApplication, Article, etc.) */
  primaryEntityId?: string;
  /** Optional `@id` of the BreadcrumbList that goes with this page */
  breadcrumbId?: string;
  /** ISO 8601 date — when the page was first published */
  datePublished?: string;
  /** ISO 8601 date — when the page was last meaningfully updated */
  dateModified?: string;
  /** ISO 8601 date — when the page content was last *reviewed* for
   *  accuracy by a named expert. Distinct from `dateModified` (which
   *  bumps on any edit). E-E-A-T signal Google explicitly surfaces. */
  lastReviewed?: string;
  /** `@id` of the Person/Organization that performed the last review.
   *  Pair with `lastReviewed` to make the editorial review attributable. */
  reviewedById?: string;
  /**
   * CSS selectors marking the parts of the page best suited for voice
   * read-out (Google Assistant / Speakable rich-result spec). Typically
   * the FAQ block — short Q&A pairs that answer one question each.
   * When provided, emits a SpeakableSpecification on the WebPage node.
   */
  speakableSelectors?: readonly string[];
}

/**
 * WebPage — the canonical anchor schema.org expects every URL to declare.
 * Most rich-result eligibility is unaffected by its absence, but it's the
 * recommended pattern (Google docs, "About a page") and it lets us tie the
 * WebApplication / FAQPage / BreadcrumbList nodes to a single page entity.
 */
export function webPageNode(input: WebPageNodeInput) {
  const lang = input.inLanguage ?? SUPPORTED_LANGUAGES;
  return {
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: lang,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    ...(input.primaryEntityId ? { mainEntity: { "@id": input.primaryEntityId } } : {}),
    ...(input.breadcrumbId ? { breadcrumb: { "@id": input.breadcrumbId } } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.lastReviewed ? { lastReviewed: input.lastReviewed } : {}),
    ...(input.reviewedById ? { reviewedBy: { "@id": input.reviewedById } } : {}),
    ...(input.speakableSelectors && input.speakableSelectors.length > 0
      ? {
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: [...input.speakableSelectors],
          },
        }
      : {}),
  };
}

export interface FAQItem {
  q: string;
  a: string;
}

export function faqPageNode(items: FAQItem[], inLanguage: string | readonly string[] = "en-IN") {
  return {
    "@type": "FAQPage",
    inLanguage,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export function howToNode(params: {
  name: string;
  description?: string;
  steps: HowToStep[];
  inLanguage?: string | readonly string[];
}) {
  return {
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    inLanguage: params.inLanguage ?? "en-IN",
    step: params.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

export interface VideoObjectNodeInput {
  /** Video name / headline shown in rich results */
  name: string;
  /** 2-3 sentence description (~50-160 chars). */
  description: string;
  /** Public thumbnail URL — Google requires at least 1. Use the YouTube
   *  hqdefault for embedded YouTube videos: https://i.ytimg.com/vi/{ID}/hqdefault.jpg */
  thumbnailUrl: string;
  /** ISO 8601 — when the video was first uploaded. */
  uploadDate: string;
  /** ISO 8601 duration, e.g. "PT3M12S" for 3 min 12 sec. */
  duration?: string;
  /** Public watch page (e.g. https://www.youtube.com/watch?v=XXXX). */
  contentUrl?: string;
  /** Embed URL (e.g. https://www.youtube-nocookie.com/embed/XXXX). */
  embedUrl?: string;
  /** Stable @id so other graph nodes (WebApplication, Article) can cross-reference. */
  id?: string;
  /** Publisher Organization @id; defaults to the shared ORG_ID. */
  publisherId?: string;
  inLanguage?: string | readonly string[];
}

/**
 * VideoObject node — emitted on tool pages that have a tutorial / walkthrough
 * video. Follows the schema.org rich-result spec for video carousels.
 *
 * Ground rules (Strategy §2.4):
 *   - Only emit if the video actually exists on the page or is linked. Phantom
 *     VideoObjects without a real `<iframe>` or visible link get penalised.
 *   - Use youtube-nocookie.com for the embed URL — privacy-enhanced and
 *     loads less third-party JS so it doesn't tank LCP.
 *   - thumbnailUrl is required; YouTube's hqdefault always exists.
 */
export function videoObjectNode(input: VideoObjectNodeInput) {
  return {
    "@type": "VideoObject",
    ...(input.id ? { "@id": input.id } : {}),
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl,
    uploadDate: input.uploadDate,
    inLanguage: input.inLanguage ?? "en-IN",
    ...(input.duration ? { duration: input.duration } : {}),
    ...(input.contentUrl ? { contentUrl: input.contentUrl } : {}),
    ...(input.embedUrl ? { embedUrl: input.embedUrl } : {}),
    publisher: { "@id": input.publisherId ?? ORG_ID },
  };
}

/**
 * Wraps one or more nodes into a schema.org @graph block.
 * This is the recommended emission pattern for pages with multiple schema types.
 */
export function buildGraph(nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/**
 * Convenience: build a self-contained tool-page graph with common pieces.
 */
export function toolPageGraph(params: {
  slug: string;
  name: string;
  description: string;
  categoryName: string;
  categorySlug: string;
  featureList?: string[];
  faqs?: FAQItem[];
  howto?: { name: string; description?: string; steps: HowToStep[] };
  inLanguage?: readonly string[] | string;
  authorId?: string;
}) {
  const nodes: Record<string, unknown>[] = [
    webApplicationNode({
      slug: params.slug,
      name: params.name,
      description: params.description,
      featureList: params.featureList,
      category: params.categoryName,
      inLanguage: params.inLanguage,
      authorId: params.authorId,
    }),
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: params.categoryName, url: `${SITE_URL}/category/${params.categorySlug}` },
      { name: params.name },
    ]),
  ];

  if (params.howto && params.howto.steps.length > 0) {
    nodes.push(
      howToNode({
        name: params.howto.name,
        description: params.howto.description,
        steps: params.howto.steps,
        inLanguage: params.inLanguage,
      })
    );
  }

  if (params.faqs && params.faqs.length > 0) {
    const langForFaq = Array.isArray(params.inLanguage)
      ? params.inLanguage[0]
      : (params.inLanguage as string | undefined) ?? "en-IN";
    nodes.push(faqPageNode(params.faqs, langForFaq));
  }

  return buildGraph(nodes);
}
