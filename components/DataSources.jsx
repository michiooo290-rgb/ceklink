"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Globe, ScanLine, Link2, GitBranch, ExternalLink } from "lucide-react";
import CardSwap, { Card } from "./CardSwap";
import "./DataSources.css";

export default function DataSources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [urlhausData, setUrlhausData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLiveData = async () => {
    setLoading(true);
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
    }
  };

  useEffect(() => {
    if (mounted) fetchLiveData();
  }, [mounted]);

  /* ── Pin SELURUH BLOK (teks + kartu) via JavaScript ──
     Section dibuat tinggi (200vh di CSS) sebagai "lintasan" scroll. Wrapper
     .datasrc-pin ditahan di posisi tetap pada viewport lewat transform selama
     section melintas, sehingga teks & kartu diam bersama sambil kartu berganti
     otomatis. Murni berbasis koordinat viewport → tidak bergantung pada
     sticky/overflow/transform induk. Nonaktif di layar ≤900px (scroll normal). */
  const pinRef = useRef(null);
  useEffect(() => {
    const section = ref.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      if (window.innerWidth <= 900) {
        pin.style.transform = "";
        return;
      }
      const sRect = section.getBoundingClientRect();
      const pinHeight = pin.offsetHeight;
      const naturalTop = pin.offsetTop;
      const travel = sRect.height - naturalTop - pinHeight;
      if (travel <= 0) {
        pin.style.transform = "";
        return;
      }
      const desiredTop =
        pinHeight < window.innerHeight
          ? (window.innerHeight - pinHeight) / 2
          : 8;
      let offset = desiredTop - (sRect.top + naturalTop);
      if (offset < 0) offset = 0;
      else if (offset > travel) offset = travel;
      pin.style.transform = `translateY(${offset}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const SOURCES = [
    {
      icon: ShieldCheck,
      name: "URLhaus",
      desc: "Database phishing & malware real-time dari komunitas keamanan global.",
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
      <div className="datasrc-pin" ref={pinRef}>
        <div className="datasrc-inner datasrc-showcase">

          {/* Kolom kiri: copy */}
          <div className="datasrc-header">
            <motion.div
              className="datasrc-header-anim"
              initial={ { opacity: 0, y: 20 } }
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={ { duration: 0.5 } }
            >
              <span className="statsbar-eyebrow">Transparansi data</span>
              <p className="statsbar-title">Dari mana<br />datanya?</p>
              <p className="datasrc-sub">
                Setiap hasil scan didukung sumber yang bisa kamu verifikasi sendiri.
              </p>
              <div className="datasrc-live-badge">
                <span className="datasrc-live-dot" aria-hidden="true" />
                {mounted && urlhausData
                  ? `${urlhausData.count?.toLocaleString("id-ID")} URL berbahaya terlacak real-time`
                  : "5 sumber verifikasi aktif"}
              </div>

              {/* Versi teks untuk pembaca layar (kartu berputar disembunyikan dari AT) */}
              <ul className="sr-only">
                {SOURCES.map((s) => (
                  <li key={s.name}>
                    {s.name} ({s.tag}) — {s.desc}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Kolom kanan: tumpukan kartu 3D berputar */}
          <motion.div
            className="datasrc-stage"
            initial={ { opacity: 0, scale: 0.94 } }
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={ { duration: 0.6, delay: 0.15 } }
            aria-hidden="true"
          >
            <CardSwap
              width={500}
              height={380}
              cardDistance={60}
              verticalDistance={70}
              delay={4000}
              skewAmount={6}
              pauseOnHover
              easing="elastic"
            >
              {SOURCES.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.name}>
                    <div className="ds-card-inner">
                      <div className="ds-card-top">
                        <div
                          className="ds-card-icon"
                          style={ { color: s.tagColor, borderColor: `${s.tagColor}33`, background: `${s.tagColor}12` } }
                        >
                          <Icon size={22} />
                        </div>
                        <span
                          className="ds-card-tag"
                          style={ { color: s.tagColor, borderColor: `${s.tagColor}40`, background: `${s.tagColor}14` } }
                        >
                          {s.tag}
                        </span>
                      </div>

                      <div className="ds-card-name">{s.name}</div>

                      {s.live && mounted && !loading && urlhausData ? (
                        <div className="ds-card-live">
                          <span className="ds-card-live-number">
                            {urlhausData.count?.toLocaleString("id-ID") ?? "—"}
                          </span>
                          <span className="ds-card-live-label">
                            URL berbahaya dilacak ·{" "}
                            {urlhausData.onlineCount?.toLocaleString("id-ID") ?? "—"} aktif
                          </span>
                        </div>
                      ) : (
                        <p className="ds-card-desc">{s.desc}</p>
                      )}

                      {s.url && (
                        <a
                          className="ds-card-link"
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Kunjungi sumber <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </Card>
                );
              })}
            </CardSwap>
          </motion.div>

        </div>
      </div>
    </section>
  );
}