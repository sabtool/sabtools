"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const shortcuts = [
  { keys: ["/"], description: "Focus search bar" },
  { keys: ["H"], description: "Go to homepage" },
  { keys: ["T"], description: "Go to all tools" },
  { keys: ["Esc"], description: "Close modal / clear search" },
  { keys: ["D"], description: "Toggle dark mode" },
  { keys: ["Ctrl", "K"], description: "Open search" },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const focusSearch = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>(
      'input[type="text"], input[type="search"], input[placeholder*="earch"]'
    );
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;

      // Ctrl+K / Cmd+K always works
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        focusSearch();
        return;
      }

      // Esc always works
      if (e.key === "Escape") {
        if (open) {
          setOpen(false);
        } else {
          // Blur any focused input (clears search focus)
          const active = document.activeElement as HTMLElement | null;
          if (active && active.tagName.toLowerCase() === "input") {
            active.blur();
          }
        }
        return;
      }

      // Skip single-key shortcuts when user is typing
      if (isInput) return;

      switch (e.key.toLowerCase()) {
        case "/":
          e.preventDefault();
          focusSearch();
          break;
        case "h":
          router.push("/");
          break;
        case "t":
          router.push("/tools");
          break;
        case "d":
          toggleDarkMode();
          break;
        case "?":
          setOpen((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, router, focusSearch, toggleDarkMode]);

  return (
    <>
      {/* Floating trigger button — desktop only */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Keyboard shortcuts"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center justify-center w-11 h-11 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
      >
        <span className="text-lg font-bold">?</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="hidden md:flex fixed inset-0 z-[9999] items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close shortcuts modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="space-y-3">
              {shortcuts.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s.description}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((key, j) => (
                      <span key={j} className="flex items-center gap-1">
                        {j > 0 && <span className="text-xs text-gray-400">+</span>}
                        <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                          {key === "Ctrl" ? (typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent) ? "⌘" : "Ctrl") : key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">?</kbd> anytime to toggle this panel
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
