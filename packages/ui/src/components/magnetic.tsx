"use client";

import { type ReactElement, useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "../lib/motion.ts";
import { Slot } from "../lib/slot.tsx";

export interface MagneticProps {
  /** The element to pull, usually a `Button`. */
  children: ReactElement;
  /**
   * How strongly it follows: 0 none, 1 all the way to the pointer.
   * @default 0.3
   */
  strength?: number;
  /**
   * Distance in px around the element where the pull starts.
   * @default 80
   */
  radius?: number;
  /** Extra classes, merged into the child element. */
  className?: string;
}

/**
 * Pulls its child toward the pointer when it comes close, and lets it spring
 * back. Only on devices with a fine pointer and without reduced motion; the
 * transform is set directly (no React render per frame).
 *
 * @example
 * ```tsx
 * <Magnetic><Button variant="primary">Start a project</Button></Magnetic>
 * ```
 */
export function Magnetic({
  children,
  strength = 0.3,
  radius = 80,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1)
        raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const near =
        Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius;
      tx = near ? dx * strength : 0;
      ty = near ? dy * strength : 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      el.style.translate = "";
    };
  }, [strength, radius]);
  return (
    <Slot ref={ref} className={className}>
      {children}
    </Slot>
  );
}
