/**
 * scanner.js — Enhanced Client-side URL analysis
 *
 * Comprehensive URL security analysis with strict phishing detection.
 * 
 * CHANGELOG (fixes):
 * - Fix false positive: keyword "dana", "bri", "toko" sekarang pakai word-boundary check
 * - Fix: isSafeDomain sekarang skip SEMUA check (termasuk keyword)
 * - Fix: keyword "login" di path URL resmi tidak kena penalty
 * - Fix: duplikat "rb.gy" di SHORT_URL_DOMAINS dihapus
 * - Fix: typosquatting sekarang pakai full-word check, bukan substring bebas
 */

// Known phishing brand keywords
const BRAND_KEYWORDS = [
  { keyword: "tokopedia", brand: "Tokopedia", real: "tokopedia.com", category: "E-commerce" },
  { keyword: "shopee", brand: "Shopee", real: "shopee.co.id", category: "E-commerce" },
  { keyword: "bukalapak", brand: "Bukalapak", real: "bukalapak.com", category: "E-commerce" },
  { keyword: "lazada", brand: "Lazada", real: "lazada.co.id", category: "E-commerce" },
  { keyword: "blibli", brand: "Blibli", real: "blibli.com", category: "E-commerce" },
  { keyword: "bca", brand: "BCA", real: "klikbca.com", category: "Banking" },
  // FIX: "bri" dihapus dari keyword karena terlalu pendek dan banyak false positive
  // Ganti dengan keyword yang lebih spesifik
  { keyword: "bankbri", brand: "BRI", real: "bri.co.id", category: "Banking" },
  { keyword: "ibri", brand: "BRI", real: "bri.co.id", category: "Banking" },
  { keyword: "mandiri", brand: "Mandiri", real: "mandiri.co.id", category: "Banking" },
  { keyword: "bni", brand: "BNI", real: "bni.co.id", category: "Banking" },
  { keyword: "btn", brand: "BTN", real: "btn.co.id", category: "Banking" },
  { keyword: "cimb", brand: "CIMB", real: "cimb.co.id", category: "Banking" },
  { keyword: "gojek", brand: "Gojek", real: "gojek.com", category: "Transportation" },
  { keyword: "grab", brand: "Grab", real: "grab.com", category: "Transportation" },
  // FIX: "dana" dihapus karena false positive (bandana, indiana, dll)
  // Ganti dengan kombinasi yang lebih spesifik
  { keyword: "mydana", brand: "DANA", real: "dana.id", category: "Fintech" },
  { keyword: "e-dana", brand: "DANA", real: "dana.id", category: "Fintech" },
  { keyword: "dompetdana", brand: "DANA", real: "dana.id", category: "Fintech" },
  { keyword: "ovo", brand: "OVO", real: "ovo.id", category: "Fintech" },
  { keyword: "gopay", brand: "GoPay", real: "gojek.com", category: "Fintech" },
  { keyword: "linkaja", brand: "LinkAja", real: "linkaja.id", category: "Fintech" },
  { keyword: "paypal", brand: "PayPal", real: "paypal.com", category: "Fintech" },
  { keyword: "instagram", brand: "Instagram", real: "instagram.com", category: "Social Media" },
  { keyword: "facebook", brand: "Facebook", real: "facebook.com", category: "Social Media" },
  { keyword: "whatsapp", brand: "WhatsApp", real: "whatsapp.com", category: "Messaging" },
  { keyword: "google", brand: "Google", real: "google.com", category: "Technology" },
  { keyword: "microsoft", brand: "Microsoft", real: "microsoft.com", category: "Technology" },
  { keyword: "apple", brand: "Apple", real: "apple.com", category: "Technology" },
  { keyword: "netflix", brand: "Netflix", real: "netflix.com", category: "Entertainment" },
  { keyword: "spotify", brand: "Spotify", real: "spotify.com", category: "Entertainment" },
  { keyword: "indodax", brand: "Indodax", real: "indodax.com", category: "Crypto" },
  { keyword: "pintu", brand: "Pintu", real: "pintu.co.id", category: "Crypto" },
  { keyword: "tokocrypto", brand: "Tokocrypto", real: "tokocrypto.com", category: "Crypto" },
  { keyword: "tiktok", brand: "TikTok", real: "tiktok.com", category: "Social Media" },
  // FIX: "toko" dihapus — terlalu umum dalam bahasa Indonesia (tokobuku, tokoobat, dll)
  // Tokopedia sudah dicover oleh keyword "tokopedia" di atas
];

// ALL suspicious TLDs with risk level (expanded)
const SUSPICIOUS_TLDS = {
  high: [
    ".xyz", ".top", ".buzz", ".click", ".link", ".work", ".racing",
    ".win", ".stream", ".gdn", ".bid", ".download", ".loan", ".men",
    ".party", ".science", ".trade", ".faith", ".date", ".review",
    ".country", ".cricket", ".gq", ".ml", ".cf", ".ga",
    ".tk", ".pw", ".cc", ".icu", ".cam", ".rest", ".surf",
  ],
  medium: [
    ".info", ".site", ".online", ".website", ".space", ".fun",
    ".store", ".shop", ".club", ".vip", ".pro", ".mobi",
  ],
  low: [".biz", ".name", ".tel"],
};

// Short URL domains — FIX: hapus duplikat "rb.gy"
const SHORT_URL_DOMAINS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd",
  "v.gd", "ow.ly", "rb.gy", "cutt.ly", "short.link",
  "s.id", "bitly.com", "dwz.cn", "buff.ly", "tiny.cc",
  "adf.ly", "bc.vc", "sh.st", "ity.im", "q.gs",
  "clk.sh", "ouo.io", "exe.io", "shrinke.me", "v.ht",
  "tny.im", "shorturl.at",
  // duplikat rb.gy sudah dihapus
];

// Known safe domains (curated list)
const SAFE_DOMAINS = [
  // Global Tech
  "google.com", "google.co.id", "youtube.com", "facebook.com", "fb.com",
  "instagram.com", "twitter.com", "x.com", "github.com", "gitlab.com",
  "stackoverflow.com", "wikipedia.org", "wikimedia.org", "whatsapp.com",
  "tiktok.com", "netflix.com", "spotify.com", "microsoft.com", "live.com",
  "outlook.com", "apple.com", "amazon.com", "aws.amazon.com",
  "reddit.com", "linkedin.com", "medium.com", "discord.com",
  "zoom.us", "slack.com", "notion.so", "figma.com", "canva.com",
  "vercel.com", "netlify.com", "cloudflare.com", "digitalocean.com",
  // Indonesian E-commerce
  "tokopedia.com", "tokopedia.co.id", "shopee.co.id", "shopee.com",
  "bukalapak.com", "bukalapak.co.id", "blibli.com", "lazada.co.id",
  "traveloka.com", "tiket.com",
  // Indonesian Transportation & Fintech
  "gojek.com", "grab.com", "dana.id", "ovo.id", "linkaja.id",
  "gopay.co.id",
  // Indonesian Banking
  "klikbca.com", "bca.co.id", "bri.co.id", "mandiri.co.id", "bni.co.id",
  "btn.co.id", "cimb.co.id", "danamon.co.id", "permata.co.id",
  "mega.co.id", "bukopin.co.id",
  // Indonesian Government
  "bi.go.id", "kominfo.go.id", "indonesia.go.id", "go.id",
  // Indonesian News
  "detik.com", "kompas.com", "tribunnews.com", "liputan6.com",
  "tempo.co", "cnnindonesia.com", "kumparan.com",
  // Indonesian Telecom
  "telkomsel.com", "indosat.com", "xl.co.id", "smartfren.com",
  // Indonesian Other
  "pln.co.id", "pertamina.com",
];

