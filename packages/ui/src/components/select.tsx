"use client";

import { cx } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  anchorTo,
  hidePopover,
  onPointerDownOutside,
  showPopover,
} from "../lib/anchor.ts";
import { ChevronDownIcon } from "../lib/icons.tsx";
import {
  firstEnabled,
  nextEnabled,
  type Option,
  OptionList,
  popupClass,
} from "../lib/listbox.tsx";
import { composeRefs } from "../lib/slot.tsx";
import { useControllable } from "../lib/use-controllable.ts";
import { fieldControlProps, useField } from "./field.tsx";
import { controlFrame } from "./input.tsx";

export type { Option as SelectOption };

export interface SelectProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "defaultValue" | "onChange"
  > {
  /** The choices, in order. */
  options: Option[];
  /** The selected value (controlled). Use `""` for none. */
  value?: string;
  /** The value selected at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the value the user picked. */
  onValueChange?: (value: string) => void;
  /**
   * Text shown when nothing is selected.
   * @default "Select…"
   */
  placeholder?: string;
  /** Form field name: a hidden input carries the value in form submissions. */
  name?: string;
  /**
   * Height: `"sm"` 32 px, `"md"` 40 px, `"lg"` 48 px.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

/**
 * Pick one value from a short list. A button opens a listbox in the top layer
 * (the native popover API, so it is never clipped by a parent; it closes on
 * outside click, Escape and Tab). Keyboard: Enter, Space or arrows open; arrows, Home and End move;
 * typing jumps to a matching option; Enter or Space picks.
 *
 * For long lists where people type to search, use `Combobox`.
 *
 * @example
 * ```tsx
 * <Field label="Framework">
 *   <Select
 *     options={[{ value: "next", label: "Next.js" }, { value: "astro", label: "Astro" }]}
 *     defaultValue="next"
 *   />
 * </Field>
 * ```
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    placeholder = "Select…",
    name,
    size,
    className,
    ...props
  },
  ref,
) {
  const field = useField();
  const listId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const typed = useRef({ text: "", at: 0 });
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const el = popup.current;
    const anchor = trigger.current;
    if (!open || !el || !anchor) return;
    showPopover(el);
    const stop = anchorTo(el, anchor, { matchWidth: true });
    const stopOutside = onPointerDownOutside([el, anchor], () => setOpen(false));
    return () => {
      stop();
      stopOutside();
      hidePopover(el);
    };
  }, [open]);

  useEffect(() => {
    if (open && active >= 0)
      document
        .getElementById(`${listId}-${active}`)
        ?.scrollIntoView?.({ block: "nearest" });
  }, [open, active, listId]);

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const pick = (o: Option) => {
    setValue(o.value);
    close();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const selected = options.findIndex((o) => o.value === value);
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openAt(
          selected >= 0 ? selected : firstEnabled(options, e.key === "ArrowUp" ? -1 : 1),
        );
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => nextEnabled(options, a, e.key === "ArrowDown" ? 1 : -1));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(firstEnabled(options, e.key === "Home" ? 1 : -1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const o = options[active];
      if (o && !o.disabled) pick(o);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    } else if (e.key.length === 1) {
      const now = Date.now();
      const t = typed.current;
      t.text = now - t.at > 600 ? e.key : t.text + e.key;
      t.at = now;
      const i = options.findIndex(
        (o) => !o.disabled && o.label.toLowerCase().startsWith(t.text.toLowerCase()),
      );
      if (i >= 0) setActive(i);
    }
  };

  return (
    <>
      <button
        ref={composeRefs(ref, trigger)}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        {...props}
        {...fieldControlProps(field, props)}
        onClick={(e) => {
          props.onClick?.(e);
          if (open) close();
          else
            openAt(
              Math.max(
                0,
                options.findIndex((o) => o.value === value),
              ),
            );
        }}
        onKeyDown={(e) => {
          props.onKeyDown?.(e);
          if (!e.defaultPrevented) onKeyDown(e);
        }}
        onBlur={(e) => {
          props.onBlur?.(e);
          if (open && !popup.current?.contains(e.relatedTarget as Node)) close(false);
        }}
        className={cx(
          controlFrame({ size }),
          "cursor-pointer text-start outline-none disabled:cursor-not-allowed aria-expanded:border-pa-accent",
          className,
        )}
      >
        {current?.icon}
        <span className={cx("min-w-0 flex-1 truncate", !current && "text-pa-muted")}>
          {current?.label ?? placeholder}
        </span>
        <ChevronDownIcon className="transition-transform duration-pa-fast group-aria-expanded/control:rotate-180" />
      </button>
      {name && <input type="hidden" name={name} value={value} />}
      <div
        ref={popup}
        id={listId}
        role="listbox"
        tabIndex={-1}
        hidden={!open}
        className={popupClass}
      >
        {open && (
          <OptionList
            id={listId}
            options={options}
            active={active}
            selected={value}
            onPick={pick}
            onHover={setActive}
            empty="No options"
          />
        )}
      </div>
    </>
  );
});
