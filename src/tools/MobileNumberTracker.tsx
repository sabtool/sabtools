"use client";
import { useState, useMemo } from "react";

interface OperatorInfo {
  operator: string;
  circle: string;
  network: string;
}

// Simplified prefix database for Indian mobile numbers
const PREFIX_DB: Record<string, OperatorInfo> = {
  // Jio prefixes
  "7000": { operator: "Reliance Jio", circle: "Madhya Pradesh", network: "4G/5G" },
  "7001": { operator: "Reliance Jio", circle: "Madhya Pradesh", network: "4G/5G" },
  "7002": { operator: "Reliance Jio", circle: "Assam", network: "4G/5G" },
  "7003": { operator: "Reliance Jio", circle: "West Bengal", network: "4G/5G" },
  "7004": { operator: "Reliance Jio", circle: "Bihar", network: "4G/5G" },
  "7005": { operator: "Reliance Jio", circle: "Himachal Pradesh", network: "4G/5G" },
  "7006": { operator: "Reliance Jio", circle: "Jammu & Kashmir", network: "4G/5G" },
  "7007": { operator: "Reliance Jio", circle: "Uttar Pradesh East", network: "4G/5G" },
  "7008": { operator: "Reliance Jio", circle: "Odisha", network: "4G/5G" },
  "7009": { operator: "Reliance Jio", circle: "Punjab", network: "4G/5G" },
  "7010": { operator: "Reliance Jio", circle: "Tamil Nadu", network: "4G/5G" },
  "7011": { operator: "Reliance Jio", circle: "Delhi", network: "4G/5G" },
  "7012": { operator: "Reliance Jio", circle: "Kerala", network: "4G/5G" },
  "7013": { operator: "Reliance Jio", circle: "Andhra Pradesh", network: "4G/5G" },
  "7014": { operator: "Reliance Jio", circle: "Haryana", network: "4G/5G" },
  "7015": { operator: "Reliance Jio", circle: "Haryana", network: "4G/5G" },
  "7016": { operator: "Reliance Jio", circle: "Gujarat", network: "4G/5G" },
  "7017": { operator: "Reliance Jio", circle: "Uttarakhand", network: "4G/5G" },
  "7018": { operator: "Reliance Jio", circle: "Himachal Pradesh", network: "4G/5G" },
  "7019": { operator: "Reliance Jio", circle: "Karnataka", network: "4G/5G" },
  "7020": { operator: "Reliance Jio", circle: "Maharashtra", network: "4G/5G" },
  "7021": { operator: "Reliance Jio", circle: "Mumbai", network: "4G/5G" },
  "7022": { operator: "Reliance Jio", circle: "Karnataka", network: "4G/5G" },
  "7023": { operator: "Reliance Jio", circle: "Rajasthan", network: "4G/5G" },
  // Airtel prefixes
  "7025": { operator: "Bharti Airtel", circle: "Kerala", network: "4G/5G" },
  "7042": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "7043": { operator: "Bharti Airtel", circle: "Gujarat", network: "4G/5G" },
  "7045": { operator: "Bharti Airtel", circle: "Mumbai", network: "4G/5G" },
  "7065": { operator: "Bharti Airtel", circle: "Uttar Pradesh West", network: "4G/5G" },
  "7204": { operator: "Bharti Airtel", circle: "Karnataka", network: "4G/5G" },
  "7259": { operator: "Bharti Airtel", circle: "Karnataka", network: "4G/5G" },
  "7275": { operator: "Bharti Airtel", circle: "Uttar Pradesh East", network: "4G/5G" },
  "7303": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "7338": { operator: "Bharti Airtel", circle: "Tamil Nadu", network: "4G/5G" },
  "7339": { operator: "Bharti Airtel", circle: "Tamil Nadu", network: "4G/5G" },
  "7348": { operator: "Bharti Airtel", circle: "Jharkhand", network: "4G/5G" },
  "7406": { operator: "Bharti Airtel", circle: "Karnataka", network: "4G/5G" },
  "7411": { operator: "Bharti Airtel", circle: "Tamil Nadu", network: "4G/5G" },
  "8010": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "8130": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "8178": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "8447": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "8448": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "9810": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "9811": { operator: "Bharti Airtel", circle: "Delhi", network: "4G/5G" },
  "9812": { operator: "Bharti Airtel", circle: "Haryana", network: "4G/5G" },
  "9813": { operator: "Bharti Airtel", circle: "Haryana", network: "4G/5G" },
  "9844": { operator: "Bharti Airtel", circle: "Karnataka", network: "4G/5G" },
  "9845": { operator: "Bharti Airtel", circle: "Karnataka", network: "4G/5G" },
  "9900": { operator: "Bharti Airtel", circle: "Karnataka", network: "4G/5G" },
  "9901": { operator: "Bharti Airtel", circle: "Karnataka", network: "4G/5G" },
  // Vi (Vodafone Idea)
  "7024": { operator: "Vi (Vodafone Idea)", circle: "Madhya Pradesh", network: "4G" },
  "7030": { operator: "Vi (Vodafone Idea)", circle: "Maharashtra", network: "4G" },
  "7039": { operator: "Vi (Vodafone Idea)", circle: "Maharashtra", network: "4G" },
  "7041": { operator: "Vi (Vodafone Idea)", circle: "Delhi", network: "4G" },
  "7044": { operator: "Vi (Vodafone Idea)", circle: "Kolkata", network: "4G" },
  "7506": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "7507": { operator: "Vi (Vodafone Idea)", circle: "Maharashtra", network: "4G" },
  "8097": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "8108": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "8149": { operator: "Vi (Vodafone Idea)", circle: "Maharashtra", network: "4G" },
  "8169": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "9820": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "9821": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "9819": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "9892": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  "9833": { operator: "Vi (Vodafone Idea)", circle: "Mumbai", network: "4G" },
  // BSNL
  "9415": { operator: "BSNL", circle: "Uttar Pradesh East", network: "4G" },
  "9449": { operator: "BSNL", circle: "Karnataka", network: "4G" },
  "9447": { operator: "BSNL", circle: "Kerala", network: "4G" },
  "9448": { operator: "BSNL", circle: "Karnataka", network: "4G" },
  "9435": { operator: "BSNL", circle: "Assam", network: "4G" },
  "9436": { operator: "BSNL", circle: "North East", network: "4G" },
  "9440": { operator: "BSNL", circle: "Andhra Pradesh", network: "4G" },
  "9441": { operator: "BSNL", circle: "Andhra Pradesh", network: "4G" },
  "9442": { operator: "BSNL", circle: "Tamil Nadu", network: "4G" },
  "9443": { operator: "BSNL", circle: "Tamil Nadu", network: "4G" },
  "9446": { operator: "BSNL", circle: "Kerala", network: "4G" },
  "9434": { operator: "BSNL", circle: "West Bengal", network: "4G" },
  "9456": { operator: "BSNL", circle: "Uttarakhand", network: "4G" },
  "9457": { operator: "BSNL", circle: "Uttar Pradesh West", network: "4G" },
  "9461": { operator: "BSNL", circle: "Rajasthan", network: "4G" },
  "9462": { operator: "BSNL", circle: "Rajasthan", network: "4G" },
  // MTNL
  "9869": { operator: "MTNL", circle: "Mumbai", network: "4G" },
  "9868": { operator: "MTNL", circle: "Delhi", network: "4G" },
};

