const STORAGE_KEY = "recentTools";
const MAX_RECENT = 6;

export function addRecentTool(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let list: string[] = stored ? JSON.parse(stored) : [];
    // Remove if already exists (dedup), then add to front
    list = list.filter((s) => s !== slug);
    list.unshift(slug);
    // Keep max 6
    if (list.length > MAX_RECENT) {
      list = list.slice(0, MAX_RECENT);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage errors
  }
}

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