// Suspicious keywords in URL
// FIX: keyword sekarang hanya dicek di DOMAIN, bukan di full URL/path
// agar tidak false positive untuk URL resmi seperti tokopedia.com/login
const SUSPICIOUS_KEYWORDS = {
  high: [
    "login", "signin", "sign-in", "verify", "verifikasi", "update",
    "secure", "password", "suspend", "blokir", "confirm", "account",
    "akun", "rekening", "otp", "pin", "ktp", "npwp",
  ],
  medium: [
    "promo", "bonus", "hadiah", "prize", "winner", "gratis", "free",
    "claim", "klaim", "undian", "diskon", "cashback", "voucher",
    "reward", "gift", "giftcard", "topup", "top-up",
  ],
  low: ["click", "redirect", "goto", "link", "url", "page"],
};

function normalizeURL(input) {
  let url = input.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

// ── IP Address Analysis ────────────────────────────────────────────

/**
 * Validasi format IP address (IPv4)
 * Cek setiap oktet harus 0-255
 */
function isValidIPv4(hostname) {
  const parts = hostname.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = Number(part);
    return /^\d+$/.test(part) && num >= 0 && num <= 255;
  });
}

/**
 * Klasifikasi range IP address
 * Menentukan apakah IP termasuk private, loopback, reserved, atau public
 */
function classifyIPRange(hostname) {
  if (!isValidIPv4(hostname)) return null;

  const [a, b, c] = hostname.split(".").map(Number);

  // Loopback: 127.0.0.0/8
  if (a === 127) {
    return {
      type: "loopback",
      label: "Loopback / Localhost",
      description: "IP localhost — hanya bisa diakses di komputer sendiri",
      risk: "high",
      riskLabel: "Mencurigakan",
      detail: "Link mengarah ke komputer kamu sendiri. Kemungkinan digunakan untuk menipu atau phishing lokal.",
    };
  }

  // Private: 10.0.0.0/8
  if (a === 10) {
    return {
      type: "private",
      label: "IP Private (Kelas A)",
      description: "Jaringan internal / LAN",
      risk: "high",
      riskLabel: "Sangat Mencurigakan",
      detail: "IP ini hanya bisa diakses dalam jaringan lokal. Link seperti ini di internet sangat mencurigakan.",
    };
  }

  // Private: 172.16.0.0/12
  if (a === 172 && b >= 16 && b <= 31) {
    return {
      type: "private",
      label: "IP Private (Kelas B)",
      description: "Jaringan internal / LAN",
      risk: "high",
      riskLabel: "Sangat Mencurigakan",
      detail: "IP ini hanya bisa diakses dalam jaringan lokal. Link seperti ini di internet sangat mencurigakan.",
    };
  }

  // Private: 192.168.0.0/16
  if (a === 192 && b === 168) {
    return {
      type: "private",
      label: "IP Private (Kelas C)",
      description: "Jaringan rumah / kantor",
      risk: "high",
      riskLabel: "Sangat Mencurigakan",
      detail: "IP jaringan rumah/kantor. Tidak seharusnya ada sebagai link publik di internet.",
    };
  }

  // Link-local: 169.254.0.0/16
  if (a === 169 && b === 254) {
    return {
      type: "link-local",
      label: "IP Link-Local (APIPA)",
      description: "IP otomatis saat DHCP gagal",
      risk: "high",
      riskLabel: "Sangat Mencurigakan",
      detail: "IP ini digunakan saat perangkat gagal mendapat IP dari router. Tidak lazim ditemukan di internet.",
    };
  }

  // Reserved: 0.0.0.0/8
  if (a === 0) {
    return {
      type: "reserved",
      label: "IP Reserved (0.x.x.x)",
      description: "Alamat IP yang dicadangkan",
      risk: "high",
      riskLabel: "Tidak Valid",
      detail: "Alamat IP ini dicadangkan dan tidak bisa diakses secara normal.",
    };
  }

  // Broadcast: 255.255.255.255
  if (hostname === "255.255.255.255") {
    return {
      type: "broadcast",
      label: "IP Broadcast",
      description: "Alamat broadcast jaringan",
      risk: "high",
      riskLabel: "Tidak Valid",
      detail: "Alamat broadcast tidak bisa diakses sebagai website.",
    };
  }

  // Multicast: 224.0.0.0/4
  if (a >= 224 && a <= 239) {
    return {
      type: "multicast",
      label: "IP Multicast",
      description: "Alamat multicast",
      risk: "medium",
      riskLabel: "Mencurigakan",
      detail: "IP multicast tidak lazim digunakan untuk website publik.",
    };
  }

  // Public IP
  return {
    type: "public",
    label: "IP Publik",
    description: "Alamat IP yang bisa diakses dari internet",
    risk: "medium",
    riskLabel: "Perlu Waspada",
    detail: "Website menggunakan IP langsung tanpa domain. Situs resmi hampir tidak pernah melakukan ini. Kemungkinan situs phishing atau sementara.",
  };
}

/**
 * Analisis lengkap URL yang menggunakan IP address
 */
