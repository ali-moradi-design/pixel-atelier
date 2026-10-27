import { cx } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /**
   * Row height: `"compact"` for dense data, `"comfortable"` for reading.
   * @default "comfortable"
   */
  density?: "compact" | "comfortable";
  /** Classes for the scroll container around the table. */
  wrapperClassName?: string;
}

/**
 * A data table: semantic `<table>` markup with the kit's styling, in a
 * container that scrolls horizontally on small screens. Compose it from
 * `TableHeader`, `TableBody`, `TableRow`, `TableHead` and `TableCell`.
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader><TableRow><TableHead>Component</TableHead><TableHead numeric>kB</TableHead></TableRow></TableHeader>
 *   <TableBody><TableRow><TableCell>Button</TableCell><TableCell numeric>2.0</TableCell></TableRow></TableBody>
 * </Table>
 * ```
 */
export function Table({
  density = "comfortable",
  className,
  wrapperClassName,
  ...props
}: TableProps) {
  return (
    <div className={cx("w-full overflow-x-auto", wrapperClassName)}>
      <table
        data-density={density}
        className={cx(
          "group/table w-full border-collapse text-[0.8125rem] text-pb-text",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/** The header row group (`<thead>`). */
export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cx("[&_tr]:border-b [&_tr]:border-pb-border", className)}
      {...props}
    />
  );
}

/** The body (`<tbody>`). */
export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cx("[&_tr]:border-b [&_tr]:border-pb-border", className)}
      {...props}
    />
  );
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * Highlight the row as selected (also sets `aria-selected`).
   * @default false
   */
  selected?: boolean;
}

/** A row (`<tr>`). Rows highlight on hover. */
export function TableRow({ selected = false, className, ...props }: TableRowProps) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cx(
        "transition-colors duration-pb-fast hover:bg-pb-surface aria-selected:bg-pb-accent-subtle",
        className,
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Right-align (end-align in RTL) for numbers.
   * @default false
   */
  numeric?: boolean;
  /**
   * Makes the header a sort button and announces the order with `aria-sort`.
   * `"none"` means sortable but not sorted.
   */
  sort?: "ascending" | "descending" | "none";
  /** Called when the sort button is pressed. */
  onSort?: () => void;
  /** The header text. */
  children?: ReactNode;
}

/** A column header (`<th scope="col">`), optionally sortable. */
export function TableHead({
  numeric = false,
  sort,
  onSort,
  className,
  children,
  ...props
}: TableHeadProps) {
  const arrow = sort === "ascending" ? "↑" : sort === "descending" ? "↓" : "↕";
  return (
    <th
      scope="col"
      aria-sort={sort}
      className={cx(
        "px-3 py-2.5 font-pb-mono text-[0.65625rem] font-medium uppercase tracking-[0.1em] text-pb-muted whitespace-nowrap",
        numeric ? "text-end" : "text-start",
        className,
      )}
      {...props}
    >
      {sort ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-pb-xs uppercase outline-none hover:text-pb-text focus-visible:outline-2 focus-visible:outline-pb-accent"
        >
          {children}
          <span
            aria-hidden="true"
            className={sort === "none" ? "opacity-40" : "text-pb-accent"}
          >
            {arrow}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Right-align (end-align in RTL) and use tabular mono digits.
   * @default false
   */
  numeric?: boolean;
}

/** A data cell (`<td>`). */
export function TableCell({ numeric = false, className, ...props }: TableCellProps) {
  return (
    <td
      className={cx(
        "px-3 group-data-[density=compact]/table:py-1.5 group-data-[density=comfortable]/table:py-3",
        numeric && "text-end font-pb-mono text-xs tabular-nums",
        className,
      )}
      {...props}
    />
  );
}
