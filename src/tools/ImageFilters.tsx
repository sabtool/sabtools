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
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

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
        <input type="file" accept="image/*" onChange={handleUpload} className="calc-input text-sm" />
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
