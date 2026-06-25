"use client";

import { motion } from "framer-motion";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1e2e] p-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl bg-[#ffaa00]/10 flex items-center justify-center mx-auto mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShieldX size={40} className="text-[#ffaa00]" />
        </motion.div>

        <h1 className="font-heading font-bold text-6xl text-[#ffaa00] mb-4">
          404
        </h1>

        <h2 className="font-heading font-bold text-xl text-white mb-3">
          Halaman Tidak Ditemukan
        </h2>

        <p className="text-[#666680] text-sm mb-8">
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
          Jangan khawatir, link ini aman! 😊
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.a
            href="/"
            className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={16} />
            Kembali ke Beranda
          </motion.a>

          <motion.button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-[#1a1a2e] text-[#666680] hover:text-white hover:border-[#00ff88]/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} />
            Kembali
          </motion.button>
        </div>

        <p className="text-[#555570] text-xs mt-8">
          © {new Date().getFullYear()} CekLink — Lindungi diri dari phising
        </p>
      </motion.div>
    </div>
  );
}
