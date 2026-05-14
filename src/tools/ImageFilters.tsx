"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface FilterState {
  grayscale: number;
  sepia: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  invert: number;
}

const defaultFilters: FilterState = {
  grayscale: 0,
  sepia: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  invert: 0,
};

export default function ImageFilters() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const isAcceptedFile = (f: File): boolean => {
    if (f.type.startsWith("image/")) return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "webp", "bmp", "gif", "tiff", "tif", "avif"].includes(ext);
  };

  const processFile = useCallback((file: File) => {
    if (!isAcceptedFile(file)) {
      setUploadError(`"${file.name}" is not a supported image.`);
      return;
    }
    setUploadError("");
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const filterString = `grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px) brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) hue-rotate(${filters.hueRotate}deg) invert(${filters.invert}%)`;

  const drawFiltered = useCallback(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.filter = filterString;
    ctx.drawImage(image, 0, 0);
    ctx.filter = "none";
  }, [image, filterString]);

  useEffect(() => { drawFiltered(); }, [drawFiltered]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "filtered-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const updateFilter = (key: keyof FilterState, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterControls: { key: keyof FilterState; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1, unit: "%" },
    { key: "contrast", label: "Contrast", min: 0, max: 200, step: 1, unit: "%" },
    { key: "saturate", label: "Saturate", min: 0, max: 200, step: 1, unit: "%" },
    { key: "grayscale", label: "Grayscale", min: 0, max: 100, step: 1, unit: "%" },
    { key: "sepia", label: "Sepia", min: 0, max: 100, step: 1, unit: "%" },
    { key: "blur", label: "Blur", min: 0, max: 20, step: 0.5, unit: "px" },
    { key: "hueRotate", label: "Hue Rotate", min: 0, max: 360, step: 1, unit: "deg" },
    { key: "invert", label: "Invert", min: 0, max: 100, step: 1, unit: "%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
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
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
            isDragging
              ? "border-purple-500 bg-purple-50 scale-[1.01] shadow-md"
              : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}
        >
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "🎨"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your image here" : "Drag & drop your image, or click to upload"}
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </div>
        {uploadError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ❌ {uploadError}
          </div>
        )}
      </div>

      {image && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filterControls.map((fc) => (
              <div key={fc.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {fc.label}: {filters[fc.key]}{fc.unit}
                </label>
                <input
                  type="range"
                  min={fc.min}
                  max={fc.max}
                  step={fc.step}
                  value={filters[fc.key]}
                  onChange={(e) => updateFilter(fc.key, parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            ))}
          </div>

          <div className="result-card flex justify-center">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">Download</button>
            <button onClick={() => setFilters({ ...defaultFilters })} className="btn-secondary text-sm !py-2 !px-4">Reset Filters</button>
            <button onClick={() => setImage(null)} className="btn-secondary text-sm !py-2 !px-4">New Image</button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an image to apply filters
        </div>
      )}
    </div>
  );
}
