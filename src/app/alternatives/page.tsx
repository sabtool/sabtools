import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  breadcrumbNode,
  breadcrumbIdFor,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";

const PAGE_URL = `${SITE_URL}/alternatives`;

const ALTERNATIVES = [
  { slug: "to-cleartax-calculators", label: "Alternatives to ClearTax Calculators", note: "Free tax & finance calculators, no signup" },
  { slug: "to-toolvala", label: "Alternatives to Toolvala", note: "Other free Indian tool platforms" },
  { slug: "to-indiatoolkit", label: "Alternatives to IndiaToolkit", note: "Wider tool range with Hindi support" },
];

export const metadata: Metadata = {
  title: "Free Alternatives — Indian Calculator & Tool Sites",
  description:
    "Free alternatives to popular Indian calculator and tool sites — privacy-first, no signup, available in Hindi. Honest options including non-SabTools picks.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free Alternatives — Indian Calculator & Tool Sites | SabTools.in",
    description: "Free alternatives to popular Indian calculator and tool sites — privacy-first, no signup.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SabTools alternatives" }],
  },
};

export default function AlternativesHubPage() {
  const graph = buildGraph([
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Free Alternatives — Indian Calculator & Tool Sites",
      description: "Free alternatives to popular Indian calculator and tool sites.",
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      dateModified: BUILD_DATE,
      breadcrumb: { "@id": breadcrumbIdFor(PAGE_URL) },
    },
    breadcrumbNode([{ name: "Home", url: `${SITE_URL}/` }, { name: "Alternatives" }], breadcrumbIdFor(PAGE_URL)),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Alternatives" }]} />

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Free Alternatives</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Free, privacy-first alternatives to popular Indian calculator and tool sites — no signup, available in Hindi. We
        list honest options, including cases where another tool is the better fit. See also our{" "}
        <Link href="/compare" className="text-indigo-600 hover:underline">
          head-to-head comparisons
        </Link>
        .
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ALTERNATIVES.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/alternatives/${a.slug}`}
              className="block rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition"
            >
              <div className="font-semibold text-gray-900">{a.label}</div>
              <div className="text-sm text-gray-500 mt-1">{a.note}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
