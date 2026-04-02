"use client";
import { useState, useMemo } from "react";

function parseBin(s: string): number | null {
  const trimmed = s.trim();
  if (!/^[01]+$/.test(trimmed)) return null;
  return parseInt(trimmed, 2);
}

function toBin(n: number): string {
  if (n < 0) return "-" + toBin(-n);
  return (n >>> 0).toString(2);
}

function toOct(n: number): string {
  return (n >>> 0).toString(8);
}

function toHex(n: number): string {
  return (n >>> 0).toString(16).toUpperCase();
}

function binaryAddSteps(a: string, b: string): string[] {
  const maxLen = Math.max(a.length, b.length);
  const pa = a.padStart(maxLen, "0");
  const pb = b.padStart(maxLen, "0");
  const steps: string[] = [];
  steps.push(`  ${pa}`);
  steps.push(`+ ${pb}`);
  steps.push(`${"─".repeat(maxLen + 2)}`);

  let carry = 0;
  let result = "";
  let carryStr = "";
  for (let i = maxLen - 1; i >= 0; i--) {
    const sum = parseInt(pa[i]) + parseInt(pb[i]) + carry;
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
    carryStr = (carry > 0 && i > 0 ? carry.toString() : " ") + carryStr;
  }
  if (carry) result = "1" + result;

  if (carryStr.trim()) steps.splice(0, 0, `  ${carryStr.padStart(maxLen, " ")} (carry)`);
  steps.push(`= ${result}`);
  return steps;
}

