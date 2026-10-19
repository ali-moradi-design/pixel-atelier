"use client";

import { cx } from "class-variance-authority";
import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInView } from "../lib/motion.ts";
import { noise } from "../pixels/noise.ts";

export interface TextScrambleProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The final text. Changing it scrambles over to the new text. */
  text: string;
  /**
   * When it runs: once in view, on hover and focus, or only when `text`
   * changes.
   * @default "view"
   */
  trigger?: "view" | "hover" | "change";
  /**
   * Total duration in ms.
   * @default 720
   */
  duration?: number;
  /**
   * Characters used while scrambling.
   * @default "#%&*+=/<>[]{}01"
   */
  glyphs?: string;
}

/**
 * Text that decrypts from random glyphs, left to right, into the real words.
 * The final text is laid out invisibly underneath, so the width never jumps;
 * screen readers get the final text only. Frames update the DOM directly (no
 * React render per frame). Reduced motion shows the text at once.
 *
 * @example
 * ```tsx
 * <h1><TextScramble text="Crafted with care" /></h1>
 * ```
 */
export function TextScramble({
  text,
  trigger = "view",
  duration = 720,
  glyphs = "#%&*+=/<>[]{}01",
  className,
  ...props
}: TextScrambleProps) {
  const root = useRef<HTMLSpanElement>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const inView = useInView(root);
  const [runs, setRuns] = useState(0);
  const first = useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new text starts a run
  useEffect(() => {
    if (trigger === "change" && !first.current) setRuns((r) => r + 1);
    first.current = false;
  }, [text]);
  useEffect(() => {
    if (trigger === "view" && inView) setRuns((r) => r + 1);
  }, [trigger, inView]);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (runs === 0 || prefersReducedMotion()) {
      el.textContent = text;
      return;
    }
    const start = performance.now();
    let frame = 0;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      frame++;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i] ?? "";
        const at = i / text.length;
        if (ch === " " || at < p) out += ch;
        else
          out +=
            glyphs[
              Math.floor(noise(i * 7 + Math.floor(frame / 2) * 31) * glyphs.length)
            ] ?? "#";
      }
      el.textContent = out;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runs, text, duration, glyphs]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover and focus only replay a decorative effect
    <span
      ref={root}
      className={cx("relative inline-block", className)}
      onPointerEnter={trigger === "hover" ? () => setRuns((r) => r + 1) : undefined}
      onFocus={trigger === "hover" ? () => setRuns((r) => r + 1) : undefined}
      {...props}
    >
      <span className="invisible">{text}</span>
      <span ref={layer} aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
