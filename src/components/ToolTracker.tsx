"use client";

import { useEffect } from "react";
import { trackToolUsage } from "@/lib/analytics";

interface ToolTrackerProps {
  toolSlug: string;
  toolName: string;
}

/** Client component that fires a tool_usage GA event on mount. */
export default function ToolTracker({ toolSlug, toolName }: ToolTrackerProps) {
  useEffect(() => {
    trackToolUsage(toolSlug, toolName);
  }, [toolSlug, toolName]);

  return null;
}
