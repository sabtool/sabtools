"use client";
import { useState, useRef } from "react";

const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<{ size: number; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = (f: File) => {
    setFile(f);
    const img = new Image();
    img.onload = () => {
      const generated = sizes.map((s) => {
        const canvas = document.createElement("canvas");
        canvas.width = s; canvas.height = s;
        canvas.getContext("2d")!.drawImage(img, 0, 0, s, s);
        return { size: s, url: canvas.toDataURL("image/png") };
      });
      setResults(generated);
    };
    img.src = URL.createObjectURL(f);
  };

  return (
    <div className="space-y-6">
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition">
        <div className="text-4xl mb-3">⭐</div>
        <div className="text-sm font-semibold text-gray-700">{file ? file.name : "Upload an image to generate favicons"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && generate(e.target.files[0])} className="hidden" />
      </div>
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{results.map(({ size, url }) => (
          <div key={size} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <img src={url} alt={`${size}x${size}`} width={Math.min(size, 64)} height={Math.min(size, 64)} className="mx-auto mb-2" style={{ imageRendering: "pixelated" }} />
            <div className="text-xs font-bold text-gray-700">{size}×{size}</div>
            <a href={url} download={`favicon-${size}x${size}.png`} className="text-xs text-indigo-600 hover:underline">Download</a>
          </div>
        ))}</div>
      )}
    </div>
  );
}
