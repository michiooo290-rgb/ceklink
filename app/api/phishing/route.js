import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractTarget(url) {
  try {
    const hostname = new URL(url).hostname.replace("www.", "").toLowerCase();
    const parts = hostname.split(".");
    const known = {
      bca: "BCA", bni: "BNI", bri: "BRI", mandiri: "Mandiri",
      tokopedia: "Tokopedia", shopee: "Shopee", lazada: "Lazada",
      grab: "Grab", gojek: "Gojek", dana: "DANA", ovo: "OVO",
      gopay: "GoPay", bukalapak: "Bukalapak", indodax: "Indodax",
      pln: "PLN", telkomsel: "Telkomsel", paypal: "PayPal",
      apple: "Apple", microsoft: "Microsoft", google: "Google",
      facebook: "Facebook", instagram: "Instagram", whatsapp: "WhatsApp",
      netflix: "Netflix", amazon: "Amazon", discord: "Discord",
      tiktok: "TikTok", spotify: "Spotify", steam: "Steam",
    };
    // Kalau IP address → label "IP Langsung"
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return "IP Langsung";
    for (const part of parts) {
      if (known[part]) return known[part];
    }
    const main = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    return main.charAt(0).toUpperCase() + main.slice(1);
  } catch {
    return "Unknown";
  }
}

function threatToStatus(threat) {
  if (!threat) return "warn";
  const t = threat.toLowerCase();
  if (t.includes("phish") || t.includes("malware")) return "danger";
  return "warn";
}

function relativeTime(dateStr) {
  try {
    if (!dateStr) return "-";
    // URLhaus format: "2026-06-28 06:49:29 UTC" → parse manual
    const normalized = dateStr.replace(" UTC", "").replace(" ", "T") + "Z";
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return "-";
    const diffMin = Math.floor((Date.now() - date) / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return date.toLocaleDateString("id-ID");
  } catch { return "-"; }
}

function parseCSV(text) {
  const lines = text.split("\n").filter(l => l.trim() && !l.startsWith("#"));

  const results = [];
  for (const line of lines) {
    const cols = line.split('","').map(c => c.replace(/^"|"$/g, '').trim());
    if (cols.length < 4) continue;

    // URLhaus CSV: id, dateadded, url, url_status, last_online, threat, tags, urlhaus_link, reporter
    const dateadded = cols[1]; // index 1, bukan 0
    const url = cols[2];
    const url_status = cols[3];
    const threat = cols[5] || "";

    if (!url || !url.startsWith("http")) continue;

    results.push({
      dateadded: dateadded?.trim(),
      url: url?.trim(),
      threat: threat?.trim(),
      url_status: url_status?.trim(),
    });
  }

  return results;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://urlhaus.abuse.ch/downloads/csv_recent/",
      {
        cache: "no-store",
        headers: { "User-Agent": "Urlveil/1.0" },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) throw new Error(`URLhaus responded ${res.status}`);

    const text = await res.text();
    const entries = parseCSV(text);

    // Prioritaskan yang bukan IP address murni
    const sorted = [...entries].sort((a, b) => {
      const aIsIP = /^\d+\.\d+\.\d+\.\d+/.test(new URL(a.url).hostname);
      const bIsIP = /^\d+\.\d+\.\d+\.\d+/.test(new URL(b.url).hostname);
      if (aIsIP && !bIsIP) return 1;
      if (!aIsIP && bIsIP) return -1;
      return 0;
    });

    const top = sorted.slice(0, 8);

    const urls = top.map((entry) => ({
      link: (() => {
        try {
          const u = new URL(entry.url);
          return u.hostname + u.pathname;
        } catch { return entry.url.slice(0, 60); }
      })(),
      target: extractTarget(entry.url),
      status: threatToStatus(entry.threat),
      threat: entry.threat,
      date: relativeTime(entry.dateadded),
      urlhaus_link: `https://urlhaus.abuse.ch/browse.php?search=${encodeURIComponent(entry.url)}`,
    }));

    const onlineCount = entries.filter(e => e.url_status === "online").length;

    return NextResponse.json({
      urls,
      count: entries.length,
      onlineCount,
      source: "URLhaus",
      fetchedAt: new Date().toISOString(),
      fallback: false,
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[URLhaus] Error:", err.message);
    return NextResponse.json(
      { error: err.message, fallback: true },
      { status: 503 }
    );
  }
}