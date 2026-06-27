"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

// Scan line animation — specific to URL security, not generic swirl
function URLDemoScan() {
  const [phase, setPhase] = useState(0);
  // 0 = idle, 1 = scanning, 2 = result
  const [resultType, setResultType] = useState(null);

  const DEMOS = [
    { url: "https://bca.co.id/login", result: "safe" },
    { url: "http://bc4-1ogin.xyz/verify", result: "danger" },
    { url: "https://tokopedia.com/promo?ref=123abc", result: "warn" },
  ];
  const [demoIdx, setDemoIdx] = useState(0);
  const demo = DEMOS[demoIdx];

  useEffect(() => {
    let t;
    if (phase === 0) {
      t = setTimeout(() => setPhase(1), 1200);
    } else if (phase === 1) {
      t = setTimeout(() => {
        setResultType(demo.result);
        setPhase(2);
      }, 1800);
    } else if (phase === 2) {
      t = setTimeout(() => {
        setPhase(0);
        setResultType(null);
        setDemoIdx((i) => (i + 1) % DEMOS.length);
      }, 2800);
    }
    return () => clearTimeout(t);
  }, [phase, demoIdx]);

  const resultColor = {
    safe: "#2DCB85",
    warn: "#F5A623",
    danger: "#E55C30",
  }[resultType] || "#ffffff";

  const ResultIcon = {
    safe: ShieldCheck,
    warn: AlertTriangle,
    danger: XCircle,
  }[resultType];

  const resultLabel = {
    safe: "Aman",
    warn: "Mencurigakan",
    danger: "Berbahaya",
  }[resultType];

  return (
    <div className="url-demo-wrap">
      {/* Browser chrome */}
      <div className="url-demo-chrome">
        <div className="url-demo-dots">
          <span style={{ background: "#E55C30" }} />
          <span style={{ background: "#F5A623" }} />
          <span style={{ background: "#2DCB85" }} />
        </div>
        <div className="url-demo-bar">
          {/* Protocol highlight */}
          <span className={`url-proto ${demo.url.startsWith("https") ? "proto-safe" : "proto-danger"}`}>
            {demo.url.startsWith("https") ? "https" : "http"}
          </span>
          <span className="url-rest">
            {demo.url.replace(/^https?/, "")}
          </span>
        </div>
      </div>

      {/* Scan area */}
      <div className="url-demo-body">
        {phase === 0 && (
          <motion.p
            className="url-demo-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Tempel URL untuk diperiksa...
          </motion.p>
        )}

        {phase === 1 && (
          <div className="url-scan-running">
            <div className="url-scan-bar">
              <motion.div
                className="url-scan-fill"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "linear" }}
              />
            </div>
            <p className="url-scan-label">Menganalisis...</p>
          </div>
        )}

        {phase === 2 && resultType && ResultIcon && (
          <motion.div
            className="url-result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{ "--result-color": resultColor }}
          >
            <ResultIcon size={20} style={{ color: resultColor }} />
            <span className="url-result-label" style={{ color: resultColor }}>
              {resultLabel}
            </span>
            {resultType === "danger" && (
              <span className="url-result-detail">Domain mencurigakan — jangan klik</span>
            )}
            {resultType === "safe" && (
              <span className="url-result-detail">SSL valid · Domain resmi</span>
            )}
            {resultType === "warn" && (
              <span className="url-result-detail">Parameter redirect tidak dikenal</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="beranda"
      className="hero-section"
    >
      {/* Subtle grid background — not a swirl */}
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-inner">
        {/* Left: copy */}
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="hero-eyebrow">Keamanan URL · Indonesia</p>

          <h1 className="hero-headline">
            Sebelum klik,<br />
            <span className="hero-accent">periksa dulu.</span>
          </h1>

          <p className="hero-sub">
            Tempel link mencurigakan — Urlveil menganalisis SSL, domain,
            redirect, dan blacklist dalam hitungan detik. Gratis, tanpa daftar.
          </p>

          <div className="hero-actions">
            <a href="#cek-link" className="btn-primary">
              Cek Link Sekarang
            </a>
            <a href="#cara-kerja" className="btn-ghost">
              Cara kerja →
            </a>
          </div>

          {/* Inline stats — editorial, not 3 big numbers */}
          <div className="hero-stats">
            <span className="hero-stat-item">
              <strong>12K+</strong> link diperiksa
            </span>
            <span className="hero-stat-divider" aria-hidden="true">·</span>
            <span className="hero-stat-item">
              <strong>8K+</strong> phising terdeteksi
            </span>
            <span className="hero-stat-divider" aria-hidden="true">·</span>
            <span className="hero-stat-item">
              <strong>4.5K+</strong> pengguna aktif
            </span>
          </div>
          <p className="hero-disclaimer">* Data ilustrasi, bukan real-time</p>
        </motion.div>

        {/* Right: live demo widget */}
        <motion.div
          className="hero-demo"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <URLDemoScan />
        </motion.div>
      </div>
    </section>
  );
}