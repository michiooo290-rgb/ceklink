"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Siren } from "lucide-react";

const PHISHING_DATA = [
  { link: "bit.ly/bca-promo2026", target: "BCA", status: "danger", date: "2 jam lalu" },
  { link: "tokoped1a-sale.com", target: "Tokopedia", status: "danger", date: "4 jam lalu" },
  { link: "shopee-promo.link/voucher", target: "Shopee", status: "warn", date: "6 jam lalu" },
  { link: "bri-mobile-update.xyz", target: "BRI", status: "danger", date: "8 jam lalu" },
  { link: "grab-voucher.gratis", target: "Grab", status: "warn", date: "12 jam lalu" },
  { link: "dana-verifikasi-akun.top", target: "DANA", status: "danger", date: "1 hari lalu" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PhishingDB() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="database" className="py-16 sm:py-24" aria-label="Database phising terbaru">
      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 flex items-center justify-center gap-3">
            <Siren size={28} className="text-[#E55C30]" aria-hidden="true" />
            Phising Terbaru di Indonesia
          </h2>
          <p className="text-[#666680]">
            Contoh data ilustrasi — bukan data real-time
          </p>
        </motion.div>

        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-4 gap-4 px-6 py-3 border-b border-[#2e3348] text-[#666680] text-sm font-medium">
            <span>Link</span>
            <span>Target</span>
            <span>Waktu</span>
            <span className="text-center">Status</span>
          </div>

          {/* Table Rows */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {PHISHING_DATA.map((item, i) => (
              <motion.div
                key={i}
                variants={rowVariants}
                className="table-row grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 px-6 py-4 border-b border-[#2e3348]/30 items-center"
                whileHover={{
                  backgroundColor: "rgba(0, 255, 136, 0.03)",
                  transition: { duration: 0.2 },
                }}
              >
                <div className="font-mono text-sm text-[#e0e0e0] break-all">
                  {item.link}
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
                  <span
                    className={
                      item.status === "danger"
                        ? "badge-danger inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        : "badge-warn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: item.status === "danger" ? "#E55C30" : "#F5A623",
                      }}
                      aria-hidden="true"
                    />
                    {item.status === "danger" ? "Bahaya" : "Waspada"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-[#666680] text-sm">
            Total{" "}
            <span className="text-[#2DCB85] font-semibold">892</span>{" "}
            link phising telah dilaporkan dan divalidasi oleh komunitas
          </p>
          <p className="text-[10px] text-[#555570] mt-1">
            * Data ilustrasi — bukan data real-time
          </p>
        </motion.div>
      </div>
    </section>
  );
}
