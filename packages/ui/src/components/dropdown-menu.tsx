"use client";

import { cx } from "class-variance-authority";
import {
  createContext,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { CheckIcon } from "../lib/icons.tsx";
import { Slot } from "../lib/slot.tsx";
import { useControllable } from "../lib/use-controllable.ts";
import { usePopup } from "../lib/use-popup.ts";
import { Pixels } from "../pixels/Pixels.tsx";

const MenuClose = createContext<(() => void) | null>(null);
const ITEM = '[role^="menuitem"]:not([aria-disabled="true"])';

export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The element that opens the menu, usually a `Button` or `IconButton`. */
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
  /**
   * Horizontal alignment with the trigger.
   * @default "start"
   */
  align?: "start" | "center" | "end";
  /** `DropdownItem`, `DropdownCheckboxItem`, `DropdownLabel`, `DropdownSeparator`. */
  children: ReactNode;
}

/**
 * A menu of actions opened from a button (the ARIA menu button pattern).
 * Keyboard: Enter, Space or arrows open it with focus on an item; arrows,
 * Home/End and typing move; Enter or Space runs the item; Escape closes and
 * returns focus to the trigger; Tab closes. The focused item fills with
 * pixels.
 *
 * @example
 * ```tsx
 * <DropdownMenu trigger={<IconButton aria-label="More"><MoreIcon /></IconButton>}>
 *   <DropdownLabel>ali@studio</DropdownLabel>
 *   <DropdownItem shortcut="⌘ ," onSelect={openSettings}>Settings</DropdownItem>
 *   <DropdownSeparator />
 *   <DropdownItem variant="danger" onSelect={signOut}>Sign out</DropdownItem>
 * </DropdownMenu>
 * ```
 */
export function DropdownMenu({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  align = "start",
  className,
  children,
  ...props
}: DropdownMenuProps) {
  const id = useId();
  const anchor = useRef<HTMLElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [focusAt, setFocusAt] = useState<"first" | "last">("first");
  const typed = useRef({ text: "", at: 0 });
  const close = useCallback(
    (refocus = true) => {
      setOpen(false);
      if (refocus) anchor.current?.focus();
    },
    [setOpen],
  );
  usePopup({ open, onClose: close, anchor, popup, align });

  const items = () => [...(popup.current?.querySelectorAll<HTMLElement>(ITEM) ?? [])];
  useEffect(() => {
    if (!open) return;
    const all = [...(popup.current?.querySelectorAll<HTMLElement>(ITEM) ?? [])];
    (focusAt === "first" ? all[0] : all[all.length - 1])?.focus();
  }, [open, focusAt]);

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const all = items();
    const i = all.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      e.preventDefault();
      all[(n + all.length) % all.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(all.length - 1);
    else if (e.key === "Tab") close(false);
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const now = Date.now();
      const t = typed.current;
      t.text = now - t.at > 600 ? e.key : t.text + e.key;
      t.at = now;
      const hit = all.findIndex((el) =>
        el.textContent?.trim().toLowerCase().startsWith(t.text.toLowerCase()),
      );
      if (hit >= 0) go(hit);
    }
  };

  return (
    <>
      <Slot
        ref={anchor}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (open) close(false);
          else {
            setFocusAt("first");
            setOpen(true);
          }
        }}
        onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
          if (open) return;
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setFocusAt(e.key === "ArrowDown" ? "first" : "last");
            setOpen(true);
          }
        }}
      >
        {trigger}
      </Slot>
      <div
        ref={popup}
        id={id}
        role="menu"
        tabIndex={-1}
        hidden={!open}
        onKeyDown={onMenuKey}
        className={cx(
          "pa-popup m-0 min-w-52 max-w-[calc(100vw-1rem)] rounded-pa-md border border-pa-border bg-pa-overlay p-1 text-pa-text shadow-pa-2 outline-none",
          className,
        )}
        {...props}
      >
        {open && (
          <MenuClose.Provider value={() => close()}>{children}</MenuClose.Provider>
        )}
      </div>
    </>
  );
}

