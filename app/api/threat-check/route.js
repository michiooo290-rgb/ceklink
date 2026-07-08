/**
 * /api/threat-check — Fast real-time cross-check ke database ancaman
 *
 * Dipanggil oleh quick scanner (lib/scanner.js) di halaman utama, jadi
 * harus cepat. Cuma pakai sumber yang responnya instan:
 * - URLhaus (gratis, tanpa API key, database malware/phishing real-time)
 * - Google Safe Browsing (kalau API key dikonfigurasi)
 *
 * URLScan.io TIDAK dipakai di sini karena butuh ~10 detik buat hasil —
 * itu dipakai di /api/scan untuk halaman "Analisis Mendalam".
 */

import { createRateLimiter, getClientIp } from "../../../lib/rate-limit";
import { validateScanUrl } from "../../../lib/validate-url";

const GSB_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const URLHAUS_AUTH_KEY = process.env.URLHAUS_AUTH_KEY; // opsional, daftar gratis di auth.abuse.ch
const checkRateLimit = createRateLimiter({ max: 30, windowMs: 60_000, prefix: "threat-check" });

// ── URLhaus ────────────────────────────────────────
async function checkURLhaus(url) {
  try {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (URLHAUS_AUTH_KEY) headers["Auth-Key"] = URLHAUS_AUTH_KEY;

    const res = await fetch("https://urlhaus-api.abuse.ch/v1/url/", {
      method: "POST",
      headers,
      body: "url=" + encodeURIComponent(url),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return { available: false, listed: false, status: "error", reason: `HTTP ${res.status}` };

    const data = await res.json();

    if (data.query_status === "ok") {
      return {
        available: true,
        listed: true,
        status: "malicious",
        threat: data.threat || "malware_distribution",
        urlStatus: data.url_status,
        tags: data.tags || [],
        dateAdded: data.date_added,
        urlhausLink: "https://urlhaus.abuse.ch/url/" + data.id + "/",
      };
    }

    // "no_results" → URL bersih menurut URLhaus
    return { available: true, listed: false, status: "clean" };
  } catch (err) {
    return { available: false, listed: false, status: "unavailable", reason: err.message };
  }
}

// ── Google Safe Browsing ──────────────────────────────
async function checkGoogleSafeBrowsing(url) {
  if (!GSB_API_KEY) return { available: false, listed: false, status: "unavailable", reason: "API key tidak dikonfigurasi" };

  try {
    const endpoint =
      "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + GSB_API_KEY;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "urlveil", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return { available: false, listed: false, status: "error", reason: `HTTP ${res.status}` };

    const data = await res.json();
    const matches = data.matches || [];

    if (matches.length > 0) {
      return { available: true, listed: true, status: "malicious", threatTypes: matches.map((m) => m.threatType) };
    }
    return { available: true, listed: false, status: "clean" };
  } catch (err) {
    return { available: false, listed: false, status: "unavailable", reason: err.message };
  }
}

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return Response.json(
        { error: "Terlalu banyak permintaan. Coba lagi dalam " + rateCheck.retryAfter + " detik." },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter) } }
      );
    }

    const { url } = await req.json();
    const validation = validateScanUrl(url);
    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: 400 });
    }
    const safeUrl = validation.url;

    const [urlhaus, gsb] = await Promise.all([
      checkURLhaus(safeUrl),
      checkGoogleSafeBrowsing(safeUrl),
    ]);

    const listedAnywhere = urlhaus.listed || gsb.listed;

    // Tri-state reputation aggregate
    const urlhausClean = urlhaus.available && urlhaus.status === "clean";
    const gsbClean = gsb.available && gsb.status === "clean";
    const urlhausAvail = urlhaus.available;
    const gsbAvail = gsb.available;

    let reputationStatus;
    if (listedAnywhere) {
      reputationStatus = "malicious";
    } else if (urlhausClean && gsbClean) {
      reputationStatus = "clean";
    } else if (urlhausClean || gsbClean) {
      reputationStatus = "partial_clean";
    } else {
      reputationStatus = "unknown";
    }

    const checkedSources = [urlhausAvail && "urlhaus", gsbAvail && "gsb"].filter(Boolean);
    const unavailableSources = [
      !urlhausAvail && "urlhaus",
      !gsbAvail && "gsb",
    ].filter(Boolean);

    return Response.json({
      url,
      listed: listedAnywhere,
      reputationStatus,
      anyUnavailable: unavailableSources.length > 0,
      checkedSources,
      unavailableSources,
      urlhaus,
      googleSafeBrowsing: gsb,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
