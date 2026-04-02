"use client";
import { useState, useRef } from "react";

export default function ImageToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [resultUrl, setResultUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = (f: File, q: number) => {
    setFile(f);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => { if (blob) setResultUrl(URL.createObjectURL(blob)); }, "image/jpeg", q);
    };
    img.src = URL.createObjectURL(f);
  };

  return (
    <div className="space-y-6">
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition">
        <div className="text-4xl mb-3">📸</div>
        <div className="text-sm font-semibold text-gray-700">{file ? file.name : "Click to upload image (PNG, WebP, BMP)"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && convert(e.target.files[0], quality)} className="hidden" />
      </div>
      {file && (
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Quality</label><span className="text-sm font-bold text-indigo-600">{Math.round(quality * 100)}%</span></div>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => { setQuality(+e.target.value); convert(file, +e.target.value); }} className="w-full" />
        </div>
      )}
      {resultUrl && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500 mb-3">Converted to JPG successfully!</div>
          <a href={resultUrl} download={`${file?.name?.replace(/\.[^.]+$/, "")}.jpg`} className="btn-primary inline-block">Download JPG</a>
        </div>
      )}
    </div>
  );
}
