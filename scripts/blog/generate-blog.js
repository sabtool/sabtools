#!/usr/bin/env node

/**
 * Auto Blog Generator — Main Orchestrator
 * 1. Selects next tool to blog about
 * 2. Researches keywords (Google Autocomplete + pools)
 * 3. Generates 1200-1800 word SEO blog post
 * 4. Appends blog post to src/lib/blog.ts
 * 5. Writes current tool slug for screenshot step
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const BLOG_FILE = path.join(ROOT, "src", "lib", "blog.ts");
const CURRENT_TOOL_FILE = path.join(__dirname, ".current-tool.json");

const { selectTool, markAsBlogged, loadTools } = require("./select-tool");
const { getKeywordsForTool } = require("./keywords");
const {
  composeBlogPost,
  generateTitle,
  generateMetaDescription,
  calculateReadTime,
  generateBlogSlug,
  countWords,
} = require("./templates/composer");

// ─── Get related tools from same + adjacent categories ───
function getRelatedTools(tool, allTools) {
  // Same category tools (exclude self)
  const sameCategory = allTools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  // Popular tools from other categories
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
  };
  return map[category] || "Tools";
}

// ─── Append blog post to blog.ts ───
function appendBlogPost(post) {
  let content = fs.readFileSync(BLOG_FILE, "utf-8");

  // Escape backticks and ${} in blog content for template literal safety
  const safeContent = post.content
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  const safeDescription = post.description.replace(/"/g, '\\"');
  const safeTitle = post.title.replace(/"/g, '\\"');

  // Build the blog post object string
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

  // Find the end of the blogPosts array and insert before the closing ];
  // Check if last entry already has a trailing comma to avoid double commas
  const insertRegex = /,(\s*)\n\];/;
  const noCommaRegex = /}(\s*)\n\];/;

  if (content.match(insertRegex)) {
    // Already has trailing comma — just insert the new post
    content = content.replace(insertRegex, `,${postStr}\n];`);
  } else if (content.match(noCommaRegex)) {
    // No trailing comma — add one
    content = content.replace(noCommaRegex, `},${postStr}\n];`);
  } else {
    // Fallback: find last closing bracket
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

// ─── Main ───
async function main() {
  console.log("=== SabTools Auto Blog Generator ===");
  console.log("Time:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

  // 1. Select tool
  const tool = selectTool();
  if (!tool) {
    console.log("No tool available. Exiting.");
    process.exit(0);
  }
  console.log(`\n1. Selected tool: ${tool.name} (${tool.slug}) [${tool.category}]`);

  // 2. Research keywords
  console.log("\n2. Researching keywords...");
  const keywords = await getKeywordsForTool(tool);
  console.log(`   Found ${keywords.all.length} keywords`);
  console.log(`   Primary: "${keywords.primary}"`);
  console.log(`   Autocomplete: ${keywords.autocomplete.length} trending terms`);

  // 3. Get related tools for interlinks
  const allTools = loadTools();
  const relatedTools = getRelatedTools(tool, allTools);
  console.log(`\n3. Found ${relatedTools.length} related tools for interlinks`);

  // 4. Generate blog content
  console.log("\n4. Generating blog content...");
  const content = composeBlogPost(tool, keywords, relatedTools);
  const wordCount = countWords(content);
  console.log(`   Word count: ${wordCount}`);

  // 5. Build blog post object
  const blogSlug = generateBlogSlug(tool);
  const title = generateTitle(tool, keywords);
  const description = generateMetaDescription(tool, keywords);
  const readTime = calculateReadTime(content);
  const today = new Date().toISOString().split("T")[0];

  const post = {
    slug: blogSlug,
    title,
    description,
    content,
    date: today,
    category: getBlogCategory(tool.category),
    readTime,
    keywords: keywords.meta,
    toolSlug: tool.slug,
    image: {
      src: `/blog/${tool.slug}.webp`,
      alt: `${tool.name} — Free Online ${tool.description.split(".")[0]} Tool on SabTools.in`,
      width: 1200,
      height: 630,
    },
  };

  console.log(`\n5. Blog post ready:`);
  console.log(`   Title: ${post.title}`);
  console.log(`   Slug: ${post.slug}`);
  console.log(`   Words: ${wordCount}`);
  console.log(`   Keywords: ${post.keywords.join(", ")}`);
  console.log(`   Image: ${post.image.src}`);

  // 6. Append to blog.ts
  console.log("\n6. Writing to src/lib/blog.ts...");
  appendBlogPost(post);
  console.log("   Done!");

  // 7. Mark tool as blogged
  markAsBlogged(tool.slug, tool.category);
  console.log(`\n7. Marked ${tool.slug} as blogged`);

  // 8. Save current tool info for screenshot step
  fs.writeFileSync(
    CURRENT_TOOL_FILE,
    JSON.stringify({
      slug: tool.slug,
      name: tool.name,
      blogSlug: post.slug,
      category: tool.category,
    })
  );
  console.log("8. Saved tool info for screenshot step");

  console.log(`\n=== Blog post generated successfully! ===`);
  console.log(`URL will be: https://sabtools.in/blog/${post.slug}`);
}

main().catch((err) => {
  console.error("Blog generation failed:", err);
  process.exit(1);
});
