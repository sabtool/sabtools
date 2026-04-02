"use client";
import { useState, useMemo } from "react";

const TDS_TYPES = [
  { label: "Salary (Sec 192)", key: "salary", rate: 10, description: "TDS on salary as per income tax slab" },
  { label: "Rent > ₹50,000/month (Sec 194-IB)", key: "rent", rate: 5, description: "TDS on rent exceeding ₹50,000/month" },
  { label: "Interest on FD (Sec 194A)", key: "interest", rate: 10, description: "TDS on interest income exceeding ₹40,000" },
  { label: "Professional Fees (Sec 194J)", key: "professional", rate: 10, description: "TDS on professional/technical services" },
  { label: "Commission (Sec 194H)", key: "commission", rate: 5, description: "TDS on commission or brokerage" },
  { label: "Contractor Payment (Sec 194C)", key: "contractor", rate: 1, description: "TDS on contractor payments (Individual)" },
  { label: "Contractor - Company (Sec 194C)", key: "contractor_co", rate: 2, description: "TDS on contractor payments (Company)" },
  { label: "Property Sale (Sec 194-IA)", key: "property", rate: 1, description: "TDS on property sale above ₹50 lakh" },
];

export default function TdsCalculator() {
  const [selectedType, setSelectedType] = useState("salary");
  const [amount, setAmount] = useState("");
  const [hasPan, setHasPan] = useState(true);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const currentType = TDS_TYPES.find((t) => t.key === selectedType)!;

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return null;

    const rate = hasPan ? currentType.rate : 20; // 20% if no PAN
    const tdsAmount = (amt * rate) / 100;
    const netAmount = amt - tdsAmount;

    return { tdsAmount, netAmount, rate };
  }, [amount, selectedType, hasPan, currentType]);

  return (
    <div className="space-y-6">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-800">
        <strong>TDS (Tax Deducted at Source)</strong> is deducted by the payer at the time of payment. If PAN is not
        provided, TDS is deducted at 20%.
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">TDS Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TDS_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedType(t.key)}
              className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${
                selectedType === t.key
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">{t.label}</div>
              <div className="text-xs mt-0.5 opacity-75">Rate: {t.rate}%</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Payment Amount ₹</label>
          <input
            type="number"
            placeholder="e.g. 500000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">PAN Available?</label>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setHasPan(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                hasPan ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Yes (Normal Rate)
            </button>
            <button
              onClick={() => setHasPan(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !hasPan ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              No (20% TDS)
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <strong>{currentType.label}:</strong> {currentType.description}
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Payment Amount</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(parseFloat(amount))}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">TDS Deducted ({result.rate}%)</div>
              <div className="text-2xl font-extrabold text-red-500">{fmt(result.tdsAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Net Amount Received</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.netAmount)}</div>
            </div>
          </div>
          <div>
            <div className="h-4 rounded-full bg-red-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${(result.netAmount / parseFloat(amount)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span className="text-green-600">Net Amount ({((result.netAmount / parseFloat(amount)) * 100).toFixed(1)}%)</span>
              <span className="text-red-500">TDS ({result.rate}%)</span>
            </div>
          </div>
          {!hasPan && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
              Higher TDS of 20% applied due to non-availability of PAN (Section 206AA)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
