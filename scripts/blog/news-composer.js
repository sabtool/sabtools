/**
 * LLM-powered news/trends composer (Type C).
 *
 * Uses Claude's built-in web_search server-side tool to ground each post in
 * actual recent events — RBI rate decisions, GST notifications, tax law
 * changes, fintech launches, fintech regulatory updates. Without web search,
 * "news" posts hallucinate; with it, every claim is anchored to a source URL
 * the model retrieved fresh.
 *
 * The web_search_20260209 tool (used here) supports dynamic filtering — Claude
 * writes and runs filtering code over search results before they hit the
 * context window, improving quality and reducing token cost.
 *
 * Cost: slightly higher than tool guides (~$0.10-0.15 per post) because of
 * the search overhead. The trade-off is substantially better content quality
 * and freshness signal — Google rewards "news" / "update" pages that cite
 * actual recent events.
 */

const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const INDIA_CONTEXT_PATH = path.join(__dirname, "india-context.json");
const indiaContext = JSON.parse(fs.readFileSync(INDIA_CONTEXT_PATH, "utf-8"));

const { lintForbiddenPhrases, countWords } = require("./llm-composer");

/**
 * Topic pools for news posts. Each cron run picks one topic at random
 * (or rotates), then web search grounds the post in actual recent events
 * within that topic. Categorized so we can rotate fairly across finance,
 * tax, banking, fintech, and tech updates.
 */
const NEWS_TOPICS = {
  finance: [
    "RBI repo rate decision and impact on home loan EMIs in India",
    "Latest mutual fund regulations and SEBI updates affecting Indian investors",
    "Sovereign Gold Bond (SGB) tranches and how they compare to physical gold",
    "Latest PPF / EPF / NPS rate changes and what they mean for Indian savers",
    "Senior citizen savings schemes and bank FD rates — current best options",
    "Indian stock market trends and Nifty / Sensex outlook",
    "Cryptocurrency tax rules in India and recent CBDT clarifications",
  ],
  tax: [
    "Latest income tax changes for FY 2025-26 / AY 2026-27",
    "GST council meeting decisions and rate revisions",
    "ITR filing deadline updates and Section 44ADA / 44AD changes",
    "TDS / TCS rate updates from the Income Tax Department",
    "New tax-saving schemes under Section 80C / 80D / 80CCD",
    "Old vs New tax regime — recent comparison for different income brackets",
  ],
  banking: [
    "Latest home loan interest rate updates from major Indian banks",
    "Credit card cashback and reward changes from HDFC / SBI / ICICI / Axis",
    "UPI transaction limit changes and new NPCI rules",
    "Personal loan rates comparison across SBI, HDFC, Bajaj Finserv",
    "Best FD rates 2026 across Indian public and private banks",
    "Loan against mutual funds vs personal loans in India",
  ],
  fintech: [
    "RBI fintech regulatory sandbox updates",
    "New fintech app launches in India (account aggregator, embedded finance)",
    "Digital lending guidelines and recent RBI circulars",
    "BNPL (Buy Now Pay Later) regulations in India",
    "UPI international payments and cross-border updates",
  ],
  tech: [
    "Indian developer tools and SaaS launches",
    "AI tools for Indian small businesses",
    "Web performance optimization for Indian users on slow networks",
    "Image compression standards and govt form submission requirements",
    "WhatsApp Business updates relevant to Indian shopkeepers",
  ],
};

function pickNewsTopic(category = null) {
  // If a category is provided (e.g., to align with the next tool to be
  // covered), pick within that pool. Otherwise pick from any pool weighted
  // toward finance/tax (those rank best for SabTools' niche).
  const weightedCategories = [
    "finance",
    "finance",
    "finance",
    "tax",
    "tax",
    "banking",
    "banking",
    "fintech",
    "tech",
  ];
  const cat = category || weightedCategories[Math.floor(Math.random() * weightedCategories.length)];
  const topics = NEWS_TOPICS[cat] || NEWS_TOPICS.finance;
  return {
    category: cat,
    topic: topics[Math.floor(Math.random() * topics.length)],
  };
}

