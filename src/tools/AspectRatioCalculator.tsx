"use client";
import { useState, useMemo } from "react";

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

export default function AspectRatioCalculator() {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");
  const [newW, setNewW] = useState("");
  const [newH, setNewH] = useState("");

  const ratio = useMemo(() => {
    const width = parseInt(w), height = parseInt(h);
    if (!width || !height) return null;
    const g = gcd(width, height);
    return { rw: width / g, rh: height / g, decimal: (width / height).toFixed(4) };
  }, [w, h]);

  const scaled = useMemo(() => {
    if (!ratio) return null;
    const nw = parseInt(newW), nh = parseInt(newH);
    if (nw) return { w: nw, h: Math.round(nw / (ratio.rw / ratio.rh)) };
    if (nh) return { w: Math.round(nh * (ratio.rw / ratio.rh)), h: nh };
    return null;
  }, [ratio, newW, newH]);

  const presets = [
    { l: "16:9 (HD)", w: 1920, h: 1080 },
    { l: "4:3 (Standard)", w: 1024, h: 768 },
    { l: "1:1 (Square)", w: 1080, h: 1080 },
    { l: "9:16 (Mobile)", w: 1080, h: 1920 },
    { l: "21:9 (Ultra)", w: 2560, h: 1080 },
    { l: "3:2 (Photo)", w: 1500, h: 1000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Width</label><input type="number" placeholder="1920" value={w} onChange={(e) => setW(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Height</label><input type="number" placeholder="1080" value={h} onChange={(e) => setH(e.target.value)} className="calc-input" /></div>
      </div>
      <div className="flex gap-2 flex-wrap">{presets.map((p) => (<button key={p.l} onClick={() => { setW(String(p.w)); setH(String(p.h)); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-indigo-100 transition">{p.l}</button>))}</div>
      {ratio && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500">Aspect Ratio</div>
          <div className="text-4xl font-extrabold text-indigo-600 mt-1">{ratio.rw}:{ratio.rh}</div>
          <div className="text-sm text-gray-400 mt-1">Decimal: {ratio.decimal}</div>
        </div>
      )}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Scale to New Size (enter one)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-gray-500 block mb-1">New Width</label><input type="number" placeholder="New width" value={newW} onChange={(e) => { setNewW(e.target.value); setNewH(""); }} className="calc-input" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">New Height</label><input type="number" placeholder="New height" value={newH} onChange={(e) => { setNewH(e.target.value); setNewW(""); }} className="calc-input" /></div>
        </div>
        {scaled && <div className="mt-3 text-center text-lg font-bold text-indigo-600">{scaled.w} × {scaled.h}</div>}
      </div>
    </div>
  );
}