// Fallback detection by range
function detectByRange(prefix: string): OperatorInfo | null {
  const num = parseInt(prefix);
  // Jio general ranges
  if (num >= 6200 && num <= 6299) return { operator: "Reliance Jio", circle: "Multiple Circles", network: "4G/5G" };
  if (num >= 8580 && num <= 8589) return { operator: "Reliance Jio", circle: "Multiple Circles", network: "4G/5G" };
  if (num >= 8590 && num <= 8599) return { operator: "Reliance Jio", circle: "Multiple Circles", network: "4G/5G" };
  // Airtel ranges
  if (num >= 9800 && num <= 9819) return { operator: "Bharti Airtel", circle: "Multiple Circles", network: "4G/5G" };
  if (num >= 9840 && num <= 9849) return { operator: "Bharti Airtel", circle: "Multiple Circles", network: "4G/5G" };
  // Vi ranges
  if (num >= 9820 && num <= 9839) return { operator: "Vi (Vodafone Idea)", circle: "Multiple Circles", network: "4G" };
  // BSNL ranges
  if (num >= 9400 && num <= 9469) return { operator: "BSNL", circle: "Multiple Circles", network: "4G" };
  return null;
}

export default function MobileNumberTracker() {
  const [number, setNumber] = useState("");

  const cleanNumber = number.replace(/\D/g, "").slice(0, 10);
  const prefix = cleanNumber.slice(0, 4);

  const result = useMemo(() => {
    if (cleanNumber.length < 4) return null;
    const exact = PREFIX_DB[prefix];
    if (exact) return exact;
    return detectByRange(prefix);
  }, [cleanNumber, prefix]);

  const isValid = cleanNumber.length === 10;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter 10-digit Indian Mobile Number</label>
        <input
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="9876543210"
          maxLength={12}
          className="calc-input"
        />
        {cleanNumber.length > 0 && cleanNumber.length < 10 && (
          <p className="text-xs text-gray-400 mt-1">{10 - cleanNumber.length} more digits needed</p>
        )}
      </div>

      {cleanNumber.length >= 4 && (
        <div className="space-y-5">
          {result ? (
            <>
              {/* Operator Info */}
              <div className="result-card">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Number Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Telecom Operator</p>
                    <p className="text-lg font-bold text-gray-800">{result.operator}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Telecom Circle / State</p>
                    <p className="text-lg font-bold text-gray-800">{result.circle}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Network Type</p>
                    <p className="text-lg font-bold text-indigo-600">{result.network}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Number</p>
                    <p className="text-lg font-bold text-gray-800 font-mono">{cleanNumber || prefix + "XXXXXX"}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="result-card">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Status</h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-700">
                    {isValid ? "Valid 10-digit Indian mobile number" : "Partial number entered"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="result-card">
              <p className="text-sm text-gray-600">Could not identify operator for prefix <span className="font-mono font-bold">{prefix}</span>. This prefix may be from a newer allocation or number portability.</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="result-card bg-yellow-50">
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Note:</span> Results are based on original number allocation. Due to Mobile Number Portability (MNP), the actual operator may differ. This tool shows the originally assigned operator and circle.
            </p>
          </div>

          {/* Indian Telecom Overview */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Indian Telecom Operators</h3>
            <div className="space-y-2">
              {[
                { name: "Reliance Jio", subs: "450M+", tech: "4G VoLTE / 5G", color: "bg-blue-100 text-blue-800" },
                { name: "Bharti Airtel", subs: "380M+", tech: "4G / 5G", color: "bg-red-100 text-red-800" },
                { name: "Vi (Vodafone Idea)", subs: "230M+", tech: "4G", color: "bg-purple-100 text-purple-800" },
                { name: "BSNL", subs: "85M+", tech: "4G", color: "bg-green-100 text-green-800" },
                { name: "MTNL", subs: "3M+", tech: "4G", color: "bg-orange-100 text-orange-800" },
              ].map((op, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${op.color}`}>{op.name}</span>
                  <span className="text-xs text-gray-500">{op.subs} subscribers</span>
                  <span className="text-xs text-gray-600 font-medium">{op.tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
