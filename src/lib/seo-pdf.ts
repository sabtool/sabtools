/**
 * SEO Report PDF Generator
 * ------------------------
 *
 * Builds a multi-page A4 PDF from a SeoReport. Uses jsPDF in TEXT mode
 * (not screenshot/html2canvas) so the result is:
 *   - tiny (~50-150 KB instead of multi-MB images),
 *   - fully searchable / selectable,
 *   - sharp at any zoom level,
 *   - readable on phones.
 *
 * Layout:
 *   Page 1 — Cover (brand header, URL, audit date, composite grade,
 *            verdict, score grid).
 *   Page 2 — Performance details: Core Web Vitals, page weight, mobile
 *            vs desktop comparison.
 *   Page 3+ — One section per category (On-Page, Technical, Schema,
 *            Performance Details, Accessibility, …) listing every check
 *            with status badge, detail and fix.
 *   Last  — Honest scope panel + footer disclaimer.
 *
 * Every page carries a footer: "sabtools.in — Free SEO Audit Tool · Page
 * N / Total". The cover header uses #FF6B35 (SabTools saffron-orange) on
 * dark #1A1A1A, matching the brand. No external fonts so the PDF works
 * even when the user is offline.
 */

import type { jsPDF as JsPDFType } from "jspdf";

// ── Re-declare the SeoReport shape we consume — keeping it shallow & local
// avoids a circular import with SeoChecker.tsx and makes the contract
// explicit. Mirror the interface there.
export interface SeoPdfReport {
  url: string;
  finalUrl: string;
  scores: {
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPractices: number | null;
  };
  desktopScores: {
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPractices: number | null;
  } | null;
  cwv: Array<{
    key: string;
    label: string;
    value: string;
    rating: "good" | "average" | "poor" | "n/a";
  }>;
  fieldDataAvailable: boolean;
  fieldCwv: {
    lcp?: { value: string; rating: "good" | "average" | "poor" };
    cls?: { value: string; rating: "good" | "average" | "poor" };
    inp?: { value: string; rating: "good" | "average" | "poor" };
    fcp?: { value: string; rating: "good" | "average" | "poor" };
    overallCategory?: "FAST" | "AVERAGE" | "SLOW";
  } | null;
  pageWeight: {
    totalKB: number;
    requestCount: number;
    byType: Array<{ label: string; sizeKB: number; requests: number }>;
  } | null;
  ttfbMs: number | null;
  schemaTypes: string[];
  httpStatus: number | null;
  checks: Array<{
    category: string;
    label: string;
    status: "pass" | "warn" | "fail" | "info";
    detail: string;
    fix?: string;
    source?: "Lighthouse" | "Crawl" | "HTTP" | "Robots" | "Sitemap";
  }>;
  composite: number;
  grade: string;
  topPriorities: string[];
  verdict: string;
  generatedAt: string;
}

// Brand palette (matches the on-screen tool styling).
const COLOURS = {
  brand: [255, 107, 53] as [number, number, number], // #FF6B35
  dark: [26, 26, 26] as [number, number, number], // #1A1A1A
  pass: [22, 163, 74] as [number, number, number], // green-600
  warn: [217, 119, 6] as [number, number, number], // amber-600
  fail: [220, 38, 38] as [number, number, number], // red-600
  info: [37, 99, 235] as [number, number, number], // blue-600
  passBg: [220, 252, 231] as [number, number, number], // green-50
  warnBg: [254, 243, 199] as [number, number, number], // amber-50
  failBg: [254, 226, 226] as [number, number, number], // red-50
  infoBg: [219, 234, 254] as [number, number, number], // blue-50
  grayText: [75, 85, 99] as [number, number, number], // gray-600
  grayLight: [243, 244, 246] as [number, number, number], // gray-100
  grayBorder: [229, 231, 235] as [number, number, number], // gray-200
};

