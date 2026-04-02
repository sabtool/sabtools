"use client";
import { useState, useMemo } from "react";

type Method = "pressure-cooker" | "microwave" | "oven" | "stovetop";

interface FoodItem {
  name: string;
  times: Record<Method, number>; // minutes
  tips: Record<Method, string>;
}

const FOODS: FoodItem[] = [
  { name: "Rice (1 cup)", times: { "pressure-cooker": 6, microwave: 12, oven: 25, stovetop: 15 }, tips: { "pressure-cooker": "2 whistles, then simmer 3 min", microwave: "Use 2:1 water ratio, cover with lid", oven: "180C, covered with foil", stovetop: "Low heat after boil, keep covered" } },
  { name: "Dal (Toor/Moong)", times: { "pressure-cooker": 8, microwave: 15, oven: 35, stovetop: 25 }, tips: { "pressure-cooker": "3 whistles, add turmeric and salt", microwave: "Soak 30 min before for faster cooking", oven: "Not recommended, use stovetop", stovetop: "Soak 30 min, cook until soft" } },
  { name: "Chana Dal", times: { "pressure-cooker": 12, microwave: 20, oven: 45, stovetop: 40 }, tips: { "pressure-cooker": "4 whistles, soak for 1 hour beforehand", microwave: "Soak overnight for best results", oven: "Not ideal, use pressure cooker", stovetop: "Soak overnight, cook on low" } },
  { name: "Rajma (Kidney Beans)", times: { "pressure-cooker": 20, microwave: 30, oven: 60, stovetop: 60 }, tips: { "pressure-cooker": "5-6 whistles, must soak overnight", microwave: "Soak overnight, change water", oven: "Slow cook at 160C", stovetop: "Soak 8+ hours, boil until soft" } },
  { name: "Chole (Chickpeas)", times: { "pressure-cooker": 18, microwave: 25, oven: 50, stovetop: 55 }, tips: { "pressure-cooker": "5 whistles, soak overnight with tea bag for color", microwave: "Pre-soak essential", oven: "Slow cook at 160C", stovetop: "Soak overnight, add baking soda pinch" } },
  { name: "Chicken Curry", times: { "pressure-cooker": 12, microwave: 18, oven: 35, stovetop: 30 }, tips: { "pressure-cooker": "3 whistles after masala prep", microwave: "Cut into small pieces", oven: "180C, covered", stovetop: "Medium heat, covered" } },
  { name: "Mutton Curry", times: { "pressure-cooker": 25, microwave: 35, oven: 60, stovetop: 90 }, tips: { "pressure-cooker": "5-6 whistles, marinate 1 hour", microwave: "Not recommended for best taste", oven: "160C, slow cook covered", stovetop: "Low heat for tender meat" } },
  { name: "Vegetables (Mixed)", times: { "pressure-cooker": 4, microwave: 6, oven: 20, stovetop: 12 }, tips: { "pressure-cooker": "1 whistle, don't overcook", microwave: "Cover, sprinkle water", oven: "180C, toss with oil", stovetop: "Medium heat, stir occasionally" } },
  { name: "Paneer Curry", times: { "pressure-cooker": 5, microwave: 8, oven: 20, stovetop: 15 }, tips: { "pressure-cooker": "Don't pressure cook paneer, use for gravy only", microwave: "Add paneer last 2 minutes", oven: "180C, add paneer last 5 min", stovetop: "Add paneer at the end, simmer 3 min" } },
  { name: "Eggs (Boiled)", times: { "pressure-cooker": 5, microwave: 8, oven: 20, stovetop: 10 }, tips: { "pressure-cooker": "1 whistle for hard boiled", microwave: "Pierce yolk, use low power", oven: "180C in muffin tin", stovetop: "Start in cold water, 10 min after boil" } },
  { name: "Potato (Boiled)", times: { "pressure-cooker": 8, microwave: 8, oven: 40, stovetop: 20 }, tips: { "pressure-cooker": "2 whistles, whole potato", microwave: "Pierce skin, 4 min per potato", oven: "200C, wrap in foil", stovetop: "Cover with water, boil until fork-tender" } },
  { name: "Biryani", times: { "pressure-cooker": 15, microwave: 25, oven: 40, stovetop: 35 }, tips: { "pressure-cooker": "Layer rice and meat, 3 whistles on low", microwave: "Layer and cover tightly", oven: "Dum at 180C, sealed with dough", stovetop: "Dum on low heat, seal lid" } },
  { name: "Idli Batter (Steam)", times: { "pressure-cooker": 12, microwave: 4, oven: 15, stovetop: 12 }, tips: { "pressure-cooker": "Steam without whistle weight, 12 min", microwave: "2 min per idli in mold", oven: "Steam in water bath", stovetop: "Idli maker, steam 10-12 min" } },
  { name: "Dosa", times: { "pressure-cooker": 0, microwave: 0, oven: 0, stovetop: 3 }, tips: { "pressure-cooker": "N/A - use tawa/stovetop only", microwave: "N/A - use tawa/stovetop only", oven: "N/A - use tawa/stovetop only", stovetop: "Hot tawa, spread thin, crispy on medium heat" } },
  { name: "Kheer / Payasam", times: { "pressure-cooker": 15, microwave: 20, oven: 45, stovetop: 40 }, tips: { "pressure-cooker": "3 whistles for rice, then add milk", microwave: "Stir every 5 minutes", oven: "Low 150C, stir occasionally", stovetop: "Low flame, stir frequently to avoid burning" } },
];

