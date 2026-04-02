"use client";
import { useState } from "react";

export default function TermsConditionsGenerator() {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!siteName) return;
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const terms = `Terms and Conditions for ${siteName}
Effective Date: ${today}

Welcome to ${siteName}${siteUrl ? ` (${siteUrl})` : ""}. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.

1. ACCEPTANCE OF TERMS

By accessing and using ${siteName}, you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, you must not access or use the website.

2. USE LICENSE

Permission is granted to temporarily access the materials on ${siteName} for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
- Modify or copy the materials
- Use the materials for any commercial purpose
- Attempt to decompile or reverse engineer any software contained on the website
- Remove any copyright or other proprietary notations from the materials
- Transfer the materials to another person or mirror the materials on any other server

3. USER ACCOUNTS

If you create an account on ${siteName}, you are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.

4. INTELLECTUAL PROPERTY

The content, features, and functionality of ${siteName} are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Our trademarks may not be used in connection with any product or service without our prior written consent.

5. USER CONTENT

By posting or submitting content to ${siteName}, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute that content in connection with operating the website. You represent that you own or have the necessary permissions to post such content.

6. PROHIBITED ACTIVITIES

You agree not to:
- Use the website for any unlawful purpose
- Violate any applicable laws or regulations
- Infringe upon the rights of others
- Submit false or misleading information
- Upload viruses or malicious code
- Interfere with the security features of the website
- Engage in automated data collection without our consent

7. DISCLAIMER OF WARRANTIES

${siteName} is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of the website or the accuracy of the information, content, or materials included. You expressly agree that your use of the website is at your sole risk.

8. LIMITATION OF LIABILITY

In no event shall ${siteName}, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website, whether based on warranty, contract, tort, or any other legal theory.

9. THIRD-PARTY LINKS

Our website may contain links to third-party websites that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. We strongly advise you to read the terms and privacy policies of any third-party websites you visit.

10. TERMINATION

We may terminate or suspend your access to the website immediately, without prior notice, for any reason, including breach of these Terms and Conditions. Upon termination, your right to use the website will cease immediately.

11. GOVERNING LAW

These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which ${siteName} operates, without regard to its conflict of law provisions.

12. CHANGES TO TERMS

We reserve the right to modify or replace these Terms and Conditions at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the website after any changes constitutes acceptance of the new terms.

13. CONTACT US

If you have any questions about these Terms and Conditions, please contact us:
${email ? `- Email: ${email}\n` : ""}${siteUrl ? `- Website: ${siteUrl}\n` : ""}
By using ${siteName}, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`;

    setGenerated(terms);
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
        <input type="email" placeholder="legal@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="calc-input" />
      </div>
      <button onClick={generate} className="btn-primary">Generate Terms & Conditions</button>
      {generated && (
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Generated Terms & Conditions</label>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto font-mono max-h-[500px] whitespace-pre-wrap">{generated}</pre>
        </div>
      )}
    </div>
  );
}
