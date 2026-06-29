"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { GraduationCap, ArrowRight, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";

/* ── Quiz Data ─────────────────────────────────── */
const QUESTION_BANK = [
  {
    q: 'Kamu dapat pesan WhatsApp berisi link: <code style="color:var(--color-accent);font-family:var(--font-mono)">https://bca-konfirmasi-akun.xyz/login</code> — apa yang paling tepat?',
    opts: ["Langsung buka, ada HTTPS jadi aman","Cek dulu di Urlveil sebelum membuka","Buka hanya jika pengirimnya kenal","Abaikan karena pasti spam"],
    correct: 1,
    feedback: {
      correct: "Tepat! HTTPS tidak menjamin keamanan. TLD .xyz dan nama domain seperti bca-konfirmasi-akun adalah tanda merah besar. Selalu scan dulu di Urlveil.",
      wrong: "HTTPS hanya mengenkripsi koneksi — bukan jaminan situs aman. Domain bca-konfirmasi-akun.xyz jelas phising. Scan dulu sebelum buka.",
    },
  },
  {
    q: "Mana dari link berikut yang paling AMAN?",
    opts: ["http://tokopedia-promo.com/flash-sale","https://tokopedia.com/promo","https://t0k0pedia.com/login","bit.ly/tokped-diskon90"],
    correct: 1,
    feedback: {
      correct: "Benar! Domain resmi tokopedia.com dengan HTTPS adalah yang paling aman. HTTP tanpa enkripsi, typosquatting, dan shortlink semua adalah tanda bahaya.",
      wrong: "Hanya tokopedia.com (HTTPS + domain resmi) yang aman. Yang lain: HTTP tanpa enkripsi, typosquatting (t0k0pedia), dan shortlink yang bisa redirect ke mana saja.",
    },
  },
  {
    q: "Kamu sudah terlanjur klik link phising dan mengisi username — tapi belum isi password. Apa yang harus dilakukan PERTAMA?",
    opts: ["Isi password, mungkin masih aman","Tutup halaman dan scan link-nya","Ganti password akun tersebut sekarang","Screenshot sebagai bukti dulu"],
    correct: 2,
    feedback: {
      correct: "Tepat! Ganti password sesegera mungkin adalah prioritas utama. Username yang bocor bisa digunakan untuk brute force. Setelah itu aktifkan 2FA dan laporkan link-nya.",
      wrong: "Prioritas utama adalah ganti password sekarang. Phiser sudah punya username-mu dan akan mencoba kombinasi password umum. Jangan tunda.",
    },
  },
  {
    q: "Temanmu kirim link 'bit.ly/promo-shopee-gratis' di grup. Apa yang kamu lakukan?",
    opts: ["Langsung klik karena dari teman","Scan link shortener dulu di Urlveil","Tanya ke teman apakah aman","Ignore saja"],
    correct: 1,
    feedback: {
      correct: "Betul! Shortlink menyembunyikan URL asli — siapapun pengirimnya, selalu scan dulu. Akun teman bisa saja sudah dibajak.",
      wrong: "Shortlink berbahaya karena menyembunyikan tujuan asli. Akun teman pun bisa dibajak dan dipakai menyebar phising. Scan dulu sebelum klik.",
    },
  },
  {
    q: "Kamu dapat email dari 'no-reply@bri-bank.support' soal verifikasi akun. Tanda bahaya pertama yang harus kamu perhatikan?",
    opts: ["Subjek emailnya mencurigakan","Domain pengirim bukan bri.co.id","Email masuk ke folder spam","Tidak ada logo BRI di email"],
    correct: 1,
    feedback: {
      correct: "Tepat! Domain resmi BRI adalah bri.co.id — bukan bri-bank.support. Penipu sering buat domain mirip untuk menipu. Selalu cek domain pengirim dengan teliti.",
      wrong: "Tanda paling kuat adalah domain pengirim. BRI resmi hanya kirim email dari @bri.co.id. Domain seperti bri-bank.support adalah jelas phising.",
    },
  },
  {
    q: "Situs meminta kamu install 'update keamanan browser' dalam bentuk file .exe. Apa ini?",
    opts: ["Update resmi yang perlu diinstall","Kemungkinan malware — jangan install","Hanya install jika antivirus aman","Tergantung nama filenya"],
    correct: 1,
    feedback: {
      correct: "Benar! Browser tidak pernah meminta install file .exe dari situs web. Ini taktik klasik distribusi malware. Tutup tab tersebut segera.",
      wrong: "Browser resmi (Chrome, Firefox) tidak pernah mendistribusikan update lewat file .exe dari situs. Ini hampir pasti malware.",
    },
  },
  {
    q: "Kamu mau login ke internet banking. Kamu mengetik alamat langsung di browser. URL yang benar untuk BCA adalah?",
    opts: ["https://klikbca.com","https://bca-online.com/login","https://mybca.id","https://bca.login-secure.net"],
    correct: 0,
    feedback: {
      correct: "Tepat! klikbca.com adalah domain resmi BCA. Selalu ketik langsung — jangan klik link dari chat atau email untuk akses internet banking.",
      wrong: "Domain resmi BCA adalah klikbca.com. Yang lain adalah domain palsu yang dibuat mirip. Selalu ketik langsung di browser, jangan dari link.",
    },
  },
  {
    q: "Mana tanda yang paling kuat bahwa sebuah situs adalah phising?",
    opts: ["Desain situs terlihat jelek","Domain berbeda dari brand asli","Tidak ada konten produk","Loading situs sangat lambat"],
    correct: 1,
    feedback: {
      correct: "Tepat! Domain adalah identitas utama situs. Phising selalu pakai domain berbeda — desain bisa ditiru sempurna, tapi domain tidak bisa sama persis.",
      wrong: "Domain adalah bukti paling kuat. Phiser bisa meniru desain sempurna, tapi tidak bisa pakai domain yang sama persis dengan brand asli.",
    },
  },
  {
    q: "Kamu dapat SMS: 'Selamat! Kamu menang iPhone 15. Klik link berikut dalam 10 menit atau hadiah hangus.' Ini adalah teknik apa?",
    opts: ["Penawaran resmi dari operator","Social engineering — urgensi palsu","Iklan yang boleh diabaikan","Phising berbasis email"],
    correct: 1,
    feedback: {
      correct: "Benar! Tenggat waktu palsu adalah teknik social engineering untuk memaksamu bertindak tanpa berpikir. Hadiah nyata tidak pernah hangus dalam 10 menit.",
      wrong: "Ini teknik urgensi palsu — memaksamu klik sebelum sempat berpikir kritis. Tanda kuat penipuan: hadiah tiba-tiba, tenggat ketat, dan link mencurigakan.",
    },
  },
  {
    q: "Apa fungsi 2FA (Two-Factor Authentication) dalam keamanan akun?",
    opts: ["Membuat password lebih panjang","Menambah lapisan verifikasi selain password","Mengenkripsi seluruh akun","Memblokir login dari negara asing"],
    correct: 1,
    feedback: {
      correct: "Tepat! 2FA meminta verifikasi kedua (OTP, authenticator app) sehingga meski password bocor, akun tetap aman. Aktifkan di semua akun penting.",
      wrong: "2FA menambah lapisan kedua — meski password bocor ke phiser, mereka tetap tidak bisa login tanpa kode OTP atau authenticator yang hanya kamu punya.",
    },
  },
  {
    q: 'Link mana yang merupakan typosquatting dari Shopee?',
    opts: ["https://shopee.co.id","https://sh0pee.co.id","https://shopee-promo.com","https://shope.co.id"],
    correct: 1,
    feedback: {
      correct: "Benar! sh0pee — huruf 'o' diganti angka '0'. Typosquatting memanfaatkan salah ketik kecil yang mudah terlewat saat terburu-buru.",
      wrong: "sh0pee.co.id adalah typosquatting — huruf 'o' diganti angka '0'. Selain itu shopee-promo.com dan shope.co.id juga bukan domain resmi Shopee.",
    },
  },
  {
    q: "OTP dari bank kamu tiba-tiba masuk tanpa kamu minta. Apa yang harus dilakukan?",
    opts: ["Masukkan OTP ke situs yang memintanya","Abaikan saja, mungkin salah kirim","Segera hubungi bank dan jangan bagikan OTP","Coba login ke akun untuk cek"],
    correct: 2,
    feedback: {
      correct: "Tepat! OTP yang tidak kamu minta artinya seseorang sedang mencoba masuk ke akunmu. Hubungi bank segera dan jangan pernah bagikan OTP ke siapapun.",
      wrong: "OTP tak terduga = ada yang coba bajak akunmu. Jangan masukkan ke situs manapun dan jangan bagikan ke siapapun — langsung hubungi bank.",
    },
  },
  {
    q: "Kamu klik link dan browser memperingatkan 'Situs ini tidak aman'. Apa yang paling tepat?",
    opts: ["Lanjutkan jika situs terlihat resmi","Klik 'Lanjutkan ke situs (tidak aman)'","Tutup tab dan jangan lanjutkan","Refresh halaman"],
    correct: 2,
    feedback: {
      correct: "Benar! Peringatan browser bukan hiasan — itu deteksi aktif bahwa situs berpotensi berbahaya. Tutup tab dan scan URL-nya dulu.",
      wrong: "Peringatan keamanan browser adalah sistem proteksi aktif. Melanjutkan ke situs yang diperingatkan sangat berisiko — lebih baik tutup dan scan dulu.",
    },
  },
  {
    q: "Mana kebiasaan yang PALING melindungi akunmu dari phising?",
    opts: ["Ganti password setiap hari","Pakai password manager + 2FA","Hanya login dari perangkat sendiri","Tidak pernah buka email asing"],
    correct: 1,
    feedback: {
      correct: "Tepat! Password manager memastikan setiap akun punya password unik dan kuat, sementara 2FA memastikan password bocor pun tidak cukup untuk bajak akun.",
      wrong: "Kombinasi password manager + 2FA adalah perlindungan terkuat. Password unik per situs + verifikasi dua faktor membuat akunmu sangat sulit dibajak.",
    },
  },
  {
    q: "Sebuah situs meminta izin notifikasi browser segera setelah dibuka. Apa risikonya jika kamu izinkan?",
    opts: ["Tidak ada risiko, notifikasi bisa dimatikan","Situs bisa kirim spam dan phising lewat notifikasi","Hanya berlaku selama tab terbuka","Browser bisa diakses situs tersebut"],
    correct: 1,
    feedback: {
      correct: "Tepat! Notifikasi browser yang diizinkan bisa dipakai untuk terus-menerus kirim pesan phising bahkan setelah kamu tutup situsnya. Tolak izin dari situs tak dikenal.",
      wrong: "Izin notifikasi dari situs jahat memungkinkan mereka kirim pesan phising kapan saja — bahkan saat tab sudah ditutup. Selalu tolak notifikasi dari situs tak dikenal.",
    },
  },
  {
    q: "Kamu mau beli dari toko online baru. Mana yang paling penting dicek sebelum transfer?",
    opts: ["Jumlah follower media sosialnya","Rekening tujuan transfer atas nama siapa","Domain toko dan ulasan dari sumber terpercaya","Apakah ada fitur chat"],
    correct: 2,
    feedback: {
      correct: "Benar! Domain resmi + ulasan dari sumber terpercaya (bukan testimoni di situs sendiri) adalah indikator terkuat. Nama rekening pun bisa dimanipulasi.",
      wrong: "Domain resmi dan ulasan dari sumber independen adalah verifikasi terkuat. Follower dan testimoni di situs sendiri mudah dipalsukan.",
    },
  },
  {
    q: "Apa yang dimaksud dengan 'phising spear'?",
    opts: ["Phising massal lewat email blast","Phising tertarget menggunakan info pribadi korban","Phising lewat media sosial","Phising yang pakai domain HTTPS"],
    correct: 1,
    feedback: {
      correct: "Tepat! Spear phising menarget individu spesifik dengan informasi personal (nama, jabatan, rekan kerja) agar pesan terasa lebih meyakinkan dan sulit dikenali.",
      wrong: "Spear phising adalah serangan tertarget — menggunakan data pribadimu untuk membuat pesan yang sangat meyakinkan. Jauh lebih berbahaya dari phising massal.",
    },
  },
  {
    q: "Link yang aman untuk mengakses GoPay adalah?",
    opts: ["https://gopay-topup.com","https://gojek.com/gopay","https://gopay.go.id.verify-now.com","https://g0pay.com"],
    correct: 1,
    feedback: {
      correct: "Benar! GoPay diakses lewat aplikasi atau gojek.com. Domain lain seperti gopay-topup.com, gopay.go.id.verify-now.com, atau g0pay.com semuanya palsu.",
      wrong: "GoPay hanya diakses resmi lewat aplikasi Gojek atau gojek.com. Semua domain lain yang menyebut GoPay adalah phising.",
    },
  },
  {
    q: "Temanmu bilang 'kalau sudah pakai antivirus, tidak perlu hati-hati soal link'. Itu benar atau salah?",
    opts: ["Benar, antivirus proteksi penuh","Salah, antivirus tidak 100% mendeteksi phising baru","Benar jika antivirusnya premium","Tergantung merek antivirus"],
    correct: 1,
    feedback: {
      correct: "Tepat! Antivirus bekerja berdasarkan database ancaman yang diketahui. Phising baru bisa lolos sebelum database diperbarui. Kewaspadaan tetap lini pertama terbaik.",
      wrong: "Antivirus tidak bisa mendeteksi semua phising — terutama yang baru dibuat. Kewaspadaan manusia tetap pertahanan terpenting.",
    },
  },
  {
    q: "Kamu scan link di Urlveil dan hasilnya 'Tidak ditemukan ancaman'. Apakah link pasti 100% aman?",
    opts: ["Ya, pasti aman","Tidak, scanner tidak bisa deteksi semua ancaman baru","Ya, jika skor keamanannya tinggi","Tidak, semua link selalu berbahaya"],
    correct: 1,
    feedback: {
      correct: "Benar! Tidak ada scanner yang 100% sempurna. Phising sangat baru bisa belum masuk database manapun. Tetap waspada walau hasil scan bersih.",
      wrong: "Tidak ada tool yang sempurna. Phising yang baru dibuat belum tentu masuk database manapun. Hasil scan bersih = tidak ada ancaman yang terdeteksi, bukan jaminan mutlak.",
    },
  },
];

