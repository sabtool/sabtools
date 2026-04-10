/**
 * "India Context" Section (100-200 words)
 */

const categoryIndianContext = {
  finance: `is especially relevant for Indian users. With rising interest rates set by RBI, growing SIP investments, and changing tax regimes, having an accurate calculator is essential. Whether you're applying for a loan at SBI, HDFC, or ICICI, or planning investments through Zerodha, Groww, or Paytm Money — this tool gives you the numbers you need. All calculations use the Indian numbering system (lakhs and crores) and INR currency formatting.`,
  tax: `is updated for the latest Indian tax rules including both Old and New tax regimes for FY 2025-26 and AY 2026-27. It accounts for Section 80C, 80D, HRA exemption, standard deduction, and other common deductions. Whether you're a salaried employee filing on the Income Tax portal or a freelancer managing GST — this tool simplifies the process.`,
  health: `follows WHO and ICMR (Indian Council of Medical Research) guidelines. Indian body composition and dietary patterns are different from Western standards, and this tool accounts for that. Whether you're tracking calories from Indian foods (roti, dal, rice, chai) or calculating BMI with Indian reference ranges — the results are tailored for you.`,
  education: `is designed with the Indian education system in mind. Whether you're converting CGPA to percentage for Anna University, VTU, Mumbai University, or CBSE — this tool handles different grading scales. Perfect for students applying to jobs, higher studies, or government exams.`,
  realestate: `uses Indian measurement standards — square feet, square yards, cents, bigha, and more. Stamp duty rates are state-specific (Maharashtra, Karnataka, Delhi, UP, etc.) and this tool accounts for local variations. Perfect for homebuyers, builders, and real estate agents across India.`,
  legal: `is designed for the Indian legal system. It follows the latest court fee structures, RTI Act 2005 guidelines, and Indian government form requirements. Whether you're filing a complaint, drafting a legal notice, or calculating court fees — this tool covers it.`,
  agriculture: `supports Indian farming conditions — crop yield calculations based on Indian soil types, fertilizer ratios for common Indian crops (wheat, rice, sugarcane, cotton), and measurement units used across Indian states (bigha, acre, hectare). Perfect for farmers, agricultural officers, and FPO managers.`,
  default: `is built specifically for Indian users. The interface supports Indian numbering (lakhs, crores), INR formatting, and references Indian standards and regulations where applicable. With 900+ million internet users in India, we've designed this tool to be fast even on 3G/4G networks and work smoothly on budget smartphones.`,
};

function generateIndianContext(tool, keywords) {
  const context = categoryIndianContext[tool.category] || categoryIndianContext.default;

  return `
    <h2>${tool.name} for India — Why It Matters</h2>
    <p><a href="/tools/${tool.slug}">${tool.name}</a> ${context}</p>

    <p>SabTools.in is one of India's leading free tools platforms, trusted by students, professionals, and businesses across all states. We keep our tools updated with the latest Indian standards and regulations so you always get accurate results.</p>
  `;
}

module.exports = { generateIndianContext };
