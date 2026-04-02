"use client";
import { useState, useMemo } from "react";

interface SpeedFactor {
  name: string;
  description: string;
  tip: string;
  weight: number;
}

const SPEED_FACTORS: SpeedFactor[] = [
  { name: "Image Optimization", description: "Compress and serve images in modern formats (WebP, AVIF)", tip: "Use next/image or lazy loading. Compress all images above 100KB.", weight: 15 },
  { name: "CSS & JS Minification", description: "Minify and bundle CSS/JavaScript files", tip: "Use build tools like Webpack, Vite, or Next.js for automatic minification.", weight: 10 },
  { name: "Browser Caching", description: "Set proper Cache-Control headers for static assets", tip: "Cache static files for 1 year. Use content hashing for cache busting.", weight: 10 },
  { name: "CDN Usage", description: "Serve assets via a Content Delivery Network", tip: "Use Cloudflare, AWS CloudFront, or Vercel Edge Network.", weight: 12 },
  { name: "Lazy Loading", description: "Defer loading of below-the-fold images and components", tip: "Add loading='lazy' to images. Use dynamic imports for components.", weight: 10 },
  { name: "Font Loading", description: "Optimize web font loading strategy", tip: "Use font-display: swap. Preload critical fonts. Limit font variants.", weight: 8 },
  { name: "Render Blocking Resources", description: "Eliminate render-blocking CSS and JavaScript", tip: "Inline critical CSS. Defer non-critical JS. Use async/defer attributes.", weight: 10 },
  { name: "Server Response Time (TTFB)", description: "Time to First Byte should be under 200ms", tip: "Use SSG/ISR, optimize database queries, enable server-side caching.", weight: 10 },
  { name: "HTTP/2 or HTTP/3", description: "Use modern HTTP protocols for multiplexing", tip: "Most modern hosting supports HTTP/2. Cloudflare offers HTTP/3.", weight: 5 },
  { name: "Code Splitting", description: "Split JavaScript bundles for on-demand loading", tip: "Use dynamic imports. Analyze bundle with webpack-bundle-analyzer.", weight: 10 },
];

export default function PageSpeedEstimator() {
  const [url, setUrl] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const toggleCheck = (name: string) => {
    setChecks((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const result = useMemo(() => {
    const checkedCount = Object.values(checks).filter(Boolean).length;
    if (checkedCount === 0) return null;

    const totalWeight = SPEED_FACTORS.reduce((s, f) => s + f.weight, 0);
    const earnedWeight = SPEED_FACTORS.reduce((s, f) => s + (checks[f.name] ? f.weight : 0), 0);
    const score = Math.round((earnedWeight / totalWeight) * 100);
    const label = score >= 90 ? "Excellent" : score >= 50 ? "Needs Improvement" : "Poor";
    const color = score >= 90 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600";
    return { score, label, color, checkedCount };
  }, [checks]);

  const cleanUrl = url.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const pageSpeedLink = cleanUrl ? `https://pagespeed.web.dev/analysis?url=https%3A%2F%2F${encodeURIComponent(cleanUrl)}` : "";

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Website URL</label>
        <input
          type="text"
          placeholder="e.g. sabtools.in"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="calc-input"
        />
      </div>

      {cleanUrl && (
        <a href={pageSpeedLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-center w-full sm:w-auto px-6 py-2 text-sm">
          Run on Google PageSpeed Insights &rarr;
        </a>
      )}

      <div>
        <div className="text-sm font-semibold text-gray-700 mb-3">Speed Factor Checklist</div>
        <div className="text-xs text-gray-400 mb-3">Check each optimization you have already implemented:</div>
        <div className="space-y-2">
          {SPEED_FACTORS.map((factor) => (
            <div
              key={factor.name}
              onClick={() => toggleCheck(factor.name)}
              className={`rounded-xl p-3 border cursor-pointer transition ${checks[factor.name] ? "border-green-300 bg-green-50" : "border-gray-100 bg-white"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${checks[factor.name] ? "border-green-500 bg-green-500 text-white" : "border-gray-300"}`}>
                  {checks[factor.name] && <span className="text-xs">&#10003;</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800">{factor.name}</div>
                    <span className="text-xs text-gray-400">Weight: {factor.weight}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{factor.description}</div>
                  {!checks[factor.name] && (
                    <div className="text-xs text-blue-600 mt-1">Tip: {factor.tip}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Estimated Optimization Score</div>
            <div className={`text-5xl font-extrabold ${result.color}`}>{result.score}</div>
            <div className={`text-sm font-semibold mt-1 ${result.color}`}>{result.label}</div>
            <div className="text-xs text-gray-400 mt-1">{result.checkedCount} / {SPEED_FACTORS.length} optimizations applied</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${result.score >= 90 ? "bg-green-500" : result.score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
