"use client";

interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

// AdSense not yet approved — return null to hide placeholders
// Once approved, replace this with actual AdSense code
export default function AdBanner({ }: AdBannerProps) {
  // TODO: Uncomment and update after AdSense approval
  // const heights: Record<string, string> = {
  //   horizontal: "h-[90px]",
  //   vertical: "h-[600px]",
  //   rectangle: "h-[250px]",
  // };
  // return (
  //   <div className={`w-full ${heights[format]} ${className}`}>
  //     <ins className="adsbygoogle"
  //       style={{ display: "block" }}
  //       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  //       data-ad-slot="XXXXXXXXXX"
  //       data-ad-format="auto"
  //       data-full-width-responsive="true" />
  //   </div>
  // );

  return null;
}
