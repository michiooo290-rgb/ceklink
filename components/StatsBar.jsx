"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { createClient } from "../lib/supabase/client";

const STAT_META = [
  { key: "totalScans", label: "link diperiksa", color: "#2DCB85", note: "sejak diluncurkan" },
  { key: "totalPhishing", label: "phising terdeteksi", color: "#E55C30", note: "dari total scan" },
  { key: "reportsToday", label: "dilaporkan hari ini", color: "#F5A623", note: "oleh komunitas" },
  { key: "registeredUsers", label: "pengguna terdaftar", color: "#a0a5b8", note: "total akun" },
];

function AnimatedNumber({ target, duration = 1800, isInView }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (!target) { setCurrent(0); return; }
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
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadStats() {
      const [countersRes, reportsRes, usersRes] = await Promise.all([
        supabase.from("site_counters").select("total_scans, total_phishing").eq("id", 1).single(),
        supabase.rpc("get_reports_today_count"),
        supabase.rpc("get_registered_users_count"),
      ]);

      setStats({
        totalScans: countersRes.data?.total_scans ?? 0,
        totalPhishing: countersRes.data?.total_phishing ?? 0,
        reportsToday: reportsRes.data ?? 0,
        registeredUsers: usersRes.data ?? 0,
      });
    }

    loadStats();
  }, []);

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
          <span className="statsbar-eyebrow">Data real-time</span>
          <p className="statsbar-title">Aktivitas<br />platform</p>
        </motion.div>

        {/* Stats grid */}
        <div className="statsbar-grid">
          {STAT_META.map((s, i) => (
            <motion.div
              key={s.key}
              className="stat-item"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="stat-value" style={{ color: s.color }}>
                <AnimatedNumber target={stats?.[s.key] ?? 0} isInView={isInView && stats !== null} />
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