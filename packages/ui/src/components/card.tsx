import { cx } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

// Card parts are plain elements with classes: no context and no client code,
// so a card stays a server component and costs nothing at runtime.

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
 * A container for one item: a project, a post, a product. Use it in two ways:
 *
 * - Shortcut props: `media`, `eyebrow`, `title`, `description`, `footer`;
 *   any children go between the description and the footer.
 * - Composition: leave the props out and build the card from its parts
 *   (`CardMedia`, `CardHeader`, `CardEyebrow`, `CardTitle`,
 *   `CardDescription`, `CardContent`, `CardFooter`) in any order.
 *
 * @example
 * ```tsx
 * <Card media={<img src="/noir.jpg" alt="" />} eyebrow="Case study" title="Atelier Noir"
 *   description="A fashion house site built on the kit." interactive />
 *
 * <Card interactive>
 *   <CardMedia><img src="/noir.jpg" alt="" /></CardMedia>
 *   <CardHeader>
 *     <CardEyebrow>Case study</CardEyebrow>
 *     <CardTitle>Atelier Noir</CardTitle>
 *     <CardDescription>A fashion house site built on the kit.</CardDescription>
 *   </CardHeader>
 *   <CardFooter><Badge>2026</Badge></CardFooter>
 * </Card>
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
  const shortcut = Boolean(eyebrow || title || description);
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
      {media && <CardMedia>{media}</CardMedia>}
      {shortcut ? (
        <CardHeader>
          {eyebrow && <CardEyebrow>{eyebrow}</CardEyebrow>}
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {children}
        </CardHeader>
      ) : (
        children
      )}
      {footer && <CardFooter>{footer}</CardFooter>}
    </div>
  );
});

/** Media at the top of a `Card`, edge to edge; zooms on interactive cards. */
export function CardMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "pb-card-media overflow-hidden [&>img]:block [&>img]:w-full [&>img]:object-cover",
        className,
      )}
      {...props}
    />
  );
}

/** The padded block that holds the eyebrow, title and description of a `Card`. */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("grid gap-1.5 p-4", className)} {...props} />;
}

/** Small mono overline above a card title, e.g. "Case study". */
export function CardEyebrow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "font-pb-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-pb-muted",
        className,
      )}
      {...props}
    />
  );
}

/** The title of a `Card`, an `<h3>`. */
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cx("text-[0.9375rem] font-medium tracking-[-0.01em]", className)}
      {...props}
    />
  );
}

/** Supporting text under a card title. */
export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cx("text-[0.8125rem] leading-relaxed text-pb-muted", className)}
      {...props}
    />
  );
}

/** Free content of a `Card` with the card's padding (lists, stats, forms). */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("px-4 pb-4", className)} {...props} />;
}

/** Actions or meta at the bottom of a `Card`, above a hairline. */
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "mt-auto flex flex-wrap items-center gap-2 border-t border-pb-border px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
