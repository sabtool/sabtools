"use client";
import { useState, useRef, useCallback } from "react";

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropW, setCropW] = useState("200");
  const [cropH, setCropH] = useState("200");
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
    setImgSrc(URL.createObjectURL(f));
    setResultUrl("");
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

  const crop = () => {
    if (!imgSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const x = parseInt(cropX), y = parseInt(cropY), w = parseInt(cropW), h = parseInt(cropH);
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, x, y, w, h, 0, 0, w, h);
      canvas.toBlob((blob) => { if (blob) setResultUrl(URL.createObjectURL(blob)); }, "image/png");
    };
    img.src = imgSrc;
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
        <div className="text-4xl mb-3">{isDragging ? "⬇️" : "✂️"}</div>
        <div className="text-sm font-semibold text-gray-700">
          {isDragging ? "Drop your image here" : file ? file.name : "Drag & drop your image, or click to upload"}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {uploadError}
        </div>
      )}
      {imgSrc && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">X</label><input type="number" value={cropX} onChange={(e) => setCropX(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Y</label><input type="number" value={cropY} onChange={(e) => setCropY(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Width</label><input type="number" value={cropW} onChange={(e) => setCropW(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Height</label><input type="number" value={cropH} onChange={(e) => setCropH(e.target.value)} className="calc-input" /></div>
          </div>
          <button onClick={crop} className="btn-primary">Crop Image</button>
          {resultUrl && <a href={resultUrl} download={`cropped-${file?.name}`} className="btn-secondary inline-block text-center text-sm">Download Cropped Image</a>}
        </>
      )}
    </div>
  );
}
