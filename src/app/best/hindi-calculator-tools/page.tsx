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

const PAGE_URL = `${SITE_URL}/best/hindi-calculator-tools`;
const PAGE_TITLE = "Best Hindi Calculator Tools (2026) — हिंदी में फ्री कैलकुलेटर";
const PAGE_DESC = `A guide to the best free calculator tools available in Hindi — SabTools' ${BRAND.hindiTools}+ Hindi catalog plus genuine alternatives like Google Search Hindi, Indian government portals, Easy Hindi Typing, and select Android apps.`;

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
    name: "SabTools Hindi (हिंदी टूल्स)",
    url: `${SITE_URL}/hi`,
    internal: true,
    bestFor: `The widest Hindi calculator catalog on the open web — ${BRAND.hindiTools}+ tools across finance, tax, PDF, image, and text categories`,
    pros: [
      `${BRAND.hindiTools}+ tools localized into Hindi — labels, helper text, examples, FAQs all in Devanagari`,
      "EMI, GST, income tax, SIP, BMI, age, percentage, salary calculators all in Hindi",
      "PDF tools (compress, merge, split, image-to-PDF) with Hindi UI",
      "Hreflang configured correctly so Google serves /hi/... to Hindi search queries",
      "All processing client-side; no signup; works on budget Android phones",
    ],
    cons: [
      "Hindi UI is direct translation — some technical financial terms (e.g., 'EMI', 'CTC', 'PF') are kept in English where the Hindi equivalent isn't in common use",
      "OCR / handwriting recognition for Hindi script is harder than English (this affects scan-to-text tools across the entire industry, not just SabTools)",
    ],
  },
  {
    rank: 2,
    name: "Google Search (Hindi calculator queries)",
    url: "https://www.google.co.in/search?q=ईएमआई+कैलकुलेटर&hl=hi",
    internal: false,
    bestFor: "Quick one-shot calculations directly in the Google search results — no site visit needed",
    pros: [
      "Type 'ईएमआई कैलकुलेटर' into Google in Hindi mode and a calculator widget appears in results",
      "Works for basic loan, currency, and unit-conversion queries",
      "Zero load time — already on the search page",
    ],
    cons: [
      "Limited to a small set of calculation types — no GST, no Indian-specific tax slabs, no Hindi UI for the result breakdown",
      "Inconsistent across queries — 'गृह ऋण ईएमआई' may not trigger the widget",
      "No save/share functionality",
    ],
  },
  {
    rank: 3,
    name: "Indian government Hindi portals (Income Tax, EPFO, Aadhaar)",
    url: "https://www.incometax.gov.in/iec/foportal/hi",
    internal: false,
    bestFor: "Official tax-filing, EPF balance check, Aadhaar updates — anything where the answer must come from the source-of-truth",
    pros: [
      "Hindi versions are first-class citizens — same data as English, by law",
      "Authoritative for tax slabs, EPF interest rates, Aadhaar enrollment processes",
      "Free, no ads, no signup required for many functions",
    ],
    cons: [
      "Calculators are minimal — focused on filing, not modeling",
      "UI is dated even in English; Hindi version sometimes lags on minor updates",
      "Not a replacement for general-purpose calculators",
    ],
  },
  {
    rank: 4,
    name: "Easy Hindi Typing",
    url: "https://www.easyhindityping.com/",
    internal: false,
    bestFor: "Phonetic Hindi typing — type in Roman characters, get Devanagari output",
    pros: [
      "Long-running, trusted Hindi-typing tool",
      "Works in browser, no install",
      "Useful for users who haven't memorized the Devanagari keyboard layout",
    ],
    cons: [
      "Single-purpose — typing only, no calculators",
      "Not really comparable to a calculator suite — listed here because it's a frequent companion tool for Hindi web users",
    ],
  },
  {
    rank: 5,
    name: "WhatsApp Hindi formatter / typing keyboards",
    url: `${SITE_URL}/tools/whatsapp-formatter`,
    internal: true,
    bestFor: "Formatting Hindi text for WhatsApp business broadcasts and group communication",
    pros: [
      "SabTools' WhatsApp Formatter accepts Devanagari and preserves bold/italic/strikethrough syntax",
      "Useful for kirana shopkeepers, school teachers, and admin groups that broadcast in Hindi",
    ],
    cons: [
      "Adjacent to calculator tools, not a calculator itself",
      "Listed for completeness because it's a frequent Hindi-web use case",
    ],
  },
  {
    rank: 6,
    name: "Hindi-language Android calculator apps",
    url: "https://play.google.com/store/apps?q=hindi+calculator",
    internal: false,
    bestFor: "Offline use on a phone — pure-Hindi calculator apps from the Play Store",
    pros: [
      "Many free options on Play Store",
      "Genuinely offline — no browser, no data plan needed",
    ],
    cons: [
      "Quality varies wildly — some are heavy on ads, some collect personal data, some are malware",
      "Most are basic four-function calculators with Hindi labels — not feature-equivalent to a finance calculator suite",
      "App-store distribution friction (download, install, permissions) vs a web calculator that opens in one click",
    ],
  },
  {
    rank: 7,
    name: "Hindi Wikipedia calculator articles",
    url: "https://hi.wikipedia.org/",
    internal: false,
    bestFor: "Conceptual reference — understanding what an EMI/GST/SIP IS in Hindi, not calculating one",
    pros: [
      "Authoritative encyclopedic content in Hindi",
      "Free, no ads, no signup",
    ],
    cons: [
      "Not a calculator — conceptual reference only",
      "Hindi Wikipedia coverage of finance topics is thinner than English",
      "Listed because it's frequently the first Hindi search result for explanatory queries",
    ],
  },
];

