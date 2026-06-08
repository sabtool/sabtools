"use client";

/**
 * RateTrustBadge — Phase 5 of Project Trust.
 *
 * The single most credibility-building element we can add to any rate-
 * driven calculator: a small footer card that tells the visitor exactly
 *
 *   - what rate the calculator used
 *   - when we last verified it against the official source
 *   - which government source we verified against (linked)
 *   - whether it's still within its review window
 *
 * If the entry is overdue for review, the badge flips to amber with an
 * explicit warning. If it's very overdue (> reviewIntervalDays + 60d)
 * it flips to red.
 *
 * Competitors (ClearTax / Groww / BankBazaar) show rates without dates.
 * Showing the verification date is a real, structural trust signal that
 * is impossible to fake.
 *
 * Usage:
 *
 *   import { RateTrustBadge } from "@/components/RateTrustBadge";
 *   import { PPF } from "@/data/rates";
 *
 *   <RateTrustBadge entries={[PPF]} />
 *
 *   // Or for a tool that depends on multiple rates:
 *   <RateTrustBadge entries={[INCOME_TAX_NEW_REGIME_FY26_27, INCOME_TAX_OLD_REGIME_FY26_27]} />
 */

import type { RateEntry } from "@/data/rates";
import {
  daysSinceVerified,
  formatVerifiedDate,
  isOverdue,
} from "@/data/rates";

interface RateTrustBadgeProps {
  /**
   * One or more rate entries this calculator depends on. The badge shows
   * the OLDEST verification date among them (worst-case freshness).
   */
  entries: ReadonlyArray<RateEntry<unknown>>;
  /**
   * Optional label override. Defaults to "Rates verified".
   */
  label?: string;
}

export function RateTrustBadge({
  entries,
  label = "Rates verified",
}: RateTrustBadgeProps) {
  if (entries.length === 0) return null;

  // Use the OLDEST verification date — gives the user the worst-case
  // freshness across all dependencies. If any rate is overdue, we
  // surface that.
  const oldest = entries.reduce((acc, e) =>
    new Date(e.lastVerified) < new Date(acc.lastVerified) ? e : acc
  );
  const daysOld = daysSinceVerified(oldest);
  const overdue = isOverdue(oldest);
  const veryOverdue = daysOld > oldest.reviewIntervalDays + 60;

  // Pick colour scheme based on freshness.
  const palette = veryOverdue
    ? {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        accent: "text-red-700",
        icon: "⚠️",
        prefix: "Overdue review",
      }
    : overdue
      ? {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          accent: "text-amber-700",
          icon: "📅",
          prefix: "Review due",
        }
      : {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          accent: "text-green-700",
          icon: "✅",
          prefix: label,
        };

  // Pull the host out of the source URL for compact display.
  const sources = Array.from(
    new Set(
      entries.map((e) => {
        try {
          return new URL(e.source).hostname.replace(/^www\./, "");
        } catch {
          return "official source";
        }
      })
    )
  );

  return (
    <div
      className={`${palette.bg} ${palette.border} border rounded-xl px-4 py-2.5 text-xs ${palette.text} leading-relaxed`}
    >
      <div className="flex items-start gap-2 flex-wrap">
        <span className="text-sm">{palette.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={`font-semibold ${palette.accent}`}>
            {palette.prefix}: {formatVerifiedDate(oldest)}
          </span>
          {entries.length === 1 && entries[0].effectiveFrom !== entries[0].lastVerified && (
            <>
              {" · "}
              Rate effective from{" "}
              {new Date(entries[0].effectiveFrom).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </>
          )}
          {" · "}
          Source:{" "}
          {entries.map((e, i) => {
            let host = "official source";
            try {
              host = new URL(e.source).hostname.replace(/^www\./, "");
            } catch {
              /* ignore */
            }
            return (
              <span key={i}>
                {i > 0 && ", "}
                <a
                  href={e.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold hover:no-underline"
                  title={`Verify the rate on ${host}`}
                >
                  {host}
                </a>
              </span>
            );
          })}
          {overdue && (
            <p className="mt-1.5 text-[11px] opacity-90">
              This rate is past its scheduled review window ({daysOld} days
              since last verification, expected review every{" "}
              {oldest.reviewIntervalDays} days). It may have been revised
              by the government — please verify on the source link before
              relying on the calculator output.
            </p>
          )}
          {!overdue && sources.length === 1 && (
            <p className="mt-0.5 text-[11px] opacity-70">
              Verified by SabTools Rate Audit — re-checked every{" "}
              {oldest.reviewIntervalDays} days against the official source.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
