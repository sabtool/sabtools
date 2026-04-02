"use client";
import { getToolComponent } from "@/tools";

export default function CalcToolRenderer({ toolSlug }: { toolSlug: string }) {
  const Component = getToolComponent(toolSlug);
  return <Component />;
}
