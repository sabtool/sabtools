"use client";
import { useState, useCallback } from "react";

interface PostOffice {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

interface ApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

const STATE_PIN_RANGES: { state: string; range: string }[] = [
  { state: "Delhi", range: "110001 - 110097" },
  { state: "Haryana", range: "121001 - 136156" },
  { state: "Punjab", range: "140001 - 160104" },
  { state: "Himachal Pradesh", range: "171001 - 177601" },
  { state: "Uttar Pradesh", range: "200001 - 285223" },
  { state: "Uttarakhand", range: "246001 - 263680" },
  { state: "Rajasthan", range: "301001 - 345034" },
  { state: "Gujarat", range: "360001 - 396590" },
  { state: "Maharashtra", range: "400001 - 445402" },
  { state: "Goa", range: "403001 - 403806" },
  { state: "Madhya Pradesh", range: "450001 - 488448" },
  { state: "Chhattisgarh", range: "490001 - 497778" },
  { state: "Telangana", range: "500001 - 509412" },
  { state: "Andhra Pradesh", range: "515001 - 535594" },
  { state: "Karnataka", range: "560001 - 591346" },
  { state: "Tamil Nadu", range: "600001 - 643253" },
  { state: "Kerala", range: "670001 - 695615" },
  { state: "West Bengal", range: "700001 - 743711" },
  { state: "Odisha", range: "751001 - 770076" },
  { state: "Assam", range: "781001 - 788931" },
  { state: "Bihar", range: "800001 - 855117" },
  { state: "Jharkhand", range: "825001 - 835325" },
];

export default function IndianPinCodeDirectory() {
  const [pinCode, setPinCode] = useState("");
  const [areaName, setAreaName] = useState("");
  const [searchMode, setSearchMode] = useState<"pin" | "area">("pin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<PostOffice[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchState, setSearchState] = useState("");

  const searchByPin = useCallback(async () => {
    const clean = pinCode.replace(/\D/g, "");
    if (clean.length !== 6) {
      setError("Please enter a valid 6-digit PIN code");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);
    setSearched(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
      const data: ApiResponse[] = await res.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice) {
        setResults(data[0].PostOffice);
      } else {
        setError("No results found for this PIN code. Please check and try again.");
      }
    } catch {
      setError("Unable to fetch data. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [pinCode]);

  const searchByArea = useCallback(async () => {
    if (areaName.trim().length < 3) {
      setError("Please enter at least 3 characters of the area/post office name");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);
    setSearched(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(areaName.trim())}`);
      const data: ApiResponse[] = await res.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice) {
        setResults(data[0].PostOffice);
      } else {
        setError("No post offices found for this area name. Try a different spelling or nearby area.");
      }
    } catch {
      setError("Unable to fetch data. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [areaName]);

  const search = searchMode === "pin" ? searchByPin : searchByArea;

  const filteredStates = searchState
    ? STATE_PIN_RANGES.filter((s) => s.state.toLowerCase().includes(searchState.toLowerCase()))
    : STATE_PIN_RANGES;

  return (
    <div className="space-y-6">
      {/* Search Mode Toggle */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${searchMode === "pin" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => { setSearchMode("pin"); setResults(null); setError(""); setSearched(false); }}
        >
          🔢 Search by PIN Code
        </button>
        <button
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${searchMode === "area" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => { setSearchMode("area"); setResults(null); setError(""); setSearched(false); }}
        >
          📍 Search by Area Name
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">
          {searchMode === "pin" ? "Enter 6-Digit PIN Code" : "Enter Area / Post Office / City Name"}
        </label>
        <div className="flex gap-3">
          {searchMode === "pin" ? (
            <input
              className="calc-input flex-1"
              type="text"
              maxLength={6}
              placeholder="e.g. 110001"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          ) : (
            <input
              className="calc-input flex-1"
              type="text"
              placeholder="e.g. Andheri, Connaught Place, Koramangala"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          )}
          <button className="btn-primary px-8" onClick={search} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </span>
            ) : "Search"}
          </button>
        </div>
        {searchMode === "area" && (
          <p className="text-xs text-gray-400 mt-1">Type area name, locality, village, or post office name to find its PIN code</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="result-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">📍 PIN Code: {results[0].Pincode}</h3>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                {results.length} Post Office{results.length > 1 ? "s" : ""} Found
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">District</div>
                <div className="font-bold text-purple-700 text-sm">{results[0].District}</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">State</div>
                <div className="font-bold text-indigo-700 text-sm">{results[0].State}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">Division</div>
                <div className="font-bold text-blue-700 text-sm">{results[0].Division}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">Region</div>
                <div className="font-bold text-green-700 text-sm">{results[0].Region}</div>
              </div>
            </div>
          </div>

          {/* Post Offices List */}
          <div className="result-card">
            <h4 className="font-bold text-gray-700 mb-3">🏤 Post Offices under PIN {results[0].Pincode}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left p-3 text-gray-600">#</th>
                    <th className="text-left p-3 text-gray-600">Post Office Name</th>
                    <th className="text-left p-3 text-gray-600">Branch Type</th>
                    <th className="text-left p-3 text-gray-600">Delivery</th>
                    <th className="text-left p-3 text-gray-600">Block</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((po, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-indigo-50 transition">
                      <td className="p-3 text-gray-400">{i + 1}</td>
                      <td className="p-3 font-semibold text-gray-800">{po.Name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          po.BranchType === "Head Office" ? "bg-purple-100 text-purple-700" :
                          po.BranchType === "Sub Office" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {po.BranchType}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          po.DeliveryStatus === "Delivery" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {po.DeliveryStatus}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-xs">{po.Block || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Details of First Post Office */}
          <div className="result-card">
            <h4 className="font-bold text-gray-700 mb-3">📋 Complete Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">PIN Code</span>
                <span className="font-bold text-gray-800">{results[0].Pincode}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">District</span>
                <span className="font-bold text-gray-800">{results[0].District}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">State</span>
                <span className="font-bold text-gray-800">{results[0].State}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">Division</span>
                <span className="font-bold text-gray-800">{results[0].Division}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">Region</span>
                <span className="font-bold text-gray-800">{results[0].Region}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">Circle</span>
                <span className="font-bold text-gray-800">{results[0].Circle}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">Country</span>
                <span className="font-bold text-gray-800">{results[0].Country}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">Post Offices</span>
                <span className="font-bold text-gray-800">{results.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && !loading && !results && !error && (
        <div className="text-center text-gray-400 py-8">No results found</div>
      )}

      {/* State PIN Code Ranges */}
      <div className="result-card">
        <h4 className="font-bold text-gray-700 mb-3">🔍 Search PIN Code Range by State</h4>
        <input
          className="calc-input mb-3"
          placeholder="Type state name..."
          value={searchState}
          onChange={(e) => setSearchState(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-2 text-gray-600">State</th>
                <th className="text-left p-2 text-gray-600">PIN Code Range</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((s, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 font-medium text-gray-800">{s.state}</td>
                  <td className="p-2 font-mono text-indigo-600">{s.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 text-sm text-gray-600">
        <h4 className="font-bold text-gray-800 mb-2">ℹ️ About Indian PIN Codes</h4>
        <ul className="space-y-1">
          <li>• <strong>PIN</strong> stands for Postal Index Number, introduced on 15 August 1972</li>
          <li>• India has <strong>9 postal zones</strong> (1-9), with zone 9 reserved for Army/Field Post</li>
          <li>• There are <strong>30,000+</strong> unique PIN codes across India</li>
          <li>• First digit = Zone, First 2 digits = Sub-zone, First 3 = Sorting district</li>
          <li>• Data sourced from India Post (api.postalpincode.in)</li>
        </ul>
      </div>
    </div>
  );
}
