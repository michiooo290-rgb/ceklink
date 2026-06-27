"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { GraduationCap, ArrowRight, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";

/* ── Quiz Data ─────────────────────────────────── */
const QUESTIONS = [
  {
    q: 'Kamu dapat pesan WhatsApp berisi link: <code style="color:var(--color-accent);font-family:var(--font-mono)">https://bca-konfirmasi-akun.xyz/login</code> — apa yang paling tepat?',
    opts: [
      "Langsung buka, ada HTTPS jadi aman",
      "Cek dulu di Urlveil sebelum membuka",
      "Buka hanya jika pengirimnya kenal",
      "Abaikan karena pasti spam",
    ],
    correct: 1,
    feedback: {
      correct: "Tepat! HTTPS tidak menjamin keamanan. TLD .xyz dan nama domain seperti "bca-konfirmasi-akun" adalah tanda merah besar. Selalu scan dulu di Urlveil.",
      wrong: "HTTPS hanya mengenkripsi koneksi — bukan jaminan situs aman. Domain bca-konfirmasi-akun.xyz jelas phising. Scan dulu sebelum buka.",
    },
  },
  {
    q: "Mana dari link berikut yang paling AMAN?",
    opts: [
      "http://tokopedia-promo.com/flash-sale",
      "https://tokopedia.com/promo",
      "https://t0k0pedia.com/login",
      "bit.ly/tokped-diskon90",
    ],
    correct: 1,
    feedback: {
      correct: "Benar! Domain resmi tokopedia.com dengan HTTPS adalah yang paling aman. HTTP tanpa enkripsi, typosquatting, dan shortlink semua adalah tanda bahaya.",
      wrong: "Hanya tokopedia.com (HTTPS + domain resmi) yang aman. Yang lain: HTTP tanpa enkripsi, typosquatting (t0k0pedia), dan shortlink yang bisa redirect ke mana saja.",
    },
  },
  {
    q: "Kamu sudah terlanjur klik link phising dan mengisi username — tapi belum isi password. Apa yang harus dilakukan PERTAMA?",
    opts: [
      "Isi password, mungkin masih aman",
      "Tutup halaman dan scan link-nya",
      "Ganti password akun tersebut sekarang",
      "Screenshot sebagai bukti dulu",
    ],
    correct: 2,
    feedback: {
      correct: "Tepat! Ganti password sesegera mungkin adalah prioritas utama. Username yang bocor bisa digunakan untuk brute force. Setelah itu aktifkan 2FA dan laporkan link-nya.",
      wrong: "Prioritas utama adalah ganti password sekarang. Phiser sudah punya username-mu dan akan mencoba kombinasi password umum. Jangan tunda.",
    },
  },
];

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
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null); // index picked
  const [done, setDone] = useState(false);

  const q = QUESTIONS[current];
  const answered = picked !== null;

  function pick(idx) {
    if (answered) return;
    setPicked(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setPicked(null);
    }
  }

  function restart() {
    setCurrent(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }

  const pct = Math.round((score / QUESTIONS.length) * 100);

  return (
    <div className="edu-quiz-wrap" aria-label="Quiz deteksi ancaman">
      {/* Header */}
      <div className="edu-quiz-header">
        <div className="edu-quiz-label">
          <span className="edu-quiz-dot" aria-hidden="true" />
          Quiz Deteksi Ancaman
        </div>
        <span className="edu-quiz-prog">
          {done ? "Selesai!" : `Soal ${current + 1} dari ${QUESTIONS.length}`}
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
            <div className="edu-quiz-result-score">{score} / {QUESTIONS.length} benar</div>
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
                {current + 1 < QUESTIONS.length ? "Soal Berikutnya →" : "Lihat Hasil"}
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
            <span className="edu-eyebrow-dot" aria-hidden="true" />
            Pusat Edukasi AI
          </span>
          <h2 className="edu-title">
            Kenali ancaman,<br />
            <span className="edu-title-accent">sebelum terlambat.</span>
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
              Analisis AI · Tren Minggu Ini
            </div>
            <p className="edu-ai-text">
              AI Urlveil mendeteksi{" "}
              <strong>lonjakan 34% phising bertemakan perbankan</strong>{" "}
              dalam 7 hari terakhir. Modus terbaru: domain mirip BCA/BRI dengan TLD{" "}
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
          <p className="edu-cta-note">8 modul · Quiz interaktif · Tips dari pakar keamanan siber</p>
        </motion.div>

      </div>
    </section>
  );
}