"use client";
import { useState, useRef, useMemo, useCallback } from "react";

const PHOTO_SIZES = [
  { name: "Indian Passport (2×2 inch)", widthInch: 2, heightInch: 2 },
  { name: "US/India Visa (2×2 inch)", widthInch: 2, heightInch: 2 },
  { name: "Aadhaar Card (3.5×4.5 cm)", widthInch: 3.5 / 2.54, heightInch: 4.5 / 2.54 },
  { name: "PAN Card (3.5×2.5 cm)", widthInch: 3.5 / 2.54, heightInch: 2.5 / 2.54 },
];

const DPI = 300;

export default function PassportPhotoMaker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [bgColor, setBgColor] = useState<"white" | "blue">("white");
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [resultUrl, setResultUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const selected = PHOTO_SIZES[sizeIdx];
  const outW = useMemo(() => Math.round(selected.widthInch * DPI), [selected]);
  const outH = useMemo(() => Math.round(selected.heightInch * DPI), [selected]);
  const sizeCm = useMemo(() => ({
    w: (selected.widthInch * 2.54).toFixed(1),
    h: (selected.heightInch * 2.54).toFixed(1),
  }), [selected]);

  const drawPreview = useCallback((img: HTMLImageElement, ox: number, oy: number, sIdx: number, bg: string) => {
    const cvs = previewRef.current;
    if (!cvs) return;
    const s = PHOTO_SIZES[sIdx];
    const w = Math.round(s.widthInch * DPI);
    const h = Math.round(s.heightInch * DPI);
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext("2d")!;
    ctx.fillStyle = bg === "blue" ? "#d6e6f5" : "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const scale = Math.max(w / img.width, h / img.height);
    const sw = img.width * scale;
    const sh = img.height * scale;
    const dx = (w - sw) / 2 + ox;
    const dy = (h - sh) / 2 + oy;
    ctx.drawImage(img, dx, dy, sw, sh);

    // guide lines
    ctx.strokeStyle = "rgba(0,150,255,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    // head oval guide
    const cx = w / 2, cy = h * 0.38, rx = w * 0.25, ry = h * 0.3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    // chin line
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.62);
    ctx.lineTo(w * 0.8, h * 0.62);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setCropOffset({ x: 0, y: 0 });
        setResultUrl("");
        drawPreview(img, 0, 0, sizeIdx, bgColor);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSizeChange = (idx: number) => {
    setSizeIdx(idx);
    if (image) drawPreview(image, cropOffset.x, cropOffset.y, idx, bgColor);
  };

  const handleBgChange = (bg: "white" | "blue") => {
    setBgColor(bg);
    if (image) drawPreview(image, cropOffset.x, cropOffset.y, sizeIdx, bg);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current || !image) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    const newOff = { x: cropOffset.x + dx, y: cropOffset.y + dy };
    setCropOffset(newOff);
    drawPreview(image, newOff.x, newOff.y, sizeIdx, bgColor);
  };

  const handleMouseUp = () => { draggingRef.current = false; };

  const generate = () => {
    if (!image) return;
    const cvs = document.createElement("canvas");
    cvs.width = outW;
    cvs.height = outH;
    const ctx = cvs.getContext("2d")!;
    ctx.fillStyle = bgColor === "blue" ? "#d6e6f5" : "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
    const scale = Math.max(outW / image.width, outH / image.height);
    const sw = image.width * scale;
    const sh = image.height * scale;
    ctx.drawImage(image, (outW - sw) / 2 + cropOffset.x, (outH - sh) / 2 + cropOffset.y, sw, sh);
    setResultUrl(cvs.toDataURL("image/jpeg", 0.95));
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">📷</div>
        <div className="text-sm font-semibold text-gray-700">Click to upload your photo</div>
        <div className="text-xs text-gray-400 mt-1">JPG, PNG supported</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Photo Size</label>
          <select
            value={sizeIdx}
            onChange={(e) => handleSizeChange(+e.target.value)}
            className="calc-input w-full"
          >
            {PHOTO_SIZES.map((s, i) => (
              <option key={i} value={i}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Background</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleBgChange("white")}
              className={bgColor === "white" ? "btn-primary text-sm" : "btn-secondary text-sm"}
            >White</button>
            <button
              onClick={() => handleBgChange("blue")}
              className={bgColor === "blue" ? "btn-primary text-sm" : "btn-secondary text-sm"}
            >Blue</button>
          </div>
        </div>
      </div>

      {image && (
        <div className="result-card">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Adjust position (drag the image)
          </div>
          <div className="flex justify-center">
            <div
              style={{ width: Math.min(outW, 300), height: Math.min(outH, 300 * outH / outW), overflow: "hidden", cursor: "move" }}
              className="border rounded-xl relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={previewRef}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Blue oval = head guide. Align your face within it.
          </div>
        </div>
      )}

      <div className="result-card grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-xs text-gray-500">Width</div>
          <div className="font-bold text-gray-800">{outW} px</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Height</div>
          <div className="font-bold text-gray-800">{outH} px</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Size (cm)</div>
          <div className="font-bold text-gray-800">{sizeCm.w} x {sizeCm.h}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">DPI</div>
          <div className="font-bold text-gray-800">{DPI}</div>
        </div>
      </div>

      {image && (
        <div className="flex gap-3">
          <button onClick={generate} className="btn-primary text-sm">Generate Photo</button>
        </div>
      )}

      {resultUrl && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={resultUrl} alt="Passport photo" className="rounded-xl border max-w-[200px]" />
          </div>
          <a href={resultUrl} download="passport-photo.jpg" className="btn-primary inline-block text-center text-sm w-full">
            Download JPG ({outW}x{outH} @ {DPI} DPI)
          </a>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
