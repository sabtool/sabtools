"use client";
import { useState, useMemo } from "react";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPicker() {
  const [color, setColor] = useState("#6366f1");

  const conversions = useMemo(() => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      hex: color.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    };
  }, [color]);

  const copy = (text: string) => navigator.clipboard?.writeText(text);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-2 border-gray-200" />
        <div>
          <div className="text-3xl font-extrabold" style={{ color }}>{conversions.hex}</div>
          <input type="text" value={color} onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setColor(e.target.value); }} className="calc-input mt-2 w-40" placeholder="#6366f1" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(conversions).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase">{label}</div>
              <div className="text-sm font-bold text-gray-800 font-mono">{value}</div>
            </div>
            <button onClick={() => copy(value)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Preview</h3>
        <div className="grid grid-cols-5 gap-2">
          {[0.1, 0.3, 0.5, 0.7, 1].map((opacity) => (
            <div key={opacity} className="rounded-xl h-16 border border-gray-200" style={{ backgroundColor: color, opacity }} />
          ))}
        </div>
      </div>
    </div>
  );
}
