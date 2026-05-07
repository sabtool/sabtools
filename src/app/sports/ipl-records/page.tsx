import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  SITE_URL,
  webPageNode,
  breadcrumbNode,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";
import { IPL_RECORDS } from "@/lib/ipl-data";

/**
 * /sports/ipl-records/ — all-time IPL records hub.
 * Lists all 8 record categories. Each links to a detail page.
 */

export const metadata: Metadata = {
  title: "IPL All-Time Records — Highest Scores, Most Runs, Most Wickets, Most Sixes | SabTools.in",
  description:
    "Complete list of all-time IPL records: highest individual score (Chris Gayle 175*), highest team total (SRH 287/3), most career runs (Virat Kohli), most wickets, most sixes, fastest century, best bowling figures, most titles.",
  keywords: [
    "ipl all time records",
    "ipl highest score",
    "ipl most runs ever",
    "ipl most wickets ever",
    "ipl most sixes",
    "ipl highest team total",
    "ipl fastest century",
    "ipl records list",
    "chris gayle 175",
    "virat kohli ipl runs",
  ],
  alternates: { canonical: `${SITE_URL}/sports/ipl-records` },
};

export default function IplRecordsHubPage() {
  const pageUrl = `${SITE_URL}/sports/ipl-records`;
  const graph = buildGraph([
    webPageNode({
      url: pageUrl,
      name: "IPL All-Time Records",
      description: metadata.description as string,
      inLanguage: ["en-IN"],
      breadcrumbId: `${pageUrl}#breadcrumb`,
      dateModified: BUILD_DATE,
    }),
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Sports", url: `${SITE_URL}/sports` },
        { name: "IPL 2026", url: `${SITE_URL}/sports/ipl-2026` },
        { name: "Records" },
      ],
      `${pageUrl}#breadcrumb`
    ),
  ]);

  // Group by category
  const byCategory = {
    batting: IPL_RECORDS.filter((r) => r.category === "batting"),
    bowling: IPL_RECORDS.filter((r) => r.category === "bowling"),
    team: IPL_RECORDS.filter((r) => r.category === "team"),
    fielding: IPL_RECORDS.filter((r) => r.category === "fielding"),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sports", href: "/sports" },
            { label: "IPL 2026", href: "/sports/ipl-2026" },
            { label: "Records" },
          ]}
        />

        <div className="mb-10 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">All-Time Records</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3">IPL All-Time Records</h1>
          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
            Every major batting, bowling, team, and fielding record across 18 IPL seasons (2008-2025). Click any record below to see the top 5 holders.
          </p>
        </div>

        {(["batting", "bowling", "team"] as const).map((cat) =>
          byCategory[cat].length > 0 ? (
            <section key={cat} className="mb-10">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 capitalize">
                {cat === "team" ? "Team Records" : `${cat} Records`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {byCategory[cat].map((r) => (
                  <Link
                    key={r.slug}
                    href={`/sports/ipl-records/${r.slug}`}
                    className="block p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition group"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{r.category}</div>
                    <h3 className="font-bold text-gray-800 group-hover:text-indigo-700 mt-1 leading-tight">
                      {r.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.description}</p>
                    <div className="text-xs mt-3 pt-2 border-t border-gray-100">
                      <span className="font-semibold text-amber-700">#1: </span>
                      <span className="text-gray-700">{r.entries[0].player}</span>
                      <span className="text-gray-500"> — {r.entries[0].value}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null
        )}

        {/* Internal links */}
        <section className="prose prose-gray max-w-none">
          <h2>About IPL Records</h2>
          <p>
            18 seasons of IPL cricket (2008-2025) have produced some of the
            most explosive individual and team performances in T20 history.{" "}
            <strong>Chris Gayle&apos;s 175* off 66 balls</strong> remains the
            highest individual score in T20 cricket — IPL or otherwise.
            <strong> Sunrisers Hyderabad&apos;s 287/3 vs RCB in 2024</strong>{" "}
            is the highest team total in IPL history.{" "}
            <strong>Virat Kohli</strong> is the all-time leading run-scorer
            with over 8,000 IPL runs.
          </p>
          <p>
            All records below are aggregated across the full 2008-2025 IPL
            history. They are updated each season as new milestones are set.
          </p>
          <ul>
            <li>Back to <Link href="/sports/ipl-2026">IPL 2026 Hub</Link></li>
            <li>Browse <Link href="/sports/ipl-2026">all 10 IPL teams</Link></li>
            <li>See year-by-year history (2008-2025) on the <Link href="/sports/ipl-2026">main hub</Link></li>
            <li>Use our <Link href="/tools/ipl-fantasy-points-calculator">IPL Fantasy Points Calculator</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
