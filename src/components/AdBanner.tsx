// Server Component (no hooks, no event handlers, no browser APIs).
// Demoted from "use client" as part of the technical-SEO audit (Fix 4):
// shaves hydration overhead off every tool / blog / category page that
// embeds an ad slot. When AdSense is wired up later, the loader script
// should live in a SEPARATE small client component so this wrapper stays
// server-rendered.

interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

/**
 * Ad slot marker — currently renders NOTHING visible.
 *
 * 2026-08 visual audit finding: the previous version reserved 90-250px
 * of empty space per slot "to avoid CLS when ads load", but no
 * `<ins class="adsbygoogle">` was ever mounted anywhere in the codebase,
 * so the boxes stayed permanently empty — 4 slots x ~154px (box +
 * margins) per page of pure dead space, pushing the actual calculator
 * below the fold on mobile. AdSense auto-ads (script-level) inject and
 * size their own containers independently of these divs, so reserving
 * space here bought nothing.
 *
 * The component is kept (zero-height) so the ~40 call sites don't need
 * touching and so a real managed-slot implementation can be dropped in
 * later: when AdSense manual slots are actually wired, restore a
 * min-height AND render the <ins> tag in the same commit — never one
 * without the other.
 */
export default function AdBanner({ format = "horizontal", className = "" }: AdBannerProps) {
  return (
    <div
      className={`w-full ${className}`}
      aria-hidden="true"
      data-ad-slot-placeholder={format}
    />
  );
}
