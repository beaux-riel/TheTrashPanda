/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Suitable for a single-process dev server and best-effort protection in
 * serverless deploys (each lambda instance keeps its own Map, so burst
 * protection is per-instance). For horizontal scale, swap the Map for Redis
 * or Upstash — the external API stays the same.
 */

type Entry = {
  timestamps: number[];
  resetAt: number;
};

const buckets = new Map<string, Entry>();

// Lazy GC: sweep expired entries on each call so the Map doesn't grow forever.
function sweep(now: number): void {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now && entry.timestamps.every((t) => t <= now)) {
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  limited: boolean;
  remaining: number;
  resetAt: Date;
};

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  // Cheap GC — roughly 1-in-50 calls.
  if (Math.random() < 0.02) sweep(now);

  const existing = buckets.get(key);
  const timestamps = existing ? existing.timestamps.filter((t) => t > cutoff) : [];

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0] ?? now;
    const resetAt = new Date(oldest + windowMs);
    buckets.set(key, { timestamps, resetAt: resetAt.getTime() });
    return { limited: true, remaining: 0, resetAt };
  }

  timestamps.push(now);
  const resetAt = new Date(timestamps[0] + windowMs);
  buckets.set(key, { timestamps, resetAt: resetAt.getTime() });

  return {
    limited: false,
    remaining: Math.max(0, maxRequests - timestamps.length),
    resetAt
  };
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const contributionLimiter = (userId: string) =>
  rateLimit(`contribution:${userId}`, 10, HOUR);

export const freshnessLimiter = (userId: string) =>
  rateLimit(`freshness:${userId}`, 30, HOUR);

export const claimLimiter = (userId: string) =>
  rateLimit(`claim:${userId}`, 3, DAY);

export const reportLimiter = (userId: string) =>
  rateLimit(`report:${userId}`, 10, HOUR);

export const RATE_LIMIT_MESSAGE =
  "Slow down there, neighbour! Try again in a bit. 🦝";

export function rateLimitResponse(result: RateLimitResult): Response {
  const retryAfter = Math.max(1, Math.ceil((result.resetAt.getTime() - Date.now()) / 1000));
  return new Response(
    JSON.stringify({ error: RATE_LIMIT_MESSAGE, resetAt: result.resetAt.toISOString() }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": String(result.remaining)
      }
    }
  );
}

// Spam detection — tracks recent payload fingerprints per user.
type SpamEntry = { hash: string; timestamps: number[] };
const spamBuckets = new Map<string, SpamEntry[]>();

function hashPayload(payload: unknown): string {
  // Stable stringify — good enough for duplicate detection on small JSON.
  try {
    return JSON.stringify(payload, Object.keys(payload as object).sort());
  } catch {
    return String(payload);
  }
}

/**
 * Records the payload fingerprint for `userId` and returns true when we've
 * seen 3+ identical payloads in the last hour.
 */
export function isDuplicateSpam(userId: string, payload: unknown): boolean {
  const now = Date.now();
  const cutoff = now - HOUR;
  const hash = hashPayload(payload);

  const entries = (spamBuckets.get(userId) ?? [])
    .map((e) => ({ hash: e.hash, timestamps: e.timestamps.filter((t) => t > cutoff) }))
    .filter((e) => e.timestamps.length > 0);

  let entry = entries.find((e) => e.hash === hash);
  if (!entry) {
    entry = { hash, timestamps: [] };
    entries.push(entry);
  }
  entry.timestamps.push(now);
  spamBuckets.set(userId, entries);

  return entry.timestamps.length >= 3;
}

// Test hook — lets unit tests wipe state between runs.
export function __resetRateLimiter(): void {
  buckets.clear();
  spamBuckets.clear();
}
