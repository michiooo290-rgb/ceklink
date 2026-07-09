"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, ShieldX, ArrowLeft, Search, Globe, Lock, Unlock,
  Link, AlertTriangle, CheckCircle2, XCircle, Info, Copy, Share2, Flag,
  Shield, Eye, Code, Layers, Hash, Fingerprint, Zap, Target, FileText,
  ChevronDown, ChevronUp, ExternalLink, Smartphone, Calendar, Server,
} from "lucide-react";
import { scanURL } from "../../lib/scanner";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import ReportModal from "../../components/ReportModal";
import MeshBackground from "../../components/MeshBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

const statusColors = {
  safe: { text: "text-[#2DCB85]", bg: "bg-[#2DCB85]/10", border: "border-[#2DCB85]/20", color: "#2DCB85" },
  warn: { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10", border: "border-[#F5A623]/20", color: "#F5A623" },
  danger: { text: "text-[#E55C30]", bg: "bg-[#E55C30]/10", border: "border-[#E55C30]/20", color: "#E55C30" },
};

function getStatusColor(status) {
  return statusColors[status] || statusColors.warn;
}

// ── Domain Intel risk reasons ──────────────────────────────────────
// Mirror logic scoring di app/api/domain-intel/route.js — biar badge
// risiko di UI nggak cuma nunjukin level, tapi juga alasan konkretnya.
function getRiskReasons(domainIntel) {
  const reasons = [];
  const { abuseIpdb, whois, ssl, virusTotal, shodan } = domainIntel;

  if (abuseIpdb?.available && (abuseIpdb.status === "malicious" || abuseIpdb.status === "suspicious")) {
    reasons.push("reputasi IP mencurigakan (AbuseIPDB)");
  }
  if (whois?.available && whois.isNewDomain) {
    reasons.push(`domain baru dibuat (${whois.ageDays} hari)`);
  }
  if (ssl?.available && (ssl.status === "invalid" || ssl.status === "expired")) {
    reasons.push(ssl.status === "expired" ? "sertifikat SSL kedaluwarsa" : "sertifikat SSL tidak valid");
  }
  if (virusTotal?.available && (virusTotal.status === "malicious" || virusTotal.status === "suspicious")) {
    reasons.push("ditandai VirusTotal");
  }
  if (shodan?.available && shodan.status === "vulnerable") {
    reasons.push(`known vulnerability terdeteksi Shodan (${shodan.vulns.length})`);
  }

  return reasons.length > 0 ? reasons : ["sinyal campuran dari beberapa sumber"];
}

// ── Score Circle ────────────────────────────────────────────────────
function ScoreCircle({ score, status }) {
  const sc = getStatusColor(status);
  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(46,51,72,0.8)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="52" fill="none"
          stroke={sc.color} strokeWidth="8" strokeLinecap="round"
          initial={{ strokeDasharray: "0 327" }}
          animate={{ strokeDasharray: `${(score / 95) * 327} 327` }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-heading font-bold text-4xl ${sc.text}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-[#666680]">/95</span>
      </div>
    </div>
  );
}

// ── Check Item ──────────────────────────────────────────────────────
function CheckItem({ label, status, detail }) {
  const sc = getStatusColor(status);
  const Icon = status === "safe" ? CheckCircle2 : status === "warn" ? AlertTriangle : XCircle;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
      <div className={`w-8 h-8 rounded-lg ${sc.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} className={sc.text} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-[#e0e0e0]">{label}</span>
        <p className="text-xs text-[#666680] mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

// ── Section Wrapper ─────────────────────────────────────────────────
function Section({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="glass-card p-6 sm:p-8"
    >
      <h2 className="font-heading font-semibold text-lg text-[#e0e0e0] mb-5 flex items-center gap-2">
        <Icon size={20} className="text-[#F5A623]" />
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

// ── Bar Chart ───────────────────────────────────────────────────────
function BarItem({ label, value, maxValue, color }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#8888aa]">{label}</span>
        <span className="font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((Math.abs(value) / maxValue) * 100, 100)}%` }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

// ── Main Content ────────────────────────────────────────────────────
function AnalisisContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [externalCheck, setExternalCheck] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [urlscanUUID, setUrlscanUUID] = useState(null);
  const [domainIntel, setDomainIntel] = useState(null);
  const [domainIntelLoading, setDomainIntelLoading] = useState(false);
  const [deepScanLocked, setDeepScanLocked] = useState(null); // { message, requireLogin }

  useEffect(() => {
    if (!urlParam) {
      setError("URL tidak ditemukan. Silakan masukkan URL terlebih dahulu.");
      setLoading(false);
      return;
    }

    const runScan = async () => {
      try {
        let normalizedUrl = urlParam.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
          normalizedUrl = "https://" + normalizedUrl;
        }
        const data = await scanURL(normalizedUrl);
        setResult(data);

        // External API check + Domain Intelligence — jalan paralel, non-blocking
        setExternalLoading(true);
        setDomainIntelLoading(true);

        const scanExternal = async () => {
          try {
            const extRes = await fetch("/api/scan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: normalizedUrl }),
            });
            const extData = await extRes.json();
            if (extRes.status === 429 && extData.quotaExceeded) {
              setDeepScanLocked((prev) =>
                prev || { message: extData.error, requireLogin: extData.requireLogin }
              );
              return;
            }
            setExternalCheck(extData);
            if (extData.urlscan?.uuid) {
              setUrlscanUUID(extData.urlscan.uuid);
            }
          } catch {
            // External check gagal — client-side tetap tampil
          } finally {
            setExternalLoading(false);
          }
        };

        const scanDomainIntel = async () => {
          try {
            const intelRes = await fetch("/api/domain-intel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: normalizedUrl }),
            });
            const intelData = await intelRes.json();
            if (intelRes.status === 429 && intelData.quotaExceeded) {
              setDeepScanLocked((prev) =>
                prev || { message: intelData.error, requireLogin: intelData.requireLogin }
              );
              return;
            }
            setDomainIntel(intelData);
          } catch {
            // Domain intel gagal — bagian lain tetap tampil
          } finally {
            setDomainIntelLoading(false);
          }
        };

        await Promise.allSettled([scanExternal(), scanDomainIntel()]);
      } catch (err) {
        console.error("Scan error:", err);
        setError("Terjadi kesalahan saat menganalisis URL. Pastikan URL valid.");
      } finally {
        setLoading(false);
      }
    };
    runScan();
  }, [urlParam]);

  // Poll URLScan result setiap 5 detik sampai siap
  useEffect(() => {
    if (!urlscanUUID) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid: urlscanUUID }),
        });
        const data = await res.json();
        if (data.ready) {
          setExternalCheck((prev) => ({ ...prev, urlscan: { ...prev?.urlscan, ...data } }));
          clearInterval(interval);
          setUrlscanUUID(null);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [urlscanUUID]);

  const handleCopy = async () => {
    if (!result) return;
    const text = `Analisis Mendalam - Urlveil\n\nLink: ${result.url}\nStatus: ${result.statusLabel}\nSkor: ${result.score}/95\nDomain: ${result.domain}\n\n${result.summary}\n\nCatatan: Skor bersifat indikatif, bukan jaminan aman.\nCek analisis lengkap di: urlveil.id/analisis?url=${encodeURIComponent(result.url)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#2e3348]" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F5A623] animate-spin" />
          </div>
          <p className="text-[#666680] text-sm">Menganalisis link secara mendalam...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle size={48} className="text-[#E55C30] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-white mb-2">Gagal Menganalisis</h2>
          <p className="text-[#666680] text-sm mb-6">{error || "URL tidak valid."}</p>
          <a href="/" className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  const { status, statusLabel, score, summary, issues, domain, riskLevel, details } = result;
  const sc = getStatusColor(status);
  const StatusIcon = status === "safe" ? ShieldCheck : status === "warn" ? ShieldAlert : ShieldX;

  const maxDeduction = details?.deductions?.length > 0
    ? Math.max(...details.deductions.map((d) => Math.abs(d.points)))
    : 10;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <a href="/" className="inline-flex items-center gap-2 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-6">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </a>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="mb-8">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-2 flex items-center gap-3">
          <Search size={28} className="text-[#F5A623]" />
          Analisis Mendalam
        </h1>
        <p className="text-[#666680] font-mono text-sm break-all">{result.url}</p>
      </motion.div>

      <div className="space-y-6">

        {/* ── Kuota Analisis Mendalam habis ───────────────────────── */}
        {deepScanLocked && (
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
            className="glass-card p-5 border border-[#F5A623]/30 bg-[#F5A623]/[0.03]">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5A623]/10 flex items-center justify-center shrink-0">
                <Lock size={16} className="text-[#F5A623]" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading font-semibold text-sm text-[#e0e0e0] mb-1">
                  Verifikasi Eksternal &amp; Domain Intelligence Terkunci
                </h2>
                <p className="text-xs text-[#8888aa] mb-3">{deepScanLocked.message}</p>
                {deepScanLocked.requireLogin && (
                  <div className="flex flex-wrap gap-2">
                    <a href="/signup" className="btn-glow inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs">
                      Daftar Gratis
                    </a>
                    <a href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs border border-[#2e3348] text-[#8888aa] hover:text-[#e0e0e0] transition-colors">
                      Login
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 0. External Check (GSB + URLScan) ───────────────────── */}
        {!deepScanLocked && (externalLoading || externalCheck) && (
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
            className="glass-card p-5 border border-[#2e3348]">
            <h2 className="font-heading font-semibold text-sm text-[#8888aa] mb-3 flex items-center gap-2">
              <Zap size={16} className="text-[#F5A623]" />
              Verifikasi Eksternal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Google Safe Browsing */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-sm bg-white/10 flex items-center justify-center text-[10px]">G</div>
                  <span className="text-xs font-medium text-[#e0e0e0]">Google Safe Browsing</span>
                </div>
                {externalLoading && !externalCheck?.googleSafeBrowsing ? (
                  <p className="text-xs text-[#555570]">Memeriksa...</p>
                ) : externalCheck?.googleSafeBrowsing?.available ? (
                  externalCheck.googleSafeBrowsing.safe ? (
                    <p className="text-xs font-medium text-[#8888aa]">Tidak ditemukan di Google Safe Browsing saat diperiksa</p>
                  ) : (
                    <p className="text-xs font-medium text-[#E55C30]">
                      {externalCheck.googleSafeBrowsing.label || "Ancaman terdeteksi oleh Google"}
                    </p>
                  )
                ) : (
                  <p className="text-xs text-[#555570]">⚠️ {externalCheck?.googleSafeBrowsing?.reason || "Tidak tersedia"}</p>
                )}
              </div>
              {/* URLScan.io */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-sm bg-white/10 flex items-center justify-center text-[10px]">U</div>
                  <span className="text-xs font-medium text-[#e0e0e0]">URLScan.io</span>
                </div>
                {externalLoading && !externalCheck?.urlscan ? (
                  <p className="text-xs text-[#555570]">Mengirim scan...</p>
                ) : externalCheck?.urlscan?.available ? (
                  externalCheck.urlscan.ready ? (
                    <div>
                      <p className={`text-xs font-medium ${externalCheck.urlscan.safe ? "text-[#8888aa]" : "text-[#E55C30]"}`}>
                        {externalCheck.urlscan.safe
                          ? "URLScan.io tidak menandai malicious saat hasil ini dibuat"
                          : externalCheck.urlscan.label || "Berbahaya menurut URLScan.io"}
                      </p>
                      {externalCheck.urlscan.resultUrl && (
                        <a href={externalCheck.urlscan.resultUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-[#F5A623] hover:underline mt-0.5 inline-block">
                          Lihat laporan lengkap ↗
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[#555570]">
                      {urlscanUUID ? "⏳ Menunggu hasil scan..." : externalCheck.urlscan.label || "⏳ Menunggu hasil..."}
                    </p>
                  )
                ) : (
                  <p className="text-xs text-[#555570]">⚠️ {externalCheck?.urlscan?.reason || "Tidak tersedia"}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 0b. Domain Intelligence (AbuseIPDB, WHOIS, SSL, VirusTotal) ── */}
        {!deepScanLocked && (domainIntelLoading || domainIntel) && (
          <motion.div variants={fadeUp} custom={0.5} initial="hidden" animate="visible"
            className="glass-card p-5 border border-[#2e3348]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-heading font-semibold text-sm text-[#8888aa] flex items-center gap-2">
                <Fingerprint size={16} className="text-[#F5A623]" />
                Domain Intelligence
              </h2>
              {domainIntel?.overallRisk && (
                <span className={
                  "text-[10px] font-semibold px-2 py-1 rounded-full " +
                  (domainIntel.overallRisk === "high"
                    ? "bg-[#E55C30]/10 text-[#E55C30]"
                    : domainIntel.overallRisk === "medium"
                    ? "bg-[#F5A623]/10 text-[#F5A623]"
                    : domainIntel.overallRisk === "low"
                    ? "bg-[#2DCB85]/10 text-[#2DCB85]"
                    : "bg-white/10 text-[#8888aa]")
                }>
                  Risiko: {domainIntel.overallRisk === "high" ? "Tinggi" : domainIntel.overallRisk === "medium" ? "Sedang" : domainIntel.overallRisk === "low" ? "Rendah" : "Tidak diketahui"}
                </span>
              )}
            </div>
            {domainIntel?.resolvedIp && (
              <p className="text-[10px] text-[#555570] mb-2">
                IP: {domainIntel.resolvedIp} (IPv{domainIntel.ipVersion || "?"})
              </p>
            )}
            {domainIntel?.overallRisk && domainIntel.overallRisk !== "low" && domainIntel.overallRisk !== "unknown" && (
              <p className="text-[10px] text-[#666680] mb-3">
                Dipicu oleh: {getRiskReasons(domainIntel).join(", ")}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* AbuseIPDB */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <Server size={14} className="text-[#8888aa]" />
                  <span className="text-xs font-medium text-[#e0e0e0]">Reputasi IP (AbuseIPDB)</span>
                </div>
                {domainIntelLoading && !domainIntel?.abuseIpdb ? (
                  <p className="text-xs text-[#555570]">Memeriksa...</p>
                ) : domainIntel?.abuseIpdb?.available ? (
                  <div>
                    <p className={`text-xs font-medium ${
                      domainIntel.abuseIpdb.status === "malicious" ? "text-[#E55C30]"
                      : domainIntel.abuseIpdb.status === "suspicious" ? "text-[#F5A623]"
                      : "text-[#8888aa]"
                    }`}>
                      Skor abuse: {domainIntel.abuseIpdb.abuseConfidenceScore}% ({domainIntel.abuseIpdb.totalReports} laporan)
                    </p>
                    <p className="text-[10px] text-[#555570] mt-0.5">
                      {domainIntel.abuseIpdb.ip} · {domainIntel.abuseIpdb.isp || "ISP tidak diketahui"}
                      {domainIntel.abuseIpdb.isTor && " · Tor exit node"}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#555570]">⚠️ {domainIntel?.abuseIpdb?.reason || "Tidak tersedia"}</p>
                )}
              </div>

              {/* WHOIS / Umur Domain */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-[#8888aa]" />
                  <span className="text-xs font-medium text-[#e0e0e0]">Umur Domain (WHOIS)</span>
                </div>
                {domainIntelLoading && !domainIntel?.whois ? (
                  <p className="text-xs text-[#555570]">Memeriksa...</p>
                ) : domainIntel?.whois?.available ? (
                  <div>
                    <p className={`text-xs font-medium ${domainIntel.whois.isNewDomain ? "text-[#F5A623]" : "text-[#8888aa]"}`}>
                      {domainIntel.whois.isNewDomain
                        ? `⚠️ Domain baru (${domainIntel.whois.ageDays} hari)`
                        : `Terdaftar ${domainIntel.whois.ageDays} hari lalu`}
                    </p>
                    {domainIntel.whois.registrar && (
                      <p className="text-[10px] text-[#555570] mt-0.5">Registrar: {domainIntel.whois.registrar}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#555570]">⚠️ {domainIntel?.whois?.reason || "Tidak tersedia"}</p>
                )}
              </div>

              {/* SSL/TLS */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  {domainIntel?.ssl?.status === "valid" ? (
                    <Lock size={14} className="text-[#8888aa]" />
                  ) : (
                    <Unlock size={14} className="text-[#8888aa]" />
                  )}
                  <span className="text-xs font-medium text-[#e0e0e0]">Sertifikat SSL/TLS</span>
                </div>
                {domainIntelLoading && !domainIntel?.ssl ? (
                  <p className="text-xs text-[#555570]">Memeriksa...</p>
                ) : domainIntel?.ssl?.available ? (
                  <div>
                    <p className={`text-xs font-medium ${
                      domainIntel.ssl.status === "valid" ? "text-[#8888aa]"
                      : domainIntel.ssl.status === "expiring_soon" ? "text-[#F5A623]"
                      : "text-[#E55C30]"
                    }`}>
                      {domainIntel.ssl.status === "valid" && `Valid, berlaku ${domainIntel.ssl.daysUntilExpiry} hari lagi`}
                      {domainIntel.ssl.status === "expiring_soon" && `⚠️ Akan kedaluwarsa dalam ${domainIntel.ssl.daysUntilExpiry} hari`}
                      {domainIntel.ssl.status === "expired" && "⚠️ Sertifikat sudah kedaluwarsa"}
                      {domainIntel.ssl.status === "invalid" && "⚠️ Sertifikat tidak valid"}
                    </p>
                    {domainIntel.ssl.issuer && (
                      <p className="text-[10px] text-[#555570] mt-0.5">Penerbit: {domainIntel.ssl.issuer}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#555570]">⚠️ {domainIntel?.ssl?.reason || "Tidak tersedia"}</p>
                )}
              </div>

              {/* VirusTotal */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-sm bg-white/10 flex items-center justify-center text-[10px]">V</div>
                  <span className="text-xs font-medium text-[#e0e0e0]">VirusTotal (Domain)</span>
                </div>
                {domainIntelLoading && !domainIntel?.virusTotal ? (
                  <p className="text-xs text-[#555570]">Memeriksa...</p>
                ) : domainIntel?.virusTotal?.available ? (
                  <p className={`text-xs font-medium ${
                    domainIntel.virusTotal.status === "malicious" ? "text-[#E55C30]"
                    : domainIntel.virusTotal.status === "suspicious" ? "text-[#F5A623]"
                    : "text-[#8888aa]"
                  }`}>
                    {domainIntel.virusTotal.status === "clean"
                      ? `Bersih (${domainIntel.virusTotal.harmless} vendor menandai aman)`
                      : `${domainIntel.virusTotal.malicious} vendor menandai berbahaya`}
                  </p>
                ) : (
                  <p className="text-xs text-[#555570]">⚠️ {domainIntel?.virusTotal?.reason || "Tidak tersedia"}</p>
                )}
              </div>

              {/* Shodan */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={14} className="text-[#8888aa]" />
                  <span className="text-xs font-medium text-[#e0e0e0]">Exposed Services (Shodan)</span>
                </div>
                {domainIntelLoading && !domainIntel?.shodan ? (
                  <p className="text-xs text-[#555570]">Memeriksa...</p>
                ) : domainIntel?.shodan?.available ? (
                  domainIntel.shodan.status === "no_data" ? (
                    <p className="text-xs text-[#8888aa]">Tidak ada data terindeks Shodan buat IP ini</p>
                  ) : (
                    <div>
                      <p className={`text-xs font-medium ${
                        domainIntel.shodan.status === "vulnerable" ? "text-[#E55C30]"
                        : domainIntel.shodan.status === "exposed" ? "text-[#F5A623]"
                        : "text-[#8888aa]"
                      }`}>
                        {domainIntel.shodan.ports.length} port terbuka
                        {domainIntel.shodan.vulns.length > 0 && ` · ⚠️ ${domainIntel.shodan.vulns.length} known vuln`}
                      </p>
                      <p className="text-[10px] text-[#555570] mt-0.5">
                        {domainIntel.shodan.ports.length > 0 && `Port: ${domainIntel.shodan.ports.slice(0, 8).join(", ")}`}
                        {domainIntel.shodan.org && ` · ${domainIntel.shodan.org}`}
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-xs text-[#555570]">⚠️ {domainIntel?.shodan?.reason || "Tidak tersedia"}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 1. Ringkasan Skor ────────────────────────────────────── */}
        <Section icon={Shield} title="Ringkasan Skor" delay={1}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreCircle score={score} status={status} />
            <div className="flex-1 text-center sm:text-left">
              <div className={`font-heading font-bold text-3xl ${sc.text} mb-2`}>{statusLabel}</div>
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                <span className={`text-xs px-3 py-1 rounded-full ${sc.bg} ${sc.text} font-medium`}>
                  Risiko: {riskLevel}
                </span>
                <span className="text-xs text-[#555570]">Domain: {domain}</span>
              </div>
              <p className="text-[#8888aa] text-sm leading-relaxed">{summary}</p>
            </div>
          </div>
        </Section>

        {/* ── 2. Breakdown Skor ────────────────────────────────────── */}
        {details?.deductions?.length > 0 && (
          <Section icon={Hash} title="Breakdown Skor (Pengurangan)" delay={2}>
            <div className="space-y-3">
              {details.deductions.map((d, i) => (
                <BarItem key={i} label={d.item} value={d.points} maxValue={maxDeduction} color="#E55C30" />
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[#E55C30]/5 border border-[#E55C30]/10">
              <p className="text-xs text-[#E55C30]">
                Total pengurangan: <span className="font-mono font-bold">{100 - score}</span> poin dari skor awal 100 (di-cap maksimal 95)
              </p>
            </div>
          </Section>
        )}

        {/* ── 3. Analisis Domain ───────────────────────────────────── */}
        <Section icon={Globe} title="Analisis Domain" delay={3}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Domain Parts */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
              <h3 className="text-xs font-semibold text-[#8888aa] mb-3">Struktur Domain</h3>
              {details?.technicalDetails?.domainParts?.length > 0 ? (
                <div className="space-y-2">
                  {details.technicalDetails.domainParts.map((part, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#555570] w-16">
                        {i === 0 ? "Sub/Utama" : i === details.technicalDetails.domainParts.length - 1 ? "TLD" : "Domain"}
                      </span>
                      <span className="font-mono text-sm text-[#e0e0e0] bg-white/[0.03] px-2 py-1 rounded">{part}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#666680]">Tidak tersedia</p>
              )}
            </div>

            {/* Domain Stats */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
              <h3 className="text-xs font-semibold text-[#8888aa] mb-3">Statistik Domain</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#666680]">Panjang Total</span>
                  <span className="font-mono text-[#e0e0e0]">{details?.domainLength?.total || domain.length} karakter</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#666680]">Panjang Utama</span>
                  <span className="font-mono text-[#e0e0e0]">{details?.domainLength?.main || domain.split(".")[0].length} karakter</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#666680]">Jumlah Subdomain</span>
                  <span className="font-mono text-[#e0e0e0]">{details?.technicalDetails?.subdomainCount || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#666680]">Panjang URL Total</span>
                  <span className="font-mono text-[#e0e0e0]">{details?.technicalDetails?.urlLength || result.url.length} karakter</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#666680]">Domain Terpercaya</span>
                  <span className={details?.technicalDetails?.isSafeDomain ? "text-[#2DCB85]" : "text-[#E55C30]"}>
                    {details?.technicalDetails?.isSafeDomain ? "✓ Ya" : "✗ Tidak"}
                  </span>
                </div>
              </div>
            </div>

            {/* Entropy */}
            {details?.entropy && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] sm:col-span-2">
                <h3 className="text-xs font-semibold text-[#8888aa] mb-3 flex items-center gap-2">
                  <Fingerprint size={14} /> Entropy (Randomness) Domain
                </h3>
                <div className="flex items-center gap-4">
                  <div className="font-mono text-2xl font-bold" style={{
                    color: details.entropy.level === "very_high" ? "#E55C30" :
                           details.entropy.level === "high" ? "#F5A623" :
                           details.entropy.level === "medium" ? "#F5A623" : "#2DCB85"
                  }}>
                    {details.entropy.score}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#8888aa]">{details.entropy.description}</p>
                    <p className="text-[10px] text-[#555570] mt-1">
                      Semakin tinggi entropy, semakin acak domain — domain acak sering dipakai phising
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* ── 4. Deteksi Typosquatting ─────────────────────────────── */}
        {details?.urlParts && (
          <Section icon={Target} title="Deteksi Typosquatting" delay={4}>
            {(() => {
              const hasTyposquat = issues.some((i) => i.label === "Impersonasi Brand");
              const typosquatIssue = issues.find((i) => i.label === "Impersonasi Brand");

              if (hasTyposquat && typosquatIssue) {
                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#E55C30]/5 border border-[#E55C30]/20">
                      <div className="flex items-center gap-3 mb-2">
                        <XCircle size={20} className="text-[#E55C30]" />
                        <span className="font-heading font-semibold text-[#E55C30]">Terdeteksi!</span>
                      </div>
                      <p className="text-sm text-[#8888aa]">{typosquatIssue.detail}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#E55C30]/5 border border-[#E55C30]/10">
                        <span className="text-[10px] text-[#E55C30] block mb-1">Domain Palsu</span>
                        <span className="font-mono text-sm text-[#E55C30] break-all">{domain}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#2DCB85]/5 border border-[#2DCB85]/10">
                        <span className="text-[10px] text-[#2DCB85] block mb-1">Domain Asli</span>
                        <span className="font-mono text-sm text-[#2DCB85] break-all">{typosquatIssue.value?.replace("Menyamar sebagai ", "")}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="p-4 rounded-xl bg-[#2DCB85]/5 border border-[#2DCB85]/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#2DCB85]" />
                    <span className="text-sm text-[#2DCB85]">Tidak terdeteksi typosquatting — domain terlihat asli</span>
                  </div>
                </div>
              );
            })()}
          </Section>
        )}

        {/* ── 5. Karakter Mencurigakan ─────────────────────────────── */}
        {details?.homoglyphs && (
          <Section icon={Code} title="Analisis Karakter Mencurigakan" delay={5}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <h3 className="text-xs font-semibold text-[#8888aa] mb-3">Homoglyphs (Karakter Mirip)</h3>
                {details.homoglyphs.found.length > 0 ? (
                  <div className="space-y-2">
                    {details.homoglyphs.found.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-[#E55C30]">&quot;{h.char}&quot;</span>
                        <span className="text-[#555570]">terlihat seperti</span>
                        <span className="font-mono text-[#F5A623]">&quot;{h.looksLike}&quot;</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#2DCB85]">Tidak ditemukan karakter mirip</p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <h3 className="text-xs font-semibold text-[#8888aa] mb-3">Punycode / IDN</h3>
                <div className="flex items-center gap-2">
                  {details.homoglyphs.hasPunycode ? (
                    <>
                      <AlertTriangle size={16} className="text-[#E55C30]" />
                      <span className="text-xs text-[#E55C30]">Domain menggunakan Punycode (IDN) — bisa menyembunyikan karakter asing</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} className="text-[#2DCB85]" />
                      <span className="text-xs text-[#2DCB85]">Tidak ada Punycode terdeteksi</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* ── 6. Analisis Path & Query ─────────────────────────────── */}
        <Section icon={Layers} title="Analisis Path & Query" delay={6}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Path */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
              <h3 className="text-xs font-semibold text-[#8888aa] mb-3">Path Analysis</h3>
              {details?.pathAnalysis?.segments?.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {details.pathAnalysis.segments.map((seg, i) => (
                      <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-white/[0.03] text-[#e0e0e0]">
                        /{seg}
                      </span>
                    ))}
                  </div>
                  {details.pathAnalysis.suspicious.length > 0 && (
                    <div className="mt-2 p-2 rounded bg-[#E55C30]/5 border border-[#E55C30]/10">
                      <p className="text-[10px] text-[#E55C30]">
                        Kata kunci mencurigakan: {details.pathAnalysis.suspicious.join(", ")}
                      </p>
                    </div>
                  )}
                  <p className="text-[10px] text-[#666680]">{details.pathAnalysis.description}</p>
                </div>
              ) : (
                <p className="text-xs text-[#2DCB85]">Path root — tidak ada halaman spesifik</p>
              )}
            </div>

            {/* Query */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
              <h3 className="text-xs font-semibold text-[#8888aa] mb-3">Query Parameters</h3>
              {details?.queryAnalysis?.total > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#e0e0e0]">{details.queryAnalysis.total} parameter ditemukan</p>
                  {details.queryAnalysis.suspicious.length > 0 && (
                    <div className="space-y-1">
                      {details.queryAnalysis.suspicious.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <AlertTriangle size={12} className="text-[#E55C30]" />
                          <span className="font-mono text-[#E55C30]">{p.key}</span>
                          <span className="text-[#555570]">= {p.value.slice(0, 30)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-[#666680]">{details.queryAnalysis.description}</p>
                </div>
              ) : (
                <p className="text-xs text-[#2DCB85]">Tidak ada query parameters</p>
              )}
            </div>

            {/* Redirect Hints */}
            {details?.redirectHints && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] sm:col-span-2">
                <h3 className="text-xs font-semibold text-[#8888aa] mb-3 flex items-center gap-2">
                  <ExternalLink size={14} /> Indikator Redirect
                </h3>
                {details.redirectHints.found.length > 0 ? (
                  <div className="space-y-1">
                    {details.redirectHints.found.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <AlertTriangle size={12} className="text-[#F5A623]" />
                        <span className="text-[#F5A623]">{r}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#2DCB85]">{details.redirectHints.description}</p>
                )}
              </div>
            )}
          </div>
        </Section>

        {/* ── 7. Kata Kunci Terdeteksi ─────────────────────────────── */}
        {details?.keywords && (
          <Section icon={FileText} title="Kata Kunci yang Terdeteksi" delay={7}>
            <div className="space-y-4">
              {details.keywords.high.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#E55C30] mb-2">🔴 Risiko Tinggi</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.keywords.high.map((k, i) => (
                      <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#E55C30]/10 text-[#E55C30] border border-[#E55C30]/20">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {details.keywords.medium.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#F5A623] mb-2">🟡 Risiko Sedang</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.keywords.medium.map((k, i) => (
                      <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {details.keywords.low.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#666680] mb-2">⚪ Risiko Rendah</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.keywords.low.map((k, i) => (
                      <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/[0.03] text-[#8888aa] border border-white/[0.05]">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {details.keywords.high.length === 0 && details.keywords.medium.length === 0 && details.keywords.low.length === 0 && (
                <p className="text-xs text-[#2DCB85]">Tidak ada kata kunci phising terdeteksi</p>
              )}
            </div>
          </Section>
        )}

        {/* ── 8. Pola URL Mencurigakan ─────────────────────────────── */}
        {details?.patterns && (
          <Section icon={Zap} title="Pola URL Mencurigakan" delay={8}>
            {details.patterns.length > 0 ? (
              <div className="space-y-2">
                {details.patterns.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#E55C30]/5 border border-[#E55C30]/10">
                    <AlertTriangle size={16} className="text-[#E55C30] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#e0e0e0]">{p}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#2DCB85]/5 border border-[#2DCB85]/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#2DCB85]" />
                  <span className="text-sm text-[#2DCB85]">Tidak ada pola mencurigakan terdeteksi</span>
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ── 9. Detail Teknis ─────────────────────────────────────── */}
        <Section icon={Eye} title="Detail Teknis" delay={9}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
              <span className="text-[10px] text-[#555570] block mb-1">Protokol</span>
              <div className={`font-mono text-sm flex items-center gap-1 ${details?.urlParts?.protocol === "https" ? "text-[#2DCB85]" : "text-[#E55C30]"}`}>
                {details?.urlParts?.protocol === "https" ? <Lock size={14} /> : <Unlock size={14} />}
                {details?.urlParts?.protocol?.toUpperCase() || "N/A"}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
              <span className="text-[10px] text-[#555570] block mb-1">Domain</span>
              <div className="font-mono text-sm text-[#e0e0e0] break-all">{domain}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
              <span className="text-[10px] text-[#555570] block mb-1">TLD</span>
              <div className="font-mono text-sm text-[#e0e0e0]">.{details?.technicalDetails?.tld || domain.split(".").pop()}</div>
            </div>
            {details?.urlParts?.port && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                <span className="text-[10px] text-[#555570] block mb-1">Port</span>
                <div className="font-mono text-sm text-[#F5A623]">{details.urlParts.port}</div>
              </div>
            )}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
              <span className="text-[10px] text-[#555570] block mb-1">URL Length</span>
              <div className="font-mono text-sm text-[#e0e0e0]">{result.url.length} chars</div>
            </div>
            {details?.urlParts?.pathname && details.urlParts.pathname !== "/" && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.03] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#555570] block mb-1">Path</span>
                <div className="font-mono text-sm text-[#e0e0e0] break-all">{details.urlParts.pathname}</div>
              </div>
            )}
          </div>

          {/* Domain Age Hints */}
          {details?.domainAgeHints?.indicators?.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-[#F5A623]/5 border border-[#F5A623]/10">
              <h3 className="text-xs font-semibold text-[#F5A623] mb-2 flex items-center gap-2">
                <Smartphone size={14} /> Indikasi Domain Baru
              </h3>
              <div className="space-y-1">
                {details.domainAgeHints.indicators.map((ind, i) => (
                  <p key={i} className="text-xs text-[#8888aa]">• {ind}</p>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ── 10. Checklist Semua Pengecekan ────────────────────────── */}
        <Section icon={CheckCircle2} title="Semua Pengecekan" delay={10}>
          <div className="space-y-2">
            {issues.map((issue, i) => (
              <CheckItem key={i} label={issue.label} status={issue.status} detail={issue.detail} />
            ))}
          </div>
        </Section>

        {/* ── 11. Rekomendasi & Aksi ───────────────────────────────── */}
        <Section icon={ShieldCheck} title="Rekomendasi & Langkah" delay={11}>
          <div className="p-4 rounded-xl border border-[#2DCB85]/20 bg-[#2DCB85]/5 mb-6">
            <h3 className="text-sm font-semibold text-[#2DCB85] mb-2">Rekomendasi</h3>
            <ul className="space-y-1.5 text-xs text-[#8888aa]">
              {status === "safe" ? (
                <>
                  <li>• Tidak ada indikator berbahaya pada pemeriksaan ini — bukan jaminan aman</li>
                  <li>• Tetap verifikasi domain sebelum login, membayar, atau mengunduh file</li>
                  <li>• Gunakan 2FA untuk keamanan ekstra</li>
                </>
              ) : status === "warn" ? (
                <>
                  <li>• Jangan isi data pribadi di halaman ini</li>
                  <li>• Verifikasi keaslian link ke sumber resmi</li>
                  <li>• Laporkan link ini jika mencurigakan</li>
                </>
              ) : (
                <>
                  <li>• JANGAN KLIK atau buka link ini</li>
                  <li>• Jangan isi data apapun di halaman ini</li>
                  <li>• Laporkan link ini untuk melindungi orang lain</li>
                  <li>• Jika sudah terlanjur klik, segera ganti password</li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2e3348] text-[#666680] hover:text-[#2DCB85] hover:border-[#2DCB85]/30 transition-colors text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Copy size={16} />
              {copied ? "Tersalin!" : "Salin Hasil"}
            </motion.button>
            <motion.button
              onClick={() => {
                const text = encodeURIComponent(`*Hasil Analisis Urlveil*\n\nLink: ${result.url}\nStatus: *${statusLabel}*\nSkor: ${score}/95\n\nCek analisis: urlveil.id/analisis?url=${encodeURIComponent(result.url)}`);
                window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2DCB85]/10 border border-[#2DCB85]/20 text-[#2DCB85] hover:bg-[#2DCB85]/20 transition-colors text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={16} />
              Share WA
            </motion.button>
            <motion.button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2e3348] text-[#666680] hover:text-[#E55C30] hover:border-[#E55C30]/30 transition-colors text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Flag size={16} />
              Laporkan
            </motion.button>
          </div>

          <div className="mt-4 text-xs text-[#555570] text-center">
            Diperiksa pada: {new Date(result.checkedAt).toLocaleString("id-ID")}
          </div>
        </Section>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        url={result.url}
        domain={domain}
      />
    </div>
  );
}

export default function AnalisisPage() {
  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-24 pb-16 relative">
        <MeshBackground variant="default" />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#2e3348]" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F5A623] animate-spin" />
              </div>
              <p className="text-[#666680] text-sm">Memuat...</p>
            </div>
          </div>
        }>
          <AnalisisContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}