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
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

/**
 * BreadcrumbList — emit on every non-homepage URL.
 * The last item should not have a url (it is the current page).
 */
export function breadcrumbNode(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
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