export default function CookingTimeCalculator() {
  const [method, setMethod] = useState<Method>("pressure-cooker");
  const [foodIndex, setFoodIndex] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const result = useMemo(() => {
    const food = FOODS[foodIndex];
    const baseTime = food.times[method];
    if (baseTime === 0) return { time: 0, tip: food.tips[method], name: food.name, notApplicable: true };

    // Time scales sub-linearly with quantity
    const adjustedTime = Math.round(baseTime * Math.pow(multiplier, 0.6));
    return { time: adjustedTime, tip: food.tips[method], name: food.name, notApplicable: false };
  }, [method, foodIndex, multiplier]);

  const methods: { key: Method; label: string; icon: string }[] = [
    { key: "pressure-cooker", label: "Pressure Cooker", icon: "🫕" },
    { key: "microwave", label: "Microwave", icon: "📡" },
    { key: "oven", label: "Oven", icon: "🔥" },
    { key: "stovetop", label: "Stovetop", icon: "🍳" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cooking Method</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {methods.map((m) => (
              <button key={m.key} onClick={() => setMethod(m.key)} className={method === m.key ? "btn-primary" : "btn-secondary"}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Food Item</label>
          <select value={foodIndex} onChange={(e) => setFoodIndex(+e.target.value)} className="calc-input">
            {FOODS.map((f, i) => (
              <option key={i} value={i}>{f.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Quantity Multiplier</label>
            <span className="text-sm font-bold text-indigo-600">{multiplier}x</span>
          </div>
          <input type="range" min={0.5} max={5} step={0.5} value={multiplier} onChange={(e) => setMultiplier(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5x (half)</span><span>5x</span>
          </div>
        </div>
      </div>

      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">{result.name}</h3>
        {result.notApplicable ? (
          <div className="bg-amber-50 p-4 rounded-lg text-amber-800">
            <p className="font-semibold">Not applicable for this cooking method</p>
            <p className="text-sm mt-1">{result.tip}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Cooking Time</div>
              <div className="text-4xl font-extrabold text-indigo-600">
                {result.time >= 60 ? `${Math.floor(result.time / 60)}h ${result.time % 60}m` : `${result.time} min`}
              </div>
              <div className="text-sm text-gray-400 mt-1">for {multiplier}x quantity</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-1">Tip</p>
              <p className="text-sm text-blue-700">{result.tip}</p>
            </div>
          </>
        )}

        {/* Quick comparison */}
        <h4 className="text-sm font-bold text-gray-700">Time Comparison (1x quantity)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {methods.map((m) => {
            const t = FOODS[foodIndex].times[m.key];
            return (
              <div key={m.key} className={`bg-white rounded-lg p-3 text-center shadow-sm ${m.key === method ? "ring-2 ring-indigo-400" : ""}`}>
                <div className="text-lg">{m.icon}</div>
                <div className="text-xs text-gray-500">{m.label}</div>
                <div className="font-bold text-gray-800">{t === 0 ? "N/A" : `${t} min`}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