function analyzeIPAddress(hostname, urlParts, input) {
  const ipInfo = classifyIPRange(hostname);
  const hasSSL = urlParts?.protocol === "https";

  const issues = [];
  let score = 100;
  const deductions = [];

  // SSL check
  if (!hasSSL) {
    score -= 15;
    deductions.push({ item: "SSL/HTTPS", points: -15, reason: "Tidak menggunakan HTTPS" });
    issues.push({
      label: "SSL/HTTPS",
      value: "Tidak Aman (HTTP)",
      status: "danger",
      detail: "Koneksi tidak dienkripsi. Data bisa disadap.",
    });
  } else {
    issues.push({
      label: "SSL/HTTPS",
      value: "Terenkripsi (HTTPS)",
      status: "safe",
      detail: "Koneksi dienkripsi, meski tetap perlu waspada karena menggunakan IP langsung.",
    });
  }

  // IP type analysis
  if (ipInfo) {
    const ipPenalty =
      ipInfo.type === "loopback" ? 60
      : ipInfo.type === "private" ? 55
      : ipInfo.type === "link-local" ? 60
      : ipInfo.type === "reserved" ? 70
      : ipInfo.type === "broadcast" ? 70
      : ipInfo.type === "multicast" ? 40
      : 30; // public

    score -= ipPenalty;
    deductions.push({
      item: `IP ${ipInfo.label}`,
      points: -ipPenalty,
      reason: ipInfo.description,
    });

    issues.push({
      label: `Tipe IP: ${ipInfo.label}`,
      value: ipInfo.riskLabel,
      status: ipInfo.risk === "high" ? "danger" : "warn",
      detail: ipInfo.detail,
    });
  }

  // Penggunaan IP langsung sebagai domain (selalu merah)
  issues.push({
    label: "IP Langsung Tanpa Domain",
    value: hostname,
    status: "danger",
    detail: "Situs resmi hampir tidak pernah menggunakan alamat IP langsung. Ini adalah teknik umum phishing untuk menyembunyikan identitas server.",
  });
  score -= 20;
  deductions.push({ item: "IP Tanpa Domain", points: -20, reason: "Tidak ada nama domain yang terverifikasi" });

  // Cek port mencurigakan
  if (urlParts?.port && !["80", "443"].includes(urlParts.port)) {
    issues.push({
      label: "Port Tidak Standar",
      value: `:${urlParts.port}`,
      status: "warn",
      detail: `Port ${urlParts.port} bukan port standar web (80/443). Sering digunakan oleh server tidak resmi.`,
    });
    score -= 10;
    deductions.push({ item: "Port Tidak Standar", points: -10, reason: `Port ${urlParts.port}` });
  }

  // Cek path mencurigakan
  const pathAnalysis = urlParts ? analyzePath(urlParts.pathname) : { suspicious: [], safe: true };
  if (pathAnalysis.suspicious.length > 0) {
    issues.push({
      label: "Path Mencurigakan",
      value: pathAnalysis.suspicious.join(", "),
      status: "danger",
      detail: `Path URL mengandung kata kunci phishing: ${pathAnalysis.suspicious.join(", ")}`,
    });
    score -= 15;
    deductions.push({ item: "Path Phishing", points: -15, reason: pathAnalysis.suspicious.join(", ") });
  }

  // Query param mencurigakan
  const queryAnalysis = urlParts ? analyzeQueryParams(urlParts.search) : { suspicious: [] };
  if (queryAnalysis.suspicious.length > 0) {
    issues.push({
      label: "Parameter Mencurigakan",
      value: queryAnalysis.suspicious.map((q) => q.key).join(", "),
      status: "warn",
      detail: "URL mengandung parameter yang sering dipakai untuk redirect berbahaya.",
    });
    score -= 10;
    deductions.push({ item: "Query Mencurigakan", points: -10, reason: "Parameter redirect/auth terdeteksi" });
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let status, statusLabel, statusEmoji, riskLevel, summary;
  if (finalScore >= 80) {
    status = "warn"; statusLabel = "WASPADA"; statusEmoji = "⚠️"; riskLevel = "Sedang";
    summary = "URL ini menggunakan IP langsung. Situs resmi tidak melakukan ini. Waspada sebelum memasukkan data apapun.";
  } else if (finalScore >= 50) {
    status = "warn"; statusLabel = "BERBAHAYA"; statusEmoji = "🚨"; riskLevel = "Tinggi";
    summary = "URL menggunakan IP langsung dengan indikasi mencurigakan tambahan. Kemungkinan phishing atau server tidak resmi.";
  } else {
    status = "danger"; statusLabel = "BAHAYA"; statusEmoji = "🚨"; riskLevel = "Sangat Tinggi";
    summary = "URL ini sangat berbahaya. Menggunakan IP langsung dengan banyak tanda bahaya. JANGAN masukkan data apapun!";
  }

  return {
    url: input,
    domain: hostname,
    status,
    statusLabel,
    statusEmoji,
    score: finalScore,
    riskLevel,
    summary,
    issues,
    details: {
      urlParts,
      isIPScan: true,
      ipInfo,
      pathAnalysis,
      queryAnalysis,
      deductions,
      domainLength: { total: hostname.length, main: hostname.length, isLong: false, isVeryLong: false },
      keywords: { high: [], medium: [], low: [] },
      patterns: [],
      homoglyphs: { found: [], hasPunycode: false, description: "N/A untuk IP address" },
      entropy: { score: 0, level: "low", description: "N/A untuk IP address" },
      domainAgeHints: { indicators: [], likely_new: false, description: "N/A untuk IP address" },
      redirectHints: detectRedirectHints(input),
      technicalDetails: {
        domainParts: [hostname],
        tld: null,
        mainDomain: hostname,
        subdomainCount: 0,
        urlLength: input.length,
        isSafeDomain: false,
        isIPAddress: true,
        ipType: ipInfo?.type || "unknown",
      },
    },
    checkedAt: new Date().toISOString(),
  };
}

function extractDomain(input) {
  try {
    // Handle @ symbol trick: tokopedia.com@evil.com → evil.com
    const atIndex = input.indexOf("@");
    if (atIndex > 0) {
      const afterAt = input.slice(atIndex + 1).split("/")[0];
      if (afterAt.includes(".") && afterAt.length > 3) {
        return afterAt.replace(/^www\./, "").toLowerCase();
      }
    }

    const url = new URL(normalizeURL(input));
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return input.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].toLowerCase();
  }
}

function extractURLParts(input) {
  try {
    const url = new URL(normalizeURL(input));
    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      port: url.port || null,
      isIP: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname),
    };
  } catch {
    return null;
  }
}

/**
 * FIX: checkTyposquatting sekarang pakai full-word / word-boundary check
 * agar "bandana.com" tidak dianggap menyamar sebagai "DANA"
 * dan "fabric.com" tidak dianggap menyamar sebagai "BRI"
 */
function checkTyposquatting(domain) {
  const cleanDomain = domain.replace(/^www\./, "");

  for (const brand of BRAND_KEYWORDS) {
    const b = brand.keyword;

    // Cek apakah real domain atau subdomain dari real domain
    const isRealDomain =
      cleanDomain === brand.real ||
      cleanDomain.endsWith("." + brand.real);

    if (isRealDomain) continue;

    // FIX: Pakai word-boundary regex agar tidak partial match
    // Contoh: "bri" tidak match "fabric", tapi match "bri-online", "bri.xyz"
    const wordBoundaryRegex = new RegExp(
      `(^|[^a-z0-9])${b}([^a-z0-9]|$)`,
      "i"
    );
    const domainWithoutTLD = cleanDomain.split(".").slice(0, -1).join(".");
    const containsBrandAsWord = wordBoundaryRegex.test(domainWithoutTLD);

    // Untuk keyword panjang (>= 5 huruf), boleh substring match
    // tapi tetap harus ada di bagian domain utama, bukan TLD
    const containsBrandSubstring =
      b.length >= 5 && domainWithoutTLD.includes(b);

    const containsBrand = containsBrandAsWord || containsBrandSubstring;

    if (!containsBrand) continue;

    // Pastikan ada pola phishing yang jelas
    const patterns = [
      // Character substitution: tokoped1a, sh0pee
      domainWithoutTLD.replace(/[0-9]/g, (m) =>
        ({ "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t" }[m] || m)
      ).includes(b),
      // Brand + action words
      cleanDomain.includes(b + "promo"),
      cleanDomain.includes(b + "login"),
      cleanDomain.includes(b + "update"),
      cleanDomain.includes(b + "verifikasi"),
      cleanDomain.includes(b + "secure"),
      cleanDomain.includes(b + "bonus"),
      cleanDomain.includes(b + "voucher"),
      cleanDomain.includes(b + "claim"),
      cleanDomain.includes(b + "hadiah"),
      // Brand with hyphens: shopee-promo, tokopedia-sale
      cleanDomain.includes(b + "-"),
      cleanDomain.includes("-" + b),
      // Brand in subdomain: promo.shopee.evil.com
      cleanDomain.includes(b + "."),
    ];

    if (patterns.some(Boolean)) {
      return {
        ...brand,
        pattern: "Brand impersonation detected",
      };
    }
  }
  return null;
}

