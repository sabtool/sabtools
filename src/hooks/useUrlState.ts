"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useUrlState — drop-in replacement for useState that also encodes/decodes
 * the value into the URL's query string under a chosen key.
 *
 * Two important properties:
 *
 *  1. SSR / static-export safe: returns the initial value during SSR (window
 *     not yet defined), then hydrates from URL on first client render.
 *
 *  2. Debounced URL writes (200ms): typing into a number input fires a state
 *     update on every keystroke, but only the last value gets pushed to the
 *     URL. Avoids history-spam and a noticeable input lag.
 *
 * Usage:
 *
 *   // Replace this:
 *   const [principal, setPrincipal] = useState(500_000);
 *
 *   // With this (keeps everything else identical):
 *   const [principal, setPrincipal] = useUrlState("p", 500_000);
 *
 * Now the URL becomes /tools/emi-calculator?p=500000 and reloading or
 * sharing preserves the calculation. Each useUrlState call uses a different
 * single-letter / short key to keep URLs compact for share / WhatsApp.
 *
 * Type support: number, string, boolean. For complex objects use JSON.stringify
 * yourself and pass a string.
 */

type Serializable = string | number | boolean;

// Widens literal types (e.g. `2500000`, `"hello"`, `true`) back to their
// primitive base. Without this, `useUrlState("p", 2500000)` would infer
// T as the literal `2500000` and the setter would reject any other number.
type Widen<T> = T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T;

function decode<T extends Serializable>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  if (typeof fallback === "number") {
    const n = Number(raw);
    return (isNaN(n) ? fallback : (n as T));
  }
  if (typeof fallback === "boolean") {
    return (raw === "1" || raw === "true") as T;
  }
  return raw as T;
}

function encode(value: Serializable): string {
  if (typeof value === "boolean") return value ? "1" : "0";
  return String(value);
}

export function useUrlState<T extends Serializable>(
  key: string,
  initial: T
): [Widen<T>, (value: Widen<T>) => void] {
  const [value, setValue] = useState<Widen<T>>(initial as unknown as Widen<T>);
  const writeTimer = useRef<number | null>(null);

  // Hydrate from URL once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(key);
    if (raw !== null) {
      setValue(decode(raw, initial) as unknown as Widen<T>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push to URL whenever value changes (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (writeTimer.current !== null) {
      window.clearTimeout(writeTimer.current);
    }
    writeTimer.current = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      // Only write if different from default — keeps URL clean when user
      // hasn't changed anything, and means "reset to default" by removing
      // from URL when value matches initial.
      if ((value as Serializable) === (initial as Serializable)) {
        params.delete(key);
      } else {
        params.set(key, encode(value as Serializable));
      }
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname +
        (newSearch ? "?" + newSearch : "") +
        window.location.hash;
      window.history.replaceState(null, "", newUrl);
    }, 200);
    return () => {
      if (writeTimer.current !== null) {
        window.clearTimeout(writeTimer.current);
      }
    };
  }, [key, value, initial]);

  const update = useCallback((next: Widen<T>) => {
    setValue(next);
  }, []);

  return [value, update];
}
