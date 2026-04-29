/**
 * LLM-powered comparison post composer (Type B).
 *
 * Generates "SabTools.in vs [competitor]" or "Best free [tool] in India 2026"
 * style posts. These rank for high-intent buying-decision queries that pure
 * tool guides don't capture (e.g. "best EMI calculator India", "ClearTax vs
 * SabTools income tax calculator", etc.).
 *
 * External links to competitors are intentional — Google's quality raters
 * specifically look for whether a site links to credible references vs
 * acting like a closed content farm. Linking to BankBazaar, ClearTax, Groww
 * with their real URLs *helps* SEO when our own positioning is honest.
 *
 * Cost: same as tool-guide composer (~$0.05-0.10 per 2000-word post).
 */

const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const COMPETITORS_PATH = path.join(__dirname, "competitors.json");
const INDIA_CONTEXT_PATH = path.join(__dirname, "india-context.json");
const competitorsData = JSON.parse(
  fs.readFileSync(COMPETITORS_PATH, "utf-8")
);
const indiaContext = JSON.parse(fs.readFileSync(INDIA_CONTEXT_PATH, "utf-8"));

const { lintForbiddenPhrases, countWords } = require("./llm-composer");

/**
 * Get the competitor list for a tool's category. Falls back to the default
 * (broader tool aggregators) when the category has no dedicated competitors.
 */
function getCompetitorsForCategory(category) {
  return (
    competitorsData.categories[category]?.competitors ||
    competitorsData.categories.default.competitors
  );
}

function buildSystemPrompt() {
  return `You are a senior content writer for SabTools.in writing comparison-style guides for Indian readers. These posts target high-intent search queries like "best free EMI calculator India 2026", "BankBazaar vs Groww EMI calculator", "ClearTax vs SabTools tax calculator", "best free SIP calculator no signup".

Comparison posts rank because they capture buying-decision searches that pure tool guides miss. Done well, they also build SabTools.in's authority by referencing competitors honestly with external links.

# Hard requirements

1. **Honest, evidence-based comparisons.**
   - Don't make up competitor features or limitations.
   - Use the competitor data I provide — strengths AND weaknesses are listed there. Mention both honestly.
   - Place SabTools advantageously where it genuinely wins (privacy, no signup, Indian format support, no ad walls on tools), not by slandering competitors.
   - Google's quality raters specifically look for biased puff pieces vs honest comparisons. Honest ones rank better long-term.

2. **External links to competitors — yes, link to them.**
   - When you mention a competitor, link to their actual tool URL using the URLs I provide.
   - This signals to Google that we're a credible reference site, not a closed content farm.
   - External links flow PageRank to competitors in tiny amounts but build domain trust enormously.
   - Use \`<a href="..." rel="noopener" target="_blank">\` for external links.

3. **India-first context.**
   - Write specifically for Indian users — INR, lakhs/crores, RBI rates, Indian banks (SBI, HDFC, ICICI, Axis, Kotak), tax sections (80C, 80D), Indian regulators.
   - Reference current FY 2025-26 / AY 2026-27 dates.
   - Acknowledge Indian-specific needs (govt form image sizes, GST format, Aadhaar/PAN validation, NCERT/CBSE for education, etc.)

4. **Concrete examples with specific numbers.**
   - Don't write "calculate your EMI" — write "Riya's ₹50L home loan at 8.75% / 20 years — EMI ₹44,186 on SabTools matches what BankBazaar's calculator returns."
   - When comparing accuracy, use actual matching scenarios.

5. **Forbidden phrases — never use any of these:**
   - "In today's digital age..."
   - "Whether you're a [X], [Y], or [Z]..."
   - "Lightning fast", "Game-changer", "Revolutionary"
   - "Look no further"
   - "100% free, no signup, no ads" used more than once (it gets repetitive)
   - "We hope this guide..."
   - Any "Whether you're an A, B, or C, this tool has you covered" framing

6. **Structure (vary per post; don't follow this exactly).**
   - Open with the core comparison question — what is the user actually deciding between?
   - Quick verdict (1-2 sentences) — give the answer upfront, then explain.
   - Side-by-side comparison — feature/criterion based, with concrete details (no vague "better", "faster").
   - Where each option wins — be honest about trade-offs.
   - Pricing / accessibility differences (signups, paid tiers, ad walls).
   - Privacy & data handling (this is where SabTools genuinely wins — calls out are appropriate but not gloating).
   - Bottom line / final recommendation — when each tool is the right choice.

7. **The CTA.**
   - End with one clear sentence linking to the SabTools tool. Phrase it as the natural next action ("Try SabTools' [tool] →") not a hard sell.

# Output format

Return ONLY HTML body content. Use:
- <h2> for major sections (5-7 sections total)
- <h3> for subsections
- <p> for paragraphs
- <ul> / <ol> with <li> for comparison points
- <strong> for emphasis (key facts, prices, numbers)
- <a href="..."> for internal links to /tools/{slug}
- <a href="..." rel="noopener" target="_blank"> for external competitor links

Word count: 1800-2200 words. Aim for ~2000.

Do not include the post title (h1) — added separately.

Do not include a generic FAQ block. If there are real high-intent questions specific to the comparison ("Which is better for SBI home loan EMI: BankBazaar or SabTools?"), a tight 3-question FAQ is fine. Generic "Is SabTools free?" / "Does it work on mobile?" is templated and hurts SEO.`;
}

