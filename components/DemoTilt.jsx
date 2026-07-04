"use client";

import { useEffect } from "react";

/**
 * Efek 3D interaktif untuk kartu demo di hero (.url-demo-wrap).
 * - Kartu memiringkan diri mengikuti posisi kursor (tilt 3D).
 * - Ada pantulan cahaya (glare) yang bergerak mengikuti mouse.
 * - Tidak menyentuh Hero.jsx: komponen ini mencari kartunya di DOM.
 * - Nonaktif untuk perangkat sentuh & pengguna "reduce motion".
 * - Memakai inline !important agar pasti tampil (tidak ketimpa CSS lain).
 */
export default function DemoTilt() {
  useEffect(() => {
    const scope = document.querySelector(".hero-demo");
    const card = document.querySelector(".url-demo-wrap");
    if (!scope || !card) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (reduce || !canHover) return;

    const MAX = 12; // derajat kemiringan maksimum
    let raf = 0;

    // Elemen pantulan cahaya (glare)
    const glare = document.createElement("div");
    glare.className = "tilt-glare";
    card.appendChild(glare);

    card.style.setProperty("animation", "none", "important");
    card.style.setProperty(
      "transition",
      "transform 0.2s ease-out, box-shadow 0.4s ease-out",
      "important"
    );
    card.style.setProperty("transform-style", "preserve-3d", "important");

    const rest = () => {
      card.style.setProperty(
        "transform",
        "perspective(1200px) rotateX(4deg) rotateY(-9deg)",
        "important"
      );
      glare.style.opacity = "0";
    };

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const ry = (px - 0.5) * 2 * MAX; // rotateY
      const rx = -(py - 0.5) * 2 * MAX; // rotateX
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty(
          "transform",
          `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
            2
          )}deg) translateY(-6px) scale(1.03)`,
          "important"
        );
        glare.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        glare.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        glare.style.opacity = "1";
      });
    };

    rest();
    scope.addEventListener("mousemove", onMove);
    scope.addEventListener("mouseleave", rest);

    return () => {
      cancelAnimationFrame(raf);
      scope.removeEventListener("mousemove", onMove);
      scope.removeEventListener("mouseleave", rest);
      glare.remove();
    };
  }, []);

  return null;
}
