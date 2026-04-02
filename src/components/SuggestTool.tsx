"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const CATEGORIES = ["Finance", "Image", "Text", "Developer", "AI", "Other"] as const;
const SUGGESTIONS_KEY = "sabtools_suggestions";

interface Suggestion {
  name: string;
  description: string;
  email: string;
  category: string;
  date: string;
}

function saveSuggestionToLocal(suggestion: Suggestion) {
  try {
    const existing = JSON.parse(localStorage.getItem(SUGGESTIONS_KEY) || "[]");
    existing.push(suggestion);
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(existing));
  } catch {
    // ignore storage errors
  }
}

export default function SuggestTool() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Other");
  const modalRef = useRef<HTMLDivElement>(null);
  const [animateIn, setAnimateIn] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setSubmitted(false);
    setTimeout(() => setAnimateIn(true), 10);
  }, []);

  const close = useCallback(() => {
    setAnimateIn(false);
    setTimeout(() => {
      setIsOpen(false);
      setName("");
      setDescription("");
      setEmail("");
      setCategory("Other");
      setSubmitted(false);
    }, 300);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close();
      }
    };
    // Delay to prevent immediate close on open click
    const timeout = setTimeout(() => {
      window.addEventListener("mousedown", handler);
    }, 100);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousedown", handler);
    };
  }, [isOpen, close]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      const suggestion: Suggestion = {
        name: name.trim(),
        description: description.trim(),
        email: email.trim(),
        category,
        date: new Date().toISOString(),
      };

      // Save to localStorage as backup
      saveSuggestionToLocal(suggestion);

      // Open mailto link
      const subject = encodeURIComponent(`Tool Suggestion: ${suggestion.name}`);
      const body = encodeURIComponent(
        `Tool Name: ${suggestion.name}\n` +
          `Category: ${suggestion.category}\n` +
          `Description: ${suggestion.description || "N/A"}\n` +
          `Submitted by: ${suggestion.email || "Anonymous"}\n` +
          `Date: ${new Date().toLocaleDateString()}`
      );
      window.open(`mailto:sabtools.ltd@gmail.com?subject=${subject}&body=${body}`, "_self");

      setSubmitted(true);
    },
    [name, description, email, category]
  );

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={open}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-violet-700 transition-all active:scale-95 flex items-center gap-2 text-sm"
      >
        <span role="img" aria-label="lightbulb">💡</span>
        <span className="hidden sm:inline">Suggest a Tool</span>
        <span className="sm:hidden">Suggest</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-colors duration-300 ${
            animateIn ? "bg-black/50" : "bg-black/0"
          }`}
        >
          <div
            ref={modalRef}
            className={`w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto ${
              animateIn
                ? "translate-y-0 opacity-100"
                : "translate-y-8 sm:translate-y-4 opacity-0"
            }`}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-600 sm:rounded-t-2xl" />
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="text-lg font-bold text-gray-800">
                  <span className="mr-1.5" role="img" aria-label="lightbulb">💡</span>
                  Suggest a Tool
                </h2>
                <button
                  onClick={close}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="px-4 pb-3 text-sm text-gray-500">
                Have an idea for a tool? Let us know and we might build it!
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-4 pt-0 space-y-4">
                {/* Tool Name */}
                <div>
                  <label htmlFor="suggest-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tool Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="suggest-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Resume Builder"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="suggest-desc" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="suggest-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What should this tool do?"
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="suggest-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="suggest-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="suggest-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="suggest-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Get notified when it's built"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold py-3 px-4 rounded-xl text-sm hover:from-purple-700 hover:to-violet-700 transition-all active:scale-[0.98]"
                >
                  Submit Suggestion
                </button>
              </form>
            ) : (
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Thank you!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Thanks! We&apos;ll review your suggestion.
                </p>
                <button
                  onClick={close}
                  className="bg-gray-100 text-gray-600 font-medium py-2.5 px-6 rounded-xl text-sm hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
