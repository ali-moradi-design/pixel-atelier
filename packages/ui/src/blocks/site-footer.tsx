import { cx } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

/** A titled column of links in a `SiteFooter`. */
export interface FooterColumn {
  /** Column heading. */
  title: string;
  /** Its links. */
  links: { label: string; href: string }[];
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  /** Logo or name, with an optional line under it. */
  brand?: ReactNode;
  /** Short text under the brand. */
  tagline?: ReactNode;
  /** Link columns. */
  columns?: FooterColumn[];
  /** The bottom line: copyright, legal links. */
  legal?: ReactNode;
}

/**
 * A site footer with brand, link columns and a legal line. Server-component
 * friendly.
 *
 * @example
 * ```tsx
 * <SiteFooter brand={<Logo />} tagline="Pixels, crafted with care." columns={[{ title: "Kit", links: [{ label: "Docs", href: "/docs" }] }]} legal="© 2026 Ali Moradi" />
 * ```
 */
export function SiteFooter({
  brand,
  tagline,
  columns = [],
  legal,
  className,
  ...props
}: SiteFooterProps) {
  return (
    <footer className={cx("border-t border-pb-border", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(auto-fit,minmax(9rem,1fr))]">
        {(brand || tagline) && (
          <div className="grid content-start gap-3">
            {brand}
            {tagline && (
              <p className="max-w-xs text-[0.8125rem] text-pb-muted">{tagline}</p>
            )}
          </div>
        )}
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="grid content-start gap-3">
            <h2 className="font-pb-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-pb-accent">
              {c.title}
            </h2>
            <ul className="grid gap-2 text-[0.8125rem]">
              {c.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-pb-muted outline-none transition-colors hover:text-pb-text focus-visible:text-pb-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {legal && (
        <div className="border-t border-pb-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 text-xs text-pb-muted sm:px-6">
            {legal}
          </div>
        </div>
      )}
    </footer>
  );
}
