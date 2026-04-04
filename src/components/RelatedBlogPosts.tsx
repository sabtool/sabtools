import Link from "next/link";
import { getAllPosts, type BlogPost } from "@/lib/blog";

/**
 * Shows related blog posts on tool pages — creates tool-to-blog internal links.
 * Matches by toolSlug (exact), category, or keyword overlap.
 */
export default function RelatedBlogPosts({
  toolSlug,
  category,
  keywords,
}: {
  toolSlug: string;
  category: string;
  keywords: string[];
}) {
  const allPosts = getAllPosts();
  const toolKeywords = new Set(keywords.map((k) => k.toLowerCase()));

  // Score each post by relevance
  const scored = allPosts
    .map((post) => {
      let score = 0;
      // Exact tool match
      if (post.toolSlug === toolSlug) score += 10;
      // Same category
      if (post.category.toLowerCase() === category.toLowerCase()) score += 3;
      // Keyword overlap
      const postKeywords = (post.keywords || []).map((k) => k.toLowerCase());
      const overlap = postKeywords.filter((k) => toolKeywords.has(k)).length;
      score += overlap;
      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scored.map(({ post }) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition group"
          >
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 mb-2">
              {post.category}
            </span>
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition line-clamp-2 mb-1">
              {post.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2">{post.description}</p>
            <span className="text-xs text-gray-400 mt-2 block">{post.readTime}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
