"use client";
import { useState } from "react";

const actionVerbs = [
  "Spearheaded", "Managed", "Led", "Developed", "Increased", "Reduced", "Streamlined",
  "Orchestrated", "Implemented", "Designed", "Launched", "Optimized", "Delivered",
  "Transformed", "Pioneered", "Architected", "Automated", "Cultivated", "Negotiated", "Revamped",
];

const quantifiers = [
  "resulting in a 25% improvement in efficiency",
  "achieving a 30% increase in productivity",
  "reducing costs by 20% year-over-year",
  "serving 500+ users across the organization",
  "contributing to $100K+ in revenue growth",
  "saving 15+ hours per week through automation",
  "leading to a 40% reduction in processing time",
  "improving customer satisfaction scores by 35%",
  "within a cross-functional team of 8+ members",
  "meeting 100% of project deadlines consistently",
];

const connectors = [
  "by leveraging",
  "through strategic implementation of",
  "utilizing",
  "by introducing",
  "through effective use of",
  "by applying",
  "by coordinating",
  "through systematic",
  "by establishing",
  "through collaboration on",
];

function generateBullets(jobTitle: string, description: string): string[] {
  const desc = description.trim();
  const words = desc.toLowerCase().split(/\s+/);
  const bullets: string[] = [];
  const usedVerbs = new Set<number>();
  const usedQuant = new Set<number>();

  for (let i = 0; i < 5; i++) {
    let verbIdx: number;
    do { verbIdx = (i * 3 + Math.floor(Math.random() * 4)) % actionVerbs.length; } while (usedVerbs.has(verbIdx) && usedVerbs.size < actionVerbs.length);
    usedVerbs.add(verbIdx);

    let quantIdx: number;
    do { quantIdx = (i * 2 + Math.floor(Math.random() * 3)) % quantifiers.length; } while (usedQuant.has(quantIdx) && usedQuant.size < quantifiers.length);
    usedQuant.add(quantIdx);

    const conn = connectors[(i * 2 + 1) % connectors.length];
    const verb = actionVerbs[verbIdx];
    const quant = quantifiers[quantIdx];

    // Build contextual bullet based on description keywords
    let core = desc;
    if (desc.length > 80) {
      const sentences = desc.match(/[^.!?,]+/g) || [desc];
      core = sentences[i % sentences.length]?.trim() || desc;
    }

    // Different patterns for variety
    switch (i % 5) {
      case 0:
        bullets.push(`${verb} ${core.charAt(0).toLowerCase() + core.slice(1)} ${conn} best practices for ${jobTitle} workflows, ${quant}`);
        break;
      case 1:
        bullets.push(`${verb} key ${jobTitle} initiatives including ${core.charAt(0).toLowerCase() + core.slice(1)}, ${quant}`);
        break;
      case 2:
        bullets.push(`${verb} and executed ${core.charAt(0).toLowerCase() + core.slice(1)} as a ${jobTitle}, ${quant}`);
        break;
      case 3:
        bullets.push(`${verb} ${core.charAt(0).toLowerCase() + core.slice(1)} ${conn} industry standards, ${quant}`);
        break;
      case 4:
        bullets.push(`${verb} comprehensive ${words.slice(0, 3).join(" ")} strategies for the ${jobTitle} function, ${quant}`);
        break;
    }
  }
  return bullets;
}

export default function AiResumeBulletPoints() {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    if (!jobTitle.trim() || !description.trim()) return;
    setBullets(generateBullets(jobTitle.trim(), description.trim()));
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(bullets[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard?.writeText(bullets.map((b) => `• ${b}`).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Job Title</label>
        <input className="calc-input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Product Manager" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Task / Responsibility Description</label>
        <textarea className="calc-input min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you did in this role. e.g. Managed a team, built features, handled client communication..." />
      </div>
      <button onClick={generate} className="btn-primary">Generate Bullet Points</button>
      {bullets.length > 0 && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Achievement-Oriented Bullet Points</span>
            <button onClick={copyAll} className="text-xs text-indigo-600 font-medium hover:underline">{copiedAll ? "All Copied!" : "Copy All"}</button>
          </div>
          <div className="space-y-3">
            {bullets.map((b, i) => (
              <div key={i} className="flex gap-3 items-start bg-white rounded-xl p-3 border border-gray-100">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <p className="text-gray-800 flex-1 leading-relaxed">{b}</p>
                <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline shrink-0">{copiedIdx === i ? "Copied!" : "Copy"}</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">Tip: Customize the numbers and percentages with your actual achievements for maximum impact.</p>
        </div>
      )}
    </div>
  );
}
