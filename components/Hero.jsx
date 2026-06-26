"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

const ColorBends = dynamic(() => import("./ColorBends"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#1a1e2e]" />
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* ColorBends Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <ColorBends
          colors={["#D4870A", "#1A9E6A", "#C44A20", "#0F7A5E"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20"
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#F5A623]/20 bg-[#F5A623]/5 text-[#F5A623] text-sm font-mono mb-8">
            <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
            Lindungi diri dari phising
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
        >
          Cek Keamanan{" "}
          <span className="text-[#F5A623]">Link</span>{" "}
          dalam Hitungan Detik
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-lg sm:text-xl text-[#666680] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Tempel link yang mencurigakan, kami akan menganalisisnya secara
          otomatis. Tahu apakah link tersebut{" "}
          <span className="text-[#2DCB85] font-medium">aman</span>,{" "}
          <span className="text-[#F5A623] font-medium">mencurigakan</span>, atau{" "}
          <span className="text-[#E55C30] font-medium">berbahaya</span>.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp} custom={3}>
          <a
            href="#cek-link"
            className="btn-glow inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base"
          >
            <Search size={20} />
            Mulai Cek Link
          </a>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          variants={fadeUp}
          custom={4}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { value: "12K+", label: "Link Discan" },
            { value: "8K+", label: "Phising Ditemukan" },
            { value: "4.5K+", label: "User Aktif" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-heading font-bold text-2xl text-[#F5A623]">
                {stat.value}
              </div>
              <div className="text-sm text-[#666680]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        <motion.p
          variants={fadeUp}
          custom={5}
          className="text-center text-[10px] text-[#555570] mt-3"
        >
          * Data ilustrasi — bukan data real-time
        </motion.p>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1e2e] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
