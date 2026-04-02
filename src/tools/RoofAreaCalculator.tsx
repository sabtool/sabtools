"use client";
import { useState, useMemo, useRef, useEffect } from "react";

type RoofType = "flat" | "gable" | "hip";

const ROOF_TYPES: { value: RoofType; label: string }[] = [
  { value: "flat", label: "Flat Roof" },
  { value: "gable", label: "Gable (2-sided slope)" },
  { value: "hip", label: "Hip (4-sided slope)" },
];

const SHEET_TYPES = [
  { label: "GI Corrugated (3x10 ft)", area: 30, rate: 350 },
  { label: "GI Corrugated (3x12 ft)", area: 36, rate: 420 },
  { label: "Polycarbonate (4x8 ft)", area: 32, rate: 800 },
  { label: "Metal Roofing (3x10 ft)", area: 30, rate: 500 },
];

export default function RoofAreaCalculator() {
  const [roofType, setRoofType] = useState<RoofType>("gable");
  const [baseL, setBaseL] = useState("");
  const [baseW, setBaseW] = useState("");
  const [slopeInput, setSlopeInput] = useState<"angle" | "height">("angle");
  const [slopeAngle, setSlopeAngle] = useState("25");
  const [ridgeHeight, setRidgeHeight] = useState("");
  const [sheetType, setSheetType] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const result = useMemo(() => {
    const l = parseFloat(baseL);
    const w = parseFloat(baseW);
    if (!l || !w || l <= 0 || w <= 0) return null;

    const baseArea = l * w;
    let totalRoofArea = 0;
    let slopeLen = 0;
    let angle = 0;

    if (roofType === "flat") {
      totalRoofArea = baseArea;
    } else if (roofType === "gable") {
      if (slopeInput === "angle") {
        angle = parseFloat(slopeAngle) || 25;
        const rad = (angle * Math.PI) / 180;
        slopeLen = (w / 2) / Math.cos(rad);
      } else {
        const h = parseFloat(ridgeHeight);
        if (!h || h <= 0) return null;
        slopeLen = Math.sqrt((w / 2) * (w / 2) + h * h);
        angle = Math.atan(h / (w / 2)) * (180 / Math.PI);
      }
      totalRoofArea = 2 * slopeLen * l;
    } else {
      // Hip roof
      if (slopeInput === "angle") {
        angle = parseFloat(slopeAngle) || 25;
        const rad = (angle * Math.PI) / 180;
        slopeLen = (w / 2) / Math.cos(rad);
      } else {
        const h = parseFloat(ridgeHeight);
        if (!h || h <= 0) return null;
        slopeLen = Math.sqrt((w / 2) * (w / 2) + h * h);
        angle = Math.atan(h / (w / 2)) * (180 / Math.PI);
      }
      // 2 trapezoidal sides + 2 triangular ends
      const ridgeLen = l - w;
      if (ridgeLen <= 0) {
        // Pyramid hip
        totalRoofArea = 4 * (0.5 * (Math.min(l, w) / 2) * slopeLen);
      } else {
        const trapArea = 2 * ((l + ridgeLen) / 2) * slopeLen;
        const triSlopeLen = Math.sqrt((w / 2) * (w / 2) + (slopeLen * slopeLen - (w / 2) * (w / 2)));
        const triArea = 2 * (0.5 * w * triSlopeLen);
        totalRoofArea = trapArea + triArea;
      }
    }

    const sheet = SHEET_TYPES[sheetType];
    const sheetsNeeded = Math.ceil((totalRoofArea * 1.1) / sheet.area); // 10% overlap
    const materialCost = sheetsNeeded * sheet.rate;

    return {
      baseArea: baseArea.toFixed(1),
      totalRoofArea: totalRoofArea.toFixed(1),
      slopeLen: slopeLen.toFixed(2),
      angle: angle.toFixed(1),
      sheetsNeeded,
      materialCost,
      sheetLabel: sheet.label,
    };
  }, [baseL, baseW, roofType, slopeInput, slopeAngle, ridgeHeight, sheetType]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const cx = cw / 2;
    const baseY = ch - 40;
    const bw = 200;
    const bh = 80;

    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#eef2ff";

    if (roofType === "flat") {
      // Simple box
      ctx.fillRect(cx - bw / 2, baseY - bh, bw, bh);
      ctx.strokeRect(cx - bw / 2, baseY - bh, bw, bh);
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px sans-serif";
      ctx.fillText("Flat Roof", cx - 22, baseY - bh - 8);
    } else if (roofType === "gable") {
      const peakY = baseY - bh - 60;
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2 - 15, baseY - bh);
      ctx.lineTo(cx, peakY);
      ctx.lineTo(cx + bw / 2 + 15, baseY - bh);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Walls
      ctx.strokeRect(cx - bw / 2, baseY - bh, bw, bh);
    } else {
      const peakY = baseY - bh - 60;
      const ridgeW = 60;
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2 - 15, baseY - bh);
      ctx.lineTo(cx - ridgeW / 2, peakY);
      ctx.lineTo(cx + ridgeW / 2, peakY);
      ctx.lineTo(cx + bw / 2 + 15, baseY - bh);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeRect(cx - bw / 2, baseY - bh, bw, bh);
    }
  }, [roofType, result]);

  const fmtCur = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Roof Type</label>
        <div className="flex gap-3 flex-wrap">
          {ROOF_TYPES.map((r) => (
            <button key={r.value} onClick={() => setRoofType(r.value)} className={roofType === r.value ? "btn-primary" : "btn-secondary"}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Base Length (ft)</label>
          <input type="number" placeholder="e.g. 30" value={baseL} onChange={(e) => setBaseL(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Base Width (ft)</label>
          <input type="number" placeholder="e.g. 20" value={baseW} onChange={(e) => setBaseW(e.target.value)} className="calc-input" />
        </div>
      </div>

      {roofType !== "flat" && (
        <>
          <div className="flex gap-3">
            <button onClick={() => setSlopeInput("angle")} className={slopeInput === "angle" ? "btn-primary" : "btn-secondary"}>Slope Angle</button>
            <button onClick={() => setSlopeInput("height")} className={slopeInput === "height" ? "btn-primary" : "btn-secondary"}>Ridge Height</button>
          </div>
          <div>
            {slopeInput === "angle" ? (
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Slope Angle (degrees)</label>
                <input type="number" placeholder="25" value={slopeAngle} onChange={(e) => setSlopeAngle(e.target.value)} className="calc-input" />
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Ridge Height above Eave (ft)</label>
                <input type="number" placeholder="e.g. 5" value={ridgeHeight} onChange={(e) => setRidgeHeight(e.target.value)} className="calc-input" />
              </div>
            )}
          </div>
        </>
      )}

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Roofing Sheet Type</label>
        <select value={sheetType} onChange={(e) => setSheetType(Number(e.target.value))} className="calc-input">
          {SHEET_TYPES.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
        </select>
      </div>

      {/* Diagram */}
      <canvas ref={canvasRef} width={400} height={220} className="w-full border border-gray-200 rounded-lg bg-white" />

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Total Roof Area</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.totalRoofArea} sq ft</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Base Area</div>
              <div className="text-lg font-bold text-gray-600">{result.baseArea} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Slope Angle</div>
              <div className="text-lg font-bold text-blue-600">{result.angle}&deg;</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Sheets Needed</div>
              <div className="text-lg font-bold text-green-600">{result.sheetsNeeded}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Material Cost</div>
              <div className="text-lg font-bold text-red-600">{fmtCur(result.materialCost)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
