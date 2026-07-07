/**
 * /api/scan — Real-time URL security check
 * Menggunakan Google Safe Browsing + URLScan.io
 */

import { createRateLimiter, getClientIp } from "../../../lib/rate-limit";
import { validateScanUrl } from "../../../lib/validate-url";

const GSB_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const URLSCAN_API_KEY = process.env.URLSCAN_API_KEY;

const checkRateLimit = createRateLimiter({ max: 20, windowMs: 60_000 });

// ── Google Safe Browsing ────────────────────────────────
async function checkGoogleSafeBrowsing(url) {
  if (!GSB_API_KEY) return { available: false, status: "unavailable", reason: "API key tidak dikonfigurasi" };

  try {
    const endpoint =
      "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + GSB_API_KEY;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "urlveil", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const err = await res.json();
      return { available: false, status: "error", reason: (err.error && err.error.message) || "GSB error" };
    }

    const data = await res.json();
    const matches = data.matches || [];

    if (matches.length > 0) {
      const types = matches.map((m) => m.threatType);
      return {
        available: true,
        safe: false,
        status: "malicious",
        threatTypes: types,
        label: types.includes("SOCIAL_ENGINEERING")
          ? "Phising terdeteksi oleh Google"
          : types.includes("MALWARE")
          ? "Malware terdeteksi oleh Google"
          : "Ancaman terdeteksi oleh Google",
      };
    }

    return { available: true, safe: true, status: "clean", threatTypes: [], label: "Tidak ditemukan di Google Safe Browsing saat diperiksa" };
  } catch (err) {
    return { available: false, status: "unavailable", reason: err.message };
  }
}

// ── URLScan.io ───────────────────────────────────────
async function checkURLScan(url) {
  if (!URLSCAN_API_KEY) return { available: false, status: "unavailable", reason: "API key tidak dikonfigurasi" };

  try {
    // Submit scan
    const submitRes = await fetch("https://urlscan.io/api/v1/scan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": URLSCAN_API_KEY,
      },
      body: JSON.stringify({
        url,
        visibility: "unlisted",
        tags: ["urlveil"],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!submitRes.ok) {
      const err = await submitRes.json();
      // 400 bisa berarti URL sudah di-scan sebelumnya — tapi kita tidak punya UUID untuk poll
      if (submitRes.status === 400 && err.message && err.message.includes("already been submitted")) {
        return { available: true, pending: true, status: "pending", label: "URL sudah dalam antrian scan — coba beberapa saat lagi" };
      }
      return { available: false, status: "error", reason: err.message || "URLScan submit error" };
    }

    const submitData = await submitRes.json();
    const uuid = submitData.uuid;
    const resultUrl = "https://urlscan.io/result/" + uuid + "/";

    return {
      available: true,
      pending: true,
      status: "pending",
      uuid,
      resultUrl,
      label: "Scan dikirim ke URLScan.io — hasil dalam ~10 detik",
    };
  } catch (err) {
    return { available: false, status: "unavailable", reason: err.message };
  }
}

// ── Poll URLScan result ─────────────────────────────────
async function pollURLScanResult(uuid) {
  try {
    const res = await fetch("https://urlscan.io/api/v1/result/" + uuid + "/", {
      headers: { "API-Key": URLSCAN_API_KEY },
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 404) return { ready: false, status: "pending" };
    if (res.status === 429) return { ready: false, status: "error", reason: "Rate limit exceeded" };
    if (!res.ok) return { ready: false, status: "error", reason: `HTTP ${res.status}` };

    const data = await res.json();
    const verdicts = data.verdicts?.overall;

    return {
      ready: true,
      safe: !verdicts?.malicious,
      status: verdicts?.malicious ? "malicious" : "clean",
      score: verdicts?.score ?? 0,
      malicious: verdicts?.malicious ?? false,
      categories: verdicts?.categories ?? [],
      brands: verdicts?.brands ?? [],
      screenshot: data.task?.screenshotURL ?? null,
      resultUrl: "https://urlscan.io/result/" + uuid + "/",
      label: verdicts?.malicious
        ? "Berbahaya menurut URLScan (score: " + verdicts.score + ")"
        : "URLScan.io tidak menandai malicious saat hasil ini dibuat",
    };
  } catch (err) {
    return { ready: false, status: "error", reason: err.message };
  }
}

// ── Combine results ────────────────────────────────────
function combineResults(gsb, urlscan) {
  // Kalau GSB bilang berbahaya → langsung danger
  if (gsb.available && gsb.status === "malicious") {
    return { status: "danger", confidence: "high", label: "Ancaman terdeteksi oleh Google Safe Browsing" };
  }
  // Kalau URLScan bilang berbahaya
  if (urlscan.available && urlscan.ready && urlscan.malicious) {
    return { status: "danger", confidence: "medium", label: "Ancaman terdeteksi oleh URLScan.io" };
  }

  const gsbClean = gsb.available && gsb.status === "clean";
  const urlscanDone = urlscan.available && urlscan.ready && !urlscan.malicious;
  const urlscanPending = urlscan.available && !urlscan.ready;
  const urlscanUnavailable = !urlscan.available;

  // Keduanya tersedia dan clean → risiko rendah
  if (gsbClean && urlscanDone) {
    return { status: "safe", confidence: "high", label: "Tidak ditemukan di sumber yang tersedia" };
  }

  // GSB clean + URLScan pending → jangan bilang safe, bilang pending
  if (gsbClean && urlscanPending) {
    return { status: "pending", confidence: "medium", label: "Verifikasi eksternal belum selesai" };
  }

  // GSB clean + URLScan unavailable → partial clean, bukan safe
  if (gsbClean && urlscanUnavailable) {
    return { status: "partial_clean", confidence: "medium", label: "Hanya dicek oleh Google Safe Browsing — URLScan tidak tersedia" };
  }

  // GSB unavailable + URLScan clean
  if (!gsb.available && urlscanDone) {
    return { status: "partial_clean", confidence: "medium", label: "Hanya dicek oleh URLScan.io — Google Safe Browsing tidak tersedia" };
  }

  // Semua unavailable
  if (!gsb.available && !urlscan.available) {
    return { status: "unknown", confidence: "low", label: "Semua sumber reputasi tidak tersedia" };
  }

  // URLScan pending, GSB unavailable
  if (!gsb.available && urlscanPending) {
    return { status: "pending", confidence: "low", label: "Scan sedang diproses" };
  }

  return { status: "unknown", confidence: "low", label: "Hasil tidak lengkap" };
}

// ── Route Handler ────────────────────────────────────
export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return Response.json(
        { error: "Terlalu banyak permintaan. Coba lagi dalam " + rateCheck.retryAfter + " detik." },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter) } }
      );
    }

    const body = await req.json();
    const { url, uuid } = body;

    // Poll mode — frontend nanya hasil URLScan
    if (uuid) {
      const result = await pollURLScanResult(uuid);
      return Response.json(result);
    }

    const validation = validateScanUrl(url);
    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: 400 });
    }
    const normalizedUrl = validation.url;

    // Run checks secara parallel
    const [gsb, urlscan] = await Promise.all([
      checkGoogleSafeBrowsing(normalizedUrl),
      checkURLScan(normalizedUrl),
    ]);

    const combined = combineResults(gsb, urlscan);

    return Response.json({
      url: normalizedUrl,
      checkedAt: new Date().toISOString(),
      googleSafeBrowsing: gsb,
      urlscan,
      combined,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
