"use client";
import { useState, useMemo } from "react";

const stateCodeMap: Record<string, string> = {
  "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab", "04": "Chandigarh",
  "05": "Uttarakhand", "06": "Haryana", "07": "Delhi", "08": "Rajasthan",
  "09": "Uttar Pradesh", "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh",
  "13": "Nagaland", "14": "Manipur", "15": "Mizoram", "16": "Tripura",
  "17": "Meghalaya", "18": "Assam", "19": "West Bengal", "20": "Jharkhand",
  "21": "Odisha", "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
  "25": "Daman & Diu", "26": "Dadra & Nagar Haveli", "27": "Maharashtra", "28": "Andhra Pradesh",
  "29": "Karnataka", "30": "Goa", "31": "Lakshadweep", "32": "Kerala",
  "33": "Tamil Nadu", "34": "Puducherry", "35": "Andaman & Nicobar", "36": "Telangana",
  "37": "Andhra Pradesh (New)", "38": "Ladakh",
};

function validateGstin(input: string) {
  const clean = input.toUpperCase().trim();
  const regex = /^(\d{2})([A-Z]{5}\d{4}[A-Z])([1-9A-Z])(Z)([0-9A-Z])$/;
  const match = clean.match(regex);
  if (!match) return { valid: false, gstin: clean };
  const [, stateCode, pan, entityNum, z, checkDigit] = match;
  const stateName = stateCodeMap[stateCode] || "Unknown State";
  const panHolderType: Record<string, string> = {
    P: "Person", C: "Company", H: "HUF", F: "Firm", A: "AOP", T: "Trust",
    B: "BOI", L: "Local Authority", J: "Artificial Juridical Person", G: "Government",
  };
  const panType = panHolderType[pan.charAt(3)] || "Unknown";
  return {
    valid: true, gstin: clean, stateCode, stateName, pan, entityNum, z, checkDigit,
    panType, formatted: `${stateCode} ${pan} ${entityNum}${z}${checkDigit}`,
  };
}

export default function GstNumberValidator() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return validateGstin(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">GSTIN Number</label>
        <input
          type="text"
          placeholder="e.g. 27AABCU9603R1ZM"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input uppercase"
          maxLength={15}
        />
        <p className="text-xs text-gray-400 mt-1">15-character GST Identification Number</p>
      </div>

      {result && (
        <div className={`result-card space-y-4 border-l-4 ${result.valid ? "border-green-400" : "border-red-400"}`}>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${result.valid ? "text-green-500" : "text-red-500"}`}>
              {result.valid ? "\u2705" : "\u274C"}
            </span>
            <div>
              <p className={`text-lg font-bold ${result.valid ? "text-green-700" : "text-red-700"}`}>
                {result.valid ? "Valid GSTIN Format" : "Invalid GSTIN Format"}
              </p>
              <p className="text-sm font-mono tracking-wider text-gray-600">{result.gstin}</p>
            </div>
          </div>

          {result.valid && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase">State Code (1-2)</p>
                  <p className="text-lg font-bold text-gray-800">{result.stateCode}</p>
                  <p className="text-sm text-gray-600">{result.stateName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase">PAN (3-12)</p>
                  <p className="text-lg font-bold font-mono text-gray-800">{result.pan}</p>
                  <p className="text-sm text-gray-600">{result.panType}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase">Entity Number (13th)</p>
                  <p className="text-lg font-bold text-gray-800">{result.entityNum}</p>
                  <p className="text-sm text-gray-600">Number of registrations under same PAN</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase">Check Digit (15th)</p>
                  <p className="text-lg font-bold text-gray-800">{result.checkDigit}</p>
                  <p className="text-sm text-gray-600">Validation character</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Verify on the{" "}
                <a href="https://services.gst.gov.in/services/searchtp" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  GST Portal
                </a>{" "}
                for complete taxpayer details.
              </p>
            </>
          )}
        </div>
      )}

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">GSTIN Structure</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-mono bg-gray-100 px-1">XX</span> State Code (01-38)</p>
          <p><span className="font-mono bg-gray-100 px-1">ABCDE1234F</span> PAN of the entity</p>
          <p><span className="font-mono bg-gray-100 px-1">1</span> Entity number (1-9 or A-Z)</p>
          <p><span className="font-mono bg-gray-100 px-1">Z</span> Default &quot;Z&quot; character</p>
          <p><span className="font-mono bg-gray-100 px-1">X</span> Check digit</p>
        </div>
      </div>
    </div>
  );
}
