"use client";
import { useState, useRef, useMemo } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const preset = useMemo(() => presets[selectedPreset], [selectedPreset]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

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
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="calc-input" />
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
            <img src={image} alt="Preview" className="max-h-64 rounded-lg object-contain" />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
