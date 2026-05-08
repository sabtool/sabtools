import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { tools, categories } from "@/lib/tools";
import { authors } from "@/lib/authors";
import { BRAND } from "@/lib/brand";
import {
  SITE_URL,
  ORG_ID,
  SUPPORTED_LANGUAGES,
  organizationNode,
  breadcrumbNode,
  faqPageNode,
  buildGraph,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "About SabTools.in — India's Largest Free Online Tools Platform",
  description: `SabTools.in provides ${BRAND.totalTools}+ free online tools including EMI calculators, SIP calculators, GST tools, text utilities, developer tools, image tools, and more — all built for India. No signup, 100% free.`,
  keywords: ["sabtools", "free online tools", "india tools", "calculator", "converter", "sabtools.in about"],
  alternates: { canonical: "https://sabtools.in/about" },
  openGraph: {
    title: "About SabTools.in — India's Largest Free Online Tools Platform",
    description: `${BRAND.totalTools}+ free online tools for calculators, converters, text, developer, image, SEO, and more. Made for India.`,
    url: "https://sabtools.in/about",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
    images: [{ url: "https://sabtools.in/og-image.png", width: 1200, height: 630, alt: "About SabTools.in" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SabTools.in — India's Largest Free Online Tools Platform",
    description: `${BRAND.totalTools}+ free online tools for calculators, converters, text, developer, image, SEO, and more. Made for India.`,
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        alt: "About SabTools.in",
      },
    ],
    creator: "@sabtools",
    site: "@sabtools",
  },
};

const teamMembers = authors;

