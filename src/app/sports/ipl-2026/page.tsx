import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  SITE_URL,
  ORG_ID,
  webPageNode,
  breadcrumbNode,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";
import { IPL_TEAMS, IPL_HISTORY, IPL_RECORDS } from "@/lib/ipl-data";

/**
 * /sports/ipl-2026/ — main IPL 2026 hub.
 *
 * The "front door" for IPL traffic. Drives users to:
 *   - 10 team pages (highest individual team-search volume)
 *   - 18 history pages (year-on-year SEO long-tail)
 *   - Records hub
 *   - Calculator suite (the moat)
 *   - Live cricket scores on parent /sports/ page
 */

export const metadata: Metadata = {
  title: "IPL 2026 — Schedule, Teams, Points Table, Records, Live Scores | SabTools.in",
  description:
    "Complete guide to IPL 2026 — all 10 franchise teams, 18-year history (2008-2025), points table, all-time records (Orange Cap, Purple Cap, most runs, most wickets, highest scores), live cricket scores and IPL fantasy / NRR / win-probability calculators.",
  keywords: [
    "ipl 2026",
    "indian premier league 2026",
    "ipl 2026 schedule",
    "ipl 2026 points table",
    "ipl 2026 teams",
    "ipl history",
    "ipl winners list",
    "ipl all-time records",
    "ipl orange cap",
    "ipl purple cap",
    "mumbai indians",
    "chennai super kings",
    "ipl 19th season",
    "ipl live score",
  ],
  alternates: { canonical: `${SITE_URL}/sports/ipl-2026` },
  openGraph: {
    title: "IPL 2026 — Complete Guide | SabTools.in",
    description: "All 10 teams, 18 years of history, all-time records, calculators and live scores in one place.",
    url: `${SITE_URL}/sports/ipl-2026`,
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "IPL 2026 Hub — SabTools.in" }],
  },
};

const IPL_TOOLS = [
  { slug: "ipl-fantasy-points-calculator", name: "Fantasy Points", icon: "🏏" },
  { slug: "ipl-required-run-rate-calculator", name: "Required Run Rate", icon: "🎯" },
  { slug: "ipl-nrr-calculator", name: "Net Run Rate (NRR)", icon: "📊" },
  { slug: "ipl-win-probability-calculator", name: "Win Probability", icon: "🎲" },
  { slug: "ipl-ticket-price-calculator", name: "Ticket Price", icon: "🎟️" },
  { slug: "ipl-auction-salary-cap-calculator", name: "Auction Salary Cap", icon: "💰" },
];