// Fungsi shuffle untuk ambil 5 soal acak per session
function shuffleQuestions(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/* ── Threat Categories ─────────────────────────── */
const THREATS = [
  {
    emoji: "🏦",
    name: "Phising Perbankan",
    pct: 43,
    color: "var(--color-danger)",
    colorRaw: "#E55C30",
    details: [
      "Domain mirip: bca-login.xyz, bri-mobile-update.top",
      "Modus: verifikasi akun mendesak via WhatsApp",
      "Target: nasabah BCA, BRI, Mandiri, BNI",
    ],
  },
  {
    emoji: "🛒",
    name: "Phising E-commerce",
    pct: 28,
    color: "var(--color-accent)",
    colorRaw: "#F5A623",
    details: [
      "Typosquatting: tokoped1a, sh0pee, lazad4",
      "Modus: promo flash sale palsu via Telegram",
      "Disebar via grup WhatsApp & SMS blast",
    ],
  },
  {
    emoji: "📱",
    name: "Dompet Digital",
    pct: 18,
    color: "var(--color-secondary)",
    colorRaw: "#2DCB85",
    details: [
      "Target: GoPay, OVO, DANA, ShopeePay",
      "Modus: tarik saldo / verifikasi PIN mendesak",
      "Sering pakai shortlink bit.ly / s.id",
    ],
  },
  {
    emoji: "📦",
    name: "Penipuan Lainnya",
    pct: 11,
    color: "var(--color-text-secondary)",
    colorRaw: "#a0a5b8",
    details: [
      "Lowongan kerja palsu, undian berhadiah bodong",
      "APK berbahaya berkedok aplikasi resmi",
      "Phising media sosial: Instagram, TikTok",
    ],
  },
];

/* ── Quick Tips ────────────────────────────────── */
const TIPS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    bg: "oklch(62% 0.14 185 / 10%)",
    title: "Cek HTTPS",
    desc: "Gembok ≠ aman 100%",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    bg: "oklch(75% 0.17 75 / 10%)",
    title: "Scan Dulu",
    desc: "Sebelum klik apapun",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    bg: "oklch(58% 0.22 25 / 10%)",
    title: "Waspada Mendesak",
    desc: "Jangan panik klik",
  },
];

