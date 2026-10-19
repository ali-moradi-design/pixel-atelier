"use client";

import { cx } from "class-variance-authority";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { showPopover } from "../lib/anchor.ts";
import { XIcon } from "../lib/icons.tsx";

/** What `toast()` accepts. */
export interface ToastOptions {
  /** The main line. */
  title: ReactNode;
  /** A second, quieter line. */
  description?: ReactNode;
  /**
   * Color of the icon square and the lifetime bar.
   * @default "default"
   */
  variant?: "default" | "success" | "warning" | "danger" | "info";
  /** A single action, e.g. `{ label: "Undo", onClick: undo }`. */
  action?: { label: string; onClick: () => void };
  /**
   * Milliseconds before it hides itself; `Infinity` keeps it until closed.
   * Paused while hovered or focused.
   * @default 5000
   */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

// A tiny store: a list of toasts and its listeners. No context, so `toast()`
// can be called from anywhere (event handlers, async code).
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

/**
 * Shows a toast and returns its id. Needs one `<Toaster />` mounted in the
 * app.
 *
 * @example
 * ```tsx
 * toast({ title: "Copied to clipboard", variant: "success" });
 * toast({ title: "Upload failed", description: "The file is over 5 MB.", variant: "danger", action: { label: "Retry", onClick: retry } });
 * ```
 */
export function toast(options: ToastOptions) {
  const id = nextId++;
  items = [...items, { id, ...options }];
  emit();
  return id;
}

/** Hides a toast by id (or all toasts without an id). */
export function dismissToast(id?: number) {
  items = id === undefined ? [] : items.filter((t) => t.id !== id);
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getItems = () => items;
const noItems: ToastItem[] = [];

export interface ToasterProps {
  /**
   * Corner where toasts stack. `start`/`end` follow the text direction.
   * @default "bottom-end"
   */
  position?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  /**
   * Most toasts visible at once; older ones are hidden first.
   * @default 3
   */
  max?: number;
}

/**
 * The place where toasts appear. Mount it once, near the root of the app.
 * It is a polite live region, so screen readers announce new toasts without
 * interrupting, and it sits in the top layer (above open dialogs).
 *
 * @example
 * ```tsx
 * <Toaster position="bottom-end" />
 * ```
 */
export function Toaster({ position = "bottom-end", max = 3 }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, getItems, () => noItems).slice(-max);
  const region = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (list.length) showPopover(region.current);
  }, [list.length]);
  const [v, h] = position.split("-");
  return (
    <ol
      ref={region}
      aria-live="polite"
      aria-label="Notifications"
      className={cx(
        "pa-toaster fixed m-0 w-[min(24rem,calc(100vw-2rem))] gap-2 border-0 bg-transparent p-0",
        list.length ? "flex" : "hidden",
        v === "top" ? "top-4 bottom-auto flex-col" : "top-auto bottom-4 flex-col-reverse",
        h === "end" ? "end-4 start-auto" : "start-4 end-auto",
      )}
    >
      {list.map((t) => (
        <ToastView key={t.id} item={t} />
      ))}
    </ol>
  );
}

const tone = {
  default: "var(--pa-accent)",
  success: "var(--pa-success)",
  warning: "var(--pa-warning)",
  danger: "var(--pa-danger)",
  info: "var(--pa-info)",
};

function ToastView({ item }: { item: ToastItem }) {
  const { id, title, description, variant = "default", action, duration = 5000 } = item;
  const bar = useRef<HTMLSpanElement>(null);
  const left = useRef(duration);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const started = useRef(0);
  const finite = Number.isFinite(duration);
  const resume = () => {
    if (!finite) return;
    started.current = Date.now();
    timer.current = setTimeout(() => dismissToast(id), left.current);
    bar.current?.style.setProperty("animation-play-state", "running");
  };
  const pause = () => {
    if (!finite) return;
    clearTimeout(timer.current);
    left.current -= Date.now() - started.current;
    bar.current?.style.setProperty("animation-play-state", "paused");
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: start the timer once per toast
  useEffect(() => {
    resume();
    return () => clearTimeout(timer.current);
  }, []);
  return (
    <li
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={resume}
      style={{ "--pa-tone": tone[variant] } as CSSProperties}
      className="pa-toast relative flex items-start gap-3 overflow-hidden rounded-pa-md border border-pa-border bg-pa-overlay py-3.5 ps-4 pe-3 text-[0.8125rem] text-pa-text shadow-pa-2"
    >
      <span
        aria-hidden="true"
        className="mt-[0.3125rem] size-2 shrink-0 bg-(--pa-tone)"
      />
      <div className="grid min-w-0 flex-1 gap-0.5">
        <div className="font-medium">{title}</div>
        {description && <div className="text-pa-muted">{description}</div>}
      </div>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            dismissToast(id);
          }}
          className="shrink-0 cursor-pointer rounded-pa-xs border border-pa-border-strong px-2.5 py-1.5 font-medium text-[0.6875rem] uppercase tracking-[0.06em] outline-none hover:bg-pa-raised focus-visible:outline-2 focus-visible:outline-pa-accent"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => dismissToast(id)}
        className="inline-grid size-6 shrink-0 cursor-pointer place-items-center rounded-pa-xs text-pa-muted outline-none hover:bg-pa-raised hover:text-pa-text focus-visible:outline-2 focus-visible:outline-pa-accent"
      >
        <XIcon width={14} height={14} />
      </button>
      {finite && (
        <span
          ref={bar}
          aria-hidden="true"
          className="pa-toast-life absolute start-0 bottom-0 h-0.5 w-full"
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </li>
  );
}
