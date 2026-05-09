"use client";
import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";

/**
 * GST Calculator — locale-aware labels (Phase 6 Round 2 Task B).
 * GST stays as जीएसटी (Devanagari transliteration) on Hindi —
 * that's how Indian users search for it. CGST / SGST also stay in
 * the standard Devanagari forms.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  amount: string;
  gstRate: string;
  calcType: string;
  exclusive: string;
  inclusive: string;
  baseAmount: string;
  totalAmount: string;
  enterAmount: string;
  cgst: string;
  sgst: string;
}> = {
  "en-IN": {
    amount: "Amount (₹)",
    gstRate: "GST Rate",
    calcType: "Calculation Type",
    exclusive: "GST Exclusive (Add GST)",
    inclusive: "GST Inclusive (Remove GST)",
    baseAmount: "Base Amount",
    totalAmount: "Total Amount",
    enterAmount: "Enter amount",
    cgst: "CGST",
    sgst: "SGST",
  },
  "hi-IN": {
    amount: "राशि (₹)",
    gstRate: "जीएसटी दर",
    calcType: "गणना का प्रकार",
    exclusive: "जीएसटी जोड़ें (Exclusive)",
    inclusive: "जीएसटी हटाएँ (Inclusive)",
    baseAmount: "मूल राशि",
    totalAmount: "कुल राशि",
    enterAmount: "राशि दर्ज करें",
    cgst: "सीजीएसटी",
    sgst: "एसजीएसटी",
  },
};

export default function GstCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [amount, setAmount] = useUrlState<string>("a", "");
  const [gstRate, setGstRate] = useUrlState("r", 18);
  const [type, setType] = useUrlState<string>("t", "exclusive");

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return null;
    if (type === "exclusive") {
      const gst = (amt * gstRate) / 100;
      const cgst = gst / 2;
      const sgst = gst / 2;
      return { originalAmount: amt, gstAmount: gst, cgst, sgst, totalAmount: amt + gst };
    } else {
      const originalAmount = (amt * 100) / (100 + gstRate);
      const gst = amt - originalAmount;
      return { originalAmount, gstAmount: gst, cgst: gst / 2, sgst: gst / 2, totalAmount: amt };
    }
  }, [amount, gstRate, type]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.amount}</label>
          <input type="number" placeholder={t.enterAmount} value={amount} onChange={(e) => setAmount(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.gstRate}</label>
          <div className="flex gap-2">
            {[5, 12, 18, 28].map((r) => (
              <button key={r} onClick={() => setGstRate(r)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${gstRate === r ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {r}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">{t.calcType}</label>
        <div className="flex gap-3">
          <button onClick={() => setType("exclusive")} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${type === "exclusive" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {t.exclusive}
          </button>
          <button onClick={() => setType("inclusive")} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${type === "inclusive" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {t.inclusive}
          </button>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.baseAmount}</div>
              <div className="text-lg font-bold text-gray-800">{fmt(result.originalAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.cgst} ({gstRate / 2}%)</div>
              <div className="text-lg font-bold text-orange-600">{fmt(result.cgst)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.sgst} ({gstRate / 2}%)</div>
              <div className="text-lg font-bold text-orange-600">{fmt(result.sgst)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.totalAmount}</div>
              <div className="text-lg font-bold text-indigo-600">{fmt(result.totalAmount)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
