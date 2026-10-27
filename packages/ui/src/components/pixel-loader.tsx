import { cx } from "class-variance-authority";
import type { CSSProperties, HTMLAttributes } from "react";
import { noise } from "../pixels/noise.ts";

export interface PixelLoaderProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Animation.
   * - `"snake"`: an accent head runs clockwise around a 3 x 3 grid with a
   *   fading tail (indeterminate work, e.g. loading a list).
   * - `"pulse"`: rings ripple out from an accent center (waiting on a reply).
   * - `"noise"`: a 12 x 2 strip flickers like static (processing data).
   * @default "snake"
   */
  variant?: "snake" | "pulse" | "noise";
  /**
   * Square size in px.
   * @default 6
   */
  size?: number;
  /**
   * Accessible name (`role="status"`).
   * @default "Loading"
   */
  label?: string;
}

/**
 * Pixel loaders, CSS only, colored by `currentColor` with accent squares.
 * Every animation starts mid-cycle, so a loader is already moving on its
 * first frame. They slow down under reduced motion.
 *
 * @example
 * ```tsx
 * <PixelLoader variant="pulse" size={10} label="Loading projects" />
 * ```
 */
export function PixelLoader({
  variant = "snake",
  size = 6,
  label = "Loading",
  className,
  style,
  ...props
}: PixelLoaderProps) {
  const ring = [0, 1, 2, 5, 8, 7, 6, 3];
  const cells =
    variant === "noise"
      ? Array.from({ length: 24 }, (_, i) => ({
          area: undefined as string | undefined,
          delay: Math.round(noise(i * 3) * 900) - 900,
          accent: i === 9 || i === 18,
          hidden: false,
        }))
      : Array.from({ length: 9 }, (_, i) => ({
          area: `${Math.floor(i / 3) + 1} / ${(i % 3) + 1}`,
          // Snake: the head runs clockwise, one cell per 120 ms.
          // Pulse: rings ripple out from the center, 150 ms apart.
          delay:
            variant === "snake"
              ? ring.indexOf(i) * 120 - 960
              : (Math.abs((i % 3) - 1) + Math.abs(Math.floor(i / 3) - 1)) * 150 - 1200,
          accent: variant === "pulse" && i === 4,
          hidden: variant === "snake" && i === 4,
        }));
  return (
    <span
      role="status"
      aria-label={label}
      data-variant={variant}
      className={cx("pb-loader inline-grid", className)}
      style={
        {
          "--pb-cell": `${size}px`,
          gridTemplateColumns: `repeat(${variant === "noise" ? 12 : 3}, var(--pb-cell))`,
          gap: Math.max(1, Math.round(size / 3)),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {cells.map((c, i) => (
        <i
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid
          key={i}
          data-accent={c.accent || undefined}
          data-hidden={c.hidden || undefined}
          style={{ gridArea: c.area, animationDelay: `${c.delay}ms` }}
        />
      ))}
    </span>
  );
}
