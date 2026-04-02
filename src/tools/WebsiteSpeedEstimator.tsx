"use client";
import { useState, useMemo } from "react";

interface Resource {
  label: string;
  count: number;
  sizeKB: number;
}

const CONNECTION_SPEEDS = [
  { name: "3G (Slow)", mbps: 1.5 },
  { name: "3G (Fast)", mbps: 4 },
  { name: "4G", mbps: 20 },
  { name: "WiFi (Average)", mbps: 50 },
  { name: "WiFi (Fast)", mbps: 100 },
  { name: "Broadband", mbps: 200 },
];

export default function WebsiteSpeedEstimator() {
  const [resources, setResources] = useState<Resource[]>([
    { label: "Images", count: 8, sizeKB: 800 },
    { label: "CSS Files", count: 3, sizeKB: 120 },
    { label: "JS Files", count: 5, sizeKB: 500 },
    { label: "Fonts", count: 2, sizeKB: 150 },
    { label: "Videos", count: 0, sizeKB: 0 },
    { label: "HTML", count: 1, sizeKB: 50 },
    { label: "API Calls", count: 3, sizeKB: 30 },
  ]);

  const updateResource = (i: number, field: "count" | "sizeKB", val: number) => {
    const copy = [...resources];
    copy[i] = { ...copy[i], [field]: val };
    setResources(copy);
  };

  const totalSizeKB = useMemo(() => resources.reduce((s, r) => s + r.sizeKB, 0), [resources]);
  const totalRequests = useMemo(() => resources.reduce((s, r) => s + r.count, 0), [resources]);

  const estimates = useMemo(() => CONNECTION_SPEEDS.map(speed => {
    const transferTime = (totalSizeKB / 1024) / (speed.mbps / 8); // seconds
    const latency = totalRequests * 0.05; // 50ms per request overhead
    const total = transferTime + latency;
    return { ...speed, time: total, transferTime, latency };
  }), [totalSizeKB, totalRequests]);

  const score = useMemo(() => {
    // Base score 100, deduct for various factors
    let s = 100;
    if (totalSizeKB > 3000) s -= Math.min(30, (totalSizeKB - 3000) / 200);
    if (totalSizeKB > 1000) s -= Math.min(15, (totalSizeKB - 1000) / 200);
    if (totalRequests > 30) s -= Math.min(20, (totalRequests - 30) / 2);
    if (totalRequests > 15) s -= Math.min(10, (totalRequests - 15) / 2);
    const imageRes = resources.find(r => r.label === "Images");
    if (imageRes && imageRes.sizeKB > 500) s -= Math.min(15, (imageRes.sizeKB - 500) / 100);
    const jsRes = resources.find(r => r.label === "JS Files");
    if (jsRes && jsRes.sizeKB > 300) s -= Math.min(15, (jsRes.sizeKB - 300) / 100);
    const videoRes = resources.find(r => r.label === "Videos");
    if (videoRes && videoRes.sizeKB > 0) s -= Math.min(20, videoRes.sizeKB / 500);
    return Math.max(0, Math.round(s));
  }, [totalSizeKB, totalRequests, resources]);

  const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600";
  const scoreLabel = score >= 80 ? "Good" : score >= 50 ? "Needs Improvement" : "Poor";
  const scoreBg = score >= 80 ? "bg-green-100 border-green-300" : score >= 50 ? "bg-amber-100 border-amber-300" : "bg-red-100 border-red-300";

  const tips = useMemo(() => {
    const t: { resource: string; tip: string; priority: "high" | "medium" | "low" }[] = [];
    const img = resources.find(r => r.label === "Images");
    if (img && img.sizeKB > 500) t.push({ resource: "Images", tip: "Compress images using WebP format. Use lazy loading for below-the-fold images. Consider responsive images with srcset.", priority: "high" });
    if (img && img.count > 10) t.push({ resource: "Images", tip: "Use CSS sprites or SVG icons to reduce HTTP requests. Consider image CDN.", priority: "medium" });
    const js = resources.find(r => r.label === "JS Files");
    if (js && js.sizeKB > 300) t.push({ resource: "JavaScript", tip: "Bundle and minify JS files. Use code splitting and lazy loading. Remove unused dependencies.", priority: "high" });
    if (js && js.count > 5) t.push({ resource: "JavaScript", tip: "Combine multiple JS files into fewer bundles. Use async/defer attributes.", priority: "medium" });
    const css = resources.find(r => r.label === "CSS Files");
    if (css && css.sizeKB > 100) t.push({ resource: "CSS", tip: "Minify CSS files. Remove unused styles with PurgeCSS. Inline critical CSS.", priority: "medium" });
    const fonts = resources.find(r => r.label === "Fonts");
    if (fonts && fonts.count > 2) t.push({ resource: "Fonts", tip: "Limit to 2-3 font families. Use font-display: swap. Consider system fonts.", priority: "medium" });
    if (fonts && fonts.sizeKB > 200) t.push({ resource: "Fonts", tip: "Use WOFF2 format. Subset fonts to only include needed characters.", priority: "medium" });
    const video = resources.find(r => r.label === "Videos");
    if (video && video.sizeKB > 0) t.push({ resource: "Videos", tip: "Use a video CDN (YouTube/Vimeo embed). Compress videos with H.265/VP9. Lazy load video elements.", priority: "high" });
    if (totalRequests > 20) t.push({ resource: "General", tip: "Enable HTTP/2 or HTTP/3 to allow multiplexing. Use a CDN for static assets.", priority: "medium" });
    if (totalSizeKB > 2000) t.push({ resource: "General", tip: "Enable GZIP/Brotli compression on your server. Total page weight should ideally be under 2MB.", priority: "high" });
    if (t.length === 0) t.push({ resource: "General", tip: "Your page looks well-optimized! Consider implementing a CDN for even better performance.", priority: "low" });
    return t;
  }, [resources, totalRequests, totalSizeKB]);

  return (
    <div className="space-y-6">
      {/* Resource Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Page Resources</label>
        <div className="space-y-2">
          {resources.map((r, i) => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-24 font-medium">{r.label}</span>
              <div className="flex items-center gap-1">
                <label className="text-xs text-gray-500">Count:</label>
                <input type="number" min={0} value={r.count} onChange={e => updateResource(i, "count", +e.target.value)} className="calc-input !py-1 w-20 text-sm" />
              </div>
              <div className="flex items-center gap-1">
                <label className="text-xs text-gray-500">Total KB:</label>
                <input type="number" min={0} value={r.sizeKB} onChange={e => updateResource(i, "sizeKB", +e.target.value)} className="calc-input !py-1 w-24 text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score */}
      <div className={`result-card text-center p-6 border-2 ${scoreBg}`}>
        <div className={`text-6xl font-bold ${scoreColor}`}>{score}</div>
        <div className={`text-lg font-semibold ${scoreColor} mt-1`}>{scoreLabel}</div>
        <div className="text-sm text-gray-600 mt-2">
          Total Size: <strong>{totalSizeKB > 1024 ? `${(totalSizeKB / 1024).toFixed(1)} MB` : `${totalSizeKB} KB`}</strong> | Requests: <strong>{totalRequests}</strong>
        </div>
      </div>

      {/* Load Time Estimates */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Estimated Load Times</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {estimates.map(e => (
            <div key={e.name} className="result-card p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{e.name}</div>
              <div className={`text-xl font-bold ${e.time < 2 ? "text-green-600" : e.time < 5 ? "text-amber-600" : "text-red-600"}`}>
                {e.time < 1 ? `${(e.time * 1000).toFixed(0)}ms` : `${e.time.toFixed(1)}s`}
              </div>
              <div className="text-xs text-gray-400 mt-1">{e.mbps} Mbps</div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Tips */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Optimization Tips</label>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="result-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.priority === "high" ? "bg-red-100 text-red-700" : tip.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                  {tip.priority}
                </span>
                <span className="text-sm font-semibold text-gray-800">{tip.resource}</span>
              </div>
              <p className="text-sm text-gray-600">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
