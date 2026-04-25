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

export const SITE_URL = "https://sabtools.in";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/author/rakesh-seervi#person`;

// Keep inLanguage consistent across every schema we emit.
export const SUPPORTED_LANGUAGES = ["en-IN", "hi-IN"] as const;

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
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/logo.png`,
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
    publisher: { "@id": ORG_ID },
    inLanguage: SUPPORTED_LANGUAGES,
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

export interface WebApplicationNodeInput {
  slug: string;
  name: string;
  description: string;
  featureList?: string[];
  category?: string;
  inLanguage?: readonly string[] | string;
  /** If the tool has a named human reviewer/author (for E-E-A-T), pass their person @id */
  authorId?: string;
  /** `@id` of the WebPage that hosts this WebApplication — bidirectional link to keep
   *  the entity graph internally consistent. */
  mainEntityOfPage?: string;
}

/**
 * WebApplication for a tool page. Language defaults to bilingual — pass a
 * single string if the specific surface is English-only or Hindi-only.
 */
export function webApplicationNode(input: WebApplicationNodeInput) {
  const lang = input.inLanguage ?? SUPPORTED_LANGUAGES;
  return {
    "@type": "WebApplication",
    "@id": `${SITE_URL}/tools/${input.slug}#application`,
    name: input.name,
    url: `${SITE_URL}/tools/${input.slug}`,
    description: input.description,
    applicationCategory: "UtilityApplication",
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
