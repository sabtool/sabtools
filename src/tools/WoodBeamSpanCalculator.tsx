"use client";
import { useMemo, useState } from "react";

/**
 * Wood Beam / LVL Beam Span Calculator
 *
 * Calculates maximum allowable span and load for timber and LVL
 * (Laminated Veneer Lumber) beams under bending and deflection,
 * per IS 883:1994 (Indian Standard — Design of Structural Timber
 * in Buildings) and IS 1708:1986 (Methods of Test for Small Clear
 * Specimens of Timber).
 *
 * Indian timber species groups (IS 883 + IS 1708):
 *   Group A: Teak (sagwan), Sal, Sissoo, Padauk, Babul
 *           σ_bending = 16.5 N/mm²,  E = 12,500 N/mm²
 *   Group B: Deodar, Kail, Chir Indian, Mango, Eucalyptus
 *           σ_bending = 10.5 N/mm²,  E = 8,500 N/mm²
 *   Group C: Pine, Poplar, Rubber, Hollock
 *           σ_bending =  7.0 N/mm²,  E = 6,000 N/mm²
 *
 * LVL (Engineered):
 *   Standard 1.9E LVL: σ_bending = 19.0 N/mm², E = 13,200 N/mm²
 *   Premium 2.0E LVL:  σ_bending = 24.0 N/mm², E = 14,000 N/mm²
 *
 * Formulas (simply supported, uniformly distributed load):
 *   M_max     = w·L² / 8          [bending moment]
 *   V_max     = w·L / 2           [max shear]
 *   δ_max     = 5·w·L⁴ / (384·E·I)  [max deflection mid-span]
 *
 * Cantilever (UDL):
 *   M_max     = w·L² / 2
 *   V_max     = w·L
 *   δ_max     = w·L⁴ / (8·E·I)    [at free end]
 *
 * Section properties (rectangular):
 *   I = b·d³/12,   Z = b·d²/6
 *
 * Allowable check:
 *   Bending      : M ≤ Z · σ_allow
 *   Deflection   : δ ≤ L/limit  (typ. L/350 for floor beams)
 */

interface Species {
  key: string;
  label: string;
  group: string;
  sigma: number;   // N/mm², allowable bending stress
  E: number;       // N/mm², modulus of elasticity
  ratePerCft: number; // approx market rate INR per cft in India 2026
}

const SPECIES: Species[] = [
  // Indian solid timber per IS 883:1994
  { key: "teak",      label: "Teak (Sagwan)",      group: "A", sigma: 16.5, E: 12500, ratePerCft: 3800 },
  { key: "sal",       label: "Sal",                group: "A", sigma: 16.5, E: 12500, ratePerCft: 2200 },
  { key: "sissoo",    label: "Sissoo (Shisham)",   group: "A", sigma: 16.5, E: 12500, ratePerCft: 2400 },
  { key: "padauk",    label: "Padauk",             group: "A", sigma: 16.5, E: 12500, ratePerCft: 2800 },
  { key: "deodar",    label: "Deodar",             group: "B", sigma: 10.5, E:  8500, ratePerCft: 1500 },
  { key: "kail",      label: "Kail",               group: "B", sigma: 10.5, E:  8500, ratePerCft: 1100 },
  { key: "chir",      label: "Chir Pine",          group: "B", sigma: 10.5, E:  8500, ratePerCft:  900 },
  { key: "mango",     label: "Mango",              group: "B", sigma: 10.5, E:  8500, ratePerCft:  850 },
  { key: "eucalyptus",label: "Eucalyptus",         group: "B", sigma: 10.5, E:  8500, ratePerCft:  750 },
  { key: "poplar",    label: "Poplar",             group: "C", sigma:  7.0, E:  6000, ratePerCft:  650 },
  { key: "rubber",    label: "Rubber wood",        group: "C", sigma:  7.0, E:  6000, ratePerCft:  600 },
  // Engineered LVL
  { key: "lvl19",     label: "LVL 1.9E (standard)",group: "LVL", sigma: 19.0, E: 13200, ratePerCft: 3500 },
  { key: "lvl20",     label: "LVL 2.0E (premium)", group: "LVL", sigma: 24.0, E: 14000, ratePerCft: 4500 },
];

