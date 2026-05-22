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

const {
  lintForbiddenPhrases,
  countWords,
  thinkingParamsFor,
} = require("./llm-composer");

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

# Output format and structure

Return ONLY HTML body content. Use:
- <h2> for major sections (4-5 sections)
- <h3> for subsections
- <p> for paragraphs
- <ul> / <ol> with <li> for fact lists
- <strong> for key facts and numbers
- <a href="..."> for the SabTools tool link
- <a href="..." rel="noopener" target="_blank"> for external citation links

Word count: 1500-2000 words.

Do not include the post title (h1).

# CRITICAL: How to deliver the final article

You will use web search several times to ground this article in real recent
events. That's expected. But after your final search, when you start writing
the actual article, **write the complete article as ONE single continuous
response**. Do not break it into pieces with brief commentary between
paragraphs. Do not write "let me also add..." between sections. Compose all
sections in a single continuous output starting with <h2> and continuing
through to the final paragraph. Treat the article as a single deliverable,
not a series of incremental drafts.

If you find yourself wanting to search for more information mid-article,
search BEFORE you start writing the article body, not during.`;
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

  // The web search tool runs server-side. Claude searches the web, writes
  // the post grounded in real sources, and Anthropic handles the search
  // loop — no client-side execution needed.
  //
  // Tool version is model-tier-gated: web_search_20260209's dynamic
  // filtering (Claude writes code to filter results before they hit the
  // context) is a Claude 4.6+ feature. Haiku 4.5 uses the older
  // web_search_20250305 — plain web search, no dynamic filtering.
  const webSearchTool = /haiku/i.test(model)
    ? { type: "web_search_20250305", name: "web_search" }
    : { type: "web_search_20260209", name: "web_search" };

  const stream = client.messages.stream({
    model,
    // News posts need substantially more output budget than tool guides.
    // Web search interleaves text + tool_use blocks across the response.
    // 24K is generous but well within Opus 4.7's 128K output cap.
    max_tokens: 24000,
    // Adaptive thinking + effort omitted on Haiku 4.5 (they 400 there).
    ...thinkingParamsFor(model),
    tools: [webSearchTool],
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

  // News posts come back as a sequence of interleaved blocks:
  //   text("Let me search...") → server_tool_use → web_search_tool_result →
  //   text("Based on results...") → server_tool_use → ... →
  //   text("Here's the final article body...")  ← the article we want
  //
  // The model's intermediate commentary blocks ("let me search X",
  // "the results show Y") appear BEFORE the last tool use; the final
  // composed article appears AFTER. So we collect every text block whose
  // index is greater than the index of the last tool_use / server_tool_use
  // block. This correctly handles the case where the article itself spans
  // several adjacent text blocks at the end of the response.
  let lastToolIndex = -1;
  message.content.forEach((block, idx) => {
    if (
      block.type === "tool_use" ||
      block.type === "server_tool_use" ||
      block.type === "web_search_tool_result"
    ) {
      lastToolIndex = idx;
    }
  });

  const articleTextBlocks = message.content
    .slice(lastToolIndex + 1)
    .filter((b) => b.type === "text");

  // Fallback: if no text blocks appeared after the last tool use (the model
  // ended mid-search or never called a tool), use ALL text blocks. This is
  // less precise — may include "let me search" commentary — but ensures we
  // have content to work with rather than failing outright.
  const allTextBlocks = message.content.filter((b) => b.type === "text");
  const sourceBlocks =
    articleTextBlocks.length > 0 ? articleTextBlocks : allTextBlocks;

  if (sourceBlocks.length === 0) {
    throw new Error(
      `LLM returned no text blocks (stop_reason=${message.stop_reason}). Aborting.`
    );
  }

  // Concatenate the article text blocks with a blank line between them. This
  // preserves the model's chosen paragraph structure and is safe against
  // missing trailing newlines on individual blocks.
  const html = sourceBlocks
    .map((b) => b.text)
    .join("\n\n")
    .trim();

  const wordCount = countWords(html);

  console.log(
    `   [LLM-News] Article assembled from ${sourceBlocks.length} text block(s) (of ${allTextBlocks.length} total in response). ${wordCount} words. Stop: ${message.stop_reason}.`
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

  // News posts have a lower word-count floor than tool guides. Web search
  // overhead (commentary blocks, tool I/O eating into the model's output
  // budget) means a 2000-word target may produce 800-1500 words of actual
  // article. Anything under 800 words is suspicious and worth aborting on.
  const NEWS_MIN_WORDS = 800;
  if (wordCount < NEWS_MIN_WORDS) {
    throw new Error(
      `News post too short (${wordCount} words, minimum ${NEWS_MIN_WORDS}). Aborting.`
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
