/**
 * domain-intel-cache.js — Simple in-memory TTL cache buat hasil /api/domain-intel
 *
 * Tujuan: kurangin pemakaian kuota API eksternal (AbuseIPDB gratis cuma
 * 1000 req/hari, Shodan juga terbatas) buat domain yang sama yang dicek
 * berulang kali dalam waktu dekat.
 *
 * Catatan: sama seperti rate-limit.js, ini in-memory — cukup buat
 * single-instance/dev. Untuk deploy serverless multi-instance (Vercel dst),
 * ganti dengan Upstash Redis / Vercel KV supaya cache konsisten antar instance.
 */

const store = new Map();
const DEFAULT_TTL_MS = 15 * 60_000; // 15 menit — cukup buat kurangi burst request
// berulang, tapi tetap cukup segar buat data reputasi yang bisa berubah.

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) store.delete(key);
  }
}, 5 * 60_000);

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}