export default function AboutPage() {
  // Visible counts MUST match BRAND constants — see src/lib/brand.ts
  // (per AI Visibility Action Plan: Org/JSON-LD/visible HTML must agree).
  const toolCount = BRAND.totalTools;
  const catCount = BRAND.totalCategories;

  // About-page FAQ — 8 questions covering pricing, signup, offline, privacy,
  // languages, attribution, requests, and accuracy. Both rendered as visible
  // HTML and emitted as FAQPage JSON-LD inside the same @graph below so
  // Google sees one canonical FAQ-block per page (avoids duplicate-FAQ
  // warnings in Search Console). All answers derive numbers from BRAND.
  const aboutFaqs: { q: string; a: string }[] = [
    {
      q: "Is SabTools.in completely free?",
      a: `Yes. Every one of the ${toolCount}+ tools on SabTools.in is free to use — no subscriptions, no premium tier, no usage limits. The site is funded entirely through unobtrusive display ads, so there is nothing to pay or unlock.`,
    },
    {
      q: "Do I need to sign up or create an account?",
      a: "No. SabTools.in does not have user accounts at all. You can open any tool and start using it immediately. We don't collect names, emails, or phone numbers, and we don't run a login system that could be breached.",
    },
    {
      q: "Does SabTools.in work without internet?",
      a: "Most tools work offline once the page has loaded once. The site is a statically generated, client-side application — calculations run in your browser, not on a server. You can install SabTools.in as a Progressive Web App on Android or iOS for fully offline access.",
    },
    {
      q: "How is my data protected when I use a tool?",
      a: "Your inputs never leave your device. Whether you are calculating EMI on a ₹50 lakh home loan, formatting a private JSON payload, or compressing a personal photo, the computation runs entirely in your browser. No data is uploaded, logged, or stored on our servers — there is no server-side processing for any tool.",
    },
    {
      q: "What languages does SabTools.in support?",
      a: `English and Hindi. ${BRAND.hindiTools}+ of our ${toolCount}+ tools have full Hindi versions available at /hi, including the EMI calculator, GST calculator, and income tax calculator. Hindi pages declare hreflang correctly so Google serves the right language to the right user.`,
    },
    {
      q: "Who built SabTools.in?",
      a: `SabTools.in was founded in ${BRAND.founded} by ${BRAND.founder} in India. The platform is maintained by a small team of engineers, financial experts, educators, and healthcare professionals — the same team listed on the "Meet Our Team" section above. Each tool category is reviewed by a domain expert before publication.`,
    },
    {
      q: "How do I request a new tool or report a bug?",
      a: "Email contact@sabtools.in or use the form on our Contact page. We genuinely read every message. If your suggestion is something other Indian users would benefit from — a new tax slab calculator after a budget announcement, a state-specific stamp-duty tool, a regional festival calendar — it usually ships within 2–4 weeks.",
    },
    {
      q: "Are the calculations accurate?",
      a: "Yes — within the constraints of the inputs you provide. Our finance calculators use the exact formulas published by RBI and major Indian banks (SBI, HDFC, ICICI). Tax calculators follow the latest Income Tax Department slabs for FY 2025-26 and FY 2026-27. That said, results are for informational purposes — always confirm with a qualified financial advisor or chartered accountant before signing a loan, filing a return, or making a major investment.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildGraph([
              {
                "@type": "AboutPage",
                "@id": `${SITE_URL}/about#aboutpage`,
                name: "About SabTools.in",
                description: `SabTools.in is a free online tools platform with ${toolCount}+ tools across ${catCount} categories built for Indian users.`,
                url: `${SITE_URL}/about`,
                inLanguage: "en-IN",
                mainEntity: { "@id": ORG_ID },
                isPartOf: { "@id": `${SITE_URL}/#website` },
              },
              // Full Organization definition — matches the homepage entity via @id,
              // giving the About page explicit publisher authority for quality raters.
              organizationNode(),
              breadcrumbNode([
                { name: "Home", url: `${SITE_URL}/` },
                { name: "About Us" },
              ]),
              // FAQPage emitted inside the same @graph (NOT a separate <script>)
              // so Google parses one merged document — avoids the "duplicate
              // FAQPage" warning some pages generate when FAQ schema is shipped
              // out-of-band of the page's main graph.
              faqPageNode(aboutFaqs, SUPPORTED_LANGUAGES[0]),
            ])
          ),
        }}
      />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">About SabTools.in</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          <strong>SabTools.in</strong> is India&apos;s largest free online tools platform with <strong>{toolCount}+ utility tools</strong> across <strong>{catCount} categories</strong>. From finance calculators and tax tools to developer utilities, image processors, and SEO generators — every tool is built specifically for Indian users.
        </p>

        <p>
          We launched in 2025 with a straightforward goal: give every Indian access to the digital tools they need without paywalls, signups, or data collection. Whether you are a college student in Jaipur calculating your CGPA, a small business owner in Surat generating a GST invoice, or a software developer in Bangalore formatting JSON — SabTools.in has you covered.
        </p>

        {/* Our Story */}
        <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
        <p>
          SabTools.in started from a personal frustration. Our founder, Rakesh Seervi, noticed that most online calculator and tool websites were either cluttered with ads, required paid accounts for basic features, or simply did not support Indian formats — no INR, no lakhs and crores, no GST slabs. The tools that did work for India were often slow, outdated, or collected user data unnecessarily.
        </p>
        <p>
          So he built the first version of SabTools.in with 50 tools, focusing on what Indian users actually needed: EMI calculators that match bank formulas, GST tools with correct slab rates, and text utilities that handle Hindi alongside English. The response was immediate — users from across India started sharing the tools in WhatsApp groups, college forums, and office Slack channels. Within months, the platform grew to {toolCount}+ tools spanning {catCount} categories.
        </p>
        <p>
          Today, every tool on SabTools.in runs entirely in your browser. No data goes to any server. Your financial details, personal documents, and private information stay on your device — always. That is not just a feature; it is a founding principle.
        </p>

        {/* Mission */}
        <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
        <p>
          To make everyday digital tasks effortless for every Indian, regardless of their location, device, or internet speed. We believe essential tools should be free, private, and fast. All our tools support Indian number systems, tax rules, regional units of measurement, and both English and Hindi languages. Our static architecture means tools load fast even on 2G connections and work offline once loaded.
        </p>

        {/* What Makes Us Different */}
        <h2 className="text-2xl font-bold text-gray-900">What Makes SabTools.in Different?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          {[
            { icon: "💰", title: "100% Free Forever", desc: "No signup, no limits, no hidden charges. Every tool is free to use unlimited times. No premium tiers or feature gates." },
            { icon: "🔒", title: "Privacy First", desc: "All processing happens in your browser. Your data never leaves your device — zero server uploads, zero tracking of your inputs." },
            { icon: "⚡", title: "Lightning Fast", desc: "Static site architecture with CDN delivery. Tools load in under 2 seconds and work even on slow connections once loaded." },
            { icon: "📱", title: "Mobile Friendly", desc: "Responsive design tested on budget Android phones, iPhones, tablets, and desktops. Optimized for the devices most Indians actually use." },
            { icon: "🇮🇳", title: "Built for India", desc: "Indian number formats (lakhs, crores), GST rates, RBI formulas, CBSE grading, Hindi language support, and India-specific tools you won't find elsewhere." },
            { icon: "👨‍💼", title: "Expert Reviewed", desc: "Every tool category is reviewed by domain experts — certified financial planners, engineers, doctors, and educators verify accuracy." },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Our Team */}
        <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
        <p>
          Behind SabTools.in is a team of engineers, financial experts, educators, and healthcare professionals who ensure every tool is accurate, fast, and genuinely useful.
        </p>

        <div className="not-prose space-y-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div
                className="w-12 h-12 min-w-[48px] rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/author/${member.slug}`} className="font-bold text-gray-900 hover:text-indigo-700 transition">{member.name}</Link>
                  {member.socialLinks?.linkedin && (
                    <a href={`https://linkedin.com/in/${member.socialLinks.linkedin}`} target="_blank" rel="nofollow noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition" aria-label={`${member.name} LinkedIn`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  )}
                </div>
                <p className="text-sm text-indigo-600 font-medium mb-1">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <h2 className="text-2xl font-bold text-gray-900">Our Tool Categories</h2>
        <p>SabTools.in covers {catCount} categories to serve virtually every calculation, conversion, and utility need:</p>
        <div className="not-prose flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* Who Uses SabTools */}
        <h2 className="text-2xl font-bold text-gray-900">Who Uses SabTools.in?</h2>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: "🎓", title: "Students", desc: "GPA calculators, percentage converters, exam score predictors, study planners, and board result tools" },
            { icon: "💼", title: "Working Professionals", desc: "Salary calculators, HRA/TDS tools, EMI planners, SIP calculators, and resume builders" },
            { icon: "💻", title: "Developers & Engineers", desc: "JSON formatters, Base64 encoders, hash generators, regex testers, and CSS generators" },
            { icon: "🏪", title: "Business Owners", desc: "GST calculators, invoice generators, profit/loss tools, ROI calculators, and break-even analysis" },
            { icon: "✍️", title: "Content Creators", desc: "Word counters, image compressors, social media tools, plagiarism checkers, and SEO generators" },
            { icon: "🏠", title: "Home Users", desc: "Age calculators, recipe converters, unit converters, health tools, and wedding planners" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <span className="text-xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Our Numbers */}
        <h2 className="text-2xl font-bold text-gray-900">SabTools.in in Numbers</h2>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { num: `${toolCount}+`, label: "Free Tools" },
            { num: `${catCount}`, label: "Categories" },
            { num: `${BRAND.hindiTools}+`, label: "Hindi Tools" },
            { num: "3,000+", label: "Total Pages" },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-indigo-50 rounded-xl p-4">
              <div className="text-2xl font-extrabold text-indigo-600">{stat.num}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Technology */}
        <h2 className="text-2xl font-bold text-gray-900">Our Technology</h2>
        <p>
          SabTools.in is built on modern web technology for maximum speed and reliability. The entire platform is a statically generated site, meaning every page is pre-built and served from a global CDN. This gives us sub-second load times across India, strong security with no server-side vulnerabilities, and the ability to work offline once loaded. All calculations happen client-side using JavaScript — your data never touches our servers.
        </p>

        {/* FAQ — visible HTML mirrors the FAQPage JSON-LD emitted in the
            page graph above. Schema.org rich-results guidelines require the
            answer text in the schema to match what users actually see, so
            both blocks are derived from the same `aboutFaqs` array. */}
        <h2 className="text-2xl font-bold text-gray-900" id="faq">Frequently Asked Questions</h2>
        <p className="text-gray-600">
          Common questions we get from new visitors. If your question is not
          answered here, write to us at{" "}
          <a href="mailto:contact@sabtools.in" className="text-indigo-600 hover:underline font-medium">
            contact@sabtools.in
          </a>
          .
        </p>
        <div className="not-prose space-y-3">
          {aboutFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition"
            >
              <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{faq.q}</h3>
                <svg
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-gray-700 text-sm sm:text-base leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Contact */}
        <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
        <p>
          Have a suggestion, found a bug, or want to request a new tool? We genuinely read every message.
          Visit our <Link href="/contact" className="text-indigo-600 hover:underline font-medium">Contact page</Link> or
          email us directly at <a href="mailto:contact@sabtools.in" className="text-indigo-600 hover:underline font-medium">contact@sabtools.in</a>.
        </p>
        <p className="text-sm text-gray-500">
          SabTools.in is an Indian digital tools platform. Registered in India. All tools are provided as-is for informational and utility purposes. For professional financial, legal, or medical decisions, always consult a qualified expert.
        </p>
      </div>
    </div>
  );
}
