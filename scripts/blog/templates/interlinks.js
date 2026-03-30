/**
 * "Related Tools" Interlinks Section (100-150 words)
 * Creates natural internal links to 5-8 other tools
 */

function generateInterlinks(tool, relatedTools, keywords) {
  if (!relatedTools || relatedTools.length === 0) {
    return `
      <h2>Explore More Free Tools</h2>
      <p>SabTools.in offers 460+ free online tools across finance, education, developer, image, PDF, and more categories. <a href="/">Browse all tools</a> to find exactly what you need — no signup, no fees.</p>
    `;
  }

  const links = relatedTools.slice(0, 8).map((rt) => {
    return `<li><a href="/tools/${rt.slug}"><strong>${rt.name}</strong></a> — ${rt.description}</li>`;
  });

  return `
    <h2>Related Tools You Might Find Useful</h2>
    <p>If you found ${tool.name} helpful, you'll love these related tools on SabTools.in:</p>
    <ul>
      ${links.join("\n      ")}
    </ul>
    <p>All tools are <strong>100% free</strong> and work instantly in your browser. <a href="/">Explore all 460+ tools on SabTools.in</a>.</p>
  `;
}

module.exports = { generateInterlinks };
