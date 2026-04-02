"use client";
import { useState, useMemo, useRef } from "react";

const AUTHORITY_TYPES = [
  { value: "central", label: "Central Government", fee: 10 },
  { value: "state", label: "State Government", fee: 10 },
];

const COMMON_DEPARTMENTS = [
  "Ministry of Home Affairs",
  "Ministry of Finance",
  "Ministry of Education",
  "Ministry of Health & Family Welfare",
  "Ministry of Railways",
  "Ministry of Road Transport & Highways",
  "Municipal Corporation",
  "District Collector Office",
  "Public Works Department (PWD)",
  "Revenue Department",
  "Police Department",
  "Electricity Board",
  "Water Supply Department",
  "Town Planning Department",
  "Other (specify below)",
];

export default function RtiApplicationGenerator() {
  const [applicantName, setApplicantName] = useState("");
  const [applicantAddress, setApplicantAddress] = useState("");
  const [isBPL, setIsBPL] = useState(false);
  const [authorityType, setAuthorityType] = useState("central");
  const [department, setDepartment] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [infoSought, setInfoSought] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const todayFormatted = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const fee = useMemo(() => {
    if (isBPL) return 0;
    return authorityType === "central" ? 10 : 10;
  }, [isBPL, authorityType]);

  const deptName = department === "Other (specify below)" ? customDepartment : department;

  const application = useMemo(() => {
    if (!applicantName || !deptName || !infoSought) return null;
    return {
      name: applicantName,
      address: applicantAddress || "[YOUR ADDRESS]",
      dept: deptName,
      info: infoSought,
      period: timePeriod,
      fee,
      isBPL,
      authorityType,
    };
  }, [applicantName, applicantAddress, deptName, infoSought, timePeriod, fee, isBPL, authorityType]);

  const handleCopy = () => {
    if (outputRef.current) {
      navigator.clipboard.writeText(outputRef.current.innerText);
    }
  };

  const handlePrint = () => {
    if (outputRef.current) {
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(`<html><head><title>RTI Application</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;line-height:1.8;font-size:14px;color:#000}h2{text-align:center}p{text-align:justify;margin-bottom:10px}ol{margin-left:20px}ol li{margin-bottom:8px}</style></head><body>${outputRef.current.innerHTML}</body></html>`);
        printWin.document.close();
        printWin.print();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Applicant Name</label>
            <input type="text" placeholder="Your full name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Authority Type</label>
            <div className="flex gap-2 mt-1">
              {AUTHORITY_TYPES.map((at) => (
                <button key={at.value} onClick={() => setAuthorityType(at.value)}
                  className={at.value === authorityType ? "btn-primary" : "btn-secondary"}>
                  {at.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Applicant Address</label>
          <textarea placeholder="Full postal address" value={applicantAddress} onChange={(e) => setApplicantAddress(e.target.value)} className="calc-input" rows={2} />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="bpl" checked={isBPL} onChange={(e) => setIsBPL(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
          <label htmlFor="bpl" className="text-sm font-medium text-gray-700">
            Below Poverty Line (BPL) - Fee waived (attach BPL certificate copy)
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="calc-input">
            <option value="">-- Select Department --</option>
            {COMMON_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {department === "Other (specify below)" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Custom Department Name</label>
            <input type="text" placeholder="Enter department name" value={customDepartment} onChange={(e) => setCustomDepartment(e.target.value)} className="calc-input" />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Information Sought</label>
          <textarea placeholder="Clearly describe the specific information you are seeking..." value={infoSought} onChange={(e) => setInfoSought(e.target.value)} className="calc-input" rows={4} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Time Period (optional)</label>
          <input type="text" placeholder="e.g. From January 2023 to December 2024" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="calc-input" />
        </div>
      </div>

      {/* Fee info */}
      <div className="result-card">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Application Fee:</span>
          <span className="text-xl font-extrabold text-indigo-600">
            {isBPL ? "Waived (BPL)" : `₹${fee}`}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {isBPL
            ? "Fee is waived for BPL applicants. Attach a copy of BPL certificate."
            : "Pay via Indian Postal Order / DD / Banker's Cheque / Court Fee Stamp (as applicable)."
          }
        </p>
      </div>

      {application && (
        <>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-primary">Copy to Clipboard</button>
            <button onClick={handlePrint} className="btn-secondary">Print Application</button>
          </div>

          <div ref={outputRef} className="result-card bg-white border border-gray-200 p-6 sm:p-8" style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.8" }}>
            <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>
              APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005
            </h2>
            <p style={{ textAlign: "center", fontSize: "0.9em", color: "#555", marginBottom: 20 }}>
              (Under Section 6(1) of the RTI Act, 2005)
            </p>

            <div style={{ marginBottom: 20 }}>
              <p><strong>To,</strong></p>
              <p>The Public Information Officer (PIO),</p>
              <p>{application.dept},</p>
              <p>{application.authorityType === "central" ? "Government of India" : "[State Government Name]"}</p>
              <p>[Office Address]</p>
            </div>

            <p><strong>Date:</strong> {todayFormatted}</p>

            <p><strong>Subject:</strong> Application seeking information under RTI Act, 2005</p>

            <p><strong>Sir/Madam,</strong></p>

            <p>I, <strong>{application.name}</strong>, resident of {application.address}, do hereby request you to provide me with the following information under the Right to Information Act, 2005:</p>

            <div style={{ margin: "15px 0", padding: "10px 15px", background: "#f9f9f9", border: "1px solid #ddd" }}>
              <p><strong>Information Sought:</strong></p>
              {application.info.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {application.period && <p><strong>Period:</strong> {application.period}</p>}
            </div>

            <p>I would like to receive the information in the form of photocopies / printed format / electronic format (whichever is available and convenient).</p>

            {application.isBPL ? (
              <p>I belong to the Below Poverty Line (BPL) category and hence the application fee is exempted. A copy of BPL certificate is enclosed herewith.</p>
            ) : (
              <p>I am enclosing an Indian Postal Order / Court Fee Stamp of <strong>₹{application.fee}</strong> as the prescribed application fee.</p>
            )}

            <p>If the requested information is held by or is closely connected with the function of any other public authority, kindly transfer this application or the relevant part to that authority under Section 6(3) of the RTI Act, 2005, and inform me accordingly.</p>

            <p>I state that the information sought does not fall within the restrictions under Section 8 and Section 9 of the RTI Act and to the best of my knowledge pertains to your office.</p>

            <div style={{ marginTop: 30 }}>
              <p><strong>Yours faithfully,</strong></p>
              <br />
              <p><strong>Name:</strong> {application.name}</p>
              <p><strong>Address:</strong> {application.address}</p>
              <p><strong>Phone:</strong> [Your Phone Number]</p>
              <p><strong>Email:</strong> [Your Email]</p>
            </div>

            <div style={{ marginTop: 20, borderTop: "1px solid #ddd", paddingTop: 10 }}>
              <p><strong>Enclosures:</strong></p>
              <ol>
                {!application.isBPL && <li>Indian Postal Order / Court Fee Stamp of ₹{application.fee}</li>}
                {application.isBPL && <li>Copy of BPL Certificate</li>}
                <li>Copy of ID proof (Aadhaar/Voter ID/PAN)</li>
              </ol>
            </div>
          </div>
        </>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 space-y-1">
        <p><strong>How to file RTI:</strong></p>
        <p>1. Online: Visit <strong>rtionline.gov.in</strong> for Central Government departments</p>
        <p>2. Offline: Send by post / submit in person to the PIO of the concerned department</p>
        <p>3. Fee: ₹10 for Central Govt (waived for BPL). State fees may vary.</p>
        <p>4. Timeline: PIO must reply within 30 days (48 hours in life/liberty matters)</p>
        <p>5. First Appeal: If not satisfied, file First Appeal to the First Appellate Authority within 30 days</p>
      </div>
    </div>
  );
}
