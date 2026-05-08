/**
 * "Tips & Tricks" Section (150-200 words)
 */

const categoryTips = {
  finance: [
    { title: "Compare Multiple Scenarios", text: "Don't settle for one calculation. Adjust interest rates, tenure, and amounts to find the best option for your budget." },
    { title: "Use the PDF Download", text: "Download your results as a PDF and share with your family or financial advisor before making big decisions." },
    { title: "Check with Different Banks", text: "Interest rates vary between banks (SBI, HDFC, ICICI). Calculate with each rate to find the best deal." },
    { title: "Factor in Hidden Costs", text: "Remember to account for processing fees, insurance, and GST that banks may charge on top of EMI." },
  ],
  math: [
    { title: "Double-Check Important Calculations", text: "For exam prep or assignments, use the tool to verify your manual calculations." },
    { title: "Use Decimal Precision", text: "The tool supports high precision — useful for scientific and engineering calculations." },
    { title: "Bookmark for Quick Access", text: "Add the tool to your browser bookmarks or home screen for instant access during study sessions." },
  ],
  text: [
    { title: "Check Before Submitting", text: "Always run your text through the tool before submitting assignments, blog posts, or official documents." },
    { title: "Use on Mobile", text: "The tool works great on mobile — perfect for checking content on the go." },
    { title: "Combine with Other Tools", text: "Use this alongside our Grammar Checker and Readability Checker for the best results." },
  ],
  developer: [
    { title: "Keep the Tab Open", text: "Pin the tool tab in your browser for instant access during coding sessions." },
    { title: "Use Keyboard Shortcuts", text: "Many tools support Ctrl+A (select all) and Ctrl+C (copy) for quick workflow." },
    { title: "Test with Real Data", text: "Paste your actual project data to validate formats and catch errors early." },
  ],
  default: [
    { title: "Bookmark for Reuse", text: "Add the tool to your bookmarks for quick access whenever you need it." },
    { title: "Try Related Tools", text: "SabTools has 497+ tools — explore related ones for a complete solution." },
    { title: "Share with Friends", text: "Use the WhatsApp share button to help friends and family with similar tasks." },
  ],
};

function generateTips(tool, keywords) {
  const tips = categoryTips[tool.category] || categoryTips.default;
  const tipsHtml = tips
    .map((tip) => `<h3>${tip.title}</h3>\n      <p>${tip.text}</p>`)
    .join("\n\n      ");

  return `
    <h2>Tips & Tricks for ${tool.name}</h2>
    <p>Get the most out of ${tool.name} with these expert tips:</p>

    ${tipsHtml}
  `;
}

module.exports = { generateTips };
