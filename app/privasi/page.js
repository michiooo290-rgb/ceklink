"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, ShieldCheck, Database, Globe, Mail, Check } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

const COMMITMENTS = [
  { icon: ShieldCheck, value: "0", label: "Data dijual", note: "tidak pernah" },
  { icon: Eye,         value: "0", label: "Iklan ditampilkan", note: "tidak pernah" },
  { icon: Globe,       value: "100%", label: "Analisis di browser", note: "bukan di server" },
];

const SECTIONS = [
  {
    icon: Eye,
    tag: "Pengumpulan Data",
    title: "Informasi yang Kami Kumpulkan",
    items: [
      "URL yang kamu masukkan hanya diproses di browser — tidak pernah disimpan di server kami.",
      "Laporan link phising yang kamu kirimkan: URL, alasan pelaporan, dan deskripsi tambahan.",
      "Email (opsional) hanya jika kamu mendaftar notifikasi browser extension.",
    ],
  },
  {
    icon: Database,
    tag: "Penggunaan Data",
    title: "Bagaimana Kami Menggunakan Data",
    items: [
      "URL dianalisis secara real-time di browser untuk memberikan hasil keamanan instan.",
      "Laporan phising komunitas digunakan untuk memperbarui database ancaman kami.",
      "Email hanya digunakan untuk mengirim notifikasi yang secara eksplisit kamu minta.",
    ],
  },
  {
    icon: ShieldCheck,
    tag: "Keamanan",
    title: "Keamanan Data",
    items: [
      "Semua komunikasi antara browser dan server dienkripsi menggunakan HTTPS/TLS.",
      "Kami tidak menjual, menyewakan, atau membagikan data pribadi ke pihak ketiga manapun.",
      "Data laporan disimpan secara anonim untuk keperluan analisis ancaman keamanan.",
    ],
  },
  {
    icon: Globe,
    tag: "Cookie & Tracking",
    title: "Cookie & Pelacakan",
    items: [
      "Urlveil tidak menggunakan cookie tracking, iklan, atau pixel tracking apapun.",
      "Kami tidak menggunakan Google Analytics atau layanan analitik pihak ketiga.",
      "Tidak ada fingerprinting browser atau pelacakan aktivitas lintas situs.",
    ],
  },
  {
    icon: Lock,
    tag: "Hak Pengguna",
    title: "Hak Kamu",
    items: [
      "Kamu bisa meminta penghapusan semua data yang terkait dengan email kamu kapanpun.",
      "Urlveil sepenuhnya bisa digunakan tanpa memberikan data pribadi apapun.",
      "Hubungi kami di security@urlveil.id untuk pertanyaan atau permintaan terkait privasi.",
    ],
  },
];

export default function PrivasiPage() {
  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-28 pb-20" style={{ background: "var(--color-paper)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back */}
            <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-10">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </a>

            {/* Hero — same grid layout as tentang */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <span className="font-mono text-xs text-[#F5A623] uppercase tracking-widest mb-4 block">Kebijakan Privasi</span>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white leading-tight mb-6">
                  Privasi bukan<br />pilihan opsional.
                </h1>
                <p className="text-[#8888aa] text-base leading-relaxed">
                  Urlveil dibangun dengan prinsip privacy-first sejak hari pertama.
                  Berikut adalah penjelasan transparan tentang apa yang kami kumpulkan,
                  bagaimana kami menggunakannya, dan hak kamu sebagai pengguna.
                </p>
              </div>

              {/* Commitment stats — same card style as STATS di tentang */}
              <div className="space-y-4">
                {COMMITMENTS.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl border border-[#2e3348] bg-[#1f2438]"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                    >
                      <div className="font-heading font-bold text-2xl text-[#2DCB85] w-20 flex-shrink-0">{c.value}</div>
                      <div>
                        <div className="text-sm font-medium text-white">{c.label}</div>
                        <div className="text-xs font-mono text-[#555570]">{c.note}</div>
                      </div>
                    </motion.div>
                  );
                })}
                <p className="text-[10px] text-[#555570] font-mono px-1">Terakhir diperbarui: 26 Juni 2026</p>
              </div>
            </div>

            {/* Komitmen singkat — mirip misi di tentang */}
            <div className="border-t border-[#2e3348] pt-12 mb-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-3 block">Komitmen kami</span>
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-[#2DCB85] mt-1 flex-shrink-0" />
                <p className="text-lg text-[#a0a5b8] leading-relaxed">
                  Data kamu tidak dijual, tidak dimonetisasi, tidak dibagikan ke pihak ketiga.
                  Analisis URL terjadi sepenuhnya di browser kamu — bukan di server kami.
                </p>
              </div>
            </div>

            {/* Sections — same row style as FEATURES di tentang */}
            <div className="border-t border-[#2e3348] pt-12 mb-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-6 block">Detail kebijakan</span>
              <div className="space-y-0 border-t border-[#2e3348]">
                {SECTIONS.map((section, i) => {
                  const Icon = section.icon;
                  return (
                    <motion.div
                      key={i}
                      className="py-8 border-b border-[#2e3348]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                    >
                      <div className="grid sm:grid-cols-[200px_1fr] gap-6">
                        {/* Left — icon + title */}
                        <div className="flex items-start gap-3">
                          <Icon size={18} className="text-[#F5A623] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-mono text-[#555570] uppercase tracking-widest mb-1">{section.tag}</div>
                            <h3 className="font-heading font-semibold text-white text-sm leading-snug">{section.title}</h3>
                          </div>
                        </div>

                        {/* Right — items */}
                        <div className="space-y-3">
                          {section.items.map((item, j) => (
                            <div key={j} className="flex items-start gap-3">
                              <Check size={14} className="text-[#2DCB85] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                              <p className="text-sm text-[#666680] leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Contact — same style as Open Source di tentang */}
            <div className="border-t border-[#2e3348] pt-12">
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-[#a0a5b8] mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-heading font-semibold text-white text-lg mb-2">Ada pertanyaan tentang privasi?</h2>
                  <p className="text-sm text-[#666680] leading-relaxed mb-4">
                    Kami berkomitmen untuk transparan dan responsif terhadap semua pertanyaan privasi.
                    Hubungi tim kami dan kami akan merespons dalam 48 jam kerja.
                  </p>
                  <a
                    href="mailto:security@urlveil.id"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2e3348] text-sm text-[#a0a5b8] hover:text-white hover:border-[#2DCB85]/30 transition-colors"
                  >
                    <Mail size={15} />
                    security@urlveil.id
                  </a>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}