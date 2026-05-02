"use client";
import { useState, useMemo } from "react";

/**
 * MSME / Udyam Registration Eligibility Checker
 *
 * MSMEs (Micro, Small, Medium Enterprises) are classified by the Ministry of
 * MSME based on TWO criteria — investment in plant & machinery AND annual
 * turnover. The enterprise must satisfy BOTH limits to qualify for a category;
 * exceeding either pushes it to the next higher category.
 *
 * VERIFIED THRESHOLDS (current notification — w.e.f. 1 July 2020):
 *
 *  Category | Investment (P&M)   | Turnover
 *  ---------|--------------------|--------------------
 *  Micro    | ≤ ₹1 crore         | ≤ ₹5 crore
 *  Small    | ≤ ₹10 crore        | ≤ ₹50 crore
 *  Medium   | ≤ ₹50 crore        | ≤ ₹250 crore
 *
 * BUDGET 2025 PROPOSED (effective from notification date — verify with
 * latest gazette before filing):
 *
 *  Category | Investment (P&M)   | Turnover
 *  ---------|--------------------|--------------------
 *  Micro    | ≤ ₹2.5 crore       | ≤ ₹10 crore
 *  Small    | ≤ ₹25 crore        | ≤ ₹100 crore
 *  Medium   | ≤ ₹125 crore       | ≤ ₹500 crore
 *
 * UDYAM REGISTRATION:
 *  - Free, online, paper-less self-declaration at udyamregistration.gov.in
 *  - Both manufacturing AND service enterprises eligible (one common
 *    classification w.e.f. 1 Jul 2020)
 *  - Required documents: Aadhaar (proprietor / Karta / managing partner),
 *    PAN, GSTIN if applicable
 *  - Permanent registration number (URN) issued instantly
 *  - Auto-classification based on ITR + GST data → no need to upload P&M
 *    or turnover proofs
 *
 * KEY BENEFITS UPON REGISTRATION:
 *  - Priority Sector Lending (PSL): collateral-free loans up to ₹5 cr
 *    via CGTMSE (Credit Guarantee Trust)
 *  - 50% subsidy on patent and trademark filings
 *  - Reservation for govt procurement (Public Procurement Policy 2012)
 *  - Faster MSME Samadhaan dispute resolution against payment delays
 *  - Interest subvention (2% on prompt repayment of loans)
 *  - Subsidies on ISO certification, electricity bills (state-wise)
 *
 * EXCLUDED entities (cannot register as MSME):
 *  - Trading enterprises (retail/wholesale only — no manufacturing/service)
 *    EXCEPT registered as retail/wholesale traders under Aug 2024 amendment
 *  - Holding/subsidiary structures violating PRINCIPLE of independence
 *
 * Sources:
 *  - https://udyamregistration.gov.in (official MSME ministry portal)
 *  - https://msme.gov.in (Ministry of MSME)
 *  - Notification S.O. 2119(E) dated 26 June 2020 — current thresholds
 *  - Budget 2025 — proposed 2.5x investment, 2x turnover increase
 *  - https://razorpay.com/learn/msme-india-registration/
 *  - https://cleartax.in/s/msme-registration-india
 */

type Category = "micro" | "small" | "medium" | "outside";

const CURRENT_THRESHOLDS = {
  micro: { investment: 10_000_000, turnover: 50_000_000 }, // 1 cr, 5 cr
  small: { investment: 100_000_000, turnover: 500_000_000 }, // 10 cr, 50 cr
  medium: { investment: 500_000_000, turnover: 2_500_000_000 }, // 50 cr, 250 cr
};

const BUDGET_2025_THRESHOLDS = {
  micro: { investment: 25_000_000, turnover: 100_000_000 }, // 2.5 cr, 10 cr
  small: { investment: 250_000_000, turnover: 1_000_000_000 }, // 25 cr, 100 cr
  medium: { investment: 1_250_000_000, turnover: 5_000_000_000 }, // 125 cr, 500 cr
};

function classify(
  investment: number,
  turnover: number,
  thresholds: typeof CURRENT_THRESHOLDS
): Category {
  if (
    investment <= thresholds.micro.investment &&
    turnover <= thresholds.micro.turnover
  )
    return "micro";
  if (
    investment <= thresholds.small.investment &&
    turnover <= thresholds.small.turnover
  )
    return "small";
  if (
    investment <= thresholds.medium.investment &&
    turnover <= thresholds.medium.turnover
  )
    return "medium";
  return "outside";
}

const CAT_LABEL: Record<Category, string> = {
  micro: "Micro Enterprise",
  small: "Small Enterprise",
  medium: "Medium Enterprise",
  outside: "Outside MSME (large enterprise)",
};

const CAT_COLOR: Record<Category, string> = {
  micro: "from-emerald-500 to-teal-600",
  small: "from-blue-500 to-indigo-600",
  medium: "from-purple-500 to-pink-600",
  outside: "from-gray-500 to-gray-700",
};

