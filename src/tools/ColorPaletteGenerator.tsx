"use client";
import { useState } from "react";

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function generatePalette(): string[] {
  return Array.from({ length: 5 }, () => randomColor());
}

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState(generatePalette);
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);

  const regenerate = () => {
    setColors((prev) => prev.map((c, i) => locked[i] ? c : randomColor()));
  };

  const toggleLock = (i: number) => {
    setLocked((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-gray-200 h-64">
        {colors.map((c, i) => (
          <div key={i} className="relative flex flex-col items-center justify-end pb-4 cursor-pointer group" style={{ background: c }} onClick={() => navigator.clipboard?.writeText(c)}>
            <button onClick={(e) => { e.stopPropagation(); toggleLock(i); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-sm hover:bg-white transition">
              {locked[i] ? "🔒" : "🔓"}
            </button>
            <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-xs font-bold font-mono text-gray-800 opacity-0 group-hover:opacity-100 transition">
              {c.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={regenerate} className="btn-primary !px-8">Generate New Palette</button>
      </div>
      <div className="text-center text-sm text-gray-500">Click a color to copy • Lock colors to keep them</div>
      <div className="result-card">
        <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Color Codes</label><button onClick={() => navigator.clipboard?.writeText(colors.join(", "))} className="text-xs text-indigo-600 font-medium hover:underline">Copy All</button></div>
        <div className="flex gap-3 flex-wrap">{colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-100">
            <div className="w-6 h-6 rounded-lg" style={{ background: c }} />
            <span className="text-sm font-mono font-bold text-gray-800">{c.toUpperCase()}</span>
          </div>
        ))}</div>
      </div>
    </div>
  );
}
