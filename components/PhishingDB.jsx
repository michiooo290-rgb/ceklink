"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Siren, RefreshCw, ExternalLink } from "lucide-react";

const FALLBACK = [
  { link: "bit.ly/bca-promo2026", target: "BCA", status: "danger", date: "2 jam lalu" },
  { link: "tokoped1a-sale.com", target: "Tokopedia", status: "danger", date: "4 jam lalu" },
  { link: "shopee-promo.link/voucher", target: "Shopee", status: "warn", date: "6 jam lalu" },
  { link: "bri-mobile-update.xyz", target: "BRI", status: "danger", date: "8 jam lalu" },
  { link: "grab-voucher.gratis", target: "Grab", status: "warn", date: "12 jam lalu" },
  { link: "dana-verifikasi-akun.top", target: "DANA", status: "danger", date: "1 hari lalu" },
];

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function PhishingDB() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [urls, setUrls] = useState([]);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Pakai ref agar setInterval selalu dapat versi fetchData terbaru (hindari stale closure)
  const fetchData = useRef(null);
  fetchData.current = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/phishing", { cache: "no-store" });
      const data = await res.json();

      if (data.fallback || !data.urls?.length) {
        setUrls(FALLBACK);
        setIsFallback(true);
      } else {
        setUrls(data.urls);
        setCount(data.count);
        setIsFallback(false);
        setFetchedAt(data.fetchedAt);
      }
    } catch {
      setUrls(FALLBACK);
      setIsFallback(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData.current();

    // Auto-refresh setiap 60 detik — pakai ref agar tidak stale closure
    const interval = setInterval(() => {
      fetchData.current(true);
      setCountdown(60);
    }, 60_000);

    // Countdown timer tiap detik
    const tick = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 60 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(tick);
    };
  }, []);

  return (
    <section id="database" className="py-16 sm:py-24" aria-label="Database phising terbaru">
      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>

        {/* Header */}
        <motion.div
          className="flex items-start justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="section-label">
              {isFallback ? "Data ilustrasi" : "Real-time · URLhaus"}
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl flex items-center gap-3">
              <Siren size={24} className="text-[#E55C30]" aria-hidden="true" />
              URL Berbahaya Terbaru
            </h2>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => { fetchData.current(true); setCountdown(60); }}
            disabled={refreshing || loading}
            className="pdb-refresh"
            aria-label="Refresh data"
          >
            <RefreshCw size={14} className={refreshing ? "pdb-spin" : ""} />
            {refreshing ? "Memperbarui..." : `Refresh ${countdown}s`}
          </button>
        </motion.div>

        {/* Table */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Header row */}
          <div className="hidden sm:grid gap-4 px-6 py-3 border-b border-[#2e3348] text-[#666680] text-xs font-mono uppercase tracking-wider" style={{gridTemplateColumns: "2.5fr 1fr 1fr 1fr"}}>
            <span>Link</span>
            <span>Target</span>
            <span>Dilaporkan</span>
            <span className="text-center">Status</span>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="pdb-loading">
              <div className="pdb-loading-bar" />
              <p className="pdb-loading-text">Mengambil data real-time...</p>
            </div>
          )}

          {/* Data rows */}
          {!loading && urls.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="table-row grid grid-cols-1 sm:gap-4 px-6 py-4 border-b border-[#2e3348]/30 items-center" style={{gridTemplateColumns: "minmax(0,2.5fr) 1fr 1fr 1fr"}}
            >
              <div className="font-mono text-sm text-[#e0e0e0] break-all flex items-center gap-1.5 min-w-0">
                {item.link}
                {item.urlhaus_link && (
                  <a
                    href={item.urlhaus_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#555570] hover:text-[#F5A623] transition-colors flex-shrink-0"
                    aria-label="Lihat di URLhaus"
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <div className="text-sm text-[#666680]">
                <span className="sm:hidden font-medium text-[#e0e0e0]">Target: </span>
                {item.target}
              </div>
              <div className="text-sm text-[#666680]">
                <span className="sm:hidden font-medium text-[#e0e0e0]">Waktu: </span>
                {item.date}
              </div>
              <div className="flex sm:justify-center">
                <span className={
                  item.status === "danger"
                    ? "badge-danger inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    : "badge-warn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                }>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.status === "danger" ? "#E55C30" : "#F5A623" }}
                    aria-hidden="true"
                  />
                  {item.status === "danger" ? "Bahaya" : "Waspada"}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer info */}
        <motion.div
          className="mt-5 flex items-center justify-between flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-[#666680]">
            {isFallback ? (
              <span className="text-[#F5A623]">⚠ Menampilkan data ilustrasi — koneksi ke sumber gagal</span>
            ) : (
              <>
                Total <span className="text-[#2DCB85] font-semibold">{count?.toLocaleString("id-ID") ?? "—"}</span> URL berbahaya dilacak · Sumber:{" "}
                <a href="https://urlhaus.abuse.ch" target="_blank" rel="noopener noreferrer" className="text-[#666680] hover:text-[#2DCB85] underline transition-colors">
                  URLhaus
                </a>
              </>
            )}
          </p>
          {fetchedAt && (
            <p className="text-[10px] text-[#555570] font-mono">
              Diperbarui {new Date(fetchedAt).toLocaleTimeString("id-ID")}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}