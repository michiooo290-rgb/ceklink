/**
 * scanner-data.js — Static reference data for URL heuristic scanner
 *
 * Dipisah dari scanner.js (logic) supaya data brand/TLD/domain
 * gampang di-update tanpa nyentuh kode analisisnya.
 */

export const BRAND_KEYWORDS = [
  { keyword: "tokopedia", brand: "Tokopedia", real: "tokopedia.com", category: "E-commerce" },
  { keyword: "shopee", brand: "Shopee", real: "shopee.co.id", category: "E-commerce" },
  { keyword: "bukalapak", brand: "Bukalapak", real: "bukalapak.com", category: "E-commerce" },
  { keyword: "lazada", brand: "Lazada", real: "lazada.co.id", category: "E-commerce" },
  { keyword: "blibli", brand: "Blibli", real: "blibli.com", category: "E-commerce" },
  // ── Banking ──
  { keyword: "bca", brand: "BCA", real: "klikbca.com", category: "Banking" },
  // FIX: "bri" ditambahkan kembali — word-boundary regex di checkTyposquatting
  // sudah mencegah false positive pada "fabric", "bridge", dll.
  // Keyword pendek (≤3 char) wajib match dengan word boundary, bukan substring.
  { keyword: "bri", brand: "BRI", real: "bri.co.id", category: "Banking" },
  { keyword: "bankbri", brand: "BRI", real: "bri.co.id", category: "Banking" },
  { keyword: "mandiri", brand: "Mandiri", real: "mandiri.co.id", category: "Banking" },
  { keyword: "bni", brand: "BNI", real: "bni.co.id", category: "Banking" },
  { keyword: "btn", brand: "BTN", real: "btn.co.id", category: "Banking" },
  { keyword: "cimb", brand: "CIMB", real: "cimb.co.id", category: "Banking" },
  { keyword: "bsi", brand: "BSI", real: "bsi.co.id", category: "Banking" },
  { keyword: "seabank", brand: "SeaBank", real: "seabank.co.id", category: "Banking" },
  { keyword: "bankjago", brand: "Jago", real: "jago.com", category: "Banking" },
  // ── Transportation ──
  { keyword: "gojek", brand: "Gojek", real: "gojek.com", category: "Transportation" },
  { keyword: "grab", brand: "Grab", real: "grab.com", category: "Transportation" },
  // ── Fintech ──
  // FIX: "dana" dihapus karena false positive (bandana, indiana, dll)
  // Ganti dengan kombinasi yang lebih spesifik
  { keyword: "mydana", brand: "DANA", real: "dana.id", category: "Fintech" },
  { keyword: "e-dana", brand: "DANA", real: "dana.id", category: "Fintech" },
  { keyword: "dompetdana", brand: "DANA", real: "dana.id", category: "Fintech" },
  { keyword: "ovo", brand: "OVO", real: "ovo.id", category: "Fintech" },
  { keyword: "gopay", brand: "GoPay", real: "gojek.com", category: "Fintech" },
  { keyword: "linkaja", brand: "LinkAja", real: "linkaja.id", category: "Fintech" },
  { keyword: "paypal", brand: "PayPal", real: "paypal.com", category: "Fintech" },
  { keyword: "flip", brand: "Flip", real: "flip.id", category: "Fintech" },
  { keyword: "jenius", brand: "Jenius", real: "jenius.com", category: "Fintech" },
  // ── Social Media ──
  { keyword: "instagram", brand: "Instagram", real: "instagram.com", category: "Social Media" },
  { keyword: "facebook", brand: "Facebook", real: "facebook.com", category: "Social Media" },
  { keyword: "tiktok", brand: "TikTok", real: "tiktok.com", category: "Social Media" },
  // ── Messaging ──
  { keyword: "whatsapp", brand: "WhatsApp", real: "whatsapp.com", category: "Messaging" },
  // ── Technology ──
  { keyword: "google", brand: "Google", real: "google.com", category: "Technology" },
  { keyword: "microsoft", brand: "Microsoft", real: "microsoft.com", category: "Technology" },
  { keyword: "apple", brand: "Apple", real: "apple.com", category: "Technology" },
  // ── Entertainment ──
  { keyword: "netflix", brand: "Netflix", real: "netflix.com", category: "Entertainment" },
  { keyword: "spotify", brand: "Spotify", real: "spotify.com", category: "Entertainment" },
  // ── Crypto ──
  { keyword: "indodax", brand: "Indodax", real: "indodax.com", category: "Crypto" },
  { keyword: "pintu", brand: "Pintu", real: "pintu.co.id", category: "Crypto" },
  { keyword: "tokocrypto", brand: "Tokocrypto", real: "tokocrypto.com", category: "Crypto" },
  // ── Telco / Utilities ──
  { keyword: "telkomsel", brand: "Telkomsel", real: "telkomsel.com", category: "Telco" },
  { keyword: "indihome", brand: "Indihome", real: "indihome.co.id", category: "Telco" },
  { keyword: "pln", brand: "PLN", real: "pln.co.id", category: "Utilities" },
  // ── Government ──
  { keyword: "pajak", brand: "DJP", real: "pajak.go.id", category: "Government" },
  { keyword: "bpjs", brand: "BPJS", real: "bpjs-kesehatan.go.id", category: "Government" },
  // ── Developer / Cloud platforms ──
  { keyword: "github", brand: "GitHub", real: "github.com", category: "Developer Platform" },
  { keyword: "gitlab", brand: "GitLab", real: "gitlab.com", category: "Developer Platform" },
  { keyword: "bitbucket", brand: "Bitbucket", real: "bitbucket.org", category: "Developer Platform" },
  { keyword: "npmjs", brand: "npm", real: "npmjs.com", category: "Package Registry" },
  { keyword: "docker", brand: "Docker", real: "docker.com", category: "Developer Platform" },
  { keyword: "vercel", brand: "Vercel", real: "vercel.com", category: "Cloud Hosting" },
  { keyword: "netlify", brand: "Netlify", real: "netlify.com", category: "Cloud Hosting" },
  { keyword: "cloudflare", brand: "Cloudflare", real: "cloudflare.com", category: "Cloud Hosting" },
  { keyword: "firebase", brand: "Firebase", real: "firebase.google.com", category: "Cloud Hosting" },
  { keyword: "aws", brand: "AWS", real: "aws.amazon.com", category: "Cloud Hosting" },
  { keyword: "azure", brand: "Azure", real: "azure.microsoft.com", category: "Cloud Hosting" },
  // FIX: "toko" dihapus — terlalu umum dalam bahasa Indonesia (tokobuku, tokoobat, dll)
  // Tokopedia sudah dicover oleh keyword "tokopedia" di atas
];


