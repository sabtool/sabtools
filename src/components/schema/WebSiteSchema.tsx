/**
 * <WebSiteSchema /> — emits the canonical schema.org/WebSite JSON-LD node
 * for SabTools.in, including a SearchAction so Google can render the
 * sitelinks search box on branded SERPs.
 *
 * Coordination with the existing @graph in src/lib/schema.ts:
 *   Delegates to the existing webSiteNode() helper so the @id
 *   (`https://sabtools.in/#website`) and node shape match what the home
 *   page already emits. Mounting this globally lets every page declare
 *   the same WebSite identity to AI crawlers — Google deduplicates
 *   matching @ids automatically, so this is safe to mount alongside
 *   the home page's own webSiteNode() call.
 *
 * Why SearchAction matters: it's the schema that allows Google to
 * surface the "search box" sitelink under branded SERPs (`sabtools.in`).
 * Without it, branded SERPs show only the homepage link.
 *
 * Server Component (no client JS).
 */
import { webSiteNode } from "@/lib/schema";

export default function WebSiteSchema() {
  const node = {
    "@context": "https://schema.org",
    ...webSiteNode(),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
    />
  );
}
