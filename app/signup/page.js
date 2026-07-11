"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, User, Mail, Lock, Eye, EyeOff,
  ShieldCheck, Check, X, Loader2, UserPlus,
  Star, TrendingUp, AlertCircle,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

/* ── Password rules ─────────────────────────────── */
const PWD_RULES = [
  { key: "length", label: "Minimal 8 karakter", test: (p) => p.length >= 8 },
  { key: "upper", label: "Huruf besar (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "Huruf kecil (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "Angka (0-9)", test: (p) => /\d/.test(p) },
  { key: "special", label: "Simbol (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH = [
  { min: 0, label: "", color: "var(--color-border)" },
  { min: 1, label: "Sangat Lemah", color: "var(--color-danger)" },
  { min: 2, label: "Lemah", color: "var(--color-danger)" },
  { min: 3, label: "Sedang", color: "var(--color-accent)" },
  { min: 4, label: "Kuat", color: "var(--color-secondary)" },
  { min: 5, label: "Sangat Kuat", color: "var(--color-secondary)" },
];

function getStrength(p) { return PWD_RULES.filter((r) => r.test(p)).length; }
function getLevel(s) { return STRENGTH.reduce((b, l) => (s >= l.min ? l : b), STRENGTH[0]); }

/* ── Animations ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

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
  const testimonials = [
    { name: "Budi S.", role: "Mahasiswa IT", text: "Urlveil menyelamatkan saya dari link phising BCA yang hampir menipu. Sekarang selalu cek dulu sebelum klik!" },
    { name: "Sari W.", role: "Ibu Rumah Tangga", text: "Mudah dipakai, gratis, dan benar-benar membantu. Sudah saya rekomendasikan ke semua keluarga." },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 relative overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(45,203,133,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,203,133,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} aria-hidden="true" />
      <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full pointer-events-none" style={{ background: "#2DCB85", opacity: 0.07, filter: "blur(80px)" }} aria-hidden="true" />
      <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full pointer-events-none" style={{ background: "#F5A623", opacity: 0.05, filter: "blur(70px)" }} aria-hidden="true" />

      {/* Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-secondary)" }} />
          <span className="font-heading font-bold text-base" style={{ color: "var(--color-text)" }}>Urlveil</span>
        </div>
      </div>

      {/* Center */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: ShieldCheck, val: "99.2%", label: "Akurasi deteksi" },
            { icon: TrendingUp, val: "100%", label: "Gratis selamanya" },
          ].map(({ icon: Icon, val, label }, i) => (
            <motion.div
              key={i}
              className="rounded-xl p-3 text-center"
              style={{ background: "oklch(14% 0.01 250 / 50%)", border: "1px solid var(--color-border)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            >
              <Icon size={16} className="mx-auto mb-1.5" style={{ color: "var(--color-secondary)" }} />
              <div className="font-heading font-bold text-lg" style={{ color: "var(--color-secondary)" }}>{val}</div>
              <div className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{label}</div>
            </motion.div>
          ))}
        </div>

        <h2 className="font-heading font-bold text-2xl leading-tight mb-3" style={{ color: "var(--color-text)" }}>
          Bergabung dengan ribuan<br />
          pengguna yang sudah<br />
          <span style={{ color: "var(--color-secondary)" }}>terlindungi.</span>
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--color-text-muted)", maxWidth: "28ch" }}>
          Gratis selamanya. Tidak perlu kartu kredit. Cek link kapanpun dan di manapun.
        </p>

        {/* Testimonials */}
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="rounded-xl p-4"
              style={{ background: "oklch(14% 0.01 250 / 60%)", border: "1px solid var(--color-border)" }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-2" aria-label="Rating 5 bintang">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={11} fill="var(--color-accent)" style={{ color: "var(--color-accent)" }} aria-hidden="true" />
                ))}
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--color-text-secondary)" }}>&ldquo;{t.text}&rdquo;</p>
              <div>
                <div className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>{t.name}</div>
                <div className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Strength Bar ───────────────────────────────── */
