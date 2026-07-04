"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, Radar, Zap, FileSearch, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "4 Lapis Perlindungan",
    desc: "Setiap link diperiksa berlapis \u2014 dari database ancaman global sampai analisis pola cerdas. Kalau satu lapis lolos, lapis lain menangkap.",
    color: "#2DCB85",
    span: "sm:col-span-2 lg:col-span-2",
    big: true,
  },
  {
    icon: Globe,
    title: "URLhaus",
    desc: "Database malware & phishing yang diperbarui real-time.",
    color: "#06b6d4",
    span: "",
  },
  {
    icon: Radar,
    title: "Google Safe Browsing",
    desc: "Dicocokkan dengan miliaran situs berbahaya milik Google.",
    color: "#8a5cff",
    span: "",
  },
  {
    icon: Zap,
    title: "Analisis Heuristik",
    desc: "Mendeteksi pola phishing & typosquatting tanpa perlu database.",
    color: "#F5A623",
    span: "",
  },
  {
    icon: FileSearch,
    title: "VirusTotal",
    desc: "Cek file & APK ke puluhan mesin antivirus sekaligus.",
    color: "#2DCB85",
    span: "",
  },
  {
    icon: Lock,
    title: "Privasi Utama",
    desc: "Tanpa daftar, tanpa install. File tidak diunggah \u2014 hanya sidik jari digitalnya yang dicek.",
    color: "#2DCB85",
    span: "sm:col-span-2 lg:col-span-3",
  },
];

export default function BentoFeatures() {
  return (
    <section id="keunggulan" className="relative py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={ { opacity: 0, y: 20 } }
          whileInView={ { opacity: 1, y: 0 } }
          viewport={ { once: true, amount: 0.3 } }
          transition={ { duration: 0.5 } }
        >
          <span className="text-[#2DCB85] text-sm font-semibold tracking-wide uppercase">
            Kenapa Urlveil
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mt-3">
            Perlindungan berlapis, dalam satu ketukan
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:auto-rows-fr">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                className={
                  "group relative overflow-hidden rounded-2xl border border-[#2a2a4a] bg-[#0d0d1f] p-6 transition-colors hover:border-[#2DCB85]/40 " +
                  f.span
                }
                initial={ { opacity: 0, y: 18 } }
                whileInView={ { opacity: 1, y: 0 } }
                viewport={ { once: true, amount: 0.2 } }
                transition={ { duration: 0.45, delay: i * 0.06 } }
              >
                <div
                  className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                  style={ { background: f.color } }
                  aria-hidden="true"
                />
                <div
                  className="relative inline-flex items-center justify-center rounded-xl border mb-4"
                  style={ { borderColor: f.color + "40", background: f.color + "14", width: f.big ? 56 : 44, height: f.big ? 56 : 44 } }
                >
                  <Icon size={f.big ? 28 : 22} style={ { color: f.color } } aria-hidden="true" />
                </div>
                <h3 className={ "relative font-heading font-bold text-white " + (f.big ? "text-xl sm:text-2xl mb-3" : "text-lg mb-2") }>
                  {f.title}
                </h3>
                <p className={ "relative text-[#8888aa] leading-relaxed " + (f.big ? "text-base" : "text-sm") }>
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
