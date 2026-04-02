"use client";
import { useState } from "react";

export default function AiCoverLetterGenerator() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [years, setYears] = useState("");
  const [whyCompany, setWhyCompany] = useState("");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!name.trim() || !jobTitle.trim() || !company.trim()) return;
    const sk = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const skillStr = sk.length > 2 ? `${sk.slice(0, -1).join(", ")}, and ${sk[sk.length - 1]}` : sk.join(" and ") || "relevant technical and professional skills";
    const yr = years.trim() || "several";
    const why = whyCompany.trim() || `${company}'s reputation for innovation and excellence`;

    const paragraphs = [
      `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the ${jobTitle} position at ${company}. With ${yr} years of professional experience and a strong background in ${sk[0] || "the relevant field"}, I am confident in my ability to make a meaningful contribution to your team.`,
      `Throughout my career, I have developed deep expertise in ${skillStr}. I have consistently delivered results by combining technical proficiency with a collaborative approach to problem-solving. My experience has equipped me with the ability to manage complex projects, meet tight deadlines, and adapt to evolving challenges. I take pride in my attention to detail and commitment to producing high-quality work that exceeds expectations.`,
      `What draws me to ${company} is ${why}. I am particularly impressed by the company's commitment to pushing boundaries in the industry, and I believe my background aligns well with the direction the organization is heading. I am eager to bring my skills in ${sk.slice(0, 2).join(" and ") || "this domain"} to contribute to ${company}'s continued growth and success.`,
      `I would welcome the opportunity to discuss how my experience and skills can benefit your team. I am available for an interview at your earliest convenience and look forward to the possibility of contributing to ${company}'s mission.\n\nThank you for considering my application.\n\nSincerely,\n${name}`,
    ];

    setLetter(paragraphs.join("\n\n"));
  };

  const copy = () => {
    navigator.clipboard?.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const print = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Cover Letter - ${name}</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;line-height:1.8;color:#333}p{margin-bottom:16px}</style></head><body>`);
      letter.split("\n").forEach((line) => { w.document.write(line ? `<p>${line}</p>` : ""); });
      w.document.write("</body></html>");
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ankit Verma" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Job Title Applying For</label>
          <input className="calc-input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Company Name</label>
          <input className="calc-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Years of Experience</label>
          <input className="calc-input" type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 5" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Your Skills (comma separated)</label>
        <input className="calc-input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, TypeScript, Node.js, AWS" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Why This Company?</label>
        <textarea className="calc-input min-h-[80px]" value={whyCompany} onChange={(e) => setWhyCompany(e.target.value)} placeholder="What excites you about this company?" />
      </div>
      <button onClick={generate} className="btn-primary">Generate Cover Letter</button>
      {letter && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Your Cover Letter</span>
            <div className="flex gap-3">
              <button onClick={print} className="text-xs text-gray-500 font-medium hover:underline">Print</button>
              <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            {letter.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 leading-relaxed ${line === "" ? "h-3" : ""}`}>{line}</p>
            ))}
          </div>
          <p className="text-xs text-gray-400">{letter.split(/\s+/).filter(Boolean).length} words</p>
        </div>
      )}
    </div>
  );
}
