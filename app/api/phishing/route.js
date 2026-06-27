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
      pln: "PLN", telkomsel: "Telkomsel", xl: "XL", indosat: "Indosat",
      paypal: "PayPal", apple: "Apple", microsoft: "Microsoft",
      google: "Google", facebook: "Facebook", instagram: "Instagram",
      whatsapp: "WhatsApp", netflix: "Netflix", amazon: "Amazon",
      roblox: "Roblox", discord: "Discord", tiktok: "TikTok",
      spotify: "Spotify", steam: "Steam", bank: "Bank",
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

/* ── Threat → Status Mapping ──────────────────── */
function threatToStatus(threat) {
  if (threat === "malware_download") return "danger";
  if (threat === "phishing") return "danger";
  if (threat === "malware") return "danger";
  return "warn";
}

/* ── Relative Time ────────────────────────────── */
function relativeTime(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return date.toLocaleDateString("id-ID");
  } catch {
    return "-";
  }
}

/* ── GET Handler ──────────────────────────────── */
export async function GET() {
  try {
    // Fetch dari URLhaus (sumber data phising real-time)
    const res = await fetch(
      "https://urlhaus.abuse.ch/downloads/json_recent/",
      { cache: "no-store" } // real-time, data terlalu besar untuk Next.js cache (15MB)
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URLhaus", fallback: true },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Parse semua entries
    const entries = Object.values(data).flat();

    // Filter hanya yang online, ambil 8 terbaru
    const onlineEntries = entries
      .filter((e) => e.url_status === "online")
      .sort((a, b) => new Date(b.dateadded) - new Date(a.dateadded))
      .slice(0, 8);

    const urls = onlineEntries.map((entry) => ({
      link: entry.url,
      target: extractTarget(entry.url),
      status: threatToStatus(entry.threat),
      threat: entry.threat,
      date: relativeTime(entry.dateadded),
      urlhaus_link: entry.urlhaus_link,
      reporter: entry.reporter,
      tags: entry.tags || [],
    }));

    return NextResponse.json(
      {
        urls,
        count: entries.length,
        onlineCount: onlineEntries.length,
        source: "URLhaus",
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("Phishing API error:", err);
    return NextResponse.json(
      { error: "Service unavailable", fallback: true },
      { status: 503 }
    );
  }
}
