import { cx } from "class-variance-authority";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** The items, in a row. They are repeated to fill the loop. */
  children: ReactNode;
  /**
   * Seconds for one full loop.
   * @default 30
   */
  duration?: number;
  /**
   * Scroll toward the end instead of the start.
   * @default false
   */
  reverse?: boolean;
  /**
   * Pause while hovered or focused.
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * Gap between items, any CSS length.
   * @default "2.5rem"
   */
  gap?: string;
}

/**
 * An endless horizontal ticker (logos, keywords). CSS only: the content is
 * rendered twice and translated; the copy is hidden from assistive
 * technology, and edges fade out. Under reduced motion it stops and becomes
 * scrollable.
 *
 * @example
 * ```tsx
 * <Marquee aria-label="Built with"><span>Tailwind v4</span><span>Radix</span><span>Motion</span></Marquee>
 * ```
 */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  pauseOnHover = true,
  gap = "2.5rem",
  className,
  style,
  ...props
}: MarqueeProps) {
  const track =
    "pa-marquee-track flex shrink-0 items-center gap-(--pa-gap) pe-(--pa-gap)";
  return (
    <div
      className={cx(
        "pa-marquee flex overflow-hidden",
        pauseOnHover && "pa-marquee-pause",
        reverse && "pa-marquee-reverse",
        className,
      )}
      style={
        { "--pa-gap": gap, "--pa-duration": `${duration}s`, ...style } as CSSProperties
      }
      {...props}
    >
      <div className={track}>{children}</div>
      <div className={track} aria-hidden="true" inert>
        {children}
      </div>
    </div>
  );
}
