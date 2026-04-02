"use client";
import { useState, useMemo } from "react";

export default function BacklinkChecker() {
  const [domain, setDomain] = useState("");

  const info = useMemo(() => {
    if (!domain.trim()) return null;
    const clean = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const googleSearchLink = `https://www.google.com/search?q=site:${encodeURIComponent(clean)}`;
    const linkSearchLink = `https://www.google.com/search?q=link:${encodeURIComponent(clean)}`;
    const infoSearchLink = `https://www.google.com/search?q=info:${encodeURIComponent(clean)}`;
    return { clean, googleSearchLink, linkSearchLink, infoSearchLink };
  }, [domain]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Domain Name</label>
        <input
          type="text"
          placeholder="e.g. sabtools.in"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="calc-input"
        />
      </div>

      {info && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Domain Analyzed</div>
            <div className="text-2xl font-extrabold text-indigo-600">{info.clean}</div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Quick Google Search Links</div>
            <div className="space-y-2">
              <a href={info.googleSearchLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:border-indigo-300 transition">
                <div>
                  <div className="text-sm font-semibold text-gray-800">site:{info.clean}</div>
                  <div className="text-xs text-gray-400">See all indexed pages on Google</div>
                </div>
                <span className="text-indigo-600 text-sm font-medium">Open &rarr;</span>
              </a>
              <a href={info.linkSearchLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:border-indigo-300 transition">
                <div>
                  <div className="text-sm font-semibold text-gray-800">link:{info.clean}</div>
                  <div className="text-xs text-gray-400">Search for pages linking to this domain</div>
                </div>
                <span className="text-indigo-600 text-sm font-medium">Open &rarr;</span>
              </a>
              <a href={info.infoSearchLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:border-indigo-300 transition">
                <div>
                  <div className="text-sm font-semibold text-gray-800">info:{info.clean}</div>
                  <div className="text-xs text-gray-400">Get Google&apos;s cached info about the site</div>
                </div>
                <span className="text-indigo-600 text-sm font-medium">Open &rarr;</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">How to Check Backlinks</div>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-sm font-semibold text-gray-800">1. Google Search Console (Free)</div>
                <div className="text-xs text-gray-500 mt-1">Go to Links &rarr; Top linking sites. Shows all domains linking to your verified site.</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-sm font-semibold text-gray-800">2. Ahrefs (Paid)</div>
                <div className="text-xs text-gray-500 mt-1">Industry-leading backlink checker with Domain Rating (DR) and detailed link profiles.</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-sm font-semibold text-gray-800">3. Semrush (Paid)</div>
                <div className="text-xs text-gray-500 mt-1">Backlink Analytics tool with Authority Score and toxic link detection.</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-sm font-semibold text-gray-800">4. Ubersuggest (Freemium)</div>
                <div className="text-xs text-gray-500 mt-1">Free daily checks with basic backlink data and referring domain count.</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-sm font-semibold text-gray-800">5. Moz Link Explorer (Freemium)</div>
                <div className="text-xs text-gray-500 mt-1">Domain Authority (DA), Page Authority (PA) and spam score analysis.</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <div className="text-xs text-yellow-700">
              <strong>Note:</strong> Full backlink analysis requires API access from tools like Ahrefs or Semrush. This tool provides quick search operators and guidance on how to check backlinks using various platforms.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
