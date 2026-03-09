// ── In-Memory Rate Limiter ──
// Map-based rate limiting (matches existing API caching pattern)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: maxAttempts - 1, resetAt };
  }

  if (entry.count >= maxAttempts) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: maxAttempts - entry.count, resetAt: entry.resetAt };
}

// Preset configurations
export function rateLimitLogin(identifier: string) {
  return rateLimit(`login:${identifier}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
}

export function rateLimitRegister(identifier: string) {
  return rateLimit(`register:${identifier}`, 5, 60 * 60 * 1000); // 5 per hour
}

export function rateLimitPasswordReset(identifier: string) {
  return rateLimit(`reset:${identifier}`, 3, 60 * 60 * 1000); // 3 per hour
}
