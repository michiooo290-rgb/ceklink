"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, MessageSquare, Github, ShieldCheck } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

const FAQ = [
  {
    q: "Bagaimana cara melaporkan link phising?",
    a: "Gunakan fitur 'Laporkan' yang muncul setelah kamu mengecek link. Isi alasan dan deskripsi, lalu kirim.",
  },
  {
    q: "Apakah Urlveil gratis?",
    a: "Ya, 100% gratis untuk penggunaan pribadi. API publik juga gratis dengan batas 100 request per hari.",
  },
  {
    q: "Bagaimana cara berkontribusi?",
    a: "Urlveil open source. Kunjungi repository GitHub untuk mulai berkontribusi — pull request selalu disambut.",
  },
  {
    q: "Saya menemukan bug, ke mana lapor?",
    a: "Email ke security@urlveil.id dengan detail bug. Kami merespons dalam 48 jam.",
  },
];

export default function KontakPage() {
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

            {/* Header */}
            <div className="mb-12">
              <span className="font-mono text-xs text-[#F5A623] uppercase tracking-widest mb-4 block">Hubungi kami</span>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white leading-tight mb-4">
                Ada yang bisa<br />kami bantu?
              </h1>
              <p className="text-[#8888aa] text-base max-w-lg">
                Punya pertanyaan, masukan, atau menemukan masalah keamanan? Kami siap merespons.
              </p>
            </div>

            {/* Contact channels */}
            <div className="grid lg:grid-cols-3 gap-4 mb-16">
              {[
                {
                  icon: ShieldCheck,
                  label: "Keamanan",
                  value: "security@urlveil.id",
                  href: "mailto:security@urlveil.id",
                  desc: "Laporan kerentanan & privasi",
                  color: "#E55C30",
                },
                {
                  icon: Mail,
                  label: "Umum",
                  value: "hello@urlveil.id",
                  href: "mailto:hello@urlveil.id",
                  desc: "Pertanyaan & kerjasama",
                  color: "#F5A623",
                },
                {
                  icon: Github,
                  label: "GitHub",
                  value: "michiooo290-rgb/ceklink",
                  href: "https://github.com/michiooo290-rgb/ceklink",
                  desc: "Issue & pull request",
                  color: "#a0a5b8",
                  external: true,
                },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.a
                    key={i}
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="group p-5 rounded-xl border border-[#2e3348] bg-[#1f2438] hover:border-[#3e4358] transition-colors block"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <Icon size={18} style={{ color: c.color }} className="mb-3" />
                    <p className="text-xs font-mono text-[#555570] mb-1">{c.label}</p>
                    <p className="text-sm font-medium text-white mb-1 group-hover:text-[#F5A623] transition-colors">{c.value}</p>
                    <p className="text-xs text-[#666680]">{c.desc}</p>
                  </motion.a>
                );
              })}
            </div>

            {/* FAQ */}
            <div className="border-t border-[#2e3348] pt-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-6 block">Pertanyaan umum</span>
              <div className="border-t border-[#2e3348]">
                {FAQ.map((item, i) => (
                  <motion.div
                    key={i}
                    className="grid sm:grid-cols-2 gap-4 py-5 border-b border-[#2e3348]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                  >
                    <h3 className="text-sm font-medium text-white">{item.q}</h3>
                    <p className="text-sm text-[#666680] leading-relaxed">{item.a}</p>
                  </motion.div>
                ))}
              </div>

              {/* Response time note */}
              <div className="mt-8 flex items-center gap-3 p-4 rounded-xl border border-[#2DCB85]/20 bg-[#2DCB85]/5">
                <ShieldCheck size={16} className="text-[#2DCB85] flex-shrink-0" />
                <p className="text-sm text-[#8888aa]">
                  Respons dalam <span className="text-[#2DCB85] font-medium">48 jam</span> untuk laporan keamanan.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}