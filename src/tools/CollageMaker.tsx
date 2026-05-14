"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Layout = "2x1" | "1x2" | "2x2" | "3x1" | "2x3" | "3x2";

const layoutConfigs: Record<Layout, { cols: number; rows: number; min: number; max: number }> = {
  "2x1": { cols: 2, rows: 1, min: 2, max: 2 },
  "1x2": { cols: 1, rows: 2, min: 2, max: 2 },
  "2x2": { cols: 2, rows: 2, min: 3, max: 4 },
  "3x1": { cols: 3, rows: 1, min: 3, max: 3 },
  "2x3": { cols: 2, rows: 3, min: 4, max: 6 },
  "3x2": { cols: 3, rows: 2, min: 4, max: 6 },
};

export default function CollageMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [layout, setLayout] = useState<Layout>("2x2");
  const [gap, setGap] = useState(10);
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const isAcceptedFile = (f: File): boolean => {
    if (f.type.startsWith("image/")) return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "webp", "bmp", "gif", "tiff", "tif", "avif"].includes(ext);
  };

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    const accepted: File[] = [];
    const rejected: string[] = [];
    arr.forEach((f) => {
      if (isAcceptedFile(f)) accepted.push(f);
      else rejected.push(f.name);
    });
    if (rejected.length > 0) {
      setUploadError(`Skipped ${rejected.length} non-image file(s): ${rejected.join(", ")}.`);
    } else {
      setUploadError("");
    }
    const slice = accepted.slice(0, 6);
    const loaded: HTMLImageElement[] = [];
    slice.forEach((file) => {
      const img = new Image();
      img.onload = () => {
        loaded.push(img);
        if (loaded.length === slice.length) {
          setImages(loaded);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
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
      if (e.dataTransfer?.files) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const drawCollage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = layoutConfigs[layout];
    const cellW = 300;
    const cellH = 300;
    const totalW = config.cols * cellW + (config.cols + 1) * gap;
    const totalH = config.rows * cellH + (config.rows + 1) * gap;

    canvas.width = totalW;
    canvas.height = totalH;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalW, totalH);

    const totalCells = config.cols * config.rows;
    for (let i = 0; i < totalCells && i < images.length; i++) {
      const col = i % config.cols;
      const row = Math.floor(i / config.cols);
      const x = gap + col * (cellW + gap);
      const y = gap + row * (cellH + gap);
      const img = images[i];

      // Cover fit
      const scale = Math.max(cellW / img.width, cellH / img.height);
      const sw = cellW / scale;
      const sh = cellH / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, cellW, cellH, 8);
      ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh, x, y, cellW, cellH);
      ctx.restore();
    }
  }, [images, layout, gap, bgColor]);

  useEffect(() => { drawCollage(); }, [drawCollage]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "collage.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images (2-6)</label>
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Drop 2-6 images here or click to upload"
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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "🖼️"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your images here" : "Drag & drop 2-6 images, or click to upload"}
          </div>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </div>
        {uploadError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ❌ {uploadError}
          </div>
        )}
        {images.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">{images.length} image(s) loaded</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Layout</label>
          <select value={layout} onChange={(e) => setLayout(e.target.value as Layout)} className="calc-input">
            {Object.keys(layoutConfigs).map((l) => (
              <option key={l} value={l}>{l} ({layoutConfigs[l as Layout].min}-{layoutConfigs[l as Layout].max} images)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Gap: {gap}px</label>
          <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="calc-input h-10 cursor-pointer" />
        </div>
      </div>

      {images.length > 0 ? (
        <>
          <div className="result-card flex justify-center overflow-auto">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
          </div>
          <div className="flex gap-3">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">Download Collage</button>
            <button onClick={() => setImages([])} className="btn-secondary text-sm !py-2 !px-4">Reset</button>
          </div>
        </>
      ) : (
        <div className="result-card text-center text-gray-400 py-12">
          Upload 2-6 images to create a collage
        </div>
      )}
    </div>
  );
}
