/**
 * <OrganizationSchema /> — emits the canonical schema.org/Organization
 * JSON-LD node for SabTools.in.
 *
 * Why a component (and not just inline JSON-LD):
 *   Per AI_VISIBILITY_ACTION_PLAN.md Step 2.1, every page should declare
 *   the same Organization identity to AI crawlers. Centralising it as a
 *   React component means the canonical brand identity (BRAND constants)
 *   propagates everywhere it's mounted — and editing BRAND propagates to
 *   every page that uses this component.
 *
 * Coordination with the existing @graph in src/lib/schema.ts:
 *   The existing organizationNode() helper in src/lib/schema.ts is used
 *   on the home + about pages. This component delegates to that same
 *   helper so the EXACT SAME @id (`https://sabtools.in/#organization`)
 *   and the EXACT SAME node shape is emitted everywhere. When Google
 *   sees two JSON-LD scripts with the same @id on a single page, it
 *   deduplicates them and treats them as one entity — so mounting this
 *   globally in layout.tsx alongside the homepage's own organizationNode()
 *   does NOT cause duplicate-entity penalties.
 *
 * Server Component (no client JS).
 */
import { organizationNode } from "@/lib/schema";

export default function OrganizationSchema() {
  const node = {
    "@context": "https://schema.org",
    ...organizationNode(),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
    />
  );
}
