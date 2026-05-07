"use client";
import { useMemo, useState } from "react";

/**
 * IPL Ticket Price Calculator — for fans booking through BookMyShow,
 * Paytm Insider, or the official iplt20.com / franchise team site.
 *
 * Total = Face value
 *       + Convenience fee (BookMyShow / Paytm: ₹40-100 typical)
 *       + Internet handling fee (₹10-30 if applicable)
 *       + GST @ 18% on (convenience + handling fees)
 *
 * Note: GST is charged on the SERVICE FEES, not on the face value of
 * the ticket itself. The ticket's face value already includes embedded
 * GST/entertainment tax that the franchise has paid. This is the
 * standard treatment under CGST 2017 for online ticketing platforms.
 *
 * Multi-ticket pricing: each ticket gets its own convenience fee, but
 * only ONE handling fee per booking. So 4 tickets = 4×face + 4×conv +
 * 1×handling + 18% GST on (4×conv + 1×handling).
 *
 * Common 2026 IPL face value bands (as published by major franchises):
 *   - Upper stands / Cheap-end: ₹500-1,500
 *   - Mid-tier:                 ₹2,000-3,500
 *   - Premium / Pavilion:       ₹5,000-8,000
 *   - VIP / Hospitality boxes:  ₹15,000-50,000+
 *
 * The "real" cost users care about is what their card gets debited.
 * This tool surfaces the BookMyShow / Paytm fee structure so fans
 * aren't surprised at checkout.
 */

interface Result {
  faceValueSubtotal: number;
  convenienceFeeTotal: number;
  handlingFeeTotal: number;
  gstAmount: number;
  grandTotal: number;
  perTicketEffective: number;
  faceValueAsPctOfTotal: number;
}

export default function IplTicketPriceCalculator() {
  const [faceValue, setFaceValue] = useState<number>(2500);
  const [numTickets, setNumTickets] = useState<number>(2);
  const [convenienceFeePerTicket, setConvenienceFeePerTicket] = useState<number>(75);
  const [handlingFee, setHandlingFee] = useState<number>(20);
  const [gstRate] = useState<number>(18);

  const result: Result | null = useMemo(() => {
    if (faceValue <= 0 || numTickets <= 0) return null;

    const faceValueSubtotal = faceValue * numTickets;
    const convenienceFeeTotal = convenienceFeePerTicket * numTickets;
    const handlingFeeTotal = handlingFee; // once per booking
    const taxableServiceFees = convenienceFeeTotal + handlingFeeTotal;
    const gstAmount = (taxableServiceFees * gstRate) / 100;
    const grandTotal = faceValueSubtotal + taxableServiceFees + gstAmount;
    const perTicketEffective = grandTotal / numTickets;
    const faceValueAsPctOfTotal = (faceValueSubtotal / grandTotal) * 100;

    return {
      faceValueSubtotal,
      convenienceFeeTotal,
      handlingFeeTotal,
      gstAmount,
      grandTotal,
      perTicketEffective,
      faceValueAsPctOfTotal,
    };
  }, [faceValue, numTickets, convenienceFeePerTicket, handlingFee, gstRate]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Ticket face value (₹ per ticket)</label>
          <input type="number" min="0" value={faceValue} onChange={(e) => setFaceValue(+e.target.value || 0)} className="calc-input" placeholder="2500" />
          <p className="text-xs text-gray-500 mt-1">As shown on franchise / BookMyShow listing</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Number of tickets</label>
          <input type="number" min="1" max="10" value={numTickets} onChange={(e) => setNumTickets(Math.max(1, Math.min(10, +e.target.value || 1)))} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Convenience fee (per ticket)</label>
          <input type="number" min="0" value={convenienceFeePerTicket} onChange={(e) => setConvenienceFeePerTicket(+e.target.value || 0)} className="calc-input" placeholder="75" />
          <p className="text-xs text-gray-500 mt-1">BookMyShow ~₹50-100; Paytm Insider ~₹40-80</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Internet handling fee (per booking)</label>
          <input type="number" min="0" value={handlingFee} onChange={(e) => setHandlingFee(+e.target.value || 0)} className="calc-input" placeholder="20" />
          <p className="text-xs text-gray-500 mt-1">Charged ONCE per booking (not per ticket)</p>
        </div>
      </div>

      {/* Quick face-value picker for common stand bands */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <div className="text-xs font-semibold text-blue-800 uppercase mb-2">Quick set face value:</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Cheap-end ₹500", v: 500 },
            { label: "Upper stand ₹1,500", v: 1500 },
            { label: "Mid-tier ₹2,500", v: 2500 },
            { label: "Premium ₹5,000", v: 5000 },
            { label: "Pavilion ₹8,000", v: 8000 },
            { label: "VIP ₹15,000", v: 15000 },
          ].map((b) => (
            <button
              key={b.v}
              onClick={() => setFaceValue(b.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${faceValue === b.v ? "bg-indigo-600 text-white" : "bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50"}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          {/* Headline grand total */}
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest">
              You&apos;ll pay (card debit amount)
            </div>
            <div className="text-5xl sm:text-6xl font-extrabold text-emerald-700 mt-2">
              {fmt(result.grandTotal)}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Effective <strong>{fmt(result.perTicketEffective)}</strong> per ticket
              <span className="text-gray-400"> · {result.faceValueAsPctOfTotal.toFixed(1)}% face value · {(100 - result.faceValueAsPctOfTotal).toFixed(1)}% fees+GST</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <h3 className="bg-gray-50 px-4 py-3 font-bold text-gray-800 border-b border-gray-100">Breakdown</h3>
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between p-3">
                <span className="text-gray-700">
                  Face value · {fmt(faceValue)} × {numTickets} ticket{numTickets !== 1 ? "s" : ""}
                </span>
                <span className="font-bold text-gray-900">{fmt(result.faceValueSubtotal)}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-gray-700">
                  Convenience fee · {fmt(convenienceFeePerTicket)} × {numTickets}
                </span>
                <span className="font-semibold text-gray-700">+ {fmt(result.convenienceFeeTotal)}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-gray-700">Internet handling fee (one-time)</span>
                <span className="font-semibold text-gray-700">+ {fmt(result.handlingFeeTotal)}</span>
              </div>
              <div className="flex justify-between p-3 bg-amber-50">
                <span className="text-gray-700">GST @ {gstRate}% on fees</span>
                <span className="font-semibold text-amber-700">+ {fmt(result.gstAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-emerald-50 border-t-2 border-emerald-200">
                <span className="font-bold text-gray-900">Grand total</span>
                <span className="font-extrabold text-emerald-700">{fmt(result.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Comparison: face value alone vs total */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="text-sm text-rose-900 leading-relaxed">
              <strong>You&apos;re paying {fmt(result.grandTotal - result.faceValueSubtotal)} extra</strong> beyond ticket face value (fees + GST). That&apos;s {((result.grandTotal / result.faceValueSubtotal - 1) * 100).toFixed(1)}% on top of the listed ticket price.
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 leading-relaxed">
        <strong>Note:</strong> GST is charged at 18% on the SERVICE fees (convenience + handling), not on the ticket face value itself — the franchise has already paid GST/entertainment tax embedded in face value (CGST 2017 rules). Convenience fee varies by platform and ticket band. This calculator gives a typical estimate; check the final checkout total before paying. Some matches add a separate platform fee (~₹10-15) which you can include in handling.
      </div>
    </div>
  );
}
