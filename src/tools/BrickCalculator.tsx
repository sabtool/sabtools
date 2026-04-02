"use client";
import { useState, useMemo } from "react";

// Standard Indian brick: 9" x 4.5" x 3" (with mortar: 9.5" x 5" x 3.5")
const BRICK_L = 9; // inches
const BRICK_W = 4.5;
const BRICK_H = 3;
const MORTAR_THICKNESS = 0.5; // inches

const WALL_TYPES = [
  { label: "Half Brick (4.5\")", thickness: 4.5 },
  { label: "Full Brick (9\")", thickness: 9 },
  { label: "One & Half Brick (13.5\")", thickness: 13.5 },
];

const MORTAR_RATIOS = [
  { label: "1:3 (Rich)", cement: 1, sand: 3 },
  { label: "1:4 (Standard)", cement: 1, sand: 4 },
  { label: "1:5 (Lean)", cement: 1, sand: 5 },
  { label: "1:6 (Economy)", cement: 1, sand: 6 },
];

export default function BrickCalculator() {
  const [wallLength, setWallLength] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [wallType, setWallType] = useState(1);
  const [mortarRatio, setMortarRatio] = useState(1);

  const result = useMemo(() => {
    const l = parseFloat(wallLength);
    const h = parseFloat(wallHeight);
    if (!l || !h || l <= 0 || h <= 0) return null;

    const thickness = WALL_TYPES[wallType].thickness;
    const mortar = MORTAR_RATIOS[mortarRatio];

    // Wall volume in cubic feet
    const wallVolFt3 = l * h * (thickness / 12);

    // Volume of one brick with mortar in cubic feet
    const brickWithMortarL = (BRICK_L + MORTAR_THICKNESS) / 12;
    const brickWithMortarW = (BRICK_W + MORTAR_THICKNESS) / 12;
    const brickWithMortarH = (BRICK_H + MORTAR_THICKNESS) / 12;
    const brickVolWithMortar = brickWithMortarL * brickWithMortarW * brickWithMortarH;

    // Number of bricks
    const bricksExact = wallVolFt3 / brickVolWithMortar;
    const wastage = 0.05;
    const bricksNeeded = Math.ceil(bricksExact * (1 + wastage));

    // Mortar volume (wall volume - brick volume)
    const brickVolOnly = (BRICK_L / 12) * (BRICK_W / 12) * (BRICK_H / 12);
    const totalBrickVol = bricksExact * brickVolOnly;
    const mortarVol = wallVolFt3 - totalBrickVol; // in cubic feet
    // Add 25% for dry to wet volume increase
    const dryMortarVol = mortarVol * 1.25;

    // Cement and sand
    const totalParts = mortar.cement + mortar.sand;
    const cementVol = dryMortarVol * (mortar.cement / totalParts); // cubic feet
    const sandVol = dryMortarVol * (mortar.sand / totalParts); // cubic feet
    // 1 bag cement = 1.226 cubic feet
    const cementBags = Math.ceil(cementVol / 1.226);

    return {
      wallArea: (l * h).toFixed(1),
      wallVolFt3: wallVolFt3.toFixed(2),
      bricksExact: Math.ceil(bricksExact),
      bricksNeeded,
      cementBags,
      sandVol: sandVol.toFixed(2),
      mortarVol: mortarVol.toFixed(2),
      thickness: WALL_TYPES[wallType].label,
      mortarLabel: MORTAR_RATIOS[mortarRatio].label,
    };
  }, [wallLength, wallHeight, wallType, mortarRatio]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Wall Length (ft)</label>
          <input type="number" placeholder="e.g. 20" value={wallLength} onChange={(e) => setWallLength(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Wall Height (ft)</label>
          <input type="number" placeholder="e.g. 10" value={wallHeight} onChange={(e) => setWallHeight(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Wall Thickness</label>
          <select value={wallType} onChange={(e) => setWallType(Number(e.target.value))} className="calc-input">
            {WALL_TYPES.map((w, i) => <option key={i} value={i}>{w.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Mortar Ratio (Cement:Sand)</label>
          <select value={mortarRatio} onChange={(e) => setMortarRatio(Number(e.target.value))} className="calc-input">
            {MORTAR_RATIOS.map((m, i) => <option key={i} value={i}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Bricks Required (incl. 5% wastage)</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.bricksNeeded.toLocaleString("en-IN")}</div>
            <div className="text-xs text-gray-400 mt-1">Without wastage: {result.bricksExact.toLocaleString("en-IN")}</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Wall Area</div>
              <div className="text-lg font-bold text-indigo-600">{result.wallArea} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Wall Volume</div>
              <div className="text-lg font-bold text-indigo-600">{result.wallVolFt3} cu ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Cement Bags (50kg)</div>
              <div className="text-lg font-bold text-green-600">{result.cementBags}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Sand Volume</div>
              <div className="text-lg font-bold text-yellow-600">{result.sandVol} cu ft</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Specifications</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2 border border-gray-100">
                <span className="text-gray-400">Brick Size:</span> <span className="font-semibold">{BRICK_L}&quot; x {BRICK_W}&quot; x {BRICK_H}&quot;</span>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-100">
                <span className="text-gray-400">Wall Type:</span> <span className="font-semibold">{result.thickness}</span>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-100">
                <span className="text-gray-400">Mortar Ratio:</span> <span className="font-semibold">{result.mortarLabel}</span>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-100">
                <span className="text-gray-400">Mortar Volume:</span> <span className="font-semibold">{result.mortarVol} cu ft</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
