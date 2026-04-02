"use client";
import { useState } from "react";

const SSL_TYPES = [
  { type: "DV (Domain Validation)", desc: "Basic encryption. Verifies domain ownership only. Issued in minutes. Ideal for blogs and personal sites.", icon: "🔒", cost: "Free - $100/yr" },
  { type: "OV (Organization Validation)", desc: "Verifies business identity. Shows company name in certificate details. Takes 1-3 days. Good for business websites.", icon: "🏢", cost: "$50 - $500/yr" },
  { type: "EV (Extended Validation)", desc: "Highest validation. Rigorous vetting process. Ideal for banking, e-commerce. Takes 1-2 weeks.", icon: "🏦", cost: "$100 - $1000/yr" },
  { type: "Wildcard SSL", desc: "Secures a domain and all its subdomains (*.example.com). Available in DV and OV.", icon: "🌐", cost: "$50 - $500/yr" },
  { type: "Multi-Domain (SAN/UCC)", desc: "Secures multiple domains under one certificate. Up to 100 domains per cert.", icon: "📦", cost: "$100 - $600/yr" },
];

const COMMON_ISSUES = [
  { issue: "Mixed Content Warning", fix: "Replace all HTTP resources (images, scripts, CSS) with HTTPS equivalents. Use protocol-relative URLs or force HTTPS." },
  { issue: "Certificate Expired", fix: "Renew certificate immediately. Set up auto-renewal with Let's Encrypt. Add calendar reminders 30 days before expiry." },
  { issue: "Name Mismatch Error", fix: "Certificate domain must match the website domain exactly. Include www and non-www versions. Use SAN or wildcard cert." },
  { issue: "Self-Signed Certificate", fix: "Replace with a CA-signed certificate. Use free Let's Encrypt certificates. Self-signed certs are not trusted by browsers." },
  { issue: "Intermediate Certificate Missing", fix: "Install the full certificate chain. Download intermediate certificates from your CA. Check with SSL Labs." },
  { issue: "SSL/TLS Protocol Version Outdated", fix: "Disable SSLv3, TLS 1.0, TLS 1.1. Enable TLS 1.2 and TLS 1.3 only. Update server configuration." },
];

export default function WebsiteSslChecker() {
  const [url, setUrl] = useState("");
  const [showResults, setShowResults] = useState(false);

  const cleanDomain = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  const handleCheck = () => {
    if (cleanDomain) setShowResults(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Website URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setShowResults(false); }}
          placeholder="example.com or https://example.com"
          className="calc-input"
        />
      </div>

      <button onClick={handleCheck} className="btn-primary w-full" disabled={!cleanDomain}>
        Check SSL Information
      </button>

      {showResults && cleanDomain && (
        <div className="space-y-5">
          {/* External Check Links */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Check SSL on External Tools</h3>
            <div className="flex flex-wrap gap-3">
              <a href={`https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-center text-sm">
                SSL Labs Test
              </a>
              <a href={`https://www.sslshopper.com/ssl-checker.html#hostname=${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">
                SSL Shopper
              </a>
              <a href={`https://crt.sh/?q=${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">
                Certificate Transparency
              </a>
            </div>
          </div>

          {/* SSL Certificate Types */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">SSL Certificate Types Explained</h3>
            <div className="space-y-3">
              {SSL_TYPES.map((t, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{t.icon}</span>
                    <span className="font-semibold text-sm text-gray-800">{t.type}</span>
                    <span className="ml-auto text-xs text-indigo-600 font-medium">{t.cost}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Common SSL Issues & Fixes</h3>
            <div className="space-y-3">
              {COMMON_ISSUES.map((item, i) => (
                <div key={i} className="border-l-3 border-orange-400 pl-3">
                  <p className="text-sm font-semibold text-gray-800">{item.issue}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.fix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Let's Encrypt Guide */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Get Free SSL with Let&apos;s Encrypt</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">1.</span> Install Certbot on your server: <code className="bg-gray-100 px-1 rounded text-xs">sudo apt install certbot</code></li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">2.</span> For Apache: <code className="bg-gray-100 px-1 rounded text-xs">sudo certbot --apache</code></li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">3.</span> For Nginx: <code className="bg-gray-100 px-1 rounded text-xs">sudo certbot --nginx</code></li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">4.</span> Auto-renewal: <code className="bg-gray-100 px-1 rounded text-xs">sudo certbot renew --dry-run</code></li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">5.</span> Certificate renews automatically every 90 days</li>
            </ol>
            <a href="https://letsencrypt.org/getting-started/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm font-medium mt-3 inline-block hover:underline">
              Visit Let&apos;s Encrypt Official Guide &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
