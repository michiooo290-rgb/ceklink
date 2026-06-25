"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ShieldCheck, Globe, Monitor, X, Bell, CheckCircle2 } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedBrowser, setSelectedBrowser] = useState("");

  const handleNotify = (browser) => {
    setSelectedBrowser(browser);
    setShowModal(true);
    setSubmitted(false);
    setEmail("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      // In production: send to API
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>
          <motion.div
            className="relative glass-card p-8 sm:p-12 text-center overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated aurora glow background */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 via-transparent to-emerald-500/5"
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(0,255,136,0.05), transparent, rgba(16,185,129,0.05))",
                    "linear-gradient(225deg, rgba(0,255,136,0.05), transparent, rgba(16,185,129,0.05))",
                    "linear-gradient(315deg, rgba(0,255,136,0.05), transparent, rgba(16,185,129,0.05))",
                    "linear-gradient(45deg, rgba(0,255,136,0.05), transparent, rgba(16,185,129,0.05))",
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-4 right-4 w-32 h-32 rounded-full bg-[#00ff88]/5 blur-2xl"
              animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl"
              animate={{ x: [0, -15, 0], y: [0, 15, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-4 flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  >
                    <ShieldCheck size={28} className="text-[#00ff88]" aria-hidden="true" />
                  </motion.div>
                  Lindungi Diri & Keluarga dari Phising
                </h2>
              </motion.div>

              <motion.p
                className="text-[#666680] max-w-xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Dapatkan notifikasi saat browser extension kami tersedia.
                Perlindungan otomatis saat browsing untuk seluruh keluarga.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.button
                  onClick={() => handleNotify("Chrome")}
                  className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe size={18} aria-hidden="true" />
                  <Bell size={14} className="mr-1" />
                  Notify Chrome
                </motion.button>
                <motion.button
                  onClick={() => handleNotify("Firefox")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-[#1a1a2e] text-[#e0e0e0] hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-colors"
                  whileHover={{ scale: 1.05, borderColor: "rgba(0, 255, 136, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Monitor size={18} aria-hidden="true" />
                  <Bell size={14} className="mr-1" />
                  Notify Firefox
                </motion.button>
              </motion.div>

              <motion.p
                className="text-[#555570] text-xs mt-4"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Segera hadir • Kami akan mengirim email saat extension siap
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notify Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="relative w-full max-w-md glass-card p-6 sm:p-8 z-10"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#666680] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>

              {submitted ? (
                <motion.div
                  className="text-center py-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#00ff88]/10 flex items-center justify-center mx-auto mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle2 size={32} className="text-[#00ff88]" />
                  </motion.div>
                  <h3 className="font-heading font-bold text-xl text-white mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="text-[#666680] text-sm">
                    Kami akan mengirim email ke <span className="text-[#00ff88]">{email}</span> saat
                    CekLink Extension untuk {selectedBrowser} tersedia.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                      <Bell size={20} className="text-[#00ff88]" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">
                        Notifikasi Extension
                      </h3>
                      <p className="text-[#666680] text-xs">{selectedBrowser} Extension</p>
                    </div>
                  </div>

                  <p className="text-[#666680] text-sm mb-4">
                    Masukkan email kamu dan kami akan memberitahu saat extension CekLink untuk
                    {selectedBrowser === "Chrome" ? " Google Chrome" : " Mozilla Firefox"} siap digunakan.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="notify-email" className="block text-sm text-[#e0e0e0] mb-2">
                        Alamat Email
                      </label>
                      <input
                        id="notify-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="input-glow w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555570]"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border border-[#1a1a2e] text-[#666680] hover:text-white hover:border-[#00ff88]/30 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn-glow px-4 py-3 rounded-xl text-sm font-semibold"
                      >
                        <Bell size={16} className="inline mr-2" />
                        Notify Me
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
