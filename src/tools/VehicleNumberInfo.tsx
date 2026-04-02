"use client";
import { useState, useMemo } from "react";

const stateCodes: Record<string, string> = {
  AN: "Andaman & Nicobar", AP: "Andhra Pradesh", AR: "Arunachal Pradesh", AS: "Assam",
  BR: "Bihar", CG: "Chhattisgarh", CH: "Chandigarh", DD: "Daman & Diu",
  DL: "Delhi", DN: "Dadra & Nagar Haveli", GA: "Goa", GJ: "Gujarat",
  HP: "Himachal Pradesh", HR: "Haryana", JH: "Jharkhand", JK: "Jammu & Kashmir",
  KA: "Karnataka", KL: "Kerala", LA: "Ladakh", LD: "Lakshadweep",
  MH: "Maharashtra", ML: "Meghalaya", MN: "Manipur", MP: "Madhya Pradesh",
  MZ: "Mizoram", NL: "Nagaland", OD: "Odisha", PB: "Punjab",
  PY: "Puducherry", RJ: "Rajasthan", SK: "Sikkim", TN: "Tamil Nadu",
  TR: "Tripura", TS: "Telangana", UK: "Uttarakhand", UP: "Uttar Pradesh",
  WB: "West Bengal",
};

const vehicleTypes: Record<string, string> = {
  A: "Two-wheeler", B: "Two-wheeler / Three-wheeler", C: "Car / SUV",
  D: "Three-wheeler / Goods", E: "Temporary", F: "Foreign Tourist",
  G: "Government", H: "Hire (Taxi)", P: "Passenger Bus",
  R: "Three-wheeler (Rickshaw)", S: "State Transport", T: "Tourist",
};

function parseVehicle(input: string) {
  const clean = input.toUpperCase().replace(/[\s-]/g, "");
  const regex = /^([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{1,4})$/;
  const match = clean.match(regex);
  if (!match) return null;
  const [, stateCode, rtoCode, seriesCode, regNum] = match;
  const state = stateCodes[stateCode] || "Unknown State";
  const typeChar = seriesCode.charAt(0);
  const typeInfo = vehicleTypes[typeChar] || "General Registration";
  return { stateCode, state, rtoCode, seriesCode, regNum, typeInfo, formatted: `${stateCode}-${rtoCode}-${seriesCode}-${regNum}` };
}

export default function VehicleNumberInfo() {
  const [input, setInput] = useState("");
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return parseVehicle(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Vehicle Registration Number</label>
        <input
          type="text"
          placeholder="e.g. MH02AB1234"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input uppercase"
          maxLength={13}
        />
        <p className="text-xs text-gray-400 mt-1">Format: XX00XX0000 (State-RTO-Series-Number)</p>
      </div>

      {input.trim() && !result && (
        <div className="result-card border-l-4 border-red-400">
          <p className="text-red-600 font-semibold">Invalid Format</p>
          <p className="text-sm text-gray-500">Enter a valid Indian vehicle number like MH02AB1234, DL01CA5678</p>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 tracking-wider bg-yellow-100 border-2 border-gray-800 rounded-lg inline-block px-6 py-3">
              {result.formatted}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">State Code</p>
              <p className="text-lg font-bold text-gray-800">{result.stateCode}</p>
              <p className="text-sm text-gray-600">{result.state}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">RTO District Code</p>
              <p className="text-lg font-bold text-gray-800">{result.rtoCode}</p>
              <p className="text-sm text-gray-600">Regional Transport Office</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Series Code</p>
              <p className="text-lg font-bold text-gray-800">{result.seriesCode}</p>
              <p className="text-sm text-gray-600">{result.typeInfo}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Registration Number</p>
              <p className="text-lg font-bold text-gray-800">{result.regNum}</p>
              <p className="text-sm text-gray-600">Unique vehicle number</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <button onClick={() => setShowTable(!showTable)} className="btn-secondary text-sm">
          {showTable ? "Hide" : "Show"} All State Codes
        </button>
        {showTable && (
          <div className="mt-3 max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr><th className="text-left p-2">Code</th><th className="text-left p-2">State / UT</th></tr>
              </thead>
              <tbody>
                {Object.entries(stateCodes).sort().map(([code, name]) => (
                  <tr key={code} className="border-b border-gray-100">
                    <td className="p-2 font-mono font-bold">{code}</td>
                    <td className="p-2">{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
