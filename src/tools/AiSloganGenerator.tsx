"use client";
import { useState } from "react";

type Tone = "Fun" | "Serious" | "Inspirational" | "Bold";

const templates: Record<Tone, ((brand: string, industry: string, values: string[]) => string)[]> = {
  Fun: [
    (b) => `${b} — Because Life's Too Short for Boring!`,
    (b, _, v) => `Get ${v[0] || "Happy"} with ${b}!`,
    (b) => `${b}: Where Awesome Happens Daily`,
    (b, i) => `Making ${i} Fun Since Day One — ${b}`,
    (b, _, v) => `${b} + ${v[0] || "You"} = Pure Magic`,
    (b) => `Warning: ${b} May Cause Extreme Satisfaction`,
    (b, i) => `${b}: The ${i} Revolution Starts Here`,
    (b) => `${b} — Serious About Not Being Serious`,
    (b, _, v) => `${v[0] || "Joy"} Delivered. ${b} Guaranteed.`,
    (b, i) => `Who Says ${i} Can't Be Fun? ${b}!`,
  ],
  Serious: [
    (b, i) => `${b} — Redefining Excellence in ${i}`,
    (b, _, v) => `${v[0] || "Quality"}. ${v[1] || "Trust"}. ${b}.`,
    (b, i) => `The Future of ${i} is ${b}`,
    (b) => `${b}: Where Precision Meets Performance`,
    (b, _, v) => `Committed to ${v[0] || "Excellence"} — ${b}`,
    (b, i) => `${b} — Setting the Standard in ${i}`,
    (b) => `Trust ${b}. Deliver Results.`,
    (b, _, v) => `${b}: Built on ${v[0] || "Integrity"}, Driven by ${v[1] || "Innovation"}`,
    (b, i) => `Leading ${i} Forward — ${b}`,
    (b) => `${b} — Your Success, Our Mission`,
  ],
  Inspirational: [
    (b) => `${b} — Dream Bigger, Achieve More`,
    (b, _, v) => `Empowering ${v[0] || "Dreams"} with ${b}`,
    (b) => `${b}: Be the Change You Wish to See`,
    (b, i) => `Transforming ${i}, One Step at a Time — ${b}`,
    (b, _, v) => `${v[0] || "Believe"}. Create. Inspire. ${b}.`,
    (b) => `${b} — Where Every Journey Begins`,
    (b, i) => `Elevating ${i} to New Heights — ${b}`,
    (b) => `${b}: The Power to Transform Your World`,
    (b, _, v) => `Fueled by ${v[0] || "Passion"}, Powered by ${b}`,
    (b) => `${b} — Together, We Rise`,
  ],
  Bold: [
    (b) => `${b} — No Limits. No Excuses.`,
    (b, i) => `${b}: Disrupting ${i} Since Forever`,
    (b) => `Think ${b}. Think Fearless.`,
    (b, _, v) => `${v[0] || "Power"}. ${v[1] || "Grit"}. ${b}.`,
    (b, i) => `${b} — Dominating ${i}, One Move at a Time`,
    (b) => `Unleash the ${b} in You`,
    (b) => `${b}: Break Rules. Make Waves.`,
    (b, i) => `${i} Will Never Be the Same — ${b}`,
    (b, _, v) => `${b}: Where ${v[0] || "Courage"} Meets Action`,
    (b) => `${b} — Built Different, Wired to Win`,
  ],
};

export default function AiSloganGenerator() {
  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState("");
  const [values, setValues] = useState("");
  const [tone, setTone] = useState<Tone>("Inspirational");
  const [slogans, setSlogans] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!brand.trim()) return;
    const v = values.split(",").map((s) => s.trim()).filter(Boolean);
    const ind = industry.trim() || "the industry";
    const result = templates[tone].map((fn) => fn(brand.trim(), ind, v));
    setSlogans(result);
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(slogans[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Brand / Product Name</label>
          <input className="calc-input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. FreshBite" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Industry</label>
          <input className="calc-input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Food & Beverage" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Values (comma separated)</label>
        <input className="calc-input" value={values} onChange={(e) => setValues(e.target.value)} placeholder="e.g. Quality, Innovation, Trust" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
        <div className="flex gap-2 flex-wrap">
          {(["Fun", "Serious", "Inspirational", "Bold"] as Tone[]).map((t) => (
            <button key={t} onClick={() => setTone(t)} className={t === tone ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary">Generate Slogans</button>
        {slogans.length > 0 && <button onClick={generate} className="btn-secondary">Regenerate</button>}
      </div>
      {slogans.length > 0 && (
        <div className="space-y-3">
          {slogans.map((s, i) => (
            <div key={i} className="result-card flex justify-between items-center">
              <p className="text-gray-800 font-medium">{i + 1}. {s}</p>
              <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline ml-3 shrink-0">{copiedIdx === i ? "Copied!" : "Copy"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
