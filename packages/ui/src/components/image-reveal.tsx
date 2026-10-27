"use client";

import { cx } from "class-variance-authority";
import { type ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInView } from "../lib/motion.ts";

export interface PixelImageRevealProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Image URL. */
  src: string;
  /** Alternative text, as for any image (empty for decorative ones). */
  alt: string;
  /**
   * When the reveal runs: when the image scrolls into view, or on hover and
   * focus of the image's container (it then goes back to the mosaic).
   * @default "view"
   */
  trigger?: "view" | "hover";
  /**
   * Block sizes in px, from coarse to fine, before the sharp image.
   * @default [32, 16, 8, 4]
   */
  steps?: number[];
  /**
   * Total duration of the reveal in ms.
   * @default 600
   */
  duration?: number;
  /** Classes for the wrapper (size it here; the image covers it). */
  wrapperClassName?: string;
}

/**
 * An image that resolves from a coarse pixel mosaic to sharp, in a few
 * stepped frames. One `<canvas>` over a normal `<img>` (so the image keeps its
 * alt text, lazy loading and SEO); the canvas only draws and never reads
 * pixels, so cross-origin images work. With reduced motion the image just
 * appears.
 *
 * @example
 * ```tsx
 * <PixelImageReveal src="/work/noir.jpg" alt="Atelier Noir home page" wrapperClassName="aspect-4/5" />
 * ```
 */
export function PixelImageReveal({
  src,
  alt,
  trigger = "view",
  steps = [32, 16, 8, 4],
  duration = 600,
  className,
  wrapperClassName,
  onLoad,
  ...props
}: PixelImageRevealProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrap);
  const [loaded, setLoaded] = useState(false);
  const [sharp, setSharp] = useState(false);
  const [hover, setHover] = useState(false);
  const active = trigger === "view" ? inView : hover;

  // A cached image can finish loading before React attaches onLoad.
  useEffect(() => {
    const i = img.current;
    if (i?.complete && i.naturalWidth > 0) setLoaded(true);
  }, []);

  useEffect(() => {
    const c = canvas.current;
    const i = img.current;
    if (!c || !i || !loaded) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const tmp = document.createElement("canvas");
    const t = tmp.getContext("2d");
    // object-fit: cover crop of the source
    const nw = i.naturalWidth || w;
    const nh = i.naturalHeight || h;
    const scale = Math.max(w / nw, h / nh);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (nw - sw) / 2;
    const sy = (nh - sh) / 2;
    const draw = (block: number) => {
      tmp.width = Math.max(1, Math.ceil(w / block));
      tmp.height = Math.max(1, Math.ceil(h / block));
      t?.drawImage(i, sx, sy, sw, sh, 0, 0, tmp.width, tmp.height);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(tmp, 0, 0, c.width, c.height);
    };
    if (!active) {
      setSharp(false);
      draw(steps[0] ?? 32);
      return;
    }
    if (prefersReducedMotion()) {
      setSharp(true);
      return;
    }
    let k = 0;
    draw(steps[0] ?? 32);
    const every = duration / (steps.length + 1);
    const id = setInterval(() => {
      k++;
      const block = steps[k];
      if (block === undefined) {
        clearInterval(id);
        setSharp(true);
      } else draw(block);
    }, every);
    return () => clearInterval(id);
  }, [active, loaded, steps, duration]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the listeners only observe hover and focus of the content
    <div
      ref={wrap}
      className={cx("relative overflow-hidden", wrapperClassName)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <img
        ref={img}
        src={src}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cx("block size-full object-cover", className)}
        {...props}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-0 size-full transition-opacity duration-pb-fast [image-rendering:pixelated]",
          sharp ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
