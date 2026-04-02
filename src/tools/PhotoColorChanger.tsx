"use client";
import { useState, useRef, useCallback, useMemo } from "react";

export default function PhotoColorChanger() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalData, setOriginalData] = useState<ImageData | null>(null);
  const [sourceColor, setSourceColor] = useState<string>("#ff0000");
  const [targetColor, setTargetColor] = useState<string>("#0000ff");
  const [tolerance, setTolerance] = useState(30);
  const [picking, setPicking] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setApplied(false);
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
  };

  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!picking || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      setSourceColor(rgbToHex(pixel[0], pixel[1], pixel[2]));
      setPicking(false);
    },
    [picking, rgbToHex]
  );

  const sourceRgb = useMemo(() => hexToRgb(sourceColor), [sourceColor, hexToRgb]);
  const targetRgb = useMemo(() => hexToRgb(targetColor), [targetColor, hexToRgb]);

  const applyColorChange = useCallback(() => {
    if (!originalData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = new ImageData(
      new Uint8ClampedArray(originalData.data),
      originalData.width,
      originalData.height
    );
    const data = imgData.data;
    const tolSq = tolerance * tolerance * 3;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - sourceRgb.r;
      const dg = data[i + 1] - sourceRgb.g;
      const db = data[i + 2] - sourceRgb.b;
      const distSq = dr * dr + dg * dg + db * db;

      if (distSq <= tolSq) {
        const blend = 1 - Math.sqrt(distSq) / Math.sqrt(tolSq);
        data[i] = Math.round(data[i] + (targetRgb.r - sourceRgb.r) * blend);
        data[i + 1] = Math.round(data[i + 1] + (targetRgb.g - sourceRgb.g) * blend);
        data[i + 2] = Math.round(data[i + 2] + (targetRgb.b - sourceRgb.b) * blend);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setApplied(true);

    // Draw preview (before)
    const pCanvas = previewCanvasRef.current;
    if (pCanvas && image) {
      pCanvas.width = image.width;
      pCanvas.height = image.height;
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) pCtx.drawImage(image, 0, 0);
    }
  }, [originalData, sourceRgb, targetRgb, tolerance, image]);

  const resetImage = useCallback(() => {
    if (!originalData || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(originalData, 0, 0);
    setApplied(false);
  }, [originalData]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "color-changed.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleUpload} className="calc-input text-sm" />
      </div>

      {image && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Source Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={sourceColor}
                  onChange={(e) => setSourceColor(e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{sourceColor}</span>
                <button
                  onClick={() => setPicking(!picking)}
                  className={`text-sm px-3 py-1 rounded ${picking ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  {picking ? "Click on image..." : "Pick from image"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Replacement Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={targetColor}
                  onChange={(e) => setTargetColor(e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{targetColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tolerance: {tolerance}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-xs text-gray-500 mt-1">Higher tolerance matches more similar shades</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={applyColorChange} className="btn-primary text-sm !py-2 !px-4">
              Apply Color Change
            </button>
            <button onClick={resetImage} className="btn-secondary text-sm !py-2 !px-4">
              Reset
            </button>
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">
              Download
            </button>
          </div>

          {applied && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="result-card">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Before</h3>
                <canvas ref={previewCanvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
              </div>
              <div className="result-card">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">After</h3>
                <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" onClick={handleCanvasClick} style={{ cursor: picking ? "crosshair" : "default" }} />
              </div>
            </div>
          )}

          {!applied && (
            <div className="result-card flex justify-center">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" onClick={handleCanvasClick} style={{ cursor: picking ? "crosshair" : "default" }} />
            </div>
          )}
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an image to change colors
        </div>
      )}
    </div>
  );
}
