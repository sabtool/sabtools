"use client";
import { useState, useRef, useCallback, useMemo } from "react";

export default function PixelArtMaker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [pixelSize, setPixelSize] = useState(8);
  const [colorCount, setColorCount] = useState(32);
  const [showGrid, setShowGrid] = useState(false);
  const [processed, setProcessed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setProcessed(false);
    };
    img.src = URL.createObjectURL(file);
  };

  const quantizeColor = useCallback((r: number, g: number, b: number, levels: number): [number, number, number] => {
    const step = 256 / levels;
    return [
      Math.round(Math.floor(r / step) * step + step / 2),
      Math.round(Math.floor(g / step) * step + step / 2),
      Math.round(Math.floor(b / step) * step + step / 2),
    ];
  }, []);

  const processImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxW = 800;
    const scale = Math.min(1, maxW / image.width);
    const w = Math.round(image.width * scale);
    const h = Math.round(image.height * scale);
    canvas.width = w;
    canvas.height = h;

    // Draw original scaled
    ctx.drawImage(image, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // Color levels per channel based on total palette size
    const levelsPerChannel = Math.max(2, Math.round(Math.pow(colorCount, 1 / 3)));

    // Clear and draw pixelated
    ctx.clearRect(0, 0, w, h);

    const blocksX = Math.ceil(w / pixelSize);
    const blocksY = Math.ceil(h / pixelSize);

    for (let by = 0; by < blocksY; by++) {
      for (let bx = 0; bx < blocksX; bx++) {
        const startX = bx * pixelSize;
        const startY = by * pixelSize;
        const endX = Math.min(startX + pixelSize, w);
        const endY = Math.min(startY + pixelSize, h);
        const blockW = endX - startX;
        const blockH = endY - startY;

        // Average color of block
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let py = startY; py < endY; py++) {
          for (let px = startX; px < endX; px++) {
            const idx = (py * w + px) * 4;
            rSum += data[idx];
            gSum += data[idx + 1];
            bSum += data[idx + 2];
            count++;
          }
        }

        if (count === 0) continue;
        const avgR = rSum / count;
        const avgG = gSum / count;
        const avgB = bSum / count;

        // Quantize
        const [qr, qg, qb] = quantizeColor(avgR, avgG, avgB, levelsPerChannel);

        ctx.fillStyle = `rgb(${qr},${qg},${qb})`;
        ctx.fillRect(startX, startY, blockW, blockH);
      }
    }

    // Grid overlay
    if (showGrid) {
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    setProcessed(true);
  }, [image, pixelSize, colorCount, showGrid, quantizeColor]);

  const canvasStats = useMemo(() => {
    if (!image) return null;
    const maxW = 800;
    const scale = Math.min(1, maxW / image.width);
    const w = Math.round(image.width * scale);
    const h = Math.round(image.height * scale);
    return {
      width: w,
      height: h,
      blocksX: Math.ceil(w / pixelSize),
      blocksY: Math.ceil(h / pixelSize),
      totalBlocks: Math.ceil(w / pixelSize) * Math.ceil(h / pixelSize),
    };
  }, [image, pixelSize]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `pixel-art-${pixelSize}px.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">🎨</div>
        <div className="text-sm font-semibold text-gray-700">{image ? "Image loaded! Click to change" : "Click to upload image"}</div>
        <div className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {image && (
        <>
          {/* Controls */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Pixel Art Settings</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-600">Pixel Block Size</label>
                  <span className="text-xs font-bold text-indigo-600">{pixelSize}px</span>
                </div>
                <input type="range" min={4} max={32} step={1} value={pixelSize} onChange={(e) => setPixelSize(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>4px (detailed)</span>
                  <span>32px (chunky)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Color Palette</label>
                <div className="flex flex-wrap gap-2">
                  {[8, 16, 32, 64].map((c) => (
                    <button key={c} onClick={() => setColorCount(c)} className={colorCount === c ? "btn-primary" : "btn-secondary"}>
                      {c} Colors
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="rounded" />
                  <span className="text-xs font-semibold text-gray-600">Show Grid Overlay</span>
                </label>
              </div>

              <button onClick={processImage} className="btn-primary w-full">
                Generate Pixel Art
              </button>
            </div>
          </div>

          {/* Stats */}
          {canvasStats && (
            <div className="result-card">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Canvas Size</div>
                  <div className="text-sm font-bold text-gray-800">{canvasStats.width}x{canvasStats.height}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Grid</div>
                  <div className="text-sm font-bold text-gray-800">{canvasStats.blocksX}x{canvasStats.blocksY}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Total Blocks</div>
                  <div className="text-sm font-bold text-gray-800">{canvasStats.totalBlocks.toLocaleString()}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Colors</div>
                  <div className="text-sm font-bold text-gray-800">{colorCount}</div>
                </div>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              {processed ? "Pixel Art Result" : "Click 'Generate Pixel Art' to process"}
            </h3>
            <div className="flex justify-center overflow-auto">
              <canvas ref={canvasRef} className="border rounded-xl shadow-lg" style={{ maxWidth: "100%", height: "auto", imageRendering: "pixelated" }} />
            </div>
          </div>

          {/* Download */}
          {processed && (
            <div className="flex gap-3">
              <button onClick={download} className="btn-primary">Download Pixel Art (PNG)</button>
              <button onClick={() => { setShowGrid(!showGrid); setTimeout(processImage, 50); }} className="btn-secondary">
                Toggle Grid & Regenerate
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
