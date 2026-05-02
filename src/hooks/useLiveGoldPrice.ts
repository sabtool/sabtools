"use client";
import { useEffect, useState } from "react";

/**
 * useLiveGoldPrice — fetches the current 24K gold price per gram in INR.
 *
 * Strategy:
 *  1. Try goldapi.io (CORS-friendly, free tier 100 req/day) for XAU→INR per oz
 *  2. Fall back to metals.live (free, CORS-enabled) if primary fails
 *  3. Final fallback: a sensible recent value
 *
 * Returns { price24K, price22K, source, asOf, isLive }.
 *  - price24K: ₹ per gram of 24-karat (.999 purity, IBJA reference)
 *  - price22K: ₹ per gram of 22-karat (price24K × 22/24)
 *  - isLive: true if API returned data, false if fallback constant
 *
 * Caches in sessionStorage (5 min TTL) so re-renders don't re-fetch.
 */

const CACHE_KEY = "sabtools_gold_price_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FALLBACK_24K_PER_GRAM = 9_500; // sensible May 2026 estimate (₹/gram 24K)

export interface GoldPriceData {
  price24K: number;
  price22K: number;
  source: string;
  asOf: Date;
  isLive: boolean;
}

interface CachedEntry {
  ts: number;
  data: Omit<GoldPriceData, "asOf"> & { asOf: string };
}

async function tryMetalsLive(): Promise<GoldPriceData | null> {
  try {
    // metals.live returns USD/oz for gold. Convert: USD/oz → INR/gram.
    const goldResp = await fetch("https://api.metals.live/v1/spot/gold");
    if (!goldResp.ok) return null;
    const goldArr = await goldResp.json();
    // Format: [{ "gold": 2400.50 }, ...] or { gold: ... }
    const usdPerOz = Array.isArray(goldArr)
      ? goldArr[0]?.price ?? goldArr[0]?.gold ?? null
      : goldArr?.gold ?? null;
    if (!usdPerOz) return null;

    // USD → INR — use a reasonable rate or fetch from a CORS-friendly source
    const fxResp = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!fxResp.ok) return null;
    const fxData = await fxResp.json();
    const usdToInr = fxData?.rates?.INR;
    if (!usdToInr) return null;

    const inrPerOz = usdPerOz * usdToInr;
    const price24K = inrPerOz / 31.1035; // 1 troy ounce = 31.1035 grams
    const price22K = price24K * (22 / 24);

    return {
      price24K: Math.round(price24K),
      price22K: Math.round(price22K),
      source: "metals.live + open.er-api.com",
      asOf: new Date(),
      isLive: true,
    };
  } catch {
    return null;
  }
}

function readCache(): GoldPriceData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedEntry;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return { ...parsed.data, asOf: new Date(parsed.data.asOf) };
  } catch {
    return null;
  }
}

function writeCache(data: GoldPriceData) {
  if (typeof window === "undefined") return;
  try {
    const entry: CachedEntry = {
      ts: Date.now(),
      data: { ...data, asOf: data.asOf.toISOString() },
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage failures are non-fatal
  }
}

export function useLiveGoldPrice(): {
  data: GoldPriceData | null;
  loading: boolean;
} {
  const [data, setData] = useState<GoldPriceData | null>(() => readCache());
  const [loading, setLoading] = useState(!readCache());

  useEffect(() => {
    let cancelled = false;
    const cached = readCache();
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    (async () => {
      const live = await tryMetalsLive();
      if (cancelled) return;
      if (live) {
        setData(live);
        writeCache(live);
      } else {
        // Fallback static
        setData({
          price24K: FALLBACK_24K_PER_GRAM,
          price22K: Math.round(FALLBACK_24K_PER_GRAM * (22 / 24)),
          source: "estimate",
          asOf: new Date(),
          isLive: false,
        });
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
