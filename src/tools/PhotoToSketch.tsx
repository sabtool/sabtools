"use client";
import { useState, useRef, useCallback } from "react";

export default function PhotoToSketch() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [intensity, setIntensity] = useState(10);
  const [resultUrl, setResultUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const applySketch = useCallback((img: HTMLImageElement, blurRadius: number) => {
    setProcessing(true);
    const w = img.width;
    const h = img.height;

    // Step 1: Grayscale
    const canvas1 = document.createElement("canvas");
    canvas1.width = w;
    canvas1.height = h;
    const ctx1 = canvas1.getContext("2d")!;
    ctx1.drawImage(img, 0, 0);
    const grayData = ctx1.getImageData(0, 0, w, h);
    const gd = grayData.data;
    for (let i = 0; i < gd.length; i += 4) {
      const avg = gd[i] * 0.299 + gd[i + 1] * 0.587 + gd[i + 2] * 0.114;
      gd[i] = gd[i + 1] = gd[i + 2] = avg;
    }
    ctx1.putImageData(grayData, 0, 0);

    // Step 2: Invert
    const canvas2 = document.createElement("canvas");
    canvas2.width = w;
    canvas2.height = h;
    const ctx2 = canvas2.getContext("2d")!;
    ctx2.drawImage(canvas1, 0, 0);
    const invData = ctx2.getImageData(0, 0, w, h);
    const id = invData.data;
    for (let i = 0; i < id.length; i += 4) {
      id[i] = 255 - id[i];
      id[i + 1] = 255 - id[i + 1];
      id[i + 2] = 255 - id[i + 2];
    }
    ctx2.putImageData(invData, 0, 0);

    // Step 3: Blur the inverted using CSS filter (offscreen)
    const canvas3 = document.createElement("canvas");
    canvas3.width = w;
    canvas3.height = h;
    const ctx3 = canvas3.getContext("2d")!;
    ctx3.filter = `blur(${blurRadius}px)`;
    ctx3.drawImage(canvas2, 0, 0);

    // Step 4: Color Dodge blend (grayscale / blurred inverted)
    const blurredData = ctx3.getImageData(0, 0, w, h);
    const bd = blurredData.data;
    const result = ctx1.getImageData(0, 0, w, h);
    const rd = result.data;
    for (let i = 0; i < rd.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        const base = rd[i + c];
        const blend = bd[i + c];
        // Color dodge: base / (1 - blend/255)
        if (blend === 255) {
          rd[i + c] = 255;
        } else {
          rd[i + c] = Math.min(255, Math.floor((base * 256) / (256 - blend)));
        }
      }
    }

    const outCanvas = document.createElement("canvas");
    outCanvas.width = w;
    outCanvas.height = h;
    const outCtx = outCanvas.getContext("2d")!;
    outCtx.putImageData(result, 0, 0);
    setResultUrl(outCanvas.toDataURL("image/png"));
    setProcessing(false);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        applySketch(img, intensity);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleIntensityChange = (val: number) => {
    setIntensity(val);
    if (imgRef.current) applySketch(imgRef.current, val);
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">✏️</div>
        <div className="text-sm font-semibold text-gray-700">Click to upload image</div>
        <div className="text-xs text-gray-400 mt-1">Converts your photo to a pencil sketch effect</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {originalFile && (
        <>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Sketch Intensity (Blur)</label>
              <span className="text-sm font-bold text-indigo-600">{intensity}px</span>
            </div>
            <input
              type="range"
              min={2}
              max={40}
              step={1}
              value={intensity}
              onChange={(e) => handleIntensityChange(+e.target.value)}
              className="w-full"
            />
          </div>

          <div className="result-card grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2 text-center">Original</div>
              {previewUrl && <img src={previewUrl} alt="Original" className="max-h-64 mx-auto rounded-lg" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2 text-center">Sketch</div>
              {processing ? (
                <div className="text-center text-sm text-gray-400 py-8">Processing...</div>
              ) : resultUrl ? (
                <img src={resultUrl} alt="Sketch" className="max-h-64 mx-auto rounded-lg" />
              ) : null}
            </div>
          </div>

          {resultUrl && (
            <a
              href={resultUrl}
              download={`sketch-${originalFile.name.replace(/\.[^.]+$/, "")}.png`}
              className="btn-primary inline-block text-center text-sm w-full"
            >
              Download Sketch PNG
            </a>
          )}
        </>
      )}
    </div>
  );
}
