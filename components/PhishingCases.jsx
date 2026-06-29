"use client";

import { motion } from "framer-motion";
import {
  FileWarning,
  PackageX,
  Gift,
  Briefcase,
  Landmark,
  ShieldAlert,
} from "lucide-react";

const headerInitial = { opacity: 0, y: 16 };
const headerInView = { opacity: 1, y: 0 };
const headerTransition = { duration: 0.5, ease: "easeOut" };

const cardInitial = { opacity: 0, y: 20 };
const cardInView = { opacity: 1, y: 0 };
const cardViewport = { once: true, amount: 0.2 };

function cardTransition(i) {
  return { duration: 0.45, ease: "easeOut", delay: i * 0.08 };
}

const CASES = [
  {
    icon: FileWarning,
    title: "Undangan pernikahan .apk",
    channel: "WhatsApp",
    how: "Korban dikirim file bernama 'Buka Foto Undangan.apk'. Sekali dipasang, aplikasi diam-diam membaca SMS - termasuk kode OTP m-banking.",
    flag: "File .apk dari nomor tak dikenal.",
  },
  {
    icon: PackageX,
    title: "Kurir paket 'cek resi'",
    channel: "WhatsApp",
    how: "Pelaku mengaku kurir dan mengirim 'foto paket' atau 'cek resi' berbentuk .apk. Begitu dipasang, saldo m-banking bisa terkuras.",
    flag: "Disuruh pasang aplikasi hanya untuk lihat resi.",
  },
  {
    icon: Gift,
    title: "Bansos cair",
    channel: "WA / Telegram / medsos",
    how: "Link pendaftaran bansos dengan domain .my.id atau .xyz (bukan .go.id), meminta NIK & nomor rekening, kadang minta bayar 'biaya admin' dulu.",
    flag: "Domain bukan .go.id & minta data pribadi.",
  },
  {
    icon: Briefcase,
    title: "Lowongan kerja palsu",
    channel: "Medsos / WhatsApp",
    how: "Mengatasnamakan instansi atau perusahaan terkenal, dengan link pendaftaran palsu untuk mencuri data. Ini modus yang paling banyak dilaporkan di Indonesia.",
    flag: "Diminta isi data lewat link pendek sebelum wawancara.",
  },
  {
    icon: Landmark,
    title: "Mengatasnamakan bank",
    channel: "WA / SMS / telepon",
    how: "Pesan 'pembatalan transaksi' atau 'biaya transfer naik jadi Rp150.000/bulan', lalu mengarahkan ke website yang dibuat mirip bank untuk mencuri PIN/OTP.",
    flag: "URL mirip bank, tapi beda sedikit hurufnya.",
  },
];

export default function PhishingCases() {
  return (
    <section id="modus" className="relative py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={headerInitial}
          whileInView={headerInView}
          viewport={cardViewport}
          transition={headerTransition}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#666680] mb-3">
            <ShieldAlert size={15} aria-hidden="true" />
            Waspada
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 text-[#e0e0e0]">
            Modus yang lagi marak di Indonesia
          </h2>
          <p className="text-[#a0a5b8] max-w-xl mx-auto">
            Hampir semua penipuan dimulai dari satu hal: sebuah link atau file
            yang dikirim ke HP-mu. Ini yang paling sering memakan korban.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                className="rounded-xl border border-[#2e3348] bg-[#12151f]/60 p-5 hover:border-[#3a4060] transition-colors"
                initial={cardInitial}
                whileInView={cardInView}
                viewport={cardViewport}
                transition={cardTransition(i)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E55C30]/30 bg-[#E55C30]/10 text-[#E55C30]">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-mono text-[#666680]">
                    {c.channel}
                  </span>
                </div>
                <h3 className="font-semibold text-[#e0e0e0] mb-1.5">
                  {c.title}
                </h3>
                <p className="text-sm text-[#a0a5b8] leading-relaxed mb-3">
                  {c.how}
                </p>
                <p className="flex items-start gap-1.5 text-xs text-[#E55C30]">
                  <ShieldAlert size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{c.flag}</span>
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-8 rounded-r-xl border-l-2 border-[#2DCB85] bg-[#2DCB85]/5 px-5 py-4"
          initial={headerInitial}
          whileInView={headerInView}
          viewport={cardViewport}
          transition={headerTransition}
        >
          <p className="text-sm text-[#c4c9d8] leading-relaxed">
            <strong className="text-[#e0e0e0]">Catatan jujur:</strong> Urlveil
            memeriksa link/URL, dan di situlah dia paling berguna - karena modus
            bansos, lowongan, dan tiruan bank semuanya bekerja lewat link. Tapi
            untuk file .apk, aturannya lebih sederhana dari teknologi apa pun:{" "}
            <strong className="text-[#e0e0e0]">jangan pernah pasang aplikasi dari chat.</strong>{" "}
            Tidak ada undangan, resi, atau tagihan resmi yang berbentuk .apk.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
