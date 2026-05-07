import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import {
  SITE_URL,
  ORG_ID,
  webPageNode,
  breadcrumbNode,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";
import {
  IPL_HISTORY,
  IPL_TEAMS,
  getSeasonByYear,
  getTeamBySlug,
} from "@/lib/ipl-data";

/**
 * /sports/ipl-history/[year]/
 *
 * Generates one indexable page per IPL season (18 pages, 2008-2025). Each
 * page targets year-specific long-tail searches:
 *   - "IPL 2025 winner", "IPL 2008 final", "IPL 2016 orange cap"
 *   - "Who won IPL [year]?", "[year] IPL final venue"
 *   - "[year] purple cap winner"
 *
 * Each page links UP to the IPL hub and SIDEWAYS to the champion's team
 * page, plus prev/next year navigation for crawl-depth optimization.
 */

export function generateStaticParams() {
  return IPL_HISTORY.map((s) => ({ year: s.year.toString() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const season = getSeasonByYear(parseInt(year, 10));
  if (!season) return {};

  const champion = getTeamBySlug(season.champion);
  const championName = champion?.name || season.champion;

  return {
    title: `IPL ${season.year} — ${championName} Won, ${season.orangeCap.player} Orange Cap, Final at ${season.finalVenue.split(",")[0]} | SabTools.in`,
    description: `IPL ${season.year} (Season ${season.number}) — ${championName} beat ${getTeamBySlug(season.runnerUp)?.name || season.runnerUp} in the final at ${season.finalVenue} on ${season.finalDate}. ${season.orangeCap.player} won the Orange Cap with ${season.orangeCap.runs} runs. ${season.purpleCap.player} won the Purple Cap with ${season.purpleCap.wickets} wickets.`,
    keywords: [
      `ipl ${season.year}`,
      `ipl ${season.year} winner`,
      `ipl ${season.year} final`,
      `ipl ${season.year} orange cap`,
      `ipl ${season.year} purple cap`,
      `ipl season ${season.number}`,
      `who won ipl ${season.year}`,
      `${championName.toLowerCase()} ipl ${season.year}`,
      `${season.orangeCap.player.toLowerCase()} ${season.year}`,
      `ipl ${season.year} player of tournament`,
    ],
    alternates: { canonical: `${SITE_URL}/sports/ipl-history/${year}` },
    openGraph: {
      title: `IPL ${season.year} — ${championName} Champions`,
      description: `Season ${season.number}. Final at ${season.finalVenue}. ${season.orangeCap.player} (${season.orangeCap.runs} runs) won Orange Cap.`,
      url: `${SITE_URL}/sports/ipl-history/${year}`,
      type: "website",
      locale: "en_IN",
      siteName: "SabTools.in",
    },
  };
}

export default async function IplHistoryPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const season = getSeasonByYear(parseInt(year, 10));
  if (!season) notFound();

  const pageUrl = `${SITE_URL}/sports/ipl-history/${year}`;
  const champion = getTeamBySlug(season.champion);
  const runnerUp = getTeamBySlug(season.runnerUp);
  const championName = champion?.name || season.champion;
  const runnerUpName = runnerUp?.name || season.runnerUp;

  // Prev/next navigation
  const sortedYears = IPL_HISTORY.map((s) => s.year).sort((a, b) => a - b);
  const idx = sortedYears.indexOf(season.year);
  const prevYear = idx > 0 ? sortedYears[idx - 1] : null;
  const nextYear = idx < sortedYears.length - 1 ? sortedYears[idx + 1] : null;

  const graph = buildGraph([
    webPageNode({
      url: pageUrl,
      name: `IPL ${season.year} — ${championName} Champions`,
      description: `Season ${season.number}. Champion: ${championName}. Final venue: ${season.finalVenue}.`,
      inLanguage: ["en-IN"],
      breadcrumbId: `${pageUrl}#breadcrumb`,
      dateModified: BUILD_DATE,
    }),
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Sports", url: `${SITE_URL}/sports` },
        { name: "IPL 2026", url: `${SITE_URL}/sports/ipl-2026` },
        { name: `IPL ${season.year}` },
      ],
      `${pageUrl}#breadcrumb`
    ),
    {
      "@type": "SportsEvent",
      "@id": `${pageUrl}#event`,
      name: `Indian Premier League ${season.year}`,
      description: `${season.number}th season of the Indian Premier League. ${season.totalMatches} matches across ${season.teams} teams.`,
      sport: "Cricket",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Country", name: "India" },
      organizer: { "@id": ORG_ID },
      endDate: season.finalDate,
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sports", href: "/sports" },
            { label: "IPL 2026", href: "/sports/ipl-2026" },
            { label: `IPL ${season.year}` },
          ]}
        />

        {/* Hero — uses champion's gradient */}
        <div className={`mb-8 bg-gradient-to-br ${champion?.colorGradient || "from-indigo-500 to-purple-600"} text-white rounded-3xl p-6 sm:p-10 shadow-xl`}>
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
            IPL Season {season.number}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight">
            IPL {season.year}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="text-2xl sm:text-3xl font-bold">🏆 {championName}</div>
            <span className="text-white/70">defeated</span>
            <div className="text-lg sm:text-xl text-white/90 font-semibold">{runnerUpName}</div>
          </div>
          <p className="text-sm sm:text-base text-white/90 max-w-3xl leading-relaxed">{season.notes}</p>
        </div>

        {/* Key facts */}
        <section className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-semibold uppercase text-gray-500">Champion</div>
              {champion ? (
                <Link href={`/sports/ipl-2026/teams/${champion.slug}`} className="block mt-1 font-bold text-indigo-700 hover:underline">
                  {championName}
                </Link>
              ) : (
                <div className="mt-1 font-bold text-gray-700">{championName}</div>
              )}
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-semibold uppercase text-gray-500">Runner-up</div>
              {runnerUp ? (
                <Link href={`/sports/ipl-2026/teams/${runnerUp.slug}`} className="block mt-1 font-bold text-indigo-700 hover:underline">
                  {runnerUpName}
                </Link>
              ) : (
                <div className="mt-1 font-bold text-gray-700">{runnerUpName}</div>
              )}
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-semibold uppercase text-gray-500">Final Date</div>
              <div className="mt-1 font-bold text-gray-900">{new Date(season.finalDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-semibold uppercase text-gray-500">Player of the Tournament</div>
              <div className="mt-1 font-bold text-gray-900">{season.potT}</div>
            </div>
          </div>
        </section>

        {/* Final venue */}
        <section className="mb-10 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Final venue</div>
          <h2 className="text-xl font-bold text-gray-900">📍 {season.finalVenue}</h2>
        </section>

        {/* Orange + Purple cap cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl">🍊</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wide text-orange-700">Orange Cap (Most Runs)</div>
                  <div className="text-lg font-extrabold text-gray-900 mt-0.5">{season.orangeCap.player}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{season.orangeCap.team} · <strong className="text-orange-700">{season.orangeCap.runs} runs</strong></div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl">🎩</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wide text-purple-700">Purple Cap (Most Wickets)</div>
                  <div className="text-lg font-extrabold text-gray-900 mt-0.5">{season.purpleCap.player}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{season.purpleCap.team} · <strong className="text-purple-700">{season.purpleCap.wickets} wickets</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Season facts row */}
        <section className="mb-10 bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h2 className="text-base font-bold text-blue-900 mb-2">Season {season.number} Quick Facts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div><span className="text-blue-700 font-semibold">Teams:</span> {season.teams}</div>
            <div><span className="text-blue-700 font-semibold">Matches:</span> {season.totalMatches}</div>
            <div><span className="text-blue-700 font-semibold">Champion:</span> {championName}</div>
            <div><span className="text-blue-700 font-semibold">Runner-up:</span> {runnerUpName}</div>
          </div>
        </section>

        {/* Prev / Next nav */}
        <section className="mb-10 grid grid-cols-2 gap-3">
          {prevYear ? (
            <Link
              href={`/sports/ipl-history/${prevYear}`}
              className="block p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-200 transition group"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase">← Previous Season</div>
              <div className="font-bold text-gray-900 group-hover:text-indigo-700 mt-1">IPL {prevYear}</div>
            </Link>
          ) : <div />}
          {nextYear ? (
            <Link
              href={`/sports/ipl-history/${nextYear}`}
              className="block p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-200 transition group text-right"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase">Next Season →</div>
              <div className="font-bold text-gray-900 group-hover:text-indigo-700 mt-1">IPL {nextYear}</div>
            </Link>
          ) : <div />}
        </section>

        {/* SEO content */}
        <section className="prose prose-gray max-w-none">
          <h2>About IPL {season.year}</h2>
          <p>
            The {season.year} Indian Premier League was the{" "}
            <strong>{season.number}{getOrdinalSuffix(season.number)} season</strong>{" "}
            of the IPL. <strong>{championName}</strong> won the title by
            defeating <strong>{runnerUpName}</strong> in the final at{" "}
            <strong>{season.finalVenue}</strong> on{" "}
            {new Date(season.finalDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
          </p>
          <p>{season.notes}</p>

          <h3>Top Performers</h3>
          <ul>
            <li>
              <strong>Player of the Tournament:</strong> {season.potT}
            </li>
            <li>
              <strong>Orange Cap (most runs):</strong>{" "}
              {season.orangeCap.player} from {season.orangeCap.team} —{" "}
              {season.orangeCap.runs} runs
            </li>
            <li>
              <strong>Purple Cap (most wickets):</strong>{" "}
              {season.purpleCap.player} from {season.purpleCap.team} —{" "}
              {season.purpleCap.wickets} wickets
            </li>
          </ul>

          <h3>Internal Links</h3>
          <ul>
            <li>Back to <Link href="/sports/ipl-2026">IPL 2026 Hub</Link></li>
            {champion && <li>See <Link href={`/sports/ipl-2026/teams/${champion.slug}`}>{championName} team page</Link></li>}
            {runnerUp && <li>See <Link href={`/sports/ipl-2026/teams/${runnerUp.slug}`}>{runnerUpName} team page</Link></li>}
            <li>Browse <Link href="/sports/ipl-records">all-time IPL records</Link></li>
            <li>Calculate <Link href="/tools/ipl-fantasy-points-calculator">fantasy points</Link>, <Link href="/tools/ipl-nrr-calculator">NRR</Link>, or <Link href="/tools/ipl-win-probability-calculator">match win probability</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}

function getOrdinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}
