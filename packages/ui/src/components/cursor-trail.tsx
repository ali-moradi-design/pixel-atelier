"use client";

import { cx } from "class-variance-authority";
import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "../lib/motion.ts";

export interface CursorTrailProps {
  /**
   * Square size in CSS px; positions snap to this grid.
   * @default 6
   */
  size?: number;
  /**
   * How long a square lives, in ms.
   * @default 420
   */
  life?: number;
  /**
   * Square color; any CSS color.
   * @default "var(--pb-accent)"
   */
  color?: string;
  /** Extra classes for the canvas (e.g. a `z-*` utility to change its layer). */
  className?: string;
}

/**
 * Small pixel squares that trail the mouse: each one shrinks toward its
 * center and fades out in pixel steps, snapped to a grid. Fast moves are
 * filled in along the path, so the trail never breaks into gaps. One fixed
 * `<canvas>` that only animates while squares are alive; off on touch
 * screens and under reduced motion. Purely decorative.
 *
 * @example
 * ```tsx
 * // once, e.g. in the layout of a landing page
 * <CursorTrail />
 * ```
 */
export function CursorTrail({
  size = 6,
  life = 420,
  color = "var(--pb-accent)",
  className,
}: CursorTrailProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || prefersReducedMotion() || !hasFinePointer()) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const fill = getComputedStyle(c).color;
    // Cell key (packed x/y on the grid) -> birth time.
    const cells = new Map<number, number>();
    const key = (gx: number, gy: number) => gx * 65536 + gy;
    let last: [number, number] | null = null;
    let raf = 0;
    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = fill;
      for (const [k, born] of cells) {
        const age = (now - born) / life;
        if (age >= 1) {
          cells.delete(k);
          continue;
        }
        // Shrinks and fades in 4 pixel steps.
        const step = Math.ceil((1 - age) * 4) / 4;
        const s = Math.max(1, Math.round(size * step));
        const o = (size - s) / 2;
        ctx.globalAlpha = 0.25 + step * 0.75;
        ctx.fillRect(Math.floor(k / 65536) * size + o, (k % 65536) * size + o, s, s);
      }
      ctx.globalAlpha = 1;
      raf = cells.size ? requestAnimationFrame(draw) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const gx = Math.floor(e.clientX / size);
      const gy = Math.floor(e.clientY / size);
      const now = performance.now();
      // Fill the grid cells between the last and this position.
      const [lx, ly] = last ?? [gx, gy];
      const n = Math.min(24, Math.max(Math.abs(gx - lx), Math.abs(gy - ly)));
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        cells.set(
          key(Math.round(lx + (gx - lx) * t), Math.round(ly + (gy - ly) * t)),
          now - (1 - t) * 60,
        );
      }
      cells.set(key(gx, gy), now);
      last = [gx, gy];
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      last = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [size, life]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ color }}
      className={cx(
        "pointer-events-none fixed inset-0 z-2147483646 size-full",
        className,
      )}
    />
  );
}
