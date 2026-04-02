import "@/app/globals.css";

export const metadata = {
  title: "SabTools Widget",
  description: "Embeddable tool widget from SabTools.in",
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <main className="w-full max-w-3xl mx-auto px-4 py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