function StrengthBar({ score }) {
  const level = getLevel(score);
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full"
            animate={{ backgroundColor: i < score ? level.color : "var(--color-border)" }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      {level.label && (
        <span className="text-xs" style={{ color: level.color, fontFamily: "var(--font-mono)" }}>
          {level.label}
        </span>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const pwdScore = useMemo(() => getStrength(form.password), [form.password]);

  const validate = useCallback((field, val) => {
    if (field === "name") return val.trim().length < 2 ? "Nama minimal 2 karakter" : null;
    if (field === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : "Format email tidak valid";
    if (field === "password") return val.length < 8 ? "Password minimal 8 karakter" : null;
    if (field === "confirm") return val !== form.password ? "Password tidak cocok" : null;
    return null;
  }, [form.password]);

  const handleChange = useCallback((field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (touched[field]) setErrors((p) => ({ ...p, [field]: validate(field, val) }));
  }, [touched, validate]);

  const handleBlur = useCallback((field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors((p) => ({ ...p, [field]: validate(field, form[field]) }));
  }, [form, validate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    const allFields = ["name", "email", "password", "confirm"];
    const newErrors = Object.fromEntries(allFields.map((f) => [f, validate(f, form[f])]));
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean) || !agreed) return;

    if (!captchaToken) {
      setAuthError("Mohon selesaikan verifikasi CAPTCHA terlebih dahulu");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name }, captchaToken },
    });
    setIsLoading(false);

    if (error) {
      setAuthError(
        error.message === "User already registered"
          ? "Email ini sudah terdaftar"
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
    // Supabase default minta verifikasi email dulu sebelum bisa login.
    // Kalau verifikasi email dimatikan di dashboard, ganti baris di bawah
    // jadi router.push("/") karena user sudah otomatis login.
    setTimeout(() => router.push("/login"), 2000);
  }, [form, validate, agreed, supabase, router]);

  const handleGoogleSignup = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, [supabase]);

  function inputCls(field) {
    const base = "w-full pl-10 pr-4 py-3 rounded-xl text-sm font-body transition-all duration-200 outline-none";
    const bg = "bg-[oklch(14%_0.008_250/60%)] border text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]";
    if (errors[field] && touched[field])
      return `${base} ${bg} border-[var(--color-danger)] focus:shadow-[0_0_0_3px_var(--color-danger-glow)]`;
    if (!errors[field] && touched[field] && form[field])
      return `${base} ${bg} border-[var(--color-secondary)] focus:shadow-[0_0_0_3px_var(--color-secondary-glow)]`;
    return `${base} ${bg} border-[var(--color-border)] focus:border-[var(--color-secondary)] focus:shadow-[0_0_0_3px_var(--color-secondary-glow)]`;
  }

  const canSubmit = Object.values(form).every(Boolean) && agreed && !isLoading && !!captchaToken;

  return (
    <main className="min-h-screen flex" style={{ background: "var(--color-paper)" }}>
      {/* Left panel */}
      <div className="w-[480px] flex-shrink-0 relative" style={{ borderRight: "1px solid var(--color-border)", background: "var(--color-paper-2)" }}>
        <LeftPanel />
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(45,203,133,0.03) 0%, transparent 70%)" }} aria-hidden="true" />

        <motion.div
          className="w-full max-w-sm relative z-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {/* Back */}
          <motion.div variants={fadeUp} custom={0} className="mb-6">
            <a href="/" className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--color-text-muted)" }}>
              <ArrowLeft size={15} />Kembali ke Beranda
            </a>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUp} custom={1} className="mb-6">
            <h1 className="font-heading font-bold text-2xl mb-1" style={{ color: "var(--color-text)" }}>Buat akun</h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Gratis, tanpa kartu kredit. Langsung bisa cek link.</p>
          </motion.div>

          {/* Google */}
          <motion.div variants={fadeUp} custom={2} className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ border: "1px solid var(--color-border)", background: "oklch(16% 0.008 250 / 40%)", color: "var(--color-text)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-border-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
            >
              <GoogleIcon />Daftar dengan Google
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
            {/* Name */}
            <div className="mb-3.5">
              <label htmlFor="name" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                <input id="name" type="text" autoComplete="name" placeholder="Nama lengkap"
                  value={form.name} onChange={(e) => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")}
                  className={inputCls("name")} aria-invalid={!!(errors.name && touched.name)} />
              </div>
              <AnimatePresence>
                {errors.name && touched.name && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }} role="alert">
                    <X size={11} />{errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div className="mb-3.5">
              <label htmlFor="email" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                <input id="email" type="email" autoComplete="email" placeholder="nama@email.com"
                  value={form.email} onChange={(e) => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")}
                  className={inputCls("email")} aria-invalid={!!(errors.email && touched.email)} />
                {!errors.email && touched.email && form.email && (
                  <Check size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-secondary)" }} />
                )}
              </div>
              <AnimatePresence>
                {errors.email && touched.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }} role="alert">
                    <X size={11} />{errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="mb-3.5">
              <label htmlFor="password" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>Kata Sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                <input id="password" type={showPass ? "text" : "password"} autoComplete="new-password" placeholder="Minimal 8 karakter"
                  value={form.password} onChange={(e) => handleChange("password", e.target.value)} onBlur={() => handleBlur("password")}
                  className={`${inputCls("password")} pr-11`} aria-invalid={!!(errors.password && touched.password)} />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-dim)" }} aria-label={showPass ? "Sembunyikan" : "Tampilkan"}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && <StrengthBar score={pwdScore} />}
              {/* Rules */}
              {form.password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {PWD_RULES.map((r) => {
                    const ok = r.test(form.password);
                    return (
                      <div key={r.key} className="flex items-center gap-1.5">
                        {ok ? <Check size={10} style={{ color: "var(--color-secondary)", flexShrink: 0 }} /> : <X size={10} style={{ color: "var(--color-danger)", flexShrink: 0 }} />}
                        <span className="text-[10px]" style={{ color: ok ? "var(--color-secondary)" : "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>{r.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="mb-5">
              <label htmlFor="confirm" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>Ulangi Kata Sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                <input id="confirm" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Ulangi kata sandi"
                  value={form.confirm} onChange={(e) => handleChange("confirm", e.target.value)} onBlur={() => handleBlur("confirm")}
                  className={`${inputCls("confirm")} pr-11`} aria-invalid={!!(errors.confirm && touched.confirm)} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-dim)" }} aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirm && touched.confirm && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }} role="alert">
                    <X size={11} />{errors.confirm}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Agree */}
            <div className="flex items-start gap-2.5 mb-5">
              <div
                onClick={() => setAgreed((v) => !v)}
                className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-all duration-200"
                style={{ border: `1px solid ${agreed ? "var(--color-secondary)" : "var(--color-border)"}`, background: agreed ? "var(--color-secondary)" : "transparent" }}
                role="checkbox" aria-checked={agreed} tabIndex={0}
                onKeyDown={(e) => e.key === " " && setAgreed((v) => !v)}
              >
                {agreed && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6l3 3 5-5" stroke="var(--color-paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <p className="text-xs leading-relaxed select-none" style={{ color: "var(--color-text-muted)" }}>
                Saya menyetujui{" "}
                <a href="/syarat" className="font-medium" style={{ color: "var(--color-secondary)" }}>Syarat & Ketentuan</a>
                {" "}dan{" "}
                <a href="/privasi" className="font-medium" style={{ color: "var(--color-secondary)" }}>Kebijakan Privasi</a> Urlveil.
              </p>
            </div>

            {/* Cloudflare Turnstile CAPTCHA */}
            <div className="mb-5 flex justify-center">
              <div ref={turnstileContainerRef} />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, var(--color-secondary), #1a9e62)", color: "var(--color-paper)", boxShadow: "0 4px 20px rgba(45,203,133,0.25)" }}
              whileHover={canSubmit ? { y: -1, boxShadow: "0 6px 28px rgba(45,203,133,0.35)" } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
            >
              {isLoading ? <><Loader2 size={17} className="animate-spin" />Membuat akun...</> : <><UserPlus size={17} />Buat Akun Gratis</>}
            </motion.button>

            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 p-3 rounded-xl flex items-center gap-3 text-sm" style={{ background: "rgba(45,203,133,0.06)", border: "1px solid rgba(45,203,133,0.2)", color: "var(--color-secondary)" }} role="status">
                  <ShieldCheck size={16} />Akun berhasil dibuat! Selamat datang di Urlveil.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          <motion.p variants={fadeUp} custom={5} className="text-sm text-center mt-5" style={{ color: "var(--color-text-muted)" }}>
            Sudah punya akun?{" "}
            <a href="/login" className="font-semibold transition-colors" style={{ color: "var(--color-secondary)" }}>Masuk</a>
          </motion.p>
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