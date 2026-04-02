"use client";
import { useState, useRef } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function RentReceiptGenerator() {
  const [tenantName, setTenantName] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [address, setAddress] = useState("");
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [landlordPan, setLandlordPan] = useState("");
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const isValid = tenantName && landlordName && rentAmount && address && month && year;

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Rent Receipt - ${month} ${year}</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #1a1a1a; }
        .receipt { border: 2px solid #333; padding: 30px; max-width: 600px; margin: auto; }
        h2 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; }
        .footer { margin-top: 30px; border-top: 1px dashed #999; padding-top: 15px; text-align: right; }
        .amount { font-size: 1.4em; font-weight: bold; text-align: center; margin: 15px 0; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="receipt">
        <h2>RENT RECEIPT</h2>
        <p style="text-align:center;color:#666;">For the month of ${month} ${year}</p>
        <div class="amount">${fmt(parseFloat(rentAmount))}</div>
        <div class="row"><span class="label">Received from:</span><span>${tenantName}</span></div>
        <div class="row"><span class="label">Paid to:</span><span>${landlordName}</span></div>
        ${landlordPan ? `<div class="row"><span class="label">Landlord PAN:</span><span>${landlordPan}</span></div>` : ""}
        <div class="row"><span class="label">Property Address:</span><span>${address}</span></div>
        <div class="row"><span class="label">Payment Mode:</span><span>${paymentMode}</span></div>
        <div class="footer">
          <p>Date: 01 ${month} ${year}</p>
          <br/><br/>
          <p>_________________________</p>
          <p>Signature of Landlord</p>
          <p>${landlordName}</p>
        </div>
      </div></body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopy = () => {
    const text = `RENT RECEIPT\nFor the month of ${month} ${year}\n\nAmount: ${fmt(parseFloat(rentAmount))}\nReceived from: ${tenantName}\nPaid to: ${landlordName}${landlordPan ? `\nLandlord PAN: ${landlordPan}` : ""}\nProperty Address: ${address}\nPayment Mode: ${paymentMode}\nDate: 01 ${month} ${year}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
        <strong>Rent Receipt</strong> is required for claiming HRA exemption under Section 10(13A). If annual rent exceeds
        ₹1,00,000, landlord&apos;s PAN is mandatory.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tenant Name</label>
          <input type="text" placeholder="Your name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Landlord Name</label>
          <input type="text" placeholder="Landlord's name" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Monthly Rent ₹</label>
          <input type="number" placeholder="e.g. 25000" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Landlord PAN (optional)</label>
          <input type="text" placeholder="ABCDE1234F" value={landlordPan} onChange={(e) => setLandlordPan(e.target.value.toUpperCase())} className="calc-input" maxLength={10} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Property Address</label>
          <input type="text" placeholder="Full address of rented property" value={address} onChange={(e) => setAddress(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="calc-input">
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="calc-input">
            {[2023, 2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Payment Mode</label>
          <div className="flex flex-wrap gap-2">
            {["UPI", "Bank Transfer", "Cash", "Cheque"].map((mode) => (
              <button
                key={mode}
                onClick={() => setPaymentMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  paymentMode === mode
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isValid && (
        <>
          <div ref={receiptRef} className="result-card space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-800 border-b-2 border-gray-300 pb-3">RENT RECEIPT</h3>
            <p className="text-center text-sm text-gray-500">For the month of {month} {year}</p>

            <div className="text-center">
              <div className="text-3xl font-extrabold text-indigo-600">{fmt(parseFloat(rentAmount))}</div>
            </div>

            <div className="space-y-2 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Received from</span>
                <span className="text-gray-800 font-semibold">{tenantName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Paid to</span>
                <span className="text-gray-800 font-semibold">{landlordName}</span>
              </div>
              {landlordPan && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Landlord PAN</span>
                  <span className="text-gray-800 font-semibold">{landlordPan}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Address</span>
                <span className="text-gray-800 font-semibold text-right max-w-[60%]">{address}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Payment Mode</span>
                <span className="text-gray-800 font-semibold">{paymentMode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="text-gray-800 font-semibold">01 {month} {year}</span>
              </div>
            </div>

            <div className="text-right pt-4 border-t border-dashed border-gray-300">
              <p className="text-xs text-gray-400 mb-6">Signature of Landlord</p>
              <p className="text-sm font-semibold text-gray-700">{landlordName}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handlePrint} className="btn-primary flex-1">
              Print Receipt
            </button>
            <button onClick={handleCopy} className="btn-primary flex-1" style={{ background: copied ? "#16a34a" : undefined }}>
              {copied ? "Copied!" : "Copy as Text"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
