#!/usr/bin/env node
/**
 * Build-time image optimization for blog hero images.
 *
 * Reads every source image in `public/blog/` and emits 3 size variants
 * (320w, 768w, 1200w) in BOTH `image/avif` and `image/webp`. The
 * <ResponsiveImage> component (src/components/ResponsiveImage.tsx) consumes
 * these variants via <picture><source srcset="…"></picture>.
 *
 * Why pre-process at build time instead of `next/image`:
 *
 *   This site uses Next.js `output: "export"` (static export). The built-in
 *   `next/image` optimization API requires a Node server at runtime, which
 *   doesn't exist in a static export. Pre-processing with sharp at build
 *   time produces equivalent (and arguably better) responsive variants
 *   without any runtime cost.
 *
 * Idempotency:
 *
 *   The script skips files whose variants already exist on disk. So a
 *   second `prebuild` run after no image changes is essentially a no-op
 *   (~1s for stat-checks across ~150 images).
 *
 * Failure mode:
 *
 *   If sharp can't decode a file (corrupt / wrong magic bytes), we log the
 *   filename and continue. Build does NOT fail — the original file is
 *   still served at full size as a fallback (the <picture> falls through
 *   to <img src> which is the original).
 *
 * Added by the technical-SEO audit (Fix 5).
 */

import sharp from "sharp";
import { glob } from "glob";
import path from "node:path";
import { existsSync, statSync } from "node:fs";

const SIZES = [320, 768, 1200];
const PUBLIC_DIR = path.resolve("public");
const BLOG_GLOB = "public/blog/*.{png,jpg,jpeg,webp}";

// Already-processed variants follow the pattern `<base>-w<size>.<ext>`.
// Filter those out so we don't re-process our own output.
const VARIANT_RE = /-w(320|768|1200)\.(webp|avif)$/i;

const inputs = (await glob(BLOG_GLOB)).filter((p) => !VARIANT_RE.test(p));

if (inputs.length === 0) {
  console.log("[optimize-images] no source images found in public/blog/");
  process.exit(0);
}

let processed = 0;
let skipped = 0;
let failed = 0;

for (const input of inputs) {
  const ext = path.extname(input);
  const base = input.slice(0, -ext.length);

  try {
    // Read source once — stat is faster than re-decoding for skip check
    const sourceMtime = statSync(input).mtimeMs;

    for (const w of SIZES) {
      for (const fmt of /** @type {const} */ (["webp", "avif"])) {
        const out = `${base}-w${w}.${fmt}`;

        // Skip if output is newer than source (idempotency)
        if (existsSync(out)) {
          const outMtime = statSync(out).mtimeMs;
          if (outMtime >= sourceMtime) {
            skipped++;
            continue;
          }
        }

        const pipeline = sharp(input).resize({ width: w, withoutEnlargement: true });
        if (fmt === "webp") {
          await pipeline.webp({ quality: 78, effort: 4 }).toFile(out);
        } else {
          await pipeline.avif({ quality: 60, effort: 4 }).toFile(out);
        }
        processed++;
      }
    }
  } catch (err) {
    failed++;
    console.warn(`[optimize-images] failed to process ${input}: ${err.message}`);
    // Continue — this file's <picture> will fall back to the original <img src>
  }
}

console.log(
  `[optimize-images] done · processed=${processed} skipped=${skipped} failed=${failed} sources=${inputs.length}`
);
