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
import LiveCricketScores from "./LiveCricketScores";

/**
 * /sports — sports hub for sabtools.in.
 *
 * Architecture:
 *   - LiveCricketScores: client component that fetches CricAPI free tier
 *     when NEXT_PUBLIC_CRICKET_API_KEY is set; gracefully shows a "configure
 *     API key" panel otherwise.
 *   - Other sports (football, kabaddi, hockey, NBA, NFL): each section
 *     embeds the relevant ESPN-style live scoreboard via iframe + links
 *     to the official source. No paid API needed.
 *   - Schedule cards (IPL, ISL, PKL) are static data updated periodically.
 *   - Related calculators surface from the existing 343-tool catalog.
 *
 * SEO target keywords:
 *   - live cricket score india / IPL live score
 *   - football live score / ISL live score
 *   - kabaddi live score / PKL live score
 *   - sports scores live india
 *   - all sports live score
 */

export const metadata: Metadata = {
  title: "Live Sports Scores — Cricket, IPL, Football, Kabaddi, Hockey | SabTools.in",
  description:
    "Live sports scores from around the world — IPL cricket, ISL football, Pro Kabaddi, Hockey India League, NBA, NFL, English Premier League and more. Real-time updates, schedules, and standings.",
  keywords: [
    "live sports scores",
    "live cricket score",
    "ipl live score 2026",
    "ipl 2026 live",
    "isl live score",
    "pro kabaddi live score",
    "hockey live score",
    "premier league live",
    "nba live score",
    "nfl live score",
    "sports live india",
    "all sports score",
    "cricket football kabaddi live",
  ],
  alternates: { canonical: `${SITE_URL}/sports` },
  openGraph: {
    title: "Live Sports Scores — All Sports, All Leagues | SabTools.in",
    description:
      "Real-time scores for cricket (IPL), football (ISL/EPL/UCL), kabaddi (PKL), hockey, NBA, NFL — all in one place. India-focused.",
    url: `${SITE_URL}/sports`,
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Live Sports Scores — SabTools.in",
      },
    ],
  },
};

// === Static schedule data (refresh manually or via auto-blog cron) ===

const IPL_2026_TEAMS = [
  { code: "MI", name: "Mumbai Indians", color: "from-blue-500 to-blue-700", titles: 5 },
  { code: "CSK", name: "Chennai Super Kings", color: "from-yellow-400 to-yellow-600", titles: 5 },
  { code: "KKR", name: "Kolkata Knight Riders", color: "from-purple-500 to-purple-700", titles: 3 },
  { code: "GT", name: "Gujarat Titans", color: "from-slate-700 to-slate-900", titles: 1 },
  { code: "RCB", name: "Royal Challengers Bengaluru", color: "from-red-600 to-red-800", titles: 1 },
  { code: "RR", name: "Rajasthan Royals", color: "from-pink-500 to-pink-700", titles: 1 },
  { code: "SRH", name: "Sunrisers Hyderabad", color: "from-orange-500 to-orange-700", titles: 1 },
  { code: "DC", name: "Delhi Capitals", color: "from-blue-600 to-red-600", titles: 0 },
  { code: "PBKS", name: "Punjab Kings", color: "from-red-500 to-red-700", titles: 0 },
  { code: "LSG", name: "Lucknow Super Giants", color: "from-cyan-500 to-blue-600", titles: 0 },
];

