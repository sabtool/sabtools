"use client";
import { useEffect, useState, useCallback } from "react";

/**
 * LiveCricketScores — fetches the current matches list from CricAPI
 * (https://cricapi.com/) free tier. ~100k requests/hour quota.
 *
 * Architecture choices:
 *
 *  1. API key via NEXT_PUBLIC_CRICKET_API_KEY env var. CricAPI's free tier
 *     allows direct browser calls (CORS-friendly), so no proxy needed for
 *     v1. If quota becomes an issue we can add a Cloudflare Worker proxy
 *     (5-min cache) without changing this component.
 *
 *  2. Graceful fallback: if no API key is configured at build time, render
 *     a "configure API key" panel with sign-up instructions. The page
 *     still ranks for SEO without the live widget.
 *
 *  3. Auto-refresh: every 60 seconds while tab is visible. Pauses when
 *     tab is hidden (saves quota when nobody's looking).
 *
 *  4. No PII collected. No user-specific calls. Pure read of public match
 *     data.
 */

const CRICAPI_KEY = process.env.NEXT_PUBLIC_CRICKET_API_KEY || "";
const ENDPOINT = "https://api.cricapi.com/v1/currentMatches";
const REFRESH_MS = 60_000;

interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo?: {
    name: string;
    shortname: string;
    img: string;
  }[];
  score?: {
    r: number;
    w: number;
    o: number;
    inning: string;
  }[];
  matchStarted: boolean;
  matchEnded: boolean;
}

export default function LiveCricketScores() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!CRICAPI_KEY) {
      setError("no-key");
      setLoading(false);
      return;
    }
    try {
      const url = `${ENDPOINT}?apikey=${encodeURIComponent(
        CRICAPI_KEY
      )}&offset=0`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (data.status !== "success") {
        throw new Error(data.reason || "API returned non-success status");
      }
      setMatches((data.data || []) as Match[]);
      setLastUpdated(new Date());
      setError("");
    } catch (e) {
      console.error("Cricket scores fetch failed:", e);
      setError("fetch-failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    let interval: number | null = null;
    const startInterval = () => {
      if (interval !== null) return;
      interval = window.setInterval(fetchMatches, REFRESH_MS);
    };
    const stopInterval = () => {
      if (interval !== null) {
        window.clearInterval(interval);
        interval = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) stopInterval();
      else {
        fetchMatches(); // refresh immediately on tab focus
        startInterval();
      }
    };
    if (!document.hidden) startInterval();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchMatches]);

  // === No API key configured ===
  if (error === "no-key") {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🔧</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">
              Live cricket scores will appear here
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Live data is powered by{" "}
              <a
                href="https://cricapi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold underline"
              >
                CricAPI
              </a>
              &apos;s free tier (100,000 requests/hour). To enable live
              scores on this site, sign up for a free API key at{" "}
              <a
                href="https://cricapi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold underline"
              >
                cricapi.com
              </a>{" "}
              and set the environment variable:
            </p>
            <code className="block bg-gray-900 text-green-400 text-xs p-3 rounded-lg overflow-x-auto mb-3">
              NEXT_PUBLIC_CRICKET_API_KEY=your-key-here
            </code>
            <p className="text-xs text-gray-600">
              Add it in Vercel → Project Settings → Environment Variables,
              then redeploy. Until then, this page shows IPL teams, league
              schedules and links to official live-scores pages below.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === Fetch error ===
  if (error === "fetch-failed") {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
        <p className="text-sm text-rose-800">
          Couldn&apos;t reach the cricket score API right now. Trying again
          in 60 seconds…
        </p>
        <a
          href="https://www.cricbuzz.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 font-semibold underline mt-2 inline-block"
        >
          Or check Cricbuzz directly ↗
        </a>
      </div>
    );
  }

  // === Loading first time ===
  if (loading && !matches.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
        <svg
          className="animate-spin mx-auto mb-3"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="3" opacity="0.25" />
          <path
            d="M22 12a10 10 0 0 0-10-10"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm text-gray-600">Loading live cricket scores…</p>
      </div>
    );
  }

  // === Empty (no current matches) ===
  if (!matches.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <p className="text-gray-600">
          No cricket matches in progress right now. Check back when IPL or
          internationals are scheduled.
        </p>
      </div>
    );
  }

  // === Render matches ===
  const liveMatches = matches.filter((m) => m.matchStarted && !m.matchEnded);
  const upcomingMatches = matches.filter((m) => !m.matchStarted);
  const recentMatches = matches.filter((m) => m.matchEnded);

  return (
    <div className="space-y-4">
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-red-600 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live · {liveMatches.length} match
              {liveMatches.length !== 1 ? "es" : ""} in progress
            </h3>
            {lastUpdated && (
              <span className="text-[10px] text-gray-500">
                Updated{" "}
                {lastUpdated.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveMatches.map((m) => (
              <MatchCard key={m.id} m={m} live />
            ))}
          </div>
        </div>
      )}

      {upcomingMatches.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-3">
            Upcoming · {upcomingMatches.length} match
            {upcomingMatches.length !== 1 ? "es" : ""}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingMatches.slice(0, 6).map((m) => (
              <MatchCard key={m.id} m={m} live={false} />
            ))}
          </div>
        </div>
      )}

      {recentMatches.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700 mb-3">
            Recent results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentMatches.slice(0, 4).map((m) => (
              <MatchCard key={m.id} m={m} live={false} />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center pt-2">
        Live data via{" "}
        <a
          href="https://cricapi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          CricAPI
        </a>{" "}
        · auto-refreshes every 60 seconds while this tab is visible
      </p>
    </div>
  );
}

function MatchCard({ m, live }: { m: Match; live: boolean }) {
  const team1Score = m.score?.find(
    (s) => s.inning?.toLowerCase().includes(m.teams[0]?.toLowerCase().slice(0, 6) || "")
  );
  const team2Score = m.score?.find(
    (s) => s.inning?.toLowerCase().includes(m.teams[1]?.toLowerCase().slice(0, 6) || "")
  );

  return (
    <div
      className={`rounded-xl border shadow-sm overflow-hidden ${
        live ? "border-red-200 bg-white" : "border-gray-100 bg-white"
      }`}
    >
      <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex justify-between items-center">
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
          {m.matchType?.toUpperCase() || "Cricket"}
        </span>
        {live && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            LIVE
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-bold text-gray-900 mb-2 line-clamp-1">
          {m.name}
        </div>
        <div className="space-y-1.5 mb-2">
          {m.teams[0] && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-800">{m.teams[0]}</span>
              {team1Score ? (
                <span className="font-bold text-gray-900">
                  {team1Score.r}/{team1Score.w} ({team1Score.o} ov)
                </span>
              ) : (
                <span className="text-xs text-gray-400">yet to bat</span>
              )}
            </div>
          )}
          {m.teams[1] && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-800">{m.teams[1]}</span>
              {team2Score ? (
                <span className="font-bold text-gray-900">
                  {team2Score.r}/{team2Score.w} ({team2Score.o} ov)
                </span>
              ) : (
                <span className="text-xs text-gray-400">yet to bat</span>
              )}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-600 line-clamp-1">{m.status}</div>
        {m.venue && (
          <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">
            📍 {m.venue}
          </div>
        )}
      </div>
    </div>
  );
}
