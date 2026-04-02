"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Template {
  name: string;
  color1: string;
  color2: string;
  width: number;
  height: number;
}

const templates: Template[] = [
  { name: "Drake (Approve/Reject)", color1: "#FFB6C1", color2: "#98FB98", width: 600, height: 600 },
  { name: "Two Buttons", color1: "#87CEEB", color2: "#FFD700", width: 600, height: 400 },
  { name: "Distracted BF", color1: "#DDA0DD", color2: "#F0E68C", width: 700, height: 400 },
  { name: "Change My Mind", color1: "#F5DEB3", color2: "#B0C4DE", width: 600, height: 400 },
  { name: "Expanding Brain", color1: "#E6E6FA", color2: "#FFDAB9", width: 500, height: 700 },
  { name: "This Is Fine", color1: "#FFA07A", color2: "#FF6347", width: 600, height: 400 },
];

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState("#FFFFFF");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { setImage(img); setSelectedTemplate(null); };
    img.src = URL.createObjectURL(file);
  };

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 600, h = 600;

    if (image) {
      w = image.width;
      h = image.height;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(image, 0, 0);
    } else if (selectedTemplate !== null) {
      const t = templates[selectedTemplate];
      w = t.width;
      h = t.height;
      canvas.width = w;
      canvas.height = h;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, t.color1);
      grad.addColorStop(1, t.color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t.name, w / 2, h / 2);
    } else {
      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, w, h);
    }

    // Draw text
    ctx.fillStyle = textColor;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = Math.max(2, fontSize / 12);
    ctx.font = `bold ${fontSize}px Impact, sans-serif`;
    ctx.textAlign = "center";
    ctx.lineJoin = "round";

    const drawText = (txt: string, y: number) => {
      const words = txt.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > w - 40) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      lines.forEach((l, i) => {
        const yPos = y + i * (fontSize + 4);
        ctx.strokeText(l, w / 2, yPos);
        ctx.fillText(l, w / 2, yPos);
      });
    };

    if (topText) drawText(topText.toUpperCase(), fontSize + 10);
    if (bottomText) drawText(bottomText.toUpperCase(), h - 20);
  }, [image, selectedTemplate, topText, bottomText, fontSize, textColor]);

  useEffect(() => { drawMeme(); }, [drawMeme]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleUpload} className="calc-input text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Or Select Template</label>
          <select
            value={selectedTemplate ?? ""}
            onChange={(e) => { setSelectedTemplate(e.target.value === "" ? null : parseInt(e.target.value)); setImage(null); }}
            className="calc-input"
          >
            <option value="">Choose a template...</option>
            {templates.map((t, i) => (
              <option key={i} value={i}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Top Text</label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Top text..."
            className="calc-input"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bottom Text</label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Bottom text..."
            className="calc-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size: {fontSize}px</label>
          <input
            type="range"
            min="16"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="calc-input h-10 cursor-pointer"
          />
        </div>
      </div>

      <div className="result-card flex justify-center">
        <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
      </div>

      <div className="flex gap-3">
        <button onClick={download} className="btn-primary text-sm !py-2 !px-4">Download PNG</button>
        <button onClick={() => { setImage(null); setSelectedTemplate(null); setTopText(""); setBottomText(""); }} className="btn-secondary text-sm !py-2 !px-4">Reset</button>
      </div>
    </div>
  );
}
