"use client";
import { useMemo, useState } from "react";

/**
 * Concrete Footing Volume Calculator — calculates concrete volume,
 * cement bags (50kg India standard), sand, aggregate, water,
 * rebar weight and cost for foundation footings using BIS mix
 * design ratios.
 *
 * India RCC mix designs (volumetric):
 *   M5  : 1 : 5 : 10   (lean concrete, blinding)
 *   M7.5: 1 : 4 : 8    (mass concrete fill)
 *   M10 : 1 : 3 : 6    (non-structural)
 *   M15 : 1 : 2 : 4    (PCC, light footings, flooring)
 *   M20 : 1 : 1.5 : 3  (standard RCC footings, slabs)
 *   M25 : 1 : 1 : 2    (columns, beams, heavy structures)
 *   M30 : 1 : 0.75:1.5 (high-strength, design-mix only beyond)
 *
 * Standard reference values (IS 456:2000 + IS 10262:2019):
 *   1 cement bag        = 50 kg = 0.0347 m³ (bulk density ~1440 kg/m³)
 *   1 m³ cement powder  = 28.8 bags
 *   Dry volume factor   = 1.54 × wet volume (allows for shrinkage/voids)
 *   Sand density        = 1600 kg/m³
 *   Aggregate density   = 1700 kg/m³ (20mm coarse)
 *   Steel weight        = (d² × L) / 162 kg/m  [BIS-IS:1786]
 *   1 brass             = 100 ft³ = 2.83 m³  (Maharashtra/Gujarat unit)
 *   Water/cement ratio  = 0.50 (footings, design-mix concrete)
 */

interface MixRatio { name: string; cement: number; sand: number; aggregate: number; use: string }

const MIXES: MixRatio[] = [
  { name: "M10", cement: 1, sand: 3,    aggregate: 6,   use: "Non-structural, levelling" },
  { name: "M15", cement: 1, sand: 2,    aggregate: 4,   use: "PCC, light footing, flooring" },
  { name: "M20", cement: 1, sand: 1.5,  aggregate: 3,   use: "Standard RCC footing, slab" },
  { name: "M25", cement: 1, sand: 1,    aggregate: 2,   use: "Columns, beams, slabs" },
  { name: "M30", cement: 1, sand: 0.75, aggregate: 1.5, use: "High-strength structures" },
];

const SHAPES = [
  { key: "rect",   label: "Rectangular" },
  { key: "square", label: "Square" },
  { key: "circ",   label: "Circular" },
  { key: "trap",   label: "Trapezoidal (sloped)" },
];

interface Inputs {
  shape: string;
  length: number;     // m
  width: number;      // m
  depth: number;      // m
  diameter: number;   // m, for circular
  topWidth: number;   // m, for trapezoidal
  count: number;      // number of footings
  mix: string;        // grade name
  wastagePct: number;
  rebarDiameter: number;   // mm
  rebarSpacing: number;    // mm
  cementRatePerBag: number;
  sandRatePerCft: number;
  aggregateRatePerCft: number;
  steelRatePerKg: number;
  labourRatePerCum: number;
}

interface Result {
  perFootingVolume: number;
  totalWetVolume: number;
  totalDryVolume: number;
  cementBags: number;
  cementKg: number;
  sandCum: number;
  sandKg: number;
  sandCft: number;
  aggregateCum: number;
  aggregateKg: number;
  aggregateCft: number;
  waterLitres: number;
  totalBrass: number;
  steelWeight: number;
  steelMeters: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  costPerCum: number;
}

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n) || n === 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: max })
    .format(Math.round(n));
}

