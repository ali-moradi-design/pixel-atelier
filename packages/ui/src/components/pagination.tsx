"use client";

import { cx } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { Pixels } from "../pixels/Pixels.tsx";

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
 * Page navigation for long lists, in the kit's pixel style: square cells
 * with cut pixel corners, the pixel dissolve on hover and focus, the current
 * page filled with the accent, pixel arrows and a dotted gap. The current
 * page is marked with `aria-current="page"`; previous/next are disabled at
 * the ends.
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
      "pb-page pb-px-host inline-grid h-9 min-w-9 place-items-center px-2 font-pb-mono text-xs tabular-nums outline-none",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pb-accent",
      opts.current
        ? "pb-page-current bg-pb-accent text-pb-on-accent"
        : "text-pb-muted [--px-fill:var(--pb-raised)] [--px-ink:var(--pb-text)]",
      opts.disabled && "pointer-events-none opacity-30",
    );
    const common = {
      "aria-label": opts.label,
      "aria-current": opts.current ? ("page" as const) : undefined,
      className: cls,
    };
    const inner = (
      <>
        {!opts.current && !opts.disabled && <Pixels size={4} />}
        {content}
      </>
    );
    if (href && !opts.disabled)
      return (
        <a href={href(p)} {...common} onClick={() => onPageChange?.(p)}>
          {inner}
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
        {inner}
      </button>
    );
  };
  const arrow = (dir: "prev" | "next") => (
    <svg
      viewBox="0 0 5 7"
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={cx(
        "h-2.5 w-auto fill-current",
        dir === "prev" ? "rtl:-scale-x-100" : "-scale-x-100 rtl:scale-x-100",
      )}
    >
      <path d="M3 0h1v1H3zM2 1h1v1H2zM1 2h1v1H1zM0 3h1v1H0zM1 4h1v1H1zM2 5h1v1H2zM3 6h1v1H3z" />
    </svg>
  );
  return (
    <nav aria-label={label} className={cx("flex", className)} {...props}>
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {item(page - 1, arrow("prev"), {
            label: "Previous page",
            disabled: page <= 1,
          })}
        </li>
        {paginationRange(page, count, siblings).map((p, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: gaps have no identity
          <li key={i}>
            {p === "…" ? (
              <span
                aria-hidden="true"
                className="inline-flex h-9 min-w-9 items-center justify-center gap-[3px] text-pb-faint"
              >
                <i className="size-[3px] bg-current" />
                <i className="size-[3px] bg-current" />
                <i className="size-[3px] bg-current" />
              </span>
            ) : (
              item(p, p, { label: `Page ${p}`, current: p === page })
            )}
          </li>
        ))}
        <li>
          {item(page + 1, arrow("next"), {
            label: "Next page",
            disabled: page >= count,
          })}
        </li>
      </ul>
    </nav>
  );
}
