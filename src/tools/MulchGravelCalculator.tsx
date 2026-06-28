"use client";
import { useMemo, useState } from "react";

/**
 * Mulch & Gravel Calculator
 *
 * For Indian landscapers, homeowners, garden designers, contractors.
 * Computes volume, weight, bags, trucks and cost for:
 *   - Mulch (wood chips, bark, coco coir)
 *   - Decorative gravel (white pebbles, river pebbles)
 *   - Construction aggregate (20mm, 10mm, stone dust)
 *   - Sand (river, M-sand)
 *   - Topsoil + compost
 *
 * Material densities (kg/m³) — average values from Indian quarry +
 * landscape supplier data (2024-26):
 *   Wood mulch / bark         : 300
 *   Coco coir mulch           : 240
 *   River pebbles 20mm        : 1700
 *   White pebbles decorative  : 1750
 *   Granite chips 20mm        : 1700
 *   Stone dust                : 1500
 *   River sand                : 1650
 *   M-sand                    : 1750
 *   Topsoil (loose)           : 1400
 *   Compost / manure          : 700
 *
 * Standard truck capacities in India:
 *   1 ton (Tata Ace / Mahindra Bolero pickup) ≈ 0.5-0.8 m³
 *   5 ton (Eicher / Tata 407)                 ≈ 2.5-3.5 m³
 *   10 ton (Tata 1109, Ashok Leyland Dost+)   ≈ 5-7 m³
 *   20 ton (10-wheeler tipper / dumper)       ≈ 10-12 m³
 */

interface Material {
  key: string;
  label: string;
  category: string;
  density: number;        // kg/m³
  ratePerCft: number;     // ₹/cft (1 cft = 0.0283 m³)
  bagSize: number;        // kg per typical retail bag
}

const MATERIALS: Material[] = [
  // Mulch
  { key: "wood-mulch",   label: "Wood chips / bark mulch", category: "mulch", density: 300,  ratePerCft: 22, bagSize: 25 },
  { key: "coco-mulch",   label: "Coco coir mulch",         category: "mulch", density: 240,  ratePerCft: 18, bagSize: 25 },
  { key: "pine-mulch",   label: "Pine bark nuggets",       category: "mulch", density: 280,  ratePerCft: 35, bagSize: 25 },
  { key: "rubber-mulch", label: "Rubber mulch (playground)",category:"mulch", density: 450,  ratePerCft: 60, bagSize: 20 },
  // Decorative pebbles / gravel
  { key: "white-peb",    label: "White marble pebbles",    category: "deco", density: 1750, ratePerCft: 80, bagSize: 25 },
  { key: "river-peb",    label: "River pebbles (mixed)",   category: "deco", density: 1700, ratePerCft: 55, bagSize: 25 },
  { key: "black-peb",    label: "Black polished pebbles",  category: "deco", density: 1800, ratePerCft: 95, bagSize: 25 },
  // Construction aggregate
  { key: "agg20",        label: "20 mm graded aggregate",  category: "agg",  density: 1700, ratePerCft: 55, bagSize: 50 },
  { key: "agg10",        label: "10 mm graded aggregate",  category: "agg",  density: 1700, ratePerCft: 60, bagSize: 50 },
  { key: "agg40",        label: "40 mm graded aggregate",  category: "agg",  density: 1700, ratePerCft: 50, bagSize: 50 },
  { key: "dust",         label: "Stone dust",              category: "agg",  density: 1500, ratePerCft: 35, bagSize: 50 },
  // Sand
  { key: "river-sand",   label: "River sand",              category: "sand", density: 1650, ratePerCft: 60, bagSize: 50 },
  { key: "m-sand",       label: "Manufactured sand (M-sand)",category:"sand", density: 1750, ratePerCft: 42, bagSize: 50 },
  { key: "play-sand",    label: "Play sand / fine sand",   category: "sand", density: 1600, ratePerCft: 70, bagSize: 25 },
  // Topsoil / compost
  { key: "topsoil",      label: "Topsoil (loose)",         category: "soil", density: 1400, ratePerCft: 25, bagSize: 25 },
  { key: "compost",      label: "Compost / vermicompost",  category: "soil", density: 700,  ratePerCft: 40, bagSize: 25 },
  { key: "manure",       label: "Cow dung manure",         category: "soil", density: 650,  ratePerCft: 30, bagSize: 25 },
];

