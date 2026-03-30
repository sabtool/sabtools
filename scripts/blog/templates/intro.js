/**
 * Blog Introduction Section (100-150 words)
 */

const openingPhrases = {
  finance: [
    "Managing your money wisely is the key to financial freedom.",
    "Financial planning starts with the right calculations.",
    "Smart money decisions begin with accurate numbers.",
    "In today's economy, every rupee matters.",
  ],
  math: [
    "Numbers are part of everyday life.",
    "Quick calculations save time and prevent mistakes.",
    "Whether it's school, work, or daily tasks — math is everywhere.",
  ],
  text: [
    "Words are the building blocks of communication.",
    "Content creation demands the right tools.",
    "Whether you're a writer, student, or professional — text tools help.",
  ],
  developer: [
    "Developers need fast, reliable tools.",
    "Clean code starts with clean formatting.",
    "Every developer knows the value of good utilities.",
  ],
  image: [
    "Images speak louder than words.",
    "In the digital age, image optimization is essential.",
    "From websites to government forms — image tools are a necessity.",
  ],
  default: [
    "The right tool makes all the difference.",
    "Save time with the right online tool.",
    "Free online tools are changing how we work.",
  ],
};

function generateIntro(tool, keywords) {
  const phrases = openingPhrases[tool.category] || openingPhrases.default;
  const hash = tool.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const opener = phrases[hash % phrases.length];
  const primary = keywords.primary || tool.name.toLowerCase();

  return `
    <p>${opener} If you're looking for a reliable <strong>${primary}</strong>, you've come to the right place. <a href="/tools/${tool.slug}">${tool.name}</a> on SabTools.in is a powerful, free online tool that helps you ${tool.description.toLowerCase()}. It works instantly in your browser — no downloads, no signups, no fees.</p>

    <p>In this complete guide, we'll show you everything about ${tool.name} — how it works, key features, step-by-step instructions, expert tips, and answers to frequently asked questions. Whether you're in India or anywhere else, this tool is built to save you time and deliver accurate results.</p>
  `;
}

module.exports = { generateIntro };