function checkSuspiciousTLD(domain) {
  for (const [level, tlds] of Object.entries(SUSPICIOUS_TLDS)) {
    for (const tld of tlds) {
      if (domain.endsWith(tld)) {
        return { tld, level };
      }
    }
  }
  return null;
}

function isShortURL(domain) {
  return SHORT_URL_DOMAINS.some((s) => domain === s || domain.endsWith("." + s));
}

/**
 * FIX: analyzeKeywords sekarang HANYA cek di domain name, bukan full URL/path
 * Alasan: URL seperti "tokopedia.com/login" punya kata "login" di path tapi aman
 * Kata kunci mencurigakan hanya relevan jika ada di NAMA DOMAIN itu sendiri
 */
function analyzeKeywords(domain) {
  // Hanya ambil bagian domain utama (tanpa TLD)
  const domainWithoutTLD = domain.split(".").slice(0, -1).join(".");
  const lower = domainWithoutTLD.toLowerCase();
  const found = { high: [], medium: [], low: [] };

  for (const [level, keywords] of Object.entries(SUSPICIOUS_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        if (!found[level].includes(keyword)) {
          found[level].push(keyword);
        }
      }
    }
  }

  return found;
}

function countSubdomains(domain) {
  return domain.split(".").length - 1;
}

function analyzeDomainLength(domain) {
  const parts = domain.split(".");
  const mainDomain = parts[0];
  return {
    total: domain.length,
    main: mainDomain.length,
    isLong: domain.length > 30,
    isVeryLong: domain.length > 50,
    hasRandomChars: /^[a-z]{15,}$/.test(mainDomain) && !/[aeiou]{3}/.test(mainDomain),
  };
}

function detectSuspiciousPatterns(input) {
  const patterns = [];
  const domain = extractDomain(input);

  // Multiple subdomains
  if (countSubdomains(domain) > 3) {
    patterns.push("Excessive subdomains");
  }

  // IP address in URL
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(input)) {
    patterns.push("IP address used instead of domain");
  }

  // Non-standard port
  try {
    const url = new URL(normalizeURL(input));
    if (url.port && !["80", "443", ""].includes(url.port)) {
      patterns.push(`Non-standard port: ${url.port}`);
    }
  } catch {}

  // @ symbol in URL (CRITICAL - browser navigates to part AFTER @)
  if (input.includes("@")) {
    const atIndex = input.indexOf("@");
    const beforeAt = input.slice(0, atIndex);
    const afterAt = input.slice(atIndex + 1).split("/")[0];
    if (afterAt.includes(".") && afterAt.length > 3) {
      const beforeHasBrand = BRAND_KEYWORDS.some((b) =>
        beforeAt.toLowerCase().includes(b.keyword)
      );
      patterns.push(
        `@ symbol trick: browser navigates to "${afterAt}", NOT "${beforeAt}"`
      );
      if (beforeHasBrand) {
        patterns.push("CRITICAL: Brand name used to disguise redirect via @");
      }
    }
  }

  // Double slashes in path
  const withoutProtocol = input.replace(/^https?:\/\//, "");
  if (withoutProtocol.includes("//")) {
    patterns.push("Double slashes in path");
  }

  // Data/JavaScript URI
  if (
    input.toLowerCase().startsWith("data:") ||
    input.toLowerCase().startsWith("javascript:")
  ) {
    patterns.push("Dangerous URI scheme detected");
  }

  // Brand name in domain with suspicious TLD
  const tld = checkSuspiciousTLD(domain);
  if (tld) {
    for (const brand of BRAND_KEYWORDS) {
      if (domain.includes(brand.keyword) && !domain.endsWith(brand.real)) {
        patterns.push(
          `Brand "${brand.brand}" used with suspicious TLD ${tld.tld}`
        );
        break;
      }
    }
  }

  return patterns;
}

// ── Homoglyph Detection ────────────────────────────────────────────
const HOMOGLYPH_MAP = {
  a: ["а", "ạ", "à", "á", "â", "ã", "ä", "å", "ɑ", "α"],
  e: ["е", "ẹ", "è", "é", "ê", "ë", "ε"],
  o: ["о", "ọ", "ò", "ó", "ô", "õ", "ö", "0", "σ"],
  i: ["і", "ì", "í", "î", "ï", "ı", "1", "l", "|"],
  n: ["ñ", "ń", "ņ", "ň"],
  c: ["с", "ç", "ć", "č"],
  p: ["р", "ρ"],
  x: ["х", "χ"],
  y: ["у", "ý", "ÿ"],
  s: ["ѕ", "ş", "ś", "š", "5"],
  l: ["ⅼ", "1", "|", "ӏ"],
};

function detectHomoglyphs(domain) {
  const found = [];
  const lower = domain.toLowerCase();

  for (const [latin, similars] of Object.entries(HOMOGLYPH_MAP)) {
    for (const char of similars) {
      if (lower.includes(char) && char !== latin) {
        found.push({ char, looksLike: latin, domain: lower });
      }
    }
  }

  const hasPunycode = domain.includes("xn--");

  return {
    found,
    hasPunycode,
    description:
      found.length > 0
        ? `Ditemukan ${found.length} karakter mirip yang bisa menipu mata`
        : "Tidak ditemukan karakter mencurigakan",
  };
}

// ── Path Analysis ──────────────────────────────────────────────────
const SUSPICIOUS_PATH_KEYWORDS = [
  "login", "signin", "sign-in", "verify", "verifikasi", "update",
  "secure", "password", "confirm", "account", "akun", "rekening",
  "otp", "pin", "ktp", "npwp", "suspend", "blokir", "blocked",
  "reset", "recover", "unlock", "validate", "authenticate",
];

function analyzePath(pathname) {
  if (!pathname || pathname === "/") {
    return {
      suspicious: [],
      safe: true,
      description: "Path root — tidak ada halaman spesifik",
    };
  }

  const lower = pathname.toLowerCase();
  const suspicious = SUSPICIOUS_PATH_KEYWORDS.filter((k) => lower.includes(k));

  return {
    suspicious,
    safe: suspicious.length === 0,
    segments: pathname.split("/").filter(Boolean),
    description:
      suspicious.length > 0
        ? `Path mengandung kata kunci phising: ${suspicious.join(", ")}`
        : "Path tidak mengandung kata kunci mencurigakan",
  };
}

// ── Query Parameter Analysis ───────────────────────────────────────
const SUSPICIOUS_QUERY_PARAMS = [
  "redirect", "redirect_url", "return", "return_url", "next", "goto",
  "url", "link", "dest", "destination", "target", "callback",
  "token", "auth", "session", "sid", "code", "key",
  "email", "user", "username", "password", "pass", "pin",
];

