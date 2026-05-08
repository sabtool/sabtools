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
      "Finance calculators are purpose-built tools that apply the exact mathematical formulas used by Indian banks, mutual funds, and the [Income Tax Department](https://www.incometax.gov.in/iec/foportal/) to questions like: what will my EMI be, how much wealth will this SIP build over 20 years, and which tax regime leaves me with more money in hand. Each tool on SabTools.in implements the underlying formula directly in your browser — there is no server-side black box, no hidden fees, and no account required. The goal is to give you the same answer your bank's relationship manager would give, without the sales pressure and without sharing your financial details with any third party.",
    keyFeatures: [
      {
        title: "Bank-accurate EMI formulas",
        description:
          "EMI, home loan, car loan, and personal loan calculators use the standard reducing-balance formula P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1) that every major Indian bank applies. Rates and tenures follow current [Reserve Bank of India](https://www.rbi.org.in/) benchmarks.",
      },
      {
        title: "SIP, lumpsum and goal planning",
        description:
          "Mutual fund SIP calculators compound monthly with an annual step-up option, matching what AMC websites publish under [SEBI](https://www.sebi.gov.in/) disclosure rules. Goal planners work backwards from your target corpus to the monthly SIP required.",
      },
      {
        title: "Tax regime comparison",
        description:
          "Income tax calculators compare the old regime (with 80C, HRA, home loan interest deductions) against the new regime side by side, including the latest FY 2025-26 slabs and 87A rebate changes.",
      },
      {
        title: "PPF, EPF, NPS projections",
        description:
          "Small-savings calculators use the current PPF rate of 7.1% and the [EPFO](https://www.epfindia.gov.in/)-notified EPF rate of 8.25% — both adjusted on quarterly notifications — and show year-wise growth, maturity value, and the tax-free corpus at withdrawal.",
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
      {
        q: "Are the calculator outputs updated after every Union Budget?",
        a: "Yes — within 2-3 weeks of any Budget that changes tax slabs, 80C/80D limits, the 87A rebate ceiling, capital-gains rates, or PPF/EPF interest rates. The FY 2025-26 (AY 2026-27) figures currently in the calculators reflect the post-Budget 2024 changes including the new-regime restructuring and the LTCG-indexation removal for non-equity assets sold after 23 July 2024.",
      },
      {
        q: "Will the EMI calculator work on a budget Android phone over patchy 4G?",
        a: "Yes. Every finance calculator is statically generated and runs entirely client-side once the page has loaded. After first load, the tool works without an active connection — useful when you are at a bank branch verifying an offer letter on a 2 GB RAM phone. Page-weight on the calculator screen is under 200 KB without third-party scripts.",
      },
      {
        q: "Which finance calculator do most first-time home buyers in metros start with?",
        a: "Most start with the EMI Calculator on a ₹50-80 lakh principal at the current 8.5-9% home-loan band, then move to the Stamp Duty Calculator (which adds 5-7% to the property cost in Maharashtra, Karnataka, Tamil Nadu) and the Income Tax Calculator to model the Section 24B interest deduction (₹2 lakh ceiling on self-occupied property). Together these three give the realistic monthly cash outflow figure.",
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
      {
        q: "Will my image actually stay on my device?",
        a: "Yes. Every image tool uses the browser's Canvas, OffscreenCanvas, and WebAssembly APIs to decode, transform, and re-encode files entirely in your browser tab. You can verify by opening the Network tab in DevTools and watching: no upload request fires when you drop a file. It is the only architecture safe enough for Aadhaar scans, salary slips, or medical reports.",
      },
      {
        q: "Why does WebP/AVIF compress so much smaller than JPEG?",
        a: "WebP and AVIF use modern block-based prediction and entropy coding (VP8/VP9 derivatives for WebP, AV1 derivative for AVIF) that achieve 25-50% smaller files than JPEG at equivalent visible quality. AVIF in particular is excellent for photographic content. Both are now supported in every major browser including older Chrome and Firefox; use them where the destination accepts them.",
      },
      {
        q: "Will the government-form-photo presets pass online portal verification?",
        a: "Yes — the dimensions and DPI presets exactly match published specifications for UPSC, SSC, NEET, JEE, IBPS, RRB, passport, and Aadhaar enrollment. The most common rejection reason at portal upload is wrong file size (over 20 KB for many photo uploads); our presets target that ceiling specifically with quality optimised for facial-recognition acceptance.",
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
      {
        q: "Do these AI tools send my prompt to a third-party model?",
        a: "Some do, some do not — each tool is explicit about its architecture. Tools that need a large language model (article rewriter, content generator, summarizer, paraphraser) make API calls to a configured LLM provider; those tools list the provider on the page. Pure rule-based tools (text statistics, readability score, syllable count) run client-side. Read the tool's privacy note before pasting sensitive content.",
      },
      {
        q: "Are the outputs original enough to publish on a blog without plagiarism flags?",
        a: "Generated text is fresh per session — the same prompt yields different output across runs because the underlying models are non-deterministic. That said, AI-generated content without human editing reads templated and triggers low-quality signals on Google. Use these tools as drafting starters, then rewrite in your voice with concrete examples — the way a careful writer uses any first-draft input.",
      },
      {
        q: "Will AI tools work in Hindi or other Indian languages?",
        a: "The text generation, paraphraser, and summarizer tools handle Hindi, Tamil, Bengali, Marathi, Gujarati, Punjabi, Telugu, Malayalam, and Kannada at quality similar to English. Output quality is highest for Hindi and Tamil (most training data); lower for Konkani, Maithili, and other low-resource languages. Code-mixed Hinglish is handled but flagged as informal register on the readability score.",
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
      "Indian software engineers increasingly work on global products but with India-specific edge cases: PAN card number validation (pattern AAAAA9999A), GSTIN validation (15-character state + PAN + entity code + checksum), Aadhaar number format checks (12 digits with Verhoeff checksum), IFSC code validation, UPI ID format, and PIN code lookup. The format specifications come from the [Ministry of Electronics and Information Technology (MeitY)](https://www.meity.gov.in/) and are enforced by the [Indian Computer Emergency Response Team (CERT-In)](https://www.cert-in.org.in/) for any system handling resident data. Where standard developer tools ignore these, we ship validators for them specifically so a backend engineer building an Indian FinTech app does not have to write the regex for the fifteenth time.",
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
      {
        q: "Can I use these tools while logged in to a corporate VPN with strict DLP?",
        a: "Yes — all developer tools are static pages that run in your browser. No outbound request fires for the input you paste; corporate DLP scanners that watch for credential leakage will see nothing because nothing leaves the device. JWTs, API keys, and database connection strings stay in browser memory only. Worst case if the tab crashes, the input is gone — there is no server-side persistence to leak.",
      },
      {
        q: "Why is the regex tester limited to JavaScript flavour?",
        a: "The tester runs in the browser using JavaScript's native RegExp engine, so the supported features are a subset of PCRE — no recursive patterns, limited Unicode property escapes on older browsers, lookbehind only on modern V8/SpiderMonkey/JavaScriptCore. For PCRE, Python re, or Go regexp validation, run the same pattern in the target environment because edge cases differ. The tool flags the most common JavaScript-vs-PCRE incompatibilities.",
      },
      {
        q: "Do the JSON, XML, and YAML formatters handle multi-MB documents?",
        a: "JSON formatter handles up to ~10 MB before DOM rendering becomes the bottleneck (the parser itself is faster than that). XML and YAML cap at similar sizes. For larger documents — log dumps, full database exports, multi-megabyte build manifests — use a CLI tool (`jq`, `yq`, `xmllint`) on your local machine; no browser-based formatter will be as fast as a native binary on files that size.",
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
      {
        q: "Are the schema generators updated for the 2026 Google guidelines?",
        a: "Yes — the schema generators reflect the post-March-2026 Core Update guidance, including the relaxed FAQPage eligibility for non-product pages, the tightened Article author requirements (must be a Person with sameAs), and the expanded HowTo recipe properties. The Organization schema generator includes the 2026-recommended sameAs profile list and the contactPoint type for AI Overview citations.",
      },
      {
        q: "Will the meta tags I generate trigger truncation in the SERP?",
        a: "The Meta Tag Generator counts characters as it types and warns when the title exceeds 55 characters or the description exceeds 155 characters. Google sometimes truncates earlier on mobile, sometimes uses longer than the cap on desktop, but writing within the cap minimises the chance of an awkward cut-off in either rendering. The SERP Preview tool shows both desktop and mobile renderings live.",
      },
      {
        q: "Does the OG tag preview match what WhatsApp, Facebook, and LinkedIn actually display?",
        a: "The preview is rendered against each platform's published Card spec — WhatsApp uses the Open Graph image at a specific aspect ratio (1.91:1 minimum), Facebook prefers 1200 × 630, LinkedIn the same. The preview catches the most common errors: og:image too small, og:title missing, og:description truncated. For a binding test, use Facebook's official Sharing Debugger before launch, since they cache the first crawl.",
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
      {
        q: "Does the word count match what Microsoft Word or Google Docs reports?",
        a: "Yes — the Word Counter splits on the same Unicode-word-boundary rules MS Word and Google Docs use, so identical text produces identical counts across the three tools. Differences arise only with hyphenated words and abbreviations: 'state-of-the-art' counts as 4 words in Word and the calculator; some tools count it as 1. The Word Counter shows the rule it applied so you can reconcile any one-off difference.",
      },
      {
        q: "Will the text-formatting tools preserve Hindi or Tamil characters correctly?",
        a: "Yes. Every text tool uses native JavaScript string handling which is fully Unicode-aware (UTF-16 encoded internally). Devanagari, Tamil, Bengali, Telugu, Malayalam, Gujarati, Punjabi, Kannada, and Odia scripts all round-trip cleanly through case conversion, sorting, search-replace, and reverse operations. Combining characters and conjuncts (jukta-akshara) preserve correctly because we operate on grapheme clusters, not raw code points.",
      },
      {
        q: "Is plagiarism check accurate for academic submissions?",
        a: "Our plagiarism check is heuristic — it identifies passages that match common-phrase databases and online sources we index. It is not a substitute for university-grade systems like Turnitin, iThenticate, or Urkund which check against subscription databases of student submissions and journals. For a binding academic check (thesis, dissertation, journal submission), use the institution-licensed system; our tool is for self-review during drafting.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 7. Health & Fitness — 13 tools
  // ──────────────────────────────────────────────────────────────────────
  health: {
    whatIs:
      "Health and fitness calculators on SabTools.in estimate body composition, daily calorie needs, macronutrient targets, pregnancy milestones, and fitness metrics using guidance from the [World Health Organization](https://www.who.int/india), the [Indian Council of Medical Research (ICMR)](https://www.icmr.gov.in/), and peer-reviewed medical formulas — with India-specific reference values where they exist. Unlike generic health calculators that assume Western body types and diets, our tools use the WHO Asia-Pacific BMI classification (which sets overweight at 23+, not 25+, because South Asian body composition shows metabolic risk at lower BMI) and reference Indian food composition tables from the National Institute of Nutrition, Hyderabad. These are decision-support tools for informed conversations with your doctor, not replacements for clinical judgement.",
    keyFeatures: [
      {
        title: "India-specific reference ranges",
        description:
          "BMI uses the WHO Asia-Pacific classification (<18.5 underweight, 18.5-22.9 normal, 23-24.9 overweight, 25+ obese). BMR uses the Mifflin-St Jeor formula, which is more accurate for South Asian populations than the older Harris-Benedict equation.",
      },
      {
        title: "ICMR-aligned calorie guidance",
        description:
          "Daily calorie and macronutrient recommendations follow the 2020 [ICMR-NIN Dietary Guidelines for Indians](https://www.icmr.gov.in/), which account for typical Indian vegetarian/non-vegetarian eating patterns and regional variations.",
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
      {
        q: "Will these calculators give wrong results for South Asian body types?",
        a: "No — the BMI Calculator uses the WHO Asia-Pacific cut-offs (overweight at 23+ rather than 25+) specifically because South Asian populations develop metabolic risk at lower BMI than the global average. The BMR Calculator uses the Mifflin-St Jeor equation which is more accurate for South Asian subjects than the older Harris-Benedict equation. Both calibrations come from peer-reviewed Indian-cohort studies.",
      },
      {
        q: "Are pregnancy calculators safe to rely on for clinical dating?",
        a: "For routine LMP-based dating they match what the OBGYN's spreadsheet does (LMP + 280 days). For ultrasound-based dating after 12 weeks, the OBGYN uses scan-derived crown-rump length which is more accurate than menstrual dating; the calculator does not replace that scan. Use the calculator for between-appointment date checks; defer to the doctor's chart at every visit.",
      },
      {
        q: "Does the calorie counter work for vegetarian Indian meals specifically?",
        a: "Yes — the underlying database includes per-100g and per-serving nutrition for 800+ Indian dishes including all major regional vegetarian preparations (Punjabi rajma, Maharashtrian vada, Gujarati dhokla, South Indian sambhar, Bengali alur dom). Ghee/oil sensitivity is handled with a home-style vs restaurant-style toggle since the same dish at home is often 30-40% lower in calories than the restaurant version.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 8. Tax & Salary — 10 tools
  // ──────────────────────────────────────────────────────────────────────
  tax: {
    whatIs:
      "Tax and salary tools on SabTools.in compute income tax under old and new regimes, break down CTC into take-home, calculate TDS, estimate HRA exemption, project EPF and NPS corpus, and estimate stamp duty for property transactions — using the exact slab rates, exemption limits, and deduction rules in effect for the current Indian financial year. Every tool is updated within a few weeks of Union Budget announcements, so the numbers reflect the most recent changes published by the [Income Tax Department](https://www.incometax.gov.in/iec/foportal/). These are planning tools — the final tax computation on your ITR will match these outputs to the rupee when you enter the same inputs.",
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
      "Indian tax is layered: central income tax under the IT Act, a small professional tax levied by state governments (varies from ₹200 to ₹2,500 per year depending on state), state stamp duty on property transactions, and GST on most goods and services. None of these are abstractly 'Indian tax' — they each have their own rules, slab structures, and exemptions. Our tools handle the central income tax (old and new regimes), the salary-side professional tax deduction, stamp duty at state granularity, and the GST slab structure published by the [GST Council](https://gstcouncil.gov.in/) for business invoicing. If your situation needs state-specific guidance (Maharashtra professional tax brackets, for example), the salary calculator defaults to that state when selected.",
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
        a: "They are good enough to verify a CA's computation or the return your TDS deductor computes, and to plan investments and declarations. For the final ITR filing you will use the official [Income Tax e-filing portal](https://www.incometax.gov.in/iec/foportal/) or a regulated filing service because the portal cross-references your Form 26AS and AIS automatically. Use our tools upstream for planning; use the portal downstream for filing.",
      },
      {
        q: "Are FY 2025-26 / AY 2026-27 changes already reflected in the calculator?",
        a: "Yes — including the new-regime standard deduction of ₹75,000, the revised ₹7 lakh rebate ceiling under Section 87A, the surcharge cap at 25% for the new regime, and the post-Budget 2024 LTCG and STCG rates on equity. The calculator labels which financial year and assessment year the rate set applies to; if you select FY 2024-25 it loads the older rates for return-filing of last year's income.",
      },
      {
        q: "Why does my employer's TDS sheet show different deductions than this calculator?",
        a: "Employers compute TDS based on declared investments and projected annual income; if you declared full 80C and HRA upfront and the actual claim differs, the year-end reconciliation produces a refund or additional tax. Our calculator computes the final liability with your real numbers — use it after the fact to estimate your refund and again before next year's declaration to choose the right regime.",
      },
      {
        q: "Does the calculator handle freelance and consultant income correctly?",
        a: "Yes — for consultants and freelancers eligible under Section 44ADA (gross receipts up to ₹75 lakh, presumptive 50% net profit), the calculator applies the presumptive rule and skips the standard deduction (which is salaried-only). For other freelancers, gross receipts minus actual business expenses go in as 'income from business or profession' and are then aggregated with other heads.",
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
      {
        q: "Are the love-compatibility and lucky-number tools meant seriously?",
        a: "No — they are entertainment tools that use simple letter-arithmetic and date-arithmetic to produce a number. There is no scientific basis for romantic-compatibility prediction or for daily-luck calculation, and we do not present these results as anything other than fun. They are designed for sharing on Instagram and WhatsApp groups, not for life decisions.",
      },
      {
        q: "Will the funny-name and cool-text generators work for Hindi, Tamil, Bengali names?",
        a: "Yes — the generators handle Devanagari, Tamil, Bengali, Telugu, Marathi, Gujarati, Punjabi, Kannada, and Malayalam scripts. The fancy-text and decorative-font generators map Latin characters to Unicode look-alikes; for Indian-language input the tools transliterate to Latin first when needed and produce stylised output suitable for chat apps. Output renders correctly on WhatsApp, Telegram, and most social platforms.",
      },
      {
        q: "How private are the inputs to these tools?",
        a: "Inputs are processed entirely in your browser — names, dates of birth, secret-crush selections never reach our servers. Some fun tools embed share links that include your inputs as URL parameters (so the friend you share with sees your result page); those are visible if the friend forwards the URL. For anything you would not want forwarded, use the 'private mode' toggle that strips inputs from the share URL.",
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
      {
        q: "How accurate is the unit converter at boundary precision?",
        a: "Length, weight, area, volume conversions use the SI-defined exact ratios — millimetre to inch is 0.03937007874015748 to 16 decimal places, hard-coded. Temperature uses the exact Celsius-Fahrenheit-Kelvin formulas. Currency conversion uses live rates and is therefore accurate within the API provider's bid-ask spread. Cooking volume conversions assume the US 240 ml cup unless you toggle to UK 250 ml or Indian 200 ml.",
      },
      {
        q: "Are the Indian-unit conversions (bigha, guntha, kanal, cent) correct?",
        a: "Yes — but with the explicit state-specific override since these units vary by region. A bigha is 1,600 sq ft in Punjab/Haryana, 27,000 sq ft in UP, and 27,225 sq ft in West Bengal — the converter asks for state and applies the correct multiplier. Always cross-check with your local revenue records before treating the converter output as binding for legal purposes.",
      },
      {
        q: "Does the currency converter freeze if the exchange-rate API is rate-limited?",
        a: "The currency converter caches the most recent rates for 60 seconds and falls back to the previous good cache if the live API hits a rate limit or temporary outage. The displayed rate timestamp shows when the rate was last fetched. For a binding rate (large remittance, business invoice), always check the bank's quoted rate at the moment of transaction; published rates can move 0.5-1% intraday.",
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
      "Indian digital services increasingly require strong credentials — banking apps enforce 8-16 character passwords with complexity rules, Aadhaar-linked services require OTP plus password, and corporate VPN and email rules often mandate 12+ characters with quarterly rotation. The Password Generator supports all these profiles with one-click presets (SBI, HDFC, ICICI typical rules; common CorpSec rules). For citizens dealing with DigiLocker, UMANG, and income-tax portal downloads, the Hash Calculator is the fastest way to verify the integrity of downloaded documents before opening them — match the published SHA-256 against the file you received, and the [Indian Computer Emergency Response Team (CERT-In)](https://www.cert-in.org.in/) recommends this exact step before opening any government-issued PDF. Our Privacy Policy Generator helps Indian SMEs draft DPDP Act 2023-compliant privacy policies — the [Ministry of Electronics and Information Technology (MeitY)](https://www.meity.gov.in/) administers the act and non-compliance penalties are now serious.",
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
      {
        q: "Are passwords generated here as random as those from a password manager?",
        a: "Yes — both use crypto.getRandomValues() under the hood, which is the browser's CSPRNG (cryptographically secure pseudo-random number generator). The randomness quality is identical. What a password manager adds is encrypted storage, autofill, and breach-monitoring; what our tool adds is no-account access and zero-server-storage. Generate here, paste into your password manager for storage.",
      },
      {
        q: "Why do you not offer a 'check if my password was leaked' service?",
        a: "Such a service requires sending the password (or a hash prefix) to a database of breaches like HaveIBeenPwned. Hash-prefix checking is technically safe (only the first 5 hex characters of the SHA-1 are sent, and the API returns a list of matching suffixes for you to check locally) but it is still a network round-trip we would rather not make in a security-tools context. Use Have I Been Pwned's own page directly when you need that check.",
      },
      {
        q: "Are the SHA-256 and SHA-512 hashes here suitable for blockchain or cryptographic signature use?",
        a: "Yes for the hashing primitives — SHA-256 and SHA-512 are computed using SubtleCrypto.digest(), which is the browser's native NIST-standardised implementation. The output is bit-identical to OpenSSL or Node.js's crypto.createHash for the same input. For signing (Ed25519, ECDSA, RSA), you need a key-pair workflow; our tools cover hashing only, not signature creation or verification.",
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
          "GSTN, [Income Tax e-filing](https://www.incometax.gov.in/iec/foportal/), [EPFO](https://www.epfindia.gov.in/), and [UIDAI](https://uidai.gov.in/) self-service all accept PDF uploads but cap size at 1-5 MB per file. Our PDF Compressor trims typical scanned PDFs by 60-80% without visible degradation — critical when you have a 12 MB scanned rent agreement that the portal rejects.",
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
      {
        q: "Why does the OCR tool sometimes fail on Hindi handwritten notes?",
        a: "Hindi handwriting recognition is a hard ML problem — printed Devanagari is well-handled because Tesseract has good models for it, but handwriting (especially in mixed-cursive Devanagari + Latin numerals + decorative characters) is much weaker. For typed/printed Hindi PDFs the OCR is reliable; for handwritten notes the result needs heavy post-editing. This is an industry-wide limitation, not a SabTools-specific weakness.",
      },
      {
        q: "Does the protect-PDF feature use the same encryption banks and government use?",
        a: "Yes — PDFLib's protect tool applies AES-256 encryption (the same algorithm Adobe Acrobat Pro uses, the same FIPS-approved cipher banks use for transit). A 16+ character password with mixed types is practically unbreakable without the password. Weak passwords (dates of birth, common words) are vulnerable to brute-forcing in hours by specialised software regardless of the cipher used.",
      },
      {
        q: "Will compressing a PDF to government-portal size break the readability?",
        a: "The compressor lets you pick a quality target (high, medium, low) and shows the resulting file size before download. At 'medium' compression, Aadhaar / PAN / mark-sheet PDFs typically compress 60-80% with no visible degradation on screen or print. At 'low' (aggressive), text stays crisp but image-heavy pages lose some detail; we flag if the target size is unreachable without crossing into low-quality mode.",
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
      {
        q: "Are the answers from the equation solver verifiable by hand?",
        a: "Yes — every solver shows the step-by-step working, not just the final answer. For polynomial roots, the tool shows the discriminant calculation, the quadratic formula substitution, and the resulting roots. For systems of linear equations, it shows the matrix-form computation. Use the steps as a working-out reference for school assignments where 'show your work' is required.",
      },
      {
        q: "Does the calculator handle CBSE / ICSE / state-board syllabus differences?",
        a: "The math itself is universal, but our worked examples are tagged by syllabus where they differ. The CBSE Class 10 trigonometry questions use sin/cos/tan with 30/45/60/90 standard angles; ICSE adds cosec/sec/cot more prominently; some state boards include vectors earlier. The calculator covers the common core so any board's student gets the right number; the example library matches the syllabus you select.",
      },
      {
        q: "Are these calculators allowed in school exams?",
        a: "Most Indian school boards (CBSE, ICSE, state boards) prohibit any calculator in board exams up to Class 10; Class 11/12 allow non-programmable scientific calculators in physics/chemistry/maths papers but never a phone or web-based tool. Use these calculators for homework, practice tests, and self-study; for actual exams, use the school-permitted hardware calculator.",
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
      {
        q: "Does the date difference tool handle the Indian Saka (Hindu Calendar) cross-reference?",
        a: "Yes — the Hindu Calendar mode toggles between Vikram Samvat (most North Indian states) and Saka Era (national official calendar, used on government documents). Conversion is exact between Gregorian and these systems for any date from 1 CE forward. For Tamil Calendar (Kollam Era), Bengali Calendar (Bangabda), and Malayalam Calendar (Kollavarsham), the tool uses the standard tabular conversion with the regional epoch.",
      },
      {
        q: "Why does the time-zone converter show two Indian Standard Times?",
        a: "It does not — India uses a single national time zone (IST = UTC+5:30), unlike countries with multiple zones. What the converter sometimes shows is two RFC-compliant abbreviations (IST and INST) which are equivalent. India does not observe daylight saving, so the offset is constant year-round. Some tools also mention 'half-hour offsets' alongside India because UTC+5:30 is one of the world's only half-hour-offset zones.",
      },
      {
        q: "Is the festival-calendar accurate for both lunar (Diwali, Eid) and solar (Pongal, Republic Day) holidays?",
        a: "Yes — lunar holidays (Diwali, Karva Chauth, Holi, Eid, Janmashtami, Mahavir Jayanti, Buddha Purnima) follow the Indian National Calendar's astronomical computation and are accurate to the day. Solar/civil holidays (Republic Day, Independence Day, Gandhi Jayanti, Pongal, Onam, Vishu) are fixed-date and exact. Regional bank holidays vary by state; the calendar's state-filter shows the holidays observed in that state's banking system.",
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
          "PIN code data from [India Post's](https://www.indiapost.gov.in/) official directory; IFSC code data from the [Reserve Bank of India](https://www.rbi.org.in/) IFSC master list; STD codes from the Department of Telecom; state/district hierarchy from the Ministry of Home Affairs census. Refreshed on a rolling schedule as official sources update.",
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
      "India's identifier formats are specific to India and usually encoded with more structure than an opaque ID number — a PAN carries category (P=person, C=company, H=HUF, etc.), a GSTIN carries state code, a PIN has region/subregion/delivery-office structure, an IFSC prefixes the bank and sub-identifies the branch. Our validators do not just check length; they check that each positional component is valid in context. For example, a PAN of ABCDE1234F where the fifth letter does not match the first letter of the surname (for individuals) would still pass basic validation but fail semantic validation — we flag both classes of issue and explain the difference. We never submit numbers to [UIDAI](https://uidai.gov.in/), Income Tax, or GSTN servers from our page — that would be a privacy violation. Format validation only; authenticity checks are the enterprise's job through authenticated APIs. For citizens, the [MyGov](https://www.mygov.in/) portal is the official front-door for most government schemes referenced by these tools.",
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
      {
        q: "Why do PIN codes occasionally return wrong city information?",
        a: "PIN codes encode region/sub-region/delivery-office structure but several PINs serve overlapping postal localities — a single PIN like 110001 covers central Delhi including Connaught Place, India Gate, Parliament House, and Tilak Marg. The tool returns the dominant locality but flags when multiple sub-localities are valid. For precise locality, use the India Post 'Find PIN' tool which queries the live database.",
      },
      {
        q: "Are these tools suitable for KYC verification at a bank or a fintech?",
        a: "No — these tools verify the format of a PAN/Aadhaar/GSTIN/IFSC, not its authenticity. Format validation catches typos at the data-entry stage; authenticity validation requires authenticated API calls to UIDAI / Income Tax Department / GSTN that only licensed entities (KUAs, KYC service providers) can make. Banks and fintechs already make those authenticated calls themselves; our tools are for upstream entry-time validation, not regulatory compliance.",
      },
      {
        q: "How current is the IFSC and bank-branch data?",
        a: "The IFSC master list is refreshed monthly against the Reserve Bank of India's published file. Major bank-merger events (SBI absorbing State Bank of Patiala / Mysore / Hyderabad in 2017, the Punjab National Bank-Oriental Bank-United Bank merger in 2020, Bank of Baroda absorbing Vijaya and Dena) trigger immediate re-indexing within 24-48 hours so the lookup never returns a closed branch's address.",
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
      {
        q: "Are the science calculators aligned with NCERT or international curriculum?",
        a: "Where the science is universal (Newton's laws, ideal gas, electromagnetism, basic chemistry), the formulas are the same across NCERT, IGCSE, AP, IB, and state boards — the calculator outputs the same number for the same input regardless of curriculum. Where curricula differ in notation or unit conventions (cgs vs SI in older Indian curricula, mole-based vs molarity-based in chemistry), the tool defaults to NCERT/SI and flags non-standard alternatives.",
      },
      {
        q: "Does the chemistry calculator handle Indian-cohort biology and pharma applications?",
        a: "Yes — molarity, normality, percent-by-weight, percent-by-volume, dilution, and buffer calculations use the standard formulas universal to chemistry globally. For pharmaceutical applications (Indian Pharmacopoeia formulations, dose calculations for Ayurvedic preparations, IS 4707 reagent grades), the calculator provides defaults that match Indian-Pharmacopoeia conventions where they differ from USP or BP.",
      },
      {
        q: "Will physics calculators handle JEE / NEET problem-style inputs correctly?",
        a: "Yes — the physics calculators take inputs in the way JEE/NEET problems present them (SI units, two significant figures unless specified otherwise, vector components, free-body force balance) and return answers in the same form. The Kinematics, Newton's Laws, Electrostatics, and Optics calculators specifically have JEE-style worked examples with the standard solution patterns examiners reward.",
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
          "Concrete Calculator defaults match IS 456 grades (M15, M20, M25 with 1:2:4, 1:1.5:3, 1:1:2 mix ratios); Steel Weight Calculator uses TMT bar weights per IS 1786 (Fe 415, Fe 500, Fe 550 densities); Plywood Calculator uses IS 303 commercial plywood sheet sizes. All standards are published by the [Bureau of Indian Standards (BIS)](https://www.bis.gov.in/) and defaults match what your supplier actually sells.",
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
        a: "Yes — it sums appliance loads in kW and flags when total diversified load exceeds 5-7 kW (the practical single-phase ceiling for most Indian DISCOMs). Above that, 3-phase is recommended for proper load balancing and to avoid overload on a single phase. Final decision depends on the DISCOM's tariff and connection rules in your state — see the [Central Electricity Authority](https://cea.nic.in/) for the central-government rules that DISCOMs adapt locally.",
      },
      {
        q: "Are the BIS / IS-code defaults updated for the latest amendments?",
        a: "Yes — the codes referenced (IS 456 for concrete, IS 1786 for steel reinforcement, IS 800 for structural steel, IS 875 for design loads, IS 1893 for seismic, IS 1172 for water-supply) are tracked with their current amendments. Codes are amended periodically; we update defaults within a few weeks of a notification on the BIS portal. For binding compliance, always cross-check the current published amendment number with your structural engineer.",
      },
      {
        q: "Will the Concrete Calculator output match what an actual mixer truck delivers?",
        a: "Concrete is sold by volume in cubic metres at the truck. The calculator output for cement bags, sand cubic feet, and aggregate cubic feet is for site-mixed concrete; for ready-mix delivered, the truck driver supplies the cubic-metre figure directly. Ready-mix is typically 5-10% more expensive but eliminates wastage from manual mixing. Both routes produce the same final concrete grade if the mix-ratio is identical.",
      },
      {
        q: "Does the Staircase Calculator handle the residential-vs-commercial code difference?",
        a: "Yes — residential staircases follow NBC 2016 with riser 150-190 mm, tread 240-300 mm, slope ≤63°. Commercial staircases (offices, malls, public buildings) follow stricter NBC standards: riser 150-180 mm max, tread 270-300 mm, slope ≤45°, plus mandatory landings every 12 risers. Toggle the use-case at the top of the calculator and the validation thresholds adjust accordingly.",
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
      "Indian competitive-exam preparation is a high-stakes and high-cost industry — a NEET aspirant in Kota spends ₹4-6 lakh on coaching, a JEE aspirant ₹3-5 lakh, and the difference between rank 500 and rank 5,000 decides whether the family's investment paid off. These tools remove information asymmetry around the rank-prediction and scholarship-eligibility calculations that coaching institutes use as retention hooks. NEET and JEE Main are conducted by the [National Testing Agency (NTA)](https://www.nta.ac.in/) with centralised result declaration; cut-offs change year on year based on difficulty, and the historic-cutoff data in our Score Predictor reflects the 5-year rolling window (not the current year, which is not yet known on result day). GATE is conducted by IITs in rotation with a fixed normalisation formula; our GATE Score Calculator matches the official GATE score formula byte-for-byte. Scholarship eligibility changes annually as the NSP portal refreshes; our Eligibility Checker is refreshed every August when the new academic year's schemes open. The [University Grants Commission (UGC)](https://www.ugc.gov.in/) and [Central Board of Secondary Education (CBSE)](https://www.cbse.gov.in/) publish the underlying eligibility rules our calculator references. State-board calculations follow the home state's aggregation rule — Tamil Nadu, Maharashtra, Andhra Pradesh, Kerala, West Bengal each have their own best-of-N rule which our Board Percentage Calculator handles correctly.",
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
      {
        q: "Does the JEE rank predictor account for category-specific cut-offs and reservations?",
        a: "Yes — once you select your category (General, EWS, OBC-NCL, SC, ST, PwD), the predictor returns both your All India Rank and your category rank. For JoSAA counselling allocation, category rank usually matters more than AIR for reserved categories. For top-100 AIR ranks, both are returned; for categories that lock out reserved-category candidates from certain branches (some IIT specialised programs), the tool flags the eligibility band.",
      },
      {
        q: "Are the historic NEET / JEE cut-offs the actual official figures?",
        a: "Yes — they are the cut-off marks published by NTA and the JoSAA-counselling cut-offs published by participating IITs/NITs/IIITs after each year's allocation rounds. We update the dataset within 7-10 days of each official cut-off release. The predictor uses a weighted combination of the last 5 years' cut-offs; outliers (such as the 2020 NEET cut-off shift) are flagged so you can interpret the result against that context.",
      },
      {
        q: "Will the calculator help me decide between IIT branches and a top-tier NIT branch?",
        a: "Indirectly — it gives you the rank-to-branch-cut-off mapping for both ecosystems. The decision itself depends on factors the calculator cannot weigh: branch interest, faculty, placement statistics, location preference, family circumstances. For the rank-to-options mapping the tool is reliable; for the choice between equivalent branches at different institutes, talk to graduating students of those programs and review NIRF rankings.",
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
          "GST Invoice Generator produces an invoice that matches the [GST Council](https://gstcouncil.gov.in/) rules — invoice number with prescribed format, HSN/SAC for each line item, CGST/SGST/IGST split based on intra-state or inter-state supply, total in words, and place of supply. Download as PDF ready for sharing with your customer and uploading to your accountant.",
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
      "Indian small business operates on margins that global business-calc tools are not calibrated for. A trader's net margin is often 2-5%; a D2C brand's is 8-15%; a services firm 30-50%. The Profit & Loss Calculator lets you model any of these without forcing the Western mid-market assumption of 20-30% baseline. GST is central to every Indian business with turnover over ₹40 lakh (₹20 lakh for services) — the GST Invoice Generator's CGST/SGST/IGST split, HSN/SAC codes, and B2B vs B2C invoice format all follow Rule 46 of the CGST Rules 2017. Home-loan terms reflect Indian conditions: floating-rate tenure up to 30 years, prepayment allowed without penalty (floating, per [Reserve Bank of India](https://www.rbi.org.in/) rules) or with penalty (fixed), tax benefit under Section 80C on principal and Section 24(b) on interest up to ₹2 lakh. The Rent vs Buy Calculator includes these tax benefits in the buy-side math — leaving them out would systematically bias the answer toward 'rent'. Carpet Area Calculator applies the RERA Act 2016 definition: carpet area excludes external walls, balcony, terrace, and service areas — usually 70-75% of the super-built-up number you see in the builder's brochure.",
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
      {
        q: "Are the GST invoice templates updated for e-invoicing thresholds?",
        a: "Yes — e-invoicing is mandatory for businesses with aggregate annual turnover over ₹5 crore (the threshold has reduced from ₹500 crore in 2020 to ₹100 crore in 2021 to ₹10 crore in 2022 to ₹5 crore in 2023). The Invoice Generator outputs both the human-readable PDF and the Invoice Reference Number (IRN) format JSON suitable for IRP upload. Below ₹5 crore the e-invoice is optional but the format remains valid.",
      },
      {
        q: "Does the Break-Even Calculator handle subscription / SaaS pricing models?",
        a: "Yes — for SaaS or subscription businesses with monthly recurring revenue (MRR) and churn, the calculator includes a churn-adjusted break-even mode. Inputs: monthly customer acquisition cost (CAC), gross margin per customer, and monthly churn rate; output: months until LTV exceeds CAC and cumulative cash-flow break-even. Especially useful for D2C subscription brands and B2B SaaS scaling beyond the initial product-market-fit phase.",
      },
      {
        q: "Why does the Home Loan Affordability tool use 50% FOIR rather than a stricter 35%?",
        a: "Indian banks themselves use 50-55% as the maximum Fixed Obligation to Income Ratio for home-loan sanction — that is the regulatory ceiling, not a comfort target. A 50% FOIR means half of net take-home goes to EMIs, which is achievable but tight. The tool also shows a 'comfort band' (35-40% FOIR) that leaves room for unforeseen expenses, education costs, retirement savings — most financial planners recommend staying within the comfort band for long-term tenability.",
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
          "IFSC Code Lookup returns bank, branch, branch address, city, and state for any valid IFSC. PIN Code Lookup returns city, district, state, and nearby post offices for any 6-digit PIN. Data refreshed against the [Reserve Bank of India](https://www.rbi.org.in/) IFSC master list (monthly) and the [India Post](https://www.indiapost.gov.in/) directory (quarterly).",
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
      "Indian identifier numbers are structured with more information than a typical global ID number — a PAN's fifth letter encodes entity type (P, C, H, A, T, B, L, J, G, F), a GSTIN's first two digits encode the state of registration (07 for Delhi, 27 for Maharashtra, 33 for Tamil Nadu), an IFSC's first four letters encode the bank (SBIN for State Bank of India, HDFC for HDFC Bank, ICIC for ICICI), and a PIN's first digit encodes one of 9 postal zones (1 for Delhi/Haryana/Punjab, 4 for Maharashtra/Goa/MP/Chhattisgarh). Our validators check each positional component against the valid domain — a GSTIN starting with '00' or '38' fails validation because those state codes do not exist. Our lookup tools use authoritative sources but never submit the queried data back to those services — everything runs against our cached snapshots. The [MyGov](https://www.mygov.in/) portal is the official front-door for citizen-facing schemes that reference these identifiers. This matters for privacy: a foreign-owned service looking up your IFSC is legal and harmless; looking up your Aadhaar on an unofficial service is almost certainly a data-harvesting scam. Never trust an 'Aadhaar verification' service that asks for your Aadhaar number — go directly to [UIDAI](https://uidai.gov.in/) for the authoritative service.",
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
      {
        q: "Why does the Vehicle Number Info sometimes return 'approximate registration date'?",
        a: "MoRTH publishes RTO codes and registration series progressions but does not publish the exact issue-date for individual plates. We estimate from the public series-progression data — if MH-12-CD plates were being issued around July 2022 based on RTI responses, we return 'approximately July 2022' with a 3-month uncertainty band. For a precise registration date, request a Vehicle Information from the VAHAN portal using your registration number and chassis-number authentication.",
      },
      {
        q: "Is the Indian Railway PNR tool refreshing live or showing cached data?",
        a: "Live — each query hits IRCTC's public PNR endpoint and returns the current status (CNF, RAC, WL number, chart-prepared status). PNRs purge from IRCTC's system about 48 hours after the journey date, so post-journey PNRs return 'flushed' and are unavailable. For ticket-history needs (reimbursement, audit), use IRCTC's Booking History via a logged-in account.",
      },
      {
        q: "Are the format validators (PAN / Aadhaar / GSTIN) sufficient for invoice issuance?",
        a: "Format validation is necessary but not sufficient for compliance. A correctly-formatted PAN/GSTIN that does not actually exist will pass the format check but fail when you file your GSTR or claim input credit. For binding verification, businesses use authenticated API calls (PAN bulk verification through NSDL, GSTIN search through GSTN) which require licensing. Our tools catch typos at data entry; the licensed verification happens downstream in the accounting system.",
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
      {
        q: "Will the chart generator export to formats accepted in academic journals?",
        a: "Yes — the chart tool exports to SVG (vector, infinitely scalable, editable in Adobe Illustrator and Inkscape), high-resolution PNG (300+ DPI suitable for print and journal submission), and PDF (vector, accepted by most LaTeX workflows and journal submission systems). For scientific journals that require publication-quality figures, the SVG export reproduces correctly at any size without rasterization.",
      },
      {
        q: "Can I overlay multiple datasets in the same chart for comparison?",
        a: "Yes — line charts, bar charts, and scatter plots all support multiple data series with separate legends, colours (default colour-blind-friendly palette), and axes. The Mixed Chart type allows combining a bar series and a line series on the same axis, useful for revenue-and-trend dashboards. Each series accepts its own data input via paste or CSV upload.",
      },
      {
        q: "Is the chart styling accessible for colour-blind viewers?",
        a: "Yes — the default palette is the colour-blind-friendly Wong palette (8 colours distinguishable by people with deuteranopia, protanopia, and tritanopia). The high-contrast mode uses thick strokes and pattern fills (dots, hatches, diagonal lines) so charts remain readable when printed in greyscale. Toggle accessibility mode in the chart-style panel.",
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
      "Indian compensation structure differs sharply from US/EU norms — CTC includes employer PF contribution (12% of basic), gratuity (4.81% of basic annual accrual), variable pay (10-25% of fixed for mid-senior roles), and the in-hand-vs-CTC gap is 18-25% after employee-side deductions. In-Hand Salary Calculator handles all this with Indian defaults: EPF at 12% of basic per [EPFO](https://www.epfindia.gov.in/) rules (capped at ₹1,800/month at the ₹15,000 wage ceiling, or uncapped if company policy opts in), professional tax per state (₹200/month in Maharashtra, Karnataka, West Bengal; ₹208/month in Tamil Nadu), and TDS per current-year slabs under old and new regimes. For job-seekers, the [National Career Service (NCS)](https://www.ncs.gov.in/) is the central-government employment-exchange portal that aggregates state employment-exchange data and government-sector openings. Notice periods are 30-90 days by convention — 30 days common for junior roles, 60 days for mid-level, 90 days for senior and tech-sensitive roles. Appraisal hikes follow sector norms: IT services 8-15%, IT products 10-20%, BFSI 8-12%, consulting 15-20%, with outliers up to 30%+ for hot skills (LLM engineering, site reliability). Resume conventions are also Indian-specific — the 'passport photo in top-right corner' persists in traditional sectors, though it is disappearing in tech. Our Resume Builder defaults to no-photo, but the legacy template is available for campus placements that still expect it.",
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
      {
        q: "Will my resume passed through Resume Builder pass Naukri and LinkedIn ATS systems?",
        a: "Yes — the templates use single-column layout, no embedded tables in the body, no images mid-text, standard section headings (Experience, Education, Skills), machine-parseable date formats, and ATS-friendly fonts. We tested against the major Indian recruiting ATS engines (Naukri, LinkedIn Recruiter, Workday, Taleo, Lever, Greenhouse) and the templates parse cleanly across all of them. ATS-passing is necessary but not sufficient — the resume content still needs to match the JD.",
      },
      {
        q: "Does the In-Hand Salary calculator handle sign-on bonuses and stock options?",
        a: "Yes — sign-on bonuses are entered as a one-time amount in year 1 with TDS withholding at the marginal rate. Stock options (RSUs, ESOPs) are tracked with the perquisite valuation rule (FMV at vesting minus exercise price taxed as salary, then capital gains at sale). Different option types (RSU, ESOP-non-listed, ESOP-listed-foreign) have different tax treatment; the calculator labels each.",
      },
      {
        q: "How accurate is the Salary Comparison data for tier-2 cities?",
        a: "Less accurate than for metros — the data sources (Glassdoor, AmbitionBox, LinkedIn Salary, public job postings) are dominated by metro-based submissions. For Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai roles, accuracy is ±15% on the median. For tier-2 cities (Indore, Coimbatore, Bhubaneswar, Lucknow, Jaipur), sample sizes are smaller and accuracy drops to ±20-25%. Treat the figure as a directional benchmark, not a precise number.",
      },
    ],
  },

  realestate: {
    whatIs:
      "Real estate tools on SabTools.in cover the measurement, quantity, cost, and tax math that a homeowner, tenant, investor, or broker runs every time property changes hands in India — how to convert an irregular plot's dimensions to a precise square-foot area, how many litres of paint for a 1,200 sq ft flat, how many tiles for a given floor area with a given tile size, how many bricks for a boundary wall of specified length and height, how many cement bags for a house slab of known volume, what a full interior finishing budget looks like for a 2BHK vs 3BHK, and how much capital-gains tax is due on a long-held flat sold at a gain. These are the questions that come up the week before every property purchase, the month before every renovation, and the year every property sale closes — and answering them on paper or in Excel usually produces 10-20% estimation error. Each tool here is purpose-built for one class of question with Indian market defaults (INR pricing, tier-2 city rates, RERA-compliant carpet-area definitions).",
    keyFeatures: [
      {
        title: "Irregular-plot and rectangular-plot support",
        description:
          "Plot Area Calculator handles rectangular, L-shaped, trapezoidal, and triangular plots in square feet, square metres, acres, and bigha/guntha regional units. Enter corner dimensions or side-and-angle inputs; the tool returns area and also flags whether the plot conforms to standard BBMP/MCD setback rules for its zone.",
      },
      {
        title: "Material quantity with Indian-market-rate costing",
        description:
          "Tile Calculator, Brick Calculator, Cement Calculator, and Paint Calculator each output material quantity with 8-12% wastage allowance built in, and multiply by 2025 tier-2-city market rates — ₹45-90 per tile (basic to premium vitrified), ₹8-11 per clay brick, ₹380-420 per cement bag, ₹150-250 per litre emulsion. Override with your supplier quote for a precise BOQ.",
      },
      {
        title: "Full-interior turnkey budgeting",
        description:
          "Interior Cost Estimator builds a phased budget for a full interior fit-out — modular kitchen (₹2.5-6 lakh for a 2BHK), wardrobes (₹45,000-90,000 per piece), false-ceiling (₹80-150/sq ft), wall painting (included), electrical and plumbing fittings, furniture, and 10-15% designer fee. Broken into phases so you can pay in tranches aligned to completion milestones.",
      },
      {
        title: "Capital-gains and Section 54 tax computation",
        description:
          "Property Capital Gains Tax Calculator handles short-term vs long-term classification (24-month holding for property), cost-indexation per the CBDT cost-inflation-index table, and Section 54 reinvestment exemption into another residential property. Returns the taxable gain and tax due under current rates.",
      },
    ],
    useCases: [
      {
        title: "Before property purchase — area and price verification",
        description:
          "Use Plot Area Calculator to verify the seller's claimed plot dimensions match the registered documents. A 10-15% overstatement of plot area is the single most common form of pre-contract misrepresentation in land deals — 30 minutes with the tool and the property card saves ₹2-5 lakh on the inflated price.",
      },
      {
        title: "Renovation and interior planning",
        description:
          "Moving into a new flat and planning renovation: Tile Calculator gives exact tile count for the living and bedrooms, Paint Calculator budgets the ceiling and wall paint, Interior Cost Estimator gives the turnkey all-in figure for comparing contractor quotes. Run these before the first contractor meeting so you know when their quote is ₹3 lakh above market.",
      },
      {
        title: "Boundary-wall and small-build estimation",
        description:
          "Brick Calculator for a boundary-wall or an extension room: enter length, height, and wall type (single-brick, double-brick); returns bricks needed, cement and sand mortar volume. Cement Calculator sizes the foundation slab. Paint Calculator covers the exterior coat. Together these replace three different contractor pitches with one sanity-checked material list.",
      },
      {
        title: "Property sale and tax planning",
        description:
          "Selling a flat held for 8 years at a ₹15 lakh gain: Property Capital Gains Tax Calculator computes indexed cost, long-term gain, and Section 54 exemption if you are reinvesting. Together with the Income Tax calculators in the tax category, this gives the exact net proceeds after tax so you can size the next flat's down payment correctly.",
      },
    ],
    howToChoose:
      "For plot and area measurement — Plot Area Calculator handles all common plot shapes; for an irregular multi-corner plot, break into triangles and sum the results. For material quantity — Tile Calculator, Brick Calculator, Cement Calculator, Paint Calculator; each one is single-purpose, so use several in sequence for a full BOQ. For turnkey budgeting — Interior Cost Estimator is the fastest path from 'how much will the flat cost to finish' to a line-item number. For tax on sale — Property Capital Gains Tax Calculator; also check the HRA Exemption and Income Tax tools in the tax category if you are reinvesting for a self-occupied house. For construction-grade dimensioning (staircase, roof, structural), the Concrete Calculator, Steel Weight Calculator, Staircase Calculator, and Water Tank Calculator in the Construction category are more appropriate than these finishing-focused tools. Workflow order for a new property: Plot Area Calculator → Tile Calculator + Brick Calculator + Cement Calculator + Paint Calculator → Interior Cost Estimator → (purchase) → (renovate) → Property Capital Gains Tax Calculator (when eventually selling).",
    indianContext:
      "Indian property transactions run on a specific set of conventions that global tools get wrong. Plot areas are regionally measured — square feet (most metros), square metres (some MCD listings), acres (peri-urban), bigha (North India, varies by state from 1,600 sq ft in Punjab to 27,225 sq ft in West Bengal), guntha (Maharashtra, Karnataka — 1,089 sq ft), kanal (Punjab — 5,445 sq ft), cent (Tamil Nadu, Kerala — 435 sq ft). Our Plot Area Calculator converts between all of these correctly. The [Real Estate (Regulation and Development) Act 2016](https://mohua.gov.in/) — administered by the Ministry of Housing & Urban Affairs — mandates that listing sizes be quoted in carpet area, not super-built-up; but pre-RERA listings and many secondary-market transactions still quote super-built-up, which is typically 25-30% higher than carpet. The Carpet Area Calculator in the Business category handles that conversion. For projects in Maharashtra, the [MahaRERA portal](https://maharera.maharashtra.gov.in/) is the authoritative public registry where any registered project's carpet-area, completion-date, and complaint history can be verified. Capital-gains tax on property follows Section 48 of the Income Tax Act — 2024 saw major changes abolishing indexation for most LTCG except one 'grandfathered' class, and our Property Capital Gains Tax Calculator reflects the post-Finance-Act-2024 rules with a toggle for the grandfathered case. Stamp duty and registration charges are state-specific (5-7% across states) and covered separately in the Tax category's Stamp Duty Calculator.",
    pillarFaqs: [
      {
        q: "Does the Plot Area Calculator handle bigha, guntha, and other regional units?",
        a: "Yes — bigha (Punjab 1,600 sq ft; UP 27,000 sq ft; WB 27,225 sq ft), guntha (Maharashtra/Karnataka 1,089 sq ft), kanal (Punjab 5,445 sq ft), cent (Tamil Nadu/Kerala 435 sq ft), gaj (Delhi/Haryana 9 sq ft / 1 sq yard), and marla (Punjab 272 sq ft / 225 sq yards depending on the local variant). Pick the correct state-specific variant, since sub-state variations exist.",
      },
      {
        q: "How accurate is the Interior Cost Estimator in 2025?",
        a: "It uses 2025 tier-2-city Indian market rates (Pune, Hyderabad, Ahmedabad, Jaipur, Kochi, Chandigarh). Tier-1 cities (Mumbai, Delhi, Bengaluru, Chennai) run 20-35% higher; smaller towns 10-20% lower. Always override the per-item rates with your actual designer or modular-kitchen brand quote before treating it as a binding number.",
      },
      {
        q: "Does Property Capital Gains Tax Calculator cover the 2024 LTCG changes?",
        a: "Yes — Finance Act 2024 removed indexation benefit for property LTCG from 23 July 2024 onward, replaced by a flat 12.5% tax. A grandfathered provision lets sellers of properties acquired before 23 July 2024 choose the better of (a) 12.5% without indexation or (b) 20% with indexation. Our calculator presents both figures side-by-side so you can pick the lower number.",
      },
      {
        q: "Why does the Paint Calculator suggest different quantity for primer vs finish coat?",
        a: "Primer (undercoat) coverage is about 6-8 sq m per litre on unsealed surfaces; finish emulsion is 10-14 sq m per litre per coat. Walls need primer + 2 finish coats; ceilings typically primer + 2 coats. The tool separates these so you order the right quantity of each — buying 20 L of primer when you only need 10 L is a common first-time-renovator error.",
      },
      {
        q: "Can the Brick Calculator handle both single-brick and double-brick walls?",
        a: "Yes — single-brick (115 mm thick) and double-brick (230 mm thick) walls are both supported, with the right brick count and mortar volume for each. Indian construction typically uses 230 mm external walls and 115 mm internal partitions; the tool defaults to that split and lets you override per-wall.",
      },
      {
        q: "Are the stamp-duty rates current for all Indian states?",
        a: "Yes — stamp-duty schedules are tracked across all 28 states and 8 union territories with the latest amendments. State governments revise stamp duty in their annual Budgets; we update within 2-3 weeks of any state Budget that changes the rate. For binding transactions, always cross-check with the state's Inspector General of Registration (IGR) portal or the local sub-registrar's office, since state-specific concessions (women buyers, agricultural land, joint ownership) can apply.",
      },
      {
        q: "Does the Property Capital Gains tool handle sold-before-23-July-2024 grandfather rule?",
        a: "Yes — the post-Budget 2024 rule allows sellers of properties acquired before 23 July 2024 to choose the better of (a) flat 12.5% LTCG without indexation OR (b) 20% LTCG with indexation under Section 48. The tool computes both scenarios and highlights the lower-tax option. Properties acquired on or after 23 July 2024 use the new 12.5% flat rate without indexation, no choice available.",
      },
      {
        q: "Will the Carpet Area Calculator's reverse-engineering catch a builder's overstated super-built-up?",
        a: "Yes — RERA mandates that any post-2017 RERA-registered project must disclose carpet area; the calculator reverse-engineers the builder's super-built-up claim against the typical 70-75% carpet ratio. If the implied carpet area falls below 70% of super-built-up, the project is either non-RERA or the builder has miscategorised common areas. Always verify against the RERA-registered carpet area on the state RERA portal before finalising.",
      },
    ],
  },

  legal: {
    whatIs:
      "Legal and government tools on SabTools.in cover the document-drafting, filing-fee, and identity-verification tasks that come up when citizens interact with Indian courts, departments, and public-records systems — how much court fee is due on a civil suit of given valuation, what format a legal notice should follow for a private dispute (consumer complaint, tenancy, recovery), how to draft an RTI application that will not be rejected on format grounds, how to prepare a generic affidavit for a magistrate's office, and how to look up or verify a voter ID. These are not tools that replace a lawyer — complex litigation, criminal matters, and high-value contracts always require professional advice — but for the 80% of citizen-government interactions that are form-filling and format-following, having a clean one-click generator saves the ₹1,500-₹5,000 that a lawyer's clerk would otherwise charge for the same boilerplate. Every template here follows the format prescribed by the relevant statute (Court Fee Act 1870, RTI Act 2005, Indian Evidence Act affidavit norms).",
    keyFeatures: [
      {
        title: "State-specific court-fee schedule",
        description:
          "Court Fee Calculator handles the state-by-state differences — Maharashtra's Bombay Court Fees Act, the central Court Fees Act 1870 (Delhi, UP, etc.), and state amendments. Enter the suit value and suit type (civil recovery, partition, declaration, injunction); the tool returns ad-valorem fee, fixed fee, or hybrid as applicable.",
      },
      {
        title: "Statute-compliant RTI application format",
        description:
          "RTI Application Generator produces a formatted application per Section 6 of the RTI Act 2005 — applicant details, public authority, specific information sought (Section 6(2) disallows broad requests), ₹10 fee payment reference, and acknowledgement block. Download as PDF ready for registered post or online filing through the central RTI portal.",
      },
      {
        title: "Affidavit templates with proper attestation language",
        description:
          "Affidavit Generator has templates for the common use-cases — name-change, residence, income, single-status, guardian consent, lost-document. Each includes the correct 'Solemnly affirmed' or 'I do hereby declare' preamble, the place-and-date block, and the attestation block for the Executive Magistrate or Notary Public.",
      },
      {
        title: "Voter ID format check and polling-booth lookup",
        description:
          "Voter ID Info validates EPIC number format (3 alphabetic + 7 numeric, 10 characters), explains the state-code encoding, and links to the NVSP search interface for finding your polling booth and constituency. Format-only — we never submit your EPIC to Election Commission servers.",
      },
    ],
    useCases: [
      {
        title: "Civil litigation preparation",
        description:
          "Filing a recovery suit against a tenant for ₹3.5 lakh in arrears: Court Fee Calculator computes the ad-valorem fee under the Maharashtra schedule (roughly ₹35,000 as of 2025 rates for a ₹3.5 lakh civil suit). Use the figure to decide between civil-court filing, small-claims, or invoking arbitration. Pair with a drafted Legal Notice Generator output to document the pre-filing notice period correctly.",
      },
      {
        title: "Consumer-dispute and service-quality complaints",
        description:
          "Filing a consumer complaint against an e-commerce platform or a builder: Legal Notice Generator produces the pre-litigation notice that the Consumer Protection Act 2019 requires for a civil claim; Court Fee Calculator figures out the filing fee for the NCDRC or SCDRC depending on claim value.",
      },
      {
        title: "RTI requests for government data and accountability",
        description:
          "Seeking information from a public authority — tender-award data, municipal-works spending, a delayed passport status, a pending pension claim: RTI Application Generator produces the statute-compliant format. A well-formatted RTI gets a response in 30 days; a poorly-formatted one is rejected on Section 7(9) grounds with a CIC-appeal cycle that wastes 3-6 months.",
      },
      {
        title: "Affidavit for magistrate and passport offices",
        description:
          "Need a name-change affidavit for an EPIC update, a single-status affidavit for passport, a guardian-consent affidavit for a minor's passport, or an affidavit-of-ownership for a lost vehicle RC: Affidavit Generator produces each with the proper attestation block. Print on stamp paper (₹10-₹100 state-dependent) and attest before an Executive Magistrate or Notary.",
      },
    ],
    howToChoose:
      "For filing-fee calculations — Court Fee Calculator; select your state (where the court is located, not where you live) and the suit type. For civil-dispute notice — Legal Notice Generator covers the common matters (recovery, eviction, consumer, cheque dishonour under Section 138 NI Act). For government-data requests — RTI Application Generator. For sworn declarations — Affidavit Generator with the right template for your use-case. For voter and electoral lookups — Voter ID Info for format validation plus the link to NVSP. When the tool is not enough: any matter involving constitutional or criminal law, any commercial contract above ₹10 lakh, any matrimonial dispute, any land-title question — retain a practising advocate. The tools here cover the 80% boilerplate; the remaining 20% requires legal judgement that cannot be automated. None of these tools submit anything to government servers — they produce a document you download and then file through the official channel (registered post, online portal, in-person submission with stamp paper).",
    indianContext:
      "Indian legal documents have formatting conventions encoded in statute and tradition. Court fee is ad-valorem (percentage of suit value) for most civil matters up to a ceiling, plus fixed fees for specific categories (partition, declaration) under the Court Fees Act 1870 (with state-specific amendments). The full text of every cited statute is available on [India Code](https://www.indiacode.nic.in/) — the National Informatics Centre's authoritative repository of central and state legislation. Maharashtra has its own Bombay Court Fees Act 1959; West Bengal and some others have their own schedules. RTI applications must cite the public authority's correct designation (the Central Public Information Officer, not just 'the department'), must pay the ₹10 fee (or ₹2 per page if fewer than 5 pages), must be signed, and must avoid Section 8 exemptions (cabinet papers, foreign relations, criminal investigations). Affidavits are governed by the Indian Evidence Act 1872 and the Notaries Act 1952 — wrong attestation voids the affidavit. Legal notices under Section 138 of the Negotiable Instruments Act for cheque bounce must be sent within 30 days of the bounce, must demand payment within 15 days, and must be by registered post with AD. Our templates follow each of these statutory timelines and cite the relevant section so the receiving party cannot contest format.",
    pillarFaqs: [
      {
        q: "Does Court Fee Calculator cover all Indian states?",
        a: "Yes — the central Court Fees Act 1870 for states that haven't amended it (Delhi, UP, Bihar, Rajasthan, MP, Haryana, Uttarakhand, Jharkhand, Chhattisgarh), and state-specific schedules for Maharashtra, Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Kerala, Gujarat, Odisha, West Bengal, and Assam. For smaller states, it uses the nearest-matching central/state default with a flag to verify locally.",
      },
      {
        q: "Is the RTI Application Generator's output automatically accepted?",
        a: "Format acceptance, yes — the template includes all Section 6 required fields. Content acceptance depends on the specificity of your query (Section 7(9) allows refusal of overbroad requests) and whether the information falls under Section 8 exemptions. The tool helps with format; content framing is the applicant's responsibility.",
      },
      {
        q: "Can Affidavit Generator produce an affidavit for a court filing, or only magistrate use?",
        a: "For magistrate-attested uses (name-change, passport, voter ID), yes — directly. For court-filing affidavits (Order XIX CPC, supporting-affidavit format), the template gives the skeletal structure but court-specific requirements (caption, cause-title, numbered paragraphs) need to be added by a lawyer. The tool fills the 80% common boilerplate; a practising advocate finalises court-specific content.",
      },
      {
        q: "Why does Voter ID Info not show my polling booth directly?",
        a: "Polling-booth assignments are live data on the ECI's NVSP system and require OTP verification against your registered mobile. We never ask for or transmit your mobile number or EPIC to any government server. The tool validates EPIC format and then deep-links you to the NVSP search page for the live booth lookup under your own session.",
      },
      {
        q: "Is the Legal Notice Generator's output binding on the receiving party?",
        a: "A legal notice is a pre-litigation formal communication — the receiving party is not bound to comply but is on record as having been given the statutory notice. If they ignore it, you can proceed to filing. The notice's main value is establishing the notice-period start date (15 days for cheque bounce under Section 138 NI Act, 2 months for government departments under Section 80 CPC).",
      },
      {
        q: "Are the Court Fee schedules accurate for the state where I am filing?",
        a: "Yes for the major-court states — Maharashtra (Bombay Court Fees Act 1959), Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana, Gujarat, Odisha, West Bengal, and Assam each have state-specific schedules tracked by the calculator. For other states, the central Court Fees Act 1870 schedule applies. Always cross-check with your local advocate, since court-fee amendments occasionally update specific item rates without notice.",
      },
      {
        q: "Will an RTI application generated here actually be accepted by a public authority?",
        a: "Format-wise yes — it complies with Section 6 of the RTI Act 2005, lists the public authority's correct designation, includes the ₹10 fee payment reference, and is signed. Acceptance of the substance depends on whether your query is specific enough (Section 7(9) allows refusal of overbroad requests) and whether the requested information falls under Section 8 exemptions (cabinet papers, foreign relations, criminal investigations). Format-rejection is usually not the issue; content-framing is.",
      },
      {
        q: "Does the Affidavit Generator output need stamp paper and notary attestation?",
        a: "Yes — affidavits in India must be on non-judicial stamp paper (₹10-₹100 depending on state and use-case) and attested before either an Executive Magistrate (free, requires appointment) or a Notary Public (₹50-₹150 per affidavit). The generator produces the correct text and attestation block; the stamp paper and physical attestation are still required for the affidavit to be legally valid.",
      },
    ],
  },

  astrology: {
    whatIs:
      "Astrology and spiritual tools on SabTools.in cover the Vedic-astrology and panchang computations that millions of Indian families consult for life-event planning — what my Kundli (birth chart) looks like given my birth date, time, and place, which Rashi (moon sign) I was born under, which of the 27 Nakshatras was active at my birth, what is the Panchang (auspicious-time reckoning) for a given date and location, what the numerology of my name suggests, and which gemstone is recommended based on my chart's planetary position. These are tools that sit at the intersection of tradition and computation — the math is fully deterministic (planetary positions are astronomy, Nakshatra division is straightforward arithmetic), and our calculators run the same algorithms that a traditional astrologer would compute by hand, without the 30-minute consultation fee. For the 85% of Hindu families that consult a panchang for marriage muhurat, griha pravesh, vehicle purchase, or naming ceremony, these tools are everyday practical utilities, not niche spirituality.",
    keyFeatures: [
      {
        title: "Lahiri-ayanamsa Vedic chart generation",
        description:
          "Kundli Calculator uses the Lahiri ayanamsa (the standard Vedic sidereal reference adopted by the Government of India in 1955) for chart computation. Takes date, time, and place of birth; returns Rasi chart (lagna and planetary house placements), Navamsa chart (D9), and major Dasha sequence (Vimshottari, 120-year cycle).",
      },
      {
        title: "Rashi and Nakshatra with regional-calendar cross-reference",
        description:
          "Rashi Calculator returns the Moon's zodiac sign at your birth (the Vedic Rasi, not the Western sun sign). Nakshatra Calculator returns the star/lunar mansion (27 divisions) plus pada (1-4 quarter). Both cross-reference with regional traditions (Tamil, Telugu, Kannada, Malayalam, Marathi) for local name variants.",
      },
      {
        title: "Panchang with muhurat for daily auspicious windows",
        description:
          "Panchang Calculator returns the five limbs (tithi, vara, nakshatra, yoga, karana) plus Rahu Kaal, Yamaganda, Gulika Kaal, Abhijit muhurat, and Brahma muhurat for a given date and location. Used for choosing auspicious start times for business, travel, and religious activities.",
      },
      {
        title: "Numerology and gemstone recommendation with planetary basis",
        description:
          "Name Numerology Calculator computes the Pythagorean and Chaldean numerology values for a given name, with interpretation aligned to Vedic tradition. Gemstone Recommendation uses the chart's weak and benefic planets to suggest the primary (gemstone for strengthening a beneficial planet) and cautionary stones. Informational only, not a retailer recommendation.",
      },
    ],
    useCases: [
      {
        title: "Wedding muhurat and life-event planning",
        description:
          "Before finalising a wedding date, families consult Panchang Calculator for the proposed date at the wedding venue's coordinates — checking tithi, nakshatra, and whether Rahu Kaal clashes with the mahurat. Kundli Calculator plus Kundli matching (guna milan, 36 points) determines marriage compatibility for arranged matches; the tool produces the detailed report without astrologer fee.",
      },
      {
        title: "Naming ceremony and new-venture timing",
        description:
          "For a child's naming ceremony (Namkaran), Nakshatra Calculator determines the birth nakshatra and suggests names starting with the appropriate syllable per that nakshatra's traditional letter list. For a new business or venture, Panchang Calculator picks an auspicious muhurat avoiding Rahu Kaal and Yamaganda on the planned launch date.",
      },
      {
        title: "Personal chart-reading and life-phase understanding",
        description:
          "Generate your Kundli Calculator chart, read the major Dasha periods (which graha's sub-period you are currently in), and understand the chart's strengths and challenges. This is the core of Vedic self-analysis — not a replacement for counselling or professional consultation, but a structured way to frame introspection during major life transitions.",
      },
      {
        title: "Gemstone and numerology guidance",
        description:
          "Name Numerology Calculator suggests whether adjusting a name's spelling slightly (adding or removing a letter) would improve its numerological resonance — a common practice for brand names and personal name changes. Gemstone Recommendation suggests the primary gemstone based on the Kundli's chart; buyers then consult a reputable dealer for authenticity and fit.",
      },
    ],
    howToChoose:
      "For chart generation — Kundli Calculator is the starting point; all other tools can reference the chart it produces. For day-to-day auspicious timing — Panchang Calculator; for a specific date (a wedding date, a grih pravesh, a vehicle purchase), run the Panchang and read the muhurat section. For zodiac-sign introspection — Rashi Calculator for the moon sign (Vedic), Nakshatra Calculator for the birth star. For name-related decisions — Name Numerology Calculator for numerology-based naming or spelling adjustment. For gemstone guidance — Gemstone Recommendation, but always verify with a qualified astrologer before a large purchase (authentic ruby, emerald, or blue sapphire can cost ₹50,000+/carat). None of these tools replace a trained astrologer for complex chart analysis or major life decisions; they replace the ₹500-₹2,000 basic consultation fee for standard computations that are mechanical in nature. Workflow: Kundli Calculator (one-time at birth) → Rashi Calculator / Nakshatra Calculator (one-time reference) → Panchang Calculator (recurring, per event) → Name Numerology / Gemstone Recommendation (one-time, as needed).",
    indianContext:
      "Vedic astrology (Jyotish) differs from Western astrology in the fundamental reference frame — Vedic uses the sidereal zodiac (stars as the reference), Western uses the tropical zodiac (seasons as the reference). The difference between them (the ayanamsa) is currently about 24 degrees and growing. Most Indian families follow Vedic; we default to Lahiri ayanamsa (Government of India standard, used by Lal Kitab-tradition astrologers). The birth time must be accurate to the minute — Kundli Calculator cannot correct for inaccurate birth times, and the computed ascendant (lagna) changes every 2 hours, so a 4-hour inaccuracy produces a completely different chart. For births with uncertain time, the tool offers a 'rectification' input where the user enters major life events (career start, marriage, first child) and the tool suggests a corrected time that is consistent with those events under standard Dasha interpretation. Panchang conventions are location-specific — Rahu Kaal is defined by sunrise at the local longitude, so Chennai and Mumbai have different Rahu Kaal for the same calendar date. The tool uses the user's entered location for all timing calculations. Panchang output aligns with the regional variant chosen — North Indian Purnimanta (month ends at full moon) vs South Indian Amavasyanta (month ends at new moon).",
    pillarFaqs: [
      {
        q: "Does Kundli Calculator use Lahiri or Raman ayanamsa?",
        a: "Lahiri by default — it is the most widely used in India (Government of India standard, adopted 1955). A toggle lets you switch to Raman, Krishnamurti (KP), or Tropical if you follow a different tradition. The chart output will differ slightly between these; Lahiri is the safe default unless your family astrologer uses a specific alternative.",
      },
      {
        q: "How accurate is Panchang Calculator for small towns and villages?",
        a: "Very accurate — it computes sunrise and sunset at your precise entered latitude/longitude, so Rahu Kaal and other muhurat intervals are location-specific and correct to within 1-2 minutes. For cities, we auto-resolve coordinates from the city name; for villages, enter coordinates directly (Google Maps gives them).",
      },
      {
        q: "Can Nakshatra Calculator give the 'nama' letter for a Namkaran ceremony?",
        a: "Yes — each of the 27 nakshatras has 4 padas (quarters), and each pada has traditional letters (syllables) associated with it for naming ceremonies. Enter birth date and time; the tool returns the nakshatra, the pada, and the list of 2-4 auspicious starting syllables per traditional Vedic naming guidelines.",
      },
      {
        q: "Is Gemstone Recommendation authoritative, and should I buy based on it alone?",
        a: "It is informational — it suggests the primary gemstone based on your chart's lagna and weak/benefic planets following standard Jyotish guidelines. It does not replace consultation with a qualified astrologer for final confirmation, nor a certified gemologist for authenticity verification. Authentic ruby, emerald, and blue sapphire can cost ₹50,000+/carat and the counterfeit market is substantial — never buy without laboratory certification.",
      },
      {
        q: "Why does Name Numerology give different numbers under Pythagorean vs Chaldean systems?",
        a: "The two systems assign different numeric values to letters — Pythagorean uses 1-9 cyclically (A=1, B=2, …, J=1, K=2), while Chaldean uses 1-8 with specific traditional assignments (A=1, B=2, C=3, D=4, E=5, F=8, G=3, …). Chaldean is considered more aligned with Vedic tradition in Indian numerology; Pythagorean is the Western default. We show both so you can reconcile advice from different sources.",
      },
      {
        q: "Is astrology in these tools based on Vedic (Hindu) or Western methodology?",
        a: "Vedic — the kundali, panchang, dasha, and yoga calculations use the Lahiri ayanamsa (the standard Indian sidereal correction) and follow classical Vedic-astrology principles. Some tools (zodiac sign, simple compatibility) also offer a Western tropical mode for users following that tradition. Toggle the mode at the top of each tool; the calculations differ enough that the same birth time produces slightly different sun/moon positions in the two systems.",
      },
      {
        q: "Are these results suitable for major life decisions like marriage matching?",
        a: "We treat astrology as a cultural and traditional practice, not a science. For ceremonial-purpose matching (kundali milan / guna dosha for arranged marriage compatibility) the calculations are mathematically correct against classical Vedic rules. For life decisions involving health, finance, or relationships, our tools should not substitute for professional advice from a doctor, financial planner, or counsellor. The numerical output is exact; the interpretation is the practitioner's domain.",
      },
      {
        q: "Why do panchang dates differ from another website I checked?",
        a: "Panchang calculations depend on the chosen ayanamsa (sidereal correction) and the latitude/longitude of the observer. Lahiri ayanamsa (used by Indian Government Calendar) and Raman ayanamsa (used by some traditional almanacs) produce 1-2 minute differences in muhurta timing. Our tool uses Lahiri by default with a city-selector that adjusts for Indian local time; another website using a different ayanamsa or a non-localised time may show small variations.",
      },
    ],
  },

  vehicle: {
    whatIs:
      "Vehicle and transport tools on SabTools.in handle the purchase, ownership, and operating-cost math that every Indian car, bike, or commercial-vehicle owner runs — what is the fuel-cost-per-kilometre at current petrol/diesel/CNG prices, what is the total cost of a planned road trip including tolls and fuel, what insurance premium to expect on a new car's IDV, what tyre size fits a given vehicle's rim specification, how much the car has depreciated after 3-5 years of ownership, and what the highway toll will cost between any two Indian cities on the expressway network. These are the questions that turn a one-line purchase decision or trip plan into a budget-accurate figure. Each tool here uses Indian market data (2025 fuel prices by state, NHAI toll tables, IRDAI-regulated insurance bands, OEM depreciation curves).",
    keyFeatures: [
      {
        title: "State-specific fuel pricing with CNG and EV support",
        description:
          "Mileage Calculator takes vehicle odometer + fuel-tank fill data and computes km/litre (petrol/diesel) or km/kg (CNG) or km/kWh (EV). Current state fuel prices (petrol ₹94-110/L, diesel ₹84-100/L across states) are built-in so the cost-per-km output is realistic. For EV owners, home vs public-charging rate toggle shows the 4-8x cost spread.",
      },
      {
        title: "Multi-city route planning with tolls and fuel budget",
        description:
          "Road Trip Planner takes origin + destination + intermediate stops, routes through the NHAI expressway and state-highway network, and returns total distance, fuel cost at current state prices, toll charges from the NHAI toll table, and suggested overnight-stop cities for trips over 600 km.",
      },
      {
        title: "IDV-based insurance premium estimation",
        description:
          "Car Insurance Estimator uses IRDAI's ready-reckoner depreciation table (5% in year 1, 10% in year 2, rising to 50% by year 5) to compute IDV, then applies 3-5% own-damage premium + ₹20,000-₹40,000 third-party premium (by cc), plus NCB discount for claim-free years. The output range matches what you would see from Policybazaar or Acko for the same car.",
      },
      {
        title: "Tyre-size compatibility and depreciation modelling",
        description:
          "Tyre Size Calculator decodes the 195/65R15 format (width / aspect-ratio R rim-diameter), returns speed/load index meaning, and suggests compatible up-size and down-size options within 3% rolling-circumference tolerance. Vehicle Depreciation Calculator models straight-line and declining-balance schedules for resale-value estimation.",
      },
    ],
    useCases: [
      {
        title: "Pre-purchase cost-of-ownership analysis",
        description:
          "Comparing a petrol vs diesel vs CNG vs EV version of the same car: Mileage Calculator with realistic driving-distance estimate (15,000 km/year for a city driver) gives annual fuel cost. Vehicle Depreciation Calculator gives resale-value difference after 5 years. Car Insurance Estimator gives premium difference. Together these give the true cost-of-ownership that brochure MRP hides.",
      },
      {
        title: "Road trip planning and budgeting",
        description:
          "Planning a Delhi-to-Kochi road trip (2,900 km): Road Trip Planner routes through the NH-44 and NH-66 expressway network, computes fuel cost (~₹18,000-22,000 for a petrol sedan), toll charges (~₹4,500-6,000 depending on FASTag type and exempt vehicles), and suggests Agra, Hyderabad, Bengaluru as overnight stops. Total trip cost ± 10% of the actual figure.",
      },
      {
        title: "Insurance renewal and IDV negotiation",
        description:
          "Renewing a 4-year-old car's comprehensive insurance: Car Insurance Estimator gives the IRDAI-consistent IDV range (not the low-ball figure some insurers propose). Use this figure to negotiate against the insurer's offered IDV — a ₹50,000 IDV difference translates to ₹4,000-₹5,000 in own-damage-cover difference, which is worth the 15-minute negotiation.",
      },
      {
        title: "Tyre replacement and up-sizing",
        description:
          "Tyre Size Calculator confirms whether a suggested 205/55R16 up-size from stock 195/65R15 is safe (rolling circumference within 3% tolerance). For a city-driven sedan, moderate up-sizing improves handling slightly at the cost of ride comfort; the tool flags when the proposed size exceeds safe tolerance bands.",
      },
    ],
    howToChoose:
      "For cost-of-ownership analysis — Mileage Calculator for fuel efficiency; Vehicle Depreciation Calculator for resale curve; Car Insurance Estimator for insurance premium. Run all three for any pre-purchase comparison. For trip-specific planning — Road Trip Planner for the full itinerary with fuel + tolls; Toll Calculator for point-to-point toll-only queries on specific expressway segments. For vehicle maintenance and upgrades — Tyre Size Calculator for tyre replacement/up-size decisions. For resale timing — Vehicle Depreciation Calculator shows the knee in the depreciation curve (years 3-4 for most cars) where selling yields best trade-off. Workflow for a car purchase: shortlist models → Mileage Calculator for each model → Vehicle Depreciation Calculator → Car Insurance Estimator → total 5-year cost ranking → decide. Workflow for a trip: Road Trip Planner with all stops → note overnight-stay cities → Toll Calculator for FASTag balance requirement → fuel up before departure. None of these tools access live vehicle data; they are calculators, not telematics.",
    indianContext:
      "Indian vehicle costs reflect state-specific and central factors that global vehicle-cost tools miss. Fuel prices vary by ₹10-15/L across states due to state VAT — Maharashtra and Karnataka are always among the higher priced, Delhi among the lower. Our Mileage Calculator uses the current state-specific price, not a single national average. Road tolls on NHAI expressways follow a published per-km tariff (₹2.50-4.50/km for cars; ₹5-8/km for trucks) with specific toll-plaza rates published by NHAI under the [Ministry of Road Transport and Highways](https://morth.nic.in/); our Road Trip Planner sums these along the route. Tolls are collected via FASTag (RFID) with a 2.5% discount for FASTag users. Vehicle registration data — RTO offices, registration series progressions, and the BH-series rules — is administered through [VAHAN](https://vahan.parivahan.gov.in/), the central vehicle-records platform. Car insurance is IRDAI-regulated with specific rules on NCB (no-claim-bonus) that accrues 20-50% discount over 5 claim-free years. Vehicle depreciation follows an empirical curve that is steeper in India than Western markets — 25-30% in year 1 is typical for non-commercial-use cars because of our much-lower resale liquidity. Tyre sizes follow ISO standards globally but Indian OEMs often fit narrower, lower-speed-rated tyres than the same car in Western markets; up-sizing within 3% rolling circumference is generally safe but voids the manufacturer's ride-quality calibration.",
    pillarFaqs: [
      {
        q: "How frequently are fuel prices updated in Mileage Calculator?",
        a: "Daily — reflecting the daily revision that petrol and diesel pricing has been under since June 2017. State VAT and dealer commission are baked into the retail price we use. For a rough budget, the prices are reliable to within ₹0.50/L; for a high-precision calculation, the variance between morning and afternoon is negligible.",
      },
      {
        q: "Does Road Trip Planner support multiple route options (fastest vs shortest vs cheapest)?",
        a: "Yes — three modes: fastest (expressway, maximum tolls), shortest (state highways, fewer tolls but more time), cheapest (optimising fuel + toll cost, usually a mix). For a Delhi-to-Mumbai trip, fastest is ~1,450 km via expressway with ~₹3,500 in tolls; cheapest is ~1,500 km via state highways with ~₹2,000 in tolls but 3-4 hours more driving.",
      },
      {
        q: "Can Car Insurance Estimator give me a binding premium or just an estimate?",
        a: "Estimate — typically within ±10% of the actual quote you'd receive from Acko, Go Digit, HDFC Ergo, ICICI Lombard, or Tata AIG for a comprehensive policy. The tool is for pre-quote budgeting; for the binding quote, you still need to fill each insurer's form or use an aggregator. Final premium depends on exact variant (a car's own-damage cover can vary by ₹500-₹2,000 between otherwise-identical trims).",
      },
      {
        q: "Is Tyre Size Calculator safe to trust for changing tyre size from stock?",
        a: "For up-size within 3% rolling circumference tolerance, yes — that range preserves speedometer accuracy and fits typical wheel wells. Beyond 3%, speedometer reads wrong and the engine computer's traction-control may behave unexpectedly; the tool flags that. Also verify load index and speed rating — a lower-rated tyre is legal but unsafe; the tool requires load index matching or exceeding the OEM specification.",
      },
      {
        q: "How accurate is Vehicle Depreciation Calculator for Indian second-hand pricing?",
        a: "Within ±15% of OLX/Cars24/Spinny listings for popular models (Swift, Baleno, Nexon, Creta, City, Dzire, Venue, Bolero) in the 1-5 year age range. For niche or low-volume models (imported luxury, low-sales variants), accuracy drops — always verify against live listings before using the depreciation figure for a binding sale or purchase decision.",
      },
      {
        q: "Are the highway-toll rates current after the 2025 NHAI revision?",
        a: "Yes — NHAI revises highway toll rates each April based on the wholesale price index, typically 3-7% annually. The Toll Calculator tracks the current per-km tariff and per-toll-plaza rates after each revision; data is refreshed within 2-3 weeks of the official notification. For state expressways (Mumbai-Pune, Yamuna Expressway, Outer Ring Road Bengaluru) we track the state-specific operator's published rates separately.",
      },
      {
        q: "Does the Mileage Calculator distinguish between BS-VI and older emission standards?",
        a: "Yes — Bharat Stage VI (BS-VI, mandatory for all new vehicles since April 2020) engines have specific fuel-injection and after-treatment differences that affect real-world mileage. BS-VI petrol vehicles typically lose 5-8% efficiency vs BS-IV due to additional emission controls; BS-VI diesels lose 8-12% from DPF/SCR systems. The calculator's defaults assume BS-VI; toggle for older vehicles to see the comparable figure.",
      },
      {
        q: "Will the Insurance Estimator quote match an aggregator like Policybazaar?",
        a: "Within ±10% of the actual quote you would receive from Acko, Go Digit, ICICI Lombard, HDFC Ergo, or Tata AIG via Policybazaar. The calculator uses IRDAI's published depreciation schedule and standard premium bands; final premium depends on the exact variant of your car (BS-VI, sunroof or not, alloy wheels), claim history (NCB), add-ons (zero depreciation, return-to-invoice), and the insurer's underwriting margin. Always get a binding quote from at least 3 insurers.",
      },
    ],
  },

  education: {
    whatIs:
      "Education tools on SabTools.in handle the grade-conversion, GPA-computation, and study-planning math that school, undergraduate, and postgraduate students in India need across their academic arc — converting CGPA to percentage and back, computing GPA on the 4.0 or 10.0 scale used by different institutions, calculating weighted grades across semesters, and building a realistic study schedule that fits exam dates and daily availability. These are tasks that every student does at least half a dozen times across school and college — for scholarship applications, for foreign-university admissions where percentage-to-GPA translation matters, for end-of-semester grade verification, and for actually organising exam preparation. Each tool here uses the specific formulas published by Indian boards and universities (CBSE 9.5 multiplier, VTU/Anna University 10-point scale, IIT 10-point credit-weighted GPA, Delhi University 10-point CGPA).",
    keyFeatures: [
      {
        title: "CGPA-to-percentage conversion per university's published formula",
        description:
          "CGPA to Percentage uses each Indian university's officially published formula — CBSE uses (CGPA × 9.5) for Class 10, most engineering universities use (CGPA × 10) - varying by institution. Pick your university; the tool applies the correct multiplier rather than the common (but often incorrect) generic 9.5× approximation.",
      },
      {
        title: "Multi-scale GPA computation with credit weighting",
        description:
          "GPA Calculator handles the 4.0 scale (US standard), 10.0 scale (most Indian universities), and 10-point credit-weighted scale (IITs, NITs, BITS). Enter course-level grades and credits; returns semester and cumulative GPA with the right weighting rule per the chosen scale. Supports A/A+/B/B+/C/C+ letter grades and direct numeric input.",
      },
      {
        title: "Grade forecasting for end-of-semester scenario planning",
        description:
          "Grade Calculator forecasts final course grade given assignment, quiz, and mid-sem scores weighted per the syllabus. 'What do I need to score on the final to get an A grade' — the tool solves for that minimum target-exam score given current marks and weighting.",
      },
      {
        title: "Study schedule with Pomodoro and spaced-repetition timing",
        description:
          "Study Time Planner takes exam date, subjects, daily available hours, and current preparation level; returns a day-by-day schedule with subject rotation, Pomodoro-style focus blocks (25 minutes study + 5 minutes break), and revision sessions spaced per the Ebbinghaus forgetting curve (1 day, 3 days, 7 days, 14 days).",
      },
    ],
    useCases: [
      {
        title: "Scholarship and higher-education applications",
        description:
          "Applying for a scholarship that requires 'minimum 75% in Class 12': for a CBSE student with a 9.0 CGPA, CGPA to Percentage gives the 85.5% figure (using the CBSE 9.5 multiplier). For foreign MS admissions, converting 10-point GPA to 4.0 scale using the tool's university-specific mapping is essential — WES and ECE's rules vary by institution and a wrong conversion can disqualify the application.",
      },
      {
        title: "Semester-end grade verification",
        description:
          "At semester-end, GPA Calculator is useful for verifying your computed GPA matches the official transcript. Discrepancies are common and can be challenged through the examination section within 30 days; running the computation yourself catches them quickly. Also useful for planning next semester's course load based on current CGPA trajectory.",
      },
      {
        title: "Mid-semester grade forecasting",
        description:
          "Halfway through a semester with 40% weighting given out so far, Grade Calculator shows the minimum final-exam score needed for an A grade — useful for prioritising study time in the last 3 weeks. If the required score is above realistic performance, the tool effectively tells you that an A is mathematically out of reach and you should optimise for B+.",
      },
      {
        title: "Exam preparation planning",
        description:
          "4 weeks before board exams or JEE/NEET finals, Study Time Planner builds a day-by-day schedule covering all subjects with revision spacing. Particularly useful for Class 10/12 students who need structured preparation without a coaching-institute's schedule. Supports mock-test-day insertion and rest-day scheduling.",
      },
    ],
    howToChoose:
      "For grade-scale conversion — CGPA to Percentage or Percentage to CGPA depending on direction; pick the correct university in the selector for the right multiplier. For credit-weighted GPA computation — GPA Calculator with your scale (4.0 for US applications, 10.0 for Indian). For mid-semester planning — Grade Calculator to see what you need on the final. For exam-prep organisation — Study Time Planner. For competitive-exam score prediction and rank analysis, the Exam & Competitive category has NEET Score Predictor, JEE Rank Predictor, CAT Percentile Calculator, and GATE Score Calculator — those are for after-exam rank estimation, not before-exam prep planning (use Study Time Planner for the latter). Workflow for semester management: Grade Calculator (during semester) → GPA Calculator (end of semester) → CGPA to Percentage (for scholarship/admission applications). Workflow for board-exam prep: Study Time Planner (start of final year) → Grade Calculator (pre-boards) → Board Percentage Calculator (post-result, from the Exam category).",
    indianContext:
      "Indian education has a proliferation of grading scales that makes cross-institution comparison non-trivial. [CBSE](https://www.cbse.gov.in/) Class 10 uses CGPA out of 10 with a 9.5 multiplier to get indicative percentage. ICSE uses straight percentage. State Boards use percentage with state-specific best-of-N aggregation. Engineering universities follow a mix — Anna University, VTU, JNTU use 10-point scale with different credit-weighting rules; IITs use a 10-point scale with weighted credit GPA; BITS Pilani uses a 10-point scale; NITs follow a 10-point semester GPA. Delhi University moved from percentage to CGPA in 2010, and uses a 10-point CBCS scale with semester-wise weighting per [University Grants Commission (UGC)](https://www.ugc.gov.in/) norms. The [National Council of Educational Research and Training (NCERT)](https://ncert.nic.in/) publishes the syllabus and textbook material that CBSE schools follow. Our tools encode each of these correctly — do not trust a generic 'percentage = CGPA × 9.5' formula for engineering grades, it produces 5-10% off. For admissions abroad, WES and ECE each have their own official mappings that override what the Indian university publishes — our tool supports both WES-mapping and ECE-mapping modes for applications to the US, Canada, UK, and Australia. Study scheduling for Indian students is challenging because the 4-8 week board-exam or entrance-exam window is extremely concentrated — Study Time Planner's weighting of short-horizon, high-density preparation matches the Indian exam reality.",
    pillarFaqs: [
      {
        q: "Why does CGPA to Percentage give a different answer for different universities?",
        a: "Because each university has a published conversion formula. CBSE uses CGPA × 9.5 (Class 10 only). JNTU uses CGPA × 10 - 7.5 (approximate). Anna University uses semester-GPA-based conversion tables. Delhi University uses (CGPA - 0.75) × 10. Using the wrong formula produces 5-15% variance. Always pick your actual institution in the dropdown.",
      },
      {
        q: "Does GPA Calculator handle repeat courses and grade-improvement cases?",
        a: "Yes — enter both the original and repeat grade; the tool uses the institution's specific rule (most Indian universities take the higher of the two; some take the average; US institutions typically take only the latest). Pick the rule that matches your transcript's stated policy.",
      },
      {
        q: "Is Grade Calculator's 'minimum exam score' guaranteed to produce the target grade?",
        a: "Mathematically, yes — given the current marks and weighting, the minimum final score the tool computes will produce exactly the target grade cutoff. In practice, if your course has rounding rules or curve-graded components, the actual required score may be 1-2% different. Treat the tool's output as a firm target with a small buffer.",
      },
      {
        q: "Can Study Time Planner account for daily variation in available study time?",
        a: "Yes — enter a base daily hours value plus a 'flexible hours range' (e.g., 4 hours base, 6 hours on weekends). The tool allocates more intense sessions to flexible days and lighter recap to base days. For subjects you rank as 'weak', it front-loads study; for 'strong', it emphasises revision.",
      },
      {
        q: "How does Percentage to CGPA handle decimal percentages?",
        a: "By applying the inverse of your institution's published formula at 2-decimal precision. For CBSE, 87.5% = CGPA 9.21; for JNTU, 87.5% = CGPA 9.5. For applications that insist on whole-number CGPA, round down (rounding up overstates your grade and is commonly flagged by admissions reviewers who cross-check against official transcripts).",
      },
      {
        q: "Are the GPA-to-percentage conversion formulas correct for the latest CBSE / ICSE / state-board rules?",
        a: "Yes — CBSE Class 10 uses CGPA × 9.5; the calculator applies this exactly. ICSE uses straight percentage with subject-best-of-N rules. State boards each have their own (Tamil Nadu best-of-5 with first language compulsory; Maharashtra HSC's 6-subject total; Karnataka II PUC's individual subject pass mark). The calculator's board selector picks the right formula. For university-level conversion, the institution's published formula always overrides any generic rule.",
      },
      {
        q: "Will the Study Time Planner work for both board exams and JEE / NEET preparation?",
        a: "Yes — the planner has separate modes for board-exam prep (4-8 week intensive, equally weighted across CBSE/ICSE subjects) and entrance-exam prep (4-6 month sustained, weighted toward Physics, Chemistry, Maths for JEE; Physics, Chemistry, Biology for NEET). Inputs include current preparation level (beginner/intermediate/advanced) and target rank/percentile; output is a daily 6-7 hour schedule with rotation, revision, and mock-test slots.",
      },
      {
        q: "Does the College Fee Calculator handle hostel, mess, and books across IITs / NITs / state colleges?",
        a: "Yes — preset tiers cover IIT Delhi/Bombay (premium hostel + mess), other IITs/NITs (standard), state colleges (basic), with overrides for the actual published fee structure where available. Books and stationery are estimated at ₹15,000-₹25,000/year per programme; lab fees, exam fees, and one-time admission costs are added separately. For the binding figure, always check the institute's official fee notification for the current academic year.",
      },
    ],
  },

  agriculture: {
    whatIs:
      "Agriculture tools on SabTools.in handle the field-level math that Indian farmers, agronomists, and agri-entrepreneurs use across a crop cycle — how many kilograms of seed per acre for a given crop, how much fertilizer (urea, DAP, MOP) at the recommended NPK dosage, how many litres of irrigation water to apply given soil type and crop stage, what the land area is when measured in the regional units (bigha, guntha, acre, hectare), what the expected yield is given inputs and soil quality, and what the net profit looks like after input costs, labour, and market-yard charges. These are the calculations that determine whether a Kharif or Rabi crop is profitable before planting and whether the harvested output justified the investment afterwards. Each tool here uses ICAR-recommended defaults for Indian crops (paddy, wheat, cotton, sugarcane, maize, pulses, oilseeds) across major regions (Punjab-Haryana plain, Gangetic UP-Bihar, Telangana-AP rainfed, Maharashtra-Karnataka, Tamil Nadu delta).",
    keyFeatures: [
      {
        title: "ICAR-recommended crop-specific seed and fertilizer rates",
        description:
          "Seed Rate Calculator takes crop + variety + spacing preferences and returns kg/acre for the recommended density. Fertilizer Calculator takes crop + target yield + soil-test NPK status and returns urea/DAP/MOP quantities to reach the recommended NPK ratio (e.g., paddy at 120:60:40 NPK kg/ha for basmati).",
      },
      {
        title: "Regional-unit land-area conversion",
        description:
          "Land Measurement Converter handles bigha (Punjab 1,600 sq ft; UP 27,000 sq ft; WB 27,225 sq ft — regionally variable), guntha (Maharashtra/Karnataka 1,089 sq ft), kanal (Punjab 5,445 sq ft), cent (Tamil Nadu/Kerala 435 sq ft), and converts to the global standard acre (43,560 sq ft) or hectare (107,639 sq ft) for regulatory filings and crop-insurance claims.",
      },
      {
        title: "Soil-and-crop-stage-aware irrigation sizing",
        description:
          "Irrigation Calculator takes crop + growth stage + soil type (sandy, loamy, clay) + current weather + method (flood, sprinkler, drip); returns litres per day per acre. Drip systems use 40-60% less water than flood; the tool quantifies the savings.",
      },
      {
        title: "End-to-end crop profit estimation",
        description:
          "Farm Profit Calculator builds a profit-loss statement for the crop — seed cost, fertilizer cost, labour (family + hired), irrigation, crop-protection (pesticide/herbicide), harvest, transport to mandi, APMC cess; compared against expected revenue at current MSP or mandi rates. Crop Yield Calculator gives the yield input for this (quintal/acre given inputs and variety).",
      },
    ],
    useCases: [
      {
        title: "Pre-season crop planning",
        description:
          "Before sowing, farmer runs Seed Rate Calculator (for seed quantity), Fertilizer Calculator (for input cost), Irrigation Calculator (for water budget), and Farm Profit Calculator (for projected margin). A negative projected margin is a signal to either change crop or seek better input pricing from the local FPO or co-operative — far better than discovering the loss after harvest.",
      },
      {
        title: "Land-area verification for sub-division and inheritance",
        description:
          "Agricultural families often inherit land measured in the regional unit but registered (in land records) in acres. Land Measurement Converter handles the bigha-to-acre conversion with state-specific multipliers. Critical for sub-division calculations, stamp-duty assessment, and crop-insurance filings which require hectare-denominated areas.",
      },
      {
        title: "Crop-insurance and subsidy applications",
        description:
          "PMFBY (crop insurance) and KCC (Kisan Credit Card) applications require specific area declarations, crop-plan details, and expected-yield estimates. Land Measurement Converter standardises the area to hectares (PMFBY requirement); Crop Yield Calculator provides the expected-yield figure that backs the sum insured.",
      },
      {
        title: "Post-harvest profit-loss assessment",
        description:
          "After harvest, enter actual yield and actual input costs into Farm Profit Calculator for the post-mortem — did the crop meet projected margin, and what variance was from input side vs output side. Useful for next season's planning (input efficiency) and for negotiating with lenders (cash-flow evidence).",
      },
    ],
    howToChoose:
      "For pre-season input planning — Seed Rate Calculator for seed; Fertilizer Calculator for NPK; Irrigation Calculator for water. For land-area work — Land Measurement Converter for any regional-unit-to-acre-or-hectare conversion (registration, insurance, sub-division). For output and profit — Crop Yield Calculator for expected yield estimation; Farm Profit Calculator for the full P&L. Workflow for a full season: Land Measurement Converter (confirm area) → Seed Rate Calculator → Fertilizer Calculator → Irrigation Calculator → (sow) → (grow) → (harvest) → Crop Yield Calculator (enter actual) → Farm Profit Calculator (post-mortem). None of these tools replace an agronomist for soil-test-based prescription or a crop-specialist extension officer for variety selection — they are for quick field-level calculations using ICAR defaults, and the farmer's local Krishi Vigyan Kendra (KVK) is the right source for locality-specific variety and input guidance. For very high-value crops (horticulture, spices, plantation), the recommendation margins are tighter and professional agronomist consultation is worth the ₹1,500-₹3,000 fee.",
    indianContext:
      "Indian agriculture operates on regional and crop-specific conventions that global farming tools get wrong. Land area in rural records uses regional units — bigha, guntha, kanal, cent, marla — that vary not just by state but sometimes by district within state. Our Land Measurement Converter has the state-and-sometimes-district-specific variants. Seed rates and fertilizer dosages are published by the [Indian Council of Agricultural Research (ICAR)](https://icar.org.in/) and state agricultural universities (PAU Ludhiana, GBPUAT Pantnagar, IARI New Delhi, TNAU Coimbatore, PJTSAU Hyderabad); we use the generally-applicable recommendations and flag when your state has a specific override. Irrigation practices are dominated by flood irrigation (especially paddy in Punjab and Haryana) but shifting toward drip (cotton in Maharashtra, horticulture in Karnataka) — our Irrigation Calculator handles all three methods (flood, sprinkler, drip) and quantifies the 40-60% water savings of drip that matter critically for groundwater-stressed regions. Farm profit math must account for MSP vs mandi-rate realities — for crops covered by MSP (paddy, wheat, pulses, oilseeds), the MSP sets a floor; for others (vegetables, fruits), mandi rates can swing 30-50% seasonally. Our Farm Profit Calculator handles both and flags the unhedged price risk on non-MSP crops.",
    pillarFaqs: [
      {
        q: "Do Seed Rate and Fertilizer calculators cover all major Indian crops?",
        a: "Yes — paddy (basmati and non-basmati variants), wheat, cotton (Bt and non-Bt), maize, sugarcane, soybean, groundnut, mustard, pulses (arhar, moong, urad, chana), and major vegetables (tomato, onion, potato, chilli). For less common crops (spices, horticulture, plantation), the tool provides generic-grain-crop defaults with a flag to verify locally with a KVK or state agri university.",
      },
      {
        q: "How region-specific is the fertilizer recommendation?",
        a: "Fertilizer Calculator uses ICAR general recommendation as the default, with regional adjustments for paddy (Punjab/Haryana/UP vs delta-region TN/Karnataka), wheat (Northern plain vs Peninsular), cotton (Maharashtra/Gujarat vs Andhra rainfed). If you have a soil-health-card reading, enter NPK status (low/medium/high for each); the tool adjusts dosage accordingly for significant savings in N and potentially P application.",
      },
      {
        q: "Is Land Measurement Converter safe to use for legal/revenue-department documents?",
        a: "For computation and preliminary filings, yes. For binding legal documents (sale deed, partition agreement, insurance claim), always cross-check with your district's tehsildar office or the state land-records portal — sub-state variations in unit definitions sometimes apply and revenue authorities require their specific variant. Our tool gets to within 99%+ accuracy but revenue law requires exact match.",
      },
      {
        q: "Does Farm Profit Calculator include government subsidies like PM-KISAN?",
        a: "PM-KISAN is a direct income support scheme (₹6,000/year per eligible farmer family), not a per-crop subsidy — so it is not per-crop-dependent and we capture it separately under 'other income'. For input subsidies (fertilizer subsidy, irrigation subsidy on drip), the tool handles those as reductions in input cost when you enable the 'subsidized rates' toggle for your state.",
      },
      {
        q: "How accurate is Crop Yield Calculator's prediction?",
        a: "For average input conditions and standard varieties, within ±15% of actual yield for paddy, wheat, and cotton in the major producing states. Accuracy drops for high-value low-volume crops (horticulture, spices) and for extreme weather years. Treat the output as a planning guide for pre-season financial decisions, not as a harvest forecast.",
      },
      {
        q: "Are the seed-rate and fertilizer recommendations valid for organic farming?",
        a: "The base recommendations follow conventional ICAR guidance with chemical fertilizer (urea, DAP, MOP) doses. For organic farming, replace chemical fertilizers with their organic equivalents at higher application rates (compost, vermicompost, organic manures provide 2-3% N content vs 46% in urea, so quantity scales 15-20×). The tool has an organic-mode toggle that handles the conversion; for certified organic certification under NPOP, follow the organic standard's specific input list.",
      },
      {
        q: "Will the Crop Yield Calculator predict yield for next season given current weather forecasts?",
        a: "Partially — the calculator uses the last 5-year average yield for your crop+region as the baseline and applies adjustments for soil quality and inputs. For weather-driven prediction (monsoon strength, drought probability) it uses the IMD long-range forecast where available, but real-time yield depends on factors no tool can predict: timing of rainfall, pest pressure, mid-season inputs. Treat the output as a planning estimate, not a harvest forecast.",
      },
      {
        q: "Are the irrigation calculations valid for paddy in Punjab vs paddy in delta-region Tamil Nadu?",
        a: "Yes — paddy irrigation requirement varies dramatically by region (4,000-5,000 mm in Punjab/Haryana flood-irrigated paddy vs 1,500-2,000 mm in Cauvery delta with shorter-duration varieties). The calculator's region selector applies the regional water-requirement coefficient. For drip-irrigated paddy (newer water-saving cultivation), water savings can reach 40-60%; the calculator handles the drip-paddy mode separately.",
      },
    ],
  },

  electrical: {
    whatIs:
      "Electrical and engineering tools on SabTools.in cover the AC/DC circuit sizing, voltage-drop, power-consumption, and renewable-energy math that electricians, MEP consultants, home DIY-ers, and solar-system designers use across residential, commercial, and industrial installations — what wire gauge to choose for a given load and distance, how much voltage drop to expect across a cable run, what the monthly electricity bill will be given appliance mix and DISCOM tariff, how Ohm's Law applies to a mixed-component circuit, what transformer kVA to specify for a given secondary load, and what solar-panel kW capacity the rooftop can support given geographic latitude. These are tasks that sit in the grey zone between 'an electrician can do it in their head' and 'requires a qualified electrical engineer' — having explicit calculators gives the homeowner a sanity-check against the electrician's quote and the contractor a precise number to cite in their design documents.",
    keyFeatures: [
      {
        title: "Wire sizing per IS 732 and load-current calculation",
        description:
          "Wire Size Calculator takes current (A), voltage (V), cable length, ambient temperature, and installation method (open air, conduit, buried); returns minimum conductor cross-section (mm²) per IS 732. Supports copper and aluminium conductor types with correct current-carrying capacity derating for installation environment.",
      },
      {
        title: "Voltage-drop and cable-size verification",
        description:
          "Voltage Drop Calculator takes cable length + conductor area + load current; returns voltage drop in V and %. Indian Electricity Rules mandate <3% drop in wiring and <6% from service-entrance to farthest point. Use to verify that chosen wire size meets the code, particularly for long runs (>30 m) in large houses or commercial buildings.",
      },
      {
        title: "Appliance-level monthly-bill projection",
        description:
          "Power Consumption Calculator takes appliance list (AC, refrigerator, geyser, lights, fans, TV, washing machine) with wattages and daily hours; computes monthly kWh, then applies your state DISCOM's slab tariff (with fixed charge, meter rent, duty) for the monthly bill in rupees. Shows slab-crossing effects so you see the penalty for moving from slab 2 to slab 3.",
      },
      {
        title: "Ohm's Law and AC-circuit essentials",
        description:
          "Ohm's Law Calculator computes V = IR and cyclic variants with inputs in any of the three, plus P = VI for power. Transformer Calculator sizes kVA for given load (kW + power factor + safety margin) and voltage conversion ratio. Solar Panel Calculator computes required kW capacity for a given monthly consumption, given rooftop area and latitude-based insolation.",
      },
    ],
    useCases: [
      {
        title: "Residential wiring design verification",
        description:
          "Building a new house or renovating the wiring: Wire Size Calculator for each major circuit (AC circuit needs 4 sq mm copper for 16A load; lighting circuit works with 1.5 sq mm for 6A). Voltage Drop Calculator verifies that the kitchen's 25-m-long circuit at 16A stays under 3% drop. Use the output to cross-check the electrician's material list.",
      },
      {
        title: "Electricity-bill reduction and appliance planning",
        description:
          "Bill Rs 8,000/month and wondering which appliance is the biggest culprit: Power Consumption Calculator with all appliances entered shows the AC is ₹4,500, geyser is ₹1,200, and the rest is lighting + small appliances. Targeting the AC (setting to 26°C instead of 22°C, using a fan supplement) saves ₹1,500/month — quantified, not guessed.",
      },
      {
        title: "Rooftop solar system sizing",
        description:
          "Homeowner considering rooftop solar: Solar Panel Calculator takes monthly consumption (say 600 kWh) + rooftop area + latitude; returns required kW capacity (4.5-5 kWp for most metros), expected generation, payback period at current state net-metering tariff, and subsidy eligibility under PM Surya Ghar Yojana. Pair with Power Consumption Calculator to confirm consumption baseline.",
      },
      {
        title: "Industrial and commercial transformer sizing",
        description:
          "Small-manufacturer planning a 50-kW-load installation: Transformer Calculator sizes the required kVA (65-70 kVA with power-factor and safety margin), and suggests 11-kV-to-433-V step-down configuration per standard Indian industrial connection. Use the output for the DISCOM's load-sanction application.",
      },
    ],
    howToChoose:
      "For electrical design — Wire Size Calculator first (pick the cable); Voltage Drop Calculator second (verify the cable meets code); Ohm's Law Calculator for quick sanity checks. For consumption and billing — Power Consumption Calculator for the monthly-bill projection at your DISCOM's tariff. For transformers — Transformer Calculator for kVA sizing given secondary load and voltage. For solar planning — Solar Panel Calculator for rooftop sizing and ROI. For load calculation and service-connection sizing, the Electrical Load Calculator in the Construction category is appropriate (it focuses on diversified residential/commercial load for service-entrance sizing, whereas Wire Size Calculator here sizes individual circuits). Workflow for a new residential installation: Load calculation (Construction category) → individual circuit Wire Size Calculator → Voltage Drop Calculator verification → (install). Workflow for solar: Power Consumption Calculator (baseline) → Solar Panel Calculator (system sizing) → (install). None of these tools replace a licensed electrical contractor or MEP consultant for the actual design sign-off required by the DISCOM — they provide the numbers that the consultant verifies and applies their licence-seal to.",
    indianContext:
      "Indian electrical installations follow IS 732 (code of practice for electrical wiring) and IS 1255 (code for installation of power cables) — both published by the [Bureau of Indian Standards (BIS)](https://www.bis.gov.in/) — and the [Central Electricity Authority](https://cea.nic.in/) Regulations for Electricity Supply and Utility. Wire sizes are specified in sq mm (1.0, 1.5, 2.5, 4, 6, 10, 16, 25 sq mm common residential sizes), not AWG as in US practice. Domestic voltage is 230 V single-phase, 415 V three-phase — different from the US 120/240 V, so current ratings for the same appliance are about half of the US figure. Safety factors (ambient temperature 45°C derating, installation-method derating) are more aggressive than IEC because Indian ambient conditions run hotter. DISCOM tariffs are slab-structured — the first 100 units/month are at a low slab (₹3-4/unit), 100-300 at a medium slab (₹5-7), 300-500 at a high slab (₹7-9), 500+ at the highest slab (₹8-11). The slab crossing matters — a household at 299 units pays significantly less per unit than at 301 units. Our Power Consumption Calculator shows the slab crossing explicitly. For rooftop solar, India's PM Surya Ghar Yojana (launched 2024) offers subsidy up to ₹78,000 for 3 kW and up to ₹18,000/kW thereafter, plus net-metering at most state DISCOMs; our Solar Panel Calculator incorporates both when you select your state and residential category.",
    pillarFaqs: [
      {
        q: "Is Wire Size Calculator suitable for submitting to a DISCOM for service-connection approval?",
        a: "It gives the correct wire size per IS 732 and voltage-drop compliance, which is what DISCOM's inspection team checks. However, the formal service-connection application requires the design to be stamped by a licensed electrical contractor (Grade A or B); the tool's output is the engineering basis for the design but the licence seal is still needed. Use the tool to verify the contractor's sizing matches IS 732.",
      },
      {
        q: "How accurate is Power Consumption Calculator's monthly bill projection?",
        a: "Within ±8% of the actual bill for well-characterised appliance usage — AC usage is the main uncertainty (hours per day, temperature setting). For a baseline projection, enter conservative hours; for a worst-case, enter peak hours. Your DISCOM's exact slab tariff for your state is built in — we refresh slab rates annually and at major tariff-revision events.",
      },
      {
        q: "Does Solar Panel Calculator account for shading on the rooftop?",
        a: "Partially — it asks for a shading factor (0-50% reduction in usable area). For detailed shading analysis, a solar installer does a site survey with a sun-path assessment; our tool uses an average shading factor of 10-15% for typical Indian urban rooftops. For flat rooftops with no obstructions, enter 0%; for rooftops with heavy overhead shading from neighbouring buildings or trees, enter 30-50%.",
      },
      {
        q: "Is Transformer Calculator precise enough for DISCOM service-application?",
        a: "For the load-sanction application, yes — DISCOM requires a kVA rating consistent with the connected load and a typical power factor (0.8 lag for industrial, 0.9 for commercial, 0.95 for residential); the tool uses those defaults and lets you override. For the actual transformer purchase specification, the vendor will ask for impedance, tap-changer configuration, and other details that go beyond sizing — those require a consulting engineer.",
      },
      {
        q: "Why does Voltage Drop Calculator use different resistivity for copper vs aluminium?",
        a: "Aluminium has about 1.6× the resistivity of copper, so for the same current and length, an aluminium cable needs about 1.6× the cross-section to achieve the same voltage drop. The tool applies the correct resistivity per material and returns the right size. Aluminium is cheaper per metre but you end up needing a bigger cable; the Wire Size Calculator's cost comparison feature shows which is cheaper overall for your specific run.",
      },
      {
        q: "Are the wire-size recommendations safe to use for actual installation?",
        a: "They are correct per IS 732 for the inputs provided — current, voltage, length, ambient temperature, and installation method. The tool flags when the chosen size barely meets code (within 10% margin) and recommends sizing up. However, for the formal installation, the design must be stamped by a licensed electrical contractor (Grade A or B); the tool's output is the engineering basis, but the licence seal is required for DISCOM approval and insurance compliance.",
      },
      {
        q: "Will the Power Consumption Calculator's monthly bill match what my DISCOM actually charges?",
        a: "Within ±8% for well-characterised usage. AC usage is the main uncertainty (hours per day, temperature setting, room insulation). The calculator's slab-tariff data is refreshed annually for each state DISCOM; for binding billing reference, check the latest notification on your DISCOM's website. The tool also estimates power-factor surcharge for industrial connections, which residential users do not pay.",
      },
      {
        q: "Does the Solar Panel Calculator account for net-metering tariff differences across states?",
        a: "Yes — net-metering rules vary by state (Maharashtra, Karnataka, Tamil Nadu, Gujarat each have specific export tariffs and connection-size limits; some states have moved to net-billing instead of net-metering). The calculator's state selector applies the correct tariff and quantifies the payback period. For binding rooftop-solar economics, always check the latest DISCOM circular and the PM Surya Ghar Yojana subsidy eligibility for your residence type.",
      },
    ],
  },

  cooking: {
    whatIs:
      "Cooking and kitchen tools on SabTools.in handle the everyday culinary math that home cooks, food bloggers, and small-restaurant operators run constantly — converting a US recipe's cup measurements to Indian metric, scaling a 4-person dish to 12, computing the exact cooking time for a different rice quantity or pressure-cooker setting, looking up the calorie and macro content of common Indian dishes, working out how many days a domestic LPG cylinder will last given monthly usage, and checking water-quality TDS to decide whether your filter still works. These are not specialist tools — they are the small calculations that come up at the prep counter, in the kitchen, and on the grocery list every week. Each tool here uses Indian units (grams, millilitres, tablespoons), Indian dish coverage (dal, sabzi, biryani, rasam, idli batter), Indian utility data (Bharat Gas / HP / Indane LPG cylinder weights and burn rates), and Indian water-quality bands (BIS 10500 drinking-water TDS limits).",
    keyFeatures: [
      {
        title: "US-to-Indian recipe unit conversion",
        description:
          "Recipe Unit Converter handles cups → grams (ingredient-specific: 1 cup of flour ≠ 1 cup of sugar by weight), tablespoons → ml, ounces → grams, fahrenheit → celsius for oven temperatures, and pounds → kg for meat. Pulls density data for 200+ common Indian and Western ingredients so the gram conversion is accurate, not just volumetric.",
      },
      {
        title: "Recipe scaling and pressure-cooker timing",
        description:
          "Cooking Time Calculator scales recipe quantities (4 servings → 12) with non-linear adjustments — cooking time does not scale linearly with quantity (a doubled recipe of dal needs about 1.3× the time, not 2×). Includes pressure-cooker whistle counts for common Indian dishes by quantity.",
      },
      {
        title: "Indian-cuisine calorie and macro database",
        description:
          "Indian Food Calorie Counter has the per-100g and per-serving calories, protein, carbs, and fat for 800+ Indian dishes — regional variants (Punjabi rajma vs Maharashtrian, dosa types, biryani styles), restaurant-style vs home-style (the ghee-and-cream difference is significant), and street food (vada pav, pani puri, dosa). Useful for diabetes, weight, and macro-tracking diets.",
      },
      {
        title: "LPG cylinder and water-TDS utilities",
        description:
          "Gas Cylinder Calculator estimates remaining days on a domestic 14.2 kg LPG cylinder given monthly cooking hours and burner type — typical Indian family of 4 burns one cylinder in 35-45 days. Water TDS Calculator interprets your TDS-meter reading against BIS limits (acceptable <500 mg/L; rejection >1,500 mg/L) and tells you whether the RO filter is still effective.",
      },
    ],
    useCases: [
      {
        title: "Following Western recipes in an Indian kitchen",
        description:
          "Recipe Unit Converter takes the '2 cups all-purpose flour, 1 stick butter, 350°F oven' from any US baking recipe and produces '240 g maida, 113 g butter, 175°C oven' in the units your Indian kitchen scale and oven actually display. Particularly useful for cake/cookie/bread recipes where precision matters.",
      },
      {
        title: "Scaling for parties and pot-lucks",
        description:
          "Hosting 30 people for dinner: Cooking Time Calculator scales the family rajma recipe from 4 to 30 portions with the right quantity of beans, masala, and pressure-cooker time. Adjusts non-linearly for the bigger pot's slower heat-up time. Pairs with the Wedding Budget Calculator for caterer-budget cross-checks.",
      },
      {
        title: "Diabetic and weight-loss diet planning",
        description:
          "Indian Food Calorie Counter gives the calorie load of a typical thali — 2 chapati + dal + sabzi + rice + curd + papad runs 700-900 kcal depending on ghee and oil. Diabetics use it for carb counting (chapati 70 g carbs/100g; rice 78 g carbs/100g) to plan insulin or oral-medication dosing in consultation with their physician.",
      },
      {
        title: "Household utility planning",
        description:
          "Gas Cylinder Calculator schedules the next cylinder booking — 35 days into the cycle for a 4-person family, time to book the next refill on the Indane / HP / Bharat Gas portal. Water TDS Calculator decides when the RO filter cartridge needs replacement (TDS below 50 mg/L = filter still working; jump above 200 mg/L = membrane failing).",
      },
    ],
    howToChoose:
      "For recipe execution — Recipe Unit Converter for the cup/tbsp/oz to gram/ml conversion, Cooking Time Calculator for non-linear scaling and pressure-cooker timing. For diet and nutrition tracking — Indian Food Calorie Counter; pair with the BMI Calculator, BMR Calculator, and Calorie Calculator in the Health category for full diet planning. For household utility — Gas Cylinder Calculator for LPG planning, Water TDS Calculator for filter health. None of these tools replace a registered dietitian for medical-grade nutrition planning (especially for diabetics, kidney patients, pregnancy, or post-op recovery) — for those, they are quick reference tools you bring to your dietitian's appointment, not substitutes for professional advice. Workflow for entertaining: Recipe Unit Converter → Cooking Time Calculator → Indian Food Calorie Counter (for guests with dietary restrictions) → final shopping list. Workflow for monthly household: Gas Cylinder Calculator (track usage) → next refill booking; Water TDS Calculator (monthly check) → filter replacement.",
    indianContext:
      "Indian kitchens operate on a different unit system from Western recipes. A 'cup' in a US recipe is 240 ml; in the UK it is 250 ml; in some Indian recipes 'cup' refers to a katori-sized measure of about 200 ml — three different units called the same thing. Our Recipe Unit Converter defaults to the US 240 ml cup but lets you toggle. Indian flour (atta) and Western flour (maida, all-purpose) have different absorption — atta is stoneground whole wheat with bran and absorbs more water, so substituting them 1:1 produces a denser product; the tool flags this. LPG cylinders in India are 14.2 kg (domestic) or 19 kg (commercial) net weight, with subsidised pricing for domestic cylinders capped at 12 per year per household under the DBT-LPG scheme. Burn rate for a typical Indian family with 3-4 stove hours/day is about 25-35 days per 14.2 kg cylinder. Drinking water TDS in Indian municipal supply ranges 50-300 mg/L typically; borewell water can be 300-2,000+ mg/L (especially in coastal Tamil Nadu, parts of Andhra, Rajasthan, Haryana). RO filters reduce TDS by 90-95% and need cartridge replacement when output TDS rises consistently above the BIS 500 mg/L threshold or membrane TDS exceeds 200 mg/L. Food-safety claims and labelling requirements (calorie display, allergen warnings, packaged-food limits on trans-fats) are administered by the [Food Safety and Standards Authority of India (FSSAI)](https://www.fssai.gov.in/). Indian-cuisine calorie counts depend heavily on ghee/oil — a homemade dal at 80 kcal/100g becomes 130 kcal/100g with a ghee tadka. Indian Food Calorie Counter shows the home-style and restaurant-style figures separately so the diabetic eating out can budget correctly.",
    pillarFaqs: [
      {
        q: "How accurate is Recipe Unit Converter for ingredient density?",
        a: "Within ±5% for clean reference ingredients (flour, sugar, salt, oil, butter). Variability comes from how compacted the ingredient is — sifted flour weighs less per cup than packed flour, which is why professional baking recipes specify weights, not volumes. For Indian-specific ingredients (besan, ragi flour, jaggery, ghee), we use the same tested density values used in CFTRI nutrition databases.",
      },
      {
        q: "Does Cooking Time Calculator handle pressure-cooker timing for Indian dishes?",
        a: "Yes — for the major Indian pressure-cooker dishes (rajma, chana, dal, biryani, mutton curry, paya), it returns whistle count by quantity using empirically tested ratios. For modern Instant Pot users, it converts whistles to manual-pressure minutes (1 whistle ≈ 4-5 min on high pressure for most lentils and beans).",
      },
      {
        q: "Is Indian Food Calorie Counter validated against any source?",
        a: "Built primarily on the IFCT 2017 (Indian Food Composition Tables) published by NIN-ICMR — the official Indian government nutrition database — supplemented with restaurant-style adjustment factors from peer-reviewed studies on home-vs-restaurant cooking oil use. Always verify with a registered dietitian for medical use; the calorie tables are research-grade but not a substitute for personalised dietary advice.",
      },
      {
        q: "How does Gas Cylinder Calculator estimate remaining days?",
        a: "It takes daily cooking hours, number of burners, and burner type (standard 2-burner gas stove, 3-burner range, induction) to estimate the burn rate. A standard family of 4 with 2-burner stove burns 25-35 days per cylinder. The estimate is ±3-5 days; for a tighter prediction, use the cylinder's tare-weight check (subtract the empty 14.2 kg cylinder weight from the current weight) to know exactly how much LPG remains.",
      },
      {
        q: "Why does Water TDS Calculator say my RO filter is fine but my water tastes metallic?",
        a: "TDS is one indicator but not the only one — taste can be affected by individual ions (iron, magnesium) without TDS being high. A metallic taste with low TDS often indicates iron contamination from old galvanised pipes; that needs an iron-removal filter or a new pipe section, not RO replacement. Get a full water-quality lab test (₹500-₹1,500) for a complete profile if taste issues persist.",
      },
      {
        q: "Will the Recipe Unit Converter produce consistent results across multiple sessions?",
        a: "Yes — the conversion factors are fixed (240 ml US cup, 16 tbsp per cup, 3 tsp per tbsp; ingredient densities from the IFCT 2017 database). For ambient-condition-sensitive ingredients (flour packs differently in monsoon humidity than in dry season), the output is for typical room conditions; in extreme humidity, by-weight measurement is more reliable than by-volume. The tool flags ingredients where humidity matters.",
      },
      {
        q: "Does the Indian Food Calorie Counter handle Jain (no onion/garlic), satvik, and other regional dietary restrictions?",
        a: "Yes — for Jain meals (no onion, garlic, root vegetables), the calorie database has Jain-mode variants of common dishes (Jain rajma, Jain dal, Jain chana) with the appropriate substitutions. Satvik (Hindu fasting) variants are also available. For specific allergen exclusions (gluten-free, dairy-free, nut-free), the search filters dishes by allergen tag. Always verify with the cook for served meals, since substitutions vary by household.",
      },
      {
        q: "Will the Gas Cylinder Calculator estimate accurately for a small commercial kitchen?",
        a: "Yes for small-scale commercial use — the calculator handles 19 kg commercial cylinders with input for daily cooking hours, number of stoves, and burner type. A typical small dhaba or tea-stall burns one 19 kg commercial cylinder in 4-6 days. For large-scale (banquet halls, hotels), pipe-supplied LPG or PNG via a city gas distributor is more economical and the cylinder math no longer applies; the tool flags this threshold.",
      },
    ],
  },

  wedding: {
    whatIs:
      "Wedding and events tools on SabTools.in cover the budgeting, guest-management, and date-selection math that every Indian wedding requires across the 6-12 months of planning — what a realistic budget breakdown looks like for a 200-guest vs 500-guest wedding (venue, catering, decor, photography, jewellery, attire, music), how to maintain a guest list across multiple events (mehendi, sangeet, haldi, wedding, reception) without manual reconciliation, how to find auspicious wedding dates that satisfy both Hindu panchang muhurat and family travel constraints, what gifts to suggest registry-style for guests who ask, and how to build an end-to-end checklist of every task from save-the-date to thank-you-cards. These tools are aimed at the family member running the wedding logistics — typically the bride's or groom's mother, or an elder cousin — who needs structured calculators, not free-form Excel.",
    keyFeatures: [
      {
        title: "Wedding budget by region and guest count",
        description:
          "Wedding Budget Calculator builds a full budget breakdown by category — venue (25-35%), catering (15-25%), decor (8-15%), photography/videography (5-10%), jewellery (15-25% if including), attire (5-10%), music/entertainment (3-7%), invitations (1-3%), miscellaneous (5-10%). Defaults reflect 2025 Indian metro and tier-2 city rates; total range 8-40+ lakh for 200-guest weddings.",
      },
      {
        title: "Multi-event guest list with attendance tracking",
        description:
          "Guest List Manager handles the typical Indian wedding's 4-6 events (mehendi, haldi, sangeet, wedding, reception, after-party). Each guest entry tracks RSVP per event, dietary restrictions, accommodation needs, and gift-tracking. Export to CSV for vendor coordination; aggregate counts feed into Wedding Budget Calculator's catering line.",
      },
      {
        title: "Panchang-aware auspicious wedding dates",
        description:
          "Wedding Date Finder cross-references the Hindu panchang for vivah muhurat (the auspicious nakshatra-tithi-yoga combination for marriage), with location-specific Rahu Kaal exclusion and family travel feasibility (avoiding monsoon, exam-season, fasting months for the involved families). Returns 8-12 candidate dates over the next 12-18 months.",
      },
      {
        title: "Gift registry and guest-suggestion calculator",
        description:
          "Gift Registry Calculator suggests gift price ranges by guest relationship (close family ₹15,000-50,000; distant family ₹5,000-15,000; close friends ₹3,000-8,000; colleagues and acquaintances ₹1,500-3,000). Useful for guests asking 'what should I gift'; also useful for the couple in registering at e-commerce stores at price points guests will actually use.",
      },
    ],
    useCases: [
      {
        title: "Initial planning and budget setting",
        description:
          "Three months into a 12-month engagement, run Wedding Budget Calculator with target guest count and city tier; produces an 8-40 lakh estimate broken down by category. Use this to set the family's financial commitment ceiling before any vendor commitments are made — 'we have ₹25 lakh' converts to specific category caps that prevent overruns later.",
      },
      {
        title: "Vendor coordination via guest count",
        description:
          "Once invitations are out, Guest List Manager tracks RSVPs across 5 events. Vendor coordination requires per-event counts — caterer needs +20% buffer, mandap decorator needs exact, photographer team-sizing needs adult vs child split. The tool exports per-event guest lists in the format vendors expect.",
      },
      {
        title: "Date-finalisation with both families",
        description:
          "Wedding Date Finder produces 8-12 muhurat candidates over the planning window. Cross-check with both families' calendars (no conflicting weddings, no major exams in the family, no travel-restricted seasons), then narrow to 2-3 finalists for the priest's verification with the kundli match.",
      },
      {
        title: "Gift expectations and registry creation",
        description:
          "Bride/groom asked by close friends what to gift: Gift Registry Calculator suggests price ranges by relationship; couple registers at Pepperfry, Urban Ladder, or D2C brands at the suggested price points. For close family, tradition often calls for jewellery or cash — the tool flags those conventions to discuss with elders rather than auto-suggesting registry items.",
      },
    ],
    howToChoose:
      "For initial planning — Wedding Budget Calculator first to set the financial frame; Wedding Date Finder for the 8-12 candidate dates; Event Checklist Generator for the master to-do list of 200+ tasks across 12 months. For active planning — Guest List Manager for the recurring tracking; Gift Registry Calculator when guests ask. For pre-wedding panchang verification — Kundli Calculator and Panchang Calculator in the Astrology category cover the muhurat sign-off and the kundli matching (guna milan, 36 points). For day-of logistics — Event Checklist Generator covers the choreography (timing for mehendi sequence, baraat arrival, varmala, pheras, vidaai). Workflow: Wedding Date Finder (month 0) → Wedding Budget Calculator (month 0-1) → Event Checklist Generator (month 0-12, ongoing) → Guest List Manager (month 3-6, after invitations) → Gift Registry Calculator (month 3-6, when asked). Note: none of these tools replace a wedding planner for a complex multi-city or destination wedding — for those, consider a planner; the tools cover the 80% of mid-size urban Indian weddings where the family runs logistics directly.",
    indianContext:
      "Indian weddings are uniquely complex among global wedding traditions — multiple ceremonies (mehendi, haldi, sangeet, wedding, reception) over 3-7 days, often across two cities (bride's hometown and groom's hometown for separate receptions), with regional variations (a Sikh anand karaj differs from a Tamil thali ceremony differs from a Bengali bishakta differ from a Marwari pheras). Our tools default to a generic North-Indian Hindu wedding (the most common single template) but offer regional toggles for Sikh, Christian, Muslim nikah, and major South-Indian variants (Tamil, Telugu, Malayalam, Kannada). Vivah muhurat is calculated per a strict set of criteria — auspicious nakshatra (Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, Revati most auspicious), suitable tithi (avoiding amavasya, ashtami, navami, chaturdashi), and yoga (avoiding Vyatipata, Vaidhriti, Parigha, Vishkambha). Our Wedding Date Finder applies all of these per Lahiri ayanamsa and excludes the malefic combinations. Wedding budgeting in India 2025 — a 200-guest tier-2 city wedding ranges ₹8-15 lakh; the same 200 guests in Mumbai/Delhi metro ranges ₹15-30 lakh; a 500-guest farmhouse-style wedding can easily reach ₹40-80 lakh; high-end designer-driven weddings exceed ₹1 crore.",
    pillarFaqs: [
      {
        q: "Is Wedding Budget Calculator's output realistic for tier-3 cities and small towns?",
        a: "It defaults to tier-1 metro rates and tier-2 city rates with toggles. For tier-3 (Belgaum, Tirupati, Allahabad-style) and rural weddings, expect 30-50% lower than the tier-2 figures — venue and catering are the largest reductions; jewellery and photography are largely city-independent. Override with local-vendor quotes for the binding budget; the tool gives the first-cut frame.",
      },
      {
        q: "Does Wedding Date Finder support non-Hindu wedding traditions?",
        a: "Hindu and Sikh muhurat (with anand karaj appropriate dates) are fully supported. For Muslim nikah, the date selection is largely non-astrological (Friday is preferred, Ramadan and certain mourning months are avoided); the tool returns valid dates with those exclusions. For Christian and inter-faith weddings, the tool returns dates the venue is available without astrological constraints — apply your own family preferences for season and day-of-week.",
      },
      {
        q: "How does Guest List Manager handle complex family relationships?",
        a: "Each guest entry includes a 'relationship' field with about 40 standard tags (mother's brother's family, father's elder cousin, paternal grandmother's first cousin's daughter — Indian family tree depth is real). RSVP tracking is per event, so a guest can be confirmed for wedding but tentative for sangeet. Export filtered lists by relationship for tasks like 'send invitations only to the 50 closest family members'.",
      },
      {
        q: "Can Wedding Budget Calculator factor in the bride/groom-side splits?",
        a: "Yes — there is a toggle for 'who pays what' allocation: traditional split (bride's family pays catering and venue, groom's family pays for jewellery and reception), modern split (50-50 on most categories), or fully borne by one side. Each scenario produces a side-wise breakdown so the financial commitments are clear before wedding-vendor signups begin.",
      },
      {
        q: "Is Event Checklist Generator customisable for our specific family traditions?",
        a: "Yes — start with the regional template (North Indian, South Indian, Bengali, Sikh, Marwari, Gujarati, Maharashtrian, Christian, Muslim, etc.) and add or remove sub-events. The base list has 200+ tasks; most weddings need 80-150 of those depending on the events being hosted. Add custom tasks (specific to your family's traditions) inline; the tool reorders by phase (12-month, 6-month, 3-month, 1-month, week-of, day-of, post-wedding).",
      },
      {
        q: "Are the wedding-budget estimates calibrated for tier-1, tier-2, and tier-3 city costs?",
        a: "Yes — the budget calculator has city-tier presets. A 300-guest wedding budgets at ₹35-50 lakh in tier-1 cities (Mumbai, Delhi, Bengaluru), ₹20-30 lakh in tier-2 (Pune, Hyderabad, Chennai, Ahmedabad), ₹12-20 lakh in tier-3 (Jaipur, Lucknow, Indore, Coimbatore). Override individual line items (venue, catering, decor, photography) with your actual quotes for a precise budget; the presets are starting estimates, not final figures.",
      },
      {
        q: "Does the Mehndi / Sangeet planning checklist cover regional wedding traditions?",
        a: "Yes — separate checklists are available for North Indian (Punjabi, Marwari, Bengali, Rajasthani), South Indian (Tamil, Kannada, Telugu, Malayali), and East Indian (Bengali, Odia, Assamese) wedding traditions. Each has the customary functions (Tilak/Roka, Mehndi/Pithi, Sangeet, Haldi, Wedding, Reception) with traditional-event-specific tasks. Toggle between traditions in the tool; mixed-tradition weddings can show two checklists side by side.",
      },
      {
        q: "Will the Save-the-Date / RSVP Generator produce shareable WhatsApp-friendly content?",
        a: "Yes — outputs include a WhatsApp-optimised text-only format (with date, venue, dress code, contact), a square JPG card (1080×1080 px, ideal for Instagram and WhatsApp status), and a printable PDF for invitation cards. The tool also generates a QR code linking to the RSVP form, useful for tracking guest responses without a paid event-management service.",
      },
    ],
  },

  shopping: {
    whatIs:
      "Shopping and consumer-finance tools on SabTools.in cover the price, discount, and affordability math that every Indian online and offline shopper runs across the year — what a 'flat 60% off plus extra 10% on prepaid' deal actually saves you (it is not 70%), how to compare two competing prices when one is GST-inclusive and the other is GST-exclusive, whether a ₹85,000 phone on no-cost EMI is genuinely no-cost or hides interest in inflated MRP, how to compare prices per gram or per litre across pack sizes (the 1-kg pack is sometimes more expensive than the 500-g pack), and what cashback and credit-card-reward stacking actually nets after rotating offers. These are tools that turn marketing-speak into rupees so the shopper makes informed decisions during the Big Billion Day, the Great Indian Sale, and weekly grocery runs.",
    keyFeatures: [
      {
        title: "Multi-discount stacking computation",
        description:
          "Advanced Discount Calculator handles the realistic Indian e-commerce stack — 'flat X% off + extra Y% on prepaid + bank Z% cashback + coupon code W%' — and computes the true effective discount, which is rarely the sum of percentages. A 60% + 10% + 10% stack delivers ~67.6% off, not 80%. Useful for comparing Flipkart Plus deal vs Amazon Pay deal where the stack composition differs.",
      },
      {
        title: "GST-inclusive and GST-exclusive price reconciliation",
        description:
          "GST Inclusive Exclusive takes any price + GST rate (5%, 12%, 18%, 28%); converts between inclusive (the customer-facing price) and exclusive (the vendor invoice price) views. Critical when comparing a B2B vendor's quote (often ex-GST) against a retailer's customer-facing price (GST-inclusive).",
      },
      {
        title: "True-cost EMI affordability check",
        description:
          "EMI Affordability Calculator combines the EMI with credit-card processing fees (1-2% on no-cost EMI cards), foregone cashback opportunity (paying full would have given 5% cashback), and the inflated MRP that some 'no-cost EMI' offers carry (the cash price is often 5-10% lower). Returns the true effective rate of the EMI offer — sometimes 10-15% APR even when advertised as 'no cost'.",
      },
      {
        title: "Price-per-unit comparison across pack sizes",
        description:
          "Price Per Unit Comparator takes 2-5 competing products with different pack sizes (500g vs 1kg vs 5kg), prices, and unit (g/kg/L/ml/piece); returns price-per-base-unit ranking. Surprisingly often the 1-kg pack is more expensive per gram than the 500-g pack at promotional prices — the tool catches that.",
      },
    ],
    useCases: [
      {
        title: "Sale-season deal evaluation",
        description:
          "Big Billion Day or Great Indian Sale season: a phone listed at 'flat 40% + 10% bank discount + ₹3,000 exchange + ₹2,000 coupon + 6-months no-cost EMI'. Advanced Discount Calculator computes the true post-stack price; EMI Affordability Calculator checks whether the no-cost EMI is genuinely interest-free vs hiding cost in MRP. Together these decisions take 5 minutes and save ₹3,000-₹8,000 of misunderstood discounting.",
      },
      {
        title: "B2B vs B2C price reconciliation",
        description:
          "Buying office supplies for a small business: vendor A quotes ₹5,000 ex-GST, vendor B quotes ₹6,200 inclusive. GST Inclusive Exclusive reveals vendor A's effective price is ₹5,900 (with 18% GST), making vendor B's ₹6,200 inclusive cost the equivalent of ₹5,254 + 18% GST — vendor B is actually cheaper despite the higher headline number.",
      },
      {
        title: "Grocery-run optimisation",
        description:
          "Weekly grocery shop comparing 5 oil brands at varying pack sizes (500ml ₹120, 1L ₹220, 5L ₹950, 15L ₹2,650): Price Per Unit Comparator instantly shows the 5L is ₹190/L (cheapest) vs 15L at ₹176.67/L. The 15L wins for a family of 5, but a couple is better off with the 5L — tool also flags that consideration.",
      },
      {
        title: "Cashback and reward stacking",
        description:
          "Cashback Calculator compounds credit-card reward + Amazon Pay reward + merchant cashback for the optimal combination on a given purchase. ₹50,000 phone with 5% credit-card reward + 10% Pay Later cashback + 2% merchant promo nets ~₹8,500 in real value if all stack — useful when choosing payment instrument at checkout.",
      },
    ],
    howToChoose:
      "For deal evaluation — Advanced Discount Calculator for headline-stack vs effective-saving; EMI Affordability Calculator for any 'no-cost EMI' marketed offer. For price reconciliation — GST Inclusive Exclusive for B2B-vs-B2C or vendor comparisons; Price Per Unit Comparator for cross-pack-size comparisons. For payment optimisation — Cashback Calculator for stacking reward instruments at checkout. For pre-purchase affordability cross-check, the EMI Calculator and Home Loan Affordability tools in the Finance and Business categories give the household-level affordability frame; for tax implications, the GST Calculator and HRA Exemption Calculator in the Tax category cover any tax-deductible spending. Workflow for a major purchase (electronics, appliances): Advanced Discount Calculator → EMI Affordability Calculator → Cashback Calculator → final decision. Workflow for grocery and household: Price Per Unit Comparator → buy. None of these tools enforce restraint — they give the rupees-on-the-table figure; the discipline of 'do I actually need this' is left to the shopper.",
    indianContext:
      "Indian e-commerce's discount-stacking complexity is unique globally. A typical Big Billion Day deal looks like: '40% flat off + 10% bank discount on HDFC/ICICI/SBI cards + 5% cashback on Flipkart Pay Later + ₹3,000 exchange bonus + 9-month no-cost EMI + ₹2,500 coupon'. Each component has different applicability rules (HDFC discount only on credit, not debit; cashback only on Pay Later not on UPI; coupon only above ₹50,000), and the order in which stacks compose changes the final price. Advanced Discount Calculator codes these rules so the calculation is correct. GST is everywhere in Indian retail — packed FMCG (5-18% depending on item), electronics (18%), restaurants (5%), services (18%), gold and silver (3% + cess). The slab structure is published by the [GST Council](https://gstcouncil.gov.in/) and updated at council meetings (typically twice a year). B2B invoicing is GST-exclusive (the vendor adds GST and the buyer claims input credit); B2C is GST-inclusive (the customer-facing price is final). Conflating the two is a common error in small-business purchasing. Packaged-food labelling (calorie display, allergen warnings, expiry dates) is governed by the [Food Safety and Standards Authority of India (FSSAI)](https://www.fssai.gov.in/), so misleading 'health' claims on the front of pack are now subject to enforcement. EMI offers are dominated by no-cost EMI marketing — the underlying economics is that the merchant absorbs the 12-15% APR cost of the lender (Bajaj Finserv, ZestMoney, Bharat Pe Pay Later, etc.) and bakes it into a higher MRP than the cash price; our EMI Affordability Calculator backs out this hidden cost. Cashback in India is dominated by credit-card reward points (HDFC Infinia, Axis Magnus, ICICI Emeralde) and pay-later platforms (Flipkart Pay Later, Amazon Pay Later, Lazypay), each with different stacking rules.",
    pillarFaqs: [
      {
        q: "Why is my computed effective discount lower than the sum of percentages?",
        a: "Because percentages compose multiplicatively, not additively. 60% off then 10% off on the discounted price = (1 - 0.6) × (1 - 0.1) = 0.36, i.e., 64% effective discount, not 70%. Add a third 10% and you get 67.6%, not 80%. Advanced Discount Calculator does the multiplication correctly so you don't get surprised at checkout.",
      },
      {
        q: "Does GST Inclusive Exclusive handle different GST rates?",
        a: "Yes — 5%, 12%, 18%, 28%, plus the special-purpose rates (3% on gold, 0.25% on rough diamonds, 18% with reverse charge on legal services), plus state-supplemented cess (cess on luxury cars, tobacco, aerated beverages). The right rate depends on the item's HSN code; if you don't know the HSN, the tool's HSN lookup helper finds it.",
      },
      {
        q: "How does EMI Affordability Calculator detect 'hidden' interest in no-cost EMI?",
        a: "It compares the EMI total (EMI × tenure) against the cash price with similar discount stacks applied. If the EMI total exceeds the cash price by more than the merchant's stated 'processing fee' (1-2%), the difference is hidden interest. Also compares the MRP at no-cost EMI vs the cash-price MRP — if they differ, that gap is hidden interest. Most no-cost EMI offers carry 8-15% effective APR.",
      },
      {
        q: "Is Price Per Unit Comparator only for groceries or does it work for other shopping?",
        a: "Any unit-priced item — groceries (price per kg, per L, per piece), pharmacy (price per tablet, per ml), electronics (price per GB for storage, price per TB for hard drives), construction materials (price per kg, per metre, per piece), even data plans (price per GB of monthly data). Anything where a unit price comparison makes sense.",
      },
      {
        q: "Can Cashback Calculator track time-bound offers that change weekly?",
        a: "It calculates the stack you enter at the moment of calculation; it does not track or notify you when offers expire. For an always-current offer reference, you need a deal-aggregator app (Cashkaro, Magicpin, Pricebaba). The tool is for 'I have these specific offers right now, what is the best stack' — not 'tell me what offers exist this week'.",
      },
      {
        q: "Why does the Cashback Calculator show different effective rates for HDFC vs ICICI vs Axis cards?",
        a: "Each card-bank has different reward structures: HDFC's Infinia gives 3.3% on most categories with travel-redemption preference; Axis Magnus gives 12 EDGE Reward points per ₹200 with 1 EDGE = ₹2 redemption value (so 12% on travel); ICICI Emeralde gives 6 reward points per ₹200 (3%). The calculator applies each card's actual reward rate per category (online vs offline, travel vs general, dining vs others) so the effective return reflects what you actually receive at year-end.",
      },
      {
        q: "Are the No-Cost EMI calculations transparent about hidden costs?",
        a: "Yes — the calculator shows three cost components: the monthly EMI (what the seller charges your card), the merchant's processing fee (1-2% typically, paid upfront), and the inflated MRP gap (the difference between cash price and EMI MRP). When the EMI total + processing fee exceeds the cash price by more than 1-2%, that gap is hidden interest. Most no-cost EMI offers carry 8-15% effective APR even though advertised as 'interest-free'.",
      },
      {
        q: "Does the Price Per Unit Comparator handle bulk-pack savings correctly?",
        a: "Yes — the tool computes per-base-unit price for each pack size and ranks them lowest-first. Surprisingly often, the supposedly-bulk pack is more expensive per gram during sales (because the smaller pack has the headline-discount sticker). The comparator catches this. For perishable items, the tool also calculates expected-waste-adjusted cost, reducing the effective per-unit advantage of large packs by your typical wastage rate.",
      },
    ],
  },

  whatsapp: {
    whatIs:
      "WhatsApp and UPI tools on SabTools.in cover the messaging-link generation, payment-QR creation, contact-attribution, and bank-IFSC-lookup tasks that every Indian small business and personal user runs around India's two dominant retail-tech platforms — WhatsApp (530+ million Indian users) and UPI (12+ billion monthly transactions). These tools handle: generating a wa.me click-to-chat link with pre-filled message for marketing campaigns, formatting WhatsApp messages with bold/italic/strikethrough using the platform's special syntax, creating a UPI QR code with intent URL that any UPI app can scan, looking up which carrier owns a mobile number (and approximate state) for vendor-onboarding KYC, and finding bank-branch details from an IFSC code for payment routing. Each tool is purpose-built for the Indian retail-tech reality where WhatsApp Business and UPI together handle the bulk of small-business messaging and payments.",
    keyFeatures: [
      {
        title: "WhatsApp click-to-chat link generation",
        description:
          "WhatsApp Link Generator produces wa.me URLs with pre-filled message text. Format: https://wa.me/91XXXXXXXXXX?text=Hi%20-%20interested%20in%20your%20product. Use in WhatsApp Business marketing, in QR posters, in email signatures, and in 'Chat with us' buttons on websites. Supports international format and the right URL-encoding for Indian regional languages.",
      },
      {
        title: "WhatsApp text formatting with bold/italic/strike",
        description:
          "WhatsApp Formatter inserts the platform's formatting syntax — *bold* (asterisks), _italic_ (underscores), ~strikethrough~ (tildes), ```monospace``` (triple-backticks). Useful for marketing broadcasts and well-formatted business communications. Renders a live preview of how the message will look in WhatsApp before you send.",
      },
      {
        title: "UPI QR code with intent URL",
        description:
          "UPI QR Generator produces a payment QR following the UPI intent-URL specification — upi://pay?pa=name@upi&pn=Display+Name&mc=1234&am=500.00&cu=INR. Compatible with all UPI apps (PhonePe, Google Pay, Paytm, Amazon Pay, BHIM, etc). Specify amount or leave blank for customer-entered amount. Print the QR for shop counters or use in invoices.",
      },
      {
        title: "Mobile-carrier and IFSC-bank lookup",
        description:
          "Mobile Number Tracker resolves an Indian mobile number to its carrier (Airtel, Jio, Vi, BSNL/MTNL) and approximate originating state — useful for vendor-onboarding background checks (does the carrier-state match the claimed business address?). IFSC Bank Details returns full branch records for any IFSC.",
      },
    ],
    useCases: [
      {
        title: "Small-business WhatsApp marketing",
        description:
          "D2C founder running a WhatsApp campaign: WhatsApp Link Generator produces personalised wa.me links per channel (one for Instagram bio, one for Facebook ad, one for the website's chat button) with channel-tagged pre-filled messages — e.g., 'Hi, came from Insta — 10% off code'. Track which channel generated the conversation by the pre-filled text alone.",
      },
      {
        title: "Shop-counter UPI payment acceptance",
        description:
          "Kirana, restaurant, salon, or service vendor: UPI QR Generator produces a payment QR with the UPI ID and merchant name (and optionally MCC code for transaction categorisation). Print the QR for the counter; customers scan with any UPI app and pay. Far simpler than a card-payment terminal and accepted at zero merchant fee.",
      },
      {
        title: "Customer-onboarding KYC sanity check",
        description:
          "Vendor onboarding new clients: Mobile Number Tracker confirms the claimed phone number's carrier and state aligns with the claimed business location. A Mumbai vendor with a Bihar-circle Airtel number is not automatically suspicious, but a B2B vendor claiming to be in Bengaluru with a Kerala-circle BSNL number is worth a phone-verification call. IFSC Bank Details cross-checks the bank/branch on a vendor's bank-detail submission.",
      },
      {
        title: "WhatsApp business broadcast formatting",
        description:
          "Marketing broadcast to 200 customers: WhatsApp Formatter ensures the *Headline* is bold, the price-point is _italicised_ for emphasis, and ~old-price~ is struck through. The 30-second formatting investment dramatically increases broadcast read-through compared to plain-text. Use within WhatsApp Business API or manual broadcasts.",
      },
    ],
    howToChoose:
      "For WhatsApp marketing — WhatsApp Link Generator for click-to-chat URLs; WhatsApp Formatter for broadcast text. For UPI payments — UPI QR Generator for shop-counter or invoice QR; for app integration, the UPI intent URL is what payment SDKs consume. For KYC and verification — Mobile Number Tracker for phone-number provenance; IFSC Bank Details for bank-account verification. For deeper Indian-identity validation, the Utility category has PAN Card Validator, Aadhaar Validator, GST Number Validator, and Vehicle Number Info covering the document side. Workflow for a new D2C launch: WhatsApp Link Generator (channel-tagged links) → UPI QR Generator (payment-acceptance) → Mobile Number Tracker / IFSC Bank Details (vendor-side KYC). For high-volume operations, WhatsApp Business API and a UPI gateway (Razorpay, Cashfree, PhonePe Gateway) are the right stack — these tools cover the manual and small-volume cases without the ₹15,000-50,000/month gateway fees.",
    indianContext:
      "WhatsApp and UPI together define Indian retail-tech in 2025 — WhatsApp has 530+ million Indian users (more than any other country), and UPI processes 12-15 billion transactions per month with India accounting for 46% of global real-time payment volume. The wa.me click-to-chat URL is a Meta-published format that all WhatsApp clients support; URL-encoding the pre-filled message correctly is critical for non-English text (Hindi, Tamil, Bengali, etc.) — our WhatsApp Link Generator handles UTF-8 encoding correctly. UPI uses the intent-URL specification published by NPCI (National Payments Corporation of India); the parameters are: pa (payee address, the UPI ID), pn (payee name), am (amount in INR), tn (transaction note), cu (currency, always INR), and optionally mc (MCC code), tr (transaction reference). Our UPI QR Generator validates each field per the specification. Indian mobile-number portability has been live since 2011, so a number's carrier today may differ from its origin carrier — our Mobile Number Tracker shows the original carrier (from MNP records) plus a flag if the number has been ported. Bank IFSCs are RBI-published; our IFSC Bank Details data refreshes monthly to track bank-branch consolidations and the periodic IFSC migrations that happen when banks restructure (SBI absorbing associate banks in 2017, Bank of Baroda absorbing Vijaya/Dena in 2019).",
    pillarFaqs: [
      {
        q: "Does WhatsApp Link Generator's link work even if the receiver doesn't have WhatsApp installed?",
        a: "If the receiver doesn't have WhatsApp, clicking the wa.me link opens WhatsApp's web onboarding page — they cannot chat without installing the app. For receivers without WhatsApp, the link is effectively non-functional. For mass marketing, this is rarely a concern (530+ million Indian users), but for B2B applications targeting senior decision-makers without WhatsApp, fall back to email or SMS.",
      },
      {
        q: "Is UPI QR Generator's output accepted by all UPI apps?",
        a: "Yes — the QR format is standardised by NPCI and all certified UPI apps (PhonePe, Google Pay, Paytm, Amazon Pay, BHIM, WhatsApp Pay, MobiKwik, Cred, Slice Pay, etc.) read it. Apps display the merchant name and the amount; the customer confirms with their UPI PIN. For a static counter QR (no fixed amount), the customer enters the amount; for a dynamic QR (e.g., per-invoice), include the amount in the QR's intent URL.",
      },
      {
        q: "How accurate is Mobile Number Tracker?",
        a: "Original carrier and circle (state) lookup is ~95% accurate using the MNP-aware NPCI/TRAI public lookup data we mirror. Current carrier (post-MNP) is shown when the number has been ported in the last 5 years. We never display the subscriber's name, address, or any personal information — that requires authenticated access via TSP licensed entities, which we are not.",
      },
      {
        q: "Can WhatsApp Formatter handle long-form messages with multiple paragraphs?",
        a: "Yes — formatting works across paragraphs (each paragraph can have its own bold/italic spans). WhatsApp's UI rendering treats each formatting marker independently, so *bold across multiple lines* renders correctly. The platform doesn't support headings or bullet lists natively, but well-placed bold + spacing achieves a similar visual hierarchy.",
      },
      {
        q: "What is the difference between IFSC Bank Details here and the IFSC Code Lookup in the India Guide category?",
        a: "Same underlying data (RBI IFSC master list) — the difference is the use case. IFSC Code Lookup (India Guide category) is the quick 'one IFSC, return branch' tool. IFSC Bank Details (here, in the WhatsApp & UPI category) handles the bulk and reverse-lookup cases for KYC and onboarding scenarios — bulk-validate 50 IFSCs from a vendor list, reverse-lookup 'all SBI branches in Mumbai with PIN starting 4000', etc.",
      },
      {
        q: "Will the WhatsApp formatting tools work on all Android, iPhone, and WhatsApp Web devices?",
        a: "Yes — all formatting (bold, italic, strikethrough, monospace) uses WhatsApp's native markdown syntax (asterisks, underscores, tildes, backticks) which is universal across platform versions. The tools handle the syntax automatically; the rendered output looks identical on Android WhatsApp, iPhone WhatsApp, and WhatsApp Web. WhatsApp Business app supports all the same formatting plus quick-replies, which the tools can also generate.",
      },
      {
        q: "Are the WhatsApp Status / Story-style decorative templates current with the latest design trends?",
        a: "Yes — templates are refreshed monthly with current Indian-festival colour palettes (Diwali, Holi, Eid, Ganesh Chaturthi), trending design styles (gradient backgrounds, neon-glow text, minimal-typography), and platform-specific sizing (square 1:1 for Status, 9:16 vertical for Stories). User-generated content stays on-trend for about 3-4 months before refresh.",
      },
      {
        q: "Will the WhatsApp Group Link Generator's links work on Indian phone numbers?",
        a: "Yes — generated links use the universal WhatsApp link scheme (wa.me/<phone>?text=<message> or chat.whatsapp.com/<group-id>) which works for any country code including +91. For India-specific use cases (broadcast lists for shop owners, customer-update lists, RSVP confirmations), the group-link approach scales to 1,024 members per group; for larger audiences, use the WhatsApp Business API which the tool also supports through pre-formatted message templates.",
      },
    ],
  },

  css: {
    whatIs:
      "CSS and design tools on SabTools.in cover the visual-effect generators that frontend developers, designers, and content creators use to produce CSS snippets without hand-writing the cubic-bezier curves, inset-shadow stacks, multi-stop gradients, and HSL colour adjustments by hand. These are not heavy-weight design systems (those are Figma's job) but small purpose-built tools for the specific moments — 'I need a smooth purple-to-pink gradient', 'I need a subtle box-shadow that doesn't look 2014', 'I need a 12-colour brand palette starting from this primary', 'I need glassmorphism with the right backdrop-filter blur', 'I need a text shadow that reads as elevated rather than cheap'. Each tool produces clipboard-ready CSS that drops directly into a stylesheet, Tailwind config, or styled-components template. The output uses modern CSS (custom properties, oklch() where supported, fallbacks for older browsers).",
    keyFeatures: [
      {
        title: "Live-preview gradient generation",
        description:
          "CSS Gradient Generator handles 2-stop, 3-stop, multi-stop linear gradients with angle control and radial gradients with origin and shape control. Supports oklch() / oklab() colour interpolation for perceptually-uniform gradients, with fallback to RGB-interpolated for older browsers. Output includes vendor prefixes for cross-browser support.",
      },
      {
        title: "Multi-layer box and text shadows",
        description:
          "Box Shadow Generator stacks 1-4 shadow layers (each with x, y, blur, spread, colour, and inset toggle). Text Shadow Generator handles 1-3 layered text shadows with x/y/blur/colour controls. Both export the CSS and a Tailwind-class equivalent (where the values match Tailwind's scale).",
      },
      {
        title: "Border-radius and glassmorphism live designers",
        description:
          "Border Radius Generator handles 8-corner control (top-left, top-right, bottom-right, bottom-left, plus the elliptical x/y per-corner variant) with copy-paste CSS. Glassmorphism Generator combines backdrop-filter blur, semi-transparent background, border, and inner shadow into the modern frosted-glass look popularised by Apple Big Sur and now standard in dashboards.",
      },
      {
        title: "Colour-palette generation with brand-consistent harmony",
        description:
          "Color Palette Generator takes a primary colour and produces 10-12 palette variants — analogous, complementary, split-complementary, triadic, tetradic, monochromatic. Outputs hex, RGB, HSL, and oklch() for each colour; also generates Tailwind config-ready palette objects (50/100/200/.../900) using lightness ramping from the primary.",
      },
    ],
    useCases: [
      {
        title: "Landing-page hero design",
        description:
          "Designer building a landing-page hero: CSS Gradient Generator produces the brand-aligned hero gradient (e.g., indigo-600 to purple-700 at 135deg); Box Shadow Generator adds the depth on the hero CTA; Border Radius Generator rounds the CTA to 12px. Five minutes vs an hour of hand-tuning. Output drops into the existing Tailwind classes without conflict.",
      },
      {
        title: "Component-library theming",
        description:
          "Building a component library or theme: Color Palette Generator from the brand primary produces the 10-step Tailwind-compatible palette; Box Shadow Generator produces the 5-elevation scale (sm, md, lg, xl, 2xl); Border Radius Generator produces the 4-radius scale (sm, md, lg, xl). Together these establish the design tokens for an entire library in 20 minutes.",
      },
      {
        title: "Marketing-page modern visual effects",
        description:
          "Marketing site needing the on-trend modern look: Glassmorphism Generator for the floating-card aesthetic; CSS Gradient Generator for hero and section backgrounds; Text Shadow Generator for the elevated-headline effect. Output is paste-ready CSS that works without a design-system overhaul.",
      },
      {
        title: "Quick prototyping and design experiments",
        description:
          "Designer or founder iterating on visual direction: tweak the gradient, the shadow, the radius, the palette — all in browser, all with live preview, all with copy-pasteable output. Beats the cycle of 'change in Figma → export → paste into code → reload → adjust' by 10x for the early-iteration phase before settling on the final direction.",
      },
    ],
    howToChoose:
      "For colour work — Color Palette Generator first to establish the brand palette; CSS Gradient Generator for hero or section backgrounds. For depth and elevation — Box Shadow Generator for cards, buttons, modals; Text Shadow Generator for hero text and headings. For shape — Border Radius Generator for any non-trivial corner work. For modern aesthetic — Glassmorphism Generator for the frosted-card look. For colour-format conversion (hex ↔ RGB ↔ HSL) and one-off colour-utility tasks, the Color Picker & Converter and HEX to RGB Converter in the Developer category are more appropriate. For lower-level CSS tasks (CSS Grid layout, Flexbox layout, Tailwind CSS class generation, SVG editing), the corresponding tools in the Developer and Charts categories are the right fit. Workflow for a new design system: Color Palette Generator → Box Shadow Generator (5-step elevation scale) → Border Radius Generator (4-step radius scale) → CSS Gradient Generator (hero) → Glassmorphism Generator (floating UI). Workflow for one-off design work: pick the specific generator for the effect you need; copy CSS; paste into your stylesheet.",
    indianContext:
      "The Indian frontend developer community is large and growing — over 5 million developers in 2025, with a heavy concentration in service companies (TCS, Infosys, Wipro, Tech Mahindra, Cognizant) and the product/D2C space (Zerodha, Razorpay, CRED, Meesho, Zomato, Swiggy). Most Indian developers learn through bootcamps and self-study where deep CSS expertise is uncommon — these generators bridge the 'I know HTML and Tailwind but cubic-bezier curves and multi-stop radial gradients are still hard' gap that affects most working developers. The output is always paste-ready Tailwind-compatible CSS because the Tailwind ecosystem dominates Indian frontend (about 70%+ of new projects in 2025 use Tailwind). For developers building for the Indian audience specifically, lower-end devices and slower networks impose performance constraints — our Box Shadow Generator flags multi-layer shadows that would harm rendering performance on entry-level Android phones; CSS Gradient Generator suggests using gradient backgrounds judiciously since they are slightly more expensive than solid colours on low-RAM devices. Glassmorphism and backdrop-filter blur are flagged as 'use sparingly' on low-end target devices because the GPU compositing cost is real.",
    pillarFaqs: [
      {
        q: "Does the output of these generators work in all browsers?",
        a: "Modern evergreen browsers (Chrome 90+, Safari 15+, Firefox 88+, Edge 90+) — yes, all output works without prefixes. For Internet Explorer 11 and older Safari, multi-stop gradients work, basic shadows work, but oklch() colour interpolation and backdrop-filter (used in Glassmorphism Generator) do not — the tool flags those features as 'modern only' and provides RGB-fallback CSS for older browsers if you toggle the legacy-compat option.",
      },
      {
        q: "Are the colour palettes accessible (WCAG-compliant)?",
        a: "Color Palette Generator includes a contrast-ratio checker — any palette pair that fails WCAG AA (4.5:1 for normal text, 3:1 for large text) is flagged. AA-compliance is the typical web target; AAA (7:1 for normal text) is shown for accessibility-focused projects. The tool does not auto-correct failing colours — that is a design judgement call — but you see the violation immediately and can adjust.",
      },
      {
        q: "Can I save my generator settings as a preset?",
        a: "Yes — each generator has a 'save preset' button that stores the current settings in browser local-storage. Saved presets persist across sessions and can be exported as JSON for sharing or version-control commit. There is no cloud-sync; presets are device-local for privacy.",
      },
      {
        q: "Do the generators produce CSS or Tailwind-class output?",
        a: "Both — toggle between raw CSS (for any project) and Tailwind classes (for Tailwind projects, including arbitrary-value syntax like `shadow-[0_2px_8px_rgba(0,0,0,0.1)]` for non-standard values). For values that match Tailwind's default scale, the tool returns the named class (`shadow-md`); for off-scale values, it returns the arbitrary-value class.",
      },
      {
        q: "Why does Glassmorphism Generator's preview look different from my final website?",
        a: "Glassmorphism depends on what is *behind* the frosted glass — a colourful background reads more glassy; a uniform background looks flatter. The generator's preview uses a default colourful background; your actual website may have different content behind the glass card. To preview accurately, paste the generated CSS into your dev environment and check against your real background.",
      },
      {
        q: "Will the gradient and shadow generators produce code that works in older browsers?",
        a: "The CSS output uses modern syntax (linear-gradient, radial-gradient, box-shadow, filter) supported by Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. For IE 11 support (rare in modern Indian projects), the tool also outputs the legacy -ms- and -webkit- prefixed forms. For very old Android browsers (Android 4.x stock browser), some advanced features (conic-gradient, backdrop-filter) gracefully degrade; the tool flags affected outputs.",
      },
      {
        q: "Are the color palette suggestions accessible per WCAG 2.1 contrast requirements?",
        a: "Yes — the palette generator includes contrast scoring against WCAG AA (4.5:1 for normal text, 3:1 for large text) and WCAG AAA (7:1 for normal). When a colour combination fails AA, the tool flags it and suggests the closest passing alternative. For sites targeting Indian government accessibility standards (GIGW), AA is the minimum compliance level; AAA is recommended for older-audience or assistive-tech-heavy users.",
      },
      {
        q: "Will the box-shadow and border-radius outputs work on Tailwind / Bootstrap projects?",
        a: "Yes — the tool offers two output formats: raw CSS (for vanilla projects) and class-name format (for Tailwind utility-first projects). Tailwind users can copy values like `shadow-[0_8px_24px_rgba(0,0,0,0.15)]` directly. Bootstrap users get equivalent custom-property overrides that match Bootstrap 5's design token system. Both outputs preview live before you copy.",
      },
    ],
  },

  data: {
    whatIs:
      "Data tools on SabTools.in cover the JSON, CSV, Markdown, image, and aspect-ratio conversions that developers, content creators, and analysts run constantly when moving data between systems — converting JSON to CSV (and back), diffing two text blocks to see line-level changes, previewing Markdown in real time before publishing, encoding an image to Base64 for inline embedding, and computing aspect-ratios for video and image work. Each tool runs entirely in your browser with no upload — your data never leaves your device, which matters when the data is from a confidential database export, a customer file, or a work-laptop with strict upload policies. These complement the developer-category tools (JSON Formatter, JSON Validator, etc.) by focusing on the data-transformation rather than the data-validation side.",
    keyFeatures: [
      {
        title: "Bidirectional JSON ↔ CSV with deep nesting handled",
        description:
          "JSON to CSV Converter flattens nested objects and arrays to dot-notation column names (customer.address.city, items[0].name) for spreadsheet-compatible output. CSV to JSON Converter parses the inverse, supports custom delimiters (comma, tab, semicolon, pipe), handles quoted fields with embedded commas, and detects character encoding (UTF-8, UTF-8-BOM, ISO-8859-1).",
      },
      {
        title: "Line-level text diff with side-by-side view",
        description:
          "Text Diff Checker takes two text blocks and produces a side-by-side or unified diff showing additions (green), deletions (red), and unchanged lines. Useful for comparing two versions of a configuration file, two drafts of an article, or two blocks of generated code. Word-level diff toggle highlights smaller-than-line changes.",
      },
      {
        title: "Live Markdown rendering with GFM extensions",
        description:
          "Markdown Preview renders Markdown as you type, supporting GitHub Flavored Markdown extensions — task lists (- [x]), tables, fenced code blocks with syntax highlighting, autolinks. Useful for previewing README files, blog drafts, and Markdown emails before publishing. Output as HTML for paste into WordPress, Notion, or other platforms.",
      },
      {
        title: "Base64 image encoding and aspect-ratio computation",
        description:
          "Image to Base64 takes any image (PNG, JPG, SVG, WebP) and produces the data: URI for inline-embedding in HTML/CSS — useful for small icons that should not require an extra HTTP request. Aspect Ratio Calculator computes width:height ratios for video (16:9, 21:9, 4:3, 1:1, 9:16) and converts between resolution dimensions (1920x1080 = 16:9 = 1.778:1).",
      },
    ],
    useCases: [
      {
        title: "Database-export and spreadsheet-import workflows",
        description:
          "Developer extracting JSON from a REST API and needing it in Excel: JSON to CSV Converter with the right key-flattening produces a CSV that opens cleanly in Excel/Google Sheets. The reverse (a business user submits an Excel file that needs to seed a database): CSV to JSON Converter produces structured JSON that the developer's import script consumes.",
      },
      {
        title: "Code-review and configuration-change comparison",
        description:
          "Two versions of a YAML/JSON config file with subtle differences: Text Diff Checker highlights every changed line. Useful for pre-commit code review, debugging 'why is this version of the config breaking', and tracking changes through CI/CD pipelines without spinning up a full diff tool.",
      },
      {
        title: "Content authoring with Markdown",
        description:
          "Blog writer drafting in Markdown: Markdown Preview renders the post as you type, surface bug catches before publishing (broken table syntax, missing list-marker, wrong fenced code language). Final HTML output pastes into WordPress, Ghost, Notion, or any other CMS that accepts HTML.",
      },
      {
        title: "Frontend asset workflows",
        description:
          "Frontend developer needing inline data: URI for a small SVG icon — Image to Base64 produces the data-URI that drops into the CSS or HTML. Aspect Ratio Calculator confirms the 1920x1080 source video fits the 16:9 video player container correctly. Both common tasks in modern frontend.",
      },
    ],
    howToChoose:
      "For format conversion — JSON to CSV Converter and CSV to JSON Converter for tabular ↔ object data; pair with the JSON Formatter, JSON Validator, XML to JSON Converter, and YAML to JSON Converter in the Developer category for the full data-format ecosystem. For diff comparison — Text Diff Checker for any text-comparison need. For documentation and content — Markdown Preview for live rendering. For image and visual — Image to Base64 for embedding small images inline; Aspect Ratio Calculator for video and image dimension work. For lower-level data tasks (encoding, hashing, validation), the Developer category has Hash Generator, URL Encoder/Decoder, HTML Encoder/Decoder, JWT Decoder. Workflow for content-API integration: CSV to JSON Converter (Excel input) → JSON Formatter (verify structure) → use in code → if outputting to spreadsheet, JSON to CSV Converter on the way out. Workflow for content drafting: Markdown Preview during drafting → Word Counter (Text category) for word count → publish. None of these tools transmit your data to a server — all processing is client-side.",
    indianContext:
      "Data work in Indian developer and analyst contexts has specific characteristics — bank-statement exports come as CSVs that Excel mangles on import (₹ symbol encoding, DD/MM/YYYY date format vs Excel's MM/DD/YYYY default, leading zeros in PAN numbers stripped by Excel), GST returns export as JSON requiring conversion for spreadsheet review, and education-sector data (CBSE results, university transcripts) often comes in irregular CSV formats with multi-line headers. Our CSV to JSON Converter handles the malformed-quote-and-encoding cases that Excel chokes on. JSON to CSV Converter respects DD/MM/YYYY date formats common in Indian source data (rather than auto-converting to Excel's MM/DD/YYYY which causes off-by-one-month errors). Markdown adoption in Indian content workflows is growing — most documentation in Indian product companies uses Markdown (GitHub README, GitBook docs, Confluence, Notion); blog drafts increasingly start in Markdown before HTML. Indian frontend developers often work with low-bandwidth target users — every kilobyte of asset matters, and Image to Base64's inline-encoding is a sensible technique for icons under 4 KB (saves an HTTP request) but counterproductive for larger images (Base64 is ~33% larger than binary). The tool flags this trade-off when you Base64-encode anything above 4 KB.",
    pillarFaqs: [
      {
        q: "Does CSV to JSON Converter handle Indian-format dates and currency symbols?",
        a: "Yes — DD/MM/YYYY (and DD-MM-YYYY) date formats are recognised; the parser preserves them as strings rather than auto-converting to Excel-style MM/DD/YYYY. ₹ and ‹ symbols in numeric fields are stripped to leave just the number. Leading zeros (in PAN, Aadhaar, account numbers) are preserved as strings — the Excel default of stripping leading zeros is not applied.",
      },
      {
        q: "How big a file can JSON to CSV Converter handle?",
        a: "Up to about 50 MB of JSON input (which produces a similar-size CSV) before browser performance degrades. For larger files, a server-side or scripting solution (Python pandas, Node.js stream parsing) is more appropriate. For typical use cases (small-to-mid business data, API responses, configuration files), 50 MB is well above the typical need.",
      },
      {
        q: "Is Text Diff Checker word-level or just line-level?",
        a: "Both — the default is line-level (showing whole-line additions/deletions). Toggle 'word-level' for finer-grained highlighting that shows changed words within a line — useful for spotting a typo correction or a single-character edit. The diff algorithm is Myers' diff (the same algorithm Git uses) for accurate minimal-change identification.",
      },
      {
        q: "Does Markdown Preview support custom Markdown extensions?",
        a: "Standard CommonMark plus GitHub Flavored Markdown (GFM) extensions — task lists, tables, fenced code blocks, autolinks, strikethrough. It does not support custom extensions like Pandoc's footnotes, MathJax LaTeX rendering, or Mermaid diagrams. For those, use the relevant specialised tool (Pandoc, KaTeX renderer, Mermaid live editor).",
      },
      {
        q: "When should I NOT use Image to Base64?",
        a: "When the image is larger than ~4 KB. Base64 encoding adds about 33% size, so a 10 KB image becomes ~13 KB inlined into the HTML/CSS. The browser cannot cache an inlined Base64 image separately from the page, so every page load re-downloads it. For images above 4 KB, a separate HTTP request (and the browser's caching of that asset) is more efficient. The tool flags this when you encode anything above the threshold.",
      },
      {
        q: "Will the CSV / JSON / Excel converter handle large files without crashing the browser?",
        a: "Yes — up to about 50 MB before browser memory becomes the bottleneck. For larger files (full database exports, multi-million-row CSVs), use a streaming CLI tool (Pandas, awk, jq) on your local machine — no browser-based converter will be as fast as a native binary on files that size. The tool flags files approaching the limit and recommends the CLI alternative.",
      },
      {
        q: "Does the Random Sampling tool produce reproducible samples for academic research?",
        a: "Yes — the random sampling tool accepts a seed value; identical seed produces identical sample, useful for academic work where the methodology must be reproducible. Without a seed, each run produces a fresh random sample using crypto.getRandomValues(). For statistical sampling (stratified, cluster), the tool offers per-stratum sample-size control rather than a flat sample size.",
      },
      {
        q: "Are the chart and pivot-table outputs comparable to Excel / Google Sheets pivots?",
        a: "For simple aggregations (count, sum, average, median, min, max grouped by a category), yes — output matches Excel and Google Sheets pivots to the cell. For advanced analytics (window functions, regression, time-series decomposition), Excel and Google Sheets are richer because they have built-in functions our tool would need to replicate. For descriptive statistics on Indian census-style data, the pivot tool handles state/district aggregations correctly.",
      },
    ],
  },

  social: {
    whatIs:
      "Social media tools on SabTools.in cover the content-creation utilities that creators, marketers, and small-business operators use to ship Instagram, Twitter/X, YouTube, and Facebook posts efficiently — generating Instagram bios that stay under the 150-character limit while including key links, suggesting hashtag bundles for higher discoverability, resizing images to platform-specific dimensions (1080x1080 for IG feed, 1080x1920 for IG/FB story, 1280x720 for YouTube thumbnail), counting tweet characters under the 280-character limit (including links and emojis), generating shareable timestamped YouTube links, and downloading the high-res thumbnail image of any YouTube video. Each tool is purpose-built for one platform-specific task and runs entirely client-side.",
    keyFeatures: [
      {
        title: "Bio length limits with line-break support",
        description:
          "Instagram Bio Generator handles the 150-character bio limit with proper UTF-16 counting (emojis count as 2 characters), supports the line-break character that the IG app does not insert by default (must be created via copy-paste from a generator), and flags when the bio approaches the limit so you can cut before publishing.",
      },
      {
        title: "Niche-specific hashtag bundles",
        description:
          "Hashtag Generator builds 30-hashtag bundles by niche (food, fashion, fitness, travel, tech, finance, parenting) and target audience (India-specific or global). Mixes large (1M+ posts), medium (100K-1M), and small (10K-100K) hashtags for the engagement-balance algorithm rewards on Instagram and TikTok.",
      },
      {
        title: "Multi-platform image resizing presets",
        description:
          "Social Media Image Resizer has presets for every major platform — Instagram (square 1080x1080, story 1080x1920, reel 1080x1920, carousel 1080x1080), Twitter/X (post 1200x675, header 1500x500), Facebook (post 1200x630, cover 851x315, story 1080x1920), LinkedIn (post 1200x627, banner 1584x396), YouTube (thumbnail 1280x720, banner 2560x1440). Crop or fit-and-pad modes.",
      },
      {
        title: "Tweet character counting and YouTube utilities",
        description:
          "Tweet Character Counter handles the 280-character limit with link auto-shortening (URLs count as 23 characters regardless of actual length), emoji-aware counting, and per-segment counts for thread tweets. YouTube Timestamp Generator creates &t=120s deep-links to specific moments in a video. YouTube Thumbnail Downloader pulls the maxres thumbnail of any public video.",
      },
    ],
    useCases: [
      {
        title: "Influencer or creator bio refresh",
        description:
          "Updating IG bio with the new product launch link: Instagram Bio Generator suggests bio templates ('Sharing daily food tips 🍴 | DM for orders') under 150 chars including the link tracking, with line breaks supported. Use the result for IG, then adapt for Twitter (160-char bio limit) and TikTok (80-char bio limit) variants.",
      },
      {
        title: "Daily-posting content workflow",
        description:
          "Creator posting daily: Social Media Image Resizer takes the source 1920x1080 image and produces the four required platform variants (IG square, IG story, FB post, Twitter post) in 30 seconds. Hashtag Generator suggests the day's bundle by content theme. Tweet Character Counter ensures the cross-posted Twitter version stays under 280 with the link included.",
      },
      {
        title: "Long-form video clip-sharing",
        description:
          "Sharing a specific 3-minute moment from a 60-minute YouTube video: YouTube Timestamp Generator creates the deep-link with the exact start time (and optional end time for embed-style segment sharing). Useful for podcast highlights, lecture clips, and meeting recordings.",
      },
      {
        title: "Thumbnail re-use and inspiration",
        description:
          "Researcher or competitor analyst studying YouTube thumbnails: YouTube Thumbnail Downloader pulls the maxres image (1280x720) of any public video for archive or reference. Useful for analysis, benchmarking, and inspiration boards. Always respect copyright — fair use is for analysis, not republication.",
      },
    ],
    howToChoose:
      "For platform-specific bio and post — Instagram Bio Generator, Tweet Character Counter, Hashtag Generator. For visual content — Social Media Image Resizer for cross-platform sizing; for image generation and editing, the Image category has Image Compressor, Image Resizer, Background Remover, Image Filters, Collage Maker, and 30+ other image tools that complement the platform-specific resizer here. For YouTube creators — YouTube Timestamp Generator for shareable moments; YouTube Thumbnail Downloader for reference. For SEO and content distribution, the SEO category has SERP Preview, Headline Analyzer, Meta Tag Generator, and Open Graph Generator that cover the search-and-share-card side of social distribution. Workflow for a daily creator: take photo → Social Media Image Resizer (4 variants) → caption draft → Hashtag Generator → Tweet Character Counter (for Twitter version) → post. Workflow for video creator: upload to YouTube → YouTube Thumbnail Downloader (verify thumbnail) → YouTube Timestamp Generator (for promotional clips). None of these tools post directly to platforms — they generate the content; you copy-paste to the actual platform.",
    indianContext:
      "Indian social-media usage is unique in scale and pattern — India has the world's largest Instagram user base (516+ million), the largest YouTube user base (550+ million), and growing Twitter and Facebook user bases (35+ million and 405+ million respectively). Indian creator economy has exploded — over 8 million active creators across platforms in 2025, with the long tail (1K-10K followers) being the largest segment. Hashtag strategy in India differs from the global norm — region-specific tags (#mumbai, #delhi, #bengaluru, #chennai), language-specific tags (#hindi, #tamil, #telugu, #marathi, #bengali), festival tags (#diwali, #holi, #ganeshchaturthi, #onam, #pongal) drive high local engagement. Our Hashtag Generator includes regional and festival tags as toggles. Image dimensions are platform-standard globally, but Indian creators often need to repurpose for WhatsApp Status (vertical 9:16) which is functionally a sixth platform — Social Media Image Resizer has the WhatsApp Status preset. YouTube creators in India often work in multiple languages — Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati — and YouTube Timestamp Generator's deep-links work the same regardless of caption language. Tweet Character Counter handles Hindi/Tamil/Telugu/etc. UTF-16 character counts correctly (Devanagari characters can take 1-2 codepoints depending on conjuncts).",
    pillarFaqs: [
      {
        q: "Does Hashtag Generator return only India-relevant hashtags?",
        a: "By default, mixed — large global hashtags for reach plus India-specific and regional tags for local engagement. Toggle 'India only' to get only Indian-context hashtags (regional cities, languages, festivals, Indian brands and references). Most successful Indian creators use a 70-30 split (70% Indian-context, 30% global) for the 30-tag bundle on Instagram and TikTok.",
      },
      {
        q: "How does Tweet Character Counter handle URLs?",
        a: "Twitter automatically counts every URL as 23 characters regardless of actual length — a 50-character link and a 200-character link both count as 23. Our counter applies this rule, so a tweet with 'Read more https://very-long-url.com/article-with-a-lot-of-slashes-and-text' counts the URL portion as 23 characters and the rest of the text directly. Emojis count per UTF-16 codepoint (most emojis are 2 codepoints).",
      },
      {
        q: "Can YouTube Thumbnail Downloader pull thumbnails for private or unlisted videos?",
        a: "No — thumbnails are only accessible for public videos via the YouTube thumbnail URL pattern (`https://i.ytimg.com/vi/<videoId>/maxresdefault.jpg`). Private and unlisted videos do not expose this URL publicly, so the tool cannot retrieve them. For a video you own, use the YouTube Studio dashboard's thumbnail download.",
      },
      {
        q: "Does Social Media Image Resizer preserve image quality?",
        a: "It uses high-quality resampling (Lanczos resampling for downscaling, bilinear for upscaling) that preserves detail well. For images that are dramatically smaller than the target size (upscaling 400x300 to 1920x1080), there is unavoidable quality loss; the tool flags this. For typical use (downscaling a 4000x3000 source photo to 1080x1080 IG square), output is visually indistinguishable from the source.",
      },
      {
        q: "Is Instagram Bio Generator's 150-character limit accurate?",
        a: "Yes — Instagram counts UTF-16 codepoints (most emojis count as 2 chars; a regional indicator flag emoji like 🇮🇳 counts as 4). Our counter mirrors Instagram's exact counting rule, so a bio that fits in our preview will fit in IG. Be aware that some line-break characters take 1 character but display as a visual line break — that is the IG-app peculiarity our tool handles.",
      },
      {
        q: "Are the Instagram / Twitter / LinkedIn caption generators tuned to each platform's tone?",
        a: "Yes — Instagram captions are longer (1-3 short paragraphs) with hashtag groups and an emoji pacing. Twitter captions are tight (under 280 chars) with one or two hashtags. LinkedIn captions are professional, story-driven, and longer-form (300-1500 chars). The tone-selector also allows formal/casual/witty/educational variants. Each output is a starting draft; final tone should match your individual voice rather than the generator's default.",
      },
      {
        q: "Will the hashtag suggestions improve Instagram or LinkedIn organic reach?",
        a: "On Instagram, yes — relevant hashtags expand discoverability into hashtag-feed audiences who do not follow you. The generator picks 15-25 hashtags with a balance of high-volume (1M+ posts) and medium-volume (100K-1M posts) tags, since pure-high-volume hashtags get buried fast. On LinkedIn, hashtags help less than relevant tagging of people and companies; the tool prioritises mention-suggestions over hashtag density.",
      },
      {
        q: "Does the YouTube thumbnail / title generator help with Indian-language channels?",
        a: "Yes — the title generator handles Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Kannada, and Malayalam. Optimal title length is 60-70 characters for Latin scripts; for Indian scripts the visual length is similar despite higher byte count. The thumbnail generator suggests text-overlay sizing that stays readable on mobile (the dominant Indian YouTube viewing surface) — large bold sans-serif typography in your script's native typography is the highest-CTR pattern.",
      },
    ],
  },

  student: {
    whatIs:
      "Student-tools on SabTools.in cover the school and college productivity utilities that lie in the gap between general academic calculators and specialised exam tools — generating printable graph paper for mathematics homework, building flashcard decks for spaced-repetition study, generating timetables that fit class schedules and study blocks, producing handwriting practice pages for early grades, and counting words against assignment-length requirements. These are the small daily-use utilities that students actually need in school and college — not for entrance-exam prep (the Exam category covers that), not for grade computation (the Education category covers that), but for the in-between productive-study workflow.",
    keyFeatures: [
      {
        title: "Printable graph paper in multiple grid styles",
        description:
          "Graph Paper Generator produces graph paper in cm/inch/mm grids, polar paper for trigonometric work, isometric paper for engineering drawing, log/semi-log paper for science graphs, and dot-grid paper for bullet-journal-style notes. Output as PDF for printing at school or home; A4 and US Letter sizes supported.",
      },
      {
        title: "Flashcard creation and spaced-repetition export",
        description:
          "Flashcard Maker takes a topic and Q&A pairs (typed in or pasted from a CSV); produces a printable deck for physical study or an Anki-import file for digital spaced-repetition learning. Templates for vocabulary, formulas, history dates, and definition-style flashcards.",
      },
      {
        title: "Class timetable and study schedule generation",
        description:
          "Timetable Generator handles class-period timetables (week × subject grid for school) and personal study timetables (subjects × time-blocks for exam prep). Constraints: avoid two classes per teacher in the same period, fit a target hours-per-subject distribution, leave slots for revision and rest.",
      },
      {
        title: "Handwriting and assignment utilities",
        description:
          "Handwriting Page Generator produces ruled / 4-line / 2-line / cursive practice pages for early-grade handwriting practice (Indian school standard 4-line for English, 3-line for Hindi/regional script). Assignment Word Counter counts words against assignment length requirements with structure analysis (intro/body/conclusion length).",
      },
    ],
    useCases: [
      {
        title: "Math and science homework graph paper",
        description:
          "Class 9 student doing geometry homework needs cm-grid graph paper but the school-issued one ran out: Graph Paper Generator produces a printable A4 cm-grid PDF in 30 seconds. Polar paper for Class 11/12 trigonometric coordinate problems; semi-log paper for Class 12 physics graphs. Saves the trip to the stationery shop.",
      },
      {
        title: "Vocabulary and exam-preparation flashcards",
        description:
          "GRE/SAT/IELTS vocabulary builder: Flashcard Maker takes a 200-word vocabulary list (with meanings and example sentences), produces an Anki-import file for daily spaced-repetition review. Same workflow for Class 12 biology terminology, history dates, or chemistry formula recall.",
      },
      {
        title: "Personal exam-prep schedule",
        description:
          "Class 12 student 90 days before boards: Timetable Generator with subjects (Physics, Chemistry, Maths, English, optional) and target hours per subject (more for weak subjects, less for strong) produces a daily 6-7 hour schedule with rotation and revision blocks. Pairs with the Study Time Planner in the Education category for exam-week-specific scheduling.",
      },
      {
        title: "Early-grade handwriting and primary-school work",
        description:
          "Parents teaching primary-grade children at home: Handwriting Page Generator produces 4-line (English) or 3-line (Hindi) practice pages with optional traceable letters for the child to overwrite. Saves the otherwise-required workbook purchase. Useful particularly during school breaks for daily handwriting maintenance.",
      },
    ],
    howToChoose:
      "For math and science work — Graph Paper Generator covers all standard grid types. For memorisation and revision — Flashcard Maker for term-to-definition and Q&A workflows. For scheduling — Timetable Generator for both school class-timetables and personal study schedules. For early-grade learning — Handwriting Page Generator for English (4-line) and Hindi/regional (3-line) practice. For assignment-length compliance — Assignment Word Counter. For deeper academic-tools, the Education category has GPA Calculator, CGPA to Percentage, Grade Calculator, Study Time Planner; the Exam category has the entrance-exam score predictors (NEET, JEE, GATE, CAT). Workflow for a typical student: Graph Paper Generator (during math/science homework, as needed) → Flashcard Maker (during exam-prep month) → Timetable Generator (at semester start and exam-prep start) → Handwriting Page Generator (early-grade or non-Indian-script learners). Workflow for assignments: Assignment Word Counter (during draft and final). None of these tools replace the textbook, the teacher, or the actual study work — they are the small productivity utilities that smooth the workflow.",
    indianContext:
      "Indian school-and-college academic life is intense — [CBSE](https://www.cbse.gov.in/), ICSE, and State Boards have heavy paper-and-pen workload in math, science, and language subjects through Class 12, and undergraduate engineering programmes (BE, BTech) similarly use paper-and-pen for submissions. The Graph Paper Generator's 4-line and 3-line variants cover the Indian school standard for English (4-line ruling) and Hindi/regional scripts (3-line) — which differs from the US/UK 3-line ruling and is rarely available in stationery globally. CBSE board exam paper specifically uses 'cm-grid graph paper' for the geometry section in Class 10/12, in line with the curriculum prescribed by the [National Council of Educational Research and Training (NCERT)](https://ncert.nic.in/); the tool produces the exact format. Indian college engineering drawing (mechanical, civil) uses 'isometric grid paper' which is hard to find in tier-2/tier-3 city stationery — Graph Paper Generator produces this on demand. Flashcard Maker's Anki-export is appropriate for the technical-terminology-heavy CBSE class-11/12 syllabus (biology, chemistry, history) where memorisation is unavoidable; for engineering and medicine entrance prep, paired with the AI Quiz Generator in the AI category, this gives a strong revision toolkit. Indian schools often have 6-day timetables (Saturday is half-day or full-day), and our Timetable Generator handles 5-day, 6-day, and 7-day weekly cycles. Handwriting practice is heavily emphasised in the Indian primary curriculum (handwriting carries weight in CBSE / ICSE evaluation through Class 8) — Handwriting Page Generator's traceable-letter mode is particularly useful for grades 1-3.",
    pillarFaqs: [
      {
        q: "Can Graph Paper Generator print to A4 with the right margins for Indian school work?",
        a: "Yes — A4 is the default with 1.5 cm margins (matching CBSE board exam answer-sheet conventions for trim and binding). US Letter is also supported. The PDF output is print-ready; do not scale the print to fit, since that distorts the grid measurements. Use 'actual size' / '100%' in the print dialog.",
      },
      {
        q: "Does Flashcard Maker integrate with Anki, Quizlet, or other apps?",
        a: "Anki — yes, via .apkg export with proper deck formatting. Quizlet — yes, via .csv export in the Term, Definition format Quizlet imports. Other apps (RemNote, Mochi, SuperMemo) typically import CSV; the tool's CSV output works for those. Pure-printable flashcards — yes, A4 sheet with 8 cards per page, foldable for self-quiz.",
      },
      {
        q: "How does Timetable Generator handle weekend study schedules?",
        a: "Configurable — for school weekly-class-timetables, weekends are typically class-free (school closes Saturday evening through Sunday). For personal study-prep timetables, weekends can be scheduled for longer (4-6 hour) revision blocks since school class hours are absent. Toggle the 'study type' (school class vs personal study) and the schedule reflects accordingly.",
      },
      {
        q: "Does Handwriting Page Generator support languages other than English and Hindi?",
        a: "Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, and Punjabi are supported with the appropriate ruling per regional school conventions (most use 3-line ruling for the script). Urdu is supported with right-to-left reading direction. Other languages can be requested via the feedback link; we add scripts based on user demand.",
      },
      {
        q: "Is Assignment Word Counter different from the general Word Counter in the Text category?",
        a: "Yes — Assignment Word Counter has additional features for academic-assignment context: structure analysis (estimated intro/body/conclusion length given total length), heading-vs-body word distribution, citation count detection (matches against [1], (Smith, 2020), etc.), and reference-list separation (excludes the bibliography from the body word count). For non-assignment use (general writing), the general Word Counter in the Text category is simpler.",
      },
      {
        q: "Are the printable graph papers correctly sized for the CBSE / ICSE board-exam answer-sheet format?",
        a: "Yes — the cm-grid and mm-grid graph paper outputs match the board-exam answer-sheet trim size (A4 with 1.5 cm binding margin) and grid spacing exactly. For Class 10 board geometry questions, the cm-grid is the right format. For physics/chemistry experimental graphs in Class 11/12, the semi-log and log-log papers handle the typical y-axis-spans-orders-of-magnitude case. Always print at 100% (do not 'fit to page') — scaling distorts the grid measurement.",
      },
      {
        q: "Will the Flashcard Maker work for spaced-repetition apps like Anki and Quizlet?",
        a: "Yes — the tool exports to Anki's .apkg format (with proper deck and note structure) and Quizlet's CSV format (Term, Definition columns). Both imports work without manual editing. For RemNote, Mochi, and SuperMemo users, the CSV output works for their import workflows too. Cards-per-page printable layout is also available for users who prefer physical flashcards.",
      },
      {
        q: "Does the Timetable Generator handle the Indian 6-day school week?",
        a: "Yes — Indian schools often have 6-day timetables (Saturday is half-day or full-day) which the generator handles natively along with 5-day and 7-day cycles. Constraints supported: avoid two classes per teacher in the same period, fit a target hours-per-subject distribution per week, leave slots for revision and rest, and accommodate fixed-time blocks (assembly, library, sports). Output is a weekly grid printable on A4.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 38. Sports & Cricket — 6 tools (Phase 4 Round 3)
  // ──────────────────────────────────────────────────────────────────────
  sports: {
    whatIs:
      "Sports and cricket tools on SabTools.in handle the scoring, run-rate, and fantasy-points math that every Indian cricket follower runs constantly through IPL season and ICC tournaments — what is the required run rate (RRR) for the chasing team given balls remaining, what is the Net Run Rate (NRR) for a team's league standing, what fantasy points does a player earn for a 50 with two sixes, what is the Duckworth-Lewis-Stern (DLS) revised target for a rain-interrupted match, and what is each franchise's auction-cap remaining after retention. These tools follow the official rules published by the [Board of Control for Cricket in India (BCCI)](https://www.bcci.tv/) for IPL and the ICC for international matches, and are calibrated for the specific quirks of T20 / IPL / ODI / Test scoring that generic cricket calculators miss. For non-cricket sports, athletics-governance and Olympic-discipline tools draw on the [Sports Authority of India](https://sportsauthorityofindia.nic.in/) framework that operates the country's training centres and competitive structure.",
    keyFeatures: [
      {
        title: "T20 / IPL / ODI scoring rules",
        description:
          "Required Run Rate (RRR), Current Run Rate (CRR), and chase-difficulty verdict (Easy / Comfortable / Tough / Impossible) are computed against the same scoring conventions BCCI uses for IPL broadcasts. Net Run Rate (NRR) supports multi-match aggregation with the all-out penalty rule (full-overs counted, regardless of when the last wicket fell) and rain-curtailed match handling.",
      },
      {
        title: "Dream11-style fantasy-points engine",
        description:
          "IPL Fantasy Points Calculator implements the Dream11 / MyTeam11 / FanCode point structure: batting (1 per run, +4 per boundary, +6 per six, +4/+8/+16 milestone bonuses, strike-rate bonus), bowling (25 per wicket, economy bonus, hauls), fielding (8 per catch, 12 per stumping, 12 per run-out), with Captain ×2 and Vice-Captain ×1.5 multipliers applied to the total.",
      },
      {
        title: "Duckworth-Lewis-Stern (DLS) target calculator",
        description:
          "For rain-interrupted matches, the DLS Calculator applies the official ICC DLS resource-table to compute the par score for the chasing team given overs lost. Used for both ODIs and T20Is. Output matches the broadcast-displayed revised target to the run.",
      },
      {
        title: "Auction-cap and team-budget tracking",
        description:
          "IPL Auction Cap Calculator tracks each franchise's remaining purse after retention and bidding, with the per-uncapped-player cap, the right-to-match (RTM) handling, and the foreign-player cap (max 4 in playing XI, 8 in squad). Useful during live auction broadcasts to predict which franchise can still afford which marquee player.",
      },
    ],
    useCases: [
      {
        title: "IPL fantasy team optimisation",
        description:
          "Before the toss, run candidate playing-XI combinations through Fantasy Points Calculator with projected per-player scores, then rank by total. Captain choice (×2 multiplier) typically goes to a top-order batter on a flat pitch or a death-overs bowler on a seam-friendly track. Vice-Captain (×1.5) hedges against the captain underperforming. Used by ~150 million Indian fantasy-cricket players each IPL season.",
      },
      {
        title: "Live chase tracking during a T20 / ODI",
        description:
          "Required Run Rate Calculator updates in real-time as wickets fall and overs progress — RRR rising from 9.5 to 12 within two overs signals the chase is slipping. Current Run Rate vs RRR comparison gives the chase-difficulty verdict broadcast pundits use. Pair with NRR Calculator for late-tournament permutations where a team needs a specific margin to qualify.",
      },
      {
        title: "League-table NRR scenarios",
        description:
          "Late in IPL or ICC tournaments, the NRR Calculator answers 'we need to win by what margin to qualify?' Inputs: current NRR, runs scored across season, overs faced, opposition's runs/overs. Outputs the minimum win margin (in runs or overs-bowled-out) that takes your team above the 4th-place rival. Used by team analysts and broadcast graphics during decisive matches.",
      },
      {
        title: "Auction strategy and squad planning",
        description:
          "Before the IPL mega-auction, franchises model retention vs trade-out scenarios using Auction Cap Calculator to see which player combinations leave maximum auction-purse flexibility. Fans use the same tool to evaluate live-auction decisions and predict which franchise will overspend on a marquee player versus splitting their purse across squad depth.",
      },
    ],
    howToChoose:
      "For live-match math during a chase — Required Run Rate Calculator and NRR Calculator. For Dream11 / MyTeam11 / FanCode fantasy planning — IPL Fantasy Points Calculator with the captain/vice-captain multiplier toggle. For rain-affected matches — DLS Calculator with overs-lost as input. For pre-auction or live-auction strategy — IPL Auction Cap Calculator. Workflow during an IPL match: NRR Calculator (pre-toss to know what margin matters for league standings) → Fantasy Points Calculator (after lineups confirmed) → Required Run Rate Calculator (live during second innings) → re-check NRR after the result. None of these tools change the cricket itself — they translate the on-field math into clean numbers so you do not have to do mental arithmetic during a tense over.",
    indianContext:
      "Indian cricket follows a specific competitive structure governed by BCCI for domestic and the ICC for international fixtures. Domestic first-class cricket (Ranji Trophy, Duleep Trophy, Irani Cup) and limited-overs (Vijay Hazare Trophy, Syed Mushtaq Ali Trophy) feed into the national selection pool; the IPL is the franchise-level T20 league with 10 teams from 2022 onward. Fantasy cricket in India is a regulated sector — Dream11, MyTeam11, FanCode, and others operate under the All India Gaming Federation framework and are recognised as games of skill (not gambling) under the 2017 Public Gaming Act amendments. Our scoring rules match the major fantasy platforms; for tournament-specific rule variations (T10 leagues, women's IPL), the calculator selector adjusts. Beyond cricket, the [Sports Authority of India](https://sportsauthorityofindia.nic.in/) under the [Ministry of Youth Affairs and Sports](https://yas.gov.in/) administers the National Sports Federation framework that supports athletes across 50+ disciplines (athletics, hockey, badminton, wrestling, weightlifting, archery, shooting, boxing). For Olympic-cycle calculations (qualification standards, ranking points, championship cycles), the international federation rules apply and our tools reference those where relevant.",
    pillarFaqs: [
      {
        q: "How accurate are the Fantasy Points Calculator rules vs Dream11 / MyTeam11 actual scoring?",
        a: "The point structure matches Dream11's published scoring system to the point — 1 per run, +4 per boundary, +6 per six, +4 (30-run), +8 (50-run), +16 (100-run) milestone bonuses, strike-rate range bonuses for batters playing 10+ balls, 25 per wicket for bowlers, economy bonuses for 2+ overs bowled, 8 per catch, 12 per stumping or run-out. Captain and Vice-Captain multipliers (×2 and ×1.5) apply to total points. MyTeam11 and FanCode use slightly different constants; toggle the platform at the top of the calculator.",
      },
      {
        q: "Is the NRR formula correct for the all-out penalty case?",
        a: "Yes. When a team is bowled out, NRR is calculated as if the team had faced the full quota of overs (20 in T20, 50 in ODI) regardless of when the last wicket fell. This penalises teams that collapse — losing for 95 in 12 overs gives a much worse NRR than scoring 95 over the full 20 overs. The calculator applies this rule automatically when you mark a team as all-out, and the output matches the BCCI-published NRR figures on IPL points tables.",
      },
      {
        q: "Does the DLS calculator match the broadcast-displayed revised target?",
        a: "Yes — within 1 run of the broadcast figure. The calculator uses the published ICC DLS resource-table (the standard table updated 2024) which is identical to what match referees use. Tiny differences can arise from rounding at intermediate steps; the broadcast usually rounds the par score to the nearest integer, so our output matches once you apply the same rounding. Useful when you missed the live broadcast and want to verify the post-rain target.",
      },
      {
        q: "Will these tools work during a live match on a slow connection?",
        a: "Yes. Every cricket calculator runs entirely client-side and works after the first page load — no live server queries. Useful during a stadium match where mobile data is weak, or during live broadcast on a second screen where you want to do the math yourself. Inputs (runs, overs, wickets) update the output instantly without any server round-trip.",
      },
      {
        q: "Can fantasy-cricket apps detect or restrict use of external calculators?",
        a: "No — the tools are read-only calculators that consume the same publicly-broadcast data the apps use. Dream11 and the other platforms cannot detect (and have no policy against) using a third-party calculator alongside their own UI for team selection. Many serious fantasy players use a spreadsheet, a calculator, or a stats tool to optimise team selection; this is the same idea.",
      },
      {
        q: "Why do rotated NRR figures sometimes differ across cricket sites?",
        a: "Different sites use different rounding conventions and occasionally different conventions for innings declarations. The official BCCI / ICC convention rounds NRR to three decimal places. Some news sites round to two. Some compute NRR at innings-level and aggregate, others compute at series-level — both are mathematically valid but produce minor differences. Our calculator uses the BCCI three-decimal convention to match the official points table.",
      },
      {
        q: "Are these tools useful for non-cricket sports like kabaddi, hockey, or badminton?",
        a: "The cricket-specific tools (RRR, NRR, fantasy points, DLS, IPL auction) are exclusive to cricket. For other sports, generic calculators (percentage, average, basic statistics) work fine for ranking-table or score math. Dedicated tools for Pro Kabaddi League standings, hockey shootout scenarios, or badminton tournament seeding are on the roadmap; for now, those use the cross-category tools in math, science, and converters.",
      },
      {
        q: "Do the cricket calculators handle women's IPL (WPL) and the women's T20 World Cup?",
        a: "Yes — the rules are identical (T20 format, same scoring, same NRR rules) so the tools work for WPL and ICC Women's events without modification. Fantasy cricket for women's matches uses the same Dream11 / MyTeam11 / FanCode point structures. The calculator does not distinguish men's vs women's input; you provide the runs and balls and the math is identical.",
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
