/**
 * FAQ Section (200-300 words)
 * Generates 5 FAQs with keyword-rich answers
 */

function generateFaq(tool, keywords) {
  const year = new Date().getFullYear();
  const primary = keywords.primary || tool.name.toLowerCase();

  const faqs = [
    {
      q: `Is ${tool.name} on SabTools.in really free?`,
      a: `Yes, ${tool.name} is 100% free to use. There are no hidden charges, no premium plans, and no signup required. You can use it unlimited times without any restrictions.`,
    },
    {
      q: `Is my data safe when I use ${tool.name}?`,
      a: `Absolutely. ${tool.name} processes all data directly in your web browser using client-side JavaScript. No data is sent to any server. Your information never leaves your device.`,
    },
    {
      q: `Does ${tool.name} work on mobile phones?`,
      a: `Yes, ${tool.name} is fully responsive and works on all devices — Android phones, iPhones, tablets, and desktop computers. You can even install SabTools.in as a PWA (Progressive Web App) for quick access from your home screen.`,
    },
    {
      q: `How accurate is ${tool.name}?`,
      a: `${tool.name} uses industry-standard formulas and calculations. The results are mathematically precise and reliable for personal, academic, and professional use. For critical decisions, we recommend consulting a relevant professional.`,
    },
    {
      q: `Can I share my ${tool.name} results?`,
      a: `Yes! You can share results via WhatsApp, download them as PDF, or simply copy the results. There are share buttons right below the tool for easy sharing.`,
    },
  ];

  const faqHtml = faqs
    .map(
      (faq) => `
      <div class="faq-item">
        <h3>${faq.q}</h3>
        <p>${faq.a}</p>
      </div>`
    )
    .join("\n");

  return `
    <h2>Frequently Asked Questions About ${tool.name}</h2>
    ${faqHtml}
  `;
}

// Generate FAQ data for schema
function generateFaqData(tool) {
  return [
    { q: `Is ${tool.name} on SabTools.in really free?`, a: `Yes, ${tool.name} is 100% free — no hidden charges, no signup required, unlimited usage.` },
    { q: `Is my data safe when I use ${tool.name}?`, a: `Yes, all processing happens in your browser. No data is sent to any server.` },
    { q: `Does ${tool.name} work on mobile phones?`, a: `Yes, it's fully responsive and works on Android, iPhone, tablets, and desktops.` },
    { q: `How accurate is ${tool.name}?`, a: `It uses industry-standard formulas with high precision, suitable for personal and professional use.` },
    { q: `Can I share my ${tool.name} results?`, a: `Yes, you can share via WhatsApp, download as PDF, or copy results with one click.` },
  ];
}

module.exports = { generateFaq, generateFaqData };
