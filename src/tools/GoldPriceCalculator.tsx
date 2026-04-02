"use client";
import { useState, useMemo, useCallback } from "react";

const PURITY_OPTIONS = [
  { label: "24K (99.9% Pure)", karat: 24, factor: 1.0 },
  { label: "22K (91.6% Pure)", karat: 22, factor: 0.916 },
  { label: "18K (75% Pure)", karat: 18, factor: 0.75 },
  { label: "14K (58.3% Pure)", karat: 14, factor: 0.583 },
];

export default function GoldPriceCalculator() {
  const [weight, setWeight] = useState("");
  const [purity, setPurity] = useState(22);
  const [goldPrice, setGoldPrice] = useState("8800");
  const [includeMaking, setIncludeMaking] = useState(false);
  const [makingPercent, setMakingPercent] = useState(10);

  const fmt = useCallback(
    (n: number) =>
      new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n),
    []
  );

  const selectedPurity = PURITY_OPTIONS.find((p) => p.karat === purity)!;

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const price24k = parseFloat(goldPrice);
    if (!w || w <= 0 || !price24k || price24k <= 0) return null;

    const pricePerGram = price24k * selectedPurity.factor;
    const goldValue = w * pricePerGram;
    const makingCharges = includeMaking ? (goldValue * makingPercent) / 100 : 0;
    const gst = (goldValue + makingCharges) * 0.03; // 3% GST on gold
    const totalValue = goldValue + makingCharges + gst;

    return { pricePerGram, goldValue, makingCharges, gst, totalValue };
  }, [weight, goldPrice, purity, includeMaking, makingPercent, selectedPurity]);

  const handleCheckLivePrice = useCallback(() => {
    window.open("https://www.google.com/search?q=gold+price+today+India", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-5 text-center">
        <div className="text-sm text-amber-700 font-medium mb-1">Enter Today&apos;s 24K Gold Rate (&#8377;/gram)</div>
        <div className="text-4xl font-extrabold text-amber-600">&#8377;{goldPrice ? parseInt(goldPrice).toLocaleString("en-IN") : "—"}/g</div>
        <div className="text-xs text-amber-500 mt-2">Edit the price below to match today&apos;s rate</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Weight (grams)</label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="calc-input"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Enter today&apos;s 24K gold rate (&#8377;/gram)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="e.g. 8800"
              value={goldPrice}
              onChange={(e) => setGoldPrice(e.target.value)}
              className="calc-input flex-1"
            />
            <button
              onClick={handleCheckLivePrice}
              className="btn-primary text-xs whitespace-nowrap px-3"
              title="Check live gold price on Google"
            >
              Check Live Price
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Default: &#8377;8,800/g (approx. March 2026). Update with today&apos;s rate for accurate results.
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Gold Purity</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PURITY_OPTIONS.map((p) => (
            <button
              key={p.karat}
              onClick={() => setPurity(p.karat)}
              className={`p-3 rounded-lg text-sm font-semibold transition-all border-2 ${
                purity === p.karat
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="text-lg font-bold">{p.karat}K</div>
              <div className="text-xs opacity-75">{(p.factor * 100).toFixed(1)}% pure</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">Include Making Charges?</label>
          <button
            onClick={() => setIncludeMaking(!includeMaking)}
            className={`w-12 h-6 rounded-full transition-all relative ${
              includeMaking ? "bg-amber-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-all ${
                includeMaking ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>
        {includeMaking && (
          <div className="mt-3">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-600">Making Charges</label>
              <span className="text-sm font-bold text-amber-600">{makingPercent}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              step={1}
              value={makingPercent}
              onChange={(e) => setMakingPercent(+e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5%</span><span>25%</span>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center mb-2">
            <div className="text-xs font-medium text-gray-500">Total Gold Value</div>
            <div className="text-4xl font-extrabold text-amber-600 mt-1">{fmt(result.totalValue)}</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">{selectedPurity.label} Price/gram</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.pricePerGram)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Gold Value ({weight}g x {fmt(result.pricePerGram)})</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.goldValue)}</span>
            </div>
            {includeMaking && (
              <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                <span className="text-sm text-gray-600">Making Charges ({makingPercent}%)</span>
                <span className="text-sm font-bold text-orange-500">{fmt(result.makingCharges)}</span>
              </div>
            )}
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">GST (3%)</span>
              <span className="text-sm font-bold text-red-500">{fmt(result.gst)}</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <div className="text-xs font-medium text-amber-700 mb-1">Total Amount Payable</div>
            <div className="text-3xl font-extrabold text-amber-600">{fmt(result.totalValue)}</div>
            <div className="text-xs text-amber-500 mt-1">
              {weight}g of {selectedPurity.label} Gold
            </div>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Disclaimer:</strong> Gold prices are user-entered. Verify with your local jeweller or google.com/finance for the latest rates before making any purchase decisions.
      </div>
    </div>
  );
}
