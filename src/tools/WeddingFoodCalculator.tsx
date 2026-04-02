"use client";
import { useState, useMemo } from "react";

interface FoodItem {
  id: string;
  name: string;
  perPerson: number; // grams or ml
  unit: string;
  pricePerKg: number;
  enabled: boolean;
  category: "main" | "side" | "drink" | "dessert";
}

const DEFAULT_ITEMS: FoodItem[] = [
  { id: "rice", name: "Rice (Biryani/Pulao)", perPerson: 80, unit: "g", pricePerKg: 80, enabled: true, category: "main" },
  { id: "dal", name: "Dal (Lentils)", perPerson: 40, unit: "g", pricePerKg: 120, enabled: true, category: "main" },
  { id: "sabzi1", name: "Sabzi / Curry 1", perPerson: 100, unit: "g", pricePerKg: 150, enabled: true, category: "main" },
  { id: "sabzi2", name: "Sabzi / Curry 2", perPerson: 80, unit: "g", pricePerKg: 150, enabled: true, category: "main" },
  { id: "roti", name: "Roti / Naan", perPerson: 3, unit: "pcs", pricePerKg: 10, enabled: true, category: "main" },
  { id: "paneer", name: "Paneer Dish", perPerson: 60, unit: "g", pricePerKg: 350, enabled: true, category: "main" },
  { id: "chicken", name: "Chicken Curry", perPerson: 120, unit: "g", pricePerKg: 280, enabled: false, category: "main" },
  { id: "mutton", name: "Mutton Curry", perPerson: 100, unit: "g", pricePerKg: 700, enabled: false, category: "main" },
  { id: "dessert", name: "Dessert (Gulab Jamun/Kheer)", perPerson: 60, unit: "g", pricePerKg: 250, enabled: true, category: "dessert" },
  { id: "icecream", name: "Ice Cream", perPerson: 80, unit: "ml", pricePerKg: 300, enabled: false, category: "dessert" },
  { id: "salad", name: "Salad", perPerson: 50, unit: "g", pricePerKg: 60, enabled: true, category: "side" },
  { id: "raita", name: "Raita", perPerson: 30, unit: "g", pricePerKg: 80, enabled: true, category: "side" },
  { id: "papad", name: "Papad", perPerson: 2, unit: "pcs", pricePerKg: 5, enabled: true, category: "side" },
  { id: "pickle", name: "Pickle / Chutney", perPerson: 10, unit: "g", pricePerKg: 200, enabled: true, category: "side" },
  { id: "drinks", name: "Soft Drinks / Juice", perPerson: 300, unit: "ml", pricePerKg: 40, enabled: true, category: "drink" },
  { id: "water", name: "Bottled Water", perPerson: 500, unit: "ml", pricePerKg: 10, enabled: true, category: "drink" },
  { id: "lassi", name: "Lassi / Buttermilk", perPerson: 200, unit: "ml", pricePerKg: 50, enabled: false, category: "drink" },
];

type MealType = "veg" | "nonveg" | "both";

export default function WeddingFoodCalculator() {
  const [guests, setGuests] = useState(200);
  const [mealType, setMealType] = useState<MealType>("veg");
  const [items, setItems] = useState<FoodItem[]>(DEFAULT_ITEMS);

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  };

  const updateQty = (id: string, perPerson: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, perPerson } : item)));
  };

  const updatePrice = (id: string, pricePerKg: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, pricePerKg } : item)));
  };

  const activeItems = useMemo(() => {
    let filtered = items.filter((i) => i.enabled);
    if (mealType === "veg") filtered = filtered.filter((i) => !["chicken", "mutton"].includes(i.id));
    return filtered;
  }, [items, mealType]);

  const calculations = useMemo(() => {
    return activeItems.map((item) => {
      const totalQty = item.perPerson * guests;
      const isCount = item.unit === "pcs";
      const totalKg = isCount ? totalQty : totalQty / 1000;
      const totalDisplay = isCount ? totalQty : totalKg;
      const displayUnit = isCount ? "pcs" : item.unit === "ml" ? "liters" : "kg";
      const cost = isCount ? item.pricePerKg * totalQty : item.pricePerKg * totalKg;
      return { ...item, totalQty, totalKg, totalDisplay: isCount ? totalDisplay : parseFloat(totalDisplay.toFixed(1)), displayUnit, cost };
    });
  }, [activeItems, guests]);

  const totalCost = useMemo(() => calculations.reduce((sum, c) => sum + c.cost, 0), [calculations]);
  const perPlateCost = guests > 0 ? totalCost / guests : 0;

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Number of Guests</label>
          <input className="calc-input" type="number" min={10} value={guests} onChange={(e) => setGuests(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Meal Type</label>
          <select className="calc-input" value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
            <option value="both">Both (Veg + Non-Veg)</option>
          </select>
        </div>
      </div>

      {/* Items */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">Food Items (click to toggle, edit quantities)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 text-gray-600">Item</th>
                <th className="text-center p-2 text-gray-600">Per Person</th>
                <th className="text-center p-2 text-gray-600">Price/kg</th>
                <th className="text-right p-2 text-gray-600">Total Qty</th>
                <th className="text-right p-2 text-gray-600">Cost</th>
              </tr>
            </thead>
            <tbody>
              {items.filter((i) => mealType === "veg" ? !["chicken", "mutton"].includes(i.id) : true).map((item) => {
                const calc = calculations.find((c) => c.id === item.id);
                return (
                  <tr key={item.id} className={`border-b border-gray-100 ${!item.enabled ? "opacity-40" : ""}`}>
                    <td className="p-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={item.enabled} onChange={() => toggleItem(item.id)} className="w-4 h-4" />
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </label>
                    </td>
                    <td className="p-2">
                      <input
                        className="w-16 text-center border rounded px-1 py-0.5 text-sm"
                        type="number"
                        min={0}
                        value={item.perPerson}
                        onChange={(e) => updateQty(item.id, +e.target.value)}
                      />
                      <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                    </td>
                    <td className="p-2 text-center">
                      <input
                        className="w-16 text-center border rounded px-1 py-0.5 text-sm"
                        type="number"
                        min={0}
                        value={item.pricePerKg}
                        onChange={(e) => updatePrice(item.id, +e.target.value)}
                      />
                    </td>
                    <td className="p-2 text-right font-mono text-gray-700">
                      {calc ? `${calc.totalDisplay} ${calc.displayUnit}` : "—"}
                    </td>
                    <td className="p-2 text-right font-bold text-indigo-600">
                      {calc ? fmt(calc.cost) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="result-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Total Food Budget</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmt(totalCost)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Per Plate Cost</div>
            <div className="text-2xl font-extrabold text-purple-600">{fmt(perPlateCost)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Total Guests</div>
            <div className="text-2xl font-extrabold text-gray-800">{guests}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
