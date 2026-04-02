"use client";
import { useState, useMemo } from "react";

const TIP_PRESETS = [5, 10, 15, 20];

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState("10");
  const [people, setPeople] = useState("1");

  const result = useMemo(() => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent);
    const p = parseInt(people) || 1;
    if (!b || b <= 0 || t < 0 || p <= 0) return null;
    const tipAmount = (b * t) / 100;
    const totalBill = b + tipAmount;
    const perPerson = totalBill / p;
    const tipPerPerson = tipAmount / p;
    return { tipAmount, totalBill, perPerson, tipPerPerson };
  }, [bill, tipPercent, people]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Bill Amount ({"\u20B9"})</label>
          <input
            type="number"
            placeholder="e.g. 1500"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tip Percentage (%)</label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
            className="calc-input"
          />
          <div className="flex gap-2 mt-2">
            {TIP_PRESETS.map((t) => (
              <button
                key={t}
                onClick={() => setTipPercent(String(t))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  tipPercent === String(t) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Number of People</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPeople(String(Math.max(1, (parseInt(people) || 1) - 1)))}
            className="btn-secondary !px-4 !py-2"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="calc-input !w-20 text-center"
          />
          <button
            onClick={() => setPeople(String((parseInt(people) || 1) + 1))}
            className="btn-secondary !px-4 !py-2"
          >
            +
          </button>
        </div>
      </div>

      {result && (
        <div className="result-card grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Tip Amount</div>
            <div className="text-xl font-extrabold text-green-600">{fmt(result.tipAmount)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Bill</div>
            <div className="text-xl font-extrabold text-indigo-600">{fmt(result.totalBill)}</div>
          </div>
          {parseInt(people) > 1 && (
            <>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Tip per Person</div>
                <div className="text-xl font-extrabold text-green-500">{fmt(result.tipPerPerson)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Per Person</div>
                <div className="text-2xl font-extrabold text-indigo-700">{fmt(result.perPerson)}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
