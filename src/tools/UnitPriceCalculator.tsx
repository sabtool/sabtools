"use client";
import { useState, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  quantity: string;
  unit: string;
}

const UNITS = [
  { value: "kg", label: "Kilogram (kg)", base: 1000 },
  { value: "g", label: "Gram (g)", base: 1 },
  { value: "L", label: "Liter (L)", base: 1000 },
  { value: "ml", label: "Milliliter (ml)", base: 1 },
  { value: "pcs", label: "Pieces", base: 1 },
];

const getBaseGrams = (quantity: number, unit: string) => {
  const u = UNITS.find((u) => u.value === unit);
  if (!u) return quantity;
  return quantity * u.base;
};

const getBaseUnitLabel = (unit: string) => {
  if (unit === "kg" || unit === "g") return "per kg";
  if (unit === "L" || unit === "ml") return "per L";
  return "per piece";
};

const getBaseMultiplier = (unit: string) => {
  if (unit === "kg" || unit === "g") return 1000;
  if (unit === "L" || unit === "ml") return 1000;
  return 1;
};

let nextId = 3;

export default function UnitPriceCalculator() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Product A", price: "", quantity: "", unit: "kg" },
    { id: 2, name: "Product B", price: "", quantity: "", unit: "kg" },
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  const addProduct = () => {
    if (products.length >= 4) return;
    setProducts([...products, { id: nextId++, name: `Product ${String.fromCharCode(65 + products.length)}`, price: "", quantity: "", unit: "kg" }]);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 2) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(products.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const results = useMemo(() => {
    const calculated = products.map((p) => {
      const price = parseFloat(p.price);
      const qty = parseFloat(p.quantity);
      if (!price || !qty || price <= 0 || qty <= 0) return { ...p, pricePerBase: null, pricePerUnit: null };

      const baseUnits = getBaseGrams(qty, p.unit);
      const pricePerUnit = price / baseUnits;
      const multiplier = getBaseMultiplier(p.unit);
      const pricePerBase = pricePerUnit * multiplier;

      return { ...p, pricePerBase, pricePerUnit };
    });

    const validResults = calculated.filter((r) => r.pricePerBase !== null);

    if (validResults.length < 2) return { items: calculated, bestIndex: -1, savings: 0 };

    let bestIndex = -1;
    let bestPrice = Infinity;
    let worstPrice = 0;

    validResults.forEach((r) => {
      if (r.pricePerBase !== null && r.pricePerBase < bestPrice) {
        bestPrice = r.pricePerBase;
        bestIndex = calculated.indexOf(r);
      }
      if (r.pricePerBase !== null && r.pricePerBase > worstPrice) {
        worstPrice = r.pricePerBase;
      }
    });

    const savings = worstPrice > 0 ? ((worstPrice - bestPrice) / worstPrice) * 100 : 0;

    return { items: calculated, bestIndex, savings };
  }, [products]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Compare prices of different products or pack sizes to find the best value for your money.</p>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className={`bg-white border rounded-xl p-4 space-y-3 ${results.bestIndex === index ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"}`}>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={product.name}
                onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                className="text-sm font-bold text-gray-800 bg-transparent border-none outline-none"
              />
              <div className="flex items-center gap-2">
                {results.bestIndex === index && (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">BEST VALUE</span>
                )}
                {products.length > 2 && (
                  <button onClick={() => removeProduct(product.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
                <input type="number" placeholder="0" value={product.price}
                  onChange={(e) => updateProduct(product.id, "price", e.target.value)} className="calc-input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                <input type="number" placeholder="0" value={product.quantity}
                  onChange={(e) => updateProduct(product.id, "quantity", e.target.value)} className="calc-input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                <select value={product.unit} onChange={(e) => updateProduct(product.id, "unit", e.target.value)} className="calc-input">
                  {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
            </div>

            {results.items[index]?.pricePerBase !== null && (
              <div className={`text-center py-2 rounded-lg ${results.bestIndex === index ? "bg-green-50" : "bg-gray-50"}`}>
                <span className="text-xs text-gray-500">Unit Price: </span>
                <span className={`text-lg font-extrabold ${results.bestIndex === index ? "text-green-600" : "text-indigo-600"}`}>
                  {fmt(results.items[index].pricePerBase!)}
                </span>
                <span className="text-xs text-gray-500 ml-1">{getBaseUnitLabel(product.unit)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length < 4 && (
        <button onClick={addProduct} className="btn-secondary w-full">+ Add Product</button>
      )}

      {results.bestIndex >= 0 && results.savings > 0 && (
        <div className="result-card">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-green-700">
              {products[results.bestIndex].name} is the Best Value!
            </h3>
            <div className="text-3xl font-extrabold text-green-600">
              {results.savings.toFixed(1)}% Cheaper
            </div>
            <p className="text-sm text-gray-500">compared to the most expensive option</p>
          </div>

          {/* Comparison bars */}
          <div className="mt-4 space-y-2">
            {results.items
              .filter((item) => item.pricePerBase !== null)
              .sort((a, b) => (a.pricePerBase || 0) - (b.pricePerBase || 0))
              .map((item, i) => {
                const maxPrice = Math.max(...results.items.filter((x) => x.pricePerBase !== null).map((x) => x.pricePerBase!));
                const width = maxPrice > 0 ? ((item.pricePerBase! / maxPrice) * 100) : 0;
                const isBest = products.indexOf(item as Product) === results.bestIndex;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-600 w-20 truncate">{item.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isBest ? "bg-green-500" : "bg-indigo-400"}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-24 text-right">
                      {fmt(item.pricePerBase!)} {getBaseUnitLabel(item.unit)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
        <strong>Tip:</strong> When comparing products at a grocery store, always check the price per unit (kg/L) rather than the total price. Larger packs are not always cheaper per unit!
      </div>
    </div>
  );
}