// ALL suspicious TLDs with risk level (expanded)
export const SUSPICIOUS_TLDS = {
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
export const SHORT_URL_DOMAINS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd",
  "v.gd", "ow.ly", "rb.gy", "cutt.ly", "short.link",
  "s.id", "bitly.com", "dwz.cn", "buff.ly", "tiny.cc",
  "adf.ly", "bc.vc", "sh.st", "ity.im", "q.gs",
  "clk.sh", "ouo.io", "exe.io", "shrinke.me", "v.ht",
  "tny.im", "shorturl.at",
  // duplikat rb.gy sudah dihapus
];


// Known safe domains (curated list)
export const SAFE_DOMAINS = [
  // Global Tech
  "google.com", "google.co.id", "youtube.com", "facebook.com", "fb.com",
  "instagram.com", "twitter.com", "x.com", "github.com", "gitlab.com",
  "stackoverflow.com", "wikipedia.org", "wikimedia.org", "whatsapp.com",
  "tiktok.com", "netflix.com", "spotify.com", "microsoft.com", "live.com",
  "outlook.com", "apple.com", "amazon.com", "aws.amazon.com",
  // Microsoft 365 / Office / Azure (FIX: domain resmi Microsoft, sebelumnya
  // sharepoint.com dll belum di-whitelist sehingga link kantor/kampus
  // yang sah kena false positive)
  "sharepoint.com", "office.com", "office365.com", "microsoftonline.com",
  "onedrive.live.com", "onedrive.com", "azure.com", "azurewebsites.net",
  "windows.net", "bing.com", "skype.com", "teams.microsoft.com",
  "reddit.com", "linkedin.com", "medium.com", "discord.com",
  "zoom.us", "slack.com", "notion.so", "figma.com", "canva.com",
  "vercel.com", "netlify.com", "cloudflare.com", "digitalocean.com",
  // Indonesian E-commerce
  "tokopedia.com", "tokopedia.co.id", "shopee.co.id", "shopee.com",
  "bukalapak.com", "bukalapak.co.id", "blibli.com", "lazada.co.id",
  "traveloka.com", "tiket.com",
  // Indonesian Transportation & Fintech
  "gojek.com", "grab.com", "dana.id", "ovo.id", "linkaja.id",
  "gopay.co.id", "flip.id",
  // Indonesian Banking
  "klikbca.com", "bca.co.id", "bri.co.id", "mandiri.co.id", "bni.co.id",
  "btn.co.id", "cimb.co.id", "danamon.co.id", "permata.co.id",
  "mega.co.id", "bukopin.co.id", "bsi.co.id", "seabank.co.id", "jago.com",
  "jenius.com", "bankjago.com",
  // Indonesian Government
  "bi.go.id", "kominfo.go.id", "indonesia.go.id", "go.id",
  "pajak.go.id", "bpjs-kesehatan.go.id", "polri.go.id", "kemenkes.go.id",
  // Indonesian Education (FIX: tambah .ac.id supaya domain kampus dianggap sah)
  "ac.id", "sch.id",
  // Indonesian News
  "detik.com", "kompas.com", "tribunnews.com", "liputan6.com",
  "tempo.co", "cnnindonesia.com", "kumparan.com",
  // Indonesian Telecom
  "telkomsel.com", "indosat.com", "xl.co.id", "smartfren.com",
  // Indonesian Other
  "pln.co.id", "pertamina.com",
];


