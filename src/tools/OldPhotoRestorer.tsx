"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface RestoreSettings {
  contrast: number;
  brightness: number;
  warmth: number;
  sharpen: number;
  deYellow: number;
}

const defaults: RestoreSettings = {
  contrast: 20,
  brightness: 5,
  warmth: 10,
  sharpen: 50,
  deYellow: 30,
};

export default function OldPhotoRestorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<RestoreSettings>({ ...defaults });
  const [showBefore, setShowBefore] = useState(false);
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
        const oCtx = oCanvas.getContext("2d");
        if (oCtx) oCtx.drawImage(img, 0, 0);
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

  const applyRestore = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(image, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;

    // Brightness & Contrast
    const contrastFactor = (259 * (settings.contrast * 2.55 + 255)) / (255 * (259 - settings.contrast * 2.55));
    const brightnessOffset = settings.brightness * 2.55;

    for (let i = 0; i < data.length; i += 4) {
      // Brightness
      let r = data[i] + brightnessOffset;
      let g = data[i + 1] + brightnessOffset;
      let b = data[i + 2] + brightnessOffset;

      // Contrast
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;

      // Warmth (increase red slightly)
      r += settings.warmth * 0.3;
      g += settings.warmth * 0.1;

      // De-yellow (reduce yellow tint = reduce red and green in yellowish pixels)
      const yellowness = Math.min(data[i], data[i + 1]) - data[i + 2];
      if (yellowness > 20) {
        const deYellowStrength = (settings.deYellow / 100) * (yellowness / 255);
        r -= deYellowStrength * 30;
        g -= deYellowStrength * 20;
        b += deYellowStrength * 15;
      }

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imgData, 0, 0);

    // Unsharp mask for sharpening
    if (settings.sharpen > 0) {
      const sharpened = ctx.getImageData(0, 0, w, h);
      const src = new Uint8ClampedArray(sharpened.data);
      const amount = settings.sharpen / 100;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          for (let c = 0; c < 3; c++) {
            const center = src[idx + c] * 5;
            const neighbors =
              src[((y - 1) * w + x) * 4 + c] +
              src[((y + 1) * w + x) * 4 + c] +
              src[(y * w + x - 1) * 4 + c] +
              src[(y * w + x + 1) * 4 + c];
            const sharpVal = center - neighbors;
            sharpened.data[idx + c] = Math.max(0, Math.min(255, src[idx + c] + sharpVal * amount));
          }
        }
      }
      ctx.putImageData(sharpened, 0, 0);
    }
  }, [image, settings]);

  useEffect(() => {
    applyRestore();
  }, [applyRestore]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "restored-photo.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const autoEnhance = () => {
    setSettings({ ...defaults });
  };

  const controls: { key: keyof RestoreSettings; label: string; min: number; max: number }[] = [
    { key: "contrast", label: "Contrast Boost", min: 0, max: 50 },
    { key: "brightness", label: "Brightness Boost", min: -20, max: 30 },
    { key: "warmth", label: "Warmth", min: 0, max: 40 },
    { key: "sharpen", label: "Sharpen", min: 0, max: 100 },
    { key: "deYellow", label: "Reduce Yellow Tint", min: 0, max: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Old Photo</label>
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Drop an old photo here or click to upload"
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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "📷"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your photo here" : "Drag & drop your old photo, or click to upload"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {controls.map((ctrl) => (
              <div key={ctrl.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {ctrl.label}: {settings[ctrl.key]}
                </label>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  value={settings[ctrl.key]}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, [ctrl.key]: parseInt(e.target.value) }))
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            ))}
          </div>

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
            <button onClick={autoEnhance} className="btn-secondary text-sm !py-2 !px-4">
              Auto Enhance
            </button>
            <button onClick={() => setImage(null)} className="btn-secondary text-sm !py-2 !px-4">
              New Image
            </button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an old photo to restore and enhance it
        </div>
      )}
    </div>
  );
}
