/**
 * scanner.js — Enhanced Client-side URL analysis
 *
 * Comprehensive URL security analysis with strict phishing detection.
 */

// Known phishing brand keywords
const BRAND_KEYWORDS = [
  { keyword: "tokopedia", brand: "Tokopedia", real: "tokopedia.com", category: "E-commerce" },
  { keyword: "shopee", brand: "Shopee", real: "shopee.co.id", category: "E-commerce" },
  { keyword: "bukalapak", brand: "Bukalapak", real: "bukalapak.com", category: "E-commerce" },
  { keyword: "lazada", brand: "Lazada", real: "lazada.co.id", category: "E-commerce" },
  { keyword: "blibli", brand: "Blibli", real: "blibli.com", category: "E-commerce" },
  { keyword: "bca", brand: "BCA", real: "bca.co.id", category: "Banking" },
  { keyword: "bri", brand: "BRI", real: "bri.co.id", category: "Banking" },
  { keyword: "mandiri", brand: "Mandiri", real: "mandiri.co.id", category: "Banking" },
  { keyword: "bni", brand: "BNI", real: "bni.co.id", category: "Banking" },
  { keyword: "btn", brand: "BTN", real: "btn.co.id", category: "Banking" },
  { keyword: "cimb", brand: "CIMB", real: "cimb.co.id", category: "Banking" },
  { keyword: "gojek", brand: "Gojek", real: "gojek.com", category: "Transportation" },
  { keyword: "grab", brand: "Grab", real: "grab.com", category: "Transportation" },
  { keyword: "dana", brand: "DANA", real: "dana.id", category: "Fintech" },
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
  { keyword: "toko", brand: "Tokopedia", real: "tokopedia.com", category: "E-commerce" },
];

// ALL suspicious TLDs with risk level (expanded)
const SUSPICIOUS_TLDS = {
  high: [
    ".xyz", ".top", ".buzz", ".click", ".link", ".work", ".racing",
    ".win", ".stream", ".gdn", ".bid", ".download", ".loan", ".men",
    ".party", ".science", ".trade", ".faith", ".date", ".review",
    ".country", ".racing", ".cricket", ".gq", ".ml", ".cf", ".ga",
    ".tk", ".pw", ".cc", ".icu", ".cam", ".rest", ".surf",
  ],
  medium: [
    ".info", ".site", ".online", ".website", ".space", ".fun",
    ".store", ".shop", ".club", ".vip", ".pro", ".mobi",
  ],
  low: [".biz", ".name", ".tel"],
};

// Short URL domains (expanded)
const SHORT_URL_DOMAINS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd",
  "v.gd", "ow.ly", "rb.gy", "cutt.ly", "short.link",
  "s.id", "bitly.com", "dwz.cn", "buff.ly", "tiny.cc",
  "adf.ly", "bc.vc", "sh.st", "ity.im", "q.gs",
  "clk.sh", "ouo.io", "exe.io", "shrinke.me", "v.ht",
  "tny.im", "shorturl.at", "rb.gy",
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
  "bca.co.id", "bri.co.id", "mandiri.co.id", "bni.co.id",
  "btn.co.id", "cimb.co.id", "danamon.co.id", "permata.co.id",
  "bni.co.id", "mega.co.id", "bukopin.co.id",
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

