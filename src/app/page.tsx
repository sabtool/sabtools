import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";
import RecentlyUsed from "@/components/RecentlyUsed";
import FavoriteTools from "@/components/FavoriteTools";
import ToolOfTheDay from "@/components/ToolOfTheDay";
import { categories, tools } from "@/lib/tools";
import { BRAND } from "@/lib/brand";
import { categoryPillars } from "@/lib/category-pillars";
import { getAllPosts } from "@/lib/blog";
import NewsletterSignup from "@/components/NewsletterSignup";
import ResponsiveImage from "@/components/ResponsiveImage";
import { authors } from "@/lib/authors";
import {
  SITE_URL,
  SUPPORTED_LANGUAGES,
  organizationNode,
  webSiteNode,
  personNode,
  faqPageNode,
  buildGraph,
} from "@/lib/schema";

export default function HomePage() {
  const popularTools = [
    "emi-calculator", "sip-calculator", "gst-calculator", "age-calculator",
    "word-counter", "json-formatter", "image-compressor", "percentage-calculator",
  ];

  const popular = popularTools.map((slug) => tools.find((t) => t.slug === slug)!).filter(Boolean);

  // Topic Hubs — categories that have a full pillar guide. Rendered as the
  // first content block after the hero so the homepage's primary signal to
  // Google is "this site has 30 topic-cluster hubs", not "this site has a
  // long unsorted tool list" (Advanced SEO Strategy §3.3 — topical authority).
  // Order is hand-picked with the highest-intent verticals first.
  const pillarHubOrder = [
    "finance", "tax", "business", "indiaguide", "realestate", "vehicle", "health",
    "education", "exam", "career", "legal", "construction", "agriculture", "electrical",
    "developer", "ai", "seo", "image", "pdf", "text", "math", "science",
    "converters", "datetime", "charts", "data", "css", "security", "utility",
    "cooking", "wedding", "shopping", "whatsapp", "social", "student",
    "fun", "astrology",
  ];
  const topicHubs = pillarHubOrder
    .filter((slug) => categoryPillars[slug])
    .map((slug) => {
      const cat = categories.find((c) => c.slug === slug);
      const pillar = categoryPillars[slug];
      const count = tools.filter((t) => t.category === slug).length;
      return cat ? { cat, pillar, count } : null;
    })
    .filter((x): x is { cat: typeof categories[number]; pillar: typeof categoryPillars[string]; count: number } => x !== null);

  const homepageFaqs = [
    {
      q: "Is SabTools.in completely free?",
      a: `Yes! All ${BRAND.totalTools}+ tools on SabTools.in are 100% free with no signup, no limits, and no hidden fees. Every tool runs directly in your browser.`,
    },
    {
      q: "Is my data safe on SabTools.in?",
      a: "Absolutely. All tools process your data locally in your browser using client-side JavaScript. No files or data are uploaded to any server. Your privacy is fully protected.",
    },
    {
      q: "How many tools does SabTools.in have?",
      a: `SabTools.in offers ${BRAND.totalTools}+ free online tools across ${BRAND.totalCategories} categories including Finance Calculators, AI Writing Tools, Developer Tools, Image Tools, PDF Tools, SEO Tools, and more.`,
    },
    {
      q: "Does SabTools.in work on mobile phones?",
      a: "Yes, SabTools.in is fully responsive and works on all devices — mobile phones, tablets, and desktops. You can even install it as a PWA (Progressive Web App) for quick access.",
    },
    {
      q: "Do I need to create an account to use tools?",
      a: "No account or signup is required. Simply visit any tool page and start using it immediately. All tools are accessible without any registration.",
    },
  ];

  // Build sameAs URL list from author socialLinks for the founder.
  const founder = authors.find((a) => a.slug === "rakesh-seervi")!;
  const founderSameAs: string[] = [];
  if (founder.socialLinks?.twitter) founderSameAs.push(`https://twitter.com/${founder.socialLinks.twitter}`);
  if (founder.socialLinks?.linkedin) founderSameAs.push(`https://www.linkedin.com/in/${founder.socialLinks.linkedin}`);

  // Single @graph with all homepage entities — Organization anchors the Knowledge
  // Graph identity; other pages across the site link back to it via @id (see lib/schema.ts).
  // The Person nodes for every named expert author are emitted here too so the
  // homepage acts as the canonical authority hub for E-E-A-T signals; subpages
  // reference each author via personIdFor(slug) without re-declaring them.
  // organizationNode() now includes member references inline (Batch 42), so
  // the homepage no longer needs to override the array — same Org schema
  // surfaces consistently on every page that emits it.

  const homepageGraph = buildGraph([
    organizationNode(),
    webSiteNode(),
    // Founder gets the rich personNode treatment with full credentials —
    // FOUNDER_ID matches personIdFor("rakesh-seervi") so anywhere that
    // references FOUNDER_ID resolves to this canonical Person entity.
    personNode({
      slug: founder.slug,
      name: founder.name,
      jobTitle: founder.role,
      description: founder.bio,
      knowsAbout: founder.expertise,
      sameAs: founderSameAs,
    }),
    // Other named authors as full Person nodes too — gives every blog post
    // and tool page a real human entity to attribute through.
    ...authors
      .filter((a) => a.slug !== founder.slug)
      .map((a) => {
        const sameAs: string[] = [];
        if (a.socialLinks?.twitter) sameAs.push(`https://twitter.com/${a.socialLinks.twitter}`);
        if (a.socialLinks?.linkedin) sameAs.push(`https://www.linkedin.com/in/${a.socialLinks.linkedin}`);
        return personNode({
          slug: a.slug,
          name: a.name,
          jobTitle: a.role,
          description: a.bio,
          knowsAbout: a.expertise,
          sameAs,
        });
      }),
    // NOTE: Two ItemList blocks (Popular Tools, Topic Hub Guides) lived here
    // until 2026-05-13. The Rich Results Test flagged BOTH as "invalid
    // Carousels" because Google's Carousel rich-result feature only accepts
    // these inner @type values: Course, Movie, Recipe, Restaurant. Calculator
    // tools and category-guide pages don't fit any of them, so every emit
    // was being marked invalid in Search Console and contributing zero rich-
    // result eligibility. Removing the ItemLists is a pure win: the visible
    // homepage already surfaces every tool/category as a regular <a> link,
    // so Googlebot still crawls and discovers them. The remaining JSON-LD
    // (Organization, WebSite + SearchAction, Person × N, FAQPage) is what
    // actually drives rich results on this URL.
    //
    // If we ever want to restore structured topic-hub signalling, the right
    // place is each /category/[slug] page's own JSON-LD (Article or
    // CollectionPage with `about`/`hasPart`), not a homepage ItemList.
    faqPageNode(homepageFaqs, SUPPORTED_LANGUAGES[0]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageGraph) }} />

      {/* Hero Section */}
      <section className="relative overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
        <div className="absolute inset-0 opacity-30 hero-pattern" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          {/* LCP fix (brief 2026-06-17): the H1 below is the homepage LCP
              element. Wrapping it in `animate-fade-in-up` (which starts at
              opacity:0) made Chrome record LCP only after the 0.5s fade —
              real-user LCP was 6008ms on mobile (PostHog, n=26). The hero now
              paints immediately; the fade is kept only for the search bar. */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium text-indigo-600 shadow-sm border border-indigo-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {BRAND.totalTools}+ Free Tools — No Signup Required
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="text-gray-900">All </span>
              <span className="gradient-text">Free Online Tools</span>
              <br />
              <span className="text-gray-900"> in One Place</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Calculators, Converters, Text Tools, Developer Tools, Image Tools & more.
              100% free, fast and easy to use. Built for India.
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <AdBanner format="horizontal" />
      </div>

      {/* Topic Guides — the homepage's primary topical-authority signal.
          Sits above the popular-tools grid so the first thing Google sees
          after the hero is "30 pillar topic hubs", not a tool dump.
          Cards link to /category/{slug} where the full pillar guide lives.
       */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-8 flex-col sm:flex-row gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">📚 Explore Topic Guides</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Deep, India-focused guides for every category — read these before picking a tool, or use the tool grid below.
            </p>
          </div>
          <Link
            href="#all-tools"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition shrink-0"
          >
            Skip to tool list →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topicHubs.map(({ cat, pillar, count }) => {
            // Trim the pillar's whatIs to the first sentence (or 140 chars)
            // so the card stays visually balanced and crawlers see a unique
            // teaser per hub instead of the same boilerplate everywhere.
            const teaser = (() => {
              const text = pillar.whatIs.trim();
              const sentenceEnd = text.search(/[.!?]\s/);
              const cut = sentenceEnd > 60 && sentenceEnd <= 180 ? sentenceEnd + 1 : 140;
              return text.length <= cut ? text : text.slice(0, cut).trim() + "…";
            })();
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-xl shadow-sm group-hover:scale-105 transition`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition">
                      {cat.name} Guide
                    </h3>
                    <p className="text-xs text-gray-500">{count} tools · India-focused</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{teaser}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                  Read the {cat.name} guide
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tool of the Day */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <ToolOfTheDay />
      </div>

      {/* Recently Used Tools */}
      <RecentlyUsed />

      {/* Favorite Tools */}
      <FavoriteTools />

      {/* Popular Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🔥 Most Popular Tools</h2>
          <p className="text-gray-500 mt-2">Our most-used tools by millions of Indians</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Compact category nav — every category gets a homepage link, but
          we no longer duplicate the rich pillar-card presentation done in
          the Topic Guides section above. This gives crawlers the full set
          of category links and users a quick jump-list, without making
          the homepage feel redundant. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">📂 All Categories</h2>
          <p className="text-gray-500 mt-2">Jump to any category — {categories.length} in total</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full text-sm font-medium text-gray-700 hover:text-indigo-700 transition shadow-sm"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner format="horizontal" />
      </div>

      {/* All Tools Section */}
      <section id="all-tools" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">🛠️ All Tools</h2>
          <p className="text-gray-500 mt-2">Complete list of all {BRAND.totalTools} free online tools</p>
        </div>
        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat.slug);
          return (
            <div key={cat.slug} className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>{cat.icon}</span> {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Latest Blog Posts — homepage-to-blog internal links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Latest Guides & Tips</h2>
          <p className="text-gray-500 mt-2">Learn how to make the most of our free tools</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {getAllPosts().slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
            >
              {post.image && (
                <ResponsiveImage
                  src={post.image.src}
                  alt={post.image.alt}
                  width={400}
                  height={210}
                  className="w-full h-36 object-cover"
                  // No `priority` — these blog cards are below-fold on the
                  // homepage. Lazy-load is the default.
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
              <div className="p-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  {post.category}
                </span>
                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition text-sm mt-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <NewsletterSignup />
      </section>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose SabTools.in?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Lightning Fast", desc: "All tools run instantly in your browser. No server delays." },
              { icon: "🔒", title: "100% Private", desc: "Your data never leaves your device. Everything runs locally." },
              { icon: "🆓", title: "Completely Free", desc: "No signup, no limits, no hidden fees. Free forever." },
              { icon: "📱", title: "Mobile Friendly", desc: "Works perfectly on phone, tablet and desktop." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section — visible for users + rich snippets for Google */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2">Everything you need to know about SabTools.in</p>
        </div>
        <div className="space-y-4">
          {homepageFaqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                {faq.q}
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
