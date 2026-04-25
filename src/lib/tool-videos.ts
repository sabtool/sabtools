/**
 * Tool-video registry — maps a tool's `slug` to a tutorial / walkthrough
 * video that lives on the SabTools.in YouTube channel
 * (https://www.youtube.com/@sabtools).
 *
 * When a tool has an entry here, `ToolPageLayout` does TWO things:
 *   1. Renders a privacy-enhanced YouTube embed
 *      (`https://www.youtube-nocookie.com/embed/{youtubeId}`) above the FAQ.
 *   2. Adds a `VideoObject` node to the page's @graph so the embed becomes
 *      eligible for Google's video-rich-result carousel.
 *
 * IMPORTANT: only add an entry once the video has actually been published.
 * Emitting a VideoObject for a non-existent video (or pointing it at a 404)
 * is a known cause of rich-result demotion — see Strategy report §2.4.
 *
 * The default `thumbnailUrl` template `https://i.ytimg.com/vi/{ID}/hqdefault.jpg`
 * is generated automatically; override `thumbnailUrl` only if the video has
 * a custom thumbnail at a different URL.
 */

export interface ToolVideo {
  /** YouTube video ID — the part after `?v=` in the watch URL. */
  youtubeId: string;
  /** Video name / headline (~60 chars). */
  name: string;
  /** 60-160 char description — keep it specific, no marketing fluff. */
  description: string;
  /** ISO 8601 upload date (YYYY-MM-DD). */
  uploadDate: string;
  /** Optional ISO 8601 duration — "PT3M12S" = 3 min 12 sec. */
  duration?: string;
  /** Override if the video has a non-default custom thumbnail. */
  thumbnailUrl?: string;
  /** Default "en-IN"; pass "hi-IN" for Hindi-narrated videos. */
  inLanguage?: string;
}

/**
 * Registry. Keyed by tool slug (matches `Tool.slug` in `lib/tools.ts`).
 * Empty by default — populated as videos are produced and uploaded.
 *
 * Example entry (commented so nothing fictitious ships):
 *
 *   "emi-calculator": {
 *     youtubeId: "abc12345xyz",
 *     name: "How to use the EMI Calculator on SabTools.in",
 *     description: "Step-by-step walkthrough for calculating home, car, and personal loan EMIs in under 60 seconds.",
 *     uploadDate: "2026-04-30",
 *     duration: "PT1M12S",
 *   },
 */
export const toolVideos: Record<string, ToolVideo> = {};

/** Privacy-enhanced embed URL. Use `youtube-nocookie.com` per Strategy §2.3. */
export function embedUrlFor(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}

/** Public watch URL — used as `contentUrl` on the VideoObject. */
export function watchUrlFor(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/** Default YouTube hqdefault thumbnail URL — guaranteed to exist for any uploaded video. */
export function defaultThumbnailFor(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
