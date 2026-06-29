"use client";

import { motion } from "framer-motion";

const lineInitial = { top: "0%", opacity: 0.85 };
const lineAnim = { top: ["0%", "100%", "0%"], opacity: [0.85, 1, 0.85] };
const lineTransition = { duration: 1.8, repeat: Infinity, ease: "easeInOut" };

const barAnim = { height: [6, 18, 6] };

function barTransition(i) {
  return {
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut",
    delay: i * 0.12,
  };
}

export default function AnimatedScanLoader({ label = "Memindai URL\u2026" }) {
  return (
    <div
      className="relative mt-6 mx-auto w-full max-w-md overflow-hidden rounded-xl border border-[#2e3348] bg-[#12151f]/70 px-6 py-8"
      role="status"
      aria-live="polite"
    >
      <motion.span
        className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2DCB85] to-transparent"
        initial={lineInitial}
        animate={lineAnim}
        transition={lineTransition}
        aria-hidden="true"
      />
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-end gap-1 h-5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="block w-1 rounded-full bg-[#2DCB85]"
              animate={barAnim}
              transition={barTransition(i)}
            />
          ))}
        </div>
        <span className="font-mono text-sm text-[#a0a5b8]">{label}</span>
      </div>
    </div>
  );
}
