import { cx } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

/** One item of a `FeatureGrid`. */
export interface Feature {
  /** Short title. */
  title: string;
  /** One or two sentences. */
  description: ReactNode;
  /** Icon or small visual above the title. */
  icon?: ReactNode;
}

export interface FeatureGridProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section heading (an `<h2>`). */
  title?: ReactNode;
  /** Text under the heading. */
  description?: ReactNode;
  /** The features. */
  features: Feature[];
  /**
   * Columns on wide screens (two on tablets, one on phones).
   * @default 3
   */
  columns?: 2 | 3 | 4;
}

/**
 * A section of features: hairline-topped cells with an optional icon in an
 * accent square. Server-component friendly.
 *
 * @example
 * ```tsx
 * <FeatureGrid title="Why Pixelbits" features={[{ title: "Tiny", description: "Button is 2 kB." }]} />
 * ```
 */
export function FeatureGrid({
  title,
  description,
  features,
  columns = 3,
  className,
  ...props
}: FeatureGridProps) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <section
      className={cx("mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6", className)}
      {...props}
    >
      {(title || description) && (
        <header className="grid max-w-2xl gap-3">
          {title && <h2 className="text-pb-h2">{title}</h2>}
          {description && <p className="text-pb-body text-pb-muted">{description}</p>}
        </header>
      )}
      <ul className={cx("grid gap-x-6 gap-y-10", cols)}>
        {features.map((f) => (
          <li
            key={f.title}
            className="grid content-start gap-2.5 border-t border-pb-border pt-5"
          >
            {f.icon && (
              <span className="mb-1 inline-grid size-9 place-items-center rounded-pb-xs bg-pb-accent-subtle text-pb-accent [&_svg]:size-4.5">
                {f.icon}
              </span>
            )}
            <h3 className="text-[0.9375rem] font-medium">{f.title}</h3>
            <div className="text-[0.8125rem] leading-relaxed text-pb-muted">
              {f.description}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
