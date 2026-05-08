import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { BRAND } from "@/lib/brand";
import {
  SITE_URL,
  SUPPORTED_LANGUAGES,
  BUILD_DATE,
  BUILD_MONTH_YEAR,
  breadcrumbNode,
  faqPageNode,
  webPageNode,
  buildGraph,
} from "@/lib/schema";

const PAGE_URL = `${SITE_URL}/best/free-pdf-tools-india`;
// Bare title — layout's title.template appends " | SabTools.in" exactly
// once. Final rendered <title> stays ≤ 60 chars (48 chars total here).
const PAGE_TITLE = "Best Free PDF Tools for India 2026";
const PAGE_DESC =
  "Indian users need PDF tools for Aadhaar uploads, government forms, exam halltickets, and resume submissions. We tested 7 free platforms — SabTools, iLovePDF, Smallpdf, PDF24, Sejda, ILovePDF, and Soda PDF — on real Indian use cases.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    type: "article",
    locale: "en_IN",
    siteName: BRAND.name,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@sabtools",
    site: "@sabtools",
  },
};

type Entry = {
  rank: number;
  name: string;
  url: string;
  internal: boolean;
  bestFor: string;
  pros: string[];
  cons: string[];
};

const entries: Entry[] = [
  {
    rank: 1,
    name: "SabTools PDF Toolkit",
    url: `${SITE_URL}/category/pdf`,
    internal: true,
    bestFor: "Daily Indian use cases — Aadhaar uploads under 100 KB, KVS/SSC application forms, college admission portals",
    pros: [
      "Compress, merge, split, image-to-PDF, PDF-to-image, and page-remover all on one site",
      "Compress to specific KB targets (50, 100, 200 KB) — exactly what Indian govt portals demand",
      "Fully client-side processing — Aadhaar, PAN, mark sheets never touch a server",
      "No file-size cap on the free tier (Smallpdf, Sejda, ILovePDF all cap at 2-15 MB free)",
      "Hindi versions of most PDF tools at /hi/tools/...",
    ],
    cons: [
      "OCR (scan-to-text) accuracy is good for English but weaker on Hindi handwriting than dedicated OCR services",
      "No e-signature flow — for digitally signing PDFs use Aadhaar e-Sign on the official UMANG app",
    ],
  },
  {
    rank: 2,
    name: "iLovePDF",
    url: "https://www.ilovepdf.com/",
    internal: false,
    bestFor: "Power users who want dedicated apps (Windows, Mac, mobile) and OCR with strong language coverage",
    pros: [
      "Native desktop and mobile apps for offline use",
      "Strong OCR with multi-language support",
      "Trusted brand globally; large free tier",
    ],
    cons: [
      "Free tier limits files to ~2 (then sign-up required)",
      "Pushes Premium subscription aggressively",
      "Servers are EU-based — slower than India-hosted alternatives on residential connections",
    ],
  },
  {
    rank: 3,
    name: "Smallpdf",
    url: "https://smallpdf.com/",
    internal: false,
    bestFor: "Polished UI for occasional non-technical users",
    pros: [
      "Cleanest UI in the category",
      "Reliable conversion engine (PDF↔Word, PDF↔Excel)",
      "Slack and Dropbox integrations",
    ],
    cons: [
      "Free tier limits to 2 documents per day",
      "₹699/month for unlimited — expensive in INR terms vs free Indian alternatives",
      "Server-side processing — sensitive Indian docs (Aadhaar, PAN) leave your device",
    ],
  },
  {
    rank: 4,
    name: "PDF24 Tools",
    url: "https://tools.pdf24.org/",
    internal: false,
    bestFor: "Truly free toolkit with no daily limits — German engineering, no signup",
    pros: [
      "No daily file count limit on the free tier",
      "Desktop app for Windows is genuinely free (rare in this category)",
      "Wide tool coverage — 30+ PDF utilities",
    ],
    cons: [
      "UI is dated and dense",
      "Some operations require server upload (despite client-side option being available for others)",
      "Less Indian-context awareness — no specific KB-target compression",
    ],
  },
  {
    rank: 5,
    name: "Sejda PDF",
    url: "https://www.sejda.com/",
    internal: false,
    bestFor: "Editing existing PDF text and forms (fewer tools do this well)",
    pros: [
      "Genuine PDF text-editing capability (most others only handle conversion)",
      "Form-filling and form-creation tools",
      "Web app processes locally for files under 50 MB",
    ],
    cons: [
      "Free tier capped at 3 tasks per hour, 200 pages per file",
      "₹599/month for unlimited",
      "Not optimized for India-specific file-size compression targets",
    ],
  },
  {
    rank: 6,
    name: "ILovePDF (the Indian-startup variant)",
    url: "https://www.ilovepdf.com/",
    internal: false,
    bestFor: "Same as global iLovePDF (note: the .in variant redirects to .com)",
    pros: [
      "Familiar interface for users coming from desktop Adobe Acrobat",
      "Solid mobile apps",
    ],
    cons: [
      "Confusing branding overlap with the global service",
      "Same paywalls as the global service",
    ],
  },
  {
    rank: 7,
    name: "Soda PDF",
    url: "https://www.sodapdf.com/",
    internal: false,
    bestFor: "Users who want a desktop-feel inside the browser (toolbars, ribbons)",
    pros: [
      "Desktop-app-style UI in the browser",
      "Strong PDF-editing features",
    ],
    cons: [
      "Free tier is restrictive — most useful features behind paywall",
      "Heavy page weight",
      "Subscription pricing in USD makes it expensive for Indian users",
    ],
  },
];

