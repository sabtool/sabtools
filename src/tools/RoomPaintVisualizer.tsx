"use client";
import { useState, useMemo, useRef, useEffect } from "react";

const DOOR_AREA = 7 * 3; // 21 sq ft
const WINDOW_AREA = 4 * 3; // 12 sq ft
const COVERAGE_PER_LITER = 120; // sq ft per liter (average)

const PRESET_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Peach", hex: "#FFDAB9" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Mint Green", hex: "#98FB98" },
  { name: "Sage Green", hex: "#9DC183" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Light Pink", hex: "#FFB6C1" },
  { name: "Warm Grey", hex: "#C4BCAC" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Sunshine Yellow", hex: "#FFFACD" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Teal", hex: "#008080" },
  { name: "Dusty Rose", hex: "#DCAE96" },
];

export default function RoomPaintVisualizer() {
  const [roomL, setRoomL] = useState("");
  const [roomW, setRoomW] = useState("");
  const [roomH, setRoomH] = useState("10");
  const [numDoors, setNumDoors] = useState("1");
  const [numWindows, setNumWindows] = useState("2");
  const [coats, setCoats] = useState("2");
  const [pricePerLiter, setPricePerLiter] = useState("350");
  const [selectedColor, setSelectedColor] = useState("#ADD8E6");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const result = useMemo(() => {
    const l = parseFloat(roomL);
    const w = parseFloat(roomW);
    const h = parseFloat(roomH) || 10;
    const doors = parseInt(numDoors) || 0;
    const windows = parseInt(numWindows) || 0;
    const numCoats = parseInt(coats) || 2;
    const ppl = parseFloat(pricePerLiter) || 350;

    if (!l || !w || l <= 0 || w <= 0) return null;

    const wallArea = 2 * (l + w) * h;
    const deductions = doors * DOOR_AREA + windows * WINDOW_AREA;
    const paintableArea = Math.max(0, wallArea - deductions);
    const totalAreaWithCoats = paintableArea * numCoats;
    const litersNeeded = Math.ceil(totalAreaWithCoats / COVERAGE_PER_LITER);
    const totalCost = litersNeeded * ppl;

    return {
      wallArea: wallArea.toFixed(1),
      deductions: deductions.toFixed(1),
      paintableArea: paintableArea.toFixed(1),
      totalAreaWithCoats: totalAreaWithCoats.toFixed(1),
      litersNeeded,
      totalCost,
      numCoats,
    };
  }, [roomL, roomW, roomH, numDoors, numWindows, coats, pricePerLiter]);

  // Draw room preview on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    // Draw simple 3D room interior
    const margin = 30;
    const roomW2d = cw - 2 * margin;
    const roomH2d = ch - 2 * margin;
    const vanishX = cw / 2;
    const vanishY = ch / 2;
    const depth = 60;

    // Back wall (painted)
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.moveTo(margin + depth, margin + depth);
    ctx.lineTo(cw - margin - depth, margin + depth);
    ctx.lineTo(cw - margin - depth, ch - margin - depth);
    ctx.lineTo(margin + depth, ch - margin - depth);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Left wall
    ctx.fillStyle = adjustBrightness(selectedColor, -20);
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin + depth, margin + depth);
    ctx.lineTo(margin + depth, ch - margin - depth);
    ctx.lineTo(margin, ch - margin);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right wall
    ctx.fillStyle = adjustBrightness(selectedColor, -30);
    ctx.beginPath();
    ctx.moveTo(cw - margin, margin);
    ctx.lineTo(cw - margin - depth, margin + depth);
    ctx.lineTo(cw - margin - depth, ch - margin - depth);
    ctx.lineTo(cw - margin, ch - margin);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Floor
    ctx.fillStyle = "#d4c5a9";
    ctx.beginPath();
    ctx.moveTo(margin, ch - margin);
    ctx.lineTo(margin + depth, ch - margin - depth);
    ctx.lineTo(cw - margin - depth, ch - margin - depth);
    ctx.lineTo(cw - margin, ch - margin);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ceiling
    ctx.fillStyle = "#f5f5f5";
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin + depth, margin + depth);
    ctx.lineTo(cw - margin - depth, margin + depth);
    ctx.lineTo(cw - margin, margin);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Door on back wall
    const doorW = 25;
    const doorH = 50;
    const doorX = vanishX - doorW / 2 - 50;
    const doorY = ch - margin - depth - doorH;
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.strokeRect(doorX, doorY, doorW, doorH);

    // Window on back wall
    const winW = 30;
    const winH = 25;
    const winX = vanishX + 30;
    const winY = margin + depth + 30;
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(winX, winY, winW, winH);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.beginPath();
    ctx.moveTo(winX + winW / 2, winY);
    ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.moveTo(winX, winY + winH / 2);
    ctx.lineTo(winX + winW, winY + winH / 2);
    ctx.stroke();
  }, [selectedColor]);

  const fmtCur = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Length (ft)</label>
          <input type="number" placeholder="e.g. 15" value={roomL} onChange={(e) => setRoomL(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Width (ft)</label>
          <input type="number" placeholder="e.g. 12" value={roomW} onChange={(e) => setRoomW(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Height (ft)</label>
          <input type="number" placeholder="10" value={roomH} onChange={(e) => setRoomH(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Doors (7x3 ft)</label>
          <input type="number" placeholder="1" value={numDoors} onChange={(e) => setNumDoors(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Windows (4x3 ft)</label>
          <input type="number" placeholder="2" value={numWindows} onChange={(e) => setNumWindows(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Number of Coats</label>
          <select value={coats} onChange={(e) => setCoats(e.target.value)} className="calc-input">
            <option value="1">1 Coat</option>
            <option value="2">2 Coats</option>
            <option value="3">3 Coats</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Price / Liter</label>
          <input type="number" placeholder="350" value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} className="calc-input" />
        </div>
      </div>

      {/* Color Selector */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Wall Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => setSelectedColor(c.hex)}
              title={c.name}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === c.hex ? "border-indigo-600 scale-110 ring-2 ring-indigo-300" : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300"
            title="Custom color"
          />
        </div>
      </div>

      {/* Room Preview Canvas */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Room Preview</label>
        <canvas ref={canvasRef} width={500} height={320} className="w-full border border-gray-200 rounded-lg bg-gray-50" />
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Paint Required</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.litersNeeded} L</div>
            <div className="text-sm text-gray-400 mt-1">{result.numCoats} coat(s) | Coverage: ~{COVERAGE_PER_LITER} sqft/L</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Total Wall Area</div>
              <div className="text-lg font-bold text-gray-600">{result.wallArea} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Deductions</div>
              <div className="text-lg font-bold text-yellow-600">{result.deductions} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Paintable Area</div>
              <div className="text-lg font-bold text-green-600">{result.paintableArea} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Estimated Cost</div>
              <div className="text-lg font-bold text-red-600">{fmtCur(result.totalCost)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}
