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
 * Ad placeholder that reserves space via min-height even before AdSense is
 * approved. Reserving the slot height avoids CLS when real ads eventually
 * load (report §2.3) — the layout stays identical whether the slot is empty,
 * still loading, or filled with a creative.
 *
 * Once AdSense is approved, replace the inner content with the <ins
 * className="adsbygoogle"> tag; the outer min-height wrapper stays the same.
 */
export default function AdBanner({ format = "horizontal", className = "" }: AdBannerProps) {
  const minHeights: Record<NonNullable<AdBannerProps["format"]>, string> = {
    horizontal: "min-h-[90px]",
    vertical: "min-h-[600px]",
    rectangle: "min-h-[250px]",
  };

  return (
    <div
      className={`w-full ${minHeights[format]} ${className}`}
      aria-hidden="true"
      data-ad-slot-placeholder={format}
    />
  );
}
