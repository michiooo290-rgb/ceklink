/**
 * /api/domain-intel — Threat intelligence tambahan level domain/IP
 *
 * Dipanggil sebagai "expanded check" di samping /api/threat-check.
 * Mengumpulkan sinyal dari beberapa sumber sekaligus (paralel), dengan
 * graceful degradation kalau salah satu sumber tidak tersedia/limit:
 *
 * - AbuseIPDB      → reputasi IP (butuh ABUSEIPDB_API_KEY)
 * - WHOIS / RDAP   → umur domain, registrar (RDAP, tanpa API key)
 * - SSL/TLS        → validitas & masa berlaku sertifikat (native Node tls)
 * - VirusTotal     → reputasi domain (reuse VIRUSTOTAL_API_KEY yang sudah
 *                    dipakai di /api/file-scan)
 * - Shodan         → exposed ports/services & known vulns pada IP
 *                    (butuh SHODAN_API_KEY)
 *
 * Hasil di-cache in-memory per hostname (15 menit) buat ngirit kuota API
 * yang kena limit (AbuseIPDB, Shodan) kalau domain yang sama dicek ulang.
 *
 * Resolusi IP coba IPv4 dulu, fallback ke IPv6 kalau domain cuma punya
 * AAAA record (mis. domain IPv6-only) — dipakai buat AbuseIPDB & Shodan.
 *
 * Endpoint ini butuh resolusi DNS (buat AbuseIPDB/Shodan) dan koneksi
 * TCP/TLS (buat cek sertifikat), jadi lebih lambat dari /api/threat-check —
 * cocoknya dipakai di halaman "Analisis Mendalam", bukan Quick Scan.
 */

import dns from "node:dns/promises";
import tls from "node:tls";
import { createRateLimiter, getClientIp } from "../../../lib/rate-limit";
import { validateScanUrl } from "../../../lib/validate-url";
import { getCached, setCached } from "../../../lib/domain-intel-cache";
import { createClient } from "../../../lib/supabase/server";
import {
  DEEPSCAN_ANON_MAX,
  DEEPSCAN_USER_MAX,
  ONE_DAY_MS,
  DEEPSCAN_ANON_PREFIX,
  DEEPSCAN_USER_PREFIX,
} from "../../../lib/quota-config";

const ABUSEIPDB_API_KEY = process.env.ABUSEIPDB_API_KEY;
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const SHODAN_API_KEY = process.env.SHODAN_API_KEY;

// Endpoint ini lebih berat (DNS + TLS handshake + beberapa API luar),
// jadi limit lebih ketat dibanding quick scan.
const checkRateLimit = createRateLimiter({ max: 15, windowMs: 60_000, prefix: "domain-intel" });

// ── Kuota harian Analisis Mendalam ──
// Konstanta & prefix di lib/quota-config.js — shared dengan /api/scan
// (prefix sama, jadi satu pool kuota) dan dibaca halaman /akun buat
// nampilin sisa kuota tanpa duplikasi angka.
const checkDeepScanAnonQuota = createRateLimiter({
  max: DEEPSCAN_ANON_MAX,
  windowMs: ONE_DAY_MS,
  prefix: DEEPSCAN_ANON_PREFIX,
});
const checkDeepScanUserQuota = createRateLimiter({
  max: DEEPSCAN_USER_MAX,
  windowMs: ONE_DAY_MS,
  prefix: DEEPSCAN_USER_PREFIX,
});

