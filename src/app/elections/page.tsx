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
import LiveElectionFrame from "./LiveElectionFrame";

/**
 * /elections — India election hub.
 *
 * Strategy:
 *  - During election windows (controlled by ELECTION_WINDOW config below),
 *    embed the official ECI live results portal as an iframe.
 *  - Always show: Lok Sabha 2024 results summary, recent state polls,
 *    upcoming election schedule, related calculators, ECI source links.
 *  - All data is curated/static — no scraping (ECI has no public JSON
 *    API and HTML scraping is brittle + CORS-blocked from browsers).
 *
 * SEO target keywords:
 *   - india election results 2026
 *   - lok sabha 2024 results
 *   - state election results india
 *   - election commission of india live
 *   - bihar / west bengal / kerala election results 2026
 */

export const metadata: Metadata = {
  title: "India Election Results 2026 — Live Counting, Lok Sabha 2024, State Polls | SabTools.in",
  description:
    "Live India election results from the Election Commission of India. Lok Sabha 2024 final results, state assembly elections 2026, by-poll trends, party-wise vote share, constituency winners. All ECI data in one place.",
  keywords: [
    "india election results 2026",
    "live election results india",
    "lok sabha results 2024",
    "state election results 2026",
    "eci results live",
    "election commission of india",
    "bihar election results",
    "west bengal election results",
    "kerala election results",
    "tamil nadu election results",
    "by-election results india",
    "constituency wise results",
  ],
  alternates: { canonical: `${SITE_URL}/elections` },
  openGraph: {
    title: "India Election Results — Live Counting & Historical Data | SabTools.in",
    description:
      "Live India election results, Lok Sabha 2024 winners, state assembly polls, by-elections — all from the Election Commission of India.",
    url: `${SITE_URL}/elections`,
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "India Election Results — SabTools.in",
      },
    ],
  },
};

// === Curated data — Lok Sabha 2024 (final, source: eci.gov.in) ===
const LOKSABHA_2024 = {
  title: "Lok Sabha General Election 2024",
  totalSeats: 543,
  totalVotersMillion: 968,
  voterTurnoutPct: 65.79,
  pollDate: "April 19 – June 1, 2024 (7 phases)",
  resultDate: "June 4, 2024",
  source: "https://results.eci.gov.in/",
  alliances: [
    {
      name: "NDA (BJP-led)",
      seats: 293,
      voteShare: 43.32,
      color: "from-orange-500 to-amber-500",
      majorParties: ["BJP (240)", "TDP (16)", "JD(U) (12)", "Shiv Sena (7)", "LJP-RV (5)"],
    },
    {
      name: "INDIA Alliance (Congress-led)",
      seats: 234,
      voteShare: 41.69,
      color: "from-cyan-500 to-blue-500",
      majorParties: ["INC (99)", "SP (37)", "TMC (29)", "DMK (22)", "Shiv Sena UBT (9)"],
    },
    {
      name: "Others",
      seats: 16,
      voteShare: 14.99,
      color: "from-gray-400 to-gray-500",
      majorParties: ["YSRCP (4)", "AIMIM (1)", "Independents (7)"],
    },
  ],
  topParties: [
    { name: "BJP", seats: 240, voteShare: 36.56 },
    { name: "INC", seats: 99, voteShare: 21.19 },
    { name: "SP", seats: 37, voteShare: 4.58 },
    { name: "TMC", seats: 29, voteShare: 4.37 },
    { name: "DMK", seats: 22, voteShare: 1.83 },
    { name: "TDP", seats: 16, voteShare: 1.96 },
    { name: "JD(U)", seats: 12, voteShare: 0.99 },
    { name: "SHS-UBT", seats: 9, voteShare: 1.34 },
  ],
};

const UPCOMING_ELECTIONS = [
  { state: "Bihar Legislative Assembly", year: 2025, status: "Held — results out", note: "243 seats" },
  { state: "Tamil Nadu Legislative Assembly", year: 2026, status: "Scheduled" , note: "234 seats — May 2026" },
  { state: "West Bengal Legislative Assembly", year: 2026, status: "Scheduled", note: "294 seats — Apr–May 2026" },
  { state: "Kerala Legislative Assembly", year: 2026, status: "Scheduled", note: "140 seats — May 2026" },
  { state: "Puducherry Legislative Assembly", year: 2026, status: "Scheduled", note: "30 seats — May 2026" },
  { state: "Assam Legislative Assembly", year: 2026, status: "Scheduled", note: "126 seats — Apr 2026" },
  { state: "Lok Sabha General Election", year: 2029, status: "Future", note: "543 seats — full general election" },
];

const RELATED_TOOLS = [
  { slug: "age-calculator", name: "Voter Age Eligibility (18+)", icon: "🎂" },
  { slug: "indian-pin-code-directory", name: "PIN Code → Constituency", icon: "📍" },
  { slug: "name-numerology-calculator", name: "Name Lucky Number", icon: "🔢" },
  { slug: "percentage-calculator", name: "Vote Share %", icon: "📊" },
];

