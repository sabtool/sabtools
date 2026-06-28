"use client";
import { useMemo, useState } from "react";

/**
 * Floor Load Capacity Calculator
 *
 * Computes the maximum allowable uniformly distributed load (UDL)
 * a floor can carry per square metre, based on:
 *
 *   - Material (plywood / OSB / particle board / RCC slab / PCC)
 *   - Thickness
 *   - Span between joists or supports
 *   - Support condition (simply supported / continuous)
 *
 * For sheet materials (plywood, OSB, particle board) the calculation
 * is per-1-m-strip of floor parallel to the span direction. Section
 * properties for a 1000 mm wide × t mm thick strip:
 *   I = 1000 · t³ / 12   (mm⁴)
 *   Z = 1000 · t² / 6    (mm³)
 *
 * Material allowable stresses (sheet goods) — IS 303 / IS 710 for
 * plywood, ANSI/APA published for OSB / particle board:
 *   IS 710 BWP plywood    σ = 35 N/mm², E = 9,000 N/mm²
 *   IS 303 BWR plywood    σ = 30 N/mm², E = 8,000 N/mm²
 *   IS 303 MR plywood     σ = 28 N/mm², E = 7,500 N/mm²
 *   OSB Grade 3 / PSL     σ = 18 N/mm², E = 4,500 N/mm²
 *   Particle board (P5)   σ = 14 N/mm², E = 3,200 N/mm²
 *   Marine ply (IS 710)   σ = 38 N/mm², E = 9,500 N/mm²
 *
 * For RCC one-way slabs (IS 456:2000) we use working stress design
 * with steel ratio 0.4% (minimum). For PCC (plain) we use the
 * concrete tensile strength (very low, so PCC spans poorly).
 *
 * Formulas (simply supported, UDL):
 *   M_max     = w·L² / 8
 *   δ_max     = 5·w·L⁴ / (384·E·I)
 *   w_allow_bending     = 8 × Z × σ_allow / L²
 *   w_allow_deflection  = 384·E·I / (5·k·L³)  where k = deflection limit
 *
 * Continuous (3+ supports): M_max ≈ w·L² / 10 — gives ~25% higher capacity
 */

interface Material {
  key: string;
  label: string;
  type: "sheet" | "rcc" | "pcc";
  sigma: number;        // N/mm²
  E: number;            // N/mm²
  density: number;      // kg/m³
  ratePerSqm: (t: number) => number; // ₹/m² as function of thickness mm
}

const MATERIALS: Material[] = [
  // Sheet materials per IS 303 / IS 710 / APA
  {
    key: "ply-marine", label: "Marine plywood (IS 710 BWP)", type: "sheet",
    sigma: 38, E: 9500, density: 700,
    ratePerSqm: (t) => 850 + (t - 12) * 65, // approx ₹/m² scaled with thickness
  },
  {
    key: "ply-bwp", label: "BWP plywood (IS 710)", type: "sheet",
    sigma: 35, E: 9000, density: 680,
    ratePerSqm: (t) => 700 + (t - 12) * 55,
  },
  {
    key: "ply-bwr", label: "BWR plywood (IS 303)", type: "sheet",
    sigma: 30, E: 8000, density: 650,
    ratePerSqm: (t) => 550 + (t - 12) * 45,
  },
  {
    key: "ply-mr", label: "MR plywood (IS 303, interior)", type: "sheet",
    sigma: 28, E: 7500, density: 620,
    ratePerSqm: (t) => 420 + (t - 12) * 35,
  },
  {
    key: "osb", label: "OSB Grade 3 (structural)", type: "sheet",
    sigma: 18, E: 4500, density: 620,
    ratePerSqm: (t) => 380 + (t - 12) * 28,
  },
  {
    key: "particle", label: "Particle board P5 (load-bearing)", type: "sheet",
    sigma: 14, E: 3200, density: 720,
    ratePerSqm: (t) => 250 + (t - 12) * 18,
  },
  // RCC / PCC concrete slabs — different math but same wrapper
  {
    key: "rcc-m20", label: "RCC slab M20 (0.4% steel)", type: "rcc",
    sigma: 0, E: 22360, density: 2500,
    ratePerSqm: (t) => 750 + t * 32, // approx incl. cement+steel+labour
  },
  {
    key: "rcc-m25", label: "RCC slab M25 (0.4% steel)", type: "rcc",
    sigma: 0, E: 25000, density: 2500,
    ratePerSqm: (t) => 820 + t * 35,
  },
  {
    key: "pcc-m15", label: "PCC slab M15 (no reinforcement)", type: "pcc",
    sigma: 1.6, E: 19360, density: 2400,
    ratePerSqm: (t) => 420 + t * 22,
  },
];

