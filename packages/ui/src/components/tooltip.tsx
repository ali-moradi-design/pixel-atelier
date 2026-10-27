"use client";

import { cx } from "class-variance-authority";
import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Slot } from "../lib/slot.tsx";
import { usePopup } from "../lib/use-popup.ts";

export interface TooltipProps {
  /** The text (keep it short, plain text works best). */
  content: ReactNode;
  /** The element it describes: must be focusable (a button, a link). */
  children: ReactElement;
  /**
   * Delay before showing on hover, in ms. Keyboard focus shows it at once.
   * @default 400
   */
  delay?: number;
  /**
   * Horizontal alignment with the element.
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /** Extra classes for the tooltip bubble. */
  className?: string;
}

/**
 * A short label that appears on hover and on keyboard focus, linked to its
 * element with `aria-describedby`. Escape hides it. Never put interactive
 * content or essential information only in a tooltip.
 *
 * @example
 * ```tsx
 * <Tooltip content="Copy to clipboard">
 *   <IconButton aria-label="Copy"><CopyIcon /></IconButton>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  delay = 400,
  align = "center",
  className,
}: TooltipProps) {
  const id = useId();
  const anchor = useRef<HTMLElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);
  usePopup({ open, onClose, anchor, popup, align, dismissOnOutside: false });
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  return (
    <>
      <Slot
        ref={anchor}
        aria-describedby={id}
        onPointerEnter={() => show(delay)}
        onPointerLeave={hide}
        onFocus={() => show(0)}
        onBlur={hide}
      >
        {children}
      </Slot>
      <div
        ref={popup}
        id={id}
        role="tooltip"
        hidden={!open}
        className={cx(
          "pb-popup pointer-events-none m-0 max-w-64 rounded-[3px] bg-pb-text px-2 py-1.5 text-xs leading-snug text-pb-bg",
          className,
        )}
      >
        {content}
      </div>
    </>
  );
}
