"use client";
import { useState } from "react";

type LetterType = "Application" | "Request" | "Permission" | "Complaint" | "Recommendation" | "Appreciation" | "Transfer Request" | "NOC Request" | "Experience Certificate Request";

interface FormData {
  senderName: string;
  designation: string;
  recipientName: string;
  organization: string;
  details: string;
}

const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const letterTemplates: Record<LetterType, (f: FormData) => { subject: string; body: string }> = {
  Application: (f) => ({
    subject: `Application for the Position of ${f.details || "[Position Title]"}`,
    body: `I am writing to apply for the position of ${f.details || "[Position Title]"} at ${f.organization}. I am confident that my skills, qualifications, and experience make me a strong candidate for this role.\n\nI have a proven track record of delivering results and contributing meaningfully to organizational goals. My background has equipped me with the necessary expertise to excel in this position.\n\nI have enclosed my resume for your kind consideration. I would welcome the opportunity to discuss how my qualifications align with your requirements in an interview.\n\nI look forward to your favorable response at your earliest convenience.`,
  }),
  Request: (f) => ({
    subject: `Request for ${f.details || "[Specific Request]"}`,
    body: `I am writing to formally request ${f.details || "[specific request details]"} from ${f.organization}.\n\nThis request is being made due to genuine necessity, and I believe it falls within the scope of reasonable accommodation. I have provided all relevant details below for your review.\n\nI understand that processing such requests may take time, and I am happy to provide any additional information or documentation that may be required.\n\nI would be grateful if this matter could be addressed at your earliest convenience. Thank you for your time and consideration.`,
  }),
  Permission: (f) => ({
    subject: `Request for Permission: ${f.details || "[Purpose]"}`,
    body: `I am writing to seek your kind permission for ${f.details || "[specific purpose]"}.\n\nI assure you that this will not interfere with my regular duties and responsibilities. All necessary arrangements have been made to ensure minimal disruption.\n\nI understand the importance of following proper protocol and would be happy to discuss this matter further if needed.\n\nI would greatly appreciate your approval and look forward to your positive response. Thank you for your understanding.`,
  }),
  Complaint: (f) => ({
    subject: `Formal Complaint Regarding ${f.details || "[Issue Description]"}`,
    body: `I am writing to formally bring to your attention a matter of serious concern regarding ${f.details || "[issue description]"}.\n\nDespite my previous attempts to resolve this matter through informal channels, the issue persists and has caused significant inconvenience. I have maintained records of all relevant interactions and evidence pertaining to this complaint.\n\nI request that this matter be investigated thoroughly and appropriate corrective action be taken within a reasonable timeframe.\n\nI trust that ${f.organization} will treat this complaint with the seriousness it deserves. I am available for further discussion if required. Kindly acknowledge receipt of this complaint.`,
  }),
  Recommendation: (f) => ({
    subject: `Letter of Recommendation for ${f.details || "[Candidate Name]"}`,
    body: `I am pleased to write this letter of recommendation for ${f.details || "[Candidate Name]"}, who has been associated with ${f.organization} during my tenure.\n\nDuring our time working together, I have observed exceptional qualities including dedication, professionalism, and a strong work ethic. Their contributions have consistently exceeded expectations and added significant value to our team.\n\nThey possess excellent communication skills, demonstrate leadership capabilities, and maintain a positive attitude even in challenging situations.\n\nI wholeheartedly recommend them for any opportunity they choose to pursue. Please do not hesitate to contact me if you require any additional information.`,
  }),
  Appreciation: (f) => ({
    subject: `Letter of Appreciation`,
    body: `I am writing to express my sincere appreciation for ${f.details || "[reason for appreciation]"}.\n\nYour efforts and dedication have not gone unnoticed. The quality of work, commitment, and professionalism demonstrated are truly commendable and serve as an inspiration to others.\n\nSuch contributions play a vital role in the success and growth of ${f.organization}, and I want you to know that your hard work is deeply valued.\n\nPlease accept my heartfelt gratitude. I look forward to continued excellence and collaboration.`,
  }),
  "Transfer Request": (f) => ({
    subject: `Request for Transfer to ${f.details || "[Desired Location/Department]"}`,
    body: `I am writing to formally request a transfer to ${f.details || "[desired location/department]"}. I have been serving in my current position at ${f.organization} with dedication and commitment.\n\nThis transfer request is being made due to personal and professional reasons that I believe will be mutually beneficial. I am confident that my skills and experience will enable me to contribute effectively in the new role or location.\n\nI assure you that I will ensure a smooth handover of all current responsibilities before the transfer takes effect.\n\nI request your kind consideration of this matter and would be happy to discuss it further at your convenience.`,
  }),
  "NOC Request": (f) => ({
    subject: `Request for No Objection Certificate (NOC)`,
    body: `I am writing to request a No Objection Certificate (NOC) from ${f.organization} for the purpose of ${f.details || "[specific purpose such as higher studies, passport, visa, etc.]"}.\n\nI confirm that I have fulfilled all my obligations and there are no pending dues or issues from my end. I have attached the relevant documents for your reference.\n\nThis NOC is required to be submitted to the concerned authorities, and I would be grateful if it could be issued at the earliest.\n\nThank you for your cooperation and assistance in this matter. Please let me know if any additional information is required.`,
  }),
  "Experience Certificate Request": (f) => ({
    subject: `Request for Experience Certificate`,
    body: `I am writing to request an Experience Certificate for the period of my employment at ${f.organization}. ${f.details ? `Additional details: ${f.details}` : ""}\n\nDuring my tenure, I have diligently performed all duties assigned to me and have maintained a professional standard of work. I have completed all handover formalities and cleared any pending obligations.\n\nThe experience certificate is required for my future career prospects and professional records. I would appreciate if the certificate could include details of my role, duration of employment, and performance.\n\nI kindly request that this certificate be issued at the earliest. Thank you for your time and assistance.`,
  }),
};

