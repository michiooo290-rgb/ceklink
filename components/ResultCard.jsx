"use client";

import { useState } from "react";
import {
  ShieldCheck, ShieldAlert, ShieldX, Copy, Share2, Flag,
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp,
  Globe, Lock, Unlock, Microscope, Info, Building2, Lightbulb,
} from "lucide-react";
import ReportModal from "./ReportModal";

export default function ResultCard({ result, url }) {
  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTips, setShowTips] = useState(false);

  if (!result) return null;

  const { status, statusLabel, score, summary, issues, domain, details, domainContext } = result;

  const isSafe = status === "safe";
  const isWarn = status === "warn";
  const isDanger = status === "danger";

  const StatusIcon = isSafe ? ShieldCheck : isWarn ? ShieldAlert : ShieldX;

  const palette = isSafe
    ? { text: "text-[#2DCB85]", bg: "bg-[#2DCB85]/10", border: "border-[#2DCB85]/25", glow: "glow-safe" }
    : isWarn
    ? { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10", border: "border-[#F5A623]/25", glow: "glow-warn" }
    : { text: "text-[#E55C30]", bg: "bg-[#E55C30]/10", border: "border-[#E55C30]/25", glow: "glow-danger" };

  const issueIcon = { safe: CheckCircle2, warn: AlertTriangle, danger: XCircle };
  const issueColor = {
    safe: { text: "text-[#2DCB85]", bg: "bg-[#2DCB85]/10" },
    warn: { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10" },
    danger: { text: "text-[#E55C30]", bg: "bg-[#E55C30]/10" },
  };

  const handleCopy = async () => {
    const text = `Hasil Cek Link — Urlveil\n\nLink: ${url}\nStatus: ${statusLabel}\n\n${summary}\n\nTemuan:\n${issues.map((i) => `• ${i.label}: ${i.value}`).join("\n")}\n\nCek link lain di: urlveil.id`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(
      `*Hasil Cek Link — Urlveil*\n\nLink: ${url}\nStatus: *${statusLabel}*\n\n${summary}\n\nCek link lain: urlveil.id`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const verdictHeadline = isSafe
    ? domainContext ? `${domainContext.name} — Resmi & Aman` : "Link Ini Aman"
    : isWarn && score >= 60
    ? "Perlu Diperiksa Lebih Lanjut"
    : isWarn
    ? "Kemungkinan Besar Berbahaya"
    : "Jangan Buka Link Ini";

  const verdictSub = isSafe
    ? domainContext ? domainContext.category : "Risiko rendah"
    : isWarn && score >= 60
    ? "Hati-hati, belum pasti aman"
    : isWarn
    ? "Risiko tinggi — jangan isi data"
    : "Risiko sangat tinggi";

  return (
    <div className={`glass-card ${palette.glow} mt-8 overflow-hidden`}>
      <div className="p-6 sm:p-8 space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${palette.bg} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon size={24} className={palette.text} />
            </div>
            <div>
              <div className={`font-display font-bold text-xl leading-tight ${palette.text}`}>
                {verdictHeadline}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#555570]">{domain}</span>
                <span className="text-[#333350]">·</span>
                <span className={`text-xs font-medium ${palette.text} opacity-80`}>{verdictSub}</span>
              </div>
            </div>
          </div>
        </div>

        {domainContext && (
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 flex gap-3">
            <div className={`w-8 h-8 rounded-lg ${palette.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Building2 size={15} className={palette.text} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-[#e0e0e0]">{domainContext.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${palette.bg} ${palette.text}`}>
                  {domainContext.category}
                </span>
              </div>
              <p className="text-xs text-[#666680] leading-relaxed">{domainContext.desc}</p>
            </div>
          </div>
        )}

        {!domainContext && (
          <p className="text-sm text-[#a0a5b8] leading-relaxed">{summary}</p>
        )}

        <div>
          <div className="text-[10px] text-[#444460] uppercase tracking-widest mb-3">
            Hasil Pemeriksaan
          </div>
          <div className="space-y-2">
            {issues.map((issue, i) => {
              const Icon = issueIcon[issue.status];
              const col = issueColor[issue.status];
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.025] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg ${col.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon size={14} className={col.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[#d0d0e0]">{issue.label}</span>
                      <span className={`text-xs ${col.text}`}>{issue.value}</span>
                    </div>
                    <p className="text-xs text-[#555570] mt-0.5 leading-relaxed">{issue.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {domainContext?.tips?.length > 0 && (
          <div>
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-[#F5A623]" />
                <span className="text-xs font-semibold text-[#F5A623]">
                  Tips keamanan untuk {domainContext.name}
                </span>
              </div>
              {showTips ? <ChevronUp size={14} className="text-[#555570]" /> : <ChevronDown size={14} className="text-[#555570]" />}
            </button>
            {showTips && (
              <div className="mt-3 space-y-2">
                {domainContext.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2.5 text-xs text-[#777790] leading-relaxed">
                    <span className="text-[#F5A623] mt-0.5 flex-shrink-0">—</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(!isSafe || !domainContext) && (
          <div className={`rounded-xl p-4 border ${palette.border} ${palette.bg}`}>
            <div className="flex items-center gap-2 mb-2.5">
              <Info size={14} className={palette.text} />
              <span className={`text-xs font-semibold ${palette.text}`}>
                {isSafe ? "Tetap Waspada" : isDanger ? "Apa yang Harus Dilakukan" : "Rekomendasi"}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#777790]">
              {isSafe ? (
                <li>— Tetap waspada saat mengisi data pribadi atau login di link manapun</li>
              ) : isDanger ? (
                <>
                  <li className="text-[#E55C30] font-medium">— JANGAN klik atau buka link ini</li>
                  <li>— Jangan isi data pribadi, OTP, atau password apapun</li>
                  <li>— Sudah terlanjur klik? Segera ganti password akun terkait</li>
                </>
              ) : score >= 60 ? (
                <>
                  <li>— Verifikasi keaslian link ke sumber resmi sebelum lanjut</li>
                  <li>— Jangan isi data pribadi atau login di halaman ini dulu</li>
                </>
              ) : (
                <>
                  <li className="text-[#F5A623] font-medium">— Kemungkinan besar ini phishing — jangan klik</li>
                  <li>— Beritahu orang yang mengirim link ini bahwa link tersebut berbahaya</li>
                </>
              )}
            </ul>
          </div>
        )}

        {details?.urlParts && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-xs text-[#444460] hover:text-[#666680] transition-colors"
            >
              <Globe size={13} />
              <span>Detail teknis URL</span>
              {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showDetails && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[#444460] mb-1">Protokol</div>
                  <div className={`font-medium flex items-center gap-1 ${details.urlParts.protocol === "https" ? "text-[#2DCB85]" : "text-[#E55C30]"}`}>
                    {details.urlParts.protocol === "https" ? <Lock size={11} /> : <Unlock size={11} />}
                    {details.urlParts.protocol.toUpperCase()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[#444460] mb-1">Domain</div>
                  <div className="text-[#c0c0d0] break-all">{domain}</div>
                </div>
                {details.urlParts.pathname && details.urlParts.pathname !== "/" && (
                  <div className="col-span-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[#444460] mb-1">Path</div>
                    <div className="text-[#c0c0d0] break-all">{details.urlParts.pathname}</div>
                  </div>
                )}
                {details.urlParts.port && (
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[#444460] mb-1">Port</div>
                    <div className="text-[#F5A623]">{details.urlParts.port}</div>
                  </div>
                )}

                {details?.deductions?.length > 0 && (
                  <div className="col-span-2 mt-1 space-y-1">
                    {details.deductions.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.015]">
                        <span className="text-[#666680]">{d.item}</span>
                        <span className="text-[#444460] text-[10px]">{d.reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
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
            onClick={() => setShowReport(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/[0.07] text-[#555570] hover:text-[#E55C30] hover:border-[#E55C30]/20 transition-colors text-xs ml-auto"
          >
            <Flag size={14} />
            Laporkan
          </button>
        </div>

        <div className="text-[10px] text-[#333350] text-center pt-1">
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
    </div>
  );
}