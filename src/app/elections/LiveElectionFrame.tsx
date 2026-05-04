"use client";
import { useState } from "react";

/**
 * Embeds the official Election Commission of India live-results page in
 * an iframe — but only during configured election windows. Outside those
 * windows, shows a "next election" countdown card.
 *
 * Why a config-driven window:
 *  - ECI's results.eci.gov.in only has live data during counting (a 1-3
 *    day window after polling ends, every few months at most).
 *  - Outside that window, the ECI iframe shows a generic placeholder or
 *    last-completed election — not useful for "live results" framing.
 *  - Hard-coded windows let us be honest about when there's actual live
 *    data without scraping or polling.
 *
 * To add a new election window: append to ELECTION_WINDOWS below with the
 * counting-day URL slug from results.eci.gov.in (the URL format is stable:
 * https://results.eci.gov.in/<ResultAcGen{Mon}{YYYY}|ResultAcBye{...}>/).
 */

interface ElectionWindow {
  /** Human-readable election name */
  name: string;
  /** ISO date (counting day) */
  countingDate: string;
  /** Days the iframe stays "live" after counting day */
  liveDays: number;
  /** Slug under results.eci.gov.in/ — e.g. "ResultAcGenMay2026" */
  eciSlug: string;
}

const ELECTION_WINDOWS: ElectionWindow[] = [
  // 2026 state assembly cycle — example windows; update as ECI confirms
  // counting dates closer to each election.
  {
    name: "Assam, Kerala, Puducherry, Tamil Nadu, West Bengal Assembly Elections",
    countingDate: "2026-05-02",
    liveDays: 4,
    eciSlug: "ResultAcGenMay2026",
  },
];

function activeWindow(): ElectionWindow | null {
  const now = new Date();
  for (const w of ELECTION_WINDOWS) {
    const start = new Date(w.countingDate + "T05:00:00+05:30"); // 5:30 AM IST
    const end = new Date(start.getTime() + w.liveDays * 24 * 60 * 60 * 1000);
    if (now >= start && now <= end) return w;
  }
  return null;
}

function nextElection(): ElectionWindow | null {
  const now = new Date();
  const upcoming = ELECTION_WINDOWS.map((w) => ({
    w,
    start: new Date(w.countingDate + "T05:00:00+05:30"),
  })).filter(({ start }) => start > now);
  if (!upcoming.length) return null;
  upcoming.sort((a, b) => a.start.getTime() - b.start.getTime());
  return upcoming[0].w;
}

export default function LiveElectionFrame() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const live = activeWindow();
  const next = nextElection();

  if (live) {
    const eciUrl = `https://results.eci.gov.in/${live.eciSlug}/index.htm`;
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-3 flex-col sm:flex-row gap-2 sm:gap-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2 border border-red-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE NOW · COUNTING IN PROGRESS
            </div>
            <h2 className="text-xl font-bold text-gray-900">{live.name}</h2>
          </div>
          <a
            href={eciUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Open on ECI ↗
          </a>
        </div>
        <div className="relative w-full bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-lg" style={{ height: "780px" }}>
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <svg className="animate-spin mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="3" opacity="0.25" />
                  <path d="M22 12a10 10 0 0 0-10-10" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-gray-600">Loading live results from ECI…</p>
              </div>
            </div>
          )}
          <iframe
            src={eciUrl}
            title="Election Commission of India — Live Results"
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Live data loaded directly from{" "}
          <a
            href={eciUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            results.eci.gov.in
          </a>
          . SabTools.in does not modify or store this data.
        </p>
      </section>
    );
  }

  if (next) {
    const start = new Date(next.countingDate + "T05:00:00+05:30");
    const daysAway = Math.ceil(
      (start.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );
    return (
      <section className="mb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-2 border-indigo-100 rounded-2xl p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-3 border border-indigo-200">
          📅 NEXT COUNTING DAY
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{next.name}</h2>
        <p className="text-gray-600 mb-3">
          Counting starts on{" "}
          <strong>
            {start.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </strong>{" "}
          ({daysAway} day{daysAway !== 1 ? "s" : ""} from now). Live results
          will appear here automatically when counting begins.
        </p>
        <a
          href="https://results.eci.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        >
          Visit ECI Results Portal ↗
        </a>
      </section>
    );
  }

  // No active or upcoming windows
  return (
    <section className="mb-12 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
      <p className="text-gray-600">
        No election counting in progress right now. Latest results below.
        For all upcoming election announcements visit the{" "}
        <a
          href="https://www.eci.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 font-semibold hover:underline"
        >
          ECI website ↗
        </a>
        .
      </p>
    </section>
  );
}
