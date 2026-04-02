"use client";
import { useState, useMemo } from "react";

// Verhoeff algorithm tables
const d: number[][] = [
  [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0],
];
const p: number[][] = [
  [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8],
];

function verhoeff(num: string): boolean {
  let c = 0;
  const digits = num.split("").reverse().map(Number);
  for (let i = 0; i < digits.length; i++) {
    c = d[c][p[i % 8][digits[i]]];
  }
  return c === 0;
}

function validateAadhaar(input: string) {
  const clean = input.replace(/[\s-]/g, "");
  if (!/^\d{12}$/.test(clean)) return { valid: false, reason: "Must be exactly 12 digits", aadhaar: clean };
  if (/^[01]/.test(clean)) return { valid: false, reason: "Cannot start with 0 or 1", aadhaar: clean };
  const checksumValid = verhoeff(clean);
  const masked = `XXXX-XXXX-${clean.slice(8)}`;
  const formatted = `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}`;
  return { valid: checksumValid, reason: checksumValid ? "Valid Aadhaar number" : "Checksum (Verhoeff) validation failed", aadhaar: clean, masked, formatted };
}

export default function AadhaarValidator() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return validateAadhaar(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Aadhaar Number</label>
        <input
          type="text"
          placeholder="e.g. 2345 6789 0123"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input"
          maxLength={14}
        />
        <p className="text-xs text-gray-400 mt-1">12-digit Aadhaar number (spaces/dashes OK)</p>
      </div>

      {result && (
        <div className={`result-card space-y-4 border-l-4 ${result.valid ? "border-green-400" : "border-red-400"}`}>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${result.valid ? "text-green-500" : "text-red-500"}`}>
              {result.valid ? "\u2705" : "\u274C"}
            </span>
            <div>
              <p className={`text-lg font-bold ${result.valid ? "text-green-700" : "text-red-700"}`}>
                {result.valid ? "Valid Aadhaar Format" : "Invalid Aadhaar"}
              </p>
              <p className="text-sm text-gray-500">{result.reason}</p>
            </div>
          </div>

          {result.formatted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Formatted</p>
                <p className="text-lg font-bold font-mono text-gray-800">{result.formatted}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Masked (Privacy)</p>
                <p className="text-lg font-bold font-mono text-gray-800">{result.masked}</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">About Verhoeff Checksum</p>
            <p className="text-blue-700">The Verhoeff algorithm detects all single-digit errors and most transposition errors. This validates the format only, not whether the Aadhaar is actually issued by UIDAI.</p>
          </div>
        </div>
      )}

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Aadhaar Number Rules</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Must be exactly 12 digits</li>
          <li>Cannot start with 0 or 1</li>
          <li>Last digit is Verhoeff checksum</li>
          <li>Issued by UIDAI (Unique Identification Authority of India)</li>
          <li>This tool validates format only, not authenticity</li>
        </ul>
      </div>
    </div>
  );
}