// ── AbuseIPDB ──────────────────────────────────────────
async function checkAbuseIPDB(ip) {
  if (!ip) {
    return { available: false, status: "unavailable", reason: "Gagal resolve IP dari domain." };
  }
  if (!ABUSEIPDB_API_KEY) {
    return { available: false, status: "unavailable", reason: "API key tidak dikonfigurasi" };
  }

  try {
    const endpoint =
      "https://api.abuseipdb.com/api/v2/check?ipAddress=" +
      encodeURIComponent(ip) +
      "&maxAgeInDays=90";

    const res = await fetch(endpoint, {
      headers: { Key: ABUSEIPDB_API_KEY, Accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return { available: false, status: "error", reason: `HTTP ${res.status}` };

    const { data } = await res.json();
    const score = data.abuseConfidenceScore ?? 0;

    return {
      available: true,
      status: score >= 50 ? "malicious" : score >= 20 ? "suspicious" : "clean",
      ip,
      abuseConfidenceScore: score,
      totalReports: data.totalReports ?? 0,
      isp: data.isp || null,
      countryCode: data.countryCode || null,
      isTor: !!data.isTor,
      lastReportedAt: data.lastReportedAt || null,
    };
  } catch (err) {
    return { available: false, status: "unavailable", reason: err.message };
  }
}

// ── WHOIS via RDAP (tanpa API key) ────────────────────
async function checkWhois(domain) {
  try {
    const res = await fetch("https://rdap.org/domain/" + encodeURIComponent(domain), {
      signal: AbortSignal.timeout(6000),
      headers: { Accept: "application/rdap+json" },
    });

    if (!res.ok) {
      return { available: false, status: "unavailable", reason: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const events = data.events || [];
    const registrationEvent = events.find((e) => e.eventAction === "registration");
    const registrationDate = registrationEvent?.eventDate || null;

    let ageDays = null;
    let isNewDomain = false;
    if (registrationDate) {
      ageDays = Math.floor((Date.now() - new Date(registrationDate).getTime()) / 86_400_000);
      isNewDomain = ageDays < 30;
    }

    const registrarEntity = (data.entities || []).find((e) =>
      (e.roles || []).includes("registrar")
    );
    const registrarName =
      registrarEntity?.vcardArray?.[1]?.find((f) => f[0] === "fn")?.[3] ||
      registrarEntity?.handle ||
      null;

    return {
      available: true,
      status: isNewDomain ? "new_domain" : "established",
      registrationDate,
      ageDays,
      isNewDomain,
      registrar: registrarName,
    };
  } catch (err) {
    return { available: false, status: "unavailable", reason: err.message };
  }
}

// ── SSL/TLS cert check (native Node, tanpa API key) ───
function checkSSL(hostname) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, timeout: 6000, rejectUnauthorized: false },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          const authorized = socket.authorized;
          socket.end();

          if (!cert || Object.keys(cert).length === 0) {
            return resolve({ available: false, status: "unavailable", reason: "Sertifikat tidak ditemukan." });
          }

          const validTo = new Date(cert.valid_to);
          const daysUntilExpiry = Math.floor((validTo.getTime() - Date.now()) / 86_400_000);

          resolve({
            available: true,
            status: !authorized ? "invalid" : daysUntilExpiry < 0 ? "expired" : daysUntilExpiry < 14 ? "expiring_soon" : "valid",
            authorized,
            issuer: cert.issuer?.O || cert.issuer?.CN || null,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            daysUntilExpiry,
          });
        } catch (err) {
          socket.end();
          resolve({ available: false, status: "unavailable", reason: err.message });
        }
      }
    );

    socket.on("error", (err) => resolve({ available: false, status: "unavailable", reason: err.message }));
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ available: false, status: "unavailable", reason: "Koneksi timeout." });
    });
  });
}

// ── Shodan (exposed ports/services & known vulns) ─────
async function checkShodan(ip) {
  if (!ip) {
    return { available: false, status: "unavailable", reason: "Gagal resolve IP dari domain." };
  }
  if (!SHODAN_API_KEY) {
    return { available: false, status: "unavailable", reason: "API key tidak dikonfigurasi" };
  }

  try {
    const res = await fetch(
      "https://api.shodan.io/shodan/host/" + encodeURIComponent(ip) + "?key=" + SHODAN_API_KEY,
      { signal: AbortSignal.timeout(8000) }
    );

    // 404 dari Shodan artinya IP ini nggak ada di indeks mereka (bukan error)
    if (res.status === 404) {
      return { available: true, status: "no_data", ip, ports: [], vulns: [] };
    }
    if (!res.ok) return { available: false, status: "error", reason: `HTTP ${res.status}` };

    const data = await res.json();
    const ports = data.ports || [];
    const vulns = data.vulns ? Object.keys(data.vulns) : [];

    return {
      available: true,
      status: vulns.length > 0 ? "vulnerable" : ports.length > 5 ? "exposed" : "normal",
      ip,
      org: data.org || null,
      os: data.os || null,
      ports,
      vulns,
      hostnames: data.hostnames || [],
      lastUpdate: data.last_update || null,
    };
  } catch (err) {
    return { available: false, status: "unavailable", reason: err.message };
  }
}

