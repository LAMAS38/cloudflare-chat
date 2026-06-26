const RECENT_KEY = "pulsechat_recent_emojis";
const MAX_RECENT = 8;

export function getRecentEmojis(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function pushRecentEmoji(emoji: string): void {
  try {
    const current = getRecentEmojis().filter((item) => item !== emoji);
    const next = [emoji, ...current].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
