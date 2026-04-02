"use client";
import { useState, useMemo } from "react";

const WHOIS_FIELDS = [
  { field: "Domain Name", desc: "The registered domain name (e.g., example.com)" },
  { field: "Registrar", desc: "The company where the domain was registered (e.g., GoDaddy, Namecheap, Google Domains)" },
  { field: "Registration Date", desc: "When the domain was first registered" },
  { field: "Expiry Date", desc: "When the domain registration expires and needs renewal" },
  { field: "Updated Date", desc: "When the domain record was last modified" },
  { field: "Nameservers", desc: "DNS servers that handle the domain's DNS queries" },
  { field: "Registrant", desc: "The person or organization that owns the domain (may be hidden with WHOIS privacy)" },
  { field: "Admin Contact", desc: "Administrative contact for the domain" },
  { field: "Tech Contact", desc: "Technical contact responsible for domain management" },
  { field: "Status", desc: "Domain status codes (clientTransferProhibited, serverDeleteProhibited, etc.)" },
  { field: "DNSSEC", desc: "Whether DNSSEC (DNS Security Extensions) is enabled" },
];

export default function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [showResults, setShowResults] = useState(false);

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  const domainAge = useMemo(() => {
    if (!creationDate) return null;
    const created = new Date(creationDate);
    if (isNaN(created.getTime())) return null;
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    if (diffMs < 0) return null;
    const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diffMs % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    return { years, months, days, totalDays: Math.floor(diffMs / (24 * 60 * 60 * 1000)) };
  }, [creationDate]);

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
        Lookup WHOIS Information
      </button>

      {showResults && cleanDomain && (
        <div className="space-y-5">
          {/* External WHOIS Links */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Check WHOIS on External Tools</h3>
            <div className="flex flex-wrap gap-3">
              <a href={`https://www.whois.com/whois/${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-center text-sm">Whois.com</a>
              <a href={`https://who.is/whois/${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">Who.is</a>
              <a href={`https://whois.domaintools.com/${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">DomainTools</a>
              <a href={`https://lookup.icann.org/en/lookup?name=${encodeURIComponent(cleanDomain)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block text-center text-sm">ICANN Lookup</a>
            </div>
          </div>

          {/* Domain Age Calculator */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Domain Age Calculator</h3>
            <p className="text-xs text-gray-500 mb-2">Enter the domain creation date from WHOIS results to calculate age:</p>
            <input
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              className="calc-input"
            />
            {domainAge && (
              <div className="mt-3 bg-indigo-50 rounded-lg p-3">
                <p className="text-lg font-bold text-indigo-700">
                  {domainAge.years} years, {domainAge.months} months, {domainAge.days} days
                </p>
                <p className="text-xs text-gray-500">Total: {domainAge.totalDays.toLocaleString()} days</p>
              </div>
            )}
          </div>

          {/* WHOIS Fields Explained */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">WHOIS Fields Explained</h3>
            <div className="space-y-2">
              {WHOIS_FIELDS.map((f, i) => (
                <div key={i} className="flex gap-3 bg-gray-50 rounded p-2">
                  <span className="text-sm font-semibold text-gray-800 w-36 shrink-0">{f.field}</span>
                  <span className="text-sm text-gray-600">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Status Codes */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Common Domain Status Codes</h3>
            <div className="space-y-2 text-sm">
              {[
                { code: "clientTransferProhibited", desc: "Domain transfer is locked by registrar" },
                { code: "clientDeleteProhibited", desc: "Domain deletion is locked by registrar" },
                { code: "clientUpdateProhibited", desc: "Domain updates are locked" },
                { code: "serverHold", desc: "Domain is on hold by registry (not resolving)" },
                { code: "redemptionPeriod", desc: "Domain expired and is in grace period" },
                { code: "pendingDelete", desc: "Domain will be deleted and become available" },
              ].map((s, i) => (
                <div key={i} className="flex gap-2">
                  <code className="bg-gray-100 text-xs px-1.5 py-0.5 rounded font-mono text-indigo-700 shrink-0">{s.code}</code>
                  <span className="text-gray-600 text-xs">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
