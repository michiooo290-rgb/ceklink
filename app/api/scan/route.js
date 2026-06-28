/**
 * /api/scan — Real-time URL security check
 * Menggunakan Google Safe Browsing + URLScan.io
 */

import { createRateLimiter, getClientIp } from "../../../lib/rate-limit";

const GSB_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const URLSCAN_API_KEY = process.env.URLSCAN_API_KEY;

const checkRateLimit = createRateLimiter({ max: 20, windowMs: 60_000 });

// ── Google Safe Browsing ──────────────────────────────────────────────
async function checkGoogleSafeBrowsing(url) {
  if (!GSB_API_KEY) return { available: false, reason: "API key tidak dikonfigurasi" };

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GSB_API_KEY}`,
      {
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
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return { available: false, reason: err.error?.message || "GSB error" };
    }

    const data = await res.json();
    const matches = data.matches || [];

    if (matches.length > 0) {
      const types = matches.map((m) => m.threatType);
      return {
        available: true,
        safe: false,
        threatTypes: types,
        label: types.includes("SOCIAL_ENGINEERING")
          ? "Phising terdeteksi oleh Google"
          : types.includes("MALWARE")
          ? "Malware terdeteksi oleh Google"
          : "Ancaman terdeteksi oleh Google",
      };
    }

    return { available: true, safe: true, threatTypes: [], label: "Aman menurut Google Safe Browsing" };
  } catch (err) {
    return { available: false, reason: err.message };
  }
}

// ── URLScan.io ────────────────────────────────────────────────────────
async function checkURLScan(url) {
  if (!URLSCAN_API_KEY) return { available: false, reason: "API key tidak dikonfigurasi" };

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
        visibility: "public",
        tags: ["urlveil"],
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.json();
      // 400 bisa berarti URL sudah di-scan sebelumnya — coba ambil hasil lama
      if (submitRes.status === 400 && err.message?.includes("already been submitted")) {
        return { available: true, pending: true, label: "URL sedang dalam antrian scan" };
      }
      return { available: false, reason: err.message || "URLScan submit error" };
    }

    const submitData = await submitRes.json();
    const uuid = submitData.uuid;
    const resultUrl = `https://urlscan.io/result/${uuid}/`;

    // Tunggu hasil (URLScan butuh ~10 detik)
    // Di sini kita return pending, frontend bisa polling
    return {
      available: true,
      pending: true,
      uuid,
      resultUrl,
      label: "Scan dikirim ke URLScan.io — hasil dalam ~10 detik",
    };
  } catch (err) {
    return { available: false, reason: err.message };
  }
}

// ── Poll URLScan result ───────────────────────────────────────────────
async function pollURLScanResult(uuid) {
  try {
    const res = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`, {
      headers: { "API-Key": URLSCAN_API_KEY },
    });

    if (res.status === 404) return { ready: false };
    if (!res.ok) return { ready: false };

    const data = await res.json();
    const verdicts = data.verdicts?.overall;

    return {
      ready: true,
      safe: !verdicts?.malicious,
      score: verdicts?.score ?? 0,
      malicious: verdicts?.malicious ?? false,
      categories: verdicts?.categories ?? [],
      brands: verdicts?.brands ?? [],
      screenshot: data.task?.screenshotURL ?? null,
      resultUrl: `https://urlscan.io/result/${uuid}/`,
      label: verdicts?.malicious
        ? `Berbahaya menurut URLScan (score: ${verdicts.score})`
        : "Aman menurut URLScan.io",
    };
  } catch {
    return { ready: false };
  }
}

// ── Combine results ───────────────────────────────────────────────────
function combineResults(gsb, urlscan) {
  // Kalau GSB bilang berbahaya → langsung danger
  if (gsb.available && !gsb.safe) {
    return { status: "danger", confidence: "high" };
  }
  // Kalau URLScan bilang berbahaya
  if (urlscan.available && urlscan.ready && urlscan.malicious) {
    return { status: "danger", confidence: "medium" };
  }
  // Keduanya aman
  if (gsb.available && gsb.safe && urlscan.available && urlscan.ready && !urlscan.malicious) {
    return { status: "safe", confidence: "high" };
  }
  // GSB aman tapi URLScan pending/tidak available
  if (gsb.available && gsb.safe) {
    return { status: "safe", confidence: "medium" };
  }
  return { status: "unknown", confidence: "low" };
}

// ── Route Handler ─────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return Response.json(
        { error: `Terlalu banyak permintaan. Coba lagi dalam ${rateCheck.retryAfter} detik.` },
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

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL tidak valid" }, { status: 400 });
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }

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