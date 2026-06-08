import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { programmaticPages } from "@/lib/programmatic-pages";
import { tools } from "@/lib/tools";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  breadcrumbNode,
  breadcrumbIdFor,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";

const PAGE_URL = `${SITE_URL}/calc`;

export const metadata: Metadata = {
  title: "All Calculators — Bank, Loan & Scheme Tools (India)",
  description:
    "Browse 200+ ready-made calculators for Indian banks, loans and government schemes — SBI/HDFC/ICICI home-loan EMI, FD, RD, PPF, NPS and more. Free, no signup.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "All Calculators — Bank, Loan & Scheme Tools (India) | SabTools.in",
    description:
      "200+ ready-made calculators for Indian banks, loans and government schemes. Free, no signup, built for India.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SabTools.in calculators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Calculators — Bank, Loan & Scheme Tools (India)",
    description: "200+ ready-made calculators for Indian banks, loans and schemes. Free, no signup.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function CalcHubPage() {
  // Group the programmatic calculator pages by their parent tool so the hub
  // reads as topical clusters (and every /calc/* page gets an internal link,
  // fixing the orphan-page issue from the technical-SEO audit).
  const toolName = (slug: string) => tools.find((t) => t.slug === slug)?.name ?? slug;

  const groups = new Map<string, typeof programmaticPages>();
  for (const p of programmaticPages) {
    const arr = groups.get(p.toolSlug) ?? [];
    arr.push(p);
    groups.set(p.toolSlug, arr);
  }
  // Stable ordering: largest clusters first, then alphabetical by parent name.
  const ordered = Array.from(groups.entries()).sort((a, b) => {
    if (b[1].length !== a[1].length) return b[1].length - a[1].length;
    return toolName(a[0]).localeCompare(toolName(b[0]));
  });

  const graph = buildGraph([
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "All Calculators — Bank, Loan & Scheme Tools (India)",
      description:
        "Index of 200+ ready-made calculators for Indian banks, loans and government schemes.",
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      dateModified: BUILD_DATE,
      breadcrumb: { "@id": breadcrumbIdFor(PAGE_URL) },
    },
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "All Calculators" },
      ],
      breadcrumbIdFor(PAGE_URL)
    ),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "All Calculators" }]} />

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">All Calculators</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        {programmaticPages.length}+ ready-made calculators pre-filled for specific Indian banks, loans
        and government schemes — pick the exact one you need below. Each is free, runs in your browser,
        and needs no signup. Looking for a general tool instead? Browse all{" "}
        <Link href="/tools" className="text-indigo-600 hover:underline">
          {tools.length}+ tools
        </Link>
        .
      </p>

      <div className="space-y-8">
        {ordered.map(([toolSlug, pages]) => (
          <section key={toolSlug}>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              <Link href={`/tools/${toolSlug}`} className="hover:text-indigo-600">
                {toolName(toolSlug)}
              </Link>{" "}
              <span className="text-sm font-normal text-gray-400">({pages.length})</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {pages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/calc/${p.slug}`}
                    className="text-sm text-gray-700 hover:text-indigo-600 hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
