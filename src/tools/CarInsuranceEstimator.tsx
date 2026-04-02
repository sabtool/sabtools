"use client";
import { useState, useMemo } from "react";

export default function CarInsuranceEstimator() {
  const [carValue, setCarValue] = useState(1000000);
  const [carAge, setCarAge] = useState(2);
  const [insuranceType, setInsuranceType] = useState<"comprehensive" | "thirdparty">("comprehensive");
  const [cityTier, setCityTier] = useState<"metro" | "nonmetro">("metro");
  const [fuelType, setFuelType] = useState<"petrol" | "diesel" | "electric" | "cng">("petrol");
  const [engineCC, setEngineCC] = useState(1200);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (carValue <= 0) return null;

    // IDV Calculation: 5% depreciation per year
    const depRates = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const depPercent = carAge < depRates.length ? depRates[carAge] : 50;
    const idv = carValue * (1 - depPercent / 100);

    // Third-party premium by engine CC (IRDAI fixed rates)
    let tpPremium = 0;
    if (engineCC <= 1000) tpPremium = 2094;
    else if (engineCC <= 1500) tpPremium = 3416;
    else tpPremium = 7897;

    if (fuelType === "electric") tpPremium = 2094; // Lower for EV

    // Own damage premium estimate (percentage of IDV)
    let odRate = 0;
    if (carAge <= 1) odRate = cityTier === "metro" ? 2.8 : 2.5;
    else if (carAge <= 3) odRate = cityTier === "metro" ? 3.2 : 2.8;
    else if (carAge <= 5) odRate = cityTier === "metro" ? 3.5 : 3.0;
    else odRate = cityTier === "metro" ? 4.0 : 3.5;

    if (fuelType === "diesel") odRate += 0.3;
    if (fuelType === "cng") odRate += 0.2;

    const odPremium = idv * (odRate / 100);

    // Comprehensive = OD + TP
    const comprehensivePremium = odPremium + tpPremium;

    // GST 18%
    const gstTP = tpPremium * 0.18;
    const gstComp = comprehensivePremium * 0.18;

    const totalTP = tpPremium + gstTP;
    const totalComp = comprehensivePremium + gstComp;

    return {
      idv, depPercent, tpPremium, odPremium, comprehensivePremium,
      totalTP, totalComp, gstTP, gstComp, odRate,
    };
  }, [carValue, carAge, cityTier, fuelType, engineCC]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Car Ex-Showroom Price</label>
            <input type="number" className="calc-input" value={carValue} onChange={(e) => setCarValue(+e.target.value)} min={0} step={50000} />
            <p className="text-xs text-gray-400 mt-1">{fmt(carValue)}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Car Age (years)</label>
            <input type="number" className="calc-input" value={carAge} onChange={(e) => setCarAge(+e.target.value)} min={0} max={15} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Insurance Type</label>
            <select className="calc-input" value={insuranceType} onChange={(e) => setInsuranceType(e.target.value as typeof insuranceType)}>
              <option value="comprehensive">Comprehensive</option>
              <option value="thirdparty">Third Party Only</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">City</label>
            <select className="calc-input" value={cityTier} onChange={(e) => setCityTier(e.target.value as typeof cityTier)}>
              <option value="metro">Metro (Delhi, Mumbai, etc.)</option>
              <option value="nonmetro">Non-Metro / Tier 2-3</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Fuel Type</label>
            <select className="calc-input" value={fuelType} onChange={(e) => setFuelType(e.target.value as typeof fuelType)}>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG/LPG</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">Engine CC</label>
          <input type="number" className="calc-input" value={engineCC} onChange={(e) => setEngineCC(+e.target.value)} min={600} max={5000} />
        </div>
      </div>

      {result && (
        <>
          <div className="result-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">IDV (Insured Declared Value)</div>
                <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.idv)}</div>
                <div className="text-xs text-gray-400">{result.depPercent}% depreciation</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Third Party Premium</div>
                <div className="text-2xl font-extrabold text-emerald-600">{fmt(result.totalTP)}</div>
                <div className="text-xs text-gray-400">incl. 18% GST</div>
              </div>
              {insuranceType === "comprehensive" && (
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Comprehensive Premium</div>
                  <div className="text-2xl font-extrabold text-purple-600">{fmt(result.totalComp)}</div>
                  <div className="text-xs text-gray-400">incl. 18% GST</div>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500">Component</th>
                    <th className="text-right py-2 px-2 text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {insuranceType === "comprehensive" && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-2">Own Damage Premium (OD @ {result.odRate}%)</td>
                      <td className="text-right py-2 px-2">{fmt(result.odPremium)}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-2">Third Party Premium (TP)</td>
                    <td className="text-right py-2 px-2">{fmt(result.tpPremium)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-2">GST (18%)</td>
                    <td className="text-right py-2 px-2">{fmt(insuranceType === "comprehensive" ? result.gstComp : result.gstTP)}</td>
                  </tr>
                  <tr className="border-b border-gray-200 font-bold">
                    <td className="py-2 px-2">Total Premium</td>
                    <td className="text-right py-2 px-2 text-indigo-600">
                      {fmt(insuranceType === "comprehensive" ? result.totalComp : result.totalTP)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* IDV Depreciation Table */}
          <div className="result-card space-y-3">
            <h3 className="text-lg font-bold text-gray-800">IDV Depreciation Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500">Age</th>
                    <th className="text-center py-2 px-2 text-gray-500">Depreciation</th>
                    <th className="text-right py-2 px-2 text-gray-500">IDV</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((yr) => {
                    const dep = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50][yr];
                    const val = carValue * (1 - dep / 100);
                    return (
                      <tr key={yr} className={`border-b border-gray-100 ${yr === carAge ? "bg-indigo-50 font-bold" : ""}`}>
                        <td className="py-2 px-2">{yr === 0 ? "New" : `${yr} year${yr > 1 ? "s" : ""}`}</td>
                        <td className="text-center py-2 px-2">{dep}%</td>
                        <td className="text-right py-2 px-2">{fmt(val)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 italic">* Estimated values. Actual premium depends on insurer, NCB, add-ons, and claims history.</p>
          </div>
        </>
      )}
    </div>
  );
}
