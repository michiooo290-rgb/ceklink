"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link2, FileText } from "lucide-react";
import URLScanner from "./URLScanner";
import FileScanner from "./FileScanner";

const TABS = [
  { id: "link", label: "Cek Link", icon: Link2 },
  { id: "file", label: "Cek File", icon: FileText },
];

export default function ScannerTabs() {
  const [active, setActive] = useState("link");

  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash;
      if (h === "#cek-file" || h === "#cek-link") {
        setActive(h === "#cek-file" ? "file" : "link");
        requestAnimationFrame(() => {
          const el = document.getElementById("scanner");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <section id="scanner" className="relative pt-8 sm:pt-10 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center">
          <div
            className="inline-flex gap-1 rounded-2xl border border-[#2a2a4a] bg-[#0d0d1f] p-1.5"
            role="tablist"
            aria-label="Pilih jenis pemeriksaan"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab.id)}
                  className={
                    "relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors " +
                    (isActive ? "text-[#0a0a16]" : "text-[#8888aa] hover:text-white")
                  }
                >
                  {isActive && (
                    <motion.span
                      layoutId="scanner-tab-pill"
                      className="absolute inset-0 rounded-xl bg-[#2DCB85]"
                      transition={ { type: "spring", stiffness: 400, damping: 32 } }
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon size={16} aria-hidden="true" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={(active === "link" ? "block" : "hidden") + " [&>section]:pt-6 sm:[&>section]:pt-8"}>
        <URLScanner />
      </div>
      <div className={(active === "file" ? "block" : "hidden") + " [&>section]:pt-6 sm:[&>section]:pt-8"}>
        <FileScanner />
      </div>
    </section>
  );
}
