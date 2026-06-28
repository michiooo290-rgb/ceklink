"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Link as LinkIcon, History, BarChart3,
  Hash, Route, Clock, ListTree, Fingerprint, Trash2, ChevronRight,
  ShieldCheck, ShieldAlert, ShieldX,
} from "lucide-react";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import ResultCard from "../../components/ResultCard";
import { scanURL } from "../../lib/scanner";

const HISTORY_KEY = "urlveil_history";
const MAX_HISTORY = 15;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToHistory(entry) {
  try {
    const current = loadHistory().filter((h) => h.url !== entry.url);
    const updated = [entry, ...current].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return loadHistory();
  }
}

function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}

const statusIcon = { safe: ShieldCheck, warn: ShieldAlert, danger: ShieldX };
const statusColor = { safe: "text-[#2DCB85]", warn: "text-[#F5A623]", danger: "text-[#E55C30]" };

function AnalisisContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [url, setUrl] = useState(initialUrl);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const ranOnce = useRef(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (initialUrl && !ranOnce.current) {
      ranOnce.current = true;
      runScan(initialUrl);
    }
  }, [initialUrl]);

  async function runScan(target) {
    const trimmed = target.trim();
    if (!trimmed) return;
    setLoading(true);
    setUrl(trimmed);
    try {
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed;
      const data = await scanURL(normalized);
      setResult(data);
      const updated = saveToHistory({
        url: normalized,
        domain: data.domain,
        score: data.score,
        status: data.status,
        statusLabel: data.statusLabel,
        checkedAt: data.checkedAt,
      });
      setHistory(updated);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    runScan(inputUrl);
  };

  const d = result?.details;

  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-[#666680] hover:text-[#2DCB85] transition-colors mb-6">
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </a>

          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={26} className="text-[#F5A623]" />
            <h1 className="font-heading font-bold text-2xl sm:text-3xl">Analisis Mendalam</h1>
          </div>
          <p className="text-[#666680] mb-8">
            Breakdown skor, detail teknis, sampai riwayat pemeriksaan link kamu.
          </p>

          {/* Input ulang */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666680]">
                <LinkIcon size={18} />
              </span>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Masukkan URL untuk analisis mendalam"
                className="input-glow w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono text-[#e0e0e0] placeholder:text-[#666680]/50"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-glow px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search size={16} />
              {loading ? "Menganalisis..." : "Analisis"}
            </button>
          </form>

          {result && (
            <div className="mb-10">
              <ResultCard result={result} url={url} />
            </div>
          )}

          {result && d && (
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {/* Score breakdown */}
              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-[#8888aa] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Hash size={14} />
                  Rincian Skor
                </h2>
                {d.deductions?.length > 0 ? (
                  <div className="space-y-2">
                    {d.deductions.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/[0.04] last:border-0">
                        <span className="text-[#e0e0e0]">{item.item}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[#E55C30] font-mono">{item.points}</span>
                          <span className="text-[#555570] hidden sm:inline">{item.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#666680]">Tidak ada pengurangan skor — domain ini bersih dari indikator phising.</p>
                )}
              </div>

              {/* Technical details */}
              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-[#8888aa] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Fingerprint size={14} />
                  Detail Teknis
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-[#666680]">Domain utama</span>
                    <span className="font-mono text-[#e0e0e0]">{d.technicalDetails?.mainDomain}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666680]">TLD</span>
                    <span className="font-mono text-[#e0e0e0]">.{d.technicalDetails?.tld}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666680]">Jumlah subdomain</span>
                    <span className="font-mono text-[#e0e0e0]">{d.technicalDetails?.subdomainCount}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666680]">Panjang URL</span>
                    <span className="font-mono text-[#e0e0e0]">{d.technicalDetails?.urlLength} karakter</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666680]">Entropi nama domain</span>
                    <span className="font-mono text-[#e0e0e0]">{d.entropy != null ? d.entropy.toFixed(2) : "-"}</span>
                  </div>
                  {d.homoglyphs?.length > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#666680]">Karakter mirip (homoglyph)</span>
                      <span className="font-mono text-[#F5A623]">{d.homoglyphs.join(", ")}</span>
                    </div>
                  )}
                  {d.domainAgeHints?.suspicious && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#666680]">Indikasi domain baru</span>
                      <span className="font-mono text-[#F5A623]">Terdeteksi</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Path & query */}
              {(d.pathAnalysis?.segments?.length > 0 || d.queryAnalysis?.total > 0) && (
                <div className="glass-card p-5 sm:col-span-2">
                  <h2 className="text-sm font-semibold text-[#8888aa] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Route size={14} />
                    Analisis Path & Parameter
                  </h2>
                  <p className="text-xs text-[#666680] mb-2">{d.pathAnalysis?.description}</p>
                  <p className="text-xs text-[#666680]">{d.queryAnalysis?.description}</p>
                </div>
              )}
            </div>
          )}

          {/* History */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#8888aa] uppercase tracking-wider flex items-center gap-2">
                <History size={14} />
                Riwayat Pemeriksaan
              </h2>
              {history.length > 0 && (
                <button
                  onClick={() => { clearHistory(); setHistory([]); }}
                  className="text-xs text-[#666680] hover:text-[#E55C30] flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Hapus semua
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-[#666680]">Belum ada riwayat. Hasil pemeriksaan kamu akan tersimpan di sini (di browser kamu sendiri, tidak dikirim ke server).</p>
            ) : (
              <div className="space-y-1">
                <AnimatePresence>
                  {history.map((h, i) => {
                    const Icon = statusIcon[h.status] || ShieldAlert;
                    return (
                      <motion.button
                        key={h.url + h.checkedAt}
                        onClick={() => { setInputUrl(h.url); runScan(h.url); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Icon size={15} className={statusColor[h.status]} />
                        <span className="flex-1 min-w-0 font-mono text-xs text-[#e0e0e0] truncate">{h.domain}</span>
                        <span className={`text-xs font-mono ${statusColor[h.status]}`}>{h.score}/100</span>
                        <span className="text-[10px] text-[#555570] hidden sm:inline whitespace-nowrap">
                          {new Date(h.checkedAt).toLocaleString("id-ID")}
                        </span>
                        <ChevronRight size={14} className="text-[#555570] flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AnalisisPage() {
  return (
    <Suspense fallback={null}>
      <AnalisisContent />
    </Suspense>
  );
}