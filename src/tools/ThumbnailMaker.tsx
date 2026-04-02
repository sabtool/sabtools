"use client";
import { useState, useRef, useCallback, useMemo } from "react";

type PresetSize = "youtube" | "blog" | "instagram";
type TextPosition = "top" | "center" | "bottom";

export default function ThumbnailMaker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [title, setTitle] = useState("Your Title Here");
  const [subtitle, setSubtitle] = useState("Subtitle text");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textPosition, setTextPosition] = useState<TextPosition>("center");
  const [fontSize, setFontSize] = useState(64);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [preset, setPreset] = useState<PresetSize>("youtube");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = useMemo(() => ({
    youtube: { w: 1280, h: 720, label: "YouTube (1280x720)" },
    blog: { w: 1200, h: 630, label: "Blog (1200x630)" },
    instagram: { w: 1080, h: 1080, label: "Instagram (1080x1080)" },
  }), []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { w, h } = presets[preset];
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, w, h);

    // Draw image cover-fit
    if (image) {
      const scale = Math.max(w / image.width, h / image.height);
      const iw = image.width * scale;
      const ih = image.height * scale;
      ctx.drawImage(image, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }

    // Overlay
    let oy = 0;
    const overlayH = h * 0.45;
    if (textPosition === "top") oy = 0;
    else if (textPosition === "center") oy = (h - overlayH) / 2;
    else oy = h - overlayH;

    ctx.fillStyle = `rgba(0,0,0,${overlayOpacity})`;
    ctx.fillRect(0, oy, w, overlayH);

    // Title
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    const titleY = textPosition === "top" ? oy + overlayH * 0.45 : textPosition === "center" ? h / 2 - 10 : oy + overlayH * 0.4;

    // Word-wrap title
    const maxW = w * 0.85;
    const words = title.split(" ");
    let line = "";
    const lines: string[] = [];
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = test;
      }
    }
    lines.push(line.trim());

    const lineH = fontSize * 1.2;
    const startY = titleY - ((lines.length - 1) * lineH) / 2;
    lines.forEach((l, i) => {
      ctx.fillText(l, w / 2, startY + i * lineH);
    });

    // Subtitle
    if (subtitle) {
      ctx.font = `${Math.round(fontSize * 0.45)}px Arial, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.85;
      ctx.fillText(subtitle, w / 2, startY + lines.length * lineH + 10);
      ctx.globalAlpha = 1;
    }
  }, [image, title, subtitle, textColor, textPosition, fontSize, overlayOpacity, preset, presets]);

  // Auto render
  useState(() => {
    setTimeout(render, 100);
  });

  const download = () => {
    render();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `thumbnail-${preset}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">🎬</div>
        <div className="text-sm font-semibold text-gray-700">{image ? "Change background image" : "Upload background image"}</div>
        <div className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Title Text</label>
          <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setTimeout(render, 50); }} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Subtitle Text</label>
          <input type="text" value={subtitle} onChange={(e) => { setSubtitle(e.target.value); setTimeout(render, 50); }} className="calc-input" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Text Color</label>
          <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); setTimeout(render, 50); }} className="w-full h-10 rounded-lg cursor-pointer" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Text Position</label>
          <select value={textPosition} onChange={(e) => { setTextPosition(e.target.value as TextPosition); setTimeout(render, 50); }} className="calc-input">
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Font Size: {fontSize}px</label>
          <input type="range" min={24} max={120} value={fontSize} onChange={(e) => { setFontSize(+e.target.value); setTimeout(render, 50); }} className="w-full" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Overlay: {Math.round(overlayOpacity * 100)}%</label>
          <input type="range" min={0} max={1} step={0.05} value={overlayOpacity} onChange={(e) => { setOverlayOpacity(+e.target.value); setTimeout(render, 50); }} className="w-full" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Preset Size</label>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(presets) as PresetSize[]).map((p) => (
            <button
              key={p}
              onClick={() => { setPreset(p); setTimeout(render, 50); }}
              className={preset === p ? "btn-primary" : "btn-secondary"}
            >
              {presets[p].label}
            </button>
          ))}
        </div>
      </div>

      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Preview</h3>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-gray-200" />
      </div>

      <button onClick={download} className="btn-primary">
        Download Thumbnail
      </button>
    </div>
  );
}