export default function ElectionsPage() {
  const pageUrl = `${SITE_URL}/elections`;
  const graph = buildGraph([
    webPageNode({
      url: pageUrl,
      name: "India Election Results — Live Counting & Historical Data",
      description: metadata.description as string,
      inLanguage: ["en-IN"],
      breadcrumbId: `${pageUrl}#breadcrumb`,
      dateModified: BUILD_DATE,
    }),
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Elections" },
      ],
      `${pageUrl}#breadcrumb`
    ),
    {
      "@type": "Dataset",
      "@id": `${pageUrl}#dataset`,
      name: "Lok Sabha 2024 Election Results — India",
      description:
        "Final results of the 2024 Indian General Election (Lok Sabha) — 543 seats, voter turnout 65.79%, NDA 293 / INDIA 234.",
      keywords: ["india election", "lok sabha 2024", "general election", "eci"],
      isAccessibleForFree: true,
      creator: { "@id": ORG_ID },
      datePublished: "2024-06-04",
      url: pageUrl,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Elections" }]}
        />

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold mb-3 border border-orange-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            India Election Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            India Election Results — Live & Historical
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Live counting from the Election Commission of India, Lok Sabha 2024
            final results, state assembly polls, and by-election trends — all in
            one place.
          </p>
        </div>

        {/* Live ECI Frame (only renders during election window) */}
        <LiveElectionFrame />

        {/* Lok Sabha 2024 Summary */}
        <section className="mb-12 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-1">{LOKSABHA_2024.title}</h2>
            <p className="text-indigo-100 text-sm">
              Final results · Polled {LOKSABHA_2024.pollDate} · Counting{" "}
              {LOKSABHA_2024.resultDate}
            </p>
          </div>

          <div className="p-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Total Seats
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {LOKSABHA_2024.totalSeats}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Voters
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {LOKSABHA_2024.totalVotersMillion}M
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Turnout
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {LOKSABHA_2024.voterTurnoutPct}%
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Phases
                </div>
                <div className="text-2xl font-extrabold text-gray-900">7</div>
              </div>
            </div>

            {/* Alliance breakdown */}
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Alliance Breakdown
            </h3>
            <div className="space-y-3 mb-8">
              {LOKSABHA_2024.alliances.map((a) => {
                const widthPct = (a.seats / LOKSABHA_2024.totalSeats) * 100;
                return (
                  <div key={a.name}>
                    <div className="flex justify-between mb-1.5 text-sm">
                      <span className="font-semibold text-gray-700">
                        {a.name}
                      </span>
                      <span className="text-gray-600">
                        {a.seats} seats · {a.voteShare}% vote share
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${a.color}`}
                        style={{ width: `${widthPct}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {a.majorParties.join(" · ")}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Top parties table */}
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Top Parties by Seats
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left p-2 font-semibold">Party</th>
                    <th className="text-right p-2 font-semibold">Seats Won</th>
                    <th className="text-right p-2 font-semibold">Vote Share</th>
                  </tr>
                </thead>
                <tbody>
                  {LOKSABHA_2024.topParties.map((p) => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="p-2 font-medium">{p.name}</td>
                      <td className="text-right p-2 font-bold text-gray-900">
                        {p.seats}
                      </td>
                      <td className="text-right p-2 text-gray-700">
                        {p.voteShare}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Source:{" "}
              <a
                href={LOKSABHA_2024.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Election Commission of India ↗
              </a>
            </p>
          </div>
        </section>

        {/* Upcoming / Recent State Elections */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            State Elections — 2025–2029
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {UPCOMING_ELECTIONS.map((e) => {
              const statusColor =
                e.status === "Scheduled"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : e.status === "Future"
                  ? "bg-gray-50 text-gray-600 border-gray-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200";
              return (
                <div
                  key={e.state}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">
                      {e.state} {e.year}
                    </h3>
                    <p className="text-sm text-gray-500">{e.note}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor}`}
                  >
                    {e.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Related Tools */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Election-Related Calculators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {RELATED_TOOLS.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="block p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition text-center"
              >
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="text-xs font-semibold text-gray-700 leading-tight">
                  {t.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="prose prose-gray max-w-none">
          <h2>About India's Election System</h2>
          <p>
            India holds the world&apos;s largest democratic elections.
            The Lok Sabha (House of the People) has 543 elected members
            chosen via first-past-the-post in single-member constituencies
            every five years. Each State and Union Territory also holds its
            own Legislative Assembly elections on independent schedules.
            All elections are conducted by the Election Commission of India
            (ECI), an autonomous constitutional authority.
          </p>

          <h3>Where Live Election Results Come From</h3>
          <p>
            Live counting trends and final results are published exclusively
            by the ECI at <strong>results.eci.gov.in</strong>. Returning
            Officers at every counting centre upload Round-wise data which
            is reflected on the ECI portal within minutes. SabTools embeds
            the official ECI results page above during active counting
            windows.
          </p>

          <h3>Official Sources</h3>
          <ul>
            <li>
              <a
                href="https://www.eci.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Election Commission of India ↗
              </a>{" "}
              — main ECI portal
            </li>
            <li>
              <a
                href="https://results.eci.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ECI Results Portal ↗
              </a>{" "}
              — live trends & final results
            </li>
            <li>
              <a
                href="https://www.data.gov.in/keywords/Election"
                target="_blank"
                rel="noopener noreferrer"
              >
                data.gov.in Election Datasets ↗
              </a>{" "}
              — historical CSVs / Excel files
            </li>
          </ul>

          <h3>Disclaimer</h3>
          <p className="text-sm text-gray-500">
            SabTools.in is an independent tools and information website. We
            curate and present election data sourced from the Election
            Commission of India and other public datasets. We are not
            affiliated with the ECI, any political party, or any candidate.
            Live data shown above (when available) is loaded directly from
            ECI servers via embed; SabTools does not modify, validate, or
            re-publish that data.
          </p>
        </section>
      </div>
    </>
  );
}
