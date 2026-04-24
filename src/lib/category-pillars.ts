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

  // ──────────────────────────────────────────────────────────────────────
  // 9. Fun & Lifestyle Tools — 20 tools
  // ──────────────────────────────────────────────────────────────────────
  fun: {
    whatIs:
      "Fun tools on SabTools.in are quick, shareable utilities that answer the lighthearted questions people actually search for — how old will I be in 2050, what is my love compatibility with a friend, what does my name look like in fancy fonts, what is today's lucky number. Every tool works instantly in your browser, produces a result you can screenshot and share on Instagram or WhatsApp, and does not ask for sign-ups or push notifications. They are designed for five-second use: open, type, laugh, share, close.",
    keyFeatures: [
      {
        title: "Instant, shareable results",
        description:
          "Every fun tool renders a result card designed to screenshot cleanly at 1080×1920 (Instagram Story) or 1080×1080 (square post) so you can share straight from your phone without cropping.",
      },
      {
        title: "No sign-up, no tracking",
        description:
          "Age calculators, love calculators, name generators — none of them send your inputs anywhere. Everything runs locally so WhatsApp forwards and status updates stay private.",
      },
      {
        title: "Culturally relevant defaults",
        description:
          "Lucky number tools use numerology traditions common in Indian homes, name generators include Hindi, Tamil, Telugu, and Bengali script variants, and festival countdowns cover Diwali, Holi, Eid, Christmas, Pongal, and Onam with 2026 dates.",
      },
      {
        title: "Mobile-first design",
        description:
          "Fun tools are used overwhelmingly on phones and during short breaks. Every page loads in under 1.5 seconds on a 4G connection and the interaction surface is optimised for thumb-reach on 6-inch screens.",
      },
    ],
    useCases: [
      {
        title: "Sharing on WhatsApp status and Instagram stories",
        description:
          "Generate your exact age in years, months, days, hours, and minutes — the result card is already formatted for a Story. The Love Calculator and Friendship Calculator produce shareable compatibility percentages between two names. Stylish Font Generator renders your name in 50+ decorative Unicode styles for bio fields.",
      },
      {
        title: "Planning for birthdays and milestones",
        description:
          "The Age Calculator tells you the exact weekday you were born on (useful for astrology questions) and the next milestone birthday. Days Until Birthday counts down to the next one. Life-in-Weeks visualises your life as a grid — a popular reflection tool for New Year posts.",
      },
      {
        title: "Couple and friendship content",
        description:
          "Love Calculator, Compatibility Test, Friendship Calculator, and Couple Name Generator are the top four tools by volume in this category. They are meant as conversation starters — not serious relationship advice — and are popular on engagement and anniversary posts.",
      },
      {
        title: "Quick daily-use lifestyle helpers",
        description:
          "Random Movie Picker solves the Netflix-paralysis problem, the Flip-a-Coin and Dice-Roller tools settle small arguments, and the Bucket List Generator suggests experiences tuned for Indian travellers — from Ladakh road trips to Andaman scuba dives.",
      },
    ],
    howToChoose:
      "If you have a date question — age, birthday, retirement countdown — use the date-based calculators. If you are generating content for a post — name generators, font generators, quote generators. If you are settling something by chance — coin flip, dice, wheel of names. If you are planning entertainment — movie picker, random activity, bucket list. None of these need a manual; they are all visual and self-explanatory within three seconds of opening the page.",
    indianContext:
      "Fun tools on SabTools.in default to Indian contexts wherever it matters. The Age Calculator supports both Gregorian and Vikram Samvat dates, festival countdowns track the Hindu, Islamic, Christian, and Sikh calendars used across India, and numerology tools use the ank-shastra (Chaldean) system more common in Indian practice than the pure Pythagorean system Western sites use. Name and font generators include Devanagari, Tamil, Telugu, Kannada, Bengali, and Gujarati script options. Where a Western fun site might ask for zip code, ours asks for PIN; where a Western love-test might reference Valentine's Day, ours handles Karva Chauth, Raksha Bandhan, and Propose Day (yes, that is a thing).",
    pillarFaqs: [
      {
        q: "Are love and friendship calculators based on real algorithms?",
        a: "They are numerology-style scoring systems that apply consistent rules to the letters of two names — so the same inputs always produce the same output, but the output is for entertainment, not a predictor of real compatibility. Use them as a conversation starter or content prompt, not as decision-making advice.",
      },
      {
        q: "Can I embed these tools or share the results to WhatsApp directly?",
        a: "Yes. Every result card has a 'Share' button that opens the native WhatsApp and Instagram share sheet on mobile. On desktop, the same button copies a pre-formatted text snippet with a link back to the tool. Embedding on blogs and personal pages is allowed with attribution.",
      },
      {
        q: "Why does my lucky number differ from what another site shows?",
        a: "Most Indian numerology traditions use the Chaldean system (each letter is 1-8, excluding 9); most Western sites use Pythagorean (1-9 in order). Our Lucky Number Calculator lets you pick which system to apply and shows both results side-by-side if you are unsure. Both are legitimate numerology traditions — they just differ by lineage.",
      },
      {
        q: "Are the font generators safe to paste into Instagram bio / WhatsApp / Twitter?",
        a: "Yes. The Stylish Font Generator produces standard Unicode characters that every modern app renders natively — it is not an image or a font file, so pasting it anywhere works including Instagram, WhatsApp, Discord, X, LinkedIn, and even email signatures.",
      },
      {
        q: "Do you store the names I type into Love Calculator or Couple Name Generator?",
        a: "No. Every fun tool runs entirely in your browser. We do not log your inputs, do not store results, and do not use the names for any analytics. Refresh the page and everything is gone.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 10. Unit Converters — 16 tools
  // ──────────────────────────────────────────────────────────────────────
  converters: {
    whatIs:
      "Unit converters on SabTools.in handle the measurement conversions Indians actually run into — square feet to square metres when buying a flat, bigha to acres when dealing with family land, tola to grams when pricing gold, fahrenheit to celsius when reading an imported appliance manual. Each converter supports multiple regional Indian units (bigha differs by state, so we let you pick; gold units differ by community, so we include them all) alongside the standard international SI units. Everything converts in real time as you type, with full-precision arithmetic — not rounded approximations.",
    keyFeatures: [
      {
        title: "Regional Indian unit coverage",
        description:
          "Area, length, and weight converters include Indian units most international tools skip — bigha (with state-specific variants), katha, guntha, cent, ground, tola, masha, ratti, and traditional grain measures where still in use.",
      },
      {
        title: "Real-time bidirectional conversion",
        description:
          "Type in either direction and the other side updates instantly. There is no 'convert' button because modern browsers are fast enough to recompute on every keystroke — useful when you are adjusting a number to hit a round target.",
      },
      {
        title: "High precision, human-readable output",
        description:
          "Internally we compute with full floating-point precision, then round to the number of decimals that makes sense for the unit — 3 decimals for metres, 2 for kilos, 0 for rupees. No more 1.9999999 when you wanted 2.",
      },
      {
        title: "Bulk and formula-based conversion",
        description:
          "Paste a column of numbers (from Excel or a PDF) and convert the whole list at once. The Currency Converter updates daily rates for INR against 30+ major currencies; the Temperature Converter includes Kelvin and Rankine for science use.",
      },
    ],
    useCases: [
      {
        title: "Buying or selling property",
        description:
          "Indian real-estate listings freely mix sq.ft (apartments), sq.metres (government records), acres (farms), bigha (North Indian land), and cents (South Indian land). The Area Converter translates between all of them with state-specific bigha factors — because 1 bigha in Rajasthan (1,618 m²) is very different from 1 bigha in Assam (1,338 m²) or Bengal (1,337.8 m²).",
      },
      {
        title: "Gold, silver, and jewellery pricing",
        description:
          "Gold prices quote per tola (10 g, though historically 11.66 g) or per gram depending on the state and the jeweller. The Gold Unit Converter handles tola, masha, ratti, carat, ounce, and gram with the traditional Indian tola (11.664 g) and the Indian Mint tola (10 g) both available as presets.",
      },
      {
        title: "Cooking with international recipes",
        description:
          "A recipe calling for a cup of rice or 350°F oven means different things in different kitchens. The Cooking Converter handles US cup (236 ml) vs metric cup (250 ml), American stick of butter (113 g) vs Indian block, and the oven gas marks still used on some imported appliances.",
      },
      {
        title: "Fuel economy, distance, and speed",
        description:
          "India reports fuel economy as km/litre; most imported car specs are in mpg. The Fuel Economy Converter handles both, plus L/100km used in EU specs. Distance converter does km/miles. Speed does kmph/mph/mach.",
      },
    ],
    howToChoose:
      "Start with what you need to convert. For physical measurements (length, area, volume, weight) — the SI converters with Indian unit support. For money — currency converter with live INR rates. For time — time zone converter covering all Indian and international zones. For special-domain conversions (fuel, cooking, gold) — the dedicated converter for that domain, because those domains have specific unit traditions worth honouring instead of forcing a generic SI conversion.",
    indianContext:
      "Indian measurement culture is layered — we use SI for science and engineering, imperial for real estate (sq.ft persists even in metric-era construction), and traditional local units for agriculture, jewellery, and household cooking. A good converter respects all three layers instead of privileging SI. Our converters include state-specific variants (bigha, guntha, katha all differ by state), community-specific variants (tola of 10 g or 11.664 g), and household variants (cup, teaspoon, tablespoon) alongside pure SI. Rupees are formatted in the Indian numbering system (lakh, crore) not the international system (million, billion), with commas in the correct positions.",
    pillarFaqs: [
      {
        q: "Why does my bigha conversion not match what my chacha's farmer friend said?",
        a: "Bigha is one of the most regionally inconsistent units in India. Rajasthan pucca bigha is 1,618.7 m²; Bengal bigha is 1,337.8 m²; Assam bigha is 1,337.8 m² but rounded differently; UP bigha varies between 2,500 m² (pucca) and 1,008 m² (kaccha). Always select the state in the Area Converter dropdown before converting — that's the only way to match local usage.",
      },
      {
        q: "Is 1 tola 10 grams or 11.664 grams?",
        a: "Both are used. The Government of India legislated 1 tola = 10 g in 1956, and that is what the Indian Mint and modern gold receipts use. Traditional and customary usage, especially in older transactions and some South Indian states, still uses the British-era tola of 11.664 g (180 grains troy). The Gold Unit Converter offers both — pick 'Modern (10 g)' for today's receipts and 'Traditional (11.664 g)' for family heirloom or historical values.",
      },
      {
        q: "Are the currency conversion rates live?",
        a: "They refresh daily (typically at 6 AM IST) from the Reserve Bank of India's reference rate data and published mid-market rates. They are suitable for estimation, planning, and informed decisions but not the rate you will actually get at a forex counter — banks and money changers add a 1-3% spread on top of the reference rate.",
      },
      {
        q: "Does the Area Converter support carpet area vs built-up vs super built-up?",
        a: "Yes, there is a dedicated Carpet Area Converter that toggles between the three definitions using typical Indian ratios (built-up is ~15-20% more than carpet, super built-up adds another 20-30% for common areas). RERA-registered projects must disclose carpet area, so that is our default.",
      },
      {
        q: "Can I convert multiple values at once, like a whole column from Excel?",
        a: "Yes. Every converter has a Bulk Convert mode where you paste a list of numbers (one per line) and it returns the converted values in the same format, ready to paste back into Excel or Google Sheets.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 11. Security & Privacy Tools — 11 tools
  // ──────────────────────────────────────────────────────────────────────
  security: {
    whatIs:
      "Security tools on SabTools.in generate and test credentials without ever sending them to a server. Password generators, strength testers, hash calculators (MD5, SHA-1, SHA-256, SHA-512), UUID generators, base64 encoders — everything runs in your browser using the Web Crypto API. That matters because a password generator that sends your password to its server is not a security tool; it is a credential leak waiting to happen. Every security tool here is auditable in your browser's DevTools Network tab — you will see no outgoing request with the generated value.",
    keyFeatures: [
      {
        title: "Web Crypto API generation",
        description:
          "Password Generator uses crypto.getRandomValues() — the same cryptographically secure random number generator used by browsers for TLS. Unlike Math.random(), its output is unpredictable and suitable for credentials.",
      },
      {
        title: "No-upload guarantee",
        description:
          "Hash calculators, encoders, and password testers all process your input locally. You can disconnect from the internet after loading the page and every tool still works, which is proof that nothing is phoned home.",
      },
      {
        title: "Compliance-friendly output",
        description:
          "Password Generator respects common corporate rules — length 12-32, mandatory uppercase/lowercase/digit/symbol, no ambiguous characters (0/O/I/l/1) for systems with manual entry.",
      },
      {
        title: "Modern crypto standards",
        description:
          "Hash calculator includes MD5 (legacy) and SHA-1 (legacy) for compatibility with older systems, plus SHA-256, SHA-384, SHA-512, and SHA-3 variants for modern use. Encoder tools cover base64, URL encoding, and HTML entity encoding.",
      },
    ],
    useCases: [
      {
        title: "Generating a unique password for each account",
        description:
          "The right way to use the internet is with a different strong password per account, stored in a password manager. Use the Password Generator to create a 20-character mix for each new signup, then paste it into your password manager. The Strength Tester grades your existing passwords so you know which ones to rotate first.",
      },
      {
        title: "Verifying downloaded file integrity",
        description:
          "Official Linux ISOs, Aadhaar card downloads from UIDAI, and signed PDFs from the Income Tax portal often publish SHA-256 hashes alongside the file. Drag the file into the Hash Calculator — if the hash matches the one on the official page, your download was not tampered with. If it does not, do not open the file.",
      },
      {
        title: "Backend and DevOps work",
        description:
          "UUID Generator produces v4 and v7 UUIDs for database IDs, the Base64 Encoder helps debug tokens in API requests, and the JWT Decoder inspects JSON Web Tokens (decode only — it does not validate signatures, so never trust JWTs just because they decode cleanly).",
      },
      {
        title: "Teaching and learning cryptography",
        description:
          "For students and curious learners, watching the same input produce identical hashes across runs, and watching a single-bit change produce a completely different hash (the avalanche effect), is the fastest way to build intuition for why hash-based integrity works.",
      },
    ],
    howToChoose:
      "For creating a new credential — Password Generator or Passphrase Generator (for human-memorable passwords). For testing an existing credential — Password Strength Tester. For file integrity — Hash Calculator (SHA-256 unless the source publishes a different algorithm). For encoding binary safely in text — Base64 Encoder. For generating database IDs — UUID Generator. For decoding tokens for debugging — JWT Decoder or Base64 Decoder. Each tool has a specific purpose and should not be substituted — do not use a hash as a password, do not use base64 as encryption, do not trust a JWT just because it parsed.",
    indianContext:
      "Indian digital services increasingly require strong credentials — banking apps enforce 8-16 character passwords with complexity rules, Aadhaar-linked services require OTP plus password, and corporate VPN and email rules often mandate 12+ characters with quarterly rotation. The Password Generator supports all these profiles with one-click presets (SBI, HDFC, ICICI typical rules; common CorpSec rules). For citizens dealing with DigiLocker, UMANG, and income-tax portal downloads, the Hash Calculator is the fastest way to verify the integrity of downloaded documents before opening them. Our Privacy Policy Generator helps Indian SMEs draft DPDP Act 2023-compliant privacy policies — this matters because the Digital Personal Data Protection Act is now enforceable and non-compliance penalties are serious.",
    pillarFaqs: [
      {
        q: "Is generating a password in my browser as safe as using a password manager?",
        a: "The generation step itself is as cryptographically secure as any password manager — both use the same Web Crypto RNG under the hood. What a password manager adds that our tool does not is storage and autofill. Generate the password here, then paste it into your Bitwarden / 1Password / Dashlane / iCloud Keychain for storage. Do not rely on browser history or clipboard as long-term storage for passwords.",
      },
      {
        q: "Can I use MD5 for passwords or file integrity?",
        a: "MD5 is broken for security use — collisions can be generated quickly on commodity hardware. Never use MD5 to hash passwords. For file integrity against accidental corruption (bit flips, partial downloads) MD5 is still fine; for integrity against a malicious attacker, use SHA-256 or better.",
      },
      {
        q: "How long should my password be?",
        a: "For most services, 16 characters of mixed types gives you roughly 100 bits of entropy — effectively unbreakable by brute force with today's hardware. For high-value accounts (primary email, banking, crypto wallets), go to 20-24 characters. Length matters more than complexity — a 20-character all-lowercase passphrase is stronger than a 10-character 'StrongP@ss1' style password.",
      },
      {
        q: "Do you log the passwords I generate?",
        a: "No. Generation happens entirely in your browser with no network call. Open your browser's DevTools Network tab while generating — you will see zero outgoing requests. We built it this way specifically because a 'password generator' that sends data to a server is worse than useless; it is a credential honeypot.",
      },
      {
        q: "Is the UUID generator suitable for production database primary keys?",
        a: "Yes. UUID v4 (random) is suitable as a primary key in virtually any database where you want globally unique identifiers. UUID v7 (time-ordered) is often preferable for databases like Postgres and MySQL where index locality matters — rows inserted close in time will sort close in time, improving B-tree insert performance. Both are produced to RFC 9562 spec.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 12. PDF Tools — 8 tools
  // ──────────────────────────────────────────────────────────────────────
  pdf: {
    whatIs:
      "PDF tools on SabTools.in merge, split, compress, convert, and protect PDF files entirely in your browser using PDF.js and pdf-lib — the file never leaves your device. That is uncommon. Most 'free online PDF' sites upload your file to their servers, process it, and delete it 'after one hour' (you have to trust them). When the PDF is a signed rent agreement, a salary slip with your PAN number, a joint-family will, or a hospital discharge summary, that upload is an unacceptable privacy trade-off. Our tools do the same operations locally, at comparable speed, with zero exposure.",
    keyFeatures: [
      {
        title: "Fully client-side processing",
        description:
          "Every PDF operation happens in your browser. Your files are not uploaded, not cached server-side, not logged. You can use the tools offline after the page loads — an easy way to verify the claim.",
      },
      {
        title: "Lossless operations where possible",
        description:
          "Merging, splitting, reordering, and rotating preserve the original PDF streams byte-for-byte — no re-encoding, no visible quality loss, and no font substitution. Only compression and image-conversion steps re-encode.",
      },
      {
        title: "Password protection and removal",
        description:
          "Add user passwords and owner permissions to a PDF, or remove known passwords from PDFs you own. Uses PDFLib's native encryption — the same AES-256 implementation Adobe Acrobat uses.",
      },
      {
        title: "OCR and text extraction",
        description:
          "Extract selectable text from text-layer PDFs. For scanned PDFs, the OCR tool runs Tesseract.js in a Web Worker to convert images to text — supports English, Hindi, Tamil, Telugu, Bengali, and Marathi scripts.",
      },
    ],
    useCases: [
      {
        title: "Submitting documents to Indian government portals",
        description:
          "GSTN, Income Tax e-filing, EPFO, and UIDAI self-service all accept PDF uploads but cap size at 1-5 MB per file. Our PDF Compressor trims typical scanned PDFs by 60-80% without visible degradation — critical when you have a 12 MB scanned rent agreement that the portal rejects.",
      },
      {
        title: "Merging bank statements and invoices",
        description:
          "Chartered accountants and startup founders routinely receive monthly PDFs from HDFC, ICICI, SBI, and private banks plus vendor invoices from Zoho, Tally, and QuickBooks. The PDF Merger combines up to 100 files at once with custom ordering — all in one local pass, no uploads.",
      },
      {
        title: "Splitting, extracting pages, and redacting",
        description:
          "Splitter extracts specific pages — useful when you need just page 3 (address proof) from a 20-page Aadhaar download, or pages 5-8 (salary certificate) from a passport application booklet. The Redactor blacks out sensitive text (PAN, account numbers) before you share.",
      },
      {
        title: "Converting between PDF and other formats",
        description:
          "PDF to JPG/PNG for embedding in slides, JPG/PNG to PDF for uploading photos as 'scanned documents' (many portals accept this), PDF to Word for editing, and Word/Excel to PDF for final submission. All conversions run locally via pdf-lib and dedicated WASM-backed converters.",
      },
    ],
    howToChoose:
      "For combining — Merge PDF. For taking files apart — Split PDF. For shrinking file size — Compress PDF. For format changes — PDF to JPG, PDF to Word, JPG to PDF, Word to PDF. For adding a password or removing one you own — Protect PDF / Unlock PDF. For extracting text from a scanned document — OCR PDF. Use the compressor with the 'Government Portal' preset when you are about to hit an upload limit — it targets ~500 KB output while keeping text readable on-screen.",
    indianContext:
      "Indian digital-government services assume citizens can produce PDFs that fit their specific size caps — GSTN accepts 1 MB/file for certain documents, the Income Tax portal caps at 5 MB, Aadhaar self-service at 2 MB, passport applications at 300 KB for photos and 5 MB for documents. Generic global PDF compressors often overshoot or undershoot these caps; our Compress PDF tool has dedicated presets for each major portal and tells you in advance whether the compressed file will fit. For Indian-language documents (Hindi forms, Tamil judgments, Marathi land records), our OCR tool reads Devanagari, Tamil, Telugu, Bengali, Gujarati, and Kannada scripts — most free global OCR tools only read Latin scripts.",
    pillarFaqs: [
      {
        q: "Are my PDFs really not uploaded anywhere?",
        a: "Correct. Open your browser's DevTools Network tab before dropping a PDF into any of our tools and watch — there will be no outgoing request containing the file. Processing happens in JavaScript and WebAssembly in your browser. This is also why the tools work offline (try pressing Cmd/Ctrl+Shift+T to duplicate the tab, disconnect from Wi-Fi, and use the tool — it still works).",
      },
      {
        q: "Why is the compressed file smaller but the text looks the same?",
        a: "PDFs often embed images at higher resolution than screens can display. The compressor downsamples embedded images to 150 DPI (sufficient for on-screen and typical print) and re-encodes them as efficient JPEG 2000 or JPEG. Text — which is stored as vector glyphs — is not re-encoded, so it stays crisp.",
      },
      {
        q: "Can I merge more than 10 PDFs at once?",
        a: "Yes, up to about 100 PDFs totaling ~500 MB in most modern browsers. Performance depends on your device's RAM. If you need to merge more than that, split into batches of 50 or so.",
      },
      {
        q: "Will Password Protect PDF work against professional unlock services?",
        a: "It applies AES-256 with the password you supply — the same encryption Adobe Acrobat uses. A strong password (16+ mixed characters) is practically unbreakable without the password. Weak passwords (dictionary words, dates of birth) can be brute-forced by specialised software in hours-to-days. Combine a strong password with the 'disable printing' and 'disable copying' owner permissions for layered protection.",
      },
      {
        q: "Does the PDF to Word conversion preserve formatting?",
        a: "It preserves text content, paragraph structure, and most tables. Complex layouts (multi-column magazines, PDFs built from image scans, heavy diagrams) often lose some formatting during conversion because Word's document model and PDF's fixed-layout model do not map cleanly. For invoices, letters, and simple reports, the conversion is usually clean enough to edit directly.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 13. Math & Algebra Tools — 9 tools
  // ──────────────────────────────────────────────────────────────────────
  math: {
    whatIs:
      "Math tools on SabTools.in solve the specific algebra, arithmetic, and geometry problems that come up in everyday Indian life and school curricula — percentage change when a stock moves, ratios when splitting a bill, LCM/HCF when your child's CBSE homework asks for it, square root and cube root without a bulky scientific calculator. Each tool shows the steps, not just the answer, because understanding how the result was derived is the difference between learning and guessing.",
    keyFeatures: [
      {
        title: "Step-by-step working",
        description:
          "Every math tool shows the formula, the substituted values, and the intermediate steps. A 'Why this answer?' section explains the reasoning in plain English suitable for a Class 8-12 student.",
      },
      {
        title: "CBSE/ICSE/State-board aligned",
        description:
          "The LCM/HCF tool uses the prime-factor method that NCERT textbooks demonstrate; the Quadratic Equation solver shows discriminant analysis; the Percentage Calculator handles the five most common school variants (what is X% of Y, X is what % of Y, increase/decrease, reverse percentage, difference percentage).",
      },
      {
        title: "Arbitrary-precision arithmetic",
        description:
          "Where browser floating-point would introduce rounding (0.1 + 0.2 ≠ 0.3), our calculators use BigInt or string-based arithmetic. Percentages and fractions are computed with integer math where possible to avoid rounding artefacts.",
      },
      {
        title: "Fraction, decimal, and mixed-number output",
        description:
          "The Fraction Calculator adds, subtracts, multiplies, and divides fractions and returns results in reduced form (lowest terms), decimal form, and mixed-number form — because different boards and different chapters want different formats.",
      },
    ],
    useCases: [
      {
        title: "Helping a child with homework",
        description:
          "The LCM/HCF Calculator, Prime Factorization Calculator, and Quadratic Equation Solver cover the most common Class 6-10 math questions. Each shows the steps in the format NCERT expects, so parents can walk through the process with their child instead of just giving the answer.",
      },
      {
        title: "Daily percentage calculations",
        description:
          "Shopping discount (₹1,499 at 23% off), restaurant bill with GST and service charge, mobile data plan comparison, loan interest reverse-calculation. The Percentage Calculator handles all five variants with one-click preset buttons labelled by use case.",
      },
      {
        title: "Measurement and geometry",
        description:
          "Rooms painted, tiles needed, wallpaper squared up — the Area Calculator (triangle, rectangle, circle, trapezoid, polygon), Volume Calculator (cube, cylinder, cone, sphere), and Surface Area Calculator apply the classic geometry formulas with unit-aware inputs.",
      },
      {
        title: "Competitive exam preparation",
        description:
          "SSC, banking, NTPC, and MBA aptitude tests rely heavily on percentages, ratios, averages, LCM/HCF, time-speed-distance, and mixture-alligation. The Averages Calculator, Ratio Calculator, and Time Speed Distance Calculator target these topics with shortcuts (tricks) alongside the textbook method.",
      },
    ],
    howToChoose:
      "For word-problem homework — the calculator matching the topic: LCM/HCF, Quadratic, Percentage, Ratio, Averages. For real-world numbers — Percentage, Fraction, Ratio. For measurement — Area, Volume, Surface Area. For exam prep — check if the tool has a 'Show trick' or 'Show alternative method' toggle; those expose the shortcut-method answer that competitive exams reward.",
    indianContext:
      "Indian school mathematics has a distinct flavour — NCERT, CBSE, ICSE, Tamil Nadu State Board, Maharashtra State Board, and Karnataka State Board each emphasise slightly different solution methods. Our step-by-step outputs follow the NCERT style by default (the most widely adopted), with a toggle for 'Shortcut method' that shows the ratio-and-alligation tricks popular in SSC and banking exam coaching. Competitive-exam students especially look for both — textbook rigour for the answer key, shortcut for the exam clock. Numbers in outputs are formatted in Indian number format (lakh, crore with correctly placed commas) so a currency answer of ₹1,23,45,678 reads naturally, not ₹12,345,678 the international format uses.",
    pillarFaqs: [
      {
        q: "Are the steps shown identical to what NCERT prescribes?",
        a: "For the core topics (LCM/HCF, quadratic, percentages, ratios), yes — we follow the NCERT textbook method closely enough that the working looks like a well-written answer. For topics where competing methods exist (e.g., prime factorisation vs division method for HCF), the tool shows the default and lets you toggle to the alternative.",
      },
      {
        q: "Why does my percentage answer end in .9999999 sometimes?",
        a: "If you are seeing floating-point artefacts like 17.999999%, tap the 'Round to 2 decimals' toggle — that is the standard display format. Internally the calculator uses integer math where possible, but very small residuals can slip through when you compound multiple operations. The exact answer (as a reduced fraction) is always shown below the decimal form.",
      },
      {
        q: "Does the Quadratic Equation solver handle complex (non-real) roots?",
        a: "Yes. When the discriminant is negative, the solver returns complex conjugate roots in the form a ± bi and shows the discriminant calculation so you understand why the roots are complex. For Class 10 where students typically haven't met complex numbers, there is a 'Real roots only' toggle that explains when no real solution exists.",
      },
      {
        q: "Can I use these tools for competitive exam practice?",
        a: "Yes. We mark the tools most used for SSC, IBPS, CAT, and GATE prep with an 'Exam-ready' tag and enable the shortcut-method toggle by default there. The Time Speed Distance, Ratio, Averages, and Percentage calculators have dedicated shortcut modes covering common exam question patterns.",
      },
      {
        q: "Does the Area Calculator accept inputs in sq.ft, m², and bigha?",
        a: "For geometric area calculations (given a triangle's sides, or a rectangle's dimensions) inputs are in your chosen length unit — metres, feet, inches — and the answer is in the corresponding area unit. If you need to convert the final area to bigha, cent, or acre, pass it through the Area Converter (in the converters category).",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 14. Date & Time Tools — 9 tools
  // ──────────────────────────────────────────────────────────────────────
  datetime: {
    whatIs:
      "Date and time tools on SabTools.in compute the answers to the 'exactly how many days?' questions that come up around birthdays, retirement planning, pregnancy tracking, leave calculations, and government-form deadlines. Age in years-months-days, working days between two dates excluding Indian holidays, date after N working days, time elapsed since a given timestamp, time zone conversion between IST and major global zones — each tool uses the IANA time-zone database so daylight-saving transitions and leap years are handled correctly.",
    keyFeatures: [
      {
        title: "IANA time-zone correct",
        description:
          "Every date calculation uses the modern IANA tz database (Asia/Kolkata for IST) so leap years, leap seconds, historical DST rules, and zone boundary changes are applied correctly — something naive JavaScript Date arithmetic often gets wrong.",
      },
      {
        title: "Indian public-holiday aware",
        description:
          "The Working Days Calculator excludes Sundays, Saturdays (if you choose 5-day week), and a built-in list of Central Government holidays including the 2026 gazetted list. State-specific holidays can be added with one click.",
      },
      {
        title: "Multi-calendar support",
        description:
          "Gregorian for civilian use, Vikram Samvat and Saka for tradition, Hijri for Islamic dates. Age Calculator shows all three when enabled, because elders and festival dates use non-Gregorian systems.",
      },
      {
        title: "Second-level precision",
        description:
          "Countdown timers, stopwatches, and 'time since' calculators update every second with drift correction, so a 180-day countdown is accurate to the second — not off by 2-3 minutes by the end like lazy JavaScript timers.",
      },
    ],
    useCases: [
      {
        title: "Age for exam, passport, and government form eligibility",
        description:
          "UPSC, SSC, banking, and state-service forms require 'age as of 1st August 2026' or similar cut-off dates. The Age Calculator computes age in years-months-days for any arbitrary reference date, so eligibility can be confirmed to the day before filling the form.",
      },
      {
        title: "Pregnancy and delivery due date",
        description:
          "The Due Date Calculator implements the Naegele rule (LMP + 280 days) with a fetal-age toggle, trimester markers at 13 and 27 weeks, and milestone dates for the first anomaly scan, gestational diabetes test, and second ANC appointment — aligned with Indian obstetric practice.",
      },
      {
        title: "Leave and holiday planning",
        description:
          "Working Days Calculator tells you how many earned-leave days you will use if you travel between two dates, factoring in weekends and gazetted holidays. The Leave Planner tool extends this with sandwich-leave analysis (can I bridge two long weekends with 3 leaves?).",
      },
      {
        title: "Retirement, superannuation, and FD maturity dates",
        description:
          "Date Difference Calculator tells you the exact duration to your retirement, your FD's maturity date, or a lock-in ending date. Useful for ELSS lock-in (3 years from investment), PPF maturity (15 years), and NPS exit windows (age 60).",
      },
    ],
    howToChoose:
      "For age / duration between two dates — Age Calculator or Date Difference Calculator. For future-date arithmetic — Add Days to Date, Working Days After Today. For timezone — Time Zone Converter. For countdown or stopwatch — Countdown Timer, Stopwatch. For medical — Due Date Calculator, Gestational Age Calculator. All tools accept manual entry or quick-picks (today, yesterday, 1 Jan this year, etc.).",
    indianContext:
      "Indian date usage mixes Gregorian (civilian, legal, corporate), Vikram Samvat (Hindu almanacs and some traditional contexts), Saka (the national calendar used by the Government of India), and Hijri (Islamic religious calendar) — plus dozens of regional New Year conventions (Ugadi, Gudi Padwa, Puthandu, Pohela Boishakh). Our tools show the Gregorian answer by default but can render dates in any of these calendars when enabled. Working-day calculators know the 18 Central Government gazetted holidays and the typical state-declared optional holidays, and update annually as the next year's gazette is published. Date formats default to DD-MM-YYYY (Indian convention) not MM-DD-YYYY (American) or YYYY-MM-DD (ISO) — though ISO is available as a toggle for developers.",
    pillarFaqs: [
      {
        q: "Why does my age calculator result differ from what I used on another site?",
        a: "Most likely reason: reference-date difference. A birthday of 15 August 1990 gives age 35 on 14 August 2026 but age 36 on 15 August 2026. Confirm both sites use the same reference date. The second reason: some sites count 'full years only' while we also report years-months-days. 35y 11m 29d and 36y 0m 0d are one day apart.",
      },
      {
        q: "Does the Working Days Calculator know about Dussehra and Diwali?",
        a: "Yes. The built-in holiday list includes all gazetted Central Government holidays plus the major festivals observed across most of India. State-specific holidays (like Ugadi for Karnataka/AP/Telangana or Pohela Boishakh for West Bengal) are added when you select a state from the dropdown.",
      },
      {
        q: "Is the Due Date Calculator a medical advice tool?",
        a: "No — it implements the standard obstetric formula used by Indian OBGYNs as an initial estimate. Actual due dates and milestone timing should be confirmed by your attending doctor after ultrasound dating. Treat the tool as a starting point for planning, not a substitute for clinical assessment.",
      },
      {
        q: "How accurate is the Time Zone Converter around DST transitions?",
        a: "It uses the IANA tz database which is the authoritative source for DST rules globally. Around the 'spring forward' and 'fall back' weekends in the US, UK, and EU, the converter correctly applies the 1-hour shift on the right date. India (IST) does not observe DST, so IST ↔ any zone conversion is straightforward year-round.",
      },
      {
        q: "Do your tools handle leap years and the Feb 29 edge case?",
        a: "Yes. Feb 29 birthdays default to Feb 28 in non-leap years with a toggle for Mar 1 (both conventions exist in Indian legal practice). Year-difference calculations correctly count 2024 as 366 days. The Age Calculator displays a 'leap year' badge when a birthday falls on Feb 29.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 15. India Guides — 10 tools
  // ──────────────────────────────────────────────────────────────────────
  indiaguide: {
    whatIs:
      "India Guide tools on SabTools.in answer the India-specific questions that no global tool gets right — what is the correct format for an Indian postal address, how do I read a PAN or Aadhaar number, what does IFSC code ABCD0012345 tell me about a bank branch, what is the GST number format, how are PIN codes organised, what is my closest post office. These tools exist because an international address-validator does not know that 'Tamil Nadu' and 'Tamilnadu' are both valid state names, that 'Bangalore' and 'Bengaluru' refer to the same city, or that a 6-digit PIN encodes region-delivery-office structure that can be parsed.",
    keyFeatures: [
      {
        title: "Authoritative-source data",
        description:
          "PIN code data from India Post's official directory; IFSC code data from the RBI IFSC master list; STD codes from the Department of Telecom; state/district hierarchy from the Ministry of Home Affairs census. Refreshed on a rolling schedule as official sources update.",
      },
      {
        title: "Format validation per Indian conventions",
        description:
          "PAN format ABCDE1234F (5 letters + 4 digits + 1 letter); GSTIN 15 characters with state code and checksum; Aadhaar 12 digits with Verhoeff checksum; IFSC 11 characters with 4-letter bank prefix. Each validator knows the structure and points to the specific invalid component.",
      },
      {
        title: "Lookup and reverse lookup",
        description:
          "PIN code → city/state; city → PIN codes; IFSC → bank/branch/address; bank+branch → IFSC candidates. Useful for form-filling, cheque printing, and validating customer data in your CRM.",
      },
      {
        title: "DPDP-compliant privacy stance",
        description:
          "Lookups run entirely against our published data without sending queries to third-party servers. Your customer's Aadhaar number is never validated against UIDAI's live service from our page — we only check format and checksum, never authenticity.",
      },
    ],
    useCases: [
      {
        title: "E-commerce and logistics address validation",
        description:
          "The PIN Code Lookup checks whether the entered PIN matches the entered city/state, flagging mismatches before the order ships. Use it to fill in state automatically from a valid PIN — eliminating the most common data-entry error in Indian e-commerce. For a broader postal-zone reference, the Indian PIN Code Directory lists all 9 zones.",
      },
      {
        title: "Banking and finance form-filling",
        description:
          "The IFSC Code Lookup returns the branch name, address, and bank for a given IFSC — useful when a customer supplies an IFSC but spells the branch wrong. For reverse search (bank + branch → IFSC), the IFSC Bank Details tool handles the 'I have the branch but not the IFSC' case.",
      },
      {
        title: "GST and tax compliance",
        description:
          "The GST Number Validator checks the 15-character GSTIN format and state code. It does not confirm registration status against the GSTN (that requires an authenticated API call), but catches the majority of data-entry errors — wrong length, wrong state code, wrong checksum — at the point of invoice entry. For invoice creation itself, the GST Invoice Generator and GST Calculator cover the downstream workflow.",
      },
      {
        title: "Travel and India reference",
        description:
          "Reference lookups like which Indian city uses STD code 044 (Chennai), 022 (Mumbai), or 080 (Bengaluru), the Indian Festival Calendar for 2025-2030 religion-filtered holidays, the Indian Calendar for Saka/Vikram Samvat cross-reference, and the Indian Name Meaning tool cover the 'need a quick India fact' questions that come up constantly in document drafting. For railway reservations, the Indian Railway PNR and Train Seat Layout tools help travellers understand coach structure before booking.",
      },
    ],
    howToChoose:
      "For address data — use the PIN Code Lookup and the broader Indian PIN Code Directory. For banking — IFSC Code Lookup for quick one-off queries, IFSC Bank Details when you need the full branch record. For tax — PAN Card Validator and GST Number Validator; the GST Invoice Generator covers the downstream invoice workflow. For identity — the Aadhaar Validator checks Verhoeff format only (we never validate authenticity against UIDAI from any of these pages), and Aadhaar Masked Generator produces the 4-last-digits redacted form safe to share. For travel and reference — Indian Railway PNR, Train Seat Layout, Indian Festival Calendar, and Indian Name Meaning cover everyday India lookups. Use the validators upstream of data-entry to catch errors; use the lookups for reference and auto-filling forms.",
    indianContext:
      "India's identifier formats are specific to India and usually encoded with more structure than an opaque ID number — a PAN carries category (P=person, C=company, H=HUF, etc.), a GSTIN carries state code, a PIN has region/subregion/delivery-office structure, an IFSC prefixes the bank and sub-identifies the branch. Our validators do not just check length; they check that each positional component is valid in context. For example, a PAN of ABCDE1234F where the fifth letter does not match the first letter of the surname (for individuals) would still pass basic validation but fail semantic validation — we flag both classes of issue and explain the difference. We never submit numbers to UIDAI, Income Tax, or GSTN servers from our page — that would be a privacy violation. Format validation only; authenticity checks are the enterprise's job through authenticated APIs.",
    pillarFaqs: [
      {
        q: "Does 'Validate Aadhaar' check whether the Aadhaar number is real?",
        a: "No. We only verify that the number is 12 digits and passes the Verhoeff checksum algorithm (which catches most typos). Checking whether an Aadhaar is actually issued requires an authenticated API call to UIDAI, which only licensed entities (KUAs) can make. Never send Aadhaar numbers to unofficial services claiming to verify authenticity — that is almost certainly a data-harvesting scam.",
      },
      {
        q: "How current is the PIN code and IFSC data?",
        a: "PIN codes are refreshed from India Post's directory quarterly — the underlying data changes rarely (new PINs are added, none are retired). IFSC codes are refreshed from the RBI master list monthly, since bank mergers (SBI absorbing associate banks, Bank of Baroda absorbing Vijaya and Dena) sometimes retire IFSC codes.",
      },
      {
        q: "Why does my PAN pass format validation but my CA says it is invalid?",
        a: "Format validation checks the 10-character structure and that the fifth letter is A-Z (not a semantic check). Semantic validation — that the fifth letter matches the surname's first letter for individuals, or the entity name's first letter for companies — is an additional check we surface on a separate button. Full authenticity (does this PAN belong to this name) requires an Income Tax Department API call your CA can make.",
      },
      {
        q: "Is there a difference between GSTIN and GSTN?",
        a: "GSTIN is the 15-character Goods and Services Tax Identification Number assigned to each registered taxpayer. GSTN is the Goods and Services Tax Network — the IT infrastructure operator that runs the portal and APIs. People sometimes use GSTN informally to mean GSTIN, but technically they are different.",
      },
      {
        q: "Can I use the IFSC lookup result directly on my cheque or NEFT form?",
        a: "Yes — the branch address returned is the RBI-published address that banks accept. However, always cross-check with your account holder's passbook or the bank's own website before a high-value transfer, because branches occasionally relocate and the RBI file takes a few weeks to reflect changes.",
      },
    ],
  },

  science: {
    whatIs:
      "Science and math tools on SabTools.in cover the symbolic, numeric, and statistical work that students and working engineers do every day — solving a quadratic in closed form, multiplying two matrices, reducing a fraction, checking whether 10007 is prime, computing a t-test, evaluating a trigonometric expression, converting binary to decimal. These are the tasks calculators on phones handle badly (because they are built for arithmetic, not algebra) and spreadsheet software handles awkwardly (because it lacks symbolic reasoning). Each tool here is purpose-built for one class of problem and explains its answer — the Quadratic Solver does not just return roots, it shows the discriminant and whether the roots are real or complex; the Matrix Calculator shows row-reduction steps; the Statistics Calculator shows the formula before plugging in numbers. Good for homework, good for engineering reference, good for the SSC/JEE/GATE student who wants to check their working.",
    keyFeatures: [
      {
        title: "Step-by-step working shown",
        description:
          "Every answer includes the intermediate steps — the Quadratic Solver shows discriminant computation and both roots; the Algebra Solver shows each transposition and simplification; the Matrix Calculator shows elementary row operations for row-reduction and inverse. Students learn the method by reading the explanation, not just the answer.",
      },
      {
        title: "Symbolic and numeric modes",
        description:
          "The Fraction Calculator works in exact rational arithmetic (no floating-point drift); the Trigonometry Calculator accepts degree or radian input; the Prime Number Checker uses trial division with optimised skip patterns for small primes. Switch between exact and decimal output as the problem demands.",
      },
      {
        title: "Graphing with adjustable ranges",
        description:
          "The Graphing Calculator plots y = f(x) for polynomial, rational, exponential, logarithmic, and trigonometric functions with zoom, pan, and grid controls. Useful for visualising behaviour near a root, identifying asymptotes, or sanity-checking a symbolic answer against the curve's shape.",
      },
      {
        title: "Distribution-aware statistics",
        description:
          "The Statistics Calculator distinguishes sample vs. population standard deviation, computes mean/median/mode/quartiles, and shows the distribution of the input data. The Probability Calculator covers binomial, Poisson, and normal distributions with tail probabilities and cumulative values.",
      },
    ],
    useCases: [
      {
        title: "Homework verification and learning",
        description:
          "Use the Algebra Solver to check your working on a homework equation — the tool's step-by-step output tells you where you went wrong, not just that you got the wrong answer. The Quadratic Solver is the fastest way to verify a factoring attempt; the Fraction Calculator catches simplification errors.",
      },
      {
        title: "Engineering and coursework reference",
        description:
          "The Matrix Calculator solves up to 4x4 systems for linear algebra coursework and circuit analysis. The Trigonometry Calculator evaluates compound identities for mechanical engineering problems. The Statistics Calculator computes regression coefficients for lab-data analysis. Cite the formula used in your report.",
      },
      {
        title: "Exam preparation checking",
        description:
          "JEE and BITSAT aspirants use the Graphing Calculator to visualise conic-section problems and check intuition on function behaviour. NEET physics problems involving projectile motion benefit from the Quadratic Solver for range calculations. The Probability Calculator covers the distribution questions that appear in GATE and actuarial exams.",
      },
      {
        title: "Data science and analyst tasks",
        description:
          "Quick statistical summaries (mean, variance, confidence intervals) for a small dataset without opening Python or Excel. The Binary Calculator converts between binary, octal, decimal, and hex for bit-level work and is particularly useful when debugging bitmask flags or IP-subnet arithmetic alongside the network tools in the developer category.",
      },
    ],
    howToChoose:
      "For algebra problems — Quadratic Solver for degree-2 equations, Algebra Solver for general linear and polynomial equations up to degree 4. For matrix work — Matrix Calculator covers addition, multiplication, inverse, determinant, and eigenvalues up to 4x4. For number work — Fraction Calculator for exact rational arithmetic, Prime Number Checker for primality testing, Binary Calculator for base conversions. For statistics — Statistics Calculator for descriptive stats, Probability Calculator for distribution tail probabilities. For trigonometry — Trigonometry Calculator evaluates any standard identity with degree/radian toggle. For visualisation — the Graphing Calculator handles most classroom functions; it is not a replacement for Desmos or GeoGebra for advanced work, but it is enough for homework and quick sanity checks. Switching between tools is one click — the category navigation is built around problem type, not subject area, so you can go from a Quadratic Solver root to a Graphing Calculator plot to verify the parabola's shape.",
    indianContext:
      "Indian school and entrance-exam syllabi (CBSE, ICSE, State Boards, NEET, JEE Main, JEE Advanced, GATE) weight algebra, trigonometry, and probability heavily — Class 10 board exams rely on the Quadratic Solver's exact-roots behaviour, Class 12 CBSE includes matrix operations in the Class 12 curriculum, and JEE regularly asks conic-section identification that the Graphing Calculator visualises in one click. Unlike US-market tools built around AP Calculus and graphing-calculator-on-a-TI-84 conventions, our defaults match Indian textbook conventions: degrees-first for trigonometry (CBSE default), Indian number formatting with lakhs and crores in the Statistics Calculator for data problems drawn from Indian economic datasets, and explicit exact-fraction mode for the rational-arithmetic questions that dominate Class 9-12 algebra. None of these tools require internet once loaded — the computation runs in your browser, so rural students on unstable connections can bookmark the page once and use it offline.",
    pillarFaqs: [
      {
        q: "How large can matrices and systems get in the Matrix Calculator?",
        a: "Up to 4x4 for inverse and determinant, up to 5x5 for addition and multiplication. Beyond that, numerical stability on small floats becomes an issue in the browser and you are better off using NumPy or Octave. For classroom and exam prep, 4x4 covers everything in CBSE/JEE/GATE syllabi.",
      },
      {
        q: "Does the Quadratic Solver handle complex roots?",
        a: "Yes. When the discriminant is negative, the Quadratic Solver returns the two complex-conjugate roots in a + bi form and explains that the parabola does not cross the x-axis. Useful for physics problems where 'no real root' has a physical meaning (projectile never reaches target).",
      },
      {
        q: "Is the Graphing Calculator as capable as Desmos?",
        a: "No — Desmos is a full symbolic graphing platform with implicit functions, inequalities, sliders, and animation. Our Graphing Calculator plots explicit y = f(x) for polynomial, exponential, logarithmic, and trigonometric functions with zoom and pan. It is sufficient for Class 10-12 homework and JEE-level intuition building, not for research-grade visualisation.",
      },
      {
        q: "How does the Prime Number Checker perform on large numbers?",
        a: "For numbers up to about 10^15, it returns an answer in milliseconds using optimised trial division with wheel factorisation. For larger numbers (cryptographic-grade), the tool will still return an answer but response time grows — and you should use Miller-Rabin probabilistic tests on a proper cryptography library, not a browser tool.",
      },
      {
        q: "Can I use the Statistics Calculator for my research project?",
        a: "For descriptive statistics, confidence intervals, and basic hypothesis tests (one-sample t-test, chi-square goodness-of-fit), yes. For complex multi-variable regression or ANOVA with interaction terms, we do not replace R, Python's statsmodels, or SPSS — those are the right tool for published research. Our calculator is for quick answers and homework.",
      },
    ],
  },

  construction: {
    whatIs:
      "Construction tools on SabTools.in calculate the quantity, cost, and loading figures that decide a residential or small-commercial build — how much concrete for a slab of given thickness, how much steel per cubic metre of concrete at a given reinforcement ratio, how many sheets of plywood for a given floor area with a given sheet size, what a staircase should measure given total rise and tread count, what flooring a given area costs at a given tile price, how much a water tank of given capacity weighs when full. These are the calculations a site supervisor runs every day with a scratchpad; we build them as one-click tools with Indian defaults (IS 456 grades for concrete, Fe 415 and Fe 500 for steel, 19 mm and 12 mm plywood thicknesses). For a homeowner planning a 1,000 sq ft build, these tools turn a contractor's quote into a number you can sanity-check against material quantities before you sign.",
    keyFeatures: [
      {
        title: "IS-code and Indian-standard defaults",
        description:
          "Concrete Calculator defaults match IS 456 grades (M15, M20, M25 with 1:2:4, 1:1.5:3, 1:1:2 mix ratios); Steel Weight Calculator uses TMT bar weights per IS 1786 (Fe 415, Fe 500, Fe 550 densities); Plywood Calculator uses IS 303 commercial plywood sheet sizes. Defaults match what your supplier actually sells.",
      },
      {
        title: "Material quantity and cost in one step",
        description:
          "Concrete Calculator returns cement bags, sand cubic feet, and coarse-aggregate cubic feet for the mix ratio; Flooring Cost Calculator multiplies area by tile price including 10% wastage allowance; Steel Weight Calculator reports tonnes so you can cross-check against the delivery challan.",
      },
      {
        title: "Dimension safety and code-compliance",
        description:
          "Staircase Calculator validates against the Class-II residential standard (max 190 mm riser, min 240 mm tread, min 63° slope); Roof Area Calculator distinguishes flat, pitched, and hip-roof topology and computes the actual slope-length area (not the plan projection).",
      },
      {
        title: "Indian-rupee cost output with 2025 rates",
        description:
          "Default unit prices reflect 2025 tier-2-city Indian market rates — ₹380-420 per 50 kg cement bag, ₹65,000-72,000 per tonne of TMT Fe 500, ₹1,800-2,400 per square metre of premium vitrified tile. Override with your supplier's quote to get a like-for-like comparison against the contractor's BOQ.",
      },
    ],
    useCases: [
      {
        title: "Home-build BOQ verification",
        description:
          "Before signing a build contract, run the Concrete Calculator for each slab and beam in the architect's drawing, total the cement/sand/aggregate, and compare against the contractor's material quantity sheet. A 20% overstatement on cement is not unusual and this 30-minute exercise pays for itself many times over.",
      },
      {
        title: "Renovation and flooring budget",
        description:
          "Homeowner replacing tiles in a 1,200 sq ft flat uses the Flooring Cost Calculator with the chosen tile rate and wastage factor to get a material budget. Combine with the Room Paint Visualizer to budget paint quantities — 1 litre covers 10-12 sq m on first coat, 12-14 sq m on second coat; the tool accounts for that and rooms' door/window deductions.",
      },
      {
        title: "Structural steel estimation",
        description:
          "The Steel Weight Calculator takes diameter (8 mm, 10 mm, 12 mm, 16 mm, 20 mm, 25 mm) and length to give tonnes. For a small residential build, reinforcement is 80-100 kg per cubic metre of concrete — cross-check this ratio with the Concrete Calculator total volume to spot under- or over-ordering of TMT bars.",
      },
      {
        title: "Water, staircase, and utility dimensioning",
        description:
          "Water Tank Calculator sizes overhead and underground tanks by family size and storage days (135 L per person per day is the IS 1172 standard for Indian domestic use); Staircase Calculator checks step geometry against the residential code; Electrical Load Calculator sizes the service connection for a given appliance mix and Pipe Size Calculator sizes plumbing branches for peak simultaneous flow.",
      },
    ],
    howToChoose:
      "For structural material — Concrete Calculator for any slab, beam, column, or footing volume in cubic metres; Steel Weight Calculator alongside it to convert reinforcement to tonnes. For finishing — Flooring Cost Calculator for tiles, marble, laminate, or vinyl; Room Paint Visualizer for wall paint. For civil dimensioning — Staircase Calculator for step geometry, Roof Area Calculator for pitched or hipped roofs, Water Tank Calculator for tank sizing. For services — Electrical Load Calculator for the kW service connection, Pipe Size Calculator for plumbing branches. For wooden components — Plywood Calculator for doors, kitchen carcasses, and partition work. Most residential builds need 6-8 of these in sequence; run them in the order of the build phases (foundation → structure → finishing) and keep the outputs in a spreadsheet alongside the contractor's BOQ so you can compare line-by-line before payment. None of these tools replace a structural engineer for anything above G+1 construction — they are for sanity-checking quantities, not for load-bearing design decisions.",
    indianContext:
      "Indian construction runs on a very specific material palette and set of conventions that the global construction calculators get wrong. Concrete mix is specified as grade (M20, M25) not PSI, with the nominal mix ratio explicit (1:1.5:3 for M20). TMT bars are priced per tonne at a market rate linked to the Mumbai steel index — fluctuating 10-15% month-on-month and always quoted in rupees. Plywood is specified as BWP (Boiling Water Proof, IS 303) or MR (Moisture Resistant) with 19 mm, 12 mm, and 8 mm as the common thicknesses, not the 3/4-inch Imperial dimensions. Water consumption is 135 L per person per day per IS 1172, and tank capacity must also account for the municipal supply's irregular hours (in Chennai or Bengaluru, plan for 2-3 days of storage). Residential stair geometry must match the NBC 2016 code for the local municipal by-laws. Every default in these tools is set for Indian conventions — override only if you are working internationally or in a special case.",
    pillarFaqs: [
      {
        q: "Is the Concrete Calculator suitable for RCC design or just estimation?",
        a: "Estimation only. It computes material quantities for a given volume at a given mix ratio, which is what you need for procurement and cost budgeting. RCC design — reinforcement placement, development length, moment capacity — requires a licensed structural engineer. For anything above G+1, do not build from this tool's output alone.",
      },
      {
        q: "How accurate are the 2025 material rates in the Flooring Cost Calculator?",
        a: "Rates are representative averages for tier-2 Indian cities (Bhubaneswar, Nashik, Ludhiana, Coimbatore) based on 2025 market data. Tier-1 cities run 15-25% higher; rural areas 10-20% lower. Always override with your actual supplier quote for the final budget — the tool is for first-cut estimation, not binding quotes.",
      },
      {
        q: "Why does the Staircase Calculator warn about my design even when it looks reasonable?",
        a: "It checks against the NBC 2016 residential standard: riser between 150-190 mm, tread between 240-300 mm, and a preferred 2R + T = 600 mm comfort rule. Designs outside that range are legal but uncomfortable or fatiguing. The warning is not blocking — you can override and proceed — but it catches the common error of under-tread (narrow step, trip hazard).",
      },
      {
        q: "Does the Water Tank Calculator handle the Chennai-style 2-day-storage requirement?",
        a: "Yes — there is a 'storage days' input that defaults to 1 day (adequate for metros with 24x7 supply) but accepts 2 or 3 days for cities with intermittent supply. A family of 4 needs 540 L/day at IS 1172 standard; a 2-day storage means a 1,100 L overhead tank plus the underground sump.",
      },
      {
        q: "Can the Electrical Load Calculator tell me whether I need a single-phase or 3-phase connection?",
        a: "Yes — it sums appliance loads in kW and flags when total diversified load exceeds 5-7 kW (the practical single-phase ceiling for most Indian DISCOMs). Above that, 3-phase is recommended for proper load balancing and to avoid overload on a single phase. Final decision depends on the DISCOM's tariff and connection rules in your state.",
      },
    ],
  },

  exam: {
    whatIs:
      "Exam and competitive tools on SabTools.in handle the score-prediction and percentile math that every Indian entrance-exam aspirant faces — given raw marks, what is the likely rank, what score does a target college need, what does a percentile of 87.5 convert to in absolute score, what board percentage do I need to be shortlisted, what is the notional cost of a five-year college programme, am I eligible for a given scholarship. These are calculations that determine career paths for millions of students each year and that are usually done on scratch paper using formulas copied from coaching-institute notes. We turn each into an explicit tool that shows the formula, the inputs, and the answer with caveats. For the NEET/JEE/GATE/CAT aspirant, these tools complement the actual exam — use them after the answer key is released to estimate rank before official results, and during counselling to map rank to likely college admissions.",
    keyFeatures: [
      {
        title: "Historic cutoff data for score-to-rank mapping",
        description:
          "NEET Score Predictor and JEE Rank Predictor use the last 5 years of All India Rank distribution data to convert raw/NTA score to expected rank band. Accuracy is ±5-8% of actual rank in most cases — not a guarantee, but a realistic expectation band for counselling decisions.",
      },
      {
        title: "Exam-specific normalisation handled",
        description:
          "JEE Main and CAT use session-normalised percentile, not raw score — the tools accept either input and convert correctly. GATE Score Calculator applies the official GATE normalisation formula (GATE score = 350 + 250 × (actual_marks - qualifying_marks) / (topper_marks - qualifying_marks)) with caveats around multi-session normalisation.",
      },
      {
        title: "Board-agnostic percentage computation",
        description:
          "Board Percentage Calculator handles CBSE, ICSE, and all State Board schemes — CBSE best-of-5, ICSE best-of-4 (with English compulsory), Tamil Nadu board total, Maharashtra HSC total. Each scheme has its own aggregation rule and the tool applies the right one based on your board selection.",
      },
      {
        title: "Scholarship and eligibility filtering",
        description:
          "Scholarship Eligibility Checker covers central schemes (NSP portal scholarships — Post-Matric, Top-Class, Merit-cum-Means for minorities), state schemes (Tamil Nadu Chief Minister's Merit Scholarship, Karnataka Vidyasiri, Gujarat MYSY), and private-sector awards (Tata, KC Mahindra, Reliance Foundation). Enter income, category, and board percentage; the tool returns a ranked list of schemes you qualify for.",
      },
    ],
    useCases: [
      {
        title: "Post-exam rank estimation",
        description:
          "Answer key is out. Compute raw score. Run NEET Score Predictor or JEE Rank Predictor to get expected AIR band. This is the critical 48-hour window between answer-key release and result announcement where coaching institutes charge ₹3,000-₹5,000 for the same calculation — the tool is free and takes 30 seconds.",
      },
      {
        title: "College choice and counselling planning",
        description:
          "Expected rank in hand, use historic branch/college cutoffs to plan JoSAA or state-level counselling preferences. The CAT Percentile Calculator combines with IIM cutoff data to rank realistic target IIMs and alternate schools before the WAT-PI call stage.",
      },
      {
        title: "Board exam target-setting",
        description:
          "Class 12 student targeting a specific college uses Board Percentage Calculator to determine the minimum mark per subject that would hit the aggregate target. Works backwards from 'I need 92% for Delhi University Maths' to 'I need 91 in Physics, 95 in Maths, 90 in Chemistry, 92 in English' given the best-of-4 rule.",
      },
      {
        title: "College-cost and scholarship planning",
        description:
          "College Fee Calculator estimates 4-year or 5-year total cost including hostel, mess, books, and entrance-processing charges — useful for comparing IIT Delhi vs. a private engineering college. Scholarship Eligibility Checker identifies the schemes that would offset that cost given family income and category.",
      },
    ],
    howToChoose:
      "For score-to-rank prediction after an exam — NEET Score Predictor for MBBS/BDS, JEE Rank Predictor for engineering (BE/BTech), GATE Score Calculator for postgraduate engineering and PSU recruitment, CAT Percentile Calculator for management. Each uses that exam's specific normalisation. For board marks computation — Board Percentage Calculator for Class 10 or 12 board aggregation (input all subject marks, select your board, tool applies the correct best-of-N rule). For pre-exam planning — Marks Percentage Calculator is the generic percentage-of-total tool for internal/external mark aggregation in college courses and for backward-planning a target aggregate. For finance planning — College Fee Calculator for 4-5 year total cost including hidden fees; Scholarship Eligibility Checker to identify offset schemes. Workflow: most users run score predictor first (after answer key), then college fee planner (during counselling application), then scholarship checker (after admission letter). Use them in that order during the exam-to-admission cycle.",
    indianContext:
      "Indian competitive-exam preparation is a high-stakes and high-cost industry — a NEET aspirant in Kota spends ₹4-6 lakh on coaching, a JEE aspirant ₹3-5 lakh, and the difference between rank 500 and rank 5,000 decides whether the family's investment paid off. These tools remove information asymmetry around the rank-prediction and scholarship-eligibility calculations that coaching institutes use as retention hooks. NEET and JEE Main are conducted by NTA with centralised result declaration; cut-offs change year on year based on difficulty, and the historic-cutoff data in our Score Predictor reflects the 5-year rolling window (not the current year, which is not yet known on result day). GATE is conducted by IITs in rotation with a fixed normalisation formula; our GATE Score Calculator matches the official GATE score formula byte-for-byte. Scholarship eligibility changes annually as the NSP portal refreshes; our Eligibility Checker is refreshed every August when the new academic year's schemes open. State-board calculations follow the home state's aggregation rule — Tamil Nadu, Maharashtra, Andhra Pradesh, Kerala, West Bengal each have their own best-of-N rule which our Board Percentage Calculator handles correctly.",
    pillarFaqs: [
      {
        q: "How accurate is the NEET Score Predictor?",
        a: "For ranks in the 500-50,000 range (which covers most government MBBS admissions through AIQ and state quota), accuracy is typically ±5-8% on the predicted rank. For top 500 and below 50,000, accuracy drops because the score-to-rank curve flattens at the extremes. Always treat the prediction as a band, not a point estimate.",
      },
      {
        q: "Does the JEE Rank Predictor give AIR or category rank?",
        a: "Both. It outputs All India Rank (AIR) as the primary number and also your category rank (General, EWS, OBC-NCL, SC, ST, PwD) which is what JoSAA uses for allotment. Category rank is usually much better than AIR for reserved categories — ignoring it leads to false conservatism during counselling.",
      },
      {
        q: "What data does the CAT Percentile Calculator use?",
        a: "It uses the IIM-published percentile-to-normalised-score mapping for the last 5 CAT administrations (three sessions each). Percentile normalisation is session-specific — you cannot compare raw marks across sessions — and our calculator handles that correctly when you enter which session you sat in.",
      },
      {
        q: "Does the Scholarship Eligibility Checker submit applications?",
        a: "No. It only tells you which schemes you qualify for based on your income, category, and academic performance. Submitting applications requires you to apply through the official portals (NSP portal for central schemes, state portals for state schemes, private websites for corporate scholarships). We will not ask for Aadhaar or bank details.",
      },
      {
        q: "How does the College Fee Calculator handle hostel and mess?",
        a: "It has a three-tier preset: metro (IIT Delhi, IIT Bombay, IIM A/B/C — premium hostel and mess costs), tier-1 (other IITs, IIMs, NITs — standard), tier-2 (state government colleges, private tier-2). You can also enter custom figures if the college's official fee structure is published. Books and stationery are estimated at ₹15,000-25,000/year depending on the programme.",
      },
    ],
  },

  business: {
    whatIs:
      "Business tools on SabTools.in handle the small-business finance math that every founder, freelancer, and shopkeeper needs — GST invoices with correct CGST/SGST/IGST breakup, profit-and-loss on a given sales volume and cost structure, break-even analysis for a new product, ROI on a given investment horizon, home-loan affordability based on income and existing liabilities, rent-vs-buy analysis for the real-estate decision that every mid-career professional faces, and carpet-area vs super-built-up conversion for property purchases. These are the calculations that decide whether a business is viable, whether a home is affordable, and whether an investment is worth it. We build each as a single-purpose tool with Indian defaults — GST slabs (0%, 5%, 12%, 18%, 28%), Indian interest-rate bands for home loans (8-9.5% on floating rate in 2025), and the super-built-up-vs-carpet-area gap that the RERA Act 2016 regulates.",
    keyFeatures: [
      {
        title: "GST-compliant invoicing with HSN/SAC",
        description:
          "GST Invoice Generator produces an invoice that matches the GST rules — invoice number with prescribed format, HSN/SAC for each line item, CGST/SGST/IGST split based on intra-state or inter-state supply, total in words, and place of supply. Download as PDF ready for sharing with your customer and uploading to your accountant.",
      },
      {
        title: "Profit-margin and break-even analysis",
        description:
          "Profit & Loss Calculator distinguishes gross margin (revenue minus cost of goods) from net margin (after fixed costs). Break-Even Calculator computes unit sales needed to cover fixed costs — the foundation question for every new product launch.",
      },
      {
        title: "ROI with time-value consideration",
        description:
          "ROI Calculator separates simple ROI from annualised ROI (CAGR), which matters enormously when comparing short-horizon investments against long-horizon ones. A 50% return over 5 years is 8.4% CAGR — much worse than an 8.4% FD, once you factor in compounding.",
      },
      {
        title: "Home-loan and real-estate decision tools",
        description:
          "Home Loan Affordability uses the standard 50% FOIR (fixed-obligation-to-income ratio) rule to compute maximum loan you would realistically be approved for. Rent vs Buy Calculator compares the cost of renting at current rent + inflation against buying at current EMI + maintenance + opportunity cost of down payment, over a 10-20 year horizon.",
      },
    ],
    useCases: [
      {
        title: "Invoice generation for small business and freelancers",
        description:
          "Freelancer or MSME with a GSTIN uses the GST Invoice Generator to issue compliant invoices without buying Tally or Zoho Books. One-time filling of GSTIN, company name, and bank details; thereafter each invoice is 30 seconds. Share the PDF with the client; the format is accepted by any Indian accountant for input-tax-credit claim.",
      },
      {
        title: "New product pricing and margin planning",
        description:
          "D2C founder planning a product launch uses the Profit & Loss Calculator to set the retail price that delivers a 40% gross margin after COGS, then the Break-Even Calculator to estimate monthly units needed to cover Meta/Google ad spend and fulfilment overhead. Iterate on price point until the break-even is feasible in 3-4 months.",
      },
      {
        title: "Investment and return comparison",
        description:
          "Investor comparing a real-estate purchase against an SIP uses ROI Calculator to annualise the real-estate return (capital appreciation + net rental yield) and compare it against the Mutual Fund category's historic CAGR. Then uses Rent vs Buy Calculator to quantify the hidden cost of the locked-in down payment.",
      },
      {
        title: "Home buying and affordability planning",
        description:
          "Young professional with ₹1.5 lakh monthly income uses Home Loan Affordability to find the maximum loan band (₹75-85 lakh at 50% FOIR, 8.5% rate, 20-year tenure). Then Carpet Area Calculator converts the 1,200 sq ft super-built-up advertised flat into 900 sq ft actual carpet area so you can compare against a RERA-registered project listed by carpet area.",
      },
    ],
    howToChoose:
      "For invoicing — GST Invoice Generator for B2B invoices where GST input credit matters. For margin analysis — Profit & Loss Calculator for period-level P&L, Break-Even Calculator for unit-economics view. For investment analysis — ROI Calculator for any investment with entry and exit values; pair with the Mutual Fund and FD calculators in the finance category to compare across instruments. For property decisions — Home Loan Affordability first to set the budget ceiling, then Rent vs Buy Calculator for the buy-or-rent choice, then Carpet Area Calculator for comparing properties on a like-for-like floor-area basis. For naming a new venture — Business Name Generator suggests domain-available names filtered by industry keywords. Workflow for a new business: Business Name Generator → Break-Even Calculator → GST Invoice Generator (after incorporation) → ROI Calculator (quarterly review). For a home purchase: Home Loan Affordability → Rent vs Buy Calculator → Carpet Area Calculator → Profit & Loss Calculator (if it is a rental-yield investment).",
    indianContext:
      "Indian small business operates on margins that global business-calc tools are not calibrated for. A trader's net margin is often 2-5%; a D2C brand's is 8-15%; a services firm 30-50%. The Profit & Loss Calculator lets you model any of these without forcing the Western mid-market assumption of 20-30% baseline. GST is central to every Indian business with turnover over ₹40 lakh (₹20 lakh for services) — the GST Invoice Generator's CGST/SGST/IGST split, HSN/SAC codes, and B2B vs B2C invoice format all follow the Rule 46 of the CGST Rules 2017. Home-loan terms reflect Indian conditions: floating-rate tenure up to 30 years, prepayment allowed without penalty (floating) or with penalty (fixed), tax benefit under Section 80C on principal and Section 24(b) on interest up to ₹2 lakh. The Rent vs Buy Calculator includes these tax benefits in the buy-side math — leaving them out would systematically bias the answer toward 'rent'. Carpet Area Calculator applies the RERA Act 2016 definition: carpet area excludes external walls, balcony, terrace, and service areas — usually 70-75% of the super-built-up number you see in the builder's brochure.",
    pillarFaqs: [
      {
        q: "Does the GST Invoice Generator submit anything to the GST portal?",
        a: "No. It produces a compliant invoice PDF that you save to your system and share with your client. Actual GST return filing (GSTR-1 uploads, GSTR-3B payment) still happens on the GSTN portal or through a GSP-integrated accountant. Our tool replaces the 'design an invoice' step, not the return-filing step.",
      },
      {
        q: "How does the Break-Even Calculator handle variable costs that scale with volume?",
        a: "The tool separates fixed costs (rent, salaries, SaaS subscriptions) from variable cost per unit (COGS, shipping, payment gateway fees). Break-even units = fixed cost ÷ (price per unit − variable cost per unit). If your variable cost itself has a step change (e.g., shipping rate drops above 500 units), model each tier as a separate break-even calculation.",
      },
      {
        q: "Can the Home Loan Affordability tool account for existing loans?",
        a: "Yes — it asks for your existing EMI obligations (car loan, personal loan, credit card minimum, other EMIs) and factors them into the FOIR (fixed-obligation-to-income ratio) calculation. Banks cap FOIR at 50-55% of net take-home, so existing EMI reduces your new-loan capacity by that amount.",
      },
      {
        q: "Is the Rent vs Buy Calculator biased toward renting?",
        a: "No — it explicitly models the buy-side tax benefits (Section 80C principal deduction up to ₹1.5 lakh/year, Section 24(b) interest deduction up to ₹2 lakh/year for self-occupied), capital appreciation (default 6% p.a., editable), and rental value that would have been paid if renting. Override any assumption to see how sensitive the answer is to it.",
      },
      {
        q: "Why does the Carpet Area Calculator flag my builder's figures as inflated?",
        a: "RERA mandates that carpet area be the exact inside-walls area excluding balconies, external walls, and service shafts. Builders often quote 'super-built-up area' which adds 25-30% for common areas. The calculator reverses the super-built-up number to check it falls in the 70-75% range — if it does not, either the builder has misquoted or you are looking at a pre-RERA project.",
      },
    ],
  },

  utility: {
    whatIs:
      "Everyday Utility tools on SabTools.in solve the lookup-and-validate tasks that show up constantly in Indian daily life — decoding a vehicle number plate for state and RTO office, looking up an IFSC code to find a bank's branch, checking a PIN code's city and state, validating the format of a PAN card or Aadhaar number, confirming a GST number has the right structure, tracking a railway PNR for current booking status, and looking up a Ration Card's coverage. These are not financial calculations — they are data lookups against authoritative Indian government and RBI sources. Every Indian adult ends up needing three or four of these each month. The alternative is a dozen different government portals, each with its own quirks, CAPTCHAs, and occasional downtime. We index the public data in one place with a consistent interface.",
    keyFeatures: [
      {
        title: "RTO-coded vehicle number decoding",
        description:
          "Vehicle Number Info takes a registration plate (MH-01-AB-1234) and decodes state (Maharashtra), RTO office (Mumbai Central), series, and approximate vehicle registration date based on the series progression. Works for pre-BH-series and BH-series plates.",
      },
      {
        title: "IFSC and PIN directory lookup",
        description:
          "IFSC Code Lookup returns bank, branch, branch address, city, and state for any valid IFSC. PIN Code Lookup returns city, district, state, and nearby post offices for any 6-digit PIN. Data refreshed against RBI IFSC master list (monthly) and India Post directory (quarterly).",
      },
      {
        title: "Format validation for Indian IDs",
        description:
          "PAN Card Validator checks the 10-character format ABCDE1234F and that the 4th character matches the entity type (P for individual, C for company, H for HUF). Aadhaar Validator runs the 12-digit Verhoeff checksum. GST Number Validator checks the 15-character GSTIN structure and state-code prefix. Format only, never authenticity.",
      },
      {
        title: "Real-time PNR and travel lookups",
        description:
          "Indian Railway PNR queries the IRCTC public PNR status endpoint for current booking status (confirmed, RAC, waiting list, chart prepared) of any 10-digit PNR. Useful before heading to the station to check whether the WL ticket cleared.",
      },
    ],
    useCases: [
      {
        title: "Banking form and cheque preparation",
        description:
          "Filling a NEFT or RTGS transfer form needs the IFSC and the bank branch address. The IFSC Code Lookup returns both in one query. For cross-checking a cheque before deposit (especially foreign-source cheques), confirm the beneficiary bank's IFSC matches the MICR code on the cheque.",
      },
      {
        title: "Customer-data validation in small-business CRM",
        description:
          "A small business collecting PAN, Aadhaar, and GST numbers from B2B customers runs each through the validators to catch data-entry errors before they cause invoice-reversal headaches. Format validation catches 90%+ of typos at zero cost; authenticity check against the Income Tax or UIDAI APIs is a separate process that requires licensed access.",
      },
      {
        title: "Travel and logistics address verification",
        description:
          "E-commerce seller with a Meesho or Amazon storefront uses PIN Code Lookup to verify that the customer-entered city matches the PIN — a mismatch is usually a typo that causes 'undeliverable' returns and ₹100-200 reverse-logistics cost per order. Running the check before shipping saves significantly at scale.",
      },
      {
        title: "Railway journey planning",
        description:
          "Indian Railway PNR tracks the status of a waitlisted ticket in the 48 hours before departure. Combined with the tools in the category for train seat layout and station-code lookup (from the India Guide category), a passenger can check 'is my WL/RAC ticket likely to clear' without opening the IRCTC app.",
      },
    ],
    howToChoose:
      "For ID format checking — PAN Card Validator, Aadhaar Validator, GST Number Validator. Use these at the point of data entry in any form (B2B invoice, HR employee record, KYC document). For address and postal — PIN Code Lookup, plus the broader Indian PIN Code Directory in the India Guide category. For banking — IFSC Code Lookup for quick queries; the IFSC Bank Details lookup in the India Guide category for deeper branch records. For vehicle registration — Vehicle Number Info for decoding the plate. For railway journey — Indian Railway PNR for booking status; the India Guide category has Train Seat Layout and related reference tools. For ration and subsidy lookups — Ration Card Info. None of these tools make authenticated API calls or submit any data to government servers. All lookups run against our published datasets; all format validations run locally in the browser. For sensitive or legal verifications (loan-application KYC, employee onboarding), you still need the authenticated government APIs — these tools are for quick reference and entry-time error catching.",
    indianContext:
      "Indian identifier numbers are structured with more information than a typical global ID number — a PAN's fifth letter encodes entity type (P, C, H, A, T, B, L, J, G, F), a GSTIN's first two digits encode the state of registration (07 for Delhi, 27 for Maharashtra, 33 for Tamil Nadu), an IFSC's first four letters encode the bank (SBIN for State Bank of India, HDFC for HDFC Bank, ICIC for ICICI), and a PIN's first digit encodes one of 9 postal zones (1 for Delhi/Haryana/Punjab, 4 for Maharashtra/Goa/MP/Chhattisgarh). Our validators check each positional component against the valid domain — a GSTIN starting with '00' or '38' fails validation because those state codes do not exist. Our lookup tools use the authoritative sources (RBI IFSC master list, India Post PIN directory, MoRTH vehicle registration data) but never submit the queried data back to those services — everything runs against our cached snapshots. This matters for privacy: a foreign-owned service looking up your IFSC is legal and harmless; looking up your Aadhaar on an unofficial service is almost certainly a data-harvesting scam. Never trust an 'Aadhaar verification' service that asks for your Aadhaar number.",
    pillarFaqs: [
      {
        q: "How frequently is the IFSC data refreshed?",
        a: "Monthly — against the RBI IFSC master file published on the RBI website. Major refresh events (SBI absorbing associate banks, Bank of Baroda absorbing Vijaya and Dena) trigger immediate re-indexing within 24-48 hours. For a specific branch's address before a large NEFT, always cross-check with the account holder's passbook.",
      },
      {
        q: "Does the Aadhaar Validator confirm the number is real?",
        a: "No — and it never will. Confirming Aadhaar authenticity requires an authenticated API call to UIDAI that only licensed KUAs (KYC User Agencies) can make. We verify that the 12 digits pass the Verhoeff checksum (catches most typos) and flag common invalid patterns (all zeros, all same digit). Never enter your Aadhaar on any service that claims to verify authenticity without licensing.",
      },
      {
        q: "Why does Vehicle Number Info sometimes say 'approximate date'?",
        a: "Vehicle registration dates are not public information — MoRTH does not publish date-of-registration per plate. We estimate from the registration series progression: if MH-01-AB-xxxx plates were being issued around March 2020 based on public RTI responses, we return 'approximately March 2020' with a 3-6 month uncertainty band.",
      },
      {
        q: "Can I use Indian Railway PNR for past journeys?",
        a: "PNRs are purged from IRCTC's system about 48 hours after the journey date. Our tool queries the live IRCTC endpoint, so past-journey PNRs return 'not available' or 'flushed'. For ticket-history needs (reimbursement, audit), use IRCTC's 'Booking History' feature while logged in to your account.",
      },
      {
        q: "Is Ration Card Info able to confirm my family's coverage status?",
        a: "It returns general information about ration-card schemes in each state (BPL, APL, Antyodaya) and the coverage entitlements (rice/wheat quantities per person per month), but it does not query the state-specific ration-card database to confirm your specific card's status — that requires logging in to your state's PDS portal. We are a reference tool, not a government interface.",
      },
    ],
  },

  charts: {
    whatIs:
      "Data and chart tools on SabTools.in handle the lightweight data-visualisation and data-transformation tasks that students, analysts, and content creators face daily — building a quick bar or line chart from a CSV, generating an HTML table from tabular data, sketching a flowchart for a process, building a mind-map for a class presentation, editing a CSV without opening Excel, generating a SQL CREATE TABLE statement from a spreadsheet, and converting JSON into a viewable table. These are tasks that are cumbersome in Excel, overkill in Python/Tableau, and impossible on a phone. Each tool here is a single-purpose browser-based utility that runs entirely client-side — your CSV or JSON never leaves your browser, which matters when the data is confidential or you are on a work laptop with strict upload restrictions.",
    keyFeatures: [
      {
        title: "Browser-side data processing",
        description:
          "Chart Maker, CSV Viewer & Editor, and JSON to Table Viewer all parse and render entirely in your browser — uploaded files never reach a server. Good for confidential data (payroll, customer lists) where you cannot paste into ChatGPT or upload to a SaaS tool without breaching policy.",
      },
      {
        title: "Export to standard formats",
        description:
          "Chart Maker exports PNG and SVG for embedding in reports and presentations. Table Generator outputs HTML, Markdown, and CSV. Flowchart Maker exports PNG and SVG with editable source. Mind Map Generator exports PNG and standardised .opml for re-importing into other mind-map tools.",
      },
      {
        title: "Chart-type and layout flexibility",
        description:
          "Chart Maker handles bar, line, pie, donut, scatter, and area charts with colour-scheme presets; axis labels and titles configurable; legend placement adjustable. Mind Map Generator handles radial, tree-left, and tree-right layouts with auto-node-sizing based on content length.",
      },
      {
        title: "SQL and database utilities",
        description:
          "SQL Table Generator creates a CREATE TABLE statement (MySQL, PostgreSQL, SQLite dialects) from column headers and inferred types — useful for seeding a database from a spreadsheet. CSV Viewer & Editor handles malformed delimiter quoting and UTF-8 BOM issues that Excel mangles.",
      },
    ],
    useCases: [
      {
        title: "Student reports and presentation charts",
        description:
          "Class 10-12 or college student presenting data in a project report uses Chart Maker to build a quick bar or pie chart from their tabulated data, exports PNG, and drops it into the PowerPoint. The charts render cleanly at print resolution without the Excel watermark. Mind Map Generator is useful for literature-review mind-maps in humanities projects.",
      },
      {
        title: "Analyst dashboards and reports",
        description:
          "Business analyst extracting a one-off chart from a database query uses Chart Maker with CSV paste — faster than opening Tableau, and the output is export-clean. CSV Viewer & Editor handles the 'the database export has inconsistent quoting' cases that break Excel but parse cleanly here.",
      },
      {
        title: "Process documentation and product planning",
        description:
          "Product manager sketching a user-flow uses Flowchart Maker for a quick diagram that goes into the PRD. Mind Map Generator captures a feature brainstorm before grooming. Both export SVG, which scales in Confluence and Notion without pixelation.",
      },
      {
        title: "Database development and seed-data generation",
        description:
          "Developer converting a business spreadsheet into a database table uses SQL Table Generator to produce the CREATE TABLE with correct NULL/NOT NULL inference, then JSON to Table Viewer to visualise seed data that needs inserting. Combined with the developer-category JSON and SQL tools, this covers the full 'spreadsheet-to-database' workflow.",
      },
    ],
    howToChoose:
      "For visual charts — Chart Maker covers bar, line, pie, scatter, and area types for most classroom and dashboard needs. For tabular data display — Table Generator for HTML/Markdown tables to embed in blogs and docs; JSON to Table Viewer for API-response payloads. For process diagrams — Flowchart Maker for flowcharts (decision diamonds, process rectangles, terminators); Mind Map Generator for brainstorm/ideation trees. For data transformation — CSV Viewer & Editor for quick CSV edits without Excel; SQL Table Generator for schema generation from CSV. Decision: is the output a visual (chart, flowchart) or a data artifact (SQL, JSON, table)? Visuals → Chart Maker / Flowchart Maker / Mind Map Generator. Data → Table Generator / CSV Viewer & Editor / SQL Table Generator / JSON to Table Viewer. For collaborative or interactive charts (real-time editing, shareable links), these tools do not replace Tableau or Google Sheets — they are for quick one-offs, exports, and one-person work.",
    indianContext:
      "Indian students produce a lot of project reports (CBSE, ICSE, CBSE@12, university final-year projects) that require well-presented charts, flowcharts, and tables. The typical school or college has access to a shared MS Office licence at best and no reliable internet at worst — browser-based tools that work offline after first load are a practical fit. For a class-8 student doing a geography project on Indian crop production, Chart Maker builds a state-wise bar chart in 30 seconds from a pasted table; for an MBA student doing a marketing case study, Mind Map Generator captures the competitive landscape before SWOT. For Indian small businesses, CSV Viewer & Editor is useful because bank statements and GST return exports are provided as CSVs that Excel mangles on import (₹ symbols, DD/MM/YYYY dates, leading-zero PAN numbers) — our editor parses them correctly. SQL Table Generator is aimed at the large Indian developer community building line-of-business apps where the data source is always 'the accountant's Excel file' — seeding a database from the spreadsheet is a weekly task.",
    pillarFaqs: [
      {
        q: "Does Chart Maker upload my data to a server?",
        a: "No. The chart is rendered entirely in your browser using Canvas and SVG — your CSV data is parsed, charted, and exported without any network request. You can verify this by opening your browser's Network tab before pasting the CSV; you will see no upload traffic. Safe for confidential data on a work laptop with upload-blocking policy.",
      },
      {
        q: "What chart types does Chart Maker support and is there a data limit?",
        a: "Bar (vertical, horizontal, grouped, stacked), line, pie, donut, scatter, area, and combo (bar + line on two y-axes). Data limit is about 10,000 rows before browser rendering slows; for larger datasets use Python (matplotlib, plotly) or Power BI. For classroom and reporting use, 10k rows is well above the typical need.",
      },
      {
        q: "Can Flowchart Maker handle swim-lane diagrams?",
        a: "Yes — Flowchart Maker supports swim-lanes (horizontal or vertical) with up to 6 lanes. Each node is assigned to a lane via the lane dropdown. For more complex BPMN 2.0 diagrams (boundary events, message flows, data objects), specialised tools like Camunda Modeler or bpmn.io are better fits.",
      },
      {
        q: "Does SQL Table Generator produce valid syntax for all major databases?",
        a: "MySQL, PostgreSQL, SQLite, and SQL Server dialects are supported with dialect-specific type mapping (e.g., PostgreSQL SERIAL vs MySQL AUTO_INCREMENT). Type inference from CSV samples (INT, VARCHAR, DATE, DECIMAL) works well for clean data; review and adjust before running in production, especially for columns with mixed-type values.",
      },
      {
        q: "Is JSON to Table Viewer able to flatten nested objects?",
        a: "Yes — it flattens nested objects and arrays to dot-notation column names (customer.address.city, items[0].name). For deeply nested API responses (GraphQL, REST), this is usually what you want for a quick tabular view. If you need a specific extraction path, the JSON tools in the developer category have JSONPath and jq-style extraction.",
      },
    ],
  },

  career: {
    whatIs:
      "Career tools on SabTools.in handle the employment-decision math that every salaried professional in India faces across their career arc — building a resume that passes ATS filters, scoring a resume against a specific job description, comparing a salary offer against market rates by role and city, computing the notice-period cost of an early exit, tracking years of experience to the month, forecasting next-year's salary after an appraisal, and converting CTC to in-hand salary after PF/PT/TDS. These are the calculations that decide whether to accept an offer, whether to switch jobs, and whether an appraisal is competitive. Each tool here is built around Indian HR conventions — CTC that bundles employer PF contribution, the 1-3 month notice-period norms, the in-hand-vs-CTC gap of 18-25% after deductions, and the hike bands (10-15% for retention, 25-40% for a switch) that vary by sector and seniority.",
    keyFeatures: [
      {
        title: "ATS-aware resume building",
        description:
          "Resume Builder produces a machine-parseable resume (single-column, no tables, no images, standard section headers: Experience, Education, Skills) that passes ATS filters used by Indian recruiting platforms (Naukri, LinkedIn Recruiter, Workday-based careers sites). Five templates, all ATS-clean; export as PDF.",
      },
      {
        title: "Job-description-specific resume scoring",
        description:
          "Resume Score Checker parses the job description and your resume; returns keyword match percentage, missing critical keywords, skill-gap list, and suggested additions. Useful before every application — 60%+ match typically passes the ATS; below 60% often fails.",
      },
      {
        title: "In-hand and CTC conversion with deductions",
        description:
          "In-Hand Salary Calculator breaks down CTC into fixed pay, variable pay, employer PF, gratuity, and other allowances. Applies employee PF (12%), professional tax (state-specific), and TDS (per old and new regime slabs for FY 2025-26) to get the in-hand monthly figure. Usually 75-82% of stated CTC.",
      },
      {
        title: "Experience and appraisal-hike tracking",
        description:
          "Experience Calculator computes total years and months across multiple jobs including concurrent freelance engagements. Appraisal Hike Calculator models the effect of compound annual hikes over a 5-10 year horizon — a 15% annual hike doubles your salary in 5 years; 10% takes 7 years.",
      },
    ],
    useCases: [
      {
        title: "Job-search and application preparation",
        description:
          "Professional applying to 30-50 roles uses Resume Builder to produce the base resume, then Resume Score Checker before each application to tailor the skills section for that JD. Naukri and LinkedIn applications benefit from 70%+ keyword match; generic resume applications rarely make it past ATS. Also useful before a career coach review.",
      },
      {
        title: "Salary-offer evaluation and negotiation",
        description:
          "Receiving a new offer, compare CTC against market rates using Salary Comparison Tool filtered by role, city, and experience band. A senior-backend-engineer role in Bengaluru at ₹35 LPA is below the 50th percentile for 8-year experience; at ₹55 LPA it is the 75th percentile. Use the data for negotiation anchoring.",
      },
      {
        title: "Offer-to-in-hand conversion and budgeting",
        description:
          "Before accepting an offer, run the ₹18 LPA CTC through In-Hand Salary Calculator to see it is ₹1.23 lakh/month in hand. For financial-planning integration, pair with the Home Loan Affordability tool in the business category — that ₹1.23 lakh supports about ₹40-50 lakh in home loan capacity at current rates.",
      },
      {
        title: "Notice-period and resignation planning",
        description:
          "Professional with a 90-day notice period considers an early exit with a 45-day buyback; Notice Period Calculator quantifies the cost (45 days × daily CTC). Experience Calculator provides the exact tenure for the relieving letter — getting this right matters for the next employer's background check.",
      },
    ],
    howToChoose:
      "For job search prep — Resume Builder first to produce the base resume; Resume Score Checker for each targeted application. For offer evaluation — Salary Comparison Tool to benchmark the offer against market; In-Hand Salary Calculator to compute monthly take-home; Home Loan Affordability (business category) to compute lending capacity if a house purchase is planned. For current-employment decisions — Notice Period Calculator for exit planning; Appraisal Hike Calculator for long-term compensation forecasting; Experience Calculator for tenure accuracy in resumes and relieving letters. Workflow for a job switch: Resume Builder → Resume Score Checker → (apply) → offer received → Salary Comparison Tool → In-Hand Salary Calculator → Notice Period Calculator → resign. Workflow for appraisal planning: Appraisal Hike Calculator for 5-year forecasting against peers; Salary Comparison Tool to benchmark current compensation; decision to negotiate or switch follows. None of these tools submit your resume or salary data anywhere — all processing is local; nothing reaches our servers; your information stays in your browser.",
    indianContext:
      "Indian compensation structure differs sharply from US/EU norms — CTC includes employer PF contribution (12% of basic), gratuity (4.81% of basic annual accrual), variable pay (10-25% of fixed for mid-senior roles), and the in-hand-vs-CTC gap is 18-25% after employee-side deductions. In-Hand Salary Calculator handles all this with Indian defaults: EPF at 12% of basic (capped at ₹1,800/month at the ₹15,000 wage ceiling, or uncapped if company policy opts in), professional tax per state (₹200/month in Maharashtra, Karnataka, West Bengal; ₹208/month in Tamil Nadu), and TDS per current-year slabs under old and new regimes. Notice periods are 30-90 days by convention — 30 days common for junior roles, 60 days for mid-level, 90 days for senior and tech-sensitive roles (banks, consulting firms). Appraisal hikes follow sector norms: IT services 8-15%, IT products 10-20%, BFSI 8-12%, consulting 15-20%, with outliers up to 30%+ for hot skills (LLM engineering, site reliability). Resume conventions are also Indian-specific — the 'passport photo in top-right corner' persists in traditional sectors, though it is disappearing in tech. Our Resume Builder defaults to no-photo, but the legacy template is available for campus placements that still expect it.",
    pillarFaqs: [
      {
        q: "Does the Resume Builder pass all ATS filters?",
        a: "The templates are designed to pass the major Indian recruiting ATS engines (Naukri, LinkedIn Recruiter, Workday, Taleo, Lever, Greenhouse) — single-column layout, no tables, no images in text flow, standard section headings, machine-parseable dates. No ATS vendor publishes their parsing rules, so no guarantee is absolute, but the templates follow every published ATS best practice.",
      },
      {
        q: "How accurate is Salary Comparison Tool?",
        a: "Data is aggregated from publicly shared salary data on Glassdoor, AmbitionBox, LinkedIn Salary, and public job postings. Typical accuracy is ±15% on the median for common roles in metro cities; less accurate for niche roles, tier-2/3 cities, and senior (VP+) roles where sample sizes are small. Use it as a directional benchmark, not a precise number.",
      },
      {
        q: "Does In-Hand Salary Calculator cover new-regime and old-regime TDS?",
        a: "Yes — the calculator has a toggle for FY 2025-26 old regime (with deductions — HRA, LTA, Section 80C, Section 80D, home-loan interest) and new regime (higher standard deduction, lower slabs, no other deductions). Pick whichever is beneficial for you; the tool can compare both in a single run.",
      },
      {
        q: "Can Resume Score Checker detect fake or inflated skills?",
        a: "No — it checks keyword presence against the job description, not veracity. If you list 'AWS Solutions Architect Professional' without the certification, the tool counts it as a match. The interviewer will still verify; inflating skills is risky at the technical-screen stage. The tool is for legitimate tailoring (moving relevant skills higher), not for misrepresentation.",
      },
      {
        q: "What is the difference between Experience Calculator and Notice Period Calculator?",
        a: "Experience Calculator computes your total professional experience across all jobs (exact months from joining to leaving each), handling concurrent engagements and career breaks. Notice Period Calculator computes the cost of an early exit from your current job — days you would buy back multiplied by daily CTC, or days you would have to serve if you resign today. Different questions, different tools.",
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
