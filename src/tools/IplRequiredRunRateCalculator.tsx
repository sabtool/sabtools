"use client";
import { useMemo, useState } from "react";

/**
 * IPL Required Run Rate Calculator — for the chasing team in a T20 match.
 *
 * Inputs:
 *   - Target (runs needed to win)
 *   - Current score
 *   - Overs bowled (in cricket overs, e.g. 12.4 means 12 overs and 4 balls)
 *   - Total overs (T20 = 20, ODI = 50, custom for rain-affected matches)
 *
 * Outputs:
 *   - Runs still needed
 *   - Balls remaining
 *   - Required Run Rate (RRR)
 *   - Current Run Rate (CRR)
 *   - Verdict band (Easy / Comfortable / Tough / Very Tough / Impossible)
 *
 * Cricket-overs arithmetic: 12.4 means 12 full overs + 4 balls = 76 balls.
 * NOT 12.4 × 6 = 74.4 balls. We convert via floor(overs)×6 + (overs%1)×10
 * because the .x part is an integer count of balls (.0–.5 are valid).
 */

function oversToBalls(overs: number): number {
  if (!isFinite(overs) || overs < 0) return 0;
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  // Guard against bad input like 12.7 (only 0-5 valid for ball part)
  return fullOvers * 6 + Math.min(balls, 5);
}

function ballsToOvers(balls: number): string {
  const fullOvers = Math.floor(balls / 6);
  const rem = balls % 6;
  return rem === 0 ? `${fullOvers}` : `${fullOvers}.${rem}`;
}

interface Verdict {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

function getVerdict(rrr: number, crr: number, ballsLeft: number): Verdict {
  if (ballsLeft === 0) {
    return { label: "Match over", color: "text-gray-700", bgColor: "bg-gray-100", description: "No balls remaining" };
  }
  if (rrr <= 0) {
    return { label: "Match won", color: "text-emerald-700", bgColor: "bg-emerald-100", description: "Target already chased" };
  }
  if (rrr > 36) {
    return { label: "Impossible", color: "text-red-800", bgColor: "bg-red-100", description: "Cannot score 36+ off remaining balls" };
  }
  if (rrr > 18) {
    return { label: "Very tough", color: "text-rose-700", bgColor: "bg-rose-100", description: "Extreme acceleration needed" };
  }
  if (rrr > 12) {
    return { label: "Tough", color: "text-amber-700", bgColor: "bg-amber-100", description: "High pressure chase" };
  }
  if (rrr > crr + 2) {
    return { label: "Catch up needed", color: "text-blue-700", bgColor: "bg-blue-100", description: "Slightly behind the rate" };
  }
  if (rrr > 6) {
    return { label: "Comfortable", color: "text-cyan-700", bgColor: "bg-cyan-100", description: "On track at par rate" };
  }
  return { label: "Easy", color: "text-emerald-700", bgColor: "bg-emerald-100", description: "Cruising to victory" };
}

export default function IplRequiredRunRateCalculator() {
  const [target, setTarget] = useState<number>(180);
  const [currentScore, setCurrentScore] = useState<number>(75);
  const [oversBowled, setOversBowled] = useState<string>("9.2");
  const [totalOvers, setTotalOvers] = useState<number>(20);

  const result = useMemo(() => {
    const o = parseFloat(oversBowled);
    if (!isFinite(o) || o < 0 || target <= 0 || currentScore < 0 || totalOvers <= 0) {
      return null;
    }

    const ballsBowled = oversToBalls(o);
    const totalBalls = totalOvers * 6;
    const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
    const runsNeeded = Math.max(0, target - currentScore);

    const oversRemaining = ballsRemaining / 6;
    const oversBatted = ballsBowled / 6;

    const rrr = oversRemaining > 0 ? runsNeeded / oversRemaining : 0;
    const crr = oversBatted > 0 ? currentScore / oversBatted : 0;

    const verdict = getVerdict(rrr, crr, ballsRemaining);

    return {
      runsNeeded,
      ballsRemaining,
      ballsBowled,
      oversRemainingDisplay: ballsToOvers(ballsRemaining),
      oversBattedDisplay: ballsToOvers(ballsBowled),
      rrr,
      crr,
      verdict,
      isAlreadyWon: runsNeeded === 0 && ballsRemaining > 0,
    };
  }, [target, currentScore, oversBowled, totalOvers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Target to win</label>
          <input type="number" min="1" value={target} onChange={(e) => setTarget(+e.target.value || 0)} className="calc-input" placeholder="e.g. 180" />
          <p className="text-xs text-gray-500 mt-1">Total runs needed to win (1 more than opposition score)</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Current score</label>
          <input type="number" min="0" value={currentScore} onChange={(e) => setCurrentScore(+e.target.value || 0)} className="calc-input" placeholder="e.g. 75" />
          <p className="text-xs text-gray-500 mt-1">Runs already scored by chasing team</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Overs bowled</label>
          <input type="text" value={oversBowled} onChange={(e) => setOversBowled(e.target.value)} className="calc-input" placeholder="e.g. 9.2" />
          <p className="text-xs text-gray-500 mt-1">Cricket format: 9.2 means 9 overs + 2 balls</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Total overs (innings length)</label>
          <select value={totalOvers} onChange={(e) => setTotalOvers(+e.target.value)} className="calc-input">
            <option value="20">20 (T20 / IPL)</option>
            <option value="50">50 (ODI)</option>
            <option value="10">10 (T10)</option>
            <option value="5">5 (Super Over rules?)</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          {/* Verdict banner */}
          <div className={`${result.verdict.bgColor} border-2 ${result.verdict.color.replace("text-", "border-")}/30 rounded-2xl p-5 text-center`}>
            <div className={`text-xs font-bold uppercase tracking-widest ${result.verdict.color} mb-1`}>{result.verdict.label}</div>
            <div className="text-sm text-gray-700">{result.verdict.description}</div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500 font-semibold uppercase">Runs needed</div>
              <div className="text-3xl font-extrabold text-rose-600">{result.runsNeeded}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500 font-semibold uppercase">Balls left</div>
              <div className="text-3xl font-extrabold text-blue-600">{result.ballsRemaining}</div>
              <div className="text-xs text-gray-500 mt-0.5">{result.oversRemainingDisplay} overs</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500 font-semibold uppercase">Required RR</div>
              <div className={`text-3xl font-extrabold ${result.rrr > 12 ? "text-rose-600" : result.rrr > 8 ? "text-amber-600" : "text-emerald-600"}`}>
                {result.rrr.toFixed(2)}
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500 font-semibold uppercase">Current RR</div>
              <div className="text-3xl font-extrabold text-gray-800">{result.crr.toFixed(2)}</div>
            </div>
          </div>

          {/* Detail row */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 text-center">
            <strong>{result.runsNeeded}</strong> runs from <strong>{result.ballsRemaining}</strong> balls
            {result.ballsRemaining > 0 && (
              <> · need <strong>{result.rrr.toFixed(2)}</strong> per over</>
            )}
            {result.rrr > 0 && result.crr > 0 && (
              <> (currently scoring at <strong>{result.crr.toFixed(2)}</strong>)</>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 leading-relaxed">
        <strong>Required Run Rate (RRR)</strong> = runs needed ÷ overs remaining. <strong>Current Run Rate (CRR)</strong> = runs scored ÷ overs faced. Cricket overs use base-6 arithmetic — &quot;9.2&quot; means 9 overs and 2 balls (56 balls), not 9.2 overs (55.2 balls).
      </div>
    </div>
  );
}