function analyzeQueryParams(search) {
  if (!search) {
    return { suspicious: [], total: 0, description: "Tidak ada query parameters" };
  }

  const params = new URLSearchParams(search);
  const suspicious = [];
  const safe = [];

  for (const [key, value] of params.entries()) {
    const lowerKey = key.toLowerCase();
    if (SUSPICIOUS_QUERY_PARAMS.some((p) => lowerKey.includes(p))) {
      suspicious.push({ key, value: value.slice(0, 100) });
    } else {
      safe.push({ key, value: value.slice(0, 100) });
    }
  }

  return {
    suspicious,
    safe,
    total: params.size,
    description:
      suspicious.length > 0
        ? `Ditemukan ${suspicious.length} parameter mencurigakan`
        : "Semua parameter terlihat normal",
  };
}

// ── Shannon Entropy ────────────────────────────────────────────────
function calculateEntropy(str) {
  if (!str || str.length === 0) return { score: 0, level: "low", description: "" };

  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  const len = str.length;
  let entropy = 0;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  let level, description;
  if (entropy > 4.0) {
    level = "very_high";
    description = "Domain sangat acak — kemungkinan generated/random";
  } else if (entropy > 3.5) {
    level = "high";
    description = "Domain cukup acak — perlu waspada";
  } else if (entropy > 2.5) {
    level = "medium";
    description = "Entropy normal untuk domain Indonesia";
  } else {
    level = "low";
    description = "Domain terstruktur normal";
  }

  return { score: Math.round(entropy * 100) / 100, level, description };
}

// ── Domain Age Hints ───────────────────────────────────────────────
function detectDomainAgeHints(domain) {
  const indicators = [];
  const lower = domain.toLowerCase();

  const yearMatch = lower.match(/20(2[0-9]|1[0-9])/);
  if (yearMatch) {
    indicators.push(
      `Mengandung tahun "${yearMatch[0]}" — domain phising sering pakai tahun`
    );
  }

  const newWords = ["new", "baru", "latest", "update", "v2", "v3"];
  for (const word of newWords) {
    if (lower.includes(word)) {
      indicators.push(`Mengandung kata "${word}" — indikasi domain baru`);
    }
  }

  const mainDomain = domain.split(".")[0];
  if (mainDomain.length > 15 && /^[a-z0-9]+$/.test(mainDomain)) {
    const consonantClusters = mainDomain.match(/[^aeiou]{4,}/g);
    if (consonantClusters && consonantClusters.length > 0) {
      indicators.push("Domain utama terlihat acak/generated");
    }
  }

  return {
    indicators,
    likely_new: indicators.length > 0,
    description:
      indicators.length > 0
        ? `${indicators.length} indikasi domain baru/meragukan`
        : "Tidak ada indikasi domain baru",
  };
}