// ── VirusTotal domain lookup ───────────────────────────
async function checkVirusTotalDomain(domain) {
  if (!VIRUSTOTAL_API_KEY) {
    return { available: false, status: "unavailable", reason: "API key tidak dikonfigurasi" };
  }

  try {
    const res = await fetch("https://www.virustotal.com/api/v3/domains/" + encodeURIComponent(domain), {
      headers: { "x-apikey": VIRUSTOTAL_API_KEY },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return { available: false, status: "error", reason: `HTTP ${res.status}` };

    const { data } = await res.json();
    const stats = data?.attributes?.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;

    return {
      available: true,
      status: malicious > 0 ? "malicious" : suspicious > 0 ? "suspicious" : "clean",
      malicious,
      suspicious,
      harmless: stats.harmless || 0,
      reputation: data?.attributes?.reputation ?? null,
    };
  } catch (err) {
    return { available: false, status: "unavailable", reason: err.message };
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

    const hostname = new URL(validation.url).hostname;

    // Cek cache dulu — kalau domain ini baru aja dicek (<15 menit), langsung
    // balikin hasil lama tanpa manggil API eksternal lagi (ngirit kuota).
    const cacheKey = "domain-intel:" + hostname;
    const cachedResult = getCached(cacheKey);
    if (cachedResult) {
      return Response.json({ ...cachedResult, cached: true });
    }

    // ── Kuota harian Analisis Mendalam ─────────────────────
    // Cuma dipotong kalau beneran manggil API eksternal (cache miss di atas).
    // Login → jatah 30x/hari per akun. Belum login → 5x/hari per IP.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const quotaCheck = user
      ? await checkDeepScanUserQuota(user.id)
      : await checkDeepScanAnonQuota(ip);

    if (!quotaCheck.allowed) {
      return Response.json(
        {
          error: user
            ? `Kuota Analisis Mendalam harian kamu (${DEEPSCAN_USER_MAX}x) sudah habis. Coba lagi besok.`
            : `Kuota gratis Analisis Mendalam (${DEEPSCAN_ANON_MAX}x/hari) sudah habis. Login/daftar dulu buat dapet kuota harian lebih besar (${DEEPSCAN_USER_MAX}x/hari).`,
          requireLogin: !user,
          quotaExceeded: true,
        },
        {
          status: 429,
          headers: quotaCheck.retryAfter
            ? { "Retry-After": String(quotaCheck.retryAfter) }
            : {},
        }
      );
    }

    // Resolve IP dulu (dibutuhkan AbuseIPDB & Shodan), tapi tetap lanjut
    // walau gagal. Urutan: resolve4() → resolve6() (domain IPv6-only) →
    // lookup() OS resolver sebagai fallback terakhir (resolve4/6 kadang
    // gagal di Windows karena config DNS system-nya nggak kebaca c-ares).
    let resolvedIp = null;
    let ipVersion = null;
    try {
      const addresses = await dns.resolve4(hostname);
      resolvedIp = addresses[0] || null;
      ipVersion = 4;
    } catch {
      try {
        const addresses6 = await dns.resolve6(hostname);
        resolvedIp = addresses6[0] || null;
        ipVersion = 6;
      } catch {
        try {
          const { address, family } = await dns.lookup(hostname);
          resolvedIp = address || null;
          ipVersion = family || null;
        } catch {
          resolvedIp = null;
          ipVersion = null;
        }
      }
    }

    const [abuseIpdb, whois, ssl, virusTotal, shodan] = await Promise.all([
      checkAbuseIPDB(resolvedIp),
      checkWhois(hostname),
      checkSSL(hostname),
      checkVirusTotalDomain(hostname),
      checkShodan(resolvedIp),
    ]);

    const sources = { abuseIpdb, whois, ssl, virusTotal, shodan };
    const checkedSources = Object.entries(sources)
      .filter(([, v]) => v.available)
      .map(([k]) => k);
    const unavailableSources = Object.entries(sources)
      .filter(([, v]) => !v.available)
      .map(([k]) => k);

    // Composite risk: sinyal "malicious/invalid/expired/new_domain/vulnerable" menaikkan risk
    const riskSignals = [
      abuseIpdb.available && (abuseIpdb.status === "malicious" || abuseIpdb.status === "suspicious"),
      whois.available && whois.isNewDomain,
      ssl.available && (ssl.status === "invalid" || ssl.status === "expired"),
      virusTotal.available && (virusTotal.status === "malicious" || virusTotal.status === "suspicious"),
      shodan.available && shodan.status === "vulnerable",
    ].filter(Boolean).length;

    let overallRisk;
    if (riskSignals >= 2) overallRisk = "high";
    else if (riskSignals === 1) overallRisk = "medium";
    else if (checkedSources.length > 0) overallRisk = "low";
    else overallRisk = "unknown";

    const result = {
      url: validation.url,
      hostname,
      resolvedIp,
      ipVersion,
      overallRisk,
      checkedSources,
      unavailableSources,
      abuseIpdb,
      whois,
      ssl,
      virusTotal,
      shodan,
      checkedAt: new Date().toISOString(),
    };

    setCached(cacheKey, result);

    return Response.json({ ...result, cached: false });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}