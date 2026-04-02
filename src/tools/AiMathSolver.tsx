"use client";
import { useState } from "react";

interface Step {
  description: string;
  result: string;
}

function sanitizeExpr(expr: string): string {
  return expr.replace(/[^0-9+\-*/().%^ sqrtpiePIE,xX=²]/g, "").trim();
}

function solveArithmetic(expr: string): { steps: Step[]; answer: string } | null {
  try {
    const sanitized = expr.replace(/\^/g, "**").replace(/×/g, "*").replace(/÷/g, "/");
    const steps: Step[] = [];
    steps.push({ description: "Original expression", result: expr });

    if (expr.includes("%")) {
      const match = expr.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
      if (match) {
        const pct = parseFloat(match[1]);
        const num = parseFloat(match[2]);
        steps.push({ description: `Calculate ${pct}% of ${num}`, result: `(${pct}/100) × ${num}` });
        const result = (pct / 100) * num;
        steps.push({ description: "Result", result: result.toString() });
        return { steps, answer: result.toString() };
      }
      const pctMatch = expr.match(/(\d+(?:\.\d+)?)\s*%\s*(\d+(?:\.\d+)?)/);
      if (pctMatch) {
        const pct = parseFloat(pctMatch[1]);
        const num = parseFloat(pctMatch[2]);
        const result = (pct / 100) * num;
        steps.push({ description: `${pct}% of ${num}`, result: `(${pct}/100) × ${num} = ${result}` });
        return { steps, answer: result.toString() };
      }
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${sanitized})`)();
    if (typeof result === "number" && !isNaN(result)) {
      steps.push({ description: "Evaluate expression", result: `${sanitized} = ${result}` });
      return { steps, answer: result.toString() };
    }
  } catch { /* not arithmetic */ }
  return null;
}

function solveLinear(expr: string): { steps: Step[]; answer: string } | null {
  // ax + b = c or ax - b = c
  const match = expr.replace(/\s/g, "").match(/^(-?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*(-?\d+\.?\d*)$/);
  if (!match) return null;
  const steps: Step[] = [];
  const a = match[1] === "" || match[1] === "+" ? 1 : match[1] === "-" ? -1 : parseFloat(match[1]);
  const b = parseFloat(match[2].replace(/\s/g, ""));
  const c = parseFloat(match[3]);

  steps.push({ description: "Original equation", result: `${a}x + (${b}) = ${c}` });
  steps.push({ description: `Subtract ${b} from both sides`, result: `${a}x = ${c} - (${b}) = ${c - b}` });
  if (a === 0) return { steps: [{ description: "Error", result: "Coefficient of x is 0" }], answer: "No solution (a=0)" };
  const x = (c - b) / a;
  steps.push({ description: `Divide both sides by ${a}`, result: `x = ${c - b} / ${a} = ${x}` });
  steps.push({ description: "Verification", result: `${a}(${x}) + (${b}) = ${a * x + b} ✓` });
  return { steps, answer: `x = ${x}` };
}

function solveQuadratic(expr: string): { steps: Step[]; answer: string } | null {
  // ax²+bx+c=0
  const cleaned = expr.replace(/\s/g, "").replace(/x\^2|x²/gi, "x²");
  const match = cleaned.match(/^(-?\d*\.?\d*)x²\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*0$/);
  if (!match) return null;
  const steps: Step[] = [];
  const a = match[1] === "" || match[1] === "+" ? 1 : match[1] === "-" ? -1 : parseFloat(match[1]);
  const b = match[2].replace(/\s/g, "") === "+" || match[2].replace(/\s/g, "") === "" ? 1 : match[2].replace(/\s/g, "") === "-" ? -1 : parseFloat(match[2].replace(/\s/g, ""));
  const c = parseFloat(match[3].replace(/\s/g, ""));

  steps.push({ description: "Identify coefficients", result: `a = ${a}, b = ${b}, c = ${c}` });
  const discriminant = b * b - 4 * a * c;
  steps.push({ description: "Calculate discriminant (b² - 4ac)", result: `D = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}` });

  if (discriminant < 0) {
    steps.push({ description: "Discriminant is negative", result: "No real roots (complex roots exist)" });
    const realPart = (-b / (2 * a)).toFixed(4);
    const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
    return { steps, answer: `x = ${realPart} ± ${imagPart}i` };
  }

  steps.push({ description: "Apply quadratic formula: x = (-b ± √D) / 2a", result: `x = (-(${b}) ± √${discriminant}) / (2 × ${a})` });
  const sqrtD = Math.sqrt(discriminant);
  steps.push({ description: "Calculate √D", result: `√${discriminant} = ${sqrtD.toFixed(4)}` });
  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);
  steps.push({ description: "Root 1", result: `x₁ = (${-b} + ${sqrtD.toFixed(4)}) / ${2 * a} = ${x1.toFixed(4)}` });
  steps.push({ description: "Root 2", result: `x₂ = (${-b} - ${sqrtD.toFixed(4)}) / ${2 * a} = ${x2.toFixed(4)}` });

  if (discriminant === 0) return { steps, answer: `x = ${x1.toFixed(4)} (double root)` };
  return { steps, answer: `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}` };
}

function solveArea(expr: string): { steps: Step[]; answer: string } | null {
  const lower = expr.toLowerCase().trim();
  const steps: Step[] = [];

  // Area of circle
  let m = lower.match(/area\s*(?:of)?\s*circle\s*(?:radius|r)\s*=?\s*(\d+\.?\d*)/);
  if (m) {
    const r = parseFloat(m[1]);
    steps.push({ description: "Formula: Area = π × r²", result: `A = π × (${r})²` });
    steps.push({ description: "Calculate r²", result: `${r}² = ${r * r}` });
    const area = Math.PI * r * r;
    steps.push({ description: "Multiply by π", result: `A = ${Math.PI.toFixed(4)} × ${r * r} = ${area.toFixed(4)}` });
    return { steps, answer: `Area = ${area.toFixed(4)} sq units` };
  }

  // Area of rectangle
  m = lower.match(/area\s*(?:of)?\s*rectangle\s*(?:l|length)\s*=?\s*(\d+\.?\d*)\s*(?:w|width|b|breadth)\s*=?\s*(\d+\.?\d*)/);
  if (m) {
    const l = parseFloat(m[1]);
    const w = parseFloat(m[2]);
    steps.push({ description: "Formula: Area = length × width", result: `A = ${l} × ${w}` });
    steps.push({ description: "Calculate", result: `A = ${l * w}` });
    return { steps, answer: `Area = ${l * w} sq units` };
  }

  // Area of triangle
  m = lower.match(/area\s*(?:of)?\s*triangle\s*(?:b|base)\s*=?\s*(\d+\.?\d*)\s*(?:h|height)\s*=?\s*(\d+\.?\d*)/);
  if (m) {
    const b = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    steps.push({ description: "Formula: Area = ½ × base × height", result: `A = ½ × ${b} × ${h}` });
    const area = 0.5 * b * h;
    steps.push({ description: "Calculate", result: `A = ${area}` });
    return { steps, answer: `Area = ${area} sq units` };
  }

  // Perimeter of circle
  m = lower.match(/(?:perimeter|circumference)\s*(?:of)?\s*circle\s*(?:radius|r)\s*=?\s*(\d+\.?\d*)/);
  if (m) {
    const r = parseFloat(m[1]);
    steps.push({ description: "Formula: C = 2 × π × r", result: `C = 2 × π × ${r}` });
    const c = 2 * Math.PI * r;
    steps.push({ description: "Calculate", result: `C = ${c.toFixed(4)}` });
    return { steps, answer: `Circumference = ${c.toFixed(4)} units` };
  }

  // Perimeter of rectangle
  m = lower.match(/perimeter\s*(?:of)?\s*rectangle\s*(?:l|length)\s*=?\s*(\d+\.?\d*)\s*(?:w|width|b|breadth)\s*=?\s*(\d+\.?\d*)/);
  if (m) {
    const l = parseFloat(m[1]);
    const w = parseFloat(m[2]);
    steps.push({ description: "Formula: P = 2 × (length + width)", result: `P = 2 × (${l} + ${w})` });
    const p = 2 * (l + w);
    steps.push({ description: "Calculate", result: `P = ${p}` });
    return { steps, answer: `Perimeter = ${p} units` };
  }

  return null;
}

function solvePercentage(expr: string): { steps: Step[]; answer: string } | null {
  const lower = expr.toLowerCase().trim();
  const steps: Step[] = [];

  let m = lower.match(/what\s*(?:is)?\s*(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/);
  if (m) {
    const pct = parseFloat(m[1]);
    const num = parseFloat(m[2]);
    steps.push({ description: `Find ${pct}% of ${num}`, result: `(${pct}/100) × ${num}` });
    const result = (pct / 100) * num;
    steps.push({ description: "Calculate", result: `= ${result}` });
    return { steps, answer: result.toString() };
  }

  m = lower.match(/(\d+\.?\d*)\s*is\s*what\s*%\s*of\s*(\d+\.?\d*)/);
  if (m) {
    const part = parseFloat(m[1]);
    const whole = parseFloat(m[2]);
    steps.push({ description: `What % is ${part} of ${whole}?`, result: `(${part}/${whole}) × 100` });
    const result = (part / whole) * 100;
    steps.push({ description: "Calculate", result: `= ${result.toFixed(2)}%` });
    return { steps, answer: `${result.toFixed(2)}%` };
  }

  return null;
}

export default function AiMathSolver() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<{ steps: Step[]; answer: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const solve = () => {
    setError("");
    setResult(null);
    if (!expression.trim()) return;

    const expr = expression.trim();

    // Try percentage word problems
    let sol = solvePercentage(expr);
    if (sol) { setResult(sol); return; }

    // Try area/perimeter
    sol = solveArea(expr);
    if (sol) { setResult(sol); return; }

    // Try quadratic
    sol = solveQuadratic(expr);
    if (sol) { setResult(sol); return; }

    // Try linear
    sol = solveLinear(expr);
    if (sol) { setResult(sol); return; }

    // Try arithmetic
    sol = solveArithmetic(expr);
    if (sol) { setResult(sol); return; }

    setError("Could not parse the expression. Try formats like: 2+3*4, 2x+5=15, x²+3x-10=0, area of circle r=5, what is 15% of 200");
  };

  const copySteps = () => {
    if (!result) return;
    const text = result.steps.map((s) => `${s.description}: ${s.result}`).join("\n") + `\n\nAnswer: ${result.answer}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    "2 + 3 * 4 - 1",
    "2x + 5 = 15",
    "x² + 3x - 10 = 0",
    "what is 15% of 200",
    "area of circle r = 7",
    "area of rectangle l=10 w=5",
    "area of triangle b=8 h=6",
    "perimeter of rectangle l=12 w=8",
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Math Expression or Equation</label>
        <input className="calc-input" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="e.g., 2x+5=15 or x²+3x-10=0 or 25% of 400" onKeyDown={(e) => e.key === "Enter" && solve()} />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 block mb-2">Try an example:</label>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button key={ex} onClick={() => { setExpression(ex); }} className="btn-secondary text-xs">{ex}</button>
          ))}
        </div>
      </div>

      <button onClick={solve} className="btn-primary">Solve Step by Step</button>

      {error && <div className="result-card border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}

      {result && (
        <div className="result-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Solution</h3>
            <button onClick={copySteps} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy Steps"}</button>
          </div>
          <div className="space-y-3">
            {result.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">{step.description}</p>
                  <p className="text-base font-mono text-gray-800">{step.result}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-lg font-bold text-green-700">Answer: {result.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
