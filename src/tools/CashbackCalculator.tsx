"use client";
import { useState, useMemo } from "react";

interface Offer {
  id: number;
  platform: string;
  cashbackType: "percent" | "flat";
  cashbackValue: string;
  maxCashback: string;
}

const PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Meesho", "Ajio", "Nykaa", "Swiggy", "Zomato", "PhonePe", "Paytm", "Other"];

export default function CashbackCalculator() {
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [amount, setAmount] = useState("");

  // Single mode
  const [cashbackType, setCashbackType] = useState<"percent" | "flat">("percent");
  const [cashbackValue, setCashbackValue] = useState("");
  const [maxCashback, setMaxCashback] = useState("");

  // Compare mode
  const [offers, setOffers] = useState<Offer[]>([
    { id: 1, platform: "Amazon", cashbackType: "percent", cashbackValue: "", maxCashback: "" },
    { id: 2, platform: "Flipkart", cashbackType: "percent", cashbackValue: "", maxCashback: "" },
  ]);

  const addOffer = () => setOffers([...offers, { id: Date.now(), platform: PLATFORMS[offers.length % PLATFORMS.length], cashbackType: "percent", cashbackValue: "", maxCashback: "" }]);
  const removeOffer = (id: number) => setOffers(offers.filter(o => o.id !== id));
  const updateOffer = (id: number, field: keyof Offer, value: string) =>
    setOffers(offers.map(o => o.id === id ? { ...o, [field]: value } : o));

  const calcCashback = (amt: number, type: "percent" | "flat", value: number, max: number) => {
    let cb = type === "percent" ? (amt * value) / 100 : value;
    if (max > 0) cb = Math.min(cb, max);
    const effectiveDiscount = (cb / amt) * 100;
    const effectivePrice = amt - cb;
    return { cashback: cb, effectiveDiscount, effectivePrice };
  };

  const singleResult = useMemo(() => {
    const amt = parseFloat(amount);
    const val = parseFloat(cashbackValue);
    if (!amt || amt <= 0 || !val || val <= 0) return null;
    const max = parseFloat(maxCashback) || 0;
    return calcCashback(amt, cashbackType, val, max);
  }, [amount, cashbackType, cashbackValue, maxCashback]);

  const compareResult = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return null;
    const calculated = offers.filter(o => parseFloat(o.cashbackValue) > 0).map(o => {
      const val = parseFloat(o.cashbackValue);
      const max = parseFloat(o.maxCashback) || 0;
      const result = calcCashback(amt, o.cashbackType, val, max);
      return { ...o, ...result };
    });
    if (calculated.length < 2) return null;
    const sorted = [...calculated].sort((a, b) => b.cashback - a.cashback);
    return { offers: sorted, best: sorted[0] };
  }, [amount, offers]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex gap-2">
        <button onClick={() => setMode("single")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "single" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Single Offer
        </button>
        <button onClick={() => setMode("compare")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "compare" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Compare Offers
        </button>
      </div>

      {/* Purchase amount */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Purchase Amount (₹)</label>
        <input type="number" placeholder="e.g. 5000" value={amount} onChange={e => setAmount(e.target.value)} className="calc-input" />
      </div>

      {/* Single mode */}
      {mode === "single" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Cashback Type</label>
              <div className="flex gap-2">
                <button onClick={() => setCashbackType("percent")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${cashbackType === "percent" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>% Cashback</button>
                <button onClick={() => setCashbackType("flat")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${cashbackType === "flat" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>Flat Cashback</button>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                {cashbackType === "percent" ? "Cashback %" : "Cashback Amount (₹)"}
              </label>
              <input type="number" placeholder={cashbackType === "percent" ? "e.g. 10" : "e.g. 200"} value={cashbackValue} onChange={e => setCashbackValue(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Max Cashback Cap (₹)</label>
              <input type="number" placeholder="e.g. 500 (0 = no cap)" value={maxCashback} onChange={e => setMaxCashback(e.target.value)} className="calc-input" />
            </div>
          </div>
          {singleResult && (
            <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Cashback Earned</div>
                <div className="text-2xl font-extrabold text-green-600">{fmt(singleResult.cashback)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Effective Discount</div>
                <div className="text-xl font-bold text-orange-600">{singleResult.effectiveDiscount.toFixed(2)}%</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Effective Price</div>
                <div className="text-2xl font-extrabold text-indigo-600">{fmt(singleResult.effectivePrice)}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Compare mode */}
      {mode === "compare" && (
        <>
          <div className="space-y-3">
            {offers.map((offer, idx) => (
              <div key={offer.id} className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Platform {idx + 1}</label>
                  <select value={offer.platform} onChange={e => updateOffer(offer.id, "platform", e.target.value)} className="calc-input">
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Type</label>
                  <select value={offer.cashbackType} onChange={e => updateOffer(offer.id, "cashbackType", e.target.value)} className="calc-input">
                    <option value="percent">% Cashback</option>
                    <option value="flat">Flat ₹</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{offer.cashbackType === "percent" ? "Cashback %" : "Flat Amount"}</label>
                  <input type="number" placeholder={offer.cashbackType === "percent" ? "10" : "200"} value={offer.cashbackValue} onChange={e => updateOffer(offer.id, "cashbackValue", e.target.value)} className="calc-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Max Cap (₹)</label>
                  <input type="number" placeholder="0 = no cap" value={offer.maxCashback} onChange={e => updateOffer(offer.id, "maxCashback", e.target.value)} className="calc-input" />
                </div>
                <div>{offers.length > 2 && <button onClick={() => removeOffer(offer.id)} className="btn-secondary text-xs w-full">Remove</button>}</div>
              </div>
            ))}
            <button onClick={addOffer} className="btn-primary">+ Add Offer</button>
          </div>

          {compareResult && (
            <div className="space-y-4">
              {/* Winner */}
              <div className="result-card text-center bg-green-50">
                <div className="text-sm text-green-600 font-medium">Best Cashback</div>
                <div className="text-2xl font-extrabold text-green-700">{compareResult.best.platform}</div>
                <div className="text-lg text-green-600 mt-1">
                  {fmt(compareResult.best.cashback)} cashback ({compareResult.best.effectiveDiscount.toFixed(2)}% effective discount)
                </div>
              </div>

              {/* Comparison table */}
              <div className="result-card">
                <h3 className="font-bold text-gray-800 mb-3">Offer Comparison</h3>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr><th>Platform</th><th className="text-right">Offer</th><th className="text-right">Cashback</th><th className="text-right">Eff. Discount</th><th className="text-right">Eff. Price</th></tr>
                    </thead>
                    <tbody>
                      {compareResult.offers.map((o, i) => (
                        <tr key={o.id} className={i === 0 ? "bg-green-50 font-semibold" : ""}>
                          <td className="flex items-center gap-2">
                            {i === 0 && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Best</span>}
                            {o.platform}
                          </td>
                          <td className="text-right text-sm">
                            {o.cashbackType === "percent" ? `${o.cashbackValue}%` : `Flat ${fmt(parseFloat(o.cashbackValue))}`}
                            {parseFloat(o.maxCashback) > 0 ? ` (max ${fmt(parseFloat(o.maxCashback))})` : ""}
                          </td>
                          <td className="text-right text-green-600 font-semibold">{fmt(o.cashback)}</td>
                          <td className="text-right">{o.effectiveDiscount.toFixed(2)}%</td>
                          <td className="text-right font-semibold text-indigo-600">{fmt(o.effectivePrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
