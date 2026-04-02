"use client";
import { useState } from "react";

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/contact");
  const [freq, setFreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.split("\n").filter(Boolean).map((url) => `  <url>\n    <loc>${url.trim()}</loc>\n    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Enter URLs (one per line)</label><textarea value={urls} onChange={(e) => setUrls(e.target.value)} className="calc-input min-h-[150px] font-mono text-sm" rows={6} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Change Frequency</label><select value={freq} onChange={(e) => setFreq(e.target.value)} className="calc-input">{["always","hourly","daily","weekly","monthly","yearly","never"].map((f) => <option key={f}>{f}</option>)}</select></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Priority</label><select value={priority} onChange={(e) => setPriority(e.target.value)} className="calc-input">{["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1.0"].map((p) => <option key={p}>{p}</option>)}</select></div>
      </div>
      <div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Generated Sitemap</label><button onClick={() => navigator.clipboard?.writeText(xml)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto font-mono max-h-[300px]">{xml}</pre></div>
    </div>
  );
}
