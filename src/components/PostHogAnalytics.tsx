"use client";

import { useEffect } from "react";

/**
 * PostHog product analytics — cookieless, anonymous, NO consent banner.
 *
 * Runs for EVERY visitor because it stores NOTHING on the device
 * (persistence: "memory" — no cookies, no localStorage). With nothing
 * persisted there is no cookie/identifier to consent to, so this is the
 * privacy-first "no banner" model that Plausible/Fathom use, and it is
 * defensible under India's DPDP Act and GDPR.
 *
 * Privacy posture:
 *   - persistence "memory": nothing is stored on the visitor's device; each
 *     visit is a fresh anonymous session (we trade returning-user accuracy
 *     for ~100% visitor coverage — the whole point of going cookieless).
 *   - api_host "/sx": first-party reverse proxy to PostHog EU (vercel.json)
 *     — keeps data in the EU, dodges ad-blockers, needs no CSP change.
 *   - session_recording.maskAllInputs: everything a user types into a
 *     calculator/form (amounts, salaries, text) is masked in replays, so the
 *     core promise ("your numbers never leave your device") still holds.
 *   - respect_dnt: honours the browser Do-Not-Track signal (the one privacy
 *     signal a user can send) — this is what keeps "no banner" defensible.
 *   - person_profiles "identified_only": anonymous visitors never get a
 *     stored person profile.
 *
 * NOTE: Google Analytics + AdSense remain cookie-based and stay gated behind
 * the CookieConsent banner. Only PostHog is cookieless/ungated.
 */

// Public PostHog project API key — safe to ship in client JS by design.
const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  "phc_ntdMVs8Ra98qFCnceTYWHF9Y7tRhdeCtUBqqt7f76P2B";

// First-party reverse-proxy path (see "rewrites" in vercel.json).
const POSTHOG_PROXY_HOST = "/sx";
const POSTHOG_UI_HOST = "https://eu.posthog.com";

let started = false;

async function startPostHog() {
  if (started || !POSTHOG_KEY || typeof window === "undefined") return;
  started = true;

  const posthog = (await import("posthog-js")).default;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_PROXY_HOST,
    ui_host: POSTHOG_UI_HOST,
    // Cookieless: store nothing on the device → no consent banner required.
    persistence: "memory",
    // Capture the first view + every App Router client-side navigation.
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
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
    // No consent gate — cookieless analytics loads for everyone, off the
    // critical path via dynamic import().
    void startPostHog();
  }, []);

  return null;
}
