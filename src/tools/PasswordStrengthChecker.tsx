"use client";
import { useState, useMemo } from "react";

const COMMON_PASSWORDS = [
  "123456","password","123456789","12345678","12345","1234567","1234567890",
  "qwerty","abc123","111111","monkey","master","dragon","letmein","login",
  "princess","qwerty123","solo","passw0rd","starwars","admin","welcome",
  "flower","trustno1","iloveyou","batman","access","hello","charlie",
  "donald","password1","qwerty1","football","shadow","michael","121212",
  "sunshine","654321","bailey","000000","mustang","loveme","jordan",
  "liverpool","jennifer","thomas","hockey","ranger","daniel","andrea",
  "boomer","harley","222222","joshua","matthew","pepper","andrew",
  "55555","austin","william","samantha","nicole","ashley","thunder",
  "abcdef","lakers","hammer","1q2w3e4r","george","summer","dallas",
  "taylor","matrix","soccer","buster","robert","hannah","peanut",
  "hunter","tigger","cookie","purple","orange","banana","alexander",
  "maggie","jessica","ginger","computer","secret","amanda","letmein1",
  "brandon","biteme","compaq","cowboys","jackson","forever","1qaz2wsx",
  "asdfgh","killer","dallas1","jasmine","aaaaaa","yankees","987654321",
  "pass123","test123","zxcvbnm","asdf1234","qazwsx"
];

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => {
    if (!password) return null;

    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    const isCommon = COMMON_PASSWORDS.includes(password.toLowerCase());

    // Score calculation
    let score = 0;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 2;
    if (length >= 20) score += 1;

    // Deductions
    if (isCommon) score = 0;
    if (/^(.)\1+$/.test(password)) score = Math.min(score, 1); // repeated chars
    if (/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|qwe|asd|zxc)/i.test(password)) score = Math.max(0, score - 2);

    let level: { label: string; color: string; bg: string; pct: number };
    if (score <= 1) level = { label: "Very Weak", color: "text-red-600", bg: "bg-red-500", pct: 10 };
    else if (score <= 3) level = { label: "Weak", color: "text-orange-600", bg: "bg-orange-500", pct: 30 };
    else if (score <= 5) level = { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-500", pct: 55 };
    else if (score <= 7) level = { label: "Strong", color: "text-blue-600", bg: "bg-blue-500", pct: 80 };
    else level = { label: "Very Strong", color: "text-green-600", bg: "bg-green-500", pct: 100 };

    // Crack time estimation
    const charsetSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasNumbers ? 10 : 0) + (hasSymbols ? 33 : 0);
    const combinations = Math.pow(charsetSize || 1, length);
    const guessesPerSecond = 1e10; // 10 billion
    const seconds = combinations / guessesPerSecond / 2;
    let crackTime: string;
    if (isCommon) crackTime = "Instantly (common password)";
    else if (seconds < 1) crackTime = "Less than a second";
    else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
    else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 86400 * 365) crackTime = `${Math.round(seconds / 86400)} days`;
    else if (seconds < 86400 * 365 * 1000) crackTime = `${Math.round(seconds / (86400 * 365))} years`;
    else if (seconds < 86400 * 365 * 1e6) crackTime = `${(seconds / (86400 * 365 * 1000)).toFixed(0)}K+ years`;
    else if (seconds < 86400 * 365 * 1e9) crackTime = `${(seconds / (86400 * 365 * 1e6)).toFixed(0)}M+ years`;
    else crackTime = "Billions+ years";

    const tips: string[] = [];
    if (length < 12) tips.push("Use at least 12 characters");
    if (!hasUpper) tips.push("Add uppercase letters (A-Z)");
    if (!hasLower) tips.push("Add lowercase letters (a-z)");
    if (!hasNumbers) tips.push("Add numbers (0-9)");
    if (!hasSymbols) tips.push("Add symbols (!@#$%^&*)");
    if (isCommon) tips.push("This is a commonly used password - choose something unique");
    if (length >= 12 && hasUpper && hasLower && hasNumbers && hasSymbols) tips.push("Great password! Consider using a password manager to store it.");

    return { length, hasUpper, hasLower, hasNumbers, hasSymbols, isCommon, level, crackTime, tips, score };
  }, [password]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Password to Check</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste your password..."
            className="calc-input pr-20"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="space-y-5">
          {/* Strength Meter */}
          <div className="result-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Password Strength</span>
              <span className={`text-sm font-bold ${analysis.level.color}`}>{analysis.level.label}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${analysis.level.bg}`}
                style={{ width: `${analysis.level.pct}%` }}
              />
            </div>
          </div>

          {/* Crack Time */}
          <div className="result-card">
            <p className="text-sm text-gray-500 mb-1">Estimated Crack Time (10B guesses/sec)</p>
            <p className="text-xl font-bold text-gray-800">{analysis.crackTime}</p>
          </div>

          {/* Checklist */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Character Analysis</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: `Length: ${analysis.length} chars`, ok: analysis.length >= 12 },
                { label: "Uppercase (A-Z)", ok: analysis.hasUpper },
                { label: "Lowercase (a-z)", ok: analysis.hasLower },
                { label: "Numbers (0-9)", ok: analysis.hasNumbers },
                { label: "Symbols (!@#$)", ok: analysis.hasSymbols },
                { label: "Not a common password", ok: !analysis.isCommon },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={item.ok ? "text-green-500" : "text-red-400"}>{item.ok ? "\u2705" : "\u274C"}</span>
                  <span className={item.ok ? "text-gray-700" : "text-gray-500"}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {analysis.tips.length > 0 && (
            <div className="result-card">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tips to Improve</h3>
              <ul className="space-y-1.5">
                {analysis.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">&#8226;</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
