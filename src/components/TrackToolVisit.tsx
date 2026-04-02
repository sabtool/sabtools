"use client";
import { useEffect } from "react";
import { addRecentTool } from "@/hooks/useRecentTools";

export default function TrackToolVisit({ slug }: { slug: string }) {
  useEffect(() => {
    addRecentTool(slug);
  }, [slug]);

  return null;
}
