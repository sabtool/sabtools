"use client";
import { useState, useMemo } from "react";

// Verhoeff algorithm tables
const D_TABLE = [
  [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
];
const P_TABLE = [
  [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]
];
const INV = [0,4,3,2,1,5,6,7,8,9];

function verhoeffCheck(num: string): boolean {
  let c = 0;
  const digits = num.split("").reverse().map(Number);
  for (let i = 0; i < digits.length; i++) {
    c = D_TABLE[c][P_TABLE[i % 8][digits[i]]];
  }
  return c === 0;
}

export default function AadhaarMaskedGenerator() {
  const [aadhaar, setAadhaar] = useState("");
  const [copied, setCopied] = useState(false);

  const clean = aadhaar.replace(/\D/g, "");

  const result = useMemo(() => {
    if (clean.length !== 12) return null;
    const isValid = verhoeffCheck(clean);
    const last4 = clean.slice(8);
    const maskedDash = `XXXX-XXXX-${last4}`;
    const maskedSpace = `XXXX XXXX ${last4}`;
    const formatted = `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
    return { isValid, maskedDash, maskedSpace, formatted, last4 };
  }, [clean]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Enter 12-digit Aadhaar Number</label>
        <input
          className="calc-input"
          type="text"
          maxLength={14}
          placeholder="e.g. 1234 5678 9012"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
        />
        {clean.length > 0 && clean.length < 12 && (
          <div className="text-xs text-orange-500 mt-1">{12 - clean.length} more digits needed</div>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`result-card ${result.isValid ? "border-l-4 border-green-400" : "border-l-4 border-red-400"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-bold ${result.isValid ? "text-green-600" : "text-red-600"}`}>
                {result.isValid ? "✅ Valid Aadhaar (Verhoeff checksum passed)" : "❌ Invalid Aadhaar (Verhoeff checksum failed)"}
              </span>
            </div>
            <div className="text-xs text-gray-500">Formatted: <span className="font-mono font-bold text-gray-700">{result.formatted}</span></div>
          </div>

          <div className="result-card">
            <div className="text-sm font-semibold text-gray-700 mb-3">Masked Versions</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <div>
                  <div className="text-xs text-gray-500">With Dashes</div>
                  <div className="text-lg font-mono font-bold text-indigo-600">{result.maskedDash}</div>
                </div>
                <button className="btn-secondary text-xs" onClick={() => copyText(result.maskedDash)}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <div>
                  <div className="text-xs text-gray-500">With Spaces</div>
                  <div className="text-lg font-mono font-bold text-indigo-600">{result.maskedSpace}</div>
                </div>
                <button className="btn-secondary text-xs" onClick={() => copyText(result.maskedSpace)}>Copy</button>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <div>
                  <div className="text-xs text-gray-500">For Document Sharing</div>
                  <div className="text-lg font-mono font-bold text-indigo-600">XXXXXXXX{result.last4}</div>
                </div>
                <button className="btn-secondary text-xs" onClick={() => copyText(`XXXXXXXX${result.last4}`)}>Copy</button>
              </div>
            </div>
          </div>

          <div className="result-card bg-yellow-50 border border-yellow-200">
            <div className="text-sm font-semibold text-yellow-800 mb-2">Why Mask Aadhaar?</div>
            <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
              <li>UIDAI advises against sharing full Aadhaar number</li>
              <li>Masked Aadhaar is legally accepted for verification purposes</li>
              <li>Protects against identity theft and misuse</li>
              <li>Share only last 4 digits when submitting documents</li>
              <li>Use UIDAI&apos;s official mAadhaar app for masked Aadhaar download</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
