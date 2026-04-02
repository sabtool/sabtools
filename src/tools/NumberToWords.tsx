"use client";
import { useState } from "react";

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertToWords(num: number): string {
  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + convertToWords(-num);

  let words = "";
  if (Math.floor(num / 10000000) > 0) { words += convertToWords(Math.floor(num / 10000000)) + " Crore "; num %= 10000000; }
  if (Math.floor(num / 100000) > 0) { words += convertToWords(Math.floor(num / 100000)) + " Lakh "; num %= 100000; }
  if (Math.floor(num / 1000) > 0) { words += convertToWords(Math.floor(num / 1000)) + " Thousand "; num %= 1000; }
  if (Math.floor(num / 100) > 0) { words += convertToWords(Math.floor(num / 100)) + " Hundred "; num %= 100; }
  if (num > 0) {
    if (words !== "") words += "and ";
    if (num < 20) words += ones[num];
    else { words += tens[Math.floor(num / 10)]; if (num % 10 > 0) words += " " + ones[num % 10]; }
  }
  return words.trim();
}

export default function NumberToWords() {
  const [input, setInput] = useState("");
  const num = parseInt(input);
  const words = !isNaN(num) ? convertToWords(num) : "";
  const indianFormat = !isNaN(num) ? new Intl.NumberFormat("en-IN").format(num) : "";

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Number</label>
        <input type="number" placeholder="e.g. 1234567" value={input} onChange={(e) => setInput(e.target.value)} className="calc-input text-lg" />
      </div>
      {words && (
        <div className="space-y-3">
          <div className="result-card">
            <div className="text-xs font-medium text-gray-500 mb-1">In Words (Indian System)</div>
            <div className="text-xl font-bold text-indigo-600">{words} Rupees Only</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Indian Format</div>
            <div className="text-lg font-bold text-gray-800">₹{indianFormat}</div>
          </div>
          <button onClick={() => navigator.clipboard?.writeText(words + " Rupees Only")} className="btn-primary text-sm !py-2 !px-4">Copy Words</button>
        </div>
      )}
    </div>
  );
}
