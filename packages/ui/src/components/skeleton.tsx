import { cx } from "class-variance-authority";
import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Shape preset. `"text"` is a line at the current font size, `"block"` fills
   * the size you give it (use classes like `h-24 w-full`), `"square"` is an
   * avatar-sized square.
   * @default "block"
   */
  shape?: "text" | "block" | "square";
}

/**
 * A placeholder while content loads: a quiet block with a band of pixels
 * sweeping across in steps. CSS only. Hidden from screen readers; announce
 * loading elsewhere (for example `aria-busy` on the region).
 *
 * @example
 * ```tsx
 * <div aria-busy="true" className="flex gap-3">
 *   <Skeleton shape="square" />
 *   <div className="grid flex-1 gap-2"><Skeleton shape="text" className="w-2/3" /><Skeleton shape="text" /></div>
 * </div>
 * ```
 */
export function Skeleton({ shape = "block", className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "pa-skeleton rounded-[2px]",
        shape === "text" ? "h-[0.8em] w-full" : shape === "square" ? "size-9" : "min-h-4",
        className,
      )}
      {...props}
    />
  );
}
