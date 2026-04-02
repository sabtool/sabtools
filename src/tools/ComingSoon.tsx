"use client";

export default function ComingSoon({ name }: { name: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
      <p className="text-gray-500">This tool is coming soon! We are working on it.</p>
      <p className="text-sm text-gray-400 mt-2">Bookmark this page and check back later.</p>
    </div>
  );
}
