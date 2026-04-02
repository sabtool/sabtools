"use client";
import { useState } from "react";

export default function TemperatureConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("celsius");

  const v = parseFloat(value);
  const results = !isNaN(v) ? {
    celsius: unit === "celsius" ? v : unit === "fahrenheit" ? (v - 32) * 5 / 9 : v - 273.15,
    fahrenheit: unit === "fahrenheit" ? v : unit === "celsius" ? (v * 9 / 5) + 32 : (v - 273.15) * 9 / 5 + 32,
    kelvin: unit === "kelvin" ? v : unit === "celsius" ? v + 273.15 : (v - 32) * 5 / 9 + 273.15,
  } : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Temperature</label>
          <input type="number" placeholder="Enter temperature" value={value} onChange={(e) => setValue(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Unit</label>
          <div className="flex gap-2">
            {["celsius", "fahrenheit", "kelvin"].map((u) => (
              <button key={u} onClick={() => setUnit(u)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition ${unit === u ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {u === "celsius" ? "°C" : u === "fahrenheit" ? "°F" : "K"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {results && value && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="result-card text-center"><div className="text-xs text-gray-500">Celsius</div><div className="text-2xl font-extrabold text-blue-600">{results.celsius.toFixed(2)} °C</div></div>
          <div className="result-card text-center"><div className="text-xs text-gray-500">Fahrenheit</div><div className="text-2xl font-extrabold text-orange-600">{results.fahrenheit.toFixed(2)} °F</div></div>
          <div className="result-card text-center"><div className="text-xs text-gray-500">Kelvin</div><div className="text-2xl font-extrabold text-purple-600">{results.kelvin.toFixed(2)} K</div></div>
        </div>
      )}
    </div>
  );
}
