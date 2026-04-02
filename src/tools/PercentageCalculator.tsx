"use client";
import { useState } from "react";

export default function PercentageCalculator() {
  const [a1, setA1] = useState(""); const [b1, setB1] = useState("");
  const [a2, setA2] = useState(""); const [b2, setB2] = useState("");
  const [a3, setA3] = useState(""); const [b3, setB3] = useState("");

  const r1 = a1 && b1 ? (parseFloat(a1) / 100) * parseFloat(b1) : null;
  const r2 = a2 && b2 ? (parseFloat(a2) / parseFloat(b2)) * 100 : null;
  const r3 = a3 && b3 ? ((parseFloat(b3) - parseFloat(a3)) / parseFloat(a3)) * 100 : null;

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-5">
      <Card title="What is X% of Y?">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500">What is</span>
          <input type="number" placeholder="X" value={a1} onChange={(e) => setA1(e.target.value)} className="calc-input w-28" />
          <span className="text-sm text-gray-500">% of</span>
          <input type="number" placeholder="Y" value={b1} onChange={(e) => setB1(e.target.value)} className="calc-input w-28" />
          {r1 !== null && (
            <span className="text-lg font-bold text-indigo-600">= {r1.toFixed(2)}</span>
          )}
        </div>
      </Card>

      <Card title="X is what % of Y?">
        <div className="flex items-center gap-3 flex-wrap">
          <input type="number" placeholder="X" value={a2} onChange={(e) => setA2(e.target.value)} className="calc-input w-28" />
          <span className="text-sm text-gray-500">is what % of</span>
          <input type="number" placeholder="Y" value={b2} onChange={(e) => setB2(e.target.value)} className="calc-input w-28" />
          {r2 !== null && (
            <span className="text-lg font-bold text-indigo-600">= {r2.toFixed(2)}%</span>
          )}
        </div>
      </Card>

      <Card title="Percentage Change from X to Y">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500">From</span>
          <input type="number" placeholder="X" value={a3} onChange={(e) => setA3(e.target.value)} className="calc-input w-28" />
          <span className="text-sm text-gray-500">to</span>
          <input type="number" placeholder="Y" value={b3} onChange={(e) => setB3(e.target.value)} className="calc-input w-28" />
          {r3 !== null && (
            <span className={`text-lg font-bold ${r3 >= 0 ? "text-green-600" : "text-red-600"}`}>
              = {r3 >= 0 ? "+" : ""}{r3.toFixed(2)}%
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
