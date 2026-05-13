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

export const metadata: Metadata = {
  title: "Privacy Policy — SabTools.in Free Online Tools",
  description:
    "Privacy Policy for SabTools.in compliant with India's Digital Personal Data Protection (DPDP) Act 2023 and Google AdSense requirements. Learn how we collect, use, and protect your data.",
  alternates: { canonical: "https://sabtools.in/privacy" },
  openGraph: {
    title: "Privacy Policy — SabTools.in",
    description:
      "Privacy Policy for SabTools.in — DPDP Act 2023 compliant. Learn how we handle your personal data, cookies, analytics, and advertising.",
    url: "https://sabtools.in/privacy",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy — SabTools.in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — SabTools.in",
    description:
      "Privacy Policy for SabTools.in — DPDP Act 2023 compliant. Learn how we handle your personal data.",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        alt: "Privacy Policy — SabTools.in",
      },
    ],
    creator: "@Sabtoolsin",
    site: "@Sabtoolsin",
  },
};

export default function PrivacyPage() {
  // Schema-org doesn't have a "PrivacyPolicy" type, so we use WebPage
  // with `about: { @id: ORG_ID }` (the policy is *about* the
  // organization that publishes it). dateModified + lastReviewed bump
  // with each Vercel deploy via BUILD_DATE so crawlers see this as
  // actively maintained — important for DPDP compliance signals.
  const pageUrl = `${SITE_URL}/privacy`;
  const breadcrumbId = breadcrumbIdFor(pageUrl);
  const privacyGraph = buildGraph([
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Privacy Policy — SabTools.in",
      description:
        "Privacy Policy compliant with India's Digital Personal Data Protection (DPDP) Act 2023.",
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
        { name: "Privacy Policy" },
      ],
      breadcrumbId
    ),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyGraph) }}
      />
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Privacy Policy
      </h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p>
          <strong>Last updated:</strong> April 10, 2026
        </p>

        <p>
          This Privacy Policy describes how SabTools.in (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;) collects, uses, stores, shares,
          and protects personal data when you visit or use our website located
          at{" "}
          <a
            href="https://sabtools.in"
            className="text-indigo-600 hover:underline"
          >
            https://sabtools.in
          </a>
          . This policy is drafted in compliance with the Digital Personal Data
          Protection Act, 2023 (DPDP Act) of India and Google AdSense program
          policies.
        </p>

        <p>
          By accessing or using SabTools.in, you acknowledge that you have read,
          understood, and agree to the practices described in this Privacy
          Policy. If you do not agree with this policy, please discontinue use
          of the website immediately.
        </p>

        {/* ── 1. Data Controller ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          1. Data Controller
        </h2>
        <p>
          SabTools.in is owned and operated by <strong>Rakesh Seervi</strong>,
          an individual based in India. For the purposes of the DPDP Act 2023,
          Rakesh Seervi is the Data Fiduciary responsible for the processing
          of your personal data through this website.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Website:</strong> SabTools.in
          </li>
          <li>
            <strong>Operator:</strong> Rakesh Seervi
          </li>
          <li>
            <strong>Country:</strong> India
          </li>
          <li>
            <strong>Contact Email:</strong>{" "}
            <a
              href="mailto:contact@sabtools.in"
              className="text-indigo-600 hover:underline"
            >
              contact@sabtools.in
            </a>
          </li>
        </ul>

        {/* ── 2. Personal Data We Collect ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          2. Personal Data We Collect
        </h2>
        <p>
          We collect different types of personal data depending on how you
          interact with our website. The majority of tools on SabTools.in
          operate entirely within your browser, meaning the data you input into
          tools is processed locally on your device and is never transmitted to
          our servers. However, we do collect certain data as outlined below.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          2.1 Information You Provide Directly
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Newsletter Subscription:</strong> When you subscribe to our
            newsletter, we collect your email address. This is provided
            voluntarily and used solely for sending periodic updates, new tool
            announcements, and relevant content.
          </li>
          <li>
            <strong>Contact Form Submissions:</strong> When you use our contact
            form, we collect your name, email address, and the message content
            you provide. This information is used exclusively to respond to your
            inquiry or feedback.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          2.2 Information Collected Automatically
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Google Analytics (GA4) Data:</strong> We use Google Analytics
            4 to collect anonymised usage data including page views, session
            duration, bounce rate, approximate geographic location (city/country
            level), device type, browser type, operating system, screen
            resolution, and referral sources. GA4 uses first-party cookies to
            distinguish unique users and sessions.
          </li>
          <li>
            <strong>Google AdSense Data:</strong> Google AdSense uses cookies and
            web beacons to serve personalised advertisements based on your
            browsing history across websites. This may include data such as your
            IP address, browser information, and ad interaction data (clicks,
            impressions). Google may also use device identifiers for
            interest-based advertising.
          </li>
          <li>
            <strong>Google Tag Manager:</strong> We use Google Tag Manager to
            manage analytics and advertising tags on the website. Google Tag
            Manager itself does not collect personal data but facilitates the
            deployment of tags that may collect data as described above.
          </li>
          <li>
            <strong>Server Logs (Vercel):</strong> Our hosting provider, Vercel,
            may automatically collect server access logs that include your IP
            address, browser user agent, referring URL, pages visited, and
            timestamps. These logs are used for security monitoring and
            performance optimisation.
          </li>
          <li>
            <strong>localStorage Data:</strong> We use your browser&apos;s
            localStorage to save tool preferences, settings, and recent
            calculations locally on your device. This data is never transmitted
            to our servers and remains entirely under your control. You can
            clear localStorage at any time through your browser settings.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          2.3 Data We Do NOT Collect
        </h3>
        <p>
          We do not collect passwords, financial information, government-issued
          identification numbers, biometric data, or any sensitive personal data
          as defined under the DPDP Act 2023. The data you input into our
          browser-based tools (calculations, text conversions, file operations)
          is processed entirely on your device and is never sent to or stored on
          our servers.
        </p>

        {/* ── 3. Legal Basis for Processing ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          3. Legal Basis for Processing Under DPDP Act 2023
        </h2>
        <p>
          Under the Digital Personal Data Protection Act, 2023, we process your
          personal data on the following lawful bases:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Consent (Section 6):</strong> We obtain your explicit
            consent before collecting personal data for newsletter
            subscriptions, contact form submissions, and the use of
            non-essential cookies (analytics and advertising). You may withdraw
            your consent at any time, and such withdrawal shall not affect the
            lawfulness of processing carried out prior to the withdrawal.
          </li>
          <li>
            <strong>Legitimate Uses (Section 7):</strong> Certain data
            processing activities are carried out for legitimate uses as
            permitted under the DPDP Act, including the operation and security
            of our website, prevention of fraud, and compliance with applicable
            laws.
          </li>
        </ul>

        {/* ── 4. How We Use Your Data ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          4. How We Use Your Data
        </h2>
        <p>
          We use the personal data collected for the following specific
          purposes:
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          4.1 Website Analytics
        </h3>
        <p>
          Data collected through Google Analytics (GA4) is used to understand
          how visitors interact with our website, identify popular tools and
          pages, monitor website performance, diagnose technical issues, and
          improve user experience. All analytics data is aggregated and
          anonymised wherever possible.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          4.2 Advertising
        </h3>
        <p>
          Google AdSense uses cookies to display relevant advertisements on our
          website. Ad revenue supports the continued development and maintenance
          of free tools on SabTools.in. You can opt out of personalised
          advertising by visiting{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Google Ad Settings
          </a>{" "}
          or by using the{" "}
          <a
            href="https://optout.networkadvertising.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Network Advertising Initiative opt-out page
          </a>
          .
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          4.3 Newsletter Communications
        </h3>
        <p>
          If you subscribe to our newsletter, your email address is used to send
          periodic updates about new tools, feature announcements, tips, and
          relevant content. We do not share your email address with third
          parties for their marketing purposes. Every newsletter email includes
          an unsubscribe link at the bottom.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          4.4 Contact Form Responses
        </h3>
        <p>
          Information submitted through the contact form is used solely to
          respond to your queries, feedback, or support requests. We do not use
          contact form data for marketing purposes unless you have separately
          opted in to receive communications.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          4.5 Website Operation and Security
        </h3>
        <p>
          Server logs and technical data collected by our hosting provider
          (Vercel) are used to ensure the security, stability, and performance
          of the website, detect and prevent abuse or unauthorised access, and
          troubleshoot technical issues.
        </p>

        {/* ── 5. Third-Party Data Processors ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          5. Third-Party Data Processors
        </h2>
        <p>
          We engage the following third-party service providers who may process
          your personal data on our behalf. Each processor is bound by their own
          privacy policies and data protection commitments:
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                  Service Provider
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                  Purpose
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                  Data Processed
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                  Privacy Policy
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-2">
                  Google Analytics (GA4)
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  Website analytics
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  Page views, sessions, device data, location
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Google Privacy Policy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">
                  Google AdSense
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  Advertising
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  IP address, browsing data, ad interactions
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Google Privacy Policy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">
                  Google Tag Manager
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  Tag management
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  Facilitates tag deployment (no direct data collection)
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Google Privacy Policy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">
                  Vercel
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  Website hosting
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  Server logs, IP address, request data
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Vercel Privacy Policy
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          We do not sell, rent, or trade your personal data to any third party.
          Data is shared with the above processors only to the extent necessary
          to provide the services described in this policy.
        </p>

        {/* ── 6. Cookie Policy ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          6. Cookie Policy
        </h2>
        <p>
          Cookies are small text files placed on your device by websites you
          visit. We use cookies and similar technologies on SabTools.in for the
          purposes described below. By continuing to use our website after
          accepting our cookie consent notice, you agree to the use of cookies
          as described in this section.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          6.1 Essential Cookies
        </h3>
        <p>
          These cookies are necessary for the website to function properly. They
          enable basic features such as page navigation, security, and
          accessibility. Essential cookies do not collect personal data and
          cannot be disabled without affecting the functionality of the website.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Session management cookies</li>
          <li>Cookie consent preference storage</li>
          <li>Security-related cookies (CSRF protection)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          6.2 Analytics Cookies (Google Analytics / GA4)
        </h3>
        <p>
          These cookies help us understand how visitors use our website by
          collecting anonymised information about pages visited, time spent on
          the site, and navigation patterns. Analytics cookies are placed by
          Google Analytics (GA4) and include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>_ga:</strong> Used to distinguish unique users. Expires
            after 2 years.
          </li>
          <li>
            <strong>_ga_*:</strong> Used to maintain session state. Expires
            after 2 years.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          6.3 Advertising Cookies (Google AdSense)
        </h3>
        <p>
          Google AdSense places cookies on your device to serve personalised
          advertisements based on your interests and browsing behaviour across
          websites. These cookies may include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>IDE:</strong> Used by Google DoubleClick to register and
            report ad interactions. Expires after 1 year.
          </li>
          <li>
            <strong>DSID:</strong> Used to identify a signed-in user for ad
            personalisation. Expires after 2 weeks.
          </li>
          <li>
            <strong>NID:</strong> Used to store user preferences and ad
            customisation. Expires after 6 months.
          </li>
          <li>
            <strong>1P_JAR:</strong> Used for advertising purposes and website
            analytics. Expires after 1 month.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          6.4 localStorage (Browser Storage)
        </h3>
        <p>
          We use your browser&apos;s localStorage (not cookies) to store tool
          preferences, saved settings, recent calculation history, and theme
          preferences locally on your device. This data is never sent to our
          servers, is not shared with any third party, and remains entirely
          under your control. You can clear localStorage at any time via your
          browser settings (typically under &quot;Clear site data&quot; or
          &quot;Clear browsing data&quot;).
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          6.5 Managing Cookies
        </h3>
        <p>
          You can manage or disable cookies through your browser settings. Most
          browsers allow you to block or delete cookies. Please note that
          disabling essential cookies may affect website functionality.
          Disabling analytics or advertising cookies will not impact your
          ability to use our tools. You can also manage Google ad
          personalisation at{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            https://adssettings.google.com
          </a>
          .
        </p>

        {/* ── 7. Data Retention ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          7. Data Retention
        </h2>
        <p>
          We retain personal data only for as long as necessary to fulfil the
          purposes for which it was collected, or as required by applicable law.
          The specific retention periods are as follows:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Newsletter Email Addresses:</strong> Retained until you
            unsubscribe. Upon unsubscription, your email address is deleted from
            our mailing list within 30 days.
          </li>
          <li>
            <strong>Contact Form Submissions:</strong> Retained for up to 12
            months from the date of submission, after which they are
            permanently deleted.
          </li>
          <li>
            <strong>Google Analytics Data:</strong> Data retention in GA4 is
            configured to 14 months. After this period, user-level and
            event-level data is automatically deleted by Google.
          </li>
          <li>
            <strong>Google AdSense Data:</strong> Managed and retained by Google
            in accordance with their data retention policies. Advertising
            cookies expire as indicated in Section 6.3 above.
          </li>
          <li>
            <strong>Server Logs (Vercel):</strong> Retained for up to 30 days
            for security and performance monitoring, after which they are
            automatically purged.
          </li>
          <li>
            <strong>localStorage Data:</strong> Remains on your device until
            you manually clear it through your browser settings. We have no
            access to or control over this data.
          </li>
        </ul>

        {/* ── 8. Your Rights Under the DPDP Act 2023 ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          8. Your Rights Under the DPDP Act 2023
        </h2>
        <p>
          As a Data Principal under the Digital Personal Data Protection Act,
          2023, you have the following rights in relation to your personal data:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Right to Access (Section 11):</strong> You have the right to
            obtain a summary of your personal data that is being processed by
            us, along with information about the processing activities
            undertaken.
          </li>
          <li>
            <strong>Right to Correction (Section 12):</strong> You have the
            right to request the correction of inaccurate or misleading personal
            data, and the completion of incomplete personal data.
          </li>
          <li>
            <strong>Right to Erasure (Section 12):</strong> You have the right
            to request the deletion of your personal data when it is no longer
            necessary for the purpose for which it was collected, or when you
            withdraw your consent.
          </li>
          <li>
            <strong>Right to Data Portability:</strong> Where technically
            feasible, you may request that we provide your personal data in a
            structured, commonly used, and machine-readable format.
          </li>
          <li>
            <strong>Right to Withdraw Consent (Section 6):</strong> You have the
            right to withdraw your consent for data processing at any time. To
            withdraw consent for newsletter communications, use the unsubscribe
            link in any email. For other data processing activities, contact us
            at{" "}
            <a
              href="mailto:contact@sabtools.in"
              className="text-indigo-600 hover:underline"
            >
              contact@sabtools.in
            </a>
            . Withdrawal of consent will not affect the lawfulness of processing
            carried out before the withdrawal.
          </li>
          <li>
            <strong>Right to Grievance Redressal (Section 13):</strong> You have
            the right to file a complaint with our Grievance Officer (details
            in Section 10 below) if you believe your data has been processed in
            violation of the DPDP Act. If you are not satisfied with our
            response, you may escalate your complaint to the Data Protection
            Board of India.
          </li>
          <li>
            <strong>Right to Nominate (Section 14):</strong> You have the right
            to nominate another individual to exercise your rights under this
            policy in the event of your death or incapacity.
          </li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, please contact us at{" "}
          <a
            href="mailto:contact@sabtools.in"
            className="text-indigo-600 hover:underline"
          >
            contact@sabtools.in
          </a>
          . We will respond to your request within 30 days of receipt. We may
          request verification of your identity before processing your request.
        </p>

        {/* ── 9. Newsletter Subscription and Unsubscribe ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          9. Newsletter Subscription and Unsubscribe Process
        </h2>
        <p>
          When you subscribe to our newsletter, you provide your email address
          through an explicit opt-in mechanism (subscription form). We use
          this email address solely for sending you updates about new tools,
          features, tips, and relevant content related to SabTools.in.
        </p>
        <p>You can unsubscribe from our newsletter at any time by:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Clicking the &quot;Unsubscribe&quot; link included at the bottom of
            every newsletter email.
          </li>
          <li>
            Sending an email to{" "}
            <a
              href="mailto:contact@sabtools.in"
              className="text-indigo-600 hover:underline"
            >
              contact@sabtools.in
            </a>{" "}
            with the subject line &quot;Unsubscribe&quot; from the email address
            you wish to remove.
          </li>
        </ul>
        <p>
          Upon unsubscription, your email address will be removed from our
          mailing list within 30 days. You will not receive any further
          communications from us unless you re-subscribe.
        </p>

        {/* ── 10. Grievance Officer ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          10. Grievance Officer
        </h2>
        <p>
          In accordance with the DPDP Act 2023, we have appointed a Grievance
          Officer to address any concerns or complaints you may have regarding
          the processing of your personal data. The details of the Grievance
          Officer are as follows:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
          <ul className="space-y-2">
            <li>
              <strong>Name:</strong> Rakesh Seervi
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:contact@sabtools.in"
                className="text-indigo-600 hover:underline"
              >
                contact@sabtools.in
              </a>
            </li>
            <li>
              <strong>Response Time:</strong> Within 30 days of receiving your
              complaint or request
            </li>
          </ul>
        </div>
        <p className="mt-4">
          If you are not satisfied with the resolution provided by our Grievance
          Officer, you may file a complaint with the Data Protection Board of
          India as established under the DPDP Act 2023.
        </p>

        {/* ── 11. Children's Privacy ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          11. Children&apos;s Privacy
        </h2>
        <p>
          SabTools.in is a general-purpose utility website and does not
          knowingly target or collect personal data from children under the age
          of 18. In accordance with the DPDP Act 2023, the processing of
          personal data of children (individuals under 18 years of age)
          requires verifiable consent from a parent or lawful guardian.
        </p>
        <p>
          We do not knowingly collect, use, or disclose personal data from
          children under 18 without parental consent. If we become aware that
          we have inadvertently collected personal data from a child under 18
          without appropriate consent, we will take immediate steps to delete
          such data from our records.
        </p>
        <p>
          If you are a parent or guardian and believe that your child has
          provided personal data to us, please contact us at{" "}
          <a
            href="mailto:contact@sabtools.in"
            className="text-indigo-600 hover:underline"
          >
            contact@sabtools.in
          </a>{" "}
          so that we can take appropriate action.
        </p>

        {/* ── 12. International Data Transfers ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          12. International Data Transfers
        </h2>
        <p>
          SabTools.in is hosted on Vercel, which operates servers in multiple
          countries. Additionally, the third-party services we use (Google
          Analytics, Google AdSense, and Google Tag Manager) are operated by
          Google LLC, a company headquartered in the United States. As a result,
          your personal data may be transferred to, stored in, and processed in
          countries outside India, including the United States and other
          jurisdictions where Google and Vercel maintain data centres.
        </p>
        <p>
          In accordance with the DPDP Act 2023, we ensure that such transfers
          are made only to countries or territories not restricted by the
          Central Government of India. The third-party processors we engage
          maintain appropriate data protection standards and safeguards,
          including compliance with their respective privacy policies and
          applicable data protection regulations.
        </p>
        <p>
          By using SabTools.in, you consent to the transfer of your data
          outside India as described in this section, subject to the protections
          outlined in this Privacy Policy.
        </p>

        {/* ── 13. Security Measures ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          13. Security Measures
        </h2>
        <p>
          We take the security of your personal data seriously and implement
          appropriate technical and organisational measures to protect it
          against unauthorised access, alteration, disclosure, or destruction.
          These measures include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>HTTPS Encryption:</strong> All data transmitted between your
            browser and our website is encrypted using TLS/SSL (HTTPS)
            protocol.
          </li>
          <li>
            <strong>Secure Hosting:</strong> Our website is hosted on Vercel, a
            platform that employs industry-standard security practices
            including DDoS protection, automated security patching, and secure
            infrastructure.
          </li>
          <li>
            <strong>Access Controls:</strong> Access to personal data is
            restricted to authorised personnel only and is protected by secure
            authentication mechanisms.
          </li>
          <li>
            <strong>Client-Side Processing:</strong> The vast majority of our
            tools process data entirely within your browser, ensuring that
            sensitive information never leaves your device.
          </li>
          <li>
            <strong>Regular Reviews:</strong> We periodically review our data
            collection, storage, and processing practices to ensure they remain
            aligned with this Privacy Policy and applicable laws.
          </li>
          <li>
            <strong>Reasonable Security Safeguards (Section 8):</strong> In
            compliance with Section 8 of the DPDP Act 2023, we implement
            reasonable security safeguards to prevent personal data breaches. In
            the event of a data breach, we will notify the Data Protection Board
            of India and affected Data Principals as required under the Act.
          </li>
        </ul>
        <p className="mt-4">
          While we strive to protect your personal data, please be aware that
          no method of electronic transmission or storage is 100% secure. We
          cannot guarantee absolute security but are committed to taking all
          reasonable steps to safeguard your data.
        </p>

        {/* ── 14. Changes to This Privacy Policy ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          14. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our data practices, legal requirements, or operational needs. When
          we make changes, we will:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Update the &quot;Last updated&quot; date at the top of this page.
          </li>
          <li>
            Post the revised Privacy Policy on this page at{" "}
            <a
              href="https://sabtools.in/privacy"
              className="text-indigo-600 hover:underline"
            >
              https://sabtools.in/privacy
            </a>
            .
          </li>
          <li>
            For significant changes that materially affect how we process your
            personal data, we will provide a prominent notice on our website or
            notify you via email (if you are a newsletter subscriber).
          </li>
        </ul>
        <p>
          Your continued use of SabTools.in after any changes to this Privacy
          Policy constitutes your acceptance of the revised policy. We encourage
          you to review this page periodically to stay informed about how we
          protect your data.
        </p>

        {/* ── 15. Third-Party Links ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          15. Third-Party Links
        </h2>
        <p>
          Our website may contain links to external websites, services, or
          resources that are not operated by us. We are not responsible for the
          privacy practices, content, or security of these third-party websites.
          We encourage you to review the privacy policies of any third-party
          websites you visit through links on our site.
        </p>

        {/* ── 16. Contact Information ── */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8">
          16. Contact Information
        </h2>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our data handling practices, please contact us
          through any of the following means:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:contact@sabtools.in"
              className="text-indigo-600 hover:underline"
            >
              contact@sabtools.in
            </a>
          </li>
          <li>
            <strong>Contact Form:</strong>{" "}
            <a href="/contact" className="text-indigo-600 hover:underline">
              https://sabtools.in/contact
            </a>
          </li>
          <li>
            <strong>Website:</strong>{" "}
            <a
              href="https://sabtools.in"
              className="text-indigo-600 hover:underline"
            >
              https://sabtools.in
            </a>
          </li>
        </ul>

        <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <p className="text-sm text-gray-700">
            This Privacy Policy is governed by the laws of India, including the
            Digital Personal Data Protection Act, 2023. Any disputes arising
            from this policy shall be subject to the exclusive jurisdiction of
            the courts in India.
          </p>
        </div>
      </div>
    </div>
  );
}
