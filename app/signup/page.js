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
  Check,
  X,
  Loader2,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

/* ── Constants ───────────────────────────────────── */
const PASSWORD_RULES = [
  { key: "length", label: "Min. 8 karakter", test: (p) => p.length >= 8 },
  { key: "upper",  label: "Huruf besar (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower",  label: "Huruf kecil (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "Angka (0-9)", test: (p) => /\d/.test(p) },
  { key: "symbol", label: "Simbol (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_LEVELS = [
  { min: 0, label: "", color: "var(--color-border)" },
  { min: 1, label: "Sangat lemah", color: "var(--color-danger)" },
  { min: 2, label: "Lemah", color: "var(--color-danger)" },
  { min: 3, label: "Sedang", color: "var(--color-accent)" },
  { min: 4, label: "Kuat", color: "var(--color-secondary-dim)" },
  { min: 5, label: "Sangat kuat", color: "var(--color-secondary)" },
];

/* ── Helpers ─────────────────────────────────────── */
function calcStrength(p) {
  return PASSWORD_RULES.filter((r) => r.test(p)).length;
}
function getLevel(score) {
  return STRENGTH_LEVELS.reduce((best, lv) => (score >= lv.min ? lv : best), STRENGTH_LEVELS[0]);
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Google Icon ─────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Password Strength ───────────────────────────── */
function StrengthBar({ password }) {
  const score = calcStrength(password);
  const level = getLevel(score);
  if (!password) return null;
  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-colors duration-200"
            style={{ background: i < score ? level.color : "var(--color-border)" }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-xs" style={{ color: level.color }}>{level.label}</p>
      )}
    </div>
  );
}

/* ── Password Rules ──────────────────────────────── */
function PasswordRules({ password }) {
  if (!password) return null;
  return (
    <div className="grid grid-cols-2 gap-1 mt-2.5 pt-2.5" style={{ borderTop: "1px solid var(--color-border)" }}>
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <div key={rule.key} className="flex items-center gap-1.5 text-xs">
            {passed
              ? <Check size={11} style={{ color: "var(--color-secondary)", flexShrink: 0 }} />
              : <X size={11} style={{ color: "var(--color-text-dim)", flexShrink: 0 }} />}
            <span style={{ color: passed ? "var(--color-secondary)" : "var(--color-text-dim)" }}>
              {rule.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Text Input ──────────────────────────────────── */
function Field({ id, label, type = "text", value, onChange, onBlur, placeholder, icon: Icon, error, success, autoFocus, autoComplete, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-text-dim)" }} />
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
          className="w-full py-2.5 rounded-lg text-sm outline-none transition-colors"
          style={{
            paddingLeft: Icon ? "2.25rem" : "0.75rem",
            paddingRight: children ? "2.25rem" : "0.75rem",
            background: "var(--color-paper-2)",
            border: `1px solid ${error ? "var(--color-danger)" : success ? "var(--color-secondary)" : "var(--color-border)"}`,
            color: "var(--color-text)",
            fontFamily: "var(--font-body)",
          }}
        />
        {children}
        {success && !error && (
          <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-secondary)" }} />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs mt-1"
            style={{ color: "var(--color-danger)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Password Field ──────────────────────────────── */
function PasswordField({ id, label, value, onChange, onBlur, placeholder, showStrength, showRules }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </label>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--color-text-dim)" }} />
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full pl-9 pr-9 py-2.5 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: "var(--color-paper-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            fontFamily: "var(--font-body)",
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          style={{ color: "var(--color-text-dim)" }}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {showStrength && <StrengthBar password={value} />}
      {showRules && value.length > 0 && <PasswordRules password={value} />}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────── */
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

  const validate = useCallback(
    (field, value) => {
      switch (field) {
        case "name":
          if (!value.trim()) return "Nama wajib diisi";
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
          if (!value) return "Kamu harus menyetujui syarat dan ketentuan";
          return "";
        default:
          return "";
      }
    },
    [form.password]
  );

  const handleChange = useCallback(
    (field) => (e) => {
      const value = field === "agreeTerms" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
      }
    },
    [touched, validate]
  );

  const handleBlur = useCallback(
    (field) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validate(field, form[field]) }));
    },
    [form, validate]
  );

  const isFormValid = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      validateEmail(form.email) &&
      form.password.length >= 8 &&
      form.confirmPassword === form.password &&
      form.confirmPassword.length > 0 &&
      form.agreeTerms
    );
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
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
      await new Promise((r) => setTimeout(r, 1600));
      setLoading(false);
      setSubmitted(true);
    },
    [form, validate]
  );

  /* ── Success ───────────────────────────────────── */
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--color-paper)" }}>
        <motion.div
          className="w-full max-w-sm text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "oklch(62% 0.14 185 / 12%)" }}>
            <CheckCircle2 size={20} style={{ color: "var(--color-secondary)" }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text)", fontFamily: "var(--font-body)" }}>
            Akun dibuat
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            Email verifikasi dikirim ke{" "}
            <span style={{ color: "var(--color-text-secondary)" }}>{form.email}</span>.
            Cek inbox atau folder spam.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
            style={{ background: "var(--color-text)", color: "var(--color-paper)", fontFamily: "var(--font-body)" }}
          >
            Masuk sekarang
          </a>
        </motion.div>
      </main>
    );
  }

  /* ── Form ──────────────────────────────────────── */
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "var(--color-paper)" }}>
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Back */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <ArrowLeft size={14} />
          Kembali
        </a>

        {/* Wordmark */}
        <p className="text-sm font-medium mb-6" style={{ color: "var(--color-text-dim)" }}>Urlveil</p>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--color-text)", fontFamily: "var(--font-body)" }}>
          Buat akun
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Gratis, tanpa kartu kredit. Langsung bisa cek link.
        </p>

        {/* Google */}
        <button
          type="button"
          onClick={() => alert("Google signup belum tersedia")}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-sm font-medium mb-4 transition-colors"
          style={{
            background: "var(--color-paper-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-border-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
        >
          <GoogleIcon />
          Lanjutkan dengan Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>atau dengan email</span>
          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field
            id="name" label="Nama" value={form.name}
            onChange={handleChange("name")} onBlur={handleBlur("name")}
            placeholder="Nama lengkap" icon={User}
            error={touched.name && errors.name}
            success={touched.name && !errors.name && form.name.length > 0}
            autoFocus autoComplete="name"
          />

          <Field
            id="email" label="Email" type="email" value={form.email}
            onChange={handleChange("email")} onBlur={handleBlur("email")}
            placeholder="nama@email.com" icon={Mail}
            error={touched.email && errors.email}
            success={touched.email && !errors.email && form.email.length > 0}
            autoComplete="email"
          />

          <PasswordField
            id="password" label="Kata sandi" value={form.password}
            onChange={handleChange("password")} onBlur={handleBlur("password")}
            placeholder="Minimal 8 karakter"
            showStrength showRules
          />
          {touched.password && errors.password && (
            <p className="text-xs -mt-2" style={{ color: "var(--color-danger)" }}>{errors.password}</p>
          )}

          <div>
            <PasswordField
              id="confirmPassword" label="Konfirmasi kata sandi" value={form.confirmPassword}
              onChange={handleChange("confirmPassword")} onBlur={handleBlur("confirmPassword")}
              placeholder="Ulangi kata sandi"
            />
            <AnimatePresence>
              {touched.confirmPassword && form.confirmPassword.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs mt-1 flex items-center gap-1"
                  style={{
                    color: form.confirmPassword === form.password
                      ? "var(--color-secondary)"
                      : "var(--color-danger)",
                  }}
                >
                  {form.confirmPassword === form.password
                    ? <><Check size={11} /> Kata sandi cocok</>
                    : <><X size={11} /> Kata sandi tidak cocok</>}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={handleChange("agreeTerms")}
              onBlur={handleBlur("agreeTerms")}
              className="sr-only"
            />
            <span
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
              style={{
                border: `1px solid ${form.agreeTerms ? "var(--color-text-secondary)" : "var(--color-border)"}`,
                background: form.agreeTerms ? "var(--color-text-secondary)" : "var(--color-paper-2)",
              }}
            >
              {form.agreeTerms && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
                  <path d="M1 3.5L3.5 6L8 1" stroke="var(--color-paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Saya setuju dengan{" "}
              <a href="/syarat" className="transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}>
                Syarat dan Ketentuan
              </a>{" "}
              dan{" "}
              <a href="/privasi" className="transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}>
                Kebijakan Privasi
              </a>{" "}
              Urlveil.
            </span>
          </label>
          <AnimatePresence>
            {touched.agreeTerms && errors.agreeTerms && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs"
                style={{ color: "var(--color-danger)" }}
              >
                {errors.agreeTerms}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium mt-1 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-text)",
              color: "var(--color-paper)",
              fontFamily: "var(--font-body)",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Membuat akun...
              </>
            ) : (
              <>
                <UserPlus size={15} />
                Buat akun
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs mt-8" style={{ color: "var(--color-text-dim)" }}>
          Sudah punya akun?{" "}
          <a href="/login" className="font-medium transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
            Masuk
          </a>
        </p>
      </motion.div>
    </main>
  );
}