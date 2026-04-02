"use client";
import { useState, useMemo } from "react";

function factorial(n: number): number {
  if (n < 0) return 0;
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function nPr(n: number, r: number): number {
  if (r > n || n < 0 || r < 0) return 0;
  return factorial(n) / factorial(n - r);
}

function nCr(n: number, r: number): number {
  if (r > n || n < 0 || r < 0) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export default function ProbabilityCalculator() {
  const [tab, setTab] = useState<"perm" | "coin" | "dice" | "card">("perm");
  const [pn, setPn] = useState("");
  const [pr, setPr] = useState("");
  const [permOp, setPermOp] = useState<"perm" | "comb" | "fact">("perm");

  // Coin
  const [coinFlips, setCoinFlips] = useState("3");
  const [coinHeads, setCoinHeads] = useState("2");

  // Dice
  const [diceCount, setDiceCount] = useState("2");
  const [diceTarget, setDiceTarget] = useState("7");

  // Card
  const [cardType, setCardType] = useState("ace");

  const permResult = useMemo(() => {
    const n = parseInt(pn), r = parseInt(pr);
    if (permOp === "fact") {
      if (isNaN(n) || n < 0 || n > 20) return null;
      const val = factorial(n);
      return { value: val, steps: [`${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" \u00D7 ")} = ${val}`] };
    }
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) return null;
    if (r > n) return { value: 0, steps: ["r cannot be greater than n"] };
    if (permOp === "perm") {
      const val = nPr(n, r);
      return {
        value: val,
        steps: [
          `P(${n}, ${r}) = ${n}! / (${n}-${r})!`,
          `= ${factorial(n)} / ${factorial(n - r)}`,
          `= ${val}`,
        ],
      };
    }
    const val = nCr(n, r);
    return {
      value: val,
      steps: [
        `C(${n}, ${r}) = ${n}! / (${r}! \u00D7 (${n}-${r})!)`,
        `= ${factorial(n)} / (${factorial(r)} \u00D7 ${factorial(n - r)})`,
        `= ${val}`,
      ],
    };
  }, [pn, pr, permOp]);

  const coinResult = useMemo(() => {
    const n = parseInt(coinFlips), k = parseInt(coinHeads);
    if (isNaN(n) || isNaN(k) || n < 1 || n > 20 || k < 0 || k > n) return null;
    const prob = nCr(n, k) * Math.pow(0.5, n);
    return {
      probability: prob,
      percentage: (prob * 100).toFixed(4),
      steps: [
        `P(${k} heads in ${n} flips) = C(${n},${k}) \u00D7 (1/2)^${n}`,
        `= ${nCr(n, k)} \u00D7 ${Math.pow(0.5, n).toFixed(8)}`,
        `= ${prob.toFixed(8)}`,
        `= ${(prob * 100).toFixed(4)}%`,
      ],
    };
  }, [coinFlips, coinHeads]);

  const diceResult = useMemo(() => {
    const n = parseInt(diceCount), target = parseInt(diceTarget);
    if (isNaN(n) || isNaN(target) || n < 1 || n > 6) return null;
    // Count combinations that sum to target
    let count = 0;
    const total = Math.pow(6, n);

    function countWays(dice: number, remaining: number): number {
      if (dice === 0) return remaining === 0 ? 1 : 0;
      let c = 0;
      for (let f = 1; f <= 6; f++) {
        if (remaining - f >= 0) c += countWays(dice - 1, remaining - f);
      }
      return c;
    }

    count = countWays(n, target);
    const prob = count / total;

    return {
      probability: prob,
      ways: count,
      totalOutcomes: total,
      steps: [
        `Rolling ${n} dice, P(sum = ${target})`,
        `Total outcomes = 6^${n} = ${total}`,
        `Favorable outcomes = ${count}`,
        `P = ${count}/${total} = ${prob.toFixed(6)}`,
        `= ${(prob * 100).toFixed(4)}%`,
      ],
    };
  }, [diceCount, diceTarget]);

  const cardResult = useMemo(() => {
    const probs: Record<string, { prob: number; desc: string; formula: string }> = {
      ace: { prob: 4 / 52, desc: "Drawing an Ace", formula: "4 Aces / 52 cards" },
      heart: { prob: 13 / 52, desc: "Drawing a Heart", formula: "13 Hearts / 52 cards" },
      face: { prob: 12 / 52, desc: "Drawing a Face card (J, Q, K)", formula: "12 Face cards / 52 cards" },
      red: { prob: 26 / 52, desc: "Drawing a Red card", formula: "26 Red cards / 52 cards" },
      king: { prob: 4 / 52, desc: "Drawing a King", formula: "4 Kings / 52 cards" },
      spade: { prob: 13 / 52, desc: "Drawing a Spade", formula: "13 Spades / 52 cards" },
    };
    const p = probs[cardType];
    return {
      ...p,
      percentage: (p.prob * 100).toFixed(2),
      fraction: `${Math.round(p.prob * 52)}/52`,
    };
  }, [cardType]);

  const tabs = [
    { id: "perm" as const, label: "Permutation / Combination" },
    { id: "coin" as const, label: "Coin Flip" },
    { id: "dice" as const, label: "Dice Roll" },
    { id: "card" as const, label: "Card Draw" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? "btn-primary text-xs" : "btn-secondary text-xs"}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "perm" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setPermOp("perm")} className={permOp === "perm" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Permutation (nPr)</button>
              <button onClick={() => setPermOp("comb")} className={permOp === "comb" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Combination (nCr)</button>
              <button onClick={() => setPermOp("fact")} className={permOp === "fact" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Factorial (n!)</button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className="text-xs text-gray-500">n</label>
                <input type="number" value={pn} onChange={(e) => setPn(e.target.value)} className="calc-input w-24" />
              </div>
              {permOp !== "fact" && (
                <div>
                  <label className="text-xs text-gray-500">r</label>
                  <input type="number" value={pr} onChange={(e) => setPr(e.target.value)} className="calc-input w-24" />
                </div>
              )}
            </div>
          </div>
          {permResult && (
            <div className="result-card">
              <p className="text-2xl font-bold text-indigo-600 mb-3">{permResult.value.toLocaleString()}</p>
              <div className="space-y-1">
                {permResult.steps.map((s, i) => (
                  <p key={i} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded">{s}</p>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "coin" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Coin Flip Probability</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className="text-xs text-gray-500">Number of flips</label>
                <input type="number" value={coinFlips} onChange={(e) => setCoinFlips(e.target.value)} className="calc-input w-24" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Desired heads</label>
                <input type="number" value={coinHeads} onChange={(e) => setCoinHeads(e.target.value)} className="calc-input w-24" />
              </div>
            </div>
          </div>
          {coinResult && (
            <div className="result-card">
              <p className="text-2xl font-bold text-indigo-600 mb-3">{coinResult.percentage}%</p>
              <div className="space-y-1">
                {coinResult.steps.map((s, i) => (
                  <p key={i} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded">{s}</p>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "dice" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Dice Roll Probability</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className="text-xs text-gray-500">Number of dice (1-6)</label>
                <input type="number" value={diceCount} onChange={(e) => setDiceCount(e.target.value)} className="calc-input w-24" min="1" max="6" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Target sum</label>
                <input type="number" value={diceTarget} onChange={(e) => setDiceTarget(e.target.value)} className="calc-input w-24" />
              </div>
            </div>
          </div>
          {diceResult && (
            <div className="result-card">
              <p className="text-2xl font-bold text-indigo-600 mb-3">{(diceResult.probability * 100).toFixed(4)}%</p>
              <div className="space-y-1">
                {diceResult.steps.map((s, i) => (
                  <p key={i} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded">{s}</p>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "card" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Card Draw Probability (Standard 52-card deck)</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "ace", label: "Ace" },
                { value: "king", label: "King" },
                { value: "face", label: "Face Card" },
                { value: "heart", label: "Heart" },
                { value: "spade", label: "Spade" },
                { value: "red", label: "Red Card" },
              ].map((c) => (
                <button key={c.value} onClick={() => setCardType(c.value)} className={cardType === c.value ? "btn-primary text-xs" : "btn-secondary text-xs"}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {cardResult && (
            <div className="result-card">
              <h3 className="text-sm font-bold text-gray-700 mb-2">{cardResult.desc}</h3>
              <p className="text-2xl font-bold text-indigo-600 mb-2">{cardResult.percentage}%</p>
              <p className="text-sm text-gray-500">Fraction: <span className="font-mono font-bold">{cardResult.fraction}</span></p>
              <p className="text-sm text-gray-500">Formula: <span className="font-mono">{cardResult.formula}</span></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
