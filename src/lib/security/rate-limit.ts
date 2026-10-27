export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in ms
}

interface WindowRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private cache = new Map<string, WindowRecord>();
  private defaultLimit: number;
  private windowMs: number;

  constructor(defaultLimit: number = 60, windowMs: number = 60000) {
    this.defaultLimit = defaultLimit;
    this.windowMs = windowMs;

    // Periodic cleanup every 5 minutes to prevent memory leaks
    if (typeof setInterval !== 'undefined') {
      const timer = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (timer.unref) {
        timer.unref();
      }
    }
  }

  public check(key: string, limit: number = this.defaultLimit): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.cache.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.cache.set(key, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= limit) {
      const oldestTimestamp = record.timestamps[0];
      const resetTime = oldestTimestamp + this.windowMs;
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetTime
      };
    }

    record.timestamps.push(now);
    return {
      allowed: true,
      limit,
      remaining: limit - record.timestamps.length,
      resetTime: now + this.windowMs
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    for (const [key, record] of this.cache.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.cache.delete(key);
      }
    }
  }

  public reset(key: string): void {
    this.cache.delete(key);
  }

  public clearAll(): void {
    this.cache.clear();
  }
}

// Pre-configured rate limiters
// 1. Auth routes (login, register): 5 requests per 60 seconds
export const authRateLimiter = new SlidingWindowRateLimiter(5, 60000);

// 2. Public submissions (applications, enquiries): 10 requests per 60 seconds
export const submissionRateLimiter = new SlidingWindowRateLimiter(10, 60000);

// 3. Document uploads: 5 files per 60 seconds
export const uploadRateLimiter = new SlidingWindowRateLimiter(5, 60000);

// 4. General API reads: 100 requests per 60 seconds
export const generalRateLimiter = new SlidingWindowRateLimiter(100, 60000);

/**
 * Extracts client IP address from standard proxy/CDN headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Creates standard HTTP rate limit headers.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString()
  };

  if (!result.allowed) {
    const retryAfter = Math.max(1, Math.ceil((result.resetTime - Date.now()) / 1000));
    headers['Retry-After'] = retryAfter.toString();
  }

  return headers;
}
