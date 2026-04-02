"use client";
import { useState, useMemo } from "react";

const BANK_CODES: Record<string, { name: string; fullName: string }> = {
  "SBIN": { name: "SBI", fullName: "State Bank of India" },
  "HDFC": { name: "HDFC Bank", fullName: "HDFC Bank Limited" },
  "ICIC": { name: "ICICI Bank", fullName: "ICICI Bank Limited" },
  "UTIB": { name: "Axis Bank", fullName: "Axis Bank Limited" },
  "KKBK": { name: "Kotak Mahindra", fullName: "Kotak Mahindra Bank Limited" },
  "PUNB": { name: "PNB", fullName: "Punjab National Bank" },
  "BARB": { name: "Bank of Baroda", fullName: "Bank of Baroda" },
  "CNRB": { name: "Canara Bank", fullName: "Canara Bank" },
  "UBIN": { name: "Union Bank", fullName: "Union Bank of India" },
  "IOBA": { name: "IOB", fullName: "Indian Overseas Bank" },
  "BKID": { name: "Bank of India", fullName: "Bank of India" },
  "IDIB": { name: "Indian Bank", fullName: "Indian Bank" },
  "CBIN": { name: "Central Bank", fullName: "Central Bank of India" },
  "UCBA": { name: "UCO Bank", fullName: "UCO Bank" },
  "PSIB": { name: "PSB", fullName: "Punjab & Sind Bank" },
  "MAHB": { name: "Bank of Maharashtra", fullName: "Bank of Maharashtra" },
  "BKDN": { name: "Dena Bank", fullName: "Dena Bank (merged with BoB)" },
  "VIJB": { name: "Vijaya Bank", fullName: "Vijaya Bank (merged with BoB)" },
  "ORBC": { name: "PNB (OBC)", fullName: "Oriental Bank of Commerce (merged with PNB)" },
  "ANDB": { name: "Andhra Bank", fullName: "Andhra Bank (merged with Union Bank)" },
  "CORP": { name: "Union Bank (Corp)", fullName: "Corporation Bank (merged with Union Bank)" },
  "ALLA": { name: "Indian Bank (Allahabad)", fullName: "Allahabad Bank (merged with Indian Bank)" },
  "YESB": { name: "Yes Bank", fullName: "Yes Bank Limited" },
  "INDB": { name: "IndusInd Bank", fullName: "IndusInd Bank Limited" },
  "FDRL": { name: "Federal Bank", fullName: "Federal Bank Limited" },
  "IDFB": { name: "IDFC First", fullName: "IDFC First Bank Limited" },
  "RATN": { name: "RBL Bank", fullName: "RBL Bank Limited" },
  "KARB": { name: "Karnataka Bank", fullName: "Karnataka Bank Limited" },
  "KVBL": { name: "Karur Vysya", fullName: "Karur Vysya Bank Limited" },
  "TMBL": { name: "Tamilnad Mercantile", fullName: "Tamilnad Mercantile Bank Limited" },
  "CIUB": { name: "City Union Bank", fullName: "City Union Bank Limited" },
  "SIBL": { name: "South Indian Bank", fullName: "South Indian Bank Limited" },
  "DLXB": { name: "Dhanlaxmi Bank", fullName: "Dhanlaxmi Bank Limited" },
  "JAKA": { name: "J&K Bank", fullName: "Jammu & Kashmir Bank Limited" },
  "CSBK": { name: "CSB Bank", fullName: "CSB Bank Limited" },
  "NKGS": { name: "NKGSB Bank", fullName: "NKGSB Co-op Bank Limited" },
  "SVCB": { name: "SVC Bank", fullName: "Shamrao Vithal Co-op Bank" },
  "IBKL": { name: "IDBI Bank", fullName: "IDBI Bank Limited" },
  "PYTM": { name: "Paytm Payments", fullName: "Paytm Payments Bank Limited" },
  "AIRP": { name: "Airtel Payments", fullName: "Airtel Payments Bank Limited" },
  "JIOP": { name: "Jio Payments", fullName: "Jio Payments Bank Limited" },
  "FINO": { name: "Fino Payments", fullName: "Fino Payments Bank Limited" },
};

