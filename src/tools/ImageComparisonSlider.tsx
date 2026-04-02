"use client";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";

type Mode = "slider" | "overlay";
type Direction = "horizontal" | "vertical";

export default function ImageComparisonSlider() {
  const [image1, setImage1] = useState<HTMLImageElement | null>(null);
  const [image2, setImage2] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<Mode>("slider");
  const [direction, setDirection] = useState<Direction>("horizontal");
  const [sliderPos, setSliderPos] = useState(50);
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const loadImage = (file: File, setter: (img: HTMLImageElement) => void) => {
    const img = new Image();
    img.onload = () => setter(img);
    img.src = URL.createObjectURL(file);
  };

  const canvasSize = useMemo(() => {
    if (!image1 && !image2) return { w: 600, h: 400 };
    const ref = image1 || image2;
    if (!ref) return { w: 600, h: 400 };
    const maxW = isFullscreen ? window.innerWidth - 40 : 800;
    const maxH = isFullscreen ? window.innerHeight - 100 : 600;
    const scale = Math.min(1, maxW / ref.width, maxH / ref.height);
    return { w: Math.round(ref.width * scale), h: Math.round(ref.height * scale) };
  }, [image1, image2, isFullscreen]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = canvasSize;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, w, h);

    if (!image1 && !image2) {
      ctx.fillStyle = "#999";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload two images to compare", w / 2, h / 2);
      return;
    }

    if (mode === "slider") {
      const splitVal = sliderPos / 100;
      if (direction === "horizontal") {
        const splitX = Math.round(w * splitVal);
        // Draw image1 on left
        if (image1) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, splitX, h);
          ctx.clip();
          ctx.drawImage(image1, 0, 0, w, h);
          ctx.restore();
        }
        // Draw image2 on right
        if (image2) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(splitX, 0, w - splitX, h);
          ctx.clip();
          ctx.drawImage(image2, 0, 0, w, h);
          ctx.restore();
        }
        // Slider line
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, h);
        ctx.stroke();
        ctx.shadowBlur = 0;
        // Slider handle
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(splitX, h / 2, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#4F46E5";
        ctx.lineWidth = 3;
        ctx.stroke();
        // Arrows
        ctx.fillStyle = "#4F46E5";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("\u25C0 \u25B6", splitX, h / 2);
        // Labels
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 3;
        ctx.textAlign = "left";
        ctx.fillText("Before", 8, 20);
        ctx.textAlign = "right";
        ctx.fillText("After", w - 8, 20);
        ctx.shadowBlur = 0;
      } else {
        const splitY = Math.round(h * splitVal);
        if (image1) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, w, splitY);
          ctx.clip();
          ctx.drawImage(image1, 0, 0, w, h);
          ctx.restore();
        }
        if (image2) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, splitY, w, h - splitY);
          ctx.clip();
          ctx.drawImage(image2, 0, 0, w, h);
          ctx.restore();
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(0, splitY);
        ctx.lineTo(w, splitY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(w / 2, splitY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#4F46E5";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#4F46E5";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("\u25B2 \u25BC", w / 2, splitY);
      }
    } else {
      // Overlay mode
      if (image1) ctx.drawImage(image1, 0, 0, w, h);
      if (image2) {
        ctx.globalAlpha = overlayOpacity / 100;
        ctx.drawImage(image2, 0, 0, w, h);
        ctx.globalAlpha = 1;
      }
    }
  }, [image1, image2, mode, direction, sliderPos, overlayOpacity, canvasSize]);

  useMemo(() => { drawCanvas(); }, [drawCanvas]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (mode !== "slider") return;
    setIsDragging(true);
    updateSliderFromMouse(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || mode !== "slider") return;
    updateSliderFromMouse(e);
  };

  const handleCanvasMouseUp = () => setIsDragging(false);

  const updateSliderFromMouse = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (direction === "horizontal") {
      const x = e.clientX - rect.left;
      setSliderPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    } else {
      const y = e.clientY - rect.top;
      setSliderPos(Math.max(0, Math.min(100, (y / rect.height) * 100)));
    }
  };

  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4" : "space-y-6"}>
      {/* Upload area */}
      {!isFullscreen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => input1Ref.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
          >
            <div className="text-3xl mb-2">🖼️</div>
            <div className="text-sm font-semibold text-gray-700">{image1 ? "Before image loaded" : "Upload Before Image"}</div>
            <input ref={input1Ref} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && loadImage(e.target.files[0], setImage1)} className="hidden" />
          </div>
          <div
            onClick={() => input2Ref.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
          >
            <div className="text-3xl mb-2">🖼️</div>
            <div className="text-sm font-semibold text-gray-700">{image2 ? "After image loaded" : "Upload After Image"}</div>
            <input ref={input2Ref} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && loadImage(e.target.files[0], setImage2)} className="hidden" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`result-card ${isFullscreen ? "bg-black/70 text-white mb-2" : ""}`}>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            <button onClick={() => setMode("slider")} className={mode === "slider" ? "btn-primary" : "btn-secondary"}>Slider</button>
            <button onClick={() => setMode("overlay")} className={mode === "overlay" ? "btn-primary" : "btn-secondary"}>Overlay</button>
          </div>
          {mode === "slider" && (
            <div className="flex gap-2">
              <button onClick={() => setDirection("horizontal")} className={direction === "horizontal" ? "btn-primary" : "btn-secondary"}>Horizontal</button>
              <button onClick={() => setDirection("vertical")} className={direction === "vertical" ? "btn-primary" : "btn-secondary"}>Vertical</button>
            </div>
          )}
          {mode === "overlay" && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-xs font-semibold">Opacity:</span>
              <input type="range" min={0} max={100} value={overlayOpacity} onChange={(e) => setOverlayOpacity(+e.target.value)} className="flex-1" />
              <span className="text-xs font-bold text-indigo-600">{overlayOpacity}%</span>
            </div>
          )}
          <button onClick={toggleFullscreen} className="btn-secondary ml-auto">
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
        {mode === "slider" && (
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-gray-600">Slider Position</span>
              <span className="text-xs font-bold text-indigo-600">{Math.round(sliderPos)}%</span>
            </div>
            <input type="range" min={0} max={100} value={sliderPos} onChange={(e) => setSliderPos(+e.target.value)} className="w-full" />
          </div>
        )}
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border rounded-xl shadow-lg cursor-ew-resize max-w-full"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>

      {isFullscreen && (
        <div className="text-white/60 text-xs mt-2">Press ESC to exit fullscreen</div>
      )}
    </div>
  );
}
