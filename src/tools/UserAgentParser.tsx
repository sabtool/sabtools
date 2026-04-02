"use client";
import { useState, useMemo, useEffect } from "react";

interface ParsedUA {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  engineVersion: string;
}

function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = { browser: "Unknown", browserVersion: "", os: "Unknown", osVersion: "", device: "Desktop", engine: "Unknown", engineVersion: "" };

  // Browser detection
  if (/Edg\/(\d[\d.]*)/i.test(ua)) { result.browser = "Microsoft Edge"; result.browserVersion = RegExp.$1; }
  else if (/OPR\/(\d[\d.]*)/i.test(ua)) { result.browser = "Opera"; result.browserVersion = RegExp.$1; }
  else if (/Vivaldi\/(\d[\d.]*)/i.test(ua)) { result.browser = "Vivaldi"; result.browserVersion = RegExp.$1; }
  else if (/Brave/i.test(ua) && /Chrome\/(\d[\d.]*)/i.test(ua)) { result.browser = "Brave"; result.browserVersion = RegExp.$1; }
  else if (/SamsungBrowser\/(\d[\d.]*)/i.test(ua)) { result.browser = "Samsung Internet"; result.browserVersion = RegExp.$1; }
  else if (/UCBrowser\/(\d[\d.]*)/i.test(ua)) { result.browser = "UC Browser"; result.browserVersion = RegExp.$1; }
  else if (/Firefox\/(\d[\d.]*)/i.test(ua)) { result.browser = "Firefox"; result.browserVersion = RegExp.$1; }
  else if (/Version\/(\d[\d.]*).*Safari/i.test(ua)) { result.browser = "Safari"; result.browserVersion = RegExp.$1; }
  else if (/Chrome\/(\d[\d.]*)/i.test(ua)) { result.browser = "Chrome"; result.browserVersion = RegExp.$1; }
  else if (/MSIE\s(\d[\d.]*)/i.test(ua)) { result.browser = "Internet Explorer"; result.browserVersion = RegExp.$1; }
  else if (/Trident.*rv:(\d[\d.]*)/i.test(ua)) { result.browser = "Internet Explorer"; result.browserVersion = RegExp.$1; }

  // OS detection
  if (/Windows NT 10\.0/i.test(ua)) { result.os = "Windows"; result.osVersion = "10/11"; }
  else if (/Windows NT 6\.3/i.test(ua)) { result.os = "Windows"; result.osVersion = "8.1"; }
  else if (/Windows NT 6\.2/i.test(ua)) { result.os = "Windows"; result.osVersion = "8"; }
  else if (/Windows NT 6\.1/i.test(ua)) { result.os = "Windows"; result.osVersion = "7"; }
  else if (/Mac OS X (\d[\d_]*)/i.test(ua)) { result.os = "macOS"; result.osVersion = RegExp.$1.replace(/_/g, "."); }
  else if (/Android (\d[\d.]*)/i.test(ua)) { result.os = "Android"; result.osVersion = RegExp.$1; }
  else if (/iPhone OS (\d[\d_]*)/i.test(ua)) { result.os = "iOS"; result.osVersion = RegExp.$1.replace(/_/g, "."); }
  else if (/iPad.*OS (\d[\d_]*)/i.test(ua)) { result.os = "iPadOS"; result.osVersion = RegExp.$1.replace(/_/g, "."); }
  else if (/CrOS/i.test(ua)) { result.os = "Chrome OS"; result.osVersion = ""; }
  else if (/Linux/i.test(ua)) { result.os = "Linux"; result.osVersion = ""; }
  else if (/Ubuntu/i.test(ua)) { result.os = "Ubuntu"; result.osVersion = ""; }

  // Device type
  if (/Mobile|Android.*Mobile|iPhone/i.test(ua)) result.device = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) result.device = "Tablet";
  else if (/Bot|Crawler|Spider|Slurp|Googlebot/i.test(ua)) result.device = "Bot/Crawler";
  else result.device = "Desktop";

  // Engine detection
  if (/AppleWebKit\/(\d[\d.]*)/i.test(ua)) { result.engine = "WebKit"; result.engineVersion = RegExp.$1; if (/Chrome/i.test(ua)) result.engine = "Blink"; }
  else if (/Gecko\/(\d[\d.]*)/i.test(ua)) { result.engine = "Gecko"; result.engineVersion = RegExp.$1; }
  else if (/Trident\/(\d[\d.]*)/i.test(ua)) { result.engine = "Trident"; result.engineVersion = RegExp.$1; }
  else if (/Presto\/(\d[\d.]*)/i.test(ua)) { result.engine = "Presto"; result.engineVersion = RegExp.$1; }

  return result;
}

const COMMON_UAS = [
  { label: "Chrome on Windows", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" },
  { label: "Safari on iPhone", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1" },
  { label: "Firefox on Linux", ua: "Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0" },
  { label: "Googlebot", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  { label: "Edge on Windows", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0" },
  { label: "Safari on Mac", ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15" },
];

export default function UserAgentParser() {
  const [customUA, setCustomUA] = useState("");
  const [currentUA, setCurrentUA] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") setCurrentUA(navigator.userAgent);
  }, []);

  const activeUA = customUA || currentUA;
  const parsed = useMemo(() => parseUserAgent(activeUA), [activeUA]);

  const copyUA = () => {
    navigator.clipboard?.writeText(activeUA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Current UA */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Your User Agent</h3>
        <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded break-all">{currentUA || "Detecting..."}</p>
        <button onClick={copyUA} className="btn-secondary text-xs mt-2">{copied ? "Copied!" : "Copy"}</button>
      </div>

      {/* Custom UA Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Parse Custom User Agent</label>
        <textarea
          value={customUA}
          onChange={(e) => setCustomUA(e.target.value)}
          placeholder="Paste any user agent string to parse..."
          className="calc-input min-h-[80px]"
        />
        {customUA && (
          <button onClick={() => setCustomUA("")} className="btn-secondary text-xs mt-2">Clear (show my UA)</button>
        )}
      </div>

      {/* Parsed Results */}
      {activeUA && (
        <div className="result-card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Parsed Information</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Browser", value: `${parsed.browser} ${parsed.browserVersion}` },
              { label: "Operating System", value: `${parsed.os} ${parsed.osVersion}` },
              { label: "Device Type", value: parsed.device },
              { label: "Rendering Engine", value: `${parsed.engine} ${parsed.engineVersion}` },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common User Agents */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Common User Agents (click to parse)</h3>
        <div className="space-y-2">
          {COMMON_UAS.map((item, i) => (
            <button
              key={i}
              onClick={() => setCustomUA(item.ua)}
              className="w-full text-left bg-gray-50 hover:bg-indigo-50 rounded-lg p-2 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500 font-mono truncate">{item.ua}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
