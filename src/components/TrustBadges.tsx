export default function TrustBadges() {
  const badges = [
    { icon: "🔒", label: "100% Secure", detail: "Browser-only processing" },
    { icon: "⚡", label: "Instant Results", detail: "No server delays" },
    { icon: "🚫", label: "No Signup", detail: "Use tools instantly" },
    { icon: "🇮🇳", label: "Made for India", detail: "INR, GST, Hindi support" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-3">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full text-xs"
        >
          <span>{badge.icon}</span>
          <span className="font-semibold text-green-800">{badge.label}</span>
          <span className="text-green-600 hidden sm:inline">— {badge.detail}</span>
        </div>
      ))}
    </div>
  );
}
