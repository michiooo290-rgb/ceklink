"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardPaste, ScanLine, ShieldCheck, Share2 } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: ClipboardPaste,
    title: "Tempel Link",
    desc: "Copy paste link dari WhatsApp, email, atau DM — langsung ke kolom scan.",
    color: "#F5A623",
  },
  {
    num: "02",
    icon: ScanLine,
    title: "Sistem Mulai Cek",
    desc: "SSL, reputasi domain, redirect, dan blacklist global dicek dalam detik.",
    color: "#2DCB85",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Lihat Hasilnya",
    desc: "Skor keamanan muncul langsung. Kalau berbahaya, detail ancaman ikut tampil.",
    color: "#2DCB85",
  },
  {
    num: "04",
    icon: Share2,
    title: "Share atau Lapor",
    desc: "Bagikan hasilnya ke keluarga lewat WhatsApp, atau laporkan kalau ternyata phising.",
    color: "#F5A623",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="cara-kerja" className="hiw-section" aria-label="Cara kerja Urlveil">
      <div className="hiw-inner" ref={ref}>

        {/* Header — left aligned */}
        <motion.div
          className="hiw-header"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Cara kerja</span>
          <h2 className="hiw-title">
            Dari link mencurigakan<br />ke jawaban — dalam detik.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="hiw-steps">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                className="hiw-step"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Number + connector */}
                <div className="hiw-step-top">
                  <div className="hiw-step-num" style={{ color: step.color, borderColor: step.color + "33", background: step.color + "10" }}>
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && <div className="hiw-connector" />}
                </div>

                {/* Icon */}
                <div className="hiw-icon" style={{ color: step.color }}>
                  <Icon size={20} />
                </div>

                {/* Text */}
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          className="hiw-note"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Gratis · Tanpa daftar · Tanpa install apapun
        </motion.p>
      </div>
    </section>
  );
}