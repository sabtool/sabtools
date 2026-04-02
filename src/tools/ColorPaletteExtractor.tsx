"use client";
import { useState, useRef, useMemo } from "react";

interface ColorInfo {
  r: number;
  g: number;
  b: number;
  hex: string;
  count: number;
  percent: number;
}

export default function ColorPaletteExtractor() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [copied, setCopied] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

  const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) =>
    Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);

  const extractColors = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    // Sample at lower resolution for performance
    const maxDim = 150;
    const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const totalPixels = canvas.width * canvas.height;

    // Quantize colors into buckets (reduce to 5-bit per channel)
    const buckets: Map<string, { r: number; g: number; b: number; count: number; totalR: number; totalG: number; totalB: number }> = new Map();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Skip very transparent pixels
      if (data[i + 3] < 128) continue;

      // Quantize to reduce color space
      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;
      const key = `${qr},${qg},${qb}`;

      const existing = buckets.get(key);
      if (existing) {
        existing.count++;
        existing.totalR += r;
        existing.totalG += g;
        existing.totalB += b;
      } else {
        buckets.set(key, { r: qr, g: qg, b: qb, count: 1, totalR: r, totalG: g, totalB: b });
      }
    }

    // Sort by count and get top buckets
    const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);

    // Merge similar colors and pick top 6 distinct ones
    const distinct: ColorInfo[] = [];
    for (const bucket of sorted) {
      if (distinct.length >= 6) break;
      const avgR = Math.round(bucket.totalR / bucket.count);
      const avgG = Math.round(bucket.totalG / bucket.count);
      const avgB = Math.round(bucket.totalB / bucket.count);

      // Check distance from already picked colors
      const tooClose = distinct.some(
        (c) => colorDistance(c.r, c.g, c.b, avgR, avgG, avgB) < 50
      );
      if (tooClose) continue;

      distinct.push({
        r: avgR,
        g: avgG,
        b: avgB,
        hex: toHex(avgR, avgG, avgB),
        count: bucket.count,
        percent: Math.round((bucket.count / totalPixels) * 100 * 10) / 10,
      });
    }

    setColors(distinct);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageUrl(ev.target?.result as string);
        extractColors(img);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  const copyFullPalette = () => {
    const text = colors.map((c) => `${c.hex} / rgb(${c.r}, ${c.g}, ${c.b})`).join("\n");
    copyText(text);
  };

  const totalPercent = useMemo(() => colors.reduce((s, c) => s + c.percent, 0), [colors]);

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">🎨</div>
        <div className="text-sm font-semibold text-gray-700">{image ? "Change image" : "Upload image to extract colors"}</div>
        <div className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {image && imageUrl && (
        <div className="result-card">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Source Image</h3>
          <img src={imageUrl} alt="Source" className="max-h-48 rounded-xl mx-auto border border-gray-200" />
        </div>
      )}

      {colors.length > 0 && (
        <>
          <div className="result-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Extracted Palette</h3>
              <button onClick={copyFullPalette} className="btn-secondary text-xs">
                {copied && copied.includes("\n") ? "Copied!" : "Copy All"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition"
                  onClick={() => copyText(c.hex)}
                >
                  <div className="h-24" style={{ backgroundColor: c.hex }} />
                  <div className="p-3 bg-white">
                    <div className="font-mono font-bold text-sm text-gray-800">
                      {c.hex} {copied === c.hex && <span className="text-green-500 text-xs ml-1">Copied!</span>}
                    </div>
                    <div className="font-mono text-xs text-gray-500">rgb({c.r}, {c.g}, {c.b})</div>
                    <div className="text-xs text-gray-400 mt-1">{c.percent}% of image</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Color Distribution</h3>
            <div className="flex rounded-xl overflow-hidden h-8 border border-gray-200">
              {colors.map((c, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: c.hex,
                    width: `${(c.percent / totalPercent) * 100}%`,
                  }}
                  title={`${c.hex} - ${c.percent}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c.hex }} />
                  {c.hex} ({c.percent}%)
                </div>
              ))}
            </div>
          </div>

          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Preview Palette Strip</h3>
            <div className="flex rounded-xl overflow-hidden h-20 border border-gray-200">
              {colors.map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
