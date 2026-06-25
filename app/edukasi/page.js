"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ShieldAlert, Search, Users, KeyRound, ShieldCheck, Bug, Heart,
  AlertTriangle, ChevronDown, BookOpen, ExternalLink, ArrowLeft,
  Lock, Eye, Smartphone, Globe, Mail, Phone, MessageSquare,
  TrendingUp, Target, BarChart3, Award,
} from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import AnimatedAIChat from "../../components/AnimatedAIChat";

// ─── Phising Stats Data ─────────────────────────────────────────────

const YEARLY_TREND = [
  { year: 2021, attacks: 25, growth: null },
  { year: 2022, attacks: 42, growth: 68 },
  { year: 2023, attacks: 65, growth: 55 },
  { year: 2024, attacks: 89, growth: 37 },
];
const MAX_ATTACKS = 89;

const SECTOR_DATA = [
  { name: "Banking", pct: 35, color: "#00ff88" },
  { name: "E-commerce", pct: 28, color: "#06b6d4" },
  { name: "Fintech", pct: 18, color: "#8a5cff" },
  { name: "Pemerintah", pct: 12, color: "#ffaa00" },
  { name: "Lainnya", pct: 7, color: "#666680" },
];

const METHOD_DATA = [
  { name: "SMS", pct: 45, icon: Smartphone, color: "#00ff88" },
  { name: "Email", pct: 30, icon: Mail, color: "#06b6d4" },
  { name: "WhatsApp", pct: 15, icon: MessageSquare, color: "#25d366" },
  { name: "Social Media", pct: 10, icon: Globe, color: "#8a5cff" },
];

const QUICK_STATS = [
  { value: 89, suffix: " jt", label: "Serangan Phising", sub: "terdeteksi 2024", icon: ShieldAlert, color: "#ff3b3b" },
  { value: 2.5, suffix: "T", label: "Kerugian Nasional", sub: "Rupiah 2024", icon: TrendingUp, color: "#ffaa00" },
  { value: 2.5, suffix: " jt", label: "Rata-rata per Korban", sub: "Rupiah", icon: Target, color: "#06b6d4" },
  { value: 68, suffix: "%", label: "Pertumbuhan YoY", sub: "2021 → 2022", icon: BarChart3, color: "#8a5cff" },
];

// ─── Animated Counter ───────────────────────────────────────────────

