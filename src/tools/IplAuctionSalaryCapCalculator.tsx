"use client";
import { useMemo, useState } from "react";

/**
 * IPL Auction Salary Cap Calculator
 *
 * Each franchise has a salary cap (set by BCCI before each season). For
 * IPL 2026 the cap is ₹120 crore per team (up from ₹100 cr in 2024).
 * Squad size is 18-25 players, with at most 8 overseas players.
 *
 * Tool flow:
 *   1. Set salary cap (default 120cr; configurable for users who want to
 *      model older seasons / what-ifs)
 *   2. Add players one-by-one with name + price (in cr or lakhs)
 *   3. Tool tracks:
 *        - Total spent
 *        - Remaining purse
 *        - Squad size
 *        - Average price per player
 *        - Top buy + most expensive % of purse
 *        - Validation flags (overspend? squad size violation?)
 *
 * Useful for:
 *   - Fans modelling their dream auction
 *   - Fantasy / journalism analysis
 *   - Pre-auction strategy: "with ₹40cr left and 8 slots, average is ₹5cr"
 *
 * IPL 2026 rules constants (BCCI guidelines):
 *   - Salary cap: ₹120 cr
 *   - Min squad: 18 players
 *   - Max squad: 25 players
 *   - Max overseas: 8 (max 4 in playing XI)
 *   - Min purse spend: ~75% (BCCI rule to prevent under-spending)
 */

interface Player {
  id: number;
  name: string;
  priceCr: number; // in crores
  isOverseas: boolean;
}

const DEFAULT_CAP_CR = 120;
const MIN_SQUAD = 18;
const MAX_SQUAD = 25;
const MAX_OVERSEAS = 8;

