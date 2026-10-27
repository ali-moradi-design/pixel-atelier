import { cva, cx } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

/**
 * The class names of `Badge` for a given variant, for styling other
 * elements the same way, e.g. `className={badgeVariants({ variant: "accent" })}`.
 */
// Tints are opaque (mixed with --pb-raised), so a badge keeps its contrast on
// any background, including a selected row that is tinted itself.
export const badgeVariants = cva(
  "inline-flex h-5.5 items-center gap-1.5 whitespace-nowrap rounded-pb-xs border px-2 font-pb-mono text-[0.6875rem] font-medium leading-none tracking-[0.04em]",
  {
    variants: {
      variant: {
        neutral: "border-pb-border-strong text-pb-muted",
        accent:
          "border-transparent bg-[color-mix(in_oklab,var(--pb-accent)_12%,var(--pb-raised))] text-pb-accent",
        success:
          "border-transparent bg-[color-mix(in_oklab,var(--pb-success)_12%,var(--pb-raised))] text-pb-success",
        warning:
          "border-transparent bg-[color-mix(in_oklab,var(--pb-warning)_14%,var(--pb-raised))] text-pb-warning",
        danger:
          "border-transparent bg-[color-mix(in_oklab,var(--pb-danger)_12%,var(--pb-raised))] text-pb-danger",
        info: "border-transparent bg-[color-mix(in_oklab,var(--pb-info)_12%,var(--pb-raised))] text-pb-info",
        solid: "border-transparent bg-pb-text text-pb-bg",
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
