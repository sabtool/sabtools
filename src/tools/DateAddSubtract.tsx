"use client";
import { useState, useMemo } from "react";

export default function DateAddSubtract() {
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("0");
  const [months, setMonths] = useState("0");
  const [years, setYears] = useState("0");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const result = useMemo(() => {
    if (!startDate) return null;
    const date = new Date(startDate);
    const mult = operation === "add" ? 1 : -1;
    date.setFullYear(date.getFullYear() + parseInt(years || "0") * mult);
    date.setMonth(date.getMonth() + parseInt(months || "0") * mult);
    date.setDate(date.getDate() + parseInt(days || "0") * mult);
    return date;
  }, [startDate, days, months, years, operation]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Operation</label><div className="flex gap-2">{(["add","subtract"] as const).map((o) => (<button key={o} onClick={() => setOperation(o)} className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${operation === o ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{o}</button>))}</div></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Days</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Months</label><input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Years</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="calc-input" /></div>
      </div>
      {result && startDate && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500">Result Date</div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">{result.toLocaleDateString("en-IN", { dateStyle: "full" })}</div>
        </div>
      )}
    </div>
  );
}
