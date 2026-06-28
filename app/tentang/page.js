"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Heart, Zap, Globe, Lock } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

const STATS = [
  { value: "12K+", label: "Link diperiksa", note: "sejak diluncurkan" },
  { value: "8K+", label: "Phising terdeteksi", note: "dari total scan" },
  { value: "4.5K+", label: "Pengguna aktif", note: "bulan ini" },
];

const FEATURES = [
  { icon: Zap, title: "URL Scanner", desc: "Analisis SSL, domain, redirect, dan blacklist dalam detik — tanpa install apapun." },
  { icon: Globe, title: "Database Phising", desc: "Data real-time dari URLhaus dan laporan komunitas Indonesia." },
  { icon: Lock, title: "Privasi Utama", desc: "URL yang kamu scan tidak disimpan di server. Proses terjadi di browser." },
];

export default function TentangPage() {
  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-28 pb-20" style={{ background: "var(--color-paper)" }}>
        <div className="max-w-4xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-10">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </a>

            {/* Hero */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <span className="font-mono text-xs text-[#F5A623] uppercase tracking-widest mb-4 block">Tentang Urlveil</span>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white leading-tight mb-6">
                  Keamanan digital<br />untuk semua orang.
                </h1>
                <p className="text-[#8888aa] text-base leading-relaxed">
                  Urlveil dibuat untuk melindungi masyarakat Indonesia dari phising dan penipuan online.
                  Kami percaya keamanan digital bukan hak eksklusif — siapapun bisa dan harus bisa mengecek link mencurigakan.
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                {STATS.map((s, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#2e3348] bg-[#1f2438]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <div className="font-heading font-bold text-2xl text-[#F5A623] w-20 flex-shrink-0">{s.value}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{s.label}</div>
                      <div className="text-xs font-mono text-[#555570]">{s.note}</div>
                    </div>
                  </motion.div>
                ))}
                <p className="text-[10px] text-[#555570] font-mono px-1">* Data ilustrasi, bukan real-time</p>
              </div>
            </div>

            {/* Misi */}
            <div className="border-t border-[#2e3348] pt-12 mb-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-3 block">Misi</span>
              <div className="flex items-start gap-3">
                <Heart size={20} className="text-[#E55C30] mt-1 flex-shrink-0" />
                <p className="text-lg text-[#a0a5b8] leading-relaxed">
                  Membuat internet lebih aman untuk semua orang Indonesia — tanpa perlu pengetahuan teknis,
                  tanpa biaya, tanpa install apapun.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-[#2e3348] pt-12 mb-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-6 block">Fitur utama</span>
              <div className="space-y-0 border-t border-[#2e3348]">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4 py-5 border-b border-[#2e3348]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                    >
                      <Icon size={18} className="text-[#F5A623] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-white text-sm mb-1">{f.title}</h3>
                        <p className="text-sm text-[#666680] leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Open Source */}
            <div className="border-t border-[#2e3348] pt-12">
              <div className="flex items-start gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0a5b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <div>
                  <h2 className="font-heading font-semibold text-white text-lg mb-2">Open Source</h2>
                  <p className="text-sm text-[#666680] leading-relaxed mb-4">
                    Urlveil adalah proyek open source. Transparansi adalah kunci kepercayaan — kamu bisa lihat,
                    audit, dan berkontribusi ke kode kami kapanpun.
                  </p>
                  <a
                    href="https://github.com/michiooo290-rgb/ceklink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2e3348] text-sm text-[#a0a5b8] hover:text-white hover:border-[#F5A623]/30 transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    Lihat di GitHub
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}