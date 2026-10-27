import { cx } from "class-variance-authority";
import {
  Children,
  cloneElement,
  type DetailsHTMLAttributes,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
} from "react";
import { ChevronDownIcon } from "../lib/icons.tsx";

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `"single"`: opening one item closes the others (native exclusive
   * `<details name>`). `"multiple"`: items open independently.
   * @default "single"
   */
  type?: "single" | "multiple";
  /** `AccordionItem`s. */
  children: ReactNode;
}

/**
 * Stacked sections that expand and collapse. Built on native
 * `<details>`/`<summary>`: keyboard, screen readers, find-in-page and
 * printing work without JavaScript, and the component ships no client code.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem title="Is it accessible?" defaultOpen>Yes…</AccordionItem>
 *   <AccordionItem title="Does it support RTL?">Yes…</AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({
  type = "single",
  className,
  children,
  ...props
}: AccordionProps) {
  const name = useId();
  return (
    <div className={cx("pb-accordion", className)} {...props}>
      {type === "single"
        ? Children.map(children, (c) =>
            isValidElement(c)
              ? cloneElement(c as ReactElement<{ name?: string }>, { name })
              : c,
          )
        : children}
    </div>
  );
}

export interface AccordionItemProps
  extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  /** The always-visible heading that toggles the item. */
  title: ReactNode;
  /**
   * Open on first render.
   * @default false
   */
  defaultOpen?: boolean;
  /** The content shown when open. */
  children: ReactNode;
}

/**
 * One section of an `Accordion`. Opening animates the height smoothly where
 * the browser supports `::details-content` (Chrome, Edge, Safari 18.4+) and
 * opens at once elsewhere; the marker fills with the accent in pixel steps.
 */
export function AccordionItem({
  title,
  defaultOpen = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <details
      open={defaultOpen || undefined}
      className={cx("pb-acc group/acc border-b border-pb-border", className)}
      {...props}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-pb-xs py-4 text-sm text-pb-text outline-none transition-colors duration-pb-fast hover:text-pb-accent focus-visible:outline-2 focus-visible:outline-pb-accent [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden="true" className="pb-acc-mark">
          <ChevronDownIcon className="size-3.5" />
        </span>
      </summary>
      <div className="pb-acc-body pb-5 text-[0.8125rem] leading-relaxed text-pb-muted">
        {children}
      </div>
    </details>
  );
}