export default function MsmeEligibilityChecker() {
  const [investment, setInvestment] = useState<number>(20_000_000); // ₹2 cr
  const [turnover, setTurnover] = useState<number>(120_000_000); // ₹12 cr
  const [thresholdSet, setThresholdSet] = useState<"current" | "budget2025">(
    "current"
  );

  const result = useMemo(() => {
    if (investment < 0 || turnover < 0) return null;
    const thresholds =
      thresholdSet === "current" ? CURRENT_THRESHOLDS : BUDGET_2025_THRESHOLDS;
    const category = classify(investment, turnover, thresholds);

    return {
      category,
      thresholds,
      categoryLabel: CAT_LABEL[category],
      isMsme: category !== "outside",
    };
  }, [investment, turnover, thresholdSet]);

  const fmtCr = (n: number) => `₹${(n / 1e7).toFixed(2)} crore`;

  return (
    <div className="space-y-6">
      <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏭 Udyam / MSME Registration Eligibility Checker
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Threshold Set
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setThresholdSet("current")}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              thresholdSet === "current"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Current (S.O. 2119(E), 2020)
          </button>
          <button
            onClick={() => setThresholdSet("budget2025")}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              thresholdSet === "budget2025"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Budget 2025 Proposed (2.5×/2× higher)
          </button>
        </div>
        <p className="text-xs text-amber-700 mt-2">
          ⚠ Budget 2025 thresholds become effective only after notification.
          For now, current thresholds apply. Verify with{" "}
          <a
            href="https://udyamregistration.gov.in"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            udyamregistration.gov.in
          </a>{" "}
          before filing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Investment in Plant &amp; Machinery / Equipment
            </label>
            <span className="text-sm font-bold text-blue-600">
              {fmtCr(investment)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1_500_000_000}
            step={500_000}
            value={investment}
            onChange={(e) => setInvestment(+e.target.value)}
            className="w-full"
          />
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(+e.target.value || 0)}
            className="calc-input mt-2"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Annual Turnover
            </label>
            <span className="text-sm font-bold text-blue-600">
              {fmtCr(turnover)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={6_000_000_000}
            step={1_000_000}
            value={turnover}
            onChange={(e) => setTurnover(+e.target.value)}
            className="w-full"
          />
          <input
            type="number"
            value={turnover}
            onChange={(e) => setTurnover(+e.target.value || 0)}
            className="calc-input mt-2"
          />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div
            className={`bg-gradient-to-r ${
              CAT_COLOR[result.category]
            } rounded-2xl p-6 text-white`}
          >
            <div className="text-sm font-medium opacity-80 mb-1">
              You qualify as
            </div>
            <div className="text-4xl font-bold">{result.categoryLabel}</div>
            <div className="text-sm opacity-80 mt-2">
              {result.isMsme
                ? "Eligible for Udyam Registration & all MSME benefits"
                : "Not eligible — exceeds Medium Enterprise thresholds"}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-right p-3 font-semibold text-gray-700">
                    Investment ≤
                  </th>
                  <th className="text-right p-3 font-semibold text-gray-700">
                    Turnover ≤
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Your Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {(["micro", "small", "medium"] as const).map((cat) => (
                  <tr
                    key={cat}
                    className={`border-t ${
                      result.category === cat ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-3 font-semibold text-gray-900 capitalize">
                      {cat}
                    </td>
                    <td className="p-3 text-right text-gray-700">
                      {fmtCr(result.thresholds[cat].investment)}
                    </td>
                    <td className="p-3 text-right text-gray-700">
                      {fmtCr(result.thresholds[cat].turnover)}
                    </td>
                    <td className="p-3 text-center">
                      {result.category === cat ? (
                        <span className="text-emerald-700 font-bold">
                          ✓ This is you
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.isMsme && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 leading-relaxed">
              <div className="font-bold mb-2">
                🎉 Benefits available after Udyam Registration:
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Collateral-free loans up to ₹5 crore via CGTMSE (Credit
                  Guarantee Trust for Micro &amp; Small Enterprises)
                </li>
                <li>Priority Sector Lending (PSL) status with banks</li>
                <li>2% interest subvention on prompt loan repayment</li>
                <li>50% subsidy on patent / trademark filing fees</li>
                <li>
                  Reservation for govt procurement (Public Procurement Policy)
                </li>
                <li>
                  MSME Samadhaan: faster dispute resolution against payment
                  delays from buyers (45-day mandate)
                </li>
                <li>Subsidies on ISO certification, electricity bills (state-wise)</li>
                <li>Stamp duty &amp; registration fee concessions in many states</li>
                <li>Easy bank-account opening, IEC code application</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>How to register on Udyam Portal (FREE):</strong>
        <ol className="list-decimal list-inside ml-2 space-y-1">
          <li>
            Go to <strong>udyamregistration.gov.in</strong> (the OFFICIAL
            portal — never pay any third-party).
          </li>
          <li>
            Enter Aadhaar of proprietor / Karta / managing partner / director.
          </li>
          <li>
            OTP verification on Aadhaar-linked mobile.
          </li>
          <li>
            PAN of business + GSTIN (if applicable).
          </li>
          <li>
            Self-declare investment in P&amp;M and turnover (auto-pulled from
            ITR &amp; GST data).
          </li>
          <li>
            Receive permanent <strong>Udyam Registration Number (URN)</strong>{" "}
            and certificate.
          </li>
        </ol>
        <p className="mt-2">
          Existing Udyog Aadhaar / EM-II registrations require migration to
          Udyam (compulsory since 1 July 2020).
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
        <span className="mr-1">⚠️</span>
        <strong>Beware of fake portals:</strong> the official Udyam
        registration is FREE. Many lookalike portals charge ₹500–₹3,000.
        Only{" "}
        <a
          href="https://udyamregistration.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-amber-700 hover:text-amber-900"
        >
          udyamregistration.gov.in
        </a>{" "}
        is authentic — controlled by Ministry of MSME, GoI.
      </div>
    </div>
  );
}
