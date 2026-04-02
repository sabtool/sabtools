"use client";
import { useState, useMemo } from "react";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function simplify(n: number, d: number): [number, number] {
  if (d === 0) return [n, d];
  const g = gcd(n, d);
  let sn = n / g, sd = d / g;
  if (sd < 0) { sn = -sn; sd = -sd; }
  return [sn, sd];
}

export default function FractionCalculator() {
  const [n1, setN1] = useState("");
  const [d1, setD1] = useState("");
  const [n2, setN2] = useState("");
  const [d2, setD2] = useState("");
  const [operation, setOperation] = useState("add");

  const result = useMemo(() => {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return null;
    if (b === 0 || d === 0) return { error: "Denominator cannot be zero" };

    let rn: number, rd: number;
    let steps: string[] = [];

    switch (operation) {
      case "add": {
        const l = lcm(b, d);
        const ma = l / b, md = l / d;
        rn = a * ma + c * md;
        rd = l;
        steps = [
          `LCD of ${b} and ${d} = ${l}`,
          `${a}/${b} = ${a * ma}/${l}`,
          `${c}/${d} = ${c * md}/${l}`,
          `${a * ma}/${l} + ${c * md}/${l} = ${rn}/${rd}`,
        ];
        break;
      }
      case "subtract": {
        const l = lcm(b, d);
        const ma = l / b, md = l / d;
        rn = a * ma - c * md;
        rd = l;
        steps = [
          `LCD of ${b} and ${d} = ${l}`,
          `${a}/${b} = ${a * ma}/${l}`,
          `${c}/${d} = ${c * md}/${l}`,
          `${a * ma}/${l} - ${c * md}/${l} = ${rn}/${rd}`,
        ];
        break;
      }
      case "multiply": {
        rn = a * c;
        rd = b * d;
        steps = [
          `(${a} x ${c}) / (${b} x ${d})`,
          `= ${rn}/${rd}`,
        ];
        break;
      }
      case "divide": {
        if (c === 0) return { error: "Cannot divide by zero" };
        rn = a * d;
        rd = b * c;
        steps = [
          `${a}/${b} \u00F7 ${c}/${d} = ${a}/${b} x ${d}/${c}`,
          `= (${a} x ${d}) / (${b} x ${c})`,
          `= ${rn}/${rd}`,
        ];
        break;
      }
      default: return null;
    }

    const g = gcd(rn, rd);
    const [sn, sd] = simplify(rn, rd);
    const decimal = sd !== 0 ? sn / sd : 0;

    if (g > 1) {
      steps.push(`GCD of ${Math.abs(rn)} and ${Math.abs(rd)} = ${g}`);
      steps.push(`Simplified: ${rn}/${rd} = ${sn}/${sd}`);
    }

    return { numerator: sn, denominator: sd, decimal, gcdUsed: g, steps };
  }, [n1, d1, n2, d2, operation]);

  const ops = [
    { value: "add", label: "Add (+)" },
    { value: "subtract", label: "Subtract (\u2212)" },
    { value: "multiply", label: "Multiply (\u00D7)" },
    { value: "divide", label: "Divide (\u00F7)" },
  ];

  const FractionInput = ({ label, num, den, setNum, setDen }: { label: string; num: string; den: string; setNum: (v: string) => void; setDen: (v: string) => void }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500 font-bold">{label}</span>
      <input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Numerator" className="calc-input w-24 text-center" />
      <div className="w-20 h-px bg-gray-400" />
      <input type="number" value={den} onChange={(e) => setDen(e.target.value)} placeholder="Denominator" className="calc-input w-24 text-center" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Enter Fractions</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <FractionInput label="Fraction 1" num={n1} den={d1} setNum={setN1} setDen={setD1} />
          <div className="text-2xl font-bold text-indigo-600">
            {operation === "add" ? "+" : operation === "subtract" ? "\u2212" : operation === "multiply" ? "\u00D7" : "\u00F7"}
          </div>
          <FractionInput label="Fraction 2" num={n2} den={d2} setNum={setN2} setDen={setD2} />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Operation</h3>
        <div className="flex flex-wrap gap-2">
          {ops.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={operation === op.value ? "btn-primary" : "btn-secondary"}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="result-card">
          {"error" in result ? (
            <p className="text-red-500 font-medium">{result.error}</p>
          ) : (
            <>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Result</h3>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-indigo-600">{result.numerator}</span>
                  <div className="w-16 h-0.5 bg-indigo-600" />
                  <span className="text-3xl font-bold text-indigo-600">{result.denominator}</span>
                </div>
                <span className="text-gray-400 text-xl">=</span>
                <span className="text-2xl font-bold text-green-600">{result.decimal.toFixed(6).replace(/\.?0+$/, "")}</span>
              </div>
              {result.gcdUsed > 1 && (
                <p className="text-sm text-gray-500 mb-3">GCD used for simplification: <span className="font-bold text-indigo-600">{result.gcdUsed}</span></p>
              )}
              <h4 className="text-sm font-bold text-gray-700 mb-2">Steps</h4>
              <div className="space-y-1">
                {result.steps.map((s, i) => (
                  <p key={i} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded">{s}</p>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
