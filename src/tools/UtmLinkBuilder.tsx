"use client";
import { useState } from "react";

export default function UtmLinkBuilder() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");

  const params = new URLSearchParams();
  if (source) params.set("utm_source", source);
  if (medium) params.set("utm_medium", medium);
  if (campaign) params.set("utm_campaign", campaign);
  if (term) params.set("utm_term", term);
  if (content) params.set("utm_content", content);
  const result = url ? `${url}${url.includes("?") ? "&" : "?"}${params.toString()}` : "";

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Website URL *</label><input type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="calc-input" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Campaign Source *</label><input type="text" placeholder="google, facebook, newsletter" value={source} onChange={(e) => setSource(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Campaign Medium *</label><input type="text" placeholder="cpc, email, social" value={medium} onChange={(e) => setMedium(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Campaign Name *</label><input type="text" placeholder="spring_sale" value={campaign} onChange={(e) => setCampaign(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Campaign Term</label><input type="text" placeholder="running+shoes" value={term} onChange={(e) => setTerm(e.target.value)} className="calc-input" /></div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Campaign Content</label><input type="text" placeholder="banner_ad, text_link" value={content} onChange={(e) => setContent(e.target.value)} className="calc-input" /></div>
      {result && url && source && (<div className="result-card"><div className="flex justify-between mb-2"><label className="text-xs font-medium text-gray-500">Generated URL</label><button onClick={() => navigator.clipboard?.writeText(result)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><div className="text-sm font-mono text-indigo-600 break-all bg-white rounded-xl p-4">{result}</div></div>)}
    </div>
  );
}
