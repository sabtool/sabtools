"use client";
import { useMemo, useState } from "react";

/**
 * IPL Win Probability Calculator — for the chasing team in a T20 match.
 *
 * Model:
 *
 *   This is a heuristic, not a Bayesian/ML predictor. It combines four
 *   signals into a 0-100% win probability:
 *
 *     1. RRR vs CRR gap (primary signal)
 *        - RRR <= CRR: very high chance, capped 95%
 *        - Each 1.0 above CRR: subtract ~8-12% depending on phase
 *
 *     2. Wickets in hand (multiplier)
 *        - 9-10 wickets: 1.0×  (baseline)
 *        - 7-8: 0.95×
 *        - 5-6: 0.85×
 *        - 3-4: 0.70×
 *        - 1-2: 0.45×  (tail batters can rarely chase tough RRR)
 *        - 0:   0.0    (already lost)
 *
 *     3. Phase of innings (multiplier)
 *        - Powerplay (overs 1-6): high RRR is more chaseable
 *          (fielding restrictions help; 0.5×-1.2× depending)
 *        - Middle (overs 7-15): par (1.0×)
 *        - Death (overs 16-20): RRR > 12 increasingly impossible
 *          (0.7×-1.0× depending)
 *
 *     4. Target tier (small adjustment)
 *        - Sub-150 targets: easier overall (+2-5%)
 *        - 200+ targets: harder overall (-2-5%)
 *
 *   Formula (simplified):
 *     baseProb = sigmoid((CRR - RRR) × 1.2 + 5) × 100
 *       where sigmoid(x) = 1 / (1 + e^-x)
 *     adjusted = baseProb × wicketMultiplier × phaseMultiplier
 *
 *   Capped to [0, 100], rounded to integer.
 *
 * This isn't WinViz/CricViz accuracy — those use ball-by-ball historical
 * data and venue-specific models. This is a useful approximation for
 * casual use (and very Indian: "chinta kar lo, abhi kya scene hai").
 */

interface Result {
  winProb: number;
  rrr: number;
  crr: number;
  ballsRemaining: number;
  runsNeeded: number;
  verdict: { label: string; color: string };
  factors: { label: string; impact: string }[];
}

function oversToBalls(overs: number): number {
  if (!isFinite(overs) || overs < 0) return 0;
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  return fullOvers * 6 + Math.min(balls, 5);
}

