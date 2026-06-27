"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
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
              Extension browser<br />
              <span className="cta-accent">Urlveil.</span>
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
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="modal-input"
                      required
                      autoFocus
                    />
                    <div className="modal-actions">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="modal-btn-cancel"
                      >
                        Batal
                      </button>
                      <button type="submit" className="modal-btn-submit">
                        Daftar
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