/**
 * LLM-powered blog content composer using Claude API.
 *
 * Replaces the deterministic template composer for genuinely unique content
 * per post — the previous template approach was being penalized by Google's
 * Helpful Content algorithm because every post had the same structural
 * fingerprint, the same opening phrases, and the same generic body language.
 *
 * Uses Claude Opus 4.7 with adaptive thinking and India-specific grounding
 * pulled from `india-context.json`. Each call is non-deterministic so 150
 * posts/month produce 150 distinct voices, structures, and example sets
 * even though the input tools are similar.
 *
 * Cost: ~$0.05-0.10 per 1500-word post. Cached system prompt (when within
 * 5-min TTL) drops repeated calls toward the lower bound.
 */

const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const CONTEXT_PATH = path.join(__dirname, "india-context.json");
const indiaContext = JSON.parse(fs.readFileSync(CONTEXT_PATH, "utf-8"));

/**
 * Build the system prompt — frozen across all generations so it stays
 * cacheable. India-specific guardrails live here, not in the user message,
 * so the model knows the requirements before seeing the tool details.
 */
function buildSystemPrompt() {
  return `You are a senior content writer for SabTools.in, India's largest free online tools platform. You write tool-specific guides for Indian readers — salaried professionals in Bangalore/Mumbai, small business owners, college students, freelancers, homemakers tracking budgets, first-time home loan applicants.

Your writing must be genuinely useful, not generic SEO filler. Every post you produce will compete on Google against established Indian sites (BankBazaar, ClearTax, Groww, ET Money) — so the bar is real expert prose, not template fills.

# Hard requirements

1. **India-first context, every paragraph.**
   - Use ₹ (not $), Indian comma grouping (₹1,00,000 not ₹100,000), lakhs/crores (not millions/billions).
   - Reference specific Indian banks (SBI, HDFC, ICICI, Axis, Kotak), regulators (RBI, SEBI, IRDAI), tax sections (80C, 80D, 80CCD, 24B), and government portals (Income Tax e-filing, NPS, EPFO, Aadhaar UIDAI) where relevant to the tool.
   - Mention specific Indian states/cities for examples (Pune, Bangalore, Delhi NCR, Hyderabad, Surat, Jaipur, Kota, etc.).
   - Use FY 2025-26 / AY 2026-27 dates and current rates from the context block I'll provide.

2. **Concrete examples with specific numbers.**
   - Don't write "calculate your EMI" — write "Riya from Pune wants a ₹50L home loan at 8.75% for 20 years; her EMI works out to ₹44,186 and total interest payable is ₹56.04L."
   - Don't write "save tax under 80C" — write "investing ₹1.5L in PPF + ELSS + LIC together exhausts your 80C limit and saves ₹46,800 in tax at the 30% slab."
   - Concrete numbers are the difference between expert prose and AI slop.

3. **Forbidden phrases — never use any of these:**
   - "In today's digital age..."
   - "Whether you're a [X], [Y], or [Z]..."
   - "Free online tool", "100% free", "no signup", "no registration" (overused)
   - "Save time and effort"
   - "It's part of SabTools.in's collection of 460+ free tools"
   - "People commonly search for..."
   - "Lightning fast"
   - "Game-changer", "revolutionary", "cutting-edge"
   - "Look no further"
   - Any "Whether you need X or Y, this tool has you covered" framing
   - "We hope this guide..."

4. **Vary structure per post.**
   - Don't follow the same H2 sequence every time.
   - Some posts open with a problem ("Most Indians underestimate their EMI burden..."). Others open with a fact ("RBI's repo rate sat at 5.50% through 2026..."). Others open with a scenario ("Last week a friend asked me how to calculate..."). Pick the angle that fits the specific tool.

5. **Internal interlinks.**
   - I'll provide a list of related tools with URLs. Weave 5-7 of them into the body naturally where they're contextually relevant.
   - Anchor text should be specific (e.g., "calculate your monthly EMI" linked to /tools/emi-calculator), not generic ("click here", "this tool").
   - Don't dump a "Related Tools" list at the end — that's templated. Integrate the links into the prose.

6. **The CTA.**
   - End with one clear sentence linking to the primary tool. Phrase it as something a reader would actually do: "Open the [tool name] →" or "Try the calculator with your own numbers →".

# Output format

Return ONLY HTML body content (no <html>, <head>, or <body> tags). Use these tags:
- <h2> for major sections (4-6 sections per post)
- <h3> for subsections (use sparingly)
- <p> for paragraphs
- <ul> / <ol> with <li> for lists
- <strong> for emphasis (Indian numbers, tax sections, key facts)
- <em> sparingly
- <a href="..."> for internal interlinks (use the URLs I provide; never invent URLs)

Word count: 1800-2200 words. Aim for ~2000. Quality over length — don't pad. If you can't reach 2000 words without filler, stop earlier; padded prose is worse for SEO than a tight 1700-word piece.

Do not include the post title (h1) — that's added separately. Start directly with the opening paragraph.

Do not include a "Frequently Asked Questions" section unless it's actually useful for this specific tool — generic FAQ blocks (Is it free? Is it safe? Does it work on mobile?) are templated and will hurt SEO. If you do include FAQ, write 3-4 questions that a real Indian user would actually search for about this specific tool.`;
}

/**
 * Build the user message for a specific blog post. Pulls in tool details,
 * keywords, related tools (with URLs), and category-specific India context.
 */
