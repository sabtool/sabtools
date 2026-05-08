/**
 * "What is {Tool}?" Section (150-200 words)
 */

function generateWhatIs(tool, keywords) {
  const kw = keywords.all || [];
  const kwMention = kw.length > 2 ? kw.slice(0, 3).join(", ") : tool.name.toLowerCase();

  const categoryContext = {
    finance: `This tool follows Indian financial standards and supports INR formatting, making it perfect for Indian banks and NBFCs like SBI, HDFC, ICICI, and Axis Bank.`,
    math: `It handles calculations with high precision — up to 10 decimal places — making it suitable for students, teachers, and professionals.`,
    text: `It supports English, Hindi, and other Indian languages, making it ideal for content creators, bloggers, and students in India.`,
    developer: `Built for web developers and software engineers, it processes data instantly in your browser with zero server calls.`,
    image: `It processes images entirely in your browser — your files never leave your device, ensuring 100% privacy and security.`,
    health: `The calculations follow WHO and ICMR guidelines, providing medically-informed results you can trust.`,
    tax: `Updated for the latest Indian tax rules and brackets, including both Old and New tax regimes for FY 2025-26.`,
    seo: `Designed for digital marketers and website owners who want to improve their search engine rankings.`,
    default: `It runs entirely in your browser — your data stays on your device, and results are instant.`,
  };

  const context = categoryContext[tool.category] || categoryContext.default;

  return `
    <h2>What is ${tool.name}?</h2>
    <p>${tool.name} is a free online tool that helps you ${tool.description.toLowerCase()}. It's part of SabTools.in's collection of 497+ free tools designed for Indian users. People commonly search for ${kwMention} when they need this type of tool.</p>

    <p>${context}</p>

    <p>Unlike many other tools that require registration or charge fees, ${tool.name} on SabTools.in is <strong>100% free</strong>, works on <strong>any device</strong> (mobile, tablet, desktop), and delivers <strong>instant results</strong> without any server processing delays.</p>
  `;
}

module.exports = { generateWhatIs };
