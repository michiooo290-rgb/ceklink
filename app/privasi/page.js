"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Eye, ShieldCheck, Database, Globe, Mail, ChevronDown, FileCheck } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

const QUICK_FACTS = [
  { icon: ShieldCheck, label: "Tidak ada data dijual" },
  { icon: Eye, label: "Tidak ada iklan/tracking" },
  { icon: Globe, label: "Analisis terjadi di browser kamu" },
];

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

function Accordion({ section, index, isOpen, onToggle }) {
  const Icon = section.icon;
  return (
    <div className="border border-[#2e3348] rounded-xl overflow-hidden bg-[#161a2c]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="font-mono text-xs text-[#06b6d4] w-7 flex-shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Icon size={17} className="text-[#06b6d4] flex-shrink-0" />
        <span className="flex-1 font-heading font-semibold text-sm text-white">{section.title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[#666680]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ul className="px-5 pb-5 pl-16 space-y-2.5">
              {section.items.map((item, j) => (
                <li key={j} className="text-sm text-[#8888aa] leading-relaxed list-disc marker:text-[#06b6d4]/50">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PrivasiPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-28 pb-20" style={{ background: "var(--color-paper)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#666680] hover:text-[#06b6d4] transition-colors mb-8">
            <ArrowLeft size={14} /> Kembali ke Beranda
          </a>

          {/* Document-style header, not a marketing hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-[#06b6d4]/20 rounded-2xl bg-[#06b6d4]/[0.04] p-6 sm:p-8 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <FileCheck size={16} className="text-[#06b6d4]" />
              <span className="font-mono text-xs text-[#06b6d4] uppercase tracking-widest">Dokumen Kebijakan · v1.0</span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3">
              Kebijakan Privasi Urlveil
            </h1>
            <p className="text-[#8888aa] text-sm leading-relaxed mb-5">
              Ringkasan tentang data apa yang kami kumpulkan, bagaimana kami menggunakannya,
              dan hak kamu sebagai pengguna. Berlaku efektif 26 Juni 2026.
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_FACTS.map((f, i) => {
                const Icon = f.icon;
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20">
                    <Icon size={12} />
                    {f.label}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Numbered accordion sections instead of static row list */}
          <div className="space-y-3 mb-10">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
              >
                <Accordion
                  section={section}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              </motion.div>
            ))}
          </div>

          {/* Contact — inline card, not a plain text block */}
          <div className="flex items-center justify-between gap-4 p-5 rounded-xl border border-[#2e3348] bg-[#161a2c] flex-wrap">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-[#06b6d4] mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-heading font-semibold text-white text-sm mb-1">Ada pertanyaan soal privasi?</h2>
                <p className="text-xs text-[#666680]">Kami merespons dalam 48 jam kerja.</p>
              </div>
            </div>
            <a
              href="mailto:security@urlveil.id"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-sm text-[#06b6d4] hover:bg-[#06b6d4]/20 transition-colors whitespace-nowrap"
            >
              <Mail size={14} />
              security@urlveil.id
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}