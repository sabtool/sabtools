/**
 * <SoftwareApplicationSchema /> — emits a schema.org/SoftwareApplication
 * (or its more specific subtype WebApplication) JSON-LD node for an
 * individual tool / calculator page.
 *
 * Why a component:
 *   Tool pages on SabTools today already get a richer WebApplication
 *   node via the @graph in src/components/ToolPageLayout.tsx. This
 *   standalone component covers cases where the dynamic ToolPageLayout
 *   isn't being used — e.g., a custom landing page or a one-off tool
 *   page outside /tools/[slug]. Per AI_VISIBILITY_ACTION_PLAN.md
 *   Step 2.3, this is the canonical, simple primitive to drop on any
 *   tool-like surface.
 *
 * applicationCategory:
 *   The plan asks for FinanceApplication on finance tools and
 *   UtilityApplication elsewhere. Pass the right category as a prop —
 *   schema.org accepts: FinanceApplication, UtilityApplication,
 *   DesignApplication, BusinessApplication, EducationalApplication,
 *   MultimediaApplication, etc. (https://schema.org/SoftwareApplication)
 *
 * Why no aggregateRating:
 *   The plan explicitly says: "DO NOT use fake aggregateRating values —
 *   omit it entirely until real reviews exist." Even an aggregateRating
 *   of "ratingCount: 1" is treated as fake by Google's spam filter and
 *   can lead to a manual penalty. We omit until ToolRating accumulates
 *   real signal.
 *
 * Server Component (no client JS).
 */
import { BRAND } from "@/lib/brand";

interface SoftwareApplicationSchemaProps {
  /** Tool name (e.g., "GST Calculator India"). */
  name: string;
  /** Description of the tool — should match the page's meta description. */
  description: string;
  /** Canonical URL of the tool page, e.g., `${BRAND.url}/tools/gst-calculator`. */
  url: string;
  /**
   * Schema.org applicationCategory. Use:
   *   - FinanceApplication      for tools handling money / tax / loans
   *   - UtilityApplication      for general calculators / converters (default)
   *   - EducationalApplication  for exam / GPA / study tools
   *   - DesignApplication       for image / CSS / color tools
   *   - DeveloperApplication    for dev tools (JSON, regex, hash, etc.)
   *   - HealthApplication       for BMI / calorie / fitness tools
   *   - BusinessApplication     for invoice / business tools
   * Pass your own value if none match.
   */
  applicationCategory?: string;
  /** Stable @id for the node, defaults to `${url}#application`. */
  id?: string;
}

export default function SoftwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = "UtilityApplication",
  id,
}: SoftwareApplicationSchemaProps) {
  const node = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": id ?? `${url}#application`,
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: BRAND.languages,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": `${BRAND.url}/#organization` },
    // No aggregateRating — see header comment.
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
    />
  );
}