function buildUserMessage(tool, keywords, relatedTools) {
  const categoryContext =
    indiaContext[tool.category] || indiaContext.tools_general_indian_use_cases;
  const commonContext = indiaContext.common;

  const relatedToolsList = relatedTools
    .slice(0, 8)
    .map((t) => `- ${t.name} → /tools/${t.slug} — ${t.description}`)
    .join("\n");

  const keywordsList =
    keywords.all && keywords.all.length > 0
      ? keywords.all.slice(0, 8).join(", ")
      : tool.keywords?.slice(0, 6).join(", ") || tool.name.toLowerCase();

  return `Write a 2000-word guide about the **${tool.name}** tool on SabTools.in.

# Tool details
- Name: ${tool.name}
- URL: /tools/${tool.slug}
- Description: ${tool.description}
- Category: ${tool.category}
${tool.keywords ? `- Tool keywords: ${tool.keywords.join(", ")}` : ""}

# Target SEO keywords (weave naturally, don't keyword-stuff)
${keywordsList}

# Related tools available for interlinking (use 5-7 of these)
${relatedToolsList}

# India-specific context for this category

\`\`\`json
${JSON.stringify(categoryContext, null, 2)}
\`\`\`

# General India context (always relevant)

\`\`\`json
${JSON.stringify(commonContext, null, 2)}
\`\`\`

# Now write the post.

Open with a hook that's specific to this tool's actual use case in India — not a generic "in today's age" opener. Use real numbers, real bank names, real Indian scenarios. Vary your structure from any other guides you might write — pick H2 sections that fit *this* tool, not a fixed template.

Output: HTML body content only, ready to be inserted into a blog page. No title (h1).`;
}

/**
 * Lint the generated content for forbidden phrases. Returns an array of
 * detected anti-patterns; empty array = clean. Used as a soft check —
 * we log warnings rather than regenerating, since regeneration doubles
 * the cost and the writer-side prompt already forbids these.
 */
function lintForbiddenPhrases(html) {
  const forbidden = [
    "In today's digital age",
    "in today's digital age",
    "in today's fast-paced",
    "Whether you're a",
    "free online tool",
    "100% free",
    "Save time and effort",
    "It's part of SabTools.in's collection",
    "People commonly search",
    "Lightning fast",
    "Game-changer",
    "Look no further",
    "we hope this guide",
    "We hope you found",
    "no signup, no limits, no hidden",
    "no signup required",
  ];
  return forbidden.filter((phrase) =>
    html.toLowerCase().includes(phrase.toLowerCase())
  );
}

/**
 * Word-count helper — strips HTML tags before counting.
 */
function countWords(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Main entry point. Generates blog content via Claude API.
 *
 * @param {object} tool - { slug, name, description, category, keywords }
 * @param {object} keywords - { primary, all, meta, autocomplete }
 * @param {Array<object>} relatedTools - tools for interlinking
 * @returns {Promise<string>} HTML body content
 * @throws {Error} when the API call fails or generation is unusable
 */
async function composeBlogPostWithLLM(tool, keywords, relatedTools) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY not set — cannot generate via LLM. Set the env var or use template fallback."
    );
  }

  // Default model (claude-opus-4-7) is the recommended target for
  // intelligence-sensitive content writing. Adaptive thinking + effort:high
  // is the cost-quality sweet spot per Anthropic's guidance for this kind
  // of work. Override via ANTHROPIC_MODEL env var if cost is a concern
  // (e.g. ANTHROPIC_MODEL=claude-sonnet-4-6 cuts per-post cost ~50%).
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(tool, keywords, relatedTools);

  console.log(
    `   [LLM] Calling ${model} (input: ~${countWords(systemPrompt) + countWords(userMessage)} tokens)...`
  );

  // Stream and accumulate the final message — long outputs (1500+ words at
  // higher max_tokens) risk SDK HTTP timeouts when not streaming.
  const stream = client.messages.stream({
    model,
    max_tokens: 12000, // 2000 words ≈ 2700 tokens; 12K gives ample headroom for adaptive thinking + final output
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    system: [
      {
        type: "text",
        text: systemPrompt,
        // Cache the system prompt across runs in the same hour. Auto-blog
        // runs every ~5 hours so most calls miss the 5min default; the 1h
        // TTL covers the schedule when it bunches.
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const message = await stream.finalMessage();

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || !textBlock.text) {
    throw new Error(
      `LLM returned no text block (stop_reason=${message.stop_reason}). Aborting.`
    );
  }

  const html = textBlock.text.trim();
  const wordCount = countWords(html);

  console.log(
    `   [LLM] Generated ${wordCount} words. Stop reason: ${message.stop_reason}.`
  );
  if (message.usage) {
    console.log(
      `   [LLM] Usage: input=${message.usage.input_tokens} output=${message.usage.output_tokens} cache_read=${message.usage.cache_read_input_tokens || 0}`
    );
  }

  // Soft guardrail — log forbidden phrases that slipped through. Don't
  // regenerate (doubles the cost); the system prompt should keep these
  // rare, and a manual editorial pass can catch the few that escape.
  const violations = lintForbiddenPhrases(html);
  if (violations.length > 0) {
    console.warn(
      `   [LLM] Quality warning: forbidden phrases detected: ${violations.join("; ")}`
    );
  }

  // Word count guardrail — refuse posts that are too short (under 1200
  // words is below Google's "thin content" threshold for substantial guides).
  if (wordCount < 1200) {
    throw new Error(
      `LLM output too short (${wordCount} words, target ~2000). Refusing to publish — manually investigate.`
    );
  }

  return html;
}

module.exports = {
  composeBlogPostWithLLM,
  lintForbiddenPhrases,
  countWords,
};
