"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

const ColorBends = dynamic(() => import("./ColorBends"), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
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
          colors={["#00ff88", "#06b6d4", "#8a5cff", "#0d9488"]}
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

      {/* Aurora Background */}
      <div
        className="aurora-bg relative z-[1]"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      />

      {/* Floating orbs decoration */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#00ff88]/5 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#06b6d4]/5 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={scaleVariants}>
          <div className="glass-shimmer inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/5 text-[#00ff88] text-sm font-mono mb-8 hover-lift">
            <motion.span
              className="w-2 h-2 rounded-full bg-[#00ff88]"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Lindungi diri dari phising
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
        >
          <span className="inline-block">Cek Keamanan</span>{" "}
          <motion.span
            className="hero-title-gradient inline-block"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            Link
          </motion.span>{" "}
          <span className="inline-block">dalam Hitungan Detik</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-[#666680] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Tempel link yang mencurigakan, kami akan menganalisisnya secara
          otomatis. Tahu apakah link tersebut{" "}
          <motion.span
            className="text-[#00ff88] font-medium"
            whileHover={{ scale: 1.05 }}
          >
            aman
          </motion.span>
          ,{" "}
          <motion.span
            className="text-[#ffaa00] font-medium"
            whileHover={{ scale: 1.05 }}
          >
            mencurigakan
          </motion.span>
          , atau{" "}
          <motion.span
            className="text-[#ff3b3b] font-medium"
            whileHover={{ scale: 1.05 }}
          >
            berbahaya
          </motion.span>
          .
        </motion.p>

        {/* Scroll CTA */}
        <motion.div variants={itemVariants} className="mt-8">
          <motion.a
            href="#cek-link"
            className="btn-glow inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 255, 136, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
            Mulai Cek Link
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </motion.a>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { value: "12K+", label: "Link Discan" },
            { value: "8K+", label: "Phising Ditemukan" },
            { value: "4.5K+", label: "User Aktif" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
            >
              <div className="font-heading font-bold text-2xl text-[#00ff88]">
                {stat.value}
              </div>
              <div className="text-sm text-[#666680]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent"
        aria-hidden="true"
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 2, duration: 0.5 },
          y: { duration: 2, repeat: Infinity },
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#666680] flex items-start justify-center p-1">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
