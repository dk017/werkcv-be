/**
 * Simple in-memory rate limiter for public AI tool endpoints.
 * Works for single-instance deployments (Hetzner). Not shared across
 * multiple processes — acceptable trade-off vs. adding Redis.
 *
 * Strategy: sliding window per IP.
 * Limit: MAX_REQUESTS per WINDOW_MS.
 */

const DEFAULT_MAX_REQUESTS = 20;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface Entry {
    timestamps: number[];
}

const store = new Map<string, Entry>();
type RateLimitOptions = {
    bucket?: string;
    maxRequests?: number;
    windowMs?: number;
};

// Prune stale entries every 15 minutes to prevent unbounded memory growth
setInterval(() => {
    const cutoff = Date.now() - DEFAULT_WINDOW_MS;
    for (const [key, entry] of store) {
        entry.timestamps = entry.timestamps.filter(t => t > cutoff);
        if (entry.timestamps.length === 0) store.delete(key);
    }
}, 15 * 60 * 1000);

export function checkRateLimit(ip: string, options: RateLimitOptions = {}): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
    const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS;
    const bucket = options.bucket ?? 'default';
    const cutoff = now - windowMs;
    const key = `${bucket}:${ip}`;

    let entry = store.get(key);
    if (!entry) {
        entry = { timestamps: [] };
        store.set(key, entry);
    }

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter(t => t > cutoff);

    if (entry.timestamps.length >= maxRequests) {
        return { allowed: false, remaining: 0 };
    }

    entry.timestamps.push(now);
    return { allowed: true, remaining: maxRequests - entry.timestamps.length };
}

export function getClientIp(request: Request): string {
    // Respect reverse-proxy headers (Nginx/Hetzner)
    const forwarded = (request.headers as Headers).get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIp = (request.headers as Headers).get('x-real-ip');
    if (realIp) return realIp.trim();
    return 'unknown';
}
