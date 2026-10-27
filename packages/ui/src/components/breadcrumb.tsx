import { cx } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

/** One step of a `Breadcrumb`. */
export interface Crumb {
  /** Visible text. */
  label: ReactNode;
  /** Link target. Omit for the current page (the last item). */
  href?: string;
  /** Icon before the label (e.g. a home icon on the first item). */
  icon?: ReactNode;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** The trail from the root to the current page. The last item is current. */
  items: Crumb[];
  /**
   * What goes between items. The default chevron flips in RTL.
   * @default a small chevron
   */
  separator?: ReactNode;
  /**
   * Render links with your router's component, e.g.
   * `(c, cls) => <NextLink href={c.href} className={cls}>{c.label}</NextLink>`.
   */
  renderLink?: (crumb: Crumb, className: string) => ReactNode;
  /**
   * Accessible name of the navigation landmark.
   * @default "Breadcrumb"
   */
  "aria-label"?: string;
}

/**
 * Where the page sits in the site: a navigation landmark with an ordered
 * list; the last item is marked `aria-current="page"`.
 *
 * @example
 * ```tsx
 * <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Components", href: "/docs/components" }, { label: "Button" }]} />
 * ```
 */
export function Breadcrumb({
  items,
  separator,
  renderLink,
  className,
  "aria-label": label = "Breadcrumb",
  ...props
}: BreadcrumbProps) {
  const sep = separator ?? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3 text-pb-faint rtl:-scale-x-100"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
  const link =
    "rounded-pb-xs text-pb-muted outline-none transition-colors duration-pb-fast hover:text-pb-text focus-visible:outline-2 focus-visible:outline-pb-accent";
  return (
    <nav aria-label={label} className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem]">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          const content = (
            <>
              {c.icon}
              {c.label}
            </>
          );
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: the trail order is the identity
            <li key={i} className="inline-flex items-center gap-2 [&_svg]:size-3.5">
              {last || !c.href ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cx(
                    "inline-flex items-center gap-1.5",
                    last ? "text-pb-text" : "text-pb-muted",
                  )}
                >
                  {content}
                </span>
              ) : renderLink ? (
                renderLink(c, cx("inline-flex items-center gap-1.5", link))
              ) : (
                <a href={c.href} className={cx("inline-flex items-center gap-1.5", link)}>
                  {content}
                </a>
              )}
              {!last && sep}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
