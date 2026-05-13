import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  breadcrumbNode,
  breadcrumbIdFor,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms of Service — SabTools.in Free Online Tools",
  description: `Terms of Service for SabTools.in. All ${BRAND.totalTools}+ tools are free for personal and commercial use. Results are for informational purposes only — not financial, medical, or legal advice.`,
  alternates: { canonical: "https://sabtools.in/terms" },
  openGraph: {
    title: "Terms of Service — SabTools.in",
    description:
      "Comprehensive Terms of Service for SabTools.in free online tools covering finance, health, legal, education, and AI tools.",
    url: "https://sabtools.in/terms",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Terms of Service — SabTools.in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — SabTools.in",
    description:
      "Comprehensive Terms of Service for SabTools.in free online tools.",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        alt: "Terms of Service — SabTools.in",
      },
    ],
    creator: "@Sabtoolsin",
    site: "@Sabtoolsin",
  },
};

export default function TermsPage() {
  const pageUrl = `${SITE_URL}/terms`;
  const breadcrumbId = breadcrumbIdFor(pageUrl);
  const termsGraph = buildGraph([
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Terms of Service — SabTools.in",
      description:
        "Terms of Service for SabTools.in. Tools are for informational purposes — not financial, medical, or legal advice.",
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      about: { "@id": ORG_ID },
      breadcrumb: { "@id": breadcrumbId },
      dateModified: BUILD_DATE,
      lastReviewed: BUILD_DATE,
    },
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Terms of Service" },
      ],
      breadcrumbId
    ),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsGraph) }}
      />
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
      />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Terms of Service
      </h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p>
          <strong>Last updated:</strong> April 10, 2026
        </p>

        <p>
          Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of
          Service&quot;, &quot;Agreement&quot;) carefully before using the
          website{" "}
          <a
            href="https://sabtools.in"
            className="text-blue-600 hover:underline"
          >
            sabtools.in
          </a>{" "}
          (&quot;Site&quot;, &quot;Platform&quot;, &quot;Service&quot;) operated
          by SabTools.in (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). Your
          access to and use of the Service is conditioned upon your acceptance of
          and compliance with these Terms. These Terms apply to all visitors,
          users, and others who access or use the Service.
        </p>

        {/* 1. Acceptance of Terms */}
        <h2 className="text-xl font-bold mt-8">1. Acceptance of Terms</h2>
        <p>
          By accessing or using SabTools.in, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service and our
          Privacy Policy. If you do not agree with any part of these Terms, you
          must not access or use the Service. Your continued use of the Site
          following the posting of any changes to these Terms constitutes
          acceptance of those changes. We recommend that you review these Terms
          periodically to stay informed of any updates.
        </p>

        {/* 2. Description of Service */}
        <h2 className="text-xl font-bold mt-8">2. Description of Service</h2>
        <p>
          SabTools.in provides a collection of {BRAND.totalTools}+ free online tools spanning
          multiple categories, including but not limited to finance calculators
          (EMI, SIP, GST, income tax, mutual fund, FD, RD, PPF, NPS, HRA
          calculators), health and wellness tools (BMI calculator, calorie
          counter, pregnancy calculator, body fat estimator, water intake
          tracker), legal utilities (RTI draft generators, court fee calculators,
          legal notice templates), education tools (exam score predictors, GPA
          calculators, percentage converters, age calculators), AI-powered tools,
          text and document utilities, image and media converters, developer
          tools, SEO utilities, and general-purpose converters. All tools are
          provided free of charge for both personal and commercial use. The
          results generated by these tools are intended solely for informational
          and educational purposes.
        </p>

        {/* 3. Financial Tool Disclaimer */}
        <h2 className="text-xl font-bold mt-8">
          3. Financial Tool Disclaimer
        </h2>
        <p>
          SabTools.in offers various financial calculators and tools, including
          but not limited to EMI calculators, SIP calculators, GST calculators,
          income tax calculators, mutual fund return estimators, fixed deposit
          calculators, recurring deposit calculators, PPF calculators, NPS
          calculators, HRA exemption calculators, and loan comparison tools. The
          results produced by these tools are generated using standard
          mathematical formulas and publicly available rates and are provided
          strictly for <strong>informational purposes only</strong>.
        </p>
        <p>
          The output of our financial tools does{" "}
          <strong>not constitute financial advice</strong>, investment advice, tax
          planning advice, or any form of professional financial guidance. The
          calculations do not account for individual financial circumstances,
          risk tolerance, tax implications specific to your situation, or current
          market conditions that may affect actual outcomes. Interest rates, tax
          slabs, GST rates, and other financial parameters used in our
          calculators may not reflect the most current figures.
        </p>
        <p>
          <strong>
            Our financial tools are not a substitute for consultation with a
            Certified Financial Planner (CFP), Chartered Accountant (CA),
            SEBI-registered investment advisor, or any other qualified financial
            professional.
          </strong>{" "}
          Before making any financial decisions including investments, loan
          applications, or tax filings, you should seek independent professional
          advice. SabTools.in expressly disclaims all liability for any financial
          losses, damages, or adverse outcomes arising from reliance on
          calculator results.
        </p>

        {/* 4. Health / Medical Tool Disclaimer */}
        <h2 className="text-xl font-bold mt-8">
          4. Health and Medical Tool Disclaimer
        </h2>
        <p>
          SabTools.in provides health-related tools such as BMI calculators,
          calorie counters, pregnancy due date calculators, body fat estimators,
          water intake calculators, and other wellness utilities. These tools use
          generalised formulas and standard reference values. The results are
          provided strictly for <strong>informational purposes only</strong> and
          are intended to serve as general guidance.
        </p>
        <p>
          The output of our health tools does{" "}
          <strong>not constitute medical advice</strong>, diagnosis, or treatment
          recommendations. Health-related calculations cannot account for
          individual physiological differences, pre-existing medical conditions,
          medications, genetic factors, or other variables that a healthcare
          professional would consider.
        </p>
        <p>
          <strong>
            Our health tools are not a substitute for professional medical
            advice, diagnosis, or treatment from a qualified doctor, physician,
            dietician, or other licensed healthcare professional.
          </strong>{" "}
          Never disregard professional medical advice or delay seeking it because
          of information obtained from SabTools.in. If you have concerns about
          your health, consult a qualified healthcare provider immediately.
          SabTools.in assumes no responsibility for health decisions made based
          on tool outputs.
        </p>

        {/* 5. Legal Tool Disclaimer */}
        <h2 className="text-xl font-bold mt-8">5. Legal Tool Disclaimer</h2>
        <p>
          SabTools.in offers legal reference tools including RTI application
          draft generators, court fee calculators, legal notice templates, and
          other legal utilities. These tools are designed to provide general
          reference information and are offered strictly for{" "}
          <strong>informational purposes only</strong>.
        </p>
        <p>
          The output of our legal tools does{" "}
          <strong>not constitute legal counsel</strong>, legal advice, or a
          legal opinion. Legal tools rely on generalized provisions of Indian law
          and may not reflect the latest amendments, state-specific rules,
          judicial interpretations, or procedural requirements applicable to your
          specific case.
        </p>
        <p>
          <strong>
            Our legal tools are not a substitute for professional legal advice
            from a qualified advocate, solicitor, or legal practitioner enrolled
            with the Bar Council of India.
          </strong>{" "}
          You should consult a qualified legal professional before taking any
          legal action, filing an RTI application, initiating litigation, or
          relying on any output from our legal tools. SabTools.in disclaims all
          liability for any adverse legal outcomes resulting from reliance on
          tool outputs.
        </p>

        {/* 6. Education Tool Disclaimer */}
        <h2 className="text-xl font-bold mt-8">
          6. Education Tool Disclaimer
        </h2>
        <p>
          SabTools.in provides education-related tools such as exam score
          predictors, GPA calculators, percentage converters, CGPA-to-percentage
          converters, and similar utilities. The results produced by these tools
          are <strong>estimates only</strong> and are provided for informational
          purposes.
        </p>
        <p>
          Exam score predictions, rank estimators, and college admission
          probability tools are based on historical data and statistical models
          that may not accurately reflect current examination patterns, changing
          cut-off marks, updated syllabus, or institutional admission criteria.
          Actual results may vary significantly from the estimates provided by
          our tools. SabTools.in does not guarantee the accuracy of any
          education-related predictions and disclaims liability for academic
          decisions made in reliance on these estimates.
        </p>

        {/* 7. Accuracy Disclaimer */}
        <h2 className="text-xl font-bold mt-8">7. Accuracy Disclaimer</h2>
        <p>
          While we strive to ensure the accuracy, reliability, and timeliness of
          all tools and content on SabTools.in, we do not warrant or guarantee
          that the results generated by any tool are completely free from errors,
          inaccuracies, or omissions. Tools may use formulas, datasets, rates,
          or reference values that become outdated over time. Software bugs,
          rounding differences, or data-entry errors may occasionally affect
          results.
        </p>
        <p>
          <strong>
            Users should independently verify all results before relying on them
            for any critical decision
          </strong>
          , whether financial, medical, legal, educational, or otherwise.
          SabTools.in is not responsible for any losses, damages, or
          consequences arising from errors or inaccuracies in tool outputs.
        </p>

        {/* 8. User Responsibilities */}
        <h2 className="text-xl font-bold mt-8">8. User Responsibilities</h2>
        <p>By using SabTools.in, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Use the tools and content only for lawful purposes and in accordance
            with these Terms.
          </li>
          <li>
            Provide accurate input data when using any tool, as inaccurate
            inputs will produce inaccurate results.
          </li>
          <li>
            Independently verify all tool outputs before relying on them for
            important decisions.
          </li>
          <li>
            Not attempt to reverse-engineer, decompile, disassemble, or
            otherwise attempt to derive the source code of any tool or
            component.
          </li>
          <li>
            Not use automated systems, bots, scrapers, or similar technologies
            to access, extract, or collect content from the Site without prior
            written permission.
          </li>
          <li>
            Not interfere with or disrupt the integrity or performance of the
            Site or its servers.
          </li>
          <li>
            Comply with all applicable local, state, national, and international
            laws and regulations.
          </li>
        </ul>

        {/* 9. Intellectual Property */}
        <h2 className="text-xl font-bold mt-8">9. Intellectual Property</h2>
        <p>
          All tools, content, text, graphics, logos, icons, images, software,
          source code, user interface design, layout, and overall visual
          appearance of SabTools.in are the exclusive property of SabTools.in and
          are protected by applicable intellectual property laws, including
          copyright, trademark, and trade dress laws of India and international
          treaties.
        </p>
        <p>
          You may not copy, reproduce, distribute, publish, display, modify,
          create derivative works from, or exploit any portion of the Site or its
          content without express prior written permission from SabTools.in. The
          SabTools.in name, logo, and all related names, logos, product and
          service names, designs, and slogans are trademarks of SabTools.in.
          Unauthorized use of any intellectual property belonging to SabTools.in
          may result in legal action.
        </p>

        {/* 10. Prohibited Uses */}
        <h2 className="text-xl font-bold mt-8">10. Prohibited Uses</h2>
        <p>You are expressly prohibited from:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Using the Site or its tools for any unlawful, fraudulent, or
            malicious purpose.
          </li>
          <li>
            Attempting to gain unauthorized access to any portion of the Site,
            its servers, or any connected systems or networks.
          </li>
          <li>
            Scraping, data mining, or using automated tools to extract content
            from the Site without written authorization.
          </li>
          <li>
            Uploading or transmitting viruses, malware, or any other malicious
            code that may damage the Site or its infrastructure.
          </li>
          <li>
            Impersonating SabTools.in or any of its representatives in any
            communication.
          </li>
          <li>
            Reproducing, mirroring, or framing the Site or any part thereof on
            any other server or website without permission.
          </li>
          <li>
            Using tool outputs to provide professional advice (financial,
            medical, legal, or otherwise) to third parties without appropriate
            professional qualifications and independent verification.
          </li>
          <li>
            Engaging in any activity that interferes with or disrupts the
            Service or the servers and networks connected to the Service.
          </li>
        </ul>

        {/* 11. Privacy */}
        <h2 className="text-xl font-bold mt-8">11. Privacy</h2>
        <p>
          Your privacy is important to us. Our collection, use, and protection
          of your personal information is governed by our{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          , which is incorporated into these Terms by reference. By using
          SabTools.in, you consent to the practices described in the Privacy
          Policy. We encourage you to review the Privacy Policy to understand
          how we handle your data.
        </p>

        {/* 12. Third-Party Links */}
        <h2 className="text-xl font-bold mt-8">12. Third-Party Links</h2>
        <p>
          SabTools.in may contain links to third-party websites, services, or
          resources that are not owned or controlled by us. We have no control
          over, and assume no responsibility for, the content, privacy policies,
          terms of service, or practices of any third-party websites or
          services. The inclusion of any link does not imply endorsement,
          approval, or recommendation by SabTools.in.
        </p>
        <p>
          You acknowledge and agree that SabTools.in shall not be liable,
          directly or indirectly, for any damage or loss caused or alleged to be
          caused by or in connection with the use of or reliance on any content,
          goods, or services available on or through any third-party websites or
          services. We strongly advise you to read the terms of service and
          privacy policies of any third-party websites or services that you
          visit.
        </p>

        {/* 13. Limitation of Liability */}
        <h2 className="text-xl font-bold mt-8">13. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, SabTools.in, its
          owners, operators, affiliates, partners, employees, and agents shall
          not be liable for any indirect, incidental, special, consequential, or
          punitive damages, including without limitation loss of profits, data,
          goodwill, business opportunity, or other intangible losses, resulting
          from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your access to, use of, or inability to use the Service.</li>
          <li>
            Any errors, inaccuracies, or omissions in the content or tool
            results provided by the Service.
          </li>
          <li>
            Any unauthorized access to or alteration of your data or
            transmissions.
          </li>
          <li>
            Any financial losses, adverse health outcomes, legal consequences,
            or academic setbacks resulting from reliance on tool outputs.
          </li>
          <li>
            Any conduct or content of any third party on the Service or linked
            from the Service.
          </li>
        </ul>
        <p>
          The Service is provided on an &quot;AS IS&quot; and &quot;AS
          AVAILABLE&quot; basis without warranties of any kind, whether express
          or implied, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement. In no event shall the total liability of SabTools.in
          to you for all claims exceed the amount paid by you to SabTools.in, if
          any, during the twelve (12) months preceding the claim.
        </p>

        {/* 14. Indemnification */}
        <h2 className="text-xl font-bold mt-8">14. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless SabTools.in, its
          owners, operators, affiliates, partners, employees, and agents from
          and against any and all claims, damages, obligations, losses,
          liabilities, costs, or debt and expenses (including but not limited to
          attorney fees) arising from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your use of and access to the Service.</li>
          <li>Your violation of any term of these Terms of Service.</li>
          <li>
            Your violation of any third-party right, including without
            limitation any intellectual property, privacy, or proprietary right.
          </li>
          <li>
            Any claim that your use of the Service caused damage to a third
            party.
          </li>
          <li>
            Any misuse of tool outputs, including the provision of tool results
            as professional advice to third parties.
          </li>
        </ul>
        <p>
          This indemnification obligation shall survive the termination of these
          Terms and your use of the Service.
        </p>

        {/* 15. Governing Law and Jurisdiction */}
        <h2 className="text-xl font-bold mt-8">
          15. Governing Law and Jurisdiction
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of India, without regard to its conflict of law provisions. Any
          legal action or proceeding arising out of or relating to these Terms or
          your use of the Service shall be subject to the exclusive jurisdiction
          of the courts located in the State of Uttar Pradesh, India. You hereby
          irrevocably consent to the personal jurisdiction and venue of such
          courts and waive any objection based on inconvenient forum or lack of
          jurisdiction.
        </p>

        {/* 16. Dispute Resolution */}
        <h2 className="text-xl font-bold mt-8">16. Dispute Resolution</h2>
        <p>
          In the event of any dispute, controversy, or claim arising out of or
          relating to these Terms or your use of the Service, the parties shall
          first attempt to resolve the matter amicably through good-faith
          negotiation. Either party may initiate such negotiation by providing
          written notice to the other party describing the nature of the dispute
          and the relief sought.
        </p>
        <p>
          If the dispute cannot be resolved amicably within thirty (30) days of
          written notice, the matter shall be referred to and finally resolved
          by arbitration in accordance with the Arbitration and Conciliation Act,
          1996 (as amended from time to time). The arbitration shall be conducted
          by a sole arbitrator mutually appointed by both parties. The seat and
          venue of arbitration shall be in Uttar Pradesh, India. The language of
          arbitration shall be English. The arbitral award shall be final and
          binding on both parties and may be enforced in any court of competent
          jurisdiction.
        </p>

        {/* 17. Age Restrictions */}
        <h2 className="text-xl font-bold mt-8">17. Age Restrictions</h2>
        <p>
          The general-purpose tools on SabTools.in are accessible to users of
          all ages. However, users must be at least{" "}
          <strong>18 years of age</strong> to use financial tools, including but
          not limited to EMI calculators, SIP calculators, income tax
          calculators, GST calculators, loan comparison tools, and investment
          estimators. Users under the age of 18 may use the Site only with the
          consent and supervision of a parent or legal guardian. By using our
          financial tools, you represent and warrant that you are at least 18
          years of age or have obtained verifiable parental or guardian consent.
        </p>
        <p>
          Parents and guardians are responsible for monitoring and supervising
          the online activities of minors under their care. SabTools.in is not
          responsible for any decisions or actions taken by minors based on tool
          outputs.
        </p>

        {/* 18. Modifications to Terms */}
        <h2 className="text-xl font-bold mt-8">18. Modifications to Terms</h2>
        <p>
          SabTools.in reserves the right to modify, amend, or replace these
          Terms of Service at any time and at our sole discretion. Material
          changes will be communicated by updating the &quot;Last updated&quot;
          date at the top of this page. We may also notify users of significant
          changes through a prominent notice on the Site.
        </p>
        <p>
          It is your responsibility to review these Terms periodically. Your
          continued use of the Service after any changes to these Terms are
          posted constitutes your acceptance of the revised Terms. If you do not
          agree to the modified Terms, you must discontinue use of the Service
          immediately.
        </p>

        {/* 19. Severability */}
        <h2 className="text-xl font-bold mt-8">19. Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid, illegal, or
          unenforceable by a court of competent jurisdiction, such invalidity,
          illegality, or unenforceability shall not affect the remaining
          provisions of these Terms, which shall continue in full force and
          effect. The invalid or unenforceable provision shall be deemed modified
          to the minimum extent necessary to make it valid and enforceable while
          preserving its original intent.
        </p>

        {/* 20. Entire Agreement */}
        <h2 className="text-xl font-bold mt-8">20. Entire Agreement</h2>
        <p>
          These Terms of Service, together with the Privacy Policy and any other
          legal notices or policies published by SabTools.in on the Site,
          constitute the entire agreement between you and SabTools.in regarding
          your use of the Service. These Terms supersede all prior and
          contemporaneous understandings, agreements, representations, and
          warranties, both written and oral, regarding the Service. No waiver of
          any term or condition set forth in these Terms shall be deemed a
          further or continuing waiver of such term or condition, or a waiver of
          any other term or condition.
        </p>

        {/* 21. Contact Information */}
        <h2 className="text-xl font-bold mt-8">21. Contact Information</h2>
        <p>
          If you have any questions, concerns, or feedback about these Terms of
          Service, please contact us at:
        </p>
        <ul className="list-none pl-0 space-y-1">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:contact@sabtools.in"
              className="text-blue-600 hover:underline"
            >
              contact@sabtools.in
            </a>
          </li>
          <li>
            <strong>Website:</strong>{" "}
            <a
              href="https://sabtools.in"
              className="text-blue-600 hover:underline"
            >
              sabtools.in
            </a>
          </li>
        </ul>

        <hr className="my-8 border-gray-300" />

        <p className="text-sm text-gray-500">
          By using SabTools.in, you acknowledge that you have read, understood,
          and agree to be bound by these Terms of Service. If you do not agree to
          these Terms, please discontinue use of the Service immediately.
        </p>
      </div>
    </div>
  );
}
