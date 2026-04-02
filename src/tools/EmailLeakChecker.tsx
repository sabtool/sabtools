"use client";
import { useState, useMemo } from "react";

const DOMAIN_SCORES: Record<string, { score: number; label: string; color: string }> = {
  "gmail.com": { score: 90, label: "Excellent", color: "text-green-600" },
  "protonmail.com": { score: 95, label: "Excellent", color: "text-green-600" },
  "proton.me": { score: 95, label: "Excellent", color: "text-green-600" },
  "tutanota.com": { score: 93, label: "Excellent", color: "text-green-600" },
  "outlook.com": { score: 85, label: "Good", color: "text-blue-600" },
  "hotmail.com": { score: 70, label: "Fair", color: "text-yellow-600" },
  "live.com": { score: 75, label: "Good", color: "text-blue-600" },
  "yahoo.com": { score: 60, label: "Fair", color: "text-yellow-600" },
  "yahoo.in": { score: 60, label: "Fair", color: "text-yellow-600" },
  "aol.com": { score: 50, label: "Below Average", color: "text-orange-600" },
  "icloud.com": { score: 88, label: "Good", color: "text-blue-600" },
  "zoho.com": { score: 82, label: "Good", color: "text-blue-600" },
  "rediffmail.com": { score: 45, label: "Poor", color: "text-red-600" },
  "yandex.com": { score: 55, label: "Below Average", color: "text-orange-600" },
};

export default function EmailLeakChecker() {
  const [email, setEmail] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));

  const domainInfo = useMemo(() => {
    if (!email.includes("@")) return null;
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return null;
    return DOMAIN_SCORES[domain] || { score: 65, label: "Unknown Provider", color: "text-gray-600" };
  }, [email]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Your Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="calc-input"
        />
      </div>

      {isValidEmail && (
        <div className="space-y-5">
          {/* Domain Security Score */}
          {domainInfo && (
            <div className="result-card">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Email Provider Security Score</h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-indigo-600">{domainInfo.score}/100</div>
                <span className={`text-sm font-semibold ${domainInfo.color}`}>{domainInfo.label}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${domainInfo.score}%` }}
                />
              </div>
            </div>
          )}

          {/* Check on HaveIBeenPwned */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Check for Data Breaches</h3>
            <p className="text-sm text-gray-600 mb-3">
              We recommend checking your email on Have I Been Pwned, a trusted free service that tracks data breaches.
            </p>
            <a
              href={`https://haveibeenpwned.com/account/${encodeURIComponent(email)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-center"
            >
              Check on HaveIBeenPwned.com
            </a>
          </div>

          {/* What to do if leaked */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">If Your Email Was Found in a Breach</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">1.</span> Change the password for the breached account immediately</li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">2.</span> Enable two-factor authentication (2FA) on the account</li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">3.</span> Change passwords on any other accounts using the same password</li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">4.</span> Check for unauthorized activity on the breached account</li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">5.</span> Consider using a password manager for unique passwords</li>
              <li className="flex items-start gap-2"><span className="font-bold text-indigo-600 shrink-0">6.</span> Monitor your email for phishing attempts related to the breach</li>
            </ol>
          </div>

          {/* Password Change Checklist */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Password Change Checklist</h3>
            <div className="space-y-2">
              {[
                { key: "email", label: "Email account password changed" },
                { key: "social", label: "Social media passwords updated" },
                { key: "banking", label: "Banking & financial passwords changed" },
                { key: "shopping", label: "Shopping sites (Amazon, Flipkart) updated" },
                { key: "2fa", label: "Two-factor authentication enabled everywhere" },
                { key: "manager", label: "Password manager set up" },
                { key: "recovery", label: "Recovery email & phone verified" },
                { key: "sessions", label: "Logged out of all unknown sessions" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item.key]}
                    onChange={() => toggleCheck(item.key)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className={checkedItems[item.key] ? "line-through text-gray-400" : ""}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Email Security Tips</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>&#8226; Use a unique, strong password for every account</li>
              <li>&#8226; Enable 2FA/MFA on all important accounts</li>
              <li>&#8226; Never click links in suspicious emails</li>
              <li>&#8226; Avoid using the same email for all services</li>
              <li>&#8226; Consider using email aliases or + addressing (user+site@gmail.com)</li>
              <li>&#8226; Regularly check haveibeenpwned.com for new breaches</li>
              <li>&#8226; Use a privacy-focused email provider (ProtonMail, Tutanota)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
