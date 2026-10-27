import { cx } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { XIcon } from "../lib/icons.tsx";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The tag text (or any inline content). */
  children: ReactNode;
  /**
   * When set, shows a small × button that calls this function. Without it the
   * tag is static.
   */
  onRemove?: () => void;
  /**
   * Accessible name of the remove button.
   * @default `"Remove " + children` when `children` is a string
   */
  removeLabel?: string;
}

/**
 * A token for applied filters, selected values or keywords, optionally
 * removable.
 *
 * @example
 * ```tsx
 * <Tag onRemove={() => remove("react")}>react</Tag>
 * ```
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { className, children, onRemove, removeLabel, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx(
        "inline-flex h-6.5 items-center gap-1 rounded-pb-xs border border-pb-border bg-pb-raised ps-2.5 text-xs text-pb-text",
        onRemove ? "pe-0.5" : "pe-2.5",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={
            removeLabel ?? `Remove ${typeof children === "string" ? children : ""}`.trim()
          }
          className="inline-grid size-5 cursor-pointer place-items-center rounded-[1px] text-pb-muted outline-none hover:bg-pb-border hover:text-pb-text focus-visible:outline-2 focus-visible:outline-pb-accent"
        >
          <XIcon width={12} height={12} />
        </button>
      )}
    </span>
  );
});
