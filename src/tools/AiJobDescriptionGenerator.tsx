"use client";
import { useState, useMemo } from "react";

const experienceLevels = ["Fresher", "1-3 years", "3-5 years", "5-10 years", "10+ years"] as const;
const companyTypes = ["Startup", "MNC", "Government", "NGO"] as const;

type ExpLevel = (typeof experienceLevels)[number];
type CompanyType = (typeof companyTypes)[number];

interface JD {
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
}

function generateJD(title: string, dept: string, exp: ExpLevel, skills: string[], compType: CompanyType): JD {
  const skillsList = skills.join(", ");
  const summaryTemplates: Record<CompanyType, string> = {
    Startup: `We are looking for a passionate ${title} to join our ${dept} team. As a fast-growing startup, you will have the opportunity to make a significant impact from day one. If you thrive in a dynamic, fast-paced environment and are excited about ${skillsList}, we want to hear from you.`,
    MNC: `We are seeking an experienced ${title} to join our ${dept} department. As part of a global organization, you will work with diverse teams across multiple geographies. The ideal candidate brings expertise in ${skillsList} and a track record of delivering results at scale.`,
    Government: `Applications are invited for the post of ${title} in the ${dept} department. The selected candidate will be responsible for executing duties as prescribed by the department guidelines. Candidates with proficiency in ${skillsList} are encouraged to apply.`,
    NGO: `We are looking for a dedicated ${title} to join our ${dept} team. You will contribute to our mission of creating positive social impact. The ideal candidate is passionate about ${skillsList} and committed to making a difference in communities.`,
  };

  const expYears = exp === "Fresher" ? "0-1" : exp === "1-3 years" ? "1-3" : exp === "3-5 years" ? "3-5" : exp === "5-10 years" ? "5-10" : "10+";

  const baseResponsibilities = [
    `Lead and execute ${dept.toLowerCase()} initiatives aligned with organizational goals`,
    `Collaborate with cross-functional teams to deliver high-quality outcomes`,
    `Apply expertise in ${skills[0] || "core domain"} to solve complex challenges`,
    `Develop and maintain documentation for processes and best practices`,
    `Participate in ${compType === "Startup" ? "sprint planning and agile ceremonies" : "team meetings and project reviews"}`,
    `Mentor ${exp === "Fresher" || exp === "1-3 years" ? "peers" : "junior team members"} and share knowledge`,
    `Stay updated with latest trends and technologies in ${skills.slice(0, 2).join(" and ")}`,
    `Report progress and metrics to ${exp === "5-10 years" || exp === "10+ years" ? "senior leadership" : "team lead/manager"}`,
    `Identify opportunities for process improvement and optimization`,
    `Ensure compliance with ${compType === "Government" ? "government regulations and policies" : "company standards and industry best practices"}`,
  ];

  const requirements = [
    `${expYears} years of professional experience in ${dept.toLowerCase()} or related field`,
    `Strong proficiency in ${skills.slice(0, 3).join(", ")}`,
    `${exp === "Fresher" ? "Bachelor's" : exp === "10+ years" ? "Master's preferred, Bachelor's" : "Bachelor's"} degree in a relevant discipline`,
    `Excellent communication and ${compType === "MNC" ? "cross-cultural collaboration" : "teamwork"} skills`,
    `${exp === "Fresher" ? "Eagerness to learn and adapt quickly" : "Proven track record of delivering results"}`,
    `Strong analytical and problem-solving abilities`,
    `${compType === "Government" ? "Knowledge of government procedures and compliance requirements" : "Ability to work in a fast-paced environment"}`,
  ];

  const niceToHave = [
    `Experience with ${skills.length > 2 ? skills[2] : "additional relevant tools"}`,
    `${compType === "MNC" ? "International work experience" : "Prior experience in a similar role"}`,
    `Relevant certifications or professional training`,
    `${exp !== "Fresher" ? "Leadership or team management experience" : "Internship or project experience in the field"}`,
  ];

  const benefitsMap: Record<CompanyType, string[]> = {
    Startup: ["Competitive salary with equity/ESOPs", "Flexible work hours and remote work options", "Learning and development budget", "Health insurance coverage", "Free meals/snacks at office", "Annual team retreats and offsites", "Rapid career growth opportunities"],
    MNC: ["Competitive compensation package", "Comprehensive health and life insurance", "Retirement benefits and provident fund", "Paid time off and holidays", "Learning and development programs", "Global mobility opportunities", "Employee wellness programs"],
    Government: ["Job security and pension benefits", "Government housing allowance (HRA)", "Dearness Allowance (DA)", "Medical reimbursement", "Leave Travel Allowance (LTA)", "Provident Fund and Gratuity", "Promotion as per government norms"],
    NGO: ["Meaningful work with social impact", "Health insurance coverage", "Professional development opportunities", "Flexible work arrangements", "Collaborative and supportive environment", "Field visit opportunities", "Annual retreats and team building"],
  };

  return {
    summary: summaryTemplates[compType],
    responsibilities: baseResponsibilities,
    requirements,
    niceToHave,
    benefits: benefitsMap[compType],
  };
}

