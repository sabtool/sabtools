/**
 * <BreadcrumbSchema /> — emits a schema.org/BreadcrumbList JSON-LD node.
 *
 * Per AI_VISIBILITY_ACTION_PLAN.md Step 2.3: every tool / category page
 * should declare its breadcrumb path so Google's "breadcrumb" rich
 * result can replace the raw URL in SERPs. AI crawlers also use this
 * to understand the site's hierarchy.
 *
 * Coordination with the existing @graph in src/lib/schema.ts:
 *   The breadcrumbNode() helper in schema.ts produces an identical
 *   BreadcrumbList shape; this component is a standalone primitive
 *   for pages outside the @graph flow. Use the same `@id` convention
 *   (`${pageUrl}#breadcrumb`) so cross-references work.
 *
 * Server Component (no client JS).
 */

interface Crumb {
  /** Display name (e.g., "Home", "Finance & Tax", "GST Calculator"). */
  name: string;
  /** Absolute URL. The LAST crumb may omit url (current page). */
  url?: string;
}

interface BreadcrumbSchemaProps {
  /** Crumbs in order — first is root, last is current page. */
  crumbs: Crumb[];
  /** Optional stable @id, defaults to none. */
  id?: string;
}

export default function BreadcrumbSchema({ crumbs, id }: BreadcrumbSchemaProps) {
  if (!crumbs || crumbs.length === 0) return null;

  const node = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      // Schema.org allows the last item to omit `item` (treated as the
      // page being viewed). Older Google docs recommend always including
      // it. We include when provided, omit otherwise.
      ...(c.url ? { item: c.url } : {}),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
    />
  );
}
