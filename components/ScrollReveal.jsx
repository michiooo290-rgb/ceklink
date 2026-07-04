"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — memberi efek fade/slide-in halus pada tiap <section>
 * saat masuk viewport. Non-invasif: tidak mengubah komponen lain,
 * cukup di-mount sekali di layout. Menghormati prefers-reduced-motion.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Lewati section pertama (hero/atas layar) supaya tidak flash saat load
    const sections = Array.from(document.querySelectorAll("main section")).slice(1);
    if (sections.length === 0) return;

    sections.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    sections.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