const aboutFaqs = [
  {
    q: "What is the best Hindi calculator website?",
    a: `For breadth — EMI, GST, income tax, SIP, BMI, age, percentage, salary, PDF tools, image tools — SabTools' Hindi catalog at /hi has the widest selection on the open web with ${BRAND.hindiTools}+ tools. For one-off basic calculations, Google's Hindi search widgets work for simple queries. For tax filing specifically, the Income Tax Department's Hindi portal is the authoritative source.`,
  },
  {
    q: "Are SabTools' Hindi calculators the same as the English versions?",
    a: "Yes — same engine, same accuracy, same client-side privacy. The Hindi versions translate UI labels, examples, currency notation, and FAQs into Devanagari. Calculations themselves are identical to the English versions. Some technical loan/tax abbreviations (EMI, CTC, PF, GST, PAN) are kept in English where the Hindi equivalents are not in common use among Indian users.",
  },
  {
    q: "Is there a Hindi income tax calculator for FY 2025-26?",
    a: `Yes — SabTools publishes an income tax calculator in Hindi at /hi/tools/income-tax-calculator covering both old and new regimes for FY 2025-26 (AY 2026-27) with side-by-side comparison. The Income Tax Department's official Hindi portal also has a slab-rate reference, but it isn't a full calculator with deduction inputs.`,
  },
  {
    q: "क्या ये कैलकुलेटर मोबाइल पर चलते हैं? (Do these calculators work on mobile?)",
    a: "हाँ — SabTools Hindi tools mobile पर अच्छे से चलते हैं, चाहे आप budget Android फ़ोन पर हों या iPhone पर। पूरी website static है, इसलिए 2 GB RAM वाले फ़ोन पर भी एक सेकंड के अंदर लोड हो जाती है।",
  },
  {
    q: "Can I switch between Hindi and English versions of the same tool?",
    a: "Yes. Every tool with a Hindi version has a language switcher in the header. The English tool is at /tools/<slug> and the Hindi version is at /hi/tools/<slug>. Inputs and outputs flow between them — switch language without losing what you've typed (in most calculators).",
  },
  {
    q: "Are there Hindi PDF tools?",
    a: `Yes. SabTools publishes Hindi versions of PDF compress, merge, split, image-to-PDF, and PDF-to-image tools. Useful for users who need to upload documents to UIDAI's Hindi-language Aadhaar update portal, EPFO Hindi forms, or state government portals that demand specific KB-target compressions. International PDF tools (iLovePDF, Smallpdf) don't have Hindi UIs.`,
  },
  {
    q: "Why are some financial terms still in English on the Hindi tools?",
    a: "Because Indian Hindi-speaking users searching for these tools usually type the English term — 'EMI calculator', 'GST calculator', 'income tax calculator', 'SIP'. Translating EMI to 'समान मासिक किस्त' would be technically correct but would make the tool harder to find. We translate the surrounding UI, helper text, and examples into Hindi while keeping the search-discoverable terms in their familiar English forms.",
  },
  {
    q: "Are there Hindi versions of all SabTools' tools?",
    a: `${BRAND.hindiTools}+ of our ${BRAND.totalTools}+ tools have Hindi versions. The remaining tools — mostly developer utilities (JSON formatters, regex testers, Base64 encoders) and CSS generators — are kept English-only because their target users (Indian developers) work in English-language code editors. Translating these would add friction without serving real demand.`,
  },
];

