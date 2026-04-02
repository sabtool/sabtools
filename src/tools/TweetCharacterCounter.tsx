"use client";
import { useState, useMemo } from "react";

const platforms = [
  { name: "Twitter / X", limit: 280, color: "text-blue-500" },
  { name: "Instagram Caption", limit: 2200, color: "text-pink-500" },
  { name: "LinkedIn Post", limit: 3000, color: "text-blue-700" },
  { name: "Facebook Post", limit: 63206, color: "text-indigo-600" },
];

export default function TweetCharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars, words };
  }, [text]);

  const getColor = (chars: number, limit: number) => {
    const pct = (chars / limit) * 100;
    if (pct >= 100) return "text-red-600";
    if (pct >= 90) return "text-orange-500";
    if (pct >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getBarColor = (chars: number, limit: number) => {
    const pct = (chars / limit) * 100;
    if (pct >= 100) return "bg-red-500";
    if (pct >= 90) return "bg-orange-500";
    if (pct >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Your Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing your post here..."
          rows={6}
          className="calc-input"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{stats.chars} characters</span>
          <span>{stats.words} words</span>
        </div>
      </div>

      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Character Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platforms.map((p) => {
            const remaining = p.limit - stats.chars;
            const pct = Math.min((stats.chars / p.limit) * 100, 100);
            return (
              <div key={p.name} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-semibold ${p.color}`}>{p.name}</span>
                  <span className={`text-sm font-bold ${getColor(stats.chars, p.limit)}`}>
                    {remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${getBarColor(stats.chars, p.limit)}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{stats.chars} / {p.limit.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
