"use client";
import { useState, useRef, useMemo, useCallback } from "react";

const presets = [
  { name: "Instagram Post", width: 1080, height: 1080, platform: "Instagram" },
  { name: "Instagram Story", width: 1080, height: 1920, platform: "Instagram" },
  { name: "Facebook Cover", width: 820, height: 312, platform: "Facebook" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, platform: "YouTube" },
  { name: "LinkedIn Banner", width: 1584, height: 396, platform: "LinkedIn" },
  { name: "Twitter Header", width: 1500, height: 500, platform: "Twitter/X" },
];

export default function SocialMediaImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const preset = useMemo(() => presets[selectedPreset], [selectedPreset]);

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
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const downloadResized = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = preset.width;
    canvas.height = preset.height;

    const img = new Image();
    img.onload = () => {
      const srcRatio = img.width / img.height;
      const destRatio = preset.width / preset.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;

      if (srcRatio > destRatio) {
        sw = img.height * destRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / destRatio;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, preset.width, preset.height);
      const link = document.createElement("a");
      link.download = `resized-${preset.width}x${preset.height}-${fileName || "image.png"}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
        <div
          onClick={() => fileRef.current?.click()}
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
              fileRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
            isDragging
              ? "border-purple-500 bg-purple-50 scale-[1.01] shadow-md"
              : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}
        >
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "📱"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your image here" : "Drag & drop your image, or click to upload"}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
        {uploadError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ❌ {uploadError}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Platform Preset</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {presets.map((p, i) => (
            <button key={i} onClick={() => setSelectedPreset(i)} className={selectedPreset === i ? "btn-primary text-sm" : "btn-secondary text-sm"}>
              {p.name}<br /><span className="text-xs opacity-75">{p.width} x {p.height}</span>
            </button>
          ))}
        </div>
      </div>

      {image && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{preset.name}</h3>
              <p className="text-sm text-gray-500">{preset.width} x {preset.height}px ({preset.platform})</p>
            </div>
            <button onClick={downloadResized} className="btn-primary">Download Resized</button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex justify-center">
            <img src={image} alt="Image preview for resizing" className="max-h-64 rounded-lg object-contain" loading="lazy" />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
