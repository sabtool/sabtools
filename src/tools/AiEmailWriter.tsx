"use client";
import { useState } from "react";

type EmailType = "Job Application" | "Leave Request" | "Meeting Request" | "Follow-up" | "Complaint" | "Thank You" | "Resignation" | "Introduction" | "Inquiry" | "Apology";

const emailTemplates: Record<EmailType, { subject: (d: D) => string; body: (d: D) => string }> = {
  "Job Application": {
    subject: (d) => `Application for the Position – ${d.yourName}`,
    body: (d) => `Dear ${d.recipient},\n\nI am writing to express my keen interest in the position at your esteemed organization. With my background and skills, I am confident that I would be a valuable addition to your team.\n\n${d.details}\n\nI have attached my resume for your review and would welcome the opportunity to discuss how my qualifications align with your requirements. I am available for an interview at your earliest convenience.\n\nThank you for considering my application. I look forward to hearing from you.\n\nBest regards,\n${d.yourName}`,
  },
  "Leave Request": {
    subject: (d) => `Leave Request – ${d.yourName}`,
    body: (d) => `Dear ${d.recipient},\n\nI am writing to formally request leave from work. ${d.details}\n\nI will ensure that all my pending tasks are completed or properly handed over before my leave begins. I will also be reachable via email for any urgent matters.\n\nI would appreciate your approval at your earliest convenience. Please let me know if you need any additional information.\n\nThank you for your understanding.\n\nSincerely,\n${d.yourName}`,
  },
  "Meeting Request": {
    subject: (d) => `Meeting Request: Discussion Regarding Project Updates`,
    body: (d) => `Dear ${d.recipient},\n\nI hope this message finds you well. I would like to request a meeting to discuss some important matters.\n\n${d.details}\n\nI am flexible with the timing and can adjust to your schedule. Please let me know a date and time that works best for you. The meeting should take approximately 30-45 minutes.\n\nLooking forward to your response.\n\nBest regards,\n${d.yourName}`,
  },
  "Follow-up": {
    subject: (d) => `Follow-up: Regarding Our Previous Discussion`,
    body: (d) => `Dear ${d.recipient},\n\nI hope you are doing well. I am writing to follow up on our previous conversation.\n\n${d.details}\n\nI understand you have a busy schedule, and I appreciate your time. If you need any additional information from my end, please do not hesitate to reach out.\n\nLooking forward to your response.\n\nWarm regards,\n${d.yourName}`,
  },
  "Complaint": {
    subject: (d) => `Formal Complaint Regarding Service/Product Issue`,
    body: (d) => `Dear ${d.recipient},\n\nI am writing to bring to your attention an issue that requires immediate resolution.\n\n${d.details}\n\nI have been a loyal customer and expect a higher standard of service. I kindly request that this matter be addressed promptly. I would appreciate a response within 48 hours outlining the steps being taken to resolve this issue.\n\nThank you for your attention to this matter.\n\nSincerely,\n${d.yourName}`,
  },
  "Thank You": {
    subject: (d) => `Thank You – ${d.yourName}`,
    body: (d) => `Dear ${d.recipient},\n\nI wanted to take a moment to express my sincere gratitude.\n\n${d.details}\n\nYour support and generosity mean a great deal to me. I truly appreciate the time and effort you have invested, and I want you to know that it has made a significant positive impact.\n\nThank you once again for everything.\n\nWith warm regards,\n${d.yourName}`,
  },
  "Resignation": {
    subject: (d) => `Resignation – ${d.yourName}`,
    body: (d) => `Dear ${d.recipient},\n\nI am writing to formally notify you of my resignation from my position, effective [last working date].\n\n${d.details}\n\nI am grateful for the opportunities for professional growth that the organization has provided me. I will do my best to ensure a smooth transition during my notice period and am happy to assist in training my replacement.\n\nThank you for the support and mentorship over the years.\n\nSincerely,\n${d.yourName}`,
  },
  "Introduction": {
    subject: (d) => `Introduction – ${d.yourName}`,
    body: (d) => `Dear ${d.recipient},\n\nI hope this email finds you well. I wanted to take a moment to introduce myself.\n\n${d.details}\n\nI am keen to connect and explore how we might collaborate or support each other professionally. I would love the opportunity to have a brief conversation at your convenience.\n\nLooking forward to connecting with you.\n\nBest regards,\n${d.yourName}`,
  },
  "Inquiry": {
    subject: (d) => `Inquiry Regarding Your Services/Products`,
    body: (d) => `Dear ${d.recipient},\n\nI hope this message finds you well. I am reaching out to inquire about the following:\n\n${d.details}\n\nI would greatly appreciate it if you could provide me with detailed information, including pricing, availability, and any relevant terms. If possible, I would also like to schedule a brief call to discuss this further.\n\nThank you for your time. I look forward to your response.\n\nBest regards,\n${d.yourName}`,
  },
  "Apology": {
    subject: (d) => `Sincere Apology – ${d.yourName}`,
    body: (d) => `Dear ${d.recipient},\n\nI am writing to sincerely apologize for the recent situation.\n\n${d.details}\n\nI take full responsibility for what happened and understand the inconvenience it may have caused. I assure you that I am taking steps to prevent such occurrences in the future.\n\nI value our relationship and hope that we can move forward from this. Please let me know if there is anything I can do to make things right.\n\nWith sincere apologies,\n${d.yourName}`,
  },
};

interface D { recipient: string; yourName: string; details: string }

const emailTypes: EmailType[] = ["Job Application", "Leave Request", "Meeting Request", "Follow-up", "Complaint", "Thank You", "Resignation", "Introduction", "Inquiry", "Apology"];

export default function AiEmailWriter() {
  const [type, setType] = useState<EmailType>("Job Application");
  const [recipient, setRecipient] = useState("");
  const [yourName, setYourName] = useState("");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!recipient.trim() || !yourName.trim()) return;
    const d: D = { recipient: recipient.trim(), yourName: yourName.trim(), details: details.trim() || "[Your specific details here]" };
    const t = emailTemplates[type];
    setResult({ subject: t.subject(d), body: t.body(d) });
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard?.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Email Type</label>
        <select className="calc-input" value={type} onChange={(e) => setType(e.target.value as EmailType)}>
          {emailTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient Name</label>
          <input className="calc-input" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Mr. Sharma" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input className="calc-input" value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="e.g. Rahul Kumar" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Details</label>
        <textarea className="calc-input min-h-[100px]" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Add specific details for your email..." />
      </div>
      <button onClick={generate} className="btn-primary">Generate Email</button>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Generated Email</span>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy All"}</button>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Subject</p>
            <p className="font-semibold text-gray-800">{result.subject}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Body</p>
            {result.body.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 ${line === "" ? "h-3" : ""}`}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
