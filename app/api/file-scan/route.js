/**
 * /api/file-scan — Cek keamanan file lewat hash (SHA-256) ke VirusTotal
 *
 * Privasi: file TIDAK diupload. Browser menghitung hash SHA-256 secara lokal,
 * lalu hanya hash-nya yang dikirim ke sini untuk dicek ke database VirusTotal.
 * Ini juga bikin ukuran file tidak jadi masalah (APK besar sekalipun).
 */

import { createRateLimiter, getClientIp } from "../../../lib/rate-limit";

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;

const checkRateLimit = createRateLimiter({ max: 20, windowMs: 60_000 });

const SHA256_RE = /^[a-f0-9]{64}$/i;

// ── VirusTotal ─────────────────────────────────────────
async function checkVirusTotal(hash) {
  if (!VT_API_KEY) return { available: false, reason: "API key tidak dikonfigurasi" };

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
      headers: { "x-apikey": VT_API_KEY },
    });

    if (res.status === 404) {
      return { available: true, found: false, label: "File belum pernah dilaporkan ke VirusTotal" };
    }
    if (res.status === 401) {
      return { available: false, reason: "API key VirusTotal tidak valid" };
    }
    if (res.status === 429) {
      return { available: false, reason: "Kuota VirusTotal habis, coba lagi nanti" };
    }
    if (!res.ok) {
      return { available: false, reason: `VirusTotal error (${res.status})` };
    }

    const data = await res.json();
    const attr = (data.data && data.data.attributes) || {};
    const stats = attr.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;
    const total = malicious + suspicious + harmless + undetected;

    return {
      available: true,
      found: true,
      malicious,
      suspicious,
      harmless,
      undetected,
      total,
      reputation: attr.reputation != null ? attr.reputation : 0,
      typeDescription: attr.type_description || null,
      meaningfulName: attr.meaningful_name || (attr.names && attr.names[0]) || null,
      names: (attr.names || []).slice(0, 5),
      sizeBytes: attr.size != null ? attr.size : null,
      permalink: `https://www.virustotal.com/gui/file/${hash}`,
      label:
        malicious > 0
          ? `${malicious} dari ${total} mesin antivirus menandai file ini BERBAHAYA`
          : suspicious > 0
          ? `${suspicious} mesin antivirus menandai file ini mencurigakan`
          : "Tidak ada mesin antivirus yang menandai file ini berbahaya",
    };
  } catch (err) {
    return { available: false, reason: err.message };
  }
}

// ── Gabungkan hasil jadi status ringkas ───────────────────────
function combineResult(vt) {
  if (!vt.available || !vt.found) return { status: "unknown", confidence: "low" };
  if (vt.malicious >= 1) {
    // Satu deteksi bisa saja false positive; banyak deteksi = makin yakin
    return { status: "danger", confidence: vt.malicious >= 3 ? "high" : "medium" };
  }
  if (vt.suspicious >= 1) return { status: "suspicious", confidence: "medium" };
  return { status: "safe", confidence: "high" };
}

// ── Route Handler ───────────────────────────────────
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
    const hash = (body.hash || "").trim().toLowerCase();
    const fileName = typeof body.fileName === "string" ? body.fileName.slice(0, 200) : null;
    const fileSize = typeof body.fileSize === "number" ? body.fileSize : null;

    if (!SHA256_RE.test(hash)) {
      return Response.json({ error: "Hash file tidak valid." }, { status: 400 });
    }

    const virustotal = await checkVirusTotal(hash);
    const combined = combineResult(virustotal);

    return Response.json({
      hash,
      fileName,
      fileSize,
      checkedAt: new Date().toISOString(),
      virustotal,
      combined,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
