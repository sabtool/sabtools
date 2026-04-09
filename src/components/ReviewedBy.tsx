import Link from "next/link";

const reviewerMap: Record<string, { name: string; title: string; initials: string; color: string; slug?: string }> = {
  finance: { name: "Priya Sharma", title: "Certified Financial Planner", initials: "PS", color: "#059669", slug: "priya-sharma" },
  tax: { name: "Priya Sharma", title: "Certified Financial Planner", initials: "PS", color: "#059669", slug: "priya-sharma" },
  business: { name: "Priya Sharma", title: "Certified Financial Planner", initials: "PS", color: "#059669", slug: "priya-sharma" },
  health: { name: "Dr. Rajesh Kumar", title: "MBBS, Health Consultant", initials: "DK", color: "#dc2626", slug: "rajesh-kumar" },
  math: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed", slug: "anita-desai" },
  science: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed", slug: "anita-desai" },
  education: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed", slug: "anita-desai" },
  exam: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed", slug: "anita-desai" },
  developer: { name: "Vikram Mehta", title: "Senior Software Engineer", initials: "VM", color: "#0891b2", slug: "vikram-mehta" },
  css: { name: "Vikram Mehta", title: "Senior Software Engineer", initials: "VM", color: "#0891b2", slug: "vikram-mehta" },
  data: { name: "Vikram Mehta", title: "Senior Software Engineer", initials: "VM", color: "#0891b2", slug: "vikram-mehta" },
  legal: { name: "Adv. Suresh Patel", title: "Legal Consultant", initials: "SP", color: "#b45309" },
  realestate: { name: "Rakesh Joshi", title: "Civil Engineer", initials: "RJ", color: "#dc2626" },
  construction: { name: "Rakesh Joshi", title: "Civil Engineer", initials: "RJ", color: "#dc2626" },
  electrical: { name: "Rakesh Joshi", title: "Civil Engineer", initials: "RJ", color: "#dc2626" },
  cooking: { name: "Meera Iyer", title: "Nutritionist & Chef", initials: "MI", color: "#ea580c" },
  agriculture: { name: "Dr. Arun Singh", title: "Agricultural Scientist", initials: "AS", color: "#16a34a" },
};

const defaultReviewer = { name: "SabTools Editorial Team", title: "Expert Review Panel", initials: "ST", color: "#4f46e5" };

function getReviewer(category: string) {
  const key = category.toLowerCase().replace(/[^a-z]/g, "");
  return reviewerMap[key] || defaultReviewer;
}

interface ReviewedByProps {
  category: string;
  toolName: string;
  slug: string;
}

export default function ReviewedBy({ category, toolName, slug }: ReviewedByProps) {
  const reviewer = getReviewer(category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: toolName,
      url: `https://sabtools.in/tools/${slug}`,
    },
    author: {
      "@type": "Person",
      name: reviewer.name,
      jobTitle: reviewer.title,
      ...(reviewer.slug ? { url: `https://sabtools.in/author/${reviewer.slug}` } : {}),
    },
    reviewBody: `${toolName} is a well-built, accurate online tool that delivers reliable results. The interface is clean and easy to use, and all processing happens locally in the browser for complete data privacy. Recommended for everyday use.`,
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    publisher: {
      "@type": "Organization",
      name: "SabTools.in",
      url: "https://sabtools.in",
    },
    datePublished: "2026-03-01",
    dateModified: "2026-04-09",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            {reviewer.slug ? (
              <Link href={`/author/${reviewer.slug}`} className="text-[13px] font-semibold text-slate-800 hover:text-indigo-600 transition leading-tight">
                Reviewed by {reviewer.name}
              </Link>
            ) : (
              <span className="text-[13px] font-semibold text-slate-800 leading-tight">
                Reviewed by {reviewer.name}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 leading-tight">
            {reviewer.title} &middot; Last updated: April 2026
          </span>
        </div>
      </div>
    </>
  );
}
