"use client";
import { useState, useMemo, useRef, useEffect } from "react";

// IS code limits: Riser 150-200mm, Tread 250-300mm
const MIN_RISER_MM = 150;
const MAX_RISER_MM = 200;
const MIN_TREAD_MM = 250;
const MAX_TREAD_MM = 300;

export default function StaircaseCalculator() {
  const [floorHeight, setFloorHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState<"ft" | "in">("ft");
  const [horizontalSpace, setHorizontalSpace] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const result = useMemo(() => {
    const raw = parseFloat(floorHeight);
    if (!raw || raw <= 0) return null;

    const heightMm = heightUnit === "ft" ? raw * 304.8 : raw * 25.4;
    const hSpace = parseFloat(horizontalSpace);
    const hSpaceMm = hSpace && hSpace > 0 ? hSpace * 304.8 : 0;

    // Try ideal riser of 175mm first
    const idealRiser = 175;
    const numSteps = Math.round(heightMm / idealRiser);
    const actualRiser = heightMm / numSteps;

    // Calculate tread from available space or use ideal
    let treadDepth: number;
    if (hSpaceMm > 0) {
      treadDepth = hSpaceMm / (numSteps - 1); // last step is landing
    } else {
      // Use formula: 2R + T = 600-650mm
      treadDepth = 625 - 2 * actualRiser;
    }

    const riserOk = actualRiser >= MIN_RISER_MM && actualRiser <= MAX_RISER_MM;
    const treadOk = treadDepth >= MIN_TREAD_MM && treadDepth <= MAX_TREAD_MM;

    // Stringer length
    const totalRun = treadDepth * (numSteps - 1);
    const stringerLength = Math.sqrt(heightMm * heightMm + totalRun * totalRun);

    return {
      numSteps,
      actualRiserMm: actualRiser.toFixed(1),
      actualRiserIn: (actualRiser / 25.4).toFixed(2),
      treadDepthMm: treadDepth.toFixed(1),
      treadDepthIn: (treadDepth / 25.4).toFixed(2),
      riserOk,
      treadOk,
      stringerLengthMm: stringerLength.toFixed(0),
      stringerLengthFt: (stringerLength / 304.8).toFixed(2),
      totalRunMm: totalRun.toFixed(0),
      totalRunFt: (totalRun / 304.8).toFixed(2),
      heightMm,
      treadDepth,
      actualRiser,
    };
  }, [floorHeight, heightUnit, horizontalSpace]);

  useEffect(() => {
    if (!result || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padding = 30;
    const drawW = w - 2 * padding;
    const drawH = h - 2 * padding;

    const totalRunMm = result.treadDepth * (result.numSteps - 1);
    const scaleX = drawW / totalRunMm;
    const scaleY = drawH / result.heightMm;
    const scale = Math.min(scaleX, scaleY);

    const startX = padding;
    const startY = h - padding;

    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#eef2ff";

    ctx.beginPath();
    ctx.moveTo(startX, startY);

    for (let i = 0; i < result.numSteps; i++) {
      const x1 = startX + i * result.treadDepth * scale;
      const y1 = startY - i * result.actualRiser * scale;
      const x2 = x1;
      const y2 = y1 - result.actualRiser * scale;
      const x3 = x1 + result.treadDepth * scale;
      const y3 = y2;

      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
    }

    ctx.stroke();

    // Draw stringer line
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + totalRunMm * scale, startY - result.heightMm * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px sans-serif";
    ctx.fillText(`${result.numSteps} steps`, startX + (totalRunMm * scale) / 2, startY + 18);
    ctx.fillText(`Run: ${result.totalRunFt} ft`, startX + (totalRunMm * scale) / 2 - 30, startY - result.heightMm * scale / 2);
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Floor-to-Floor Height</label>
          <input type="number" placeholder="e.g. 10" value={floorHeight} onChange={(e) => setFloorHeight(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Height Unit</label>
          <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value as "ft" | "in")} className="calc-input">
            <option value="ft">Feet</option>
            <option value="in">Inches</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Available Horizontal Space (ft, optional)</label>
          <input type="number" placeholder="e.g. 12" value={horizontalSpace} onChange={(e) => setHorizontalSpace(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Number of Steps</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.numSteps}</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Riser Height</div>
              <div className={`text-lg font-bold ${result.riserOk ? "text-green-600" : "text-red-600"}`}>
                {result.actualRiserMm} mm
              </div>
              <div className="text-xs text-gray-400">{result.actualRiserIn}&quot;</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Tread Depth</div>
              <div className={`text-lg font-bold ${result.treadOk ? "text-green-600" : "text-red-600"}`}>
                {result.treadDepthMm} mm
              </div>
              <div className="text-xs text-gray-400">{result.treadDepthIn}&quot;</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Stringer Length</div>
              <div className="text-lg font-bold text-indigo-600">{result.stringerLengthFt} ft</div>
              <div className="text-xs text-gray-400">{result.stringerLengthMm} mm</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Total Run</div>
              <div className="text-lg font-bold text-blue-600">{result.totalRunFt} ft</div>
            </div>
          </div>

          {/* IS Code Validation */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">IS Code Validation</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`rounded-lg p-2 border ${result.riserOk ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                Riser {MIN_RISER_MM}-{MAX_RISER_MM}mm: <span className="font-semibold">{result.riserOk ? "PASS" : "FAIL"}</span>
              </div>
              <div className={`rounded-lg p-2 border ${result.treadOk ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                Tread {MIN_TREAD_MM}-{MAX_TREAD_MM}mm: <span className="font-semibold">{result.treadOk ? "PASS" : "FAIL"}</span>
              </div>
            </div>
          </div>

          {/* Side-view diagram */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Side View</div>
            <canvas ref={canvasRef} width={500} height={280} className="w-full border border-gray-200 rounded-lg bg-white" />
          </div>
        </div>
      )}
    </div>
  );
}
