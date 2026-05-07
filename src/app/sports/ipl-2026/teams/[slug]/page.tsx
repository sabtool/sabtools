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
  IPL_TEAMS,
  getTeamBySlug,
  teamTitleSeasons,
  IPL_HISTORY,
} from "@/lib/ipl-data";

/**
 * /sports/ipl-2026/teams/[slug]/
 *
 * Generates one indexable page per IPL franchise (10 pages total). Each
 * page is unique-content rich with:
 *   - Team identity (city, venue, owner, coach, captain)
 *   - Title count + title-winning seasons (deep-linked to history pages)
 *   - Notable players (E-E-A-T, internal narrative)
 *   - Recent finishes (5-season trend with bar chart)
 *   - Internal links: history pages, calculators, sports hub
 *
 * SEO target keywords (one set per team — multiplied by 10 teams):
 *   - "mumbai indians ipl titles", "csk all winners", "rcb 2025 squad"
 *   - "[team] captain", "[team] owner", "[team] head coach"
 *   - "[team] vs [other team] head to head" (Phase 2 extension)
 */

export function generateStaticParams() {
  return IPL_TEAMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};

  const titleStr =
    team.titles > 0
      ? `${team.titles}-time IPL champion${team.titles !== 1 ? "s" : ""}`
      : "yet to win an IPL title";

  return {
    title: `${team.name} (${team.code}) — IPL 2026 Squad, Captain, Coach, ${team.titles} Titles | SabTools.in`,
    description: `${team.name} — ${team.tagline} ${team.titles > 0 ? `IPL champions in ${team.titleYears.join(", ")}.` : ""} Current captain ${team.captain}, head coach ${team.coach}, home venue ${team.homeVenue}, ${titleStr}.`,
    keywords: [
      team.name.toLowerCase(),
      team.code.toLowerCase(),
      `${team.name.toLowerCase()} ipl 2026`,
      `${team.name.toLowerCase()} squad`,
      `${team.name.toLowerCase()} captain`,
      `${team.name.toLowerCase()} owner`,
      `${team.name.toLowerCase()} titles`,
      `${team.name.toLowerCase()} all-time`,
      `${team.code.toLowerCase()} 2026`,
      `${team.code.toLowerCase()} captain`,
      `${team.city.toLowerCase()} ipl team`,
    ],
    alternates: { canonical: `${SITE_URL}/sports/ipl-2026/teams/${slug}` },
    openGraph: {
      title: `${team.name} — IPL 2026 Hub`,
      description: team.tagline,
      url: `${SITE_URL}/sports/ipl-2026/teams/${slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "SabTools.in",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: `${team.name} IPL Hub` }],
    },
  };
}

export default async function IplTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const pageUrl = `${SITE_URL}/sports/ipl-2026/teams/${slug}`;
  const titleSeasons = teamTitleSeasons(team.slug);
  const otherTeams = IPL_TEAMS.filter((t) => t.slug !== team.slug);

  // Compute aggregate finishes (most common position) for narrative
  const playoffsCount = team.recentFinishes.filter((f) => f.position <= 4).length;
  const winsLast5 = team.recentFinishes.filter((f) => f.position === 1).length;

  const graph = buildGraph([
    webPageNode({
      url: pageUrl,
      name: `${team.name} — IPL 2026 Hub`,
      description: team.tagline,
      inLanguage: ["en-IN"],
      breadcrumbId: `${pageUrl}#breadcrumb`,
      dateModified: BUILD_DATE,
    }),
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Sports", url: `${SITE_URL}/sports` },
        { name: "IPL 2026", url: `${SITE_URL}/sports/ipl-2026` },
        { name: team.name },
      ],
      `${pageUrl}#breadcrumb`
    ),
    {
      "@type": "SportsTeam",
      "@id": `${pageUrl}#team`,
      name: team.name,
      alternateName: team.code,
      sport: "Cricket",
      location: { "@type": "City", name: team.city },
      foundingDate: `${team.founded}-01-01`,
      coach: { "@type": "Person", name: team.coach },
      memberOf: {
        "@type": "SportsOrganization",
        name: "Indian Premier League",
      },
      url: pageUrl,
      logo: `${SITE_URL}/og-image.png`,
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sports", href: "/sports" },
            { label: "IPL 2026", href: "/sports/ipl-2026" },
            { label: team.name },
          ]}
        />

        {/* Hero — gradient with team colors */}
        <div className={`mb-10 bg-gradient-to-br ${team.colorGradient} text-white rounded-3xl p-6 sm:p-10 shadow-xl`}>
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase opacity-80 mb-2">
                {team.code} · IPL 2026
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 leading-tight">{team.name}</h1>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">{team.tagline}</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur rounded-2xl px-6 py-4 border border-white/20">
              <div className="text-5xl font-extrabold leading-none">{team.titles}</div>
              <div className="text-xs uppercase tracking-wide opacity-90 mt-1">IPL Title{team.titles !== 1 ? "s" : ""}</div>
              {team.titles > 0 && (
                <div className="text-[10px] opacity-75 mt-1">{team.titleYears.join(" · ")}</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick facts grid */}
        <section className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Home City", value: team.city },
              { label: "Home Venue", value: team.homeVenue, small: true },
              { label: "Founded", value: team.founded.toString() },
              { label: "Owner", value: team.owner.split("(")[0].trim(), small: true },
              { label: "Captain (2026)", value: team.captain },
              { label: "Head Coach", value: team.coach },
              { label: "Last 5 Seasons", value: `${winsLast5}× champion · ${playoffsCount}× playoff` },
              { label: "All-time Titles", value: team.titles > 0 ? team.titleYears.join(", ") : "None yet" },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{f.label}</div>
                <div className={`mt-1 font-bold text-gray-900 ${f.small ? "text-sm" : "text-base"}`}>{f.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Notable players */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Notable Players in {team.name} History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {team.notablePlayers.map((p, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{p.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent finishes with bar */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Last 5 Seasons</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <div className="space-y-3">
              {team.recentFinishes.map((f) => {
                // Position 1 = best, 10 = worst. Bar shows inverse.
                const widthPct = ((11 - f.position) / 10) * 100;
                const verdict =
                  f.position === 1 ? { text: "🏆 Champion", color: "from-amber-400 to-yellow-500", txtColor: "text-amber-700" } :
                  f.position === 2 ? { text: "🥈 Runner-up", color: "from-slate-400 to-slate-500", txtColor: "text-slate-700" } :
                  f.position <= 4 ? { text: "Playoffs", color: "from-emerald-400 to-emerald-500", txtColor: "text-emerald-700" } :
                                    { text: `League #${f.position}`, color: "from-gray-300 to-gray-400", txtColor: "text-gray-600" };
                return (
                  <div key={f.year}>
                    <div className="flex justify-between items-center mb-1">
                      <Link href={`/sports/ipl-history/${f.year}`} className="font-bold text-gray-900 hover:text-indigo-700">
                        IPL {f.year}
                      </Link>
                      <span className={`text-xs font-bold ${verdict.txtColor}`}>{verdict.text}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${verdict.color} transition-all`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Title-winning seasons */}
        {titleSeasons.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              {team.name} IPL Title-Winning Seasons
            </h2>
            <div className="space-y-3">
              {titleSeasons.map((s) => (
                <Link
                  key={s.year}
                  href={`/sports/ipl-history/${s.year}`}
                  className="group block p-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🏆</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-amber-900">
                        IPL {s.year} — Beat{" "}
                        {IPL_TEAMS.find((t) => t.slug === s.runnerUp)?.name || s.runnerUp}
                      </h3>
                      <p className="text-sm text-amber-800 mt-1 leading-relaxed line-clamp-2">{s.notes}</p>
                      <div className="text-xs text-amber-600 mt-2 font-semibold">View full season →</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other teams */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Other IPL 2026 Teams</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {otherTeams.map((t) => (
              <Link
                key={t.slug}
                href={`/sports/ipl-2026/teams/${t.slug}`}
                className="block p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition text-center"
              >
                <div className={`text-xs font-bold ${t.titles > 0 ? "text-gray-900" : "text-gray-700"}`}>
                  {t.code} · {t.titles} title{t.titles !== 1 ? "s" : ""}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{t.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Calculators inline */}
        <section className="mb-10 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Calculators for {team.name} fans</h2>
          <p className="text-sm text-gray-600 mb-4">
            Track your fantasy team, predict chase outcomes, and model auction strategy.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Link href="/tools/ipl-fantasy-points-calculator" className="p-3 bg-white rounded-xl text-sm font-semibold text-center hover:shadow-sm transition">
              🏏 Fantasy Points
            </Link>
            <Link href="/tools/ipl-nrr-calculator" className="p-3 bg-white rounded-xl text-sm font-semibold text-center hover:shadow-sm transition">
              📊 NRR Calculator
            </Link>
            <Link href="/tools/ipl-win-probability-calculator" className="p-3 bg-white rounded-xl text-sm font-semibold text-center hover:shadow-sm transition">
              🎲 Win Probability
            </Link>
          </div>
        </section>

        {/* SEO content */}
        <section className="prose prose-gray max-w-none">
          <h2>About {team.name}</h2>
          <p>
            {team.name} ({team.code}) is one of the ten franchise teams
            competing in the Indian Premier League 2026. Based in {team.city}{" "}
            and owned by {team.owner}, the team plays its home matches at{" "}
            {team.homeVenue}. Founded in {team.founded},{" "}
            {team.titles > 0
              ? `${team.name} has won the IPL ${team.titles} time${team.titles > 1 ? "s" : ""} (${team.titleYears.join(", ")})`
              : `${team.name} is yet to win the IPL title, despite reaching the playoffs multiple times`}
            . The 2026 season is led by captain {team.captain} under head
            coach {team.coach}.
          </p>

          <h3>Recent Form</h3>
          <p>
            Across the last 5 seasons, {team.name} have won the IPL{" "}
            <strong>{winsLast5} time{winsLast5 !== 1 ? "s" : ""}</strong> and
            qualified for the playoffs <strong>{playoffsCount} time{playoffsCount !== 1 ? "s" : ""}</strong>. {team.titles > 0 ? `Their most recent title came in IPL ${team.titleYears[team.titleYears.length - 1]}.` : "The team has reached the playoffs but is still chasing a maiden championship."}
          </p>

          <h3>Internal Links</h3>
          <ul>
            <li>Back to <Link href="/sports/ipl-2026">IPL 2026 Hub</Link></li>
            <li>See <Link href="/sports/ipl-records">all-time IPL records</Link></li>
            <li>Calculate fantasy points with our <Link href="/tools/ipl-fantasy-points-calculator">IPL Fantasy Points Calculator</Link></li>
            <li>Model NRR for the league table with our <Link href="/tools/ipl-nrr-calculator">IPL NRR Calculator</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
