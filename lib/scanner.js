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

import {
  BRAND_KEYWORDS, SUSPICIOUS_TLDS, SHORT_URL_DOMAINS, SAFE_DOMAINS,
  SUSPICIOUS_KEYWORDS, HOMOGLYPH_MAP, SUSPICIOUS_PATH_KEYWORDS,
  SUSPICIOUS_QUERY_PARAMS, DOMAIN_CONTEXT,
} from "./scanner-data";


// Known phishing brand keywords





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

  // ── Cross-check ke database ancaman nyata (URLhaus + Google Safe Browsing) ──
  // Heuristik di atas cuma nangkep pola phishing/impersonasi brand. Banyak
  // ancaman nyata (malware, judi, situs yang udah dilaporkan) nggak punya
  // pola itu sama sekali, jadi kita cocokkan ke database ancaman asli juga.
  let threatCheck = null;
  try {
    const res = await fetch("/api/threat-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: normalized }),
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) threatCheck = await res.json();
  } catch {
    // Gagal hubungi server (offline, timeout, dst) — lanjut pakai hasil heuristik aja
  }

  if (threatCheck?.listed) {
    const source = threatCheck.urlhaus?.listed
      ? "URLhaus"
      : "Google Safe Browsing";
    const threatLabel = threatCheck.urlhaus?.listed
      ? threatCheck.urlhaus.threat
      : (threatCheck.googleSafeBrowsing?.threatTypes || []).join(", ");

    issues.unshift({
      label: "Terdaftar di Database Ancaman",
      value: source,
      status: "danger",
      detail: `URL ini sudah dilaporkan dan terverifikasi sebagai ancaman (${threatLabel}) oleh ${source}. Jangan dikunjungi.`,
    });

    return {
      url: normalized,
      domain,
      status: "danger",
      statusLabel: "BAHAYA",
      statusEmoji: "🚨",
      score: 0,
      riskLevel: "Sangat Tinggi",
      summary: `Link ini sudah terverifikasi berbahaya oleh ${source}. JANGAN KLIK atau isi data apapun.`,
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
        threatCheck,
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
      threatCheck,
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