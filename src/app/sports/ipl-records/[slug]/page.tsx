import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import {
  SITE_URL,
  webPageNode,
  breadcrumbNode,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";
import { IPL_RECORDS, getRecordBySlug } from "@/lib/ipl-data";

/**
 * /sports/ipl-records/[slug]/
 *
 * Generates one indexable page per record category (8 pages). Each page
 * targets specific record-search queries:
 *   - "highest individual score in ipl"
 *   - "ipl most runs ever"
 *   - "ipl most wickets ever"
 *   - "ipl highest team total"
 *   - etc.
 */

export function generateStaticParams() {
  return IPL_RECORDS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getRecordBySlug(slug);
  if (!record) return {};

  return {
    title: `${record.title} — IPL All-Time Top 5 | SabTools.in`,
    description: `${record.description} #1: ${record.entries[0].player} — ${record.entries[0].value}.`,
    keywords: [
      record.title.toLowerCase(),
      `ipl ${record.title.toLowerCase()}`,
      `${record.entries[0].player.toLowerCase()} ipl`,
      "ipl record",
      "ipl all time record",
    ],
    alternates: { canonical: `${SITE_URL}/sports/ipl-records/${slug}` },
  };
}

export default async function IplRecordDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getRecordBySlug(slug);
  if (!record) notFound();

  const pageUrl = `${SITE_URL}/sports/ipl-records/${slug}`;
  const otherRecords = IPL_RECORDS.filter((r) => r.slug !== record.slug).slice(0, 4);

  const graph = buildGraph([
    webPageNode({
      url: pageUrl,
      name: record.title,
      description: record.description,
      inLanguage: ["en-IN"],
      breadcrumbId: `${pageUrl}#breadcrumb`,
      dateModified: BUILD_DATE,
    }),
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Sports", url: `${SITE_URL}/sports` },
        { name: "IPL Records", url: `${SITE_URL}/sports/ipl-records` },
        { name: record.title },
      ],
      `${pageUrl}#breadcrumb`
    ),
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#list`,
      name: record.title,
      description: record.description,
      numberOfItems: record.entries.length,
      itemListElement: record.entries.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Person",
          name: e.player,
        },
      })),
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sports", href: "/sports" },
            { label: "IPL Records", href: "/sports/ipl-records" },
            { label: record.title },
          ]}
        />

        <div className="mb-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
            {record.category} record · IPL all-time
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{record.title}</h1>
          <p className="text-base text-white/90 leading-relaxed max-w-3xl">{record.description}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Top 5 All-Time</h2>
          <div className="space-y-3">
            {record.entries.map((e) => (
              <div
                key={e.rank}
                className={`flex items-center gap-4 p-4 rounded-xl border ${e.rank === 1 ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300" : "bg-white border-gray-100"} shadow-sm`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xl ${e.rank === 1 ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700"}`}>
                  #{e.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-base sm:text-lg">{e.player}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{e.team}{e.year ? ` · ${e.year}` : ""}</div>
                </div>
                <div className={`shrink-0 text-right font-bold ${e.rank === 1 ? "text-amber-700 text-xl" : "text-gray-700"}`}>
                  {e.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-3">Other IPL Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherRecords.map((r) => (
              <Link
                key={r.slug}
                href={`/sports/ipl-records/${r.slug}`}
                className="block p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-200 transition"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{r.category}</div>
                <h3 className="text-sm font-bold text-gray-800 mt-1 leading-tight">{r.title}</h3>
                <div className="text-xs text-gray-500 mt-1">#1: {r.entries[0].player}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="prose prose-gray max-w-none">
          <p>
            All numbers above are based on aggregated IPL statistics from
            seasons 1 (2008) through 18 (2025). Records are subject to
            change as players continue to add to their totals each season.
            For live IPL match scores and full team / season data, visit
            our <Link href="/sports/ipl-2026">IPL 2026 hub</Link>.
          </p>
          <ul>
            <li>Back to <Link href="/sports/ipl-records">all IPL records</Link></li>
            <li>Visit the <Link href="/sports/ipl-2026">IPL 2026 hub</Link></li>
            <li>Use our <Link href="/tools/ipl-fantasy-points-calculator">IPL Fantasy Points Calculator</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
