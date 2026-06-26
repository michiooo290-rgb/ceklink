"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, MessageSquare, ShieldCheck, ExternalLink } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import MeshBackground from "../../components/MeshBackground";

const CONTACTS = [
  {
    icon: Mail,
    label: "Email Keamanan",
    value: "security@ceklink.id",
    href: "mailto:security@ceklink.id",
    desc: "Untuk laporan kerentanan keamanan dan pertanyaan privasi",
  },
  {
    icon: MessageSquare,
    label: "Email Umum",
    value: "hello@ceklink.id",
    href: "mailto:hello@ceklink.id",
    desc: "Untuk pertanyaan umum, kerjasama, dan masukan",
  },
];

const FAQ = [
  {
    q: "Bagaimana cara melaporkan link phising?",
    a: "Gunakan fitur 'Laporkan' yang muncul setelah kamu mengecek link di CekLink. Isi alasan dan deskripsi, lalu kirim.",
  },
  {
    q: "Apakah CekLink gratis?",
    a: "Ya, CekLink 100% gratis untuk penggunaan pribadi. API publik juga gratis dengan batas 100 request per hari.",
  },
  {
    q: "Bagaimana cara berkontribusi?",
    a: "CekLink adalah proyek open source. Kunjungi repository GitHub kami untuk mulai berkontribusi.",
  },
  {
    q: "Saya menemukan bug, ke mana saya lapor?",
    a: "Kirim email ke security@ceklink.id dengan detail bug yang kamu temukan. Kami merespons dalam 48 jam.",
  },
];

export default function KontakPage() {
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
                <Mail size={24} className="text-[#F5A623]" />
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl">
                Kontak Kami
              </h1>
            </div>

            <p className="text-[#8888aa] text-lg leading-relaxed mb-10">
              Punya pertanyaan, masukan, atau menemukan masalah? Kami siap membantu.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {CONTACTS.map((contact, i) => {
                const Icon = contact.icon;
                return (
                  <motion.a
                    key={i}
                    href={contact.href}
                    className="glass-card hover:border-[#2DCB85]/20 transition-colors p-6 block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Icon size={24} className="text-[#F5A623] mb-3" />
                    <h3 className="font-heading font-semibold text-[#e0e0e0] mb-1">{contact.label}</h3>
                    <p className="text-[#F5A623] text-sm font-mono mb-2">{contact.value}</p>
                    <p className="text-[#666680] text-xs">{contact.desc}</p>
                  </motion.a>
                );
              })}
            </div>

            <h2 className="font-heading font-semibold text-xl text-[#e0e0e0] mb-6">
              Pertanyaan Umum
            </h2>
            <div className="space-y-4 mb-10">
              {FAQ.map((item, i) => (
                <motion.div
                  key={i}
                  className="glass-card p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <h3 className="font-heading font-medium text-[#e0e0e0] mb-2 text-sm">{item.q}</h3>
                  <p className="text-[#8888aa] text-sm leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="glass-card p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <ShieldCheck size={28} className="text-[#2DCB85] mx-auto mb-3" />
              <p className="text-[#8888aa] text-sm">
                Respons dalam <span className="text-[#2DCB85] font-medium">48 jam</span> untuk laporan keamanan.
                Kami sangat menghargai kontribusi komunitas untuk keamanan bersama.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