// ── Redirect Hints ─────────────────────────────────────────────────
function detectRedirectHints(input) {
  const found = [];

  const redirectPatterns = [
    { pattern: /redirect[_-]?url/i, name: "redirect_url parameter" },
    { pattern: /return[_-]?url/i, name: "return_url parameter" },
    { pattern: /next=|goto=|dest=|target=/i, name: "redirect parameter" },
    { pattern: /\/\/.*\/\//, name: "double protocol (redirect chain)" },
    { pattern: /https?:\/\/[^/]+\/https?:/i, name: "URL-in-URL (redirect chain)" },
  ];

  for (const { pattern, name } of redirectPatterns) {
    if (pattern.test(input)) {
      found.push(name);
    }
  }

  return {
    found,
    description:
      found.length > 0
        ? `Terdeteksi ${found.length} indikator redirect`
        : "Tidak ada indikator redirect",
  };
}

function calculateRiskScore(checks) {
  let score = 100;
  const deductions = [];

  // SSL/HTTPS check
  if (!checks.hasSSL) {
    score -= 15;
    deductions.push({
      item: "SSL/HTTPS",
      points: -15,
      reason: "Tidak menggunakan koneksi terenkripsi",
    });
  }

  // Brand impersonation (MAJOR)
  if (checks.typosquat) {
    let brandPoints = 40;

    const domainLower = (checks.urlParts?.hostname || "").toLowerCase();
    const hasSuspiciousSuffix =
      /promo|sale|login|update|verify|bonus|voucher|claim|hadiah|diskon|cashback/.test(
        domainLower
      );
    if (hasSuspiciousSuffix) {
      brandPoints += 15;
      deductions.push({
        item: "Brand + Kata Kunci",
        points: -15,
        reason: `Brand ${checks.typosquat.brand} dikombinasikan dengan kata kunci penipuan`,
      });
    }

    if (domainLower.includes("-") && !checks.typosquat.real.includes("-")) {
      brandPoints += 10;
      deductions.push({
        item: "Domain dengan Hyphen",
        points: -10,
        reason: "Penggunaan hyphen dalam domain tiruan adalah teknik phising umum",
      });
    }

    score -= brandPoints;
    deductions.push({
      item: "Impersonasi Brand",
      points: -40,
      reason: `Menyamar sebagai ${checks.typosquat.brand} (${checks.typosquat.category})`,
    });
  }

  // Suspicious TLD
  if (checks.suspiciousTLD) {
    const points =
      checks.suspiciousTLD.level === "high"
        ? 20
        : checks.suspiciousTLD.level === "medium"
        ? 12
        : 5;
    score -= points;
    deductions.push({
      item: "Domain Extension Berbahaya",
      points: -points,
      reason: `TLD ${checks.suspiciousTLD.tld} (risiko ${checks.suspiciousTLD.level})`,
    });
  }

  // Short URL
  if (checks.isShortURL) {
    let shortPoints = 25;

    const urlLower = (checks.urlParts?.pathname || "").toLowerCase();
    const hostLower = (checks.urlParts?.hostname || "").toLowerCase();
    const hasBrandInPath = BRAND_KEYWORDS.some(
      (b) => urlLower.includes(b.keyword) || hostLower.includes(b.keyword)
    );
    if (hasBrandInPath) {
      shortPoints += 20;
      deductions.push({
        item: "Shortener + Brand",
        points: -20,
        reason: "URL shortener dengan nama brand sangat mencurigakan",
      });
    }

    score -= shortPoints;
    deductions.push({
      item: "URL Shortener",
      points: -25,
      reason: "Menyembunyikan tujuan asli - tidak bisa diverifikasi",
    });
  }

  // FIX: Keyword check — hanya berlaku jika BUKAN safe domain
  // dan keyword sudah difilter hanya dari domain name (bukan path)
  if (!checks.isSafeDomain) {
    if (checks.keywords.high.length > 0) {
      score -= 15;
      deductions.push({
        item: "Kata Kunci Phising di Domain",
        points: -15,
        reason: checks.keywords.high.join(", "),
      });
    }

    if (checks.keywords.medium.length > 0) {
      score -= 10;
      deductions.push({
        item: "Kata Kunci Mencurigakan di Domain",
        points: -10,
        reason: checks.keywords.medium.join(", "),
      });
    }
  }

  // Subdomains
  if (checks.subdomains > 3) {
    score -= 10;
    deductions.push({
      item: "Subdomain Berlebihan",
      points: -10,
      reason: `${checks.subdomains} level subdomain`,
    });
  }

  // IP address
  if (checks.urlParts?.isIP) {
    score -= 25;
    deductions.push({
      item: "IP Address Langsung",
      points: -25,
      reason: "Menggunakan IP, bukan domain",
    });
  }

  // Suspicious patterns
  if (checks.patterns.length > 0) {
    const hasAtTrick = checks.patterns.some((p) => p.includes("@ symbol"));
    const hasCriticalPattern = checks.patterns.some((p) => p.includes("CRITICAL"));

    let patternPoints = checks.patterns.length * 5;
    if (hasAtTrick) patternPoints += 20;
    if (hasCriticalPattern) patternPoints += 15;

    score -= patternPoints;
    deductions.push({
      item: "Pola Mencurigakan",
      points: -patternPoints,
      reason: checks.patterns.join("; "),
    });
  }

  // Domain length
  if (checks.domainLength.isVeryLong) {
    score -= 10;
    deductions.push({
      item: "Domain Terlalu Panjang",
      points: -10,
      reason: `${checks.domainLength.total} karakter`,
    });
  } else if (checks.domainLength.hasRandomChars) {
    score -= 8;
    deductions.push({
      item: "Domain Acak",
      points: -8,
      reason: "Karakter acak tanpa makna",
    });
  }

  // Combination penalty
  const redFlags = [
    checks.typosquat,
    checks.suspiciousTLD?.level === "high",
    checks.keywords.high.length > 0,
    checks.isShortURL,
    checks.urlParts?.isIP,
  ].filter(Boolean).length;

  if (redFlags >= 3) {
    score -= 15;
    deductions.push({
      item: "Multiple Red Flags",
      points: -15,
      reason: `${redFlags} tanda bahaya terdeteksi sekaligus`,
    });
  } else if (redFlags >= 2) {
    score -= 10;
    deductions.push({
      item: "Multiple Red Flags",
      points: -10,
      reason: `${redFlags} tanda bahaya terdeteksi`,
    });
  }

  // Safe domain bonus
  if (checks.isSafeDomain) {
    score = Math.max(score, 90);
  }

  return { score: Math.max(0, Math.min(100, score)), deductions };
}

// ── Domain Context Database ────────────────────────────────────────
// Memberikan konteks spesifik per domain agar hasil tidak terasa generik

const DOMAIN_CONTEXT = {
  // E-commerce
  "tokopedia.com": {
    name: "Tokopedia",
    category: "E-commerce",
    desc: "Marketplace resmi Indonesia, berdiri sejak 2009. Salah satu platform belanja online terbesar di Asia Tenggara.",
    tips: ["Pastikan kamu login melalui app resmi atau tokopedia.com", "Jangan transfer di luar sistem pembayaran Tokopedia", "Waspada penjual yang minta bayar via transfer pribadi"],
  },
  "shopee.co.id": {
    name: "Shopee",
    category: "E-commerce",
    desc: "Platform belanja online yang beroperasi di Indonesia sejak 2015. Terkenal dengan fitur live shopping dan ShopeePay.",
    tips: ["Gunakan ShopeePay atau metode resmi untuk transaksi", "Jangan share kode OTP ke siapapun termasuk CS Shopee", "Waspada promo yang terasa terlalu bagus untuk jadi kenyataan"],
  },
  "bukalapak.com": {
    name: "Bukalapak",
    category: "E-commerce",
    desc: "Marketplace lokal Indonesia yang berdiri sejak 2010, fokus pada UMKM dan produk lokal.",
    tips: ["Selalu gunakan rekening bersama Bukalapak", "Periksa rating dan ulasan penjual sebelum membeli"],
  },
  "blibli.com": {
    name: "Blibli",
    category: "E-commerce",
    desc: "Platform e-commerce milik Grup Djarum yang berfokus pada produk autentik dan layanan premium.",
    tips: ["Blibli menjamin keaslian produk dengan program BliBli 100% Ori", "Gunakan fitur BliCicil untuk cicilan tanpa kartu kredit"],
  },
  "lazada.co.id": {
    name: "Lazada",
    category: "E-commerce",
    desc: "Platform e-commerce bagian dari ekosistem Alibaba Group yang beroperasi di Asia Tenggara.",
    tips: ["Manfaatkan LazMall untuk produk brand resmi", "Cek kebijakan pengembalian barang sebelum membeli"],
  },
  "traveloka.com": {
    name: "Traveloka",
    category: "Travel",
    desc: "Platform pemesanan tiket dan hotel terbesar di Asia Tenggara, didirikan di Indonesia tahun 2012.",
    tips: ["Pastikan data perjalanan benar sebelum checkout", "Gunakan Traveloka PayLater dengan bijak"],
  },
  // Banking
  "klikbca.com": {
    name: "KlikBCA",
    category: "Perbankan",
    desc: "Layanan internet banking resmi Bank Central Asia (BCA), bank swasta terbesar di Indonesia.",
    tips: ["BCA tidak pernah meminta KeyBCA melalui telepon atau chat", "Selalu akses KlikBCA langsung dari klikbca.com, bukan dari link", "Aktifkan notifikasi transaksi untuk memantau aktivitas rekening"],
  },
  "bca.co.id": {
    name: "BCA",
    category: "Perbankan",
    desc: "Website resmi Bank Central Asia, bank swasta terbesar di Indonesia.",
    tips: ["BCA tidak pernah meminta KeyBCA melalui telepon atau chat", "Selalu akses KlikBCA langsung dari klikbca.com, bukan dari link"],
  },
  "bri.co.id": {
    name: "BRI",
    category: "Perbankan",
    desc: "Website resmi Bank Rakyat Indonesia, bank milik negara yang fokus melayani segmen UMKM.",
    tips: ["BRI tidak pernah meminta PIN atau password via telepon", "Gunakan BRImo untuk transaksi mobile yang aman"],
  },
  "mandiri.co.id": {
    name: "Bank Mandiri",
    category: "Perbankan",
    desc: "Website resmi Bank Mandiri, bank BUMN terbesar di Indonesia berdasarkan total aset.",
    tips: ["Jangan pernah share token Mandiri Online ke siapapun", "Mandiri tidak pernah menghubungi nasabah meminta data pribadi"],
  },
  "bni.co.id": {
    name: "BNI",
    category: "Perbankan",
    desc: "Website resmi Bank Negara Indonesia, bank BUMN yang berdiri sejak 1946.",
    tips: ["BNI tidak pernah meminta OTP melalui telepon", "Laporkan aktivitas mencurigakan ke 1500046"],
  },
  // Fintech & E-wallet
  "dana.id": {
    name: "DANA",
    category: "Dompet Digital",
    desc: "Aplikasi dompet digital Indonesia yang diluncurkan tahun 2018, didukung Ant Group dan Emtek.",
    tips: ["DANA tidak pernah meminta PIN atau kode OTP via chat/telepon", "Aktifkan DANA Protection untuk keamanan ekstra", "Laporkan transaksi mencurigakan langsung di app"],
  },
  "ovo.id": {
    name: "OVO",
    category: "Dompet Digital",
    desc: "Platform pembayaran digital Indonesia milik Grup Lippo yang terintegrasi dengan Grab dan Tokopedia.",
    tips: ["Jangan share kode OTP OVO ke siapapun", "Gunakan fitur OVO @ untuk transfer mudah ke sesama pengguna"],
  },
  "linkaja.id": {
    name: "LinkAja",
    category: "Dompet Digital",
    desc: "Layanan keuangan digital milik BUMN Indonesia, hasil merger dari TCash dan layanan e-money lainnya.",
    tips: ["LinkAja tidak meminta PIN melalui telepon atau SMS", "Manfaatkan cashback untuk transaksi di merchant rekanan"],
  },
  // Transportasi
  "gojek.com": {
    name: "Gojek",
    category: "Super App",
    desc: "Super app Indonesia yang menyediakan layanan transportasi, pengiriman, dan keuangan digital (GoPay).",
    tips: ["Selalu cek identitas driver sebelum naik", "Lakukan pembayaran via GoPay untuk keamanan transaksi", "Jangan share kode booking ke orang lain"],
  },
  "grab.com": {
    name: "Grab",
    category: "Super App",
    desc: "Super app Asia Tenggara yang menyediakan ride-hailing, pengiriman makanan, dan layanan keuangan.",
    tips: ["Verifikasi identitas driver melalui app sebelum naik", "Gunakan GrabPay untuk transaksi yang lebih aman"],
  },
  // Social Media
  "instagram.com": {
    name: "Instagram",
    category: "Media Sosial",
    desc: "Platform berbagi foto dan video milik Meta, dengan lebih dari 2 miliar pengguna aktif di seluruh dunia.",
    tips: ["Aktifkan autentikasi dua faktor (2FA) di pengaturan keamanan", "Instagram tidak pernah meminta password via DM", "Waspada akun palsu yang mengklaim kontes atau hadiah"],
  },
  "facebook.com": {
    name: "Facebook",
    category: "Media Sosial",
    desc: "Platform media sosial terbesar dunia milik Meta, dengan lebih dari 3 miliar pengguna aktif.",
    tips: ["Aktifkan 2FA dan periksa sesi login yang aktif secara berkala", "Jangan klik link mencurigakan yang dikirim via Messenger"],
  },
  "whatsapp.com": {
    name: "WhatsApp",
    category: "Pesan Instan",
    desc: "Aplikasi pesan instan terenkripsi end-to-end milik Meta, digunakan oleh lebih dari 2 miliar orang.",
    tips: ["WhatsApp tidak pernah meminta kode verifikasi 6 digit via telepon", "Aktifkan verifikasi dua langkah di pengaturan akun", "Waspada penipuan via WhatsApp yang mengklaim dari keluarga"],
  },
  "tiktok.com": {
    name: "TikTok",
    category: "Media Sosial",
    desc: "Platform video pendek milik ByteDance dengan ratusan juta pengguna aktif di Indonesia.",
    tips: ["Atur privasi akun untuk mengontrol siapa yang bisa melihat kontenmu", "Waspada penipuan investasi yang dipromosikan via TikTok"],
  },
  // Tech
  "google.com": {
    name: "Google",
    category: "Teknologi",
    desc: "Mesin pencari dan ekosistem layanan digital terbesar di dunia, milik Alphabet Inc.",
    tips: ["Aktifkan verifikasi 2 langkah di akun Google kamu", "Periksa izin aplikasi yang terhubung ke akun Google secara berkala"],
  },
  "youtube.com": {
    name: "YouTube",
    category: "Platform Video",
    desc: "Platform berbagi video terbesar di dunia milik Google, dengan lebih dari 2 miliar pengguna aktif.",
    tips: ["Aktifkan fitur Konten Terbatas untuk pengalaman yang lebih aman", "Waspadai komentar berisi link mencurigakan"],
  },
  "github.com": {
    name: "GitHub",
    category: "Platform Developer",
    desc: "Platform hosting kode sumber dan kolaborasi developer terbesar di dunia, dimiliki Microsoft sejak 2018.",
    tips: ["Aktifkan 2FA dan gunakan SSH key untuk akses repositori", "Jangan commit API key atau password ke repositori publik"],
  },
  // Government
  "bi.go.id": {
    name: "Bank Indonesia",
    category: "Pemerintah",
    desc: "Website resmi Bank Indonesia, bank sentral Republik Indonesia yang mengatur kebijakan moneter.",
    tips: ["BI tidak pernah meminta data pribadi melalui telepon atau email", "Akses selalu melalui bi.go.id (domain resmi pemerintah)"],
  },
  // News
  "detik.com": {
    name: "Detik",
    category: "Media Berita",
    desc: "Portal berita online terbesar Indonesia milik Transmedia, menyajikan berita 24 jam.",
    tips: ["Verifikasi kebenaran berita dari sumber lain sebelum menyebarkan", "Perhatikan tanggal publikasi berita sebelum membagikannya"],
  },
  "kompas.com": {
    name: "Kompas",
    category: "Media Berita",
    desc: "Portal berita digital dari Kompas Gramedia Group, salah satu media paling dipercaya di Indonesia.",
    tips: ["Kompas memiliki tim cek fakta — manfaatkan untuk verifikasi hoaks"],
  },
};

/**
 * Ambil konteks domain untuk hasil yang lebih personal
 */
function getDomainContext(domain) {
  // Cek exact match dulu
  if (DOMAIN_CONTEXT[domain]) return DOMAIN_CONTEXT[domain];
  // Cek subdomain (mail.google.com → google.com)
  for (const [key, val] of Object.entries(DOMAIN_CONTEXT)) {
    if (domain.endsWith("." + key)) return val;
  }
  return null;
}

/**
 * Main scan function — comprehensive URL analysis
 */
export async function scanURL(input) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }

  if (input.length > 2048) {
    return {
      url: input.slice(0, 100),
      domain: "unknown",
      status: "warn",
      statusLabel: "ERROR",
      statusEmoji: "⚠️",
      score: 0,
      riskLevel: "Tidak Diketahui",
      summary: "URL terlalu panjang (maks 2048 karakter).",
      issues: [
        {
          label: "URL Valid",
          value: "Terlalu panjang",
          status: "danger",
          detail: "URL melebihi batas maksimum 2048 karakter.",
        },
      ],
      details: null,
      checkedAt: new Date().toISOString(),
    };
  }

  const lowerInput = input.toLowerCase().trim();
  if (
    lowerInput.startsWith("javascript:") ||
    lowerInput.startsWith("data:") ||
    lowerInput.startsWith("vbscript:")
  ) {
    return {
      url: input.slice(0, 100),
      domain: "blocked",
      status: "danger",
      statusLabel: "DIBLOKIR",
      statusEmoji: "🚫",
      score: 0,
      riskLevel: "Sangat Tinggi",
      summary: "URL menggunakan protokol berbahaya dan telah diblokir.",
      issues: [
        {
          label: "Protokol Berbahaya",
          value: lowerInput.split(":")[0].toUpperCase(),
          status: "danger",
          detail: "Protokol ini dapat mengeksekusi kode berbahaya di browser.",
        },
      ],
      details: null,
      checkedAt: new Date().toISOString(),
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalized = normalizeURL(input);
  const domain = extractDomain(input);
  const urlParts = extractURLParts(input);

  // ── Deteksi & analisis IP address ──
  const hostname = urlParts?.hostname || domain;
  if (isValidIPv4(hostname)) {
    return analyzeIPAddress(hostname, urlParts, normalized);
  }

  if (!domain || domain.length < 2) {
    return {
      url: normalized,
      domain: domain || "unknown",
      status: "warn",
      statusLabel: "ERROR",
      statusEmoji: "⚠️",
      score: 0,
      riskLevel: "Tidak Diketahui",
      summary: "URL tidak valid. Pastikan format URL benar.",
      issues: [
        {
          label: "URL Valid",
          value: "Tidak dapat diproses",
          status: "danger",
          detail: "Format URL tidak dapat dikenali.",
        },
      ],
      details: null,
      checkedAt: new Date().toISOString(),
    };
  }

  // Run all checks
  const isSafeDomain = SAFE_DOMAINS.some(
    (safe) => domain === safe || domain.endsWith("." + safe)
  );

  // Ambil konteks domain
  const domainContext = getDomainContext(domain);

  let hasSSL = false;
  try {
    hasSSL = new URL(normalized).protocol === "https:";
  } catch {}

  const typosquat = !isSafeDomain ? checkTyposquatting(domain) : null;
  const suspiciousTLD = !isSafeDomain ? checkSuspiciousTLD(domain) : null;
  const isShortURLResult = isShortURL(domain);

  // FIX: analyzeKeywords sekarang terima domain saja, bukan full URL
  const keywords = !isSafeDomain ? analyzeKeywords(domain) : { high: [], medium: [], low: [] };

  const subdomains = countSubdomains(domain);
  const domainLength = analyzeDomainLength(domain);
  const patterns = detectSuspiciousPatterns(input);

  const homoglyphs = detectHomoglyphs(domain);
  const pathAnalysis = urlParts
    ? analyzePath(urlParts.pathname)
    : { suspicious: [], safe: true, segments: [], description: "" };
  const queryAnalysis = urlParts
    ? analyzeQueryParams(urlParts.search)
    : { suspicious: [], safe: [], total: 0, description: "" };
  const entropy = calculateEntropy(domain.split(".")[0]);
  const domainAgeHints = detectDomainAgeHints(domain);
  const redirectHints = detectRedirectHints(input);

  const { score, deductions } = calculateRiskScore({
    hasSSL,
    typosquat,
    suspiciousTLD,
    isShortURL: isShortURLResult,
    keywords,
    subdomains,
    urlParts,
    patterns,
    domainLength,
    isSafeDomain,
  });

  // Build issues list
  const issues = [];

  issues.push({
    label: "SSL/HTTPS",
    value: hasSSL ? "Terenkripsi (HTTPS)" : "Tidak Aman (HTTP)",
    status: hasSSL ? "safe" : "danger",
    detail: hasSSL
      ? "Koneksi dienkripsi dengan HTTPS."
      : "Website tidak menggunakan HTTPS. Data bisa disadap.",
  });

  if (typosquat) {
    issues.push({
      label: "Impersonasi Brand",
      value: `Menyamar sebagai ${typosquat.brand}`,
      status: "danger",
      detail: `Domain "${domain}" bukan domain resmi ${typosquat.brand} (${typosquat.real}). Kemungkinan besar phising!`,
    });
  }

  if (suspiciousTLD) {
    issues.push({
      label: "Ekstensi Domain Berbahaya",
      value: `${suspiciousTLD.tld} (risiko ${suspiciousTLD.level})`,
      status: suspiciousTLD.level === "high" ? "danger" : "warn",
      detail: `Ekstensi domain "${suspiciousTLD.tld}" sangat sering digunakan untuk situs phising.`,
    });
  }

  if (isShortURLResult) {
    issues.push({
      label: "URL Shortener",
      value: "Tujuan tersembunyi",
      status: "danger",
      detail: "URL shortener menyembunyikan link tujuan. Sangat berisiko dialihkan ke situs phising.",
    });
  }

  if (keywords.high.length > 0) {
    issues.push({
      label: "Kata Kunci Phising di Domain",
      value: keywords.high.join(", "),
      status: "danger",
      detail: "Nama domain mengandung kata kunci yang sangat umum digunakan dalam serangan phising.",
    });
  }

  if (keywords.medium.length > 0) {
    issues.push({
      label: "Kata Kunci Mencurigakan di Domain",
      value: keywords.medium.join(", "),
      status: "warn",
      detail: "Nama domain mengandung kata kunci yang sering dikaitkan dengan penipuan.",
    });
  }

  if (subdomains > 3) {
    issues.push({
      label: "Subdomain Berlebihan",
      value: `${subdomains} level`,
      status: "warn",
      detail: "Terlalu banyak subdomain adalah teknik umum phising.",
    });
  }

  if (urlParts?.isIP) {
    issues.push({
      label: "Alamat IP Langsung",
      value: urlParts.hostname,
      status: "danger",
      detail: "Website menggunakan IP langsung, bukan domain. Sangat mencurigakan.",
    });
  }

  if (patterns.length > 0) {
    issues.push({
      label: "Pola Mencurigakan",
      value: patterns.join(", "),
      status: "warn",
      detail: "Terdapat pola URL yang tidak biasa dan berpotensi berbahaya.",
    });
  }

  if (domainLength.isVeryLong) {
    issues.push({
      label: "Domain Terlalu Panjang",
      value: `${domainLength.total} karakter`,
      status: "warn",
      detail: "Domain panjang sering digunakan untuk menyamarkan domain asli.",
    });
  }

  if (isSafeDomain) {
    issues.push({
      label: "Domain Terpercaya",
      value: "Domain resmi & terverifikasi",
      status: "safe",
      detail: "Domain ini adalah domain resmi yang dikenal aman.",
    });
  }

  // Summary kontekstual — tidak generik
  let status, statusLabel, statusEmoji, riskLevel, summary;
  if (score >= 80) {
    status = "safe"; statusLabel = "AMAN"; statusEmoji = "✅"; riskLevel = "Rendah";
    summary = domainContext
      ? `${domainContext.name} adalah layanan ${domainContext.category.toLowerCase()} resmi. ${domainContext.desc}`
      : "Link ini terlihat aman untuk dikunjungi. Tetap waspada saat mengisi data pribadi.";
  } else if (score >= 60) {
    status = "warn"; statusLabel = "WASPADA"; statusEmoji = "⚠️"; riskLevel = "Sedang";
    summary = "Ada indikasi mencurigakan pada link ini. Hati-hati sebelum mengklik dan jangan isi data pribadi.";
  } else if (score >= 40) {
    status = "warn"; statusLabel = "BERBAHAYA"; statusEmoji = "🚨"; riskLevel = "Tinggi";
    summary = "Link ini sangat mencurigakan. Kemungkinan besar phising. Jangan klik!";
  } else {
    status = "danger"; statusLabel = "BAHAYA"; statusEmoji = "🚨"; riskLevel = "Sangat Tinggi";
    summary = "Link ini hampir pasti phising atau berbahaya. JANGAN KLIK!";
  }

  return {
    url: normalized,
    domain,
    status,
    statusLabel,
    statusEmoji,
    score,
    riskLevel,
    summary,
    issues,
    domainContext,
    details: {
      urlParts,
      domainLength,
      keywords,
      patterns,
      deductions,
      homoglyphs,
      pathAnalysis,
      queryAnalysis,
      entropy,
      domainAgeHints,
      redirectHints,
      technicalDetails: {
        domainParts: domain.split("."),
        tld: domain.split(".").pop(),
        mainDomain: domain.split(".")[0],
        subdomainCount: subdomains,
        urlLength: normalized.length,
        isSafeDomain,
      },
    },
    checkedAt: new Date().toISOString(),
  };
}