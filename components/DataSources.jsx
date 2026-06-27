"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Globe, ScanLine, Link2, GitBranch, ExternalLink, RefreshCw } from "lucide-react";

export default function DataSources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [urlhausData, setUrlhausData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/phishing", { cache: "no-store" });
      const data = await res.json();
      if (!data.fallback) {
        setUrlhausData({
          count: data.count,
          onlineCount: data.onlineCount,
          fetchedAt: data.fetchedAt,
        });
      } else {
        setUrlhausData(null);
      }
    } catch {
      setUrlhausData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchLiveData(); }, []);

  const SOURCES = [
    {
      icon: ShieldCheck,
      name: "URLhaus",
      tag: "Real-time",
      tagColor: "#2DCB85",
      url: "https://urlhaus.abuse.ch",
      live: true,
    },
    {
      icon: Globe,
      name: "SSL / HTTPS",
      desc: "Verifikasi protokol enkripsi dan validitas sertifikat dari setiap URL.",
      tag: "Bawaan browser",
      tagColor: "#a0a5b8",
    },
    {
      icon: ScanLine,
      name: "Heuristik Domain",
      desc: "Deteksi typosquatting, TLD mencurigakan, dan pola domain penipuan.",
      tag: "In-house",
      tagColor: "#F5A623",
    },
    {
      icon: Link2,
      name: "Analisis Redirect",
      desc: "Lacak rantai redirect tersembunyi yang mengarah ke domain berbeda.",
      tag: "In-house",
      tagColor: "#F5A623",
    },
    {
      icon: GitBranch,
      name: "Brand Keyword DB",
      desc: "30+ brand Indonesia & global yang sering dipalsukan phisher.",
      tag: "Dikurasi manual",
      tagColor: "#a0a5b8",
    },
  ];

  return (
    <section className="datasrc-section" aria-label="Sumber data analisis" ref={ref}>
      <div className="datasrc-inner">

        {/* Label kiri */}
        <motion.div
          className="datasrc-header"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="statsbar-eyebrow">Transparansi data</span>
          <p className="statsbar-title">Dari mana<br />datanya?</p>
          <p className="datasrc-sub">
            Setiap hasil scan didukung sumber yang bisa kamu verifikasi sendiri.
          </p>
        </motion.div>

        {/* Source cards */}
        <div className="datasrc-grid">
          {SOURCES.map((s, i) => {
            const Icon = s.icon;
            const isLive = s.live;

            return (
              <motion.div
                key={s.name}
                className={`datasrc-card${isLive ? " datasrc-card--live" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="datasrc-card-top">
                  <div className="datasrc-icon-wrap" style={isLive ? { color: "#2DCB85", borderColor: "#2DCB8533", background: "#2DCB8510" } : {}}>
                    <Icon size={16} />
                  </div>
                  <span
                    className="datasrc-tag"
                    style={{ color: s.tagColor, borderColor: s.tagColor + "33", background: s.tagColor + "10" }}
                  >
                    {s.tag}
                  </span>
                </div>

                <div className="datasrc-name-row">
                  <span className="datasrc-name">{s.name}</span>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="datasrc-ext"
                      aria-label={`Buka ${s.name}`}
                    >
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {/* URLhaus: tampilkan data live */}
                {isLive ? (
                  <div className="datasrc-live">
                    {loading ? (
                      <div className="datasrc-live-loading">
                        <div className="datasrc-live-bar" />
                      </div>
                    ) : urlhausData ? (
                      <>
                        <div className="datasrc-live-stat">
                          <span className="datasrc-live-number">
                            {urlhausData.count.toLocaleString("id-ID")}
                          </span>
                          <span className="datasrc-live-label">URL berbahaya dilacak</span>
                        </div>
                        <div className="datasrc-live-meta">
                          <span className="datasrc-live-dot" />
                          <span>
                            {urlhausData.onlineCount.toLocaleString("id-ID")} aktif sekarang
                          </span>
                          <span className="datasrc-live-sep">·</span>
                          <span>
                            diperbarui {new Date(urlhausData.fetchedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <button
                            onClick={() => fetchLiveData(true)}
                            className="datasrc-refresh"
                            aria-label="Refresh data URLhaus"
                            disabled={refreshing}
                          >
                            <RefreshCw size={10} className={refreshing ? "datasrc-spin" : ""} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="datasrc-desc datasrc-fallback">
                        Database phishing & malware real-time dari komunitas keamanan global.
                        <span className="datasrc-offline"> · Data tidak tersedia saat ini</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="datasrc-desc">{s.desc}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}