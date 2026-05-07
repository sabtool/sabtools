"use client";
import { useMemo, useState } from "react";

/**
 * IPL Fantasy Points Calculator — computes Dream11-style fantasy points
 * for a player's match performance across batting, bowling, fielding,
 * and bonus categories.
 *
 * Scoring rules (Dream11 T20 — current as of 2026 IPL season):
 *
 *   Batting:
 *     +1   per run
 *     +1   per boundary (4)
 *     +2   per six (6)
 *     +4   30-run milestone
 *     +8   half-century (50)
 *     +16  century (100)
 *     -2   duck (batsmen, WK, allrounders only — not bowlers)
 *
 *   Strike rate (min 10 balls faced):
 *     +6   SR > 170
 *     +4   SR 150.01–170
 *     +2   SR 130–150
 *     -2   SR 60–70
 *     -4   SR 50–59.99
 *     -6   SR < 50
 *
 *   Bowling:
 *     +25  per wicket
 *     +8   LBW / Bowled bonus per dismissal
 *     +4   3-wicket haul
 *     +8   4-wicket haul
 *     +16  5-wicket haul
 *     +12  per maiden over
 *
 *   Economy (min 2 overs):
 *     +6   Econ < 5
 *     +4   Econ 5–5.99
 *     +2   Econ 6–7
 *     -2   Econ 10–11
 *     -4   Econ 11.01–12
 *     -6   Econ > 12
 *
 *   Fielding:
 *     +8   per catch
 *     +4   3-catch bonus
 *     +12  stumping (WK)
 *     +6   direct-hit run-out
 *     +6   run-out (thrower) +6 to catcher = +12 split as +6/+6 here
 *
 *   Other:
 *     +4   in starting XI (auto)
 *     ×2   captain (C)
 *     ×1.5 vice-captain (VC)
 *
 * Source: Dream11's published T20 scoring system (publicly documented at
 * dream11.com/scoring). Other fantasy platforms (MyTeam11, MPL Fantasy,
 * FanCode) use near-identical rules — this calculator is broadly accurate
 * across all major Indian cricket fantasy platforms.
 */

type Role = "batter" | "bowler" | "allrounder" | "wicketkeeper";
type Captaincy = "none" | "C" | "VC";

interface Result {
  battingPoints: number;
  bowlingPoints: number;
  fieldingPoints: number;
  bonusPoints: number;
  subtotal: number;
  multiplier: number;
  totalPoints: number;
  breakdown: { label: string; value: number }[];
}