export default function AiFormalLetterWriter() {
  const [letterType, setLetterType] = useState<LetterType>("Application");
  const [form, setForm] = useState<FormData>({ senderName: "", designation: "", recipientName: "", organization: "", details: "" });
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const letterTypes: LetterType[] = ["Application", "Request", "Permission", "Complaint", "Recommendation", "Appreciation", "Transfer Request", "NOC Request", "Experience Certificate Request"];

  const update = (key: keyof FormData, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const generate = () => {
    if (!form.senderName.trim() || !form.recipientName.trim()) return;
    const tmpl = letterTemplates[letterType](form);

    const letter = `${form.senderName}
${form.designation || "[Your Designation]"}
${form.organization || "[Organization Name]"}

Date: ${today()}

To,
${form.recipientName}
${form.organization || "[Organization Name]"}

Subject: ${tmpl.subject}

Respected ${form.recipientName},

${tmpl.body}

Thanking you,

Yours sincerely,
${form.senderName}
${form.designation || "[Your Designation]"}`;

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
      w.document.write(`<html><head><title>Formal Letter</title><style>body{font-family:'Times New Roman',serif;max-width:700px;margin:40px auto;line-height:1.8;color:#222;padding:30px;font-size:14px}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre>${result}</pre></body></html>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Letter Type</label>
        <select className="calc-input" value={letterType} onChange={(e) => setLetterType(e.target.value as LetterType)}>
          {letterTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input className="calc-input" value={form.senderName} onChange={(e) => update("senderName", e.target.value)} placeholder="e.g. Rahul Kumar" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Designation</label>
          <input className="calc-input" value={form.designation} onChange={(e) => update("designation", e.target.value)} placeholder="e.g. Senior Manager" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient Name</label>
          <input className="calc-input" value={form.recipientName} onChange={(e) => update("recipientName", e.target.value)} placeholder="e.g. The HR Manager" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Organization</label>
          <input className="calc-input" value={form.organization} onChange={(e) => update("organization", e.target.value)} placeholder="e.g. ABC Technologies Pvt. Ltd." />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Details</label>
        <textarea className="calc-input min-h-[100px]" value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Add specific details relevant to your letter type..." />
      </div>
      <button onClick={generate} className="btn-primary">Generate Letter</button>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm font-bold text-gray-600">Formal {letterType} Letter</span>
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
