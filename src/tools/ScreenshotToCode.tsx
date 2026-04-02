"use client";
import { useState, useRef } from "react";

export default function ScreenshotToCode() {
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = (f: File) => {
    setFile(f);
    const img = new Image();
    img.onload = () => {
      setDimensions({ w: img.width, h: img.height });
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 16) * 16;
        const g = Math.round(data[i + 1] / 16) * 16;
        const b = Math.round(data[i + 2] / 16) * 16;
        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }
      const sorted = Object.entries(colorMap).sort(([, a], [, b]) => b - a).slice(0, 10).map(([c]) => c);
      setColors(sorted);
    };
    img.src = URL.createObjectURL(f);
  };

  return (
    <div className="space-y-6">
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition">
        <div className="text-4xl mb-3">🖥️</div>
        <div className="text-sm font-semibold text-gray-700">{file ? file.name : "Upload a screenshot"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && analyze(e.target.files[0])} className="hidden" />
      </div>
      {file && (
        <div className="space-y-4">
          <div className="result-card grid grid-cols-2 gap-4">
            <div className="text-center"><div className="text-xs text-gray-500">Width</div><div className="text-2xl font-bold text-indigo-600">{dimensions.w}px</div></div>
            <div className="text-center"><div className="text-xs text-gray-500">Height</div><div className="text-2xl font-bold text-indigo-600">{dimensions.h}px</div></div>
          </div>
          {colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Palette (Top 10)</h3>
              <div className="grid grid-cols-5 gap-2">{colors.map((c) => (
                <div key={c} className="text-center cursor-pointer" onClick={() => navigator.clipboard?.writeText(c)}>
                  <div className="w-full h-16 rounded-xl border border-gray-200" style={{ background: c }} />
                  <div className="text-xs font-mono text-gray-600 mt-1">{c}</div>
                </div>
              ))}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
