"use client";
import { useState, useMemo } from "react";

interface HeaderInfo {
  name: string;
  description: string;
  example: string;
  security: boolean;
  bestPractice: string;
}

const HEADERS: HeaderInfo[] = [
  { name: "Content-Type", description: "Specifies the media type of the response body (e.g., HTML, JSON, image).", example: "Content-Type: application/json; charset=utf-8", security: false, bestPractice: "Always set charset=utf-8 for text content. Use correct MIME types." },
  { name: "Cache-Control", description: "Directives for caching in both requests and responses. Controls how and for how long content is cached.", example: "Cache-Control: max-age=3600, public", security: false, bestPractice: "Use max-age for static assets. Set no-store for sensitive pages. Immutable for versioned assets." },
  { name: "X-Frame-Options", description: "Prevents clickjacking by controlling whether the page can be framed.", example: "X-Frame-Options: DENY", security: true, bestPractice: "Set to DENY or SAMEORIGIN. Use Content-Security-Policy frame-ancestors instead for modern browsers." },
  { name: "Content-Security-Policy", description: "Controls which resources the browser is allowed to load. Prevents XSS, data injection attacks.", example: "Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com", security: true, bestPractice: "Start with strict policy and relax as needed. Avoid 'unsafe-inline' and 'unsafe-eval'. Use nonces for inline scripts." },
  { name: "Strict-Transport-Security", description: "Forces browsers to use HTTPS for all future requests to this domain (HSTS).", example: "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload", security: true, bestPractice: "Set max-age to at least 1 year. Include subdomains. Submit to HSTS preload list." },
  { name: "X-Content-Type-Options", description: "Prevents MIME type sniffing. Browser won't guess content type.", example: "X-Content-Type-Options: nosniff", security: true, bestPractice: "Always set to 'nosniff'. Prevents browsers from executing files with wrong MIME type." },
  { name: "X-XSS-Protection", description: "Enables browser's built-in XSS filtering (legacy, replaced by CSP).", example: "X-XSS-Protection: 1; mode=block", security: true, bestPractice: "Set to '0' and use CSP instead. Some modern browsers have deprecated this header." },
  { name: "Access-Control-Allow-Origin", description: "CORS header that specifies which origins can access the resource.", example: "Access-Control-Allow-Origin: https://example.com", security: true, bestPractice: "Never use * for credentialed requests. Whitelist specific origins. Validate Origin header server-side." },
  { name: "Access-Control-Allow-Methods", description: "Specifies which HTTP methods are allowed in CORS preflight.", example: "Access-Control-Allow-Methods: GET, POST, OPTIONS", security: false, bestPractice: "Only allow methods you actually need. Don't include DELETE/PUT unless necessary." },
  { name: "Referrer-Policy", description: "Controls how much referrer information is sent with requests.", example: "Referrer-Policy: strict-origin-when-cross-origin", security: true, bestPractice: "Use strict-origin-when-cross-origin or no-referrer for privacy. Avoid unsafe-url." },
  { name: "Permissions-Policy", description: "Controls which browser features the page can use (camera, mic, geolocation, etc.).", example: "Permissions-Policy: camera=(), microphone=(), geolocation=()", security: true, bestPractice: "Disable features you don't use. Restrict to self for features you need." },
  { name: "Set-Cookie", description: "Sends a cookie from the server to the browser for session tracking.", example: "Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Strict", security: true, bestPractice: "Always use Secure, HttpOnly, SameSite flags. Set appropriate expiry. Don't store sensitive data." },
  { name: "ETag", description: "Unique identifier for a specific version of a resource. Used for caching validation.", example: "ETag: \"33a64df551425fcc55e4d42a148795d9f25f89d4\"", security: false, bestPractice: "Use weak ETags for dynamic content. Strong ETags for static files. Combine with Cache-Control." },
  { name: "X-Powered-By", description: "Reveals the server technology (Express, PHP, ASP.NET, etc.).", example: "X-Powered-By: Express", security: true, bestPractice: "REMOVE this header in production. It reveals server technology to attackers." },
  { name: "Server", description: "Reveals the web server software being used.", example: "Server: nginx/1.24.0", security: true, bestPractice: "Remove or obscure version info. Set to generic value in production." },
];

export default function HttpHeaderChecker() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "security">("all");

  const filtered = useMemo(() => {
    return HEADERS.filter((h) => {
      const matchesSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || h.security;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Search Headers</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by header name or description..."
          className="calc-input"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "btn-primary" : "btn-secondary"}>All Headers</button>
        <button onClick={() => setFilter("security")} className={filter === "security" ? "btn-primary" : "btn-secondary"}>Security Headers Only</button>
      </div>

      {/* Security Headers Checklist */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Essential Security Headers Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {HEADERS.filter((h) => h.security).map((h, i) => (
            <div key={i} className="text-sm text-gray-600 flex items-center gap-2 bg-gray-50 rounded p-2">
              <span className="text-red-400 text-lg leading-none">\u25A1</span>
              <span className="font-medium">{h.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Headers Reference */}
      <div className="space-y-4">
        {filtered.map((h, i) => (
          <div key={i} className="result-card">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold text-gray-800">{h.name}</h3>
              {h.security && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Security</span>}
            </div>
            <p className="text-sm text-gray-600 mb-2">{h.description}</p>
            <div className="bg-gray-900 text-green-400 text-xs font-mono px-3 py-2 rounded mb-2 overflow-x-auto">
              {h.example}
            </div>
            <p className="text-xs text-indigo-700 bg-indigo-50 p-2 rounded">
              <span className="font-semibold">Best Practice:</span> {h.bestPractice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
