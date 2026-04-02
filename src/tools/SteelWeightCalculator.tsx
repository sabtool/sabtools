"use client";
import { useState, useMemo } from "react";

const STEEL_DENSITY = 7850; // kg/m³

const TMT_BARS = [6, 8, 10, 12, 16, 20, 25, 32];

type SteelType = "tmt" | "flat" | "angle" | "channel" | "pipe" | "plate";

const STEEL_TYPES: { value: SteelType; label: string }[] = [
  { value: "tmt", label: "TMT Bar (Round)" },
  { value: "flat", label: "Flat Bar" },
  { value: "angle", label: "Angle" },
  { value: "channel", label: "Channel" },
  { value: "pipe", label: "Pipe (Round)" },
  { value: "plate", label: "Plate / Sheet" },
];

export default function SteelWeightCalculator() {
  const [steelType, setSteelType] = useState<SteelType>("tmt");
  const [tmtDia, setTmtDia] = useState(12);
  const [lengthM, setLengthM] = useState("12");
  const [qty, setQty] = useState("1");
  const [widthMm, setWidthMm] = useState("");
  const [thicknessMm, setThicknessMm] = useState("");
  const [outerDiaMm, setOuterDiaMm] = useState("");
  const [wallThickMm, setWallThickMm] = useState("");
  const [rate, setRate] = useState("");

  const result = useMemo(() => {
    const l = parseFloat(lengthM);
    const q = parseInt(qty) || 1;
    if (!l || l <= 0) return null;

    let weightPerMeter = 0;

    switch (steelType) {
      case "tmt": {
        const d = tmtDia / 1000; // mm to m
        weightPerMeter = STEEL_DENSITY * Math.PI * (d * d) / 4;
        break;
      }
      case "flat": {
        const w = parseFloat(widthMm);
        const t = parseFloat(thicknessMm);
        if (!w || !t || w <= 0 || t <= 0) return null;
        weightPerMeter = STEEL_DENSITY * (w / 1000) * (t / 1000);
        break;
      }
      case "angle": {
        const w = parseFloat(widthMm);
        const t = parseFloat(thicknessMm);
        if (!w || !t || w <= 0 || t <= 0) return null;
        // L-angle: 2 legs of equal width
        weightPerMeter = STEEL_DENSITY * ((2 * w - t) / 1000) * (t / 1000);
        break;
      }
      case "channel": {
        const w = parseFloat(widthMm); // web height
        const t = parseFloat(thicknessMm);
        if (!w || !t || w <= 0 || t <= 0) return null;
        // Approximate C-channel
        weightPerMeter = STEEL_DENSITY * (3 * w / 1000) * (t / 1000);
        break;
      }
      case "pipe": {
        const od = parseFloat(outerDiaMm);
        const wt = parseFloat(wallThickMm);
        if (!od || !wt || od <= 0 || wt <= 0 || wt >= od / 2) return null;
        const outerR = od / 2 / 1000;
        const innerR = (od / 2 - wt) / 1000;
        weightPerMeter = STEEL_DENSITY * Math.PI * (outerR * outerR - innerR * innerR);
        break;
      }
      case "plate": {
        const w = parseFloat(widthMm);
        const t = parseFloat(thicknessMm);
        if (!w || !t || w <= 0 || t <= 0) return null;
        weightPerMeter = STEEL_DENSITY * (w / 1000) * (t / 1000);
        break;
      }
    }

    const totalWeight = weightPerMeter * l * q;
    const r = parseFloat(rate) || 0;
    const totalCost = r > 0 ? totalWeight * r : 0;

    return {
      weightPerMeter: weightPerMeter.toFixed(3),
      totalWeight: totalWeight.toFixed(2),
      totalCost,
      pieces: q,
      lengthEach: l,
    };
  }, [steelType, tmtDia, lengthM, qty, widthMm, thicknessMm, outerDiaMm, wallThickMm, rate]);

  const fmtCur = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Steel Type</label>
          <select value={steelType} onChange={(e) => setSteelType(e.target.value as SteelType)} className="calc-input">
            {STEEL_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {steelType === "tmt" && (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Diameter (mm)</label>
            <select value={tmtDia} onChange={(e) => setTmtDia(Number(e.target.value))} className="calc-input">
              {TMT_BARS.map((d) => <option key={d} value={d}>{d} mm</option>)}
            </select>
          </div>
        )}

        {(steelType === "flat" || steelType === "angle" || steelType === "channel" || steelType === "plate") && (
          <>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Width / Leg (mm)</label>
              <input type="number" placeholder="e.g. 50" value={widthMm} onChange={(e) => setWidthMm(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Thickness (mm)</label>
              <input type="number" placeholder="e.g. 5" value={thicknessMm} onChange={(e) => setThicknessMm(e.target.value)} className="calc-input" />
            </div>
          </>
        )}

        {steelType === "pipe" && (
          <>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Outer Diameter (mm)</label>
              <input type="number" placeholder="e.g. 48.3" value={outerDiaMm} onChange={(e) => setOuterDiaMm(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Wall Thickness (mm)</label>
              <input type="number" placeholder="e.g. 3.2" value={wallThickMm} onChange={(e) => setWallThickMm(e.target.value)} className="calc-input" />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Length (meters)</label>
          <input type="number" placeholder="12" value={lengthM} onChange={(e) => setLengthM(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Quantity (pieces)</label>
          <input type="number" placeholder="1" value={qty} onChange={(e) => setQty(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Rate (per kg)</label>
          <input type="number" placeholder="e.g. 65" value={rate} onChange={(e) => setRate(e.target.value)} className="calc-input" />
        </div>
      </div>

      {/* Per-meter weight table for TMT */}
      {steelType === "tmt" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left font-semibold text-gray-600">Dia (mm)</th>
                <th className="p-2 text-right font-semibold text-gray-600">Wt/m (kg)</th>
                <th className="p-2 text-right font-semibold text-gray-600">Wt/12m (kg)</th>
              </tr>
            </thead>
            <tbody>
              {TMT_BARS.map((d) => {
                const dm = d / 1000;
                const wpm = STEEL_DENSITY * Math.PI * dm * dm / 4;
                return (
                  <tr key={d} className={d === tmtDia ? "bg-indigo-50 font-semibold" : ""}>
                    <td className="p-2">{d} mm</td>
                    <td className="p-2 text-right">{wpm.toFixed(3)}</td>
                    <td className="p-2 text-right">{(wpm * 12).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Total Weight</div>
            <div className="text-5xl font-extrabold text-indigo-600">{parseFloat(result.totalWeight).toLocaleString("en-IN")} kg</div>
            <div className="text-xs text-gray-400 mt-1">Per meter: {result.weightPerMeter} kg | {result.pieces} pc x {result.lengthEach}m</div>
          </div>

          {result.totalCost > 0 && (
            <div className="border-t border-gray-100 pt-4 text-center">
              <div className="text-xs text-gray-400">Estimated Cost</div>
              <div className="text-3xl font-bold text-green-600">{fmtCur(result.totalCost)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
