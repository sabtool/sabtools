"use client";
import { useState, useMemo } from "react";

const bankMap: Record<string, string> = {
  SBIN: "State Bank of India", HDFC: "HDFC Bank", ICIC: "ICICI Bank",
  BARB: "Bank of Baroda", PUNB: "Punjab National Bank", CNRB: "Canara Bank",
  UBIN: "Union Bank of India", IOBA: "Indian Overseas Bank", BKID: "Bank of India",
  IDIB: "Indian Bank", UTIB: "Axis Bank", KKBK: "Kotak Mahindra Bank",
  INDB: "IndusInd Bank", YESB: "Yes Bank", FDRL: "Federal Bank",
  SIBL: "South Indian Bank", KARB: "Karnataka Bank", CSBK: "City Union Bank",
  RATN: "RBL Bank", IDFB: "IDFC First Bank", MAHB: "Bank of Maharashtra",
  UCBA: "UCO Bank", PSIB: "Punjab & Sind Bank", CBIN: "Central Bank of India",
  ALLA: "Allahabad Bank", BKDN: "Dena Bank", ORBC: "Oriental Bank of Commerce",
  VIJB: "Vijaya Bank", CORP: "Corporation Bank", SYNB: "Syndicate Bank",
};

function parseIfsc(code: string) {
  const clean = code.toUpperCase().trim();
  const regex = /^([A-Z]{4})(0)(\w{6})$/;
  const match = clean.match(regex);
  if (!match) return null;
  const [, bankCode, , branchCode] = match;
  const bankName = bankMap[bankCode] || "Unknown Bank";
  return { bankCode, bankName, branchCode, full: clean, isKnown: !!bankMap[bankCode] };
}

export default function IfscCodeLookup() {
  const [input, setInput] = useState("");
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return parseIfsc(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">IFSC Code</label>
        <input
          type="text"
          placeholder="e.g. SBIN0001234"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input uppercase"
          maxLength={11}
        />
        <p className="text-xs text-gray-400 mt-1">11-character IFSC code (e.g., HDFC0001234)</p>
      </div>

      {input.trim() && !result && (
        <div className="result-card border-l-4 border-red-400">
          <p className="text-red-600 font-semibold">Invalid IFSC Format</p>
          <p className="text-sm text-gray-500">IFSC must be 11 characters: 4 letters + 0 + 6 alphanumeric</p>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold font-mono tracking-widest text-gray-800">{result.full}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Bank Code</p>
              <p className="text-lg font-bold text-gray-800">{result.bankCode}</p>
              <p className="text-sm text-gray-600">{result.bankName}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase">Branch Code</p>
              <p className="text-lg font-bold text-gray-800">{result.branchCode}</p>
              <p className="text-sm text-gray-600">Unique branch identifier</p>
            </div>
          </div>
          {!result.isKnown && (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
              Bank code not in our database. The code may still be valid. Use RBI IFSC lookup for full details.
            </p>
          )}
          <p className="text-sm text-gray-500">
            For full branch details (address, MICR, contact), use the{" "}
            <a href="https://www.rbi.org.in/Scripts/IFSCMICRDetails.aspx" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              RBI IFSC Search
            </a>.
          </p>
        </div>
      )}

      <div>
        <button onClick={() => setShowTable(!showTable)} className="btn-secondary text-sm">
          {showTable ? "Hide" : "Show"} Bank Code Reference
        </button>
        {showTable && (
          <div className="mt-3 max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr><th className="text-left p-2">Code</th><th className="text-left p-2">Bank Name</th></tr>
              </thead>
              <tbody>
                {Object.entries(bankMap).sort((a, b) => a[1].localeCompare(b[1])).map(([code, name]) => (
                  <tr key={code} className="border-b border-gray-100">
                    <td className="p-2 font-mono font-bold">{code}</td>
                    <td className="p-2">{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