/* ── Sub-components ────────────────────────────── */
function ThreatCard({ threat, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="edu-threat-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      data-open={open}
      onClick={() => setOpen((v) => !v)}
      role="button"
      aria-expanded={open}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
    >
      <div className="edu-threat-header">
        <div className="edu-threat-icon">{threat.emoji}</div>
        <div className="edu-threat-meta">
          <div className="edu-threat-name">{threat.name}</div>
          <div className="edu-threat-pct">{threat.pct}% dari total laporan</div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={16} color="var(--color-text-dim)" aria-hidden="true" />
        </motion.div>
      </div>
      <div className="edu-threat-bar-wrap">
        <motion.div
          className="edu-threat-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${threat.pct}%` }}
          transition={{ duration: 0.7, delay: index * 0.07 + 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: threat.colorRaw }}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="edu-threat-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {threat.details.map((d, i) => (
              <li key={i} className="edu-threat-detail-item">
                <span className="edu-threat-dot" style={{ background: threat.colorRaw }} aria-hidden="true" />
                {d}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuizBlock() {
  // Inisialisasi dengan 5 soal pertama (deterministik) agar server & client match
  // Shuffle dilakukan di useEffect setelah hydration selesai
  const [questions, setQuestions] = useState(QUESTION_BANK.slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  // Shuffle hanya di client setelah hydration — hindari mismatch server/client
  useEffect(() => {
    setQuestions(shuffleQuestions(QUESTION_BANK, 5));
    setReady(true);
  }, []);

  const q = questions[current];
  const answered = picked !== null;

  function pick(idx) {
    if (answered) return;
    setPicked(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setPicked(null);
    }
  }

  function restart() {
    setQuestions(shuffleQuestions(QUESTION_BANK, 5));
    setCurrent(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }

  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="edu-quiz-wrap" aria-label="Quiz deteksi ancaman">
      {/* Header */}
      <div className="edu-quiz-header">
        <div className="edu-quiz-label">
          <span className="edu-quiz-dot" aria-hidden="true" />
          Quiz Deteksi Ancaman
        </div>
        <span className="edu-quiz-prog">
          {done ? "Selesai!" : `Soal ${current + 1} dari ${questions.length}`}
        </span>
      </div>

      {/* Body */}
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="result"
            className="edu-quiz-result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="edu-quiz-result-emoji" aria-hidden="true">
              {pct === 100 ? "🏆" : pct >= 66 ? "✅" : "⚠️"}
            </div>
            <div className="edu-quiz-result-score">{score} / {questions.length} benar</div>
            <div className="edu-quiz-result-msg">
              {pct === 100
                ? "Sempurna! Instingmu tajam soal ancaman digital."
                : pct >= 66
                ? "Bagus! Tapi masih ada celah yang perlu dipelajari."
                : "Waspada lebih dini — pelajari panduan lengkap di bawah."}
            </div>
            <button className="edu-quiz-restart-btn" onClick={restart}>
              Coba Lagi
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={current}
            className="edu-quiz-body"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <p
              className="edu-quiz-question"
              dangerouslySetInnerHTML={{ __html: q.q }}
            />
            <div className="edu-quiz-options" role="group" aria-label="Pilihan jawaban">
              {q.opts.map((opt, i) => {
                let state = "";
                if (answered) {
                  if (i === q.correct) state = "correct";
                  else if (i === picked) state = "wrong";
                  else state = "dim";
                }
                return (
                  <button
                    key={i}
                    className={`edu-quiz-option ${state}`}
                    onClick={() => pick(i)}
                    disabled={answered}
                    aria-pressed={picked === i}
                  >
                    <span className="edu-quiz-letter" aria-hidden="true">
                      {["A", "B", "C", "D"][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  className={`edu-quiz-feedback ${picked === q.correct ? "correct" : "wrong"}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  {picked === q.correct ? q.feedback.correct : q.feedback.wrong}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!done && (
        <div className="edu-quiz-footer">
          <span className="edu-quiz-score">Skor: {score} benar</span>
          <AnimatePresence>
            {answered && (
              <motion.button
                className="edu-quiz-next-btn"
                onClick={next}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {current + 1 < questions.length ? "Soal Berikutnya →" : "Lihat Hasil"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────────── */
export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="edukasi" className="edu-section" aria-label="Pusat edukasi keamanan" ref={ref}>
      <div className="edu-inner">

        {/* Header */}
        <motion.div
          className="edu-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="edu-eyebrow">
            Belajar keamanan digital
          </span>
          <h2 className="edu-title">
            Kenali ancaman <span className="edu-title-accent">sebelum terlambat.</span>
          </h2>
          <p className="edu-sub">
            Latih instingmu dengan quiz interaktif — AI Urlveil menjelaskan kenapa sebuah link berbahaya.
          </p>
        </motion.div>

        {/* AI Insight Strip */}
        <motion.div
          className="edu-ai-strip"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="edu-ai-avatar" aria-hidden="true">UV</div>
          <div className="edu-ai-content">
          <div className="edu-ai-label">
            <TrendingUp size={11} aria-hidden="true" />
            Tren minggu ini
          </div>
          <p className="edu-ai-text">
            Belakangan ini{" "}
            <strong>phising bertemakan perbankan sedang marak</strong>.{" "}
            Modus terbaru: domain mirip BCA/BRI dengan TLD{" "}
              <code className="edu-ai-code">.xyz</code> dan{" "}
              <code className="edu-ai-code">.top</code>, disertai halaman login palsu
              yang sangat meyakinkan.
            </p>
            <div className="edu-ai-tags" aria-label="Tag ancaman terdeteksi">
              <span className="edu-ai-tag danger">TLD mencurigakan</span>
              <span className="edu-ai-tag danger">Typosquatting</span>
              <span className="edu-ai-tag warn">Shortlink redirect</span>
              <span className="edu-ai-tag safe">SSL palsu terdeteksi</span>
            </div>
          </div>
        </motion.div>

        {/* Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <QuizBlock />
        </motion.div>

        {/* Threat Categories */}
        <motion.div
          className="edu-threats-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="edu-threats-label">Kategori Ancaman Aktif — klik untuk detail</p>
          <div className="edu-threats-grid">
            {THREATS.map((t, i) => (
              <ThreatCard key={t.name} threat={t} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          className="edu-tips-strip"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          aria-label="Tips keamanan cepat"
        >
          {TIPS.map((tip, i) => (
            <div key={i} className="edu-tip-pill">
              <div className="edu-tip-icon" style={{ background: tip.bg }} aria-hidden="true">
                {tip.icon}
              </div>
              <div>
                <div className="edu-tip-title">{tip.title}</div>
                <div className="edu-tip-desc">{tip.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="edu-cta"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a href="/edukasi" className="edu-cta-btn">
            <GraduationCap size={16} aria-hidden="true" />
            Buka Panduan Lengkap
            <ArrowRight size={14} aria-hidden="true" />
          </a>
          <p className="edu-cta-note">8 modul belajar, quiz interaktif, dan tips keamanan praktis.</p>
        </motion.div>

      </div>
    </section>
  );
}