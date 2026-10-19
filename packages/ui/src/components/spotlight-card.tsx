"use client";

import { cx } from "class-variance-authority";
import {
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
  useRef,
} from "react";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Radius of the glow in px.
   * @default 260
   */
  radius?: number;
  /**
   * Also reveal a fine pixel grid under the pointer.
   * @default true
   */
  grid?: boolean;
}

/**
 * A card with a soft accent glow (and a pixel grid) that follows the pointer.
 * The position is written to CSS variables on pointer move, so React never
 * re-renders; keyboard focus inside the card lights it from the center.
 *
 * @example
 * ```tsx
 * <SpotlightCard className="p-6"><h3>Follows the pointer</h3></SpotlightCard>
 * ```
 */
export function SpotlightCard({
  radius = 260,
  grid = true,
  className,
  children,
  onPointerMove,
  style,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--pa-x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--pa-y", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      style={{ "--pa-r": `${radius}px`, ...style } as CSSProperties}
      className={cx(
        "pa-spotlight group/spot relative isolate overflow-hidden rounded-pa-lg border border-pa-border bg-pa-surface",
        grid && "pa-spotlight-grid",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
