"use client";
import { useState, useMemo } from "react";

function reduceToSingle(n: number): number {
  while (n > 9) {
    n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
  }
  return n;
}

function nameToNumber(name: string): number {
  const map: Record<string, number> = {};
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => { map[c] = i + 1; });
  const sum = name.toUpperCase().replace(/[^A-Z]/g, "").split("").reduce((s, c) => s + (map[c] || 0), 0);
  return reduceToSingle(sum);
}

function vowelsOnly(name: string): number {
  const vowels = "AEIOU";
  const map: Record<string, number> = {};
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => { map[c] = i + 1; });
  const sum = name.toUpperCase().replace(/[^A-Z]/g, "").split("").filter((c) => vowels.includes(c)).reduce((s, c) => s + (map[c] || 0), 0);
  return reduceToSingle(sum);
}

function lifePathNumber(dob: string): number {
  const digits = dob.replace(/\D/g, "");
  const sum = digits.split("").reduce((s, d) => s + parseInt(d), 0);
  return reduceToSingle(sum);
}

const meanings: Record<number, { title: string; desc: string; traits: string }> = {
  1: { title: "The Leader", desc: "Independent, ambitious, and pioneering. You are a natural born leader.", traits: "Confident, creative, determined, courageous" },
  2: { title: "The Diplomat", desc: "Cooperative, sensitive, and peaceful. You bring harmony to relationships.", traits: "Patient, diplomatic, understanding, gentle" },
  3: { title: "The Communicator", desc: "Expressive, creative, and joyful. You inspire others with your words.", traits: "Artistic, optimistic, social, inspiring" },
  4: { title: "The Builder", desc: "Practical, hardworking, and disciplined. You create solid foundations.", traits: "Loyal, responsible, organized, stable" },
  5: { title: "The Adventurer", desc: "Freedom-loving, dynamic, and versatile. You embrace change and excitement.", traits: "Curious, adaptable, energetic, progressive" },
  6: { title: "The Nurturer", desc: "Loving, responsible, and protective. You care deeply for family and home.", traits: "Compassionate, supportive, healing, faithful" },
  7: { title: "The Seeker", desc: "Analytical, introspective, and spiritual. You seek deeper truths.", traits: "Intuitive, wise, contemplative, scholarly" },
  8: { title: "The Achiever", desc: "Ambitious, authoritative, and successful. You manifest abundance.", traits: "Powerful, business-minded, efficient, decisive" },
  9: { title: "The Humanitarian", desc: "Generous, compassionate, and selfless. You serve the greater good.", traits: "Charitable, idealistic, romantic, creative" },
};

export default function NumerologyCalculator() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!name.trim() || !dob) return null;
    const lifePath = lifePathNumber(dob);
    const expression = nameToNumber(name);
    const soulUrge = vowelsOnly(name);
    return { lifePath, expression, soulUrge };
  }, [name, dob]);

  const renderNumber = (num: number, label: string, explanation: string) => {
    const m = meanings[num];
    return (
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {num}
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-bold text-gray-800">{m?.title || "Unknown"}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">{explanation}</p>
        <p className="text-sm text-gray-600">{m?.desc}</p>
        <p className="text-xs text-gray-500"><span className="font-semibold">Traits:</span> {m?.traits}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="calc-input"
          />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <h3 className="text-lg font-bold text-gray-800 text-center">Your Numerology Profile</h3>
          <div className="space-y-3">
            {renderNumber(result.lifePath, "Life Path Number", "Sum of your date of birth digits, reduced to a single digit")}
            {renderNumber(result.expression, "Expression Number", "Sum of all letters in your name (A=1, B=2... Z=26), reduced")}
            {renderNumber(result.soulUrge, "Soul Urge Number", "Sum of only the vowels (A, E, I, O, U) in your name, reduced")}
          </div>
        </div>
      )}

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">How It Works</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li><strong>Life Path Number:</strong> Add all digits of your DOB until you get a single digit (1-9)</li>
          <li><strong>Expression Number:</strong> Convert each letter to a number (A=1...Z=26), add them all, reduce</li>
          <li><strong>Soul Urge Number:</strong> Same as Expression but using only vowels (A, E, I, O, U)</li>
        </ul>
        <p className="text-xs text-gray-400 mt-2">This is for entertainment purposes only.</p>
      </div>
    </div>
  );
}
