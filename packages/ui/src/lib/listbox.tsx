"use client";

import { cx } from "class-variance-authority";
import type { ReactNode } from "react";
import { Pixels } from "../pixels/Pixels.tsx";
import { CheckIcon } from "./icons.tsx";

/** One choice of a `Select` or `Combobox`. */
export interface Option {
  /** The value submitted and passed to `onValueChange`. */
  value: string;
  /** What the user sees (and what typeahead and filtering match). */
  label: string;
  /** Smaller text after the label. */
  description?: string;
  /** Content before the label: an icon or an avatar. */
  icon?: ReactNode;
  /** The option cannot be picked; keyboard navigation skips it. */
  disabled?: boolean;
}

/** Next enabled index from `from` in direction `dir`, wrapping around. */
export function nextEnabled(options: Option[], from: number, dir: 1 | -1) {
  const n = options.length;
  for (let k = 1; k <= n; k++) {
    const i = (((from + dir * k) % n) + n) % n;
    if (!options[i]?.disabled) return i;
  }
  return -1;
}
export function firstEnabled(options: Option[], dir: 1 | -1 = 1) {
  return nextEnabled(options, dir === 1 ? -1 : 0, dir);
}

/** Wraps the part of `text` that matches `query` in a <mark>. */
function highlight(text: string, query?: string) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent text-pb-accent">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}

/** The option rows of a listbox popup, shared by Select and Combobox. */
export function OptionList({
  id,
  options,
  active,
  selected,
  query,
  onPick,
  onHover,
  empty,
}: {
  id: string;
  options: Option[];
  active: number;
  selected?: string;
  query?: string;
  onPick: (o: Option) => void;
  onHover: (i: number) => void;
  empty: ReactNode;
}) {
  if (options.length === 0)
    return <div className="px-2.5 py-2 text-[0.8125rem] text-pb-muted">{empty}</div>;
  return (
    <>
      {options.map((o, i) => (
        // biome-ignore lint/a11y/useFocusableInteractive: focus stays on the trigger or input (aria-activedescendant)
        // biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled by the trigger or input
        <div
          key={o.value}
          id={`${id}-${i}`}
          role="option"
          aria-selected={o.value === selected}
          aria-disabled={o.disabled || undefined}
          data-highlighted={i === active ? "" : undefined}
          onPointerMove={() => !o.disabled && i !== active && onHover(i)}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => !o.disabled && onPick(o)}
          className={cx(
            "pb-px-host flex h-[2.125rem] cursor-pointer items-center gap-2.5 rounded-pb-xs px-2.5 text-[0.8125rem] [--px-fill:var(--pb-accent-subtle)] [--px-ink:var(--pb-text)]",
            "data-highlighted:before:absolute data-highlighted:before:inset-y-2 data-highlighted:before:start-0 data-highlighted:before:w-0.5 data-highlighted:before:bg-pb-accent",
            "aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
          )}
        >
          <Pixels />
          {o.icon}
          <span className="truncate">{highlight(o.label, query)}</span>
          {o.description && (
            <span className="truncate text-xs text-pb-muted">{o.description}</span>
          )}
          {o.value === selected && (
            <CheckIcon className="ms-auto size-3.5 shrink-0 text-pb-accent" />
          )}
        </div>
      ))}
    </>
  );
}

/** Classes of the popup panel. */
export const popupClass =
  "pb-popup m-0 max-h-72 overflow-auto rounded-pb-md border border-pb-border bg-pb-overlay p-1 text-pb-text shadow-pb-2";
