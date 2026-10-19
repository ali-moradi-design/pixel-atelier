"use client";

import { cx } from "class-variance-authority";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useControllable } from "../lib/use-controllable.ts";
import { Pixels } from "../pixels/Pixels.tsx";
import { Dialog } from "./dialog.tsx";

/** One command of a `CommandPalette`. */
export interface Command {
  /** Unique id. */
  id: string;
  /** What the user sees and searches. */
  label: string;
  /** Group heading the command is listed under, e.g. `"Components"`. */
  group?: string;
  /** Extra words that should also match (synonyms, ids). */
  keywords?: string[];
  /** Icon before the label. */
  icon?: ReactNode;
  /** Shortcut hint shown at the end. Display only. */
  shortcut?: string;
  /** Runs when chosen. The palette closes afterwards. */
  onSelect: () => void;
}

export interface CommandPaletteProps {
  /** All commands, in display order. */
  commands: Command[];
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
   * A global shortcut that opens it: `"mod+k"` means ⌘K on macOS and Ctrl+K
   * elsewhere. `false` for none.
   * @default "mod+k"
   */
  hotkey?: string | false;
  /**
   * Placeholder of the search field.
   * @default "Type a command or search…"
   */
  placeholder?: string;
  /**
   * Shown when nothing matches.
   * @default "No results"
   */
  emptyText?: ReactNode;
  /**
   * Accessible name of the dialog.
   * @default "Command palette"
   */
  label?: string;
}

function matches(c: Command, q: string) {
  if (!q) return true;
  const hay = [c.label, c.group, ...(c.keywords ?? [])].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

function useHotkey(hotkey: string | false, onPress: () => void) {
  const cb = useRef(onPress);
  cb.current = onPress;
  useEffect(() => {
    if (!hotkey) return;
    const parts = hotkey.toLowerCase().split("+");
    const key = parts.pop();
    const onKey = (e: globalThis.KeyboardEvent) => {
      const mac = /mac|iphone|ipad/i.test(navigator.platform);
      const mod = parts.includes("mod") ? (mac ? e.metaKey : e.ctrlKey) : true;
      const shift = parts.includes("shift") === e.shiftKey;
      if (mod && shift && e.key.toLowerCase() === key) {
        e.preventDefault();
        cb.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);
}

/**
 * A searchable list of commands in a modal (⌘K). Typing filters by label,
 * group and keywords (all words must match); arrows move, Enter runs, Escape
 * closes. Focus stays in the search field (`aria-activedescendant`).
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   commands={[
 *     { id: "theme", label: "Switch to light theme", group: "Actions", shortcut: "⌘ L", onSelect: toggleTheme },
 *     { id: "button", label: "Pixel button", group: "Components", onSelect: () => go("/button") },
 *   ]}
 * />
 * ```
 */
export function CommandPalette({
  commands,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  hotkey = "mod+k",
  placeholder = "Type a command or search…",
  emptyText = "No results",
  label = "Command palette",
}: CommandPaletteProps) {
  const id = useId();
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  useHotkey(hotkey, () => setOpen(!open));
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);
  const shown = useMemo(
    () => commands.filter((c) => matches(c, query)),
    [commands, query],
  );
  useEffect(() => {
    if (open)
      document.getElementById(`${id}-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [open, active, id]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    setOpen(false);
    c.onSelect();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const n = shown.length;
    if (!n) return;
    if (e.key === "ArrowDown") setActive((a) => (a + 1) % n);
    else if (e.key === "ArrowUp") setActive((a) => (a - 1 + n) % n);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(n - 1);
    else if (e.key === "Enter") run(shown[active]);
    else return;
    e.preventDefault();
  };

  let lastGroup: string | undefined;
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      aria-label={label}
      closeButton={false}
      className="pa-command [&>div]:w-[min(36rem,calc(100vw-2rem))] [&>div]:gap-0 [&>div]:p-0"
    >
      <div className="flex items-center gap-2.5 border-b border-pa-border px-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-[1.125rem] shrink-0 text-pa-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={shown[active] ? `${id}-${active}` : undefined}
          aria-label={label}
          autoComplete="off"
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="h-[3.25rem] min-w-0 flex-1 bg-transparent text-[0.9375rem] text-pa-text outline-none placeholder:text-pa-muted"
        />
        <kbd className="rounded-[3px] border border-b-2 border-pa-border-strong px-1.5 py-0.5 font-pa-mono text-[0.625rem] text-pa-muted">
          esc
        </kbd>
      </div>
      <div
        id={`${id}-list`}
        role="listbox"
        aria-label={label}
        className="max-h-[min(22rem,60vh)] overflow-auto p-1.5"
      >
        {shown.length === 0 && (
          <div className="px-3 py-6 text-center text-[0.8125rem] text-pa-muted">
            {emptyText}
          </div>
        )}
        {shown.map((c, i) => {
          const heading = c.group && c.group !== lastGroup ? c.group : null;
          lastGroup = c.group;
          return (
            <div key={c.id}>
              {heading && (
                <div className="px-2.5 pt-2.5 pb-1 font-pa-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-pa-muted">
                  {heading}
                </div>
              )}
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled by the search field */}
              <div
                id={`${id}-${i}`}
                role="option"
                aria-selected={i === active}
                data-highlighted={i === active ? "" : undefined}
                onPointerMove={() => i !== active && setActive(i)}
                onClick={() => run(c)}
                tabIndex={-1}
                className={cx(
                  "pa-px-host flex h-10 cursor-pointer items-center gap-2.5 rounded-pa-xs px-2.5 text-sm [--px-fill:var(--pa-accent-subtle)] [--px-ink:var(--pa-text)] [&_svg]:size-4 [&_svg]:text-pa-muted",
                  "data-highlighted:before:absolute data-highlighted:before:inset-y-2.5 data-highlighted:before:start-0 data-highlighted:before:w-0.5 data-highlighted:before:bg-pa-accent",
                )}
              >
                <Pixels />
                {c.icon}
                <span className="truncate">{c.label}</span>
                {c.shortcut && (
                  <kbd className="ms-auto rounded-[3px] border border-b-2 border-pa-border-strong px-1.5 py-0.5 font-pa-mono text-[0.625rem] text-pa-muted">
                    {c.shortcut}
                  </kbd>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
}