function compute(i: Inputs): Result | null {
  if (i.depth <= 0 || i.count <= 0) return null;

  // Volume per footing depending on shape (m³)
  let perFootingVolume = 0;
  if (i.shape === "rect") {
    if (i.length <= 0 || i.width <= 0) return null;
    perFootingVolume = i.length * i.width * i.depth;
  } else if (i.shape === "square") {
    if (i.length <= 0) return null;
    perFootingVolume = i.length * i.length * i.depth;
  } else if (i.shape === "circ") {
    if (i.diameter <= 0) return null;
    const r = i.diameter / 2;
    perFootingVolume = Math.PI * r * r * i.depth;
  } else if (i.shape === "trap") {
    if (i.length <= 0 || i.width <= 0 || i.topWidth <= 0) return null;
    // Trapezoidal prism volume = depth × ((L×W) + (Lt×Wt) + sqrt(L×W × Lt×Wt)) / 3
    const A1 = i.length * i.width;
    const A2 = i.topWidth * i.topWidth;
    perFootingVolume = (i.depth / 3) * (A1 + A2 + Math.sqrt(A1 * A2));
  }

  const totalWetVolume = perFootingVolume * i.count * (1 + i.wastagePct / 100);

  // Dry volume = wet × 1.54 (BIS accepted factor)
  const totalDryVolume = totalWetVolume * 1.54;

  const mix = MIXES.find((m) => m.name === i.mix) || MIXES[2];
  const totalParts = mix.cement + mix.sand + mix.aggregate;

  // Material volumes
  const cementVolume = (totalDryVolume * mix.cement) / totalParts;
  const sandCum = (totalDryVolume * mix.sand) / totalParts;
  const aggregateCum = (totalDryVolume * mix.aggregate) / totalParts;

  // Cement weight + bags (50 kg standard, India)
  const cementKg = cementVolume * 1440; // bulk density
  const cementBags = Math.ceil(cementKg / 50);

  // Sand + Aggregate weights + cft
  const sandKg = sandCum * 1600;
  const aggregateKg = aggregateCum * 1700;
  const sandCft = sandCum * 35.3147;
  const aggregateCft = aggregateCum * 35.3147;

  // Water (w/c 0.50)
  const waterLitres = cementKg * 0.5;

  // Brass conversion (Maharashtra / Gujarat)
  const totalBrass = totalWetVolume / 2.83;

  // Steel/rebar — typical RCC footing has 0.7-1% reinforcement by volume
  // We use the user's diameter/spacing to estimate weight
  let steelMeters = 0;
  let steelWeight = 0;
  if (i.rebarDiameter > 0 && i.rebarSpacing > 0 && (i.shape === "rect" || i.shape === "square")) {
    // Assume bottom mat both ways
    const eL = i.shape === "square" ? i.length : i.length;
    const eW = i.shape === "square" ? i.length : i.width;
    const barsAlongL = Math.floor(eW / (i.rebarSpacing / 1000)) + 1;
    const barsAlongW = Math.floor(eL / (i.rebarSpacing / 1000)) + 1;
    steelMeters = ((barsAlongL * eL) + (barsAlongW * eW)) * i.count;
    // BIS-IS:1786 weight formula: (d²/162) kg per metre
    steelWeight = steelMeters * ((i.rebarDiameter * i.rebarDiameter) / 162);
  }

  // Costs
  const materialCost =
    cementBags * i.cementRatePerBag +
    sandCft * i.sandRatePerCft +
    aggregateCft * i.aggregateRatePerCft +
    steelWeight * i.steelRatePerKg;
  const labourCost = totalWetVolume * i.labourRatePerCum;
  const totalCost = materialCost + labourCost;
  const costPerCum = totalWetVolume > 0 ? totalCost / totalWetVolume : 0;

  return {
    perFootingVolume,
    totalWetVolume,
    totalDryVolume,
    cementBags,
    cementKg,
    sandCum,
    sandKg,
    sandCft,
    aggregateCum,
    aggregateKg,
    aggregateCft,
    waterLitres,
    totalBrass,
    steelWeight,
    steelMeters,
    materialCost,
    labourCost,
    totalCost,
    costPerCum,
  };
}