function checkTyposquatting(domain) {
  const cleanDomain = domain.replace(/^www\./, "");

  for (const brand of BRAND_KEYWORDS) {
    const d = cleanDomain.replace(/[^a-z0-9]/g, "");
    const b = brand.keyword;

    // Check if domain CONTAINS brand keyword but ISN'T the real domain
    const containsBrand = d.includes(b) || cleanDomain.includes(b);
    const isRealDomain = cleanDomain === brand.real || cleanDomain.endsWith("." + brand.real);

    if (containsBrand && !isRealDomain) {
      // Check for various phishing patterns
      const patterns = [
        // Character substitution: tokoped1a, sh0pee
        d.replace(/[0-9]/g, (m) => ({ "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t" }[m] || m)).includes(b),
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
        // Similar sounding: shoppee, tokoped
        d.includes(b.slice(0, -1)) && d.length < b.length + 5,
      ];

      if (patterns.some(Boolean)) {
        return {
          ...brand,
          pattern: "Brand impersonation detected",
        };
      }
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

function analyzeKeywords(input) {
  const lower = input.toLowerCase();
  const domain = extractDomain(input).toLowerCase();
  const found = { high: [], medium: [], low: [] };

  for (const [level, keywords] of Object.entries(SUSPICIOUS_KEYWORDS)) {
    for (const keyword of keywords) {
      // Check in both full URL and domain part
      if (lower.includes(keyword) || domain.includes(keyword)) {
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
    // If there's a dot after @, it's a real host - very dangerous
    if (afterAt.includes(".") && afterAt.length > 3) {
      // Check if before@ looks like a legit domain (trick: making you think you're going to bank.com)
      const beforeHasBrand = BRAND_KEYWORDS.some((b) => beforeAt.toLowerCase().includes(b.keyword));
      patterns.push(`@ symbol trick: browser navigates to "${afterAt}", NOT "${beforeAt}"`);
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
  if (input.toLowerCase().startsWith("data:") || input.toLowerCase().startsWith("javascript:")) {
    patterns.push("Dangerous URI scheme detected");
  }

  // Brand name in domain with suspicious TLD
  const tld = checkSuspiciousTLD(domain);
  if (tld) {
    for (const brand of BRAND_KEYWORDS) {
      if (domain.includes(brand.keyword) && !domain.endsWith(brand.real)) {
        patterns.push(`Brand "${brand.brand}" used with suspicious TLD ${tld.tld}`);
        break;
      }
    }
  }

  return patterns;
}

function calculateRiskScore(checks) {
  let score = 100;
  const deductions = [];

  // SSL/HTTPS check
  if (!checks.hasSSL) {
    score -= 15;
    deductions.push({ item: "SSL/HTTPS", points: -15, reason: "Tidak menggunakan koneksi terenkripsi" });
  }

  // Brand impersonation (MAJOR - high deduction)
  if (checks.typosquat) {
    let brandPoints = 40;

    // Extra penalty if brand + suspicious keywords in domain
    const domainLower = extractDomain(checks.urlParts?.hostname || "").toLowerCase();
    const hasSuspiciousSuffix = /promo|sale|login|update|verify|bonus|voucher|claim|hadiah|diskon|cashback/.test(domainLower);
    if (hasSuspiciousSuffix) {
      brandPoints += 15;
      deductions.push({
        item: "Brand + Kata Kunci",
        points: -15,
        reason: `Brand ${checks.typosquat.brand} dikombinasikan dengan kata kunci penipuan`,
      });
    }

    // Extra penalty if domain uses hyphens (common phishing pattern)
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
    const points = checks.suspiciousTLD.level === "high" ? 20 : checks.suspiciousTLD.level === "medium" ? 12 : 5;
    score -= points;
    deductions.push({
      item: "Domain Extension Berbahaya",
      points: -points,
      reason: `TLD ${checks.suspiciousTLD.tld} (risiko ${checks.suspiciousTLD.level})`,
    });
  }

  // Short URL (always risky - hides real destination)
  if (checks.isShortURL) {
    let shortPoints = 25;

    // Extra penalty if shortener + brand keyword in path
    const urlLower = (checks.urlParts?.pathname || "").toLowerCase();
    const hostLower = (checks.urlParts?.hostname || "").toLowerCase();
    const hasBrandInPath = BRAND_KEYWORDS.some((b) => urlLower.includes(b.keyword) || hostLower.includes(b.keyword));
    if (hasBrandInPath) {
      shortPoints += 20;
      deductions.push({
        item: "Shortener + Brand",
        points: -20,
        reason: "URL shortener dengan nama brand sangat mencurigakan",
      });
    }

    score -= shortPoints;
    deductions.push({ item: "URL Shortener", points: -25, reason: "Menyembunyikan tujuan asli - tidak bisa diverifikasi" });
  }

  // Suspicious keywords - high risk (in domain, not just path)
  if (checks.keywords.high.length > 0) {
    // Check if keywords are in the DOMAIN part (more suspicious than in path)
    const domainLower = extractDomain(checks.urlParts?.hostname || "").toLowerCase();
    const keywordsInDomain = checks.keywords.high.filter((k) => domainLower.includes(k));

    let keywordPoints = 15;
    if (keywordsInDomain.length > 0) {
      keywordPoints += 10;
      deductions.push({
        item: "Kata Kunci di Domain",
        points: -10,
        reason: `Kata "${keywordsInDomain.join('", "')}" ada di domain — sangat mencurigakan`,
      });
    }

    score -= keywordPoints;
    deductions.push({
      item: "Kata Kunci Phising",
      points: -15,
      reason: checks.keywords.high.join(", "),
    });
  }

  // Suspicious keywords - medium risk
  if (checks.keywords.medium.length > 0) {
    score -= 10;
    deductions.push({
      item: "Kata Kunci Mencurigakan",
      points: -10,
      reason: checks.keywords.medium.join(", "),
    });
  }

  // Subdomains
  if (checks.subdomains > 3) {
    score -= 10;
    deductions.push({ item: "Subdomain Berlebihan", points: -10, reason: `${checks.subdomains} level subdomain` });
  }

  // IP address
  if (checks.urlParts?.isIP) {
    score -= 25;
    deductions.push({ item: "IP Address Langsung", points: -25, reason: "Menggunakan IP, bukan domain" });
  }

  // Suspicious patterns
  if (checks.patterns.length > 0) {
    // @ symbol trick is extremely dangerous - higher penalty
    const hasAtTrick = checks.patterns.some((p) => p.includes("@ symbol"));
    const hasCriticalPattern = checks.patterns.some((p) => p.includes("CRITICAL"));

    let patternPoints = checks.patterns.length * 5;
    if (hasAtTrick) patternPoints += 20;
    if (hasCriticalPattern) patternPoints += 15;

    score -= patternPoints;
    deductions.push({ item: "Pola Mencurigakan", points: -patternPoints, reason: checks.patterns.join("; ") });
  }

  // Domain length
  if (checks.domainLength.isVeryLong) {
    score -= 10;
    deductions.push({ item: "Domain Terlalu Panjang", points: -10, reason: `${checks.domainLength.total} karakter` });
  } else if (checks.domainLength.hasRandomChars) {
    score -= 8;
    deductions.push({ item: "Domain Acak", points: -8, reason: "Karakter acak tanpa makna" });
  }

  // COMBINATION BONUSES (multiple red flags = worse)
  const redFlags = [
    checks.typosquat,
    checks.suspiciousTLD?.level === "high",
    checks.keywords.high.length > 0,
    checks.isShortURL,
    checks.urlParts?.isIP,
  ].filter(Boolean).length;

  if (redFlags >= 3) {
    score -= 15;
    deductions.push({ item: "Multiple Red Flags", points: -15, reason: `${redFlags} tanda bahaya terdeteksi sekaligus` });
  } else if (redFlags >= 2) {
    score -= 10;
    deductions.push({ item: "Multiple Red Flags", points: -10, reason: `${redFlags} tanda bahaya terdeteksi` });
  }

  // Safe domain bonus
  if (checks.isSafeDomain) {
    score = Math.max(score, 90);
  }

  return { score: Math.max(0, Math.min(100, score)), deductions };
}

/**
 * Main scan function — comprehensive URL analysis
 */
export async function scanURL(input) {
  // Input validation
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
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
      issues: [{
        label: "URL Valid",
        value: "Terlalu panjang",
        status: "danger",
        detail: "URL melebihi batas maksimum 2048 karakter.",
      }],
      details: null,
      checkedAt: new Date().toISOString(),
    };
  }

  // Block dangerous protocols
  const lowerInput = input.toLowerCase().trim();
  if (lowerInput.startsWith('javascript:') || lowerInput.startsWith('data:') || lowerInput.startsWith('vbscript:')) {
    return {
      url: input.slice(0, 100),
      domain: "blocked",
      status: "danger",
      statusLabel: "DIBLOKIR",
      statusEmoji: "🚫",
      score: 0,
      riskLevel: "Sangat Tinggi",
      summary: "URL menggunakan protokol berbahaya dan telah diblokir.",
      issues: [{
        label: "Protokol Berbahaya",
        value: lowerInput.split(':')[0].toUpperCase(),
        status: "danger",
        detail: "Protokol ini dapat mengeksekusi kode berbahaya di browser.",
      }],
      details: null,
      checkedAt: new Date().toISOString(),
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalized = normalizeURL(input);
  const domain = extractDomain(input);
  const urlParts = extractURLParts(input);

  // Validate domain
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
      issues: [{
        label: "URL Valid",
        value: "Tidak dapat diproses",
        status: "danger",
        detail: "Format URL tidak dapat dikenali.",
      }],
      details: null,
      checkedAt: new Date().toISOString(),
    };
  }

  // Run all checks
  const isSafeDomain = SAFE_DOMAINS.some(
    (safe) => domain === safe || domain.endsWith("." + safe)
  );

  let hasSSL = false;
  try {
    hasSSL = new URL(normalized).protocol === "https:";
  } catch {}

  const typosquat = !isSafeDomain ? checkTyposquatting(domain) : null;
  const suspiciousTLD = !isSafeDomain ? checkSuspiciousTLD(domain) : null;
  const isShortUR = isShortURL(domain);
  const keywords = analyzeKeywords(input);
  const subdomains = countSubdomains(domain);
  const domainLength = analyzeDomainLength(domain);
  const patterns = detectSuspiciousPatterns(input);

  // Calculate risk score
  const { score, deductions } = calculateRiskScore({
    hasSSL,
    typosquat,
    suspiciousTLD,
    isShortURL: isShortUR,
    keywords,
    subdomains,
    urlParts,
    patterns,
    domainLength,
    isSafeDomain,
  });

  // Build issues list
  const issues = [];

  // SSL/HTTPS
  issues.push({
    label: "SSL/HTTPS",
    value: hasSSL ? "Terenkripsi (HTTPS)" : "Tidak Aman (HTTP)",
    status: hasSSL ? "safe" : "danger",
    detail: hasSSL
      ? "Koneksi dienkripsi dengan HTTPS."
      : "Website tidak menggunakan HTTPS. Data bisa disadap.",
  });

  // Brand impersonation
  if (typosquat) {
    issues.push({
      label: "Impersonasi Brand",
      value: `Menyamar sebagai ${typosquat.brand}`,
      status: "danger",
      detail: `Domain "${domain}" bukan domain resmi ${typosquat.brand} (${typosquat.real}). Kemungkinan besar phising!`,
    });
  }

  // TLD analysis
  if (suspiciousTLD) {
    issues.push({
      label: "Ekstensi Domain Berbahaya",
      value: `${suspiciousTLD.tld} (risiko ${suspiciousTLD.level})`,
      status: suspiciousTLD.level === "high" ? "danger" : "warn",
      detail: `Ekstensi domain "${suspiciousTLD.tld}" sangat sering digunakan untuk situs phising.`,
    });
  }

  // Short URL
  if (isShortUR) {
    issues.push({
      label: "URL Shortener",
      value: "Tujuan tersembunyi",
      status: "danger",
      detail: "URL shortener menyembunyikan link tujuan. Sangat berisiko dialihkan ke situs phising.",
    });
  }

  // Keywords - high
  if (keywords.high.length > 0) {
    issues.push({
      label: "Kata Kunci Phising",
      value: keywords.high.join(", "),
      status: "danger",
      detail: "Link mengandung kata kunci yang sangat umum digunakan dalam serangan phising.",
    });
  }

  // Keywords - medium
  if (keywords.medium.length > 0) {
    issues.push({
      label: "Kata Kunci Mencurigakan",
      value: keywords.medium.join(", "),
      status: "warn",
      detail: "Link mengandung kata kunci yang sering dikaitkan dengan penipuan.",
    });
  }

  // Subdomains
  if (subdomains > 3) {
    issues.push({
      label: "Subdomain Berlebihan",
      value: `${subdomains} level`,
      status: "warn",
      detail: "Terlalu banyak subdomain adalah teknik umum phising.",
    });
  }

  // IP Address
  if (urlParts?.isIP) {
    issues.push({
      label: "Alamat IP Langsung",
      value: urlParts.hostname,
      status: "danger",
      detail: "Website menggunakan IP langsung, bukan domain. Sangat mencurigakan.",
    });
  }

  // Suspicious patterns
  if (patterns.length > 0) {
    issues.push({
      label: "Pola Mencurigakan",
      value: patterns.join(", "),
      status: "warn",
      detail: "Terdapat pola URL yang tidak biasa dan berpotensi berbahaya.",
    });
  }

  // Domain length
  if (domainLength.isVeryLong) {
    issues.push({
      label: "Domain Terlalu Panjang",
      value: `${domainLength.total} karakter`,
      status: "warn",
      detail: "Domain panjang sering digunakan untuk menyamarkan domain asli.",
    });
  }

  // Safe domain
  if (isSafeDomain) {
    issues.push({
      label: "Domain Terpercaya",
      value: "Domain resmi & terverifikasi",
      status: "safe",
      detail: "Domain ini adalah domain resmi yang dikenal aman.",
    });
  }

  // Determine status
  let status, statusLabel, statusEmoji, riskLevel, summary;
  if (score >= 80) {
    status = "safe"; statusLabel = "AMAN"; statusEmoji = "✅"; riskLevel = "Rendah";
    summary = "Link ini terlihat aman untuk dikunjungi. Tetap waspada saat mengisi data pribadi.";
  } else if (score >= 60) {
    status = "warn"; statusLabel = "WASPADA"; statusEmoji = "⚠️"; riskLevel = "Sedang";
    summary = "Ada indikasi mencurigakan. Hati-hati sebelum mengklik dan jangan isi data pribadi.";
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
    details: {
      urlParts,
      domainLength,
      keywords,
      patterns,
      deductions,
    },
    checkedAt: new Date().toISOString(),
  };
}
