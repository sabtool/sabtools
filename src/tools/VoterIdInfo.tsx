"use client";
import { useState, useMemo } from "react";

const STATE_CODES: Record<string, string> = {
  AN: "Andaman & Nicobar Islands", AP: "Andhra Pradesh", AR: "Arunachal Pradesh",
  AS: "Assam", BR: "Bihar", CH: "Chandigarh", CG: "Chhattisgarh",
  DN: "Dadra & Nagar Haveli", DD: "Daman & Diu", DL: "Delhi",
  GA: "Goa", GJ: "Gujarat", HR: "Haryana", HP: "Himachal Pradesh",
  JK: "Jammu & Kashmir", JH: "Jharkhand", KA: "Karnataka", KL: "Kerala",
  LA: "Ladakh", LD: "Lakshadweep", MP: "Madhya Pradesh", MH: "Maharashtra",
  MN: "Manipur", ML: "Meghalaya", MZ: "Mizoram", NL: "Nagaland",
  OD: "Odisha", OR: "Odisha", PY: "Puducherry", PB: "Punjab",
  RJ: "Rajasthan", SK: "Sikkim", TN: "Tamil Nadu", TS: "Telangana",
  TR: "Tripura", UP: "Uttar Pradesh", UK: "Uttarakhand", WB: "West Bengal",
  // Common alternate codes
  UT: "Uttarakhand", CT: "Chhattisgarh",
};

// Three letter codes used as first part of EPIC
const EPIC_STATE_HINTS: Record<string, string> = {
  A: "Could be from Andhra Pradesh, Arunachal Pradesh, or Assam region",
  B: "Could be from Bihar or related region",
  C: "Could be from Chhattisgarh or Chandigarh region",
  D: "Could be from Delhi or Daman & Diu region",
  G: "Could be from Gujarat or Goa region",
  H: "Could be from Haryana or Himachal Pradesh region",
  J: "Could be from Jharkhand or Jammu & Kashmir region",
  K: "Could be from Karnataka or Kerala region",
  L: "Could be from Lakshadweep or Ladakh region",
  M: "Could be from Maharashtra, Madhya Pradesh, Manipur, Meghalaya, or Mizoram region",
  N: "Could be from Nagaland region",
  O: "Could be from Odisha region",
  P: "Could be from Punjab or Puducherry region",
  R: "Could be from Rajasthan region",
  S: "Could be from Sikkim region",
  T: "Could be from Tamil Nadu, Telangana, or Tripura region",
  U: "Could be from Uttar Pradesh or Uttarakhand region",
  W: "Could be from West Bengal region",
};

const DOCUMENTS_NEEDED = [
  "Proof of Identity (Aadhaar, PAN, Passport, Driving License)",
  "Proof of Address (Utility bill, Bank passbook, Aadhaar)",
  "Passport-size photographs (recent, color)",
  "Proof of Age (Birth certificate, 10th marksheet, Passport)",
];

export default function VoterIdInfo() {
  const [epicNumber, setEpicNumber] = useState("");

  const validation = useMemo(() => {
    if (!epicNumber.trim()) return null;

    const cleaned = epicNumber.trim().toUpperCase().replace(/\s/g, "");
    const pattern = /^[A-Z]{3}\d{7}$/;
    const isValid = pattern.test(cleaned);

    if (!isValid) {
      return {
        valid: false,
        message: "Invalid EPIC format. Expected format: 3 letters followed by 7 digits (e.g., ABC1234567)",
        details: null,
      };
    }

    const letters = cleaned.substring(0, 3);
    const digits = cleaned.substring(3);
    const stateHint = letters.substring(0, 2);
    const stateName = STATE_CODES[stateHint] || null;
    const firstLetter = letters[0];
    const regionHint = EPIC_STATE_HINTS[firstLetter] || "Region could not be determined from first letter";

    return {
      valid: true,
      message: "Valid EPIC number format",
      details: {
        fullNumber: cleaned,
        letterPart: letters,
        digitPart: digits,
        stateCode: stateHint,
        stateName,
        regionHint,
      },
    };
  }, [epicNumber]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Enter EPIC Number (Voter ID Number)</label>
        <input
          type="text"
          placeholder="e.g., ABC1234567"
          value={epicNumber}
          onChange={(e) => setEpicNumber(e.target.value.toUpperCase())}
          className="calc-input uppercase tracking-wider text-lg font-mono"
          maxLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">Format: 3 letters + 7 digits (found on front of Voter ID card)</p>
      </div>

      {validation && (
        <div className={`result-card ${validation.valid ? "" : "border-red-300 bg-red-50"}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-lg ${validation.valid ? "text-green-500" : "text-red-500"}`}>
              {validation.valid ? "✓" : "✗"}
            </span>
            <span className={`font-bold ${validation.valid ? "text-green-700" : "text-red-700"}`}>
              {validation.message}
            </span>
          </div>

          {validation.details && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">EPIC Number</div>
                  <div className="text-xl font-extrabold text-indigo-600 font-mono tracking-wider">
                    {validation.details.letterPart}<span className="text-gray-400">-</span>{validation.details.digitPart}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">State Code</div>
                  <div className="text-xl font-extrabold text-orange-600">{validation.details.stateCode}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {validation.details.stateName || "See note below"}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Possible State</div>
                  <div className="text-sm font-bold text-green-700">
                    {validation.details.stateName || validation.details.regionHint}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-semibold text-blue-800 mb-1">Note on EPIC parsing:</p>
                <p className="text-blue-700 text-xs">
                  The first 2-3 letters of an EPIC number typically indicate the state/constituency, but the mapping is not standardized across all states. The exact constituency and polling station details can only be verified through the official NVSP portal.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How to check status */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">How to Check Voter ID Status Online</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">Visit NVSP Portal</p>
              <p className="text-xs text-gray-500">Go to <strong>voters.eci.gov.in</strong> or <strong>nvsp.in</strong></p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">Search by EPIC Number</p>
              <p className="text-xs text-gray-500">Enter your EPIC number in the search box</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">Verify Details</p>
              <p className="text-xs text-gray-500">Check your name, constituency, polling station, and photo</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to update details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-bold text-gray-800">How to Update Voter ID Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-gray-700">Form 8 - Correction</p>
            <p className="text-xs text-gray-500">For correcting name, age, photo, address, gender in existing voter ID</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-gray-700">Form 8A - Transposition</p>
            <p className="text-xs text-gray-500">For shifting voter registration to new address within same constituency</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-gray-700">Form 6 - New Registration</p>
            <p className="text-xs text-gray-500">For new voter registration or shifting to different constituency</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-gray-700">Form 7 - Deletion</p>
            <p className="text-xs text-gray-500">For objecting to inclusion or requesting deletion of an entry</p>
          </div>
        </div>
      </div>

      {/* Documents needed */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Documents Needed for Voter ID</h3>
        <ul className="space-y-2">
          {DOCUMENTS_NEEDED.map((doc, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-500 mt-0.5">&#10003;</span>
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* State codes reference */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-sm font-bold text-gray-700 mb-3">State Code Reference</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
          {Object.entries(STATE_CODES)
            .filter(([code]) => code.length === 2 && !["OR", "UT", "CT"].includes(code))
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([code, name]) => (
              <div key={code} className="flex items-center gap-1">
                <span className="font-mono font-bold text-indigo-600">{code}</span>
                <span className="text-gray-600">{name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
