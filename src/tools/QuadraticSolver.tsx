"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

export default function QuadraticSolver() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("0");
  const [c, setC] = useState("-4");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const result = useMemo(() => {
    const ca = parseFloat(a), cb = parseFloat(b), cc = parseFloat(c);
    if (isNaN(ca) || isNaN(cb) || isNaN(cc)) return null;
    if (ca === 0) return { error: "Coefficient 'a' cannot be zero (not a quadratic equation)" };

    const disc = cb * cb - 4 * ca * cc;
    const vertexX = -cb / (2 * ca);
    const vertexY = ca * vertexX * vertexX + cb * vertexX + cc;
    const steps: string[] = [
      `Equation: ${ca}x\u00B2 + ${cb}x + ${cc} = 0`,
      `Discriminant (b\u00B2 - 4ac) = ${cb}\u00B2 - 4(${ca})(${cc}) = ${disc.toFixed(4)}`,
    ];

    let root1: string, root2: string;
    let realRoots: number[] = [];

    if (disc > 0) {
      const r1 = (-cb + Math.sqrt(disc)) / (2 * ca);
      const r2 = (-cb - Math.sqrt(disc)) / (2 * ca);
      root1 = r1.toFixed(6).replace(/\.?0+$/, "");
      root2 = r2.toFixed(6).replace(/\.?0+$/, "");
      realRoots = [r1, r2];
      steps.push(`Discriminant > 0: Two distinct real roots`);
      steps.push(`x = (-b \u00B1 \u221A\u0394) / 2a`);
      steps.push(`x\u2081 = (-${cb} + \u221A${disc.toFixed(4)}) / (2 \u00D7 ${ca}) = ${root1}`);
      steps.push(`x\u2082 = (-${cb} - \u221A${disc.toFixed(4)}) / (2 \u00D7 ${ca}) = ${root2}`);
    } else if (disc === 0) {
      const r = -cb / (2 * ca);
      root1 = root2 = r.toFixed(6).replace(/\.?0+$/, "");
      realRoots = [r];
      steps.push(`Discriminant = 0: One repeated real root`);
      steps.push(`x = -b / 2a = ${root1}`);
    } else {
      const realPart = (-cb / (2 * ca)).toFixed(4).replace(/\.?0+$/, "");
      const imagPart = (Math.sqrt(-disc) / (2 * ca)).toFixed(4).replace(/\.?0+$/, "");
      root1 = `${realPart} + ${imagPart}i`;
      root2 = `${realPart} - ${imagPart}i`;
      steps.push(`Discriminant < 0: Two complex conjugate roots`);
      steps.push(`x\u2081 = ${root1}`);
      steps.push(`x\u2082 = ${root2}`);
    }

    steps.push(`Vertex: (${vertexX.toFixed(4).replace(/\.?0+$/, "")}, ${vertexY.toFixed(4).replace(/\.?0+$/, "")})`);
    steps.push(`Axis of symmetry: x = ${vertexX.toFixed(4).replace(/\.?0+$/, "")}`);

    return { root1, root2, disc, vertexX, vertexY, realRoots, steps, ca, cb, cc };
  }, [a, b, c]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result || "error" in result) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const { ca, cb, cc, vertexX, vertexY } = result;

    const rangeX = Math.max(10, Math.abs(vertexX) * 3 + 5);
    const rangeY = Math.max(10, Math.abs(vertexY) * 1.5 + 5);
    const xMin = vertexX - rangeX, xMax = vertexX + rangeX;
    const yMin = vertexY - rangeY, yMax = vertexY + rangeY;

    const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
    const toY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = xMin + (i / 10) * (xMax - xMin);
      ctx.beginPath(); ctx.moveTo(toX(x), 0); ctx.lineTo(toX(x), H); ctx.stroke();
      const y = yMin + (i / 10) * (yMax - yMin);
      ctx.beginPath(); ctx.moveTo(0, toY(y)); ctx.lineTo(W, toY(y)); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#374151"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, toY(0)); ctx.lineTo(W, toY(0)); ctx.stroke();

    // Parabola
    ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5; ctx.beginPath();
    let started = false;
    for (let i = 0; i <= W; i++) {
      const x = xMin + (i / W) * (xMax - xMin);
      const y = ca * x * x + cb * x + cc;
      if (y < yMin - 50 || y > yMax + 50) { started = false; continue; }
      const px = toX(x), py = toY(y);
      if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
    }
    ctx.stroke();

    // Axis of symmetry
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(toX(vertexX), 0); ctx.lineTo(toX(vertexX), H); ctx.stroke();
    ctx.setLineDash([]);

    // Vertex
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(toX(vertexX), toY(vertexY), 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#374151"; ctx.font = "12px sans-serif";
    ctx.fillText(`Vertex (${vertexX.toFixed(1)}, ${vertexY.toFixed(1)})`, toX(vertexX) + 8, toY(vertexY) - 8);

    // Roots
    ctx.fillStyle = "#22c55e";
    result.realRoots.forEach((r) => {
      ctx.beginPath(); ctx.arc(toX(r), toY(0), 5, 0, Math.PI * 2); ctx.fill();
    });
  }, [result]);

  useEffect(() => { drawGraph(); }, [drawGraph]);

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Enter Coefficients: ax\u00B2 + bx + c = 0</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="calc-input w-20 text-center" />
          <span className="text-sm text-gray-500">x\u00B2 +</span>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="calc-input w-20 text-center" />
          <span className="text-sm text-gray-500">x +</span>
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} className="calc-input w-20 text-center" />
          <span className="text-sm text-gray-500">= 0</span>
        </div>
      </div>

      {result && (
        "error" in result ? (
          <div className="result-card"><p className="text-red-500 font-medium">{result.error}</p></div>
        ) : (
          <>
            <div className="result-card">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Root 1 (x\u2081)</p>
                  <p className="text-xl font-bold text-indigo-600">{result.root1}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Root 2 (x\u2082)</p>
                  <p className="text-xl font-bold text-indigo-600">{result.root2}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Discriminant (\u0394)</p>
                  <p className="text-xl font-bold text-amber-600">{result.disc.toFixed(4).replace(/\.?0+$/, "")}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Vertex</p>
                  <p className="text-xl font-bold text-green-600">
                    ({result.vertexX.toFixed(4).replace(/\.?0+$/, "")}, {result.vertexY.toFixed(4).replace(/\.?0+$/, "")})
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-bold text-gray-700 mb-2">Step-by-step Solution</h4>
              <div className="space-y-1">
                {result.steps.map((s, i) => (
                  <p key={i} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded">{s}</p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-2">
              <h3 className="text-sm font-bold text-gray-700 mb-2 px-2">Graph</h3>
              <canvas ref={canvasRef} width={700} height={400} className="w-full h-auto" />
              <div className="flex gap-4 px-2 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Parabola</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Vertex</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Roots</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-amber-500 inline-block" style={{ borderTop: "2px dashed" }} /> Axis of symmetry</span>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
