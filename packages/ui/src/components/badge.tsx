import { cva, cx } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

/**
 * The class names of `Badge` for a given variant, for styling other
 * elements the same way, e.g. `className={badgeVariants({ variant: "accent" })}`.
 */
export const badgeVariants = cva(
  "inline-flex h-[1.375rem] items-center gap-1.5 whitespace-nowrap rounded-pa-xs border px-2 font-pa-mono text-[0.6875rem] font-medium leading-none tracking-[0.04em]",
  {
    variants: {
      variant: {
        neutral: "border-pa-border-strong text-pa-muted",
        accent: "border-transparent bg-pa-accent-subtle text-pa-accent",
        success: "border-transparent bg-pa-success/12 text-pa-success",
        warning: "border-transparent bg-pa-warning/14 text-pa-warning",
        danger: "border-transparent bg-pa-danger/12 text-pa-danger",
        info: "border-transparent bg-pa-info/12 text-pa-info",
        solid: "border-transparent bg-pa-text text-pa-bg",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Color and meaning.
   * - `"neutral"`: outlined, muted.
   * - `"accent"`: the current accent, for "New" and highlights.
   * - `"success"` | `"warning"` | `"danger"` | `"info"`: status colors.
   * - `"solid"`: inverted, for versions and counts.
   * @default "neutral"
   */
  variant?: "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "solid";
  /**
   * Shows a small square before the text, like a status light.
   * @default false
   */
  dot?: boolean;
}

/**
 * A short, non-interactive label for status or metadata. Text is set in the
 * mono face.
 *
 * @example
 * ```tsx
 * <Badge variant="success" dot>Live</Badge>
 * <Badge variant="solid">v1.0</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, dot, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden="true" className="size-1.5 bg-current" />}
      {children}
    </span>
  );
});
