/**
 * "Key Features" Section (100-150 words)
 */

function generateFeatures(tool, keywords) {
  const kw = tool.keywords || [];
  const kwBullets = kw
    .slice(0, 4)
    .map((k) => `<li><strong>${k.charAt(0).toUpperCase() + k.slice(1)}</strong> — built-in support for ${k} related calculations and conversions</li>`)
    .join("\n          ");

  return `
    <h2>Key Features of ${tool.name}</h2>
    <p>Here's what makes ${tool.name} on SabTools.in stand out from other tools:</p>
    <ul>
      <li><strong>Instant Results</strong> — no waiting, no loading. Results appear as you type.</li>
      <li><strong>100% Free</strong> — no hidden charges, no premium plans, no signup walls.</li>
      <li><strong>Mobile Friendly</strong> — works perfectly on phones, tablets, and desktops.</li>
      <li><strong>Privacy First</strong> — all data stays in your browser. Nothing is uploaded to any server.</li>
      <li><strong>Share Results</strong> — download as PDF or share via WhatsApp with one click.</li>
      ${kwBullets}
    </ul>
  `;
}

module.exports = { generateFeatures };
