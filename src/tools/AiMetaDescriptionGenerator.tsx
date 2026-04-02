"use client";
import { useState } from "react";

type PageType = "Blog" | "Product" | "Service" | "Homepage" | "Tool";

const templates: Record<PageType, ((title: string, keyword: string) => string)[]> = {
  Blog: [
    (t, k) => `Discover everything about ${k} in our comprehensive guide on ${t}. Get expert insights, practical tips, and actionable advice. Read now!`,
    (t, k) => `Looking for reliable information on ${k}? Our in-depth article on ${t} covers everything you need to know. Updated for ${new Date().getFullYear()}.`,
    (t, k) => `Learn about ${k} with our detailed blog post on ${t}. Expert analysis, real examples, and step-by-step guidance included.`,
    (t, k) => `${t} - Your ultimate resource for understanding ${k}. Get practical knowledge and expert tips in this must-read article.`,
    (t, k) => `Explore the world of ${k} through our comprehensive post on ${t}. Facts, insights, and expert opinions all in one place.`,
  ],
  Product: [
    (t, k) => `Shop ${t} featuring ${k}. Premium quality, competitive pricing, and fast delivery. Order now and get special offers!`,
    (t, k) => `Discover ${t} with top-rated ${k}. Compare features, read reviews, and find the perfect match. Free shipping available!`,
    (t, k) => `Looking for the best ${k}? Browse ${t} - trusted by thousands. Great deals, verified reviews, and hassle-free returns.`,
    (t, k) => `${t} - featuring premium ${k} at unbeatable prices. Shop with confidence. Rated 4.8 stars by verified buyers!`,
    (t, k) => `Get the best ${k} with ${t}. Top brands, exclusive deals, and customer-first service. Shop now and save big!`,
  ],
  Service: [
    (t, k) => `Professional ${k} services at ${t}. Trusted by 10,000+ clients. Get a free consultation today and see real results!`,
    (t, k) => `Need expert ${k}? ${t} delivers top-quality services with proven results. Contact us for a free quote today!`,
    (t, k) => `${t} offers reliable ${k} solutions tailored to your needs. Industry-leading expertise with guaranteed satisfaction.`,
    (t, k) => `Transform your business with ${k} from ${t}. Experienced professionals, customized solutions, and measurable outcomes.`,
    (t, k) => `Choose ${t} for premium ${k} services. Fast turnaround, competitive pricing, and dedicated support. Get started today!`,
  ],
  Homepage: [
    (t, k) => `Welcome to ${t} - your trusted destination for ${k}. Explore our offerings and discover why thousands choose us every day.`,
    (t, k) => `${t} - leading the way in ${k}. Discover our products, services, and solutions designed to exceed your expectations.`,
    (t, k) => `Discover ${t}, where ${k} meets excellence. Browse our complete range of solutions and see what sets us apart.`,
    (t, k) => `${t} is your go-to resource for everything ${k}. Trusted, reliable, and always delivering value. Explore now!`,
    (t, k) => `Welcome to ${t}. Experience the best in ${k} with our award-winning products and world-class customer service.`,
  ],
  Tool: [
    (t, k) => `Free ${k} tool - ${t}. Fast, accurate, and easy to use. No signup required. Try our online tool instantly!`,
    (t, k) => `Use our free ${t} for instant ${k} results. 100% free, works on all devices. No download needed. Try now!`,
    (t, k) => `${t} - the best free online ${k} tool. Get accurate results in seconds. Used by millions worldwide. Try it free!`,
    (t, k) => `Need a reliable ${k} tool? Try ${t} - free, fast, and accurate. No registration required. Works instantly online!`,
    (t, k) => `Calculate, convert, or generate with our free ${t}. Best ${k} tool online - instant results, zero cost. Use now!`,
  ],
};

function getCharColor(len: number): string {
  if (len >= 145 && len <= 160) return "text-green-600";
  if ((len >= 130 && len < 145) || (len > 160 && len <= 170)) return "text-yellow-600";
  return "text-red-600";
}

function getCharBg(len: number): string {
  if (len >= 145 && len <= 160) return "bg-green-50 border-green-200";
  if ((len >= 130 && len < 145) || (len > 160 && len <= 170)) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
}

export default function AiMetaDescriptionGenerator() {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [pageType, setPageType] = useState<PageType>("Blog");
  const [results, setResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const pageTypes: PageType[] = ["Blog", "Product", "Service", "Homepage", "Tool"];

  const generate = () => {
    if (!title.trim() || !keyword.trim()) return;
    const descs = templates[pageType].map(fn => {
      let d = fn(title.trim(), keyword.trim());
      // Trim to 160 if over
      if (d.length > 165) d = d.slice(0, 157) + "...";
      return d;
    });
    setResults(descs);
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Page Title</label>
        <input className="calc-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Best Running Shoes for Beginners" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Target Keyword</label>
          <input className="calc-input" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. running shoes" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Page Type</label>
          <select className="calc-input" value={pageType} onChange={(e) => setPageType(e.target.value as PageType)}>
            {pageTypes.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Meta Descriptions</button>
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> 145-160 chars (ideal)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> 130-170 chars (ok)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> outside range</span>
          </div>
          {results.map((desc, i) => (
            <div key={i} className={`result-card ${getCharBg(desc.length)} border`}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{desc}</p>
                  <p className={`text-xs font-semibold mt-2 ${getCharColor(desc.length)}`}>{desc.length} / 160 characters</p>
                </div>
                <button onClick={() => copy(desc, i)} className="btn-secondary text-xs shrink-0">{copiedIdx === i ? "Copied!" : "Copy"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