export default function IplAuctionSalaryCapCalculator() {
  const [salaryCapCr, setSalaryCapCr] = useState<number>(DEFAULT_CAP_CR);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Marquee 1", priceCr: 24, isOverseas: false },
    { id: 2, name: "Marquee 2", priceCr: 18, isOverseas: true },
    { id: 3, name: "Captain", priceCr: 16, isOverseas: false },
  ]);
  const [nextId, setNextId] = useState<number>(4);

  // Form for adding new player
  const [newName, setNewName] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newIsOverseas, setNewIsOverseas] = useState<boolean>(false);

  const addPlayer = () => {
    if (!newName.trim()) return;
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;
    if (players.length >= MAX_SQUAD) return;
    setPlayers((prev) => [...prev, { id: nextId, name: newName.trim(), priceCr: price, isOverseas: newIsOverseas }]);
    setNextId((n) => n + 1);
    setNewName("");
    setNewPrice("");
    setNewIsOverseas(false);
  };

  const removePlayer = (id: number) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const result = useMemo(() => {
    const totalSpentCr = players.reduce((s, p) => s + p.priceCr, 0);
    const remainingCr = salaryCapCr - totalSpentCr;
    const overseasCount = players.filter((p) => p.isOverseas).length;
    const avgCr = players.length > 0 ? totalSpentCr / players.length : 0;
    const topBuy = players.length > 0
      ? players.reduce((max, p) => (p.priceCr > max.priceCr ? p : max), players[0])
      : null;
    const topBuyPct = topBuy ? (topBuy.priceCr / salaryCapCr) * 100 : 0;
    const minSpendCr = salaryCapCr * 0.75;
    const isOverBudget = totalSpentCr > salaryCapCr;
    const isUnderMinSpend = totalSpentCr < minSpendCr;
    const isOverseasViolation = overseasCount > MAX_OVERSEAS;
    const remainingSlots = MAX_SQUAD - players.length;
    const avgPerRemainingSlot = remainingSlots > 0 && remainingCr > 0
      ? remainingCr / remainingSlots
      : 0;

    return {
      totalSpentCr, remainingCr, overseasCount, avgCr, topBuy, topBuyPct,
      minSpendCr, isOverBudget, isUnderMinSpend, isOverseasViolation,
      remainingSlots, avgPerRemainingSlot,
      squadSize: players.length,
      capUtilizationPct: (totalSpentCr / salaryCapCr) * 100,
    };
  }, [players, salaryCapCr]);

  const fmtCr = (n: number) => `₹${n.toFixed(2)} Cr`;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Salary cap (₹ Cr)</label>
        <input type="number" min="1" value={salaryCapCr} onChange={(e) => setSalaryCapCr(+e.target.value || DEFAULT_CAP_CR)} className="calc-input max-w-48" />
        <p className="text-xs text-gray-500 mt-1">IPL 2026 cap: ₹120 cr · 2025: ₹120 cr · 2024: ₹100 cr · 2023: ₹95 cr</p>
      </div>

      {/* Visual progress bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
          <span>Purse used: {fmtCr(result.totalSpentCr)}</span>
          <span>{result.capUtilizationPct.toFixed(1)}% of {fmtCr(salaryCapCr)}</span>
        </div>
        <div className="h-5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div
            className={`h-full transition-all duration-300 ${result.isOverBudget ? "bg-rose-500" : result.capUtilizationPct >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${Math.min(100, result.capUtilizationPct)}%` }}
          ></div>
        </div>
        {result.isOverBudget && (
          <div className="mt-2 text-sm font-semibold text-rose-700">
            ⚠️ Over budget by {fmtCr(Math.abs(result.remainingCr))}
          </div>
        )}
        {!result.isOverBudget && result.isUnderMinSpend && players.length >= MIN_SQUAD && (
          <div className="mt-2 text-sm font-semibold text-amber-700">
            ⚠️ Below 75% min-spend rule (need {fmtCr(result.minSpendCr - result.totalSpentCr)} more)
          </div>
        )}
      </div>

      {/* Add player form */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <h3 className="font-bold text-indigo-900 mb-3">Add a player</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="Player name"
            className="calc-input"
          />
          <input
            type="number"
            min="0"
            step="0.05"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="Price in Cr (e.g. 12.5)"
            className="calc-input"
          />
          <button
            onClick={addPlayer}
            disabled={!newName.trim() || !newPrice || players.length >= MAX_SQUAD}
            className="bg-indigo-600 text-white rounded-xl font-semibold py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Player
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={newIsOverseas} onChange={(e) => setNewIsOverseas(e.target.checked)} className="w-4 h-4" />
          <span>Overseas player (counts toward 8-max overseas limit)</span>
        </label>
      </div>

      {/* Player list */}
      {players.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 font-bold text-gray-800 border-b border-gray-100 flex justify-between">
            <span>Squad ({players.length}/{MAX_SQUAD})</span>
            <span className="text-sm font-medium text-gray-500">{result.overseasCount}/{MAX_OVERSEAS} overseas</span>
          </div>
          <div className="divide-y divide-gray-100">
            {[...players].sort((a, b) => b.priceCr - a.priceCr).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-gray-800 truncate">{p.name}</span>
                  {p.isOverseas && (
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Overseas</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{fmtCr(p.priceCr)}</span>
                  <button onClick={() => removePlayer(p.id)} className="text-rose-500 hover:text-rose-700 text-sm font-bold">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result snapshot */}
      <div className="result-card grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Spent</div>
          <div className="text-xl font-bold text-rose-600">{fmtCr(result.totalSpentCr)}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Remaining</div>
          <div className={`text-xl font-bold ${result.isOverBudget ? "text-rose-600" : "text-emerald-600"}`}>
            {fmtCr(result.remainingCr)}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Squad size</div>
          <div className={`text-xl font-bold ${result.squadSize < MIN_SQUAD || result.squadSize > MAX_SQUAD ? "text-amber-600" : "text-gray-900"}`}>
            {result.squadSize}
            <span className="text-xs text-gray-500"> / {MAX_SQUAD}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Avg price</div>
          <div className="text-xl font-bold text-gray-900">{fmtCr(result.avgCr)}</div>
        </div>
      </div>

      {/* Strategy panel */}
      {result.remainingSlots > 0 && !result.isOverBudget && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-amber-900 mb-2">Strategy (assuming you fill to 25)</h3>
          <div className="text-sm text-amber-900 space-y-1">
            <div>• <strong>{result.remainingSlots}</strong> slots left, <strong>{fmtCr(result.remainingCr)}</strong> remaining</div>
            <div>• Average per remaining slot: <strong>{fmtCr(result.avgPerRemainingSlot)}</strong></div>
            {result.topBuy && (
              <div>• Most expensive buy: <strong>{result.topBuy.name}</strong> at {fmtCr(result.topBuy.priceCr)} ({result.topBuyPct.toFixed(1)}% of cap)</div>
            )}
            <div>• Min purse spend rule: must use ≥ {fmtCr(result.minSpendCr)} ({result.minSpendCr - result.totalSpentCr > 0.005 ? `${fmtCr(result.minSpendCr - result.totalSpentCr)} more needed` : "✓ already met"})</div>
            {result.isOverseasViolation && (
              <div className="text-rose-700 font-semibold">⚠️ {result.overseasCount} overseas players exceed the 8-max limit</div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 leading-relaxed">
        <strong>IPL 2026 rules:</strong> ₹120 Cr salary cap per franchise. Squad must be 18-25 players. Max 8 overseas (only 4 in playing XI). Teams must spend at least 75% of the purse (BCCI rule). All prices in INR Crores. Source: BCCI IPL governing council guidelines.
      </div>
    </div>
  );
}
