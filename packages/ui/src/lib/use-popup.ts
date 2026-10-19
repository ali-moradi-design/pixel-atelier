"use client";

import { type RefObject, useEffect, useRef } from "react";
import { anchorTo, hidePopover, onPointerDownOutside, showPopover } from "./anchor.ts";

export interface PopupOptions {
  /** Whether the popup is open. */
  open: boolean;
  /** Called to close it (outside press, Escape). */
  onClose: () => void;
  anchor: RefObject<HTMLElement | null>;
  popup: RefObject<HTMLElement | null>;
  align?: "start" | "center" | "end";
  matchWidth?: boolean;
  gap?: number;
  /** Close on a press outside the anchor and popup. Default true. */
  dismissOnOutside?: boolean;
  /** Close on Escape (anywhere). Default true. */
  dismissOnEscape?: boolean;
}

/**
 * Shows a popup in the top layer next to its anchor while `open` is true and
 * wires the usual ways to dismiss it. Shared by Popover, Tooltip and menus.
 */
export function usePopup({
  open,
  onClose,
  anchor,
  popup,
  align = "start",
  matchWidth = false,
  gap = 6,
  dismissOnOutside = true,
  dismissOnEscape = true,
}: PopupOptions) {
  // A ref, so a new onClose function on every render does not reopen the popup.
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const el = popup.current;
    const a = anchor.current;
    if (!open || !el || !a) return;
    showPopover(el);
    const cleanups = [anchorTo(el, a, { align, matchWidth, gap })];
    if (dismissOnOutside)
      cleanups.push(onPointerDownOutside([el, a], () => close.current()));
    if (dismissOnEscape) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !e.defaultPrevented) {
          e.preventDefault();
          close.current();
        }
      };
      document.addEventListener("keydown", onKey);
      cleanups.push(() => document.removeEventListener("keydown", onKey));
    }
    return () => {
      for (const c of cleanups) c();
      hidePopover(el);
    };
  }, [open, anchor, popup, align, matchWidth, gap, dismissOnOutside, dismissOnEscape]);
}
