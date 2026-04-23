"use client";
import { useState, useRef, useEffect } from "react";
import { compressImage } from "@/lib/image-compress-worker";

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [compressedUrl, setCompressedUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke any old object URL when the component is replaced, to avoid leaks.
  useEffect(() => {
    return () => {
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [compressedUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);
    setOriginalSize(file.size);
    compress(file, quality);
  };

  const compress = async (file: File, q: number) => {
    setBusy(true);
    try {
      const blob = await compressImage(file, q, "image/jpeg");
      // Free the previous object URL before creating a new one.
      setCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setCompressedSize(blob.size);
    } finally {
      setBusy(false);
    }
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (originalFile) compress(originalFile, q);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const savings = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">📦</div>
        <div className="text-sm font-semibold text-gray-700">Click or drag to upload image</div>
        <div className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {originalFile && (
        <>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Quality</label>
              <span className="text-sm font-bold text-indigo-600">{Math.round(quality * 100)}%</span>
            </div>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => handleQualityChange(+e.target.value)} className="w-full" />
          </div>

          <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Original Size</div>
              <div className="text-xl font-bold text-gray-800">{formatSize(originalSize)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Compressed Size</div>
              <div className="text-xl font-bold text-green-600">{formatSize(compressedSize)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Savings</div>
              <div className="text-xl font-bold text-indigo-600">{savings}%</div>
            </div>
          </div>

          {compressedUrl && !busy && (
            <a href={compressedUrl} download={`compressed-${originalFile.name}`} className="btn-primary inline-block text-center text-sm">
              Download Compressed Image
            </a>
          )}
          {busy && (
            <div className="text-sm text-gray-500 italic">Compressing... (runs off the main thread so the UI stays responsive)</div>
          )}
        </>
      )}
    </div>
  );
}