export default function AiJobDescriptionGenerator() {
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("");
  const [exp, setExp] = useState<ExpLevel>("1-3 years");
  const [skillsInput, setSkillsInput] = useState("");
  const [compType, setCompType] = useState<CompanyType>("Startup");
  const [jd, setJd] = useState<JD | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!title.trim() || !dept.trim()) return;
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    setJd(generateJD(title, dept, exp, skills.length > 0 ? skills : ["relevant skills"], compType));
  };

  const fullText = useMemo(() => {
    if (!jd) return "";
    let t = `JOB DESCRIPTION: ${title.toUpperCase()}\nDepartment: ${dept} | Experience: ${exp} | Company Type: ${compType}\n\n`;
    t += `ABOUT THE ROLE\n${jd.summary}\n\n`;
    t += `RESPONSIBILITIES\n${jd.responsibilities.map((r) => `- ${r}`).join("\n")}\n\n`;
    t += `REQUIREMENTS\n${jd.requirements.map((r) => `- ${r}`).join("\n")}\n\n`;
    t += `NICE TO HAVE\n${jd.niceToHave.map((n) => `- ${n}`).join("\n")}\n\n`;
    t += `BENEFITS\n${jd.benefits.map((b) => `- ${b}`).join("\n")}`;
    return t;
  }, [jd, title, dept, exp, compType]);

  const copy = () => {
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Job Title</label>
          <input className="calc-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Software Engineer, Marketing Manager" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Department</label>
          <input className="calc-input" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g., Engineering, Marketing, Sales" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Experience Level</label>
          <select className="calc-input" value={exp} onChange={(e) => setExp(e.target.value as ExpLevel)}>
            {experienceLevels.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Company Type</label>
          <div className="flex gap-2 flex-wrap">
            {companyTypes.map((c) => (
              <button key={c} onClick={() => setCompType(c)} className={c === compType ? "btn-primary" : "btn-secondary"}>{c}</button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Skills (comma separated)</label>
        <input className="calc-input" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="e.g., React, Node.js, TypeScript, AWS" />
      </div>
      <button onClick={generate} className="btn-primary">Generate Job Description</button>

      {jd && (
        <div className="result-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy JD"}</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{dept}</span>
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded">{exp}</span>
            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">{compType}</span>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">About the Role</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{jd.summary}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Responsibilities</h4>
            <ul className="space-y-1">{jd.responsibilities.map((r, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-indigo-400">&#8226;</span>{r}</li>)}</ul>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Requirements</h4>
            <ul className="space-y-1">{jd.requirements.map((r, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-green-400">&#8226;</span>{r}</li>)}</ul>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Nice to Have</h4>
            <ul className="space-y-1">{jd.niceToHave.map((n, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-yellow-400">&#8226;</span>{n}</li>)}</ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Benefits</h4>
            <ul className="space-y-1">{jd.benefits.map((b, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-purple-400">&#8226;</span>{b}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}
