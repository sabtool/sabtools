"use client";
import { useState } from "react";

function hashNames(a: string, b: string): number {
  const str = (a.toLowerCase().trim() + "loves" + b.toLowerCase().trim()).replace(/\s/g, "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 100) + 1;
}

function getMessage(pct: number): string {
  if (pct >= 90) return "You two are made for each other! A perfect match!";
  if (pct >= 75) return "Amazing chemistry! This could be something truly special.";
  if (pct >= 60) return "Great compatibility! There is definitely a spark here.";
  if (pct >= 45) return "Not bad! With some effort, this could work out nicely.";
  if (pct >= 30) return "There is potential, but you will need to work on it.";
  if (pct >= 15) return "Hmm, opposites attract... sometimes. Good luck!";
  return "The stars say it is complicated. But hey, love finds a way!";
}

function getEmoji(pct: number): string {
  if (pct >= 75) return "\u2764\uFE0F";
  if (pct >= 50) return "\uD83E\uDE77";
  if (pct >= 25) return "\uD83D\uDC9B";
  return "\uD83D\uDC94";
}

export default function LoveCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);

  const calculate = () => {
    if (!name1.trim() || !name2.trim()) return;
    setAnimate(true);
    setResult(null);
    setTimeout(() => {
      setResult(hashNames(name1, name2));
      setAnimate(false);
    }, 1500);
  };

  const reset = () => {
    setName1("");
    setName2("");
    setResult(null);
    setAnimate(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input
            type="text"
            placeholder="e.g. Rahul"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Partner&apos;s Name</label>
          <input
            type="text"
            placeholder="e.g. Priya"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="calc-input"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={calculate} className="btn-primary" disabled={!name1.trim() || !name2.trim()}>
          Calculate Love
        </button>
        {result !== null && (
          <button onClick={reset} className="btn-secondary">Reset</button>
        )}
      </div>

      {/* Animated heart */}
      {animate && (
        <div className="text-center py-8">
          <div className="text-6xl animate-bounce inline-block">{"\u2764\uFE0F"}</div>
          <p className="text-gray-500 mt-2 animate-pulse">Calculating love...</p>
        </div>
      )}

      {/* Result */}
      {result !== null && !animate && (
        <div className="result-card text-center space-y-4">
          <div className="flex items-center justify-center gap-4 text-xl font-semibold text-gray-700">
            <span>{name1}</span>
            <span className="text-3xl">{getEmoji(result)}</span>
            <span>{name2}</span>
          </div>
          <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={result >= 60 ? "#ef4444" : result >= 30 ? "#f59e0b" : "#6b7280"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(result / 100) * 264} 264`}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-extrabold" style={{ color: result >= 60 ? "#ef4444" : result >= 30 ? "#f59e0b" : "#6b7280" }}>
                {result}%
              </div>
              <div className="text-xs text-gray-400">Love Score</div>
            </div>
          </div>
          <p className="text-gray-600 font-medium max-w-md mx-auto">{getMessage(result)}</p>
        </div>
      )}
    </div>
  );
}
