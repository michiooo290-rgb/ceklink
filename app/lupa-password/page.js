"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, Loader2,
  Shield, Zap, Globe, KeyRound,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

/* ── Variants ───────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Validation ─────────────────────────────────── */
function validateEmail(v) {
  if (!v) return "Email wajib diisi";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Format email tidak valid";
  return null;
}

/* ── Left Panel (sama seperti login/signup) ──────── */
function LeftPanel() {
  const features = [
    { icon: Shield, text: "Deteksi phising dengan akurasi 99.2%" },
    { icon: Zap, text: "Hasil scan dalam hitungan detik" },
    { icon: Globe, text: "Database 10.000+ domain berbahaya" },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />
      <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none" style={{ background: "#F5A623", opacity: 0.08, filter: "blur(80px)" }} aria-hidden="true" />
      <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full pointer-events-none" style={{ background: "#2DCB85", opacity: 0.06, filter: "blur(70px)" }} aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span className="font-heading font-bold text-base text-[var(--color-text)]">Urlveil</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/5 w-fit mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
          <span className="text-xs font-mono text-[var(--color-secondary)] tracking-wider">AI AKTIF - MEMANTAU ANCAMAN</span>
        </div>

        <h2 className="font-heading font-bold text-3xl text-[var(--color-text)] leading-tight mb-4">
          Lupa kata sandi?<br />
          <span style={{ color: "var(--color-accent)" }}>Nggak masalah.</span>
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-xs">
          Masukkan email kamu, kami kirim link buat bikin kata sandi baru.
        </p>

        <div className="space-y-3">
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.15)" }}>
                <Icon size={14} style={{ color: "var(--color-accent)" }} />
              </div>
              <span className="text-sm text-[var(--color-text-secondary)]">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export default function LupaPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setError(validateEmail(email));
  }, [email]);

  const handleChange = useCallback((val) => {
    setEmail(val);
    if (touched) setError(validateEmail(val));
  }, [touched]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    const err = validateEmail(email);
    setTouched(true);
    setError(err);
    if (err) return;

    setIsLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setIsLoading(false);

    if (resetError) {
      setAuthError(resetError.message);
      return;
    }

    // Selalu tampilkan pesan sukses walau email nggak terdaftar —
    // supaya nggak bisa dipakai buat cek email mana yang punya akun (email enumeration).
    setSent(true);
  }, [email, supabase]);

  function inputClass() {
    const base = "w-full pl-10 pr-4 py-3 rounded-xl text-sm font-body transition-all duration-200 outline-none";
    const bg = "bg-[oklch(14%_0.008_250/60%)] border text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]";
    if (error && touched)
      return `${base} ${bg} border-[var(--color-danger)] focus:shadow-[0_0_0_3px_var(--color-danger-glow)]`;
    if (!error && touched && email)
      return `${base} ${bg} border-[var(--color-secondary)] focus:shadow-[0_0_0_3px_var(--color-secondary-glow)]`;
    return `${base} ${bg} border-[var(--color-border)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)]`;
  }

  return (
    <main className="min-h-screen flex" style={{ background: "var(--color-paper)" }}>
      {/* Left panel */}
      <div className="w-[480px] flex-shrink-0 relative" style={{ borderRight: "1px solid var(--color-border)", background: "var(--color-paper-2)" }}>
        <LeftPanel />
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 70% 30%, rgba(245,166,35,0.03) 0%, transparent 70%)" }} aria-hidden="true" />

        <motion.div
          className="w-full max-w-sm relative z-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {/* Back */}
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <a href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
              <ArrowLeft size={15} />
              Kembali ke Masuk
            </a>
          </motion.div>

          {!sent ? (
            <>
              {/* Header */}
              <motion.div variants={fadeUp} custom={1} className="mb-8">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.15)" }}
                >
                  <KeyRound size={20} style={{ color: "var(--color-accent)" }} />
                </div>
                <h1 className="font-heading font-bold text-2xl text-[var(--color-text)] mb-1.5">
                  Lupa kata sandi
                </h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Masukkan email akun kamu, kami kirim link buat reset kata sandi.
                </p>
              </motion.div>

              {/* Form */}
              <motion.form variants={fadeUp} custom={2} onSubmit={handleSubmit} noValidate>
                {authError && (
                  <div
                    className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs"
                    style={{ background: "rgba(229,92,48,0.1)", border: "1px solid rgba(229,92,48,0.25)", color: "var(--color-danger)" }}
                  >
                    <AlertCircle size={14} />
                    {authError}
                  </div>
                )}
                <div className="mb-5">
                  <label htmlFor="email" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                    <input
                      id="email" type="email" autoComplete="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      className={inputClass()}
                      aria-invalid={!!(error && touched)}
                    />
                    {!error && touched && email && (
                      <CheckCircle2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-secondary)" }} />
                    )}
                  </div>
                  <AnimatePresence>
                    {error && touched && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }} role="alert">
                        <AlertCircle size={11} />{error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, var(--color-accent), #D4870A)", color: "var(--color-paper)", boxShadow: "0 4px 20px rgba(245,166,35,0.25)" }}
                  whileHover={!isLoading ? { y: -1, boxShadow: "0 6px 28px rgba(245,166,35,0.35)" } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? <><Loader2 size={17} className="animate-spin" />Mengirim...</> : "Kirim Link Reset"}
                </motion.button>
              </motion.form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(45,203,133,0.1)", border: "1px solid rgba(45,203,133,0.15)" }}
              >
                <CheckCircle2 size={20} style={{ color: "var(--color-secondary)" }} />
              </div>
              <h1 className="font-heading font-bold text-2xl text-[var(--color-text)] mb-1.5">
                Cek email kamu
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">
                Kalau <span className="text-[var(--color-text-secondary)] font-medium">{email}</span> terdaftar di Urlveil, kami sudah kirim link buat reset kata sandi ke email itu.
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Link berlaku sebentar — cek juga folder spam kalau belum masuk dalam beberapa menit.
              </p>
            </motion.div>
          )}

          {/* Security note */}
          <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-1.5 mt-8">
            <ShieldCheck size={12} style={{ color: "var(--color-text-dim)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
              Koneksi aman · SSL aktif · Data terenkripsi
            </span>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
