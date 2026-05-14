"use client";
import { useState, useRef, useCallback } from "react";

export default function BlurBackground() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [blurRadius, setBlurRadius] = useState(8);
  const [drawing, setDrawing] = useState(false);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [showBefore, setShowBefore] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isAcceptedFile = (f: File): boolean => {
    if (f.type.startsWith("image/")) return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "webp", "bmp", "gif", "tiff", "tif", "avif"].includes(ext);
  };

  const drawImageOnCanvas = useCallback((img: HTMLImageElement, selection: typeof rect) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const maxW = Math.min(img.width, 800);
    const scale = maxW / img.width;
    cvs.width = img.width * scale;
    cvs.height = img.height * scale;
    const ctx = cvs.getContext("2d")!;
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    if (selection) {
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
      ctx.setLineDash([]);
      // dim outside area
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, cvs.width, selection.y); // top
      ctx.fillRect(0, selection.y + selection.h, cvs.width, cvs.height - selection.y - selection.h); // bottom
      ctx.fillRect(0, selection.y, selection.x, selection.h); // left
      ctx.fillRect(selection.x + selection.w, selection.y, cvs.width - selection.x - selection.w, selection.h); // right
    }
  }, []);

  const processFile = useCallback((file: File) => {
    if (!isAcceptedFile(file)) {
      setUploadError(`"${file.name}" is not a supported image.`);
      return;
    }
    setUploadError("");
    setOriginalFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRect(null);
    setResultUrl("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        drawImageOnCanvas(img, null);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [drawImageOnCanvas]);

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

  const getCanvasPos = (e: React.MouseEvent) => {
    const cvs = canvasRef.current!;
    const r = cvs.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (cvs.width / r.width),
      y: (e.clientY - r.top) * (cvs.height / r.height),
    };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    setStartPos(pos);
    setDrawing(true);
    setRect(null);
    setResultUrl("");
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !startPos || !image) return;
    const pos = getCanvasPos(e);
    const newRect = {
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y),
    };
    setRect(newRect);
    drawImageOnCanvas(image, newRect);
  };

  const onMouseUp = () => { setDrawing(false); };

  const applyBlur = () => {
    if (!image || !rect) return;
    const cvs = canvasRef.current!;
    const scaleX = image.width / cvs.width;
    const scaleY = image.height / cvs.height;
    const realRect = {
      x: rect.x * scaleX,
      y: rect.y * scaleY,
      w: rect.w * scaleX,
      h: rect.h * scaleY,
    };

    const out = document.createElement("canvas");
    out.width = image.width;
    out.height = image.height;
    const ctx = out.getContext("2d")!;

    // Draw blurred full image
    ctx.filter = `blur(${blurRadius}px)`;
    ctx.drawImage(image, 0, 0);
    ctx.filter = "none";

    // Clip and draw sharp subject area
    ctx.save();
    ctx.beginPath();
    ctx.rect(realRect.x, realRect.y, realRect.w, realRect.h);
    ctx.clip();
    ctx.drawImage(image, 0, 0);
    ctx.restore();

    setResultUrl(out.toDataURL("image/png"));
  };

  return (
    <div className="space-y-6">
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
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
          isDragging
            ? "border-purple-500 bg-purple-50 scale-[1.01] shadow-md"
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"
        }`}
      >
        <div className="text-4xl mb-3">{isDragging ? "⬇️" : "🔲"}</div>
        <div className="text-sm font-semibold text-gray-700">
          {isDragging ? "Drop your image here" : "Drag & drop your image, or click to upload"}
        </div>
        <div className="text-xs text-gray-400 mt-1">Then draw a rectangle around the subject to keep sharp</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {uploadError}
        </div>
      )}

      {image && (
        <>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Blur Intensity</label>
              <span className="text-sm font-bold text-indigo-600">{blurRadius}px</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={blurRadius}
              onChange={(e) => setBlurRadius(+e.target.value)}
              className="w-full"
            />
          </div>

          <div className="result-card">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Draw rectangle around subject to keep it sharp
            </div>
            <canvas
              ref={canvasRef}
              className="mx-auto rounded-lg border cursor-crosshair max-w-full"
              style={{ maxHeight: 500 }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />
          </div>

          {rect && rect.w > 5 && rect.h > 5 && (
            <button onClick={applyBlur} className="btn-primary text-sm w-full">
              Apply Background Blur
            </button>
          )}

          {resultUrl && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowBefore(false)}
                  className={!showBefore ? "btn-primary text-sm" : "btn-secondary text-sm"}
                >After</button>
                <button
                  onClick={() => setShowBefore(true)}
                  className={showBefore ? "btn-primary text-sm" : "btn-secondary text-sm"}
                >Before</button>
              </div>
              <div className="flex justify-center">
                <img
                  src={showBefore ? previewUrl : resultUrl}
                  alt={showBefore ? "Before" : "After"}
                  className="max-h-80 rounded-lg border"
                />
              </div>
              <a
                href={resultUrl}
                download={`blurred-bg-${originalFile?.name || "image.png"}`}
                className="btn-primary inline-block text-center text-sm w-full"
              >
                Download Result
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
