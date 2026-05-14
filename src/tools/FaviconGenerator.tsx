"use client";
import { useState, useRef, useCallback } from "react";

const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<{ size: number; url: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isAcceptedFile = (f: File): boolean => {
    if (f.type.startsWith("image/")) return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "webp", "bmp", "gif", "svg", "tiff", "tif", "avif"].includes(ext);
  };

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

  const processFile = useCallback((f: File) => {
    if (!isAcceptedFile(f)) {
      setUploadError(`"${f.name}" is not a supported image.`);
      return;
    }
    setUploadError("");
    generate(f);
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
        aria-label="Drop an image here or click to upload"
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
        <div className="text-4xl mb-3">{isDragging ? "⬇️" : "⭐"}</div>
        <div className="text-sm font-semibold text-gray-700">
          {isDragging ? "Drop your image here" : file ? file.name : "Drag & drop your image, or click to upload"}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} className="hidden" />
      </div>
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {uploadError}
        </div>
      )}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{results.map(({ size, url }) => (
          <div key={size} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <img src={url} alt={`Generated favicon at ${size}x${size} pixels`} width={Math.min(size, 64)} height={Math.min(size, 64)} className="mx-auto mb-2" style={{ imageRendering: "pixelated" }} />
            <div className="text-xs font-bold text-gray-700">{size}×{size}</div>
            <a href={url} download={`favicon-${size}x${size}.png`} className="text-xs text-indigo-600 hover:underline">Download</a>
          </div>
        ))}</div>
      )}
    </div>
  );
}
