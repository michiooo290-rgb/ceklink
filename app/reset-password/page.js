"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, Loader2,
  KeyRound, Loader,
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
function validatePassword(v) {
  if (!v) return "Password wajib diisi";
  if (v.length < 6) return "Password minimal 6 karakter";
  return null;
}
function validateConfirm(v, original) {
  if (!v) return "Konfirmasi password wajib diisi";
  if (v !== original) return "Konfirmasi password tidak cocok";
  return null;
}

/* ── Main Component ─────────────────────────────── */
export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  // "checking" | "ready" | "invalid" — status sesi recovery dari link email
  const [sessionStatus, setSessionStatus] = useState("checking");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [done, setDone] = useState(false);

  // Link reset dari email nyampe ke /auth/callback dulu (tukar code jadi
  // sesi "recovery"), baru redirect ke sini. Jadi di sini kita cuma perlu
  // pastikan sesi recovery itu memang ada — kalau nggak ada (mis. orang
  // buka halaman ini langsung tanpa lewat link email), tolak aksesnya.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSessionStatus(data.session ? "ready" : "invalid");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setSessionStatus("ready");
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleBlur = useCallback((field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    if (field === "password") {
      setErrors((p) => ({ ...p, password: validatePassword(password), confirm: confirm ? validateConfirm(confirm, password) : p.confirm }));
    } else {
      setErrors((p) => ({ ...p, confirm: validateConfirm(confirm, password) }));
    }
  }, [password, confirm]);

  const handleChange = useCallback((field, val) => {
    if (field === "password") setPassword(val); else setConfirm(val);
    setTouched((t) => {
      if (!t[field]) return t;
      const nextPassword = field === "password" ? val : password;
      const nextConfirm = field === "confirm" ? val : confirm;
      setErrors((p) => ({
        ...p,
        password: t.password ? validatePassword(nextPassword) : p.password,
        confirm: t.confirm ? validateConfirm(nextConfirm, nextPassword) : p.confirm,
      }));
      return t;
    });
  }, [password, confirm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    const pe = validatePassword(password);
    const ce = validateConfirm(confirm, password);
    setTouched({ password: true, confirm: true });
    setErrors({ password: pe, confirm: ce });
    if (pe || ce) return;

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }, [password, confirm, supabase, router]);

  function inputClass(field) {
    const base = "w-full pl-10 pr-11 py-3 rounded-xl text-sm font-body transition-all duration-200 outline-none";
    const bg = "bg-[oklch(14%_0.008_250/60%)] border text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]";
    if (errors[field] && touched[field])
      return `${base} ${bg} border-[var(--color-danger)] focus:shadow-[0_0_0_3px_var(--color-danger-glow)]`;
    if (!errors[field] && touched[field] && (field === "password" ? password : confirm))
      return `${base} ${bg} border-[var(--color-secondary)] focus:shadow-[0_0_0_3px_var(--color-secondary-glow)]`;
    return `${base} ${bg} border-[var(--color-border)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)]`;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 relative" style={{ background: "var(--color-paper)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(245,166,35,0.04) 0%, transparent 70%)" }} aria-hidden="true" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {sessionStatus === "checking" && (
          <motion.div variants={fadeUp} custom={0} className="flex flex-col items-center text-center py-10">
            <Loader size={24} className="animate-spin mb-4" style={{ color: "var(--color-accent)" }} />
            <p className="text-sm text-[var(--color-text-muted)]">Memverifikasi link reset...</p>
          </motion.div>
        )}

        {sessionStatus === "invalid" && (
          <motion.div variants={fadeUp} custom={0} className="text-center">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 mx-auto"
              style={{ background: "rgba(229,92,48,0.1)", border: "1px solid rgba(229,92,48,0.15)" }}
            >
              <AlertCircle size={20} style={{ color: "var(--color-danger)" }} />
            </div>
            <h1 className="font-heading font-bold text-xl text-[var(--color-text)] mb-2">
              Link tidak valid atau kedaluwarsa
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Minta link reset kata sandi baru, lalu buka email itu di browser yang sama.
            </p>
            <a
              href="/lupa-password"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={{ background: "linear-gradient(135deg, var(--color-accent), #D4870A)", color: "var(--color-paper)" }}
            >
              Kirim Ulang Link Reset
            </a>
          </motion.div>
        )}

        {sessionStatus === "ready" && !done && (
          <>
            <motion.div variants={fadeUp} custom={0} className="mb-8">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.15)" }}
              >
                <KeyRound size={20} style={{ color: "var(--color-accent)" }} />
              </div>
              <h1 className="font-heading font-bold text-2xl text-[var(--color-text)] mb-1.5">
                Buat kata sandi baru
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Pastikan kata sandi baru kamu kuat dan belum pernah dipakai sebelumnya.
              </p>
            </motion.div>

            <motion.form variants={fadeUp} custom={1} onSubmit={handleSubmit} noValidate>
              {authError && (
                <div
                  className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs"
                  style={{ background: "rgba(229,92,48,0.1)", border: "1px solid rgba(229,92,48,0.25)", color: "var(--color-danger)" }}
                >
                  <AlertCircle size={14} />
                  {authError}
                </div>
              )}

              {/* New password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                  <input
                    id="password" type={showPass ? "text" : "password"} autoComplete="new-password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={inputClass("password")}
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

              {/* Confirm password */}
              <div className="mb-6">
                <label htmlFor="confirm" className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-dim)" }} />
                  <input
                    id="confirm" type={showConfirm ? "text" : "password"} autoComplete="new-password"
                    placeholder="Ulangi kata sandi baru"
                    value={confirm}
                    onChange={(e) => handleChange("confirm", e.target.value)}
                    onBlur={() => handleBlur("confirm")}
                    className={inputClass("confirm")}
                    aria-invalid={!!(errors.confirm && touched.confirm)}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--color-text-dim)" }} aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirm && touched.confirm && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }} role="alert">
                      <AlertCircle size={11} />{errors.confirm}
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
                {isLoading ? <><Loader2 size={17} className="animate-spin" />Menyimpan...</> : "Simpan Kata Sandi Baru"}
              </motion.button>
            </motion.form>
          </>
        )}

        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-center">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 mx-auto"
              style={{ background: "rgba(45,203,133,0.1)", border: "1px solid rgba(45,203,133,0.15)" }}
            >
              <CheckCircle2 size={20} style={{ color: "var(--color-secondary)" }} />
            </div>
            <h1 className="font-heading font-bold text-xl text-[var(--color-text)] mb-1.5">
              Kata sandi berhasil diubah
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Mengalihkan ke halaman masuk...
            </p>
          </motion.div>
        )}

        {(sessionStatus === "ready" || done) && (
          <motion.div variants={fadeUp} custom={2} className="flex items-center justify-center gap-1.5 mt-8">
            <ShieldCheck size={12} style={{ color: "var(--color-text-dim)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
              Koneksi aman · SSL aktif · Data terenkripsi
            </span>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
