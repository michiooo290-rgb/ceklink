"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Flag, BarChart3, Share2, GraduationCap, Link } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Scan URL Instan",
    desc: "Analisis keamanan link dalam hitungan detik. Cek SSL, domain, redirect, dan blacklist otomatis.",
  },
  {
    icon: Flag,
    title: "Laporkan Phising",
    desc: "Temukan link phising? Laporkan untuk melindungi orang lain dari penipuan online.",
  },
  {
    icon: BarChart3,
    title: "Statistik Real-time",
    desc: "Lihat tren phising terbaru di Indonesia. Data diperbarui setiap hari dari laporan komunitas.",
  },
  {
    icon: Share2,
    title: "Share ke WhatsApp",
    desc: "Bagikan hasil cek ke keluarga dan teman langsung via WhatsApp dalam satu klik.",
  },
  {
    icon: GraduationCap,
    title: "Pusat Edukasi",
    desc: "Belajar cara mengenali link phising, email palsu, dan tips keamanan digital lainnya.",
  },
  {
    icon: Link,
    title: "API Publik",
    desc: "Integrasikan fitur CekLink ke website atau aplikasi kamu sendiri. Gratis untuk developer.",
  },
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="fitur" className="py-16 sm:py-24" aria-label="Fitur unggulan">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3">
            Fitur Unggulan
          </h2>
          <p className="text-[#666680] max-w-xl mx-auto">
            Semua yang kamu butuhkan untuk melindungi diri dari ancaman digital
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {FEATURES.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="glass-card glass-card-hover p-6 flex flex-col gap-4 cursor-default"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center"
                  aria-hidden="true"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconComponent size={22} className="text-[#00ff88]" />
                </motion.div>
                <h3 className="font-heading font-semibold text-lg text-[#e0e0e0]">
                  {feature.title}
                </h3>
                <p className="text-[#666680] text-sm leading-relaxed flex-1">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
