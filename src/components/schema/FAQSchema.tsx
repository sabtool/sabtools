/**
 * <FAQSchema /> — emits a schema.org/FAQPage JSON-LD node.
 *
 * Per AI_VISIBILITY_ACTION_PLAN.md Step 2.3: every important page should
 * have at least 6 genuine FAQ entries with FAQ schema attached. AI
 * crawlers (and Google's "People also ask" feature) extract these
 * Question/Answer pairs verbatim into search snippets and AI answers.
 *
 * Coordination with the existing @graph in src/lib/schema.ts:
 *   The @graph in ToolPageLayout already emits a FAQPage node for tool
 *   pages that have FAQs in src/lib/tool-content.ts. This component
 *   gives the same shape but as a standalone primitive — useful for
 *   pages outside the ToolPageLayout flow (e.g., /about, /compare,
 *   /best/...). Both produce the same FAQPage @type that Google reads.
 *
 * IMPORTANT: only mount FAQSchema on a page that ACTUALLY shows the FAQ
 * content visibly. Google explicitly bans "phantom" FAQ schemas where
 * the JSON-LD has Q&A pairs that aren't visible on the page — this is
 * a manual-action offense.
 *
 * Server Component (no client JS).
 */

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  /** Array of question/answer pairs. Minimum 6 recommended per the plan. */
  faqs: FAQItem[];
  /** BCP-47 language code. Defaults to en-IN. Use hi-IN for Hindi pages. */
  inLanguage?: string;
  /** Optional stable @id for the node — useful for cross-referencing in @graph. */
  id?: string;
}

export default function FAQSchema({ faqs, inLanguage = "en-IN", id }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const node = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    inLanguage,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
    />
  );
}