export default function IfscBankDetails() {
  const [ifsc, setIfsc] = useState("");
  const [copied, setCopied] = useState(false);

  const cleanIfsc = ifsc.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);

  const result = useMemo(() => {
    if (cleanIfsc.length !== 11) return null;

    const bankCode = cleanIfsc.slice(0, 4);
    const filler = cleanIfsc[4];
    const branchCode = cleanIfsc.slice(5);
    const bankInfo = BANK_CODES[bankCode];

    const isValidFormat = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc);

    return {
      bankCode,
      filler,
      branchCode,
      bankName: bankInfo?.name || "Unknown Bank",
      fullName: bankInfo?.fullName || `Bank code: ${bankCode}`,
      isValid: isValidFormat && filler === "0",
      known: !!bankInfo,
    };
  }, [cleanIfsc]);

  const copyIfsc = () => {
    navigator.clipboard?.writeText(cleanIfsc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter IFSC Code</label>
        <input
          type="text"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
          placeholder="e.g., SBIN0001234"
          maxLength={11}
          className="calc-input font-mono uppercase"
        />
        <p className="text-xs text-gray-400 mt-1">{cleanIfsc.length}/11 characters</p>
      </div>

      {result && (
        <div className="space-y-5">
          {/* Validation */}
          <div className={`result-card ${result.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{result.isValid ? "\u2705" : "\u274C"}</span>
              <span className={`text-sm font-semibold ${result.isValid ? "text-green-700" : "text-red-700"}`}>
                {result.isValid ? "Valid IFSC format" : "Invalid IFSC format (5th character must be 0)"}
              </span>
            </div>
          </div>

          {/* Parsed Details */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">IFSC Code Breakdown</h3>
            <div className="flex gap-0.5 mb-4 justify-center">
              {cleanIfsc.split("").map((char, i) => (
                <div key={i} className={`w-9 h-12 flex items-center justify-center font-mono font-bold text-lg rounded ${
                  i < 4 ? "bg-blue-100 text-blue-700" : i === 4 ? "bg-gray-200 text-gray-500" : "bg-green-100 text-green-700"
                }`}>
                  {char}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">First 4: Bank Code</span></div>
              <div><span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-semibold">5th: Always 0</span></div>
              <div><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">Last 6: Branch Code</span></div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Bank Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Bank Name</span>
                <span className="text-sm font-bold text-gray-800">{result.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Bank Code</span>
                <span className="text-sm font-mono font-bold text-blue-700">{result.bankCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Branch Code</span>
                <span className="text-sm font-mono font-bold text-green-700">{result.branchCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">IFSC Code</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-gray-800">{cleanIfsc}</span>
                  <button onClick={copyIfsc} className="text-xs text-indigo-600 hover:text-indigo-800">{copied ? "Copied!" : "Copy"}</button>
                </div>
              </div>
            </div>
          </div>

          {/* RBI Search Link */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Verify Full Details on RBI</h3>
            <p className="text-sm text-gray-600 mb-3">For complete branch details (address, MICR code, contact), verify on the official RBI IFSC search.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.rbi.org.in/Scripts/IFSCMICRDetails.aspx" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-center text-sm">RBI IFSC Search</a>
              <a href={`https://ifsc.bankifsccode.com/${cleanIfsc}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">BankIFSCCode.com</a>
            </div>
          </div>

          {/* IFSC Format Info */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">About IFSC Code</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>&#8226; IFSC (Indian Financial System Code) is an 11-character alphanumeric code</li>
              <li>&#8226; Used for NEFT, RTGS, and IMPS fund transfers</li>
              <li>&#8226; First 4 characters identify the bank</li>
              <li>&#8226; 5th character is always &apos;0&apos; (reserved for future use)</li>
              <li>&#8226; Last 6 characters identify the specific branch</li>
              <li>&#8226; Assigned by the Reserve Bank of India (RBI)</li>
              <li>&#8226; Required for all electronic fund transfers in India</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
