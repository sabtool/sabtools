"use client";
import { useState } from "react";

type Situation = "Late Delivery" | "Missed Deadline" | "Mistake at Work" | "Personal Offense" | "Service Issue" | "Cancellation";

const situations: Situation[] = ["Late Delivery", "Missed Deadline", "Mistake at Work", "Personal Offense", "Service Issue", "Cancellation"];

const templates: Record<Situation, (name: string, detail: string, fix: string) => string> = {
  "Late Delivery": (n, d, f) =>
    `Dear ${n},\n\nI am writing to sincerely apologize for the late delivery${d ? ` of ${d}` : ""}. I understand that timely delivery is crucial and that this delay may have caused you significant inconvenience.\n\nI take full responsibility for this situation. The delay was unacceptable, and I want you to know that I deeply regret any disruption it may have caused to your plans or operations.\n\n${f ? `To address this issue, ${f}. ` : ""}I am taking immediate steps to review and improve our delivery processes to ensure this does not happen again. This includes implementing better tracking systems and more realistic timeline estimates.\n\nI am committed to earning back your trust through consistent, reliable service going forward. Your satisfaction is my top priority, and I will personally oversee future deliveries to ensure they meet the highest standards.\n\nPlease accept my sincerest apologies.\n\nRespectfully,`,

  "Missed Deadline": (n, d, f) =>
    `Dear ${n},\n\nI want to sincerely apologize for missing the deadline${d ? ` for ${d}` : ""}. I understand the importance of meeting commitments, and I deeply regret falling short of expectations in this instance.\n\nThere is no excuse for missing a deadline that was agreed upon, and I take complete ownership of this lapse. I recognize that my failure to deliver on time may have impacted your schedule and caused additional stress.\n\n${f ? `To rectify the situation, ${f}. ` : ""}Moving forward, I am implementing a more rigorous project management approach with built-in buffer time and regular progress checkpoints to ensure all future deadlines are met without exception.\n\nI value our professional relationship greatly and am determined to demonstrate through my actions that this was an isolated incident. You have my word that I will prioritize reliability and clear communication going forward.\n\nWith sincere apologies,`,

  "Mistake at Work": (n, d, f) =>
    `Dear ${n},\n\nI am writing to take full responsibility for the mistake${d ? ` regarding ${d}` : " that occurred recently"}. I want to be transparent about what happened and assure you that I am taking this matter very seriously.\n\nI understand that this error has caused inconvenience and may have affected trust in my work. I want you to know that this does not reflect the standard I hold myself to, and I am genuinely sorry for any negative consequences that resulted from my oversight.\n\n${f ? `To address and correct this, ${f}. ` : ""}I have already begun a thorough review of my processes to identify where things went wrong and to implement safeguards that will prevent similar mistakes in the future. I am also committed to additional diligence and double-checking procedures for all critical tasks.\n\nI appreciate your understanding and patience. I am dedicated to rebuilding your confidence in my work through consistent, high-quality performance.\n\nSincerely,`,

  "Personal Offense": (n, d, f) =>
    `Dear ${n},\n\nI owe you a heartfelt apology. ${d ? `What I did — ${d} — ` : "My actions "}was wrong, and I am truly sorry for the hurt I caused you.\n\nLooking back, I realize how my behavior was thoughtless and disrespectful. You did not deserve to be treated that way, and I take full responsibility for my actions. There is no justification for causing someone pain, and I deeply regret it.\n\n${f ? `Going forward, ${f}. ` : ""}I am committed to being more mindful, empathetic, and respectful in all my interactions. I understand that words alone may not be enough, and I am prepared to demonstrate through my actions that I have learned from this experience.\n\nOur relationship means a great deal to me, and I hope that with time, I can earn your forgiveness and rebuild the trust that my actions may have damaged.\n\nWith deepest regret and sincerity,`,

  "Service Issue": (n, d, f) =>
    `Dear ${n},\n\nI am writing to extend my sincerest apologies for the service issue${d ? ` you experienced with ${d}` : " you recently encountered"}. This falls far below the standards we are committed to maintaining, and I completely understand your frustration.\n\nYour experience matters to us, and I am personally disappointed that we failed to meet your expectations. I want you to know that this situation is being treated with the highest priority.\n\n${f ? `To resolve this matter, ${f}. ` : ""}We are conducting a comprehensive review of our service protocols and implementing additional quality control measures to ensure that every customer receives the exceptional experience they deserve.\n\nAs a valued customer, your satisfaction is paramount to us. I am committed to making this right and ensuring that your future interactions with us are nothing short of excellent.\n\nPlease do not hesitate to reach out directly if you need any further assistance.\n\nWith sincere apologies,`,

  "Cancellation": (n, d, f) =>
    `Dear ${n},\n\nI am writing to sincerely apologize for the cancellation${d ? ` of ${d}` : ""}. I understand that this has caused inconvenience and disappointment, and I deeply regret the situation.\n\nThis decision was not taken lightly, and I want to be transparent about the circumstances while acknowledging that the impact on you is what matters most. Your time and plans are valuable, and I am sorry for disrupting them.\n\n${f ? `To make up for this inconvenience, ${f}. ` : ""}I am also taking steps to improve our planning and communication processes to minimize the likelihood of such cancellations in the future.\n\nI understand that trust is built through consistency, and I am committed to demonstrating reliability in all future engagements. Your understanding and patience are greatly appreciated.\n\nPlease accept my heartfelt apologies.\n\nSincerely,`,
};

export default function AiApologyLetter() {
  const [situation, setSituation] = useState<Situation>("Late Delivery");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [fix, setFix] = useState("");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!name.trim()) return;
    setLetter(templates[situation](name.trim(), detail.trim(), fix.trim()));
  };

  const copy = () => {
    navigator.clipboard?.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Situation</label>
        <select className="calc-input" value={situation} onChange={(e) => setSituation(e.target.value as Situation)}>
          {situations.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient Name</label>
        <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mr. Verma" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">What Happened (specific detail)</label>
        <textarea className="calc-input min-h-[80px]" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Describe what happened..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">How You Will Fix It</label>
        <textarea className="calc-input min-h-[80px]" value={fix} onChange={(e) => setFix(e.target.value)} placeholder="Describe the steps you'll take to resolve this..." />
      </div>
      <button onClick={generate} className="btn-primary">Generate Apology Letter</button>
      {letter && (
        <div className="result-card space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Apology Letter</span>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            {letter.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 leading-relaxed ${line === "" ? "h-3" : ""}`}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
