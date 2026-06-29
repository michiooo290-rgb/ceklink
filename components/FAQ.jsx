"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldQuestion } from "lucide-react";

const headerInitial = { opacity: 0, y: 16 };
const headerInView = { opacity: 1, y: 0 };
const headerTransition = { duration: 0.5, ease: "easeOut" };
const headerViewport = { once: true, amount: 0.3 };

const answerInitial = { height: 0, opacity: 0 };
const answerAnimate = { height: "auto", opacity: 1 };
const answerExit = { height: 0, opacity: 0 };
const answerTransition = { duration: 0.25, ease: "easeOut" };

const chevronOpen = { rotate: 180 };
const chevronClosed = { rotate: 0 };
const chevronTransition = { duration: 0.2 };

const FAQS = [
  {
    q: "Apakah link yang saya cek disimpan?",
    a: "Saat kamu mengecek sebuah link, URL-nya dicatat ke riwayat scan supaya bisa kamu lihat lagi dan supaya data ancaman makin lengkap untuk pengguna lain. Untuk sekadar mengecek link, kamu tidak perlu mendaftar atau memberi data pribadi.",
  },
  {
    q: "Apakah Urlveil gratis?",
    a: "Ya. Mengecek link sepenuhnya gratis dan tanpa perlu membuat akun. Tinggal tempel link, lalu cek.",
  },
  {
    q: "Kalau hasilnya 'Aman', apakah pasti 100% aman?",
    a: "Tidak ada alat keamanan yang sempurna. Hasil 'Aman' berarti tidak ada ancaman yang terdeteksi saat itu - bukan jaminan mutlak. Phising yang sangat baru bisa saja belum masuk database manapun, jadi tetap waspada.",
  },
  {
    q: "Apakah saya bisa kena virus karena mengecek link berbahaya di sini?",
    a: "Tidak. Urlveil memeriksa URL-nya, bukan membuka situs tersebut di perangkatmu. Jadi mengecek link mencurigakan di sini jauh lebih aman daripada langsung mengkliknya.",
  },
  {
    q: "Datanya dari mana?",
    a: "Urlveil memadukan beberapa sumber data ancaman publik (seperti URLhaus) dengan pemeriksaan teknis pada domain, SSL, dan redirect. Sumber yang dipakai bisa kamu lihat di bagian 'Dari mana datanya?'.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-xl border border-[#2e3348] bg-[#12151f]/60 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-[#e0e0e0]">{item.q}</span>
        <motion.span
          animate={isOpen ? chevronOpen : chevronClosed}
          transition={chevronTransition}
          className="shrink-0 text-[#666680]"
        >
          <ChevronDown size={18} aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={answerInitial}
            animate={answerAnimate}
            exit={answerExit}
            transition={answerTransition}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-[#a0a5b8] leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="relative py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={headerInitial}
          whileInView={headerInView}
          viewport={headerViewport}
          transition={headerTransition}
        >
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#666680] mb-3">
          <ShieldQuestion size={15} aria-hidden="true" />
          Tanya jawab
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 text-[#e0e0e0]">
            Pertanyaan yang sering muncul
          </h2>
          <p className="text-[#a0a5b8] max-w-xl mx-auto">
            Dijawab apa adanya - termasuk hal yang biasanya bikin ragu.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