// Standard beam sizes (mm) commonly stocked in India
const SIZES = [
  { b:  50, d: 100 },
  { b:  50, d: 150 },
  { b:  50, d: 200 },
  { b:  50, d: 250 },
  { b:  75, d: 150 },
  { b:  75, d: 200 },
  { b:  75, d: 250 },
  { b: 100, d: 150 },
  { b: 100, d: 200 },
  { b: 100, d: 250 },
  { b: 100, d: 300 },
  { b: 150, d: 300 },
];

interface Inputs {
  speciesKey: string;
  b: number;  // mm
  d: number;  // mm
  span: number;  // m
  support: "simple" | "cantilever";
  loadingType: "area" | "line";
  deadLoad: number;        // kN/m² or kN/m (depending on loadingType)
  liveLoad: number;        // kN/m² or kN/m
  tributaryWidth: number;  // m (for area loading)
  deflectionLimit: number; // L/value, e.g. 350
}

interface Result {
  species: Species;
  area: number;          // mm²
  I: number;             // mm⁴
  Z: number;             // mm³
  wTotal: number;        // kN/m  (line load on beam)
  maxMoment: number;     // kN·m
  maxShear: number;      // kN
  deflection: number;    // mm (under wTotal)
  maxAllowableMoment: number; // kN·m
  maxAllowableSpanBending: number; // m
  maxAllowableSpanDeflection: number; // m
  maxAllowableSpan: number; // m (governing)
  bendingUtilisation: number; // %
  deflectionUtilisation: number; // %
  pass: boolean;
  governing: "bending" | "deflection" | "none";
  beamVolumeCft: number;
  cost: number;
}

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n) || n === 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: max })
    .format(Math.round(n));
}

function compute(i: Inputs): Result | null {
  const species = SPECIES.find((s) => s.key === i.speciesKey);
  if (!species || i.b <= 0 || i.d <= 0 || i.span <= 0) return null;

  // Section properties (mm)
  const area = i.b * i.d;
  const I = (i.b * Math.pow(i.d, 3)) / 12; // mm⁴
  const Z = (i.b * Math.pow(i.d, 2)) / 6;  // mm³

  // Combined uniform load on beam (kN/m)
  const wTotal =
    i.loadingType === "area"
      ? (i.deadLoad + i.liveLoad) * i.tributaryWidth
      : i.deadLoad + i.liveLoad;

  // Moment, shear, deflection (simply supported UDL)
  const L = i.span; // m
  let maxMoment = 0; // kN·m
  let maxShear = 0;  // kN
  let deflection = 0; // mm

  if (i.support === "simple") {
    maxMoment = (wTotal * L * L) / 8;
    maxShear = (wTotal * L) / 2;
    // δ = 5wL⁴/(384EI). Convert to mm.
    // w [N/mm], L [mm], E [N/mm²], I [mm⁴]
    const w_Nmm = (wTotal * 1000) / 1000; // kN/m = N/mm
    const L_mm = L * 1000;
    deflection =
      (5 * w_Nmm * Math.pow(L_mm, 4)) / (384 * species.E * I);
  } else {
    // Cantilever UDL
    maxMoment = (wTotal * L * L) / 2;
    maxShear = wTotal * L;
    const w_Nmm = (wTotal * 1000) / 1000;
    const L_mm = L * 1000;
    deflection =
      (w_Nmm * Math.pow(L_mm, 4)) / (8 * species.E * I);
  }

  // Allowable moment from bending stress (kN·m)
  // M_allow = Z [mm³] × σ [N/mm²] = N·mm  → kN·m = / 1e6
  const maxAllowableMoment = (Z * species.sigma) / 1e6;

  // Max span (m) where bending controls
  // For simply supported: M = wL²/8 → L = sqrt(8M/w)
  // For cantilever: M = wL²/2 → L = sqrt(2M/w)
  let maxAllowableSpanBending = 0;
  let maxAllowableSpanDeflection = 0;
  if (wTotal > 0) {
    if (i.support === "simple") {
      maxAllowableSpanBending = Math.sqrt((8 * maxAllowableMoment) / wTotal);
      // δ = 5wL⁴/(384EI) ≤ L/limit  → L³ ≤ 384·E·I / (5·w·limit)
      // Solve for L: L_max = ( 384·E·I / (5·w·limit) )^(1/3)
      const w_Nmm = wTotal;
      const numerator = 384 * species.E * I; // N/mm² × mm⁴ = N·mm²
      const denominator = 5 * w_Nmm * i.deflectionLimit;
      maxAllowableSpanDeflection = Math.pow(numerator / denominator, 1 / 3) / 1000;
    } else {
      maxAllowableSpanBending = Math.sqrt((2 * maxAllowableMoment) / wTotal);
      // δ_cantilever = wL⁴/(8EI) ≤ L/limit  → L³ ≤ 8·E·I / (w·limit)
      const w_Nmm = wTotal;
      const numerator = 8 * species.E * I;
      const denominator = w_Nmm * i.deflectionLimit;
      maxAllowableSpanDeflection = Math.pow(numerator / denominator, 1 / 3) / 1000;
    }
  }

  const maxAllowableSpan = Math.min(maxAllowableSpanBending, maxAllowableSpanDeflection);
  const bendingUtilisation = (maxMoment / maxAllowableMoment) * 100;
  const allowedDeflection = (L * 1000) / i.deflectionLimit;
  const deflectionUtilisation = (deflection / allowedDeflection) * 100;

  let governing: Result["governing"] = "none";
  let pass = true;
  if (maxMoment > maxAllowableMoment) { pass = false; governing = "bending"; }
  if (deflection > allowedDeflection) {
    pass = false;
    if (governing === "none") governing = "deflection";
  }

  // Cost: beam volume (cft) × rate
  const beamVolume_m3 = (i.b / 1000) * (i.d / 1000) * L; // m³
  const beamVolumeCft = beamVolume_m3 * 35.3147;
  const cost = beamVolumeCft * species.ratePerCft;

  return {
    species,
    area,
    I,
    Z,
    wTotal,
    maxMoment,
    maxShear,
    deflection,
    maxAllowableMoment,
    maxAllowableSpanBending,
    maxAllowableSpanDeflection,
    maxAllowableSpan,
    bendingUtilisation,
    deflectionUtilisation,
    pass,
    governing,
    beamVolumeCft,
    cost,
  };
}

