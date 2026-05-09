"use client";
import { getToolComponent } from "@/tools";

/**
 * Pass the page's locale down to the calculator component so each
 * widget can pick the right label set. Phase 6 Round 2 Task B.
 *
 * English tool pages (`/tools/[slug]`) leave the prop unset, defaulting
 * to "en-IN". Hindi tool pages (`/hi/tools/[slug]`) pass "hi-IN"
 * explicitly. Calculators that don't yet have Hindi labels ignore the
 * prop and continue rendering English — incremental adoption.
 */
export default function ToolRenderer({
  slug,
  locale = "en-IN",
}: {
  slug: string;
  locale?: "en-IN" | "hi-IN";
}) {
  const Component = getToolComponent(slug);
  return <Component locale={locale} />;
}