const STATUS_COLOUR = {
  pass: COLOURS.pass,
  warn: COLOURS.warn,
  fail: COLOURS.fail,
  info: COLOURS.info,
};
const STATUS_BG = {
  pass: COLOURS.passBg,
  warn: COLOURS.warnBg,
  fail: COLOURS.failBg,
  info: COLOURS.infoBg,
};
const STATUS_GLYPH = {
  pass: "PASS",
  warn: "WARN",
  fail: "FAIL",
  info: "INFO",
};

const CATEGORY_ORDER = [
  "On-Page SEO",
  "Technical SEO",
  "Internationalisation",
  "Content",
  "Schema Markup",
  "Performance Details",
  "Accessibility",
  "Best Practices",
  "Crawler Access",
  "Social",
];

// Helper to colour the grade band (matches scoreClasses in the React tool).
function scoreColour(s: number | null): [number, number, number] {
  if (s === null) return [156, 163, 175]; // gray-400
  if (s >= 90) return COLOURS.pass;
  if (s >= 50) return COLOURS.warn;
  return COLOURS.fail;
}

/**
 * Generate and trigger download of the SEO report PDF.
 * Heavy work is wrapped in an async function so the UI shows a "preparing"
 * state while jsPDF loads (~50 KB lazy import).
 */