export default function IplWinProbabilityCalculator() {
  const [target, setTarget] = useState<number>(180);
  const [currentScore, setCurrentScore] = useState<number>(75);
  const [oversBowled, setOversBowled] = useState<string>("9.2");
  const [wicketsLost, setWicketsLost] = useState<number>(2);
  const [totalOvers] = useState<number>(20);

  const result: Result | null = useMemo(() => {
    const o = parseFloat(oversBowled);
    if (!isFinite(o) || target <= 0 || currentScore < 0) return null;

    const ballsBowled = oversToBalls(o);
    const totalBalls = totalOvers * 6;
    const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
    const runsNeeded = Math.max(0, target - currentScore);
    const oversRemaining = ballsRemaining / 6;
    const oversBatted = ballsBowled / 6;
    const rrr = oversRemaining > 0 ? runsNeeded / oversRemaining : 0;
    const crr = oversBatted > 0 ? currentScore / oversBatted : 0;
    const wicketsInHand = 10 - wicketsLost;

    const factors: { label: string; impact: string }[] = [];

    // === Already won / lost edge cases ===
    if (runsNeeded === 0 && ballsRemaining > 0) {
      return {
        winProb: 100, rrr, crr, ballsRemaining, runsNeeded,
        verdict: { label: "Match already won!", color: "text-emerald-700" },
        factors: [{ label: "Target already chased", impact: "Match decided" }],
      };
    }
    if (wicketsInHand <= 0) {
      return {
        winProb: 0, rrr, crr, ballsRemaining, runsNeeded,
        verdict: { label: "Match lost (all out)", color: "text-rose-700" },
        factors: [{ label: "All 10 wickets lost", impact: "Innings ended" }],
      };
    }
    if (ballsRemaining === 0 && runsNeeded > 0) {
      return {
        winProb: 0, rrr, crr, ballsRemaining, runsNeeded,
        verdict: { label: "Match lost (overs done)", color: "text-rose-700" },
        factors: [{ label: "No balls remaining", impact: "Cannot score" }],
      };
    }
    if (rrr > 36) {
      return {
        winProb: 1, rrr, crr, ballsRemaining, runsNeeded,
        verdict: { label: "Virtually impossible", color: "text-rose-800" },
        factors: [{ label: `RRR ${rrr.toFixed(1)}`, impact: "Cannot score 36+/over" }],
      };
    }

    // === Base sigmoid model ===
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    // CRR-RRR difference scaled — symmetric around 0
    const diff = crr - rrr;
    let baseProb = sigmoid(diff * 1.2 + 0.5) * 100;
    factors.push({
      label: `CRR ${crr.toFixed(2)} vs RRR ${rrr.toFixed(2)}`,
      impact: diff >= 0 ? `Ahead by ${diff.toFixed(2)}` : `Behind by ${Math.abs(diff).toFixed(2)}`,
    });

    // === Wickets multiplier ===
    let wicketMult = 1.0;
    if (wicketsInHand >= 9) wicketMult = 1.0;
    else if (wicketsInHand >= 7) wicketMult = 0.95;
    else if (wicketsInHand >= 5) wicketMult = 0.85;
    else if (wicketsInHand >= 3) wicketMult = 0.70;
    else wicketMult = 0.45;
    factors.push({
      label: `${wicketsInHand} wicket${wicketsInHand !== 1 ? "s" : ""} in hand`,
      impact: wicketMult === 1.0 ? "Full batting strength" : `${(wicketMult * 100).toFixed(0)}% multiplier`,
    });

    // === Phase multiplier ===
    let phaseMult = 1.0;
    let phaseLabel = "";
    if (oversBatted < 6) {
      phaseLabel = "Powerplay";
      // Powerplay is forgiving on high RRR — sluggers can accelerate
      phaseMult = rrr > 10 ? 1.05 : 0.95;
    } else if (oversBatted < 16) {
      phaseLabel = "Middle overs";
      phaseMult = 1.0;
    } else {
      phaseLabel = "Death overs";
      // Death overs: high RRR is hard to recover from
      phaseMult = rrr > 12 ? 0.75 : rrr > 9 ? 0.9 : 1.0;
    }
    factors.push({
      label: `${phaseLabel} (over ${oversBatted.toFixed(1)} of ${totalOvers})`,
      impact: phaseMult === 1.0 ? "Neutral" : `${(phaseMult * 100).toFixed(0)}% multiplier`,
    });

    // === Target tier adjustment ===
    let targetAdjust = 0;
    if (target < 150) targetAdjust = 3;
    else if (target >= 200) targetAdjust = -3;
    if (targetAdjust !== 0) {
      factors.push({
        label: `Target ${target}`,
        impact: targetAdjust > 0 ? "Below-par target" : "Above-par target",
      });
    }

    let winProb = baseProb * wicketMult * phaseMult + targetAdjust;
    winProb = Math.max(1, Math.min(99, Math.round(winProb)));

    const verdict =
      winProb >= 80 ? { label: "Cruise control 🚀", color: "text-emerald-700" } :
      winProb >= 60 ? { label: "Favourites 👍", color: "text-emerald-600" } :
      winProb >= 40 ? { label: "On a knife edge ⚖️", color: "text-amber-600" } :
      winProb >= 20 ? { label: "Up against it 😰", color: "text-orange-700" } :
                       { label: "Long shot 🙏", color: "text-rose-700" };

    return { winProb, rrr, crr, ballsRemaining, runsNeeded, verdict, factors };
  }, [target, currentScore, oversBowled, wicketsLost, totalOvers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Target</label>
          <input type="number" min="1" value={target} onChange={(e) => setTarget(+e.target.value || 0)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Current score (chasing)</label>
          <input type="number" min="0" value={currentScore} onChange={(e) => setCurrentScore(+e.target.value || 0)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Overs bowled (e.g. 9.2)</label>
          <input type="text" value={oversBowled} onChange={(e) => setOversBowled(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Wickets lost</label>
          <input type="number" min="0" max="10" value={wicketsLost} onChange={(e) => setWicketsLost(Math.min(10, Math.max(0, +e.target.value || 0)))} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          {/* Big win probability gauge */}
          <div className="bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50 border-2 border-violet-300 rounded-2xl p-6 text-center">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">
              Chasing team win probability
            </div>
            <div className={`text-7xl font-extrabold ${result.winProb >= 50 ? "text-emerald-600" : "text-rose-600"}`}>
              {result.winProb}%
            </div>
            <div className={`text-lg font-bold mt-2 ${result.verdict.color}`}>
              {result.verdict.label}
            </div>

            {/* Win prob bar */}
            <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${result.winProb >= 50 ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-rose-400 to-rose-600"}`}
                style={{ width: `${result.winProb}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>0% (lost)</span>
              <span>50%</span>
              <span>100% (won)</span>
            </div>
          </div>

          {/* Match snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Need</div>
              <div className="text-xl font-bold text-gray-900">{result.runsNeeded}</div>
              <div className="text-[10px] text-gray-500">runs</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Balls left</div>
              <div className="text-xl font-bold text-gray-900">{result.ballsRemaining}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">RRR</div>
              <div className="text-xl font-bold text-rose-600">{result.rrr.toFixed(2)}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">CRR</div>
              <div className="text-xl font-bold text-emerald-600">{result.crr.toFixed(2)}</div>
            </div>
          </div>

          {/* Factor breakdown */}
          <details className="bg-white border border-gray-100 rounded-xl shadow-sm">
            <summary className="cursor-pointer p-3 font-semibold text-gray-700 hover:bg-gray-50">
              How was this calculated?
            </summary>
            <ul className="px-3 pb-3 text-sm space-y-1.5 border-t border-gray-100 pt-2">
              {result.factors.map((f, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="text-gray-700">{f.label}</span>
                  <span className="text-gray-500 text-xs">{f.impact}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}

      <div className="text-xs text-gray-500 leading-relaxed">
        <strong>How it works:</strong> A heuristic combining required-run-rate gap, wickets in hand, phase of innings (Powerplay / Middle / Death), and target tier. Not a CricViz-style ball-by-ball model — this is a useful approximation for casual fans and fantasy strategy. Real win probability requires venue-specific historical data which this tool intentionally does not collect.
      </div>
    </div>
  );
}
