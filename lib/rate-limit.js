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

/**
 * Vercel Marketplace punya 2 kemungkinan integrasi yang beda penamaan
 * env var-nya, walau sama-sama Upstash Redis di baliknya:
 *  - Integrasi "Upstash" langsung            -> UPSTASH_REDIS_REST_URL / _TOKEN
 *  - Integrasi "Vercel KV" (marketplace)     -> KV_REST_API_URL / KV_REST_API_TOKEN
 * Kode ini nerima keduanya, prioritas ke UPSTASH_* kalau dua-duanya ada.
 */
const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const hasUpstash = !!REDIS_URL && !!REDIS_TOKEN;

let redis = null;
if (hasUpstash) {
  redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
} else if (process.env.NODE_ENV !== "test") {
  console.warn(
    "[rate-limit] Env var Upstash/KV (UPSTASH_REDIS_REST_URL/TOKEN atau KV_REST_API_URL/TOKEN) belum diisi — pakai in-memory limiter (tidak akurat di multi-instance/serverless)."
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
// Store di-cache per (prefix, max, windowMs) — bukan dibuat baru tiap
// createInMemoryLimiter() dipanggil — supaya getQuotaStatus() (dipakai di
// halaman /akun) bisa "mengintip" store yang sama persis yang dipakai
// checkDeepScanUserQuota() di /api/scan, tanpa perlu ngoper referensi manual.
const inMemoryStores = new Map();

function getInMemoryStore({ max, windowMs, prefix }) {
  const cacheKey = `${prefix}:${max}:${windowMs}`;
  if (!inMemoryStores.has(cacheKey)) {
    const store = new Map();
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
      }
    }, 5 * 60_000);
    inMemoryStores.set(cacheKey, store);
  }
  return inMemoryStores.get(cacheKey);
}

function createInMemoryLimiter(opts) {
  const { max, windowMs } = opts;
  const store = getInMemoryStore(opts);

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

/**
 * getQuotaStatus({ max, windowMs, prefix }, key)
 * "Mengintip" sisa kuota untuk `key` tanpa mengonsumsinya (beda dari
 * check() yang dikembalikan createRateLimiter — itu selalu nge-count
 * sebagai satu pemakaian). Dipakai di halaman /akun buat nampilin sisa
 * kuota harian, jadi harus non-destructive.
 *
 * Return: { remaining, limit, reset } — reset dalam epoch ms.
 */
export async function getQuotaStatus({ max, windowMs, prefix = "default" }, key) {
  if (!hasUpstash) {
    const store = getInMemoryStore({ max, windowMs, prefix });
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      return { remaining: max, limit: max, reset: now + windowMs };
    }
    return { remaining: Math.max(0, max - entry.count), limit: max, reset: entry.resetAt };
  }

  try {
    const limiter = getUpstashLimiter({ max, windowMs, prefix });
    const { remaining, limit, reset } = await limiter.getRemaining(key);
    return { remaining, limit, reset };
  } catch (err) {
    // Fail-open sama seperti check() — kalau Upstash error, jangan bikin
    // halaman akun crash, tampilkan seolah kuota masih penuh.
    console.error("[rate-limit] getQuotaStatus error, fail-open:", err.message);
    return { remaining: max, limit: max, reset: Date.now() + windowMs };
  }
}

export function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
