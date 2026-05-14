"use client";
import { useState, useRef, useCallback } from "react";

export default function ScreenshotToCode() {
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isAcceptedFile = (f: File): boolean => {
    if (f.type.startsWith("image/")) return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "webp", "bmp", "gif", "tiff", "tif", "avif"].includes(ext);
  };

  const analyze = (f: File) => {
    setFile(f);
    const img = new Image();
    img.onload = () => {
      setDimensions({ w: img.width, h: img.height });
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 16) * 16;
        const g = Math.round(data[i + 1] / 16) * 16;
        const b = Math.round(data[i + 2] / 16) * 16;
        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }
      const sorted = Object.entries(colorMap).sort(([, a], [, b]) => b - a).slice(0, 10).map(([c]) => c);
      setColors(sorted);
    };
    img.src = URL.createObjectURL(f);
  };

  const processFile = useCallback((f: File) => {
    if (!isAcceptedFile(f)) {
      setUploadError(`"${f.name}" is not a supported image.`);
      return;
    }
    setUploadError("");
    analyze(f);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      const f = e.dataTransfer?.files?.[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Drop a screenshot here or click to upload"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
          isDragging
            ? "border-purple-500 bg-purple-50 scale-[1.01] shadow-md"
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
        }`}
      >
        <div className="text-4xl mb-3">{isDragging ? "⬇️" : "🖥️"}</div>
        <div className="text-sm font-semibold text-gray-700">
          {isDragging ? "Drop your screenshot here" : file ? file.name : "Drag & drop your screenshot, or click to upload"}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} className="hidden" />
      </div>
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {uploadError}
        </div>
      )}
      {file && (
        <div className="space-y-4">
          <div className="result-card grid grid-cols-2 gap-4">
            <div className="text-center"><div className="text-xs text-gray-500">Width</div><div className="text-2xl font-bold text-indigo-600">{dimensions.w}px</div></div>
            <div className="text-center"><div className="text-xs text-gray-500">Height</div><div className="text-2xl font-bold text-indigo-600">{dimensions.h}px</div></div>
          </div>
          {colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Palette (Top 10)</h3>
              <div className="grid grid-cols-5 gap-2">{colors.map((c) => (
                <div key={c} className="text-center cursor-pointer" onClick={() => navigator.clipboard?.writeText(c)}>
                  <div className="w-full h-16 rounded-xl border border-gray-200" style={{ background: c }} />
                  <div className="text-xs font-mono text-gray-600 mt-1">{c}</div>
                </div>
              ))}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
