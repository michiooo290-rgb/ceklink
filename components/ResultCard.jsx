"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, ShieldX, Copy, Share2, Flag,
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp,
  Globe, Lock, Unlock, Link, Search, Info, ExternalLink, Microscope,
} from "lucide-react";
import ReportModal from "./ReportModal";
import Tooltip from "./Tooltip";

const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function ResultCard({ result, url }) {
  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const { status, statusLabel, score, summary, issues, domain, riskLevel, details } = result;

  const StatusIcon = status === "safe" ? ShieldCheck : status === "warn" ? ShieldAlert : ShieldX;

  const glowClass = status === "safe" ? "glow-safe" : status === "warn" ? "glow-warn" : "glow-danger";

  const statusColor = status === "safe" ? "text-[#2DCB85]" : status === "warn" ? "text-[#F5A623]" : "text-[#E55C30]";
  const statusBg = status === "safe" ? "bg-[#2DCB85]/10" : status === "warn" ? "bg-[#F5A623]/10" : "bg-[#E55C30]/10";

  const handleCopy = async () => {
    const text = `Hasil Cek Link - Urlveil\n\nLink: ${url}\nStatus: ${statusLabel}\nSkor: ${score}/100\nRisiko: ${riskLevel}\n\n${summary}\n\nTemuan:\n${issues.map((i) => `- ${i.label}: ${i.value}`).join("\n")}\n\nCek link lain di: urlveil.id`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(
      `*Hasil Cek Link - Urlveil*\n\nLink: ${url}\nStatus: *${statusLabel}*\nSkor: ${score}/100\nRisiko: ${riskLevel}\n\n${summary}\n\nCek link lain di: urlveil.id`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const issueStatusColors = {
    safe: { bg: "bg-[#2DCB85]", text: "text-[#2DCB85]", icon: CheckCircle2 },
    warn: { bg: "bg-[#F5A623]", text: "text-[#F5A623]", icon: AlertTriangle },
    danger: { bg: "bg-[#E55C30]", text: "text-[#E55C30]", icon: XCircle },
  };

  return (
    <motion.div
      className={`glass-card ${glowClass} mt-8 overflow-hidden`}
      role="region"
      aria-label="Hasil pemindaian URL"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Scan overlay animation */}
      <div className="scan-overlay">
        <motion.div
          className="scan-line"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      <div className="p-6 sm:p-8">
        {/* Status Header */}
        <motion.div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6" variants={itemVariants}>
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-14 h-14 rounded-xl ${statusBg} flex items-center justify-center`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StatusIcon size={28} className={statusColor} />
            </motion.div>
            <div>
              <motion.div className={`font-heading font-bold text-2xl ${statusColor}`}>
                {statusLabel}
              </motion.div>
              <div className="font-mono text-sm text-[#666680] break-all mt-1">{domain}</div>
              <div className="flex items-center gap-2 mt-2">
                <Tooltip text="Risiko diperkirakan dari kombinasi reputasi domain, umur domain, dan apakah link ini pernah dilaporkan sebagai phising/malware di database ancaman.">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusBg} ${statusColor} font-medium`}>
                    Risiko: {riskLevel}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Score Circle */}
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(26,26,46,0.8)" strokeWidth="5" />
                <motion.circle
                  cx="40" cy="40" r="35" fill="none"
                  stroke={status === "safe" ? "#2DCB85" : status === "warn" ? "#F5A623" : "#E55C30"}
                  strokeWidth="5" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 220" }}
                  animate={{ strokeDasharray: `${(score / 100) * 220} 220` }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Tooltip text="Skor 0-100 dihitung dari beberapa faktor: reputasi domain, ada/tidaknya HTTPS, umur domain, dan riwayat di database ancaman. Semakin tinggi, semakin aman.">
                  <div className="flex flex-col items-center">
                    <motion.span className="font-heading font-bold text-xl text-white">{score}</motion.span>
                    <span className="text-[10px] text-[#666680]">/100</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Summary */}
        <motion.p className="text-[#e0e0e0] text-base mb-6 leading-relaxed" variants={itemVariants}>
          {summary}
        </motion.p>

        {/* Issues — compact chip row instead of stacked identical cards */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h3 className="text-sm font-semibold text-[#8888aa] uppercase tracking-wider mb-3">Hasil Pemeriksaan</h3>
          <div className="flex flex-wrap gap-2">
            {issues.map((issue, i) => {
              const colors = issueStatusColors[issue.status];
              const Icon = colors.icon;
              return (
                <motion.div
                  key={i}
                  className="group relative flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03] cursor-default"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                >
                  <Icon size={15} className={colors.text} />
                  <span className="text-xs text-[#e0e0e0] whitespace-nowrap">{issue.label}</span>
                  {issue.detail && (
                    <div className="absolute left-0 top-full mt-1 w-56 p-2 rounded-lg bg-[#13131f] border border-white/10 text-[10px] text-[#8888aa] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      {issue.detail}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Score Breakdown (if deductions exist) */}
        {details?.deductions?.length > 0 && (
          <motion.div className="mb-6" variants={itemVariants}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#2DCB85] transition-colors w-full"
            >
              <Info size={14} />
              <span>Detail Pengurangan Skor</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {details.deductions.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.02]">
                        <span className="text-[#e0e0e0]">{d.item}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#E55C30] font-mono">{d.points}</span>
                          <span className="text-[#555570]">{d.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* URL Info */}
        {details?.urlParts && (
          <motion.div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]" variants={itemVariants}>
            <h3 className="text-sm font-semibold text-[#8888aa] mb-3 flex items-center gap-2">
              <Globe size={14} />
              Informasi URL
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#555570]">Protokol</span>
                <div className={`font-mono ${details.urlParts.protocol === "https" ? "text-[#2DCB85]" : "text-[#E55C30]"}`}>
                  {details.urlParts.protocol === "https" ? <Lock size={12} className="inline mr-1" /> : <Unlock size={12} className="inline mr-1" />}
                  {details.urlParts.protocol.toUpperCase()}
                </div>
              </div>
              <div>
                <span className="text-[#555570]">Domain</span>
                <div className="font-mono text-[#e0e0e0] break-all">{domain}</div>
              </div>
              {details.urlParts.pathname && details.urlParts.pathname !== "/" && (
                <div className="col-span-2">
                  <span className="text-[#555570]">Path</span>
                  <div className="font-mono text-[#e0e0e0] break-all">{details.urlParts.pathname}</div>
                </div>
              )}
              {details.urlParts.port && (
                <div>
                  <span className="text-[#555570]">Port</span>
                  <div className="font-mono text-[#F5A623]">{details.urlParts.port}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div className="mb-6 p-4 rounded-xl border border-[#2DCB85]/20 bg-[#2DCB85]/5" variants={itemVariants}>
          <h3 className="text-sm font-semibold text-[#2DCB85] mb-2 flex items-center gap-2">
            <ShieldCheck size={14} />
            Rekomendasi
          </h3>
          <ul className="space-y-1 text-xs text-[#8888aa]">
            {status === "safe" ? (
              <>
                <li>• Link ini terlihat aman, tetap waspada saat mengisi data</li>
                <li>• Pastikan selalu cek URL sebelum login</li>
                <li>• Gunakan 2FA untuk keamanan ekstra</li>
              </>
            ) : status === "warn" ? (
              <>
                <li>• Jangan isi data pribadi di halaman ini</li>
                <li>• Verifikasi keaslian link ke sumber resmi</li>
                <li>• Laporkan link ini jika mencurigakan</li>
                <li>• Gunakan browser extension Urlveil untuk proteksi otomatis</li>
              </>
            ) : (
              <>
                <li>• JANGAN KLIK atau buka link ini</li>
                <li>• Jangan isi data apapun di halaman ini</li>
                <li>• Laporkan link ini untuk melindungi orang lain</li>
                <li>• Jika sudah terlanjur klik, segera ganti password</li>
                <li>• Hubungi bank jika data finansial bocor</li>
              </>
            )}
          </ul>
        </motion.div>

        {/* Action Buttons + timestamp inline */}
        <motion.div className="flex flex-wrap items-center justify-between gap-3" variants={itemVariants}>
          <div className="flex flex-wrap gap-3">
          <motion.a
            href={`/analisis?url=${encodeURIComponent(url)}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] hover:bg-[#F5A623]/20 transition-colors text-sm"
            aria-label="Analisis mendalam"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Microscope size={16} />
            Analisis Mendalam
          </motion.a>
          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2e3348] text-[#666680] hover:text-[#2DCB85] hover:border-[#2DCB85]/30 transition-colors text-sm"
            aria-label="Salin hasil"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy size={16} />
            {copied ? "Tersalin!" : "Salin Hasil"}
          </motion.button>
          <motion.button
            onClick={handleShareWA}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2DCB85]/10 border border-[#2DCB85]/20 text-[#2DCB85] hover:bg-[#2DCB85]/20 transition-colors text-sm"
            aria-label="Bagikan ke WhatsApp"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={16} />
            Share WA
          </motion.button>
          <motion.button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2e3348] text-[#666680] hover:text-[#E55C30] hover:border-[#E55C30]/30 transition-colors text-sm"
            aria-label="Laporkan link"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Flag size={16} />
            Laporkan
          </motion.button>
          </div>
          <span className="text-xs text-[#555570] whitespace-nowrap">
            {new Date(result.checkedAt).toLocaleString("id-ID")}
          </span>
        </motion.div>
      </div>

      {/* External Check Panel */}
      {result.externalCheck && (
        <motion.div
          variants={itemVariants}
          className="mt-3 p-4 rounded-xl border border-[#2e3348] bg-white/[0.02]"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-[#555570] mb-3">Verifikasi Eksternal</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Google Safe Browsing */}
            <div className="p-3 rounded-lg bg-[#1a1e2e] border border-[#2e3348]">
              <p className="text-[10px] font-mono text-[#555570] mb-1">Google Safe Browsing</p>
              {result.externalCheck.googleSafeBrowsing?.available ? (
                <p className={`text-xs font-semibold ${result.externalCheck.googleSafeBrowsing.safe ? "text-[#2DCB85]" : "text-[#E55C30]"}`}>
                  {result.externalCheck.googleSafeBrowsing.label}
                </p>
              ) : (
                <p className="text-xs text-[#555570]">{result.externalCheck.googleSafeBrowsing?.reason || "Tidak tersedia"}</p>
              )}
            </div>
            {/* URLScan.io */}
            <div className="p-3 rounded-lg bg-[#1a1e2e] border border-[#2e3348]">
              <p className="text-[10px] font-mono text-[#555570] mb-1">URLScan.io</p>
              {result.externalCheck.urlscan?.available ? (
                result.externalCheck.urlscan.ready ? (
                  <div>
                    <p className={`text-xs font-semibold ${result.externalCheck.urlscan.safe ? "text-[#2DCB85]" : "text-[#E55C30]"}`}>
                      {result.externalCheck.urlscan.label}
                    </p>
                    {result.externalCheck.urlscan.resultUrl && (
                      <a href={result.externalCheck.urlscan.resultUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-[#F5A623] hover:underline mt-0.5 inline-block">
                        Lihat laporan ↗
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#555570]">⏳ Menunggu hasil...</p>
                )
              ) : (
                <p className="text-xs text-[#555570]">{result.externalCheck.urlscan?.reason || "Tidak tersedia"}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        url={url}
        domain={domain}
      />
    </motion.div>
  );
}