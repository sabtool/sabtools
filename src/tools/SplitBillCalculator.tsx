"use client";
import { useState, useMemo } from "react";

interface BillItem {
  id: number;
  name: string;
  price: string;
  sharedBy: boolean[]; // one per person
}

let itemId = 2;

export default function SplitBillCalculator() {
  const [totalBill, setTotalBill] = useState("");
  const [numPeople, setNumPeople] = useState(2);
  const [tipPercent, setTipPercent] = useState("");
  const [splitMode, setSplitMode] = useState<"equal" | "itemized">("equal");
  const [personNames, setPersonNames] = useState<string[]>(["Person 1", "Person 2"]);
  const [items, setItems] = useState<BillItem[]>([
    { id: 1, name: "Item 1", price: "", sharedBy: [true, true] },
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const updatePeopleCount = (count: number) => {
    if (count < 2) count = 2;
    if (count > 10) count = 10;
    setNumPeople(count);

    const names = [...personNames];
    while (names.length < count) names.push(`Person ${names.length + 1}`);
    setPersonNames(names.slice(0, count));

    setItems(items.map((item) => {
      const shared = [...item.sharedBy];
      while (shared.length < count) shared.push(true);
      return { ...item, sharedBy: shared.slice(0, count) };
    }));
  };

  const addItem = () => {
    setItems([...items, {
      id: ++itemId,
      name: `Item ${items.length + 1}`,
      price: "",
      sharedBy: Array(numPeople).fill(true),
    }]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: number, field: string, value: string | boolean[]) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const togglePerson = (itemId: number, personIdx: number) => {
    setItems(items.map((item) => {
      if (item.id !== itemId) return item;
      const shared = [...item.sharedBy];
      shared[personIdx] = !shared[personIdx];
      return { ...item, sharedBy: shared };
    }));
  };

  const result = useMemo(() => {
    const tip = parseFloat(tipPercent) || 0;

    if (splitMode === "equal") {
      const bill = parseFloat(totalBill);
      if (!bill || bill <= 0) return null;

      const tipAmount = bill * (tip / 100);
      const totalWithTip = bill + tipAmount;
      const perPerson = totalWithTip / numPeople;
      // Round to nearest rupee for UPI-friendly amounts
      const rounded = Math.ceil(perPerson);

      return {
        mode: "equal" as const,
        totalBill: bill,
        tipAmount,
        totalWithTip,
        perPerson,
        rounded,
        rounding: rounded * numPeople - totalWithTip,
      };
    } else {
      // Itemized split
      const shares = Array(numPeople).fill(0);
      let itemTotal = 0;

      items.forEach((item) => {
        const price = parseFloat(item.price) || 0;
        itemTotal += price;
        const sharers = item.sharedBy.filter(Boolean).length;
        if (sharers === 0) return;
        const perShare = price / sharers;
        item.sharedBy.forEach((shared, idx) => {
          if (shared) shares[idx] += perShare;
        });
      });

      if (itemTotal <= 0) return null;

      // Add tip proportionally
      const tipAmount = itemTotal * (tip / 100);
      const totalWithTip = itemTotal + tipAmount;

      const sharesWithTip = shares.map((s) => {
        const proportion = s / itemTotal;
        return s + tipAmount * proportion;
      });

      // Round up for UPI
      const rounded = sharesWithTip.map((s) => Math.ceil(s));

      return {
        mode: "itemized" as const,
        totalBill: itemTotal,
        tipAmount,
        totalWithTip,
        shares: sharesWithTip,
        rounded,
      };
    }
  }, [totalBill, numPeople, tipPercent, splitMode, items]);

  return (
    <div className="space-y-6">
      {/* Split mode toggle */}
      <div className="flex gap-2">
        <button onClick={() => setSplitMode("equal")} className={splitMode === "equal" ? "btn-primary" : "btn-secondary"}>
          Equal Split
        </button>
        <button onClick={() => setSplitMode("itemized")} className={splitMode === "itemized" ? "btn-primary" : "btn-secondary"}>
          Itemized Split
        </button>
      </div>

      {/* Number of people */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Number of People</label>
          <div className="flex items-center gap-2">
            <button onClick={() => updatePeopleCount(numPeople - 1)} className="btn-secondary px-3 py-1">-</button>
            <span className="text-xl font-bold text-indigo-600 w-12 text-center">{numPeople}</span>
            <button onClick={() => updatePeopleCount(numPeople + 1)} className="btn-secondary px-3 py-1">+</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tip (%)</label>
          <div className="flex gap-2 items-center">
            <input type="number" placeholder="0" value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)} className="calc-input w-24" />
            <div className="flex gap-1">
              {[5, 10, 15].map((t) => (
                <button key={t} onClick={() => setTipPercent(String(t))}
                  className={`text-xs px-2 py-1 rounded ${tipPercent === String(t) ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                  {t}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {splitMode === "equal" ? (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Total Bill Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">&#8377;</span>
            <input type="number" placeholder="Enter total bill" value={totalBill}
              onChange={(e) => setTotalBill(e.target.value)} className="calc-input pl-8" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Person names */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">People Names</label>
            <div className="flex flex-wrap gap-2">
              {personNames.slice(0, numPeople).map((name, i) => (
                <input key={i} type="text" value={name}
                  onChange={(e) => {
                    const names = [...personNames];
                    names[i] = e.target.value;
                    setPersonNames(names);
                  }}
                  className="calc-input w-28 text-center text-sm" />
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Items</label>
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                <div className="flex gap-2 items-center">
                  <input type="text" value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="calc-input flex-1 text-sm" placeholder="Item name" />
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">&#8377;</span>
                    <input type="number" value={item.price} placeholder="Price"
                      onChange={(e) => updateItem(item.id, "price", e.target.value)}
                      className="calc-input w-28 pl-6 text-sm" />
                  </div>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-sm">&#10005;</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-gray-500 self-center mr-1">Shared by:</span>
                  {personNames.slice(0, numPeople).map((name, idx) => (
                    <button key={idx}
                      onClick={() => togglePerson(item.id, idx)}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                        item.sharedBy[idx]
                          ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                          : "bg-gray-50 text-gray-400 border-gray-200"
                      }`}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={addItem} className="btn-secondary w-full text-sm">+ Add Item</button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xs text-gray-500">Bill</div>
              <div className="text-lg font-bold text-gray-800">{fmt(result.totalBill)}</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xs text-gray-500">Tip</div>
              <div className="text-lg font-bold text-orange-500">{fmt(result.tipAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-lg font-bold text-indigo-600">{fmt(result.totalWithTip)}</div>
            </div>
          </div>

          {result.mode === "equal" && (
            <div className="text-center space-y-2">
              <div className="text-xs text-gray-500">Each person pays</div>
              <div className="text-4xl font-extrabold text-green-600">{fmt(result.rounded)}</div>
              <div className="text-xs text-gray-400">UPI-friendly (rounded up to nearest ₹)</div>
              {result.rounding > 1 && (
                <div className="text-xs text-gray-400">Rounding surplus: {fmt(result.rounding)}</div>
              )}
            </div>
          )}

          {result.mode === "itemized" && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-700">Per Person Breakdown</h4>
              {personNames.slice(0, numPeople).map((name, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-green-600">{fmt(result.rounded[i])}</span>
                    {result.rounded[i] !== Math.round(result.shares[i]) && (
                      <span className="text-xs text-gray-400 ml-2">(exact: {fmt(result.shares[i])})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