/**
 * Pick a SabTools tool that's contextually relevant to the news topic, so
 * the post can include one natural inbound link to our tool. The link is
 * the goal — every news post should drive at least one click to the
 * relevant calculator or utility.
 */
function pickRelevantTool(category, allTools) {
  const categoryToolMap = {
    finance: ["emi-calculator", "sip-calculator", "fd-calculator", "ppf-calculator", "compound-interest-calculator", "home-loan-calculator"],
    tax: ["income-tax-calculator", "hra-calculator", "salary-calculator", "gst-calculator"],
    banking: ["emi-calculator", "credit-card-emi-calculator", "loan-eligibility-calculator", "fd-calculator"],
    fintech: ["upi-qr-generator", "gst-calculator", "ifsc-finder"],
    tech: ["json-formatter", "image-compressor", "qr-code-generator", "password-generator"],
  };
  const candidates = categoryToolMap[category] || categoryToolMap.finance;
  for (const slug of candidates) {
    const t = allTools.find((tool) => tool.slug === slug);
    if (t) return t;
  }
  // Fallback: any tool in the category
  return allTools.find((t) => t.category === category) || allTools[0];
}

function buildSystemPrompt() {
  return `You are a senior writer for SabTools.in producing news, updates, and trend pieces for Indian readers. These posts cover real recent events — RBI rate changes, GST notifications, tax law updates, fintech launches, banking rate changes — and are grounded in actual web search results.

Your output must be journalistically credible. Every factual claim, every rate, every date must come from the web search results provided. Do not invent or extrapolate facts. If the search results are sparse on a topic, narrow the scope and cover what IS documented rather than padding with speculation.

# Hard requirements

1. **Ground every fact in search results.**
   - When stating a rate, date, or named event, the source must come from the web search results.
   - Use phrasing like "according to RBI's [specific publication date]" or "per the Ministry of Finance notification dated [date]" so readers can verify.
   - Cite sources naturally inline; you don't need a "Sources" footer.

2. **One natural link to a relevant SabTools tool.**
   - I'll provide one tool that's contextually relevant to the topic.
   - Include exactly one link to that tool, framed as a natural action the reader can take ("calculate the new EMI on your existing home loan with the [tool] →").
   - The link should appear in a paragraph where it genuinely helps — not shoehorned at the end.

3. **India-first context.**
   - Every post is for Indian readers — INR, lakhs/crores, FY 2025-26, Indian banks, Indian regulators (RBI, SEBI, IRDAI, CBDT).
   - Use real Indian states/cities for examples.

4. **Forbidden phrases — never use any of these:**
   - "In today's digital age...", "In today's fast-paced..."
   - "Whether you're a [X], [Y], or [Z]..."
   - "Lightning fast", "Game-changer", "Revolutionary"
   - "Stay ahead of the curve"
   - "We hope this update..."
   - "Look no further"

5. **Structure (vary per post).**
   - Headline-style opening — what's the news, in 1-2 sentences.
   - Why it matters for Indian readers — concrete impact.
   - The details — what changed, when, by how much.
   - Practical implications — what should an Indian reader DO about this.
   - Where to learn more or take action — the SabTools tool link goes here, framed as a tool to act on the change.

6. **No false urgency or clickbait.**
   - Don't write "BREAKING: RBI Slashes Repo Rate!" if the change is 25 basis points.
   - Don't write "This One Trick Will Save You Thousands" — Indian readers see through this.

# Output format

Return ONLY HTML body content. Use:
- <h2> for major sections (4-5 sections)
- <h3> for subsections
- <p> for paragraphs
- <ul> / <ol> with <li> for fact lists
- <strong> for key facts and numbers
- <a href="..."> for the SabTools tool link
- <a href="..." rel="noopener" target="_blank"> for external citation links

Word count: 1800-2200 words. Aim for ~2000.

Do not include the post title (h1).`;
}

