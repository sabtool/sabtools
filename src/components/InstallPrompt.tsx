"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTALL_DISMISS_KEY = "sabtools_install_dismissed";
const BOOKMARK_DISMISS_KEY = "sabtools_bookmark_dismissed";
const INSTALL_DISMISS_DAYS = 7;
const BOOKMARK_DISMISS_DAYS = 14;

function isDismissed(key: string, days: number): boolean {
  if (typeof window === "undefined") return true;
  const dismissed = localStorage.getItem(key);
  if (!dismissed) return false;
  const dismissedAt = parseInt(dismissed, 10);
  const now = Date.now();
  return now - dismissedAt < days * 24 * 60 * 60 * 1000;
}

function dismiss(key: string) {
  localStorage.setItem(key, Date.now().toString());
}

function getIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function getIsIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getIsMac(): boolean {
  if (typeof window === "undefined") return false;
  return /Mac/i.test(navigator.platform || navigator.userAgent);
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Animate states
  const [installVisible, setInstallVisible] = useState(false);
  const [bookmarkVisible, setBookmarkVisible] = useState(false);

  useEffect(() => {
    setIsMobile(getIsMobile());
    setIsIOS(getIsIOS());
    setIsMac(getIsMac());

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show install prompt after 30 seconds (mobile + desktop)
    const installTimer = setTimeout(() => {
      if (!isDismissed(INSTALL_DISMISS_KEY, INSTALL_DISMISS_DAYS)) {
        // Check if already installed as PWA
        const isStandalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as unknown as { standalone?: boolean }).standalone === true;
        if (!isStandalone) {
          setShowInstall(true);
          setTimeout(() => setInstallVisible(true), 50);
        }
      }
    }, 30000);

    // Show bookmark reminder after 60 seconds (desktop only)
    const bookmarkTimer = setTimeout(() => {
      if (!getIsMobile() && !isDismissed(BOOKMARK_DISMISS_KEY, BOOKMARK_DISMISS_DAYS)) {
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        if (!isStandalone) {
          setShowBookmark(true);
          setTimeout(() => setBookmarkVisible(true), 50);
        }
      }
    }, 60000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(installTimer);
      clearTimeout(bookmarkTimer);
    };
  }, []);

  // Push page content down when bookmark banner is visible
  useEffect(() => {
    if (bookmarkVisible) {
      document.body.style.paddingTop = "40px";
      // Also shift the sticky header down
      const header = document.querySelector("header");
      if (header) (header as HTMLElement).style.top = "40px";
    } else {
      document.body.style.paddingTop = "";
      const header = document.querySelector("header");
      if (header) (header as HTMLElement).style.top = "0";
    }
    return () => {
      document.body.style.paddingTop = "";
      const header = document.querySelector("header");
      if (header) (header as HTMLElement).style.top = "0";
    };
  }, [bookmarkVisible]);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallVisible(false);
        setTimeout(() => setShowInstall(false), 300);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  }, [deferredPrompt]);

  const dismissInstall = useCallback(() => {
    dismiss(INSTALL_DISMISS_KEY);
    setInstallVisible(false);
    setTimeout(() => setShowInstall(false), 300);
  }, []);

  const dismissBookmark = useCallback(() => {
    dismiss(BOOKMARK_DISMISS_KEY);
    setBookmarkVisible(false);
    document.body.style.paddingTop = "";
    const header = document.querySelector("header");
    if (header) (header as HTMLElement).style.top = "0";
    setTimeout(() => setShowBookmark(false), 300);
  }, []);

  return (
    <>
      {/* Install Prompt - sticky bottom bar */}
      {showInstall && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 transition-transform duration-300 ease-out ${
            installVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-600" />
            <div className="p-4 sm:p-5">
              {!showInstructions ? (
                <>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base mb-3">
                    <span className="mr-1.5" role="img" aria-label="phone">📱</span>
                    Add SabTools to your home screen for quick access!
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleInstall}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm hover:from-purple-700 hover:to-violet-700 transition-all active:scale-95"
                    >
                      Install
                    </button>
                    <button
                      onClick={dismissInstall}
                      className="flex-1 bg-gray-100 text-gray-600 font-medium py-2.5 px-4 rounded-xl text-sm hover:bg-gray-200 transition-all active:scale-95"
                    >
                      Not now
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base mb-2">
                    How to add SabTools to your home screen:
                  </p>
                  {isIOS ? (
                    <p className="text-gray-600 text-sm mb-3">
                      Tap the <strong>Share</strong> button
                      <span className="mx-1">
                        <svg className="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </span>
                      then tap <strong>&quot;Add to Home Screen&quot;</strong>
                    </p>
                  ) : isMobile ? (
                    <p className="text-gray-600 text-sm mb-3">
                      Tap the <strong>&#8942; menu</strong> (three dots) then tap <strong>&quot;Add to Home Screen&quot;</strong>
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm mb-3">
                      Click the install icon in your browser&apos;s address bar, or use your browser&apos;s menu to install this app.
                    </p>
                  )}
                  <button
                    onClick={dismissInstall}
                    className="w-full bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-xl text-sm hover:bg-gray-200 transition-all"
                  >
                    Got it
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bookmark Reminder - top banner for desktop */}
      {showBookmark && (
        <div
          id="bookmark-banner"
          className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ease-out ${
            bookmarkVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
              <p className="text-sm font-medium">
                <span className="mr-1.5" role="img" aria-label="star">⭐</span>
                Bookmark SabTools.in for quick access! Press{" "}
                <kbd className="bg-white/20 rounded px-1.5 py-0.5 text-xs font-mono">
                  {isMac ? "⌘" : "Ctrl"}+D
                </kbd>
              </p>
              <button
                onClick={dismissBookmark}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
