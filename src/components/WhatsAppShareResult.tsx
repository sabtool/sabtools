"use client";

import { useCallback } from "react";

interface WhatsAppShareResultProps {
  toolName: string;
  slug: string;
  getResultText?: () => string;
}

/**
 * Extracts result data from .result-card elements on the page.
 *
 * Most tool result cards follow this HTML pattern:
 *   <div class="result-card ...">
 *     <div class="grid ...">           ← grid container
 *       <div class="... rounded-xl ...">  ← individual result box
 *         <div>Monthly EMI</div>          ← label (shorter text)
 *         <div>₹21,700</div>             ← value (has ₹, %, or numbers)
 *       </div>
 *       ...more boxes
 *     </div>
 *   </div>
 *
 * We walk the DOM tree and extract label-value pairs from each box.
 */
function extractResultFromPage(toolName: string, slug: string): string {
  const fallback = `I just used ${toolName} on SabTools.in! Try it free: https://sabtools.in/tools/${slug}`;

  const card = document.querySelector(".result-card");
  if (!card) return fallback;

  const lines: string[] = [];

  // Get all direct children of the result card, and their children
  // The pattern is: result-card > grid-container > individual-boxes
  const allDivs = card.querySelectorAll("div");

  allDivs.forEach((div) => {
    const children = div.children;
    // We want divs that have exactly 2 child divs (label + value)
    if (children.length !== 2) return;

    const first = children[0] as HTMLElement;
    const second = children[1] as HTMLElement;

    // Both must be div/span/p elements with text
    const firstText = first.textContent?.trim() || "";
    const secondText = second.textContent?.trim() || "";

    if (!firstText || !secondText) return;

    // One should be a label (no currency/number-heavy), one should be a value
    const hasValue = /[₹$%]|^\d/.test(secondText) || /\d{2,}/.test(secondText);
    const isLabel = firstText.length < 40 && !/[₹$]/.test(firstText);

    // Skip if both look like labels or both look like values
    if (!hasValue || !isLabel) return;

    // Skip percentage breakdowns like "Principal (54.2%)"
    if (firstText.includes("(") && firstText.includes("%)")) return;

    // Skip if the "value" is just a single digit or very short
    if (secondText.length < 2) return;

    const line = `${firstText}: ${secondText}`;
    if (!lines.includes(line)) {
      lines.push(line);
    }
  });

  if (lines.length === 0) return fallback;

  // Build a card-style WhatsApp message
  const border = "━━━━━━━━━━━━━━━━━━━━";
  return [
    `📊 *${toolName} — Result*`,
    border,
    ...lines.map((line) => `▸ ${line}`),
    border,
    ``,
    `🔗 Try it free: https://sabtools.in/tools/${slug}`,
    `⚡ Powered by SabTools.in`,
  ].join("\n");
}

export default function WhatsAppShareResult({ toolName, slug, getResultText }: WhatsAppShareResultProps) {
  const handleShare = useCallback(() => {
    const message = getResultText
      ? getResultText()
      : extractResultFromPage(toolName, slug);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }, [toolName, slug, getResultText]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]"
      style={{ backgroundColor: "#25D366" }}
      title="Share Result on WhatsApp"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Share Result on WhatsApp
    </button>
  );
}
