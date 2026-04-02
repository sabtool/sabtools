"use client";
import { useState } from "react";

export default function CssGradientGenerator() {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const gradient = type === "linear" ? `linear-gradient(${angle}deg, ${color1}, ${color2})` : `radial-gradient(circle, ${color1}, ${color2})`;
  const css = `background: ${gradient};`;

  return (
    <div className="space-y-6">
      <div className="h-48 rounded-2xl border border-gray-200 shadow-inner" style={{ background: gradient }} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Color 1</label><div className="flex gap-2"><input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" /><input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="calc-input flex-1 font-mono text-sm" /></div></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Color 2</label><div className="flex gap-2"><input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" /><input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="calc-input flex-1 font-mono text-sm" /></div></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Type</label><div className="flex gap-2">{(["linear","radial"] as const).map((t) => (<button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${type === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t}</button>))}</div></div>
        {type === "linear" && <div><label className="text-sm font-semibold text-gray-700 block mb-2">Angle: {angle}°</label><input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full" /></div>}
      </div>
      <div className="flex gap-2 flex-wrap">{[["Sunset","#ff512f","#f09819"],["Ocean","#2193b0","#6dd5ed"],["Purple","#7b2ff7","#c471f5"],["Green","#11998e","#38ef7d"],["Fire","#f12711","#f5af19"],["Night","#0f0c29","#302b63"]].map(([n,c1,c2]) => (
        <button key={n} onClick={() => { setColor1(c1); setColor2(c2); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 transition">{n}</button>
      ))}</div>
      <div className="result-card"><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">CSS Code</label><button onClick={() => navigator.clipboard?.writeText(css)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono">{css}</pre></div>
    </div>
  );
}
