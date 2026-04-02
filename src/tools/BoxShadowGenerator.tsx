"use client";
import { useState } from "react";

export default function BoxShadowGenerator() {
  const [x, setX] = useState(5);
  const [y, setY] = useState(5);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000033");
  const [inset, setInset] = useState(false);

  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  const css = `box-shadow: ${shadow};`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-16 bg-gray-100 rounded-2xl">
        <div className="w-48 h-48 bg-white rounded-2xl" style={{ boxShadow: shadow }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">X Offset: {x}px</label><input type="range" min={-50} max={50} value={x} onChange={(e) => setX(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Y Offset: {y}px</label><input type="range" min={-50} max={50} value={y} onChange={(e) => setY(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Blur: {blur}px</label><input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Spread: {spread}px</label><input type="range" min={-50} max={50} value={spread} onChange={(e) => setSpread(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Color</label><input type="color" value={color.slice(0,7)} onChange={(e) => setColor(e.target.value + "33")} className="w-full h-10 rounded-lg cursor-pointer" /></div>
        <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm font-semibold text-gray-700">Inset</span></label></div>
      </div>
      <div className="result-card"><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">CSS Code</label><button onClick={() => navigator.clipboard?.writeText(css)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono">{css}</pre></div>
    </div>
  );
}
