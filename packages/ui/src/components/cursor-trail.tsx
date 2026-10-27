"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion.ts";

export interface CursorTrailProps {
  /**
   * Square size in CSS px; positions snap to this grid.
   * @default 10
   */
  size?: number;
  /**
   * How long a square lives, in ms.
   * @default 500
   */
  life?: number;
  /**
   * Square color; any CSS color.
   * @default "var(--pb-accent)"
   */
  color?: string;
}

/**
 * Pixel squares that trail the mouse and fade out, snapped to a grid (from
 * the portfolio). One fixed `<canvas>` that only animates while the pointer
 * moves; off on touch screens and under reduced motion. Purely decorative.
 *
 * @example
 * ```tsx
 * // once, e.g. in the layout of a landing page
 * <CursorTrail />
 * ```
 */
export function CursorTrail({
  size = 10,
  life = 500,
  color = "var(--pb-accent)",
}: CursorTrailProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || prefersReducedMotion() || !matchMedia("(pointer: fine)").matches)
      return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const fill = getComputedStyle(c).color;
    const cells = new Map<string, number>();
    let raf = 0;
    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = fill;
      for (const [key, born] of cells) {
        const age = (now - born) / life;
        if (age >= 1) {
          cells.delete(key);
          continue;
        }
        const [x, y] = key.split(",").map(Number) as [number, number];
        ctx.globalAlpha = Math.ceil((1 - age) * 4) / 4; // fades in 4 steps
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;
      raf = cells.size ? requestAnimationFrame(draw) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = Math.floor(e.clientX / size) * size;
      const y = Math.floor(e.clientY / size) * size;
      cells.set(`${x},${y}`, performance.now());
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [size, life]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ color }}
      className="pointer-events-none fixed inset-0 z-[2147483646] size-full"
    />
  );
}
