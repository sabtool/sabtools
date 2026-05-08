/**
 * Blog Content Composer
 * Assembles all template sections into a complete 1200-1800 word blog post
 */

const { generateIntro } = require("./intro");
const { generateWhatIs } = require("./what-is");
const { generateHowToUse } = require("./how-to-use");
const { generateFeatures } = require("./features");
const { generateBenefits } = require("./benefits");
const { generateTips } = require("./tips");
const { generateIndianContext } = require("./indian-context");
const { generateInterlinks } = require("./interlinks");
const { generateFaq } = require("./faq");
const { generateConclusion } = require("./conclusion");

function countWords(html) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function composeBlogPost(tool, keywords, relatedTools) {
  const year = new Date().getFullYear();

  // Generate all sections
  const sections = {
    intro: generateIntro(tool, keywords),
    whatIs: generateWhatIs(tool, keywords),
    howToUse: generateHowToUse(tool, keywords),
    features: generateFeatures(tool, keywords),
    benefits: generateBenefits(tool, keywords),
    tips: generateTips(tool, keywords),
    indianContext: generateIndianContext(tool, keywords),
    interlinks: generateInterlinks(tool, relatedTools, keywords),
    faq: generateFaq(tool, keywords),
    conclusion: generateConclusion(tool, keywords),
  };

  // Assemble in order
  let content = "";
  content += sections.intro;
  content += sections.whatIs;
  content += sections.howToUse;
  content += sections.features;
  content += sections.benefits;

  // Check word count — add optional sections if under 1200
  let wordCount = countWords(content);

  // Always include tips
  content += sections.tips;
  wordCount = countWords(content);

  // Add Indian context if still under target
  if (wordCount < 1400) {
    content += sections.indianContext;
    wordCount = countWords(content);
  }

  // Always include interlinks and FAQ
  content += sections.interlinks;
  content += sections.faq;
  content += sections.conclusion;

  wordCount = countWords(content);

  // If still under 1200, expand benefits and tips
  if (wordCount < 1200) {
    const extraParagraph = `<p>With over 497+ free tools available on SabTools.in, ${tool.name} is one of the most popular choices among Indian users. Whether you're a student, professional, or business owner, this tool helps you save time and get accurate results instantly. No registration, no fees — just open and use.</p>`;
    content = content.replace("</div><!-- end-conclusion -->", extraParagraph + "</div><!-- end-conclusion -->");
  }

  return content;
}

// ─── Generate SEO title (rotating patterns) ───
function generateTitle(tool, keywords) {
  const year = new Date().getFullYear();
  const patterns = [
    `${tool.name} Online Free — Complete Guide (${year})`,
    `How to Use ${tool.name} Online — Step-by-Step Guide`,
    `${tool.name} — Free Online Tool | Features, Tips & FAQ`,
    `Best Free ${tool.name} Online for India (${year})`,
    `${tool.name} Guide — How It Works, Tips & Benefits`,
    `Free ${tool.name} Online — No Signup Required | SabTools`,
  ];

  // Rotate based on hash of slug for consistency
  const hash = tool.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return patterns[hash % patterns.length];
}

// ─── Generate meta description (150-160 chars) ───
function generateMetaDescription(tool, keywords) {
  const year = new Date().getFullYear();
  const templates = [
    `Use ${tool.name} online for free — ${tool.description.toLowerCase()}. No signup, instant results. Made for India. Try now on SabTools.in!`,
    `Free ${tool.name} online — ${tool.description.toLowerCase()}. Step-by-step guide with tips. 100% free, works on mobile. ${year} updated.`,
    `${tool.description}. Use our free ${tool.name.toLowerCase()} with no signup. Instant results on any device. Made for India.`,
  ];
  const hash = tool.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const desc = templates[hash % templates.length];
  return desc.length > 160 ? desc.substring(0, 157) + "..." : desc;
}

// ─── Calculate read time ───
function calculateReadTime(content) {
  const words = countWords(content);
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// ─── Generate blog slug from tool ───
function generateBlogSlug(tool) {
  return `${tool.slug}-guide-${new Date().getFullYear()}`;
}

module.exports = {
  composeBlogPost,
  generateTitle,
  generateMetaDescription,
  calculateReadTime,
  generateBlogSlug,
  countWords,
};
