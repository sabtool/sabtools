"use client";
import { useState, useRef, useCallback, useMemo } from "react";

type BorderStyle = "solid" | "gradient" | "double" | "rounded" | "shadow";

export default function ImageBorderAdder() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>("solid");
  const [borderWidth, setBorderWidth] = useState(20);
  const [innerPadding, setInnerPadding] = useState(0);
  const [cornerRadius, setCornerRadius] = useState(20);
  const [color1, setColor1] = useState("#4F46E5");
  const [color2, setColor2] = useState("#EC4899");
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowColor, setShadowColor] = useState("#000000");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxDisplayW = 800;
    const scale = Math.min(1, maxDisplayW / image.width);
    const imgW = Math.round(image.width * scale);
    const imgH = Math.round(image.height * scale);

    const totalPadding = borderWidth + innerPadding;
    const extraShadow = borderStyle === "shadow" ? shadowBlur * 2 : 0;

    const canvasW = imgW + totalPadding * 2 + extraShadow;
    const canvasH = imgH + totalPadding * 2 + extraShadow;
    canvas.width = canvasW;
    canvas.height = canvasH;

    // Clear with transparent
    ctx.clearRect(0, 0, canvasW, canvasH);

    const offsetX = extraShadow / 2;
    const offsetY = extraShadow / 2;

    if (borderStyle === "solid") {
      // Solid color border
      ctx.fillStyle = color1;
      ctx.fillRect(offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2);

      // Inner padding (white)
      if (innerPadding > 0) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(offsetX + borderWidth, offsetY + borderWidth, imgW + innerPadding * 2, imgH + innerPadding * 2);
      }

      // Image
      ctx.drawImage(image, offsetX + totalPadding, offsetY + totalPadding, imgW, imgH);

    } else if (borderStyle === "gradient") {
      // Gradient border
      const grad = ctx.createLinearGradient(offsetX, offsetY, offsetX + imgW + totalPadding * 2, offsetY + imgH + totalPadding * 2);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fillRect(offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2);

      if (innerPadding > 0) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(offsetX + borderWidth, offsetY + borderWidth, imgW + innerPadding * 2, imgH + innerPadding * 2);
      }

      ctx.drawImage(image, offsetX + totalPadding, offsetY + totalPadding, imgW, imgH);

    } else if (borderStyle === "double") {
      // Double line border
      const outerWidth = Math.max(3, Math.floor(borderWidth * 0.4));
      const gap = Math.max(2, Math.floor(borderWidth * 0.2));
      const innerWidth = borderWidth - outerWidth - gap;

      // Outer border
      ctx.fillStyle = color1;
      ctx.fillRect(offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2);

      // Gap (white)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(offsetX + outerWidth, offsetY + outerWidth,
        imgW + totalPadding * 2 - outerWidth * 2,
        imgH + totalPadding * 2 - outerWidth * 2);

      // Inner border
      ctx.fillStyle = color1;
      ctx.fillRect(offsetX + outerWidth + gap, offsetY + outerWidth + gap,
        imgW + totalPadding * 2 - (outerWidth + gap) * 2,
        imgH + totalPadding * 2 - (outerWidth + gap) * 2);

      // White padding
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(offsetX + borderWidth, offsetY + borderWidth,
        imgW + innerPadding * 2, imgH + innerPadding * 2);

      ctx.drawImage(image, offsetX + totalPadding, offsetY + totalPadding, imgW, imgH);

    } else if (borderStyle === "rounded") {
      // Rounded border
      ctx.fillStyle = color1;
      roundRect(ctx, offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2, cornerRadius);
      ctx.fill();

      if (innerPadding > 0) {
        ctx.fillStyle = "#FFFFFF";
        const innerR = Math.max(0, cornerRadius - borderWidth);
        roundRect(ctx, offsetX + borderWidth, offsetY + borderWidth, imgW + innerPadding * 2, imgH + innerPadding * 2, innerR);
        ctx.fill();
      }

      // Clip image to rounded rect
      ctx.save();
      const imgR = Math.max(0, cornerRadius - totalPadding);
      roundRect(ctx, offsetX + totalPadding, offsetY + totalPadding, imgW, imgH, imgR);
      ctx.clip();
      ctx.drawImage(image, offsetX + totalPadding, offsetY + totalPadding, imgW, imgH);
      ctx.restore();

    } else if (borderStyle === "shadow") {
      // Shadow border
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2);

      // Border
      if (borderWidth > 0) {
        ctx.fillStyle = color1;
        ctx.fillRect(offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(offsetX + borderWidth, offsetY + borderWidth, imgW + innerPadding * 2, imgH + innerPadding * 2);
      }

      // Shadow
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowBlur / 3;
      ctx.shadowOffsetY = shadowBlur / 3;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Border fill again on top
      if (borderWidth > 0) {
        ctx.fillStyle = color1;
        ctx.fillRect(offsetX, offsetY, imgW + totalPadding * 2, imgH + totalPadding * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(offsetX + borderWidth, offsetY + borderWidth, imgW + innerPadding * 2, imgH + innerPadding * 2);
      }

      ctx.drawImage(image, offsetX + totalPadding, offsetY + totalPadding, imgW, imgH);
    }
  }, [image, borderStyle, borderWidth, innerPadding, cornerRadius, color1, color2, shadowBlur, shadowColor]);

  useMemo(() => { drawCanvas(); }, [drawCanvas]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `bordered-image-${borderStyle}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const borderStyles: { key: BorderStyle; label: string; icon: string }[] = [
    { key: "solid", label: "Solid Color", icon: "Square" },
    { key: "gradient", label: "Gradient", icon: "Gradient" },
    { key: "double", label: "Double Line", icon: "Double" },
    { key: "rounded", label: "Rounded", icon: "Rounded" },
    { key: "shadow", label: "Shadow", icon: "Shadow" },
  ];

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">🖼️</div>
        <div className="text-sm font-semibold text-gray-700">{image ? "Image loaded! Click to change" : "Click to upload image"}</div>
        <div className="text-xs text-gray-400 mt-1">Add beautiful borders to your images</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {image && (
        <>
          {/* Border Style */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Border Style</h3>
            <div className="flex flex-wrap gap-2">
              {borderStyles.map((bs) => (
                <button key={bs.key} onClick={() => setBorderStyle(bs.key)} className={borderStyle === bs.key ? "btn-primary" : "btn-secondary"}>
                  {bs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Border Settings</h3>
            <div className="space-y-4">
              {/* Border Width */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-600">Border Width</label>
                  <span className="text-xs font-bold text-indigo-600">{borderWidth}px</span>
                </div>
                <input type="range" min={5} max={100} value={borderWidth} onChange={(e) => setBorderWidth(+e.target.value)} className="w-full" />
              </div>

              {/* Inner Padding */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-600">Inner Padding</label>
                  <span className="text-xs font-bold text-indigo-600">{innerPadding}px</span>
                </div>
                <input type="range" min={0} max={50} value={innerPadding} onChange={(e) => setInnerPadding(+e.target.value)} className="w-full" />
              </div>

              {/* Color 1 */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-600">
                  {borderStyle === "gradient" ? "Start Color" : "Border Color"}
                </label>
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                <span className="text-xs text-gray-500">{color1}</span>
              </div>

              {/* Color 2 (gradient only) */}
              {borderStyle === "gradient" && (
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-gray-600">End Color</label>
                  <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                  <span className="text-xs text-gray-500">{color2}</span>
                </div>
              )}

              {/* Corner Radius (rounded only) */}
              {borderStyle === "rounded" && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">Corner Radius</label>
                    <span className="text-xs font-bold text-indigo-600">{cornerRadius}px</span>
                  </div>
                  <input type="range" min={0} max={100} value={cornerRadius} onChange={(e) => setCornerRadius(+e.target.value)} className="w-full" />
                </div>
              )}

              {/* Shadow controls */}
              {borderStyle === "shadow" && (
                <>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-600">Shadow Blur</label>
                      <span className="text-xs font-bold text-indigo-600">{shadowBlur}px</span>
                    </div>
                    <input type="range" min={5} max={60} value={shadowBlur} onChange={(e) => setShadowBlur(+e.target.value)} className="w-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-gray-600">Shadow Color</label>
                    <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                    <span className="text-xs text-gray-500">{shadowColor}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Preview</h3>
            <div className="flex justify-center overflow-auto p-4 bg-gray-100 rounded-xl">
              <canvas ref={canvasRef} className="shadow-lg" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          </div>

          {/* Download */}
          <button onClick={download} className="btn-primary">
            Download Bordered Image (PNG)
          </button>
        </>
      )}
    </div>
  );
}
