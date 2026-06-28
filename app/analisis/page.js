"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, ShieldX, ArrowLeft,
  Globe, Lock, Unlock, AlertTriangle, CheckCircle2,
  XCircle, Microscope, Info, ChevronRight,
} from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import { scanURL } from "../../lib/scanner";

function AnalisisContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState(urlParam);

  // Auto scan jika URL dikirim dari ResultCard
  useEffect(() => {
    if (urlParam) {
      setUrl(urlParam);
      runScan(urlParam);
    }
  }, [urlParam]);

  const runScan = async (target) => {
    if (!target.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await scanURL(target.trim());
      setResult(data);
    } catch {
      setError("Gagal menganalisis URL. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runScan(url);
  };

  const issueIcon = { safe: CheckCircle2, warn: AlertTriangle, danger: XCircle };
  const issueColor = {
    safe: { text: "text-[#2DCB85]", bg: "bg-[#2DCB85]/10", border: "border-[#2DCB85]/20" },
    warn: { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10", border: "border-[#F5A623]/20" },
    danger: { text: "text-[#E55C30]", bg: "bg-[#E55C30]/10", border: "border-[#E55C30]/20" },
  };

  const statusPalette = result
    ? result.status === "safe"
      ? { text: "text-[#2DCB85]", bg: "bg-[#2DCB85]/10", glow: "glow-safe", Icon: ShieldCheck }
      : result.status === "warn"
      ? { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10", glow: "glow-warn", Icon: ShieldAlert }
      : { text: "text-[#E55C30]", bg: "bg-[#E55C30]/10", glow: "glow-danger", Icon: ShieldX }
    : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <FloatingHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#444460] font-mono mb-8">
          <a href="/" className="hover:text-[#2DCB85] transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Beranda
          </a>
          <ChevronRight size={12} />
          <span className="text-[#666680]">Analisis Mendalam</span>
        </div>

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
              <Microscope size={20} className="text-[#F5A623]" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-white">Analisis Mendalam</h1>
              <p className="text-xs text-[#555570] font-mono">Pemindaian lengkap seluruh aspek URL</p>
            </div>
          </div>
          <p className="text-sm text-[#666680] leading-relaxed mt-2">
            Analisis mendalam memeriksa setiap komponen URL secara detail — protokol, domain, subdomain, path, query parameter, entropy, dan pola phising — untuk memberikan gambaran lengkap tentang keamanan link.
          </p>
        </motion.div>

        {/* Input form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex gap-3 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Masukkan URL untuk dianalisis..."
            className="input-glow flex-1 px-4 py-3 rounded-xl text-sm font-mono text-[#e0e0e0] placeholder:text-[#444460]"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn-glow px-5 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Microscope size={16} />
            )}
            {loading ? "Menganalisis..." : "Analisis"}
          </button>
        </motion.form>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[#E55C30]/10 border border-[#E55C30]/30 text-[#E55C30] text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && statusPalette && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >

            {/* Status banner */}
            <div className={`glass-card ${statusPalette.glow} p-6`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${statusPalette.bg} flex items-center justify-center`}>
                    <statusPalette.Icon size={24} className={statusPalette.text} />
                  </div>
                  <div>
                    <div className={`font-heading font-bold text-2xl ${statusPalette.text}`}>
                      {result.statusLabel}
                    </div>
                    <div className="text-xs text-[#555570] font-mono mt-0.5">{result.domain}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-heading font-bold text-4xl ${statusPalette.text}`}>{result.score}</div>
                  <div className="text-[10px] text-[#444460] font-mono">/ 100</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#a0a5b8] leading-relaxed">{result.summary}</p>
            </div>

            {/* Temuan */}
            <div className="glass-card p-5 space-y-3">
              <div className="text-[10px] font-mono text-[#444460] uppercase tracking-widest mb-4">
                Temuan Pemeriksaan ({result.issues.length})
              </div>
              {result.issues.map((issue, i) => {
                const Icon = issueIcon[issue.status];
                const col = issueColor[issue.status];
                return (
                  <div
                    key={i}
                    className={`flex gap-3 p-3 rounded-xl border ${col.border} ${col.bg}`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={14} className={col.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-medium text-[#d0d0e0]">{issue.label}</span>
                        <span className={`text-xs font-mono ${col.text}`}>{issue.value}</span>
                      </div>
                      <p className="text-xs text-[#666680] leading-relaxed">{issue.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail teknis */}
            {result.details && (
              <div className="glass-card p-5 space-y-5">
                <div className="text-[10px] font-mono text-[#444460] uppercase tracking-widest">
                  Detail Teknis
                </div>

                {/* URL Parts */}
                {result.details.urlParts && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Komponen URL</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[10px] text-[#444460] mb-1">Protokol</div>
                        <div className={`text-sm font-mono font-medium flex items-center gap-1 ${result.details.urlParts.protocol === "https" ? "text-[#2DCB85]" : "text-[#E55C30]"}`}>
                          {result.details.urlParts.protocol === "https" ? <Lock size={12} /> : <Unlock size={12} />}
                          {result.details.urlParts.protocol?.toUpperCase()}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[10px] text-[#444460] mb-1">Domain</div>
                        <div className="text-sm font-mono text-[#c0c0d0] break-all">{result.domain}</div>
                      </div>
                      {result.details.urlParts.pathname && result.details.urlParts.pathname !== "/" && (
                        <div className="col-span-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-[10px] text-[#444460] mb-1">Path</div>
                          <div className="text-sm font-mono text-[#c0c0d0] break-all">{result.details.urlParts.pathname}</div>
                        </div>
                      )}
                      {result.details.urlParts.search && (
                        <div className="col-span-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-[10px] text-[#444460] mb-1">Query Parameters</div>
                          <div className="text-sm font-mono text-[#c0c0d0] break-all">{result.details.urlParts.search}</div>
                        </div>
                      )}
                      {result.details.urlParts.port && (
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-[10px] text-[#444460] mb-1">Port</div>
                          <div className="text-sm font-mono text-[#F5A623]">{result.details.urlParts.port}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Entropy */}
                {result.details.entropy && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Entropy Domain</div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#c0c0d0]">{result.details.entropy.description}</span>
                        <span className={`text-sm font-mono font-bold ${
                          result.details.entropy.level === "very_high" ? "text-[#E55C30]" :
                          result.details.entropy.level === "high" ? "text-[#F5A623]" : "text-[#2DCB85]"
                        }`}>{result.details.entropy.score}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            result.details.entropy.level === "very_high" ? "bg-[#E55C30]" :
                            result.details.entropy.level === "high" ? "bg-[#F5A623]" : "bg-[#2DCB85]"
                          }`}
                          style={{ width: `${Math.min((result.details.entropy.score / 5) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Homoglyph */}
                {result.details.homoglyphs && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Deteksi Homoglyph</div>
                    <div className={`p-3 rounded-lg border text-sm ${
                      result.details.homoglyphs.found.length > 0
                        ? "bg-[#E55C30]/5 border-[#E55C30]/20 text-[#E55C30]"
                        : "bg-white/[0.02] border-white/[0.04] text-[#2DCB85]"
                    }`}>
                      {result.details.homoglyphs.description}
                      {result.details.homoglyphs.hasPunycode && (
                        <div className="mt-1 text-[#F5A623] text-xs">⚠ Domain menggunakan Punycode (xn--)</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Path analysis */}
                {result.details.pathAnalysis && result.details.pathAnalysis.suspicious.length > 0 && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Analisis Path</div>
                    <div className="p-3 rounded-lg bg-[#E55C30]/5 border border-[#E55C30]/20 text-sm text-[#E55C30]">
                      {result.details.pathAnalysis.description}
                    </div>
                  </div>
                )}

                {/* Query param analysis */}
                {result.details.queryAnalysis && result.details.queryAnalysis.suspicious.length > 0 && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Parameter Mencurigakan</div>
                    <div className="space-y-1">
                      {result.details.queryAnalysis.suspicious.map((q, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F5A623]/5 border border-[#F5A623]/20 text-xs">
                          <span className="font-mono text-[#F5A623]">{q.key}</span>
                          <span className="text-[#444460]">=</span>
                          <span className="font-mono text-[#666680] truncate">{q.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Score deductions */}
                {result.details.deductions?.length > 0 && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Rincian Pengurangan Skor</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#444460] px-2 pb-1 border-b border-white/[0.04]">
                        <span>Item</span>
                        <div className="flex gap-8">
                          <span>Poin</span>
                          <span>Alasan</span>
                        </div>
                      </div>
                      {result.details.deductions.map((d, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 text-xs p-2 rounded-lg bg-white/[0.015] hover:bg-white/[0.03] transition-colors">
                          <span className="text-[#888890]">{d.item}</span>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-[#E55C30] font-mono">{d.points}</span>
                            <span className="text-[#444460] text-[10px] max-w-[120px] text-right">{d.reason}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-sm px-2 pt-2 border-t border-white/[0.04] font-semibold">
                        <span className="text-[#888890]">Skor Akhir</span>
                        <span className={statusPalette.text}>{result.score} / 100</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Redirect hints */}
                {result.details.redirectHints?.found?.length > 0 && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Indikator Redirect</div>
                    <div className="p-3 rounded-lg bg-[#F5A623]/5 border border-[#F5A623]/20 text-sm text-[#F5A623]">
                      {result.details.redirectHints.description}
                    </div>
                  </div>
                )}

                {/* Domain age hints */}
                {result.details.domainAgeHints?.indicators?.length > 0 && (
                  <div>
                    <div className="text-xs text-[#555570] mb-2 font-mono">Indikasi Usia Domain</div>
                    <div className="space-y-1">
                      {result.details.domainAgeHints.indicators.map((ind, i) => (
                        <div key={i} className="flex gap-2 text-xs text-[#777790] p-2 rounded-lg bg-white/[0.02]">
                          <span className="text-[#F5A623]">—</span>
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className="text-[10px] font-mono text-[#333350] text-center">
              Dianalisis {new Date(result.checkedAt).toLocaleString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit", second: "2-digit",
              })}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && !urlParam && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center mx-auto mb-4">
              <Microscope size={28} className="text-[#F5A623]" />
            </div>
            <p className="text-[#555570] text-sm">Masukkan URL di atas untuk memulai analisis mendalam</p>
            <p className="text-[#444460] text-xs mt-2 font-mono">
              Atau cek link dari <a href="/" className="text-[#2DCB85] hover:underline">halaman utama</a> dan klik "Analisis Mendalam"
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function AnalisisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-paper)" }}>
        <div className="w-8 h-8 border-2 border-[#2DCB85]/30 border-t-[#2DCB85] rounded-full animate-spin" />
      </div>
    }>
      <AnalisisContent />
    </Suspense>
  );
}