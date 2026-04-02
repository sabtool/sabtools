// Google Analytics event tracking helpers
// Safe to call anywhere — each function checks for window.gtag before firing.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function sendEvent(eventName: string, params: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/** Track when a user visits / uses a tool page */
export function trackToolUsage(toolSlug: string, toolName: string) {
  sendEvent("tool_usage", {
    tool_slug: toolSlug,
    tool_name: toolName,
  });
}

/** Track when a user performs a search */
export function trackSearch(query: string, resultsCount: number) {
  sendEvent("search", {
    search_term: query,
    results_count: resultsCount,
  });
}

/** Track when a user performs an action inside a tool (calculate, download, copy, etc.) */
export function trackToolAction(toolSlug: string, action: string) {
  sendEvent("tool_action", {
    tool_slug: toolSlug,
    action,
  });
}

/** Track when a user shares a tool */
export function trackShare(toolSlug: string, platform: string) {
  sendEvent("share", {
    tool_slug: toolSlug,
    platform,
  });
}

/** Track when a user interacts with the AI chatbot */
export function trackChatbot(action: string) {
  sendEvent("chatbot_interaction", {
    action,
  });
}
