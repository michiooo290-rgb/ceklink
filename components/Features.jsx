"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Flag, BarChart3, Share2, GraduationCap, Eye } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    icon: Search,
    title: "Scan URL Instan",
    desc: "Analisis keamanan link dalam detik. SSL, domain, redirect, dan blacklist otomatis.",
  },
  {
    num: "02",
    icon: Flag,
    title: "Laporkan Phising",
    desc: "Temukan link phising? Satu klik untuk melaporkan dan melindungi pengguna lain.",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Tren Phising Indonesia",
    desc: "Data harian dari laporan komunitas — lihat pola serangan yang sedang aktif.",
  },
  {
    num: "04",
    icon: Share2,
    title: "Bagikan via WhatsApp",
    desc: "Kirim hasil cek ke keluarga atau teman dengan satu tap.",
  },
  {
    num: "05",
    icon: GraduationCap,
    title: "Edukasi Keamanan",
    desc: "Kenali ciri link phising, email palsu, dan modus penipuan digital terbaru.",
  },
  {
    num: "06",
    icon: Eye,
    title: "Proses Transparan",
    desc: "Setiap langkah analisis terbuka — kamu tahu persis mengapa sebuah link dianggap berbahaya.",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="fitur" className="features-section">
      <div className="features-inner" ref={ref}>
        {/* Section label */}
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Apa yang bisa dilakukan</span>
          <h2 className="features-title">
            Satu alat,<br />semua yang kamu butuhkan.
          </h2>
        </motion.div>

        {/* Daftar fitur */}
        <div className="features-list">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                className="feature-row"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="feature-num">{f.num}</span>
                <div className="feature-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="feature-text">
                  <h3 className="feature-name">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}