"use client";
import { useState, useMemo } from "react";

export default function SitemapValidator() {
  const [xml, setXml] = useState("");

  const result = useMemo(() => {
    if (!xml.trim()) return null;

    const errors: string[] = [];
    const warnings: string[] = [];
    const urls: string[] = [];

    // Check XML declaration
    if (!xml.trim().startsWith("<?xml")) {
      warnings.push("Missing XML declaration (<?xml version=\"1.0\" encoding=\"UTF-8\"?>)");
    }

    // Check urlset or sitemapindex
    const hasUrlset = /<urlset[^>]*>/i.test(xml);
    const hasSitemapIndex = /<sitemapindex[^>]*>/i.test(xml);

    if (!hasUrlset && !hasSitemapIndex) {
      errors.push("Missing <urlset> or <sitemapindex> root element");
    }

    // Check namespace
    if (hasUrlset && !xml.includes("http://www.sitemaps.org/schemas/sitemap/0.9")) {
      warnings.push("Missing standard sitemap namespace: http://www.sitemaps.org/schemas/sitemap/0.9");
    }

    // Extract <loc> values
    const locMatches = xml.match(/<loc>([\s\S]*?)<\/loc>/gi);
    if (locMatches) {
      for (const match of locMatches) {
        const inner = match.replace(/<\/?loc>/gi, "").trim();
        urls.push(inner);
        if (!inner.startsWith("http://") && !inner.startsWith("https://")) {
          errors.push(`Invalid URL in <loc>: "${inner}" - must start with http:// or https://`);
        }
      }
    } else if (hasUrlset) {
      errors.push("No <loc> elements found inside <urlset>");
    }

    // Check for <url> wrappers
    const urlTagCount = (xml.match(/<url>/gi) || []).length;
    if (hasUrlset && urlTagCount === 0) {
      errors.push("No <url> elements found. Each URL should be wrapped in <url>...</url>");
    }

    // Validate <lastmod> dates
    const lastmodMatches = xml.match(/<lastmod>([\s\S]*?)<\/lastmod>/gi);
    if (lastmodMatches) {
      for (const match of lastmodMatches) {
        const val = match.replace(/<\/?lastmod>/gi, "").trim();
        if (!/^\d{4}-\d{2}-\d{2}/.test(val)) {
          warnings.push(`Invalid <lastmod> date: "${val}" - use YYYY-MM-DD format`);
        }
      }
    }

    // Validate <priority>
    const priorityMatches = xml.match(/<priority>([\s\S]*?)<\/priority>/gi);
    if (priorityMatches) {
      for (const match of priorityMatches) {
        const val = parseFloat(match.replace(/<\/?priority>/gi, "").trim());
        if (isNaN(val) || val < 0 || val > 1) {
          warnings.push(`Invalid <priority> value: must be between 0.0 and 1.0`);
        }
      }
    }

    // Validate <changefreq>
    const validFreqs = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
    const freqMatches = xml.match(/<changefreq>([\s\S]*?)<\/changefreq>/gi);
    if (freqMatches) {
      for (const match of freqMatches) {
        const val = match.replace(/<\/?changefreq>/gi, "").trim().toLowerCase();
        if (!validFreqs.includes(val)) {
          warnings.push(`Invalid <changefreq> value: "${val}" - must be one of: ${validFreqs.join(", ")}`);
        }
      }
    }

    // Check for basic XML validity
    const openTags = (xml.match(/<[a-z][^/]*?>/gi) || []).length;
    const closeTags = (xml.match(/<\/[a-z]+>/gi) || []).length;
    if (Math.abs(openTags - closeTags) > 2) {
      errors.push("XML appears malformed: mismatched opening and closing tags");
    }

    const uniqueUrls = [...new Set(urls)];
    const duplicateCount = urls.length - uniqueUrls.length;
    if (duplicateCount > 0) {
      warnings.push(`Found ${duplicateCount} duplicate URL(s)`);
    }

    // Check 50,000 limit
    if (urls.length > 50000) {
      errors.push(`Sitemap contains ${urls.length} URLs. Maximum allowed is 50,000.`);
    }

    const isValid = errors.length === 0;

    return { errors, warnings, urls, uniqueUrls, duplicateCount, urlTagCount, isValid };
  }, [xml]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Paste Sitemap XML</label>
        <textarea
          placeholder={`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n    <lastmod>2025-01-01</lastmod>\n    <priority>1.0</priority>\n  </url>\n</urlset>`}
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          rows={10}
          className="calc-input font-mono text-xs"
        />
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className={`text-3xl font-extrabold ${result.isValid ? "text-green-600" : "text-red-600"}`}>
              {result.isValid ? "Valid Sitemap" : "Issues Found"}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {result.errors.length} error(s), {result.warnings.length} warning(s)
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Total URLs</div>
              <div className="text-lg font-bold text-indigo-600">{result.urls.length}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Unique URLs</div>
              <div className="text-lg font-bold text-indigo-600">{result.uniqueUrls.length}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Duplicates</div>
              <div className={`text-lg font-bold ${result.duplicateCount > 0 ? "text-yellow-600" : "text-green-600"}`}>{result.duplicateCount}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">URL Tags</div>
              <div className="text-lg font-bold text-indigo-600">{result.urlTagCount}</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="text-sm font-semibold text-red-600 mb-2">Errors ({result.errors.length})</div>
              <div className="space-y-1">
                {result.errors.map((e, i) => (
                  <div key={i} className="text-xs text-red-700 bg-red-50 rounded-lg p-2 border border-red-200">{e}</div>
                ))}
              </div>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="text-sm font-semibold text-yellow-600 mb-2">Warnings ({result.warnings.length})</div>
              <div className="space-y-1">
                {result.warnings.map((w, i) => (
                  <div key={i} className="text-xs text-yellow-700 bg-yellow-50 rounded-lg p-2 border border-yellow-200">{w}</div>
                ))}
              </div>
            </div>
          )}

          {result.urls.length > 0 && result.urls.length <= 20 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">URLs Found</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {result.urls.map((u, i) => (
                  <div key={i} className="text-xs text-gray-600 bg-white rounded-lg p-2 border border-gray-100 truncate">{u}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
