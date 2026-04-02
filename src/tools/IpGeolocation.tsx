"use client";
import { useState, useEffect } from "react";

interface IpInfo {
  ip: string;
  loading: boolean;
  error: string;
}

export default function IpGeolocation() {
  const [ipInfo, setIpInfo] = useState<IpInfo>({ ip: "", loading: true, error: "" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((data) => setIpInfo({ ip: data.ip, loading: false, error: "" }))
      .catch(() => setIpInfo({ ip: "", loading: false, error: "Could not detect your IP address" }));
  }, []);

  const isIPv6 = ipInfo.ip.includes(":");

  const copyIp = () => {
    navigator.clipboard?.writeText(ipInfo.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Your IP */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Your IP Address</h3>
        {ipInfo.loading ? (
          <div className="animate-pulse h-8 bg-gray-200 rounded w-48" />
        ) : ipInfo.error ? (
          <p className="text-sm text-red-600">{ipInfo.error}</p>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-indigo-600 font-mono">{ipInfo.ip}</span>
            <button onClick={copyIp} className="btn-secondary text-xs">
              {copied ? "Copied!" : "Copy"}
            </button>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {isIPv6 ? "IPv6" : "IPv4"}
            </span>
          </div>
        )}
      </div>

      {/* External Lookup */}
      {ipInfo.ip && (
        <div className="result-card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Detailed IP Lookup</h3>
          <div className="flex flex-wrap gap-3">
            <a href={`https://ipinfo.io/${ipInfo.ip}`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-center text-sm">IPInfo.io</a>
            <a href={`https://whatismyipaddress.com/ip/${ipInfo.ip}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">WhatIsMyIP</a>
            <a href={`https://www.iplocation.net/ip-lookup?query=${ipInfo.ip}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">IP Location</a>
          </div>
        </div>
      )}

      {/* IPv4 vs IPv6 */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">IPv4 vs IPv6</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-blue-700 text-sm mb-2">IPv4</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>&#8226; 32-bit address (4 billion addresses)</li>
              <li>&#8226; Format: 192.168.1.1</li>
              <li>&#8226; Most widely used currently</li>
              <li>&#8226; Running out of available addresses</li>
              <li>&#8226; NAT used to extend address space</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="font-semibold text-purple-700 text-sm mb-2">IPv6</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>&#8226; 128-bit address (340 undecillion)</li>
              <li>&#8226; Format: 2001:0db8:85a3::8a2e:0370:7334</li>
              <li>&#8226; Growing adoption worldwide</li>
              <li>&#8226; Built-in security (IPSec)</li>
              <li>&#8226; No need for NAT</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to find IP */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">How to Find Your IP on Different Devices</h3>
        <div className="space-y-3">
          {[
            { device: "Windows", steps: "Open Command Prompt > Type 'ipconfig' > Look for IPv4 Address under your network adapter" },
            { device: "Mac", steps: "System Settings > Network > Select connection > Look for IP Address. Or Terminal: 'ifconfig | grep inet'" },
            { device: "Linux", steps: "Terminal: 'ip addr show' or 'hostname -I'. For public IP: 'curl ifconfig.me'" },
            { device: "Android", steps: "Settings > About Phone > Status > IP Address. Or Settings > Wi-Fi > Connected Network > Details" },
            { device: "iPhone/iPad", steps: "Settings > Wi-Fi > Tap (i) next to connected network > IP Address" },
            { device: "Router", steps: "Open browser > Go to 192.168.0.1 or 192.168.1.1 > Login > Check WAN/Internet settings for public IP" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-800">{item.device}</p>
              <p className="text-xs text-gray-600 mt-0.5">{item.steps}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VPN Detection Tip */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">VPN & Privacy Tips</h3>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li>&#8226; If you&apos;re using a VPN, the IP shown above is your VPN server&apos;s IP, not your real IP</li>
          <li>&#8226; Your real IP can sometimes leak via WebRTC even with a VPN - test at browserleaks.com</li>
          <li>&#8226; A VPN masks your IP and encrypts traffic, improving privacy</li>
          <li>&#8226; Tor Browser provides stronger anonymity than VPNs but is slower</li>
          <li>&#8226; Your ISP can always see your real IP regardless of VPN use</li>
        </ul>
      </div>
    </div>
  );
}
