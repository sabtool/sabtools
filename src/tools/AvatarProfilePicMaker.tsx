"use client";
import { useState, useRef, useCallback, useMemo } from "react";

type CropShape = "circle" | "square";

export default function AvatarProfilePicMaker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [shape, setShape] = useState<CropShape>("circle");
  const [borderColor, setBorderColor] = useState("#6366F1");
  const [borderWidth, setBorderWidth] = useState(6);
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [outputSize, setOutputSize] = useState(400);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const presetSizes = useMemo(() => [
    { size: 400, label: "400x400 (HD)" },
    { size: 200, label: "200x200 (Medium)" },
    { size: 100, label: "100x100 (Small)" },
  ], []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d")!;
    const S = outputSize;
    canvas.width = S;
    canvas.height = S;

    // Clear with transparency
    ctx.clearRect(0, 0, S, S);

    if (shape === "circle") {
      // Background circle
      if (bgColor !== "transparent") {
        ctx.beginPath();
        ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
        ctx.fillStyle = bgColor;
        ctx.fill();
      }

      // Border circle
      if (borderWidth > 0) {
        ctx.beginPath();
        ctx.arc(S / 2, S / 2, S / 2 - borderWidth / 2, 0, Math.PI * 2);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.stroke();
      }

      // Clip circle for image
      ctx.save();
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S / 2 - borderWidth, 0, Math.PI * 2);
      ctx.clip();

      // Draw image cover-fit
      const scale = Math.max(S / image.width, S / image.height);
      const iw = image.width * scale;
      const ih = image.height * scale;
      ctx.drawImage(image, (S - iw) / 2, (S - ih) / 2, iw, ih);
      ctx.restore();
    } else {
      // Square mode
      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, S, S);
      }

      // Border
      if (borderWidth > 0) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, S - borderWidth, S - borderWidth);
      }

      // Draw image
      ctx.save();
      ctx.beginPath();
      ctx.rect(borderWidth, borderWidth, S - borderWidth * 2, S - borderWidth * 2);
      ctx.clip();
      const scale = Math.max(S / image.width, S / image.height);
      const iw = image.width * scale;
      const ih = image.height * scale;
      ctx.drawImage(image, (S - iw) / 2, (S - ih) / 2, iw, ih);
      ctx.restore();
    }
  }, [image, shape, borderColor, borderWidth, bgColor, outputSize]);

  useState(() => {
    setTimeout(render, 100);
  });

  const download = () => {
    render();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `avatar-${outputSize}x${outputSize}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">👤</div>
        <div className="text-sm font-semibold text-gray-700">{image ? "Change photo" : "Upload your photo"}</div>
        <div className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Shape</label>
          <div className="flex gap-3">
            <button onClick={() => { setShape("circle"); setTimeout(render, 50); }} className={shape === "circle" ? "btn-primary" : "btn-secondary"}>Circle</button>
            <button onClick={() => { setShape("square"); setTimeout(render, 50); }} className={shape === "square" ? "btn-primary" : "btn-secondary"}>Square</button>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Output Size</label>
          <div className="flex flex-wrap gap-2">
            {presetSizes.map((p) => (
              <button
                key={p.size}
                onClick={() => { setOutputSize(p.size); setTimeout(render, 50); }}
                className={outputSize === p.size ? "btn-primary" : "btn-secondary"}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Border Color</label>
          <input type="color" value={borderColor} onChange={(e) => { setBorderColor(e.target.value); setTimeout(render, 50); }} className="w-full h-10 rounded-lg cursor-pointer" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Border: {borderWidth}px</label>
          <input type="range" min={0} max={20} value={borderWidth} onChange={(e) => { setBorderWidth(+e.target.value); setTimeout(render, 50); }} className="w-full" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Background Color</label>
          <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setTimeout(render, 50); }} className="w-full h-10 rounded-lg cursor-pointer" />
        </div>
      </div>

      {image && (
        <>
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Preview</h3>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded-xl"
                style={{
                  maxWidth: 300,
                  maxHeight: 300,
                  background: "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 16px 16px",
                }}
              />
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">{outputSize}x{outputSize}px &middot; PNG with transparency</p>
          </div>

          <button onClick={download} className="btn-primary">
            Download Avatar
          </button>
        </>
      )}
    </div>
  );
}
