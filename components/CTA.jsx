"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "../lib/supabase/client";

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!isValidEmail(trimmed)) {
      setError("Format email tidak valid.");
      return;
    }
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("extension_waitlist")
      .insert({ email: trimmed, source: "cta_homepage" });

    setSubmitting(false);

    // Kode 23505 = unique violation (email sudah pernah daftar) —
    // tetap dianggap sukses dari sisi user, nggak perlu bikin bingung.
    if (insertError && insertError.code !== "23505") {
      setError("Gagal mendaftar. Coba lagi sebentar.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <>
      <section className="cta-section" ref={ref}>
        <div className="cta-inner">
          <motion.div
            className="cta-left"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="cta-eyebrow">Segera hadir</span>
            <h2 className="cta-title">
              Extension browser <span className="cta-accent">Urlveil.</span>
            </h2>
            <p className="cta-desc">
              Perlindungan otomatis saat browsing — tanpa harus buka aplikasi dulu.
              Daftarkan email untuk dapat notifikasi pertama.
            </p>
          </motion.div>

          <motion.div
            className="cta-right"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Browser badges */}
            <div className="cta-browsers">
              <div className="browser-badge">
                <span className="browser-dot" style={{ background: "#4285F4" }} />
                Chrome
              </div>
              <div className="browser-badge">
                <span className="browser-dot" style={{ background: "#FF7139" }} />
                Firefox
              </div>
            </div>

            <button
              className="cta-btn"
              onClick={() => setShowModal(true)}
            >
              Beritahu saya saat siap
            </button>

            <p className="cta-note">Gratis • Tidak ada spam</p>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-backdrop" onClick={() => setShowModal(false)} />
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>

              {submitted ? (
                <div className="modal-success">
                  <CheckCircle2 size={32} className="modal-success-icon" />
                  <h3 className="modal-success-title">Terdaftar!</h3>
                  <p className="modal-success-desc">
                    Kami akan hubungi <span style={{ color: "var(--color-secondary)" }}>{email}</span> saat extension siap.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="modal-title">Daftarkan email</h3>
                  <p className="modal-desc">
                    Kami kabari begitu Urlveil Extension untuk Chrome dan Firefox tersedia.
                  </p>
                  <form onSubmit={handleSubmit} className="modal-form">
                    {error && (
                      <p
                        className="modal-error"
                        style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-danger, #E55C30)", fontSize: "0.8rem", marginBottom: "8px" }}
                        role="alert"
                      >
                        <AlertCircle size={13} />
                        {error}
                      </p>
                    )}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      placeholder="nama@email.com"
                      className="modal-input"
                      required
                      autoFocus
                      disabled={submitting}
                    />
                    <div className="modal-actions">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="modal-btn-cancel"
                        disabled={submitting}
                      >
                        Batal
                      </button>
                      <button type="submit" className="modal-btn-submit" disabled={submitting}>
                        {submitting ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Loader2 size={14} className="animate-spin" />
                            Mendaftar...
                          </span>
                        ) : (
                          "Daftar"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}