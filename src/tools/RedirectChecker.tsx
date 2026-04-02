"use client";
import { useState } from "react";

const REDIRECT_TYPES = [
  { code: "301", name: "301 Moved Permanently", desc: "The resource has been permanently moved to a new URL. Search engines will update their index. This is the most common redirect for SEO. All link equity is passed to the new URL.", use: "Use when a page has permanently moved to a new URL, domain migration, or changing URL structure.", color: "bg-green-50 border-green-200 text-green-800" },
  { code: "302", name: "302 Found (Temporary)", desc: "The resource is temporarily available at a different URL. Search engines keep the original URL indexed. Link equity may not fully pass.", use: "Use for temporary redirects like A/B testing, maintenance pages, or geolocation-based redirects.", color: "bg-blue-50 border-blue-200 text-blue-800" },
  { code: "307", name: "307 Temporary Redirect", desc: "Similar to 302 but strictly preserves the HTTP method (POST stays POST). The browser must not change the request method.", use: "Use when you need a temporary redirect that preserves the original HTTP method (e.g., form submissions).", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { code: "308", name: "308 Permanent Redirect", desc: "Similar to 301 but strictly preserves the HTTP method. The browser must not change the request method when following the redirect.", use: "Use for permanent redirects where the HTTP method must be preserved (e.g., API endpoints).", color: "bg-purple-50 border-purple-200 text-purple-800" },
];

const COMMON_ISSUES = [
  { title: "Redirect Chains", desc: "Multiple redirects in sequence (A -> B -> C). Each hop adds latency. Aim for direct redirects to the final URL.", fix: "Update all redirect sources to point directly to the final destination URL." },
  { title: "Redirect Loops", desc: "Page A redirects to B, and B redirects back to A, causing an infinite loop.", fix: "Check your redirect rules for circular references. Use a redirect checker tool to trace the chain." },
  { title: "Mixed Content After Redirect", desc: "After redirecting HTTP to HTTPS, some resources still load over HTTP.", fix: "Update all internal links and resource references to use HTTPS or protocol-relative URLs." },
  { title: "Losing Query Parameters", desc: "Query strings (e.g., ?utm_source=google) are stripped during redirect.", fix: "Ensure your redirect rules preserve query strings using QSA flag in .htaccess or equivalent." },
  { title: "302 Instead of 301", desc: "Using temporary redirect (302) when permanent (301) is needed, losing SEO value.", fix: "Review your redirects and change 302s to 301s for permanent URL changes." },
];

export default function RedirectChecker() {
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter URL to Check</label>
        <input value={url} onChange={e => setUrl(e.target.value)} className="calc-input" placeholder="https://example.com/old-page" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Due to browser CORS restrictions, redirect checking cannot be performed directly from the client side. Use one of the tools below to check your redirects, or review the educational content to understand redirect types.
      </div>

      {/* External Tools */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Online Redirect Checkers</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "httpstatus.io", url: "https://httpstatus.io", desc: "Check HTTP status codes and redirect chains" },
            { name: "wheregoes.com", url: "https://wheregoes.com", desc: "Trace URL redirect paths step by step" },
            { name: "Redirect Checker (redirect-checker.org)", url: "https://www.redirect-checker.org", desc: "Check redirects with HTTP headers" },
            { name: "Varvy Redirect Checker", url: "https://varvy.com/tools/redirects", desc: "Simple redirect chain visualization" },
          ].map((tool, i) => (
            <a key={i} href={url ? `${tool.url}/?url=${encodeURIComponent(url)}` : tool.url} target="_blank" rel="noopener noreferrer" className="result-card hover:shadow-md transition-shadow p-4 block">
              <div className="font-semibold text-indigo-600 text-sm mb-1">{tool.name}</div>
              <div className="text-xs text-gray-600">{tool.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Redirect Types */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Redirect Types Explained</label>
        <div className="space-y-3">
          {REDIRECT_TYPES.map(r => (
            <div key={r.code} className={`border rounded-xl p-4 ${r.color}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold">{r.code}</span>
                <span className="font-semibold text-sm">{r.name}</span>
              </div>
              <p className="text-sm mb-2">{r.desc}</p>
              <p className="text-xs opacity-80"><strong>When to use:</strong> {r.use}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Issues */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Common Redirect Issues &amp; Fixes</label>
        <div className="space-y-3">
          {COMMON_ISSUES.map((issue, i) => (
            <div key={i} className="result-card p-4">
              <div className="font-semibold text-sm text-gray-800 mb-1">{issue.title}</div>
              <p className="text-xs text-gray-600 mb-2">{issue.desc}</p>
              <p className="text-xs text-green-700 bg-green-50 rounded-lg p-2"><strong>Fix:</strong> {issue.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
