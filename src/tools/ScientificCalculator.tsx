"use client";
import { useState } from "react";

const BUTTONS = [
  ["sin", "cos", "tan", "log"],
  ["ln", "sqrt", "pow", "pi"],
  ["(", ")", "%", "C"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "e", "+"],
  ["DEL", "="],
];

function sanitize(expr: string): string {
  return expr
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/pow\(/g, "Math.pow(")
    .replace(/pi/g, "Math.PI")
    .replace(/(?<![a-zA-Z])e(?![a-zA-Z(])/g, "Math.E");
}

function safeEval(expr: string): string {
  try {
    // Only allow safe characters
    const sanitized = sanitize(expr);
    if (/[^0-9+\-*/.()%\s,MathsincotaglqrpwPIE]/.test(sanitized.replace(/Math\.\w+/g, ""))) {
      return "Error";
    }
    const fn = new Function(`"use strict"; return (${sanitized})`);
    const result = fn();
    if (typeof result !== "number" || !isFinite(result)) return "Error";
    return Number.isInteger(result) ? String(result) : result.toFixed(10).replace(/\.?0+$/, "");
  } catch {
    return "Error";
  }
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState("");

  const handleButton = (btn: string) => {
    if (btn === "C") {
      setDisplay("0");
      setHistory("");
      return;
    }
    if (btn === "DEL") {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if (btn === "=") {
      const result = safeEval(display);
      setHistory(display);
      setDisplay(result);
      return;
    }
    if (btn === "pi") {
      setDisplay((prev) => (prev === "0" ? "pi" : prev + "pi"));
      return;
    }
    if (btn === "e") {
      setDisplay((prev) => (prev === "0" ? "e" : prev + "e"));
      return;
    }
    if (["sin", "cos", "tan", "log", "ln", "sqrt", "pow"].includes(btn)) {
      setDisplay((prev) => (prev === "0" ? `${btn}(` : prev + `${btn}(`));
      return;
    }
    // Numbers and operators
    setDisplay((prev) => {
      if (prev === "0" && btn !== ".") return btn;
      if (prev === "Error") return btn;
      return prev + btn;
    });
  };

  const getButtonStyle = (btn: string): string => {
    if (btn === "=") return "col-span-1 bg-indigo-600 text-white hover:bg-indigo-700 font-bold";
    if (btn === "C") return "bg-red-100 text-red-600 hover:bg-red-200 font-bold";
    if (btn === "DEL") return "bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold";
    if (["+", "-", "*", "/", "%"].includes(btn)) return "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold";
    if (["sin", "cos", "tan", "log", "ln", "sqrt", "pow", "pi", "e"].includes(btn))
      return "bg-purple-50 text-purple-700 hover:bg-purple-100 text-sm font-semibold";
    if (["(", ")"].includes(btn)) return "bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold";
    return "bg-white text-gray-800 hover:bg-gray-50 font-bold";
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Display */}
      <div className="result-card !p-4">
        {history && (
          <div className="text-right text-sm text-gray-400 font-mono mb-1 truncate">{history}</div>
        )}
        <div className="text-right text-3xl font-extrabold font-mono text-gray-800 truncate min-h-[2.5rem]">
          {display}
        </div>
      </div>

      {/* Button grid */}
      <div className="grid grid-cols-4 gap-2">
        {BUTTONS.flat().map((btn) => (
          <button
            key={btn}
            onClick={() => handleButton(btn)}
            className={`p-3 rounded-xl shadow-sm border transition active:scale-95 ${getButtonStyle(btn)} ${
              btn === "=" || btn === "DEL" ? "" : ""
            }`}
          >
            {btn === "DEL" ? "\u232B" : btn === "sqrt" ? "\u221A" : btn === "pow" ? "x^y" : btn === "pi" ? "\u03C0" : btn}
          </button>
        ))}
      </div>
    </div>
  );
}
