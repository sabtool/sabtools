"use client";
import { getToolComponent } from "@/tools";

export default function ToolRenderer({ slug }: { slug: string }) {
  const Component = getToolComponent(slug);
  return <Component />;
}
