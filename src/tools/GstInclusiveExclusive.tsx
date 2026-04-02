"use client";
import { useState, useMemo } from "react";

const GST_RATES = [5, 12, 18, 28];

const HSN_REFERENCE = [
  { code: "0401-0406", item: "Milk, Curd, Paneer", rate: 5 },
  { code: "1001-1008", item: "Wheat, Rice, Grains", rate: 5 },
  { code: "3304", item: "Beauty / Cosmetics", rate: 18 },
  { code: "3926", item: "Plastic Products", rate: 18 },
  { code: "6101-6117", item: "Readymade Garments (above ₹1000)", rate: 12 },
  { code: "7113", item: "Gold / Silver Jewellery", rate: 3 },
  { code: "8471", item: "Laptops / Computers", rate: 18 },
  { code: "8517", item: "Mobile Phones", rate: 12 },
  { code: "8703", item: "Cars / Motor Vehicles", rate: 28 },
  { code: "9401-9404", item: "Furniture", rate: 18 },
  { code: "9801", item: "Restaurant Food (AC)", rate: 18 },
  { code: "9801", item: "Restaurant Food (Non-AC)", rate: 5 },
  { code: "9954", item: "Construction Services", rate: 12 },
  { code: "9971", item: "Financial Services / Insurance", rate: 18 },
  { code: "9972", item: "Rental of Motor Vehicles", rate: 12 },
  { code: "9973", item: "Repair & Maintenance", rate: 18 },
  { code: "9985", item: "Telecom Services", rate: 18 },
  { code: "9988", item: "Courier Services", rate: 18 },
];

export default function GstInclusiveExclusive() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [isIGST, setIsIGST] = useState(false);

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    const rate = parseFloat(gstRate);
    if (!amt || amt <= 0 || !rate) return null;

    if (mode === "add") {
      // Add GST to amount
      const gstAmount = (amt * rate) / 100;
      const totalAmount = amt + gstAmount;
      const cgst = isIGST ? 0 : gstAmount / 2;
      const sgst = isIGST ? 0 : gstAmount / 2;
      const igst = isIGST ? gstAmount : 0;
      return { baseAmount: amt, gstAmount, totalAmount, cgst, sgst, igst, rate };
    } else {
      // Remove GST from amount (amount is GST-inclusive)
      const baseAmount = (amt * 100) / (100 + rate);
      const gstAmount = amt - baseAmount;
      const cgst = isIGST ? 0 : gstAmount / 2;
      const sgst = isIGST ? 0 : gstAmount / 2;
      const igst = isIGST ? gstAmount : 0;
      return { baseAmount, gstAmount, totalAmount: amt, cgst, sgst, igst, rate };
    }
  }, [amount, gstRate, mode, isIGST]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex gap-2">
        <button onClick={() => setMode("add")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${mode === "add" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Add GST (Exclusive to Inclusive)
        </button>
        <button onClick={() => setMode("remove")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${mode === "remove" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Remove GST (Inclusive to Exclusive)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            {mode === "add" ? "Amount (Excluding GST)" : "Amount (Including GST)"} (₹)
          </label>
          <input type="number" placeholder="e.g. 10000" value={amount} onChange={e => setAmount(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">GST Rate (%)</label>
          <input type="number" placeholder="18" value={gstRate} onChange={e => setGstRate(e.target.value)} className="calc-input" />
          <div className="flex gap-2 mt-2">
            {GST_RATES.map(r => (
              <button key={r} onClick={() => setGstRate(String(r))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${gstRate === String(r) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{r}%</button>
            ))}
          </div>
        </div>
      </div>

      {/* IGST toggle */}
      <div className="flex gap-2">
        <button onClick={() => setIsIGST(false)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!isIGST ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          CGST + SGST (Intra-State)
        </button>
        <button onClick={() => setIsIGST(true)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${isIGST ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          IGST (Inter-State)
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Results */}
          <div className="result-card grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Base Amount</div>
              <div className="text-xl font-bold text-gray-700">{fmt(result.baseAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">GST Amount ({result.rate}%)</div>
              <div className="text-xl font-bold text-orange-600">{fmt(result.gstAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm sm:col-span-1 col-span-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Amount</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.totalAmount)}</div>
            </div>
          </div>

          {/* GST Breakdown */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">GST Breakdown</h3>
            <div className="table-responsive">
              <table>
                <thead><tr><th>Component</th><th className="text-right">Rate</th><th className="text-right">Amount</th></tr></thead>
                <tbody>
                  {isIGST ? (
                    <tr><td>IGST</td><td className="text-right">{result.rate}%</td><td className="text-right font-semibold">{fmt(result.igst)}</td></tr>
                  ) : (
                    <>
                      <tr><td>CGST</td><td className="text-right">{result.rate / 2}%</td><td className="text-right">{fmt(result.cgst)}</td></tr>
                      <tr><td>SGST</td><td className="text-right">{result.rate / 2}%</td><td className="text-right">{fmt(result.sgst)}</td></tr>
                    </>
                  )}
                  <tr className="font-bold bg-gray-50"><td>Total GST</td><td className="text-right">{result.rate}%</td><td className="text-right text-orange-600">{fmt(result.gstAmount)}</td></tr>
                  <tr className="font-bold bg-indigo-50 text-indigo-700"><td>Grand Total</td><td></td><td className="text-right">{fmt(result.totalAmount)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* HSN Reference */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Common HSN Codes & GST Rates</h3>
            <div className="table-responsive">
              <table>
                <thead><tr><th>HSN Code</th><th>Item / Service</th><th className="text-right">GST Rate</th></tr></thead>
                <tbody>
                  {HSN_REFERENCE.map((h, i) => (
                    <tr key={i} className={h.rate === parseFloat(gstRate) ? "bg-indigo-50 font-medium" : ""}>
                      <td className="text-sm">{h.code}</td><td className="text-sm">{h.item}</td><td className="text-right text-sm font-semibold">{h.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
