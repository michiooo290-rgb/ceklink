"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1e2e] p-4 font-sans">
      <div className="w-full max-w-lg text-center">

        {/* GIF area with 404 overlay */}
        <div
          className="h-[250px] sm:h-[350px] bg-center bg-no-repeat bg-contain relative"
          style={{
            backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
          }}
          aria-hidden="true"
        >
          <motion.h1
            className="text-7xl sm:text-8xl font-bold pt-8 text-[#F5A623]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </motion.h1>
        </div>

        {/* Text content */}
        <motion.div
          className="mt-[-30px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-display)" }}>
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-[#666680] text-sm mb-8">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan.
            Tenang, link ini aman! 😊
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#F5A623] text-[#1a1e2e] hover:opacity-90 transition-opacity"
            >
              <Home size={16} />
              Kembali ke Beranda
            </button>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-[#2e3348] text-[#666680] hover:text-white hover:border-[#F5A623]/30 transition-colors"
            >
              <ArrowLeft size={16} />
              Halaman Sebelumnya
            </button>
          </div>

          <p className="text-[#555570] text-xs mt-8">
            © {new Date().getFullYear()} Urlveil — Lindungi diri dari phising
          </p>
        </motion.div>
      </div>
    </div>
  );
}