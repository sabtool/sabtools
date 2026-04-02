"use client";
import { useState } from "react";

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.25);
  const [border, setBorder] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#6366f1");

  const r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16);
  const css = `background: rgba(${r}, ${g}, ${b}, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: ${border}px solid rgba(${r}, ${g}, ${b}, ${opacity + 0.1});\nborder-radius: 16px;`;

  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${bgColor}, #ec4899)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-40 flex items-center justify-center text-white text-lg font-bold" style={{ background: `rgba(${r},${g},${b},${opacity})`, backdropFilter: `blur(${blur}px)`, border: `${border}px solid rgba(${r},${g},${b},${opacity + 0.1})`, borderRadius: "16px" }}>
            Glass Effect
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Blur: {blur}px</label><input type="range" min={0} max={30} value={blur} onChange={(e) => setBlur(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Opacity: {opacity}</label><input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Border: {border}px</label><input type="range" min={0} max={5} value={border} onChange={(e) => setBorder(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Glass Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Background</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" /></div>
      </div>
      <div className="result-card"><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">CSS Code</label><button onClick={() => navigator.clipboard?.writeText(css)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono">{css}</pre></div>
    </div>
  );
}
