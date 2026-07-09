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
import MeshBackground from "../../components/MeshBackground";

// ─── Phising Stats Data ─────────────────────────────────────────────

const YEARLY_TREND = [
  { year: 2021, attacks: 254, growth: null },
  { year: 2022, attacks: 508, growth: 100 },
  { year: 2023, attacks: 710, growth: 40 },
  { year: 2024, attacks: 893, growth: 26 },
];
const MAX_ATTACKS = 893;

const SECTOR_DATA = [
  { name: "Portal Online", pct: 16.46, color: "#2DCB85" },
  { name: "Toko Online", pct: 12.22, color: "#F5A623" },
  { name: "Bank", pct: 11.29, color: "#E55C30" },
  { name: "Jasa Pengiriman", pct: 8.30, color: "#1FA86B" },
  { name: "Lainnya", pct: 51.73, color: "#666680" },
];

const METHOD_DATA = [
  { name: "WhatsApp", pct: 82.71, icon: MessageSquare, color: "#25d366" },
  { name: "Telegram", pct: 14.12, icon: Smartphone, color: "#2DCB85" },
  { name: "Viber", pct: 3.17, icon: Mail, color: "#E55C30" },
];

const QUICK_STATS = [
  { value: 26.8, suffix: " jt", label: "Aktivitas Phising", sub: "terdeteksi 2024", icon: ShieldAlert, color: "#E55C30" },
  { value: 18, suffix: "T", label: "Kerugian Siber Nasional", sub: "Rupiah, 2024", icon: TrendingUp, color: "#F5A623" },
  { value: 514, suffix: " rb", label: "Aktivitas Ransomware", sub: "Indonesia, 2024", icon: Target, color: "#1FA86B" },
  { value: 35, suffix: "%", label: "Paham Ciri Email Phising", sub: "Survei Kominfo 2023", icon: BarChart3, color: "#F5A623" },
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
          Phising dalam Angka
        </h2>
        <p className="text-[#666680] text-sm">
          Data Indonesia dari BSSN & Kominfo, dipadukan dengan tren global Kaspersky
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
          <Award size={28} className="text-[#F5A623] mx-auto mb-2" />
          <div className="font-heading font-bold text-3xl text-[#F5A623]">#2</div>
          <div className="text-sm text-[#e0e0e0]">Asia Tenggara</div>
          <div className="text-xs text-[#666680]">85.908 serangan phising finansial 2024, setelah Thailand</div>
        </motion.div>
        <motion.div
          className="glass-card p-5 text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Globe size={28} className="text-[#F5A623] mx-auto mb-2" />
          <div className="font-heading font-bold text-3xl text-[#F5A623]">#1</div>
          <div className="text-sm text-[#e0e0e0]">Asia Tenggara</div>
          <div className="text-xs text-[#666680]">57.554 serangan ransomware 2024, tertinggi di kawasan</div>
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
          <TrendingUp size={18} className="text-[#2DCB85]" />
          Tren Serangan Phising Global (2021–2024)
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
                  className="h-full rounded-lg bg-gradient-to-r from-[#2DCB85] to-[#F5A623]"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(d.attacks / MAX_ATTACKS) * 100}%` } : {}}
                  transition={{ delay: 0.7 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-white">
                  <AnimCounter target={d.attacks} suffix=" jt" duration={1500} />
                </span>
              </div>
              {d.growth && (
                <span className="text-xs font-mono text-[#2DCB85] w-12 text-right">
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
            <Target size={16} className="text-[#E55C30]" />
            Sasaran Phising Global
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
            <Smartphone size={16} className="text-[#2DCB85]" />
            Distribusi via Messenger (Global)
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
        Sumber: BSSN (2024), survei Kominfo (2023), Kaspersky Spam &amp; Phishing Report (2021–2024), Group-IB High-Tech Crime Trends Report (2025)
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
      intro: "Phising itu intinya penipuan online — pelaku nyamar jadi pihak yang kamu percaya (bank, e-commerce, bahkan teman) supaya kamu mau ngasih password, nomor kartu, atau data sensitif lainnya.",
      sections: [
        {
          title: "Jenis-jenis Phising",
          items: [
            { name: "Email Phishing", desc: "Yang paling umum. Email palsu yang niru tampilan bank atau e-commerce, isinya link ke situs tiruan." },
            { name: "SMS Phishing (Smishing)", desc: "SMS ngaku-ngaku dari bank, minta kamu klik link atau kirim kode OTP." },
            { name: "Voice Phishing (Vishing)", desc: "Ditelepon orang yang ngaku 'petugas bank' atau bahkan 'polisi', lalu diminta data pribadi." },
            { name: "Spear Phishing", desc: "Lebih licik — diincar khusus ke satu orang, pakai info personal yang udah dikumpulin sebelumnya." },
            { name: "Whaling", desc: "Sama kayak spear phishing, tapi targetnya bos besar atau pejabat tinggi perusahaan." },
          ],
        },
        {
          title: "Cara Kerja Phiser",
          steps: [
            "Bikin situs palsu yang mirip banget sama yang asli (Tokopedia, BCA, dll)",
            "Sebar link-nya lewat email, SMS, WhatsApp, atau medsos",
            "Korban klik, lihat halaman yang kelihatan asli",
            "Korban masukin data — password, OTP, nomor kartu",
            "Data itu langsung dipakai buat bobol akun atau curi uang",
          ],
        },
        {
          title: "Statistik di Indonesia",
          stats: [
            { value: "26,8 jt", label: "Aktivitas phising terdeteksi (BSSN, 2024)" },
            { value: "Rp 18 T", label: "Kerugian siber nasional (BSSN, 2024)" },
            { value: "Lebih dari 90%", label: "Serangan siber dimulai dari email phising (CISA)" },
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
      intro: "Skill ini wajib dimiliki siapa aja di era digital. Coba perhatikan 10 hal ini sebelum klik link apapun:",
      sections: [
        {
          title: "10 Ciri-ciri Link Phising",
          items: [
            { name: "1. URL Salah Eja", desc: "tokoped1a.com (angka 1 ganti i), sh0pee.co.id (angka 0 ganti o), bca-prom0.com — perhatiin baik-baik tiap huruf." },
            { name: "2. Tidak HTTPS", desc: "Nggak ada ikon gembok di browser. Website resmi udah pasti pakai HTTPS." },
            { name: "3. Domain Mencurigakan", desc: "Ekstensi kayak .xyz, .top, .click, .link — jarang dipakai website resmi." },
            { name: "4. Subdomain Berlebihan", desc: "login.bca.co.id.evil.com — domain sebenarnya itu yang di ujung, bukan yang di awal." },
            { name: "5. URL Shortener", desc: "bit.ly, tinyurl, t.co — bisa nyembunyiin ke mana sebenarnya link itu mengarah." },
            { name: "6. Bikin Panik", desc: "'Akun Anda akan diblokir dalam 24 jam!' — ini tekanan psikologis biar kamu nggak sempat berpikir." },
            { name: "7. Grammar Berantakan", desc: "Typo atau susunan kalimat yang aneh, kayak hasil terjemahan asal-asalan." },
            { name: "8. Terlalu Bagus untuk Jadi Nyata", desc: "'Selamat! Anda menang iPhone 15!' tanpa kamu pernah ikut undian apapun." },
            { name: "9. Pengirim Tidak Dikenal", desc: "Email atau SMS dari nomor/alamat yang asing." },
            { name: "10. Nggak Nyambung Konteksnya", desc: "Link nyasar masuk chat tanpa alasan atau penjelasan jelas." },
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
      intro: "Social engineering itu manipulasi psikologis — main di rasa percaya, takut, atau serakah orang. Phising sendiri sebenarnya cuma satu bentuk dari teknik ini.",
      sections: [
        {
          title: "6 Teknik Umum",
          items: [
            { name: "Pretexting", desc: "Bikin skenario palsu biar dipercaya. Contoh: 'Saya dari IT bank, perlu verifikasi akun Anda sebentar.'" },
            { name: "Baiting", desc: "Nawarin sesuatu yang menggiurkan — USB gratis, voucher, hadiah — buat menjebak korban." },
            { name: "Tailgating", desc: "Nyelip masuk area terbatas dengan pura-pura jadi karyawan." },
            { name: "Quid Pro Quo", desc: "'Saya bantu fix laptop-nya, tapi boleh minta password WiFi?' — bantuan ditukar info." },
            { name: "Watering Hole", desc: "Nginfeksi website yang sering dikunjungi target, biar kena pas mampir." },
            { name: "Phishing", desc: "Kirim link atau email palsu buat curi data lewat halaman tiruan." },
          ],
        },
        {
          title: "Contoh Kasus di Indonesia",
          items: [
            { name: "Modus OTP", desc: "Penelpon ngaku dari bank, minta OTP yang baru masuk ke HP. Begitu dikasih, uang di rekening langsung raib." },
            { name: "Modus Undian", desc: "SMS/WA: 'Selamat! Anda menang undian GoPay Rp 10 juta. Klik link untuk klaim.' — udah jelas modus." },
            { name: "Modus Kurir", desc: "Pesan ngaku dari JNE/J&T dengan link tracking palsu yang sebenarnya ngarah ke situs phising." },
            { name: "Modus Bantuan Pemerintah", desc: "Link palsu bansos yang ujung-ujungnya minta data KTP dan rekening." },
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
      intro: "Password adalah pertahanan pertama akun kamu. Menurut Verizon Data Breach Investigations Report, 81% pelanggaran data terkait hacking melibatkan password yang lemah atau bocor.",
      sections: [
        {
          title: "5 Tips Password Kuat",
          items: [
            { name: "Minimal 12 Karakter", desc: "Makin panjang makin susah ditebak. Coba pakai frasa yang gampang diingat kayak 'KucingSayaMakanIkan2024!'" },
            { name: "Kombinasikan Karakter", desc: "Campur huruf besar, kecil, angka, sama simbol (!@#$%)." },
            { name: "Jangan Pakai Info Personal", desc: "Hindari nama, tanggal lahir, atau nama hewan peliharaan — itu yang pertama ditebak orang." },
            { name: "Unik untuk Setiap Akun", desc: "Sekali kena bocor di satu situs, jangan sampai akun lain ikut kena gara-gara pakai password sama." },
            { name: "Gunakan Password Manager", desc: "Biar nggak perlu ngingat ratusan password, aplikasi ini yang nyimpenin semuanya secara aman." },
          ],
        },
        {
          title: "Rekomendasi Password Manager",
          items: [
            { name: "Bitwarden", desc: "Gratis, open-source, ada di semua platform. Cocok buat yang baru mulai." },
            { name: "1Password", desc: "Berbayar tapi interfacenya enak banget dipakai, plus ada family sharing." },
            { name: "KeePass", desc: "Gratis dan offline — pilihan buat yang concern banget soal privasi." },
          ],
        },
        {
          title: "Cek Apakah Password Bocor",
          steps: [
            "Buka haveibeenpwned.com",
            "Masukkan email atau password kamu",
            "Situs akan kasih tahu kalau data kamu pernah ikut bocor",
            "Kalau iya, langsung ganti password di semua akun yang pakai password itu",
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
      intro: "2FA itu lapisan keamanan ekstra di atas password. Jadi walaupun password kamu bocor, penyerang masih kejebak — nggak bisa masuk tanpa faktor kedua.",
      sections: [
        {
          title: "Jenis-jenis 2FA",
          items: [
            { name: "SMS OTP", desc: "Kode lewat SMS. Cukup aman, tapi ada risiko SIM-swap attack." },
            { name: "Authenticator App", desc: "Google Authenticator, Authy, Microsoft Authenticator — lebih aman dibanding SMS." },
            { name: "Hardware Key", desc: "YubiKey, Google Titan. Paling aman karena fisik, nggak bisa di-hack dari jauh." },
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
      intro: "Malware itu singkatan dari malicious software — program yang sengaja dibuat buat merusak atau diam-diam masuk ke sistem komputer kamu tanpa izin.",
      sections: [
        {
          title: "Jenis-jenis Malware",
          items: [
            { name: "Trojan", desc: "Pura-pura jadi software biasa, tapi di dalamnya nyembunyiin kode jahat." },
            { name: "Ransomware", desc: "Ngenkrip semua file kamu, lalu minta tebusan buat bukanya lagi. Salah satu yang paling bahaya." },
            { name: "Spyware", desc: "Diam-diam ngintip semua aktivitas — ketikan, screenshot, riwayat browsing." },
            { name: "Adware", desc: "Nge-spam iklan berlebihan, kadang malah ngarahin ke situs berbahaya." },
            { name: "Worm", desc: "Nyebar sendiri lewat jaringan, nggak butuh kamu klik apapun." },
            { name: "Keylogger", desc: "Merekam tiap tombol yang kamu pencet — password, chat, sampai nomor kartu kredit." },
          ],
        },
        {
          title: "Cara Penyebaran",
          items: [
            { name: "Lampiran Email", desc: "File .exe, .doc, .pdf yang ada macro berbahaya nyelip di dalamnya." },
            { name: "Software Bajakan", desc: "Crack, keygen, atau software 'gratis' dari situs yang nggak resmi." },
            { name: "Link Phising", desc: "Klik link yang ujung-ujungnya download malware tanpa kamu sadari." },
            { name: "USB/Flashdisk", desc: "Colok flashdisk yang udah kena infeksi sebelumnya." },
            { name: "Iklan Berbahaya", desc: "Klik iklan yang langsung trigger download otomatis." },
          ],
        },
        {
          title: "7 Tips Pencegahan",
          steps: [
            "Update OS dan software secara rutin",
            "Hindari download software bajakan",
            "Pakai antivirus yang terpercaya (Windows Defender aja udah cukup buat kebanyakan orang)",
            "Jangan klik lampiran email dari pengirim yang nggak dikenal",
            "Scan dulu USB/flashdisk sebelum dibuka isinya",
            "Pakai browser yang punya built-in malware protection",
            "Backup data secara rutin, baik ke cloud atau hard disk eksternal",
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
      intro: "Anak-anak dan orang tua sering jadi target empuk penipu online. Ngajak ngobrol soal ini ke seluruh keluarga itu investasi keamanan yang murah tapi efeknya besar.",
      sections: [
        {
          title: "Edukasi Anak",
          items: [
            { name: "Jangan Bagikan Info Personal", desc: "Nama lengkap, alamat, nama sekolah, nomor HP — jangan pernah dibagikan ke orang asing di internet." },
            { name: "Curiga ke Stranger Online", desc: "Orang yang kelihatan baik di internet belum tentu beneran baik. Jangan gampang percaya." },
            { name: "Laporkan ke Orang Tua", desc: "Nemu konten aneh, bullying, atau orang mencurigakan? Langsung cerita ke orang tua." },
            { name: "Jangan Klik Sembarang Link", desc: "Link dari game, chat, atau medsos bisa aja berbahaya, meski kelihatan biasa." },
          ],
        },
        {
          title: "Tips untuk Orang Tua",
          items: [
            { name: "Pasang Parental Control", desc: "Google Family Link atau Apple Screen Time bisa bantu kontrol konten dan waktu layar anak." },
            { name: "Kenali Tanda-tanda", desc: "Anak tiba-tiba nutup layar pas kamu deketin, marah waktu diminta HP, atau punya 'teman' baru yang nggak kamu kenal." },
            { name: "Komunikasi Terbuka", desc: "Bikin anak nyaman buat cerita. Jangan langsung marah — edukasi dengan sabar." },
            { name: "Contohkan yang Baik", desc: "Orang tua juga harus terapin keamanan digital yang sama. Anak nirunya dari yang dilihat, bukan yang didengar." },
          ],
        },
        {
          title: "Bahaya Oversharing di Social Media",
          items: [
            { name: "Foto Boarding Pass", desc: "Barcode-nya bisa di-scan buat dapetin data penerbangan dan identitas kamu." },
            { name: "Check-in Lokasi", desc: "Tanpa sadar, kamu lagi ngasih tahu orang jahat kapan rumah kosong." },
            { name: "Foto Dokumen", desc: "KTP, SIM, kartu mahasiswa — sekali keliatan, datanya bisa disalahgunakan." },
            { name: "Curhat Berlebihan", desc: "Cerita personal yang kebanyakan justru bisa dimanfaatkan buat social engineering." },
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
      intro: "Jangan panik. Makin cepat kamu gerak, makin kecil kerugiannya. Ikutin checklist ini:",
      sections: [
        {
          title: "10 Langkah Darurat",
          steps: [
            "1. Tarik napas dulu — panik cuma bikin kamu salah ambil keputusan",
            "2. Tutup halaman phising-nya sekarang, jangan isi data apapun lagi",
            "3. Ganti password akun yang kena — pakai password baru yang kuat",
            "4. Kalau password itu dipakai di akun lain juga, ganti semuanya",
            "5. Aktifkan 2FA di semua akun penting kamu",
            "6. Data finansial bocor? Langsung telepon bank, blokir kartu kalau perlu",
            "7. Scan HP/laptop pakai antivirus, pastikan nggak ada malware nyangkut",
            "8. Laporkan link phising-nya di Urlveil biar orang lain nggak kena juga",
            "9. Bikin laporan resmi ke polisi atau Kominfo",
            "10. Pantau rekening dan akun kamu beberapa hari ke depan, jaga-jaga ada transaksi aneh",
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
              ["Polri - Call Center 110", "110", "Layanan pengaduan & pelaporan kepolisian 24 jam"],
              ["Polisi Online", "polri.go.id/presisi", "Buat laporan kejahatan siber secara online"],
            ],
          },
        },
        {
          title: "Cara Melaporkan di Urlveil",
          steps: [
            "Buka Urlveil di urlveil.id",
            "Paste link phising-nya di kolom Pemeriksa URL",
            "Klik 'Cek' buat dianalisis",
            "Kalau hasilnya Bahaya, klik tombol 'Laporkan'",
            "Isi alasan dan deskripsi singkat",
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
            <div className="w-2 h-2 rounded-full bg-[#2DCB85] mt-2 flex-shrink-0" />
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
            <span className="text-[#2DCB85] font-mono text-xs mt-0.5">{">"}</span>
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
            className="text-center p-4 rounded-xl bg-[#2DCB85]/5 border border-[#2DCB85]/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="font-heading font-bold text-2xl text-[#2DCB85]">{stat.value}</div>
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
            <tr className="border-b border-[#2e3348]">
              {section.table.headers.map((h, i) => (
                <th key={i} className="text-left py-3 px-3 text-[#8888aa] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row, i) => (
              <tr key={i} className="border-b border-[#2e3348]/30 hover:bg-white/[0.02] transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className={`py-3 px-3 ${j === 0 ? "text-[#2DCB85] font-mono text-xs" : "text-[#8888aa]"}`}>
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

      <main className="min-h-screen pt-24 pb-16 relative">
        <MeshBackground variant="cool" />
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
              className="inline-flex items-center gap-2 text-sm text-[#666680] hover:text-[#2DCB85] transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </a>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#2DCB85]/10 flex items-center justify-center">
                <BookOpen size={24} className="text-[#2DCB85]" />
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
                maxLength={200}
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
                      <div className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? "ring-1 ring-[#2DCB85]/20" : ""}`}>
                        {/* Header */}
                        <button
                          onClick={() => setOpenId(isOpen ? null : article.id)}
                          className="w-full px-6 py-5 text-left flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                          aria-expanded={isOpen}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-[#2DCB85]/20" : "bg-[#2DCB85]/10"}`}>
                            <IconComponent size={22} className="text-[#2DCB85]" />
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
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#2DCB85]" />
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
    </>
  );
}