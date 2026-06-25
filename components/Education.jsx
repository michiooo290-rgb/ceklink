"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { GraduationCap, Lock, ScanEye, KeyRound, ChevronDown, ArrowRight } from "lucide-react";

const TIPS = [
  {
    q: "Bagaimana cara mengenali link phising?",
    a: "Perhatikan 5 hal ini: (1) URL mencurigakan atau salah eja (tokoped1a.com), (2) Tidak menggunakan HTTPS, (3) Meminta data pribadi mendesak, (4) Dikirim dari nomor/email tidak dikenal, (5) Terlalu bagus untuk jadi kenyataan (hadiah gratis, diskon 90%).",
  },
  {
    q: "Apa yang harus dilakukan jika sudah klik link phising?",
    a: "Jangan panik. Langkah: (1) Jangan isi form apapun, (2) Tutup halaman segera, (3) Jika sudah isi data, segera ganti password, (4) Hubungi bank jika data finansial bocor, (5) Laporkan link di CekLink.",
  },
  {
    q: "Apa itu HTTPS dan kenapa penting?",
    a: "HTTPS adalah protokol komunikasi terenkripsi. Saat kamu mengunjungi website HTTPS, data yang dikirim (password, nomor kartu) dienkripsi sehingga tidak bisa disadap. Website tanpa HTTPS = data terbuka. Cek ikon gembok di address bar browser.",
  },
  {
    q: "Bagaimana cara melindungi keluarga dari phising?",
    a: "Edukasi mereka tentang: (1) Jangan klik link dari nomor tidak dikenal, (2) Cek link di CekLink sebelum buka, (3) Bank tidak pernah minta password via chat, (4) Install browser extension CekLink untuk proteksi otomatis.",
  },
  {
    q: "Apa bedanya phising dan malware?",
    a: "Phising = tipuan untuk mencuri data (password, nomor kartu) melalui halaman palsu. Malware = software berbahaya yang diinstall tanpa izin (virus, trojan, ransomware). Keduanya sering dikombinasikan: link phising bisa mengarah ke download malware.",
  },
];

const QUICK_TIPS = [
  { icon: Lock, title: "Selalu Cek HTTPS", desc: "Pastikan ada gembok di address bar" },
  { icon: ScanEye, title: "Jangan Asal Klik", desc: "Cek link sebelum membuka" },
  { icon: KeyRound, title: "Password Kuat", desc: "Gunakan password unik & 2FA" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Education() {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="edukasi" className="py-16 sm:py-24" aria-label="Pusat edukasi keamanan">
      <div className="max-w-3xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <GraduationCap size={28} className="text-[#00ff88]" aria-hidden="true" />
            </motion.div>
            Edukasi Keamanan Digital
          </h2>
          <p className="text-[#666680]">
            Pelajari cara melindungi diri dari ancaman digital
          </p>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {QUICK_TIPS.map((tip, i) => {
            const IconComponent = tip.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card glass-card-hover p-5 text-center cursor-default"
              >
                <motion.div
                  className="mb-2 flex justify-center"
                  aria-hidden="true"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent size={24} className="text-[#00ff88]" />
                </motion.div>
                <h3 className="font-heading font-semibold text-sm mb-1">{tip.title}</h3>
                <p className="text-[#666680] text-xs">{tip.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {TIPS.map((tip, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass-card overflow-hidden"
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#00ff88]/5 transition-colors"
                aria-expanded={openIndex === i}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-medium text-sm text-[#e0e0e0]">
                  {tip.q}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChevronDown
                    size={20}
                    className="text-[#666680] flex-shrink-0"
                    aria-hidden="true"
                  />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-sm text-[#666680] leading-relaxed border-t border-[#1a1a2e]/30 pt-3">
                      {tip.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA to full education page */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href="/edukasi"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 transition-all"
          >
            <GraduationCap size={18} />
            Baca Panduan Lengkap
            <ArrowRight size={16} />
          </a>
          <p className="text-[#555570] text-xs mt-3">
            8 topik lengkap tentang keamanan digital
          </p>
        </motion.div>
      </div>
    </section>
  );
}
