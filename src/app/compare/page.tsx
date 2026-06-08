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

const PAGE_URL = `${SITE_URL}/compare`;

const COMPARISONS = [
  { slug: "sabtools-vs-cleartax", label: "SabTools vs ClearTax", note: "Free calculators vs ITR-filing platform" },
  { slug: "sabtools-vs-toolvala", label: "SabTools vs Toolvala", note: "Two Indian free-tools sites compared" },
  { slug: "sabtools-vs-indiatoolkit", label: "SabTools vs IndiaToolkit", note: "Tool range, Hindi support & privacy" },
  { slug: "sabtools-vs-easycalculation", label: "SabTools vs EasyCalculation", note: "India-specific vs global calculators" },
  { slug: "sabtools-vs-uptools", label: "SabTools vs UpTools", note: "Features, signup & ads compared" },
];

export const metadata: Metadata = {
  title: "Compare SabTools — Honest Tool & Calculator Comparisons",
  description:
    "Honest, side-by-side comparisons of SabTools.in against other Indian calculator and tool sites — features, Hindi support, privacy, signup and ads.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Compare SabTools — Honest Comparisons | SabTools.in",
    description: "Side-by-side comparisons of SabTools.in against other Indian calculator and tool sites.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SabTools comparisons" }],
  },
};

export default function CompareHubPage() {
  const graph = buildGraph([
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Compare SabTools — Honest Tool & Calculator Comparisons",
      description: "Side-by-side comparisons of SabTools.in against other Indian calculator and tool sites.",
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      dateModified: BUILD_DATE,
      breadcrumb: { "@id": breadcrumbIdFor(PAGE_URL) },
    },
    breadcrumbNode([{ name: "Home", url: `${SITE_URL}/` }, { name: "Compare" }], breadcrumbIdFor(PAGE_URL)),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Compare SabTools</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Honest, side-by-side comparisons of SabTools.in against other Indian calculator and tool sites — including where
        the other option is the better pick. Looking for the best free tool for a specific job? See our{" "}
        <Link href="/best" className="text-indigo-600 hover:underline">
          best-of guides
        </Link>
        .
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMPARISONS.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/compare/${c.slug}`}
              className="block rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition"
            >
              <div className="font-semibold text-gray-900">{c.label}</div>
              <div className="text-sm text-gray-500 mt-1">{c.note}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