function buildUserMessage(topic, category, relatedTool, allRelatedTools) {
  const otherToolsList = allRelatedTools
    .slice(0, 5)
    .map((t) => `- ${t.name} → /tools/${t.slug} — ${t.description}`)
    .join("\n");

  return `Write a 2000-word **news / trends post** for SabTools.in.

# Topic

${topic}

# Category

${category}

# Primary SabTools tool to link (mention once, naturally)

- Name: ${relatedTool.name}
- URL: /tools/${relatedTool.slug}
- What it does: ${relatedTool.description}

# Other SabTools tools available (use 1-2 if naturally relevant, max)

${otherToolsList}

# Instructions

1. **Use web search** to find real, recent (within the past 6-9 months) information about this topic. Search for specific terms — RBI press releases, Ministry of Finance notifications, news coverage, official announcements.
2. Ground every factual claim in what you find. Cite sources inline using <a href="..." rel="noopener" target="_blank"> tags.
3. Frame the post around what's happened, why it matters for Indian readers, and what they can do about it.
4. Include exactly ONE link to /tools/${relatedTool.slug} in a paragraph where it's a natural call to action.
5. Output 2000 words of HTML body content.

# India context for grounding (use as background, don't quote directly)

\`\`\`json
${JSON.stringify(indiaContext.common, null, 2)}
\`\`\`

Write the post now. Use web search liberally — at least 3-4 searches to ground the content properly.`;
}

async function composeNewsPostWithLLM(allTools) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY not set — cannot generate via LLM."
    );
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const { topic, category } = pickNewsTopic();
  const relatedTool = pickRelevantTool(category, allTools);
  const otherTools = allTools
    .filter((t) => t.category === relatedTool.category && t.slug !== relatedTool.slug)
    .slice(0, 5);

  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(topic, category, relatedTool, otherTools);

  console.log(
    `   [LLM-News] Topic: "${topic}" (${category}). Linking to: ${relatedTool.name}`
  );
  console.log(`   [LLM-News] Calling ${model} with web_search tool...`);

  // The web_search_20260209 tool runs server-side. Claude searches the web,
  // optionally filters results dynamically (built into this tool version),
  // and writes the post grounded in real sources. No client-side execution
  // needed — Anthropic handles the search loop.
  const stream = client.messages.stream({
    model,
    max_tokens: 16000, // higher for news posts because of search results in context + thinking
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    tools: [
      { type: "web_search_20260209", name: "web_search" },
    ],
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const message = await stream.finalMessage();

  // News posts may have multiple text blocks interleaved with server tool
  // use blocks. Concatenate the text blocks to get the final article body.
  const textBlocks = message.content.filter((b) => b.type === "text");
  if (textBlocks.length === 0) {
    throw new Error(
      `LLM returned no text blocks (stop_reason=${message.stop_reason}). Aborting.`
    );
  }

  // The last text block is typically the final article. Earlier text blocks
  // may be intermediate "let me search for X" / "based on these results"
  // commentary that isn't part of the article. Heuristic: pick the longest
  // text block as the article body.
  const articleBlock = textBlocks.reduce((longest, current) =>
    current.text.length > longest.text.length ? current : longest
  );

  const html = articleBlock.text.trim();
  const wordCount = countWords(html);

  console.log(
    `   [LLM-News] Generated ${wordCount} words from ${textBlocks.length} text blocks. Stop: ${message.stop_reason}.`
  );
  if (message.usage) {
    console.log(
      `   [LLM-News] Usage: input=${message.usage.input_tokens} output=${message.usage.output_tokens} cache_read=${message.usage.cache_read_input_tokens || 0}`
    );
  }

  const violations = lintForbiddenPhrases(html);
  if (violations.length > 0) {
    console.warn(`   [LLM-News] Quality warning: ${violations.join("; ")}`);
  }

  if (wordCount < 1200) {
    throw new Error(
      `News post too short (${wordCount} words, target ~2000). Aborting.`
    );
  }

  return {
    html,
    topic,
    category,
    relatedTool,
  };
}

module.exports = {
  composeNewsPostWithLLM,
  pickNewsTopic,
  pickRelevantTool,
};