export default function WoodBeamSpanCalculator() {
  const [speciesKey, setSpeciesKey] = useState("teak");
  const [sizeIdx, setSizeIdx] = useState(8); // 100×200
  const [customSize, setCustomSize] = useState(false);
  const [b, setB] = useState("100");
  const [d, setD] = useState("200");
  const [span, setSpan] = useState("3.5");
  const [support, setSupport] = useState<"simple" | "cantilever">("simple");
  const [loadingType, setLoadingType] = useState<"area" | "line">("area");
  const [deadLoad, setDeadLoad] = useState("1.5");
  const [liveLoad, setLiveLoad] = useState("2.0");
  const [tributaryWidth, setTributaryWidth] = useState("1.2");
  const [deflectionLimit, setDeflectionLimit] = useState("350");

  // Derived b/d if not custom
  const effectiveB = customSize ? parseFloat(b) || 0 : SIZES[sizeIdx]?.b ?? 100;
  const effectiveD = customSize ? parseFloat(d) || 0 : SIZES[sizeIdx]?.d ?? 200;

  const inputs: Inputs = {
    speciesKey,
    b: effectiveB,
    d: effectiveD,
    span: parseFloat(span) || 0,
    support,
    loadingType,
    deadLoad: parseFloat(deadLoad) || 0,
    liveLoad: parseFloat(liveLoad) || 0,
    tributaryWidth: parseFloat(tributaryWidth) || 0,
    deflectionLimit: parseFloat(deflectionLimit) || 350,
  };

  const result = useMemo(() => compute(inputs), [
    speciesKey, effectiveB, effectiveD, span, support, loadingType,
    deadLoad, liveLoad, tributaryWidth, deflectionLimit,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Species + section */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🪵 Beam material + section</h3>
        <p className="text-xs text-gray-500 mb-3">
          Allowable stresses per IS 883:1994 species groups. LVL values per ASTM D5456 typical
          properties for products sold in India.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Beam material / species</label>
            <select value={speciesKey} onChange={(e) => setSpeciesKey(e.target.value)} className="calc-input">
              <optgroup label="Group A — strong hardwoods (σ = 16.5 N/mm²)">
                {SPECIES.filter((s) => s.group === "A").map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </optgroup>
              <optgroup label="Group B — medium softwoods (σ = 10.5 N/mm²)">
                {SPECIES.filter((s) => s.group === "B").map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </optgroup>
              <optgroup label="Group C — light woods (σ = 7.0 N/mm²)">
                {SPECIES.filter((s) => s.group === "C").map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </optgroup>
              <optgroup label="LVL Engineered (σ = 19-24 N/mm²)">
                {SPECIES.filter((s) => s.group === "LVL").map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Beam size (b × d, mm)</label>
            {!customSize ? (
              <select value={sizeIdx} onChange={(e) => setSizeIdx(parseInt(e.target.value))} className="calc-input">
                {SIZES.map((s, i) => (
                  <option key={i} value={i}>{s.b} × {s.d} mm</option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="calc-input" placeholder="b (mm)" />
                <input type="number" value={d} onChange={(e) => setD(e.target.value)} className="calc-input" placeholder="d (mm)" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setCustomSize(!customSize)}
              className="text-[11px] text-indigo-600 font-semibold mt-1 hover:underline"
            >
              {customSize ? "← back to standard sizes" : "use custom b × d →"}
            </button>
          </div>
        </div>
      </div>

      {/* Span + support */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📏 Span + support condition</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Clear span (m)" value={span} setValue={setSpan} hint="Distance between supports — centre-to-centre" />
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Support condition</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "simple", label: "Simply supported" },
                { key: "cantilever", label: "Cantilever" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSupport(s.key as "simple" | "cantilever")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    support === s.key
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Simply supported is the standard floor / lintel case.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Deflection limit (L / X)</label>
            <select value={deflectionLimit} onChange={(e) => setDeflectionLimit(e.target.value)} className="calc-input">
              <option value="180">L / 180 — roof beams (live load only)</option>
              <option value="240">L / 240 — roof beams (total load)</option>
              <option value="350">L / 350 — floor beams (IS 883 default)</option>
              <option value="480">L / 480 — premium floors, brittle finish</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">IS 883 spec: span ÷ this number must exceed actual deflection.</p>
          </div>
        </div>
      </div>

      {/* Loading */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">⚖️ Loading</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">How is load applied?</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLoadingType("area")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  loadingType === "area"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                }`}
              >
                Area load (kN/m²) × tributary width
              </button>
              <button
                onClick={() => setLoadingType("line")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  loadingType === "line"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                }`}
              >
                Line load directly (kN/m)
              </button>
            </div>
          </div>
          <Field
            label={`Dead load (${loadingType === "area" ? "kN/m²" : "kN/m"})`}
            value={deadLoad}
            setValue={setDeadLoad}
            hint={loadingType === "area" ? "Slab + finishes typical 2-4 kN/m²" : "Dead load per metre of beam"}
          />
          <Field
            label={`Live load (${loadingType === "area" ? "kN/m²" : "kN/m"})`}
            value={liveLoad}
            setValue={setLiveLoad}
            hint={loadingType === "area" ? "Residential 2 kN/m², office 3 kN/m², storage 5 kN/m² (IS 875)" : "Live load per metre"}
          />
          {loadingType === "area" && (
            <Field label="Tributary width (m)" value={tributaryWidth} setValue={setTributaryWidth} hint="Half-span to next parallel beam, both sides" />
          )}
        </div>
      </div>

      {/* Result */}
      {result ? (
        <>
          <div className={`border-2 rounded-2xl p-5 ${result.pass ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{result.pass ? "✅" : "❌"}</span>
              <div>
                <h3 className={`text-lg font-extrabold ${result.pass ? "text-emerald-900" : "text-red-900"}`}>
                  {result.pass ? "Beam PASSES — safe to specify" : `Beam FAILS in ${result.governing}`}
                </h3>
                <p className={`text-sm ${result.pass ? "text-emerald-800" : "text-red-800"}`}>
                  {result.pass
                    ? `Bending utilisation ${result.bendingUtilisation.toFixed(0)}%, deflection utilisation ${result.deflectionUtilisation.toFixed(0)}% — both under 100%.`
                    : result.governing === "bending"
                      ? `Bending utilisation ${result.bendingUtilisation.toFixed(0)}% exceeds 100%. Increase depth or upgrade to a stronger species / LVL.`
                      : `Deflection ${result.deflection.toFixed(1)} mm exceeds allowable ${((parseFloat(span) * 1000) / result.species.E === 0 ? 0 : (parseFloat(span) * 1000) / parseFloat(deflectionLimit)).toFixed(1)} mm. Increase depth — deflection scales with d³ so going one size up usually fixes it.`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Max allowable span</div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">{result.maxAllowableSpan.toFixed(2)} m</div>
              <div className="text-[11px] text-indigo-700 mt-1">
                Bending: {result.maxAllowableSpanBending.toFixed(2)} m · Deflection: {result.maxAllowableSpanDeflection.toFixed(2)} m
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Actual deflection</div>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">{result.deflection.toFixed(1)} mm</div>
              <div className="text-[11px] text-amber-700 mt-1">
                Allowed: {((parseFloat(span) * 1000) / parseFloat(deflectionLimit)).toFixed(1)} mm (L/{deflectionLimit})
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Beam cost</div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{fmtINR(result.cost)}</div>
              <div className="text-[11px] text-emerald-700 mt-1">
                {result.beamVolumeCft.toFixed(2)} cft × ₹{result.species.ratePerCft}/cft
              </div>
            </div>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📊 Engineering checks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left py-2 pr-3">Check</th>
                    <th className="text-right py-2 pr-3">Actual</th>
                    <th className="text-right py-2 pr-3">Allowable</th>
                    <th className="text-right py-2">Utilisation</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Bending moment</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.maxMoment.toFixed(2)} kN·m</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.maxAllowableMoment.toFixed(2)} kN·m</td>
                    <td className={`py-2 text-right tabular-nums font-bold ${result.bendingUtilisation > 100 ? "text-red-700" : result.bendingUtilisation > 80 ? "text-amber-700" : "text-emerald-700"}`}>
                      {result.bendingUtilisation.toFixed(0)}%
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Mid-span deflection</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.deflection.toFixed(2)} mm</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{((parseFloat(span) * 1000) / parseFloat(deflectionLimit)).toFixed(2)} mm</td>
                    <td className={`py-2 text-right tabular-nums font-bold ${result.deflectionUtilisation > 100 ? "text-red-700" : result.deflectionUtilisation > 80 ? "text-amber-700" : "text-emerald-700"}`}>
                      {result.deflectionUtilisation.toFixed(0)}%
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Max shear</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.maxShear.toFixed(2)} kN</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-gray-400">Check shear stress separately for short spans</td>
                    <td className="py-2 text-right tabular-nums text-gray-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🔬 Section properties</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <Stat label="Cross-section area" value={`${result.area.toLocaleString("en-IN")} mm²`} />
              <Stat label="Moment of Inertia I" value={`${(result.I / 1e6).toFixed(2)} × 10⁶ mm⁴`} />
              <Stat label="Section modulus Z" value={`${(result.Z / 1000).toFixed(2)} × 10³ mm³`} />
              <Stat label="Beam line load" value={`${result.wTotal.toFixed(2)} kN/m`} />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter beam dimensions, span and load to see allowable span + utilisation check.
        </div>
      )}

      {/* Reference table */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📋 IS 883 species groups + LVL reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Species</th>
                <th className="text-left py-2 pr-3">Group</th>
                <th className="text-left py-2 pr-3">σ allowable (N/mm²)</th>
                <th className="text-left py-2 pr-3">E modulus (N/mm²)</th>
                <th className="text-left py-2">Approx rate (₹/cft, 2026)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {SPECIES.map((s) => (
                <tr key={s.key} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-bold">{s.label}</td>
                  <td className="py-2 pr-3">{s.group}</td>
                  <td className="py-2 pr-3 tabular-nums">{s.sigma}</td>
                  <td className="py-2 pr-3 tabular-nums">{s.E.toLocaleString("en-IN")}</td>
                  <td className="py-2 tabular-nums text-amber-700">₹{s.ratePerCft.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Allowable stresses from IS 883:1994 Table 1 (permissible inside locations, Group classification).
          Rates are pan-India tier-2 averages for seasoned, gradable structural timber (June 2026) — Mumbai
          / Delhi pricing 30-50% higher; village/forest depots 20-30% lower. Always verify moisture content
          (≤ 14% for structural use per IS 287).
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 IS 883 design formulas</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Section properties (rectangular):
  Area    A = b × d
  I       = b·d³ / 12      (mm⁴)
  Z       = b·d² / 6       (mm³)

Simply supported beam, uniformly distributed load w (kN/m):
  M_max   = w·L² / 8       (kN·m)
  V_max   = w·L / 2        (kN)
  δ_max   = 5·w·L⁴ / (384·E·I)   (mid-span)

Cantilever beam, uniformly distributed load:
  M_max   = w·L² / 2
  V_max   = w·L
  δ_max   = w·L⁴ / (8·E·I)       (at free end)

IS 883 checks:
  Bending     :  M ≤ Z · σ_allow
  Deflection  :  δ ≤ L / 350    (floor beams, default)
                  L / 180-240   (roof beams)
                  L / 480       (brittle finish, premium)

Max allowable span (governing of two):
  Bending     :  L = √(8·M_allow / w)        [simply supported]
                 L = √(2·M_allow / w)        [cantilever]
  Deflection  :  L = ∛(384·E·I / (5·w·k))    [simply supported]
                 L = ∛(8·E·I / (w·k))        [cantilever]
                 where k = deflection limit (e.g. 350)`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          <strong>Critical insight:</strong> deflection usually governs for timber beams above ~3 m span.
          Because δ scales with L⁴ but moment with L², doubling the span makes deflection 16× worse but
          stress only 4× worse. Going one size deeper in d (e.g. 200 → 250 mm) halves both deflection and
          stress because d enters the section modulus quadratically and I cubically.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">Solid timber vs LVL — which should I use?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Solid timber (teak, sal, deodar)</strong>: natural material, visible grain,
              traditional finish, but limited length (typically ≤ 4 m for large sections), variable
              quality, susceptible to warping in humid conditions. <strong>LVL (Laminated Veneer
              Lumber)</strong>: engineered product made by gluing thin wood veneers in parallel —
              available in lengths up to 18 m, dimensionally stable, predictable strength (σ = 19-24
              N/mm² vs teak&apos;s 16.5), 30-40% stronger per cubic foot. <strong>Use LVL for</strong>{" "}
              spans over 4 m, exposed structural beams in earthquake zones, or modern interior work.
              <strong> Use solid timber for</strong> traditional architecture, exposed beams as a
              design feature, or where LVL isn&apos;t locally available. LVL is now stocked in
              Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune — most other tier-2 cities have to
              order via importer (2-3 week lead time).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What does IS 883 group A/B/C mean?</h4>
            <p className="text-gray-600 mt-1">
              IS 883:1994 classifies Indian timber into three groups based on permissible bending
              stress: <strong>Group A (16.5 N/mm²)</strong> — strong hardwoods like Teak, Sal,
              Sissoo, Padauk, Babul; <strong>Group B (10.5 N/mm²)</strong> — medium woods like
              Deodar, Kail, Chir, Mango; <strong>Group C (7.0 N/mm²)</strong> — light woods like
              Pine, Poplar, Rubber. These values are for {"\""}inside locations{"\""} (seasoned timber,
              dry, protected). For {"\""}outside locations{"\""} or {"\""}wet locations{"\""} the stresses are
              reduced — multiply by 0.8 for outside and 0.55 for permanently wet. The calculator
              uses the inside-location values which are appropriate for floor beams, lintels, and
              interior columns.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Why does deflection control over bending most of the time?</h4>
            <p className="text-gray-600 mt-1">
              Two reasons. <strong>(1) Math:</strong> deflection grows with L⁴ while bending grows
              with L². Above ~3 m spans, deflection grows faster than stress. <strong>(2) Code:</strong>{" "}
              IS 883&apos;s deflection limit (L/350 for floor beams) is conservative — it ensures the
              floor doesn&apos;t feel bouncy or crack brittle finishes. For a typical 4 m × 100 × 200
              mm teak floor beam, you usually have 40-60% bending utilisation but 80-95% deflection
              utilisation. <strong>Fix:</strong> go one size deeper in d. δ scales as 1/d³ so a 200 →
              250 mm beam cuts deflection by 49%. Widening (b) helps but proportionally less
              (deflection scales as 1/b only).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What is tributary width — and how do I calculate it?</h4>
            <p className="text-gray-600 mt-1">
              The width of slab / floor that loads onto a single beam. <strong>Tributary width = (½
              distance to beam on left) + (½ distance to beam on right)</strong>. For a 3-beam floor
              where beams are 1.2 m apart, the middle beam has tributary width 0.6 + 0.6 = 1.2 m. End
              beams have ~0.6 m (because no beam to one side, just a wall taking part of the load
              via the slab). Once you have tributary width, multiply by the area load (kN/m²) to get
              the line load (kN/m) on the beam. The calculator above does this automatically when
              you enter loads in kN/m².
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What live load should I use (IS 875)?</h4>
            <p className="text-gray-600 mt-1">
              IS 875 Part 2 specifies minimum live loads. Common values for residential / commercial:
              <strong> Residential rooms: 2.0 kN/m²</strong>; <strong>Balconies, kitchens: 3.0
              kN/m²</strong>; <strong>Offices: 2.5-3.0 kN/m²</strong> (general / corridor);
              <strong> Shops, restaurants: 4.0 kN/m²</strong>; <strong>Storage / warehouse: 5-10
              kN/m²</strong> depending on goods; <strong>Roof (accessible): 1.5 kN/m²</strong>;
              <strong> Roof (non-accessible): 0.75 kN/m²</strong>. Add dead load (slab self-weight ~ 2
              kN/m² for 100 mm slab, finishes 1-2 kN/m²). For residential floor beam total: dead 3 +
              live 2 = 5 kN/m² typical.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What about termites and moisture in India?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Termite-resistant species</strong>: Teak, Sal, Deodar are naturally resistant.
              Sissoo and Mango are moderately resistant. Eucalyptus, Mango, Rubber, Poplar are NOT
              termite-resistant — must be pressure-treated with CCA, CCB, or boron salts per IS
              401:2001 before use as structural members. <strong>Moisture content</strong>: IS 287
              requires structural timber at ≤ 14% moisture content for inside use — buy kiln-seasoned
              or air-seasoned timber, not green/wet timber. <strong>LVL</strong> is glued with phenol-
              formaldehyde resin which is termite-resistant and dimensionally stable, but if used in
              wet locations (bathrooms, exterior) requires additional water-proofing — most LVL is
              specified for interior dry use unless explicitly marked weather-resistant.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How much does a wood beam cost in India in 2026?</h4>
            <p className="text-gray-600 mt-1">
              For a typical 100 × 200 mm × 4 m floor beam (0.08 m³ = 2.83 cft):{" "}
              <strong>Teak ₹10,750</strong>, <strong>Sal ₹6,225</strong>,{" "}
              <strong>Sissoo ₹6,790</strong>, <strong>Deodar ₹4,245</strong>,{" "}
              <strong>Eucalyptus ₹2,120</strong>, <strong>LVL 1.9E ₹9,900</strong>,
              <strong> LVL 2.0E ₹12,725</strong>. Pure timber cost — add labour (₹500-1,000 to install
              a single beam), hardware (joist hangers, bolts ₹150-400 per connection), and treatment
              for non-resistant species (₹300-500 per beam). LVL needs no termite treatment so net
              cost vs Teak is usually competitive once you add Teak treatment + the LVL strength
              advantage (smaller section needed for same load).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">When do I need a structural engineer instead of this calculator?</h4>
            <p className="text-gray-600 mt-1">
              This calculator handles the most common case: a single simply supported or cantilever
              beam with uniformly distributed load. <strong>Get a structural engineer for:</strong>{" "}
              (1) continuous beams over multiple supports — moment distribution changes the result;
              (2) point loads from a column landing mid-span; (3) earthquake-zone-V (Northeast,
              Gujarat Kutch, North Bihar) where seismic analysis is mandatory under IS 1893; (4) any
              load-bearing wall or roof structure where failure has life-safety consequences. The
              calculator is a sanity-check and procurement tool, not a substitute for a structural
              drawing certified by an RCC engineer. Even for the {"\""}simple{"\""} case, the calculator
              uses working-stress IS 883 — for commercial use under the latest National Building
              Code (NBC 2016), use a licensed engineer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, setValue, hint, step = 0.01 }: { label: string; value: string; setValue: (v: string) => void; hint?: string; step?: number }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="calc-input"
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{label}</div>
      <div className="text-base font-extrabold text-gray-800 mt-1">{value}</div>
    </div>
  );
}
