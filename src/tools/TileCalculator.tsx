"use client";
import { useState, useMemo } from "react";

const TILE_SIZES = [
  { label: "1 x 1 ft (12x12 inch)", area: 1 },
  { label: "1.5 x 1.5 ft (18x18 inch)", area: 2.25 },
  { label: "2 x 2 ft (24x24 inch)", area: 4 },
  { label: "2 x 4 ft (24x48 inch)", area: 8 },
  { label: "1 x 2 ft (12x24 inch)", area: 2 },
  { label: "2 x 3 ft (24x36 inch)", area: 6 },
];

export default function TileCalculator() {
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [tileSize, setTileSize] = useState(0);
  const [costPerTile, setCostPerTile] = useState("");

  const result = useMemo(() => {
    const l = parseFloat(roomLength);
    const w = parseFloat(roomWidth);
    if (!l || !w || l <= 0 || w <= 0) return null;

    const roomArea = l * w;
    const tile = TILE_SIZES[tileSize];
    const tilesExact = roomArea / tile.area;
    const tilesNeeded = Math.ceil(tilesExact);
    const wastagePercent = 10;
    const tilesWithWastage = Math.ceil(tilesNeeded * (1 + wastagePercent / 100));

    const cpt = parseFloat(costPerTile) || 0;
    const costWithout = tilesNeeded * cpt;
    const costWith = tilesWithWastage * cpt;

    return {
      roomArea,
      tileArea: tile.area,
      tileLabel: tile.label,
      tilesExact: tilesExact.toFixed(1),
      tilesNeeded,
      tilesWithWastage,
      wastagePercent,
      costWithout,
      costWith,
    };
  }, [roomLength, roomWidth, tileSize, costPerTile]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Length (ft)</label>
          <input type="number" placeholder="e.g. 14" value={roomLength} onChange={(e) => setRoomLength(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Width (ft)</label>
          <input type="number" placeholder="e.g. 12" value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tile Size</label>
          <select value={tileSize} onChange={(e) => setTileSize(Number(e.target.value))} className="calc-input">
            {TILE_SIZES.map((t, i) => <option key={i} value={i}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Cost Per Tile (Rs, optional)</label>
          <input type="number" placeholder="e.g. 45" value={costPerTile} onChange={(e) => setCostPerTile(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Tiles Required (with 10% wastage)</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.tilesWithWastage} <span className="text-lg font-normal text-gray-400">tiles</span></div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Room Area</div>
              <div className="text-lg font-bold text-indigo-600">{result.roomArea.toLocaleString("en-IN")} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Tiles (Exact)</div>
              <div className="text-lg font-bold text-indigo-600">{result.tilesExact}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Without Wastage</div>
              <div className="text-lg font-bold text-indigo-600">{result.tilesNeeded}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">With 10% Wastage</div>
              <div className="text-lg font-bold text-green-600">{result.tilesWithWastage}</div>
            </div>
          </div>

          {result.costWith > 0 && (
            <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                <div className="text-xs text-gray-400">Cost Without Wastage</div>
                <div className="text-lg font-bold text-indigo-600">Rs {result.costWithout.toLocaleString("en-IN")}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-200 text-center">
                <div className="text-xs text-gray-500">Cost With Wastage</div>
                <div className="text-lg font-bold text-green-600">Rs {result.costWith.toLocaleString("en-IN")}</div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="text-xs text-blue-700">
              <strong>Tip:</strong> Always buy 10% extra tiles to account for cutting, breakage, and future replacements. Tile size: {result.tileLabel} ({result.tileArea} sq ft each).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
