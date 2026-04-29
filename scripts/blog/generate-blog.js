#!/usr/bin/env node

/**
 * Auto Blog Generator — Main Orchestrator
 *
 * Dispatches one of three post types based on the BLOG_TYPE environment
 * variable, set by the GitHub Actions workflow:
 *
 *   - BLOG_TYPE=tool        → tool-specific guide (composer: llm-composer.js)
 *   - BLOG_TYPE=comparison  → competitor comparison (composer: comparison-composer.js)
 *   - BLOG_TYPE=news        → news/trends post with web search (composer: news-composer.js)
 *
 * If BLOG_TYPE is unset, defaults to "tool" for backward compatibility.
 *
 * Adds a random 0-90 minute sleep at script start so actual publish times
 * vary day-to-day even though cron triggers are at fixed UTC times. This
 * is a softer freshness/quality signal than fixed-cadence publishing.
 *
 * Falls back to template-based composition (deterministic, no API cost)
 * when ANTHROPIC_API_KEY is not set — useful for local testing.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const BLOG_FILE = path.join(ROOT, "src", "lib", "blog.ts");
const CURRENT_TOOL_FILE = path.join(__dirname, ".current-tool.json");

const { selectTool, markAsBlogged, loadTools } = require("./select-tool");
const { getKeywordsForTool } = require("./keywords");
const {
  composeBlogPost: templateComposeBlogPost,
  generateTitle,
  generateMetaDescription,
  calculateReadTime,
  generateBlogSlug,
  countWords,
} = require("./templates/composer");

const { composeBlogPostWithLLM } = require("./llm-composer");
const { composeComparisonPostWithLLM } = require("./comparison-composer");
const { composeNewsPostWithLLM } = require("./news-composer");

// ─── Get related tools from same + adjacent categories ───
function getRelatedTools(tool, allTools) {
  const sameCategory = allTools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const popularSlugs = [
    "emi-calculator", "sip-calculator", "gst-calculator", "age-calculator",
    "word-counter", "json-formatter", "image-compressor", "percentage-calculator",
  ];
  const otherCategory = allTools
    .filter((t) => t.category !== tool.category && popularSlugs.includes(t.slug))
    .slice(0, 4);

  return [...sameCategory, ...otherCategory].slice(0, 8);
}

// ─── Map category to blog category name ───
function getBlogCategory(category) {
  const map = {
    finance: "Finance",
    math: "Math",
    text: "Text Tools",
    developer: "Developer",
    image: "Image",
    seo: "SEO",
    health: "Health",
    tax: "Tax & Salary",
    converters: "Converters",
    security: "Security",
    pdf: "PDF",
    social: "Social Media",
    education: "Education",
    business: "Business",
    css: "CSS & Design",
    fun: "Fun & Utility",
    realestate: "Real Estate",
    electrical: "Electrical",
    cooking: "Cooking",
    wedding: "Wedding",
    agriculture: "Agriculture",
    exam: "Exam",
    vehicle: "Vehicle",
    astrology: "Astrology",
    legal: "Legal",
    ai: "AI Writing",
    science: "Science",
    construction: "Construction",
    charts: "Data & Charts",
    career: "Career",
    shopping: "Shopping",
    student: "Student",
    indiaguide: "India Guide",
    datetime: "Date & Time",
    whatsapp: "WhatsApp & UPI",
    data: "Data Tools",
    utility: "Everyday Utility",
    banking: "Banking",
    fintech: "Fintech",
    tech: "Tech Updates",
    news: "News & Updates",
  };
  return map[category] || "Tools";
}

// ─── Append blog post to blog.ts ───
function appendBlogPost(post) {
  let content = fs.readFileSync(BLOG_FILE, "utf-8");

  const safeContent = post.content
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  const safeDescription = post.description.replace(/"/g, '\\"');
  const safeTitle = post.title.replace(/"/g, '\\"');

  const postStr = `
  {
    slug: "${post.slug}",
    title: "${safeTitle}",
    description: "${safeDescription}",
    date: "${post.date}",
    category: "${post.category}",
    readTime: "${post.readTime}",
    keywords: [${post.keywords.map((k) => `"${k.replace(/"/g, '\\"')}"`).join(", ")}],
    toolSlug: "${post.toolSlug}",
    image: {
      src: "${post.image.src}",
      alt: "${post.image.alt.replace(/"/g, '\\"')}",
      width: ${post.image.width},
      height: ${post.image.height},
    },
    content: \`${safeContent}\`,
  }`;

  const insertRegex = /,(\s*)\n\];/;
  const noCommaRegex = /}(\s*)\n\];/;
  const emptyArrayRegex = /\[\s*\];/;

  if (content.match(insertRegex)) {
    content = content.replace(insertRegex, `,${postStr}\n];`);
  } else if (content.match(noCommaRegex)) {
    content = content.replace(noCommaRegex, `},${postStr}\n];`);
  } else if (content.match(emptyArrayRegex)) {
    content = content.replace(emptyArrayRegex, `[${postStr}\n];`);
  } else {
    const lastBracket = content.lastIndexOf("];");
    if (lastBracket !== -1) {
      content =
        content.substring(0, lastBracket) +
        `,${postStr}\n];` +
        content.substring(lastBracket + 2);
    }
  }

  fs.writeFileSync(BLOG_FILE, content);
}

// ─── Random sleep at start (0-90 min) — varies actual publish time per cron run ───
async function applyTimingJitter() {
  // Skip jitter when DISABLE_BLOG_JITTER=1 (manual runs / debugging).
  if (process.env.DISABLE_BLOG_JITTER === "1") {
    console.log("Timing jitter disabled (DISABLE_BLOG_JITTER=1)");
    return;
  }
  const maxMinutes = 90;
  const jitterMinutes = Math.floor(Math.random() * maxMinutes);
  const jitterMs = jitterMinutes * 60 * 1000;
  console.log(
    `Random timing jitter: sleeping ${jitterMinutes} minutes before generating (cron ran at fixed time, post will publish later)...`
  );
  await new Promise((resolve) => setTimeout(resolve, jitterMs));
  console.log("Jitter complete. Proceeding with generation.\n");
}

// ─── Title generators for non-tool post types ───
function generateComparisonTitle(tool) {
  const year = new Date().getFullYear();
  const patterns = [
    `Best Free ${tool.name} in India ${year} — Tools Compared`,
    `${tool.name}: SabTools vs BankBazaar vs ClearTax — Honest Comparison (${year})`,
    `${tool.name} Comparison ${year}: Which Free Tool Wins for Indian Users?`,
    `SabTools vs Top ${tool.name} Alternatives — ${year} Review`,
  ];
  const hash = tool.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return patterns[hash % patterns.length];
}

function generateNewsTitle(topic, category) {
  // News titles are derived from the actual topic, not patterned. We trim
  // and prefix with the year for freshness signal.
  const year = new Date().getFullYear();
  const trimmed = topic.length > 70 ? topic.substring(0, 67) + "..." : topic;
  return `${trimmed} (${year} Update)`;
}

// ─── Main ───
async function main() {
  const blogType = process.env.BLOG_TYPE || "tool";
  console.log("=== SabTools Auto Blog Generator ===");
  console.log("Type:", blogType);
  console.log(
    "Time:",
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  );

  // 0. Random timing jitter so publish times vary day-to-day.
  await applyTimingJitter();

  // 1. Dispatch based on type.
  let post;
  if (blogType === "comparison") {
    post = await generateComparisonPost();
  } else if (blogType === "news") {
    post = await generateNewsPost();
  } else {
    post = await generateToolGuidePost();
  }

  if (!post) {
    console.log("Generation aborted (no post produced). Exiting.");
    process.exit(0);
  }

  // 2. Append to blog.ts
  console.log("\nWriting to src/lib/blog.ts...");
  appendBlogPost(post);
  console.log("   Done.");

  // 3. Save current tool info for screenshot step (only for tool/comparison
  // posts that have a primary tool slug — news posts use a different image).
  fs.writeFileSync(
    CURRENT_TOOL_FILE,
    JSON.stringify({
      slug: post.toolSlug,
      name: post.title,
      blogSlug: post.slug,
      category: post.category,
      blogType,
    })
  );

  console.log(`\n=== Blog post generated successfully! ===`);
  console.log(`URL: https://sabtools.in/blog/${post.slug}`);
}

// ─── Type A: Tool guide ───
async function generateToolGuidePost() {
  const tool = selectTool();
  if (!tool) {
    console.log("No tool available for guide.");
    return null;
  }
  console.log(`\nSelected tool: ${tool.name} (${tool.slug}) [${tool.category}]`);

  const keywords = await getKeywordsForTool(tool);
  console.log(`Keywords: ${keywords.all.length} total, primary: "${keywords.primary}"`);

  const allTools = loadTools();
  const relatedTools = getRelatedTools(tool, allTools);
  console.log(`Related tools: ${relatedTools.length}`);

  // Try LLM composer first; fall back to template if API key missing or call fails.
  let content;
  let usedLLM = false;
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      content = await composeBlogPostWithLLM(tool, keywords, relatedTools);
      usedLLM = true;
    } catch (err) {
      console.warn(
        `LLM composition failed: ${err.message}. Falling back to template.`
      );
      content = templateComposeBlogPost(tool, keywords, relatedTools);
    }
  } else {
    console.log("ANTHROPIC_API_KEY not set — using template composer.");
    content = templateComposeBlogPost(tool, keywords, relatedTools);
  }
  const wordCount = countWords(content);
  console.log(`Generated ${wordCount} words (LLM: ${usedLLM})`);

  markAsBlogged(tool.slug, tool.category);

  return {
    slug: generateBlogSlug(tool),
    title: generateTitle(tool, keywords),
    description: generateMetaDescription(tool, keywords),
    content,
    date: new Date().toISOString().split("T")[0],
    category: getBlogCategory(tool.category),
    readTime: calculateReadTime(content),
    keywords: keywords.meta,
    toolSlug: tool.slug,
    image: {
      src: `/blog/${tool.slug}.webp`,
      alt: `${tool.name} — Free Online ${tool.description} Tool on SabTools.in`,
      width: 1200,
      height: 630,
    },
  };
}

// ─── Type B: Comparison post ───
async function generateComparisonPost() {
  const tool = selectTool();
  if (!tool) {
    console.log("No tool available for comparison.");
    return null;
  }
  console.log(`\nComparison post about: ${tool.name} (${tool.slug}) [${tool.category}]`);

  const keywords = await getKeywordsForTool(tool);
  const allTools = loadTools();
  const relatedTools = getRelatedTools(tool, allTools);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set — skipping comparison post (no template fallback).");
    return null;
  }

  const content = await composeComparisonPostWithLLM(tool, keywords, relatedTools);
  const wordCount = countWords(content);
  console.log(`Generated ${wordCount} words.`);

  markAsBlogged(tool.slug, tool.category);

  const year = new Date().getFullYear();
  const title = generateComparisonTitle(tool);
  const description = `Honest comparison of free ${tool.name} options in India for ${year} — features, accuracy, privacy, signup requirements. Picks the best for Indian users.`;

  return {
    slug: `${tool.slug}-comparison-${year}`,
    title,
    description: description.substring(0, 160),
    content,
    date: new Date().toISOString().split("T")[0],
    category: getBlogCategory(tool.category),
    readTime: calculateReadTime(content),
    keywords: [...keywords.meta, `best ${tool.name.toLowerCase()} india`, `${tool.name.toLowerCase()} comparison`, `free ${tool.name.toLowerCase()}`].slice(0, 10),
    toolSlug: tool.slug,
    image: {
      src: `/blog/${tool.slug}.webp`,
      alt: `${tool.name} comparison — SabTools vs other free Indian tools (${year})`,
      width: 1200,
      height: 630,
    },
  };
}

// ─── Type C: News / trends post ───
async function generateNewsPost() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set — skipping news post (web search requires API).");
    return null;
  }

  const allTools = loadTools();
  const result = await composeNewsPostWithLLM(allTools);
  const { html: content, topic, category, relatedTool } = result;
  const wordCount = countWords(content);
  console.log(`Generated ${wordCount} words.`);

  const year = new Date().getFullYear();
  const today = new Date();
  const dateSlug = today.toISOString().split("T")[0]; // YYYY-MM-DD

  // News posts have unique slugs based on date + topic to avoid collisions
  // when the same topic comes up multiple times in a year.
  const topicSlug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);

  const title = generateNewsTitle(topic, category);
  const description = `${topic} — what changed, what it means for Indian readers, and how to act on it. Updated ${year}.`;

  return {
    slug: `news-${dateSlug}-${topicSlug}`,
    title,
    description: description.substring(0, 160),
    content,
    date: dateSlug,
    category: getBlogCategory(category) || "News & Updates",
    readTime: calculateReadTime(content),
    keywords: [topic.split(" ").slice(0, 4).join(" "), `${category} news india ${year}`, `india ${year} update`].slice(0, 8),
    toolSlug: relatedTool.slug,
    image: {
      // News posts use the linked tool's hero (already generated by auto-blog
      // for prior tool-guide runs) or fall back to the brand banner.
      src: `/blog/${relatedTool.slug}.webp`,
      alt: `${title} — SabTools.in`,
      width: 1200,
      height: 630,
    },
  };
}

main().catch((err) => {
  console.error("Blog generation failed:", err);
  process.exit(1);
});
