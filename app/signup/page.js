"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  X,
  Loader2,
  UserPlus,
} from "lucide-react";
import MeshBackground from "../../components/MeshBackground";

/* ── Constants ───────────────────────────────────── */

const PASSWORD_RULES = [
  { key: "length", label: "Minimal 8 karakter", test: (p) => p.length >= 8 },
  { key: "upper", label: "Huruf besar (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "Huruf kecil (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "Angka (0-9)", test: (p) => /\d/.test(p) },
  { key: "special", label: "Simbol (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_LEVELS = [
  { min: 0, label: "", color: "var(--color-border)" },
  { min: 1, label: "Sangat Lemah", color: "var(--color-danger)" },
  { min: 2, label: "Lemah", color: "var(--color-danger-dim)" },
  { min: 3, label: "Sedang", color: "var(--color-accent)" },
  { min: 4, label: "Kuat", color: "var(--color-secondary-dim)" },
  { min: 5, label: "Sangat Kuat", color: "var(--color-secondary)" },
];

/* ── Animations ──────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Helpers ─────────────────────────────────────── */

function calcStrength(password) {
  return PASSWORD_RULES.filter((r) => r.test(password)).length;
}

function getStrengthLevel(score) {
  return STRENGTH_LEVELS.reduce((best, level) => (score >= level.min ? level : best), STRENGTH_LEVELS[0]);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Sub-components ──────────────────────────────── */

function PasswordStrengthBar({ score }) {
  const level = getStrengthLevel(score);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: 1,
              backgroundColor: i < score ? level.color : "var(--color-border)",
            }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{ transformOrigin: "left" }}
          />
        ))}
      </div>
      {score > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium"
          style={{ color: level.color }}
        >
          {level.label}
        </motion.p>
      )}
    </div>
  );
}

function PasswordRules({ password }) {
  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <motion.div
              key={rule.key}
              className="flex items-center gap-2 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: passed
                    ? "oklch(62% 0.14 185 / 15%)"
                    : "oklch(58% 0.22 25 / 10%)",
                }}
              >
                {passed ? (
                  <Check size={10} className="text-[var(--color-secondary)]" />
                ) : (
                  <X size={10} className="text-[var(--color-danger)]" />
                )}
              </span>
              <span className={passed ? "text-[var(--color-secondary)]" : "text-[var(--color-text-dim)]"}>
                {rule.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function PasswordInput({ id, label, value, onChange, onBlur, placeholder, showStrength, showRules }) {
  const [visible, setVisible] = useState(false);
  const score = useMemo(() => calcStrength(value), [value]);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] pointer-events-none"
        />
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="new-password"
          className="input-glow w-full pl-11 pr-12 py-3 rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[var(--color-text-dim)] hover:text-[var(--color-text-secondary)] hover:bg-[oklch(100%_0_0/4%)] transition-colors"
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showStrength && value.length > 0 && <PasswordStrengthBar score={score} />}
      {showRules && <AnimatePresence>{value.length > 0 && <PasswordRules password={value} />}</AnimatePresence>}
    </div>
  );
}

