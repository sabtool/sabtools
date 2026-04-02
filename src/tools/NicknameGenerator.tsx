"use client";
import { useState } from "react";

const prefixes: Record<string, string[]> = {
  funny: ["Sir", "Captain", "Professor", "Agent", "DJ", "Mr.", "The Great", "Lil", "Big", "Funky", "Goofy", "Wacky", "Crazy", "Silly", "Jolly"],
  cool: ["King", "Ace", "Neo", "Shadow", "Phantom", "Blaze", "Storm", "Frost", "Rogue", "Zen", "Alpha", "Nova", "Titan", "Viper", "Maverick"],
  cute: ["Baby", "Little", "Sweet", "Tiny", "Cuddle", "Honey", "Sugar", "Pumpkin", "Cutie", "Snuggle", "Teddy", "Bubble", "Twinkle", "Muffin", "Peaches"],
  tough: ["Iron", "Steel", "Thunder", "Rock", "Bullet", "Hammer", "Savage", "Beast", "Fury", "Rampage", "Titan", "Crusher", "Striker", "Tank", "Blitz"],
};

const suffixes: Record<string, string[]> = {
  funny: ["inator", "ster", "zilla", "tron", "meister", "kins", "pants", "face", "butt", "nator", "loo", "poo", "bear", "monster", "doodle"],
  cool: ["X", "Zero", "Prime", "Elite", "Max", "Wolf", "Hawk", "Fox", "Star", "Blade", "Fire", "Ice", "Dark", "Pro", "Legend"],
  cute: ["pie", "boo", "bear", "bunny", "poo", "cakes", "berry", "puff", "kins", "belle", "angel", "dove", "star", "moon", "drops"],
  tough: ["fist", "jaw", "bone", "skull", "rage", "storm", "force", "wreck", "bane", "claw", "fang", "bite", "smash", "blast", "quake"],
};

function generateNicknames(name: string, trait: string): string[] {
  const clean = name.trim();
  if (!clean) return [];
  const first = clean.split(" ")[0];
  const short = first.slice(0, 3);
  const upper = first.toUpperCase();
  const pList = prefixes[trait] || prefixes.funny;
  const sList = suffixes[trait] || suffixes.funny;
  const results = new Set<string>();

  // Prefix + Name
  for (let i = 0; results.size < 3 && i < pList.length; i++) {
    results.add(`${pList[Math.floor(Math.random() * pList.length)]} ${first}`);
  }
  // Name + Suffix
  for (let i = 0; results.size < 6 && i < sList.length; i++) {
    results.add(`${first}${sList[Math.floor(Math.random() * sList.length)]}`);
  }
  // Short name combos
  results.add(`${short.charAt(0).toUpperCase()}${short.slice(1)}-${sList[Math.floor(Math.random() * sList.length)]}`);
  // Prefix + Short
  results.add(`${pList[Math.floor(Math.random() * pList.length)]} ${short.charAt(0).toUpperCase()}${short.slice(1)}`);
  // Double name
  results.add(`${first}${first.slice(-2)}`);
  // Upper style
  results.add(`x${upper}x`);

  // Fill up to 10
  while (results.size < 10) {
    const p = pList[Math.floor(Math.random() * pList.length)];
    const s = sList[Math.floor(Math.random() * sList.length)];
    const variant = Math.random();
    if (variant < 0.33) results.add(`${p}_${first}`);
    else if (variant < 0.66) results.add(`${first}.${s}`);
    else results.add(`${p}${short}${s}`);
  }

  return Array.from(results).slice(0, 10);
}

export default function NicknameGenerator() {
  const [name, setName] = useState("");
  const [trait, setTrait] = useState("funny");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    setResults(generateNicknames(name, trait));
    setCopied(null);
  };

  const copy = (nick: string, idx: number) => {
    navigator.clipboard.writeText(nick);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input
            type="text"
            placeholder="e.g. Rahul"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Personality Vibe</label>
          <select value={trait} onChange={(e) => setTrait(e.target.value)} className="calc-input">
            <option value="funny">Funny</option>
            <option value="cool">Cool</option>
            <option value="cute">Cute</option>
            <option value="tough">Tough</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="btn-primary" disabled={!name.trim()}>Generate Nicknames</button>
        {results.length > 0 && <button onClick={generate} className="btn-secondary">Regenerate</button>}
      </div>

      {results.length > 0 && (
        <div className="result-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {results.map((nick, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 group">
                <span className="font-medium text-gray-800">{i + 1}. {nick}</span>
                <button
                  onClick={() => copy(nick, i)}
                  className="text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
