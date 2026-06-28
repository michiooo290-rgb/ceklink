"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, ShieldX, Copy, Share2, Flag,
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp,
  Globe, Lock, Unlock, Microscope, Info,
  Building2, Lightbulb,
} from "lucide-react";
import ReportModal from "./ReportModal";

export default function ResultCard({ result, url }) {
  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTips, setShowTips] = useState(false);

  if (!result) return null;

  const {
    status, statusLabel, score, summary, issues,
    domain, riskLevel, details, domainContext,
  } = result;

  const isSafe = status === "safe";
  const isWarn = status === "warn";
  const isDanger = status === "danger";

  const StatusIcon = isSafe ? ShieldCheck : isWarn ? ShieldAlert : ShieldX;

  const palette = isSafe
    ? { text: "text-[#2DCB85]", bg: "bg-[#2DCB85]/10", border: "border-[#2DCB85]/25", glow: "glow-safe", ring: "#2DCB85" }
    : isWarn
    ? { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10", border: "border-[#F5A623]/25", glow: "glow-warn", ring: "#F5A623" }
    : { text: "text-[#E55C30]", bg: "bg-[#E55C30]/10", border: "border-[#E55C30]/25", glow: "glow-danger", ring: "#E55C30" };

  const issueIcon = { safe: CheckCircle2, warn: AlertTriangle, danger: XCircle };
  const issueColor = {
    safe: { text: "text-[#2DCB85]", bg: "bg-[#2DCB85]/10" },
    warn: { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10" },
    danger: { text: "text-[#E55C30]", bg: "bg-[#E55C30]/10" },
  };

  const handleCopy = async () => {
    const text = `Hasil Cek Link — Urlveil\n\nLink: ${url}\nStatus: ${statusLabel}\nSkor: ${score}/100\nRisiko: ${riskLevel}\n\n${summary}\n\nTemuan:\n${issues.map((i) => `• ${i.label}: ${i.value}`).join("\n")}\n\nCek link lain di: urlveil.id`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(
      `*Hasil Cek Link — Urlveil*\n\nLink: ${url}\nStatus: *${statusLabel}*\nSkor: ${score}/100\n\n${summary}\n\nCek link lain: urlveil.id`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  // Label kontekstual per status
  const verdictHeadline = isSafe
    ? domainContext ? `${domainContext.name} — Resmi & Aman` : "Link Ini Aman"
    : isWarn && score >= 60
    ? "Perlu Diperiksa Lebih Lanjut"
    : isWarn
    ? "Kemungkinan Besar Berbahaya"
    : "Jangan Buka Link Ini";

  const verdictSub = isSafe
    ? domainContext
      ? `${domainContext.category} · Terverifikasi`
      : `Risiko Rendah · Terverifikasi`
    : isWarn && score >= 60
    ? `Risiko Sedang · Hati-hati`
    : isWarn
    ? `Risiko Tinggi · Jangan isi data`
    : `Risiko Sangat Tinggi · Blokir`;

  return (
    <motion.div
      className={`glass-card ${palette.glow} mt-8 overflow-hidden`}
      role="region"
      aria-label="Hasil pemindaian URL"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Scan sweep */}
      <div className="scan-overlay pointer-events-none">
        <motion.div
          className="scan-line"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Status icon */}
            <motion.div
              className={`w-12 h-12 rounded-xl ${palette.bg} flex items-center justify-center flex-shrink-0`}
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <StatusIcon size={24} className={palette.text} />
            </motion.div>

            <div>
              <div className={`font-heading font-bold text-xl leading-tight ${palette.text}`}>
                {verdictHeadline}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs text-[#555570]">{domain}</span>
                <span className="text-[#333350]">·</span>
                <span className={`text-xs font-medium ${palette.text} opacity-80`}>{verdictSub}</span>
              </div>
            </div>
          </div>

          {/* Score ring */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                <motion.circle
                  cx="32" cy="32" r="28" fill="none"
                  stroke={palette.ring}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 176" }}
                  animate={{ strokeDasharray: `${(score / 100) * 176} 176` }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading font-bold text-base text-white leading-none">{score}</span>
                <span className="text-[9px] text-[#555570] mt-0.5">/ 100</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── DOMAIN CONTEXT (hanya untuk domain yang dikenal) ── */}
        {domainContext && (
          <motion.div
            className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 flex gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`w-8 h-8 rounded-lg ${palette.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Building2 size={15} className={palette.text} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-[#e0e0e0]">{domainContext.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${palette.bg} ${palette.text}`}>
                  {domainContext.category}
                </span>
              </div>
              <p className="text-xs text-[#666680] leading-relaxed">{domainContext.desc}</p>
            </div>
          </motion.div>
        )}

        {/* ── SUMMARY ── */}
        {!domainContext && (
          <motion.p
            className="text-sm text-[#a0a5b8] leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {summary}
          </motion.p>
        )}

        {/* ── HASIL PEMERIKSAAN ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="text-[10px] font-mono text-[#444460] uppercase tracking-widest mb-3">
            Hasil Pemeriksaan
          </div>
          <div className="space-y-2">
            {issues.map((issue, i) => {
              const Icon = issueIcon[issue.status];
              const col = issueColor[issue.status];
              return (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.025] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                >
                  <div className={`w-7 h-7 rounded-lg ${col.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon size={14} className={col.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[#d0d0e0]">{issue.label}</span>
                      <span className={`text-xs font-mono ${col.text}`}>{issue.value}</span>
                    </div>
                    <p className="text-xs text-[#555570] mt-0.5 leading-relaxed">{issue.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── TIPS SPESIFIK (jika domain dikenal) ── */}
        {domainContext?.tips?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-[#F5A623]" />
                <span className="text-xs font-semibold text-[#F5A623]">
                  Tips keamanan untuk {domainContext.name}
                </span>
              </div>
              {showTips
                ? <ChevronUp size={14} className="text-[#555570]" />
                : <ChevronDown size={14} className="text-[#555570]" />
              }
            </button>
            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {domainContext.tips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex gap-2.5 text-xs text-[#777790] leading-relaxed"
                      >
                        <span className="text-[#F5A623] font-mono mt-0.5 flex-shrink-0">—</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── REKOMENDASI (hanya untuk warn/danger, atau domain tidak dikenal) ── */}
        {(!isSafe || !domainContext) && (
          <motion.div
            className={`rounded-xl p-4 border ${palette.border} ${palette.bg}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Info size={14} className={palette.text} />
              <span className={`text-xs font-semibold ${palette.text}`}>
                {isSafe ? "Tetap Waspada" : isDanger ? "Apa yang Harus Dilakukan" : "Rekomendasi"}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#777790]">
              {isSafe ? (
                <>
                  <li>— Pastikan selalu cek URL sebelum login atau mengisi data</li>
                  <li>— Aktifkan autentikasi dua faktor (2FA) di akun kamu</li>
                  <li>— Gunakan password manager untuk keamanan ekstra</li>
                </>
              ) : isDanger ? (
                <>
                  <li className="text-[#E55C30] font-medium">— JANGAN klik atau buka link ini</li>
                  <li>— Jangan isi data pribadi, OTP, atau password apapun</li>
                  <li>— Laporkan link ini untuk melindungi orang lain</li>
                  <li>— Jika sudah terlanjur klik, segera ganti password akun terkait</li>
                  <li>— Hubungi bank jika ada informasi finansial yang sudah dimasukkan</li>
                </>
              ) : score >= 60 ? (
                <>
                  <li>— Verifikasi keaslian link ke sumber resmi sebelum lanjut</li>
                  <li>— Jangan isi data pribadi atau login di halaman ini dulu</li>
                  <li>— Laporkan jika kamu curiga ini phishing</li>
                </>
              ) : (
                <>
                  <li className="text-[#F5A623] font-medium">— Kemungkinan besar ini phishing — jangan klik</li>
                  <li>— Jangan masukkan data apapun di halaman ini</li>
                  <li>— Laporkan ke platform asal kamu menerima link ini</li>
                  <li>— Beritahu orang yang mengirimkan link ini bahwa link tersebut berbahaya</li>
                </>
              )}
            </ul>
          </motion.div>
        )}

        {/* ── INFO URL (collapsible) ── */}
        {details?.urlParts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-xs text-[#444460] hover:text-[#666680] transition-colors"
            >
              <Globe size={13} />
              <span>Detail teknis URL</span>
              {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-[#444460] mb-1">Protokol</div>
                      <div className={`font-mono font-medium flex items-center gap-1 ${details.urlParts.protocol === "https" ? "text-[#2DCB85]" : "text-[#E55C30]"}`}>
                        {details.urlParts.protocol === "https"
                          ? <Lock size={11} />
                          : <Unlock size={11} />
                        }
                        {details.urlParts.protocol.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="text-[#444460] mb-1">Domain</div>
                      <div className="font-mono text-[#c0c0d0] break-all">{domain}</div>
                    </div>
                    {details.urlParts.pathname && details.urlParts.pathname !== "/" && (
                      <div className="col-span-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[#444460] mb-1">Path</div>
                        <div className="font-mono text-[#c0c0d0] break-all">{details.urlParts.pathname}</div>
                      </div>
                    )}
                    {details.urlParts.port && (
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[#444460] mb-1">Port</div>
                        <div className="font-mono text-[#F5A623]">{details.urlParts.port}</div>
                      </div>
                    )}
                  </div>

                  {/* Score deductions */}
                  {details?.deductions?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-[10px] font-mono text-[#333350] uppercase tracking-wider mb-2">Pengurangan skor</div>
                      {details.deductions.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.015]">
                          <span className="text-[#666680]">{d.item}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[#E55C30] font-mono">{d.points}</span>
                            <span className="text-[#444460] text-[10px]">{d.reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          className="flex flex-wrap gap-2 pt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <a
            href={`/analisis?url=${encodeURIComponent(url)}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] hover:bg-[#F5A623]/20 transition-colors text-xs font-medium"
          >
            <Microscope size={14} />
            Analisis Mendalam
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/[0.07] text-[#555570] hover:text-[#2DCB85] hover:border-[#2DCB85]/20 transition-colors text-xs"
          >
            <Copy size={14} />
            {copied ? "Tersalin!" : "Salin"}
          </button>
          <button
            onClick={handleShareWA}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2DCB85]/10 border border-[#2DCB85]/20 text-[#2DCB85] hover:bg-[#2DCB85]/20 transition-colors text-xs"
          >
            <Share2 size={14} />
            Share WA
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/[0.07] text-[#555570] hover:text-[#E55C30] hover:border-[#E55C30]/20 transition-colors text-xs ml-auto"
          >
            <Flag size={14} />
            Laporkan
          </button>
        </motion.div>

        {/* Timestamp */}
        <div className="text-[10px] font-mono text-[#333350] text-center pt-1">
          Diperiksa {new Date(result.checkedAt).toLocaleString("id-ID", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </div>
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        url={url}
        domain={domain}
      />
    </motion.div>
  );
}