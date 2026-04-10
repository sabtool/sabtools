"use client";
import { useState, useMemo } from "react";

export default function EighthPayCommissionCalculator() {
  const [basicPay, setBasicPay] = useState("");
  const [daPercent, setDaPercent] = useState("53");
  const [fitmentFactor, setFitmentFactor] = useState("2.86");
  const [payLevel, setPayLevel] = useState("10");
  const [cityType, setCityType] = useState("X");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const fmtPercent = (n: number) => n.toFixed(1) + "%";

  const result = useMemo(() => {
    const basic = parseFloat(basicPay);
    const da = parseFloat(daPercent);
    const ff = parseFloat(fitmentFactor);
    const level = parseInt(payLevel);
    if (!basic || basic <= 0 || isNaN(da) || !ff || !level) return null;

    // Current salary (7th CPC)
    const currentDA = basic * (da / 100);
    const currentGross = basic + currentDA;

    // New salary (8th CPC)
    const newBasic = Math.round(basic * ff);
    const newDA = 0; // DA resets to 0% after new CPC

    // HRA based on city type
    const hraPercent = cityType === "X" ? 27 : cityType === "Y" ? 18 : 9;
    const newHRA = Math.round(newBasic * (hraPercent / 100));

    // Transport Allowance based on pay level (DA is 0% on new basic)
    const transportBase = level >= 9 ? 7200 : 3600;
    const newTransport = transportBase; // DA on transport = 0% since new DA is 0%

    // New Gross
    const newGross = newBasic + newDA + newHRA + newTransport;

    // Increase
    const salaryIncrease = newGross - currentGross;
    const percentIncrease = (salaryIncrease / currentGross) * 100;

    return {
      // Current (7th CPC)
      currentBasic: basic,
      currentDA,
      currentDAPercent: da,
      currentGross,
      // New (8th CPC)
      newBasic,
      newDA,
      newHRA,
      hraPercent,
      newTransport,
      transportBase,
      newGross,
      // Comparison
      salaryIncrease,
      percentIncrease,
      fitmentUsed: ff,
      levelUsed: level,
    };
  }, [basicPay, daPercent, fitmentFactor, payLevel, cityType]);

  const payLevels = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>8th Pay Commission Calculator:</strong> The 8th Central Pay Commission is expected to recommend a fitment factor to revise salaries of central government employees. This calculator estimates your new salary based on expected fitment factors.
        <br />
        <strong>Note:</strong> DA resets to 0% after each new Pay Commission. HRA and Transport Allowance are calculated on the new basic pay.
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="basicPay" className="text-sm font-semibold text-gray-700 block mb-2">Current Basic Pay (₹)</label>
          <input
            id="basicPay"
            type="number"
            placeholder="e.g. 56100"
            value={basicPay}
            onChange={(e) => setBasicPay(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label htmlFor="daPercent" className="text-sm font-semibold text-gray-700 block mb-2">Current DA (%)</label>
          <input
            id="daPercent"
            type="number"
            placeholder="e.g. 53"
            value={daPercent}
            onChange={(e) => setDaPercent(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label htmlFor="fitmentFactor" className="text-sm font-semibold text-gray-700 block mb-2">Expected Fitment Factor</label>
          <select
            id="fitmentFactor"
            value={fitmentFactor}
            onChange={(e) => setFitmentFactor(e.target.value)}
            className="calc-input"
          >
            <option value="2.28">2.28x (Conservative)</option>
            <option value="2.57">2.57x (Same as 7th CPC)</option>
            <option value="2.86">2.86x (Most Expected)</option>
            <option value="3.00">3.00x (Optimistic)</option>
          </select>
        </div>
        <div>
          <label htmlFor="payLevel" className="text-sm font-semibold text-gray-700 block mb-2">Pay Level</label>
          <select
            id="payLevel"
            value={payLevel}
            onChange={(e) => setPayLevel(e.target.value)}
            className="calc-input"
          >
            {payLevels.map((l) => (
              <option key={l} value={l}>
                Level {l} {l <= 5 ? "(Group C)" : l <= 8 ? "(Group B)" : l <= 13 ? "(Group A)" : "(Senior)"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cityType" className="text-sm font-semibold text-gray-700 block mb-2">City Classification (for HRA)</label>
          <select
            id="cityType"
            value={cityType}
            onChange={(e) => setCityType(e.target.value)}
            className="calc-input"
          >
            <option value="X">X (Metro - 27% HRA)</option>
            <option value="Y">Y (Other Cities - 18% HRA)</option>
            <option value="Z">Z (Small Towns - 9% HRA)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Salary Increase Highlight */}
          <div className="result-card text-center">
            <div className="text-sm text-gray-500">Expected Monthly Salary Increase</div>
            <div className="text-4xl font-extrabold text-green-600 mt-2">{fmt(result.salaryIncrease)}</div>
            <div className="text-sm font-semibold text-green-500 mt-1">{fmtPercent(result.percentIncrease)} increase with {result.fitmentUsed}x fitment factor</div>
          </div>

          {/* Side-by-side comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current - 7th CPC */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-600 text-center mb-4 uppercase tracking-wide">Current (7th CPC)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-sm text-gray-600">Basic Pay</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(result.currentBasic)}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-sm text-gray-600">DA ({result.currentDAPercent}%)</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(result.currentDA)}</span>
                </div>
                <div className="border-t-2 border-dashed border-gray-300 pt-3">
                  <div className="flex justify-between items-center bg-indigo-50 rounded-lg p-3">
                    <span className="text-sm font-bold text-indigo-700">Gross Salary</span>
                    <span className="text-lg font-extrabold text-indigo-600">{fmt(result.currentGross)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* New - 8th CPC */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h3 className="text-sm font-bold text-green-700 text-center mb-4 uppercase tracking-wide">Expected (8th CPC)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-sm text-gray-600">New Basic Pay</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(result.newBasic)}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-sm text-gray-600">DA (0% - Reset)</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(result.newDA)}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-sm text-gray-600">HRA ({result.hraPercent}%)</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(result.newHRA)}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-sm text-gray-600">Transport ({fmt(result.transportBase)}/mo)</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(result.newTransport)}</span>
                </div>
                <div className="border-t-2 border-dashed border-green-300 pt-3">
                  <div className="flex justify-between items-center bg-green-100 rounded-lg p-3">
                    <span className="text-sm font-bold text-green-700">Gross Salary</span>
                    <span className="text-lg font-extrabold text-green-600">{fmt(result.newGross)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th className="text-right">7th CPC (Current)</th>
                  <th className="text-right">8th CPC (Expected)</th>
                  <th className="text-right">Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Pay</td>
                  <td className="text-right">{fmt(result.currentBasic)}</td>
                  <td className="text-right">{fmt(result.newBasic)}</td>
                  <td className="text-right text-green-600 font-semibold">{fmt(result.newBasic - result.currentBasic)}</td>
                </tr>
                <tr>
                  <td>Dearness Allowance</td>
                  <td className="text-right">{fmt(result.currentDA)}</td>
                  <td className="text-right">{fmt(result.newDA)}</td>
                  <td className="text-right text-red-500 font-semibold">{fmt(result.newDA - result.currentDA)}</td>
                </tr>
                <tr>
                  <td>HRA ({result.hraPercent}% - {cityType === "X" ? "Metro" : cityType === "Y" ? "Other City" : "Small Town"})</td>
                  <td className="text-right">-</td>
                  <td className="text-right">{fmt(result.newHRA)}</td>
                  <td className="text-right text-green-600 font-semibold">{fmt(result.newHRA)}</td>
                </tr>
                <tr>
                  <td>Transport Allowance (Level {result.levelUsed})</td>
                  <td className="text-right">-</td>
                  <td className="text-right">{fmt(result.newTransport)}</td>
                  <td className="text-right text-green-600 font-semibold">{fmt(result.newTransport)}</td>
                </tr>
                <tr className="font-bold bg-gray-50">
                  <td>Gross Salary</td>
                  <td className="text-right">{fmt(result.currentGross)}</td>
                  <td className="text-right">{fmt(result.newGross)}</td>
                  <td className="text-right text-green-600">{fmt(result.salaryIncrease)}</td>
                </tr>
                <tr className="font-bold text-green-600 bg-green-50">
                  <td>Total Increase</td>
                  <td className="text-right" colSpan={2}></td>
                  <td className="text-right">{fmt(result.salaryIncrease)} ({fmtPercent(result.percentIncrease)})</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Disclaimer:</strong> This is an estimated calculation based on expected fitment factors. Actual salary revision will depend on the official recommendations of the 8th Central Pay Commission. DA, HRA, and Transport Allowance rates may vary in the final implementation.
          </div>
        </div>
      )}
    </div>
  );
}
