"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Membungkus seluruh halaman supaya scroll (mouse wheel / trackpad) terasa
 * halus dengan efek inersia, bukan lompat-lompat kaku bawaan browser.
 *
 * Taruh sekali saja di root layout — komponen ini tidak render apa-apa
 * (return null), cuma jalankan efeknya di background.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Hormati preferensi user yang matikan animasi di OS-nya.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,       // makin besar = makin "berat"/lambat berhenti
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    // Kalau GSAP ScrollTrigger dipakai di halaman (lihat components/ScrollReveal.jsx),
    // beri tahu ScrollTrigger untuk update posisi tiap kali Lenis scroll,
    // supaya animasi berbasis scroll tetap sinkron dan tidak "lag".
    let scrollTrigger;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      scrollTrigger = ScrollTrigger;
      lenis.on("scroll", ScrollTrigger.update);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTrigger) lenis.off("scroll", scrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return null;
}