interface Inputs {
  materialKey: string;
  thickness: number;    // mm
  span: number;         // m
  support: "simple" | "continuous";
  deflectionLimit: number;  // L/value
  finishLoad: number;   // kN/m² — tiles, plaster etc on top
}

interface Result {
  material: Material;
  I_per_m: number;       // mm⁴
  Z_per_m: number;       // mm³
  selfWeight: number;    // kN/m²
  w_bending: number;     // kN/m² max load bending governs
  w_deflection: number;  // kN/m² max load deflection governs
  w_allow_total: number; // kN/m² (governing)
  w_allow_live: number;  // kN/m² remaining after dead + finish
  governing: "bending" | "deflection";
  kgPerSqm: number;
  personsPerSqm: number;
  verdictResidential: boolean;
  verdictOffice: boolean;
  verdictStorage: boolean;
  costPerSqm: number;
}

function compute(i: Inputs): Result | null {
  const material = MATERIALS.find((m) => m.key === i.materialKey);
  if (!material || i.thickness <= 0 || i.span <= 0) return null;

  // Self weight
  const selfWeight = (material.density * 9.81 * (i.thickness / 1000)) / 1000; // kN/m²

  // 1-m strip section properties
  const b = 1000; // mm
  const t = i.thickness;
  const I_per_m = (b * Math.pow(t, 3)) / 12;
  const Z_per_m = (b * Math.pow(t, 2)) / 6;

  let w_bending = 0;
  let w_deflection = 0;

  if (material.type === "sheet" || material.type === "pcc") {
    // Use σ_allow directly
    const L_mm = i.span * 1000;
    const M_allow = (Z_per_m * material.sigma) / 1e6; // kN·m
    const support_factor = i.support === "continuous" ? 10 : 8;
    w_bending = (support_factor * M_allow * 1000) / Math.pow(L_mm / 1000, 2); // kN/m for 1m strip = kN/m²
    // Deflection: δ ≤ L/k
    // w_max = 384·E·I·δ_allow / (5·L⁴)
    const δ_allow_mm = L_mm / i.deflectionLimit;
    // For simply supported UDL, δ = 5wL⁴/(384EI) where w in N/mm and L in mm gives δ in mm
    // Solve w: w = δ × 384 × E × I / (5 × L⁴)
    const w_Nmm = (δ_allow_mm * 384 * material.E * I_per_m) / (5 * Math.pow(L_mm, 4));
    // w_Nmm is N/mm per 1m strip = N/mm × 1 = kN/m² × ?
    // Actually: w in N/mm = N per mm of length per 1m of width
    // Per m²: multiply by 1000 N/m / mm × ... wait
    // w is force per unit length of strip = N/mm; converting to kN/m²:
    // N/mm × (1 kN/1000 N) × (1000 mm / 1 m) / (1 m strip width) = N/mm = kN/m
    // Since strip is 1 m wide: kN/m × per 1m strip width = kN/m²
    w_deflection = w_Nmm * 1; // kN/m² (per 1m wide strip)
    // For continuous: 25% more (approximate)
    if (i.support === "continuous") w_deflection *= 1.25;
  } else if (material.type === "rcc") {
    // RCC one-way slab simplified: ultimate moment capacity per IS 456
    // For 0.4% steel min, fy=415, fck depends on grade
    // M_u = 0.87·fy·Ast·(d - 0.42x) where x = 0.87·fy·Ast / (0.36·fck·b)
    // Simplified: assume per IS 456 nominal: M_u ≈ 0.138·fck·b·d²
    // Working: M_allow = M_u / 1.5 (safety factor)
    const fck = i.materialKey === "rcc-m25" ? 25 : 20; // N/mm²
    const cover = 20; // mm
    const d_eff = t - cover; // mm
    if (d_eff > 0) {
      const M_u = (0.138 * fck * b * Math.pow(d_eff, 2)) / 1e6; // kN·m
      const M_allow = M_u / 1.5;
      const support_factor = i.support === "continuous" ? 10 : 8;
      const L_mm = i.span * 1000;
      w_bending = (support_factor * M_allow * 1000) / Math.pow(L_mm / 1000, 2);
      // Deflection for RCC slab — use cracked-section approximation Ieff ≈ 0.7·Igross
      const Ieff = 0.7 * I_per_m;
      const δ_allow_mm = L_mm / i.deflectionLimit;
      const w_Nmm = (δ_allow_mm * 384 * material.E * Ieff) / (5 * Math.pow(L_mm, 4));
      w_deflection = w_Nmm * 1;
      if (i.support === "continuous") w_deflection *= 1.25;
    }
  }

  const w_allow_total = Math.min(w_bending, w_deflection);
  const governing: Result["governing"] = w_bending < w_deflection ? "bending" : "deflection";
  const w_allow_live = w_allow_total - selfWeight - i.finishLoad;

  const kgPerSqm = w_allow_total * 102; // 1 kN/m² = 102 kg/m²
  const personsPerSqm = kgPerSqm / 75;

  return {
    material,
    I_per_m,
    Z_per_m,
    selfWeight,
    w_bending,
    w_deflection,
    w_allow_total,
    w_allow_live,
    governing,
    kgPerSqm,
    personsPerSqm,
    verdictResidential: w_allow_live >= 2.0,
    verdictOffice: w_allow_live >= 3.0,
    verdictStorage: w_allow_live >= 5.0,
    costPerSqm: material.ratePerSqm(t),
  };
}

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n) || n === 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: max })
    .format(Math.round(n));
}

