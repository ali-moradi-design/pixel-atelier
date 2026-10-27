import { cva, cx } from "class-variance-authority";
import { type AnchorHTMLAttributes, forwardRef } from "react";
import { Slot } from "../lib/slot.tsx";

/**
 * The class names of `Link` for a given variant, for styling other
 * elements the same way, e.g. `className={linkVariants({ variant: "pixel" })}`.
 */
export const linkVariants = cva(
  "rounded-pb-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pb-accent",
  {
    variants: {
      variant: {
        /** Classic underline that turns to the accent. */
        underline:
          "text-pb-text underline decoration-pb-border-strong decoration-1 underline-offset-4 transition-colors duration-pb-fast hover:text-pb-accent hover:decoration-pb-accent",
        /** A hairline that fills in eight pixel steps on hover or focus. */
        pixel: "pb-link-px text-pb-text hover:text-pb-accent",
        /** No decoration (navigation, cards). */
        plain:
          "text-inherit no-underline hover:text-pb-accent transition-colors duration-pb-fast",
      },
    },
    defaultVariants: { variant: "underline" },
  },
);

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Decoration.
   * - `"underline"`: a quiet underline that turns to the accent on hover.
   * - `"pixel"`: a hairline that fills in eight pixel steps on hover or focus.
   * - `"plain"`: no decoration (navigation, cards); color changes on hover.
   * @default "underline"
   */
  variant?: "underline" | "pixel" | "plain";
  /**
   * Render the only child element (for example Next.js `<Link>`) with the
   * link styles instead of an `<a>`.
   * @default false
   */
  asChild?: boolean;
}

/**
 * A text link. All native anchor props (`href`, `target`, `rel`…) are passed
 * through.
 *
 * @example
 * ```tsx
 * <Link href="/docs">Read the docs</Link>
 * <Link variant="pixel" asChild><NextLink href="/about">About</NextLink></Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, variant, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp ref={ref} className={cx(linkVariants({ variant }), className)} {...props} />
  );
});