export default function ConcreteFootingCalculator() {
  const [shape, setShape] = useState("rect");
  const [length, setLength] = useState("1.5");
  const [width, setWidth] = useState("1.5");
  const [depth, setDepth] = useState("0.45");
  const [diameter, setDiameter] = useState("1.2");
  const [topWidth, setTopWidth] = useState("0.5");
  const [count, setCount] = useState("12");
  const [mix, setMix] = useState("M20");
  const [wastagePct, setWastagePct] = useState("5");

  const [rebarDiameter, setRebarDiameter] = useState("12");
  const [rebarSpacing, setRebarSpacing] = useState("150");

  const [cementRatePerBag, setCementRatePerBag] = useState("380");
  const [sandRatePerCft, setSandRatePerCft] = useState("60");
  const [aggregateRatePerCft, setAggregateRatePerCft] = useState("55");
  const [steelRatePerKg, setSteelRatePerKg] = useState("65");
  const [labourRatePerCum, setLabourRatePerCum] = useState("1800");

  const inputs: Inputs = {
    shape,
    length: parseFloat(length) || 0,
    width: parseFloat(width) || 0,
    depth: parseFloat(depth) || 0,
    diameter: parseFloat(diameter) || 0,
    topWidth: parseFloat(topWidth) || 0,
    count: parseFloat(count) || 0,
    mix,
    wastagePct: parseFloat(wastagePct) || 0,
    rebarDiameter: parseFloat(rebarDiameter) || 0,
    rebarSpacing: parseFloat(rebarSpacing) || 0,
    cementRatePerBag: parseFloat(cementRatePerBag) || 0,
    sandRatePerCft: parseFloat(sandRatePerCft) || 0,
    aggregateRatePerCft: parseFloat(aggregateRatePerCft) || 0,
    steelRatePerKg: parseFloat(steelRatePerKg) || 0,
    labourRatePerCum: parseFloat(labourRatePerCum) || 0,
  };

  const result = useMemo(() => compute(inputs), [
    shape, length, width, depth, diameter, topWidth, count, mix, wastagePct,
    rebarDiameter, rebarSpacing,
    cementRatePerBag, sandRatePerCft, aggregateRatePerCft, steelRatePerKg, labourRatePerCum,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentMix = MIXES.find((m) => m.name === mix) || MIXES[2];

  return (
    <div className="space-y-6">
      {/* Shape + grade selectors */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🧱 Footing geometry + grade</h3>
        <p className="text-xs text-gray-500 mb-3">
          Pick the footing shape, RCC grade and dimensions. Standard Indian site practice — all
          inputs in metres, output in m³, bags, kg, cft and ₹.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Footing shape</label>
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setShape(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    shape === s.key
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Concrete grade (IS 456)</label>
            <select value={mix} onChange={(e) => setMix(e.target.value)} className="calc-input">
              {MIXES.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} — {m.cement}:{m.sand}:{m.aggregate} — {m.use}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              Volumetric ratio cement : sand : aggregate. M20 is the standard for residential RCC footings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {shape === "rect" && (
            <>
              <Field label="Length (m)" value={length} setValue={setLength} hint="Long side of footing" />
              <Field label="Width (m)" value={width} setValue={setWidth} hint="Short side of footing" />
            </>
          )}
          {shape === "square" && (
            <Field label="Side (m)" value={length} setValue={setLength} hint="All sides equal" />
          )}
          {shape === "circ" && (
            <Field label="Diameter (m)" value={diameter} setValue={setDiameter} hint="For pile cap, circular column footing" />
          )}
          {shape === "trap" && (
            <>
              <Field label="Bottom length (m)" value={length} setValue={setLength} hint="Wider base" />
              <Field label="Bottom width (m)" value={width} setValue={setWidth} hint="Wider base" />
              <Field label="Top width (m)" value={topWidth} setValue={setTopWidth} hint="Narrower top" />
            </>
          )}
          <Field label="Depth (m)" value={depth} setValue={setDepth} hint="Below ground level — typical 0.45-0.9 m" />
          <Field label="Number of footings" value={count} setValue={setCount} hint="Total count on site" step={1} />
          <Field label="Wastage %" value={wastagePct} setValue={setWastagePct} hint="5-10% standard for site work" />
        </div>
      </div>

      {/* Rebar */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🪛 Reinforcement (optional)</h3>
        <p className="text-xs text-gray-500 mb-3">
          Steel calculated using BIS-IS:1786 formula <code>(d² × L) ÷ 162</code> kg/m. Estimates a
          bottom-mat reinforcement both ways. Skip if doing PCC / no-reinforcement.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Rebar diameter (mm)</label>
            <select value={rebarDiameter} onChange={(e) => setRebarDiameter(e.target.value)} className="calc-input">
              {[0, 8, 10, 12, 16, 20, 25, 32].map((d) => (
                <option key={d} value={d}>
                  {d === 0 ? "— None (PCC)" : `${d} mm`}
                </option>
              ))}
            </select>
          </div>
          <Field label="Bar spacing (mm)" value={rebarSpacing} setValue={setRebarSpacing} hint="100-200 mm typical for footings" step={10} />
        </div>
      </div>

      {/* Cost rates */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">💸 Local material rates (₹) — India 2026</h3>
        <p className="text-xs text-gray-500 mb-3">
          Defaults are pan-India tier-2 averages — adjust to your city for accuracy. Sand and
          aggregate rates assume 1 cft (cubic foot) since that&apos;s how they&apos;re sold at site.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Cement per 50kg bag (₹)" value={cementRatePerBag} setValue={setCementRatePerBag} hint="OPC 53 ₹360-420, PPC ₹320-380" />
          <Field label="Sand per cft (₹)" value={sandRatePerCft} setValue={setSandRatePerCft} hint="River sand ₹50-90, M-sand ₹35-55" />
          <Field label="Aggregate (20mm) per cft (₹)" value={aggregateRatePerCft} setValue={setAggregateRatePerCft} hint="20mm graded ₹45-70" />
          <Field label="Steel per kg (₹)" value={steelRatePerKg} setValue={setSteelRatePerKg} hint="TMT 500D ₹58-72, Fe415 ₹55-65" />
          <Field label="Labour per m³ (₹)" value={labourRatePerCum} setValue={setLabourRatePerCum} hint="Mason + helper ₹1500-2400/m³" />
        </div>
      </div>

      {/* Output */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Total concrete</div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">{result.totalWetVolume.toFixed(2)} m³</div>
              <div className="text-[11px] text-indigo-700 mt-1">
                {(result.totalWetVolume * 35.3147).toFixed(1)} cft · {result.totalBrass.toFixed(2)} brass
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Cement bags (50kg)</div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{result.cementBags}</div>
              <div className="text-[11px] text-emerald-700 mt-1">
                {result.cementKg.toFixed(0)} kg · grade {currentMix.name}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Total cost</div>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">{fmtINR(result.totalCost)}</div>
              <div className="text-[11px] text-amber-700 mt-1">
                {fmtINR(result.costPerCum)} per m³
              </div>
            </div>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📦 Bill of materials</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left py-2 pr-3">Material</th>
                    <th className="text-right py-2 pr-3">Quantity</th>
                    <th className="text-right py-2 pr-3">Unit weight / vol</th>
                    <th className="text-right py-2">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Cement (OPC/PPC)</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.cementBags} bags</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-gray-500">{result.cementKg.toFixed(0)} kg</td>
                    <td className="py-2 text-right tabular-nums font-bold">{fmtINR(result.cementBags * parseFloat(cementRatePerBag))}</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Sand (fine aggregate)</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.sandCum.toFixed(2)} m³</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-gray-500">{result.sandCft.toFixed(1)} cft · {result.sandKg.toFixed(0)} kg</td>
                    <td className="py-2 text-right tabular-nums font-bold">{fmtINR(result.sandCft * parseFloat(sandRatePerCft))}</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Aggregate (20mm)</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.aggregateCum.toFixed(2)} m³</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-gray-500">{result.aggregateCft.toFixed(1)} cft · {result.aggregateKg.toFixed(0)} kg</td>
                    <td className="py-2 text-right tabular-nums font-bold">{fmtINR(result.aggregateCft * parseFloat(aggregateRatePerCft))}</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Water</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.waterLitres.toFixed(0)} L</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-gray-500">w/c 0.50</td>
                    <td className="py-2 text-right tabular-nums text-gray-400">—</td>
                  </tr>
                  {result.steelWeight > 0 && (
                    <tr className="border-t border-gray-100">
                      <td className="py-2 pr-3 font-bold">Steel ({rebarDiameter}mm @ {rebarSpacing}mm c/c)</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{result.steelWeight.toFixed(1)} kg</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-gray-500">{result.steelMeters.toFixed(1)} m</td>
                      <td className="py-2 text-right tabular-nums font-bold">{fmtINR(result.steelWeight * parseFloat(steelRatePerKg))}</td>
                    </tr>
                  )}
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">Labour</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.totalWetVolume.toFixed(2)} m³</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-gray-500">@ {fmtINR(parseFloat(labourRatePerCum))}/m³</td>
                    <td className="py-2 text-right tabular-nums font-bold">{fmtINR(result.labourCost)}</td>
                  </tr>
                  <tr className="border-t-2 border-gray-300 bg-amber-50/50">
                    <td className="py-3 pr-3 font-extrabold text-base">Total project cost</td>
                    <td colSpan={2}></td>
                    <td className="py-3 text-right tabular-nums font-extrabold text-base text-amber-900">{fmtINR(result.totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🔢 Volume calculations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <Stat label="Per footing volume" value={`${result.perFootingVolume.toFixed(3)} m³`} />
              <Stat label="Wet volume (× wastage)" value={`${result.totalWetVolume.toFixed(2)} m³`} />
              <Stat label="Dry volume (× 1.54)" value={`${result.totalDryVolume.toFixed(2)} m³`} />
              <Stat label="In cubic feet" value={`${(result.totalWetVolume * 35.3147).toFixed(1)} cft`} />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter footing dimensions and count to see concrete + cost breakdown.
        </div>
      )}

      {/* Mix design reference */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">🧪 IS 456 mix design reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Grade</th>
                <th className="text-left py-2 pr-3">Cement : Sand : Aggregate</th>
                <th className="text-left py-2 pr-3">Compressive strength (28d)</th>
                <th className="text-left py-2">Typical use</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">M5</td>
                <td className="py-2 pr-3">1 : 5 : 10</td>
                <td className="py-2 pr-3">5 N/mm²</td>
                <td className="py-2 text-gray-500">Lean concrete, blinding</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">M7.5</td>
                <td className="py-2 pr-3">1 : 4 : 8</td>
                <td className="py-2 pr-3">7.5 N/mm²</td>
                <td className="py-2 text-gray-500">Mass concrete fill</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">M10</td>
                <td className="py-2 pr-3">1 : 3 : 6</td>
                <td className="py-2 pr-3">10 N/mm²</td>
                <td className="py-2 text-gray-500">Non-structural, levelling</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">M15</td>
                <td className="py-2 pr-3">1 : 2 : 4</td>
                <td className="py-2 pr-3">15 N/mm²</td>
                <td className="py-2 text-gray-500">PCC, light footing, flooring</td>
              </tr>
              <tr className="border-t border-gray-100 bg-indigo-50/40">
                <td className="py-2 pr-3 font-bold">M20</td>
                <td className="py-2 pr-3">1 : 1.5 : 3</td>
                <td className="py-2 pr-3">20 N/mm²</td>
                <td className="py-2 text-gray-700 font-bold">Standard RCC footing, slab (most common)</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">M25</td>
                <td className="py-2 pr-3">1 : 1 : 2</td>
                <td className="py-2 pr-3">25 N/mm²</td>
                <td className="py-2 text-gray-500">Columns, beams, heavy structures</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">M30+</td>
                <td className="py-2 pr-3">Design mix only</td>
                <td className="py-2 pr-3">30+ N/mm²</td>
                <td className="py-2 text-gray-500">High-rise, bridges, industrial</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Nominal mix ratios as per IS 456:2000. For M25 and above, IS 456 recommends design mix
          based on water/cement ratio, target strength, and aggregate gradation — not just nominal
          ratios. Always test the first batch on site.
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formulas</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Rectangle volume    = Length × Width × Depth
Square volume       = Side² × Depth
Circular volume     = π × (D/2)² × Depth
Trapezoidal volume  = Depth/3 × (A₁ + A₂ + √(A₁ × A₂))
                       where A₁ = bottom area, A₂ = top area

Wet volume          = Per-footing × Count × (1 + Wastage%)
Dry volume          = Wet volume × 1.54  (BIS shrinkage factor)

Cement quantity     = (Dry vol × Cement part) ÷ Total parts
Cement bags         = ⌈Cement kg ÷ 50⌉
Sand quantity       = (Dry vol × Sand part) ÷ Total parts
Aggregate quantity  = (Dry vol × Aggregate part) ÷ Total parts
Water (w/c 0.50)    = Cement kg × 0.5  litres

Steel weight        = ((d² × L) ÷ 162) kg/m   [BIS-IS:1786]
1 brass             = 100 ft³ = 2.83 m³
1 m³                = 35.3147 cft`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          The <strong>1.54 dry-volume factor</strong> compensates for shrinkage between dry
          components and wet concrete plus voids in sand and aggregate — it&apos;s the most
          frequently missed step in DIY estimation. Skipping it under-orders cement by ~35%.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">How do I calculate concrete volume for a footing?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Volume = Length × Width × Depth</strong> for a rectangular footing. For
              circular: <strong>π × (Diameter/2)² × Depth</strong>. The trick that DIY estimators
              miss: you can&apos;t just order this raw volume of dry materials. You must multiply
              by <strong>1.54</strong> to get the <em>dry volume</em> needed, because cement and
              sand have voids and the materials shrink when wet. For a 1.5m × 1.5m × 0.45m
              footing: wet volume = 1.0125 m³, but you need 1.56 m³ of dry materials. Divide by
              the mix ratio (M20 = 1:1.5:3) to get cement/sand/aggregate per the calculator
              above.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Which RCC grade should I use for my footing?</h4>
            <p className="text-gray-600 mt-1">
              For residential construction in India: <strong>M20 (1:1.5:3)</strong> is the
              minimum standard per IS 456 for RCC foundations and is what most architects spec.
              Use <strong>M15</strong> only for PCC (Plain Cement Concrete) levelling layers
              below the footing or for non-structural work. Use <strong>M25 or M30</strong> for
              load-bearing columns, beams, and slabs in commercial/multi-storey buildings.
              <strong> NEVER go below M20</strong> for any reinforced (steel inside) concrete —
              IS 456 explicitly prohibits it because the steel needs the strength and durability
              to be protected from corrosion.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How many cement bags do I need per m³?</h4>
            <p className="text-gray-600 mt-1">
              Approximations per m³ of <em>wet</em> concrete (after the 1.54 dry-volume factor):
              <strong> M15 ≈ 6.5 bags</strong>, <strong>M20 ≈ 8 bags</strong>,{" "}
              <strong>M25 ≈ 11 bags</strong>, <strong>M30 ≈ 13 bags</strong>. The calculator
              above does this precisely using cement bulk density of 1440 kg/m³ and a 50 kg
              bag (Indian standard). Always order one extra bag — partial bags happen and
              site-handling losses are real.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What is "brass" — when do I use it?</h4>
            <p className="text-gray-600 mt-1">
              <strong>1 brass = 100 cubic feet = 2.83 cubic metres</strong>. It&apos;s a unit
              used in Maharashtra and Gujarat for ordering sand and aggregate from local
              suppliers. A truck of sand is typically 1-3 brass. If your sand quantity is 2 m³,
              that&apos;s ~0.71 brass — but suppliers usually sell in full-brass increments, so
              you&apos;d order 1 brass. The calculator shows both m³ and brass so you can
              communicate easily with site/supplier. Outside Maharashtra/Gujarat, use cft
              (cubic feet) as suppliers don&apos;t use brass.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How much steel reinforcement do I need?</h4>
            <p className="text-gray-600 mt-1">
              Standard thumb rules per IS 456 + IS 13920: <strong>footings 0.7-1% of
              concrete volume</strong>, <strong>columns 0.8-3%</strong>, <strong>beams
              0.85-2%</strong>, <strong>slabs 0.5-1%</strong>. For a 1m × 1m × 0.5m footing
              (0.5 m³ concrete): 0.5% steel = ~25 kg, 1% = ~50 kg. The calculator estimates
              based on bottom-mat reinforcement at your specified diameter and spacing.
              <strong> Steel weight formula (BIS-IS:1786): (d² × L) ÷ 162 kg per metre</strong> —
              this is the standard formula taught in every civil engineering course. A 12mm
              bar weighs 0.89 kg/m, 16mm = 1.58 kg/m, 20mm = 2.47 kg/m.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How much wastage allowance should I add?</h4>
            <p className="text-gray-600 mt-1">
              <strong>5-10% is standard.</strong> Cement: 2-3% (handling losses, partial bags).
              Sand: 5-8% (transport, spillage, screening loss). Aggregate: 5-7% (transport,
              screening loss). Steel: 3-5% (cutting waste). For small site jobs use 7-10%; for
              large infrastructure projects with optimised supply chains, 3-5% is realistic.
              Trying to reduce wastage below 3% usually backfires — partial loads and supply
              delays cost more than the saved material.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What does it cost to construct a footing in India in 2026?</h4>
            <p className="text-gray-600 mt-1">
              Total all-in cost (material + labour, no steel) for M20 RCC footing typically runs
              <strong> ₹5,500-7,500 per m³</strong> in tier-1 cities (Mumbai, Delhi, Bangalore)
              and <strong>₹4,500-6,000 per m³</strong> in tier-2/3 cities (Indore, Lucknow,
              Coimbatore). Including 1% steel reinforcement adds another ₹1,800-2,500 per m³,
              bringing total to <strong>₹7,000-10,000 per m³</strong>. The calculator above
              breaks this down so you can verify supplier quotes. Major cost drivers: cement
              quality (OPC 53 vs PPC), sand quality (river sand most expensive, M-sand cheapest),
              and labour rates which vary 2-3× across regions.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Water-cement ratio: how much water do I add?</h4>
            <p className="text-gray-600 mt-1">
              IS 456 specifies a <strong>maximum water-cement ratio of 0.45-0.50 for RCC
              footings</strong> exposed to soil/moisture. The calculator assumes 0.50, which is
              standard practice. For one 50kg cement bag, that&apos;s 25 litres of water. Less
              water = stronger concrete but harder to work with; more water = easier to pour
              but weaker. Practical site rule: use the minimum water that produces a workable
              mix that flows around rebar without segregation. Slump test (75-125mm for
              footings) is the standard quality check.
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