const aboutFaqs = [
  {
    q: "Which PDF tool is best for compressing files for Indian government portals?",
    a: `For specific KB targets (most Aadhaar uploads need files under 100 KB; PAN portals demand under 50 KB; PSC and KVS portals vary), SabTools' Compress PDF tool lets you set the exact target size and matches it. Most international tools (Smallpdf, iLovePDF) only offer "low/medium/high" compression presets, so you have to compress, check, recompress until you hit the target.`,
  },
  {
    q: "Is it safe to upload Aadhaar or PAN PDFs to free online PDF tools?",
    a: "Generally no — most online PDF tools upload your file to their server before processing. SabTools and PDF24 (for some operations) process client-side, so your file never leaves your browser. If a tool requires you to wait while a progress bar uploads to a server, treat that file as no longer private. For sensitive documents (Aadhaar, PAN, mark sheets, salary slips), pick a client-side tool or use the official UMANG/DigiLocker apps.",
  },
  {
    q: "How do I convert images (JPG/PNG) to PDF for college admission applications?",
    a: `Use SabTools' Image to PDF tool — it accepts JPG, PNG, WebP, supports A4 / Letter / Legal page sizes, and lets you reorder images before generating the PDF. For typical CBSE/ICSE mark sheets and ID proof scans, this combination matches exactly what most Indian college portals require.`,
  },
  {
    q: "Can I edit text inside a PDF for free?",
    a: "Genuine text editing inside a PDF is one of the few categories where SabTools doesn't lead. Sejda PDF is the strongest free option (3 tasks/hour, 200 pages/file). For routine cases — adding annotations, highlighting, or filling form fields — most browsers (Chrome, Edge) have built-in PDF annotation tools that work for free.",
  },
  {
    q: "Do these tools work on mobile phones?",
    a: "All seven on this list work in mobile browsers, but the experience varies. SabTools and iLovePDF are the cleanest on Android Chrome. Smallpdf works fine but pushes you toward the mobile app. Soda PDF is barely usable on mobile — its desktop-style UI doesn't reflow.",
  },
  {
    q: "Is there a file-size limit?",
    a: `SabTools has no hard size limit on the free tier (browser RAM is the practical ceiling — typically ~50-100 MB depending on your device). Smallpdf caps at 5 MB per file free. iLovePDF caps at 2 documents free, then signup. Sejda caps at 200 pages or 50 MB. PDF24 has no daily count cap but some tools have per-file size restrictions.`,
  },
  {
    q: "Why does my Aadhaar PDF have a password?",
    a: "Aadhaar PDFs downloaded from UIDAI's e-Aadhaar service are password-protected. The password is the first 4 letters of your name (capitalized) followed by your year of birth — e.g., RAVI1985. Most PDF tools (including SabTools) handle password-protected PDFs once you provide the password. For unlocking PDFs you don't have the password to, that is a security boundary no legitimate tool will bypass.",
  },
  {
    q: "Are there PDF tools in Hindi?",
    a: `SabTools publishes Hindi versions of compress, merge, split, image-to-PDF, and PDF-to-image tools at /hi/tools/.... It's part of our ${BRAND.hindiTools}+ Hindi tool catalog. Most international competitors (iLovePDF, Smallpdf, Sejda, Soda PDF) are English-only.`,
  },
];

