import Link from "next/link";
import { getAuthorByCategory, type Author } from "@/lib/authors";
import { BUILD_MONTH_YEAR } from "@/lib/schema";

/**
 * Visible "Reviewed by" byline shown beneath each tool's FAQ block.
 *
 * Uses the same `getAuthorByCategory()` helper that powers the schema-level
 * E-E-A-T attribution (WebApplication.author, Article.author,
 * CollectionPage.reviewedBy) so the visible byline and the structured-data
 * author can never drift apart. When no author claims the category, falls
 * back to the founder rather than inventing a phantom reviewer — every
 * named human on this surface has a real `/author/{slug}` profile page
 * with a full Person schema, which is what Google's E-E-A-T signal
 * actually rewards.
 *
 * "Last updated" derives from `BUILD_MONTH_YEAR` so the human label and
 * the schema `dateModified` both bump on each Vercel deploy.
 */

interface ReviewedByProps {
  /** Tool category slug, e.g. "finance" or "css". */
  category: string;
}

export default function ReviewedBy({ category }: ReviewedByProps) {
  // Only render a byline when a real author genuinely covers this
  // category. No fallback: claiming review by someone outside their
  // declared expertise is an E-E-A-T liability, not a signal — for
  // categories without a qualified reviewer we show nothing.
  const reviewer: Author | undefined = getAuthorByCategory(category);
  if (!reviewer) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border border-indigo-100 rounded-[10px] bg-slate-50 max-w-[480px] mt-4">
      <div
        className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-white text-sm font-bold tracking-wide"
        style={{ backgroundColor: reviewer.color }}
      >
        {reviewer.initials}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="min-w-[16px]" aria-hidden="true">
            <circle cx="8" cy="8" r="8" fill="#16a34a" />
            <path d="M5 8.5L7 10.5L11 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link
            href={`/author/${reviewer.slug}`}
            className="text-[13px] font-semibold text-slate-800 hover:text-indigo-600 transition leading-tight"
          >
            Reviewed by {reviewer.name}
          </Link>
        </div>
        <span className="text-xs text-slate-500 leading-tight">
          {reviewer.role} &middot; Last updated: {BUILD_MONTH_YEAR}
        </span>
      </div>
    </div>
  );
}
