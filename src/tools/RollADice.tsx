"use client";
import { useState, useCallback } from "react";

const DICE_FACES: Record<number, string> = {
  1: "\u2680", 2: "\u2681", 3: "\u2682", 4: "\u2683", 5: "\u2684", 6: "\u2685",
};

export default function RollADice() {
  const [numDice, setNumDice] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<{ dice: number[]; total: number }[]>([]);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setTimeout(() => {
      const rolled = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
      setResults(rolled);
      setHistory((prev) => [{ dice: rolled, total: rolled.reduce((a, b) => a + b, 0) }, ...prev].slice(0, 20));
      setRolling(false);
    }, 800);
  }, [numDice, rolling]);

  const reset = () => {
    setResults([]);
    setHistory([]);
  };

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Dice count selector */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Number of Dice</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => setNumDice(n)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                numDice === n ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Dice display */}
      <div className="flex justify-center gap-4 py-4 flex-wrap">
        {(results.length > 0 ? results : Array(numDice).fill(0)).map((val, i) => (
          <div
            key={i}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-lg border-2 transition-all duration-300 ${
              rolling
                ? "animate-bounce border-indigo-300 bg-indigo-50"
                : val > 0
                ? "border-indigo-400 bg-white"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            {rolling ? "\u2682" : val > 0 ? DICE_FACES[val] : "?"}
          </div>
        ))}
      </div>

      {/* Total */}
      {results.length > 0 && !rolling && numDice > 1 && (
        <div className="text-center">
          <span className="text-sm text-gray-500">Total: </span>
          <span className="text-3xl font-extrabold text-indigo-600">{total}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button onClick={roll} className="btn-primary" disabled={rolling}>
          {rolling ? "Rolling..." : "Roll Dice"}
        </button>
        {history.length > 0 && (
          <button onClick={reset} className="btn-secondary">Reset</button>
        )}
      </div>

      {/* History & Stats */}
      {history.length > 0 && (
        <div className="result-card">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
              <div className="text-xs font-medium text-gray-500">Total Rolls</div>
              <div className="text-2xl font-extrabold text-gray-700">{history.length}</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
              <div className="text-xs font-medium text-gray-500">Average</div>
              <div className="text-2xl font-extrabold text-indigo-600">
                {(history.reduce((a, h) => a + h.total, 0) / history.length).toFixed(1)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
              <div className="text-xs font-medium text-gray-500">Highest</div>
              <div className="text-2xl font-extrabold text-green-600">
                {Math.max(...history.map((h) => h.total))}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 font-semibold mb-2">Roll History</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {history.slice(0, 10).map((h, i) => (
              <div key={i} className="flex items-center justify-between text-sm px-2 py-1 bg-white rounded-lg">
                <span className="text-gray-400">#{history.length - i}</span>
                <span className="text-lg">{h.dice.map((d) => DICE_FACES[d]).join(" ")}</span>
                <span className="font-bold text-indigo-600">{h.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
