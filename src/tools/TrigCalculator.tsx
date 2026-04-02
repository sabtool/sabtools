"use client";
import { useState, useMemo } from "react";

const DEG = Math.PI / 180;

export default function TrigCalculator() {
  const [tab, setTab] = useState<"calc" | "inverse" | "convert">("calc");
  const [angle, setAngle] = useState("45");
  const [unit, setUnit] = useState<"deg" | "rad">("deg");

  // Inverse trig
  const [invFunc, setInvFunc] = useState("asin");
  const [invValue, setInvValue] = useState("0.5");

  // Convert
  const [convValue, setConvValue] = useState("180");
  const [convFrom, setConvFrom] = useState<"deg" | "rad">("deg");

  const trigResult = useMemo(() => {
    const val = parseFloat(angle);
    if (isNaN(val)) return null;
    const rad = unit === "deg" ? val * DEG : val;
    const deg = unit === "deg" ? val : val * (180 / Math.PI);

    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const tan = Math.abs(cos) < 1e-10 ? undefined : Math.tan(rad);
    const csc = Math.abs(sin) < 1e-10 ? undefined : 1 / sin;
    const sec = Math.abs(cos) < 1e-10 ? undefined : 1 / cos;
    const cot = tan === undefined ? (Math.abs(sin) < 1e-10 ? undefined : 0) : 1 / tan;

    return {
      deg: parseFloat(deg.toFixed(6)),
      rad: parseFloat(rad.toFixed(6)),
      sin, cos, tan, csc, sec, cot,
    };
  }, [angle, unit]);

  const inverseResult = useMemo(() => {
    const v = parseFloat(invValue);
    if (isNaN(v)) return null;
    let rad: number | null = null;
    let name = "";
    try {
      switch (invFunc) {
        case "asin": if (v < -1 || v > 1) return { error: "Value must be between -1 and 1" }; rad = Math.asin(v); name = "arcsin"; break;
        case "acos": if (v < -1 || v > 1) return { error: "Value must be between -1 and 1" }; rad = Math.acos(v); name = "arccos"; break;
        case "atan": rad = Math.atan(v); name = "arctan"; break;
      }
    } catch { return { error: "Invalid input" }; }
    if (rad === null) return null;
    return { name, rad, deg: rad * (180 / Math.PI) };
  }, [invFunc, invValue]);

  const convResult = useMemo(() => {
    const v = parseFloat(convValue);
    if (isNaN(v)) return null;
    if (convFrom === "deg") {
      return { from: `${v}\u00B0`, to: `${(v * Math.PI / 180).toFixed(8)} rad`, formula: `${v} \u00D7 \u03C0/180 = ${(v * Math.PI / 180).toFixed(8)}` };
    }
    return { from: `${v} rad`, to: `${(v * 180 / Math.PI).toFixed(6)}\u00B0`, formula: `${v} \u00D7 180/\u03C0 = ${(v * 180 / Math.PI).toFixed(6)}` };
  }, [convValue, convFrom]);

  const unitCircle = [
    { deg: 0, sin: "0", cos: "1", tan: "0" },
    { deg: 30, sin: "1/2", cos: "\u221A3/2", tan: "1/\u221A3" },
    { deg: 45, sin: "\u221A2/2", cos: "\u221A2/2", tan: "1" },
    { deg: 60, sin: "\u221A3/2", cos: "1/2", tan: "\u221A3" },
    { deg: 90, sin: "1", cos: "0", tan: "undefined" },
    { deg: 120, sin: "\u221A3/2", cos: "-1/2", tan: "-\u221A3" },
    { deg: 135, sin: "\u221A2/2", cos: "-\u221A2/2", tan: "-1" },
    { deg: 150, sin: "1/2", cos: "-\u221A3/2", tan: "-1/\u221A3" },
    { deg: 180, sin: "0", cos: "-1", tan: "0" },
    { deg: 270, sin: "-1", cos: "0", tan: "undefined" },
    { deg: 360, sin: "0", cos: "1", tan: "0" },
  ];

  const fmt = (v: number | undefined) => v === undefined ? "undefined" : parseFloat(v.toFixed(8)).toString();

  const FuncRow = ({ label, value, color }: { label: string; value: number | undefined; color: string }) => (
    <div className={`${color} rounded-lg p-3`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold font-mono">{fmt(value)}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTab("calc")} className={tab === "calc" ? "btn-primary" : "btn-secondary"}>Trig Functions</button>
          <button onClick={() => setTab("inverse")} className={tab === "inverse" ? "btn-primary" : "btn-secondary"}>Inverse Trig</button>
          <button onClick={() => setTab("convert")} className={tab === "convert" ? "btn-primary" : "btn-secondary"}>Deg/Rad Convert</button>
        </div>
      </div>

      {tab === "calc" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Enter Angle</h3>
            <div className="flex items-center gap-3">
              <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} className="calc-input w-32" />
              <div className="flex gap-2">
                <button onClick={() => setUnit("deg")} className={unit === "deg" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Degrees</button>
                <button onClick={() => setUnit("rad")} className={unit === "rad" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Radians</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {[0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360].map((d) => (
                <button key={d} onClick={() => { setAngle(String(d)); setUnit("deg"); }} className="btn-secondary text-xs px-2 py-1">{d}\u00B0</button>
              ))}
            </div>
          </div>

          {trigResult && (
            <div className="result-card">
              <p className="text-sm text-gray-500 mb-3">
                Angle: {trigResult.deg}\u00B0 = {trigResult.rad} rad
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <FuncRow label="sin" value={trigResult.sin} color="bg-indigo-50 text-indigo-600" />
                <FuncRow label="cos" value={trigResult.cos} color="bg-blue-50 text-blue-600" />
                <FuncRow label="tan" value={trigResult.tan} color="bg-green-50 text-green-600" />
                <FuncRow label="csc (1/sin)" value={trigResult.csc} color="bg-amber-50 text-amber-600" />
                <FuncRow label="sec (1/cos)" value={trigResult.sec} color="bg-rose-50 text-rose-600" />
                <FuncRow label="cot (1/tan)" value={trigResult.cot} color="bg-purple-50 text-purple-600" />
              </div>
            </div>
          )}
        </>
      )}

      {tab === "inverse" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Inverse Trig Function</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => setInvFunc("asin")} className={invFunc === "asin" ? "btn-primary text-xs" : "btn-secondary text-xs"}>arcsin</button>
              <button onClick={() => setInvFunc("acos")} className={invFunc === "acos" ? "btn-primary text-xs" : "btn-secondary text-xs"}>arccos</button>
              <button onClick={() => setInvFunc("atan")} className={invFunc === "atan" ? "btn-primary text-xs" : "btn-secondary text-xs"}>arctan</button>
            </div>
            <input type="number" value={invValue} onChange={(e) => setInvValue(e.target.value)} className="calc-input w-32" step="0.1" />
          </div>

          {inverseResult && (
            <div className="result-card">
              {"error" in inverseResult ? (
                <p className="text-red-500 font-medium">{inverseResult.error}</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{inverseResult.name}({invValue}) in Degrees</p>
                    <p className="text-2xl font-bold text-indigo-600">{parseFloat(inverseResult.deg.toFixed(6))}\u00B0</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{inverseResult.name}({invValue}) in Radians</p>
                    <p className="text-2xl font-bold text-green-600">{parseFloat(inverseResult.rad.toFixed(8))} rad</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab === "convert" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Convert Degrees / Radians</h3>
            <div className="flex items-center gap-3">
              <input type="number" value={convValue} onChange={(e) => setConvValue(e.target.value)} className="calc-input w-32" />
              <div className="flex gap-2">
                <button onClick={() => setConvFrom("deg")} className={convFrom === "deg" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Deg \u2192 Rad</button>
                <button onClick={() => setConvFrom("rad")} className={convFrom === "rad" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Rad \u2192 Deg</button>
              </div>
            </div>
          </div>

          {convResult && (
            <div className="result-card">
              <p className="text-sm text-gray-500">{convResult.from} =</p>
              <p className="text-2xl font-bold text-indigo-600">{convResult.to}</p>
              <p className="text-sm text-gray-500 mt-2 font-mono">{convResult.formula}</p>
            </div>
          )}
        </>
      )}

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Unit Circle Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-600">Degrees</th>
                <th className="text-left py-2 px-3 text-gray-600">Radians</th>
                <th className="text-left py-2 px-3 text-gray-600">sin</th>
                <th className="text-left py-2 px-3 text-gray-600">cos</th>
                <th className="text-left py-2 px-3 text-gray-600">tan</th>
              </tr>
            </thead>
            <tbody>
              {unitCircle.map((row) => (
                <tr key={row.deg} className="border-b border-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => { setAngle(String(row.deg)); setUnit("deg"); setTab("calc"); }}>
                  <td className="py-1 px-3 font-mono">{row.deg}\u00B0</td>
                  <td className="py-1 px-3 font-mono">{(row.deg * Math.PI / 180).toFixed(4)}</td>
                  <td className="py-1 px-3 font-mono">{row.sin}</td>
                  <td className="py-1 px-3 font-mono">{row.cos}</td>
                  <td className="py-1 px-3 font-mono">{row.tan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
