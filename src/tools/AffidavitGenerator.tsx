"use client";
import { useState, useMemo, useRef } from "react";

const AFFIDAVIT_TYPES = [
  { value: "general", label: "General Affidavit" },
  { value: "name_change", label: "Name Change" },
  { value: "address_proof", label: "Address Proof" },
  { value: "income_declaration", label: "Income Declaration" },
  { value: "self_declaration", label: "Self Declaration" },
];

export default function AffidavitGenerator() {
  const [affidavitType, setAffidavitType] = useState("general");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [purpose, setPurpose] = useState("");
  // Name change specific
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [nameChangeReason, setNameChangeReason] = useState("");
  // Address specific
  const [oldAddress, setOldAddress] = useState("");
  // Income specific
  const [annualIncome, setAnnualIncome] = useState("");
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [incomeSource, setIncomeSource] = useState("");
  // Self declaration
  const [declarationText, setDeclarationText] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);

  const todayFormatted = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const affidavit = useMemo(() => {
    if (!name || !fatherName || !address || !age) return null;

    let title = "";
    let bodyParagraphs: string[] = [];

    switch (affidavitType) {
      case "general":
        title = "GENERAL AFFIDAVIT";
        bodyParagraphs = [
          `I, ${name}, Son/Daughter of ${fatherName}, aged ${age} years, residing at ${address}, do hereby solemnly affirm and declare as follows:`,
          `1. That I am a citizen of India and the above-mentioned address is my present residential address.`,
          `2. That ${purpose || "[State the purpose/facts of this affidavit]"}.`,
          `3. That the facts stated above are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.`,
        ];
        break;

      case "name_change":
        title = "AFFIDAVIT FOR CHANGE OF NAME";
        bodyParagraphs = [
          `I, ${oldName || name}, Son/Daughter of ${fatherName}, aged ${age} years, residing at ${address}, do hereby solemnly affirm and declare as follows:`,
          `1. That I am a citizen of India and the above-mentioned address is my present residential address.`,
          `2. That my name was previously recorded as "${oldName || "[OLD NAME]"}" in all my official documents and records.`,
          `3. That I have changed my name from "${oldName || "[OLD NAME]"}" to "${newName || "[NEW NAME]"}" ${nameChangeReason ? `due to the reason: ${nameChangeReason}` : "for personal reasons"}.`,
          `4. That henceforth I shall be known as "${newName || "[NEW NAME]"}" in all my official documents, records, and correspondence.`,
          `5. That both the names "${oldName || "[OLD NAME]"}" and "${newName || "[NEW NAME]"}" belong to one and the same person, i.e., myself.`,
          `6. That I have published a notice regarding this name change in a local newspaper as required.`,
          `7. That the facts stated above are true and correct to the best of my knowledge and belief.`,
        ];
        break;

      case "address_proof":
        title = "AFFIDAVIT FOR ADDRESS PROOF";
        bodyParagraphs = [
          `I, ${name}, Son/Daughter of ${fatherName}, aged ${age} years, do hereby solemnly affirm and declare as follows:`,
          `1. That I am a citizen of India.`,
          `2. That my present residential address is: ${address}.`,
          oldAddress ? `3. That my previous address was: ${oldAddress}.` : "",
          `${oldAddress ? "4" : "3"}. That I have been residing at the above-mentioned present address ${purpose ? `since ${purpose}` : "for the past _____ months/years"}.`,
          `${oldAddress ? "5" : "4"}. That I am making this affidavit for the purpose of address verification/proof as required by the concerned authority.`,
          `${oldAddress ? "6" : "5"}. That the facts stated above are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.`,
        ].filter(Boolean);
        break;

      case "income_declaration":
        title = "AFFIDAVIT FOR INCOME DECLARATION";
        bodyParagraphs = [
          `I, ${name}, Son/Daughter of ${fatherName}, aged ${age} years, residing at ${address}, do hereby solemnly affirm and declare as follows:`,
          `1. That I am a citizen of India and the above-mentioned address is my present residential address.`,
          `2. That my total annual income from all sources for the Financial Year ${financialYear} is ${annualIncome ? fmt(parseFloat(annualIncome)) : "[AMOUNT]"} (${annualIncome ? "Rupees _____ only" : "Rupees _____ only"}).`,
          incomeSource ? `3. That my source(s) of income are: ${incomeSource}.` : `3. That my source(s) of income are: [Salary/Business/Agriculture/Pension/Other].`,
          `4. That I am making this declaration for the purpose of ${purpose || "[state purpose - e.g., scholarship application, fee concession, government scheme, etc.]"}.`,
          `5. That I have not concealed any income from any source whatsoever.`,
          `6. That the facts stated above are true and correct to the best of my knowledge and belief.`,
        ];
        break;

      case "self_declaration":
        title = "SELF-DECLARATION AFFIDAVIT";
        bodyParagraphs = [
          `I, ${name}, Son/Daughter of ${fatherName}, aged ${age} years, residing at ${address}, do hereby solemnly affirm and declare as follows:`,
          `1. That I am a citizen of India and the above-mentioned address is my present residential address.`,
          `2. That ${declarationText || purpose || "[State the declaration/facts]"}.`,
          `3. That I am making this self-declaration for the purpose of ${purpose || "[state purpose]"}.`,
          `4. That the facts stated herein are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.`,
        ];
        break;
    }

    return { title, bodyParagraphs };
  }, [affidavitType, name, fatherName, address, age, purpose, oldName, newName, nameChangeReason, oldAddress, annualIncome, financialYear, incomeSource, declarationText]);

  const handleCopy = () => {
    if (outputRef.current) navigator.clipboard.writeText(outputRef.current.innerText);
  };

  const handlePrint = () => {
    if (outputRef.current) {
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(`<html><head><title>Affidavit</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;line-height:1.8;font-size:14px;color:#000}h2{text-align:center;text-decoration:underline}p{text-align:justify;margin-bottom:10px}.stamp-box{border:2px dashed #999;padding:20px;text-align:center;margin:20px 0;color:#777}</style></head><body>${outputRef.current.innerHTML}</body></html>`);
        printWin.document.close();
        printWin.print();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Affidavit Type</label>
          <div className="flex flex-wrap gap-2">
            {AFFIDAVIT_TYPES.map((at) => (
              <button key={at.value} onClick={() => setAffidavitType(at.value)}
                className={at.value === affidavitType ? "btn-primary" : "btn-secondary"}>
                {at.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Father&apos;s / Husband&apos;s Name</label>
            <input type="text" placeholder="Father's or husband's name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="calc-input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Age (Years)</label>
            <input type="number" placeholder="e.g. 30" value={age} onChange={(e) => setAge(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose</label>
            <input type="text" placeholder="Purpose of affidavit" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="calc-input" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Residential Address</label>
          <textarea placeholder="Full address" value={address} onChange={(e) => setAddress(e.target.value)} className="calc-input" rows={2} />
        </div>

        {/* Conditional fields */}
        {affidavitType === "name_change" && (
          <div className="space-y-4 bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-800">Name Change Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Old Name</label>
                <input type="text" placeholder="Previous name" value={oldName} onChange={(e) => setOldName(e.target.value)} className="calc-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Name</label>
                <input type="text" placeholder="New name" value={newName} onChange={(e) => setNewName(e.target.value)} className="calc-input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change (optional)</label>
              <input type="text" placeholder="e.g. After marriage" value={nameChangeReason} onChange={(e) => setNameChangeReason(e.target.value)} className="calc-input" />
            </div>
          </div>
        )}

        {affidavitType === "address_proof" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Previous Address (optional)</label>
            <textarea placeholder="Previous address if applicable" value={oldAddress} onChange={(e) => setOldAddress(e.target.value)} className="calc-input" rows={2} />
          </div>
        )}

        {affidavitType === "income_declaration" && (
          <div className="space-y-4 bg-green-50 rounded-xl p-4">
            <h4 className="text-sm font-bold text-green-800">Income Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
                <input type="number" placeholder="e.g. 500000" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="calc-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
                <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} className="calc-input">
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source of Income</label>
              <input type="text" placeholder="e.g. Salary, Business, Agriculture" value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} className="calc-input" />
            </div>
          </div>
        )}

        {affidavitType === "self_declaration" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Declaration Text</label>
            <textarea placeholder="Write your declaration statement..." value={declarationText} onChange={(e) => setDeclarationText(e.target.value)} className="calc-input" rows={4} />
          </div>
        )}
      </div>

      {affidavit && (
        <>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-primary">Copy to Clipboard</button>
            <button onClick={handlePrint} className="btn-secondary">Print Affidavit</button>
          </div>

          <div ref={outputRef} className="result-card bg-white border border-gray-200 p-6 sm:p-8" style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.8" }}>
            <div style={{ border: "2px dashed #999", padding: 15, textAlign: "center", marginBottom: 20, color: "#777" }}>
              [Affix ₹10/₹20/₹50 Stamp Paper as per State requirement]
            </div>

            <h2 style={{ textAlign: "center", textDecoration: "underline", fontWeight: "bold", marginBottom: 20 }}>
              {affidavit.title}
            </h2>

            <p><strong>Date:</strong> {todayFormatted}</p>

            {affidavit.bodyParagraphs.map((para, i) => (
              <p key={i} style={{ textAlign: "justify", marginBottom: 10 }}>{para}</p>
            ))}

            <div style={{ marginTop: 30, borderTop: "1px solid #ddd", paddingTop: 20 }}>
              <h3 style={{ textDecoration: "underline", fontWeight: "bold", marginBottom: 10 }}>VERIFICATION</h3>
              <p>I, {name}, the above-named deponent, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed therefrom.</p>
              <p>Verified at _____________ on this {todayFormatted}.</p>
            </div>

            <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between" }}>
              <div>
                <p>Before me,</p>
                <br />
                <p>___________________________</p>
                <p><strong>Notary Public / Oath Commissioner</strong></p>
                <p>[Seal]</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <br /><br />
                <p>___________________________</p>
                <p><strong>DEPONENT</strong></p>
                <p>({name})</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
        <strong>Note:</strong> Affidavits must be printed on appropriate stamp paper (value varies by state, typically ₹10-₹100) and notarized/attested by a Notary Public or Oath Commissioner to be legally valid. This is a template for reference only.
      </div>
    </div>
  );
}
