"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Eye, ShieldCheck, Database, Globe, Mail, ChevronDown } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

const SECTIONS = [
  {
    icon: Eye,
    title: "Informasi yang Kami Kumpulkan",
    items: [
      "URL yang kamu masukkan hanya diproses di browser — tidak pernah disimpan di server kami.",
      "Laporan link phising yang kamu kirimkan: URL, alasan pelaporan, dan deskripsi tambahan.",
      "Email (opsional) hanya jika kamu mendaftar notifikasi browser extension.",
    ],
  },
  {
    icon: Database,
    title: "Bagaimana Kami Menggunakan Data",
    items: [
      "URL dianalisis secara real-time di browser untuk memberikan hasil keamanan instan.",
      "Laporan phising komunitas digunakan untuk memperbarui database ancaman kami.",
      "Email hanya digunakan untuk mengirim notifikasi yang secara eksplisit kamu minta.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Keamanan Data",
    items: [
      "Semua komunikasi antara browser dan server dienkripsi menggunakan HTTPS/TLS.",
      "Kami tidak menjual, menyewakan, atau membagikan data pribadi ke pihak ketiga manapun.",
      "Data laporan disimpan secara anonim untuk keperluan analisis ancaman keamanan.",
    ],
  },
  {
    icon: Globe,
    title: "Cookie & Pelacakan",
    items: [
      "Urlveil tidak menggunakan cookie tracking, iklan, atau pixel tracking apapun.",
      "Kami tidak menggunakan Google Analytics atau layanan analitik pihak ketiga.",
      "Tidak ada fingerprinting browser atau pelacakan aktivitas lintas situs.",
    ],
  },
  {
    icon: Lock,
    title: "Hak Kamu",
    items: [
      "Kamu bisa meminta penghapusan semua data yang terkait dengan email kamu kapanpun.",
      "Urlveil sepenuhnya bisa digunakan tanpa memberikan data pribadi apapun.",
      "Hubungi kami di security@urlveil.id untuk pertanyaan atau permintaan terkait privasi.",
    ],
  },
];

export default function PrivasiPage() {
  const [openIndex, setOpenIndex] = useState(null);

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
            <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#666680] hover:text-[#06b6d4] transition-colors mb-10">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </a>

            {/* Hero — single column, tanpa stat card kanan */}
            <div className="max-w-2xl mb-16">
              <span className="font-mono text-xs text-[#06b6d4] uppercase tracking-widest mb-4 block">Kebijakan Privasi</span>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white leading-tight mb-6">
                Privasi bukan<br />pilihan opsional.
              </h1>
              <p className="text-[#8888aa] text-base leading-relaxed mb-4">
                Urlveil dibangun dengan prinsip privacy-first sejak hari pertama. Berikut penjelasan
                transparan soal data apa yang kami kumpulkan, dan hak kamu sebagai pengguna.
              </p>
              <p className="text-[10px] text-[#555570] font-mono">Terakhir diperbarui: 26 Juni 2026</p>
            </div>

            {/* Komitmen singkat — sama posisi/typografi seperti Misi di Tentang */}
            <div className="border-t border-[#2e3348] pt-12 mb-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-3 block">Komitmen kami</span>
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-[#06b6d4] mt-1 flex-shrink-0" />
                <p className="text-lg text-[#a0a5b8] leading-relaxed">
                  Data kamu tidak dijual, tidak dimonetisasi, tidak dibagikan ke pihak ketiga.
                  Analisis URL terjadi sepenuhnya di browser kamu — bukan di server kami.
                </p>
              </div>
            </div>

            {/* Detail kebijakan — kerangka mirip Fitur Utama di Tentang, tapi tiap baris bisa diklik buat expand detail */}
            <div className="border-t border-[#2e3348] pt-12 mb-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-6 block">Detail kebijakan</span>
              <div className="space-y-0 border-t border-[#2e3348]">
                {SECTIONS.map((section, i) => {
                  const Icon = section.icon;
                  const isOpen = openIndex === i;
                  return (
                    <motion.div
                      key={i}
                      className="border-b border-[#2e3348]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="w-full flex items-start gap-4 py-5 text-left hover:opacity-80 transition-opacity"
                      >
                        <Icon size={18} className="text-[#06b6d4] mt-0.5 flex-shrink-0" />
                        <h3 className="flex-1 font-heading font-semibold text-white text-sm">{section.title}</h3>
                        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 mt-0.5">
                          <ChevronDown size={15} className="text-[#555570]" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-9 pb-5 space-y-2">
                              {section.items.map((item, j) => (
                                <p key={j} className="text-sm text-[#666680] leading-relaxed">{item}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Contact — posisi sama seperti Open Source di Tentang, isi beda */}
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2e3348] text-sm text-[#a0a5b8] hover:text-white hover:border-[#06b6d4]/30 transition-colors"
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