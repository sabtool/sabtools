"use client";
import { useState } from "react";

type Tone = "Professional" | "Casual" | "Creative";
type Platform = "LinkedIn" | "Twitter" | "Instagram" | "Resume";

const platformLimits: Record<Platform, number> = { LinkedIn: 2600, Twitter: 160, Instagram: 150, Resume: 500 };

function generateBios(name: string, profession: string, years: string, skills: string, achievements: string, tone: Tone, platform: Platform) {
  const sk = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const skillStr = sk.length > 2 ? `${sk.slice(0, -1).join(", ")} and ${sk[sk.length - 1]}` : sk.join(" and ");
  const topSkills = sk.slice(0, 3).join(", ");
  const ach = achievements.trim();
  const yr = years.trim();

  const bios: { label: string; text: string }[] = [];

  if (tone === "Professional") {
    bios.push({ label: "Short (1 line)", text: `${name} is a ${profession} with ${yr} years of expertise in ${topSkills}.` });
    bios.push({ label: "Medium (2-3 lines)", text: `${name} is an experienced ${profession} with ${yr} years of expertise in ${skillStr}. ${ach ? `Notable achievements include ${ach}.` : ""} Passionate about delivering high-quality results and driving impactful outcomes.` });
    bios.push({ label: "Long (Paragraph)", text: `${name} is a seasoned ${profession} with over ${yr} years of industry experience specializing in ${skillStr}. ${ach ? `Throughout their career, ${name} has ${ach}.` : ""} Known for a meticulous approach to problem-solving and a commitment to excellence, ${name} has consistently delivered results that exceed expectations. With a deep understanding of industry best practices and a passion for continuous learning, ${name} brings both strategic thinking and hands-on expertise to every project.` });
  } else if (tone === "Casual") {
    bios.push({ label: "Short (1 line)", text: `${name} | ${profession} | ${yr}+ years | ${topSkills}` });
    bios.push({ label: "Medium (2-3 lines)", text: `Hey there! I'm ${name}, a ${profession} who's been doing this for ${yr} years. I love working with ${skillStr}. ${ach ? `Proudest moment? ${ach}.` : ""} Always up for new challenges!` });
    bios.push({ label: "Long (Paragraph)", text: `I'm ${name}, and I've spent the last ${yr} years as a ${profession}, diving deep into ${skillStr}. ${ach ? `Along the way, I've managed to ${ach}, which was pretty cool.` : ""} When I'm not working, you'll probably find me exploring the latest trends in my field. I believe great work happens when passion meets skill, and I bring both to the table. Let's connect and create something awesome together!` });
  } else {
    bios.push({ label: "Short (1 line)", text: `${name} — ${profession} | Turning ${topSkills} into magic for ${yr}+ years.` });
    bios.push({ label: "Medium (2-3 lines)", text: `Part ${profession}, part dreamer, fully committed to ${skillStr}. ${name} has spent ${yr} years crafting experiences that matter. ${ach ? `Story highlight: ${ach}.` : ""} Currently plotting the next big thing.` });
    bios.push({ label: "Long (Paragraph)", text: `They say it takes 10,000 hours to master something. With ${yr} years as a ${profession}, ${name} has likely tripled that. Specializing in ${skillStr}, ${name} doesn't just follow trends — they set them. ${ach ? `When asked about proudest achievements: "${ach}."` : ""} Every project is a canvas, every challenge is an invitation, and every day is a chance to push boundaries. Welcome to the portfolio of possibilities.` });
  }

  // Apply platform-specific formatting
  if (platform === "Twitter") {
    return bios.map((b) => ({ ...b, text: b.text.length > 160 ? b.text.slice(0, 157) + "..." : b.text }));
  }
  if (platform === "Instagram") {
    return bios.map((b) => ({ ...b, text: b.text.length > 150 ? b.text.slice(0, 147) + "..." : b.text }));
  }
  return bios;
}

export default function AiBioGenerator() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [years, setYears] = useState("");
  const [skills, setSkills] = useState("");
  const [achievements, setAchievements] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [results, setResults] = useState<{ label: string; text: string }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!name.trim() || !profession.trim()) return;
    setResults(generateBios(name, profession, years || "5", skills, achievements, tone, platform));
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx].text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Patel" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Profession</label>
          <input className="calc-input" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="e.g. Software Engineer" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Years of Experience</label>
          <input className="calc-input" type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 8" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Key Skills (comma separated)</label>
          <input className="calc-input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, Node.js, AWS" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Achievements (optional)</label>
        <input className="calc-input" value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="e.g. Led a team of 10, increased revenue by 40%" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
          <div className="flex gap-2 flex-wrap">
            {(["Professional", "Casual", "Creative"] as Tone[]).map((t) => (
              <button key={t} onClick={() => setTone(t)} className={t === tone ? "btn-primary" : "btn-secondary"}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Platform</label>
          <div className="flex gap-2 flex-wrap">
            {(["LinkedIn", "Twitter", "Instagram", "Resume"] as Platform[]).map((p) => (
              <button key={p} onClick={() => setPlatform(p)} className={p === platform ? "btn-primary" : "btn-secondary"}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Bio</button>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">{r.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{r.text.length}/{platformLimits[platform]} chars</span>
                  <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
