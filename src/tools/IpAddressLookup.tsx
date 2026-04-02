"use client";
import { useState, useEffect, useCallback } from "react";

export default function IpAddressLookup() {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchIp = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      if (!res.ok) throw new Error("Failed to fetch IP");
      const data = await res.json();
      setIp(data.ip);
    } catch {
      setError("Could not fetch your IP address. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIp(); }, [fetchIp]);

  const copyIp = async () => {
    if (!ip) return;
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = ip;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="result-card text-center space-y-4">
        <div className="text-sm text-gray-500">Your Public IP Address</div>

        {loading && (
          <div className="py-6">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto" />
            <p className="text-gray-400 mt-3 text-sm">Detecting your IP address...</p>
          </div>
        )}

        {error && (
          <div className="py-4">
            <div className="text-red-500 font-medium">{error}</div>
            <button onClick={fetchIp} className="btn-primary mt-3">Try Again</button>
          </div>
        )}

        {ip && !loading && (
          <>
            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-600 font-mono tracking-wider py-2">
              {ip}
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={copyIp} className="btn-primary">
                {copied ? "Copied!" : "Copy IP Address"}
              </button>
              <button onClick={fetchIp} className="btn-secondary">
                Refresh
              </button>
            </div>
          </>
        )}
      </div>

      {ip && !loading && (
        <div className="result-card">
          <div className="text-sm font-semibold text-gray-500 mb-3">Details</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">IP Version</span>
              <span className="font-semibold text-gray-700">
                {ip.includes(":") ? "IPv6" : "IPv4"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">IP Address</span>
              <span className="font-semibold text-indigo-600 font-mono">{ip}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Type</span>
              <span className="font-semibold text-gray-700">Public</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
