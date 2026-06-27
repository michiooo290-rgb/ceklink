"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  {
    value: 12847,
    label: "link diperiksa",
    color: "#2DCB85",
    note: "sejak diluncurkan",
  },
  {
    value: 8293,
    label: "phising terdeteksi",
    color: "#E55C30",
    note: "dari total scan",
  },
  {
    value: 47,
    label: "dilaporkan hari ini",
    color: "#F5A623",
    note: "oleh komunitas",
  },
  {
    value: 4554,
    label: "pengguna aktif",
    color: "#a0a5b8",
    note: "bulan ini",
  },
];

function AnimatedNumber({ target, duration = 1800, isInView }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <>{current.toLocaleString("id-ID")}</>;
}

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="statsbar-section" aria-label="Statistik Urlveil" ref={ref}>
      <div className="statsbar-inner">
        {/* Label kiri */}
        <motion.div
          className="statsbar-header"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="statsbar-eyebrow">Data ilustrasi</span>
          <p className="statsbar-title">Aktivitas<br />platform</p>
        </motion.div>

        {/* Stats grid */}
        <div className="statsbar-grid">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-item"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="stat-value" style={{ color: s.color }}>
                <AnimatedNumber target={s.value} isInView={isInView} />
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-note">{s.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}