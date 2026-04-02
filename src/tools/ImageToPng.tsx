"use client";
import { useState, useRef } from "react";

export default function ImageToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = (f: File) => {
    setFile(f);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob((blob) => { if (blob) setResultUrl(URL.createObjectURL(blob)); }, "image/png");
    };
    img.src = URL.createObjectURL(f);
  };

  return (
    <div className="space-y-6">
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition">
        <div className="text-4xl mb-3">🖼️</div>
        <div className="text-sm font-semibold text-gray-700">{file ? file.name : "Click to upload image (JPG, WebP, BMP)"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && convert(e.target.files[0])} className="hidden" />
      </div>
      {resultUrl && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500 mb-3">Converted to PNG successfully!</div>
          <a href={resultUrl} download={`${file?.name?.replace(/\.[^.]+$/, "")}.png`} className="btn-primary inline-block">Download PNG</a>
        </div>
      )}
    </div>
  );
}
