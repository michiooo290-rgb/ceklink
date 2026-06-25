"use client";
import { useRef, useEffect, useCallback } from "react";

const PIXEL_SIZE = 4;
const GAP = 1;
const STEP = PIXEL_SIZE + GAP;
const MAX_ACTIVE = 30; // Reduced from 45
const SPAWN_CHANCE = 0.02; // Reduced from 0.03
const FADE_SPEED = 0.015; // Faster fade
const BASE_COLOR = { r: 0, g: 255, b: 136 };

export default function PixelCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const activeCells = useRef([]);
  const isVisible = useRef(true);
  const gridCache = useRef(null);
  const lastSize = useRef({ width: 0, height: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible.current) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const cols = Math.floor(width / STEP);
    const rows = Math.floor(height / STEP);

    // Clear only active cells area (not entire canvas)
    ctx.clearRect(0, 0, width, height);

    // Cache the base grid - only redraw if size changed
    if (!gridCache.current || lastSize.current.width !== width || lastSize.current.height !== height) {
      // Create offscreen canvas for grid
      const offscreen = new OffscreenCanvas(width, height);
      const offCtx = offscreen.getContext("2d");
      offCtx.fillStyle = "rgba(26, 26, 46, 0.35)";

      // Draw grid in chunks for better performance
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          offCtx.fillRect(c * STEP, r * STEP, PIXEL_SIZE, PIXEL_SIZE);
        }
      }

      gridCache.current = offscreen;
      lastSize.current = { width, height };
    }

    // Draw cached grid
    ctx.drawImage(gridCache.current, 0, 0);

    // Maybe spawn a new active cell
    if (activeCells.current.length < MAX_ACTIVE && Math.random() < SPAWN_CHANCE) {
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * rows);
      const exists = activeCells.current.some(
        (cell) => cell.col === col && cell.row === row
      );
      if (!exists) {
        activeCells.current.push({ col, row, alpha: 0.7 + Math.random() * 0.3 });
      }
    }

    // Draw & fade active cells
    activeCells.current = activeCells.current.filter((cell) => {
      const { r, g, b } = BASE_COLOR;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${cell.alpha})`;
      ctx.fillRect(cell.col * STEP, cell.row * STEP, PIXEL_SIZE, PIXEL_SIZE);

      if (cell.alpha > 0.5) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${cell.alpha * 0.15})`;
        ctx.fillRect(
          cell.col * STEP - GAP,
          cell.row * STEP - GAP,
          PIXEL_SIZE + GAP * 2,
          PIXEL_SIZE + GAP * 2
        );
      }

      cell.alpha -= FADE_SPEED;
      return cell.alpha > 0;
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced-motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible.current = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      // Invalidate grid cache on resize
      gridCache.current = null;
    };

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
