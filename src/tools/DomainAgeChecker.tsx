"use client";
import { useState, useMemo } from "react";

export default function DomainAgeChecker() {
  const [domain, setDomain] = useState("");
  const [regDate, setRegDate] = useState("");

  const result = useMemo(() => {
    if (!regDate) return null;
    const reg = new Date(regDate);
    const now = new Date();
    if (isNaN(reg.getTime()) || reg > now) return null;

    let years = now.getFullYear() - reg.getFullYear();
    let months = now.getMonth() - reg.getMonth();
    let days = now.getDate() - reg.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - reg.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    return { years, months, days, totalDays, totalMonths, regDate: reg };
  }, [regDate]);

  const cleanDomain = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const whoisLink = cleanDomain ? `https://www.whois.com/whois/${encodeURIComponent(cleanDomain)}` : "";
  const icannLink = cleanDomain ? `https://lookup.icann.org/en/lookup?name=${encodeURIComponent(cleanDomain)}` : "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Domain Name</label>
          <input
            type="text"
            placeholder="e.g. sabtools.in"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Registration Date (if known)</label>
          <input
            type="date"
            value={regDate}
            onChange={(e) => setRegDate(e.target.value)}
            className="calc-input"
          />
        </div>
      </div>

      {cleanDomain && (
        <div className="result-card space-y-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">WHOIS Lookup Links</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a href={whoisLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:border-indigo-300 transition">
              <div>
                <div className="text-sm font-semibold text-gray-800">WHOIS.com</div>
                <div className="text-xs text-gray-400">Full WHOIS record lookup</div>
              </div>
              <span className="text-indigo-600 text-sm font-medium">Open &rarr;</span>
            </a>
            <a href={icannLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:border-indigo-300 transition">
              <div>
                <div className="text-sm font-semibold text-gray-800">ICANN Lookup</div>
                <div className="text-xs text-gray-400">Official ICANN domain search</div>
              </div>
              <span className="text-indigo-600 text-sm font-medium">Open &rarr;</span>
            </a>
          </div>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Domain Age</div>
            <div className="text-4xl font-extrabold text-indigo-600">
              {result.years > 0 && <>{result.years} <span className="text-lg font-normal text-gray-400">yr{result.years !== 1 ? "s" : ""}</span>{" "}</>}
              {result.months > 0 && <>{result.months} <span className="text-lg font-normal text-gray-400">mo{result.months !== 1 ? "s" : ""}</span>{" "}</>}
              {result.days} <span className="text-lg font-normal text-gray-400">day{result.days !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Total Days</div>
              <div className="text-lg font-bold text-indigo-600">{result.totalDays.toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Total Months</div>
              <div className="text-lg font-bold text-indigo-600">{result.totalMonths.toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Registered On</div>
              <div className="text-sm font-bold text-indigo-600">{result.regDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <div className="text-xs text-blue-700">
          <strong>Tip:</strong> Enter the registration date from a WHOIS lookup to calculate the exact domain age. Older domains generally have more authority in search engine rankings.
        </div>
      </div>
    </div>
  );
}
