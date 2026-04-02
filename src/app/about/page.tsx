import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { tools, categories } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About SabTools.in — India's Largest Free Online Tools Platform",
  description: `SabTools.in provides ${460}+ free online tools including EMI calculators, SIP calculators, GST tools, text utilities, developer tools, image tools, and more — all built for India. No signup, 100% free.`,
  keywords: ["sabtools", "free online tools", "india tools", "calculator", "converter", "sabtools.in about"],
  alternates: { canonical: "https://sabtools.in/about" },
  openGraph: {
    title: "About SabTools.in — India's Largest Free Online Tools Platform",
    description: "460+ free online tools for calculators, converters, text, developer, image, SEO, and more. Made for India.",
    url: "https://sabtools.in/about",
    type: "website",
    locale: "en_IN",
    siteName: "SabTools.in",
  },
};

export default function AboutPage() {
  const toolCount = tools.length;
  const catCount = categories.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About SabTools.in",
            description: `SabTools.in is India's largest free online tools platform with ${toolCount}+ tools across ${catCount} categories.`,
            url: "https://sabtools.in/about",
            mainEntity: {
              "@type": "Organization",
              name: "SabTools.in",
              url: "https://sabtools.in",
              description: `Free online tools platform with ${toolCount}+ tools for India`,
              foundingDate: "2025",
              areaServed: "India",
            },
          }),
        }}
      />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">About SabTools.in</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          Welcome to <strong>SabTools.in</strong> — India&apos;s largest free online tools platform. We provide <strong>{toolCount}+ utility tools</strong> across <strong>{catCount} categories</strong> including finance calculators, tax tools, text utilities, developer tools, image processors, SEO generators, and much more.
        </p>

        <p>
          Every tool on SabTools.in is 100% free, requires no signup or registration, and works instantly in your browser. Whether you&apos;re a student calculating EMI for education loans, a developer formatting JSON, a business owner generating GST invoices, or a home cook converting recipe measurements — we have a tool for you.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
        <p>
          To make everyday calculations and tasks effortless for every Indian. We believe essential digital tools should be free, fast, and accessible to everyone — from metro cities to rural villages. All our tools are designed with Indian users in mind, supporting INR formatting, Indian tax rules, regional measurements, and both English and Hindi languages.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">What Makes SabTools.in Different?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          {[
            { icon: "💰", title: "100% Free Forever", desc: "No signup, no limits, no hidden charges. Every tool is free to use unlimited times." },
            { icon: "🔒", title: "Privacy First", desc: "All processing happens in your browser. Your data never leaves your device — zero server uploads." },
            { icon: "⚡", title: "Lightning Fast", desc: "Instant results with zero server delays. Tools work even on slow 2G/3G connections once loaded." },
            { icon: "📱", title: "Mobile Friendly", desc: "Responsive design that works perfectly on any Android phone, iPhone, tablet, or computer." },
            { icon: "🇮🇳", title: "Made for India", desc: "Indian number formats, GST rates, tax brackets, bank-specific calculators, Hindi support, and more." },
            { icon: "🌐", title: "Works Offline", desc: "Once a tool page loads, it works without internet. Perfect for areas with poor connectivity." },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Our Tool Categories</h2>
        <p>SabTools.in covers {catCount} categories to serve every need:</p>
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

        <h2 className="text-2xl font-bold text-gray-900">Who Uses SabTools.in?</h2>
        <ul>
          <li><strong>Students</strong> — GPA calculators, percentage converters, exam score predictors, and study planners</li>
          <li><strong>Working Professionals</strong> — Salary calculators, tax planners, EMI tools, and SIP calculators</li>
          <li><strong>Developers</strong> — JSON formatters, Base64 encoders, hash generators, and regex testers</li>
          <li><strong>Business Owners</strong> — GST calculators, invoice generators, profit/loss tools, and ROI calculators</li>
          <li><strong>Content Creators</strong> — Word counters, image compressors, social media tools, and SEO generators</li>
          <li><strong>Home Users</strong> — Age calculators, unit converters, recipe scalers, and health tools</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900">Our Numbers</h2>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { num: `${toolCount}+`, label: "Free Tools" },
            { num: `${catCount}`, label: "Categories" },
            { num: "426+", label: "Hindi Tools" },
            { num: "0", label: "Cost to Use" },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-indigo-50 rounded-xl p-4">
              <div className="text-2xl font-extrabold text-indigo-600">{stat.num}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
        <p>
          Have a suggestion, found a bug, or want to request a new tool? We&apos;d love to hear from you.
          Visit our <Link href="/contact" className="text-indigo-600 hover:underline font-medium">Contact page</Link> or
          email us at <a href="mailto:sabtools.ltd@gmail.com" className="text-indigo-600 hover:underline font-medium">sabtools.ltd@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
