"use client";
import { useState, useMemo } from "react";

/**
 * Lakh / Crore ↔ Million / Billion Converter
 *
 * The Indian numbering system uses lakh (1,00,000 = 10^5) and crore
 * (1,00,00,000 = 10^7), which uses a different grouping convention than the
 * Western short scale (thousand, million, billion = 10^3, 10^6, 10^9).
 *
 * Conversions are EXACT mathematical relationships — no approximation.
 *
 *   1 lakh        = 100,000           = 0.1 million
 *   1 crore       = 10,000,000        = 10 million        = 0.01 billion
 *   1 arab        = 1,000,000,000     = 1 billion         = 100 crore
 *   1 kharab      = 100,000,000,000   = 100 billion       = 10,000 crore
 *
 *   1 thousand    = 1,000             = 0.01 lakh
 *   1 million     = 1,000,000         = 10 lakh           = 0.1 crore
 *   1 billion     = 1,000,000,000     = 100 crore         = 10,000 lakh
 *
 * Indian comma grouping convention: ₹1,23,45,678 (NOT ₹12,345,678).
 * The locale "en-IN" handles this correctly via Intl.NumberFormat.
 *
 * Use cases this tool serves:
 *  - Indians communicating ₹ amounts to global counterparts ($/€)
 *  - Reading global news that quotes in millions/billions
 *  - Filling forms that require lakh/crore but you have million/billion data
 */

type Unit =
  | "ones"
  | "thousand"
  | "lakh"
  | "million"
  | "crore"
  | "billion"
  | "arab"
  | "kharab";

const UNIT_TO_BASE: Record<Unit, number> = {
  // Convert each unit to the "ones" base.
  ones: 1,
  thousand: 1_000,
  lakh: 100_000,
  million: 1_000_000,
  crore: 10_000_000,
  billion: 1_000_000_000,
  arab: 1_000_000_000, // 1 arab = 100 crore = 1 billion (Indian system)
  kharab: 100_000_000_000, // 1 kharab = 10,000 crore = 100 billion
};

const UNIT_LABELS: Record<Unit, string> = {
  ones: "Ones (units)",
  thousand: "Thousand (हज़ार)",
  lakh: "Lakh (लाख)",
  million: "Million",
  crore: "Crore (करोड़)",
  billion: "Billion",
  arab: "Arab (अरब)",
  kharab: "Kharab (खरब)",
};

export default function LakhCroreConverter() {
  const [value, setValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<Unit>("crore");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;

    // Convert input to base (ones)
    const base = v * UNIT_TO_BASE[fromUnit];

    // Convert from base to every unit
    const conversions: { unit: Unit; amount: number }[] = (
      Object.keys(UNIT_TO_BASE) as Unit[]
    ).map((u) => ({
      unit: u,
      amount: base / UNIT_TO_BASE[u],
    }));

    return { base, conversions };
  }, [value, fromUnit]);

  const fmtIndian = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(n);

  const fmtINRIndian = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtCompactSmart = (n: number) => {
    if (n === 0) return "0";
    if (n < 0.0001) return n.toExponential(2);
    if (n >= 1) return fmtIndian(n);
    return n.toFixed(6).replace(/\.?0+$/, "");
  };

  // Standard quick-conversion table that's high-search-volume in India
  const POPULAR_QUICK_REFS = [
    { l: "1 Lakh", v: 100_000, equivs: "= 0.1 Million = ₹1,00,000" },
    { l: "10 Lakh", v: 1_000_000, equivs: "= 1 Million = ₹10,00,000" },
    { l: "1 Crore", v: 10_000_000, equivs: "= 10 Million = ₹1,00,00,000" },
    { l: "10 Crore", v: 100_000_000, equivs: "= 100 Million" },
    { l: "100 Crore", v: 1_000_000_000, equivs: "= 1 Billion = 1 Arab" },
    {
      l: "1,000 Crore",
      v: 10_000_000_000,
      equivs: "= 10 Billion",
    },
    {
      l: "10,000 Crore (1 Kharab)",
      v: 100_000_000_000,
      equivs: "= 100 Billion",
    },
    {
      l: "1 Lakh Crore",
      v: 1_000_000_000_000,
      equivs: "= 1 Trillion",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🔢 Indian ↔ International Number System Converter
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label
            htmlFor="lkr-value"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Enter Amount
          </label>
          <input
            id="lkr-value"
            type="number"
            placeholder="e.g. 1.5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label
            htmlFor="lkr-from-unit"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Unit
          </label>
          <select
            id="lkr-from-unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="calc-input"
          >
            {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
              <option key={u} value={u}>
                {UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-3">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              {fmtIndian(parseFloat(value) || 0)} {UNIT_LABELS[fromUnit]} =
            </div>
            <div className="text-3xl font-bold">{fmtINRIndian(result.base)}</div>
            <div className="text-xs opacity-80 mt-1">
              {result.base.toLocaleString("en-US")} (international format)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.conversions
              .filter((c) => c.unit !== fromUnit)
              .map((c) => (
                <div
                  key={c.unit}
                  className="bg-white rounded-xl p-3 shadow-sm flex justify-between items-center"
                >
                  <div className="text-sm text-gray-700">
                    {UNIT_LABELS[c.unit]}
                  </div>
                  <div className="font-bold text-indigo-600">
                    {fmtCompactSmart(c.amount)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">
          Quick Reference Table
        </h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">
                  Indian
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  Numerical Value
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  Equivalents
                </th>
              </tr>
            </thead>
            <tbody>
              {POPULAR_QUICK_REFS.map((row) => (
                <tr key={row.l} className="border-t">
                  <td className="p-3 font-medium text-gray-900">{row.l}</td>
                  <td className="p-3 text-gray-700">{fmtIndian(row.v)}</td>
                  <td className="p-3 text-gray-600 text-xs">{row.equivs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Indian numbering system explained:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>1 Lakh</strong> = 100,000 = 10<sup>5</sup> — written
            ₹1,00,000 in Indian notation
          </li>
          <li>
            <strong>1 Crore</strong> = 100 lakh = 10,000,000 = 10
            <sup>7</sup> — written ₹1,00,00,000
          </li>
          <li>
            <strong>1 Arab</strong> = 100 crore = 1,000,000,000 (= 1 Billion)
          </li>
          <li>
            <strong>1 Kharab</strong> = 100 arab = 100,000,000,000 (= 100
            Billion)
          </li>
          <li>
            Indian grouping uses 3 digits, then 2 digits repeatedly:{" "}
            <strong>X,XX,XX,XXX</strong> (not the Western X,XXX,XXX,XXX).
          </li>
        </ul>
        <p className="mt-2">
          Conversions in this tool are exact mathematical relationships — no
          rounding except at the display layer (max 2 decimal places).
        </p>
      </div>
    </div>
  );
}