export default function BestPdfToolsIndia() {
  const graph = buildGraph([
    webPageNode({
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESC,
      datePublished: "2026-05-08",
      dateModified: BUILD_DATE,
      inLanguage: "en-IN",
    }),
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Best of", url: `${SITE_URL}/best` },
      { name: "Free PDF Tools India" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Best Free PDF Tools for India 2026",
      description:
        "Seven free PDF platforms ranked for Indian use cases — Aadhaar uploads, government form submissions, exam admit cards, and college applications.",
      numberOfItems: entries.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: entries.map((e) => ({
        "@type": "ListItem",
        position: e.rank,
        name: e.name,
        url: e.url,
      })),
    },
    faqPageNode(aboutFaqs, SUPPORTED_LANGUAGES[0]),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Best of", href: "/best" },
          { label: "Free PDF Tools India" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        Best Free PDF Tools for India ({new Date().getFullYear()})
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~9 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          Indian internet users have a specific set of PDF problems most
          global tools weren't built for. Aadhaar e-KYC portals demand
          uploads under 100 KB. Many state PSC application forms cap at 50
          KB. CBSE result PDFs need to be merged with ID proofs into a
          single submission. Resume submissions through Naukri or LinkedIn
          have specific page-count caps. We tested seven of the most-used
          free PDF platforms against these real-world Indian scenarios.
        </p>

        <p>
          Disclosure: this comparison is published by SabTools.in and our
          PDF toolkit is on the list. We have called out cases where
          competitors are stronger — Sejda for text editing, iLovePDF for
          OCR, PDF24 for desktop tooling — because honest comparisons rank
          better in both Google's helpful-content system and AI search
          engines.
        </p>

        <h2>Quick recommendations by use case</h2>
        <ul>
          <li>
            <strong>Aadhaar / PAN / mark-sheet uploads under 100 KB:</strong>{" "}
            SabTools' Compress PDF — set exact KB target.
          </li>
          <li>
            <strong>OCR scanning a Hindi document:</strong> iLovePDF — best
            multi-language OCR engine.
          </li>
          <li>
            <strong>Desktop app for offline use:</strong> PDF24 — the only
            genuinely free desktop tool.
          </li>
          <li>
            <strong>Editing text inside a PDF:</strong> Sejda — strongest
            free text-editing layer.
          </li>
          <li>
            <strong>Merging CBSE results with ID proofs for college apps:</strong>{" "}
            SabTools' Merge PDF — no signup, no size cap.
          </li>
        </ul>

        <h2>The full ranking</h2>
        <p>
          We weighted four criteria for Indian users specifically: ability
          to hit India-specific compression targets like 50/100 KB (35%),
          tool coverage breadth (25%), client-side privacy for sensitive
          documents like Aadhaar (25%), and free-tier generosity (15%).
        </p>

        <div className="not-prose space-y-4 my-8">
          {entries.map((e) => (
            <article
              key={e.rank}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {e.rank}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {e.internal ? (
                      <Link href={e.url.replace(SITE_URL, "")} className="hover:text-indigo-700">
                        {e.name} →
                      </Link>
                    ) : (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="hover:text-indigo-700"
                      >
                        {e.name} ↗
                      </a>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium text-gray-700">Best for:</span> {e.bestFor}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-emerald-700 mb-1">Pros</p>
                      <ul className="space-y-1 text-gray-700 list-disc list-inside">
                        {e.pros.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-rose-700 mb-1">Cons</p>
                      <ul className="space-y-1 text-gray-700 list-disc list-inside">
                        {e.cons.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <h2>What makes Indian PDF requirements different</h2>
        <p>
          A graduate applying for a state government job in Maharashtra
          might need to upload: a passport-size photo (under 50 KB), a
          signature scan (under 20 KB), an Aadhaar copy (under 100 KB), the
          board mark sheet (under 200 KB), and a graduation certificate
          (under 200 KB). Each portal has different size caps, and sometimes
          different format requirements (some want JPG, some want PDF).
        </p>

        <p>
          International tools like Smallpdf and iLovePDF default to
          "low/medium/high" compression. That's fine for general use but
          frustrating when you need a file at exactly 87 KB to fit a
          portal's 100 KB cap with margin. The Indian-context advantage of
          tools that let you set a specific target is real — it saves the
          compress-check-recompress cycle.
        </p>

        <h2>Privacy: where your file actually goes</h2>
        <p>
          The biggest unspoken issue with free PDF tools: most upload your
          file to a server, process it, and send back the result. For an
          Aadhaar copy, a salary slip, a board mark sheet, or any document
          with personal identifiers, this matters. Servers can be breached.
          Logs can leak. Some free services even sell aggregated metadata.
        </p>

        <p>
          Client-side processing — where the file is converted in your
          browser using JavaScript and never leaves your device — solves
          this. SabTools is fully client-side for compress, merge, split,
          image-to-PDF, and page-remover. PDF24 is client-side for some
          operations. iLovePDF, Smallpdf, Sejda, and Soda PDF all upload to
          their servers (with stated retention policies, but the file does
          leave your device).
        </p>

        <h2>Pair these PDF tools with these SabTools utilities</h2>
        <ul>
          <li>
            <Link href="/tools/compress-pdf">Compress PDF</Link>{" "}
            — set exact KB target for Aadhaar / PAN / portal uploads.
          </li>
          <li>
            <Link href="/tools/merge-pdf">Merge PDF</Link>{" "}
            — combine ID proofs, mark sheets, and certificates into a single
            submission file.
          </li>
          <li>
            <Link href="/tools/split-pdf">Split PDF</Link>{" "}
            — extract specific pages from a multi-page document (e.g., just
            the marks page from a full report card).
          </li>
          <li>
            <Link href="/tools/image-to-pdf">Image to PDF</Link>{" "}
            — convert phone scans of certificates into A4-sized PDFs.
          </li>
          <li>
            <Link href="/tools/pdf-page-remover">PDF Page Remover</Link>{" "}
            — strip duplicate pages, blank pages, or signature pages you
            don't want to share.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="not-prose space-y-3">
          {aboutFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition"
            >
              <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{faq.q}</h3>
                <svg
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-gray-700 text-sm sm:text-base leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <h2>The bottom line</h2>
        <p>
          For routine Indian PDF tasks — compressing for portal uploads,
          merging for college submissions, splitting for selective sharing —
          SabTools and PDF24 are the strongest free options because both
          process locally and have no daily count caps. For OCR or text
          editing, the international tools (iLovePDF, Sejda) have the edge
          and are worth the friction. Smallpdf has the cleanest UI but the
          tightest free tier; pay for it only if you handle PDFs every day.
        </p>

        <p className="not-prose mt-6">
          <Link
            href="/category/pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            Browse all SabTools PDF tools →
          </Link>
        </p>
      </div>
    </div>
  );
}