function buildUserMessage(tool, keywords, relatedTools) {
  const competitors = getCompetitorsForCategory(tool.category).slice(0, 4);
  const sabtoolsFeatures = competitorsData.sabtools_distinguishing_features;
  const principles = competitorsData._meta.comparison_principles;

  const relatedToolsList = relatedTools
    .slice(0, 6)
    .map((t) => `- ${t.name} → /tools/${t.slug} — ${t.description}`)
    .join("\n");

  const keywordsList =
    keywords.all && keywords.all.length > 0
      ? keywords.all.slice(0, 8).join(", ")
      : tool.keywords?.slice(0, 6).join(", ") || tool.name.toLowerCase();

  return `Write a 2000-word **comparison post** for SabTools.in about the **${tool.name}** category.

# The angle

Pick ONE of these comparison angles based on what fits this tool best — choose, don't list:
- "Best free [tool] in India 2026" (compare SabTools to top 3-4 competitors)
- "SabTools vs [top competitor]: [tool] comparison" (head-to-head deep dive)
- "[Tool] tools compared: SabTools, [competitor 1], [competitor 2]" (round-up)

# Tool details

- Tool name: ${tool.name}
- SabTools URL: /tools/${tool.slug}
- Description: ${tool.description}
- Category: ${tool.category}
${tool.keywords ? `- Tool keywords: ${tool.keywords.join(", ")}` : ""}

# Target SEO keywords

${keywordsList}

# Competitors to cover (use real URLs from this list — don't invent URLs)

\`\`\`json
${JSON.stringify(competitors, null, 2)}
\`\`\`

# SabTools' genuine differentiators (mention 3-4 across the post, not all in one paragraph)

${sabtoolsFeatures.map((f) => `- ${f}`).join("\n")}

# Comparison principles (apply throughout)

${principles.map((p) => `- ${p}`).join("\n")}

# Related SabTools tools for internal interlinking (use 3-4 in the body)

${relatedToolsList}

# India context for grounding

\`\`\`json
${JSON.stringify(indiaContext.common, null, 2)}
\`\`\`

# Now write the post.

Open with the actual decision the reader is trying to make ("If you're picking between SabTools and BankBazaar for your home loan EMI math..."). Give a quick verdict in the first 2 paragraphs, then justify it with real comparisons. Use the competitor URLs as external links. Place SabTools advantageously without lying. End with a clear CTA linking to /tools/${tool.slug}.

Output: HTML body content only.`;
}

async function composeComparisonPostWithLLM(tool, keywords, relatedTools) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY not set — cannot generate via LLM."
    );
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(tool, keywords, relatedTools);

  console.log(
    `   [LLM-Comparison] Calling ${model} for ${tool.name} comparison post...`
  );

  const stream = client.messages.stream({
    model,
    max_tokens: 12000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
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

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || !textBlock.text) {
    throw new Error(
      `LLM returned no text block (stop_reason=${message.stop_reason}).`
    );
  }

  const html = textBlock.text.trim();
  const wordCount = countWords(html);

  console.log(
    `   [LLM-Comparison] Generated ${wordCount} words. Stop: ${message.stop_reason}.`
  );
  if (message.usage) {
    console.log(
      `   [LLM-Comparison] Usage: input=${message.usage.input_tokens} output=${message.usage.output_tokens} cache_read=${message.usage.cache_read_input_tokens || 0}`
    );
  }

  const violations = lintForbiddenPhrases(html);
  if (violations.length > 0) {
    console.warn(
      `   [LLM-Comparison] Quality warning: ${violations.join("; ")}`
    );
  }

  if (wordCount < 1200) {
    throw new Error(
      `Comparison post too short (${wordCount} words, target ~2000). Aborting.`
    );
  }

  return html;
}

module.exports = {
  composeComparisonPostWithLLM,
};
