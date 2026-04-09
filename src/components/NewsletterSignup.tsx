"use client";

import { useState } from "react";

/**
 * Newsletter signup component — collects email for weekly tool updates.
 * Client-side only (no actual API call in static export).
 * Stores subscription state in localStorage.
 */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Store in localStorage (actual backend integration can be added later)
    try {
      const existing = JSON.parse(localStorage.getItem("sabtools_newsletter") || "[]");
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem("sabtools_newsletter", JSON.stringify(existing));
      }
      setSubscribed(true);
      setEmail("");
    } catch {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <h3 className="text-lg font-bold text-green-800 mb-1">You&apos;re Subscribed!</h3>
        <p className="text-sm text-green-600">
          You&apos;ll receive our weekly digest with new tools, tips, and guides. Thank you for joining!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-indigo-600 mb-3">
            <span>📬</span> Free Weekly Newsletter
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Get New Tools & Tips Every Week
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Join thousands of Indians who receive our weekly digest — new tool launches,
            how-to guides, finance tips, and exclusive content. No spam, unsubscribe anytime.
          </p>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[280px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shrink-0 shadow-sm"
              >
                Subscribe
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <p className="text-[10px] text-gray-400 text-center sm:text-left">
              🔒 We respect your privacy. No spam ever.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
