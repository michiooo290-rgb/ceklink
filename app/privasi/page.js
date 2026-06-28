"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowLeft, Lock, Eye, ShieldCheck,
  Database, Globe, Check, Mail
} from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

const SECTIONS = [
  {
    icon: Eye,
    color: "#F5A623",
    colorBg: "rgba(245,166,35,0.08)",
    colorBorder: "rgba(245,166,35,0.15)",
    tag: "PENGUMPULAN DATA",
    title: "Informasi yang Kami Kumpulkan",
    content: [
      "URL yang kamu masukkan hanya diproses di browser — tidak pernah disimpan di server kami.",
      "Laporan link phising yang kamu kirimkan: URL, alasan pelaporan, dan deskripsi tambahan.",
      "Email (opsional) hanya jika kamu mendaftar notifikasi browser extension.",
    ],
    highlight: "URL-mu tidak pernah menyentuh server kami.",
  },
  {
    icon: Database,
    color: "#2DCB85",
    colorBg: "rgba(45,203,133,0.08)",
    colorBorder: "rgba(45,203,133,0.15)",
    tag: "PENGGUNAAN DATA",
    title: "Bagaimana Kami Menggunakan Data",
    content: [
      "URL dianalisis secara real-time di browser untuk memberikan hasil keamanan instan.",
      "Laporan phising komunitas digunakan untuk memperbarui database ancaman kami.",
      "Email hanya digunakan untuk mengirim notifikasi yang secara eksplisit kamu minta.",
    ],
    highlight: "Data tidak dijual, tidak dimonetisasi.",
  },
  {
    icon: ShieldCheck,
    color: "#2DCB85",
    colorBg: "rgba(45,203,133,0.08)",
    colorBorder: "rgba(45,203,133,0.15)",
    tag: "KEAMANAN",
    title: "Keamanan Data",
    content: [
      "Semua komunikasi antara browser dan server dienkripsi menggunakan HTTPS/TLS.",
      "Kami tidak menjual, menyewakan, atau membagikan data pribadi ke pihak ketiga manapun.",
      "Data laporan disimpan secara anonim untuk keperluan analisis ancaman keamanan.",
    ],
    highlight: "Enkripsi end-to-end di setiap koneksi.",
  },
  {
    icon: Globe,
    color: "#63b3ed",
    colorBg: "rgba(99,179,237,0.08)",
    colorBorder: "rgba(99,179,237,0.15)",
    tag: "COOKIE & TRACKING",
    title: "Cookie & Pelacakan",
    content: [
      "Urlveil tidak menggunakan cookie tracking, iklan, atau pixel tracking apapun.",
      "Kami tidak menggunakan Google Analytics atau layanan analitik pihak ketiga.",
      "Tidak ada fingerprinting browser atau pelacakan aktivitas lintas situs.",
    ],
    highlight: "Zero tracking. Zero ads. Zero analytics pihak ketiga.",
  },
  {
    icon: Lock,
    color: "#F5A623",
    colorBg: "rgba(245,166,35,0.08)",
    colorBorder: "rgba(245,166,35,0.15)",
    tag: "HAK PENGGUNA",
    title: "Hak Kamu",
    content: [
      "Kamu bisa meminta penghapusan semua data yang terkait dengan email kamu kapanpun.",
      "Urlveil sepenuhnya bisa digunakan tanpa memberikan data pribadi apapun.",
      "Hubungi kami di security@urlveil.id untuk pertanyaan atau permintaan terkait privasi.",
    ],
    highlight: "Kontrol penuh ada di tanganmu.",
  },
];

const COMMITMENTS = [
  { label: "Tidak menjual data" },
  { label: "Tidak ada iklan" },
  { label: "Analisis di browser" },
  { label: "Open source" },
  { label: "Zero tracking" },
  { label: "HTTPS terenkripsi" },
];

