"use client";
import { useState, useRef, useCallback } from "react";

export default function ImageToWebp() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [resultUrl, setResultUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

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
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResultUrl(URL.createObjectURL(blob));
              setConvertedSize(blob.size);
            }
          },
          "image/webp",
          q
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const isAcceptedFile = (file: File): boolean => {
    if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") return true;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png"].includes(ext);
  };

  const processFile = useCallback((file: File) => {
    if (!isAcceptedFile(file)) {
      setUploadError(`"${file.name}" is not a supported image. Accepted: JPG, PNG.`);
      return;
    }
    setUploadError("");
    setOriginalFile(file);
    setOriginalSize(file.size);
    convert(file, quality);
  }, [quality]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

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
      const file = e.dataTransfer?.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (originalFile) convert(originalFile, q);
  };

  const savings = originalSize > 0 ? ((1 - convertedSize / originalSize) * 100).toFixed(1) : "0";

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
        aria-label="Drop a JPG or PNG image here or click to upload"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
          isDragging
            ? "border-purple-500 bg-purple-50 scale-[1.01] shadow-md"
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"
        }`}
      >
        <div className="text-4xl mb-3">{isDragging ? "⬇️" : "🌐"}</div>
        <div className="text-sm font-semibold text-gray-700">
          {isDragging ? "Drop your image here" : "Drag & drop your JPG or PNG, or click to upload"}
        </div>
        <div className="text-xs text-gray-400 mt-1">Converts to WebP for smaller file sizes</div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleFile} className="hidden" />
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {uploadError}
        </div>
      )}

      {originalFile && (
        <>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">WebP Quality</label>
              <span className="text-sm font-bold text-indigo-600">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => handleQualityChange(+e.target.value)}
              className="w-full"
            />
          </div>

          <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Original ({originalFile.type.split("/")[1].toUpperCase()})</div>
              <div className="text-xl font-bold text-gray-800">{formatSize(originalSize)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">WebP Size</div>
              <div className="text-xl font-bold text-green-600">{formatSize(convertedSize)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Savings</div>
              <div className={`text-xl font-bold ${+savings > 0 ? "text-green-600" : "text-orange-500"}`}>
                {+savings > 0 ? `${savings}%` : `+${Math.abs(+savings).toFixed(1)}%`}
              </div>
            </div>
          </div>

          {resultUrl && (
            <a
              href={resultUrl}
              download={`${originalFile.name.replace(/\.[^.]+$/, "")}.webp`}
              className="btn-primary inline-block text-center text-sm w-full"
            >
              Download WebP
            </a>
          )}
        </>
      )}
    </div>
  );
}
