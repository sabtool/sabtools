"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export default function BackgroundRemover() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [threshold, setThreshold] = useState(30);
  const [bgColor, setBgColor] = useState<[number, number, number]>([255, 255, 255]);
  const [processed, setProcessed] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setProcessed(false);
      // Draw original
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const pickColor = () => {
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    // Sample top-left corner pixel as background color
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    setBgColor([pixel[0], pixel[1], pixel[2]]);
  };

  const removeBg = useCallback(() => {
    if (!image) return;
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const dist = Math.sqrt(
        (r - bgColor[0]) ** 2 + (g - bgColor[1]) ** 2 + (b - bgColor[2]) ** 2
      );

      if (dist < threshold * 4.42) {
        // 30 threshold ~= 133 distance on 0-442 scale
        data[i + 3] = 0; // make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setProcessed(true);
  }, [image, threshold, bgColor]);

  useEffect(() => {
    if (image) removeBg();
  }, [image, removeBg]);

  const download = () => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "background-removed.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleUpload} className="calc-input text-sm" />
      </div>

      {image && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color Threshold: {threshold}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Strict</span>
                <span>Loose</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color to Remove</label>
              <div className="flex gap-2 items-center">
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300"
                  style={{ backgroundColor: `rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})` }}
                />
                <button onClick={pickColor} className="btn-secondary text-xs !py-1 !px-3">
                  Auto-detect from top-left
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Original</h3>
              <div className="result-card flex justify-center">
                <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg border border-gray-200" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Background Removed</h3>
              <div className="result-card flex justify-center" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' width='10' height='10' fill='%23fff'/%3E%3Crect y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E\")" }}>
                <canvas ref={previewRef} className="max-w-full h-auto rounded-lg" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={download} className="btn-primary text-sm !py-2 !px-4" disabled={!processed}>Download PNG</button>
            <button onClick={() => { setImage(null); setProcessed(false); }} className="btn-secondary text-sm !py-2 !px-4">Reset</button>
          </div>
        </>
      )}

      {!image && (
        <div className="result-card text-center text-gray-400 py-12">
          Upload an image to remove its background
        </div>
      )}
    </div>
  );
}
