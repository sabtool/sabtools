"use client";
import { useState, useRef, useCallback } from "react";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isAcceptedFile = (f: File): boolean => {
    if (f.type.startsWith("image/")) return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "webp", "bmp", "gif", "tiff", "tif", "avif"].includes(ext);
  };

  const processFile = useCallback((f: File) => {
    if (!isAcceptedFile(f)) {
      setUploadError(`"${f.name}" is not a supported image.`);
      return;
    }
    setUploadError("");
    setFile(f);
    const img = new Image();
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(String(img.width)); setHeight(String(img.height)); };
    img.src = URL.createObjectURL(f);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
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
      const f = e.dataTransfer?.files?.[0];
      if (f) processFile(f);
    },
    [processFile]
  );

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
        <div className="text-4xl mb-3">{isDragging ? "⬇️" : "↔️"}</div>
        <div className="text-sm font-semibold text-gray-700">
          {isDragging ? "Drop your image here" : file ? file.name : "Drag & drop your image, or click to upload"}
        </div>
        {origW > 0 && <div className="text-xs text-gray-400 mt-1">Original: {origW} × {origH}px</div>}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {uploadError}
        </div>
      )}
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