function AnimCounter({ target, suffix = "", duration = 2000, decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{decimals > 0 ? val.toFixed(decimals) : Math.floor(val)}{suffix}</span>;
}

// ─── Phising Stats Section ──────────────────────────────────────────

function PhisingStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12" ref={ref}>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-2">
          Phising di Indonesia dalam Angka
        </h2>
        <p className="text-[#666680] text-sm">
          Data dari laporan keamanan siber nasional & internasional
        </p>
      </motion.div>

      {/* Ranking Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          className="glass-card p-5 text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Award size={28} className="text-[#ffaa00] mx-auto mb-2" />
          <div className="font-heading font-bold text-3xl text-[#ffaa00]">#1</div>
          <div className="text-sm text-[#e0e0e0]">Asia Tenggara</div>
          <div className="text-xs text-[#666680]">Target phising terbanyak</div>
        </motion.div>
        <motion.div
          className="glass-card p-5 text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Globe size={28} className="text-[#06b6d4] mx-auto mb-2" />
          <div className="font-heading font-bold text-3xl text-[#06b6d4]">Top 10</div>
          <div className="text-sm text-[#e0e0e0]">Global</div>
          <div className="text-xs text-[#666680]">Target phising dunia</div>
        </motion.div>
      </div>

      {/* Trend Chart */}
      <motion.div
        className="glass-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="font-heading font-semibold text-base text-[#e0e0e0] mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#00ff88]" />
          Tren Serangan Phising (2021–2024)
        </h3>
        <div className="space-y-3">
          {YEARLY_TREND.map((d, i) => (
            <motion.div
              key={d.year}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            >
              <span className="text-sm font-mono text-[#8888aa] w-10">{d.year}</span>
              <div className="flex-1 h-7 bg-white/[0.03] rounded-lg overflow-hidden relative">
                <motion.div
                  className="h-full rounded-lg bg-gradient-to-r from-[#00ff88] to-[#06b6d4]"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(d.attacks / MAX_ATTACKS) * 100}%` } : {}}
                  transition={{ delay: 0.7 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-white">
                  <AnimCounter target={d.attacks} suffix=" jt" duration={1500} />
                </span>
              </div>
              {d.growth && (
                <span className="text-xs font-mono text-[#00ff88] w-12 text-right">
                  +{d.growth}%
                </span>
              )}
              {!d.growth && <span className="w-12" />}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sector & Method Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Sector */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="font-heading font-semibold text-sm text-[#e0e0e0] mb-4 flex items-center gap-2">
            <Target size={16} className="text-[#ff3b3b]" />
            Sektor Terancam
          </h3>
          <div className="space-y-3">
            {SECTOR_DATA.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#8888aa]">{s.name}</span>
                  <span className="font-mono" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${s.pct}%` } : {}}
                    transition={{ delay: 1 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Method */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h3 className="font-heading font-semibold text-sm text-[#e0e0e0] mb-4 flex items-center gap-2">
            <Smartphone size={16} className="text-[#00ff88]" />
            Metode Phising
          </h3>
          <div className="space-y-3">
            {METHOD_DATA.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.9 + i * 0.08, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#8888aa] flex items-center gap-1.5">
                      <Icon size={12} />{m.name}
                    </span>
                    <span className="font-mono" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: m.color }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${m.pct}%` } : {}}
                      transition={{ delay: 1.1 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {QUICK_STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              className="glass-card p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 + i * 0.1, duration: 0.4, type: "spring" }}
            >
              <Icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
              <div className="font-heading font-bold text-xl" style={{ color: s.color }}>
                <AnimCounter target={s.value} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
              </div>
              <div className="text-xs text-[#e0e0e0] mt-1">{s.label}</div>
              <div className="text-[10px] text-[#555570]">{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Source */}
      <motion.p
        className="text-center text-[10px] text-[#555570]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        Sumber: APWG, Kaspersky Security Network, Kominfo, BSSN (2021–2024)
      </motion.p>
    </section>
  );
}

// ─── Article Data ────────────────────────────────────────────────────

const ARTICLES = [
  {
    id: "apa-itu-phising",
    icon: ShieldAlert,
    title: "Apa itu Phising?",
    desc: "Pengenalan lengkap tentang phising — jenis-jenis, cara kerja, dan statistik di Indonesia.",
    tags: ["dasar", "phising", "pengenalan"],
    content: {
      intro: "Phising adalah teknik penipuan online di mana pelaku menyamar sebagai pihak terpercaya untuk mencuri data pribadi seperti password, nomor kartu kredit, atau informasi sensitif lainnya.",
      sections: [
        {
          title: "Jenis-jenis Phising",
          items: [
            { name: "Email Phishing", desc: "Email palsu yang meniru perusahaan resmi (bank, e-commerce, dll) dengan link ke situs palsu." },
            { name: "SMS Phishing (Smishing)", desc: "Pesan SMS yang mengaku dari bank atau layanan, meminta klik link atau kirim OTP." },
            { name: "Voice Phishing (Vishing)", desc: "Telepon dari 'petugas bank' atau 'polisi' yang meminta data pribadi." },
            { name: "Spear Phishing", desc: "Serangan yang ditargetkan ke individu tertentu dengan informasi personal yang sudah dikumpulkan." },
            { name: "Whaling", desc: "Spear phishing yang menargetkan eksekutif atau pejabat tinggi perusahaan." },
          ],
        },
        {
          title: "Cara Kerja Phiser",
          steps: [
            "Membuat situs palsu yang mirip dengan situs resmi (tokopedia, BCA, dll)",
            "Mengirim link phising via email, SMS, WhatsApp, atau media sosial",
            "Korban mengklik link dan melihat halaman yang mirip asli",
            "Korban memasukkan data pribadi (password, OTP, nomor kartu)",
            "Data dicuri dan digunakan untuk akses akun atau pencurian uang",
          ],
        },
        {
          title: "Statistik di Indonesia",
          stats: [
            { value: "892+", label: "Link phising dilaporkan di CekLink" },
            { value: "Rp 2.5T", label: "Kerugian akibat penipuan online (2024)" },
            { value: "73%", label: "Serangan dimulai dari email phising" },
          ],
        },
      ],
    },
  },
  {
    id: "mengenali-link-phising",
    icon: Search,
    title: "Cara Mengenali Link Phising",
    desc: "10 ciri-ciri link phising yang wajib kamu ketahui beserta contoh nyata.",
    tags: ["praktis", "link", "deteksi"],
    content: {
      intro: "Mengenali link phising adalah skill paling penting di era digital. Berikut 10 ciri-ciri yang harus kamu waspadai:",
      sections: [
        {
          title: "10 Ciri-ciri Link Phising",
          items: [
            { name: "1. URL Salah Eja", desc: "tokoped1a.com (angka 1 mengganti i), sh0pee.co.id (angka 0 mengganti o), bca-prom0.com" },
            { name: "2. Tidak HTTPS", desc: "Tidak ada ikon gembok di browser. Website resmi pasti menggunakan HTTPS." },
            { name: "3. Domain Mencurigakan", desc: "Ekstensi .xyz, .top, .click, .link, .work — jarang digunakan website resmi." },
            { name: "4. Subdomain Berlebihan", desc: "login.bca.co.id.evil.com — perhatikan domain sebenarnya di ujung." },
            { name: "5. URL Shortener", desc: "bit.ly, tinyurl, t.co — menyembunyikan tujuan asli." },
            { name: "6. Meminta Data Mendesak", desc: "'Akun Anda akan diblokir dalam 24 jam!' — tekanan psikologis." },
            { name: "7. Grammar Berantakan", desc: "Teks dengan typo atau grammar yang aneh." },
            { name: "8. Terlalu Bagus", desc: "'Selamat! Anda menang iPhone 15!' — hadiah yang tidak pernah diikuti." },
            { name: "9. Pengirim Tidak Dikenal", desc: "Email/SMS dari nomor atau alamat yang tidak dikenal." },
            { name: "10. Di Luar Konteks", desc: "Link dikirim tanpa konteks atau alasan yang jelas." },
          ],
        },
        {
          title: "Perbandingan URL Asli vs Phising",
          table: {
            headers: ["URL Asli", "URL Phising", "Modus"],
            rows: [
              ["tokopedia.com", "tokoped1a-sale.com", "Ejaan salah + keyword sale"],
              ["shopee.co.id", "shopee-promo.link", "Brand + TLD mencurigakan"],
              ["bca.co.id", "bca-login-secure.xyz", "Brand + login + TLD"],
              ["bit.ly → tokopedia.com", "bit.ly/fake-tokopedia", "Shortener menyembunyikan tujuan"],
            ],
          },
        },
      ],
    },
  },
  {
    id: "social-engineering",
    icon: Users,
    title: "Social Engineering",
    desc: "Teknik manipulasi psikologis yang digunakan penipu untuk mendapatkan akses ke data kamu.",
    tags: ["manipulasi", "psikologi", "teknik"],
    content: {
      intro: "Social engineering adalah teknik manipulasi psikologis yang mengeksploitasi kepercayaan, rasa takut, atau keserakahan manusia. Phising adalah salah satu bentuknya.",
      sections: [
        {
          title: "6 Teknik Umum",
          items: [
            { name: "Pretexting", desc: "Membuat skenario palsu untuk mendapatkan kepercayaan. Contoh: 'Saya dari IT bank, saya butuh verifikasi akun Anda.'" },
            { name: "Baiting", desc: "Menawarkan sesuatu yang menggiurkan (USB gratis, voucher, hadiah) untuk menarik korban." },
            { name: "Tailgating", desc: "Mengikuti orang masuk ke area terbatas dengan berpura-pura sebagai karyawan." },
            { name: "Quid Pro Quo", desc: "Menawarkan bantuan/layanan sebagai imbalan informasi. Contoh: 'Saya bantu fix laptop Anda, tapi butuh password WiFi.'" },
            { name: "Watering Hole", desc: "Menginfeksi website yang sering dikunjungi target." },
            { name: "Phishing", desc: "Mengirim link/email palsu untuk mencuri data melalui halaman tiruan." },
          ],
        },
        {
          title: "Contoh Kasus di Indonesia",
          items: [
            { name: "Modus OTP", desc: "Penelpon mengaku dari bank, meminta OTP yang dikirim ke HP. Korban kehilangan uang di rekening." },
            { name: "Modus Undian", desc: "SMS/WA: 'Selamat! Anda menang undian GoPay Rp 10 juta. Klik link untuk klaim.'" },
            { name: "Modus Kurir", desc: "Pesan palsu dari 'JNE/J&T' dengan link tracking palsu yang mengarah ke situs phising." },
            { name: "Modus Bantuan Pemerintah", desc: "Link palsu bantuan sosial/bansos yang meminta data KTP dan rekening." },
          ],
        },
      ],
    },
  },
  {
    id: "keamanan-password",
    icon: KeyRound,
    title: "Keamanan Password",
    desc: "Cara membuat password yang kuat, menggunakan password manager, dan menghindari kebocoran.",
    tags: ["password", "keamanan", "praktis"],
    content: {
      intro: "Password adalah pertahanan pertama akun kamu. 81% pelanggaran data terjadi karena password yang lemah atau bocor.",
      sections: [
        {
          title: "5 Tips Password Kuat",
          items: [
            { name: "Minimal 12 Karakter", desc: "Semakin panjang semakin aman. Gunakan frasa yang mudah diingat: 'KucingSayaMakanIkan2024!'" },
            { name: "Kombinasikan Karakter", desc: "Huruf besar, huruf kecil, angka, dan simbol (!@#$%)." },
            { name: "Jangan Pakai Info Personal", desc: "Hindari nama, tanggal lahir, nama hewan peliharaan." },
            { name: "Unik untuk Setiap Akun", desc: "Jangan gunakan password yang sama untuk semua akun." },
            { name: "Gunakan Password Manager", desc: "Aplikasi yang menyimpan semua password secara aman dan terenkripsi." },
          ],
        },
        {
          title: "Rekomendasi Password Manager",
          items: [
            { name: "Bitwarden", desc: "Gratis, open-source, tersedia di semua platform. Pilihan terbaik untuk pemula." },
            { name: "1Password", desc: "Berbayar tapi sangat mudah digunakan. Fitur family sharing." },
            { name: "KeePass", desc: "Gratis, offline, cocok untuk yang peduli privasi maksimal." },
          ],
        },
        {
          title: "Cek Apakah Password Bocor",
          steps: [
            "Buka haveibeenpwned.com",
            "Masukkan email atau password kamu",
            "Situs akan menunjukkan apakah data kamu pernah bocor",
            "Jika bocor, segera ganti password di semua akun yang menggunakan password tersebut",
          ],
        },
      ],
    },
  },
  {
    id: "two-factor-auth",
    icon: ShieldCheck,
    title: "Two-Factor Authentication (2FA)",
    desc: "Lapisan keamanan tambahan yang wajib diaktifkan di semua akun penting.",
    tags: ["2fa", "otp", "keamanan"],
    content: {
      intro: "2FA adalah lapisan keamanan tambahan di atas password. Bahkan jika password bocor, penyerang tetap tidak bisa masuk tanpa faktor kedua.",
      sections: [
        {
          title: "Jenis-jenis 2FA",
          items: [
            { name: "SMS OTP", desc: "Kode dikirim via SMS. Cukup aman tapi rentan SIM-swap attack." },
            { name: "Authenticator App", desc: "Google Authenticator, Authy, Microsoft Authenticator. Lebih aman dari SMS." },
            { name: "Hardware Key", desc: "YubiKey, Google Titan. Paling aman — fisik, tidak bisa di-hack remot." },
          ],
        },
        {
          title: "Cara Setup 2FA",
          table: {
            headers: ["Platform", "Lokasi Setup", "Metode"],
            rows: [
              ["Google", "myaccount.google.com → Security", "Authenticator / SMS"],
              ["Instagram", "Settings → Security → 2FA", "Authenticator / SMS"],
              ["WhatsApp", "Settings → Account → Two-Step Verification", "PIN 6 digit"],
              ["Tokopedia", "Settings → Keamanan → Verifikasi 2 Langkah", "SMS / Authenticator"],
              ["BCA", "myBCA → Settings → Keamanan", "SMS OTP / m-BCA"],
            ],
          },
        },
        {
          title: "Mana yang Paling Aman?",
          steps: [
            "🥇 Hardware Key (YubiKey) — paling aman, tidak bisa di-hack remot",
            "🥈 Authenticator App — sangat aman, gratis, mudah digunakan",
            "🥉 SMS OTP — cukup aman, tapi rentan SIM-swap",
            "❌ Email OTP — paling lemah, karena email bisa di-hack",
          ],
        },
      ],
    },
  },
  {
    id: "malware-virus",
    icon: Bug,
    title: "Malware & Virus",
    desc: "Jenis-jenis malware, cara penyebaran, dan tips pencegahan.",
    tags: ["malware", "virus", "keamanan"],
    content: {
      intro: "Malware (malicious software) adalah program yang dirancang untuk merusak, mengganggu, atau mendapat akses tidak sah ke sistem komputer.",
      sections: [
        {
          title: "Jenis-jenis Malware",
          items: [
            { name: "Trojan", desc: "Menyamar sebagai software yang sah tapi mengandung kode berbahaya di dalamnya." },
            { name: "Ransomware", desc: "Mengenkripsi file kamu dan meminta tebusan untuk membukanya. Sangat berbahaya!" },
            { name: "Spyware", desc: "Diam-diam memantau aktivitas kamu — merekam ketikan, screenshot, browsing history." },
            { name: "Adware", desc: "Menampilkan iklan berlebihan dan bisa mengarahkan ke situs berbahaya." },
            { name: "Worm", desc: "Menyebar sendiri melalui jaringan tanpa perlu interaksi manusia." },
            { name: "Keylogger", desc: "Merekam setiap ketikan keyboard — password, chat, kartu kredit." },
          ],
        },
        {
          title: "Cara Penyebaran",
          items: [
            { name: "Email Lampiran", desc: "File .exe, .doc, .pdf yang mengandung macro berbahaya." },
            { name: "Download Software Bajakan", desc: "Crack, keygen, software gratis dari situs tidak resmi." },
            { name: "Link Phising", desc: "Klik link yang mengarah ke download malware." },
            { name: "USB/Flashdisk", desc: "Flashdisk yang sudah terinfeksi malware." },
            { name: "Iklan Berbahaya", desc: "Klik iklan yang mengarah ke download otomatis." },
          ],
        },
        {
          title: "7 Tips Pencegahan",
          steps: [
            "Update OS dan software secara rutin",
            "Jangan download software bajakan",
            "Gunakan antivirus yang terpercaya (Windows Defender sudah cukup untuk kebanyakan orang)",
            "Jangan klik lampiran email dari pengirim tidak dikenal",
            "Scan USB/flashdisk sebelum membuka isinya",
            "Gunakan browser dengan built-in malware protection",
            "Backup data secara rutin ke cloud atau hard disk eksternal",
          ],
        },
      ],
    },
  },
  {
    id: "keamanan-keluarga",
    icon: Heart,
    title: "Tips Keamanan untuk Keluarga",
    desc: "Cara melindungi anak dan orang tua dari ancaman digital.",
    tags: ["keluarga", "anak", "edukasi"],
    content: {
      intro: "Anak-anak dan orang tua adalah target empuk penipu online. Edukasi keluarga adalah investasi keamanan terbaik.",
      sections: [
        {
          title: "Edukasi Anak",
          items: [
            { name: "Jangan Bagikan Info Personal", desc: "Nama lengkap, alamat, nama sekolah, nomor HP — jangan pernah dibagikan ke stranger online." },
            { name: "Curiga ke Stranger Online", desc: "Orang yang baik di internet belum tentu baik. Jangan mudah percaya." },
            { name: "Laporkan ke Orang Tua", desc: "Jika menemukan konten aneh, bullying, atau orang mencurigakan — langsung lapor." },
            { name: "Jangan Klik Sembarang Link", desc: "Link dari game, chat, atau social media bisa berbahaya." },
          ],
        },
        {
          title: "Tips untuk Orang Tua",
          items: [
            { name: "Pasang Parental Control", desc: "Google Family Link, Apple Screen Time — kontrol konten dan waktu layar anak." },
            { name: "Kenali Tanda-tanda", desc: "Anak tiba-tiba menutup layar, marah saat diminta HP, atau punya 'teman' baru yang tidak dikenal." },
            { name: "Komunikasi Terbuka", desc: "Buat anak nyaman untuk cerita. Jangan langsung marah — edukasi dengan sabar." },
            { name: "Contohkan yang Baik", desc: "Orang tua juga harus menerapkan keamanan digital. Anak meniru apa yang dilihat." },
          ],
        },
        {
          title: "Bahaya Oversharing di Social Media",
          items: [
            { name: "Foto Boarding Pass", desc: "Barcode bisa di-scan untuk dapatkan data penerbangan dan identitas." },
            { name: "Check-in Lokasi", desc: "Penjahat tahu kapan rumah kosong." },
            { name: "Foto Dokumen", desc: "KTP, SIM, kartu mahasiswa — data bisa disalahgunakan." },
            { name: "Curhat Berlebihan", desc: "Informasi personal bisa digunakan untuk social engineering." },
          ],
        },
      ],
    },
  },
  {
    id: "sudah-jadi-korban",
    icon: AlertTriangle,
    title: "Sudah Jadi Korban? Ini Langkahnya",
    desc: "Checklist darurat 10 langkah yang harus dilakukan jika sudah terkena phising atau penipuan.",
    tags: ["darurat", "korban", "langkah"],
    content: {
      intro: "Jangan panik! Semakin cepat kamu bertindak, semakin kecil kerugian. Ikuti checklist ini:",
      sections: [
        {
          title: "10 Langkah Darurat",
          steps: [
            "1. Jangan panik — tetap tenang agar bisa berpikir jernih",
            "2. Tutup halaman phising segera — jangan isi data apapun lagi",
            "3. Ganti password akun yang terdampak — gunakan password baru yang kuat",
            "4. Ganti password di semua akun yang menggunakan password serupa",
            "5. Aktifkan 2FA di semua akun penting",
            "6. Hubungi bank jika data finansial bocor — blokir kartu jika perlu",
            "7. Scan device dengan antivirus — pastikan tidak ada malware",
            "8. Laporkan link phising di CekLink — bantu melindungi orang lain",
            "9. Laporkan ke pihak berwajib — buat laporan di polisi atau Kominfo",
            "10. Monitor rekening dan akun — cek transaksi mencurigakan secara rutin",
          ],
        },
        {
          title: "Kontak Penting",
          table: {
            headers: ["Layanan", "Kontak", "Keterangan"],
            rows: [
              ["Bank BCA", "1500888", "Blokir kartu/akun segera"],
              ["Bank BRI", "14017", "Blokir kartu/akun segera"],
              ["Bank Mandiri", "14000", "Blokir kartu/akun segera"],
              ["Bank BNI", "1500046", "Blokir kartu/akun segera"],
              ["Kominfo", "aduankonten.id", "Lapor konten/nomor penipuan"],
              ["Polisi Online", "polri.go.id", "Buat laporan online"],
              ["Dumas Presisi", "0812-1234-1234", "Pengaduan masyarakat Polri"],
            ],
          },
        },
        {
          title: "Cara Melaporkan di CekLink",
          steps: [
            "Buka CekLink di ceklink.id",
            "Paste link phising di kolom Pemeriksa URL",
            "Klik 'Cek' untuk analisis",
            "Jika hasilnya Bahaya, klik tombol 'Laporkan'",
            "Isi alasan pelaporan dan deskripsi",
            "Klik 'Kirim Laporan'",
          ],
        },
      ],
    },
  },
];

// ─── Render Helpers ──────────────────────────────────────────────────

function renderContent(section, idx) {
  if (section.items) {
    return (
      <div className="space-y-3">
        {section.items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="w-2 h-2 rounded-full bg-[#00ff88] mt-2 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium text-[#e0e0e0]">{item.name}</span>
              <p className="text-xs text-[#666680] mt-1">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (section.steps) {
    return (
      <div className="space-y-2">
        {section.steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 text-sm text-[#8888aa]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-[#00ff88] font-mono text-xs mt-0.5">{">"}</span>
            <span>{step}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (section.stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {section.stats.map((stat, i) => (
          <motion.div
            key={i}
            className="text-center p-4 rounded-xl bg-[#00ff88]/5 border border-[#00ff88]/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="font-heading font-bold text-2xl text-[#00ff88]">{stat.value}</div>
            <div className="text-xs text-[#666680] mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (section.table) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a2e]">
              {section.table.headers.map((h, i) => (
                <th key={i} className="text-left py-3 px-3 text-[#8888aa] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row, i) => (
              <tr key={i} className="border-b border-[#1a1a2e]/30 hover:bg-white/[0.02] transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className={`py-3 px-3 ${j === 0 ? "text-[#00ff88] font-mono text-xs" : "text-[#8888aa]"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

// ─── Main Component ──────────────────────────────────────────────────

export default function EdukasiPage() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ARTICLES;
    const q = search.toLowerCase();
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q))
    );
  }, [search]);

  return (
    <>
      <FloatingHeader />

      <main className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#666680] hover:text-[#00ff88] transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </a>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                <BookOpen size={24} className="text-[#00ff88]" />
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl">
                Pusat Edukasi
              </h1>
            </div>
            <p className="text-[#666680] text-lg max-w-xl mx-auto mb-8">
              Pelajari cara melindungi diri dan keluarga dari ancaman digital
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666680]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari topik edukasi..."
                className="input-glow w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555570]"
              />
            </div>
          </motion.div>
        </section>

        {/* Phising Stats Section */}
        <PhisingStats />

        {/* Articles Grid */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-[#666680]"
              >
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p>Tidak ditemukan topik untuk &quot;{search}&quot;</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filtered.map((article, idx) => {
                  const IconComponent = article.icon;
                  const isOpen = openId === article.id;

                  return (
                    <motion.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <div className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? "ring-1 ring-[#00ff88]/20" : ""}`}>
                        {/* Header */}
                        <button
                          onClick={() => setOpenId(isOpen ? null : article.id)}
                          className="w-full px-6 py-5 text-left flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                          aria-expanded={isOpen}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-[#00ff88]/20" : "bg-[#00ff88]/10"}`}>
                            <IconComponent size={22} className="text-[#00ff88]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="font-heading font-semibold text-lg text-[#e0e0e0]">
                              {article.title}
                            </h2>
                            <p className="text-sm text-[#666680] mt-1 truncate">
                              {article.desc}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="hidden sm:flex gap-1">
                              {article.tags.map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-white/[0.03] text-[#555570]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={20} className="text-[#666680]" />
                            </motion.div>
                          </div>
                        </button>

                        {/* Content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 border-t border-white/[0.05] pt-5">
                                <p className="text-[#8888aa] text-sm leading-relaxed mb-6">
                                  {article.content.intro}
                                </p>

                                {article.content.sections.map((section, sIdx) => (
                                  <div key={sIdx} className="mb-6 last:mb-0">
                                    <h3 className="font-heading font-semibold text-base text-[#e0e0e0] mb-4 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                                      {section.title}
                                    </h3>
                                    {renderContent(section, sIdx)}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16">
          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-heading font-bold text-xl text-[#e0e0e0] mb-3">
              Punya Link Mencurigakan?
            </h3>
            <p className="text-[#666680] text-sm mb-6">
              Cek keamanan link sebelum mengklik. Gratis dan cepat!
            </p>
            <a
              href="/#cek-link"
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <Search size={18} />
              Cek Link Sekarang
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
      <AnimatedAIChat />
    </>
  );
}
