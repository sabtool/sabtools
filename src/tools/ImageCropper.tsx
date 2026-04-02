"use client";
import { useState, useRef } from "react";

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropW, setCropW] = useState("200");
  const [cropH, setCropH] = useState("200");
  const [resultUrl, setResultUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    setImgSrc(URL.createObjectURL(f));
    setResultUrl("");
  };

  const crop = () => {
    if (!imgSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const x = parseInt(cropX), y = parseInt(cropY), w = parseInt(cropW), h = parseInt(cropH);
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, x, y, w, h, 0, 0, w, h);
      canvas.toBlob((blob) => { if (blob) setResultUrl(URL.createObjectURL(blob)); }, "image/png");
    };
    img.src = imgSrc;
  };

  return (
    <div className="space-y-6">
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition">
        <div className="text-4xl mb-3">✂️</div>
        <div className="text-sm font-semibold text-gray-700">{file ? file.name : "Click to upload image"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {imgSrc && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">X</label><input type="number" value={cropX} onChange={(e) => setCropX(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Y</label><input type="number" value={cropY} onChange={(e) => setCropY(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Width</label><input type="number" value={cropW} onChange={(e) => setCropW(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Height</label><input type="number" value={cropH} onChange={(e) => setCropH(e.target.value)} className="calc-input" /></div>
          </div>
          <button onClick={crop} className="btn-primary">Crop Image</button>
          {resultUrl && <a href={resultUrl} download={`cropped-${file?.name}`} className="btn-secondary inline-block text-center text-sm">Download Cropped Image</a>}
        </>
      )}
    </div>
  );
}
