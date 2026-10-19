"use client";

import { cx } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { useControllable } from "../lib/use-controllable.ts";

interface TabsState {
  id: string;
  value: string;
  setValue: (v: string) => void;
  variant: "underline" | "segmented";
  keepMounted: boolean;
  /** Values that have a TabPanel, so tabs only point at panels that exist. */
  panels: Set<string>;
  setPanels: (fn: (s: Set<string>) => Set<string>) => void;
}
const TabsContext = createContext<TabsState | null>(null);
function useTabs(part: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${part}> must be inside <Tabs>`);
  return ctx;
}
const slug = (v: string) => v.replace(/[^\w-]/g, "_");

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  /** The active tab's value (controlled). */
  value?: string;
  /** The tab active at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the value of the tab the user activated. */
  onValueChange?: (value: string) => void;
  /**
   * Look of the tab list.
   * - `"underline"`: text tabs over a hairline; the active one gets a pixel
   *   dashed accent line.
   * - `"segmented"`: a compact switch of options in a frame.
   * @default "underline"
   */
  variant?: "underline" | "segmented";
  /**
   * Keep inactive panels in the DOM (hidden) to preserve their state. By
   * default only the active panel is rendered.
   * @default false
   */
  keepMounted?: boolean;
  /** `TabList` and `TabPanel`s. */
  children: ReactNode;
}

/**
 * Switch between views in the same place. Follows the ARIA tabs pattern:
 * one tab stop, arrows (and Home/End) move and activate, panels are linked
 * to their tabs.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="preview">
 *   <TabList aria-label="Example">
 *     <Tab value="preview">Preview</Tab>
 *     <Tab value="code">Code</Tab>
 *   </TabList>
 *   <TabPanel value="preview">…</TabPanel>
 *   <TabPanel value="code">…</TabPanel>
 * </Tabs>
 * ```
 */
export function Tabs({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  variant = "underline",
  keepMounted = false,
  className,
  children,
  ...props
}: TabsProps) {
  const id = useId();
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [panels, setPanels] = useState<Set<string>>(() => new Set());
  return (
    <TabsContext.Provider
      value={{ id, value, setValue, variant, keepMounted, panels, setPanels }}
    >
      <div className={cx("grid gap-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** The `Tab`s. Name the list with `aria-label` when there is no heading. */
  children: ReactNode;
}

/** The row of tabs. Handles arrow-key navigation between them. */
export function TabList({ className, children, onKeyDown, ...props }: TabListProps) {
  const { variant } = useTabs("TabList");
  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (e.defaultPrevented || !keys.includes(e.key)) return;
    const tabs = [
      ...e.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    ];
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const fwd = (e.key === "ArrowRight") !== rtl ? 1 : -1;
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? tabs.length - 1
          : (i + fwd + tabs.length) % tabs.length;
    e.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };
  return (
    <div
      role="tablist"
      onKeyDown={move}
      className={cx(
        variant === "underline"
          ? "flex gap-6 border-b border-pa-border"
          : "inline-flex w-fit gap-0.5 rounded-pa-sm border border-pa-border bg-pa-bg p-[3px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Identifies the tab and its `TabPanel`. */
  value: string;
}

/** One tab. Activating it shows the `TabPanel` with the same `value`. */
export function Tab({ value, className, onClick, ...props }: TabProps) {
  const ctx = useTabs("Tab");
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.id}-tab-${slug(value)}`}
      aria-selected={selected}
      aria-controls={ctx.panels.has(value) ? `${ctx.id}-panel-${slug(value)}` : undefined}
      tabIndex={selected ? 0 : -1}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.setValue(value);
      }}
      className={cx(
        "relative cursor-pointer whitespace-nowrap text-sm text-pa-muted outline-none transition-colors duration-pa-fast hover:text-pa-text aria-selected:text-pa-text",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pa-accent disabled:cursor-not-allowed disabled:opacity-40",
        ctx.variant === "underline"
          ? "pa-tab py-2.5"
          : "rounded-[2px] px-3 py-1.5 text-[0.8125rem] aria-selected:bg-pa-raised aria-selected:shadow-pa-1",
        className,
      )}
      {...props}
    />
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** The `Tab` value this panel belongs to. */
  value: string;
}

/** The content shown while its `Tab` is active. */
export function TabPanel({ value, className, ...props }: TabPanelProps) {
  const ctx = useTabs("TabPanel");
  const { setPanels } = ctx;
  useEffect(() => {
    setPanels((s) => new Set(s).add(value));
    return () =>
      setPanels((s) => {
        const n = new Set(s);
        n.delete(value);
        return n;
      });
  }, [setPanels, value]);
  const selected = ctx.value === value;
  if (!selected && !ctx.keepMounted) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.id}-panel-${slug(value)}`}
      aria-labelledby={`${ctx.id}-tab-${slug(value)}`}
      hidden={!selected}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: ARIA tabs pattern: the panel is a tab stop when it has no focusable content
      tabIndex={0}
      className={cx(
        "rounded-pa-xs outline-none focus-visible:outline-2 focus-visible:outline-pa-accent",
        className,
      )}
      {...props}
    />
  );
}