function FormInput({ id, label, type = "text", value, onChange, onBlur, placeholder, icon: Icon, error, success, autoFocus, autoComplete }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] pointer-events-none"
          />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          className={`input-glow w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] ${
            error
              ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]"
              : success
                ? "border-[var(--color-secondary)] focus:border-[var(--color-secondary)]"
                : ""
          }`}
        />
        {success && !error && (
          <Check size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-[var(--color-danger)] flex items-center gap-1"
          >
            <X size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────── */

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── Validation ────────────────────────────────── */

  const validate = useCallback(
    (field, value) => {
      switch (field) {
        case "name":
          if (!value.trim()) return "Nama lengkap wajib diisi";
          if (value.trim().length < 2) return "Nama minimal 2 karakter";
          return "";
        case "email":
          if (!value.trim()) return "Email wajib diisi";
          if (!validateEmail(value)) return "Format email tidak valid";
          return "";
        case "password":
          if (!value) return "Kata sandi wajib diisi";
          if (value.length < 8) return "Kata sandi minimal 8 karakter";
          return "";
        case "confirmPassword":
          if (!value) return "Konfirmasi kata sandi wajib diisi";
          if (value !== form.password) return "Kata sandi tidak cocok";
          return "";
        case "agreeTerms":
          if (!value) return "Kamu harus menyetujui syarat & ketentuan";
          return "";
        default:
          return "";
      }
    },
    [form.password],
  );

  const handleChange = useCallback(
    (field) => (e) => {
      const value = field === "agreeTerms" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
      }
    },
    [touched, validate],
  );

  const handleBlur = useCallback(
    (field) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validate(field, form[field]) }));
    },
    [form, validate],
  );

  const isFormValid = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const emailOk = validateEmail(form.email);
    const passOk = form.password.length >= 8;
    const confirmOk = form.confirmPassword === form.password && form.confirmPassword.length > 0;
    const termsOk = form.agreeTerms;
    return nameOk && emailOk && passOk && confirmOk && termsOk;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Touch all fields
      const allTouched = {};
      const allErrors = {};
      ["name", "email", "password", "confirmPassword", "agreeTerms"].forEach((field) => {
        allTouched[field] = true;
        allErrors[field] = validate(field, form[field]);
      });
      setTouched(allTouched);
      setErrors(allErrors);

      if (Object.values(allErrors).some((err) => err)) return;

      setLoading(true);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1800));
      setLoading(false);
      setSubmitted(true);
    },
    [form, validate],
  );

  /* ── Success State ─────────────────────────────── */

  if (submitted) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center px-4 relative">
          <MeshBackground variant="warm" />
          <motion.div
            className="glass-card p-8 sm:p-10 max-w-md w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "oklch(62% 0.14 185 / 15%)" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <ShieldCheck size={32} className="text-[var(--color-secondary)]" />
            </motion.div>
            <h2 className="font-heading font-bold text-2xl text-[var(--color-text)] mb-3">
              Akun Berhasil Dibuat!
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
              Kami telah mengirim email verifikasi ke{" "}
              <span className="text-[var(--color-accent)] font-mono text-xs">{form.email}</span>.
              Silakan cek inbox atau folder spam kamu.
            </p>
            <a
              href="/login"
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Masuk Sekarang
            </a>
          </motion.div>
        </main>
      </>
    );
  }

  /* ── Signup Form ───────────────────────────────── */

  return (
    <>
      <main className="min-h-screen pt-8 pb-16 relative">
        <MeshBackground variant="warm" />
        <section className="max-w-lg mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" animate="visible">
            {/* Back link */}
            <motion.div variants={fadeUp} custom={0}>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
              >
                <ArrowLeft size={16} />
                Kembali ke Beranda
              </a>
            </motion.div>

            {/* Header */}
            <motion.div variants={fadeUp} custom={1} className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4">
                <UserPlus size={28} className="text-[var(--color-accent)]" />
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-2 text-[var(--color-text)]">
                Buat Akun Baru
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                Daftar gratis untuk mulai melindungi diri dari phising
              </p>
            </motion.div>

            {/* Main Card */}
            <motion.div
              variants={fadeScale}
              className="glass-card p-6 sm:p-8"
            >
              {/* Google Sign Up */}
              <motion.button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[var(--color-border)] bg-[oklch(16%_0.008_250/50%)] hover:bg-[oklch(18%_0.008_250/60%)] hover:border-[var(--color-border-hover)] text-sm font-medium text-[var(--color-text)] transition-all duration-200"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert("Google Sign Up belum tersedia")}
              >
                <GoogleIcon />
                Daftar dengan Google
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[var(--color-border)]" />
                <span className="text-xs text-[var(--color-text-dim)] font-medium tracking-wide uppercase">
                  atau
                </span>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <motion.div variants={fadeUp} custom={3}>
                  <FormInput
                    id="name"
                    label="Nama Lengkap"
                    value={form.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    placeholder="Masukkan nama lengkap"
                    icon={User}
                    error={touched.name && errors.name}
                    success={touched.name && !errors.name && form.name.length > 0}
                    autoFocus
                    autoComplete="name"
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp} custom={4}>
                  <FormInput
                    id="email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="nama@email.com"
                    icon={Mail}
                    error={touched.email && errors.email}
                    success={touched.email && !errors.email && form.email.length > 0}
                    autoComplete="email"
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp} custom={5}>
                  <PasswordInput
                    id="password"
                    label="Kata Sandi"
                    value={form.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Minimal 8 karakter"
                    showStrength
                    showRules
                  />
                  {touched.password && errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-[var(--color-danger)] flex items-center gap-1 mt-2"
                    >
                      <X size={12} />
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={fadeUp} custom={6}>
                  <PasswordInput
                    id="confirmPassword"
                    label="Konfirmasi Kata Sandi"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    placeholder="Ulangi kata sandi"
                  />
                  <AnimatePresence>
                    {touched.confirmPassword && form.confirmPassword.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`text-xs flex items-center gap-1 mt-2 ${
                          form.confirmPassword === form.password
                            ? "text-[var(--color-secondary)]"
                            : "text-[var(--color-danger)]"
                        }`}
                      >
                        {form.confirmPassword === form.password ? (
                          <>
                            <Check size={12} />
                            Kata sandi cocok
                          </>
                        ) : (
                          <>
                            <X size={12} />
                            Kata sandi tidak cocok
                          </>
                        )}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Terms Checkbox */}
                <motion.div variants={fadeUp} custom={7}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={handleChange("agreeTerms")}
                        onBlur={handleBlur("agreeTerms")}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                          form.agreeTerms
                            ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                            : "border-[var(--color-text-dim)] group-hover:border-[var(--color-text-muted)]"
                        }`}
                      >
                        <AnimatePresence>
                          {form.agreeTerms && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                              <Check size={14} className="text-[var(--color-paper)]" strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      Saya setuju dengan{" "}
                      <a
                        href="/syarat"
                        className="text-[var(--color-accent)] hover:text-[var(--color-accent-dim)] underline underline-offset-2 transition-colors"
                      >
                        Syarat & Ketentuan
                      </a>{" "}
                      dan{" "}
                      <a
                        href="/privasi"
                        className="text-[var(--color-accent)] hover:text-[var(--color-accent-dim)] underline underline-offset-2 transition-colors"
                      >
                        Kebijakan Privasi
                      </a>{" "}
                      Urlveil
                    </span>
                  </label>
                  <AnimatePresence>
                    {touched.agreeTerms && errors.agreeTerms && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-[var(--color-danger)] flex items-center gap-1 mt-2 ml-8"
                      >
                        <X size={12} />
                        {errors.agreeTerms}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeUp} custom={8}>
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="btn-glow w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Buat Akun
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>

            {/* Login Link */}
            <motion.div variants={fadeUp} custom={9} className="text-center mt-6">
              <p className="text-sm text-[var(--color-text-muted)]">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="text-[var(--color-accent)] hover:text-[var(--color-accent-dim)] font-semibold transition-colors"
                >
                  Masuk
                </a>
              </p>
            </motion.div>

            {/* Security Note */}
            <motion.div
              variants={fadeUp}
              custom={10}
              className="glass-card p-4 mt-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-[var(--color-secondary)]" />
                <span className="text-xs font-medium text-[var(--color-secondary)]">
                  Privasi Terjaga
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Data kamu dienkripsi dan tidak akan dibagikan ke pihak ketiga.
                Kami hanya menyimpan informasi yang diperlukan untuk layanan.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
