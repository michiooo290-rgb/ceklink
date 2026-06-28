/**
 * rate-limit.js — Simple in-memory rate limiter per IP
 *
 * Catatan: cuma efektif selama satu instance server hidup. Di environment
 * serverless (Vercel dst), tiap instance punya memory sendiri jadi ini lebih
 * ke garis pertahanan pertama, bukan jaminan absolut. Untuk produksi skala
 * besar, ganti dengan Upstash Redis / Vercel KV.
 */

export function createRateLimiter({ max, windowMs }) {
  const store = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60_000);

  return function check(key) {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (entry.count >= max) {
      return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }

    entry.count += 1;
    return { allowed: true };
  };
}

export function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}