export default function FloorLoadCapacityCalculator() {
  const [materialKey, setMaterialKey] = useState("ply-bwr");
  const [thickness, setThickness] = useState("18");
  const [span, setSpan] = useState("0.6");
  const [support, setSupport] = useState<"simple" | "continuous">("simple");
  const [deflectionLimit, setDeflectionLimit] = useState("360");
  const [finishLoad, setFinishLoad] = useState("0.3");

  const inputs: Inputs = {
    materialKey,
    thickness: parseFloat(thickness) || 0,
    span: parseFloat(span) || 0,
    support,
    deflectionLimit: parseFloat(deflectionLimit) || 360,
    finishLoad: parseFloat(finishLoad) || 0,
  };

  const result = useMemo(() => compute(inputs), [
    materialKey, thickness, span, support, deflectionLimit, finishLoad,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentMaterial = MATERIALS.find((m) => m.key === materialKey);

  return (
    <div className="space-y-6">
      {/* Material + thickness */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🪵 Floor material + thickness</h3>
        <p className="text-xs text-gray-500 mb-3">
          Sheet materials use IS 303 / IS 710 allowable stresses. RCC slabs use IS 456 working
          stress (Mu / 1.5). All loads in kN/m² (multiply by 102 for kg/m²).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Material</label>
            <select value={materialKey} onChange={(e) => setMaterialKey(e.target.value)} className="calc-input">
              <optgroup label="Plywood (IS 303 / IS 710)">
                {MATERIALS.filter((m) => m.key.startsWith("ply")).map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="OSB / Particle board">
                {MATERIALS.filter((m) => m.key === "osb" || m.key === "particle").map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="Concrete slab (IS 456)">
                {MATERIALS.filter((m) => m.type === "rcc" || m.type === "pcc").map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </optgroup>
            </select>
            {currentMaterial && currentMaterial.type === "sheet" && (
              <p className="text-[11px] text-gray-400 mt-1">
                σ = {currentMaterial.sigma} N/mm² · E = {currentMaterial.E.toLocaleString("en-IN")} N/mm² · ρ = {currentMaterial.density} kg/m³
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Thickness (mm)</label>
            {currentMaterial?.type === "sheet" ? (
              <select value={thickness} onChange={(e) => setThickness(e.target.value)} className="calc-input">
                {[6, 9, 12, 15, 18, 19, 22, 25].map((t) => (
                  <option key={t} value={t}>{t} mm</option>
                ))}
              </select>
            ) : (
              <input type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} className="calc-input" placeholder="e.g. 100" />
            )}
            <p className="text-[11px] text-gray-400 mt-1">
              {currentMaterial?.type === "sheet"
                ? "Common sheet sizes 6-25 mm. Floor use typically 18-25 mm."
                : "RCC slab 100-200 mm typical residential. Industrial 150-250 mm."}
            </p>
          </div>
        </div>
      </div>

      {/* Span + support */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📏 Span + support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field
            label="Span (m)"
            value={span}
            setValue={setSpan}
            hint={currentMaterial?.type === "sheet" ? "Joist spacing — 0.4-0.6 m typical" : "Slab span between beams — 3-4 m typical"}
          />
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Support condition</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "simple", label: "Simply supported" },
                { key: "continuous", label: "Continuous (3+ supports)" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSupport(s.key as "simple" | "continuous")}
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
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Deflection limit</label>
            <select value={deflectionLimit} onChange={(e) => setDeflectionLimit(e.target.value)} className="calc-input">
              <option value="240">L / 240 — utility floors</option>
              <option value="360">L / 360 — standard floors (IS 456 default)</option>
              <option value="480">L / 480 — brittle finish, marble/tile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Finish load */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🧱 Finish load on top of structural floor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Finish dead load (kN/m²)"
            value={finishLoad}
            setValue={setFinishLoad}
            hint="Tiles 0.4-1.0, marble/granite 0.8-1.2, hardwood 0.2-0.4, vinyl 0.05 kN/m²"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Bare deck", v: "0" },
              { label: "Vinyl", v: "0.1" },
              { label: "Tile", v: "0.5" },
              { label: "Marble", v: "1.0" },
            ].map((p) => (
              <button
                key={p.v}
                onClick={() => setFinishLoad(p.v)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-gray-200 hover:border-indigo-300 bg-white text-gray-700"
              >
                {p.label} ({p.v})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Max total load</div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">{result.w_allow_total.toFixed(2)} kN/m²</div>
              <div className="text-[11px] text-indigo-700 mt-1">
                {result.kgPerSqm.toFixed(0)} kg/m² · {result.personsPerSqm.toFixed(1)} people/m²
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Live load available</div>
              <div className={`text-2xl font-extrabold mt-1 ${result.w_allow_live > 0 ? "text-emerald-900" : "text-red-900"}`}>
                {result.w_allow_live.toFixed(2)} kN/m²
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                After self-wt {result.selfWeight.toFixed(2)} + finish {parseFloat(finishLoad).toFixed(2)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Cost per m²</div>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">{fmtINR(result.costPerSqm)}</div>
              <div className="text-[11px] text-amber-700 mt-1">Material only · thickness {thickness} mm</div>
            </div>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📋 Use-case verdict</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <VerdictCard ok={result.verdictResidential} title="Residential" load="2 kN/m² (IS 875)" />
              <VerdictCard ok={result.verdictOffice} title="Office / Commercial" load="3 kN/m²" />
              <VerdictCard ok={result.verdictStorage} title="Storage / Light Industrial" load="5 kN/m²" />
            </div>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🔢 Calculation breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">Section modulus Z (per 1 m strip)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{(result.Z_per_m / 1000).toFixed(2)} × 10³ mm³</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">Moment of Inertia I (per 1 m strip)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{(result.I_per_m / 1e6).toFixed(2)} × 10⁶ mm⁴</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">Floor self-weight</td>
                    <td className="py-2 text-right tabular-nums font-bold">{result.selfWeight.toFixed(2)} kN/m²</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-bold">Capacity (bending check)</td>
                    <td className="py-2 text-right tabular-nums font-bold text-emerald-700">{result.w_bending.toFixed(2)} kN/m²</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-bold">Capacity (deflection check)</td>
                    <td className="py-2 text-right tabular-nums font-bold text-emerald-700">{result.w_deflection.toFixed(2)} kN/m²</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-indigo-50/50">
                    <td className="py-3 text-gray-800 font-bold">Governing (lower of two): <span className="text-indigo-700">{result.governing}</span></td>
                    <td className="py-3 text-right tabular-nums font-extrabold text-indigo-900 text-base">{result.w_allow_total.toFixed(2)} kN/m²</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Pick a material, thickness, and span to see the load capacity.
        </div>
      )}

      {/* Material reference */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📋 Material reference (per IS 303 / IS 710 / IS 456)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Material</th>
                <th className="text-left py-2 pr-3">σ allowable (N/mm²)</th>
                <th className="text-left py-2 pr-3">E modulus (N/mm²)</th>
                <th className="text-left py-2">Density (kg/m³)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {MATERIALS.map((m) => (
                <tr key={m.key} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-bold">{m.label}</td>
                  <td className="py-2 pr-3 tabular-nums">{m.type === "rcc" ? "(RCC limit state)" : m.sigma}</td>
                  <td className="py-2 pr-3 tabular-nums">{m.E.toLocaleString("en-IN")}</td>
                  <td className="py-2 tabular-nums">{m.density}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 Formulas (per 1 m wide strip)</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Section properties (1 m wide × t mm thick strip):
  I = 1000 × t³ / 12      (mm⁴)
  Z = 1000 × t² / 6       (mm³)

Self-weight:
  w_sw   = ρ × 9.81 × t / 1000   (kN/m²)  where ρ = density kg/m³

Allowable load by bending (sheet & PCC):
  M_allow = Z × σ_allow / 1e6      (kN·m)
  w_max   = 8 × M_allow / L²       (simply supported, kN/m²)
  w_max   = 10 × M_allow / L²      (continuous)

Allowable load by deflection (δ ≤ L/k):
  w_max   = 384 × E × I × (L/k) / (5 × L⁴)   simply supported
  w_max  × 1.25                              continuous

RCC slab (IS 456 ultimate / 1.5):
  M_u    = 0.138 × fck × b × d²              (b = 1000 mm)
  M_allow = M_u / 1.5                        (working stress)

Final capacity = MIN(w_bending, w_deflection)
Live load available = Capacity − self-weight − finish dead load

Conversions:
  1 kN/m²        = 102 kg/m²
  Typical person = 75 kg (BIS demographic average)`}
        </pre>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">What does {"\""}floor load capacity{"\""} actually mean?</h4>
            <p className="text-gray-600 mt-1">
              It&apos;s the <strong>maximum uniformly distributed load (UDL)</strong> per square
              metre that the floor can carry without exceeding allowable bending stress or
              deflection. Expressed as <strong>kN/m²</strong> (kilonewtons per square metre) in
              engineering or <strong>kg/m²</strong> in everyday talk. A typical residential floor
              needs <strong>2 kN/m² (≈ 200 kg/m²) live load capacity</strong> per IS 875. A 18 mm
              BWR plywood subfloor on joists 60 cm apart typically delivers 4-6 kN/m² — well above
              residential need but only marginal for office (3 kN/m²) and inadequate for storage
              (5+ kN/m²).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What grade of plywood should I use for a floor?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Marine plywood (IS 710 BWP)</strong>: kitchens, bathrooms, balconies,
              outdoor — boiling-water-proof glue, highest σ (38 N/mm²), highest cost. <strong>BWP
              plywood (IS 710)</strong>: living room / bedroom subfloor, kitchen base, anywhere
              you need 25+ year life and occasional moisture. <strong>BWR plywood (IS 303)</strong>:
              standard residential floors in dry areas — most common choice, balance of cost and
              durability. <strong>MR plywood (IS 303)</strong>: budget interiors, furniture
              decking, NOT recommended as primary floor. <strong>Particle board</strong>: never
              for structural floor — water destroys it. <strong>OSB</strong>: rare in India but
              gaining adoption for raised access floors in offices and commercial.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How thick should my plywood floor be?</h4>
            <p className="text-gray-600 mt-1">
              Rule of thumb based on joist spacing: <strong>40 cm joist spacing → 12-15 mm
              plywood</strong>; <strong>60 cm spacing → 18-19 mm plywood</strong>; <strong>80 cm
              spacing → 22-25 mm plywood</strong>. IS 875 residential live load (2 kN/m²) is met
              comfortably at these thicknesses. Office (3 kN/m²) needs one size up. Storage
              (5 kN/m²) usually requires either a thicker sheet (25 mm) or closer joist spacing
              (40 cm). The calculator above lets you check exact capacity for your combination.
              Don&apos;t use plywood below 12 mm for any walked-on floor — it&apos;ll feel bouncy
              and cracks open at joists.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Why does the calculator show different capacities for bending vs deflection?</h4>
            <p className="text-gray-600 mt-1">
              Because they&apos;re two independent safety checks. <strong>Bending capacity</strong>{" "}
              tells you when the material will physically break/crack. <strong>Deflection
              capacity</strong> tells you when the floor will sag too much for comfort, even if
              it isn&apos;t breaking. For sheet materials over normal joist spans (40-80 cm),
              <strong> deflection usually governs</strong> because plywood is relatively flexible
              for its strength. The governing capacity is the lower of the two — that&apos;s your
              actual safe load. For RCC slabs over short spans (under 3 m), bending typically
              governs; over longer spans, deflection takes over (same as wood beams).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">RCC slab vs plywood floor — when do I use each?</h4>
            <p className="text-gray-600 mt-1">
              <strong>RCC slab (concrete)</strong>: permanent ground / first-floor decks in
              masonry buildings; capacity 5-15 kN/m² depending on thickness; fire-resistant;
              integral with structure; expensive to alter; needs formwork and curing 14-28 days.
              <strong> Plywood / OSB</strong>: raised access floors, mezzanines, sheds, prefab
              cabins, temporary structures, top deck on steel-frame buildings; capacity 2-8 kN/m²
              depending on grade + thickness + span; quick install (no curing); easy to replace
              sections; less fire-resistant. <strong>Combined</strong>: many Indian sites use RCC
              for permanent structural floors with a 5-7 mm plywood overlay for a smoother finish
              under wooden flooring or tiles.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What live load does IS 875 require?</h4>
            <p className="text-gray-600 mt-1">
              <strong>IS 875 Part 2 minimum live loads</strong>: residential floors{" "}
              <strong>2.0 kN/m²</strong>; office floors <strong>2.5-3.0 kN/m²</strong>{" "}
              (general / corridor); shops, restaurants <strong>4.0 kN/m²</strong>;
              storage/light industrial <strong>5.0 kN/m²</strong>; storage/heavy <strong>10
              kN/m²+</strong>; classrooms <strong>3.0 kN/m²</strong>; libraries with stack
              loads <strong>6.0 kN/m²</strong>; balconies up to 5 m² <strong>3.0 kN/m²</strong>.
              These are <strong>minimum live load (excluding self-weight and finishes)</strong>.
              Your floor capacity (calculator total) must exceed dead load + live load with a
              comfortable safety margin (typically 1.5× working-stress design).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How do point loads (a heavy filing cabinet) compare to UDL?</h4>
            <p className="text-gray-600 mt-1">
              UDL = uniformly distributed load (the calc above). Point loads (filing cabinets,
              treadmills, heavy furniture) concentrate stress on small areas. <strong>Rule of
              thumb:</strong> a point load of P kN at mid-span produces ~2-4× the bending moment
              of an equivalent UDL of P/L kN/m. For a 250 kg cabinet on 0.6 m of floor span:
              treat it as ~4 kN/m² UDL even though the actual area load is much higher locally.
              For piano-class loads (300+ kg concentrated), use a dedicated joist beneath. The
              calculator doesn&apos;t handle point loads — for those, use the wood-beam-span
              calculator at the joist level with the point-load multiplier added.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What about fire and acoustic performance?</h4>
            <p className="text-gray-600 mt-1">
              The calculator is structural-only. <strong>Fire</strong>: NBC 2016 requires
              90-minute fire resistance for residential floors above 15 m height. RCC slabs
              ≥ 100 mm easily meet this; bare plywood does not — needs gypsum board ceiling
              underneath, intumescent paint, or fire-rated panels. <strong>Acoustic</strong>: bare
              plywood transmits airborne and impact sound easily. Treatments: 15 mm gypsum
              underlay + 50 mm mineral wool between joists raises STC from ~30 to ~50 (good
              residential standard). For RCC slabs, 200 mm slab gives STC ~52 inherently; add
              5 mm rubber underlay for impact-sound reduction.
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

function VerdictCard({ ok, title, load }: { ok: boolean; title: string; load: string }) {
  return (
    <div className={`border-2 rounded-xl p-3 text-center ${ok ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
      <div className="text-2xl mb-1">{ok ? "✅" : "❌"}</div>
      <div className={`font-bold text-sm ${ok ? "text-emerald-800" : "text-red-800"}`}>{title}</div>
      <div className={`text-[11px] mt-1 ${ok ? "text-emerald-700" : "text-red-700"}`}>{ok ? `OK at ${load}` : `Insufficient · needs ${load}`}</div>
    </div>
  );
}
