"use client";
import { useState, useMemo } from "react";

const STATE_RATES: Record<string, { residential: number; commercial: number; registration: number }> = {
  "Maharashtra": { residential: 5, commercial: 6, registration: 1 },
  "Delhi": { residential: 4, commercial: 6, registration: 1 },
  "Karnataka": { residential: 5, commercial: 5, registration: 1 },
  "Tamil Nadu": { residential: 7, commercial: 7, registration: 1 },
  "Uttar Pradesh": { residential: 5, commercial: 5, registration: 1 },
  "Gujarat": { residential: 4.9, commercial: 4.9, registration: 1 },
  "Rajasthan": { residential: 5, commercial: 5, registration: 1 },
  "West Bengal": { residential: 5, commercial: 6, registration: 1 },
  "Telangana": { residential: 5, commercial: 5, registration: 0.5 },
  "Andhra Pradesh": { residential: 5, commercial: 5, registration: 0.5 },
  "Kerala": { residential: 8, commercial: 8, registration: 2 },
  "Madhya Pradesh": { residential: 7.5, commercial: 7.5, registration: 3 },
  "Punjab": { residential: 5, commercial: 5, registration: 1 },
  "Haryana": { residential: 5, commercial: 7, registration: 1 },
  "Bihar": { residential: 5.7, commercial: 5.7, registration: 2 },
  "Odisha": { residential: 5, commercial: 5, registration: 1 },
  "Jharkhand": { residential: 4, commercial: 4, registration: 3 },
  "Chhattisgarh": { residential: 5, commercial: 5, registration: 1 },
  "Goa": { residential: 3.5, commercial: 4, registration: 1 },
  "Assam": { residential: 8.25, commercial: 8.25, registration: 0 },
};

const STATES = Object.keys(STATE_RATES).sort();

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [propertyType, setPropertyType] = useState<"residential" | "commercial">("residential");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const value = parseFloat(propertyValue);
    if (!value || value <= 0) return null;

    const rates = STATE_RATES[state];
    const stampDutyRate = rates[propertyType];
    const registrationRate = rates.registration;

    const stampDuty = (value * stampDutyRate) / 100;
    const registration = (value * registrationRate) / 100;
    const total = stampDuty + registration;
    const totalWithProperty = value + total;

    return { stampDutyRate, registrationRate, stampDuty, registration, total, totalWithProperty };
  }, [propertyValue, state, propertyType]);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Stamp duty rates are approximate and may vary based on gender, property location, and
        local municipal regulations. Women buyers often get a 1-2% concession in many states.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Property Value ₹</label>
          <input
            type="number"
            placeholder="e.g. 5000000"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="calc-input"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Property Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => setPropertyType("residential")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              propertyType === "residential"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Residential
          </button>
          <button
            onClick={() => setPropertyType("commercial")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              propertyType === "commercial"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Commercial
          </button>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <h3 className="text-sm font-bold text-gray-700 text-center mb-3">
            Stamp Duty & Registration for {state}
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Property Value</span>
              <span className="text-sm font-bold text-gray-800">{fmt(parseFloat(propertyValue))}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Stamp Duty ({result.stampDutyRate}%)</span>
              <span className="text-sm font-bold text-red-500">{fmt(result.stampDuty)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Registration Charges ({result.registrationRate}%)</span>
              <span className="text-sm font-bold text-orange-500">{fmt(result.registration)}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-indigo-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                <div className="text-xs font-medium text-red-700 mb-1">Total Duty & Registration</div>
                <div className="text-3xl font-extrabold text-red-500">{fmt(result.total)}</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-200">
                <div className="text-xs font-medium text-indigo-700 mb-1">Total Cost (Property + Charges)</div>
                <div className="text-3xl font-extrabold text-indigo-600">{fmt(result.totalWithProperty)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>Stamp duty rates are approximate state-level rates. Actual charges vary by property type and location. Consult Sub-Registrar office.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
