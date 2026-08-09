/**
 * "Benefits" Section (150-200 words)
 */

const categoryBenefits = {
  finance: [
    "Make informed financial decisions backed by accurate calculations",
    "Compare different loan/investment scenarios before committing",
    "Save lakhs of rupees by understanding interest rates and EMI breakdowns",
    "Plan your taxes and investments with confidence",
    "Results match what banks and NBFCs calculate — industry-standard formulas",
  ],
  math: [
    "Get instant answers without manual calculation errors",
    "Perfect for students preparing for exams (SSC, UPSC, Banking)",
    "Understand the step-by-step logic behind every calculation",
    "Save hours of manual work with automated computation",
  ],
  text: [
    "Process thousands of words in seconds",
    "Perfect for content writers, bloggers, and social media managers",
    "Ensure your content meets word count requirements",
    "Clean and format text for professional use",
  ],
  developer: [
    "Speed up your development workflow",
    "Validate and format code without installing extra software",
    "Test patterns and expressions in real-time",
    "Works offline once loaded — no internet dependency",
  ],
  image: [
    "Compress images without quality loss",
    "Meet exact size requirements for government forms and documents",
    "Process images locally — no privacy concerns",
    "Convert between formats instantly (PNG, JPG, WebP, AVIF)",
  ],
  default: [
    "Save time with instant, accurate results",
    "No software installation required",
    "Works on any device — mobile, tablet, or desktop",
    "100% free with no usage limits",
  ],
};

function generateBenefits(tool, keywords) {
  const benefits = categoryBenefits[tool.category] || categoryBenefits.default;
  const bulletHtml = benefits
    .map((b) => `<li>${b}</li>`)
    .join("\n          ");

  return `
    <h2>Benefits of Using ${tool.name}</h2>
    <p>Here's why thousands of Indians use ${tool.name} on SabTools.in every day:</p>
    <ul>
      ${bulletHtml}
    </ul>

    <p>Whether you're a student, working professional, business owner, or homemaker — ${tool.name} is designed to be simple enough for anyone to use, yet powerful enough for expert-level accuracy.</p>
  `;
}

module.exports = { generateBenefits };
