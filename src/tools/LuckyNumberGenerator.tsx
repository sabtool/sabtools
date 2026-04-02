"use client";
import { useState, useMemo } from "react";

function reduceToSingle(n: number): number {
  while (n > 9) n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
  return n;
}

function nameNumber(name: string): number {
  const sum = name.toUpperCase().replace(/[^A-Z]/g, "").split("").reduce((s, c) => s + (c.charCodeAt(0) - 64), 0);
  return reduceToSingle(sum);
}

function dobNumber(dob: string): number {
  const sum = dob.replace(/\D/g, "").split("").reduce((s, d) => s + parseInt(d), 0);
  return reduceToSingle(sum);
}

const luckyColors: Record<number, string[]> = {
  1: ["Red", "Gold", "Orange"], 2: ["White", "Green", "Cream"],
  3: ["Yellow", "Purple", "Violet"], 4: ["Blue", "Grey", "Indigo"],
  5: ["Light Green", "White", "Turquoise"], 6: ["Pink", "Blue", "Teal"],
  7: ["Violet", "Pearl White", "Green"], 8: ["Dark Blue", "Black", "Purple"],
  9: ["Red", "Crimson", "Rose"],
};

const luckyDays: Record<number, string[]> = {
  1: ["Sunday", "Monday"], 2: ["Monday", "Friday"],
  3: ["Thursday", "Friday"], 4: ["Saturday", "Sunday"],
  5: ["Wednesday", "Friday"], 6: ["Friday", "Tuesday"],
  7: ["Monday", "Wednesday"], 8: ["Saturday", "Thursday"],
  9: ["Tuesday", "Thursday"],
};

const luckyGems: Record<number, string> = {
  1: "Ruby", 2: "Pearl", 3: "Yellow Sapphire", 4: "Hessonite (Gomed)",
  5: "Emerald", 6: "Diamond", 7: "Cat's Eye", 8: "Blue Sapphire", 9: "Red Coral",
};

const luckyPlanets: Record<number, string> = {
  1: "Sun", 2: "Moon", 3: "Jupiter", 4: "Rahu",
  5: "Mercury", 6: "Venus", 7: "Ketu", 8: "Saturn", 9: "Mars",
};

export default function LuckyNumberGenerator() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!name.trim() || !dob) return null;
    const nn = nameNumber(name);
    const dn = dobNumber(dob);
    const primary = reduceToSingle(nn + dn);
    const secondary = [nn, dn, reduceToSingle(nn * 2), reduceToSingle(dn * 3)].filter((v, i, a) => a.indexOf(v) === i && v !== primary);
    return { primary, secondary, colors: luckyColors[primary] || [], days: luckyDays[primary] || [], gem: luckyGems[primary] || "", planet: luckyPlanets[primary] || "" };
  }, [name, dob]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input type="text" placeholder="e.g. Priya Patel" value={name} onChange={(e) => setName(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-5">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Your Primary Lucky Number</p>
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-extrabold text-white">{result.primary}</span>
            </div>
          </div>

          {result.secondary.length > 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Secondary Lucky Numbers</p>
              <div className="flex justify-center gap-3">
                {result.secondary.map((n, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Lucky Colors</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.colors.map((c) => (
                  <span key={c} className="bg-white border rounded-full px-3 py-1 text-sm font-medium text-gray-700">{c}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Lucky Days</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.days.map((d) => (
                  <span key={d} className="bg-white border rounded-full px-3 py-1 text-sm font-medium text-gray-700">{d}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Lucky Gemstone</p>
              <p className="text-lg font-bold text-gray-800">{result.gem}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Ruling Planet</p>
              <p className="text-lg font-bold text-gray-800">{result.planet}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">Based on numerology calculations. For entertainment purposes only.</p>
        </div>
      )}
    </div>
  );
}
