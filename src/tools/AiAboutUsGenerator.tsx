"use client";
import { useState } from "react";

type Version = "Professional" | "Friendly" | "Story-based";

function generateAboutUs(company: string, industry: string, year: string, mission: string, teamSize: string, products: string): Record<Version, string> {
  const age = new Date().getFullYear() - (parseInt(year) || 2020);
  const ageText = age <= 1 ? "newly established" : age <= 5 ? "growing" : age <= 15 ? "well-established" : "veteran";

  return {
    Professional: `${company} is a ${ageText} organization in the ${industry} sector, founded in ${year}. With a dedicated team of ${teamSize} professionals, we specialize in delivering ${products}. Our mission centers on ${mission}. Over the past ${age > 0 ? age : 1} years, we have built a reputation for excellence, reliability, and innovation in our field. We are committed to maintaining the highest standards of quality while continuously evolving to meet the dynamic needs of our clients and stakeholders. At ${company}, we believe in creating lasting value through expertise, integrity, and a client-first approach. Our comprehensive solutions are designed to address the unique challenges of the ${industry} industry, ensuring measurable outcomes for every engagement.`,
    Friendly: `Hey there! We are ${company}, and we have been shaking things up in the ${industry} space since ${year}. Our awesome team of ${teamSize} people wakes up every day with one goal: ${mission}. Whether it is ${products}, we pour our heart and soul into everything we do. What makes us different? We genuinely care about the people we work with, both our team and our clients. We are not just another ${industry} company; we are a bunch of passionate folks who believe great things happen when talented people come together with a shared purpose. Come say hi, we would love to get to know you!`,
    "Story-based": `It all started in ${year} with a simple idea: ${mission}. What began as a small venture in the ${industry} industry has grown into ${company}, a team of ${teamSize} passionate individuals united by a common vision. In those early days, we faced the challenges that every ${ageText} company encounters, but our commitment to ${products} kept us going. Each obstacle taught us something new, and every success reinforced our belief that we were on the right path. Today, ${company} stands as a testament to what happens when dedication meets opportunity. Our journey is far from over. As we look ahead, we carry with us the same spirit that started it all, the belief that innovation, hard work, and genuine care for our community can create something truly remarkable.`,
  };
}

export default function AiAboutUsGenerator() {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [year, setYear] = useState("");
  const [mission, setMission] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [products, setProducts] = useState("");
  const [results, setResults] = useState<Record<Version, string> | null>(null);
  const [copied, setCopied] = useState<Version | null>(null);

  const generate = () => {
    if (!company.trim()) return;
    setResults(generateAboutUs(company, industry || "technology", year || "2020", mission || "delivering excellence", teamSize || "50+", products || "innovative solutions"));
  };

  const copy = (v: Version) => {
    navigator.clipboard?.writeText(results?.[v] || "");
    setCopied(v);
    setTimeout(() => setCopied(null), 2000);
  };

  const versions: { key: Version; label: string; desc: string }[] = [
    { key: "Professional", label: "Professional", desc: "Corporate & formal tone" },
    { key: "Friendly", label: "Friendly", desc: "Startup & casual tone" },
    { key: "Story-based", label: "Story-based", desc: "Narrative journey tone" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Company Name</label>
          <input className="calc-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., TechVista Solutions" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Industry</label>
          <input className="calc-input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g., Technology, Healthcare, Education" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Year Founded</label>
          <input className="calc-input" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 2015" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Team Size</label>
          <input className="calc-input" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g., 50+, 200, 10-20" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Mission / Values</label>
        <input className="calc-input" value={mission} onChange={(e) => setMission(e.target.value)} placeholder="e.g., making technology accessible to everyone" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Products / Services</label>
        <input className="calc-input" value={products} onChange={(e) => setProducts(e.target.value)} placeholder="e.g., SaaS platforms, mobile apps, consulting services" />
      </div>
      <button onClick={generate} className="btn-primary">Generate About Us</button>

      {results && (
        <div className="space-y-4">
          {versions.map(({ key, label, desc }) => (
            <div key={key} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-sm font-bold text-gray-700">{label}</span>
                  <span className="text-xs text-gray-400 ml-2">{desc}</span>
                </div>
                <button onClick={() => copy(key)} className="text-xs text-indigo-600 font-medium hover:underline">{copied === key ? "Copied!" : "Copy"}</button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{results[key]}</p>
              <p className="text-xs text-gray-400 mt-2">{results[key].split(/\s+/).length} words</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