export default function Ipl2026HubPage() {
  const pageUrl = `${SITE_URL}/sports/ipl-2026`;
  const graph = buildGraph([
    webPageNode({
      url: pageUrl,
      name: "IPL 2026 — Complete Guide & Live Hub",
      description: metadata.description as string,
      inLanguage: ["en-IN"],
      breadcrumbId: `${pageUrl}#breadcrumb`,
      dateModified: BUILD_DATE,
    }),
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Sports", url: `${SITE_URL}/sports` },
        { name: "IPL 2026" },
      ],
      `${pageUrl}#breadcrumb`
    ),
    {
      "@type": "SportsEvent",
      "@id": `${pageUrl}#event`,
      name: "Indian Premier League 2026",
      description: "19th season of the Indian Premier League — 10 franchise teams, 74 matches across India.",
      sport: "Cricket",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Country", name: "India" },
      organizer: { "@id": ORG_ID },
      startDate: "2026-03-15",
      endDate: "2026-05-31",
    },
  ]);

  // Sort teams: champions first, then by titles desc, then alphabetical
  const teamsByTitles = [...IPL_TEAMS].sort((a, b) => b.titles - a.titles || a.name.localeCompare(b.name));

  // Recent 5 seasons for quick history snapshot
  const recentSeasons = [...IPL_HISTORY].sort((a, b) => b.year - a.year).slice(0, 5);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sports", href: "/sports" },
            { label: "IPL 2026" },
          ]}
        />

        {/* Hero */}
        <div className="mb-10 bg-gradient-to-br from-blue-600 via-purple-600 to-fuchsia-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold mb-3">
            🏆 19th Season · 10 Teams · 74 Matches
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight">
            IPL 2026 — Complete Hub
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-6 leading-relaxed">
            Schedule · Teams · Points Table · 18 Years of History · All-Time Records · IPL Calculators · Live Scores — everything you need for the 2026 Indian Premier League.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/sports" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition">
              📺 Live Scores
            </Link>
            <a href="#teams" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur text-white rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition">
              👥 Teams
            </a>
            <a href="#history" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur text-white rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition">
              📜 History
            </a>
            <a href="#records" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur text-white rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition">
              🏆 Records
            </a>
          </div>
        </div>

        {/* Quick stats grid */}
        <section className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-indigo-600">19</div>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-1">Seasons</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-emerald-600">10</div>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-1">Teams (2026)</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-rose-600">74</div>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-1">Matches</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-amber-600">₹120Cr</div>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-1">Salary Cap</div>
            </div>
          </div>
        </section>

        {/* Teams grid */}
        <section id="teams" className="mb-12 scroll-mt-20">
          <div className="flex items-center justify-between mb-5 flex-col sm:flex-row gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All 10 IPL 2026 Teams</h2>
              <p className="text-sm text-gray-500 mt-1">Sorted by IPL titles won (most successful first)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamsByTitles.map((t) => (
              <Link
                key={t.slug}
                href={`/sports/ipl-2026/teams/${t.slug}`}
                className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all hover:-translate-y-0.5"
              >
                <div className={`bg-gradient-to-r ${t.colorGradient} text-white p-4 flex items-center justify-between`}>
                  <div>
                    <div className="text-2xl font-extrabold">{t.code}</div>
                    <div className="text-sm opacity-90">{t.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold">{t.titles}</div>
                    <div className="text-xs uppercase opacity-90">title{t.titles !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{t.tagline}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">📍 {t.city}</span>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition">View team →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* IPL Tools */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">IPL Calculators</h2>
          <p className="text-sm text-gray-600 mb-5">
            Purpose-built tools for IPL fans, fantasy players, and ticket buyers. All free, instant, and India-aware.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {IPL_TOOLS.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="block p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition text-center group"
              >
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 leading-tight">
                  {t.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent History */}
        <section id="history" className="mb-12 scroll-mt-20">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Recent IPL Champions</h2>
              <p className="text-sm text-gray-500 mt-1">Last 5 seasons — click any year for full season details</p>
            </div>
          </div>
          <div className="space-y-3">
            {recentSeasons.map((s) => {
              const champion = IPL_TEAMS.find((t) => t.slug === s.champion);
              return (
                <Link
                  key={s.year}
                  href={`/sports/ipl-history/${s.year}`}
                  className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-200 transition"
                >
                  <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${champion?.colorGradient || "from-gray-400 to-gray-600"} text-white flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-xs font-semibold opacity-90">IPL</div>
                      <div className="text-lg font-extrabold leading-none">{s.year}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 group-hover:text-indigo-700">
                      {champion?.name || s.champion} — Champions
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.notes}</div>
                  </div>
                  <div className="shrink-0 hidden sm:block text-xs text-gray-400 text-right">
                    <div>🏏 {s.orangeCap.player}</div>
                    <div>🎳 {s.purpleCap.player}</div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Link href="#all-history" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900">
              View all 18 seasons (2008–2025) ↓
            </Link>
          </div>
        </section>

        {/* Records preview */}
        <section id="records" className="mb-12 scroll-mt-20">
          <div className="flex items-center justify-between mb-5 flex-col sm:flex-row gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All-Time IPL Records</h2>
              <p className="text-sm text-gray-500 mt-1">8 record categories — click any to see top 5</p>
            </div>
            <Link href="/sports/ipl-records" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900">
              View all records →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {IPL_RECORDS.slice(0, 4).map((r) => (
              <Link
                key={r.slug}
                href={`/sports/ipl-records/${r.slug}`}
                className="block p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition group"
              >
                <div className="text-xs font-semibold uppercase text-gray-400 mb-1">{r.category}</div>
                <h3 className="font-bold text-gray-800 group-hover:text-indigo-700 leading-tight mb-2">{r.title}</h3>
                <div className="text-xs text-gray-500">
                  #1: <strong className="text-gray-700">{r.entries[0].player}</strong> — {r.entries[0].value}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Full history table — for SEO long-tail (year-by-year) */}
        <section id="all-history" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">All 18 IPL Seasons (2008–2025)</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left p-3 font-bold">Year</th>
                    <th className="text-left p-3 font-bold">Champion</th>
                    <th className="text-left p-3 font-bold hidden sm:table-cell">Runner-up</th>
                    <th className="text-left p-3 font-bold hidden md:table-cell">Orange Cap</th>
                    <th className="text-left p-3 font-bold hidden md:table-cell">Purple Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {[...IPL_HISTORY].sort((a, b) => b.year - a.year).map((s) => {
                    const champ = IPL_TEAMS.find((t) => t.slug === s.champion);
                    const runner = IPL_TEAMS.find((t) => t.slug === s.runnerUp);
                    return (
                      <tr key={s.year} className="border-t border-gray-100 hover:bg-indigo-50/30">
                        <td className="p-3">
                          <Link href={`/sports/ipl-history/${s.year}`} className="font-bold text-indigo-700 hover:underline">
                            {s.year}
                          </Link>
                        </td>
                        <td className="p-3 font-semibold text-gray-900">{champ?.name || s.champion}</td>
                        <td className="p-3 text-gray-600 hidden sm:table-cell">{runner?.name || s.runnerUp}</td>
                        <td className="p-3 text-xs text-gray-600 hidden md:table-cell">{s.orangeCap.player} ({s.orangeCap.runs})</td>
                        <td className="p-3 text-xs text-gray-600 hidden md:table-cell">{s.purpleCap.player} ({s.purpleCap.wickets})</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SEO content */}
        <section className="prose prose-gray max-w-none">
          <h2>About IPL 2026</h2>
          <p>
            The <strong>Indian Premier League 2026</strong> (IPL 2026) is the
            <strong> 19th season</strong> of India&apos;s flagship Twenty20
            franchise tournament. Run by the Board of Control for Cricket in
            India (BCCI), the league sees <strong>10 franchise teams</strong>
            compete across <strong>74 matches</strong> from late March to
            early June each year. The 2026 salary cap stands at
            <strong> ₹120 crore per franchise</strong>, with squads of
            18–25 players including a maximum of 8 overseas players.
          </p>

          <h3>How the IPL Works</h3>
          <p>
            Each team plays every other team twice in the league phase
            (home + away), totaling 70 round-robin matches. The top 4 teams
            qualify for playoffs: Qualifier 1 (1st vs 2nd), Eliminator
            (3rd vs 4th), Qualifier 2 (Q1 loser vs Eliminator winner), and
            the Final. Net Run Rate (NRR) breaks ties on equal points.
            Use our{" "}
            <Link href="/tools/ipl-nrr-calculator">IPL NRR Calculator</Link>{" "}
            to model your team&apos;s NRR scenario for the playoffs.
          </p>

          <h3>Most Successful Franchises</h3>
          <p>
            Mumbai Indians and Chennai Super Kings are joint-most
            successful with <strong>5 titles each</strong>. Together
            they&apos;ve won <strong>10 of 18</strong> IPLs — a remarkable
            duopoly. Kolkata Knight Riders are next with 3 titles. Royal
            Challengers Bengaluru, who waited 18 years for their maiden
            trophy, finally won IPL 2025 to break a long-standing drought.
          </p>

          <h3>Live Scores &amp; Tools</h3>
          <p>
            For live IPL match scores and other cricket leagues, see our{" "}
            <Link href="/sports">Sports Live Scores Hub</Link>. To compute
            fantasy points, required run rates, ticket prices including
            BookMyShow fees, or franchise auction budgets — all our IPL
            calculators are free, accurate, and 100% India-focused.
          </p>
        </section>
      </div>
    </>
  );
}