const SPORTS_LEAGUES = [
  {
    sport: "Football",
    icon: "⚽",
    leagues: [
      { name: "Indian Super League (ISL)", source: "https://www.indiansuperleague.com/", live: true },
      { name: "English Premier League", source: "https://www.premierleague.com/", live: true },
      { name: "UEFA Champions League", source: "https://www.uefa.com/uefachampionsleague/", live: true },
      { name: "FIFA World Cup", source: "https://www.fifa.com/", live: false },
      { name: "La Liga", source: "https://www.laliga.com/", live: true },
      { name: "Bundesliga", source: "https://www.bundesliga.com/", live: true },
    ],
  },
  {
    sport: "Kabaddi",
    icon: "🤼",
    leagues: [
      { name: "Pro Kabaddi League (PKL)", source: "https://www.prokabaddi.com/", live: true },
      { name: "Asian Kabaddi Championship", source: "https://kabaddi-asia.com/", live: false },
    ],
  },
  {
    sport: "Hockey",
    icon: "🏑",
    leagues: [
      { name: "Hockey India League", source: "https://www.hockeyindia.org/", live: true },
      { name: "FIH Pro League", source: "https://www.fih.hockey/", live: true },
      { name: "Olympics Hockey", source: "https://olympics.com/", live: false },
    ],
  },
  {
    sport: "Basketball",
    icon: "🏀",
    leagues: [
      { name: "NBA", source: "https://www.nba.com/", live: true },
      { name: "EuroLeague", source: "https://www.euroleaguebasketball.net/", live: true },
      { name: "FIBA World Cup", source: "https://www.fiba.basketball/", live: false },
    ],
  },
  {
    sport: "American Football",
    icon: "🏈",
    leagues: [
      { name: "NFL", source: "https://www.nfl.com/", live: true },
      { name: "Super Bowl", source: "https://www.nfl.com/super-bowl/", live: false },
    ],
  },
  {
    sport: "Tennis",
    icon: "🎾",
    leagues: [
      { name: "ATP Tour", source: "https://www.atptour.com/", live: true },
      { name: "WTA Tour", source: "https://www.wtatennis.com/", live: true },
      { name: "Australian / French / US Open / Wimbledon", source: "https://www.atptour.com/", live: false },
    ],
  },
  {
    sport: "Formula 1",
    icon: "🏎️",
    leagues: [
      { name: "F1 World Championship", source: "https://www.formula1.com/", live: true },
    ],
  },
  {
    sport: "Olympics & Athletics",
    icon: "🏅",
    leagues: [
      { name: "Olympic Games (Summer/Winter)", source: "https://olympics.com/", live: false },
      { name: "Diamond League", source: "https://www.diamondleague.com/", live: true },
    ],
  },
];

// IPL & cricket calculator tools — these are the calculator slugs that
// actually exist in our catalog (registered in src/lib/tools.ts and
// dynamically imported in src/tools/index.tsx). Kept in sync with the
// IPL Phase 1 build — six tool moat covering the highest-intent IPL
// calculator queries.
const SPORTS_TOOLS = [
  { slug: "ipl-fantasy-points-calculator", name: "IPL Fantasy Points", icon: "🏏" },
  { slug: "ipl-required-run-rate-calculator", name: "Required Run Rate", icon: "🎯" },
  { slug: "ipl-nrr-calculator", name: "Net Run Rate (NRR)", icon: "📊" },
  { slug: "ipl-win-probability-calculator", name: "Win Probability", icon: "🎲" },
  { slug: "ipl-ticket-price-calculator", name: "IPL Ticket Price", icon: "🎟️" },
  { slug: "ipl-auction-salary-cap-calculator", name: "Auction Salary Cap", icon: "💰" },
];