export async function downloadSeoReportPdf(report: SeoPdfReport): Promise<void> {
  // Lazy-load jsPDF only when the user actually clicks download — keeps
  // it out of the first-paint bundle.
  const { default: jsPDF } = await import("jspdf");

  const pdf: JsPDFType = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  }) as unknown as JsPDFType;

  const W = pdf.internal.pageSize.getWidth(); // 210
  const H = pdf.internal.pageSize.getHeight(); // 297
  const M = 14; // outer margin
  let y = 0; // current Y cursor

  // ── Helper: draw the brand footer + page number ──────────────────
  const drawFooter = (pageNum: number, total: number) => {
    pdf.setDrawColor(...COLOURS.grayBorder);
    pdf.setLineWidth(0.2);
    pdf.line(M, H - 12, W - M, H - 12);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLOURS.grayText);
    pdf.text("sabtools.in — Free SEO Audit Tool", M, H - 7);
    pdf.text(
      `Page ${pageNum} of ${total}`,
      W - M,
      H - 7,
      { align: "right" }
    );
  };

  // ── Helper: ensure space; advance to next page if not enough ────
  const ensureSpace = (needed: number) => {
    if (y + needed > H - 18) {
      pdf.addPage();
      y = M;
    }
  };

  // ── Helper: split long text into wrapped lines ─────────────────
  const wrap = (text: string, maxWidth: number, fontSize: number): string[] => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(text, maxWidth) as string[];
  };

  // ════════════════════════════════════════════════════════════════
  // COVER PAGE
  // ════════════════════════════════════════════════════════════════
  // Brand band
  pdf.setFillColor(...COLOURS.dark);
  pdf.rect(0, 0, W, 38, "F");
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("SabTools.in", M, 18);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLOURS.brand);
  pdf.text("FREE SEO AUDIT REPORT", M, 26);
  pdf.setFontSize(8);
  pdf.setTextColor(220, 220, 220);
  pdf.text("Real data · 130+ checks · No fabricated metrics", M, 32);

  y = 52;

  // Audit subject
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLOURS.grayText);
  pdf.text("URL AUDITED", M, y);
  y += 5;
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLOURS.dark);
  const urlLines = wrap(report.finalUrl, W - 2 * M, 13);
  urlLines.slice(0, 2).forEach((line) => {
    pdf.text(line, M, y);
    y += 6;
  });
  y += 2;
  pdf.setFontSize(9);
  pdf.setTextColor(...COLOURS.grayText);
  const dt = new Date(report.generatedAt);
  pdf.text(
    `Audited on ${dt.toUTCString().replace(":00 GMT", " GMT")}`,
    M,
    y
  );
  if (report.httpStatus !== null) {
    pdf.text(`HTTP status: ${report.httpStatus}`, W - M, y, {
      align: "right",
    });
  }
  y += 10;

  // Big grade tile
  const tileSize = 38;
  const tileX = M;
  const tileY = y;
  pdf.setFillColor(...scoreColour(report.composite));
  pdf.roundedRect(tileX, tileY, tileSize, tileSize, 4, 4, "F");
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text(report.grade, tileX + tileSize / 2, tileY + 22, {
    align: "center",
  });
  pdf.setFontSize(9);
  pdf.text(
    `${report.composite}/100`,
    tileX + tileSize / 2,
    tileY + 30,
    { align: "center" }
  );

  // Verdict box to the right
  const verdictX = tileX + tileSize + 8;
  const verdictW = W - M - verdictX;
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLOURS.dark);
  pdf.text(`SEO Report — ${report.verdict}`, verdictX, tileY + 10);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLOURS.grayText);
  const counts = {
    pass: report.checks.filter((c) => c.status === "pass").length,
    warn: report.checks.filter((c) => c.status === "warn").length,
    fail: report.checks.filter((c) => c.status === "fail").length,
  };
  pdf.text(
    `${counts.pass} passed  ·  ${counts.warn} warnings  ·  ${counts.fail} failed`,
    verdictX,
    tileY + 17
  );
  pdf.setFontSize(9);
  const desc = wrap(
    `This audit was run by Lighthouse against your live mobile URL plus an on-page HTML crawl, robots.txt and sitemap.xml parse. Every score is real — no estimates.`,
    verdictW,
    9
  );
  let descY = tileY + 24;
  desc.forEach((line) => {
    pdf.text(line, verdictX, descY);
    descY += 4;
  });
  y = tileY + tileSize + 10;

  // Score cards (mobile primary)
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLOURS.dark);
  pdf.text("Category scores (mobile — primary)", M, y);
  y += 6;
  const cardW = (W - 2 * M - 9) / 4;
  const cardH = 22;
  const cardLabels: Array<["Performance" | "SEO" | "Accessibility" | "Best Practices", number | null]> = [
    ["Performance", report.scores.performance],
    ["SEO", report.scores.seo],
    ["Accessibility", report.scores.accessibility],
    ["Best Practices", report.scores.bestPractices],
  ];
  cardLabels.forEach(([label, val], i) => {
    const x = M + i * (cardW + 3);
    pdf.setFillColor(...COLOURS.grayLight);
    pdf.roundedRect(x, y, cardW, cardH, 2, 2, "F");
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "bold");
    const col = scoreColour(val);
    pdf.setTextColor(...col);
    pdf.text(val === null ? "—" : String(val), x + cardW / 2, y + 12, {
      align: "center",
    });
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLOURS.grayText);
    pdf.text(label, x + cardW / 2, y + 18, { align: "center" });
  });
  y += cardH + 8;

  // Top priorities
  if (report.topPriorities.length > 0) {
    ensureSpace(20);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLOURS.dark);
    pdf.text("Top priorities to fix", M, y);
    y += 6;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLOURS.grayText);
    report.topPriorities.forEach((p, i) => {
      const txt = `${i + 1}. ${p}`;
      const lines = wrap(txt, W - 2 * M, 10);
      lines.forEach((l) => {
        ensureSpace(5);
        pdf.text(l, M, y);
        y += 5;
      });
    });
  }

  // ════════════════════════════════════════════════════════════════
  // PAGE 2: Performance details
  // ════════════════════════════════════════════════════════════════
  pdf.addPage();
  y = M;
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLOURS.dark);
  pdf.text("Performance details", M, y);
  y += 8;

  // Core Web Vitals
  if (report.cwv.length > 0) {
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Core Web Vitals (lab)", M, y);
    y += 6;
    const cwvW = (W - 2 * M - 12) / 5;
    report.cwv.forEach((m, i) => {
      const x = M + i * (cwvW + 3);
      pdf.setFillColor(...COLOURS.grayLight);
      pdf.roundedRect(x, y, cwvW, 18, 2, 2, "F");
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(
        ...(m.rating === "good"
          ? COLOURS.pass
          : m.rating === "average"
            ? COLOURS.warn
            : m.rating === "poor"
              ? COLOURS.fail
              : COLOURS.grayText)
      );
      pdf.text(m.value, x + cwvW / 2, y + 9, { align: "center" });
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLOURS.grayText);
      const labelLines = wrap(m.label, cwvW - 2, 7);
      pdf.text(labelLines[0] || "", x + cwvW / 2, y + 14, {
        align: "center",
      });
    });
    y += 24;
  }

  // CrUX field data
  if (
    report.fieldCwv &&
    (report.fieldCwv.lcp || report.fieldCwv.cls || report.fieldCwv.inp)
  ) {
    ensureSpace(30);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLOURS.dark);
    pdf.text("Real-User Field Data (CrUX, last 28 days)", M, y);
    y += 6;
    const fieldCells: Array<[string, { value: string; rating: string } | undefined]> = [
      ["LCP", report.fieldCwv.lcp],
      ["INP", report.fieldCwv.inp],
      ["CLS", report.fieldCwv.cls],
      ["FCP", report.fieldCwv.fcp],
    ];
    const fW = (W - 2 * M - 9) / 4;
    fieldCells.forEach(([label, m], i) => {
      if (!m) return;
      const x = M + i * (fW + 3);
      pdf.setFillColor(...COLOURS.grayLight);
      pdf.roundedRect(x, y, fW, 18, 2, 2, "F");
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(
        ...(m.rating === "good"
          ? COLOURS.pass
          : m.rating === "average"
            ? COLOURS.warn
            : COLOURS.fail)
      );
      pdf.text(m.value, x + fW / 2, y + 9, { align: "center" });
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLOURS.grayText);
      pdf.text(`${label} (real users)`, x + fW / 2, y + 14, {
        align: "center",
      });
    });
    y += 24;
  }

  // Page weight
  if (report.pageWeight) {
    ensureSpace(40);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLOURS.dark);
    pdf.text("Page weight & requests", M, y);
    y += 6;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLOURS.grayText);
    pdf.text(
      `Total: ${report.pageWeight.totalKB.toLocaleString()} KB across ${report.pageWeight.requestCount} HTTP requests.`,
      M,
      y
    );
    y += 6;
    report.pageWeight.byType.slice(0, 7).forEach((t) => {
      ensureSpace(5);
      pdf.setFontSize(9);
      pdf.text(t.label, M, y);
      pdf.text(
        `${t.sizeKB.toLocaleString()} KB · ${t.requests} req`,
        W - M,
        y,
        { align: "right" }
      );
      y += 4.5;
    });
    y += 4;
  }

  // Mobile vs Desktop
  if (report.desktopScores) {
    ensureSpace(40);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLOURS.dark);
    pdf.text("Mobile vs Desktop", M, y);
    y += 6;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLOURS.grayText);
    pdf.text(
      "Two independent Lighthouse runs. Google indexes mobile-first, so mobile scores matter most.",
      M,
      y
    );
    y += 6;
    const colW = (W - 2 * M) / 4;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLOURS.dark);
    ["Category", "Mobile", "Desktop", "Gap"].forEach((h, i) => {
      pdf.text(h, M + i * colW + (i === 0 ? 0 : colW / 2), y, {
        align: i === 0 ? "left" : "center",
      });
    });
    y += 5;
    pdf.setDrawColor(...COLOURS.grayBorder);
    pdf.line(M, y, W - M, y);
    y += 4;
    pdf.setFont("helvetica", "normal");
    const rows: Array<[string, keyof typeof report.scores]> = [
      ["Performance", "performance"],
      ["SEO", "seo"],
      ["Accessibility", "accessibility"],
      ["Best Practices", "bestPractices"],
    ];
    rows.forEach(([label, key]) => {
      const m = report.scores[key];
      const d = report.desktopScores?.[key];
      const gap = m !== null && d !== null && d !== undefined ? d - m : null;
      pdf.setTextColor(...COLOURS.dark);
      pdf.text(label, M, y);
      pdf.setTextColor(...scoreColour(m));
      pdf.setFont("helvetica", "bold");
      pdf.text(
        m === null ? "—" : String(m),
        M + colW + colW / 2,
        y,
        { align: "center" }
      );
      pdf.setTextColor(...scoreColour(d ?? null));
      pdf.text(
        d === null || d === undefined ? "—" : String(d),
        M + 2 * colW + colW / 2,
        y,
        { align: "center" }
      );
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(
        ...(gap === null
          ? (COLOURS.grayText as [number, number, number])
          : gap > 5
            ? COLOURS.fail
            : gap < -5
              ? COLOURS.pass
              : COLOURS.grayText)
      );
      pdf.text(
        gap === null ? "—" : `${gap > 0 ? "+" : ""}${gap}`,
        M + 3 * colW + colW / 2,
        y,
        { align: "center" }
      );
      y += 5.5;
    });
    y += 4;
  }

  // TTFB
  if (report.ttfbMs !== null) {
    ensureSpace(8);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLOURS.dark);
    pdf.text(`Time to First Byte (TTFB): `, M, y);
    pdf.setFont("helvetica", "normal");
    const colour =
      report.ttfbMs <= 600
        ? COLOURS.pass
        : report.ttfbMs <= 1500
          ? COLOURS.warn
          : COLOURS.fail;
    pdf.setTextColor(...colour);
    pdf.text(`${report.ttfbMs} ms`, M + 53, y);
    y += 6;
  }

  // ════════════════════════════════════════════════════════════════
  // PAGES 3+: Categorised checks
  // ════════════════════════════════════════════════════════════════
  const categories = Array.from(
    new Set(report.checks.map((c) => c.category))
  ).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const STATUS_PRIORITY = { fail: 0, warn: 1, info: 2, pass: 3 } as const;

  categories.forEach((cat) => {
    const items = report.checks
      .filter((c) => c.category === cat)
      .slice()
      .sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);
    if (items.length === 0) return;

    // Section header
    pdf.addPage();
    y = M;
    pdf.setFillColor(...COLOURS.dark);
    pdf.rect(0, 0, W, 14, "F");
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255, 255, 255);
    pdf.text(cat, M, 9);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(220, 220, 220);
    const pf = items.filter((c) => c.status === "pass").length;
    const wf = items.filter((c) => c.status === "warn").length;
    const ff = items.filter((c) => c.status === "fail").length;
    pdf.text(
      `${pf} pass · ${wf} warn · ${ff} fail · ${items.length} total`,
      W - M,
      9,
      { align: "right" }
    );
    y = 22;

    items.forEach((c) => {
      // each row needs ~ 16-30mm depending on detail/fix length — estimate
      pdf.setFontSize(9);
      const detailLines = wrap(c.detail, W - 2 * M - 18, 9);
      const fixLines = c.fix ? wrap(`Fix: ${c.fix}`, W - 2 * M - 18, 9) : [];
      const blockH =
        8 + detailLines.length * 4 + (fixLines.length > 0 ? fixLines.length * 4 + 2 : 0) + 4;
      ensureSpace(blockH + 2);

      // Status badge
      const badgeW = 14;
      const badgeH = 6;
      const badgeX = M;
      const badgeY = y;
      pdf.setFillColor(...STATUS_BG[c.status]);
      pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, "F");
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...STATUS_COLOUR[c.status]);
      pdf.text(STATUS_GLYPH[c.status], badgeX + badgeW / 2, badgeY + 4.3, {
        align: "center",
      });

      // Label
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...COLOURS.dark);
      pdf.text(c.label, badgeX + badgeW + 2, badgeY + 4.3);

      // Source tag (right-aligned)
      if (c.source) {
        const srcLabel = c.source.toUpperCase();
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLOURS.grayText);
        const srcW =
          (pdf.getStringUnitWidth(srcLabel) * 7) / pdf.internal.scaleFactor + 3;
        pdf.setFillColor(...COLOURS.grayLight);
        pdf.roundedRect(W - M - srcW, badgeY, srcW, badgeH, 1, 1, "F");
        pdf.text(srcLabel, W - M - srcW / 2, badgeY + 4.3, { align: "center" });
      }
      y += badgeH + 2;

      // Detail
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLOURS.grayText);
      detailLines.forEach((l) => {
        ensureSpace(4);
        pdf.text(l, M + 2, y);
        y += 4;
      });
      // Fix
      if (fixLines.length > 0) {
        y += 1;
        pdf.setTextColor(124, 58, 237); // purple-600
        fixLines.forEach((l) => {
          ensureSpace(4);
          pdf.text(l, M + 2, y);
          y += 4;
        });
      }
      // Row separator
      y += 1;
      pdf.setDrawColor(...COLOURS.grayBorder);
      pdf.setLineWidth(0.2);
      pdf.line(M, y, W - M, y);
      y += 3;
    });
  });

  // ════════════════════════════════════════════════════════════════
  // FINAL PAGE: Honest scope
  // ════════════════════════════════════════════════════════════════
  pdf.addPage();
  y = M;
  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLOURS.dark);
  pdf.text("Honest scope of this report", M, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLOURS.pass);
  pdf.text("What is real data in this report", M, y);
  y += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLOURS.grayText);
  const realLines = wrap(
    "Every score, vital, and check above is real data — measured by Lighthouse against your live URL, parsed from the page's HTML, your robots.txt, sitemap.xml, and a real HTTP request. The data source for each check is shown as a small badge: Lighthouse, Crawl, HTTP, Robots, or Sitemap. No fabricated numbers.",
    W - 2 * M,
    10
  );
  realLines.forEach((l) => {
    pdf.text(l, M, y);
    y += 5;
  });
  y += 4;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLOURS.warn);
  pdf.text("What we couldn't verify from the browser", M, y);
  y += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLOURS.grayText);
  const limits = [
    "HTTP security headers (HSTS, CSP, X-Frame-Options) — use securityheaders.com or Mozilla Observatory.",
    "TLS / SSL certificate quality — use SSL Labs (ssllabs.com/ssltest).",
    "Indexation status in Google — use Search Console's Coverage report.",
    "Structured-data rendering validity — use Google's Rich Results Test or validator.schema.org.",
    "Backlinks, Domain Authority, keyword rankings, traffic — require paid data providers (Ahrefs, Moz, Semrush). Any \"free\" tool that quotes those numbers is guessing.",
  ];
  limits.forEach((l) => {
    const lines = wrap(`• ${l}`, W - 2 * M, 10);
    lines.forEach((line) => {
      ensureSpace(5);
      pdf.text(line, M, y);
      y += 4.5;
    });
    y += 1;
  });

  // ── Stamp footers on every page ────────────────────────────────
  const total = pdf.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    pdf.setPage(p);
    drawFooter(p, total);
  }

  // Filename: domain + date for easy archiving
  const safeHost = (() => {
    try {
      return new URL(report.finalUrl).hostname.replace(/^www\./, "");
    } catch {
      return "site";
    }
  })();
  const stamp = report.generatedAt.slice(0, 10);
  pdf.save(`sabtools-seo-audit-${safeHost}-${stamp}.pdf`);
}
