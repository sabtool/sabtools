/**
 * "How to Use" Section (200-300 words)
 */

function generateHowToUse(tool, keywords) {
  const steps = [
    `Open <a href="/tools/${tool.slug}">${tool.name}</a> on SabTools.in — no signup or login required.`,
    `Enter your values or data in the input fields provided. The interface is clean and easy to understand.`,
    `The tool processes your input instantly and displays detailed results in real-time.`,
    `Review the results — you can adjust your inputs to compare different scenarios.`,
    `Use the copy, download, or share buttons to save your results as PDF or share via WhatsApp.`,
  ];

  const stepsHtml = steps
    .map(
      (step, i) =>
        `<li><strong>Step ${i + 1}:</strong> ${step}</li>`
    )
    .join("\n          ");

  const primary = keywords.primary || tool.name.toLowerCase();

  return `
    <h2>How to Use ${tool.name} — Step by Step</h2>
    <p>Using our free <strong>${primary}</strong> is simple and takes less than a minute. Here's how:</p>

    <ol>
      ${stepsHtml}
    </ol>

    <p>That's it! The entire process takes under 60 seconds. There's no need to install any software, create an account, or pay anything. The tool works directly in your web browser on any device.</p>

    <p><strong>Pro tip:</strong> Bookmark the <a href="/tools/${tool.slug}">${tool.name} page</a> for quick access anytime. You can also add SabTools.in to your home screen as a Progressive Web App (PWA) for instant access.</p>
  `;
}

module.exports = { generateHowToUse };
