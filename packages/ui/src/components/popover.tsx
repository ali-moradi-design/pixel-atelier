"use client";

import { cx } from "class-variance-authority";
import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useCallback,
  useId,
  useRef,
} from "react";
import { Slot } from "../lib/slot.tsx";
import { useControllable } from "../lib/use-controllable.ts";
import { usePopup } from "../lib/use-popup.ts";

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The element that toggles the popover, usually a `Button`. */
  trigger: ReactElement;
  /** Whether it is open (controlled). */
  open?: boolean;
  /**
   * Open on first render (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Optional heading; it also names the popover for screen readers. */
  title?: ReactNode;
  /**
   * Horizontal alignment with the trigger.
   * @default "start"
   */
  align?: "start" | "center" | "end";
  /** The content: text, a form, a share box… */
  children: ReactNode;
}

/**
 * A small non-modal panel attached to a trigger, for extra details or quick
 * actions. It sits in the top layer (never clipped) and closes on outside
 * click, Escape, or the trigger. Focus stays where the user put it; use
 * `Dialog` when the panel must be dealt with first.
 *
 * @example
 * ```tsx
 * <Popover trigger={<Button>Share</Button>} title="Share link">
 *   <Input readOnly value={url} />
 * </Popover>
 * ```
 */
export function Popover({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  align = "start",
  className,
  children,
  ...props
}: PopoverProps) {
  const id = useId();
  const anchor = useRef<HTMLElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  usePopup({ open, onClose, anchor, popup, align });
  return (
    <>
      <Slot
        ref={anchor}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </Slot>
      <div
        ref={popup}
        id={id}
        role="dialog"
        aria-labelledby={title ? `${id}-title` : undefined}
        hidden={!open}
        className={cx(
          "pa-popup m-0 w-72 max-w-[calc(100vw-1rem)] rounded-pa-md border border-pa-border bg-pa-overlay p-4 text-[0.8125rem] text-pa-text shadow-pa-2",
          className,
        )}
        {...props}
      >
        {open && (
          <>
            {title && (
              <div id={`${id}-title`} className="mb-1.5 text-sm font-medium">
                {title}
              </div>
            )}
            {children}
          </>
        )}
      </div>
    </>
  );
}
