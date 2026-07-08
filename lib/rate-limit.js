/**
 * rate-limit.js — Rate limiter per IP, backed by Upstash Redis.
 *
 * Kenapa Upstash: di Vercel (serverless), tiap function invocation bisa
 * jalan di instance/container yang berbeda-beda, jadi state in-memory
 * (Map biasa) TIDAK ke-share antar instance — limit jadi nggak akurat.
 * Upstash Redis REST API cocok dipakai di edge/serverless karena connection-
 * less (HTTP-based), jadi hitungan tetap konsisten lintas instance.
 *
 * Graceful degradation: kalau env var Upstash belum diisi, otomatis fallback
 * ke in-memory limiter (perilaku lama) sambil kasih warning sekali di log —
 * biar dev lokal / belum sempat setup Upstash tetap bisa jalan tanpa error.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

let redis = null;
if (hasUpstash) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else if (process.env.NODE_ENV !== "test") {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN belum diisi — pakai in-memory limiter (tidak akurat di multi-instance/serverless)."
  );
}

// Cache satu instance Ratelimit per kombinasi (max, windowMs) + prefix,
// supaya createRateLimiter bisa dipanggil berkali-kali (tiap route) tanpa
// bikin client Redis baru tiap kali.
const ratelimitInstances = new Map();

function getUpstashLimiter({ max, windowMs, prefix }) {
  const cacheKey = `${prefix}:${max}:${windowMs}`;
  if (ratelimitInstances.has(cacheKey)) return ratelimitInstances.get(cacheKey);

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${windowMs} ms`),
    analytics: true,
    prefix: `ceklink:${prefix}`,
  });

  ratelimitInstances.set(cacheKey, limiter);
  return limiter;
}

/* ── Fallback: in-memory limiter (perilaku lama) ─────────────────── */
function createInMemoryLimiter({ max, windowMs }) {
  const store = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60_000);

  return async function check(key) {
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

/**
 * createRateLimiter({ max, windowMs, prefix })
 * - max: jumlah request maksimum per window
 * - windowMs: panjang window dalam milidetik
 * - prefix: namespace unik per endpoint (dipakai sebagai key Redis),
 *   WAJIB diisi supaya limit tiap endpoint nggak nabrak satu sama lain.
 *
 * Return: async function check(key) => { allowed, retryAfter? }
 */
export function createRateLimiter({ max, windowMs, prefix = "default" }) {
  if (!hasUpstash) {
    return createInMemoryLimiter({ max, windowMs });
  }

  const limiter = getUpstashLimiter({ max, windowMs, prefix });

  return async function check(key) {
    try {
      const { success, reset } = await limiter.limit(key);
      if (!success) {
        return { allowed: false, retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
      }
      return { allowed: true };
    } catch (err) {
      // Kalau Upstash lagi down/error jaringan, jangan blokir user —
      // fail-open sambil log errornya.
      console.error("[rate-limit] Upstash error, fail-open:", err.message);
      return { allowed: true };
    }
  };
}

export function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
