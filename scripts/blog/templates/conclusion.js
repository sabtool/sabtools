/**
 * Conclusion + CTA Section (60-100 words)
 */

function generateConclusion(tool, keywords) {
  const year = new Date().getFullYear();

  return `
    <div><!-- end-conclusion -->
    <h2>Start Using ${tool.name} Now</h2>
    <p>${tool.name} on SabTools.in is the fastest, easiest, and most reliable way to ${tool.description.toLowerCase()}. It's free, private, works on any device, and requires zero signup. Join thousands of Indians who use this tool daily.</p>

    <p><strong><a href="/tools/${tool.slug}">Try ${tool.name} Free — No Signup Required →</a></strong></p>

    <p><em>Last updated: ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}. This guide is part of SabTools.in's ${year} tool guides series covering 497+ free online tools for India.</em></p>
    </div><!-- end-conclusion -->
  `;
}

module.exports = { generateConclusion };
