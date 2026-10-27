"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { pixelDelays } from "./noise.ts";

export interface PixelsProps {
  /**
   * Target square size in px. The grid is fitted to the host's size on the
   * first interaction; very large hosts get bigger squares (at most 320).
   * @default 9
   */
  size?: number;
  /** Fixed number of columns; overrides `size` horizontally. */
  cols?: number;
  /** Fixed number of rows; overrides `size` vertically. */
  rows?: number;
  /** Extra classes for the square grid (e.g. `opacity-60`). */
  className?: string;
}

/** More squares than this get larger instead (keeps big hosts cheap). */
const MAX_SQUARES = 320;
const ACTIVE =
  ':hover, :focus-visible, [data-px-active], [aria-expanded="true"], [data-state="open"], [data-highlighted]';

/**
 * The pixel dissolve: a grid of squares behind the host's content that switch
 * on left to right with noise when the host is hovered, focused or open (see
 * styles/pixels.css). Put it as the first child of an element with the
 * `pb-px-host` class.
 *
 * The squares are created on the host's first hover or focus, never on page
 * load, so a page full of buttons adds no extra nodes until someone interacts.
 *
 * The host sets the colors with CSS variables: `--px-fill` (squares) and
 * `--px-ink` (text color once filled).
 *
 * @example
 * ```tsx
 * <a className="pb-px-host [--px-fill:var(--pb-accent)]" href="/work">
 *   <Pixels />
 *   Work
 * </a>
 * ```
 */
export function Pixels({ size = 9, cols, rows, className }: PixelsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [grid, setGrid] = useState<readonly [number, number] | null>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (grid || !host) return;
    const wake = () => {
      let c = cols ?? Math.max(1, Math.round(host.offsetWidth / size));
      let r = rows ?? Math.max(1, Math.round(host.offsetHeight / size));
      const k = Math.sqrt((c * r) / MAX_SQUARES);
      if (k > 1) {
        c = Math.max(1, Math.round(c / k));
        r = Math.max(1, Math.round(r / k));
      }
      setGrid([c, r]);
    };
    if (host.matches(ACTIVE)) {
      wake();
      return;
    }
    host.addEventListener("pointerenter", wake);
    host.addEventListener("focusin", wake);
    return () => {
      host.removeEventListener("pointerenter", wake);
      host.removeEventListener("focusin", wake);
    };
  }, [grid, cols, rows, size]);

  const style = grid
    ? ({ "--pb-px-cols": grid[0], "--pb-px-rows": grid[1] } as CSSProperties)
    : undefined;
  return (
    <span
      ref={ref}
      className={className ? `pb-px ${className}` : "pb-px"}
      aria-hidden="true"
      data-pb-pixels=""
      style={style}
    >
      {grid &&
        pixelDelays(grid[0], grid[1]).map((d, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: squares never reorder
          <i key={i} style={{ "--d": `${d}ms` } as CSSProperties} />
        ))}
    </span>
  );
}
