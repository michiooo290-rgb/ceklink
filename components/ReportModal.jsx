"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, AlertTriangle, CheckCircle2, Send } from "lucide-react";

const REPORT_REASONS = [
  { id: "phishing", label: "Phishing / Penipuan", icon: AlertTriangle },
  { id: "malware", label: "Malware / Virus", icon: AlertTriangle },
  { id: "spam", label: "Spam / Iklan Menyesatkan", icon: Flag },
  { id: "scam", label: "Scam / Penipuan Hadiah", icon: Flag },
  { id: "fake", label: "Situs Palsu (Fake)", icon: AlertTriangle },
  { id: "other", label: "Lainnya", icon: Flag },
];

export default function ReportModal({ isOpen, onClose, url, domain }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) return;

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production: send to backend
    const report = {
      url,
      domain,
      reason: selectedReason,
      description,
      email,
      timestamp: new Date().toISOString(),
    };

    console.log("Report submitted:", report);

    setSubmitting(false);
    setSubmitted(true);

    // Auto close after success
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    setEmail("");
    setSubmitted(false);
    setSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            className="relative w-full max-w-lg glass-card p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#666680] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <motion.div
                className="text-center py-8"
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
                  Laporan Terkirim!
                </h3>
                <p className="text-[#666680] text-sm mb-4">
                  Terima kasih telah melaporkan link ini. Tim kami akan segera meninjau laporan kamu.
                </p>
                <p className="text-[#555570] text-xs">
                  {email && `Konfirmasi akan dikirim ke ${email}`}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#ff3b3b]/10 flex items-center justify-center">
                    <Flag size={20} className="text-[#ff3b3b]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">
                      Laporkan Link
                    </h3>
                    <p className="text-[#666680] text-xs font-mono break-all">
                      {url}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Reason Selection */}
                  <div>
                    <label className="block text-sm text-[#e0e0e0] mb-3">
                      Alasan Pelaporan <span className="text-[#ff3b3b]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {REPORT_REASONS.map((reason) => {
                        const IconComponent = reason.icon;
                        const isSelected = selectedReason === reason.id;
                        return (
                          <motion.button
                            key={reason.id}
                            type="button"
                            onClick={() => setSelectedReason(reason.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-[#ff3b3b]/10 border border-[#ff3b3b]/40 text-[#ff3b3b]"
                                : "bg-white/[0.03] border border-white/[0.05] text-[#8888aa] hover:border-[#ff3b3b]/20 hover:text-[#ff3b3b]"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <IconComponent size={14} />
                            {reason.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="report-desc" className="block text-sm text-[#e0e0e0] mb-2">
                      Deskripsi Tambahan
                    </label>
                    <textarea
                      id="report-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ceritakan mengapa link ini berbahaya (opsional)"
                      className="input-glow w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555570] min-h-[80px] resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="report-email" className="block text-sm text-[#e0e0e0] mb-2">
                      Email (Opsional)
                    </label>
                    <input
                      id="report-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com untuk update laporan"
                      className="input-glow w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555570]"
                    />
                    <p className="text-[#555570] text-xs mt-1">
                      Kami akan mengirim konfirmasi dan update status laporan
                    </p>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-[#ffaa00]/5 border border-[#ffaa00]/20 rounded-xl p-3">
                    <p className="text-[#ffaa00] text-xs flex items-start gap-2">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>
                        Laporan palsu dapat merugikan pemilik website yang sah.
                        Pastikan link ini benar-benar berbahaya sebelum melaporkan.
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border border-[#1a1a2e] text-[#666680] hover:text-white hover:border-[#00ff88]/30 transition-colors"
                    >
                      Batal
                    </button>
                    <motion.button
                      type="submit"
                      disabled={!selectedReason || submitting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#ff3b3b] text-white hover:bg-[#ff3b3b]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Kirim Laporan
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