// User-controlled hosting platforms — konten dibuat oleh pengguna, bukan platform
// Domain-platform boleh dikenal, tetapi repo/pages/file di dalamnya BUKAN konten resmi platform
export const USER_CONTROLLED_HOSTING = [
  { domain: "github.io", service: "GitHub Pages", risk: "high", detail: "Halaman web yang dibuat oleh pengguna GitHub, bukan oleh GitHub sendiri." },
  { domain: "githubusercontent.com", service: "GitHub Content", risk: "high", detail: "File mentah dari repositori publik GitHub — konten dikontrol oleh pengguna." },
  { domain: "raw.githubusercontent.com", service: "GitHub Raw", risk: "high", detail: "File mentah dari repositori GitHub — konten dikontrol oleh pengguna." },
  { domain: "gist.githubusercontent.com", service: "GitHub Gist", risk: "medium", detail: "Snippet kode publik dari GitHub — konten dikontrol oleh pengguna." },
  { domain: "vercel.app", service: "Vercel", risk: "medium", detail: "Deploy preview dari Vercel — konten dikontrol oleh pengguna." },
  { domain: "netlify.app", service: "Netlify", risk: "medium", detail: "Deploy preview dari Netlify — konten dikontrol oleh pengguna." },
  { domain: "pages.dev", service: "Cloudflare Pages", risk: "medium", detail: "Deploy preview dari Cloudflare Pages — konten dikontrol oleh pengguna." },
  { domain: "workers.dev", service: "Cloudflare Workers", risk: "medium", detail: "Serverless function dari Cloudflare Workers — konten dikontrol oleh pengguna." },
  { domain: "web.app", service: "Firebase Hosting", risk: "medium", detail: "Deploy dari Firebase Hosting — konten dikontrol oleh pengguna." },
  { domain: "firebaseapp.com", service: "Firebase", risk: "medium", detail: "Deploy dari Firebase — konten dikontrol oleh pengguna." },
  { domain: "render.com", service: "Render", risk: "medium", detail: "Deploy dari Render — konten dikontrol oleh pengguna." },
  { domain: "fly.dev", service: "Fly.io", risk: "medium", detail: "Deploy dari Fly.io — konten dikontrol oleh pengguna." },
  { domain: "surge.sh", service: "Surge.sh", risk: "medium", detail: "Deploy dari Surge — konten dikontrol oleh pengguna." },
  { domain: "glitch.me", service: "Glitch", risk: "medium", detail: "Deploy dari Glitch — konten dikontrol oleh pengguna." },
  { domain: "repl.co", service: "Replit", risk: "medium", detail: "Deploy dari Replit — konten dikontrol oleh pengguna." },
  { domain: "railway.app", service: "Railway", risk: "medium", detail: "Deploy dari Railway — konten dikontrol oleh pengguna." },
];

