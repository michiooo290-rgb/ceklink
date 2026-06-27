"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, ShieldCheck, Database, Globe } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import MeshBackground from "../../components/MeshBackground";

const SECTIONS = [
  {
    icon: Eye,
    title: "Informasi yang Kami Kumpulkan",
    content: [
      "URL yang kamu masukkan untuk dianalisis — hanya diproses di browser, tidak disimpan di server.",
      "Laporan link phising yang kamu kirimkan (URL, alasan pelaporan, deskripsi).",
      "Email (opsional) jika kamu mendaftar notifikasi browser extension.",
    ],
  },
  {
    icon: Database,
    title: "Bagaimana Kami Menggunakan Data",
    content: [
      "URL dianalisis secara real-time untuk memberikan hasil keamanan.",
      "Laporan phising digunakan untuk memperbarui database keamanan kami.",
      "Email hanya digunakan untuk mengirim notifikasi yang kamu minta.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Keamanan Data",
    content: [
      "Semua komunikasi dienkripsi dengan HTTPS.",
      "Kami tidak menjual atau membagikan data pribadi ke pihak ketiga.",
      "Data laporan disimpan secara anonim untuk keperluan analisis keamanan.",
    ],
  },
  {
    icon: Globe,
    title: "Cookie & Tracking",
    content: [
      "Urlveil tidak menggunakan cookie tracking atau iklan.",
      "Kami tidak menggunakan Google Analytics atau layanan tracking pihak ketiga.",
      "Tidak ada fingerprinting atau pelacakan lintas situs.",
    ],
  },
  {
    icon: Lock,
    title: "Hak Kamu",
    content: [
      "Kamu bisa meminta penghapusan data yang terkait dengan email kamu.",
      "Kamu bisa menggunakan Urlveil tanpa memberikan data pribadi apapun.",
      "Hubungi kami di security@urlveil.id untuk pertanyaan privasi.",
    ],
  },
];

export default function PrivasiPage() {
  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-24 pb-16 relative">
        <MeshBackground variant="cool" />
        <section className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </a>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#2DCB85]/10 flex items-center justify-center">
                <Lock size={24} className="text-[#2DCB85]" />
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl">
                Kebijakan Privasi
              </h1>
            </div>
            <p className="text-[#555570] text-sm mb-10">
              Terakhir diperbarui: 26 Juni 2026
            </p>

            <div className="space-y-6">
              {SECTIONS.map((section, i) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={i}
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <h2 className="font-heading font-semibold text-lg text-[#e0e0e0] mb-4 flex items-center gap-2">
                      <Icon size={18} className="text-[#F5A623]" />
                      {section.title}
                    </h2>
                    <ul className="space-y-2">
                      {section.content.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#8888aa]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]/50 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="glass-card p-6 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-[#666680] text-sm">
                Jika ada pertanyaan tentang kebijakan privasi ini, hubungi kami di{" "}
                <a href="mailto:security@urlveil.id" className="text-[#F5A623] hover:underline">
                  security@urlveil.id
                </a>
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
