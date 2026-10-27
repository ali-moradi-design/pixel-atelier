"use client";

import { cx } from "class-variance-authority";
import {
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  anchorTo,
  hidePopover,
  onPointerDownOutside,
  showPopover,
} from "../lib/anchor.ts";
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

export type { Option as ComboboxOption };

/** Default filter: the label contains the query, ignoring case. */
export function containsFilter(option: Option, query: string) {
  return option.label.toLowerCase().includes(query.trim().toLowerCase());
}

export interface ComboboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size"
  > {
  /** All choices; the list shows the ones that match what is typed. */
  options: Option[];
  /** The selected value (controlled). Use `""` for none. */
  value?: string;
  /** The value selected at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the value the user picked. */
  onValueChange?: (value: string) => void;
  /**
   * Called with the text as the user types, for example to load options from
   * a server. The list is still filtered with `filter` unless it is `false`.
   */
  onQueryChange?: (query: string) => void;
  /**
   * Which options match the typed text. `false` shows every option (when the
   * server already filters them).
   * @default containsFilter (label contains the text, ignoring case)
   */
  filter?: ((option: Option, query: string) => boolean) | false;
  /**
   * Shown in the list when nothing matches.
   * @default "No results"
   */
  emptyText?: ReactNode;
  /** Content before the text, usually a search icon. */
  start?: ReactNode;
  /** Form field name: a hidden input carries the selected value. */
  name?: string;
  /**
   * Height: `"sm"` 32 px, `"md"` 40 px, `"lg"` 48 px.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

/**
 * A text field with a filtered list of choices, for long lists where people
 * type to search (people, countries, components). Follows the ARIA combobox
 * pattern: focus stays in the input, arrows move through the list, Enter
 * picks, Escape closes (and clears the text when already closed). Matching
 * text is highlighted.
 *
 * @example
 * ```tsx
 * <Field label="Assignee">
 *   <Combobox options={people} start={<SearchIcon />} placeholder="Search people" onValueChange={assign} />
 * </Field>
 * ```
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    onQueryChange,
    filter = containsFilter,
    emptyText = "No results",
    start,
    name,
    size,
    className,
    ...props
  },
  ref,
) {
  const field = useField();
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const label = options.find((o) => o.value === value)?.label ?? "";
  const [query, setQuery] = useState<string | null>(null); // null: showing the selected label
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const shown = useMemo(
    () => (filter && query ? options.filter((o) => filter(o, query)) : options),
    [options, filter, query],
  );

  useEffect(() => {
    const el = popup.current;
    const anchor = frame.current;
    if (!open || !el || !anchor) return;
    showPopover(el);
    const stop = anchorTo(el, anchor, { matchWidth: true });
    const stopOutside = onPointerDownOutside([el, anchor], () => {
      setOpen(false);
      setQuery(null);
    });
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

  const pick = (o: Option) => {
    setValue(o.value);
    setQuery(null);
    setOpen(false);
    input.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      if (!open) {
        setOpen(true);
        setActive(firstEnabled(shown, dir));
      } else setActive((a) => nextEnabled(shown, a, dir));
    } else if (e.key === "Enter" && open) {
      const o = shown[active];
      if (o && !o.disabled) {
        e.preventDefault();
        pick(o);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setQuery(null);
      } else if (query ?? label) {
        e.preventDefault();
        setQuery("");
      }
    } else if (e.key === "Tab" && open) {
      setOpen(false);
      setQuery(null);
    }
  };

  return (
    <>
      <div ref={frame} className={controlFrame({ size })}>
        {start}
        <input
          ref={composeRefs(ref, input)}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={
            open && active >= 0 && shown[active] ? `${listId}-${active}` : undefined
          }
          {...props}
          {...fieldControlProps(field, props)}
          value={query ?? label}
          onChange={(e) => {
            const q = e.currentTarget.value;
            setQuery(q);
            onQueryChange?.(q);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(e) => {
            props.onKeyDown?.(e);
            if (!e.defaultPrevented) onKeyDown(e);
          }}
          onClick={(e) => {
            props.onClick?.(e);
            setOpen(true);
          }}
          className={cx(
            "h-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-pb-muted",
            className,
          )}
        />
      </div>
      {name && <input type="hidden" name={name} value={value} />}
      <div ref={popup} id={listId} role="listbox" hidden={!open} className={popupClass}>
        {open && (
          <OptionList
            id={listId}
            options={shown}
            active={active}
            selected={value}
            query={query ?? undefined}
            onPick={pick}
            onHover={setActive}
            empty={emptyText}
          />
        )}
      </div>
    </>
  );
});
