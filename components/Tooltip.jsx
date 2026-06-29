"use client";

import { useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Tooltip reusable — bisa dibungkus ke elemen apa aja yang butuh
 * penjelasan tambahan (istilah teknis, skor, dll).
 *
 * Pakai:
 *   <Tooltip text="Skor dihitung dari kombinasi reputasi domain...">
 *     <span>Skor</span>
 *   </Tooltip>
 *
 * Muncul saat HOVER maupun FOCUS (keyboard, tab) — bukan cuma mouse,
 * supaya tetap accessible buat user yang navigasi pakai keyboard.
 */
export default function Tooltip({ text, children, side = "top" }) {
  const [show, setShow] = useState(false);
  const id = useId();

  const positionClass =
    side === "bottom"
      ? "top-full mt-2"
      : side === "left"
      ? "right-full mr-2 top-1/2 -translate-y-1/2"
      : side === "right"
      ? "left-full ml-2 top-1/2 -translate-y-1/2"
      : "bottom-full mb-2"; // default: top

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <span tabIndex={0} aria-describedby={id} className="cursor-help outline-none">
        {children}
      </span>

      <AnimatePresence>
        {show && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-1/2 -translate-x-1/2 ${positionClass} z-50 w-56 px-3 py-2 rounded-lg text-[11px] leading-relaxed pointer-events-none`}
            style={{
              background: "rgba(19,19,31,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#c0c0d0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}