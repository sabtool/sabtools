import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { categories, tools } from "@/lib/tools";
import { authors, getAuthorBySlug, getAuthorByCategory } from "@/lib/authors";
import { getAllPosts, type BlogPost } from "@/lib/blog";
import {
  SITE_URL,
  personNode,
  personIdFor,
  breadcrumbNode,
  breadcrumbIdFor,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";

/* ── Static params for all author pages ── */
export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};

  const title = `${author.name} — ${author.role} at SabTools.in`;
  const description = `Meet ${author.name}, ${author.role} at SabTools.in. ${author.bio}`;
  const url = `https://sabtools.in/author/${author.slug}`;

  // Split the display name into firstName / familyName for OG profile
  // fields. Strip a leading honorific (Dr., Prof., Mr., etc.) since the
  // honorific is not the given name — same logic as personNode().
  const cleanName = author.name.replace(/^(Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "");
  const nameParts = cleanName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

  return {
    title,
    description,
    keywords: [author.name, author.role, "sabtools team", "sabtools expert", ...author.expertise.slice(0, 4)],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      // OG profile fields — Facebook, LinkedIn use these to render the
      // author byline accurately on share previews. `username` mirrors
      // the URL slug so the link resolves to /author/{slug}.
      firstName,
      ...(lastName ? { lastName } : {}),
      username: author.slug,
      locale: "en_IN",
      siteName: "SabTools.in",
      images: [{ url: "https://sabtools.in/og-image.png", width: 1200, height: 630, alt: title, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://sabtools.in/og-image.png"],
      creator: "@sabtools",
      site: "@sabtools",
    },
  };
}

/* ── Author Profile Page ── */
export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return notFound();

  /* Resolve category objects for this author */
  const authorCategories = author.categories
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as (typeof categories)[number][];

  /* Resolve posts attributed to this author. The blog detail page (Batch 21)
     resolves the author of each post via getAuthorByCategory(post.toolSlug
     → tool.category). We replicate that chain here so the author profile
     page surfaces only the posts that are *actually* attributed to them
     in the Article.author @id. Founder is the fallback for posts where
     no expert claims the category — we mirror that on the founder's
     profile page so /author/rakesh-seervi shows uncovered-category
     posts, not just his own categories. */
  const allPosts = getAllPosts();
  const founderSlug = "rakesh-seervi";
  const isFounder = author.slug === founderSlug;
  const authorPosts: BlogPost[] = allPosts
    .filter((post) => {
      if (!post.toolSlug) return isFounder; // unattributed posts attribute to the founder
      const t = tools.find((tt) => tt.slug === post.toolSlug);
      if (!t) return isFounder;
      const expert = getAuthorByCategory(t.category);
      const resolvedSlug = expert?.slug ?? founderSlug;
      return resolvedSlug === author.slug;
    })
    // Most recent first — the visible list and the schema both surface
    // the freshest content as the strongest authority signal.
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  // Cap the visible list and the schema reference at 10 posts. Beyond
  // that the schema gets noisy without helping discovery (the sitemap
  // already lists every post for full crawl coverage).
  const visibleAuthorPosts = authorPosts.slice(0, 10);

  /* Collect social profile URLs once so both Person.sameAs and the rendered
     buttons stay in sync. */
  const socialLinks: string[] = [];
  if (author.socialLinks?.twitter) socialLinks.push(`https://twitter.com/${author.socialLinks.twitter}`);
  if (author.socialLinks?.linkedin) socialLinks.push(`https://www.linkedin.com/in/${author.socialLinks.linkedin}`);

  const personId = personIdFor(author.slug);
  const profileUrl = `${SITE_URL}/author/${author.slug}`;
  const profilePageId = `${profileUrl}#profilepage`;
  const breadcrumbId = breadcrumbIdFor(profileUrl);

  /* Single @graph: ProfilePage → Person → references Organization via @id.
     The Person uses a stable @id so tools, blog posts, and the homepage can
     all link back to the same author entity in the Knowledge Graph.
     personNode() centralises the canonical Person shape — same builder is
     used on the homepage so the two emissions can never drift apart.

     Cohesion notes:
     - ProfilePage.dateModified bumps with BUILD_DATE so any author-bio edit
       is signalled to crawlers on the very next deploy.
     - ProfilePage.breadcrumb cross-references the BreadcrumbList by @id,
       matching the WebPage ↔ BreadcrumbList pattern on tool/calc pages.
     - Person.mainEntityOfPage → ProfilePage closes the bidirectional loop
       (ProfilePage.mainEntity → Person was already there). */
  const authorGraph = buildGraph([
    {
      "@type": "ProfilePage",
      "@id": profilePageId,
      name: `${author.name} — ${author.role}`,
      description: author.bio,
      url: profileUrl,
      inLanguage: "en-IN",
      mainEntity: { "@id": personId },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": personId },
      breadcrumb: { "@id": breadcrumbId },
      dateModified: BUILD_DATE,
      // Voice-search optimisation — when a user asks Google Assistant
      // "Who is {author.name}?", the bio paragraphs are the cleanest
      // read-out (no headings, no nav chrome, no buttons).
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#bio-speakable p"],
      },
    },
    {
      ...personNode({
        slug: author.slug,
        name: author.name,
        jobTitle: author.role,
        description: author.bio,
        knowsAbout: author.expertise,
        sameAs: socialLinks,
        mainEntityOfPage: profilePageId,
      }),
      // Person.subjectOf — articles authored/reviewed by this person.
      // Each Article's @id is the same one declared on /blog/{slug}#article
      // so the entity graph treats them as one canonical Article entity
      // referenced from both the post detail page (Article.author → Person)
      // and the author profile page (Person.subjectOf → Article). Closes
      // the bidirectional Person ↔ Article relationship that was previously
      // one-way.
      ...(visibleAuthorPosts.length > 0
        ? {
            subjectOf: visibleAuthorPosts.map((post) => ({
              "@id": `${SITE_URL}/blog/${post.slug}#article`,
            })),
          }
        : {}),
    },
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "About", url: `${SITE_URL}/about` },
        { name: author.name },
      ],
      breadcrumbId
    ),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: author.name },
        ]}
      />

      {/* JSON-LD @graph: ProfilePage + Person + BreadcrumbList, linked via @id */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorGraph) }}
      />

      {/* Author Header */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div
            className="w-20 h-20 min-w-[80px] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
            style={{ backgroundColor: author.color }}
          >
            {author.initials}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{author.name}</h1>
            <p className="text-lg text-indigo-600 font-semibold mt-1">{author.role}</p>
            <p className="text-gray-600 mt-3 leading-relaxed max-w-2xl">{author.bio}</p>
            {/* Social links */}
            {(author.socialLinks?.twitter || author.socialLinks?.linkedin) && (
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                {author.socialLinks.twitter && (
                  <a
                    href={`https://twitter.com/${author.socialLinks.twitter}`}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    @{author.socialLinks.twitter}
                  </a>
                )}
                {author.socialLinks.linkedin && (
                  <a
                    href={`https://www.linkedin.com/in/${author.socialLinks.linkedin}`}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Bio — id is a stable hook for Speakable. Voice
          assistants read aloud the bio paragraphs when the user asks
          "Who is {author.name}?" via Google Assistant. */}
      <div id="bio-speakable" className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About {author.name.split(" ")[0]}</h2>
        <div className="prose prose-gray max-w-none">
          {author.longBio.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Areas of Expertise */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {author.expertise.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Articles by Author — closes the visible side of the
          Person ↔ Article bidirectional link declared in the schema
          above. Shows the 6 most recent posts attributed to this author
          (out of the 10 the schema references). Internal-link signal
          plus an active-author E-E-A-T cue ("this expert is currently
          publishing"). */}
      {visibleAuthorPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Articles by {author.name.split(" ")[0]}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleAuthorPosts.slice(0, 6).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-1 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition text-sm leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{post.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
          {authorPosts.length > 6 && (
            <p className="text-sm text-gray-500 mt-3">
              {author.name.split(" ")[0]} has reviewed {authorPosts.length} articles in total.{" "}
              <Link href="/blog" className="text-indigo-600 hover:underline font-medium">
                Browse all blog posts →
              </Link>
            </p>
          )}
        </div>
      )}

      {/* Categories Reviewed */}
      {authorCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories Reviewed</h2>
          <p className="text-gray-600 mb-4">
            {author.name} reviews and ensures the accuracy of tools in the following categories on SabTools.in:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {authorCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Why Trust This Expert? */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Trust {author.name.split(" ").pop()}?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 min-w-[32px] rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Verified Credentials</h3>
              <p className="text-xs text-gray-600 mt-0.5">Professional qualifications and real-world experience in {author.expertise[0].toLowerCase()}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 min-w-[32px] rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Expert Review Process</h3>
              <p className="text-xs text-gray-600 mt-0.5">Every tool in their domain is personally reviewed for accuracy and compliance</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 min-w-[32px] rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">India-Specific Knowledge</h3>
              <p className="text-xs text-gray-600 mt-0.5">Deep understanding of Indian standards, regulations, and user needs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 min-w-[32px] rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Regular Updates</h3>
              <p className="text-xs text-gray-600 mt-0.5">Tools are updated whenever policies, rates, or guidelines change in India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to About */}
      <div className="text-center">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Meet the Full Team
        </Link>
      </div>
    </div>
  );
}
