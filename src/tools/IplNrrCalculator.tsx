"use client";
import { useMemo, useState } from "react";

/**
 * IPL Net Run Rate (NRR) Calculator
 *
 * NRR formula (BCCI / ICC standard):
 *
 *   NRR = (Total runs scored / Total overs batted)
 *       − (Total runs conceded / Total overs bowled)
 *
 * Special rules:
 *
 *   1. ALL OUT: if a team is bowled out before its full quota, the
 *      DENOMINATOR is the FULL allotted overs (e.g. 20 in T20), not the
 *      overs actually faced. This penalises being bowled out cheaply.
 *
 *   2. RAIN-CURTAILED MATCHES: if overs were officially reduced (DLS or
 *      otherwise), use the REDUCED overs as the denominator, not 20.
 *      Practically: enter the official allotted overs for that match.
 *
 *   3. The same rule applies to bowling — if the BOWLING side dismisses
 *      the opposition early, the DENOMINATOR is still capped at the
 *      OPPOSITION's full allotted overs (the bowlers benefit from the
 *      early dismissal).
 *
 * For league-table purposes the season-long NRR aggregates ALL matches
 * (sum of runs / sum of overs), not the average of per-match NRRs.
 *
 * Supports up to 10 matches per side, which covers an IPL group stage.
 * Each match: own runs/overs (with all-out flag), opposition runs/overs
 * (with all-out flag), match's allotted overs (default 20).
 */

interface Match {
  // Own innings
  ownRuns: number;
  ownOversBatted: number;        // actual overs faced; ignored if allOut
  ownAllOut: boolean;
  // Opposition innings
  oppRuns: number;
  oppOversBatted: number;        // actual overs opp faced; ignored if oppAllOut
  oppAllOut: boolean;
  // Match-allotted overs (T20 = 20, may be reduced for rain)
  allottedOvers: number;
}

const blankMatch = (): Match => ({
  ownRuns: 0,
  ownOversBatted: 20,
  ownAllOut: false,
  oppRuns: 0,
  oppOversBatted: 20,
  oppAllOut: false,
  allottedOvers: 20,
});

// Convert cricket-overs-as-decimal to numeric overs for the formula:
//   12.4 (12 overs + 4 balls) → 12 + 4/6 = 12.6666...
// User input is the same convention as RRR calculator.
function oversNumeric(o: number): number {
  if (!isFinite(o) || o < 0) return 0;
  const full = Math.floor(o);
  const balls = Math.round((o - full) * 10);
  return full + Math.min(balls, 5) / 6;
}

