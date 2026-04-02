"use client";
import { useState, useMemo } from "react";

export default function HraCalculator() {
  const [basicSalary, setBasicSalary] = useState("");
  const [hraReceived, setHraReceived] = useState("");
  const [rentPaid, setRentPaid] = useState("");
  const [isMetro, setIsMetro] = useState(true);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const basic = parseFloat(basicSalary);
    const hra = parseFloat(hraReceived);
    const rent = parseFloat(rentPaid);
    if (!basic || !hra || !rent || basic <= 0 || hra <= 0 || rent <= 0) return null;

    const actualHra = hra;
    const rentMinusBasic = Math.max(rent - 0.1 * basic, 0);
    const percentOfBasic = isMetro ? 0.5 * basic : 0.4 * basic;
    const exemption = Math.min(actualHra, rentMinusBasic, percentOfBasic);
    const taxableHra = hra - exemption;

    return { actualHra, rentMinusBasic, percentOfBasic, exemption, taxableHra };
  }, [basicSalary, hraReceived, rentPaid, isMetro]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>HRA Exemption</strong> is the minimum of: (a) Actual HRA received, (b) Rent paid - 10% of basic salary,
        (c) 50% of basic (metro) or 40% of basic (non-metro).
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Basic Salary (Annual) ₹</label>
          <input
            type="number"
            placeholder="e.g. 600000"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">HRA Received (Annual) ₹</label>
          <input
            type="number"
            placeholder="e.g. 240000"
            value={hraReceived}
            onChange={(e) => setHraReceived(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Rent Paid (Annual) ₹</label>
          <input
            type="number"
            placeholder="e.g. 300000"
            value={rentPaid}
            onChange={(e) => setRentPaid(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">City Type</label>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setIsMetro(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isMetro ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Metro (50%)
            </button>
            <button
              onClick={() => setIsMetro(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isMetro ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Non-Metro (40%)
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Metro: Delhi, Mumbai, Kolkata, Chennai</p>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <h3 className="text-sm font-bold text-gray-700 text-center mb-3">HRA Exemption Calculation</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">(a) Actual HRA Received</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.actualHra)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">(b) Rent Paid - 10% of Basic</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.rentMinusBasic)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">(c) {isMetro ? "50%" : "40%"} of Basic Salary</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.percentOfBasic)}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-indigo-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <div className="text-xs font-medium text-green-700 mb-1">HRA Exemption (Min of above)</div>
                <div className="text-3xl font-extrabold text-green-600">{fmt(result.exemption)}</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                <div className="text-xs font-medium text-red-700 mb-1">Taxable HRA</div>
                <div className="text-3xl font-extrabold text-red-500">{fmt(result.taxableHra)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
