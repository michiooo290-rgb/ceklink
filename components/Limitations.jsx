"use client";

import { motion } from "framer-motion";
import { Check, X, Info } from "lucide-react";

const headerInitial = { opacity: 0, y: 16 };
const headerInView = { opacity: 1, y: 0 };
const headerTransition = { duration: 0.5, ease: "easeOut" };
const cardViewport = { once: true, amount: 0.2 };

const colInitial = { opacity: 0, y: 18 };
const colInView = { opacity: 1, y: 0 };

function colTransition(i) {
  return { duration: 0.45, ease: "easeOut", delay: i * 0.1 };
}

const CAN_DO = [
  "Mengecek reputasi domain & URL terhadap database phising publik (mis. URLhaus).",
  "Memeriksa SSL/HTTPS, struktur domain, dan TLD yang mencurigakan.",
  "Mendeteksi redirect dan shortlink yang menyembunyikan tujuan asli.",
  "Memberi penilaian cepat tanpa membuka situs di perangkatmu.",
];

const CANNOT_DO = [
  "Bukan jaminan 100% - phising yang sangat baru bisa belum masuk database manapun.",
  "Tidak memindai isi file seperti .apk atau .exe - yang diperiksa hanya URL-nya.",
  "Tidak menggantikan kewaspadaan: jangan pasang aplikasi dari chat, jangan bagikan OTP.",
  "Hasil \"Aman\" berarti tidak ada ancaman terdeteksi, bukan bebas risiko mutlak.",
];

export default function Limitations() {
  return (
    <section id="batasan" className="relative py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={headerInitial}
          whileInView={headerInView}
          viewport={cardViewport}
          transition={headerTransition}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2DCB85] mb-3">
            <Info size={15} aria-hidden="true" />
            Transparan
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 text-[#e0e0e0]">
            Apa yang bisa & belum bisa Urlveil lakukan
          </h2>
          <p className="text-[#a0a5b8] max-w-xl mx-auto">
            Kami lebih suka jujur soal batasannya daripada menjanjikan hal yang
            tidak bisa kami penuhi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            className="rounded-xl border border-[#2DCB85]/30 bg-[#2DCB85]/5 p-6"
            initial={colInitial}
            whileInView={colInView}
            viewport={cardViewport}
            transition={colTransition(0)}
          >
            <h3 className="flex items-center gap-2 font-semibold text-[#e0e0e0] mb-4">
              <Check size={18} className="text-[#2DCB85]" aria-hidden="true" />
              Yang Urlveil lakukan
            </h3>
            <ul className="space-y-3">
              {CAN_DO.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-[#c4c9d8] leading-relaxed"
                >
                  <Check
                    size={15}
                    className="mt-0.5 shrink-0 text-[#2DCB85]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="rounded-xl border border-[#E55C30]/30 bg-[#E55C30]/5 p-6"
            initial={colInitial}
            whileInView={colInView}
            viewport={cardViewport}
            transition={colTransition(1)}
          >
            <h3 className="flex items-center gap-2 font-semibold text-[#e0e0e0] mb-4">
              <X size={18} className="text-[#E55C30]" aria-hidden="true" />
              Batasan yang perlu kamu tahu
            </h3>
            <ul className="space-y-3">
              {CANNOT_DO.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-[#c4c9d8] leading-relaxed"
                >
                  <X
                    size={15}
                    className="mt-0.5 shrink-0 text-[#E55C30]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
