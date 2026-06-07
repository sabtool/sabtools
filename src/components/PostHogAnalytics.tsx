"use client";

import { useEffect } from "react";

/**
 * PostHog product analytics — consent-gated + privacy-first.
 *
 * Mirrors GoogleAnalytics.tsx so the two behave identically:
 *   - Loads NOTHING until the user clicks "Accept All" on the existing
 *     CookieConsent banner (DPDP Act compliant — no new banner added).
 *   - Listens for the "sabtools:consent" CustomEvent so it can start the
 *     moment the user accepts, without a page reload.
 *   - posthog-js is loaded via dynamic import() so it is code-split and
 *     never touches the critical path (equivalent to GA's lazyOnload).
 *
 * Privacy posture (matches the "privacy-first" brand promise):
 *   - api_host "/sx" routes all traffic first-party through sabtools.in
 *     (reverse-proxied to PostHog EU in vercel.json). This keeps data in
 *     the EU, dodges ad-blockers, and needs NO CSP change (same-origin).
 *   - session_recording.maskAllInputs: every input field (loan amounts,
 *     salaries, any number a user types into a calculator) is masked in
 *     replays — we see HOW the tool is used, never the user's private data.
 *   - respect_dnt: honours the browser's Do-Not-Track signal.
 *   - person_profiles "identified_only": anonymous visitors never get a
 *     stored person profile — lighter and more private.
 *
 * Activation: set NEXT_PUBLIC_POSTHOG_KEY (the public phc_… project key) in
 * Vercel, or paste it into POSTHOG_KEY below. With no key the component is
 * inert, so builds/previews are always safe.
 */

// Public PostHog project API key — safe to ship in client JS by design.
const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  "phc_ntdMVs8Ra98qFCnceTYWHF9Y7tRhdeCtUBqqt7f76P2B";

// First-party reverse-proxy path (see "rewrites" in vercel.json).
const POSTHOG_PROXY_HOST = "/sx";
const POSTHOG_UI_HOST = "https://eu.posthog.com";
const STORAGE_KEY = "sabtools_cookie_consent";

let started = false;

async function startPostHog() {
  if (started || !POSTHOG_KEY || typeof window === "undefined") return;
  started = true;

  const posthog = (await import("posthog-js")).default;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_PROXY_HOST,
    ui_host: POSTHOG_UI_HOST,
    // Capture the first view + every App Router client-side navigation.
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage+cookie",
    person_profiles: "identified_only",
    respect_dnt: true,
    session_recording: {
      // Never record what users type into calculators / forms.
      maskAllInputs: true,
    },
  });
}

export default function PostHogAnalytics() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    const hasConsent = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        return JSON.parse(raw)?.consent === "all";
      } catch {
        return false;
      }
    };

    if (hasConsent()) {
      void startPostHog();
    }

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ consent: "all" | "essential" }>).detail;
      if (detail?.consent === "all") void startPostHog();
    };

    window.addEventListener("sabtools:consent", onConsent);
    return () => window.removeEventListener("sabtools:consent", onConsent);
  }, []);

  return null;
}
