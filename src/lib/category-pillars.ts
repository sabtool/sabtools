/**
 * Category pillar content (Advanced SEO Strategy, Section 3.3).
 *
 * Each entry lifts the category page from a thin "intro + tool grid" into a
 * substantive 800-1,200-word topic pillar — the pattern Google now rewards
 * for tool-hub sites (report §1.3 and §3.3).
 *
 * Categories without an entry here fall back to the existing short
 * description rendered by category/[slug]/page.tsx. We intentionally do NOT
 * auto-generate pillar text for every category — filler content would
 * trigger the Helpful Content demotion it is meant to avoid. Only the
 * top-priority tool-rich categories get full pillars; thinner categories
 * keep the existing short-form content until bandwidth allows a proper
 * human-edited rewrite.
 */

export interface CategoryPillar {
  whatIs: string;
  keyFeatures: { title: string; description: string }[];
  useCases: { title: string; description: string }[];
  howToChoose: string;
  indianContext: string;
  pillarFaqs: { q: string; a: string }[];
}

export const categoryPillars: Record<string, CategoryPillar> = {
  // ──────────────────────────────────────────────────────────────────────
  // 1. Finance Calculators — 29 tools
  // ──────────────────────────────────────────────────────────────────────
  finance: {
    whatIs:
      "Finance calculators are purpose-built tools that apply the exact mathematical formulas used by Indian banks, mutual funds, and the Income Tax Department to questions like: what will my EMI be, how much wealth will this SIP build over 20 years, and which tax regime leaves me with more money in hand. Each tool on SabTools.in implements the underlying formula directly in your browser — there is no server-side black box, no hidden fees, and no account required. The goal is to give you the same answer your bank's relationship manager would give, without the sales pressure and without sharing your financial details with any third party.",
    keyFeatures: [
      {
        title: "Bank-accurate EMI formulas",
        description:
          "EMI, home loan, car loan, and personal loan calculators use the standard reducing-balance formula P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1) that every major Indian bank applies. Rates and tenures follow current RBI benchmarks.",
      },
      {
        title: "SIP, lumpsum and goal planning",
        description:
          "Mutual fund SIP calculators compound monthly with an annual step-up option, matching what AMC websites show. Goal planners work backwards from your target corpus to the monthly SIP required.",
      },
      {
        title: "Tax regime comparison",
        description:
          "Income tax calculators compare the old regime (with 80C, HRA, home loan interest deductions) against the new regime side by side, including the latest FY 2025-26 slabs and 87A rebate changes.",
      },
      {
        title: "PPF, EPF, NPS projections",
        description:
          "Small-savings calculators use the current Ministry of Finance interest rates (7.1% for PPF, 8.25% for EPF) and show year-wise growth, maturity value, and the tax-free corpus at withdrawal.",
      },
    ],
    useCases: [
      {
        title: "Buying your first home in a tier-1 city",
        description:
          "Compare EMI on a ₹60 lakh loan at 8.5% over 20 years vs 30 years, see how a 20% down payment changes the monthly outflow, and check how much you save by prepaying ₹5 lakh in year three. The Stamp Duty Calculator factors in state-specific rates for Maharashtra, Karnataka, Delhi, and every other Indian state.",
      },
      {
        title: "Starting a ₹5,000 monthly SIP at age 25",
        description:
          "The SIP calculator shows you the ₹1.8 crore corpus a 12% CAGR would build by age 55 — and how much that becomes (₹3.2 crore) if you increase the SIP by 10% every year. Use the Lumpsum vs SIP comparison when you get an annual bonus.",
      },
      {
        title: "Salaried employee choosing a tax regime",
        description:
          "If you pay ₹24,000/month rent, have a ₹1.5 lakh 80C investment, and earn ₹14 lakh CTC, the comparison calculator will tell you in seconds which regime saves you more — and by how much. Change any input to re-run the comparison instantly.",
      },
      {
        title: "Retirement corpus planning",
        description:
          "The retirement corpus calculator adjusts for inflation (typically 6-7% in India), computes the inflation-adjusted monthly expense at 60, and works backwards to the SIP amount needed. Combine it with the NPS calculator to estimate your Tier I + Tier II annuity payout.",
      },
    ],
    howToChoose:
      "Start with the outcome you want. If you are buying — EMI and stamp duty calculators. If you are investing — SIP, mutual fund, and CAGR calculators. If you are filing taxes — income tax comparison, HRA, and rent receipt tools. Most tools are linked to each other at the bottom of each page, so a home loan user naturally lands on stamp duty next, then property capital gains. We deliberately avoid locking calculators behind registration because the best financial decision is often one you want to verify three times before acting on.",
    indianContext:
      "Every finance tool on SabTools.in is calibrated for the Indian context: amounts are formatted in lakhs and crores (not millions), interest rates default to current Indian benchmarks, financial years run April to March, and tax calculators handle both FY 2024-25 and FY 2025-26 rules including the standard deduction increase, the revised 87A rebate ceiling, and the new-regime slab restructuring from Budget 2024. The stamp duty tool supports all 28 states and 8 union territories with the latest circle-rate-based charges. Nothing is US-centric, Western-oriented, or a translation of an international tool — every formula and every default reflects how Indian banks, AMCs, and tax authorities actually compute.",
    pillarFaqs: [
      {
        q: "Are the EMI results the same as what my bank will quote?",
        a: "Yes, within rupee-level precision. Banks use the same reducing-balance formula the calculator implements. Small differences (typically under ₹50/month) can arise from how banks round the first or last installment, or from processing fees they fold into the EMI. The absolute interest payable over the full tenure will match.",
      },
      {
        q: "Should I choose the old or new tax regime?",
        a: "Run both through the Income Tax Calculator with your actual numbers. As a rule of thumb, the old regime usually wins when your combined deductions (80C + HRA + home loan interest + 80D) exceed about ₹3.5 lakh per year. The new regime tends to win for early-career employees with fewer deductions or anyone who has moved to a fully digital investment setup without traditional 80C instruments.",
      },
      {
        q: "How accurate is the SIP calculator for real mutual fund returns?",
        a: "The formula itself is exact. What no calculator can predict is the actual future return rate — it assumes a constant annual growth rate (CAGR) you specify. Use 10-12% for conservative projections on diversified equity mutual funds, 8% for hybrid funds, and the current rate for debt funds. Real returns will be lumpier year to year, but over 10+ year horizons the average usually converges to the CAGR assumption.",
      },
      {
        q: "Can I use these calculators for business loans and startup funding?",
        a: "EMI, working capital, and loan comparison calculators apply equally well to MSME loans, Mudra loans, and Stand Up India loans — the underlying math is identical. For startup equity dilution, ESOP valuation, or cap-table modelling, you will need specialised tools; those are on the roadmap but not yet live.",
      },
      {
        q: "Do you store my income or loan details?",
        a: "No. Every calculator runs entirely in your browser using client-side JavaScript. The numbers you type never touch any server, are never logged, and never leave your device. You can verify this by opening browser DevTools and watching the Network tab while you use the calculator — there is no outgoing request with your inputs.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Image Tools — 45 tools
  // ──────────────────────────────────────────────────────────────────────
  image: {
    whatIs:
      "Image tools on SabTools.in compress, resize, crop, convert, and edit image files directly in your browser using the Canvas and WebAssembly APIs — no file is ever uploaded to a server. That architecture matters for two reasons. First, it is the only way to process private documents (Aadhaar card scans, passport photos, salary slips, medical prescriptions) without exposing them to someone else's infrastructure. Second, it is dramatically faster: a 5 MB photo compresses in under a second instead of the 15-20 seconds a typical cloud service takes after upload, processing, and re-download.",
    keyFeatures: [
      {
        title: "Zero-upload processing",
        description:
          "Every image stays on your device. The browser does the full pipeline — decode, transform, re-encode — using standard Web APIs. You can literally disconnect from the internet after the page loads and the tools still work.",
      },
      {
        title: "Web Worker performance",
        description:
          "Heavy compression runs on a background thread via OffscreenCanvas, so the UI stays responsive even on mid-range Android devices while a 20 MB photo compresses.",
      },
      {
        title: "Indian government form presets",
        description:
          "One-click presets for the exact dimensions and file-size caps required by UPSC, SSC, banking exam, passport, and Aadhaar application photo uploads. No guessing whether 35×45 mm is the right size — we ship the preset.",
      },
      {
        title: "Modern format conversion",
        description:
          "Convert to and from JPEG, PNG, WebP, and AVIF. WebP typically reduces file size by 30-40% at the same visible quality; AVIF can shave another 20-30% on top of that.",
      },
    ],
    useCases: [
      {
        title: "Submitting a government exam application",
        description:
          "UPSC, SSC, NEET, JEE, and state PSC portals reject photos that are the wrong size or format. Use the Passport Photo Maker preset to get exactly 3.5 × 4.5 cm at 200 DPI, then the Image Compressor to push the file under the typical 20 KB cap — all without leaving your device.",
      },
      {
        title: "Uploading to WhatsApp Business catalog",
        description:
          "WhatsApp Business catalog has a 5 MB product image limit. The Image Compressor trims typical 4000×3000 photos down to ~600 KB at 90% quality — small enough to upload reliably even on a 2G connection, while staying sharp on modern phone screens.",
      },
      {
        title: "Compressing documents for online GST / income tax filing",
        description:
          "GSTN and the Income Tax e-filing portal accept PDFs up to 5 MB and image files up to specific per-file limits. Convert scanned receipts and invoices from PNG to JPEG at 85% quality, reducing file size by 70-80% while keeping all text legible.",
      },
      {
        title: "Social media content for Indian audiences",
        description:
          "Instagram crops, Twitter banners, LinkedIn cover photos, YouTube thumbnails — each platform has a specific aspect ratio. The Social Media Image Resizer ships with every current 2026 platform preset, so you do not have to look up dimensions.",
      },
    ],
    howToChoose:
      "For reducing file size without visibly changing the image — use Image Compressor. For changing width and height — Image Resizer. For matching a specific aspect ratio (say, a square profile picture from a portrait) — Image Cropper. For switching file types — Image Format Converter. For batch operations — Bulk Image Resizer. Most users need two or three of these tools in sequence (compress, then resize, then convert); the related-tools section at the bottom of each page suggests the most common pairings.",
    indianContext:
      "Indian government portals, exam authorities, and banking institutions have some of the strictest image-upload requirements in the world — specific DPI, specific file size caps (often under 50 KB), specific aspect ratios, and often a choice between JPG and JPEG that differs portal to portal. Our presets encode the actual current specifications from UPSC, SSC, IBPS, NEET, JEE, PAN card applications, Aadhaar updates, and passport renewal portals. For regional bank KYC uploads, the Passport Photo Maker and Signature Scanner handle the sign-on-white-paper requirement that almost every Indian bank follows. If a Central Government or State Government portal changes its specs, we update the preset within a few weeks.",
    pillarFaqs: [
      {
        q: "Is it really safer than using an online image compressor?",
        a: "Substantially. Cloud image compressors upload your file to their server, run processing, and send it back. During that round trip, your image exists in logs, caches, CDN edge nodes, and potentially in backups. SabTools.in never uploads anything — the file never leaves your browser tab. For sensitive documents like Aadhaar cards, PAN cards, or passport scans, that matters.",
      },
      {
        q: "How small can I compress a photo without ruining it?",
        a: "For photos intended for web use, 70-80% JPEG quality is almost indistinguishable from the original to the human eye and usually cuts file size by 60-75%. For government form uploads requiring under 20 KB, the Passport Photo Maker + 50% JPEG quality setting is the usual path. AVIF format at 60% quality can match JPEG at 80% quality but at roughly half the file size.",
      },
      {
        q: "Why does the compressed file sometimes end up bigger?",
        a: "Happens most often when you compress a PNG to JPEG with the quality slider at 95% or higher. PNG is lossless, so re-encoding at near-perfect quality introduces overhead without shedding much data. Either keep PNG (for screenshots, logos, text-heavy images) or drop JPEG quality to 80-85%.",
      },
      {
        q: "Do the tools work offline once the page loads?",
        a: "Yes, after the initial page load, all image tools work without an internet connection. Installing SabTools.in as a PWA (Progressive Web App) from your browser's 'Add to Home Screen' option makes this permanent — you get an offline-first image toolkit on your phone.",
      },
      {
        q: "Can I batch-process multiple images at once?",
        a: "The Bulk Image Resizer accepts multiple files and outputs them as a ZIP. For batch compression specifically, the Image Compressor supports drag-and-drop of up to 20 images at once; each is processed in parallel using a Web Worker so a batch of 20 completes in roughly the time one would take on the main thread.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. AI Writing Tools — 50 tools
  // ──────────────────────────────────────────────────────────────────────
  ai: {
    whatIs:
      "AI writing tools generate drafts of content — blog posts, emails, social captions, product descriptions, bios, cover letters — from a short brief you provide. On SabTools.in each tool is a specific use case with a tuned prompt template, so you do not need to know how to prompt an LLM to get a useful draft. You type what you want (topic, audience, tone), the tool generates a draft in a few seconds, and you edit it into your own voice. The point is speed to a first draft — not to replace your judgement about the final copy.",
    keyFeatures: [
      {
        title: "Purpose-tuned prompts",
        description:
          "Every tool ships with a prompt template refined for its specific output: an email writer that knows the difference between a formal request and a casual follow-up, a cover letter generator that asks for the job title and company, a bio generator that handles LinkedIn vs Twitter voice differently.",
      },
      {
        title: "Indian context-aware",
        description:
          "Cover letters understand the Indian hiring landscape (mention of CTC, notice period, relocation). Wedding speech generators know Indian wedding formats. Business letter templates default to Indian formal conventions.",
      },
      {
        title: "Multiple tone options",
        description:
          "Each tool offers tone toggles — professional, casual, persuasive, empathetic, humorous — so you can match the audience without reworking prompts.",
      },
      {
        title: "No sign-up or credit limits",
        description:
          "Use each tool as often as you need. There is no daily cap, no subscription tier, and no watermark on output.",
      },
    ],
    useCases: [
      {
        title: "Drafting a cold outreach email for sales",
        description:
          "Start with the AI Cold Email Generator, feed it the recipient's role and the pain point you solve. The tool produces a 5-6 line draft with a subject line, opener, value prop, and a soft call to action. Edit for voice, personalise the opener, and send.",
      },
      {
        title: "Writing a LinkedIn bio after a promotion",
        description:
          "The Bio Generator takes your current role, previous 2 roles, and 3-4 skill areas and produces a 3-variant LinkedIn summary. Pick the variant closest to your voice, tweak the opener, and update LinkedIn in under 10 minutes.",
      },
      {
        title: "Cover letter for a job you actually care about",
        description:
          "Paste the job description into the AI Cover Letter Generator, add your top 3 matching skills and one quantified accomplishment, and the tool produces a one-page letter matching the tone of the posting. Use it as a scaffold — rewrite the opener and closing in your own voice.",
      },
      {
        title: "Blog post outlines and article ideas",
        description:
          "The AI Blog Title Generator produces 15-20 title candidates from a topic; the Article Outline Generator takes the chosen title and gives you an H2/H3 structure. That outline gets you out of the staring-at-a-blank-page phase, which is usually where an article dies.",
      },
    ],
    howToChoose:
      "Pick the tool whose output type matches exactly what you need to produce. Writing an email? Cold Email or Follow-Up Email, not Article Outline. Writing a bio? Bio Generator, not Cover Letter. The specific tool's prompt template will outperform a generic 'AI writer' because it asks the right questions upfront. For anything longer than about 500 words, combine two tools — first the Outline Generator, then the appropriate content generator for each section.",
    indianContext:
      "Generic AI writing tools default to American conventions — the 'Dear Sir/Madam' salutation, date in MM/DD/YYYY, US business idioms, and absent any awareness of Indian cultural contexts like wedding speeches, festival greetings, or government letter conventions. Our tools are prompted for Indian norms: dates in DD/MM/YYYY, 'Respected Sir/Madam' remains an acceptable formal opener, wedding tools know what a haldi speech is, and business letter generators format addresses in the Indian convention (House No → Area → City → PIN). The result is a first draft that needs less India-specific editing than what a generic LLM produces.",
    pillarFaqs: [
      {
        q: "Does this actually use AI or is it just templates?",
        a: "Real AI — the tools send your inputs to a large language model API and return its response. What makes our tools different from raw ChatGPT is that the prompt is pre-engineered for the specific use case. You do not need to know how to prompt an LLM; you just fill in a form.",
      },
      {
        q: "Is the output plagiarism-free and original?",
        a: "Each generation produces original text — the same inputs rarely produce identical outputs across runs. However, like any LLM output, it may be stylistically similar to common patterns. If you need content for academic submission or a customer-facing publication, always edit in your own voice — both for originality and because drafts always need editing for specific facts.",
      },
      {
        q: "Will Google penalise my site if I publish AI-generated content?",
        a: "Google's stated policy (reiterated through 2025-2026) is that AI-generated content is not itself a ranking signal. What matters is quality: does the content demonstrate expertise, provide information gain, and actually help the reader? AI drafts that are published unedited will usually fail those criteria. AI drafts used as a scaffold, then extensively edited and enriched with your expertise, are treated the same as human-only content.",
      },
      {
        q: "Can I use this to write confidential business emails?",
        a: "The inputs you type are sent to the AI model API. For anything genuinely confidential — legal strategy, competitive M&A communications, salary negotiation emails with actual numbers — do not paste confidential content. Use the tool for the structural draft with placeholder values, then fill in the actual sensitive details offline.",
      },
      {
        q: "Why are there so many variations of similar tools?",
        a: "Because the prompts make the difference. A 'blog title generator' tuned for tech articles produces substantially better titles than one tuned for cooking blogs. We ship separate tools rather than one generic 'content writer' so the prompt is always specific to the output you need.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Developer Tools — 22 tools
  // ──────────────────────────────────────────────────────────────────────
  developer: {
    whatIs:
      "Developer tools on SabTools.in handle the small but frequent tasks that fill every working day for software engineers: format a JSON response, decode a Base64 string, test a regular expression, generate an MD5 hash for a file name, or validate that a webhook payload matches a schema. Each tool processes the input entirely on the client — because developer inputs often include API keys, tokens, user PII, or proprietary code, and sending those to a third-party server is exactly the kind of compliance problem that costs careers.",
    keyFeatures: [
      {
        title: "Client-side everything",
        description:
          "No input ever leaves your browser. JSON you are debugging stays on your device; JWTs you are decoding never touch our infrastructure; Base64 blobs are processed locally. Safe to use with production credentials.",
      },
      {
        title: "Handles large inputs",
        description:
          "JSON formatter processes documents up to 10 MB+ without lag. Hash generators handle multi-megabyte inputs. Regex tester benchmarks pattern performance on inputs up to 1 MB.",
      },
      {
        title: "Syntax highlighting and error detection",
        description:
          "Formatters show exactly where your JSON is malformed, which bracket is unmatched, which quote is unclosed. Error positions map to line and column numbers.",
      },
      {
        title: "Copy-paste ergonomics",
        description:
          "Every output has a one-click copy. Keyboard shortcuts work where expected (Cmd/Ctrl+A to select all, Cmd/Ctrl+Enter to run, Escape to clear).",
      },
    ],
    useCases: [
      {
        title: "Debugging a malformed JSON API response",
        description:
          "Paste the raw response into JSON Formatter. If it is valid, you get a readable pretty-printed output with syntax highlighting. If not, the tool shows you the exact line and column where parsing failed — usually a trailing comma, an unquoted key, or an unescaped quote inside a string.",
      },
      {
        title: "Decoding a JWT to inspect claims",
        description:
          "JWTs are Base64URL-encoded JSON. Paste the full token into the JWT Decoder to see the header, payload claims (user ID, scopes, expiration), and signature. Useful for debugging auth issues without a full OAuth playground.",
      },
      {
        title: "Generating a stable ID for cache keys",
        description:
          "Hash generators (MD5, SHA-1, SHA-256, SHA-512) produce deterministic IDs from arbitrary inputs. Useful for computing a cache key from a URL, generating a stable identifier from a user email, or verifying a file's integrity against a known hash.",
      },
      {
        title: "Testing a regex before committing to code",
        description:
          "The Regex Tester runs your pattern against sample inputs in real time, highlighting matches, capture groups, and showing the total number of matches. Supports all JavaScript regex flags (g, i, m, s, u, y) and reports on catastrophic backtracking risk for pathological patterns.",
      },
    ],
    howToChoose:
      "For data-format problems — JSON, XML, CSV, YAML — pick the formatter/validator for that format. For encoding problems — Base64, URL encoding, HTML entities — pick the specific encoder/decoder. For content hashing — MD5 for non-cryptographic dedup, SHA-256 for anything security-adjacent. For pattern matching — Regex Tester. If you cannot find the specific tool, the closest match is usually linked from a tool you do find; we group related tools in the same category for discovery.",
    indianContext:
      "Indian software engineers increasingly work on global products but with India-specific edge cases: PAN card number validation (pattern AAAAA9999A), GSTIN validation (15-character state + PAN + entity code + checksum), Aadhaar number format checks (12 digits with Verhoeff checksum), IFSC code validation, UPI ID format, and PIN code lookup. Where standard developer tools ignore these, we ship validators for them specifically so a backend engineer building an Indian FinTech app does not have to write the regex for the fifteenth time.",
    pillarFaqs: [
      {
        q: "Can I trust these tools with production API keys or JWTs?",
        a: "Yes — every developer tool on SabTools.in processes input entirely in your browser. You can verify by opening DevTools, going to the Network tab, pasting a JWT, and watching: no request leaves your machine. The code is visible in the page source; there is no hidden server round-trip.",
      },
      {
        q: "Why does my 50 MB JSON lag the browser?",
        a: "The JSON formatter renders the entire tree to the DOM; above 10-20 MB, the layout cost starts to show. For very large files, use the CLI equivalent (`jq` or `python -m json.tool`) on your local machine — there is no browser-based tool that will be as fast as a native binary on files that size.",
      },
      {
        q: "Are the hashes suitable for password storage?",
        a: "No. MD5, SHA-1, SHA-256, and SHA-512 are cryptographic hashes but they are too fast to use for password storage — modern GPUs compute billions per second. For passwords you need a deliberately slow, memory-hard function: bcrypt, scrypt, argon2. Our hash tools are for cache keys, file integrity, and content fingerprinting, not credential storage.",
      },
      {
        q: "Do the regex tests match Python / PCRE or only JavaScript?",
        a: "JavaScript regex only, because the tool runs in your browser. JavaScript regex is close to PCRE but differs in specific areas — no lookbehind support in older browsers, different Unicode handling, no recursive patterns. For PCRE or Python-specific patterns, verify separately in the target environment.",
      },
      {
        q: "Can I save favourite inputs or templates?",
        a: "Not currently — the tools are stateless to preserve the privacy guarantee (nothing saved means nothing to leak). If you find yourself running the same input repeatedly, either bookmark the page URL with a query param (several tools support this) or save a gist locally.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. SEO Tools — 18 tools
  // ──────────────────────────────────────────────────────────────────────
  seo: {
    whatIs:
      "SEO tools on SabTools.in generate the technical artefacts and run the diagnostic checks that shape how Google, Bing, and answer engines understand your site. That includes meta tag generators, structured data builders, sitemap generators, robots.txt writers, Open Graph tag validators, SERP preview tools, and keyword density analysers. Each tool follows the current 2026 Google guidelines — the ones rewritten after the March 2026 Core Update — rather than the 2018-era checklists most generic SEO tools still ship. The goal is not to trick search engines, but to make sure nothing invisible on your site is suppressing rankings.",
    keyFeatures: [
      {
        title: "Copy-paste ready output",
        description:
          "Every generator produces code you can paste directly into WordPress, Shopify, Wix, Blogger, or any custom HTML site. No manual formatting, no syntax tweaks — the output is production-ready.",
      },
      {
        title: "Google 2026 compliance",
        description:
          "Meta tag lengths, Open Graph image dimensions, structured data property choices, and robots.txt directives reflect Google's latest published guidance. We update within weeks when Google announces changes.",
      },
      {
        title: "Structured data templates",
        description:
          "JSON-LD generators for Organization, WebApplication, Article, HowTo, FAQPage, Product, Recipe, and BreadcrumbList — the schema types that unlock rich results and AI Overview citations in 2026.",
      },
      {
        title: "Real SERP preview",
        description:
          "See exactly how your title and description will render in Google's desktop and mobile search results, with character-count warnings so you do not get truncated at 55 or 155 characters.",
      },
    ],
    useCases: [
      {
        title: "Setting up SEO on a new WordPress blog",
        description:
          "Start with the Meta Tag Generator for your homepage and category pages. Then use the XML Sitemap Generator to create /sitemap.xml, the Robots.txt Generator to allow/disallow specific paths, and the Organization Schema Generator to register your site as a publisher entity. This gets you the base technical SEO stack in under an hour.",
      },
      {
        title: "Optimising an existing page that is not ranking",
        description:
          "Paste the page URL into the SERP Preview tool to see what Google actually shows. If the title is truncated or the description is boilerplate, rewrite with the Meta Tag Generator. Then run the page through the Keyword Density Checker to confirm you are not stuffing the primary keyword.",
      },
      {
        title: "Auditing a competitor's on-page SEO",
        description:
          "View-source on any page, extract the meta tags, and run them through the OG Tag Preview. You will see exactly what shows up when the page is shared on WhatsApp, Facebook, LinkedIn, or Twitter. Useful for understanding how competitors position their content for social sharing.",
      },
      {
        title: "Preparing a site for Core Web Vitals",
        description:
          "The Page Speed Analyser points at specific slow-loading assets; combine that with the Image Compression tools from the Image category to fix LCP issues. The HTML Minifier and CSS Minifier reduce bundle size for INP improvements.",
      },
    ],
    howToChoose:
      "If you are setting up a new site: Meta Tag Generator, then XML Sitemap Generator, then Robots.txt Generator, then Organization Schema Generator. If you are fixing an existing page: SERP Preview, then OG Tag Preview for social, then Keyword Density Checker to spot over-optimisation. If you are auditing technical health: Broken Link Checker, Page Speed Analyser, and Mobile-Friendly Tester. Most small blog owners need 5-6 of these tools in sequence; the related-tools block at the bottom of each page suggests the logical next step.",
    indianContext:
      "SEO for the Indian market has a few specific patterns global tools miss. Meta descriptions often need both English and Hindi versions for the same page (Google now treats hreflang-linked pages as a unit, not as duplicates). Structured data for Indian businesses should include the GSTIN where relevant — we add a dedicated field in our LocalBusiness generator. Product schema on Indian e-commerce sites should use INR currency codes, not USD, and price format using the Indian rupee symbol (₹). Our schema tools default to these patterns automatically, so an Indian site builder does not have to hand-edit every output.",
    pillarFaqs: [
      {
        q: "Will these tools get my site on the first page of Google?",
        a: "No tool alone does that. What these tools do is remove the technical barriers that prevent Google from understanding and trusting your site. Actual rankings come from content quality, information gain, user engagement, and backlinks. These tools handle the foundation; the content and authority work happens elsewhere.",
      },
      {
        q: "Are meta keywords still useful?",
        a: "No — Google stopped using the meta keywords tag for ranking over a decade ago, and Bing followed. Our Meta Tag Generator does not produce the keywords field by default because including it can actually dilute your SEO signal by telegraphing optimisation intent to some competitor scraper tools. Focus on title, description, and structured data.",
      },
      {
        q: "How often should I regenerate my sitemap?",
        a: "Whenever you add, remove, or meaningfully update a URL. For a static site, that often means weekly or after each content push. For a WordPress blog, a plugin regenerates automatically on every publish. If you use our XML Sitemap Generator, bookmark the output URL and re-run whenever you add content.",
      },
      {
        q: "What is the difference between robots.txt and noindex?",
        a: "robots.txt tells crawlers which URLs to request; noindex tells Google not to include a requested page in the index. Use robots.txt to block paths you do not want wasted crawl budget on (admin pages, search results). Use noindex for pages Google should see but not rank (thank-you pages after a form submit, internal search result pages).",
      },
      {
        q: "Do I need structured data on every page?",
        a: "Not every page, but every page type. A blog post needs Article schema. A product page needs Product schema. A recipe needs Recipe schema. Your homepage needs Organization + WebSite schema. Pages that are purely navigational (like a contact page) do not need their own schema types beyond the BreadcrumbList and the site-wide Organization reference.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 6. Text Tools — 16 tools
  // ──────────────────────────────────────────────────────────────────────
  text: {
    whatIs:
      "Text tools handle the formatting, counting, cleaning, and generation tasks that come up every time you write — whether you are a blogger checking word count against a minimum, a developer cleaning up data exported from an old system, a student preparing an essay, or a marketer writing within a platform's character limit. Every tool on SabTools.in processes text entirely in your browser, supports English and all major Indian languages including Hindi, Tamil, Bengali, and Telugu, and has no practical size limit — you can paste a 50,000-word document and get results in under a second.",
    keyFeatures: [
      {
        title: "Multi-language Unicode support",
        description:
          "Character and word counters handle Devanagari, Tamil, Bengali, Telugu, Kannada, Malayalam, Gujarati, Punjabi, and any Unicode script correctly. English word boundaries, Hindi matras, and Tamil vowel marks are all counted the way their linguistic rules require.",
      },
      {
        title: "No size limits",
        description:
          "Paste a full-length novel (200,000 words) or a large CSV export (50 MB of text) and the tools still work. Everything runs on your device so there is no server-side input cap to throttle you.",
      },
      {
        title: "Case conversion presets",
        description:
          "Upper, lower, title, sentence, camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE — including the Indian-specific requirement to preserve 'ji' in titles and the English-capitalisation rule for 'I' in the middle of sentences.",
      },
      {
        title: "One-click copy",
        description:
          "Every output has a copy button that writes to your clipboard without a confirmation prompt. For text that needs to be pasted into a form with a character-limit counter, this matters.",
      },
    ],
    useCases: [
      {
        title: "Checking word count for a blog post",
        description:
          "Paste your draft into the Word Counter and see word count, character count with and without spaces, sentence count, paragraph count, and estimated reading time. Most SEO-focused blogs target 1,500-2,500 words for primary content, so the reading-time indicator tells you at a glance whether you are in the range.",
      },
      {
        title: "Preparing a Twitter / LinkedIn post within the character limit",
        description:
          "Twitter allows 280 characters; LinkedIn posts cut off at 1,300 characters for the 'see more' fold; Instagram captions are capped at 2,200. The Character Counter shows real-time character count as you type, with platform presets that highlight when you exceed each limit.",
      },
      {
        title: "Cleaning up a pasted data export",
        description:
          "Text pasted from PDFs, Word, or email often contains non-breaking spaces, smart quotes, zero-width characters, and inconsistent line breaks. The Text Cleaner normalises whitespace, converts smart quotes to plain ASCII, and removes invisible characters — important if you are then pasting into a database or code.",
      },
      {
        title: "Generating placeholder text for a design mockup",
        description:
          "The Lorem Ipsum Generator produces the classic Latin filler text, but our Hindi Lorem Ipsum generator is more useful for Indian design work — because real Hindi text sets differently on the page than Latin text, and that affects the final design. Same for Tamil and Bengali presets.",
      },
    ],
    howToChoose:
      "For counting anything (words, characters, sentences, paragraphs) — Word Counter or Character Counter. For changing how text is capitalised — Case Converter. For cleaning up messy pasted text — Text Cleaner. For generating placeholder or random content — Lorem Ipsum Generator or Random Text Generator. For comparing two versions of the same text — Text Diff Tool. For finding and replacing across a large document — Find and Replace. Most writing tasks need two or three of these in sequence.",
    indianContext:
      "Text tools built for English often break on Indic scripts. A Devanagari character counter that counts letter-by-letter gives the wrong answer because Devanagari uses conjunct characters and matras that are visually one grapheme but technically multiple code points. Our counters respect grapheme-cluster boundaries, so a word like 'क्या' counts as 1 character visually (and 3 Unicode code points internally — we show both). Case converters default-skip Devanagari because the concept does not apply, rather than mangling the text. For Hinglish content (Hindi written in Latin script), our tools handle both scripts in the same document without crashing, which is surprisingly rare.",
    pillarFaqs: [
      {
        q: "Why do different tools count 'characters' differently?",
        a: "Because there are three reasonable definitions: code points (Unicode-level count), grapheme clusters (what humans see as one character, e.g., 'क्या' or '👨‍👩‍👧'), and bytes (UTF-8 storage size). Our Character Counter shows all three, with a default display of grapheme clusters because that is what most platforms (Twitter, SMS, WhatsApp) count for character limits.",
      },
      {
        q: "Can I use the word counter for academic essays?",
        a: "Yes — our Word Counter uses the same word-boundary rules Microsoft Word and Google Docs apply (whitespace or punctuation as a delimiter, hyphenated compounds counted as one word). For most university assignments and journal submissions the counts will match exactly.",
      },
      {
        q: "Does the text diff tool work with code?",
        a: "Yes, the Text Diff Tool is whitespace-sensitive by default, which is what code review needs. You can toggle off whitespace sensitivity for prose comparison. It handles diffs up to several hundred KB without performance issues, which covers most single-file code diffs.",
      },
      {
        q: "Why is Lorem Ipsum still used when we have real content?",
        a: "Because seeing your final content in the layout too early can anchor design decisions to the specific words rather than the structure. Lorem Ipsum forces the designer to focus on typography, spacing, and hierarchy without getting distracted by 'that sentence is too long' feedback. Once the layout is locked in, you swap in real content.",
      },
      {
        q: "Do these tools work offline?",
        a: "Yes — after the initial page load, every text tool works without an internet connection. All the logic is JavaScript running in your browser. You can install SabTools.in as a PWA from your browser menu to keep the tools accessible offline indefinitely.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 7. Health & Fitness — 13 tools
  // ──────────────────────────────────────────────────────────────────────
  health: {
    whatIs:
      "Health and fitness calculators on SabTools.in estimate body composition, daily calorie needs, macronutrient targets, pregnancy milestones, and fitness metrics using WHO, ICMR, and peer-reviewed medical formulas — with India-specific reference values where they exist. Unlike generic health calculators that assume Western body types and diets, our tools use the WHO Asia-Pacific BMI classification (which sets overweight at 23+, not 25+, because South Asian body composition shows metabolic risk at lower BMI) and reference Indian food composition tables from the National Institute of Nutrition, Hyderabad. These are decision-support tools for informed conversations with your doctor, not replacements for clinical judgement.",
    keyFeatures: [
      {
        title: "India-specific reference ranges",
        description:
          "BMI uses the WHO Asia-Pacific classification (<18.5 underweight, 18.5-22.9 normal, 23-24.9 overweight, 25+ obese). BMR uses the Mifflin-St Jeor formula, which is more accurate for South Asian populations than the older Harris-Benedict equation.",
      },
      {
        title: "ICMR-aligned calorie guidance",
        description:
          "Daily calorie and macronutrient recommendations follow the 2020 ICMR-NIN Dietary Guidelines for Indians, which account for typical Indian vegetarian/non-vegetarian eating patterns and regional variations.",
      },
      {
        title: "Pregnancy tracking to Indian standards",
        description:
          "Pregnancy calculator computes gestational age, estimated due date, and trimester milestones using standard obstetric dating (LMP + 280 days) used by Indian hospitals.",
      },
      {
        title: "Privacy-first processing",
        description:
          "Height, weight, age, and health inputs stay on your device. Nothing is sent to any server — important because health data in India is covered by the Digital Personal Data Protection Act, 2023.",
      },
    ],
    useCases: [
      {
        title: "Checking BMI before starting a fitness programme",
        description:
          "Enter height and weight, see BMI plus the specific WHO Asia-Pacific category. The tool flags the India-specific caveat that 23+ BMI is the South Asian overweight threshold (vs 25+ internationally), because abdominal fat accumulation in South Asians carries cardiovascular risk at lower BMI.",
      },
      {
        title: "Calculating maintenance calories to start losing weight",
        description:
          "The BMR Calculator + Activity Level multiplier gives total daily energy expenditure (TDEE). A 500-calorie deficit from TDEE typically produces half a kilo per week of fat loss. The tool shows the calorie count at various deficit levels so you can pick a sustainable pace.",
      },
      {
        title: "Estimating due date during pregnancy",
        description:
          "Enter the first day of your last period and the Pregnancy Calculator shows gestational age in weeks and days, the estimated due date, the current trimester, and upcoming milestone dates (first trimester scan, anomaly scan, glucose tolerance test).",
      },
      {
        title: "Checking ideal body weight range",
        description:
          "The Ideal Weight Calculator uses four different formulas (Devine, Robinson, Miller, Hamwi) because no single formula is perfect for every body type. Seeing the range across all four gives a more realistic target than a single number.",
      },
    ],
    howToChoose:
      "For body composition baseline: BMI first, then BMR for calorie planning. For weight management: Calorie Calculator with Activity Multiplier, plus the Macro Calculator for protein/carb/fat split. For pregnancy: the Pregnancy Calculator covers dates and milestones; the Pregnancy Weight Gain Tracker monitors recommended gain by trimester. For fitness tracking: Heart Rate Zone Calculator for cardio planning, Calorie Burn Calculator for workout logs. Every tool page also explains what the number actually means for your health, not just what it is.",
    indianContext:
      "Indian bodies have distinctive cardiometabolic patterns — lower muscle mass, higher visceral fat at lower BMI, higher insulin resistance at any given weight, and different nutritional baselines. Our calculators use the WHO Asia-Pacific BMI cut-offs specifically recommended for South Asian populations, the ICMR dietary recommendations that factor in typical Indian diet patterns (high carbohydrate, legume-based protein, ghee/oil preferences), and reference values calibrated for Indian women during pregnancy. If the underlying research has an India-specific variant, our tool uses it; if not, we use the closest WHO recommendation for South Asia.",
    pillarFaqs: [
      {
        q: "My BMI says 'overweight' at 24 but I feel fine — is that wrong?",
        a: "It is using the WHO Asia-Pacific classification, which is correct for Indian bodies. South Asians develop metabolic risk (type 2 diabetes, hypertension, coronary disease) at lower BMI than white European populations. The international 25+ threshold was set based on studies in Western populations and does not reflect the risk profile of Indian bodies. WHO recommends 23+ as the overweight cut-off for Asian populations specifically for this reason.",
      },
      {
        q: "Is BMR the same as the calories I need to eat?",
        a: "No — BMR is the calories your body burns at complete rest. Your actual daily calorie need (TDEE) is BMR × Activity Multiplier. For a sedentary office worker, multiply BMR by ~1.2; for someone who exercises 3-5 days per week, ~1.55; for heavy physical labour, ~1.725. The Calorie Calculator does this multiplication automatically.",
      },
      {
        q: "Can I use the pregnancy calculator if I do not know my exact LMP date?",
        a: "The pregnancy calculator allows estimation from an ultrasound scan dating if the LMP is unknown or uncertain — many women have irregular cycles and cannot pinpoint day 1. If you had an early dating scan (before 12 weeks), that date is actually more accurate than LMP because early fetal size is a more reliable predictor of gestational age than menstrual dating.",
      },
      {
        q: "Are these calculators a substitute for a doctor?",
        a: "No. These are decision-support tools. They help you understand concepts like BMI, calorie needs, and pregnancy dating so you can have a more informed conversation with your doctor. If a calculator result concerns you — a BMI in the obese range, a rapid weight change, bleeding or pain during pregnancy — see a doctor. The calculator identifies patterns; the doctor interprets them in the context of your full medical history.",
      },
      {
        q: "Are my health inputs stored anywhere?",
        a: "No. Every health calculator runs entirely in your browser. Height, weight, age, pregnancy dates — none of it is sent to any server, none of it is logged, none of it is stored between sessions. You can verify this by using the tool with DevTools' Network tab open — no outgoing requests will include your health data.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 8. Tax & Salary — 10 tools
  // ──────────────────────────────────────────────────────────────────────
  tax: {
    whatIs:
      "Tax and salary tools on SabTools.in compute income tax under old and new regimes, break down CTC into take-home, calculate TDS, estimate HRA exemption, project EPF and NPS corpus, and estimate stamp duty for property transactions — using the exact slab rates, exemption limits, and deduction rules in effect for the current Indian financial year. Every tool is updated within a few weeks of Union Budget announcements, so the numbers reflect the most recent changes from the Finance Ministry. These are planning tools — the final tax computation on your ITR will match these outputs to the rupee when you enter the same inputs.",
    keyFeatures: [
      {
        title: "Current-year slabs and limits",
        description:
          "Income tax slabs, standard deduction, 87A rebate ceiling, 80C cap, 80D limits, HRA cities, and NPS additional deduction all reflect the FY in effect. Both FY 2024-25 (returns filed in 2025) and FY 2025-26 (returns to be filed in 2026) are supported side by side.",
      },
      {
        title: "Old vs New regime side by side",
        description:
          "Every income tax calculator runs both regimes in parallel and highlights the lower-tax option with the exact rupee difference. No need to run the numbers twice.",
      },
      {
        title: "CTC breakdown to take-home",
        description:
          "The Salary Calculator decomposes CTC into basic, HRA, special allowance, EPF, professional tax (state-specific), and income tax — producing the actual in-hand monthly amount employees see in their bank.",
      },
      {
        title: "State-wise stamp duty",
        description:
          "Stamp duty and registration charges vary by state and by buyer gender (several states offer women-buyer concessions). The Stamp Duty Calculator supports all 28 states and 8 union territories with current rates.",
      },
    ],
    useCases: [
      {
        title: "Choosing the tax regime before declaring to HR",
        description:
          "Most employers ask you to declare old vs new regime at the start of each financial year. Run your expected income, 80C investments, HRA, and home loan interest through the Income Tax Calculator — it will tell you which regime saves you more for the full year, not just the current pay cycle.",
      },
      {
        title: "Understanding where your CTC actually goes",
        description:
          "A ₹15 lakh CTC rarely means ₹15 lakh in your bank. The Salary Calculator shows the 12% employer EPF contribution that sits in CTC but never hits your salary account, the income tax withheld monthly, the professional tax deducted by your state, and the actual take-home. For most employees, take-home is 65-75% of CTC.",
      },
      {
        title: "Claiming HRA exemption correctly",
        description:
          "HRA exemption is the minimum of three numbers: actual HRA received, rent paid minus 10% of basic, and 50% of basic (for metros) or 40% (for non-metros). The HRA Calculator runs all three and gives you the maximum legitimate exemption. Pair with the Rent Receipt Generator to produce the documentation HR will ask for.",
      },
      {
        title: "Budgeting for a property purchase",
        description:
          "Stamp duty and registration can add 6-8% to the property cost in most states. The Stamp Duty Calculator shows the exact amount for your state, factoring in the female-buyer concession where applicable. Combine with the Home Loan EMI Calculator to see total monthly outflow including stamp-duty EMI reimbursement if you finance it.",
      },
    ],
    howToChoose:
      "If you are a salaried employee during investment declaration: Income Tax Calculator (both regimes) → HRA Calculator → Salary Calculator for take-home. If you are filing your ITR: Income Tax Calculator to verify the amount your CA or TDS deductor computed. If you are buying property: Stamp Duty Calculator + Home Loan Calculator + Property Capital Gains Tax Calculator (for the seller side). If you are planning for retirement: NPS Calculator + EPF Calculator + PPF Calculator together, to see the total retirement corpus.",
    indianContext:
      "Indian tax is layered: central income tax under the IT Act, a small professional tax levied by state governments (varies from ₹200 to ₹2,500 per year depending on state), state stamp duty on property transactions, and GST on most goods and services. None of these are abstractly 'Indian tax' — they each have their own rules, slab structures, and exemptions. Our tools handle the central income tax (old and new regimes), the salary-side professional tax deduction, stamp duty at state granularity, and the GST slab structure for business invoicing. If your situation needs state-specific guidance (Maharashtra professional tax brackets, for example), the salary calculator defaults to that state when selected.",
    pillarFaqs: [
      {
        q: "Does the calculator include the 4% Health & Education Cess?",
        a: "Yes — every tax output shown is the final tax-plus-cess amount, not pre-cess base tax. The 4% cess applies to both old and new regime outputs and is already included in the comparison number the tool shows.",
      },
      {
        q: "When does the 87A rebate apply?",
        a: "Under the new regime for FY 2025-26, the rebate is available when taxable income is up to ₹7 lakh, effectively making income up to that level tax-free. Under the old regime, the rebate applies up to ₹5 lakh of taxable income. The Income Tax Calculator applies the correct rebate automatically based on which regime is selected.",
      },
      {
        q: "How does the tool handle 80D medical insurance deduction for senior citizen parents?",
        a: "80D allows up to ₹25,000 for self/family plus up to ₹50,000 additional for senior citizen parents. Our calculator has separate fields for these so you can enter the premium amounts and see the combined deduction. If parents are super-senior (80+), the limit is still ₹50,000 but we flag the higher limit for preventive health check-up spending within that cap.",
      },
      {
        q: "My HR showed me a different take-home than the Salary Calculator — why?",
        a: "Most common reasons: your HR factored in one-time annual components (bonus, LTA) differently; state professional tax may not be included in HR's projection; your employer may use a different EPF base (sometimes on basic only, sometimes on basic + DA); your declared investments differ from what the calculator assumes. Enter the exact numbers your offer letter shows and the outputs should match to within ₹200-500.",
      },
      {
        q: "Are these numbers good enough to file an actual ITR with?",
        a: "They are good enough to verify a CA's computation or the return your TDS deductor computes, and to plan investments and declarations. For the final ITR filing you will use the official Income Tax portal or a regulated filing service because the portal cross-references your Form 26AS and AIS automatically. Use our tools upstream for planning; use the portal downstream for filing.",
      },
    ],
  },

};

/**
 * Utility: count approximate words across the pillar sections so we can
 * assert at build time that priority categories clear the 800-word floor.
 */
export function wordCountForPillar(p: CategoryPillar): number {
  const text = [
    p.whatIs,
    ...p.keyFeatures.flatMap((f) => [f.title, f.description]),
    ...p.useCases.flatMap((u) => [u.title, u.description]),
    p.howToChoose,
    p.indianContext,
    ...p.pillarFaqs.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
