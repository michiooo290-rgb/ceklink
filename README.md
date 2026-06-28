# Urlveil (CekLink) — Pengecek Keamanan Link Indonesia

Urlveil adalah web app untuk mengecek apakah sebuah URL aman atau berbahaya (phishing/malware) secara real-time, dengan antarmuka berbahasa Indonesia. Tempel link, dapat hasil analisis dalam hitungan detik.

## ✨ Fitur

- **Quick Scan** — pengecekan cepat di halaman utama lewat database ancaman real-time (URLhaus + Google Safe Browsing)
- **Analisis Mendalam** — pengecekan lebih lengkap di halaman Analisis (Google Safe Browsing + URLScan.io, termasuk screenshot hasil scan)
- **Phishing Database** — daftar URL phishing/malware yang baru terdeteksi, dengan deteksi otomatis brand yang ditiru (BCA, Tokopedia, WhatsApp, dll)
- **Edukasi** — artikel & panduan keamanan digital
- **Rate limiting** per IP untuk semua endpoint API
- **Security headers** lengkap (CSP, HSTS, X-Frame-Options, dll)

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- React 18 + Tailwind CSS
- Framer Motion (animasi)
- Three.js (efek visual)

## 🔌 Sumber Data Ancaman

| Sumber | Dipakai di | Butuh API Key? |
|---|---|---|
| [URLhaus](https://urlhaus.abuse.ch/) | Quick Scan (`/api/threat-check`) | Tidak wajib (disarankan, daftar gratis) |
| [Google Safe Browsing](https://safebrowsing.google.com/) | Quick Scan & Analisis Mendalam | Ya |
| [URLScan.io](https://urlscan.io/) | Analisis Mendalam (`/api/scan`) | Ya |

Kalau API key tidak diisi, fitur terkait akan otomatis nonaktif/dilewati (graceful degradation) — bukan error.

## 🚀 Menjalankan di Lokal

### Prasyarat
- Node.js 18+
- npm

### Instalasi

```bash
git clone https://github.com/michiooo290-rgb/ceklink.git
cd ceklink
npm install
```

### Konfigurasi Environment

Copy `.env.example` jadi `.env.local`, lalu isi API key yang diperlukan:

```bash
cp .env.example .env.local
```

Variabel yang dipakai:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_SAFE_BROWSING_API_KEY=       # https://developers.google.com/safe-browsing
URLSCAN_API_KEY=                    # https://urlscan.io/user/signup
URLHAUS_AUTH_KEY=                   # opsional, https://auth.abuse.ch/
```

### Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Command | Keterangan |
|---|---|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production build |
| `npm run lint` | Jalankan ESLint |

## 📁 Struktur Project

```
app/
  page.js              # Halaman utama (Quick Scan)
  analisis/            # Halaman Analisis Mendalam
  edukasi/             # Artikel edukasi keamanan digital
  login/, signup/      # Halaman auth (UI — belum terhubung backend)
  api/
    scan/              # Endpoint analisis mendalam (GSB + URLScan.io)
    threat-check/      # Endpoint quick scan (URLhaus + GSB)
    phishing/          # Endpoint data Phishing Database
components/            # Komponen UI (URLScanner, ResultCard, PhishingDB, dll)
lib/
  scanner.js           # Logic utama quick scanner
  scanner-data.js       # Data statis untuk scanner
  rate-limit.js         # Rate limiter in-memory per IP
public/                # Aset statis (logo, robots.txt, dll)
```

## ⚠️ Catatan Pengembangan

- **Login/Signup** saat ini baru berupa UI (belum terhubung ke backend/database asli) — submit form hanya simulasi.
- **Rate limiter** bersifat in-memory, cukup untuk single-instance. Untuk deploy di environment serverless multi-instance (Vercel dst.), pertimbangkan Upstash Redis / Vercel KV.

## 👤 Author

Dibuat oleh [Michio](https://github.com/michiooo290-rgb).
