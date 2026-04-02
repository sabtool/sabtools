"use client";
import { useState, useMemo } from "react";

export default function TollCalculator() {
  const [routeType, setRouteType] = useState<"NH" | "Expressway" | "SH">("NH");
  const [distance, setDistance] = useState(300);
  const [vehicleType, setVehicleType] = useState("car");
  const [returnTrip, setReturnTrip] = useState(false);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  // Average toll rates per km by route type and vehicle type (in Rs)
  const tollRates: Record<string, Record<string, number>> = {
    NH: { car: 1.53, lcv: 2.49, bus: 5.15, truck: 5.15, multiaxle: 8.44, oversized: 10.9 },
    Expressway: { car: 2.0, lcv: 3.2, bus: 6.5, truck: 6.5, multiaxle: 10.5, oversized: 14.0 },
    SH: { car: 1.2, lcv: 2.0, bus: 4.0, truck: 4.0, multiaxle: 6.5, oversized: 8.5 },
  };

  const vehicleLabels: Record<string, string> = {
    car: "Car / Jeep / Van",
    lcv: "LCV (Light Commercial)",
    bus: "Bus / Truck (2 axle)",
    truck: "Truck (3 axle)",
    multiaxle: "Multi-Axle (4-6 axle)",
    oversized: "Oversized Vehicle (7+ axle)",
  };

  const result = useMemo(() => {
    if (distance <= 0) return null;
    const ratePerKm = tollRates[routeType][vehicleType];
    const singleToll = distance * ratePerKm;
    const returnToll = returnTrip ? singleToll * 2 * 0.85 : singleToll; // return trip gets ~15% discount with monthly pass
    const tollPlazas = Math.floor(distance / 60); // approximately one toll every 60km

    return { ratePerKm, singleToll, returnToll, tollPlazas };
  }, [routeType, distance, vehicleType, returnTrip]);

  const expressways = [
    { name: "Mumbai-Pune Expressway", dist: "93 km", car: 295, truck: 465 },
    { name: "Yamuna Expressway", dist: "165 km", car: 415, truck: 1015 },
    { name: "Agra-Lucknow Expressway", dist: "302 km", car: 660, truck: 1830 },
    { name: "Delhi-Meerut Expressway", dist: "82 km", car: 180, truck: 530 },
    { name: "Purvanchal Expressway", dist: "341 km", car: 660, truck: 1570 },
    { name: "Bundelkhand Expressway", dist: "296 km", car: 554, truck: 1445 },
    { name: "Samruddhi Mahamarg (Nagpur-Mumbai)", dist: "701 km", car: 1485, truck: 3430 },
    { name: "Bengaluru-Mysuru Expressway", dist: "118 km", car: 250, truck: 640 },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Route Type</label>
            <select className="calc-input" value={routeType} onChange={(e) => setRouteType(e.target.value as typeof routeType)}>
              <option value="NH">National Highway (NH)</option>
              <option value="Expressway">Expressway</option>
              <option value="SH">State Highway (SH)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Distance (km)</label>
            <input type="number" className="calc-input" value={distance} onChange={(e) => setDistance(+e.target.value)} min={1} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
            <select className="calc-input" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              {Object.entries(vehicleLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={returnTrip} onChange={(e) => setReturnTrip(e.target.checked)} className="w-4 h-4" id="return" />
          <label htmlFor="return" className="text-sm font-semibold text-gray-700">Include Return Trip</label>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Toll</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.singleToll)}</div>
              <div className="text-xs text-gray-400">One way</div>
            </div>
            {returnTrip && (
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Return Trip Total</div>
                <div className="text-2xl font-extrabold text-purple-600">{fmt(result.returnToll)}</div>
                <div className="text-xs text-gray-400">Both ways</div>
              </div>
            )}
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Rate per km</div>
              <div className="text-2xl font-extrabold text-emerald-600">{fmt(result.ratePerKm)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Est. Toll Plazas</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.tollPlazas}</div>
              <div className="text-xs text-gray-400">~1 per 60km</div>
            </div>
          </div>

          {/* Rate Table */}
          <div className="overflow-x-auto">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Toll Rate per km ({routeType})</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-gray-500">Vehicle</th>
                  <th className="text-center py-2 px-2 text-gray-500">Rate/km</th>
                  <th className="text-right py-2 px-2 text-gray-500">Est. for {distance}km</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tollRates[routeType]).map(([key, rate]) => (
                  <tr key={key} className={`border-b border-gray-100 ${key === vehicleType ? "bg-indigo-50 font-bold" : ""}`}>
                    <td className="py-2 px-2">{vehicleLabels[key]}</td>
                    <td className="text-center py-2 px-2">{fmt(rate)}</td>
                    <td className="text-right py-2 px-2">{fmt(rate * distance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Major Expressway Tolls */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Major Indian Expressway Tolls (Reference)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">Expressway</th>
                <th className="text-center py-2 px-2 text-gray-500">Distance</th>
                <th className="text-center py-2 px-2 text-gray-500">Car Toll</th>
                <th className="text-center py-2 px-2 text-gray-500">Truck Toll</th>
              </tr>
            </thead>
            <tbody>
              {expressways.map((e) => (
                <tr key={e.name} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{e.name}</td>
                  <td className="text-center py-2 px-2">{e.dist}</td>
                  <td className="text-center py-2 px-2">{fmt(e.car)}</td>
                  <td className="text-center py-2 px-2">{fmt(e.truck)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 italic">* Tolls are approximate single-trip values. FASTag mandatory at all toll plazas. Return within 12 hours gets discount on some routes.</p>
      </div>
    </div>
  );
}
