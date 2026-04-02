"use client";
import { useState, useMemo } from "react";

const zoneMap: Record<string, { zone: string; region: string; states: string }> = {
  "1": { zone: "Northern", region: "Delhi & NCR", states: "Delhi, Haryana (parts), Uttar Pradesh (parts)" },
  "2": { zone: "Northern", region: "North India", states: "Uttar Pradesh, Uttarakhand, Jammu & Kashmir, Ladakh, Himachal Pradesh, Punjab, Haryana, Chandigarh" },
  "3": { zone: "Western", region: "Rajasthan", states: "Rajasthan" },
  "4": { zone: "Western", region: "Gujarat & Maharashtra", states: "Gujarat, Maharashtra, Goa, Daman & Diu, Dadra & Nagar Haveli" },
  "5": { zone: "Southern", region: "South India (West)", states: "Karnataka, Kerala, Lakshadweep, Andhra Pradesh (parts), Telangana (parts)" },
  "6": { zone: "Southern", region: "South India (East)", states: "Tamil Nadu, Puducherry, Andhra Pradesh (parts), Telangana (parts)" },
  "7": { zone: "Eastern", region: "East India", states: "West Bengal, Odisha, Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura" },
  "8": { zone: "Eastern", region: "Bihar & Jharkhand", states: "Bihar, Jharkhand, Chhattisgarh, Madhya Pradesh" },
  "9": { zone: "Special", region: "Army Post Office (APO)", states: "APS (Army Postal Service)" },
};

function parsePinCode(pin: string) {
  const clean = pin.trim();
  if (!/^\d{6}$/.test(clean)) return null;
  if (clean.startsWith("0")) return null;
  const firstDigit = clean.charAt(0);
  const info = zoneMap[firstDigit];
  if (!info) return null;
  return { pin: clean, ...info, firstDigit, formatted: `${clean.slice(0, 3)} ${clean.slice(3)}` };
}

export default function PinCodeLookup() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return parsePinCode(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">PIN Code</label>
        <input
          type="text"
          placeholder="e.g. 400001"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="calc-input"
          maxLength={6}
        />
        <p className="text-xs text-gray-400 mt-1">Enter a 6-digit Indian PIN code</p>
      </div>

      {input.trim().length === 6 && !result && (
        <div className="result-card border-l-4 border-red-400">
          <p className="text-red-600 font-semibold">Invalid PIN Code</p>
          <p className="text-sm text-gray-500">PIN code must be 6 digits and cannot start with 0.</p>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold font-mono tracking-widest text-gray-800">{result.formatted}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Postal Zone</p>
              <p className="text-lg font-bold text-gray-800">{result.zone} Zone</p>
              <p className="text-sm text-gray-600">First digit: {result.firstDigit}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Region</p>
              <p className="text-lg font-bold text-gray-800">{result.region}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase mb-1">States / UTs in this zone</p>
            <p className="text-sm text-gray-700">{result.states}</p>
          </div>
          <p className="text-sm text-gray-500">
            For full details (post office, district, state), visit{" "}
            <a href={`https://www.indiapost.gov.in/VAS/Pages/FindPinCode.aspx`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              India Post PIN Lookup
            </a>.
          </p>
        </div>
      )}

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">PIN Code Zone Reference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          {Object.entries(zoneMap).map(([digit, info]) => (
            <div key={digit} className="bg-gray-50 rounded p-2">
              <span className="font-mono font-bold text-blue-600">{digit}XXXXX</span>
              <span className="text-gray-600 ml-2">{info.region}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
