import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Financial Tips, Tax Guides & Tool Tutorials | SabTools.in",
  description:
    "Read expert articles on EMI calculation, SIP investing, GST rates, income tax tips, and how to use free online tools. Practical financial guides for Indians.",
  alternates: { canonical: "https://sabtools.in/blog" },
  openGraph: {
    title: "Blog — Financial Tips, Tax Guides & Tool Tutorials | SabTools.in",
    description:
      "Expert articles on personal finance, tax planning, and free online tools for Indians.",
    url: "https://sabtools.in/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Blog
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Financial tips, tax guides, investment insights, and tool tutorials
          for everyday Indians.
        </p>
        <div className="mt-6 mx-auto w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
      </div>

      <AdBanner format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Color accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-600 text-white uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {post.readTime}
                </span>
              </div>
              <h2 className="font-bold text-gray-900 group-hover:text-indigo-600 transition text-lg mb-3 line-clamp-2 leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5 flex-grow">
                {post.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
                  Read more →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <AdBanner format="horizontal" className="mt-10" />
    </div>
  );
}