interface ItemBase extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Icon before the label. */
  icon?: ReactNode;
  /** Keyboard shortcut hint shown at the end, e.g. `"⌘ ,"`. Display only. */
  shortcut?: string;
  /**
   * The item cannot be used; it stays visible but is skipped by the keyboard.
   * @default false
   */
  disabled?: boolean;
  /** The label. */
  children: ReactNode;
}

export interface DropdownItemProps extends ItemBase {
  /** Runs when the item is chosen (click, Enter, Space). The menu then closes. */
  onSelect?: () => void;
  /**
   * `"danger"` colors the item red, for destructive actions.
   * @default "default"
   */
  variant?: "default" | "danger";
}

function useItem(disabled: boolean | undefined, run: () => void) {
  const close = useContext(MenuClose);
  const act = () => {
    if (disabled) return;
    run();
    close?.();
  };
  return {
    "aria-disabled": disabled || undefined,
    onClick: act,
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        act();
      }
    },
    onFocus: (e: { currentTarget: HTMLElement }) => {
      e.currentTarget.dataset.highlighted = "";
    },
    onBlur: (e: { currentTarget: HTMLElement }) => {
      delete e.currentTarget.dataset.highlighted;
    },
    onPointerMove: (e: { currentTarget: HTMLElement }) => {
      if (!disabled && document.activeElement !== e.currentTarget)
        e.currentTarget.focus();
    },
  };
}

const itemClass = (danger: boolean) =>
  cx(
    "pa-px-host flex h-[2.125rem] cursor-pointer select-none items-center gap-2.5 rounded-pa-xs px-2.5 text-[0.8125rem] outline-none",
    "[--px-fill:var(--pa-accent-subtle)] [--px-ink:currentColor] [&_svg]:size-[0.9375rem] [&_svg]:shrink-0",
    "data-highlighted:before:absolute data-highlighted:before:inset-y-2 data-highlighted:before:start-0 data-highlighted:before:w-0.5 data-highlighted:before:bg-pa-accent",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
    danger &&
      "text-pa-danger [--px-fill:color-mix(in_srgb,var(--pa-danger)_12%,transparent)]",
  );

function Shortcut({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <kbd className="ms-auto rounded-[3px] border border-b-2 border-pa-border-strong px-1.5 py-0.5 font-pa-mono text-[0.625rem] text-pa-muted">
      {value}
    </kbd>
  );
}

/** One action in a `DropdownMenu`. */
export function DropdownItem({
  icon,
  shortcut,
  disabled,
  onSelect,
  variant = "default",
  className,
  children,
  ...props
}: DropdownItemProps) {
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      {...useItem(disabled, () => onSelect?.())}
      className={cx(itemClass(variant === "danger"), className)}
      {...props}
    >
      <Pixels />
      {icon}
      <span className="truncate">{children}</span>
      <Shortcut value={shortcut} />
    </div>
  );
}

export interface DropdownCheckboxItemProps extends ItemBase {
  /** Whether the option is on. */
  checked: boolean;
  /** Called with the new state when chosen. The menu then closes. */
  onCheckedChange: (checked: boolean) => void;
}

/** A menu item that toggles an option (`menuitemcheckbox`). */
export function DropdownCheckboxItem({
  checked,
  onCheckedChange,
  disabled,
  shortcut,
  icon,
  className,
  children,
  ...props
}: DropdownCheckboxItemProps) {
  return (
    <div
      role="menuitemcheckbox"
      tabIndex={-1}
      aria-checked={checked}
      {...useItem(disabled, () => onCheckedChange(!checked))}
      className={cx(itemClass(false), className)}
      {...props}
    >
      <Pixels />
      <span className="inline-grid size-[0.9375rem] place-items-center">
        {checked && <CheckIcon className="text-pa-accent" />}
      </span>
      {icon}
      <span className="truncate">{children}</span>
      <Shortcut value={shortcut} />
    </div>
  );
}

/** A small heading for a group of items (not focusable). */
export function DropdownLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "px-2.5 pt-2 pb-1 font-pa-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-pa-muted",
        className,
      )}
      {...props}
    />
  );
}

/** A hairline between groups of items. */
export function DropdownSeparator({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className={cx("-mx-1 my-1 h-px border-0 bg-pa-border", className)} {...props} />
  );
}
