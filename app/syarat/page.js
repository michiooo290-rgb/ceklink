"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft, ShieldCheck, Check, X,
  AlertTriangle, RefreshCw, Mail, Scale, FileText
} from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

const SECTIONS = [
  {
    icon: FileText,
    tag: "Pasal 1",
    title: "Penerimaan Syarat",
    type: "text",
    content:
      "Dengan mengakses dan menggunakan Urlveil, kamu menyetujui syarat dan ketentuan ini secara keseluruhan. Jika kamu tidak menyetujui salah satu poin, mohon untuk tidak menggunakan layanan kami.",
  },
  {
    icon: ShieldCheck,
    tag: "Pasal 2",
    title: "Deskripsi Layanan",
    type: "text",
    content:
      "Urlveil menyediakan alat pengecekan keamanan URL secara gratis. Hasil analisis bersifat informatif dan tidak menjamin keamanan mutlak dari sebuah link. Pengguna tetap bertanggung jawab penuh atas keputusan mereka sendiri.",
  },
  {
    icon: Check,
    tag: "Pasal 3",
    title: "Penggunaan yang Diizinkan",
    type: "allowed",
    items: [
      "Mengecek keamanan link untuk penggunaan pribadi maupun organisasi.",
      "Melaporkan link phising yang kamu temukan kepada komunitas.",
      "Menggunakan API publik sesuai batas rate limit yang berlaku.",
      "Membagikan hasil cek kepada keluarga, teman, atau kolega.",
    ],
  },
  {
    icon: X,
    tag: "Pasal 4",
    title: "Penggunaan yang Dilarang",
    type: "denied",
    items: [
      "Menggunakan Urlveil untuk tujuan ilegal atau merugikan pihak lain.",
      "Mengirim laporan palsu atau menyesatkan yang dapat mencemarkan domain sah.",
      "Mencoba mengeksploitasi, meretas, atau merusak layanan dan infrastruktur kami.",
      "Menggunakan bot atau script otomatis melebihi batas wajar tanpa izin.",
      "Menggunakan nama, logo, atau brand Urlveil tanpa persetujuan tertulis.",
    ],
  },
  {
    icon: AlertTriangle,
    tag: "Pasal 5",
    title: "Batasan Tanggung Jawab",
    type: "text",
    content:
      "Urlveil disediakan 'sebagaimana adanya' tanpa jaminan apapun. Kami tidak menjamin keakuratan 100% dari setiap hasil analisis. Kami tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan layanan ini. Hasil pengecekan adalah referensi, bukan keputusan final.",
  },
  {
    icon: Scale,
    tag: "Pasal 6",
    title: "Hak Kekayaan Intelektual",
    type: "text",
    content:
      "Kode sumber Urlveil dilisensikan di bawah lisensi open source yang dapat diakses di GitHub. Brand, logo, dan nama 'Urlveil' adalah milik pengembang dan tidak boleh digunakan tanpa izin tertulis.",
  },
  {
    icon: RefreshCw,
    tag: "Pasal 7",
    title: "Perubahan Syarat",
    type: "text",
    content:
      "Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Perubahan signifikan akan diinformasikan melalui website. Penggunaan layanan yang berkelanjutan setelah perubahan dianggap sebagai bentuk persetujuan terhadap syarat yang baru.",
  },
];

export default function SyaratPage() {
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

            {/* Back */}
            <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-10">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </a>

            {/* Hero — full width, lebih editorial */}
            <div className="mb-16">
              <span className="font-mono text-xs text-[#F5A623] uppercase tracking-widest mb-4 block">Syarat & Ketentuan</span>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white leading-tight mb-6">
                Aturan main<br />yang jelas.
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                <p className="text-[#8888aa] text-base leading-relaxed max-w-xl">
                  Tidak ada bahasa hukum yang rumit. Syarat penggunaan Urlveil
                  ditulis agar mudah dipahami siapapun — karena transparansi
                  adalah bagian dari produk kami.
                </p>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs font-mono text-[#555570]">Terakhir diperbarui</div>
                  <div className="text-sm font-mono text-[#a0a5b8]">26 Juni 2026</div>
                </div>
              </div>
            </div>

            {/* Quote besar — beda dari tentang yg pakai misi */}
            <div className="border-t border-[#2e3348] pt-12 mb-16">
              <div className="pl-6 border-l-2 border-[#F5A623]">
                <p className="text-xl text-[#a0a5b8] leading-relaxed italic">
                  "Gunakan Urlveil untuk hal-hal yang baik, jangan disalahgunakan,
                  dan pahami bahwa setiap hasil analisis adalah referensi — bukan keputusan mutlak."
                </p>
                <span className="text-xs font-mono text-[#555570] mt-3 block">Tim Urlveil</span>
              </div>
            </div>

            {/* Pasal-pasal — numbered index besar di kiri */}
            <div className="border-t border-[#2e3348] pt-12 mb-12">
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest mb-8 block">Isi lengkap</span>

              <div className="space-y-0">
                {SECTIONS.map((section, i) => {
                  const isAllowed = section.type === "allowed";
                  const isDenied  = section.type === "denied";
                  const accentColor = isDenied ? "#E55C30" : isAllowed ? "#2DCB85" : "#F5A623";

                  return (
                    <motion.div
                      key={i}
                      className="flex gap-8 py-8 border-b border-[#2e3348]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.07 }}
                    >
                      {/* Nomor besar — beda dari tentang yang pakai icon */}
                      <div className="flex-shrink-0 w-12 pt-0.5">
                        <span
                          className="font-heading font-bold text-3xl leading-none"
                          style={{ color: accentColor, opacity: 0.25 }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Konten */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-[#555570] uppercase tracking-widest">{section.tag}</span>
                        </div>
                        <h3 className="font-heading font-semibold text-white text-base mb-4">{section.title}</h3>

                        {section.type === "text" && (
                          <p className="text-sm text-[#666680] leading-relaxed">{section.content}</p>
                        )}

                        {(isAllowed || isDenied) && (
                          <div
                            className="rounded-xl p-4 space-y-3"
                            style={{
                              background: isAllowed
                                ? "rgba(45,203,133,0.04)"
                                : "rgba(229,92,48,0.04)",
                              border: `1px solid ${isAllowed ? "rgba(45,203,133,0.12)" : "rgba(229,92,48,0.12)"}`,
                            }}
                          >
                            {section.items.map((item, j) => (
                              <div key={j} className="flex items-start gap-3">
                                {isAllowed
                                  ? <Check size={13} color="#2DCB85" className="mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                  : <X     size={13} color="#E55C30" className="mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                }
                                <p className="text-sm text-[#666680] leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Contact bottom */}
            <div className="border-t border-[#2e3348] pt-12">
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-[#a0a5b8] mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-heading font-semibold text-white text-lg mb-2">Ada pertanyaan tentang syarat ini?</h2>
                  <p className="text-sm text-[#666680] leading-relaxed mb-4">
                    Kami terbuka untuk pertanyaan dan diskusi tentang syarat penggunaan Urlveil.
                    Hubungi kami dan kami akan merespons dalam 48 jam kerja.
                  </p>
                  <a
                    href="mailto:security@urlveil.id"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2e3348] text-sm text-[#a0a5b8] hover:text-white hover:border-[#F5A623]/30 transition-colors"
                  >
                    <Mail size={15} />
                    security@urlveil.id
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