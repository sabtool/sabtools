"use client";
import { useState } from "react";

export default function PrivacyPolicyGenerator() {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [cookies, setCookies] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [emailCollection, setEmailCollection] = useState(true);
  const [personalInfo, setPersonalInfo] = useState(false);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!siteName) return;
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    let policy = `Privacy Policy for ${siteName}\nEffective Date: ${today}\n\nAt ${siteName}${siteUrl ? ` (${siteUrl})` : ""}, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.\n\n`;

    policy += `1. INFORMATION WE COLLECT\n\nWe may collect information about you in a variety of ways, including:\n`;

    if (personalInfo) {
      policy += `\n- Personal Data: Name, email address, phone number, and other personally identifiable information that you voluntarily provide to us when registering or using our services.\n`;
    }
    if (emailCollection) {
      policy += `\n- Email Information: We collect email addresses when you subscribe to our newsletter, create an account, or contact us through forms on our website.\n`;
    }
    if (cookies) {
      policy += `\n- Cookies and Tracking Data: We use cookies and similar tracking technologies to track activity on our website. Cookies are small files stored on your device. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.\n`;
    }
    if (analytics) {
      policy += `\n- Analytics Data: We may use third-party analytics services (such as Google Analytics) to collect information about your use of the website, including pages visited, time spent, and referring URLs.\n`;
    }

    policy += `\n2. HOW WE USE YOUR INFORMATION\n\nWe may use the information we collect for various purposes, including:\n- To operate and maintain our website\n- To improve and personalize your experience\n- To send periodic emails and updates\n- To respond to your comments, questions, and requests\n- To monitor and analyze usage and trends\n- To detect, prevent, and address technical issues\n`;

    policy += `\n3. DISCLOSURE OF YOUR INFORMATION\n\nWe do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and advertisers.\n`;

    policy += `\n4. THIRD-PARTY SERVICES\n\nWe may employ third-party companies and individuals to facilitate our website, provide services on our behalf, or assist us in analyzing how our website is used. These third parties have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.\n`;

    if (cookies) {
      policy += `\n5. COOKIES POLICY\n\nOur website uses cookies to enhance your experience. You can choose to set your web browser to refuse cookies or to alert you when cookies are being sent. If you disable cookies, some features of the website may not function properly.\n`;
    }

    policy += `\n${cookies ? "6" : "5"}. DATA SECURITY\n\nWe use commercially reasonable methods to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.\n`;

    policy += `\n${cookies ? "7" : "6"}. CHILDREN'S PRIVACY\n\nOur website is not intended for children under the age of 13. We do not knowingly collect personal identifiable information from children under 13.\n`;

    policy += `\n${cookies ? "8" : "7"}. CHANGES TO THIS PRIVACY POLICY\n\nWe may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.\n`;

    policy += `\n${cookies ? "9" : "8"}. CONTACT US\n\nIf you have any questions about this Privacy Policy, please contact us:\n`;
    if (email) policy += `- Email: ${email}\n`;
    if (siteUrl) policy += `- Website: ${siteUrl}\n`;

    setGenerated(policy);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard?.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Website / App Name</label>
          <input type="text" placeholder="e.g. My Website" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Website URL</label>
          <input type="url" placeholder="https://example.com" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="calc-input" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Contact Email</label>
        <input type="email" placeholder="privacy@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="calc-input" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-3">What data do you collect?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Cookies", checked: cookies, set: setCookies },
            { label: "Analytics", checked: analytics, set: setAnalytics },
            { label: "Email Addresses", checked: emailCollection, set: setEmailCollection },
            { label: "Personal Info", checked: personalInfo, set: setPersonalInfo },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-indigo-200 transition">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="w-4 h-4 rounded accent-indigo-600" />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Privacy Policy</button>
      {generated && (
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Generated Privacy Policy</label>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto font-mono max-h-[500px] whitespace-pre-wrap">{generated}</pre>
        </div>
      )}
    </div>
  );
}
