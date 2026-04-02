"use client";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";

interface Equation {
  id: number;
  expr: string;
  color: string;
}

const COLORS = ["#6366f1", "#ef4444", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316"];

function evaluateExpr(expr: string, x: number): number | null {
  try {
    const sanitized = expr
      .replace(/\^/g, "**")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/pi/g, "Math.PI")
      .replace(/e(?![a-zA-Z])/g, "Math.E");
    const fn = new Function("x", `"use strict"; return (${sanitized});`);
    const result = fn(x);
    if (typeof result === "number" && isFinite(result)) return result;
    return null;
  } catch {
    return null;
  }
}

export default function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [equations, setEquations] = useState<Equation[]>([
    { id: 1, expr: "x**2", color: COLORS[0] },
  ]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const nextId = useRef(2);

  const addEquation = () => {
    const c = COLORS[equations.length % COLORS.length];
    setEquations((prev) => [...prev, { id: nextId.current++, expr: "", color: c }]);
  };

  const removeEquation = (id: number) => {
    setEquations((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpr = (id: number, expr: string) => {
    setEquations((prev) => prev.map((e) => (e.id === id ? { ...e, expr } : e)));
  };

  const zoomIn = () => {
    const dx = (xMax - xMin) * 0.25;
    const dy = (yMax - yMin) * 0.25;
    setXMin((v) => v + dx);
    setXMax((v) => v - dx);
    setYMin((v) => v + dy);
    setYMax((v) => v - dy);
  };

  const zoomOut = () => {
    const dx = (xMax - xMin) * 0.25;
    const dy = (yMax - yMin) * 0.25;
    setXMin((v) => v - dx);
    setXMax((v) => v + dx);
    setYMin((v) => v - dy);
    setYMax((v) => v + dy);
  };

  const panLeft = () => { const d = (xMax - xMin) * 0.2; setXMin((v) => v - d); setXMax((v) => v - d); };
  const panRight = () => { const d = (xMax - xMin) * 0.2; setXMin((v) => v + d); setXMax((v) => v + d); };
  const panUp = () => { const d = (yMax - yMin) * 0.2; setYMin((v) => v + d); setYMax((v) => v + d); };
  const panDown = () => { const d = (yMax - yMin) * 0.2; setYMin((v) => v - d); setYMax((v) => v - d); };

  const reset = () => { setXMin(-10); setXMax(10); setYMin(-10); setYMax(10); };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
    const toCanvasY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

    // Grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    const xStep = niceStep(xMax - xMin);
    const yStep = niceStep(yMax - yMin);

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.fillStyle = "#9ca3af"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(formatNum(x), cx, toCanvasY(0) + 14);
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.fillStyle = "#9ca3af"; ctx.font = "11px sans-serif"; ctx.textAlign = "right";
      ctx.fillText(formatNum(y), toCanvasX(0) - 4, cy + 4);
    }

    // Axes
    ctx.strokeStyle = "#374151"; ctx.lineWidth = 2;
    const ox = toCanvasX(0); const oy = toCanvasY(0);
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();

    // Plot equations
    const steps = W;
    for (const eq of equations) {
      if (!eq.expr.trim()) continue;
      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let drawing = false;
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        const y = evaluateExpr(eq.expr, x);
        if (y === null || y < yMin - 100 || y > yMax + 100) { drawing = false; continue; }
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);
        if (!drawing) { ctx.moveTo(cx, cy); drawing = true; } else { ctx.lineTo(cx, cy); }
      }
      ctx.stroke();
    }
  }, [equations, xMin, xMax, yMin, yMax]);

  useEffect(() => { draw(); }, [draw]);

  const presets = [
    { label: "x\u00B2", expr: "x**2" },
    { label: "x\u00B3", expr: "x**3" },
    { label: "sin(x)", expr: "sin(x)" },
    { label: "cos(x)", expr: "cos(x)" },
    { label: "tan(x)", expr: "tan(x)" },
    { label: "log(x)", expr: "log(x)" },
    { label: "sqrt(x)", expr: "sqrt(x)" },
    { label: "abs(x)", expr: "abs(x)" },
    { label: "2x+3", expr: "2*x+3" },
    { label: "1/x", expr: "1/x" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Equations</h3>
        <div className="space-y-2">
          {equations.map((eq) => (
            <div key={eq.id} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: eq.color }} />
              <span className="text-sm text-gray-500">y =</span>
              <input
                type="text"
                value={eq.expr}
                onChange={(e) => updateExpr(eq.id, e.target.value)}
                placeholder="e.g. x**2, sin(x), 2*x+3"
                className="calc-input flex-1"
              />
              {equations.length > 1 && (
                <button onClick={() => removeEquation(eq.id)} className="btn-secondary text-xs px-2 py-1">Remove</button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addEquation} className="btn-primary text-xs mt-3">+ Add Equation</button>

        <div className="mt-3 flex flex-wrap gap-1">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                if (equations.length > 0 && !equations[equations.length - 1].expr) {
                  updateExpr(equations[equations.length - 1].id, p.expr);
                } else {
                  const c = COLORS[equations.length % COLORS.length];
                  setEquations((prev) => [...prev, { id: nextId.current++, expr: p.expr, color: c }]);
                }
              }}
              className="btn-secondary text-xs px-2 py-1"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Plot Range</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-500">X Min</label>
            <input type="number" value={xMin} onChange={(e) => setXMin(Number(e.target.value))} className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs text-gray-500">X Max</label>
            <input type="number" value={xMax} onChange={(e) => setXMax(Number(e.target.value))} className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Y Min</label>
            <input type="number" value={yMin} onChange={(e) => setYMin(Number(e.target.value))} className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Y Max</label>
            <input type="number" value={yMax} onChange={(e) => setYMax(Number(e.target.value))} className="calc-input w-full" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={zoomIn} className="btn-primary text-xs">Zoom In</button>
          <button onClick={zoomOut} className="btn-primary text-xs">Zoom Out</button>
          <button onClick={panLeft} className="btn-secondary text-xs">Left</button>
          <button onClick={panRight} className="btn-secondary text-xs">Right</button>
          <button onClick={panUp} className="btn-secondary text-xs">Up</button>
          <button onClick={panDown} className="btn-secondary text-xs">Down</button>
          <button onClick={reset} className="btn-secondary text-xs">Reset</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-2 overflow-hidden">
        <canvas ref={canvasRef} width={700} height={500} className="w-full h-auto" />
      </div>
    </div>
  );
}

function niceStep(range: number): number {
  const rough = range / 10;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / pow;
  if (norm <= 1) return pow;
  if (norm <= 2) return 2 * pow;
  if (norm <= 5) return 5 * pow;
  return 10 * pow;
}

function formatNum(n: number): string {
  return Math.abs(n) < 1e-10 ? "0" : parseFloat(n.toFixed(4)).toString();
}
