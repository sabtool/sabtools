"use client";
import { useState, useRef } from "react";

export default function WebpToJpg() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [resultUrl, setResultUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const convert = (file: File, q: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResultUrl(URL.createObjectURL(blob));
              setConvertedSize(blob.size);
            }
          },
          "image/jpeg",
          q
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);
    setOriginalSize(file.size);
    convert(file, quality);
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (originalFile) convert(originalFile, q);
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">📸</div>
        <div className="text-sm font-semibold text-gray-700">Click to upload WebP image</div>
        <div className="text-xs text-gray-400 mt-1">Converts WebP to JPG format</div>
        <input ref={inputRef} type="file" accept="image/webp,image/*" onChange={handleFile} className="hidden" />
      </div>

      {originalFile && (
        <>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">JPG Quality</label>
              <span className="text-sm font-bold text-indigo-600">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => handleQualityChange(+e.target.value)}
              className="w-full"
            />
          </div>

          <div className="result-card grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Original WebP</div>
              <div className="text-xl font-bold text-gray-800">{formatSize(originalSize)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">JPG Size</div>
              <div className="text-xl font-bold text-green-600">{formatSize(convertedSize)}</div>
            </div>
          </div>

          {resultUrl && (
            <a
              href={resultUrl}
              download={`${originalFile.name.replace(/\.[^.]+$/, "")}.jpg`}
              className="btn-primary inline-block text-center text-sm w-full"
            >
              Download JPG
            </a>
          )}
        </>
      )}
    </div>
  );
}
