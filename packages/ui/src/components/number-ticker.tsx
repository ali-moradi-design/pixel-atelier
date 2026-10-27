"use client";

import { cx } from "class-variance-authority";
import { type HTMLAttributes, useEffect, useMemo, useRef } from "react";
import { useInView } from "../lib/motion.ts";

export interface NumberTickerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The number to show. Changing it rolls the digits to the new value. */
  value: number;
  /**
   * `Intl.NumberFormat` options, e.g. `{ notation: "compact" }` for "12.8K"
   * or `{ style: "currency", currency: "EUR" }`.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * Locale for formatting.
   * @default the browser's locale
   */
  locale?: string;
  /**
   * Roll in from zero when it first scrolls into view.
   * @default true
   */
  fromZero?: boolean;
}

/**
 * A number whose digits roll like a counter, in pixel steps. Each digit is a
 * CSS-transformed column (no JavaScript animation); screen readers read the
 * formatted value once. Reduced motion shows the value without rolling.
 *
 * @example
 * ```tsx
 * <NumberTicker value={128000} format={{ notation: "compact" }} className="text-6xl font-light" />
 * ```
 */
export function NumberTicker({
  value,
  format,
  locale,
  fromZero = true,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const fmt = useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const text = fmt.format(value);
  const shown = !fromZero || inView;
  // Each column steps exactly once per digit it travels, so it never stops
  // between two digits.
  const prev = useRef<string>("");
  const before = prev.current;
  useEffect(() => {
    if (shown) prev.current = text;
  });
  return (
    <span ref={ref} className={cx("inline-flex tabular-nums", className)} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {[...text].map((ch, i) => {
          const d = Number.parseInt(ch, 10);
          if (Number.isNaN(d))
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: positions are stable
              <span key={i}>{ch}</span>
            );
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: positions are stable
            <span key={i} className="inline-block h-[1lh] overflow-hidden">
              <span
                className="pb-ticker-col flex flex-col"
                style={{
                  translate: `0 -${(shown ? d : 0) * 10}%`,
                  transitionTimingFunction: `steps(${Math.max(1, Math.abs(d - (Number.parseInt(before[i] ?? "0", 10) || 0)))}, end)`,
                }}
              >
                {"0123456789".split("").map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