export default function IplNrrCalculator() {
  // Default: 1 match shown, with 4-5 typical season values pre-filled
  const [matches, setMatches] = useState<Match[]>([
    {
      ownRuns: 178,
      ownOversBatted: 20,
      ownAllOut: false,
      oppRuns: 162,
      oppOversBatted: 20,
      oppAllOut: false,
      allottedOvers: 20,
    },
  ]);

  const updateMatch = (i: number, patch: Partial<Match>) => {
    setMatches((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  };

  const addMatch = () => {
    if (matches.length >= 10) return;
    setMatches((prev) => [...prev, blankMatch()]);
  };

  const removeMatch = (i: number) => {
    setMatches((prev) => prev.filter((_, idx) => idx !== i));
  };

  const result = useMemo(() => {
    let totalOwnRuns = 0;
    let totalOwnOvers = 0;
    let totalOppRuns = 0;
    let totalOppOvers = 0;

    matches.forEach((m) => {
      totalOwnRuns += m.ownRuns;
      // If own team all-out, denominator = full allotted overs (penalty)
      const ownDenominator = m.ownAllOut ? m.allottedOvers : oversNumeric(m.ownOversBatted);
      totalOwnOvers += ownDenominator;

      totalOppRuns += m.oppRuns;
      // If we bowled them out, denominator = their full allotted overs
      const oppDenominator = m.oppAllOut ? m.allottedOvers : oversNumeric(m.oppOversBatted);
      totalOppOvers += oppDenominator;
    });

    if (totalOwnOvers === 0 || totalOppOvers === 0) return null;

    const ownRR = totalOwnRuns / totalOwnOvers;
    const oppRR = totalOppRuns / totalOppOvers;
    const nrr = ownRR - oppRR;

    return {
      totalOwnRuns,
      totalOwnOvers,
      totalOppRuns,
      totalOppOvers,
      ownRR,
      oppRR,
      nrr,
      verdict:
        nrr >= 0.5 ? "Excellent NRR — strong playoff position" :
        nrr >= 0 ? "Positive NRR — above-average season" :
        nrr >= -0.5 ? "Negative NRR — needs improvement" :
        "Poor NRR — likely below playoff line",
    };
  }, [matches]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-900">
        Add each match your team played. For matches where YOUR team was bowled out (all wickets fell), check the &quot;All out&quot; box. For matches where your bowlers dismissed the opposition, check &quot;Opposition all out&quot;. NRR penalises being all-out by counting the full allotted overs in the denominator.
      </div>

      {matches.map((m, i) => (
        <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Match {i + 1}</h3>
            {matches.length > 1 && (
              <button onClick={() => removeMatch(i)} className="text-xs text-rose-600 hover:text-rose-800 font-semibold">
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Own team */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <h4 className="text-sm font-bold text-emerald-900 mb-2">🏏 Your team batted</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Runs scored</label>
                  <input type="number" min="0" value={m.ownRuns} onChange={(e) => updateMatch(i, { ownRuns: +e.target.value || 0 })} className="calc-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Overs faced</label>
                  <input type="number" min="0" max="50" step="0.1" value={m.ownOversBatted} onChange={(e) => updateMatch(i, { ownOversBatted: +e.target.value || 0 })} className="calc-input" disabled={m.ownAllOut} />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input type="checkbox" checked={m.ownAllOut} onChange={(e) => updateMatch(i, { ownAllOut: e.target.checked })} className="w-4 h-4" />
                <span className="text-gray-700">All out (full overs counted)</span>
              </label>
            </div>

            {/* Opposition */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
              <h4 className="text-sm font-bold text-rose-900 mb-2">🎳 Opposition batted</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Runs scored</label>
                  <input type="number" min="0" value={m.oppRuns} onChange={(e) => updateMatch(i, { oppRuns: +e.target.value || 0 })} className="calc-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Overs faced</label>
                  <input type="number" min="0" max="50" step="0.1" value={m.oppOversBatted} onChange={(e) => updateMatch(i, { oppOversBatted: +e.target.value || 0 })} className="calc-input" disabled={m.oppAllOut} />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input type="checkbox" checked={m.oppAllOut} onChange={(e) => updateMatch(i, { oppAllOut: e.target.checked })} className="w-4 h-4" />
                <span className="text-gray-700">All out (full overs counted)</span>
              </label>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Match allotted overs (default 20 for T20)</label>
            <input type="number" min="1" max="50" value={m.allottedOvers} onChange={(e) => updateMatch(i, { allottedOvers: +e.target.value || 20 })} className="calc-input max-w-32" />
            <p className="text-[10px] text-gray-500 mt-1">Use lower value for rain-curtailed matches (e.g. 13 for a 13-over chase)</p>
          </div>
        </div>
      ))}

      <button onClick={addMatch} disabled={matches.length >= 10} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        + Add another match {matches.length >= 10 && "(max 10)"}
      </button>

      {result && (
        <div className="result-card bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest">
              Net Run Rate (across {matches.length} match{matches.length !== 1 ? "es" : ""})
            </div>
            <div className={`text-6xl font-extrabold mt-2 ${result.nrr >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {result.nrr >= 0 ? "+" : ""}{result.nrr.toFixed(3)}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">{result.verdict}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cyan-200">
            <div className="bg-white border border-emerald-200 rounded-xl p-3 text-center">
              <div className="text-xs text-emerald-700 font-semibold uppercase">Your scoring rate</div>
              <div className="text-xl font-bold text-emerald-700">{result.ownRR.toFixed(3)}</div>
              <div className="text-[10px] text-gray-500 mt-1">{result.totalOwnRuns} runs / {result.totalOwnOvers.toFixed(2)} overs</div>
            </div>
            <div className="bg-white border border-rose-200 rounded-xl p-3 text-center">
              <div className="text-xs text-rose-700 font-semibold uppercase">Opposition rate</div>
              <div className="text-xl font-bold text-rose-700">{result.oppRR.toFixed(3)}</div>
              <div className="text-[10px] text-gray-500 mt-1">{result.totalOppRuns} runs / {result.totalOppOvers.toFixed(2)} overs</div>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 leading-relaxed">
        <strong>NRR formula:</strong> (your scoring rate) − (opposition scoring rate). When a side is bowled out, the FULL allotted overs count in the denominator (penalising early dismissal). For rain-affected matches, use the OFFICIAL allotted overs (e.g. 13 for a DLS-revised chase) as the &quot;allotted overs&quot; field. Source: BCCI / ICC standard NRR rules.
      </div>
    </div>
  );
}
