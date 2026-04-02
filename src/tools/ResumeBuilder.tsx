"use client";
import { useState, useMemo, useRef } from "react";

interface Experience {
  id: number; company: string; role: string; startDate: string; endDate: string; bullets: string;
}
interface Education {
  id: number; school: string; degree: string; year: string; grade: string;
}
interface Project {
  id: number; name: string; description: string; link: string;
}
interface Certification {
  id: number; name: string; issuer: string; year: string;
}

const TEMPLATES = ["Classic", "Modern", "Creative"] as const;
type Template = typeof TEMPLATES[number];

export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<Template>("Classic");
  const previewRef = useRef<HTMLDivElement>(null);

  // Personal Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Summary
  const [summary, setSummary] = useState("");

  // Work Experience
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const addExperience = () => setExperiences([...experiences, { id: Date.now(), company: "", role: "", startDate: "", endDate: "", bullets: "" }]);
  const updateExp = (id: number, field: keyof Experience, value: string) =>
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  const removeExp = (id: number) => setExperiences(experiences.filter(e => e.id !== id));

  // Education
  const [education, setEducation] = useState<Education[]>([]);
  const addEducation = () => setEducation([...education, { id: Date.now(), school: "", degree: "", year: "", grade: "" }]);
  const updateEdu = (id: number, field: keyof Education, value: string) =>
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  const removeEdu = (id: number) => setEducation(education.filter(e => e.id !== id));

  // Skills
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const addSkill = () => { if (skillInput.trim()) { setSkills([...skills, skillInput.trim()]); setSkillInput(""); } };
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const addProject = () => setProjects([...projects, { id: Date.now(), name: "", description: "", link: "" }]);
  const updateProject = (id: number, field: keyof Project, value: string) =>
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  const removeProject = (id: number) => setProjects(projects.filter(p => p.id !== id));

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const addCert = () => setCertifications([...certifications, { id: Date.now(), name: "", issuer: "", year: "" }]);
  const updateCert = (id: number, field: keyof Certification, value: string) =>
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));
  const removeCert = (id: number) => setCertifications(certifications.filter(c => c.id !== id));

  const steps = ["Personal Info", "Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Preview"];

  const handlePrint = () => {
    const content = previewRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>${name} - Resume</title><style>
      body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#222;font-size:12px;line-height:1.5}
      h1{margin:0 0 4px;font-size:22px} h2{border-bottom:2px solid #333;padding-bottom:4px;margin:14px 0 8px;font-size:14px;text-transform:uppercase}
      .contact{color:#555;font-size:11px;margin-bottom:10px}
      .exp-item,.edu-item{margin-bottom:10px} .exp-header{display:flex;justify-content:space-between;font-weight:bold}
      .skills-list{display:flex;flex-wrap:wrap;gap:6px} .skill-tag{background:#e0e7ff;padding:2px 10px;border-radius:12px;font-size:11px}
      ul{margin:4px 0;padding-left:18px} li{margin:2px 0}
      ${template === "Modern" ? "h1{color:#4338ca} h2{color:#4338ca;border-color:#4338ca}" : ""}
      ${template === "Creative" ? "h1{color:#9333ea;font-style:italic} h2{color:#9333ea;border-color:#9333ea} .skill-tag{background:#f3e8ff;color:#7c3aed}" : ""}
    </style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const templateColors = useMemo(() => {
    if (template === "Modern") return { heading: "text-indigo-700", border: "border-indigo-600", tag: "bg-indigo-100 text-indigo-700" };
    if (template === "Creative") return { heading: "text-purple-600", border: "border-purple-500", tag: "bg-purple-100 text-purple-700" };
    return { heading: "text-gray-800", border: "border-gray-700", tag: "bg-gray-200 text-gray-700" };
  }, [template]);

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${step === i ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      {/* Template selector */}
      <div className="flex gap-2">
        <span className="text-sm font-semibold text-gray-700">Template:</span>
        {TEMPLATES.map(t => (
          <button key={t} onClick={() => setTemplate(t)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${template === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t}</button>
        ))}
      </div>

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
              <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
              <input type="email" placeholder="rahul@email.com" value={email} onChange={e => setEmail(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Phone</label>
              <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className="calc-input" /></div>
            <div><label className="text-sm font-semibold text-gray-700 block mb-2">Location</label>
              <input type="text" placeholder="Mumbai, India" value={location} onChange={e => setLocation(e.target.value)} className="calc-input" /></div>
            <div className="sm:col-span-2"><label className="text-sm font-semibold text-gray-700 block mb-2">LinkedIn Profile URL</label>
              <input type="url" placeholder="https://linkedin.com/in/rahul-sharma" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="calc-input" /></div>
          </div>
        </div>
      )}

      {/* Step 1: Summary */}
      {step === 1 && (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Professional Summary</label>
          <textarea rows={5} placeholder="A passionate software engineer with 5+ years of experience..." value={summary} onChange={e => setSummary(e.target.value)} className="calc-input" />
        </div>
      )}

      {/* Step 2: Experience */}
      {step === 2 && (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Company" value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} className="calc-input" />
                <input type="text" placeholder="Role / Job Title" value={exp.role} onChange={e => updateExp(exp.id, "role", e.target.value)} className="calc-input" />
                <input type="text" placeholder="Start Date (e.g. Jan 2020)" value={exp.startDate} onChange={e => updateExp(exp.id, "startDate", e.target.value)} className="calc-input" />
                <input type="text" placeholder="End Date (or Present)" value={exp.endDate} onChange={e => updateExp(exp.id, "endDate", e.target.value)} className="calc-input" />
              </div>
              <textarea rows={3} placeholder="Key achievements / bullet points (one per line)" value={exp.bullets} onChange={e => updateExp(exp.id, "bullets", e.target.value)} className="calc-input" />
              <button onClick={() => removeExp(exp.id)} className="btn-secondary text-xs">Remove</button>
            </div>
          ))}
          <button onClick={addExperience} className="btn-primary">+ Add Experience</button>
        </div>
      )}

      {/* Step 3: Education */}
      {step === 3 && (
        <div className="space-y-4">
          {education.map(edu => (
            <div key={edu.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="School / University" value={edu.school} onChange={e => updateEdu(edu.id, "school", e.target.value)} className="calc-input" />
                <input type="text" placeholder="Degree (e.g. B.Tech CS)" value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} className="calc-input" />
                <input type="text" placeholder="Year (e.g. 2020)" value={edu.year} onChange={e => updateEdu(edu.id, "year", e.target.value)} className="calc-input" />
                <input type="text" placeholder="Grade / CGPA" value={edu.grade} onChange={e => updateEdu(edu.id, "grade", e.target.value)} className="calc-input" />
              </div>
              <button onClick={() => removeEdu(edu.id)} className="btn-secondary text-xs">Remove</button>
            </div>
          ))}
          <button onClick={addEducation} className="btn-primary">+ Add Education</button>
        </div>
      )}

      {/* Step 4: Skills */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input type="text" placeholder="Type a skill and press Add" value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} className="calc-input flex-1" />
            <button onClick={addSkill} className="btn-primary">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                {s} <button onClick={() => removeSkill(i)} className="hover:text-red-500 ml-1 font-bold">&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Projects */}
      {step === 5 && (
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Project Name" value={p.name} onChange={e => updateProject(p.id, "name", e.target.value)} className="calc-input" />
                <input type="text" placeholder="Link (optional)" value={p.link} onChange={e => updateProject(p.id, "link", e.target.value)} className="calc-input" />
              </div>
              <textarea rows={2} placeholder="Brief description" value={p.description} onChange={e => updateProject(p.id, "description", e.target.value)} className="calc-input" />
              <button onClick={() => removeProject(p.id)} className="btn-secondary text-xs">Remove</button>
            </div>
          ))}
          <button onClick={addProject} className="btn-primary">+ Add Project</button>
        </div>
      )}

      {/* Step 6: Certifications */}
      {step === 6 && (
        <div className="space-y-4">
          {certifications.map(c => (
            <div key={c.id} className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Certification Name" value={c.name} onChange={e => updateCert(c.id, "name", e.target.value)} className="calc-input" />
              <input type="text" placeholder="Issuing Organization" value={c.issuer} onChange={e => updateCert(c.id, "issuer", e.target.value)} className="calc-input" />
              <div className="flex gap-2">
                <input type="text" placeholder="Year" value={c.year} onChange={e => updateCert(c.id, "year", e.target.value)} className="calc-input flex-1" />
                <button onClick={() => removeCert(c.id)} className="btn-secondary text-xs">Remove</button>
              </div>
            </div>
          ))}
          <button onClick={addCert} className="btn-primary">+ Add Certification</button>
        </div>
      )}

      {/* Step 7: Preview */}
      {step === 7 && (
        <div className="space-y-4">
          <button onClick={handlePrint} className="btn-primary">Print / Download PDF</button>
          <div ref={previewRef} className="bg-white border rounded-xl p-8 shadow-sm" style={{ fontFamily: template === "Creative" ? "Georgia, serif" : "Arial, sans-serif" }}>
            <h1 className={`text-2xl font-bold ${templateColors.heading}`}>{name || "Your Name"}</h1>
            <div className="text-sm text-gray-500 mb-4">
              {[email, phone, location, linkedin].filter(Boolean).join(" | ")}
            </div>

            {summary && (<><h2 className={`text-sm font-bold uppercase tracking-wider ${templateColors.heading} border-b-2 ${templateColors.border} pb-1 mt-4 mb-2`}>Summary</h2>
              <p className="text-sm text-gray-700">{summary}</p></>)}

            {experiences.length > 0 && (<><h2 className={`text-sm font-bold uppercase tracking-wider ${templateColors.heading} border-b-2 ${templateColors.border} pb-1 mt-4 mb-2`}>Experience</h2>
              {experiences.map(exp => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between text-sm"><span className="font-bold">{exp.role}</span><span className="text-gray-500">{exp.startDate} - {exp.endDate}</span></div>
                  <div className="text-sm text-gray-600 italic">{exp.company}</div>
                  {exp.bullets && <ul className="text-sm text-gray-700 list-disc pl-5 mt-1">{exp.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>}
                </div>
              ))}</>)}

            {education.length > 0 && (<><h2 className={`text-sm font-bold uppercase tracking-wider ${templateColors.heading} border-b-2 ${templateColors.border} pb-1 mt-4 mb-2`}>Education</h2>
              {education.map(edu => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between text-sm"><span className="font-bold">{edu.degree}</span><span className="text-gray-500">{edu.year}</span></div>
                  <div className="text-sm text-gray-600">{edu.school}{edu.grade ? ` | ${edu.grade}` : ""}</div>
                </div>
              ))}</>)}

            {skills.length > 0 && (<><h2 className={`text-sm font-bold uppercase tracking-wider ${templateColors.heading} border-b-2 ${templateColors.border} pb-1 mt-4 mb-2`}>Skills</h2>
              <div className="flex flex-wrap gap-2">{skills.map((s, i) => <span key={i} className={`${templateColors.tag} px-2 py-0.5 rounded-full text-xs`}>{s}</span>)}</div></>)}

            {projects.length > 0 && (<><h2 className={`text-sm font-bold uppercase tracking-wider ${templateColors.heading} border-b-2 ${templateColors.border} pb-1 mt-4 mb-2`}>Projects</h2>
              {projects.map(p => (
                <div key={p.id} className="mb-2 text-sm"><span className="font-bold">{p.name}</span>{p.link && <span className="text-gray-500"> ({p.link})</span>}
                  {p.description && <p className="text-gray-700">{p.description}</p>}</div>
              ))}</>)}

            {certifications.length > 0 && (<><h2 className={`text-sm font-bold uppercase tracking-wider ${templateColors.heading} border-b-2 ${templateColors.border} pb-1 mt-4 mb-2`}>Certifications</h2>
              {certifications.map(c => (
                <div key={c.id} className="text-sm mb-1"><span className="font-bold">{c.name}</span> - {c.issuer} ({c.year})</div>
              ))}</>)}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          className={step === 0 ? "btn-secondary opacity-50" : "btn-secondary"}>Previous</button>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}
          className={step === steps.length - 1 ? "btn-primary opacity-50" : "btn-primary"}>Next</button>
      </div>
    </div>
  );
}
