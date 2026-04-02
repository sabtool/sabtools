"use client";
import { useState } from "react";

export default function TextShadowGenerator() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState("#00000066");
  const [text, setText] = useState("SabTools.in");

  const shadow = `${x}px ${y}px ${blur}px ${color}`;
  const css = `text-shadow: ${shadow};`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-12 bg-gray-100 rounded-2xl">
        <div className="text-5xl font-extrabold text-gray-800" style={{ textShadow: shadow }}>{text}</div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Preview Text</label><input type="text" value={text} onChange={(e) => setText(e.target.value)} className="calc-input" /></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">X: {x}px</label><input type="range" min={-20} max={20} value={x} onChange={(e) => setX(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Y: {y}px</label><input type="range" min={-20} max={20} value={y} onChange={(e) => setY(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Blur: {blur}px</label><input type="range" min={0} max={30} value={blur} onChange={(e) => setBlur(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Color</label><input type="color" value={color.slice(0,7)} onChange={(e) => setColor(e.target.value + "66")} className="w-full h-10 rounded-lg cursor-pointer" /></div>
      </div>
      <div className="result-card"><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">CSS Code</label><button onClick={() => navigator.clipboard?.writeText(css)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono">{css}</pre></div>
    </div>
  );
}
