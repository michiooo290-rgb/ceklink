"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText, ShieldAlert, UserCheck, AlertTriangle } from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import MeshBackground from "../../components/MeshBackground";

const SECTIONS = [
  {
    title: "Penerimaan Syarat",
    content: "Dengan mengakses dan menggunakan CekLink, kamu menyetujui syarat dan ketentuan ini. Jika kamu tidak setuju, mohon untuk tidak menggunakan layanan kami.",
  },
  {
    title: "Deskripsi Layanan",
    content: "CekLink menyediakan alat pengecekan keamanan URL secara gratis. Hasil analisis bersifat informatif dan tidak menjamin keamanan mutlak dari sebuah link. Pengguna tetap bertanggung jawab atas keputusan mereka sendiri.",
  },
  {
    title: "Penggunaan yang Diizinkan",
    items: [
      "Mengecek keamanan link untuk penggunaan pribadi.",
      "Melaporkan link phising yang kamu temukan.",
      "Menggunakan API publik sesuai batas rate limit.",
      "Membagikan hasil cek ke orang lain.",
    ],
  },
  {
    title: "Penggunaan yang Dilarang",
    items: [
      "Menggunakan CekLink untuk tujuan ilegal atau merugikan orang lain.",
      "Mengirim laporan palsu atau menyesatkan.",
      "Mencoba mengeksploitasi atau merusak layanan kami.",
      "Menggunakan bot atau script otomatis melebihi batas wajar.",
      "Menggunakan nama atau brand CekLink tanpa izin.",
    ],
  },
  {
    title: "Batasan Tanggung Jawab",
    content: "CekLink disediakan 'sebagaimana adanya'. Kami tidak menjamin keakuratan 100% dari hasil analisis. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan ini. Hasil pengecekan adalah referensi, bukan keputusan final.",
  },
  {
    title: "Hak Kekayaan Intelektual",
    content: "Kode sumber CekLink dilisensikan di bawah lisensi open source. Brand, logo, dan nama 'CekLink' adalah milik pengembang CekLink.",
  },
  {
    title: "Perubahan Syarat",
    content: "Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Perubahan signifikan akan diinformasikan melalui website. Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan.",
  },
  {
    title: "Kontak",
    content: "Untuk pertanyaan tentang syarat dan ketentuan ini, hubungi kami di security@ceklink.id.",
  },
];

export default function SyaratPage() {
  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-24 pb-16 relative">
        <MeshBackground variant="cool" />
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

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
                <FileText size={24} className="text-[#F5A623]" />
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl">
                Syarat & Ketentuan
              </h1>
            </div>
            <p className="text-[#555570] text-sm mb-10">
              Terakhir diperbarui: 26 Juni 2026
            </p>

            <div className="space-y-4">
              {SECTIONS.map((section, i) => (
                <motion.div
                  key={i}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <h2 className="font-heading font-semibold text-lg text-[#e0e0e0] mb-3">
                    {i + 1}. {section.title}
                  </h2>
                  {section.content && (
                    <p className="text-sm text-[#8888aa] leading-relaxed">{section.content}</p>
                  )}
                  {section.items && (
                    <ul className="space-y-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#8888aa]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]/50 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
