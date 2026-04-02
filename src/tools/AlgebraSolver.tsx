"use client";
import { useState, useMemo } from "react";

export default function AlgebraSolver() {
  const [tab, setTab] = useState<"linear" | "simultaneous">("linear");

  // Linear: ax + b = c
  const [la, setLa] = useState("2");
  const [lb, setLb] = useState("3");
  const [lc, setLc] = useState("7");

  // Simultaneous: a1x + b1y = c1, a2x + b2y = c2
  const [a1, setA1] = useState("2");
  const [b1, setB1] = useState("3");
  const [c1, setC1] = useState("8");
  const [a2, setA2] = useState("1");
  const [b2, setB2] = useState("-1");
  const [c2, setC2] = useState("1");

  const linearResult = useMemo(() => {
    const a = parseFloat(la), b = parseFloat(lb), c = parseFloat(lc);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return null;
    if (a === 0) {
      if (b === c) return { error: "Infinite solutions (0x + b = b)" };
      return { error: "No solution (0x + b = c where b \u2260 c)" };
    }
    const x = (c - b) / a;
    const steps = [
      `Given: ${a}x + ${b} = ${c}`,
      `Step 1: Subtract ${b} from both sides`,
      `${a}x = ${c} - ${b}`,
      `${a}x = ${c - b}`,
      `Step 2: Divide both sides by ${a}`,
      `x = ${c - b} / ${a}`,
      `x = ${x}`,
    ];
    return { x, steps };
  }, [la, lb, lc]);

  const simResult = useMemo(() => {
    const ca1 = parseFloat(a1), cb1 = parseFloat(b1), cc1 = parseFloat(c1);
    const ca2 = parseFloat(a2), cb2 = parseFloat(b2), cc2 = parseFloat(c2);
    if ([ca1, cb1, cc1, ca2, cb2, cc2].some(isNaN)) return null;

    const det = ca1 * cb2 - ca2 * cb1;
    if (Math.abs(det) < 1e-10) {
      return { error: "No unique solution (determinant = 0). The equations are parallel or identical." };
    }

    const x = (cc1 * cb2 - cc2 * cb1) / det;
    const y = (ca1 * cc2 - ca2 * cc1) / det;

    const steps = [
      `Equation 1: ${ca1}x + ${cb1}y = ${cc1}`,
      `Equation 2: ${ca2}x + ${cb2}y = ${cc2}`,
      "",
      "Using Cramer's Rule:",
      `Determinant D = (${ca1})(${cb2}) - (${ca2})(${cb1}) = ${det}`,
      `Dx = (${cc1})(${cb2}) - (${cc2})(${cb1}) = ${cc1 * cb2 - cc2 * cb1}`,
      `Dy = (${ca1})(${cc2}) - (${ca2})(${cc1}) = ${ca1 * cc2 - ca2 * cc1}`,
      "",
      `x = Dx / D = ${cc1 * cb2 - cc2 * cb1} / ${det} = ${x}`,
      `y = Dy / D = ${ca1 * cc2 - ca2 * cc1} / ${det} = ${y}`,
      "",
      "Verification:",
      `Eq1: ${ca1}(${x.toFixed(4)}) + ${cb1}(${y.toFixed(4)}) = ${(ca1 * x + cb1 * y).toFixed(4)} \u2713`,
      `Eq2: ${ca2}(${x.toFixed(4)}) + ${cb2}(${y.toFixed(4)}) = ${(ca2 * x + cb2 * y).toFixed(4)} \u2713`,
    ];

    return { x, y, steps };
  }, [a1, b1, c1, a2, b2, c2]);

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <div className="flex gap-2">
          <button onClick={() => setTab("linear")} className={tab === "linear" ? "btn-primary" : "btn-secondary"}>
            Linear Equation (1 variable)
          </button>
          <button onClick={() => setTab("simultaneous")} className={tab === "simultaneous" ? "btn-primary" : "btn-secondary"}>
            Simultaneous Equations (2 variables)
          </button>
        </div>
      </div>

      {tab === "linear" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Solve: ax + b = c</h3>
            <div className="flex flex-wrap items-center gap-2">
              <input type="number" value={la} onChange={(e) => setLa(e.target.value)} className="calc-input w-20 text-center" />
              <span className="text-sm text-gray-500">x +</span>
              <input type="number" value={lb} onChange={(e) => setLb(e.target.value)} className="calc-input w-20 text-center" />
              <span className="text-sm text-gray-500">=</span>
              <input type="number" value={lc} onChange={(e) => setLc(e.target.value)} className="calc-input w-20 text-center" />
            </div>
          </div>

          {linearResult && (
            <div className="result-card">
              {"error" in linearResult ? (
                <p className="text-red-500 font-medium">{linearResult.error}</p>
              ) : (
                <>
                  <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-500">Solution</p>
                    <p className="text-3xl font-bold text-indigo-600">x = {parseFloat(linearResult.x.toFixed(6))}</p>
                  </div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">Step-by-step Solution</h4>
                  <div className="space-y-1">
                    {linearResult.steps.map((s, i) => (
                      <p key={i} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded">{s}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {tab === "simultaneous" && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Solve Simultaneous Equations</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 w-12">Eq 1:</span>
                <input type="number" value={a1} onChange={(e) => setA1(e.target.value)} className="calc-input w-16 text-center" />
                <span className="text-sm text-gray-500">x +</span>
                <input type="number" value={b1} onChange={(e) => setB1(e.target.value)} className="calc-input w-16 text-center" />
                <span className="text-sm text-gray-500">y =</span>
                <input type="number" value={c1} onChange={(e) => setC1(e.target.value)} className="calc-input w-16 text-center" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 w-12">Eq 2:</span>
                <input type="number" value={a2} onChange={(e) => setA2(e.target.value)} className="calc-input w-16 text-center" />
                <span className="text-sm text-gray-500">x +</span>
                <input type="number" value={b2} onChange={(e) => setB2(e.target.value)} className="calc-input w-16 text-center" />
                <span className="text-sm text-gray-500">y =</span>
                <input type="number" value={c2} onChange={(e) => setC2(e.target.value)} className="calc-input w-16 text-center" />
              </div>
            </div>
          </div>

          {simResult && (
            <div className="result-card">
              {"error" in simResult ? (
                <p className="text-red-500 font-medium">{simResult.error}</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">x</p>
                      <p className="text-3xl font-bold text-indigo-600">{parseFloat(simResult.x.toFixed(6))}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">y</p>
                      <p className="text-3xl font-bold text-green-600">{parseFloat(simResult.y.toFixed(6))}</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">Step-by-step Solution</h4>
                  <div className="space-y-1">
                    {simResult.steps.map((s, i) => (
                      <p key={i} className={`text-sm font-mono px-3 py-1 rounded ${s === "" ? "h-2" : "text-gray-600 bg-gray-50"}`}>
                        {s}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
