"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft,
  ShieldCheck, AlertCircle, CheckCircle2, Loader2,
  Shield, Zap, Globe,
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
function validatePassword(v) {
  if (!v) return "Password wajib diisi";
  if (v.length < 6) return "Password minimal 6 karakter";
  return null;
}

/* ── Google SVG ─────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Left Panel ─────────────────────────────────── */
function LeftPanel() {
  const features = [
    { icon: Shield, text: "Deteksi phising dengan akurasi 99.2%" },
    { icon: Zap, text: "Hasil scan dalam hitungan detik" },
    { icon: Globe, text: "Database 10.000+ domain berbahaya" },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 relative overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />
      {/* Glow orbs */}
      <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none" style={{ background: "#F5A623", opacity: 0.08, filter: "blur(80px)" }} aria-hidden="true" />
      <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full pointer-events-none" style={{ background: "#2DCB85", opacity: 0.06, filter: "blur(70px)" }} aria-hidden="true" />

      {/* Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span className="font-heading font-bold text-base text-[var(--color-text)]">Urlveil</span>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/5 w-fit mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
          <span className="text-xs font-mono text-[var(--color-secondary)] tracking-wider">AI AKTIF - MEMANTAU ANCAMAN</span>
        </div>

        <h2 className="font-heading font-bold text-3xl text-[var(--color-text)] leading-tight mb-4">
          Lindungi dirimu dari<br />
          <span style={{ color: "var(--color-accent)" }}>phising & penipuan</span><br />
          online.
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-xs">
          AI Urlveil menganalisis URL secara real-time dan memberi tahu kamu sebelum terlambat klik.
        </p>

        {/* Features */}
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

      {/* Scan card */}
      <motion.div
        className="relative z-10 rounded-xl p-4"
        style={{ background: "oklch(14% 0.01 250 / 60%)", border: "1px solid var(--color-border)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]" />
          <span className="text-xs font-mono text-[var(--color-text-muted)] tracking-wide">TERDETEKSI BARU-BARU INI</span>
        </div>
        {[
          { url: "bca-konfirmasi-akun.xyz", tag: "Phising" },
          { url: "tokoped1a-sale.com", tag: "Typosquatting" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">{item.url}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(229,92,48,0.12)", color: "var(--color-danger)", border: "1px solid rgba(229,92,48,0.2)" }}>{item.tag}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [authError, setAuthError] = useState(null);

  /* ── Turnstile (Cloudflare CAPTCHA) ─────────────── */
  const [captchaToken, setCaptchaToken] = useState(null);
  const widgetIdRef = useRef(null);
  const turnstileContainerRef = useRef(null);

  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !turnstileContainerRef.current || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      callback: (token) => setCaptchaToken(token),
      "expired-callback": () => setCaptchaToken(null),
      "error-callback": () => setCaptchaToken(null),
    });
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    const val = field === "email" ? email : password;
    const err = field === "email" ? validateEmail(val) : validatePassword(val);
    setErrors((p) => ({ ...p, [field]: err }));
  }, [email, password]);

  const handleChange = useCallback((field, val) => {
    if (field === "email") setEmail(val); else setPassword(val);
    if (touched[field]) {
      const err = field === "email" ? validateEmail(val) : validatePassword(val);
      setErrors((p) => ({ ...p, [field]: err }));
    }
  }, [touched]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setAuthError(null);
    const ee = validateEmail(email);
    const pe = validatePassword(password);
    setTouched({ email: true, password: true });
    setErrors({ email: ee, password: pe });
    if (ee || pe) return;

    if (!captchaToken) {
      setAuthError("Mohon selesaikan verifikasi CAPTCHA terlebih dahulu");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });
    setIsLoading(false);

    if (error) {
      setAuthError(
        error.message === "Invalid login credentials"
          ? "Email atau password salah"
          : error.message
      );
      // Reset widget karena token Turnstile sekali pakai
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setCaptchaToken(null);
      return;
    }

    setSubmitStatus("success");
    router.push("/");
    router.refresh();
  }, [email, password, supabase, router]);

  const handleGoogleLogin = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, [supabase]);

  function inputClass(field) {
    const base = "w-full pl-10 pr-4 py-3 rounded-xl text-sm font-body transition-all duration-200 outline-none";
    const bg = "bg-[oklch(14%_0.008_250/60%)] border text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]";
    if (errors[field] && touched[field])
      return `${base} ${bg} border-[var(--color-danger)] focus:shadow-[0_0_0_3px_var(--color-danger-glow)]`;
    if (!errors[field] && touched[field] && (field === "email" ? email : password))
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
        {/* Subtle bg */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 70% 30%, rgba(245,166,35,0.03) 0%, transparent 70%)" }} aria-hidden="true" />

        <motion.div
          className="w-full max-w-sm relative z-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {/* Back */}
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
              <ArrowLeft size={15} />
              Kembali ke Beranda
            </a>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUp} custom={1} className="mb-8">
            <h1 className="font-heading font-bold text-2xl text-[var(--color-text)] mb-1.5">
              Selamat datang kembali
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Masuk untuk akses riwayat scan dan laporan AI
            </p>
          </motion.div>

          {/* Google */}
          <motion.div variants={fadeUp} custom={2} className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-[var(--color-text)] transition-all duration-200"
              style={{ border: "1px solid var(--color-border)", background: "oklch(16% 0.008 250 / 40%)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-border-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
            >
              <GoogleIcon />
              Lanjutkan dengan Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} custom={3} className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            <span className="text-xs tracking-widest" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>ATAU DENGAN EMAIL</span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} custom={4} onSubmit={handleSubmit} noValidate>
            {authError && (
              <div
                className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs"
                style={{ background: "rgba(229,92,48,0.1)", border: "1px solid rgba(229,92,48,0.25)", color: "var(--color-danger)" }}
              >
                <AlertCircle size={14} />
                {authError}
              </div>
            )}
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                <input
                  id="email" type="email" autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={inputClass("email")}
                  aria-invalid={!!(errors.email && touched.email)}
                />
                {!errors.email && touched.email && email && (
                  <CheckCircle2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-secondary)" }} />
                )}
              </div>
              <AnimatePresence>
                {errors.email && touched.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }} role="alert">
                    <AlertCircle size={11} />{errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                Kata Sandi
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                <input
                  id="password" type={showPass ? "text" : "password"} autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`${inputClass("password")} pr-11`}
                  aria-invalid={!!(errors.password && touched.password)}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--color-text-dim)" }} aria-label={showPass ? "Sembunyikan" : "Tampilkan"}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && touched.password && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }} role="alert">
                    <AlertCircle size={11} />{errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRemember((v) => !v)}
                  className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{ border: `1px solid ${remember ? "var(--color-accent)" : "var(--color-border)"}`, background: remember ? "var(--color-accent)" : "transparent" }}
                  role="checkbox" aria-checked={remember} tabIndex={0}
                  onKeyDown={(e) => e.key === " " && setRemember((v) => !v)}
                >
                  {remember && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="var(--color-paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm select-none" style={{ color: "var(--color-text-muted)" }}>Ingat saya</span>
              </label>
              <a href="/lupa-password" className="text-sm font-medium transition-colors" style={{ color: "var(--color-accent)" }}>
                Lupa kata sandi?
              </a>
            </div>

            {/* Cloudflare Turnstile CAPTCHA */}
            <div className="mb-5 flex justify-center">
              <div ref={turnstileContainerRef} />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || !captchaToken}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, var(--color-accent), #D4870A)", color: "var(--color-paper)", boxShadow: "0 4px 20px rgba(245,166,35,0.25)" }}
              whileHover={!isLoading ? { y: -1, boxShadow: "0 6px 28px rgba(245,166,35,0.35)" } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? <><Loader2 size={17} className="animate-spin" />Memproses...</> : <><LogIn size={17} />Masuk</>}
            </motion.button>

            {/* Feedback */}
            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 p-3 rounded-xl flex items-center gap-3 text-sm" style={{ background: "rgba(45,203,133,0.06)", border: "1px solid rgba(45,203,133,0.2)", color: "var(--color-secondary)" }} role="status">
                  <CheckCircle2 size={16} />Login berhasil! Mengalihkan...
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Sign up link */}
          <motion.p variants={fadeUp} custom={5} className="text-sm text-center mt-6" style={{ color: "var(--color-text-muted)" }}>
            Belum punya akun?{" "}
            <a href="/signup" className="font-semibold transition-colors" style={{ color: "var(--color-accent)" }}>
              Daftar sekarang
            </a>
          </motion.p>

          {/* Security note */}
          <motion.div variants={fadeUp} custom={6} className="flex items-center justify-center gap-1.5 mt-5">
            <ShieldCheck size={12} style={{ color: "var(--color-text-dim)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
              Koneksi aman · SSL aktif · Data terenkripsi
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Load Cloudflare Turnstile script, lalu render widget-nya */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={renderTurnstile}
      />
    </main>
  );
}