"use client";
import { useState, useMemo } from "react";

interface BulkItem {
  id: number; name: string; price: string; qty: string; discount: string;
}

export default function AdvancedDiscountCalculator() {
  const [mode, setMode] = useState<"single" | "double" | "bulk">("single");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discount2, setDiscount2] = useState("");
  const [items, setItems] = useState<BulkItem[]>([{ id: 1, name: "", price: "", qty: "1", discount: "" }]);

  const QUICK = [10, 20, 30, 50, 70];

  const addItem = () => setItems([...items, { id: Date.now(), name: "", price: "", qty: "1", discount: "" }]);
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: number, field: keyof BulkItem, value: string) =>
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

  const singleResult = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (!p || p <= 0 || !d) return null;
    const saved = (p * d) / 100;
    const final_ = p - saved;
    return { saved, final: final_, original: p };
  }, [price, discount]);

  const doubleResult = useMemo(() => {
    const p = parseFloat(price);
    const d1 = parseFloat(discount);
    const d2 = parseFloat(discount2);
    if (!p || p <= 0 || !d1 || !d2) return null;
    const afterFirst = p - (p * d1) / 100;
    const afterSecond = afterFirst - (afterFirst * d2) / 100;
    const totalSaved = p - afterSecond;
    const effectiveDiscount = (totalSaved / p) * 100;
    // Compare: what if single discount equal to d1+d2?
    const naiveDiscount = d1 + d2;
    const naiveFinal = p - (p * naiveDiscount) / 100;
    return { afterFirst, afterSecond, totalSaved, effectiveDiscount, naiveDiscount, naiveFinal, original: p };
  }, [price, discount, discount2]);

  const bulkResult = useMemo(() => {
    const valid = items.filter(i => parseFloat(i.price) > 0 && parseInt(i.qty) > 0);
    if (valid.length === 0) return null;
    const rows = valid.map(i => {
      const p = parseFloat(i.price);
      const q = parseInt(i.qty);
      const d = parseFloat(i.discount) || 0;
      const subtotal = p * q;
      const discountAmt = (subtotal * d) / 100;
      const final_ = subtotal - discountAmt;
      return { ...i, subtotal, discountAmt, final: final_ };
    });
    const totalOriginal = rows.reduce((s, r) => s + r.subtotal, 0);
    const totalDiscount = rows.reduce((s, r) => s + r.discountAmt, 0);
    const totalFinal = rows.reduce((s, r) => s + r.final, 0);
    return { rows, totalOriginal, totalDiscount, totalFinal };
  }, [items]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {(["single", "double", "bulk"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === m ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            {m === "single" ? "Simple Discount" : m === "double" ? "Double Discount" : "Bulk / Multi-Item"}
          </button>
        ))}
      </div>

      {/* Single Discount */}
      {mode === "single" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Original Price (₹)</label>
              <input type="number" placeholder="e.g. 1999" value={price} onChange={e => setPrice(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Discount (%)</label>
              <input type="number" placeholder="e.g. 20" value={discount} onChange={e => setDiscount(e.target.value)} className="calc-input" />
              <div className="flex gap-2 mt-2">
                {QUICK.map(d => (
                  <button key={d} onClick={() => setDiscount(String(d))}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${discount === String(d) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{d}%</button>
                ))}
              </div>
            </div>
          </div>
          {singleResult && (
            <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Original Price</div>
                <div className="text-xl font-bold text-gray-400 line-through">{fmt(singleResult.original)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">You Save</div>
                <div className="text-xl font-bold text-green-600">{fmt(singleResult.saved)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Final Price</div>
                <div className="text-2xl font-extrabold text-indigo-600">{fmt(singleResult.final)}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Double Discount */}
      {mode === "double" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Original Price (₹)</label>
              <input type="number" placeholder="e.g. 5000" value={price} onChange={e => setPrice(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">First Discount (%)</label>
              <input type="number" placeholder="e.g. 30" value={discount} onChange={e => setDiscount(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Extra Discount (%)</label>
              <input type="number" placeholder="e.g. 20" value={discount2} onChange={e => setDiscount2(e.target.value)} className="calc-input" />
            </div>
          </div>
          {doubleResult && (
            <div className="space-y-4">
              <div className="result-card grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">After 1st Discount</div>
                  <div className="text-lg font-bold text-gray-600">{fmt(doubleResult.afterFirst)}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Final Price</div>
                  <div className="text-2xl font-extrabold text-indigo-600">{fmt(doubleResult.afterSecond)}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Total Savings</div>
                  <div className="text-xl font-bold text-green-600">{fmt(doubleResult.totalSaved)}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Effective Discount</div>
                  <div className="text-xl font-bold text-orange-600">{doubleResult.effectiveDiscount.toFixed(1)}%</div>
                </div>
              </div>
              <div className="result-card bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">Note:</span> A &ldquo;Flat {discount}% + Extra {discount2}%&rdquo; is NOT the same as {doubleResult.naiveDiscount}% off.
                  The effective discount is only <span className="font-bold">{doubleResult.effectiveDiscount.toFixed(1)}%</span>.
                  A straight {doubleResult.naiveDiscount}% off would give you {fmt(doubleResult.naiveFinal)} (saving you {fmt(doubleResult.original - doubleResult.naiveFinal)} more).
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Bulk Discount */}
      {mode === "bulk" && (
        <>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Item {idx + 1}</label>
                  <input type="text" placeholder="Name" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} className="calc-input" /></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Price (₹)</label>
                  <input type="number" placeholder="999" value={item.price} onChange={e => updateItem(item.id, "price", e.target.value)} className="calc-input" /></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Qty</label>
                  <input type="number" placeholder="1" value={item.qty} onChange={e => updateItem(item.id, "qty", e.target.value)} className="calc-input" /></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Discount %</label>
                  <input type="number" placeholder="0" value={item.discount} onChange={e => updateItem(item.id, "discount", e.target.value)} className="calc-input" /></div>
                <div>{items.length > 1 && <button onClick={() => removeItem(item.id)} className="btn-secondary text-xs w-full">Remove</button>}</div>
              </div>
            ))}
            <button onClick={addItem} className="btn-primary">+ Add Item</button>
          </div>
          {bulkResult && (
            <div className="result-card">
              <div className="table-responsive">
                <table>
                  <thead><tr><th>Item</th><th className="text-right">Subtotal</th><th className="text-right">Discount</th><th className="text-right">Final</th></tr></thead>
                  <tbody>
                    {bulkResult.rows.map(r => (
                      <tr key={r.id}><td>{r.name || "Item"}</td><td className="text-right">{fmt(r.subtotal)}</td><td className="text-right text-green-600">{fmt(r.discountAmt)}</td><td className="text-right font-semibold">{fmt(r.final)}</td></tr>
                    ))}
                    <tr className="font-bold bg-indigo-50 text-indigo-700">
                      <td>TOTAL</td><td className="text-right">{fmt(bulkResult.totalOriginal)}</td><td className="text-right text-green-600">{fmt(bulkResult.totalDiscount)}</td><td className="text-right">{fmt(bulkResult.totalFinal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
