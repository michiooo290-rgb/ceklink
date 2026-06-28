import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ── Target Brand Detection ───────────────────── */
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
    const date = new Date(dateStr);
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

/* ── Parse CSV text ───────────────────────────── */
function parseCSV(text) {
  const lines = text.split("\n").filter(l => l && !l.startsWith("#"));
  const results = [];
  for (const line of lines) {
    const cols = line.split(",");
    if (cols.length < 7) continue;
    const [dateadded, , url, url_status, , threat] = cols;
    if (!url || url_status?.trim() !== "online") continue;
    results.push({ dateadded: dateadded?.trim(), url: url?.trim(), threat: threat?.trim() });
  }
  return results;
}

/* ── GET Handler ──────────────────────────────── */
export async function GET() {
  try {
    // Pakai CSV endpoint yang jauh lebih ringan (~500KB vs 15MB JSON)
    const res = await fetch(
      "https://urlhaus.abuse.ch/downloads/csv_recent/",
      {
        cache: "no-store",
        headers: { "User-Agent": "Urlveil/1.0" },
        signal: AbortSignal.timeout(8000), // timeout 8 detik
      }
    );

    if (!res.ok) throw new Error(`URLhaus responded ${res.status}`);

    const text = await res.text();
    const entries = parseCSV(text);

    const top = entries.slice(0, 8);

    const urls = top.map((entry) => ({
      link: (() => {
        try { return new URL(entry.url).hostname + new URL(entry.url).pathname; }
        catch { return entry.url.slice(0, 60); }
      })(),
      target: extractTarget(entry.url),
      status: threatToStatus(entry.threat),
      threat: entry.threat,
      date: relativeTime(entry.dateadded),
      urlhaus_link: `https://urlhaus.abuse.ch/browse.php?search=${encodeURIComponent(entry.url)}`,
    }));

    return NextResponse.json(
      {
        urls,
        count: entries.length,
        source: "URLhaus",
        fetchedAt: new Date().toISOString(),
        fallback: false,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("Phishing API error:", err.message);
    return NextResponse.json(
      { error: err.message, fallback: true },
      { status: 503 }
    );
  }
}