export default function BinaryCalculator() {
  const [bin1, setBin1] = useState("1010");
  const [bin2, setBin2] = useState("1100");
  const [operation, setOperation] = useState("add");

  const result = useMemo(() => {
    const a = parseBin(bin1);
    const b = parseBin(bin2);

    if (bin1.trim() && !/^[01]+$/.test(bin1.trim())) return { error: "First input is not a valid binary number" };
    if (bin2.trim() && !/^[01]+$/.test(bin2.trim())) return { error: "Second input is not a valid binary number" };
    if (a === null || b === null) return null;

    let resVal: number;
    let steps: string[] = [];
    let label = "";

    switch (operation) {
      case "add":
        resVal = a + b;
        label = `${bin1} + ${bin2}`;
        steps = binaryAddSteps(bin1.trim(), bin2.trim());
        break;
      case "subtract":
        resVal = a - b;
        label = `${bin1} - ${bin2}`;
        steps = [`${a} (decimal) - ${b} (decimal) = ${resVal} (decimal)`, `= ${toBin(resVal)} (binary)`];
        break;
      case "and":
        resVal = a & b;
        label = `${bin1} AND ${bin2}`;
        steps = buildBitwiseSteps(bin1.trim(), bin2.trim(), "AND", (x, y) => x & y);
        break;
      case "or":
        resVal = a | b;
        label = `${bin1} OR ${bin2}`;
        steps = buildBitwiseSteps(bin1.trim(), bin2.trim(), "OR", (x, y) => x | y);
        break;
      case "xor":
        resVal = a ^ b;
        label = `${bin1} XOR ${bin2}`;
        steps = buildBitwiseSteps(bin1.trim(), bin2.trim(), "XOR", (x, y) => x ^ y);
        break;
      case "not_a":
        resVal = ~a & ((1 << bin1.trim().length) - 1);
        label = `NOT ${bin1}`;
        steps = [`NOT ${bin1.trim()} = ${toBin(resVal).padStart(bin1.trim().length, "0")} (${bin1.trim().length}-bit)`];
        break;
      case "not_b":
        resVal = ~b & ((1 << bin2.trim().length) - 1);
        label = `NOT ${bin2}`;
        steps = [`NOT ${bin2.trim()} = ${toBin(resVal).padStart(bin2.trim().length, "0")} (${bin2.trim().length}-bit)`];
        break;
      case "lshift":
        resVal = a << 1;
        label = `${bin1} << 1`;
        steps = [`${bin1.trim()} << 1 = ${toBin(resVal)}`, `Decimal: ${a} << 1 = ${resVal}`];
        break;
      case "rshift":
        resVal = a >> 1;
        label = `${bin1} >> 1`;
        steps = [`${bin1.trim()} >> 1 = ${toBin(resVal)}`, `Decimal: ${a} >> 1 = ${resVal}`];
        break;
      default:
        return null;
    }

    return {
      label,
      binary: toBin(resVal),
      decimal: resVal,
      octal: toOct(resVal),
      hex: toHex(resVal),
      steps,
    };
  }, [bin1, bin2, operation]);

  const conversions = useMemo(() => {
    const results: { label: string; dec: number; bin: string; oct: string; hex: string }[] = [];
    const a = parseBin(bin1);
    const b = parseBin(bin2);
    if (a !== null) results.push({ label: `Input 1 (${bin1.trim()})`, dec: a, bin: bin1.trim(), oct: toOct(a), hex: toHex(a) });
    if (b !== null) results.push({ label: `Input 2 (${bin2.trim()})`, dec: b, bin: bin2.trim(), oct: toOct(b), hex: toHex(b) });
    return results;
  }, [bin1, bin2]);

  const ops = [
    { value: "add", label: "Add" },
    { value: "subtract", label: "Subtract" },
    { value: "and", label: "AND" },
    { value: "or", label: "OR" },
    { value: "xor", label: "XOR" },
    { value: "not_a", label: "NOT A" },
    { value: "not_b", label: "NOT B" },
    { value: "lshift", label: "<< (Left Shift A)" },
    { value: "rshift", label: ">> (Right Shift A)" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Enter Binary Numbers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Binary 1</label>
            <input type="text" value={bin1} onChange={(e) => setBin1(e.target.value)} placeholder="e.g. 1010" className="calc-input w-full font-mono" />
            {bin1 && parseBin(bin1) !== null && <p className="text-xs text-gray-400 mt-1">Decimal: {parseBin(bin1)}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-500">Binary 2</label>
            <input type="text" value={bin2} onChange={(e) => setBin2(e.target.value)} placeholder="e.g. 1100" className="calc-input w-full font-mono" />
            {bin2 && parseBin(bin2) !== null && <p className="text-xs text-gray-400 mt-1">Decimal: {parseBin(bin2)}</p>}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Operation</h3>
        <div className="flex flex-wrap gap-2">
          {ops.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={operation === op.value ? "btn-primary text-xs" : "btn-secondary text-xs"}
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
              <h3 className="text-sm font-bold text-gray-700 mb-3">{result.label}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Binary</p>
                  <p className="text-lg font-bold text-indigo-600 font-mono break-all">{result.binary}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Decimal</p>
                  <p className="text-lg font-bold text-green-600 font-mono">{result.decimal}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Octal</p>
                  <p className="text-lg font-bold text-amber-600 font-mono">{result.octal}</p>
                </div>
                <div className="bg-rose-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Hexadecimal</p>
                  <p className="text-lg font-bold text-rose-600 font-mono">{result.hex}</p>
                </div>
              </div>

              <h4 className="text-sm font-bold text-gray-700 mb-2">Steps</h4>
              <div className="bg-gray-900 rounded-lg p-4">
                {result.steps.map((s, i) => (
                  <p key={i} className="text-sm text-green-400 font-mono whitespace-pre">{s}</p>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {conversions.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Number System Conversions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-600">Input</th>
                  <th className="text-left py-2 px-3 text-gray-600">Binary</th>
                  <th className="text-left py-2 px-3 text-gray-600">Decimal</th>
                  <th className="text-left py-2 px-3 text-gray-600">Octal</th>
                  <th className="text-left py-2 px-3 text-gray-600">Hex</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1 px-3 text-gray-500">{c.label}</td>
                    <td className="py-1 px-3 font-mono font-bold text-indigo-600">{c.bin}</td>
                    <td className="py-1 px-3 font-mono font-bold text-green-600">{c.dec}</td>
                    <td className="py-1 px-3 font-mono font-bold text-amber-600">{c.oct}</td>
                    <td className="py-1 px-3 font-mono font-bold text-rose-600">{c.hex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function buildBitwiseSteps(a: string, b: string, op: string, fn: (x: number, y: number) => number): string[] {
  const maxLen = Math.max(a.length, b.length);
  const pa = a.padStart(maxLen, "0");
  const pb = b.padStart(maxLen, "0");
  let result = "";
  for (let i = 0; i < maxLen; i++) {
    result += fn(parseInt(pa[i]), parseInt(pb[i])).toString();
  }
  return [
    `  ${pa}`,
    `${op} ${pb}`,
    `${"─".repeat(maxLen + op.length + 1)}`,
    `= ${result}`,
  ];
}
