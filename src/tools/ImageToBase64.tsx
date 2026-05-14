"use client";
import { useState, useRef, useCallback } from "react";

const ACCEPTED_EXTS = [
  "jpg", "jpeg", "png", "webp", "bmp", "gif", "svg",
  "ico", "tiff", "tif", "avif", "heic", "heif", "jfif",
];

const isAcceptedFile = (file: File): boolean => {
  if (file.type.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  return ACCEPTED_EXTS.includes(ext);
};

export default function ImageToBase64() {
  const [result, setResult] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const processFile = useCallback((file: File) => {
    if (!isAcceptedFile(file)) {
      setUploadError(
        `"${file.name}" is not a supported image. Accepted: JPG, PNG, WebP, BMP, GIF, SVG, HEIC, TIFF, AVIF, ICO.`
      );
      return;
    }
    setUploadError("");
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => { setResult(reader.result as string); };
    reader.readAsDataURL(file);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    processFile(file);
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
        <div className="text-4xl mb-3">{isDragging ? "⬇️" : "🖼️"}</div>
        <div className="text-sm font-semibold text-gray-700">
          {isDragging ? "Drop your image here" : (fileName || "Drag & drop your image, or click to upload")}
        </div>
        {fileSize > 0 && <div className="text-xs text-gray-400 mt-1">{(fileSize / 1024).toFixed(1)} KB</div>}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {uploadError}
        </div>
      )}
      {result && (
        <div>
          <div className="text-sm text-gray-500 mb-2">Base64 string length: <strong>{result.length.toLocaleString()}</strong> characters</div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Base64 Output</label><button onClick={() => navigator.clipboard?.writeText(result)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div>
          <textarea value={result} readOnly className="calc-input min-h-[150px] font-mono text-xs bg-gray-50 break-all" rows={6} />
          <div className="mt-3"><label className="text-sm font-semibold text-gray-700 block mb-2">HTML Tag</label>
            <div className="flex justify-between mb-1"><span className="text-xs text-gray-400">Ready to use in HTML</span><button onClick={() => navigator.clipboard?.writeText(`<img src="${result}" alt="${fileName}" />`)} className="text-xs text-indigo-600 font-medium hover:underline">Copy HTML</button></div>
            <pre className="bg-gray-900 text-green-400 rounded-xl p-3 text-xs font-mono overflow-auto">{`<img src="${result.slice(0, 50)}..." alt="${fileName}" />`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
