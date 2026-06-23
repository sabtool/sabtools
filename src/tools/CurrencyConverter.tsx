"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

const CURRENCY_INFO: Record<string, { name: string; symbol: string }> = {
  INR: { name: "Indian Rupee", symbol: "\u20B9" },
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "\u20AC" },
  GBP: { name: "British Pound", symbol: "\u00A3" },
  AED: { name: "UAE Dirham", symbol: "AED" },
  SAR: { name: "Saudi Riyal", symbol: "SAR" },
  JPY: { name: "Japanese Yen", symbol: "\u00A5" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  SGD: { name: "Singapore Dollar", symbol: "S$" },
  CNY: { name: "Chinese Yuan", symbol: "\u00A5" },
  THB: { name: "Thai Baht", symbol: "\u0E3F" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM" },
  BDT: { name: "Bangladeshi Taka", symbol: "\u09F3" },
  NPR: { name: "Nepalese Rupee", symbol: "Rs" },
};

// Offline fallback rates — used ONLY if the live API is unreachable
// (CSP block, user offline, API down). Refreshed 17 Jun 2026 from the
// same open.er-api.com source the tool normally queries live. Values
// are stored as "rate per 1 INR" (i.e. how many target-currency units
// you get for 1 rupee), matching the API's response shape.
//
// If you're updating these manually, the live API at
//   https://open.er-api.com/v6/latest/INR
// returns the exact numbers to paste in. Don't drift more than a few
// months without refreshing — stale offline values made the tool show
// 1 USD = ₹83 in June 2026 when the real rate was ₹94.6 (CSP was
// blocking the fetch and nobody noticed for months).
const FALLBACK_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.010569, // 1 USD ≈ ₹94.62
  EUR: 0.009108, // 1 EUR ≈ ₹109.79
  GBP: 0.007875, // 1 GBP ≈ ₹126.98
  AED: 0.038814, // 1 AED ≈ ₹25.76
  SAR: 0.039633, // 1 SAR ≈ ₹25.23
  JPY: 1.6952,   // 1 JPY ≈ ₹0.59 (≈ ₹58.99 per ¥100)
  AUD: 0.014953, // 1 AUD ≈ ₹66.88
  CAD: 0.014795, // 1 CAD ≈ ₹67.59
  SGD: 0.013553, // 1 SGD ≈ ₹73.78
  CNY: 0.071379, // 1 CNY ≈ ₹14.01
  THB: 0.343757, // 1 THB ≈ ₹2.91
  MYR: 0.043011, // 1 MYR ≈ ₹23.25
  BDT: 1.298456, // 1 BDT ≈ ₹0.77
  NPR: 1.6,      // 1 NPR ≈ ₹0.625 (pegged 1:1.6 to INR)
};

const SUPPORTED_CODES = Object.keys(CURRENCY_INFO);

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [usingOffline, setUsingOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      setLoading(true);
      setError(null);
      setUsingOffline(false);

      try {
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();

        if (data.result !== "success") throw new Error("API returned unsuccessful result");

        if (!cancelled) {
          const liveRates: Record<string, number> = {};
          for (const code of SUPPORTED_CODES) {
            if (data.rates[code] !== undefined) {
              liveRates[code] = data.rates[code];
            }
          }
          setRates(liveRates);
          setLastUpdated(data.time_last_update_utc || new Date().toUTCString());
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch rates");
          setRates(FALLBACK_RATES);
          setUsingOffline(true);
          setLastUpdated(null);
          setLoading(false);
        }
      }
    }

    fetchRates();
    return () => { cancelled = true; };
  }, []);

  const convert = useCallback(
    (value: number, fromCode: string, toCode: string): number | null => {
      if (!rates) return null;
      if (fromCode === toCode) return value;
      // rates are relative to INR (base = INR)
      const fromRate = rates[fromCode];
      const toRate = rates[toCode];
      if (!fromRate || !toRate) return null;
      // value in fromCode -> convert to INR -> convert to toCode
      const inINR = value / fromRate;
      return inINR * toRate;
    },
    [rates]
  );

  const result = useMemo(() => {
    const v = parseFloat(amount);
    if (isNaN(v) || v < 0) return null;
    return convert(v, from, to);
  }, [amount, from, to, convert]);

  const exchangeRate = useMemo(() => {
    return convert(1, from, to);
  }, [from, to, convert]);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const formatNum = useCallback((n: number) => {
    if (n >= 1) return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }, []);

  if (loading) {
    // Reserve the same vertical space the loaded UI will occupy so the
    // layout does not jump when rates arrive (fixes real-user CLS 0.281
    // measured on mobile — see SEO brief 2026-06-23). Presentational only.
    return (
      <div className="space-y-6" style={{ minHeight: 360 }}>
        <div className="result-card text-center">
          <div className="text-lg font-semibold text-indigo-600 animate-pulse">Loading rates...</div>
          <div className="text-sm text-gray-500 mt-2">Fetching live exchange rates from API</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {usingOffline && (
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 text-sm text-orange-800">
          <strong>&#9888;&#65039; Using approximate offline rates</strong> &mdash; Could not fetch live rates{error ? `: ${error}` : ""}. The rates shown are approximate and may not reflect current values.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="calc-input"
            min="0"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="calc-input">
            {SUPPORTED_CODES.map((code) => (
              <option key={code} value={code}>
                {code} - {CURRENCY_INFO[code].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="calc-input">
            {SUPPORTED_CODES.map((code) => (
              <option key={code} value={code}>
                {code} - {CURRENCY_INFO[code].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center">
        <button onClick={swap} className="btn-primary">
          &#8646; Swap Currencies
        </button>
      </div>

      {result !== null && amount && (
        <div className="result-card text-center" style={{ minHeight: 96 }}>
          <div className="text-sm text-gray-500">
            {CURRENCY_INFO[from].symbol} {formatNum(parseFloat(amount))} {from} =
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">
            {CURRENCY_INFO[to].symbol} {formatNum(result)} {to}
          </div>
          {exchangeRate !== null && (
            <div className="text-xs text-gray-400 mt-2">
              1 {from} = {formatNum(exchangeRate)} {to}
            </div>
          )}
        </div>
      )}

      {amount && parseFloat(amount) > 0 && rates && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            All Conversions from {from}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUPPORTED_CODES.filter((code) => code !== from).map((code) => {
              const converted = convert(parseFloat(amount), from, code);
              if (converted === null) return null;
              return (
                <div key={code} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-xs text-gray-500">
                    {code} - {CURRENCY_INFO[code].name}
                  </div>
                  <div className="text-sm font-bold text-gray-800">
                    {CURRENCY_INFO[code].symbol} {formatNum(converted)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lastUpdated && (
        <div className="text-center text-xs text-gray-400">
          Last updated: {lastUpdated}
        </div>
      )}
      {usingOffline && (
        <div className="text-center text-xs text-orange-500">
          Last updated: Using offline fallback rates
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Disclaimer:</strong> Exchange rates from Open Exchange Rates API. May differ from bank rates. For exact rates, please check with your bank or financial institution.
      </div>
    </div>
  );
}
