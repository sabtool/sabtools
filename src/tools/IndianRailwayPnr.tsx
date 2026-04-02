"use client";
import { useState, useMemo } from "react";

const zoneCodes: Record<string, string> = {
  "1": "Northern Railway (NR)", "2": "North Eastern Railway (NER)",
  "3": "Northeast Frontier Railway (NFR)", "4": "Eastern Railway (ER)",
  "5": "South Eastern Railway (SER)", "6": "South Central Railway (SCR)",
  "7": "Southern Railway (SR)", "8": "Central Railway (CR)",
  "9": "Western Railway (WR)", "0": "Special / Other",
};

const zoneHQ: Record<string, string> = {
  "1": "New Delhi", "2": "Gorakhpur", "3": "Maligaon (Guwahati)",
  "4": "Kolkata", "5": "Kolkata", "6": "Secunderabad",
  "7": "Chennai", "8": "Mumbai CST", "9": "Mumbai Churchgate", "0": "-",
};

function parsePnr(input: string) {
  const clean = input.replace(/[\s-]/g, "");
  if (!/^\d{10}$/.test(clean)) return null;
  const firstDigit = clean.charAt(0);
  const first3 = clean.slice(0, 3);
  const zone = zoneCodes[firstDigit] || "Unknown Zone";
  const hq = zoneHQ[firstDigit] || "Unknown";
  return { pnr: clean, formatted: `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7)}`, firstDigit, first3, zone, hq };
}

export default function IndianRailwayPnr() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return parsePnr(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">PNR Number</label>
        <input
          type="text"
          placeholder="e.g. 8524567890"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="calc-input"
          maxLength={10}
        />
        <p className="text-xs text-gray-400 mt-1">10-digit PNR from your railway ticket</p>
      </div>

      {input.replace(/\D/g, "").length === 10 && !result && (
        <div className="result-card border-l-4 border-red-400">
          <p className="text-red-600 font-semibold">Invalid PNR Format</p>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold font-mono tracking-widest text-gray-800">{result.formatted}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Railway Zone (1st digit)</p>
              <p className="text-lg font-bold text-gray-800">{result.firstDigit}</p>
              <p className="text-sm text-gray-600">{result.zone}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Zone Headquarters</p>
              <p className="text-lg font-bold text-gray-800">{result.hq}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-800 mb-2">Real-time PNR Status</p>
            <p className="text-sm text-amber-700 mb-3">
              Live PNR status requires the IRCTC API. Check your booking status directly:
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?locale=en`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm inline-block"
              >
                IRCTC PNR Status
              </a>
              <a
                href="https://www.confirmtkt.com/pnr-status"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm inline-block"
              >
                ConfirmTkt
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Railway Zone Codes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {Object.entries(zoneCodes).map(([digit, zone]) => (
            <div key={digit} className="bg-gray-50 rounded p-2 flex justify-between">
              <div>
                <span className="font-mono font-bold text-blue-600">{digit}XX</span>
                <span className="text-gray-600 ml-2">{zone}</span>
              </div>
              <span className="text-gray-400 text-xs">{zoneHQ[digit]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Read a PNR</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Digits 1-3: Identifies the railway zone and booking station</li>
          <li>Digits 4-7: Train-related serial number</li>
          <li>Digits 8-10: Passenger serial within the booking</li>
          <li>PNR is generated at the time of booking and printed on the ticket</li>
        </ul>
      </div>
    </div>
  );
}
