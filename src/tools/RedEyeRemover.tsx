"use client";
import { useState, useRef, useCallback } from "react";

interface ClickPoint {
  x: number;
  y: number;
}

export default function RedEyeRemover() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalData, setOriginalData] = useState<ImageData | null>(null);
  const [clicks, setClicks] = useState<ClickPoint[]>([]);
  const [radius, setRadius] = useState(30);
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
    img.onload = () => {
      setImage(img);
      setClicks([]);
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setOriginalData(ctx.getImageData(0, 0, img.width, img.height));
    };
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

  const removeRedEye = useCallback(
    (px: number, py: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const r2 = radius * radius;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > r2) continue;
          const x = px + dx;
          const y = py + dy;
          if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

          const idx = (y * canvas.width + x) * 4;
          const red = data[idx];
          const green = data[idx + 1];
          const blue = data[idx + 2];

          // Detect red pixels
          if (red > 100 && red > green * 1.5 && red > blue * 1.5) {
            // Replace with darkened desaturated version
            const avg = (green + blue) / 2;
            const darkened = avg * 0.5;
            data[idx] = darkened;
            data[idx + 1] = darkened;
            data[idx + 2] = darkened;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
    },
    [radius]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      setClicks((prev) => [...prev, { x, y }]);
      removeRedEye(x, y);
    },
    [removeRedEye]
  );

  const undoLast = useCallback(() => {
    if (!originalData || !canvasRef.current || clicks.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Restore original then replay all clicks except last
    ctx.putImageData(originalData, 0, 0);
    const newClicks = clicks.slice(0, -1);
    newClicks.forEach((pt) => removeRedEye(pt.x, pt.y));
    setClicks(newClicks);
  }, [originalData, clicks, removeRedEye]);

  const resetAll = useCallback(() => {
    if (!originalData || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(originalData, 0, 0);
    setClicks([]);
  }, [originalData]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "red-eye-removed.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "👁️"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your photo here" : "Drag & drop your photo, or click to upload"}
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Detection Radius: {radius}px
            </label>
            <input
              type="range"
              min={10}
              max={80}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="result-card">
            <p className="text-sm text-gray-600 mb-3">
              Click on red eye areas in the image to fix them. {clicks.length} correction(s) applied.
            </p>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-w-full h-auto rounded-lg border border-gray-200 cursor-crosshair"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">
              Download
            </button>
            <button onClick={undoLast} disabled={clicks.length === 0} className="btn-secondary text-sm !py-2 !px-4 disabled:opacity-50">
              Undo Last
            </button>
            <button onClick={resetAll} className="btn-secondary text-sm !py-2 !px-4">
              Reset All
            </button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload a photo to remove red eye
        </div>
      )}
    </div>
  );
}
