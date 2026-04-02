"use client";
import { useState, useRef, useCallback, useMemo } from "react";

type FrameStyle = "classic-wood" | "polaroid" | "modern-black" | "festive-gold" | "diwali" | "christmas";

export default function PhotoFrameMaker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("polaroid");
  const [caption, setCaption] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const frames = useMemo<{ id: FrameStyle; name: string; icon: string }[]>(() => [
    { id: "classic-wood", name: "Classic Wood", icon: "🪵" },
    { id: "polaroid", name: "Polaroid", icon: "📷" },
    { id: "modern-black", name: "Modern Black", icon: "⬛" },
    { id: "festive-gold", name: "Festive Gold", icon: "✨" },
    { id: "diwali", name: "Diwali Special", icon: "🪔" },
    { id: "christmas", name: "Christmas", icon: "🎄" },
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

    const imgW = image.width;
    const imgH = image.height;
    let padT = 40, padB = 40, padL = 40, padR = 40;

    if (frameStyle === "polaroid") { padT = 30; padL = 30; padR = 30; padB = 120; }
    else if (frameStyle === "classic-wood") { padT = 50; padB = 50; padL = 50; padR = 50; }
    else if (frameStyle === "modern-black") { padT = 20; padB = 20; padL = 20; padR = 20; }
    else if (frameStyle === "festive-gold") { padT = 45; padB = 45; padL = 45; padR = 45; }
    else if (frameStyle === "diwali") { padT = 55; padB = 55; padL = 55; padR = 55; }
    else if (frameStyle === "christmas") { padT = 50; padB = 50; padL = 50; padR = 50; }

    const W = imgW + padL + padR;
    const H = imgH + padT + padB;
    canvas.width = W;
    canvas.height = H;

    // Frame backgrounds
    if (frameStyle === "classic-wood") {
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(0, 0, W, H);
      // Wood grain lines
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < H; i += 6) {
        ctx.beginPath();
        ctx.moveTo(0, i + Math.sin(i * 0.05) * 3);
        ctx.lineTo(W, i + Math.cos(i * 0.05) * 3);
        ctx.stroke();
      }
      // Inner shadow
      ctx.strokeStyle = "#5C4510";
      ctx.lineWidth = 3;
      ctx.strokeRect(padL - 5, padT - 5, imgW + 10, imgH + 10);
    } else if (frameStyle === "polaroid") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, W, H);
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 20;
      ctx.fillRect(0, 0, W, H);
      ctx.shadowBlur = 0;
    } else if (frameStyle === "modern-black") {
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 2;
      ctx.strokeRect(padL - 3, padT - 3, imgW + 6, imgH + 6);
    } else if (frameStyle === "festive-gold") {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#FFD700");
      grad.addColorStop(0.5, "#DAA520");
      grad.addColorStop(1, "#FFD700");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      // Ornamental inner border
      ctx.strokeStyle = "#B8860B";
      ctx.lineWidth = 3;
      ctx.strokeRect(15, 15, W - 30, H - 30);
      ctx.strokeStyle = "#FFF8DC";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, W - 40, H - 40);
    } else if (frameStyle === "diwali") {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#FF6B00");
      grad.addColorStop(0.5, "#FFD700");
      grad.addColorStop(1, "#FF6B00");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      // Decorative dots (diyas)
      ctx.fillStyle = "#8B0000";
      for (let i = 0; i < W; i += 30) {
        ctx.beginPath(); ctx.arc(i, 12, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(i, H - 12, 5, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < H; i += 30) {
        ctx.beginPath(); ctx.arc(12, i, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(W - 12, i, 5, 0, Math.PI * 2); ctx.fill();
      }
      // Glow dots
      ctx.fillStyle = "#FFFF00";
      for (let i = 15; i < W; i += 30) {
        ctx.beginPath(); ctx.arc(i, 12, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(i, H - 12, 2, 0, Math.PI * 2); ctx.fill();
      }
    } else if (frameStyle === "christmas") {
      ctx.fillStyle = "#1A472A";
      ctx.fillRect(0, 0, W, H);
      // Red-green stripes
      ctx.fillStyle = "#C41E3A";
      ctx.fillRect(0, 0, W, 15);
      ctx.fillRect(0, H - 15, W, 15);
      ctx.fillRect(0, 0, 15, H);
      ctx.fillRect(W - 15, 0, 15, H);
      // Snow dots
      ctx.fillStyle = "#FFFFFF";
      for (let i = 20; i < W; i += 25) {
        ctx.beginPath(); ctx.arc(i, 28, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(i, H - 28, 3, 0, Math.PI * 2); ctx.fill();
      }
      // Gold ornaments at corners
      ctx.fillStyle = "#FFD700";
      ctx.beginPath(); ctx.arc(25, 25, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(W - 25, 25, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(25, H - 25, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(W - 25, H - 25, 8, 0, Math.PI * 2); ctx.fill();
    }

    // Draw image
    ctx.drawImage(image, padL, padT, imgW, imgH);

    // Polaroid caption
    if (frameStyle === "polaroid" && caption) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#333333";
      ctx.font = `italic ${Math.max(20, imgW * 0.035)}px Georgia, serif`;
      ctx.fillText(caption, W / 2, imgH + padT + 60, imgW);
    }
  }, [image, frameStyle, caption]);

  useState(() => {
    setTimeout(render, 100);
  });

  const download = () => {
    render();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `photo-${frameStyle}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">🖼️</div>
        <div className="text-sm font-semibold text-gray-700">{image ? "Change photo" : "Upload your photo"}</div>
        <div className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Frame Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {frames.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFrameStyle(f.id); setTimeout(render, 50); }}
              className={`p-3 rounded-xl border-2 text-left transition ${frameStyle === f.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <span className="text-xl mr-2">{f.icon}</span>
              <span className="font-semibold text-sm">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {frameStyle === "polaroid" && (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => { setCaption(e.target.value); setTimeout(render, 50); }}
            placeholder="Write your caption..."
            className="calc-input"
          />
        </div>
      )}

      {image && (
        <>
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Preview</h3>
            <div className="flex justify-center">
              <canvas ref={canvasRef} className="rounded-xl border border-gray-200" style={{ maxWidth: "100%", maxHeight: 500 }} />
            </div>
          </div>
          <button onClick={download} className="btn-primary">Download Framed Photo</button>
        </>
      )}
    </div>
  );
}
