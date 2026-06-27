"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import MeshBackground from "../../components/MeshBackground";

/* ── Framer Motion Variants ─────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.15 + i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Validation Helpers ─────────────────────────── */
function validateEmail(email) {
  if (!email) return "Email wajib diisi";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid";
  return null;
}

function validatePassword(password) {
  if (!password) return "Password wajib diisi";
  if (password.length < 6) return "Password minimal 6 karakter";
  return null;
}

/* ── Google Icon (inline SVG) ───────────────────── */
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ── Main Page Component ────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const value = field === "email" ? email : password;
      const error = field === "email" ? validateEmail(value) : validatePassword(value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [email, password]
  );

  const handleChange = useCallback(
    (field, value) => {
      if (field === "email") setEmail(value);
      else setPassword(value);

      if (touched[field]) {
        const error =
          field === "email" ? validateEmail(value) : validatePassword(value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitStatus(null);

      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      setTouched({ email: true, password: true });
      setErrors({ email: emailError, password: passwordError });

      if (emailError || passwordError) return;

      setIsLoading(true);

      // Simulate API call (no backend yet)
      await new Promise((resolve) => setTimeout(resolve, 1800));

      setIsLoading(false);
      setSubmitStatus("success");

      // Reset after showing success
      setTimeout(() => setSubmitStatus(null), 3000);
    },
    [email, password]
  );

  const inputBaseClasses =
    "w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-body transition-all duration-200";

  const inputBgClasses =
    "bg-[oklch(14%_0.008_250/80%)] border text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]";

  function getInputStateClasses(field) {
    if (errors[field] && touched[field]) {
      return "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_3px_var(--color-danger-glow)]";
    }
    if (!errors[field] && touched[field] && (field === "email" ? email : password)) {
      return "border-[var(--color-secondary)] focus:border-[var(--color-secondary)] focus:shadow-[0_0_0_3px_var(--color-secondary-glow)]";
    }
    return "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)]";
  }

  return (
    <>
      <main className="min-h-screen flex items-center justify-center py-16 relative px-4">
        <MeshBackground variant="warm" intensity="subtle" />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {/* Back to Home */}
          <motion.div variants={fadeUp} custom={0} className="mb-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </a>
          </motion.div>

          {/* Glass Card */}
          <div className="glass-card p-8 sm:p-10">
            {/* Header */}
            <motion.div className="text-center mb-8" variants={fadeUp} custom={1}>
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={28} className="text-[var(--color-accent)]" />
              </div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-2">
                Masuk ke <span className="text-[var(--color-accent)]">Urlveil</span>
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Akses fitur lengkap pengecekan keamanan link
              </p>
            </motion.div>

            {/* Google Social Login */}
            <motion.div variants={fadeUp} custom={2}>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--color-border)] bg-[oklch(16%_0.008_250/50%)] text-sm font-medium text-[var(--color-text)] hover:bg-[oklch(18%_0.008_250/60%)] hover:border-[var(--color-border-hover)] transition-all duration-200"
                onClick={() => alert("Login Google belum tersedia")}
                aria-label="Masuk dengan Google"
              >
                <GoogleIcon className="w-5 h-5" />
                Masuk dengan Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[var(--color-border)]" />
                <span className="text-xs text-[var(--color-text-dim)] uppercase tracking-wider">
                  atau
                </span>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
              </div>
            </motion.div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} variants={fadeUp} custom={3} noValidate>
              {/* Email Field */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] pointer-events-none"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`${inputBaseClasses} ${inputBgClasses} ${getInputStateClasses("email")}`}
                    aria-invalid={!!(errors.email && touched.email)}
                    aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                  />
                  {touched.email && !errors.email && email && (
                    <CheckCircle2
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
                    />
                  )}
                  {errors.email && touched.email && (
                    <AlertCircle
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-danger)]"
                    />
                  )}
                </div>
                <AnimatePresence>
                  {errors.email && touched.email && (
                    <motion.p
                      id="email-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-[var(--color-danger)] mt-1.5 flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle size={12} />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] pointer-events-none"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`${inputBaseClasses} pr-11 ${inputBgClasses} ${getInputStateClasses("password")}`}
                    aria-invalid={!!(errors.password && touched.password)}
                    aria-describedby={errors.password && touched.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-[var(--color-text-secondary)] transition-colors p-0.5"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && touched.password && (
                    <motion.p
                      id="password-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-[var(--color-danger)] mt-1.5 flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle size={12} />
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                      aria-label="Ingat saya"
                    />
                    <div className="w-[18px] h-[18px] rounded-[5px] border border-[var(--color-border)] bg-[oklch(14%_0.008_250/80%)] peer-checked:bg-[var(--color-accent)] peer-checked:border-[var(--color-accent)] transition-all duration-200 flex items-center justify-center">
                      {rememberMe && (
                        <svg
                          className="w-3 h-3 text-[var(--color-paper)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors select-none">
                    Ingat saya
                  </span>
                </label>

                <a
                  href="/lupa-password"
                  className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-dim)] transition-colors font-medium"
                >
                  Lupa password?
                </a>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn-glow w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={!isLoading ? { scale: 1.01, y: -1 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Masuk
                  </>
                )}
              </motion.button>

              {/* Submit Status Feedback */}
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-3.5 rounded-xl border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/5 flex items-center gap-3"
                    role="status"
                  >
                    <CheckCircle2 size={18} className="text-[var(--color-secondary)] flex-shrink-0" />
                    <span className="text-sm text-[var(--color-secondary)]">
                      Login berhasil! Mengalihkan...
                    </span>
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-3.5 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 flex items-center gap-3"
                    role="alert"
                  >
                    <AlertCircle size={18} className="text-[var(--color-danger)] flex-shrink-0" />
                    <span className="text-sm text-[var(--color-danger)]">
                      Email atau password salah. Silakan coba lagi.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </div>

          {/* Sign Up Link */}
          <motion.div className="text-center mt-6" variants={fadeUp} custom={4}>
            <p className="text-sm text-[var(--color-text-muted)]">
              Belum punya akun?{" "}
              <a
                href="/signup"
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-dim)] font-semibold transition-colors"
              >
                Daftar
              </a>
            </p>
          </motion.div>

          {/* Trust Badge */}
          <motion.div className="text-center mt-4" variants={fadeUp} custom={5}>
            <p className="text-xs text-[var(--color-text-dim)] flex items-center justify-center gap-1.5">
              <Lock size={12} />
              Data Anda terenkripsi dan aman bersama kami
            </p>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
