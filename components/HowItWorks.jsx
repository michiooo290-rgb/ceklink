"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardPaste, ScanLine, ShieldCheck, Share2 } from "lucide-react";

const STEPS = [
  {
    num: 1,
    icon: ClipboardPaste,
    title: "Tempel Link",
    desc: "Copy paste aja link yang kamu dapat dari WhatsApp, email, atau DM media sosial.",
  },
  {
    num: 2,
    icon: ScanLine,
    title: "Sistem Mulai Cek",
    desc: "Otomatis dicek SSL-nya, reputasi domainnya, sampai jejak redirect-nya ke database blacklist global.",
  },
  {
    num: 3,
    icon: ShieldCheck,
    title: "Lihat Hasilnya",
    desc: "Muncul skor keamanan dan kalau ada ancaman, langsung kelihatan detailnya.",
  },
  {
    num: 4,
    icon: Share2,
    title: "Share atau Lapor",
    desc: "Aman buat dibagikan ke keluarga, atau langsung laporkan kalau ternyata phishing.",
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="cara-kerja" className="py-16 sm:py-24" aria-label="Cara kerja Urlveil">
      <div className="max-w-5xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 flex items-center justify-center gap-3">
            <ScanLine size={28} className="text-[#2DCB85]" aria-hidden="true" />
            Gimana Urlveil Bekerja
          </h2>
          <p className="text-[#666680] max-w-lg mx-auto">
            Nggak perlu ribet — tempel link, tunggu beberapa detik, langsung tahu aman atau nggak.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="glass-card p-5 relative group"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Step Number */}
                <span className="absolute -top-2.5 -left-1 w-7 h-7 rounded-full bg-[#2DCB85]/10 border border-[#2DCB85]/20 text-[#2DCB85] text-xs font-bold flex items-center justify-center">
                  {step.num}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#2DCB85]/8 flex items-center justify-center mb-3 mx-auto">
                  <Icon size={22} className="text-[#2DCB85]" />
                </div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-sm text-[#e0e0e0] text-center mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-[#666680] text-center leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}