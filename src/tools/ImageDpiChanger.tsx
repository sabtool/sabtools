"use client";
import { useState, useRef, useCallback, useMemo } from "react";

export default function ImageDpiChanger() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [currentDpi, setCurrentDpi] = useState(72);
  const [targetDpi, setTargetDpi] = useState(300);
  const [resized, setResized] = useState(false);
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
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setResized(false);
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

  // Physical size based on current DPI
  const physicalWidth = useMemo(() => originalWidth / currentDpi, [originalWidth, currentDpi]);
  const physicalHeight = useMemo(() => originalHeight / currentDpi, [originalHeight, currentDpi]);

  // New pixel dimensions to maintain physical size at target DPI
  const newWidth = useMemo(() => Math.round(physicalWidth * targetDpi), [physicalWidth, targetDpi]);
  const newHeight = useMemo(() => Math.round(physicalHeight * targetDpi), [physicalHeight, targetDpi]);

  const applyDpiChange = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    setResized(true);
  }, [image, newWidth, newHeight]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `image-${targetDpi}dpi.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const dpiPresets = [72, 150, 300, 600];

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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "🖼️"}</div>
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
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Image Info</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>Original Dimensions:</div>
              <div className="font-medium">{originalWidth} x {originalHeight} px</div>
              <div>Physical Size (inches):</div>
              <div className="font-medium">{physicalWidth.toFixed(2)} x {physicalHeight.toFixed(2)} in</div>
              <div>Physical Size (cm):</div>
              <div className="font-medium">{(physicalWidth * 2.54).toFixed(2)} x {(physicalHeight * 2.54).toFixed(2)} cm</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Current DPI (source)
              </label>
              <input
                type="number"
                value={currentDpi}
                onChange={(e) => setCurrentDpi(Math.max(1, parseInt(e.target.value) || 72))}
                className="calc-input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Target DPI</label>
              <div className="flex gap-2 mb-2">
                {dpiPresets.map((d) => (
                  <button
                    key={d}
                    onClick={() => setTargetDpi(d)}
                    className={`text-xs px-3 py-1 rounded ${
                      targetDpi === d ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={targetDpi}
                onChange={(e) => setTargetDpi(Math.max(1, parseInt(e.target.value) || 72))}
                className="calc-input text-sm"
              />
            </div>
          </div>

          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Output Preview</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>New Dimensions:</div>
              <div className="font-medium">{newWidth} x {newHeight} px</div>
              <div>Print Size (inches):</div>
              <div className="font-medium">{(newWidth / targetDpi).toFixed(2)} x {(newHeight / targetDpi).toFixed(2)} in</div>
              <div>Print Size (cm):</div>
              <div className="font-medium">{((newWidth / targetDpi) * 2.54).toFixed(2)} x {((newHeight / targetDpi) * 2.54).toFixed(2)} cm</div>
              <div>Target DPI:</div>
              <div className="font-medium">{targetDpi}</div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={applyDpiChange} className="btn-primary text-sm !py-2 !px-4">
              Apply DPI Change
            </button>
            {resized && (
              <button onClick={download} className="btn-primary text-sm !py-2 !px-4">
                Download
              </button>
            )}
            <button onClick={() => setImage(null)} className="btn-secondary text-sm !py-2 !px-4">
              New Image
            </button>
          </div>

          {resized && (
            <div className="result-card flex justify-center">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
            </div>
          )}
          {!resized && <canvas ref={canvasRef} className="hidden" />}
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an image to change its DPI
        </div>
      )}
    </div>
  );
}