const DEPTH_PRESETS = [
  { label: "Mulch garden bed", depth: 50,  material: "wood-mulch" },
  { label: "Mulch around tree", depth: 75, material: "wood-mulch" },
  { label: "Garden path",       depth: 50, material: "river-peb" },
  { label: "Driveway base",     depth: 100, material: "agg20" },
  { label: "Driveway top",      depth: 50, material: "white-peb" },
  { label: "Patio sand bed",    depth: 30, material: "river-sand" },
  { label: "Topsoil layer",     depth: 150, material: "topsoil" },
];

const SHAPES = [
  { key: "rect",   label: "Rectangle" },
  { key: "circ",   label: "Circle (around tree)" },
  { key: "tri",    label: "Triangle" },
  { key: "area",   label: "Custom area (m² direct)" },
];

interface Inputs {
  materialKey: string;
  shape: string;
  length: number;       // m
  width: number;        // m
  diameter: number;     // m for circle
  base: number;         // m for triangle
  height: number;       // m for triangle
  customArea: number;   // m² direct
  depthMm: number;      // mm
  wastagePct: number;
}

interface Result {
  area: number;          // m²
  volume_m3: number;
  volume_cft: number;
  volume_brass: number;
  weight_kg: number;
  weight_tons: number;
  bags25: number;
  bags50: number;
  trucks_1t: number;
  trucks_5t: number;
  trucks_10t: number;
  cost: number;
  costPerSqm: number;
  material: Material;
}

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n) || n === 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: max })
    .format(Math.round(n));
}

function compute(i: Inputs): Result | null {
  const material = MATERIALS.find((m) => m.key === i.materialKey);
  if (!material || i.depthMm <= 0) return null;

  let area = 0;
  if (i.shape === "rect") {
    if (i.length <= 0 || i.width <= 0) return null;
    area = i.length * i.width;
  } else if (i.shape === "circ") {
    if (i.diameter <= 0) return null;
    area = Math.PI * Math.pow(i.diameter / 2, 2);
  } else if (i.shape === "tri") {
    if (i.base <= 0 || i.height <= 0) return null;
    area = 0.5 * i.base * i.height;
  } else if (i.shape === "area") {
    if (i.customArea <= 0) return null;
    area = i.customArea;
  }

  const volume_m3_raw = area * (i.depthMm / 1000);
  const volume_m3 = volume_m3_raw * (1 + i.wastagePct / 100);

  const volume_cft = volume_m3 * 35.3147;
  const volume_brass = volume_m3 / 2.83;
  const weight_kg = volume_m3 * material.density;
  const weight_tons = weight_kg / 1000;
  const bags25 = Math.ceil(weight_kg / 25);
  const bags50 = Math.ceil(weight_kg / 50);

  // Trucks
  const trucks_1t = volume_m3 / 0.65;   // 1-ton pickup ~0.65 m³
  const trucks_5t = volume_m3 / 3.0;     // 5-ton truck
  const trucks_10t = volume_m3 / 6.0;    // 10-ton truck

  const cost = volume_cft * material.ratePerCft;
  const costPerSqm = area > 0 ? cost / area : 0;

  return {
    area,
    volume_m3,
    volume_cft,
    volume_brass,
    weight_kg,
    weight_tons,
    bags25,
    bags50,
    trucks_1t,
    trucks_5t,
    trucks_10t,
    cost,
    costPerSqm,
    material,
  };
}

