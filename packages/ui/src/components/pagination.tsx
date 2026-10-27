"use client";

import { cx } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * The page numbers to show for `page` of `count`, with `"…"` gaps: always the
 * first and last page and `siblings` pages around the current one.
 */
export function paginationRange(
  page: number,
  count: number,
  siblings = 1,
): (number | "…")[] {
  const total = siblings * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - siblings, count - siblings * 2 - 2));
  const end = Math.min(count - 1, Math.max(page + siblings, siblings * 2 + 3));
  return [
    1,
    ...(start > 2 ? ["…" as const] : []),
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    ...(end < count - 1 ? ["…" as const] : []),
    count,
  ];
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** The current page, starting at 1. */
  page: number;
  /** Number of pages. */
  count: number;
  /** Called with the page the user picked (for client-side paging). */
  onPageChange?: (page: number) => void;
  /**
   * Builds a link for a page (for server-rendered paging, crawlable). When
   * set, pages render as links instead of buttons.
   */
  href?: (page: number) => string;
  /**
   * Pages shown on each side of the current one.
   * @default 1
   */
  siblings?: number;
  /**
   * Accessible name of the navigation landmark.
   * @default "Pagination"
   */
  "aria-label"?: string;
}

/**
 * Page navigation for long lists. The current page is marked with
 * `aria-current="page"`; previous/next are disabled at the ends.
 *
 * @example
 * ```tsx
 * <Pagination page={page} count={9} onPageChange={setPage} />
 * <Pagination page={3} count={42} href={(p) => `/blog?page=${p}`} />
 * ```
 */
export function Pagination({
  page,
  count,
  onPageChange,
  href,
  siblings = 1,
  className,
  "aria-label": label = "Pagination",
  ...props
}: PaginationProps) {
  const item = (
    p: number,
    content: ReactNode,
    opts: { label?: string; current?: boolean; disabled?: boolean } = {},
  ) => {
    const cls = cx(
      "inline-grid h-8 min-w-8 place-items-center rounded-[2px] px-1.5 font-pb-mono text-xs outline-none transition-colors duration-pb-fast",
      "focus-visible:outline-2 focus-visible:outline-pb-accent",
      opts.current
        ? "bg-pb-text text-pb-bg"
        : "text-pb-muted hover:bg-pb-raised hover:text-pb-text",
      opts.disabled && "pointer-events-none opacity-35",
    );
    const common = {
      "aria-label": opts.label,
      "aria-current": opts.current ? ("page" as const) : undefined,
      className: cls,
    };
    if (href && !opts.disabled)
      return (
        <a href={href(p)} {...common} onClick={() => onPageChange?.(p)}>
          {content}
        </a>
      );
    return (
      <button
        type="button"
        disabled={opts.disabled}
        onClick={() => onPageChange?.(p)}
        {...common}
        className={cx(cls, "cursor-pointer")}
      >
        {content}
      </button>
    );
  };
  return (
    <nav aria-label={label} className={cx("flex", className)} {...props}>
      <ul className="flex items-center gap-1">
        <li>
          {item(
            page - 1,
            <span aria-hidden="true" className="rtl:-scale-x-100">
              ‹
            </span>,
            { label: "Previous page", disabled: page <= 1 },
          )}
        </li>
        {paginationRange(page, count, siblings).map((p, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: gaps have no identity
          <li key={i}>
            {p === "…" ? (
              <span
                aria-hidden="true"
                className="inline-grid h-8 min-w-8 place-items-center font-pb-mono text-xs text-pb-faint"
              >
                …
              </span>
            ) : (
              item(p, p, { label: `Page ${p}`, current: p === page })
            )}
          </li>
        ))}
        <li>
          {item(
            page + 1,
            <span aria-hidden="true" className="rtl:-scale-x-100">
              ›
            </span>,
            { label: "Next page", disabled: page >= count },
          )}
        </li>
      </ul>
    </nav>
  );
}
