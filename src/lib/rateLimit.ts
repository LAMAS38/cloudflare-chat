/** Fenêtre glissante en mémoire — limite le spam par pseudo dans un salon (DO). */

const RATE_LIMIT_WINDOW_MS = 10_000;
const RATE_LIMIT_MAX_MESSAGES = 8;

export class MessageRateLimiter {
  private readonly buckets = new Map<string, number[]>();

  isLimited(username: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const recent = (this.buckets.get(username) ?? []).filter((t) => t > windowStart);

    if (recent.length >= RATE_LIMIT_MAX_MESSAGES) {
      this.buckets.set(username, recent);
      return true;
    }

    recent.push(now);
    this.buckets.set(username, recent);
    return false;
  }

  retryAfterMs(username: string): number {
    const timestamps = this.buckets.get(username);
    if (!timestamps?.length) return RATE_LIMIT_WINDOW_MS;

    const oldest = Math.min(...timestamps);
    return Math.max(0, RATE_LIMIT_WINDOW_MS - (Date.now() - oldest));
  }
}

export const RATE_LIMIT_MAX = RATE_LIMIT_MAX_MESSAGES;
export const RATE_LIMIT_WINDOW_SEC = RATE_LIMIT_WINDOW_MS / 1000;
