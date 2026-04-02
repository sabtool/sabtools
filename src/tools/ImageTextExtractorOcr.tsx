"use client";
import { useState, useRef, useCallback, useMemo } from "react";

interface SelectionBox {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export default function ImageTextExtractorOcr() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [boxes, setBoxes] = useState<SelectionBox[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [enhanceMode, setEnhanceMode] = useState<"none" | "dark-text" | "light-text">("none");
  const [contrast, setContrast] = useState(1.5);
  const [brightness, setBrightness] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxIdRef = useRef(0);

  const ocrServices = useMemo(() => [
    { name: "Google Lens", url: "https://lens.google.com/", desc: "Upload image for text extraction" },
    { name: "OnlineOCR.net", url: "https://www.onlineocr.net/", desc: "Free OCR with multiple languages" },
    { name: "i2OCR", url: "https://www.i2ocr.com/", desc: "Free online OCR in 100+ languages" },
    { name: "NewOCR.com", url: "https://www.newocr.com/", desc: "Simple free OCR tool" },
  ], []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setBoxes([]);
      setEnhanceMode("none");
    };
    img.src = URL.createObjectURL(file);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxW = 800;
    const scale = Math.min(1, maxW / image.width);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (enhanceMode !== "none") {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        // Apply contrast
        r = Math.min(255, Math.max(0, (r - 128) * contrast + 128 + brightness));
        g = Math.min(255, Math.max(0, (g - 128) * contrast + 128 + brightness));
        b = Math.min(255, Math.max(0, (b - 128) * contrast + 128 + brightness));

        if (enhanceMode === "dark-text") {
          // Enhance dark text on light bg: make dark pixels darker, light pixels lighter
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 128) {
            r = Math.max(0, r * 0.5);
            g = Math.max(0, g * 0.5);
            b = Math.max(0, b * 0.5);
          } else {
            r = Math.min(255, r + (255 - r) * 0.5);
            g = Math.min(255, g + (255 - g) * 0.5);
            b = Math.min(255, b + (255 - b) * 0.5);
          }
        } else if (enhanceMode === "light-text") {
          // Enhance light text on dark bg: invert for better visibility
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum > 128) {
            r = Math.min(255, r + (255 - r) * 0.5);
            g = Math.min(255, g + (255 - g) * 0.5);
            b = Math.min(255, b + (255 - b) * 0.5);
          } else {
            r = Math.max(0, r * 0.5);
            g = Math.max(0, g * 0.5);
            b = Math.max(0, b * 0.5);
          }
        }
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }, [image, enhanceMode, contrast, brightness]);

  const drawOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    const mainCanvas = canvasRef.current;
    if (!canvas || !mainCanvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = mainCanvas.width;
    canvas.height = mainCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw selection boxes
    boxes.forEach((box, idx) => {
      ctx.strokeStyle = "#FF4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.setLineDash([]);
      // Label
      ctx.fillStyle = "#FF4444";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`Region ${idx + 1}${box.label ? ": " + box.label : ""}`, box.x + 4, box.y - 4);
    });

    // Draw current box while drawing
    if (currentBox) {
      ctx.strokeStyle = "#4488FF";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
      ctx.setLineDash([]);
    }
  }, [boxes, currentBox]);

  // Redraw when dependencies change
  useMemo(() => { drawCanvas(); }, [drawCanvas]);
  useMemo(() => { drawOverlay(); }, [drawOverlay]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e);
    setStartPos(pos);
    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const pos = getCanvasPos(e);
    setCurrentBox({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y),
    });
  };

  const handleMouseUp = () => {
    if (!drawing || !currentBox) {
      setDrawing(false);
      return;
    }
    if (currentBox.w > 10 && currentBox.h > 10) {
      boxIdRef.current += 1;
      setBoxes((prev) => [
        ...prev,
        { id: boxIdRef.current, ...currentBox, label: "" },
      ]);
    }
    setCurrentBox(null);
    setDrawing(false);
  };

  const removeBox = (id: number) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBoxLabel = (id: number, label: string) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, label } : b)));
  };

  const analyzeTextRegions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const blockSize = 16;
    const cols = Math.ceil(canvas.width / blockSize);
    const rows = Math.ceil(canvas.height / blockSize);
    const highContrastBlocks: { x: number; y: number }[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let minLum = 255, maxLum = 0;
        for (let py = 0; py < blockSize && row * blockSize + py < canvas.height; py++) {
          for (let px = 0; px < blockSize && col * blockSize + px < canvas.width; px++) {
            const idx = ((row * blockSize + py) * canvas.width + (col * blockSize + px)) * 4;
            const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            if (lum < minLum) minLum = lum;
            if (lum > maxLum) maxLum = lum;
          }
        }
        if (maxLum - minLum > 80) {
          highContrastBlocks.push({ x: col * blockSize, y: row * blockSize });
        }
      }
    }

    // Cluster blocks into regions
    if (highContrastBlocks.length === 0) return;

    // Simple grouping: find bounding rect of consecutive blocks
    const regions: { x: number; y: number; w: number; h: number }[] = [];
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    highContrastBlocks.forEach((b) => {
      if (b.x < minX) minX = b.x;
      if (b.y < minY) minY = b.y;
      if (b.x + blockSize > maxX) maxX = b.x + blockSize;
      if (b.y + blockSize > maxY) maxY = b.y + blockSize;
    });

    // Split into horizontal bands
    const bandHeight = 40;
    for (let y = minY; y < maxY; y += bandHeight) {
      const bandBlocks = highContrastBlocks.filter(
        (b) => b.y >= y && b.y < y + bandHeight
      );
      if (bandBlocks.length > 3) {
        let bMinX = canvas.width, bMaxX = 0;
        bandBlocks.forEach((b) => {
          if (b.x < bMinX) bMinX = b.x;
          if (b.x + blockSize > bMaxX) bMaxX = b.x + blockSize;
        });
        regions.push({ x: bMinX - 4, y: y - 4, w: bMaxX - bMinX + 8, h: bandHeight + 8 });
      }
    }

    if (regions.length > 0) {
      const newBoxes = regions.slice(0, 10).map((r, i) => ({
        id: ++boxIdRef.current,
        ...r,
        label: `Detected region ${i + 1}`,
      }));
      setBoxes(newBoxes);
    }
  }, []);

  const downloadEnhanced = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "enhanced-image.png";
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
        <div className="text-4xl mb-3">🔍</div>
        <div className="text-sm font-semibold text-gray-700">Click or drag to upload image</div>
        <div className="text-xs text-gray-400 mt-1">Upload an image to detect text regions</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {image && (
        <>
          {/* Enhancement Controls */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Text Enhancement</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {(["none", "dark-text", "light-text"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setEnhanceMode(mode)}
                  className={enhanceMode === mode ? "btn-primary" : "btn-secondary"}
                >
                  {mode === "none" ? "Original" : mode === "dark-text" ? "Enhance Dark Text" : "Enhance Light Text"}
                </button>
              ))}
            </div>

            {enhanceMode !== "none" && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">Contrast</label>
                    <span className="text-xs font-bold text-indigo-600">{contrast.toFixed(1)}x</span>
                  </div>
                  <input type="range" min={0.5} max={3} step={0.1} value={contrast} onChange={(e) => setContrast(+e.target.value)} className="calc-input w-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">Brightness</label>
                    <span className="text-xs font-bold text-indigo-600">{brightness}</span>
                  </div>
                  <input type="range" min={-100} max={100} step={5} value={brightness} onChange={(e) => setBrightness(+e.target.value)} className="calc-input w-full" />
                </div>
              </div>
            )}
          </div>

          {/* Canvas with overlay */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Draw selection boxes around text regions (click & drag)
            </h3>
            <div className="relative inline-block border rounded-xl overflow-hidden">
              <canvas ref={canvasRef} className="block" />
              <canvas
                ref={overlayCanvasRef}
                className="absolute top-0 left-0 cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={analyzeTextRegions} className="btn-primary">
              Auto-Detect Text Regions
            </button>
            <button onClick={downloadEnhanced} className="btn-secondary">
              Download Enhanced Image
            </button>
            <button onClick={() => setBoxes([])} className="btn-secondary">
              Clear Selections
            </button>
          </div>

          {/* Selection Boxes List */}
          {boxes.length > 0 && (
            <div className="result-card">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Selected Text Regions ({boxes.length})</h3>
              <div className="space-y-2">
                {boxes.map((box, idx) => (
                  <div key={box.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-bold text-indigo-600 min-w-[24px]">#{idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Add label..."
                      value={box.label}
                      onChange={(e) => updateBoxLabel(box.id, e.target.value)}
                      className="calc-input flex-1 text-xs"
                    />
                    <span className="text-xs text-gray-400">{Math.round(box.w)}x{Math.round(box.h)}px</span>
                    <button onClick={() => removeBox(box.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OCR Services */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Extract Text Using Free OCR Services</h3>
            <p className="text-xs text-gray-500 mb-4">
              True OCR requires machine learning models. Use these free services to extract text from your image:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ocrServices.map((svc) => (
                <a
                  key={svc.name}
                  href={svc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition"
                >
                  <div className="text-sm font-bold text-indigo-600">{svc.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{svc.desc}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="result-card bg-blue-50/50">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Tips for Better Text Extraction</h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
              <li>Use &quot;Enhance Dark Text&quot; for black text on light backgrounds</li>
              <li>Use &quot;Enhance Light Text&quot; for white text on dark backgrounds</li>
              <li>Increase contrast to make text sharper before downloading</li>
              <li>Draw selection boxes to mark text areas for reference</li>
              <li>Download the enhanced image and upload to an OCR service above</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
