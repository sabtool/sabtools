"use client";
import { useState } from "react";

type ComplaintType = "Product Defect" | "Service Issue" | "Billing Error" | "Delivery Problem" | "Noise Complaint" | "Workplace Issue" | "Insurance Claim" | "Bank Complaint";

interface FormData {
  companyName: string;
  issueDetails: string;
  dateOfIncident: string;
  desiredResolution: string;
}

function generateRefNumber(): string {
  const prefix = "CMP";
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${date}-${rand}`;
}

const today = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const complaintBodies: Record<ComplaintType, (f: FormData) => string> = {
  "Product Defect": (f) =>
    `I am writing to formally register a complaint regarding a defective product purchased from ${f.companyName}.

Details of the complaint:
${f.issueDetails}

Date of purchase/incident: ${f.dateOfIncident || "[Date]"}

Despite my expectation of receiving a quality product, the item in question has proven to be defective and not fit for its intended purpose. This has caused significant inconvenience and dissatisfaction.

As per the Consumer Protection Act, 2019, I am entitled to a remedy for this defective product. I have retained all purchase receipts and documentation as evidence.

Desired Resolution: ${f.desiredResolution || "Full refund or replacement of the defective product"}

I request that this matter be resolved within 15 business days from the date of this letter. Failure to address this complaint satisfactorily may compel me to escalate the matter to the Consumer Disputes Redressal Forum.`,

  "Service Issue": (f) =>
    `I am writing to express my deep dissatisfaction with the quality of service provided by ${f.companyName}.

Details of the complaint:
${f.issueDetails}

Date of incident: ${f.dateOfIncident || "[Date]"}

The level of service I received fell significantly below the standards that were promised and expected. This has resulted in considerable inconvenience and frustration.

As a paying customer, I expect a certain standard of service, and the experience I had was unacceptable. I have documented all interactions and have evidence to support my claims.

Desired Resolution: ${f.desiredResolution || "Service rectification and appropriate compensation"}

I kindly request that this issue be investigated and resolved within 10 business days. If this matter remains unaddressed, I reserve the right to approach the relevant consumer protection authorities.`,

  "Billing Error": (f) =>
    `I am writing to bring to your attention a billing discrepancy in my account with ${f.companyName}.

Details of the billing error:
${f.issueDetails}

Date of discovery/billing period: ${f.dateOfIncident || "[Date]"}

Upon reviewing my statement, I have identified charges that are either incorrect, unauthorized, or do not reflect the services/products I purchased or agreed to. I have carefully compared the billed amount against my records and confirmed the discrepancy.

I request an immediate review of my account and correction of the erroneous charges. I have attached copies of relevant documents, receipts, and statements for your reference.

Desired Resolution: ${f.desiredResolution || "Correction of billing error and refund of overcharged amount"}

Please address this within 7 business days. Continued incorrect billing may result in my filing a complaint with the Banking Ombudsman/Consumer Forum as appropriate.`,

  "Delivery Problem": (f) =>
    `I am writing to formally complain about a delivery issue with my order from ${f.companyName}.

Details of the complaint:
${f.issueDetails}

Date of order/expected delivery: ${f.dateOfIncident || "[Date]"}

The delivery of my order has not met the standards promised at the time of purchase. This has caused significant inconvenience, and the failure to deliver as agreed constitutes a breach of the terms of sale.

I have my order confirmation, tracking details, and all relevant communication saved as evidence.

Desired Resolution: ${f.desiredResolution || "Immediate delivery of the correct order or full refund including shipping charges"}

I expect a resolution within 7 business days. Failure to resolve this may result in my escalating the complaint to consumer protection authorities and e-commerce regulatory bodies.`,

  "Noise Complaint": (f) =>
    `I am writing to formally register a complaint regarding excessive noise disturbance caused by activities at/near ${f.companyName}.

Details of the complaint:
${f.issueDetails}

Date(s) of disturbance: ${f.dateOfIncident || "[Date]"}

The noise levels have been consistently above acceptable limits and have significantly affected my quality of life, including disruption of sleep, work, and daily activities. This is in violation of the Noise Pollution (Regulation and Control) Rules, 2000.

I have maintained a log of the disturbances with dates, times, and duration for documentation purposes.

Desired Resolution: ${f.desiredResolution || "Immediate cessation of noise-causing activities and adherence to prescribed noise levels"}

I request that appropriate action be taken within 7 days. If the noise disturbance continues, I will be compelled to approach the local police authorities and the Pollution Control Board for enforcement of noise regulations.`,

  "Workplace Issue": (f) =>
    `I am writing to formally report a workplace issue at ${f.companyName} that requires immediate attention and resolution.

Details of the complaint:
${f.issueDetails}

Date of incident(s): ${f.dateOfIncident || "[Date]"}

This matter has created an unfavorable work environment and has affected my ability to perform my duties effectively. I have attempted to resolve this matter informally, but the situation persists.

I am bringing this to your attention through proper channels as required by company policy and employment regulations. I have documented all relevant incidents and interactions.

Desired Resolution: ${f.desiredResolution || "Thorough investigation of the matter and appropriate corrective action"}

I request that this complaint be investigated confidentially and resolved within a reasonable timeframe. I expect to be kept informed of the progress of the investigation. I reserve my rights under applicable employment and labor laws.`,

  "Insurance Claim": (f) =>
    `I am writing to formally file a complaint regarding the handling of my insurance claim with ${f.companyName}.

Details of the complaint:
${f.issueDetails}

Date of claim/incident: ${f.dateOfIncident || "[Date]"}

Despite fulfilling all requirements and submitting all necessary documentation in a timely manner, my claim has not been processed satisfactorily. As a policyholder who has consistently paid premiums, I expect fair and prompt claim settlement.

I have copies of my policy documents, claim application, all submitted documents, and communication records.

Desired Resolution: ${f.desiredResolution || "Fair and prompt settlement of the insurance claim as per policy terms"}

I request resolution within 15 business days as mandated by IRDAI (Insurance Regulatory and Development Authority of India) guidelines. Failure to address this complaint may result in my escalating the matter to the IRDAI Grievance Cell and the Insurance Ombudsman.`,

  "Bank Complaint": (f) =>
    `I am writing to formally lodge a complaint against ${f.companyName} regarding an issue with my banking services.

Details of the complaint:
${f.issueDetails}

Date of incident: ${f.dateOfIncident || "[Date]"}

This issue has caused me considerable financial and personal inconvenience. As a loyal customer, I expect a higher standard of banking service and adherence to regulatory guidelines set by the Reserve Bank of India.

I have maintained records of all transactions, communications, and relevant documents pertaining to this complaint.

Desired Resolution: ${f.desiredResolution || "Resolution of the banking issue with appropriate compensation for inconvenience caused"}

I request that this matter be investigated and resolved within 30 days as per RBI's Banking Ombudsman Scheme guidelines. If the complaint is not resolved satisfactorily, I will be compelled to escalate the matter to the RBI Banking Ombudsman.`,
};

