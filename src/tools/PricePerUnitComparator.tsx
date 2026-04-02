"use client";
import { useState, useMemo } from "react";

interface Product {
  id: number; name: string; price: string; quantity: string; unit: string;
}

const UNITS = [
  { value: "g", label: "Grams (g)", base: "g", factor: 1 },
  { value: "kg", label: "Kilograms (kg)", base: "g", factor: 1000 },
  { value: "ml", label: "Millilitres (ml)", base: "ml", factor: 1 },
  { value: "L", label: "Litres (L)", base: "ml", factor: 1000 },
  { value: "pieces", label: "Pieces", base: "pieces", factor: 1 },
];

export default function PricePerUnitComparator() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Product A", price: "", quantity: "", unit: "g" },
    { id: 2, name: "Product B", price: "", quantity: "", unit: "g" },
  ]);

  const addProduct = () => setProducts([...products, { id: Date.now(), name: `Product ${String.fromCharCode(65 + products.length)}`, price: "", quantity: "", unit: "g" }]);
  const removeProduct = (id: number) => setProducts(products.filter(p => p.id !== id));
  const updateProduct = (id: number, field: keyof Product, value: string) =>
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));

  const result = useMemo(() => {
    const valid = products.filter(p => parseFloat(p.price) > 0 && parseFloat(p.quantity) > 0);
    if (valid.length < 2) return null;

    const calculated = valid.map(p => {
      const price = parseFloat(p.price);
      const qty = parseFloat(p.quantity);
      const unitInfo = UNITS.find(u => u.value === p.unit)!;
      const baseQty = qty * unitInfo.factor;
      const pricePerUnit = price / baseQty;
      const baseLabel = unitInfo.base === "g" ? "per gram" : unitInfo.base === "ml" ? "per ml" : "per piece";
      const displayPricePerKg = unitInfo.base === "g" ? pricePerUnit * 1000 : unitInfo.base === "ml" ? pricePerUnit * 1000 : pricePerUnit;
      const displayLabel = unitInfo.base === "g" ? "per kg" : unitInfo.base === "ml" ? "per litre" : "per piece";
      return { ...p, price, qty, baseQty, pricePerUnit, baseLabel, displayPricePerKg, displayLabel };
    });

    // Only compare within same base unit
    const groups: Record<string, typeof calculated> = {};
    for (const c of calculated) {
      const base = UNITS.find(u => u.value === c.unit)!.base;
      if (!groups[base]) groups[base] = [];
      groups[base].push(c);
    }

    const comparisons = Object.entries(groups).filter(([, items]) => items.length >= 2).map(([base, items]) => {
      const sorted = [...items].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
      const cheapest = sorted[0];
      const mostExpensive = sorted[sorted.length - 1];
      const savingsPercent = ((mostExpensive.pricePerUnit - cheapest.pricePerUnit) / mostExpensive.pricePerUnit) * 100;
      return { base, items: sorted, cheapest, mostExpensive, savingsPercent };
    });

    return { calculated, comparisons };
  }, [products]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      {/* Product entries */}
      {products.map((p, idx) => (
        <div key={p.id} className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Product {idx + 1}</label>
            <input type="text" placeholder="Name" value={p.name} onChange={e => updateProduct(p.id, "name", e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Price (₹)</label>
            <input type="number" placeholder="e.g. 120" value={p.price} onChange={e => updateProduct(p.id, "price", e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Quantity</label>
            <input type="number" placeholder="e.g. 500" value={p.quantity} onChange={e => updateProduct(p.id, "quantity", e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Unit</label>
            <select value={p.unit} onChange={e => updateProduct(p.id, "unit", e.target.value)} className="calc-input">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <div>{products.length > 2 && <button onClick={() => removeProduct(p.id)} className="btn-secondary text-xs w-full">Remove</button>}</div>
        </div>
      ))}

      <button onClick={addProduct} className="btn-primary">+ Add Product</button>

      {result && (
        <div className="space-y-4">
          {/* Comparison results */}
          {result.comparisons.map(comp => (
            <div key={comp.base} className="space-y-4">
              {/* Winner */}
              <div className="result-card text-center bg-green-50">
                <div className="text-sm text-green-600 font-medium">Best Value</div>
                <div className="text-2xl font-extrabold text-green-700">{comp.cheapest.name}</div>
                <div className="text-sm text-green-600 mt-1">
                  {fmt(comp.cheapest.displayPricePerKg)} {comp.cheapest.displayLabel}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  You save <span className="font-bold">{comp.savingsPercent.toFixed(1)}%</span> compared to the most expensive option
                </div>
              </div>

              {/* All products table */}
              <div className="result-card">
                <h3 className="font-bold text-gray-800 mb-3">Price Per Unit Comparison</h3>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr><th>Product</th><th className="text-right">Price</th><th className="text-right">Qty</th><th className="text-right">Price / Unit</th><th className="text-right">vs Cheapest</th></tr>
                    </thead>
                    <tbody>
                      {comp.items.map((item, i) => {
                        const diff = item.pricePerUnit - comp.cheapest.pricePerUnit;
                        const diffPercent = comp.cheapest.pricePerUnit > 0 ? (diff / comp.cheapest.pricePerUnit) * 100 : 0;
                        return (
                          <tr key={item.id} className={i === 0 ? "bg-green-50 font-semibold" : ""}>
                            <td className="flex items-center gap-2">
                              {i === 0 && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Best</span>}
                              {item.name}
                            </td>
                            <td className="text-right">{fmt(item.price)}</td>
                            <td className="text-right">{item.qty} {item.unit}</td>
                            <td className="text-right font-semibold">{fmt(item.displayPricePerKg)} {item.displayLabel}</td>
                            <td className={`text-right ${i === 0 ? "text-green-600" : "text-red-600"}`}>
                              {i === 0 ? "Cheapest" : `+${diffPercent.toFixed(1)}%`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Savings amount */}
              {comp.items.length >= 2 && (
                <div className="result-card">
                  <h3 className="font-bold text-gray-800 mb-3">Savings if You Pick the Best Value</h3>
                  {comp.items.slice(1).map(item => {
                    const savingsPerUnit = item.pricePerUnit - comp.cheapest.pricePerUnit;
                    const cheapestQtyInBase = comp.cheapest.qty * (UNITS.find(u => u.value === comp.cheapest.unit)?.factor || 1);
                    const savingsForSameQty = savingsPerUnit * cheapestQtyInBase;
                    return (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="text-sm text-gray-700">vs {item.name}</span>
                        <span className="font-semibold text-green-600">Save {fmt(Math.abs(savingsForSameQty))} per equivalent quantity</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
