"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export default function NoiseReducer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [passes, setPasses] = useState(3);
  const [showBefore, setShowBefore] = useState(false);
  const [processing, setProcessing] = useState(false);
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
      const oCanvas = originalCanvasRef.current;
      if (oCanvas) {
        oCanvas.width = img.width;
        oCanvas.height = img.height;
        const ctx = oCanvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);
      }
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

  const applyNoiseReduction = useCallback(() => {
    if (!image || !canvasRef.current) return;
    setProcessing(true);

    const canvas = canvasRef.current;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(image, 0, 0);
    const w = canvas.width;
    const h = canvas.height;

    // Apply box blur multiple passes
    for (let pass = 0; pass < passes; pass++) {
      const imgData = ctx.getImageData(0, 0, w, h);
      const src = new Uint8ClampedArray(imgData.data);
      const dst = imgData.data;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          for (let c = 0; c < 3; c++) {
            // 3x3 median-like averaging (box blur)
            const values: number[] = [];
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                values.push(src[((y + dy) * w + (x + dx)) * 4 + c]);
              }
            }
            values.sort((a, b) => a - b);
            // Use median for better edge preservation
            dst[idx + c] = values[4];
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    setProcessing(false);
  }, [image, passes]);

  useEffect(() => {
    applyNoiseReduction();
  }, [applyNoiseReduction]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "noise-reduced.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const presets = [
    { label: "Light (1 pass)", value: 1 },
    { label: "Medium (3 passes)", value: 3 },
    { label: "Heavy (5 passes)", value: 5 },
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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "🔇"}</div>
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Presets</label>
            <div className="flex gap-2 flex-wrap">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPasses(p.value)}
                  className={`text-sm px-4 py-2 rounded-lg transition ${
                    passes === p.value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Intensity: {passes} pass{passes > 1 ? "es" : ""}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={passes}
              onChange={(e) => setPasses(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {processing && (
            <div className="text-center text-indigo-600 font-medium py-4">Processing...</div>
          )}

          <div className="result-card flex justify-center">
            <canvas
              ref={showBefore ? originalCanvasRef : canvasRef}
              className="max-w-full h-auto rounded-lg border border-gray-200"
            />
            <canvas ref={showBefore ? canvasRef : originalCanvasRef} className="hidden" />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">
              Download
            </button>
            <button
              onMouseDown={() => setShowBefore(true)}
              onMouseUp={() => setShowBefore(false)}
              onMouseLeave={() => setShowBefore(false)}
              className="btn-secondary text-sm !py-2 !px-4"
            >
              Hold to See Before
            </button>
            <button onClick={() => setImage(null)} className="btn-secondary text-sm !py-2 !px-4">
              New Image
            </button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an image to reduce noise
        </div>
      )}
    </div>
  );
}