export default function AiComplaintLetterGenerator() {
  const [complaintType, setComplaintType] = useState<ComplaintType>("Product Defect");
  const [form, setForm] = useState<FormData>({ companyName: "", issueDetails: "", dateOfIncident: "", desiredResolution: "" });
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const types: ComplaintType[] = ["Product Defect", "Service Issue", "Billing Error", "Delivery Problem", "Noise Complaint", "Workplace Issue", "Insurance Claim", "Bank Complaint"];

  const update = (key: keyof FormData, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const generate = () => {
    if (!form.companyName.trim() || !form.issueDetails.trim()) return;
    const refNo = generateRefNumber();
    const body = complaintBodies[complaintType](form);

    const letter = `FORMAL COMPLAINT LETTER
Reference No: ${refNo}
Date: ${today()}

To,
The Manager / Grievance Cell
${form.companyName}

Subject: Formal Complaint - ${complaintType}
Reference Number: ${refNo}

Respected Sir/Madam,

${body}

I am attaching copies of all relevant documents for your reference. I have retained the originals for my records.

Please acknowledge receipt of this complaint and provide me with a timeline for resolution. I can be reached at the contact details provided below for any clarification.

Yours faithfully,
[Your Name]
[Your Address]
[Your Contact Number]
[Your Email Address]

Enclosures:
1. Copy of relevant documents/receipts
2. Photographs/screenshots (if applicable)
3. Previous correspondence (if any)

Note: This complaint is being sent via registered post / email for record purposes.`;

    setResult(letter);
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Complaint Letter</title><style>body{font-family:'Times New Roman',serif;max-width:700px;margin:40px auto;line-height:1.8;color:#222;padding:30px;font-size:13px}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre>${result}</pre></body></html>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Complaint Type</label>
        <select className="calc-input" value={complaintType} onChange={(e) => setComplaintType(e.target.value as ComplaintType)}>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Company / Person Name</label>
          <input className="calc-input" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="e.g. XYZ Corporation Pvt. Ltd." />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Date of Incident</label>
          <input className="calc-input" type="date" value={form.dateOfIncident} onChange={(e) => update("dateOfIncident", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Issue Details</label>
        <textarea className="calc-input min-h-[120px]" value={form.issueDetails} onChange={(e) => update("issueDetails", e.target.value)} placeholder="Describe the issue in detail - what happened, order numbers, amounts involved, previous attempts to resolve..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Desired Resolution</label>
        <input className="calc-input" value={form.desiredResolution} onChange={(e) => update("desiredResolution", e.target.value)} placeholder="e.g. Full refund, replacement, compensation" />
      </div>
      <button onClick={generate} className="btn-primary">Generate Complaint Letter</button>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm font-bold text-gray-600">Formal {complaintType} Complaint</span>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary text-xs">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={handlePrint} className="btn-secondary text-xs">Print</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
