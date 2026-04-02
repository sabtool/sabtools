"use client";
import { useState } from "react";

export default function RobotsTxtGenerator() {
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [allowAll, setAllowAll] = useState(true);
  const [disallowPaths, setDisallowPaths] = useState("/admin\n/private");

  const code = `User-agent: *\n${allowAll ? "Allow: /" : disallowPaths.split("\n").filter(Boolean).map((p) => `Disallow: ${p}`).join("\n")}\n\nSitemap: ${sitemapUrl}`;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Sitemap URL</label><input type="url" placeholder="https://example.com/sitemap.xml" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} className="calc-input" /></div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={allowAll} onChange={() => setAllowAll(true)} /><span className="text-sm text-gray-700">Allow all pages</span></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={!allowAll} onChange={() => setAllowAll(false)} /><span className="text-sm text-gray-700">Custom disallow</span></label>
      </div>
      {!allowAll && (<div><label className="text-sm font-semibold text-gray-700 block mb-2">Disallow Paths (one per line)</label><textarea value={disallowPaths} onChange={(e) => setDisallowPaths(e.target.value)} className="calc-input font-mono text-sm" rows={4} /></div>)}
      <div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Generated robots.txt</label><button onClick={() => navigator.clipboard?.writeText(code)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono">{code}</pre></div>
    </div>
  );
}
