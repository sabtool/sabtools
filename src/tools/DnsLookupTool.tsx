"use client";
import { useState } from "react";

const DNS_RECORDS = [
  { type: "A", description: "Maps a domain to an IPv4 address (e.g., 93.184.216.34). The most fundamental DNS record.", example: "example.com.  300  IN  A  93.184.216.34", usage: "Points your domain to a web server's IP address." },
  { type: "AAAA", description: "Maps a domain to an IPv6 address. Similar to A record but for the newer IPv6 protocol.", example: "example.com.  300  IN  AAAA  2606:2800:220:1:248:1893:25c8:1946", usage: "Points your domain to a server with IPv6 connectivity." },
  { type: "CNAME", description: "Canonical name record. Creates an alias from one domain to another. Cannot coexist with other records.", example: "www.example.com.  300  IN  CNAME  example.com.", usage: "Alias www to root domain. Point subdomains to CDN or hosting." },
  { type: "MX", description: "Mail Exchange record. Directs email to mail servers. Priority number determines order (lower = preferred).", example: "example.com.  300  IN  MX  10 mail.example.com.", usage: "Configure email delivery. Set up Google Workspace, Zoho Mail, etc." },
  { type: "TXT", description: "Text record. Stores arbitrary text data. Commonly used for domain verification and email authentication.", example: "example.com.  300  IN  TXT  \"v=spf1 include:_spf.google.com ~all\"", usage: "SPF, DKIM, DMARC email auth. Domain verification (Google, Microsoft). Site verification." },
  { type: "NS", description: "Nameserver record. Specifies which DNS servers are authoritative for the domain.", example: "example.com.  86400  IN  NS  ns1.example.com.", usage: "Delegate domain to specific nameservers. Set at domain registrar." },
  { type: "SOA", description: "Start of Authority. Contains zone admin info, serial number, refresh intervals, and expiry.", example: "example.com.  86400  IN  SOA  ns1.example.com. admin.example.com. 2024010101 3600 900 1209600 86400", usage: "Zone configuration. Controls cache timing and zone transfers." },
  { type: "PTR", description: "Pointer record. Reverse DNS lookup - maps an IP address back to a domain name.", example: "34.216.184.93.in-addr.arpa.  300  IN  PTR  example.com.", usage: "Reverse DNS for email servers. Required by many email providers." },
  { type: "SRV", description: "Service record. Specifies host and port for specific services (e.g., SIP, XMPP, LDAP).", example: "_sip._tcp.example.com.  300  IN  SRV  10 60 5060 sip.example.com.", usage: "Service discovery. VoIP, chat servers, Microsoft 365." },
  { type: "CAA", description: "Certificate Authority Authorization. Specifies which CAs are allowed to issue SSL certificates for the domain.", example: "example.com.  300  IN  CAA  0 issue \"letsencrypt.org\"", usage: "Restrict SSL certificate issuance. Improve security posture." },
];

const COMMON_ISSUES = [
  { issue: "DNS propagation delay", solution: "DNS changes can take 24-48 hours to propagate globally. Use lower TTL values before making changes." },
  { issue: "NXDOMAIN errors", solution: "Domain doesn't exist in DNS. Check if domain is registered and nameservers are properly configured." },
  { issue: "SERVFAIL errors", solution: "DNS server failure. Check nameserver health. Verify DNSSEC configuration if enabled." },
  { issue: "Email not working after DNS change", solution: "Check MX records. Ensure proper SPF, DKIM, DMARC TXT records. Verify mail server is accessible." },
  { issue: "Website showing old IP", solution: "Clear local DNS cache (ipconfig /flushdns on Windows, sudo dscacheutil -flushcache on Mac). Wait for TTL expiry." },
  { issue: "Subdomain not resolving", solution: "Add A or CNAME record for the subdomain. Check for typos. Verify wildcard records if applicable." },
];

export default function DnsLookupTool() {
  const [domain, setDomain] = useState("");
  const [showResults, setShowResults] = useState(false);

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Domain Name</label>
        <input
          type="text"
          value={domain}
          onChange={(e) => { setDomain(e.target.value); setShowResults(false); }}
          placeholder="example.com"
          className="calc-input"
        />
      </div>

      <button onClick={() => cleanDomain && setShowResults(true)} className="btn-primary w-full" disabled={!cleanDomain}>
        Lookup DNS Information
      </button>

      {showResults && cleanDomain && (
        <div className="space-y-5">
          {/* External Lookup Links */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Check DNS Records Online</h3>
            <div className="flex flex-wrap gap-3">
              <a href={`https://dns.google/query?name=${encodeURIComponent(cleanDomain)}&type=A`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-center text-sm">Google DNS</a>
              <a href={`https://mxtoolbox.com/SuperTool.aspx?action=dns%3a${encodeURIComponent(cleanDomain)}&run=toolpage`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">MXToolbox</a>
              <a href={`https://www.whatsmydns.net/#A/${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">DNS Propagation</a>
              <a href={`https://dnschecker.org/#A/${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">DNS Checker</a>
            </div>
          </div>

          {/* DNS Record Types */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">DNS Record Types Reference</h3>
            <div className="space-y-3">
              {DNS_RECORDS.map((r, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">{r.type}</span>
                    <span className="text-xs text-gray-500">{r.usage}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1.5">{r.description}</p>
                  <div className="bg-gray-900 text-green-400 text-xs font-mono px-3 py-1.5 rounded overflow-x-auto">{r.example}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Common DNS Issues & Solutions</h3>
            <div className="space-y-3">
              {COMMON_ISSUES.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-800 mb-1">{item.issue}</p>
                  <p className="text-xs text-gray-600">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
