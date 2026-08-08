"use client";
import { useState } from "react";

/**
 * Real PDF download using jsPDF + html2canvas-pro.
 *
 * v2 — captures the WHOLE tool area (#tool-capture-area wraps every
 * calculator in ToolPageLayout), so the PDF contains BOTH the inputs
 * and the results for every tool, regardless of how the individual
 * tool marks up its internals. Previously we captured only the first
 * `.result-card`, which meant old-style tools exported results
 * without inputs and new-style tools exported inputs without results.
 *
 * Layout of the generated PDF:
 *   1. Branded header (indigo band, SabTools.in)
 *   2. Tool name + generation date + page URL
 *   3. "Your Inputs" — a real-text table harvested from every visible
 *      input/select on the page (crisp vector text, tiny file size)
 *   4. Screenshot of the full tool area, sliced across as many A4
 *      pages as needed (capped at MAX_TOTAL_PAGES)
 *   5. Footer with disclaimer + "Page X of Y" on every page
 *
 * FAQ cards (h3 containing "FAQ") are stripped from the screenshot in
 * html2canvas's onclone — they're page content, not calculation, and
 * they were inflating PDFs by dozens of pages on content-heavy tools.
 *
 * Falls back to window.print() if the capture area is missing or
 * rendering fails.
 */

const MAX_TOTAL_PAGES = 10;

interface HarvestedField {
  label: string;
  value: string;
}

/** Collect {label, value} for every visible, filled form field in the area. */
function harvestInputs(area: HTMLElement): HarvestedField[] {
  const out: HarvestedField[] = [];
  const fields = area.querySelectorAll<HTMLElement>("input, select, textarea");

  fields.forEach((el) => {
    const f = el as HTMLInputElement;
    const type = (f.getAttribute("type") || "").toLowerCase();
    if (["hidden", "button", "submit", "file", "image", "reset"].includes(type)) return;
    if (f.disabled) return;
    // Skip invisible fields (e.g. inactive shape variants)
    if (!(f.offsetWidth || f.offsetHeight || f.getClientRects().length)) return;

    let value = "";
    if (el.tagName === "SELECT") {
      const s = el as unknown as HTMLSelectElement;
      value = s.selectedOptions?.[0]?.text?.trim() || s.value;
    } else if (type === "checkbox") {
      value = f.checked ? "Yes" : "No";
    } else if (type === "radio") {
      if (!f.checked) return;
      value = f.value;
    } else {
      value = (f.value ?? "").trim();
    }
    if (!value) return;

    // Find the label: for= match → wrapping <label> → nearby <label> in
    // the same field container (the codebase's standard markup pattern).
    let label = "";
    if (f.id) {
      try {
        label =
          area.querySelector(`label[for="${CSS.escape(f.id)}"]`)?.textContent?.trim() || "";
      } catch {
        /* older browsers without CSS.escape — fall through */
      }
    }
    if (!label) label = f.closest("label")?.textContent?.trim() || "";
    if (!label) {
      let p: HTMLElement | null = f.parentElement;
      for (let hops = 0; p && hops < 3 && !label; hops++) {
        const l = p.querySelector(":scope > label");
        if (l) label = l.textContent?.trim() || "";
        p = p.parentElement;
      }
    }
    if (!label) {
      label =
        f.getAttribute("aria-label") ||
        f.getAttribute("placeholder") ||
        f.getAttribute("name") ||
        "Input";
    }
    label = label.replace(/\s+/g, " ").trim();
    out.push({ label, value: value.replace(/\s+/g, " ").trim() });
  });

  return out;
}

