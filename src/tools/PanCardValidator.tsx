"use client";
import { useState, useMemo } from "react";

const holderTypes: Record<string, string> = {
  P: "Individual / Person",
  C: "Company",
  H: "Hindu Undivided Family (HUF)",
  F: "Firm / Partnership",
  A: "Association of Persons (AOP)",
  T: "Trust",
  B: "Body of Individuals (BOI)",
  L: "Local Authority",
  J: "Artificial Juridical Person",
  G: "Government Agency",
  K: "Krishi (Not a Person)",
};

function validatePan(pan: string) {
  const clean = pan.toUpperCase().trim();
  const regex = /^([A-Z]{3})([PCFHATLBGJK])([A-Z])(\d{4})([A-Z])$/;
  const match = clean.match(regex);
  if (!match) return { valid: false, pan: clean };
  const [, first3, typeChar, initial, digits, checkChar] = match;
  const holderType = holderTypes[typeChar] || "Unknown";
  return {
    valid: true,
    pan: clean,
    first3,
    typeChar,
    holderType,
    initial,
    digits,
    checkChar,
    formatted: `${first3}${typeChar}${initial}${digits}${checkChar}`,
  };
}

export default function PanCardValidator() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return validatePan(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">PAN Number</label>
        <input
          type="text"
          placeholder="e.g. ABCPD1234E"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input uppercase"
          maxLength={10}
        />
        <p className="text-xs text-gray-400 mt-1">10-character Permanent Account Number</p>
      </div>

      {result && (
        <div className={`result-card space-y-4 border-l-4 ${result.valid ? "border-green-400" : "border-red-400"}`}>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${result.valid ? "text-green-500" : "text-red-500"}`}>
              {result.valid ? "\u2705" : "\u274C"}
            </span>
            <div>
              <p className={`text-lg font-bold ${result.valid ? "text-green-700" : "text-red-700"}`}>
                {result.valid ? "Valid PAN Format" : "Invalid PAN Format"}
              </p>
              <p className="text-sm font-mono tracking-widest text-gray-600">{result.pan}</p>
            </div>
          </div>

          {result.valid && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Holder Type (4th char)</p>
                <p className="text-lg font-bold text-gray-800">{result.typeChar}</p>
                <p className="text-sm text-gray-600">{result.holderType}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Name Initial (5th char)</p>
                <p className="text-lg font-bold text-gray-800">{result.initial}</p>
                <p className="text-sm text-gray-600">First letter of surname/name</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Sequential Number</p>
                <p className="text-lg font-bold text-gray-800">{result.digits}</p>
                <p className="text-sm text-gray-600">Digits 6-9</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Check Digit</p>
                <p className="text-lg font-bold text-gray-800">{result.checkChar}</p>
                <p className="text-sm text-gray-600">Alphabetic check character</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">PAN 4th Character - Holder Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {Object.entries(holderTypes).map(([code, desc]) => (
            <div key={code} className="bg-gray-50 rounded p-2">
              <span className="font-mono font-bold text-blue-600">{code}</span>
              <span className="text-gray-600 ml-2">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
