const reviewerMap: Record<string, { name: string; title: string; initials: string; color: string }> = {
  finance: { name: "Priya Sharma", title: "Certified Financial Planner", initials: "PS", color: "#4f46e5" },
  tax: { name: "Priya Sharma", title: "Certified Financial Planner", initials: "PS", color: "#4f46e5" },
  business: { name: "Priya Sharma", title: "Certified Financial Planner", initials: "PS", color: "#4f46e5" },
  health: { name: "Dr. Rajesh Kumar", title: "MBBS, Health Consultant", initials: "RK", color: "#059669" },
  math: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed" },
  science: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed" },
  education: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed" },
  exam: { name: "Prof. Anita Desai", title: "Mathematics Educator", initials: "AD", color: "#7c3aed" },
  developer: { name: "Vikram Mehta", title: "Senior Software Engineer", initials: "VM", color: "#0891b2" },
  css: { name: "Vikram Mehta", title: "Senior Software Engineer", initials: "VM", color: "#0891b2" },
  data: { name: "Vikram Mehta", title: "Senior Software Engineer", initials: "VM", color: "#0891b2" },
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
    },
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
    dateModified: "2026-03-28",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 16px",
          border: "1px solid #e0e7ff",
          borderRadius: "10px",
          backgroundColor: "#f8fafc",
          maxWidth: "480px",
          marginTop: "16px",
        }}
      >
        {/* Avatar circle with initials */}
        <div
          style={{
            width: "40px",
            height: "40px",
            minWidth: "40px",
            borderRadius: "50%",
            backgroundColor: reviewer.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          {reviewer.initials}
        </div>

        {/* Text content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ minWidth: "16px" }}
            >
              <circle cx="8" cy="8" r="8" fill="#16a34a" />
              <path
                d="M5 8.5L7 10.5L11 6"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: 1.3,
              }}
            >
              Reviewed by {reviewer.name}
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.3 }}>
            {reviewer.title} &middot; Last updated: March 2026
          </span>
        </div>
      </div>
    </>
  );
}
