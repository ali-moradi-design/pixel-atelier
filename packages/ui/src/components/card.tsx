import { cx } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Media on top (an image or an illustration), shown edge to edge. */
  media?: ReactNode;
  /** Small mono overline above the title, e.g. `"Case study"`. */
  eyebrow?: ReactNode;
  /** The title. */
  title?: ReactNode;
  /** Supporting text under the title. */
  description?: ReactNode;
  /** Actions or meta at the bottom (buttons, badges, a link). */
  footer?: ReactNode;
  /**
   * Make the whole card a hover target: the border warms to the accent and
   * the media zooms in pixel steps. Put a link inside (e.g. in the title);
   * the card does not become a link itself.
   * @default false
   */
  interactive?: boolean;
}

/**
 * A container for one item: a project, a post, a product. Every part is
 * optional; children go between the description and the footer.
 *
 * @example
 * ```tsx
 * <Card media={<img src="/noir.jpg" alt="" />} eyebrow="Case study" title="Atelier Noir"
 *   description="A fashion house site built on the kit." interactive />
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    media,
    eyebrow,
    title,
    description,
    footer,
    interactive = false,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        "group/card relative flex flex-col overflow-hidden rounded-pb-lg border border-pb-border bg-pb-raised text-pb-text shadow-pb-1",
        interactive &&
          "pb-card-interactive transition-colors duration-pb-base hover:border-pb-accent/50 focus-within:border-pb-accent/50",
        className,
      )}
      {...props}
    >
      {media && (
        <div className="pb-card-media overflow-hidden [&>img]:block [&>img]:w-full [&>img]:object-cover">
          {media}
        </div>
      )}
      {(eyebrow || title || description || children) && (
        <div className="grid gap-1.5 p-4">
          {eyebrow && (
            <div className="font-pb-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-pb-muted">
              {eyebrow}
            </div>
          )}
          {title && (
            <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em]">{title}</h3>
          )}
          {description && (
            <p className="text-[0.8125rem] leading-relaxed text-pb-muted">
              {description}
            </p>
          )}
          {children}
        </div>
      )}
      {footer && (
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-pb-border px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
});
