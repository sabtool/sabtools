"use client";
import { useState, useCallback } from "react";

export default function FlipACoin() {
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<("Heads" | "Tails")[]>([]);

  const flip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const outcome: "Heads" | "Tails" = Math.random() < 0.5 ? "Heads" : "Tails";
      setResult(outcome);
      setHistory((prev) => [outcome, ...prev]);
      setFlipping(false);
    }, 1000);
  }, [flipping]);

  const reset = () => {
    setResult(null);
    setHistory([]);
  };

  const headsCount = history.filter((h) => h === "Heads").length;
  const tailsCount = history.filter((h) => h === "Tails").length;

  return (
    <div className="space-y-6 text-center">
      {/* Coin */}
      <div className="flex justify-center py-4">
        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center text-2xl font-extrabold shadow-lg border-4 transition-all duration-300 cursor-pointer select-none ${
            flipping
              ? "animate-spin border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-800"
              : result === "Heads"
              ? "border-yellow-400 bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-800"
              : result === "Tails"
              ? "border-gray-400 bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700"
              : "border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-300 text-yellow-600"
          }`}
          onClick={flip}
          style={flipping ? { animation: "spin 0.3s linear infinite" } : {}}
        >
          {flipping ? "..." : result ?? "?"}
        </div>
      </div>

      {result && !flipping && (
        <div className="text-3xl font-extrabold text-indigo-600">{result}!</div>
      )}

      <div className="flex justify-center gap-3">
        <button onClick={flip} className="btn-primary" disabled={flipping}>
          {flipping ? "Flipping..." : "Flip Coin"}
        </button>
        {history.length > 0 && (
          <button onClick={reset} className="btn-secondary">Reset</button>
        )}
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="result-card">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
              <div className="text-xs font-medium text-gray-500">Total Flips</div>
              <div className="text-2xl font-extrabold text-gray-700">{history.length}</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
              <div className="text-xs font-medium text-gray-500">Heads</div>
              <div className="text-2xl font-extrabold text-yellow-600">{headsCount}</div>
              <div className="text-xs text-gray-400">{history.length > 0 ? ((headsCount / history.length) * 100).toFixed(1) : 0}%</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
              <div className="text-xs font-medium text-gray-500">Tails</div>
              <div className="text-2xl font-extrabold text-gray-600">{tailsCount}</div>
              <div className="text-xs text-gray-400">{history.length > 0 ? ((tailsCount / history.length) * 100).toFixed(1) : 0}%</div>
            </div>
          </div>

          {/* History */}
          <div className="text-sm text-gray-500 font-semibold mb-2">Recent Flips</div>
          <div className="flex flex-wrap gap-2 justify-center max-h-24 overflow-y-auto">
            {history.slice(0, 30).map((h, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  h === "Heads" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {h[0]}
              </span>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
