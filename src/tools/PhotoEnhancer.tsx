"use client";
import { useState, useRef, useCallback, useMemo } from "react";

export default function PhotoEnhancer() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [brightness, setBrightness] = useState(110);
  const [contrast, setContrast] = useState(115);
  const [saturation, setSaturation] = useState(110);
  const [sharpness, setSharpness] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [showBefore, setShowBefore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyEnhance = useCallback((img: HTMLImageElement, b: number, c: number, s: number, sharp: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;

    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";

    // Sharpness via unsharp mask
    if (sharp > 0) {
      const blurred = document.createElement("canvas");
      blurred.width = img.width;
      blurred.height = img.height;
      const bCtx = blurred.getContext("2d")!;
      bCtx.filter = `blur(${1}px)`;
      bCtx.drawImage(canvas, 0, 0);

      const origData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const blurData = bCtx.getImageData(0, 0, canvas.width, canvas.height);
      const od = origData.data;
      const bd = blurData.data;
      const amount = sharp / 100;

      for (let i = 0; i < od.length; i += 4) {
        od[i] = Math.min(255, Math.max(0, od[i] + (od[i] - bd[i]) * amount));
        od[i + 1] = Math.min(255, Math.max(0, od[i + 1] + (od[i + 1] - bd[i + 1]) * amount));
        od[i + 2] = Math.min(255, Math.max(0, od[i + 2] + (od[i + 2] - bd[i + 2]) * amount));
      }
      ctx.putImageData(origData, 0, 0);
    }

    setResultUrl(canvas.toDataURL("image/jpeg", 0.92));
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setBrightness(110);
    setContrast(115);
    setSaturation(110);
    setSharpness(0);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        applyEnhance(img, 110, 115, 110, 0);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const update = (b: number, c: number, s: number, sh: number) => {
    if (image) applyEnhance(image, b, c, s, sh);
  };

  const autoEnhance = () => {
    setBrightness(110);
    setContrast(115);
    setSaturation(110);
    setSharpness(30);
    if (image) applyEnhance(image, 110, 115, 110, 30);
  };

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSharpness(0);
    if (image) applyEnhance(image, 100, 100, 100, 0);
  };

  const sliders = useMemo(() => [
    { label: "Brightness", value: brightness, set: (v: number) => { setBrightness(v); update(v, contrast, saturation, sharpness); }, min: 50, max: 200 },
    { label: "Contrast", value: contrast, set: (v: number) => { setContrast(v); update(brightness, v, saturation, sharpness); }, min: 50, max: 200 },
    { label: "Saturation", value: saturation, set: (v: number) => { setSaturation(v); update(brightness, contrast, v, sharpness); }, min: 0, max: 200 },
    { label: "Sharpness", value: sharpness, set: (v: number) => { setSharpness(v); update(brightness, contrast, saturation, v); }, min: 0, max: 200 },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [brightness, contrast, saturation, sharpness, image]);

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">✨</div>
        <div className="text-sm font-semibold text-gray-700">Click to upload photo</div>
        <div className="text-xs text-gray-400 mt-1">Auto-enhances brightness, contrast & saturation</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {originalFile && (
        <>
          <div className="flex gap-2">
            <button onClick={autoEnhance} className="btn-primary text-sm">Auto Enhance</button>
            <button onClick={resetAll} className="btn-secondary text-sm">Reset</button>
          </div>

          {sliders.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold text-gray-700">{s.label}</label>
                <span className="text-sm font-bold text-indigo-600">{s.value}%</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={1}
                value={s.value}
                onChange={(e) => s.set(+e.target.value)}
                className="w-full"
              />
            </div>
          ))}

          <div className="result-card">
            <div className="flex gap-2 justify-center mb-3">
              <button
                onClick={() => setShowBefore(false)}
                className={!showBefore ? "btn-primary text-sm" : "btn-secondary text-sm"}
              >After</button>
              <button
                onClick={() => setShowBefore(true)}
                className={showBefore ? "btn-primary text-sm" : "btn-secondary text-sm"}
              >Before</button>
            </div>
            <div className="flex justify-center">
              <img
                src={showBefore ? previewUrl : resultUrl}
                alt={showBefore ? "Before" : "After"}
                className="max-h-80 rounded-lg"
              />
            </div>
          </div>

          {resultUrl && (
            <a
              href={resultUrl}
              download={`enhanced-${originalFile.name}`}
              className="btn-primary inline-block text-center text-sm w-full"
            >
              Download Enhanced Photo
            </a>
          )}
        </>
      )}
    </div>
  );
}
