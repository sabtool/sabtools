"use client";
import { useState, useMemo } from "react";

const bioTemplates = {
  professional: [
    (n: string, p: string, i: string) => `${p} | ${i} enthusiast | Turning ideas into impact | ${n}`,
    (n: string, p: string, i: string) => `${n} | ${p} by profession | Passionate about ${i} | Let's connect`,
    (n: string, p: string, i: string) => `${p} helping you grow | ${i} lover | DMs open for collabs | ${n}`,
    (n: string, p: string, i: string) => `${n} | ${p} | Building something amazing with ${i} | Links below`,
    (n: string, p: string, i: string) => `Certified ${p} | ${i} advocate | Work with me | ${n}`,
  ],
  casual: [
    (n: string, _p: string, i: string) => `just ${n} vibing | ${i} addict | living my best life`,
    (n: string, p: string, i: string) => `${n} | part-time ${p}, full-time ${i} lover | coffee first`,
    (n: string, _p: string, i: string) => `${i} makes me happy | ${n} | not all who wander are lost`,
    (n: string, p: string, i: string) => `${n} | chaos coordinator | ${p} by day, ${i} by night`,
    (n: string, _p: string, i: string) => `just a ${n} who loves ${i} | good vibes only | follow for fun`,
  ],
  creative: [
    (n: string, p: string, i: string) => `${n} | ${p} with a twist | ${i} is my superpower`,
    (n: string, p: string, i: string) => `dreaming in ${i} | creating as ${p} | ${n} in the wild`,
    (n: string, _p: string, i: string) => `${n} | painting life with ${i} | every day is a canvas`,
    (n: string, p: string, i: string) => `${p} | ${i} alchemist | ${n} | turning dreams into pixels`,
    (n: string, p: string, i: string) => `${n} | ${p} meets ${i} | crafting stories one post at a time`,
  ],
};

export default function InstagramBioGenerator() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [interests, setInterests] = useState("");
  const [style, setStyle] = useState<"professional" | "casual" | "creative">("professional");
  const [copied, setCopied] = useState<number | null>(null);

  const bios = useMemo(() => {
    if (!name.trim() || !profession.trim() || !interests.trim()) return [];
    const templates = bioTemplates[style];
    return templates.map((fn) => fn(name.trim(), profession.trim(), interests.trim()));
  }, [name, profession, interests, style]);

  const copyBio = (bio: string, idx: number) => {
    navigator.clipboard.writeText(bio);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Profession</label>
          <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="e.g. Digital Marketer" className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Interests / Niche</label>
          <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. Travel, Photography" className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bio Style</label>
          <div className="flex gap-2 flex-wrap">
            {(["professional", "casual", "creative"] as const).map((s) => (
              <button key={s} onClick={() => setStyle(s)} className={style === s ? "btn-primary" : "btn-secondary"}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {bios.length > 0 && (
        <div className="result-card space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Generated Bios</h3>
          {bios.map((bio, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-start gap-3">
              <p className="text-sm text-gray-700 flex-1">{bio}</p>
              <button onClick={() => copyBio(bio, i)} className="btn-secondary text-xs whitespace-nowrap">
                {copied === i ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