export default function BestHindiCalculatorTools() {
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
      { name: "Hindi Calculator Tools" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Best Hindi Calculator Tools 2026",
      description:
        "Free calculator tools available in Hindi — comprehensive catalogs, government portals, search-engine widgets, single-purpose typing tools, and mobile apps.",
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
          { label: "Hindi Calculator Tools" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        Best Hindi Calculator Tools ({new Date().getFullYear()}) — हिंदी में फ्री कैलकुलेटर
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~8 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          The Indian Hindi-speaking internet — roughly half a billion users
          across UP, Bihar, MP, Rajasthan, Haryana, Jharkhand, Uttarakhand,
          Chhattisgarh, Delhi NCR, and the Hindi-belt diaspora — has been
          underserved by free online calculators for years. Most major
          finance and utility tool sites are English-only. We mapped seven
          places where Hindi calculator coverage actually exists, what each
          is good for, and where the gaps still are.
        </p>

        <p>
          Disclosure: this page is published by SabTools.in, which has the
          single largest Hindi calculator catalog at {BRAND.hindiTools}+
          tools. We have specifically called out where Google Search,
          government portals, and dedicated single-purpose tools are
          stronger for specific tasks. The category has so few apples-to-apples
          competitors that pretending otherwise wouldn't be useful.
        </p>

        <h2>Quick recommendation by use case</h2>
        <ul>
          <li>
            <strong>EMI, GST, income tax, SIP, BMI calculator in Hindi</strong>{" "}
            — <Link href="/hi">SabTools Hindi</Link> ({BRAND.hindiTools}+ tools).
          </li>
          <li>
            <strong>Quick rough calculation in a Hindi search query</strong>{" "}
            — Google Search widget (works for basic loan / unit conversion).
          </li>
          <li>
            <strong>Official tax slabs / EPF rates / Aadhaar processes</strong>{" "}
            — Indian government Hindi portals (incometax.gov.in/hi, epfindia.gov.in/hi).
          </li>
          <li>
            <strong>Phonetic Hindi typing</strong> — Easy Hindi Typing or
            Google Input Tools.
          </li>
          <li>
            <strong>Conceptual explanation in Hindi</strong> (what is EMI,
            what is SIP) — Hindi Wikipedia.
          </li>
        </ul>

        <h2>The full ranking</h2>
        <p>
          Scoring weighted breadth of tool coverage (40%), Hindi UI
          completeness — labels, helper text, examples, FAQs all
          translated, not just the title (30%), accuracy and authority
          (20%), and accessibility for budget Android users on slow
          connections (10%).
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

        <h2>Why Hindi calculator coverage matters</h2>
        <p>
          A small kirana owner in Lucknow calculating GST on a ₹4,500 invoice
          shouldn't have to think in English. A first-time home-loan applicant
          in Patna comparing ₹40 lakh loan EMIs across SBI and HDFC shouldn't
          have to translate "tenure" and "principal" mid-decision. A college
          student in Bhopal projecting NPS returns for retirement at age 60
          shouldn't have to fight an English UI to do basic math.
        </p>

        <p>
          The data backs the demand. Google Trends shows steady year-on-year
          growth in queries like "ईएमआई कैलकुलेटर हिंदी में", "जीएसटी
          कैलकुलेटर", "इनकम टैक्स कैलकुलेटर हिंदी", with the strongest
          regional concentration in UP, Bihar, MP, Rajasthan, and Haryana.
          Most are mobile queries. Most go unfulfilled — the top results
          are usually English calculators with a Hindi-keyword title and an
          English UI.
        </p>

        <h2>What's missing across the entire category</h2>
        <p>
          Even on the best Hindi calculator platforms, three things are
          weak industry-wide:
        </p>

        <ul>
          <li>
            <strong>Voice input in Hindi.</strong> No major calculator site
            currently lets users dictate "saat lakh ka home loan" and see
            it parsed into ₹7,00,000. This would be a meaningful
            accessibility upgrade for users uncomfortable with typing
            Devanagari numerals.
          </li>
          <li>
            <strong>Hindi handwriting OCR.</strong> Scanning a hand-written
            shop ledger or rent agreement in Hindi script and extracting
            text remains weaker than English OCR. This affects all
            scan-to-text tools across the industry.
          </li>
          <li>
            <strong>Regional Hindi variants.</strong> Awadhi, Bhojpuri,
            Maithili, Marwari speakers often switch to standard Khariboli
            Hindi for digital tools. Calculators that respect regional
            number-spelling conventions are a real gap.
          </li>
        </ul>

        <h2>SabTools' Hindi tool catalog — by category</h2>
        <p>
          The {BRAND.hindiTools}+ Hindi-localized tools span every major
          category. Some highlights:
        </p>

        <ul>
          <li>
            <strong>Finance:</strong>{" "}
            <Link href="/hi/tools/emi-calculator">EMI कैलकुलेटर</Link>,{" "}
            <Link href="/hi/tools/sip-calculator">SIP कैलकुलेटर</Link>,{" "}
            <Link href="/hi/tools/fd-calculator">FD कैलकुलेटर</Link>,{" "}
            home loan, car loan, compound interest.
          </li>
          <li>
            <strong>Tax:</strong>{" "}
            <Link href="/hi/tools/income-tax-calculator">इनकम टैक्स कैलकुलेटर</Link>,{" "}
            <Link href="/hi/tools/gst-calculator">GST कैलकुलेटर</Link>,{" "}
            HRA exemption, NPS, capital gains.
          </li>
          <li>
            <strong>PDF:</strong> Hindi UIs for compress, merge, split,
            image-to-PDF, and PDF-to-image — useful for users uploading
            documents to UIDAI / EPFO / state government portals.
          </li>
          <li>
            <strong>Health & lifestyle:</strong> BMI, calorie counter,
            water intake, age calculator (with Hindi date helpers).
          </li>
          <li>
            <strong>Education:</strong> CGPA to percentage, exam result
            calculators, GPA converters.
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
          For routine Hindi calculator needs — finance, tax, PDF, image,
          text — SabTools' Hindi catalog is the most comprehensive option
          on the open web. For one-off basic queries, Google's in-search
          widgets work. For authoritative tax filing or EPF balance lookups
          in Hindi, go to the source: the Income Tax Department's Hindi
          portal and EPFO's Hindi portal. For phonetic Hindi typing, the
          single-purpose tools (Easy Hindi Typing, Google Input Tools) win
          on focus.
        </p>

        <p className="not-prose mt-6">
          <Link
            href="/hi"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            Browse all {BRAND.hindiTools}+ Hindi tools on SabTools →
          </Link>
        </p>
      </div>
    </div>
  );
}
