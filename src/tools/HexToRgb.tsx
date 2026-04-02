"use client";
import { useState, useMemo } from "react";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean) && !/^[0-9a-fA-F]{3}$/.test(clean)) return null;
  let full = clean;
  if (clean.length === 3) {
    full = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function HexToRgb() {
  const [mode, setMode] = useState<"hex" | "rgb">("hex");
  const [hexInput, setHexInput] = useState("#FF5733");
  const [rInput, setRInput] = useState("255");
  const [gInput, setGInput] = useState("87");
  const [bInput, setBInput] = useState("51");

  const result = useMemo(() => {
    if (mode === "hex") {
      const rgb = hexToRgb(hexInput);
      if (!rgb) return null;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { hex: hexInput.startsWith("#") ? hexInput.toUpperCase() : `#${hexInput.toUpperCase()}`, rgb, hsl };
    } else {
      const r = parseInt(rInput), g = parseInt(gInput), b = parseInt(bInput);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      return { hex, rgb: { r, g, b }, hsl };
    }
  }, [mode, hexInput, rInput, gInput, bInput]);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => setMode("hex")}
          className={mode === "hex" ? "btn-primary" : "btn-secondary"}
        >
          HEX to RGB
        </button>
        <button
          onClick={() => setMode("rgb")}
          className={mode === "rgb" ? "btn-primary" : "btn-secondary"}
        >
          RGB to HEX
        </button>
      </div>

      {mode === "hex" ? (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">HEX Color</label>
          <input
            type="text"
            placeholder="#FF5733"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            className="calc-input"
          />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">R (0-255)</label>
            <input type="number" min="0" max="255" value={rInput} onChange={(e) => setRInput(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">G (0-255)</label>
            <input type="number" min="0" max="255" value={gInput} onChange={(e) => setGInput(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">B (0-255)</label>
            <input type="number" min="0" max="255" value={bInput} onChange={(e) => setBInput(e.target.value)} className="calc-input" />
          </div>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div
            className="w-full h-24 rounded-xl border border-gray-200"
            style={{ backgroundColor: result.hex }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">HEX</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800">{result.hex}</span>
                <button onClick={() => copy(result.hex)} className="text-xs text-indigo-600 hover:underline">Copy</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">RGB</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800">rgb({result.rgb.r}, {result.rgb.g}, {result.rgb.b})</span>
                <button onClick={() => copy(`rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`)} className="text-xs text-indigo-600 hover:underline">Copy</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">HSL</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800">hsl({result.hsl.h}, {result.hsl.s}%, {result.hsl.l}%)</span>
                <button onClick={() => copy(`hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`)} className="text-xs text-indigo-600 hover:underline">Copy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
