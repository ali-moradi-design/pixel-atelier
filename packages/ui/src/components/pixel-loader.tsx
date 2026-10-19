import { cx } from "class-variance-authority";
import type { CSSProperties, HTMLAttributes } from "react";
import { noise } from "../pixels/noise.ts";

export interface PixelLoaderProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Animation.
   * - `"snake"`: a trail chases around a 3 x 3 grid.
   * - `"pulse"`: the grid breathes from the center out.
   * - `"noise"`: a 12 x 2 strip flickers like static.
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
 * Pixel loaders, CSS only, colored by `currentColor` with one accent square.
 * They slow down under reduced motion.
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
          area: undefined,
          delay: Math.round(noise(i * 3) * 900),
          accent: i === 9,
        }))
      : Array.from({ length: 9 }, (_, i) => ({
          area: `${Math.floor(i / 3) + 1} / ${(i % 3) + 1}`,
          delay:
            variant === "snake"
              ? (ring.indexOf(i) < 0 ? 0 : ring.indexOf(i)) * 100
              : (Math.abs((i % 3) - 1) + Math.abs(Math.floor(i / 3) - 1)) * 160,
          accent: i === 4,
        }));
  return (
    <span
      role="status"
      aria-label={label}
      data-variant={variant}
      className={cx("pa-loader inline-grid", className)}
      style={
        {
          "--pa-cell": `${size}px`,
          gridTemplateColumns: `repeat(${variant === "noise" ? 12 : 3}, var(--pa-cell))`,
          gap: Math.max(1, Math.round(size / 3)),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {cells.map((c, i) =>
        variant === "snake" && i === 4 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid
          <i key={i} style={{ gridArea: c.area, opacity: 0 }} />
        ) : (
          <i
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid
            key={i}
            data-accent={c.accent || undefined}
            style={{ gridArea: c.area, animationDelay: `${c.delay - 2000}ms` }}
          />
        ),
      )}
    </span>
  );
}
