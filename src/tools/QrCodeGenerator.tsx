"use client";
import { useState, useEffect, useRef } from "react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://sabtools.in");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text) return;
    // Using Google Charts QR API for simplicity (works offline too via cache)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
  }, [text, size]);

  const download = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter URL or Text</label>
        <textarea placeholder="https://sabtools.in" value={text} onChange={(e) => setText(e.target.value)} className="calc-input" rows={3} />
      </div>
      <div>
        <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Size</label><span className="text-sm font-bold text-indigo-600">{size}px</span></div>
        <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full" />
      </div>
      {qrUrl && (
        <div className="result-card text-center">
          <canvas ref={canvasRef} className="hidden" />
          <img src={qrUrl} alt="QR Code" width={size} height={size} className="mx-auto rounded-xl border border-gray-200" />
          <button onClick={download} className="btn-primary mt-4 text-sm !py-2 !px-5">Download QR Code</button>
        </div>
      )}
    </div>
  );
}
