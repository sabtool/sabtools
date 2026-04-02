"use client";
import { useState, useRef } from "react";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    const img = new Image();
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(String(img.width)); setHeight(String(img.height)); };
    img.src = URL.createObjectURL(f);
  };

  const handleWidthChange = (w: string) => {
    setWidth(w);
    if (keepRatio && origW > 0) setHeight(String(Math.round((parseInt(w) / origW) * origH)));
  };

  const handleHeightChange = (h: string) => {
    setHeight(h);
    if (keepRatio && origH > 0) setWidth(String(Math.round((parseInt(h) / origH) * origW)));
  };

  const resize = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = parseInt(width); canvas.height = parseInt(height);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => { if (blob) setResultUrl(URL.createObjectURL(blob)); }, "image/png");
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="space-y-6">
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition">
        <div className="text-4xl mb-3">↔️</div>
        <div className="text-sm font-semibold text-gray-700">{file ? file.name : "Click to upload image"}</div>
        {origW > 0 && <div className="text-xs text-gray-400 mt-1">Original: {origW} × {origH}px</div>}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {file && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Width (px)</label><input type="number" value={width} onChange={(e) => handleWidthChange(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Height (px)</label><input type="number" value={height} onChange={(e) => handleHeightChange(e.target.value)} className="calc-input" /></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm text-gray-700">Keep aspect ratio</span></label>
          <button onClick={resize} className="btn-primary">Resize Image</button>
          {resultUrl && <a href={resultUrl} download={`resized-${file.name}`} className="btn-secondary inline-block text-center text-sm">Download Resized Image</a>}
        </>
      )}
    </div>
  );
}
