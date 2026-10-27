import { cx } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "../components/badge.tsx";
import { TextScramble } from "../components/text-scramble.tsx";

export interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Small label above the title, shown as an accent badge. */
  eyebrow?: ReactNode;
  /**
   * The main heading (an `<h1>`). A string can decrypt in with `scramble`.
   */
  title: ReactNode;
  /** Supporting paragraph under the title. */
  description?: ReactNode;
  /** Calls to action, usually one primary and one secondary `Button`. */
  actions?: ReactNode;
  /** Visual on the end side (an image, a `SpotlightCard`, a product shot). */
  media?: ReactNode;
  /**
   * Decrypt the title with `TextScramble` when it enters the view (string
   * titles only).
   * @default false
   */
  scramble?: boolean;
  /**
   * `"split"`: text and media side by side on wide screens. `"center"`:
   * centered text, media below.
   * @default "split"
   */
  layout?: "split" | "center";
}

/**
 * The first section of a landing page: eyebrow, large light heading, text,
 * actions and an optional visual. Pure layout, no client code of its own.
 *
 * @example
 * ```tsx
 * <Hero
 *   eyebrow="v1.0"
 *   title="Pixels, crafted with care."
 *   scramble
 *   description="A calm React UI kit."
 *   actions={<><Button variant="primary" size="lg">Get started</Button><Button size="lg">Docs</Button></>}
 *   media={<SpotlightCard className="aspect-square" />}
 * />
 * ```
 */
export function Hero({
  eyebrow,
  title,
  description,
  actions,
  media,
  scramble = false,
  layout = "split",
  className,
  ...props
}: HeroProps) {
  const center = layout === "center";
  return (
    <section
      className={cx(
        "mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24",
        center
          ? "justify-items-center text-center"
          : "lg:grid-cols-[1.35fr_1fr] lg:items-center",
        className,
      )}
      {...props}
    >
      <div className={cx("grid gap-6", center && "justify-items-center")}>
        {eyebrow && (
          <Badge variant="accent" dot className="w-fit">
            {eyebrow}
          </Badge>
        )}
        <h1 className="max-w-3xl text-pb-display font-light text-balance">
          {scramble && typeof title === "string" ? <TextScramble text={title} /> : title}
        </h1>
        {description && (
          <p className="max-w-xl text-pb-body-lg text-pb-muted text-pretty">
            {description}
          </p>
        )}
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
      {media && <div className={cx(center && "w-full max-w-3xl")}>{media}</div>}
    </section>
  );
}