export default function MulchGravelCalculator() {
  const [materialKey, setMaterialKey] = useState("wood-mulch");
  const [shape, setShape] = useState("rect");
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("3");
  const [diameter, setDiameter] = useState("2");
  const [base, setBase] = useState("4");
  const [height, setHeight] = useState("3");
  const [customArea, setCustomArea] = useState("20");
  const [depthMm, setDepthMm] = useState("50");
  const [wastagePct, setWastagePct] = useState("10");

  const applyPreset = (preset: typeof DEPTH_PRESETS[number]) => {
    setDepthMm(String(preset.depth));
    setMaterialKey(preset.material);
  };

  const inputs: Inputs = {
    materialKey,
    shape,
    length: parseFloat(length) || 0,
    width: parseFloat(width) || 0,
    diameter: parseFloat(diameter) || 0,
    base: parseFloat(base) || 0,
    height: parseFloat(height) || 0,
    customArea: parseFloat(customArea) || 0,
    depthMm: parseFloat(depthMm) || 0,
    wastagePct: parseFloat(wastagePct) || 0,
  };

  const result = useMemo(() => compute(inputs), [
    materialKey, shape, length, width, diameter, base, height, customArea, depthMm, wastagePct,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Preset quick selectors */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🌿 Quick use-case presets</h3>
        <p className="text-xs text-gray-500 mb-3">
          Tap a preset to autofill material + recommended depth. Indian landscape standard practice.
        </p>
        <div className="flex flex-wrap gap-2">
          {DEPTH_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:border-indigo-300 bg-white text-gray-700 transition"
            >
              {p.label} ({p.depth} mm)
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🪨 Material</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Material type</label>
            <select value={materialKey} onChange={(e) => setMaterialKey(e.target.value)} className="calc-input">
              <optgroup label="Mulch (organic)">
                {MATERIALS.filter((m) => m.category === "mulch").map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="Decorative pebbles">
                {MATERIALS.filter((m) => m.category === "deco").map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="Construction aggregate">
                {MATERIALS.filter((m) => m.category === "agg").map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="Sand">
                {MATERIALS.filter((m) => m.category === "sand").map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="Soil / compost">
                {MATERIALS.filter((m) => m.category === "soil").map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
            </select>
            {result && (
              <p className="text-[11px] text-gray-400 mt-1">
                Density {result.material.density} kg/m³ · ₹{result.material.ratePerCft}/cft typical
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Depth / thickness (mm)</label>
            <input type="number" value={depthMm} onChange={(e) => setDepthMm(e.target.value)} className="calc-input" placeholder="e.g. 50" />
            <p className="text-[11px] text-gray-400 mt-1">
              Mulch 50-75 mm · Decorative pebble 25-50 mm · Driveway base 75-100 mm · Topsoil 100-200 mm
            </p>
          </div>
        </div>
      </div>

      {/* Shape */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🗺️ Coverage shape + size</h3>
        <div className="mb-3 flex flex-wrap gap-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {shape === "rect" && (
            <>
              <Field label="Length (m)" value={length} setValue={setLength} />
              <Field label="Width (m)" value={width} setValue={setWidth} />
            </>
          )}
          {shape === "circ" && (
            <Field label="Diameter (m)" value={diameter} setValue={setDiameter} hint="For circular bed around tree" />
          )}
          {shape === "tri" && (
            <>
              <Field label="Base (m)" value={base} setValue={setBase} />
              <Field label="Height (m)" value={height} setValue={setHeight} />
            </>
          )}
          {shape === "area" && (
            <Field label="Total area (m²)" value={customArea} setValue={setCustomArea} hint="If you already know the area" />
          )}
          <Field label="Wastage %" value={wastagePct} setValue={setWastagePct} hint="10-15% standard for landscaping" />
        </div>
      </div>

      {/* Result */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Volume needed</div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">{result.volume_m3.toFixed(2)} m³</div>
              <div className="text-[11px] text-indigo-700 mt-1">
                {result.volume_cft.toFixed(1)} cft · {result.volume_brass.toFixed(2)} brass
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Weight</div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{result.weight_kg.toFixed(0)} kg</div>
              <div className="text-[11px] text-emerald-700 mt-1">
                {result.weight_tons.toFixed(2)} tons
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Estimated cost</div>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">{fmtINR(result.cost)}</div>
              <div className="text-[11px] text-amber-700 mt-1">
                {fmtINR(result.costPerSqm)} per m² coverage
              </div>
            </div>
          </div>

          {/* How to buy */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🛒 How to order — bags or truck?</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left py-2 pr-3">Order type</th>
                    <th className="text-right py-2 pr-3">Quantity</th>
                    <th className="text-right py-2">Best for</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">25-kg bags</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.bags25} bags</td>
                    <td className="py-2 text-right text-gray-500">Small gardens, single bed, retail purchase</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">50-kg bags</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.bags50} bags</td>
                    <td className="py-2 text-right text-gray-500">Construction supply, paths, beds</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">1-ton pickup (Tata Ace)</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.trucks_1t.toFixed(2)} trips</td>
                    <td className="py-2 text-right text-gray-500">Single home, &lt; 1 m³</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">5-ton truck (Tata 407)</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.trucks_5t.toFixed(2)} trips</td>
                    <td className="py-2 text-right text-gray-500">Medium garden / small site</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-bold">10-ton truck (tipper)</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{result.trucks_10t.toFixed(2)} trips</td>
                    <td className="py-2 text-right text-gray-500">Large landscape / commercial</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 mt-3">
              Bulk truck order is typically 25-40% cheaper per m³ than bag purchase. Below 1 m³,
              bags are more practical. Above 3 m³, always order by truck.
            </p>
          </div>

          {/* Math */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🔢 Calculation breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">Coverage area</td>
                    <td className="py-2 text-right tabular-nums font-bold">{result.area.toFixed(2)} m² · {(result.area * 10.7639).toFixed(1)} sq ft</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">× Depth</td>
                    <td className="py-2 text-right tabular-nums font-bold">{depthMm} mm = {(parseFloat(depthMm) / 1000).toFixed(3)} m</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">× (1 + Wastage %)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{wastagePct}%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-bold">= Volume</td>
                    <td className="py-2 text-right tabular-nums font-bold text-indigo-700">{result.volume_m3.toFixed(2)} m³</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">× Density ({result.material.density} kg/m³)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{result.weight_kg.toFixed(0)} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter your coverage area dimensions and depth to see how much material you need.
        </div>
      )}

      {/* Material reference */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📋 Material reference — densities + prices (India 2026)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Material</th>
                <th className="text-left py-2 pr-3">Density (kg/m³)</th>
                <th className="text-left py-2 pr-3">Rate (₹/cft)</th>
                <th className="text-left py-2">Rate per m³ ≈</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {MATERIALS.map((m) => (
                <tr key={m.key} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-bold">{m.label}</td>
                  <td className="py-2 pr-3 tabular-nums">{m.density}</td>
                  <td className="py-2 pr-3 tabular-nums">₹{m.ratePerCft}</td>
                  <td className="py-2 tabular-nums text-amber-700">₹{Math.round(m.ratePerCft * 35.3147).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Rates are pan-India tier-2 averages for retail purchase (June 2026). Bulk/truck orders
          typically 25-40% lower per cft. Premium imported materials (white pebbles, special bark)
          can be 2-3× higher in tier-1 metros. Stone dust and aggregate prices vary 30% by distance
          to quarry.
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formulas</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Area (m²):
  Rectangle  = Length × Width
  Circle     = π × (Diameter ÷ 2)²
  Triangle   = ½ × Base × Height

Volume:
  Raw vol   = Area × (Depth ÷ 1000)            (m³)
  Final vol = Raw vol × (1 + Wastage%)         (m³)

Conversions:
  1 m³      = 35.3147 cft
  1 brass   = 100 cft = 2.83 m³
  1 m²      = 10.7639 sq ft

Weight + bag count:
  Weight (kg)  = Volume × Density
  Bags (25 kg) = ⌈Weight ÷ 25⌉
  Bags (50 kg) = ⌈Weight ÷ 50⌉

Truck count (volume basis):
  1-ton pickup ≈ 0.65 m³
  5-ton truck  ≈ 3.0  m³
  10-ton truck ≈ 6.0  m³

Cost:
  Total = Volume (cft) × Rate (₹/cft)`}
        </pre>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">How deep should I lay mulch in my garden?</h4>
            <p className="text-gray-600 mt-1">
              <strong>50-75 mm (2-3 inches) for general garden beds</strong> — enough to suppress
              weeds, retain moisture, and insulate soil. <strong>75-100 mm around trees</strong>{" "}
              but keep mulch 10 cm away from the trunk (mulching against the trunk causes rot —
              the so-called {"\""}mulch volcano{"\""} mistake). <strong>25-40 mm for decorative</strong>{" "}
              paths and around perennials where you want the soil to breathe more. Below 30 mm,
              weeds break through; above 100 mm, you can suffocate roots and prevent water
              infiltration. The calculator above defaults to 50 mm which is the universal good
              starting point.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Wood mulch vs coco coir mulch — which is better for India?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Coco coir mulch (coir pith)</strong> is the better default for most of India:
              (1) made in India so cheaper than imported bark; (2) holds 6-10× its weight in water
              — critical during dry seasons in Maharashtra, Karnataka, Tamil Nadu, Andhra; (3)
              naturally resistant to termite and fungal rot in humid climates; (4) breaks down
              slowly (12-18 months) which keeps the topdressing fresh. <strong>Wood mulch /
              bark</strong> looks more polished but breaks down in 6-9 months in hot Indian
              conditions, attracts termites if not treated, and costs 30-50% more. Use wood mulch
              for show gardens, coco coir for production gardens and food crops.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What size gravel for a driveway in India?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Two-layer system works best</strong>: (1) <strong>base layer 100 mm of 40
              mm graded aggregate</strong> (locally called {"\""}40mm gitti{"\""}) — provides drainage
              and load-bearing; (2) <strong>top layer 50 mm of 20 mm graded aggregate or white
              pebbles</strong> — appearance and final compaction. For light residential
              driveways (single car), 75 mm of 20 mm aggregate alone over compacted earth works.
              For commercial / heavier vehicles, increase base to 150 mm of 40 mm + 50 mm of 20
              mm. Don&apos;t use round river pebbles as the only layer — they shift under tyres.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Where can I buy landscape mulch and pebbles in India?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Coir pith / coco mulch</strong>: directly from Tamil Nadu / Kerala suppliers
              (Pollachi, Coimbatore, Pollachi area is the world hub); wholesale through Indiamart,
              TradeIndia. <strong>Wood bark / pine mulch</strong>: Bangalore Nursery, Pune Flower
              Market, Delhi Chhatarpur Mandi, Mumbai Dadar Phool Bazaar — also direct from local
              nurseries. <strong>Decorative pebbles</strong>: Rajasthan (Kishangarh) for white
              marble pebbles, Karnataka for black polished, Gujarat for river-stone variety —
              ship pan-India. <strong>Construction aggregate</strong>: any local building-material
              supplier or quarry depot. <strong>Topsoil / compost</strong>: municipal compost
              plants (cities now distribute free or subsidised), local nurseries, vermicompost
              cooperatives.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How many bags of mulch do I need per square metre?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Quick rule for 50 mm depth (standard mulch layer)</strong>:
              <strong> wood mulch ~3 bags of 25 kg per 5 m²</strong> (so ~0.6 bags per m²);
              <strong> coco coir ~2 bags of 25 kg per 5 m²</strong>;{" "}
              <strong>decorative pebbles ~4 bags of 25 kg per m²</strong> (because pebbles are
              5-6× denser than mulch). For larger areas (above 10 m²) bag purchase becomes
              uneconomical — switch to a truck order. The calculator above gives you the exact
              bag count for your situation.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What is wastage and how much should I order extra?</h4>
            <p className="text-gray-600 mt-1">
              <strong>10-15% wastage is standard for landscaping</strong> — covers spillage during
              spreading, edges that need slightly more depth, compaction (mulch and gravel settle
              5-15% as they get rained on and walked over), and a small reserve for top-up next
              season. Below 5%, you&apos;ll run out before finishing. Above 20% is over-ordering —
              you&apos;ll have excess to store. For very small projects (under 1 m³), order 20% extra
              because partial-bag rounding eats into your usable quantity.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Will mulch attract termites or pests?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Wood-based mulches (bark, chips)</strong> can attract subterranean termites
              in hot/humid Indian conditions — common in Mumbai, Chennai, Kolkata, Goa, Kerala
              coast. Risk mitigation: (1) keep mulch 30 cm away from house foundation and wood
              structures; (2) use neem-cake-treated or boron-pretreated bark for premium beds;
              (3) refresh mulch annually so it doesn&apos;t turn into compost piles where
              termites colonise. <strong>Coco coir mulch</strong> doesn&apos;t attract termites
              (no cellulose for them to eat). <strong>Stone/pebble mulch</strong>: zero pest
              risk but doesn&apos;t improve soil. <strong>Rubber mulch (playground type)</strong>:
              zero pests but expensive and not biodegradable.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Can I mix different materials in one bed?</h4>
            <p className="text-gray-600 mt-1">
              Yes — layering is a common landscape technique. <strong>Common combinations</strong>:
              (1) <strong>topsoil 100 mm + compost 25 mm + mulch 50 mm</strong> for new garden
              beds; (2) <strong>aggregate 100 mm + stone dust 25 mm + decorative pebbles 50
              mm</strong> for paths and patios; (3) <strong>landscape fabric + 75 mm gravel</strong>{" "}
              for low-maintenance ground cover. Calculate each material&apos;s volume separately
              with this tool — different densities and prices mean you can&apos;t average them.
              Order all materials in one truck if possible (split-deliver) to save on transport
              charges (typically ₹500-1500 per trip in cities).
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
