"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Users, Target, Heart } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import MeshBackground from "../../components/MeshBackground";

const STATS = [
  { value: "12K+", label: "Link Discan", icon: ShieldCheck },
  { value: "8K+", label: "Phising Ditemukan", icon: Target },
  { value: "4.5K+", label: "User Aktif", icon: Users },
];

export default function TentangPage() {
  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-24 pb-16 relative">
        <MeshBackground variant="warm" />
        <section className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </a>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
                <ShieldCheck size={24} className="text-[#F5A623]" />
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl">
                Tentang Urlveil
              </h1>
            </div>

            <p className="text-[#8888aa] text-lg leading-relaxed mb-8">
              Urlveil adalah alat pengecek keamanan link yang dibuat untuk melindungi masyarakat Indonesia
              dari serangan phising dan penipuan online. Kami percaya bahwa keamanan digital adalah hak
              semua orang.
            </p>

            <div className="glass-card p-6 mb-8">
              <h2 className="font-heading font-semibold text-xl text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Heart size={20} className="text-[#E55C30]" />
                Misi Kami
              </h2>
              <p className="text-[#8888aa] leading-relaxed">
                Membuat internet yang lebih aman untuk semua orang Indonesia. Kami ingin setiap orang
                bisa dengan mudah mengecek apakah sebuah link aman atau berbahaya — tanpa perlu
                pengetahuan teknis yang rumit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    className="glass-card p-5 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Icon size={24} className="text-[#F5A623] mx-auto mb-2" />
                    <div className="font-heading font-bold text-2xl text-[#F5A623]">{stat.value}</div>
                    <div className="text-sm text-[#666680]">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-[10px] text-[#555570] -mt-4 mb-8">
              * Data ilustrasi — bukan data real-time
            </p>

            <div className="glass-card p-6 mb-8">
              <h2 className="font-heading font-semibold text-xl text-[#e0e0e0] mb-4">
                Fitur Utama
              </h2>
              <ul className="space-y-3 text-[#8888aa]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DCB85] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#e0e0e0]">URL Scanner</strong> — Analisis keamanan link secara instan dengan pengecekan SSL, domain, dan pattern matching.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DCB85] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#e0e0e0]">Database Phising</strong> — Kumpulan link phising terbaru yang dilaporkan oleh komunitas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DCB85] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#e0e0e0]">Pusat Edukasi</strong> — Artikel dan panduan lengkap tentang keamanan digital.</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-xl text-[#e0e0e0] mb-4">
                Open Source
              </h2>
              <p className="text-[#8888aa] leading-relaxed">
                Urlveil adalah proyek open source. Kami percaya transparansi adalah kunci keamanan.
                Kontribusi dari komunitas sangat kami hargai.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
