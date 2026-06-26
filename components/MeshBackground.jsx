"use client";

/**
 * MeshBackground — Pure CSS animated gradient mesh
 *
 * Lightweight alternative to Three.js ColorBends.
 * Uses CSS blurred orbs + SVG noise for organic depth.
 *
 * @param {"default"|"warm"|"cool"} variant - color scheme
 * @param {"subtle"|"medium"} intensity - opacity level
 */

const VARIANTS = {
  default: {
    orb1: "var(--color-accent)",     // amber
    orb2: "var(--color-secondary)",  // teal
    orb3: "var(--color-tertiary)",   // coral
  },
  warm: {
    orb1: "#F5A623",  // amber
    orb2: "#E55C30",  // coral
    orb3: "#D4870A",  // deep amber
  },
  cool: {
    orb1: "#2DCB85",  // teal
    orb2: "#06b6d4",  // cyan
    orb3: "#8a5cff",  // purple
  },
};

const INTENSITY = {
  subtle: { opacity: 0.05, blur: 80 },
  medium: { opacity: 0.08, blur: 60 },
};

export default function MeshBackground({ variant = "default", intensity = "subtle" }) {
  const colors = VARIANTS[variant] || VARIANTS.default;
  const level = INTENSITY[intensity] || INTENSITY.subtle;

  return (
    <div className="mesh-bg" aria-hidden="true">
      <div
        className="mesh-orb mesh-orb-1"
        style={{ background: colors.orb1, opacity: level.opacity, filter: `blur(${level.blur}px)` }}
      />
      <div
        className="mesh-orb mesh-orb-2"
        style={{ background: colors.orb2, opacity: level.opacity * 0.8, filter: `blur(${level.blur}px)` }}
      />
      <div
        className="mesh-orb mesh-orb-3"
        style={{ background: colors.orb3, opacity: level.opacity * 0.6, filter: `blur(${level.blur * 1.2}px)` }}
      />
      {/* SVG Noise Texture */}
      <svg className="mesh-noise" xmlns="http://www.w3.org/2000/svg">
        <filter id="mesh-noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mesh-noise-filter)" />
      </svg>
    </div>
  );
}
