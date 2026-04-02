"use client";
import { useState, useRef, useCallback, useEffect } from "react";

type MockupType = "browser" | "macbook" | "iphone" | "ipad" | "android";

export default function ScreenshotBeautifier() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [mockup, setMockup] = useState<MockupType>("browser");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [bgGradient, setBgGradient] = useState(true);
  const [bgColor2, setBgColor2] = useState("#8b5cf6");
  const [padding, setPadding] = useState(60);
  const [shadow, setShadow] = useState(true);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  const drawMockup = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgW = image.width;
    const imgH = image.height;

    // Mockup frame dimensions
    let frameTop = 0;
    let frameBottom = 0;
    let frameSide = 0;
    let borderRadius = 12;

    switch (mockup) {
      case "browser":
        frameTop = 40;
        frameSide = 2;
        frameBottom = 2;
        borderRadius = 10;
        break;
      case "macbook":
        frameTop = 30;
        frameSide = 20;
        frameBottom = 40;
        borderRadius = 14;
        break;
      case "iphone":
        frameTop = 60;
        frameSide = 16;
        frameBottom = 60;
        borderRadius = 40;
        break;
      case "ipad":
        frameTop = 40;
        frameSide = 20;
        frameBottom = 40;
        borderRadius = 20;
        break;
      case "android":
        frameTop = 30;
        frameSide = 8;
        frameBottom = 40;
        borderRadius = 24;
        break;
    }

    const deviceW = imgW + frameSide * 2;
    const deviceH = imgH + frameTop + frameBottom;
    const totalW = deviceW + padding * 2;
    const totalH = deviceH + padding * 2;

    canvas.width = totalW;
    canvas.height = totalH;

    // Background
    if (bgGradient) {
      const grad = ctx.createLinearGradient(0, 0, totalW, totalH);
      grad.addColorStop(0, bgColor);
      grad.addColorStop(1, bgColor2);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, totalW, totalH);

    const dx = padding;
    const dy = padding;

    // Shadow
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
    }

    // Device frame
    ctx.fillStyle = mockup === "macbook" ? "#2d2d2d" : "#1f1f1f";
    ctx.beginPath();
    ctx.roundRect(dx, dy, deviceW, deviceH, borderRadius);
    ctx.fill();
    ctx.shadowColor = "transparent";

    // Draw screenshot inside frame
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(dx + frameSide, dy + frameTop, imgW, imgH, Math.max(0, borderRadius - 4));
    ctx.clip();
    ctx.drawImage(image, dx + frameSide, dy + frameTop);
    ctx.restore();

    // Mockup-specific decorations
    if (mockup === "browser") {
      // Traffic light dots
      const dotY = dy + 20;
      const colors = ["#ff5f56", "#ffbd2e", "#27c93f"];
      colors.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(dx + 20 + i * 20, dotY, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      // Address bar
      ctx.fillStyle = "#3a3a3a";
      ctx.beginPath();
      ctx.roundRect(dx + 90, dotY - 10, deviceW - 130, 20, 4);
      ctx.fill();
      ctx.fillStyle = "#888";
      ctx.font = "11px sans-serif";
      ctx.fillText("https://example.com", dx + 100, dotY + 4);
    } else if (mockup === "macbook") {
      // Webcam dot
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.arc(dx + deviceW / 2, dy + 15, 4, 0, Math.PI * 2);
      ctx.fill();
      // Bottom chin / hinge
      ctx.fillStyle = "#3a3a3a";
      ctx.beginPath();
      ctx.roundRect(dx + deviceW * 0.2, dy + deviceH - 10, deviceW * 0.6, 10, [0, 0, 6, 6]);
      ctx.fill();
    } else if (mockup === "iphone") {
      // Dynamic Island / notch
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.roundRect(dx + deviceW / 2 - 50, dy + 12, 100, 28, 14);
      ctx.fill();
      // Home indicator
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.roundRect(dx + deviceW / 2 - 40, dy + deviceH - 25, 80, 5, 3);
      ctx.fill();
    } else if (mockup === "ipad") {
      // Camera
      ctx.fillStyle = "#444";
      ctx.beginPath();
      ctx.arc(dx + deviceW / 2, dy + 20, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (mockup === "android") {
      // Camera punch hole
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(dx + deviceW / 2, dy + 15, 6, 0, Math.PI * 2);
      ctx.fill();
      // Nav bar buttons
      ctx.fillStyle = "#555";
      const navY = dy + deviceH - 22;
      // Triangle (back)
      ctx.beginPath();
      ctx.moveTo(dx + deviceW / 2 - 50, navY);
      ctx.lineTo(dx + deviceW / 2 - 40, navY - 8);
      ctx.lineTo(dx + deviceW / 2 - 40, navY + 8);
      ctx.fill();
      // Square (home)
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 2;
      ctx.strokeRect(dx + deviceW / 2 - 7, navY - 7, 14, 14);
      // Circle (recent)
      ctx.beginPath();
      ctx.arc(dx + deviceW / 2 + 45, navY, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [image, mockup, bgColor, bgGradient, bgColor2, padding, shadow]);

  useEffect(() => {
    drawMockup();
  }, [drawMockup]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "beautified-screenshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const mockupOptions: { value: MockupType; label: string }[] = [
    { value: "browser", label: "Browser Window" },
    { value: "macbook", label: "MacBook" },
    { value: "iphone", label: "iPhone" },
    { value: "ipad", label: "iPad" },
    { value: "android", label: "Android Phone" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Screenshot</label>
        <input type="file" accept="image/*" onChange={handleUpload} className="calc-input text-sm" />
      </div>

      {image && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Device Mockup</label>
              <div className="flex flex-wrap gap-2">
                {mockupOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMockup(opt.value)}
                    className={`text-sm px-3 py-1.5 rounded-lg transition ${
                      mockup === opt.value
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Background</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 border rounded cursor-pointer"
                />
                {bgGradient && (
                  <input
                    type="color"
                    value={bgColor2}
                    onChange={(e) => setBgColor2(e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                )}
                <label className="flex items-center gap-1 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={bgGradient}
                    onChange={(e) => setBgGradient(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  Gradient
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Padding: {padding}px
              </label>
              <input
                type="range"
                min={20}
                max={150}
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={shadow}
                  onChange={(e) => setShadow(e.target.checked)}
                  className="accent-indigo-600"
                />
                Drop Shadow
              </label>
            </div>
          </div>

          <div className="result-card flex justify-center overflow-auto">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4">
              Download
            </button>
            <button onClick={() => setImage(null)} className="btn-secondary text-sm !py-2 !px-4">
              New Screenshot
            </button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload a screenshot to beautify it with device mockups
        </div>
      )}
    </div>
  );
}
