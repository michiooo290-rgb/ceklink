"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Search, ShieldAlert, Users, BarChart3 } from "lucide-react";

const STATS = [
  { label: "Link Discan", value: 12847, icon: Search, color: "text-[#2DCB85]" },
  { label: "Phising Ditemukan", value: 8293, icon: ShieldAlert, color: "text-[#E55C30]" },
  { label: "User Aktif", value: 4554, icon: Users, color: "text-[#e0e0e0]" },
  { label: "Dilaporkan Hari Ini", value: 47, icon: BarChart3, color: "text-[#F5A623]" },
];

function AnimatedNumber({ target, duration = 2000, isInView }) {
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

  return <span>{current.toLocaleString("id-ID")}</span>;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-12 sm:py-16" aria-label="Statistik CekLink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          className="glass-card p-6 sm:p-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="mb-3 flex justify-center" aria-hidden="true">
                    <div className={`w-12 h-12 rounded-xl ${stat.color === "text-[#2DCB85]" ? "bg-[#2DCB85]/10" : stat.color === "text-[#E55C30]" ? "bg-[#E55C30]/10" : stat.color === "text-[#F5A623]" ? "bg-[#F5A623]/10" : "bg-white/5"} flex items-center justify-center`}>
                      <IconComponent size={24} className={stat.color} />
                    </div>
                  </div>
                  <div className={`font-heading font-bold text-2xl sm:text-3xl ${stat.color}`}>
                    <AnimatedNumber target={stat.value} isInView={isInView} />
                  </div>
                  <div className="text-[#666680] text-sm mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-center text-[10px] text-[#555570] mt-4">
            * Data ilustrasi — bukan data real-time
          </p>
        </motion.div>
      </div>
    </section>
  );
}
