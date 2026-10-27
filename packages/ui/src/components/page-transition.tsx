"use client";

import { cx } from "class-variance-authority";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion.ts";
import { noise } from "../pixels/noise.ts";

type Run = (between?: () => void | Promise<void>) => Promise<void>;
let current: Run | null = null;

/**
 * Covers the screen with pixels, runs `between` (navigate, swap content),
 * then uncovers it. Needs one `<PixelTransition />` mounted. Resolves when
 * the screen is visible again. Without it mounted, it just calls `between`.
 *
 * @example
 * ```tsx
 * <a href="/work" onClick={(e) => { e.preventDefault(); pixelTransition(() => router.push("/work")); }}>Work</a>
 * ```
 */
export function pixelTransition(between?: () => void | Promise<void>) {
  if (!current) return Promise.resolve(between?.());
  return current(between);
}

export interface PixelTransitionProps {
  /**
   * Square size in CSS px.
   * @default 32
   */
  size?: number;
  /**
   * Duration of covering (and of uncovering) in ms.
   * @default 480
   */
  duration?: number;
  /**
   * Fill color; any CSS color.
   * @default "var(--pb-text)"
   */
  color?: string;
  /** Extra classes for the canvas. */
  className?: string;
}

/**
 * A full-screen pixel dissolve between pages, drawn on one fixed `<canvas>`
 * (not thousands of elements), started with `pixelTransition()`. Squares fill
 * in a noisy left-to-right sweep, then clear the same way. Reduced motion
 * turns it into a short plain fade.
 *
 * @example
 * ```tsx
 * // once, in the root layout
 * <PixelTransition />
 * ```
 */
export function PixelTransition({
  size = 32,
  duration = 480,
  color = "var(--pb-text)",
  className,
}: PixelTransitionProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const run: Run = async (between) => {
      const c = ref.current;
      const ctx = c?.getContext("2d");
      if (!c || !ctx) return void (await between?.());
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.display = "block";
      ctx.scale(dpr, dpr);
      ctx.fillStyle = getComputedStyle(c).color;
      const cols = Math.ceil(w / size);
      const rows = Math.ceil(h / size);
      const order = Array.from({ length: cols * rows }, (_, i) => ({
        i,
        t: ((i % cols) / cols) * 0.7 + noise(i) * 0.3,
      })).sort((a, b) => a.t - b.t);
      const reduced = prefersReducedMotion();
      const phase = (cover: boolean) =>
        new Promise<void>((done) => {
          if (reduced) {
            c.style.transition = "opacity 150ms";
            c.style.opacity = cover ? "1" : "0";
            if (cover) ctx.fillRect(0, 0, w, h);
            setTimeout(done, 150);
            return;
          }
          c.style.opacity = "1";
          const start = performance.now();
          let drawn = 0;
          const tick = (now: number) => {
            const target = Math.min(
              order.length,
              Math.ceil(((now - start) / duration) * order.length),
            );
            for (; drawn < target; drawn++) {
              const cell = order[drawn]?.i ?? 0;
              const x = (cell % cols) * size;
              const y = Math.floor(cell / cols) * size;
              if (cover) ctx.fillRect(x, y, size, size);
              else ctx.clearRect(x, y, size, size);
            }
            if (drawn < order.length) requestAnimationFrame(tick);
            else done();
          };
          requestAnimationFrame(tick);
        });
      await phase(true);
      await between?.();
      await phase(false);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      c.style.display = "none";
    };
    current = run;
    return () => {
      if (current === run) current = null;
    };
  }, [size, duration]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ color, display: "none" }}
      className={cx(
        "pointer-events-none fixed inset-0 z-[2147483647] size-full",
        className,
      )}
    />
  );
}
