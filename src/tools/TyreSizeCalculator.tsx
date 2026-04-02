"use client";
import { useState, useMemo } from "react";

export default function TyreSizeCalculator() {
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [width1, setWidth1] = useState(185);
  const [aspect1, setAspect1] = useState(65);
  const [rim1, setRim1] = useState(15);
  const [width2, setWidth2] = useState(195);
  const [aspect2, setAspect2] = useState(60);
  const [rim2, setRim2] = useState(16);

  function calcTyre(width: number, aspect: number, rim: number) {
    const sidewallMM = width * (aspect / 100);
    const sidewallInch = sidewallMM / 25.4;
    const diameterMM = (sidewallMM * 2) + (rim * 25.4);
    const diameterInch = diameterMM / 25.4;
    const circumferenceMM = Math.PI * diameterMM;
    const circumferenceInch = circumferenceMM / 25.4;
    const revsPerKm = 1000000 / circumferenceMM;
    return { sidewallMM, sidewallInch, diameterMM, diameterInch, circumferenceMM, circumferenceInch, revsPerKm };
  }

  const tyre1 = useMemo(() => calcTyre(width1, aspect1, rim1), [width1, aspect1, rim1]);
  const tyre2 = useMemo(() => calcTyre(width2, aspect2, rim2), [width2, aspect2, rim2]);

  const comparison = useMemo(() => {
    if (mode !== "compare") return null;
    const diamDiff = tyre2.diameterMM - tyre1.diameterMM;
    const diamDiffPct = (diamDiff / tyre1.diameterMM) * 100;
    const circumDiff = tyre2.circumferenceMM - tyre1.circumferenceMM;
    const speedoDiff = diamDiffPct; // speedometer reads differently proportional to diameter change
    return { diamDiff, diamDiffPct, circumDiff, speedoDiff };
  }, [mode, tyre1, tyre2]);

  function TyreInput({ prefix, w, a, r, setW, setA, setR }: { prefix: string; w: number; a: number; r: number; setW: (n: number) => void; setA: (n: number) => void; setR: (n: number) => void }) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-bold text-indigo-600">{prefix}: {w}/{a} R{r}</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500">Width (mm)</label>
            <input type="number" className="calc-input" value={w} onChange={(e) => setW(+e.target.value)} min={100} max={400} step={5} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Aspect Ratio (%)</label>
            <input type="number" className="calc-input" value={a} onChange={(e) => setA(+e.target.value)} min={20} max={90} step={5} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Rim (inches)</label>
            <input type="number" className="calc-input" value={r} onChange={(e) => setR(+e.target.value)} min={12} max={22} />
          </div>
        </div>
      </div>
    );
  }

  function TyreResults({ label, t, w, a, r }: { label: string; t: ReturnType<typeof calcTyre>; w: number; a: number; r: number }) {
    return (
      <div className="space-y-3">
        <h4 className="font-bold text-gray-800">{label}: {w}/{a} R{r}</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xs text-gray-500">Sidewall Height</div>
            <div className="text-lg font-extrabold text-indigo-600">{t.sidewallMM.toFixed(1)} mm</div>
            <div className="text-xs text-gray-400">{t.sidewallInch.toFixed(2)}&quot;</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xs text-gray-500">Tyre Diameter</div>
            <div className="text-lg font-extrabold text-emerald-600">{t.diameterMM.toFixed(1)} mm</div>
            <div className="text-xs text-gray-400">{t.diameterInch.toFixed(2)}&quot;</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xs text-gray-500">Circumference</div>
            <div className="text-lg font-extrabold text-purple-600">{t.circumferenceMM.toFixed(1)} mm</div>
            <div className="text-xs text-gray-400">{t.circumferenceInch.toFixed(2)}&quot;</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xs text-gray-500">Revs per km</div>
            <div className="text-lg font-extrabold text-gray-700">{t.revsPerKm.toFixed(0)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <button onClick={() => setMode("single")} className={mode === "single" ? "btn-primary" : "btn-secondary"}>Single Tyre</button>
        <button onClick={() => setMode("compare")} className={mode === "compare" ? "btn-primary" : "btn-secondary"}>Compare Two</button>
      </div>

      <div className="space-y-4">
        <TyreInput prefix={mode === "compare" ? "Tyre 1 (Current)" : "Tyre"} w={width1} a={aspect1} r={rim1} setW={setWidth1} setA={setAspect1} setR={setRim1} />
        {mode === "compare" && (
          <TyreInput prefix="Tyre 2 (New)" w={width2} a={aspect2} r={rim2} setW={setWidth2} setA={setAspect2} setR={setRim2} />
        )}
      </div>

      {/* Explanation */}
      <div className="result-card space-y-2">
        <h3 className="text-lg font-bold text-gray-800">Tyre Marking Explained: {width1}/{aspect1} R{rim1}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <div className="font-bold text-indigo-700">{width1} mm</div>
            <div className="text-xs text-gray-500">Tread Width</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="font-bold text-purple-700">{aspect1}%</div>
            <div className="text-xs text-gray-500">Aspect Ratio (sidewall height as % of width)</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <div className="font-bold text-emerald-700">R</div>
            <div className="text-xs text-gray-500">Radial Construction</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="font-bold text-amber-700">{rim1}&quot;</div>
            <div className="text-xs text-gray-500">Rim Diameter</div>
          </div>
        </div>
      </div>

      <div className="result-card space-y-4">
        <TyreResults label={mode === "compare" ? "Tyre 1 (Current)" : "Results"} t={tyre1} w={width1} a={aspect1} r={rim1} />
        {mode === "compare" && (
          <>
            <hr className="border-gray-200" />
            <TyreResults label="Tyre 2 (New)" t={tyre2} w={width2} a={aspect2} r={rim2} />
          </>
        )}
      </div>

      {comparison && (
        <div className="result-card space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Comparison</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500">Diameter Difference</div>
              <div className={`text-xl font-extrabold ${comparison.diamDiff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {comparison.diamDiff >= 0 ? "+" : ""}{comparison.diamDiff.toFixed(1)} mm
              </div>
              <div className="text-xs text-gray-400">({comparison.diamDiffPct.toFixed(2)}%)</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500">Circumference Diff</div>
              <div className={`text-xl font-extrabold ${comparison.circumDiff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {comparison.circumDiff >= 0 ? "+" : ""}{comparison.circumDiff.toFixed(1)} mm
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500">Speedometer Error</div>
              <div className={`text-xl font-extrabold ${Math.abs(comparison.speedoDiff) <= 3 ? "text-emerald-600" : "text-amber-600"}`}>
                {comparison.speedoDiff >= 0 ? "+" : ""}{comparison.speedoDiff.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400">{Math.abs(comparison.speedoDiff) <= 3 ? "Acceptable" : "May affect accuracy"}</div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Keep diameter difference within +/- 3% for safe operation and accurate speedometer.</p>
        </div>
      )}
    </div>
  );
}
