"use client";
import { useState, useRef, useCallback, useMemo } from "react";

interface ImageItem {
  id: string;
  file: File;
  img: HTMLImageElement;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  resizedUrl?: string;
}

export default function BulkImageResizer() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [mode, setMode] = useState<"dimensions" | "percentage">("percentage");
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [percentage, setPercentage] = useState(50);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 20);
    files.forEach((file) => {
      const img = new Image();
      img.onload = () => {
        const item: ImageItem = {
          id: Math.random().toString(36).slice(2),
          file,
          img,
          originalWidth: img.width,
          originalHeight: img.height,
          newWidth: img.width,
          newHeight: img.height,
        };
        setImages((prev) => [...prev, item]);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const calculatedImages = useMemo(() => {
    return images.map((item) => {
      let nw: number, nh: number;
      if (mode === "percentage") {
        nw = Math.round(item.originalWidth * (percentage / 100));
        nh = Math.round(item.originalHeight * (percentage / 100));
      } else {
        nw = targetWidth;
        nh = targetHeight;
        if (maintainAspect) {
          const ratio = item.originalWidth / item.originalHeight;
          if (nw / nh > ratio) {
            nw = Math.round(nh * ratio);
          } else {
            nh = Math.round(nw / ratio);
          }
        }
      }
      return { ...item, newWidth: nw, newHeight: nh };
    });
  }, [images, mode, percentage, targetWidth, targetHeight, maintainAspect]);

  const resizeAll = useCallback(async () => {
    setProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updated = calculatedImages.map((item) => {
      canvas.width = item.newWidth;
      canvas.height = item.newHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(item.img, 0, 0, item.newWidth, item.newHeight);
      const url = canvas.toDataURL("image/png");
      return { ...item, resizedUrl: url };
    });

    setImages(updated);
    setProcessing(false);
  }, [calculatedImages]);

  const downloadSingle = (item: ImageItem) => {
    if (!item.resizedUrl) return;
    const link = document.createElement("a");
    const name = item.file.name.replace(/\.[^.]+$/, "");
    link.download = `${name}-resized.png`;
    link.href = item.resizedUrl;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((item, i) => {
      if (!item.resizedUrl) return;
      setTimeout(() => downloadSingle(item), i * 200);
    });
  };

  const percentagePresets = [25, 50, 75, 100];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Images (up to 20)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="calc-input text-sm"
        />
      </div>

      {images.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Resize Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "dimensions" | "percentage")}
                className="calc-input text-sm"
              >
                <option value="percentage">By Percentage</option>
                <option value="dimensions">By Dimensions</option>
              </select>
            </div>

            {mode === "percentage" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Scale: {percentage}%
                </label>
                <div className="flex gap-2 mb-2">
                  {percentagePresets.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPercentage(p)}
                      className={`text-xs px-3 py-1 rounded ${
                        percentage === p ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={10}
                  max={200}
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div>
                    <label className="block text-xs text-gray-600">Width</label>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => setTargetWidth(parseInt(e.target.value) || 1)}
                      className="calc-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Height</label>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => setTargetHeight(parseInt(e.target.value) || 1)}
                      className="calc-input text-sm"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  Maintain aspect ratio
                </label>
              </div>
            )}
          </div>

          <div className="result-card">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              {calculatedImages.length} image(s) queued
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {calculatedImages.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">{item.file.name}</span>
                  <span className="text-xs text-gray-500">
                    {item.originalWidth}x{item.originalHeight} → {item.newWidth}x{item.newHeight}
                  </span>
                  {item.resizedUrl && (
                    <button onClick={() => downloadSingle(item)} className="text-xs text-indigo-600 hover:underline">
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={resizeAll} disabled={processing} className="btn-primary text-sm !py-2 !px-4 disabled:opacity-50">
              {processing ? "Processing..." : "Resize All"}
            </button>
            {images.some((i) => i.resizedUrl) && (
              <button onClick={downloadAll} className="btn-primary text-sm !py-2 !px-4">
                Download All
              </button>
            )}
            <button onClick={() => setImages([])} className="btn-secondary text-sm !py-2 !px-4">
              Clear All
            </button>
          </div>
        </>
      )}

      {images.length === 0 && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload images to resize them in bulk
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