export default function IplFantasyPointsCalculator() {
  const [role, setRole] = useState<Role>("batter");
  const [captaincy, setCaptaincy] = useState<Captaincy>("none");

  // Batting inputs
  const [runs, setRuns] = useState<number>(40);
  const [balls, setBalls] = useState<number>(28);
  const [fours, setFours] = useState<number>(4);
  const [sixes, setSixes] = useState<number>(2);
  const [out, setOut] = useState<boolean>(true);

  // Bowling inputs
  const [overs, setOvers] = useState<number>(0);
  const [maidens, setMaidens] = useState<number>(0);
  const [wickets, setWickets] = useState<number>(0);
  const [bowlingRunsConceded, setBowlingRunsConceded] = useState<number>(0);
  const [lbwBowled, setLbwBowled] = useState<number>(0);

  // Fielding inputs
  const [catches, setCatches] = useState<number>(0);
  const [stumpings, setStumpings] = useState<number>(0);
  const [directRunOuts, setDirectRunOuts] = useState<number>(0);

  const result: Result = useMemo(() => {
    const breakdown: { label: string; value: number }[] = [];

    // === Batting ===
    let battingPoints = 0;
    if (balls > 0 || runs > 0) {
      battingPoints += runs;
      breakdown.push({ label: `Runs (${runs} × 1)`, value: runs });
      battingPoints += fours;
      if (fours > 0) breakdown.push({ label: `Fours (${fours} × 1)`, value: fours });
      battingPoints += sixes * 2;
      if (sixes > 0) breakdown.push({ label: `Sixes (${sixes} × 2)`, value: sixes * 2 });

      // Milestones
      if (runs >= 100) {
        battingPoints += 16;
        breakdown.push({ label: "Century bonus (100+)", value: 16 });
      } else if (runs >= 50) {
        battingPoints += 8;
        breakdown.push({ label: "Half-century bonus (50+)", value: 8 });
      } else if (runs >= 30) {
        battingPoints += 4;
        breakdown.push({ label: "30-run milestone", value: 4 });
      }

      // Duck
      if (out && runs === 0 && role !== "bowler") {
        battingPoints -= 2;
        breakdown.push({ label: "Duck penalty", value: -2 });
      }

      // Strike rate (min 10 balls)
      if (balls >= 10) {
        const sr = (runs / balls) * 100;
        let srBonus = 0;
        let srLabel = "";
        if (sr > 170) {
          srBonus = 6;
          srLabel = `SR ${sr.toFixed(1)} (>170)`;
        } else if (sr > 150) {
          srBonus = 4;
          srLabel = `SR ${sr.toFixed(1)} (150-170)`;
        } else if (sr >= 130) {
          srBonus = 2;
          srLabel = `SR ${sr.toFixed(1)} (130-150)`;
        } else if (sr >= 60 && sr < 70) {
          srBonus = -2;
          srLabel = `SR ${sr.toFixed(1)} (60-70)`;
        } else if (sr >= 50 && sr < 60) {
          srBonus = -4;
          srLabel = `SR ${sr.toFixed(1)} (50-60)`;
        } else if (sr < 50) {
          srBonus = -6;
          srLabel = `SR ${sr.toFixed(1)} (<50)`;
        }
        if (srBonus !== 0) {
          battingPoints += srBonus;
          breakdown.push({ label: srLabel, value: srBonus });
        }
      }
    }

    // === Bowling ===
    let bowlingPoints = 0;
    if (overs > 0 || wickets > 0) {
      bowlingPoints += wickets * 25;
      if (wickets > 0) breakdown.push({ label: `Wickets (${wickets} × 25)`, value: wickets * 25 });
      bowlingPoints += lbwBowled * 8;
      if (lbwBowled > 0) breakdown.push({ label: `LBW/Bowled bonus (${lbwBowled} × 8)`, value: lbwBowled * 8 });
      if (wickets >= 5) {
        bowlingPoints += 16;
        breakdown.push({ label: "5-wicket haul bonus", value: 16 });
      } else if (wickets >= 4) {
        bowlingPoints += 8;
        breakdown.push({ label: "4-wicket haul bonus", value: 8 });
      } else if (wickets >= 3) {
        bowlingPoints += 4;
        breakdown.push({ label: "3-wicket haul bonus", value: 4 });
      }
      bowlingPoints += maidens * 12;
      if (maidens > 0) breakdown.push({ label: `Maiden overs (${maidens} × 12)`, value: maidens * 12 });

      // Economy (min 2 overs)
      if (overs >= 2) {
        const econ = bowlingRunsConceded / overs;
        let econBonus = 0;
        let econLabel = "";
        if (econ < 5) {
          econBonus = 6;
          econLabel = `Econ ${econ.toFixed(2)} (<5)`;
        } else if (econ < 6) {
          econBonus = 4;
          econLabel = `Econ ${econ.toFixed(2)} (5-6)`;
        } else if (econ <= 7) {
          econBonus = 2;
          econLabel = `Econ ${econ.toFixed(2)} (6-7)`;
        } else if (econ >= 10 && econ <= 11) {
          econBonus = -2;
          econLabel = `Econ ${econ.toFixed(2)} (10-11)`;
        } else if (econ > 11 && econ <= 12) {
          econBonus = -4;
          econLabel = `Econ ${econ.toFixed(2)} (11-12)`;
        } else if (econ > 12) {
          econBonus = -6;
          econLabel = `Econ ${econ.toFixed(2)} (>12)`;
        }
        if (econBonus !== 0) {
          bowlingPoints += econBonus;
          breakdown.push({ label: econLabel, value: econBonus });
        }
      }
    }

    // === Fielding ===
    let fieldingPoints = 0;
    fieldingPoints += catches * 8;
    if (catches > 0) breakdown.push({ label: `Catches (${catches} × 8)`, value: catches * 8 });
    if (catches >= 3) {
      fieldingPoints += 4;
      breakdown.push({ label: "3-catch bonus", value: 4 });
    }
    fieldingPoints += stumpings * 12;
    if (stumpings > 0) breakdown.push({ label: `Stumpings (${stumpings} × 12)`, value: stumpings * 12 });
    fieldingPoints += directRunOuts * 12;
    if (directRunOuts > 0) breakdown.push({ label: `Direct run-outs (${directRunOuts} × 12)`, value: directRunOuts * 12 });

    // === Bonus ===
    const startingXI = 4;
    const bonusPoints = startingXI;
    breakdown.push({ label: "Playing XI bonus", value: 4 });

    const subtotal = battingPoints + bowlingPoints + fieldingPoints + bonusPoints;
    const multiplier = captaincy === "C" ? 2 : captaincy === "VC" ? 1.5 : 1;
    const totalPoints = subtotal * multiplier;

    return {
      battingPoints,
      bowlingPoints,
      fieldingPoints,
      bonusPoints,
      subtotal,
      multiplier,
      totalPoints,
      breakdown,
    };
  }, [role, captaincy, runs, balls, fours, sixes, out, overs, maidens, wickets, bowlingRunsConceded, lbwBowled, catches, stumpings, directRunOuts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Player Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="calc-input">
            <option value="batter">Batter</option>
            <option value="bowler">Bowler</option>
            <option value="allrounder">All-rounder</option>
            <option value="wicketkeeper">Wicket-keeper</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Captain / Vice-Captain</label>
          <select value={captaincy} onChange={(e) => setCaptaincy(e.target.value as Captaincy)} className="calc-input">
            <option value="none">Regular player (×1)</option>
            <option value="VC">Vice-Captain (×1.5)</option>
            <option value="C">Captain (×2)</option>
          </select>
        </div>
      </div>

      {/* Batting */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">🏏 Batting</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Runs</label>
            <input type="number" min="0" value={runs} onChange={(e) => setRuns(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Balls faced</label>
            <input type="number" min="0" value={balls} onChange={(e) => setBalls(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Fours</label>
            <input type="number" min="0" value={fours} onChange={(e) => setFours(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Sixes</label>
            <input type="number" min="0" value={sixes} onChange={(e) => setSixes(+e.target.value || 0)} className="calc-input" />
          </div>
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm">
          <input type="checkbox" checked={out} onChange={(e) => setOut(e.target.checked)} className="w-4 h-4" />
          <span className="text-gray-700">Player got out (was dismissed)</span>
        </label>
      </div>

      {/* Bowling */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">🎳 Bowling</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Overs bowled</label>
            <input type="number" min="0" step="0.1" value={overs} onChange={(e) => setOvers(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Maiden overs</label>
            <input type="number" min="0" value={maidens} onChange={(e) => setMaidens(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Wickets</label>
            <input type="number" min="0" value={wickets} onChange={(e) => setWickets(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Runs conceded</label>
            <input type="number" min="0" value={bowlingRunsConceded} onChange={(e) => setBowlingRunsConceded(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">LBW / Bowled (out of wickets)</label>
            <input type="number" min="0" max={wickets} value={lbwBowled} onChange={(e) => setLbwBowled(+e.target.value || 0)} className="calc-input" />
          </div>
        </div>
      </div>

      {/* Fielding */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
        <h3 className="font-bold text-sky-900 mb-3 flex items-center gap-2">🥏 Fielding</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Catches</label>
            <input type="number" min="0" value={catches} onChange={(e) => setCatches(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Stumpings (WK)</label>
            <input type="number" min="0" value={stumpings} onChange={(e) => setStumpings(+e.target.value || 0)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Direct hit run-outs</label>
            <input type="number" min="0" value={directRunOuts} onChange={(e) => setDirectRunOuts(+e.target.value || 0)} className="calc-input" />
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="result-card bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50 border-2 border-violet-300 rounded-2xl p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-white rounded-xl border border-violet-100">
            <div className="text-xs text-gray-500 font-semibold uppercase">Batting</div>
            <div className="text-2xl font-extrabold text-amber-600">{result.battingPoints}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-violet-100">
            <div className="text-xs text-gray-500 font-semibold uppercase">Bowling</div>
            <div className="text-2xl font-extrabold text-emerald-600">{result.bowlingPoints}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-violet-100">
            <div className="text-xs text-gray-500 font-semibold uppercase">Fielding</div>
            <div className="text-2xl font-extrabold text-sky-600">{result.fieldingPoints}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-violet-100">
            <div className="text-xs text-gray-500 font-semibold uppercase">Bonus</div>
            <div className="text-2xl font-extrabold text-gray-700">{result.bonusPoints}</div>
          </div>
        </div>
        <div className="text-center pt-3 border-t-2 border-violet-200">
          <div className="text-sm font-medium text-gray-600">
            Subtotal {result.subtotal}
            {result.multiplier !== 1 && (
              <span className="ml-2 text-violet-700 font-bold">
                × {result.multiplier} ({captaincy === "C" ? "Captain" : "Vice-Captain"})
              </span>
            )}
          </div>
          <div className="text-5xl sm:text-6xl font-extrabold text-violet-700 mt-2">
            {result.totalPoints.toFixed(1)}
          </div>
          <div className="text-sm font-semibold text-violet-600 uppercase tracking-wide mt-1">
            Total Fantasy Points
          </div>
        </div>

        {/* Breakdown */}
        {result.breakdown.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-violet-700 hover:text-violet-900">
              View detailed breakdown
            </summary>
            <div className="mt-2 bg-white rounded-lg p-3 border border-violet-100">
              <ul className="text-sm space-y-1">
                {result.breakdown.map((b, i) => (
                  <li key={i} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="text-gray-700">{b.label}</span>
                    <span className={`font-bold ${b.value < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      {b.value > 0 ? "+" : ""}{b.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>

      <div className="text-xs text-gray-500 leading-relaxed">
        Scoring follows <strong>Dream11&apos;s public T20 system</strong> (current as of IPL 2026 season). MyTeam11, MPL Fantasy and FanCode use near-identical rules — this calculator is broadly accurate across major fantasy platforms. Captain × 2, Vice-Captain × 1.5. Strike-rate bonuses require 10+ balls faced. Economy bonuses require 2+ overs bowled.
      </div>
    </div>
  );
}