// Suspicious keywords in URL
// FIX: keyword sekarang hanya dicek di DOMAIN, bukan di full URL/path
// agar tidak false positive untuk URL resmi seperti tokopedia.com/login
export const SUSPICIOUS_KEYWORDS = {
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


// ── Homoglyph Detection ────────────────────────────────────────────
// FIX: karakter ASCII biasa ("0", "1", "l", "|", "5") DIHAPUS dari daftar
// "karakter mirip". Sebelumnya huruf "l" dianggap mirip "i", sehingga
// hampir semua domain sah yang mengandung huruf l/0/1 kena penalti palsu
// (mis. polbat-my.sharepoint.com). Substitusi angka seperti tok0pedia
// tetap tertangkap oleh logika typosquatting (checkTyposquatting).
// Daftar ini sekarang HANYA berisi karakter non-Latin (Cyrillic/Yunani/aksen)
// yang merupakan teknik penyamaran homoglyph sungguhan.
export const HOMOGLYPH_MAP = {
  a: ["а", "ạ", "à", "á", "â", "ã", "ä", "å", "ɑ", "α"],
  e: ["е", "ẹ", "è", "é", "ê", "ë", "ε"],
  o: ["о", "ọ", "ò", "ó", "ô", "õ", "ö", "σ"],
  i: ["і", "ì", "í", "î", "ï", "ı"],
  n: ["ñ", "ń", "ņ", "ň"],
  c: ["с", "ç", "ć", "č"],
  p: ["р", "ρ"],
  x: ["х", "χ"],
  y: ["у", "ý", "ÿ"],
  s: ["ѕ", "ş", "ś", "š"],
  l: ["ⅼ", "ӏ"],
};


// ── Path Analysis ──────────────────────────────────────────────────
export const SUSPICIOUS_PATH_KEYWORDS = [
  "login", "signin", "sign-in", "verify", "verifikasi", "update",
  "secure", "password", "confirm", "account", "akun", "rekening",
  "otp", "pin", "ktp", "npwp", "suspend", "blokir", "blocked",
  "reset", "recover", "unlock", "validate", "authenticate",
  // Developer platform phishing keywords
  "oauth", "auth", "sso", "2fa", "security", "support", "recovery",
  "download", "release",
];


// ── Query Parameter Analysis ───────────────────────────────────────
export const SUSPICIOUS_QUERY_PARAMS = [
  "redirect", "redirect_url", "return", "return_url", "next", "goto",
  "url", "link", "dest", "destination", "target", "callback",
  "token", "auth", "session", "sid", "code", "key",
  "email", "user", "username", "password", "pass", "pin",
];


// Memberikan konteks spesifik per domain agar hasil tidak terasa generik

export const DOMAIN_CONTEXT = {
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
    tips: ["Aktifkan 2FA dan gunakan SSH key untuk akses repositori", "Jangan commit API key atau password ke repositori publik", "Verifikasi pemilik repo sebelum mengunduh file atau mengikuti instruksi instalasi"],
  },
  "gitlab.com": {
    name: "GitLab",
    category: "Platform Developer",
    desc: "Platform DevOps dan hosting kode sumber open-source, alternatif GitHub untuk kolaborasi tim.",
    tips: ["Aktifkan 2FA untuk keamanan akun", "Hati-hati dengan CI/CD pipeline dari repo publik yang tidak dikenal"],
  },
  "npmjs.com": {
    name: "npm",
    category: "Package Registry",
    desc: "Registry paket JavaScript terbesar di dunia, digunakan untuk mengunduh dan mempublikasikan library Node.js.",
    tips: ["Periksa jumlah download dan tanggal update sebelum install paket", "Gunakan npm audit untuk mendeteksi vulnerability"],
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