export default function SportsPage() {
  const pageUrl = `${SITE_URL}/sports`;
  const graph = buildGraph([
    webPageNode({
      url: pageUrl,
      name: "Live Sports Scores — Cricket, IPL, Football, Kabaddi, Hockey",
      description: metadata.description as string,
      inLanguage: ["en-IN"],
      breadcrumbId: `${pageUrl}#breadcrumb`,
      dateModified: BUILD_DATE,
    }),
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Sports" },
      ],
      `${pageUrl}#breadcrumb`
    ),
    {
      "@type": "SportsEvent",
      "@id": `${pageUrl}#ipl2026`,
      name: "Indian Premier League 2026",
      description:
        "IPL 2026 — 19th season of the Indian Premier League. 10 franchise teams play 74 matches across India.",
      sport: "Cricket",
      location: { "@type": "Country", name: "India" },
      organizer: { "@id": ORG_ID },
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Sports" }]} />

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Sports Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Live Sports Scores — All Sports, All Leagues
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Cricket, IPL, football, kabaddi, hockey, basketball, F1 — all
            major leagues from India and around the world, in one place.
          </p>
        </div>

        {/* === LIVE CRICKET (free CricAPI) === */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏏</span> Live Cricket Scores
          </h2>
          <LiveCricketScores />
        </section>

        {/* === IPL 2026 Teams === */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-2 sm:gap-0">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🏆</span> IPL 2026 — Franchise Teams
            </h2>
            <a
              href="https://www.iplt20.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Official IPL Site ↗
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {IPL_2026_TEAMS.map((t) => (
              <div
                key={t.code}
                className="rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div
                  className={`bg-gradient-to-br ${t.color} text-white p-4 text-center`}
                >
                  <div className="text-2xl font-extrabold">{t.code}</div>
                  <div className="text-xs opacity-90 mt-0.5">
                    {t.titles} title{t.titles !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="bg-white p-2 text-center">
                  <div className="text-xs font-semibold text-gray-700 leading-tight">
                    {t.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === Other Sports — Source Cards === */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Other Sports — Live Sources
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            For sports beyond cricket, we link directly to each league&apos;s
            official live-scores page (the most reliable, ad-free source).
            Bookmark this page and tap any league to open its live scoreboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SPORTS_LEAGUES.map((s) => (
              <div
                key={s.sport}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-100 flex items-center gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900">{s.sport}</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {s.leagues.map((l) => (
                    <li key={l.name}>
                      <a
                        href={l.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 text-sm hover:bg-indigo-50 transition group"
                      >
                        <div className="flex items-center gap-2">
                          {l.live && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                              </span>
                              Live
                            </span>
                          )}
                          <span className="font-medium text-gray-700 group-hover:text-indigo-600">
                            {l.name}
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* === Sports Tools === */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sports Calculators & Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SPORTS_TOOLS.map((t) => (
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

        {/* === SEO Content === */}
        <section className="prose prose-gray max-w-none">
          <h2>India&apos;s Most-Loved Live Sports — All in One Place</h2>
          <p>
            India is a multi-sport nation. Cricket dominates, but football
            (Indian Super League), kabaddi (Pro Kabaddi League), hockey
            (Hockey India League and FIH Pro League), and global leagues
            like the NBA, NFL, English Premier League, UEFA Champions
            League and Formula 1 all have huge Indian fan bases.
            SabTools.in&apos;s sports hub aggregates official live-score
            sources for every major sport — so you don&apos;t have to
            bookmark twenty different sites.
          </p>

          <h3>Live Cricket Scores</h3>
          <p>
            Our live cricket scoreboard above pulls from{" "}
            <strong>CricAPI</strong>, a free public cricket data source that
            covers IPL, internationals (Tests, ODIs, T20Is), domestic Indian
            cricket (Ranji Trophy, Vijay Hazare), and major overseas leagues
            (Big Bash, The Hundred, PSL, CPL). Refresh every minute to see
            ball-by-ball updates during live matches.
          </p>

          <h3>How Live Scores Work Here</h3>
          <p>
            For cricket, we fetch JSON directly from a free public API and
            render the latest scores client-side — no tracking, no
            third-party widgets, no ad-bloat. For other sports we link to
            each league&apos;s own official live-scores page because (a)
            those pages are the most authoritative source and (b) most
            other-sport APIs are paid. As we grow, we&apos;ll add native
            scoreboards for ISL, PKL and EPL.
          </p>

          <h3>Disclaimer</h3>
          <p className="text-sm text-gray-500">
            SabTools.in is not affiliated with the BCCI, IPL, FIFA, ICC,
            ISL, PKL, NBA, NFL, or any sports body, league, team or
            broadcaster. All trademarks, team names, logos and league names
            are the property of their respective owners. Live data shown is
            sourced from public APIs and official league websites; we do
            not modify, validate or re-publish that data.
          </p>
        </section>
      </div>
    </>
  );
}
