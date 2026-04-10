"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "sabtools_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable — show banner as fallback
      setVisible(true);
    }
  }, []);

  function handleConsent(choice: "all" | "essential") {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ consent: choice, timestamp: new Date().toISOString() })
      );
    } catch {
      // silently fail
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9999] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          We use cookies for analytics (Google Analytics) and advertising (Google
          AdSense) to improve your experience.{" "}
          <Link
            href="/privacy"
            className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleConsent("essential")}
            className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleConsent("all")}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
