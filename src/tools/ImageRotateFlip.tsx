"use client";
import { useState, useRef, useEffect, useCallback } from "react";

export default function ImageRotateFlip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
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
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
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

  const drawImage = useCallback(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isRotated = rotation === 90 || rotation === 270;
    const w = isRotated ? image.height : image.width;
    const h = isRotated ? image.width : image.height;
    canvas.width = w;
    canvas.height = h;
    setDimensions({ w, h });

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
  }, [image, rotation, flipH, flipV]);

  useEffect(() => { drawImage(); }, [drawImage]);

  const rotate = (deg: number) => {
    setRotation((prev) => (prev + deg + 360) % 360);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "rotated-image.png";
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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "🔄"}</div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Width</div>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">{dimensions.w}px</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Height</div>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">{dimensions.h}px</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Rotation</div>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">{rotation}°</div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => rotate(90)} className="btn-primary text-sm !py-2 !px-4">Rotate 90° CW</button>
            <button onClick={() => rotate(-90)} className="btn-primary text-sm !py-2 !px-4">Rotate 90° CCW</button>
            <button onClick={() => rotate(180)} className="btn-primary text-sm !py-2 !px-4">Rotate 180°</button>
            <button onClick={() => setFlipH((prev) => !prev)} className={`text-sm !py-2 !px-4 ${flipH ? "btn-primary" : "btn-secondary"}`}>
              Flip Horizontal {flipH ? "(ON)" : ""}
            </button>
            <button onClick={() => setFlipV((prev) => !prev)} className={`text-sm !py-2 !px-4 ${flipV ? "btn-primary" : "btn-secondary"}`}>
              Flip Vertical {flipV ? "(ON)" : ""}
            </button>
          </div>

          <div className="result-card flex justify-center overflow-auto">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
          </div>

          <div className="flex gap-3">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">Download</button>
            <button onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); }} className="btn-secondary text-sm !py-2 !px-4">Reset Transforms</button>
            <button onClick={() => setImage(null)} className="btn-secondary text-sm !py-2 !px-4">New Image</button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an image to rotate or flip it
        </div>
      )}
    </div>
  );
}
