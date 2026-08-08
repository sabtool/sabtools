#!/usr/bin/env node

/**
 * Tool Selector for Auto-Blogging
 * Picks the next tool to blog about, avoiding duplicates and rotating categories
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const HISTORY_FILE = path.join(__dirname, "blog-history.json");
const TOOLS_FILE = path.join(ROOT, "src", "lib", "tools.ts");

// ─── Load blog history ───
function loadHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
    } catch {
      return { bloggedTools: [], lastCategory: null, totalPosts: 0 };
    }
  }
  return { bloggedTools: [], lastCategory: null, totalPosts: 0 };
}

// ─── Save blog history ───
function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// ─── Extract tools from tools.ts ───
function loadTools() {
  const content = fs.readFileSync(TOOLS_FILE, "utf-8");

  // Extract tool objects from the tools array
  const tools = [];
  const regex = /\{\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*icon:\s*"([^"]+)",\s*keywords:\s*\[([^\]]*)\]/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const keywords = match[6]
      // Strip `// comment` annotation lines that appear inside some
      // keywords arrays in tools.ts. Without this, the raw comment text
      // gets embedded into blog.ts as a broken multi-line string literal
      // and the whole site build fails (this has bitten us three times).
      .split("\n")
      .map((line) => line.replace(/\s*\/\/.*$/, ""))
      .join(" ")
      .split(",")
      .map((k) => k.trim().replace(/"/g, ""))
      .filter(Boolean);

    tools.push({
      name: match[1],
      slug: match[2],
      description: match[3],
      category: match[4],
      icon: match[5],
      keywords,
    });
  }

  if (tools.length === 0) {
    console.warn("WARNING: loadTools() returned 0 tools. Check that src/lib/tools.ts exists and has the expected format.");
  }

  return tools;
}

// ─── Also check existing blog posts to avoid duplicates ───
function getExistingBlogToolSlugs() {
  const blogFile = path.join(ROOT, "src", "lib", "blog.ts");
  if (!fs.existsSync(blogFile)) return [];

  const content = fs.readFileSync(blogFile, "utf-8");
  const slugs = [];

  // Match toolSlug fields
  const toolSlugRegex = /toolSlug:\s*"([^"]+)"/g;
  let m;
  while ((m = toolSlugRegex.exec(content)) !== null) {
    slugs.push(m[1]);
  }

  // Also match slugs from existing blog posts about tools
  const blogSlugRegex = /slug:\s*"([^"]+)"/g;
  while ((m = blogSlugRegex.exec(content)) !== null) {
    // Extract tool slug from blog slug patterns like "how-to-calculate-emi-home-loan-india"
    slugs.push(m[1]);
  }

  return slugs;
}

// ─── Priority tools (high-traffic, blog first) ───
const prioritySlugs = [
  "emi-calculator", "sip-calculator", "gst-calculator", "income-tax-calculator",
  "age-calculator", "percentage-calculator", "salary-calculator", "bmi-calculator",
  "word-counter", "json-formatter", "image-compressor", "fd-calculator",
  "ppf-calculator", "home-loan-calculator", "compound-interest-calculator",
  "currency-converter", "password-generator", "qr-code-generator",
  "love-calculator", "pdf-to-image",
];

// ─── Select next tool ───
function selectTool() {
  const history = loadHistory();
  const tools = loadTools();
  const existingBlogSlugs = getExistingBlogToolSlugs();

  const alreadyBlogged = new Set([...history.bloggedTools, ...existingBlogSlugs]);

  // Get available tools (not yet blogged)
  const available = tools.filter((t) => !alreadyBlogged.has(t.slug));

  if (available.length === 0) {
    console.log("All tools have been blogged! Switching to update mode.");
    // Pick oldest blogged tool for an updated guide
    const oldestSlug = history.bloggedTools[0] || prioritySlugs[0];
    const tool = tools.find((t) => t.slug === oldestSlug);
    if (tool) {
      tool._isUpdate = true;
      return tool;
    }
    return null;
  }

  // Priority: unblogged priority tools first
  const priorityAvailable = available.filter((t) => prioritySlugs.includes(t.slug));
  if (priorityAvailable.length > 0) {
    // Rotate categories to avoid consecutive same-category posts
    const lastCat = history.lastCategory;
    const diffCategory = priorityAvailable.filter((t) => t.category !== lastCat);
    const pick = diffCategory.length > 0 ? diffCategory[0] : priorityAvailable[0];
    return pick;
  }

  // Otherwise pick from available, rotating categories
  const lastCat = history.lastCategory;
  const categories = [...new Set(available.map((t) => t.category))];
  const nextCatOptions = categories.filter((c) => c !== lastCat);
  const nextCat = nextCatOptions.length > 0
    ? nextCatOptions[Math.floor(Math.random() * nextCatOptions.length)]
    : categories[0];

  const catTools = available.filter((t) => t.category === nextCat);
  return catTools[Math.floor(Math.random() * catTools.length)];
}

// ─── Mark tool as blogged ───
function markAsBlogged(slug, category) {
  const history = loadHistory();
  if (!history.bloggedTools.includes(slug)) {
    history.bloggedTools.push(slug);
  }
  history.lastCategory = category;
  history.totalPosts = (history.totalPosts || 0) + 1;
  history.lastRun = new Date().toISOString();
  saveHistory(history);
}

module.exports = { selectTool, markAsBlogged, loadTools, loadHistory };

// Run directly
if (require.main === module) {
  const tool = selectTool();
  if (tool) {
    console.log(`Selected: ${tool.name} (${tool.slug}) [${tool.category}]`);
    console.log(`Keywords: ${tool.keywords.join(", ")}`);
  } else {
    console.log("No tool available to blog about.");
  }
}