export default function PrivasiPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <>
      <FloatingHeader />
      <main
        className="min-h-screen pt-24 pb-20 relative"
        style={{ background: "var(--color-paper, #0e1118)" }}
      >
        {/* Grid bg */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,203,133,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(45,203,133,0.025) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        {/* Glow */}
        <div
          className="fixed pointer-events-none"
          style={{
            top: "-80px", right: "-80px",
            width: "400px", height: "400px",
            borderRadius: "50%",
            background: "#2DCB85",
            opacity: 0.04,
            filter: "blur(100px)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10" ref={ref}>

          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm transition-colors"
              style={{ color: "var(--color-text-muted, #7a8095)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#F5A623"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted, #7a8095)"}
            >
              <ArrowLeft size={14} />
              Kembali ke Beranda
            </a>
          </motion.div>

          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#2DCB85" }}
              />
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "#2DCB85" }}
              >
                Kebijakan Privasi
              </span>
            </div>

            <h1
              className="font-heading font-bold text-4xl sm:text-5xl leading-tight mb-4"
              style={{ color: "var(--color-text, #e8eaf0)" }}
            >
              Privasi bukan<br />
              <span style={{ color: "#2DCB85" }}>afterthought.</span>
            </h1>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--color-text-muted, #7a8095)", maxWidth: "42ch" }}
            >
              Urlveil dibangun dengan prinsip privacy-first. Berikut adalah
              penjelasan transparan tentang apa yang kami kumpulkan dan mengapa.
            </p>

            {/* Last updated */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono"
              style={{
                background: "rgba(45,203,133,0.06)",
                border: "1px solid rgba(45,203,133,0.15)",
                color: "#2DCB85",
              }}
            >
              <ShieldCheck size={12} />
              Terakhir diperbarui: 26 Juni 2026
            </div>
          </motion.div>

          {/* Commitment pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {COMMITMENTS.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(45,203,133,0.06)",
                  border: "1px solid rgba(45,203,133,0.12)",
                  color: "#2DCB85",
                }}
              >
                <Check size={10} strokeWidth={3} />
                {c.label}
              </div>
            ))}
          </motion.div>

          {/* Sections */}
          <div className="space-y-4">
            {SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  style={{
                    background: "var(--color-paper-2, #111520)",
                    border: "1px solid var(--color-border, #1e2338)",
                    borderRadius: "14px",
                    overflow: "hidden",
                  }}
                >
                  {/* Section header */}
                  <div
                    className="flex items-start gap-4 p-5 pb-4"
                    style={{ borderBottom: "1px solid var(--color-border, #1e2338)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: section.colorBg, border: `1px solid ${section.colorBorder}` }}
                    >
                      <Icon size={16} style={{ color: section.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-mono tracking-widest mb-1"
                        style={{ color: section.color, opacity: 0.7 }}
                      >
                        {section.tag}
                      </div>
                      <h2
                        className="font-heading font-semibold text-base"
                        style={{ color: "var(--color-text, #e8eaf0)" }}
                      >
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    {section.content.map((item, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div
                          className="w-1 h-1 rounded-full flex-shrink-0 mt-2"
                          style={{ background: section.color, opacity: 0.5 }}
                        />
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-text-muted, #7a8095)" }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}

                    {/* AI highlight strip */}
                    <div
                      className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg text-xs font-mono"
                      style={{
                        background: section.colorBg,
                        border: `1px solid ${section.colorBorder}`,
                        color: section.color,
                      }}
                    >
                      <ShieldCheck size={11} aria-hidden="true" />
                      {section.highlight}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 p-6 rounded-2xl flex items-start gap-4"
            style={{
              background: "var(--color-paper-2, #111520)",
              border: "1px solid rgba(245,166,35,0.15)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.15)" }}
            >
              <Mail size={16} style={{ color: "#F5A623" }} />
            </div>
            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--color-text, #e8eaf0)", fontFamily: "var(--font-display, system-ui)" }}
              >
                Ada pertanyaan tentang privasi?
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-muted, #7a8095)" }}>
                Hubungi kami langsung di{" "}
                <a
                  href="mailto:security@urlveil.id"
                  className="font-medium transition-colors"
                  style={{ color: "#F5A623" }}
                >
                  security@urlveil.id
                </a>
                {" "}— kami merespons dalam 48 jam.
              </p>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}