export default function DownloadPDF({
  toolName = "Calculation",
}: {
  toolName?: string;
} = {}) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);

    try {
      // The whole calculator (inputs + results) — wrapped by ToolPageLayout.
      const area =
        (document.getElementById("tool-capture-area") as HTMLElement | null) ||
        (document.querySelector(".result-card") as HTMLElement | null);

      if (!area) {
        window.print();
        return;
      }

      // Lazy-load heavy libs only when the user clicks (zero first-paint cost)
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);

      // Harvest inputs BEFORE rendering (live DOM has current values)
      const inputs = harvestInputs(area);

      // Keep the canvas under iOS Safari's ~16.7M pixel limit. Normal tools
      // get retina scale 2; very tall content-heavy tools drop as low as
      // 0.5 rather than risk a silently blank canvas on iPhone.
      const rect = area.getBoundingClientRect();
      const pxBudget = 14_000_000;
      const scale = Math.min(
        2,
        Math.max(0.5, Math.sqrt(pxBudget / Math.max(1, rect.width * rect.height)))
      );

      const canvas = await html2canvas(area, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (doc: Document) => {
          const cloned = doc.getElementById("tool-capture-area");
          if (!cloned) return;
          // Strip FAQ cards — page content, not calculation output.
          cloned.querySelectorAll(".result-card").forEach((cardEl) => {
            const heading = cardEl.querySelector("h2, h3");
            if (heading && /faq/i.test(heading.textContent || "")) cardEl.remove();
          });
        },
      });

      // JPEG keeps content-heavy captures ~5x smaller than PNG.
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      // A4 portrait: 210 × 297 mm
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const footerTop = pageHeight - 16; // content must stay above this
      const usableWidth = pageWidth - 2 * margin;

      // === Branded header (page 1) ===
      pdf.setFillColor(79, 70, 229); // indigo-600
      pdf.rect(0, 0, pageWidth, 18, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("SabTools.in", margin, 12);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("Free Online Tools — No Signup Required", pageWidth - margin, 12, {
        align: "right",
      });

      // === Title + meta ===
      pdf.setTextColor(17, 24, 39); // gray-900
      pdf.setFontSize(15);
      pdf.setFont("helvetica", "bold");
      pdf.text(toolName, margin, 30);

      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.setFont("helvetica", "normal");
      const dateStr = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.text(`Generated on ${dateStr}`, margin, 36);
      const url = typeof window !== "undefined" ? window.location.href : "https://sabtools.in";
      pdf.text(`URL: ${url}`, margin, 41);

      let y = 48;

      // === "Your Inputs" table (real text — crisp at any zoom) ===
      if (inputs.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(79, 70, 229);
        pdf.text("Your Inputs", margin, y);
        y += 2.5;
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 4.5;

        pdf.setFontSize(9);
        for (const { label, value } of inputs) {
          const line = `${label}:  ${value}`;
          const wrapped: string[] = pdf.splitTextToSize(line, usableWidth - 2);
          const blockHeight = wrapped.length * 4.2;
          if (y + blockHeight > footerTop - 4) {
            pdf.addPage();
            y = margin + 4;
          }
          // Label bold, value normal — draw label then value on same baseline
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(55, 65, 81); // gray-700
          const labelWidth = pdf.getTextWidth(`${label}:  `);
          pdf.text(`${label}:`, margin, y);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(17, 24, 39);
          const valueWrapped: string[] = pdf.splitTextToSize(
            value,
            usableWidth - labelWidth - 2
          );
          pdf.text(valueWrapped, margin + labelWidth, y);
          y += Math.max(valueWrapped.length, 1) * 4.2 + 1.3;
        }
        y += 3;
      }

      // === Full tool screenshot, sliced across pages ===
      const imgHeightMm = usableWidth * (canvas.height / canvas.width);

      const slimBand = () => {
        pdf.setFillColor(79, 70, 229);
        pdf.rect(0, 0, pageWidth, 8, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text(`SabTools.in — ${toolName}`, margin, 5.5);
      };

      // If little room left on this page, start the capture on a fresh page.
      if (footerTop - y < 40 && imgHeightMm > footerTop - y) {
        pdf.addPage();
        slimBand();
        y = 13;
      }

      let consumedMm = 0;
      let truncated = false;
      while (consumedMm < imgHeightMm - 0.5) {
        const isFirstSlice = consumedMm === 0;
        if (!isFirstSlice) {
          if (pdf.getNumberOfPages() >= MAX_TOTAL_PAGES) {
            truncated = true;
            break;
          }
          pdf.addPage();
          y = 13; // below the slim band drawn after masking
        }
        const contentTop = y;
        const contentBottom = footerTop - 2;

        // Draw the full image shifted up by what's already consumed. On the
        // first slice it starts exactly at contentTop (no bleed above); on
        // continuation slices it bleeds above, so mask the top then redraw
        // the slim branded band over the mask.
        pdf.addImage(imgData, "JPEG", margin, contentTop - consumedMm, usableWidth, imgHeightMm);
        if (!isFirstSlice) {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pageWidth, contentTop - 0.1, "F");
          slimBand();
        }
        // Bottom overflow mask (always — image extends below the window
        // until the final slice, and a stray 0.5mm sliver is invisible).
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, contentBottom, pageWidth, pageHeight - contentBottom, "F");

        consumedMm += contentBottom - contentTop;
      }

      // === Footer on every page (with final page count known) ===
      const total = pdf.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text(
          truncated && i === total
            ? `Content truncated — view the full page at ${url}`
            : "Generated by sabtools.in — calculations are estimates, not financial / legal advice.",
          margin,
          pageHeight - 8
        );
        pdf.text(`Page ${i} of ${total}`, pageWidth - margin, pageHeight - 8, {
          align: "right",
        });
      }

      // === Save ===
      const safeName = toolName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      pdf.save(`sabtools-${safeName}-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF generation failed, falling back to print:", err);
      window.print();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      className="download-pdf-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
      title="Download inputs + results as a branded PDF"
    >
      {busy ? (
        <>
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path
              d="M22 12a10 10 0 0 0-10-10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          Generating…
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  );
}
