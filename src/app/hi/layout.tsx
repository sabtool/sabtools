import { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    locale: "hi_IN",
  },
  other: {
    "content-language": "hi",
  },
};

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="hi";`,
        }}
      />
      <div lang="hi" dir="ltr">
        {children}
      </div>
    </>
  );
}
