"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function ImageWatermark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [watermarkText, setWatermarkText] = useState("Watermark");
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#FFFFFF");
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>("center");
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

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    if (!watermarkText.trim()) return;

    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const w = canvas.width;
    const h = canvas.height;
    let x = w / 2;
    let y = h / 2;

    switch (position) {
      case "top-left": x = fontSize * 2; y = fontSize * 2; break;
      case "top-right": x = w - fontSize * 2; y = fontSize * 2; break;
      case "bottom-left": x = fontSize * 2; y = h - fontSize * 2; break;
      case "bottom-right": x = w - fontSize * 2; y = h - fontSize * 2; break;
      case "center": default: break;
    }

    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeText(watermarkText, x, y);
    ctx.fillText(watermarkText, x, y);
    ctx.globalAlpha = 1;
  }, [image, watermarkText, fontSize, color, opacity, position]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "watermarked-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const positions: { value: Position; label: string }[] = [
    { value: "center", label: "Center" },
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "💧"}</div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Watermark Text</label>
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            className="calc-input"
            placeholder="Enter watermark text..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
          <select value={position} onChange={(e) => setPosition(e.target.value as Position)} className="calc-input">
            {positions.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size: {fontSize}px</label>
          <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Opacity: {(opacity * 100).toFixed(0)}%</label>
          <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="calc-input h-10 cursor-pointer" />
        </div>
      </div>

      {image && (
        <>
          <div className="result-card flex justify-center">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
          </div>
          <div className="flex gap-3">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">Download</button>
            <button onClick={() => setImage(null)} className="btn-secondary text-sm !py-2 !px-4">Reset</button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an image to add a watermark
        </div>
      )}
    </div>
  );
}
